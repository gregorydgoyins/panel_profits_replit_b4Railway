/**
 * Fact Verification Service
 * 
 * Validates entity facts across multiple sources using consensus validation.
 * Assigns confidence scores based on source agreement and reliability.
 */

import type { EntityData } from './BaseEntityScraper';

export interface VerifiedFact<T = any> {
  value: T;
  confidence: number; // 0-1 score
  sourceCount: number; // How many sources agree
  isConsensus: boolean; // Met consensus threshold
  sources: string[]; // Which sources provided this fact
  conflicts?: T[]; // Conflicting values if any
}

export interface FactConflict<T = any> {
  fact: string;
  values: Array<{
    value: T;
    sources: string[];
    reliability: number;
  }>;
}

export interface VerificationResult {
  entityId: string;
  entityName: string;
  firstAppearance: VerifiedFact<EntityData['firstAppearance']> | null;
  attributes: VerifiedFact<EntityData['attributes']>[];
  relationships: VerifiedFact<EntityData['relationships']>[];
  overallConfidence: number; // Aggregate confidence score
  hasConflicts: boolean;
  conflicts: FactConflict[];
}

export class FactVerificationService {
  private consensusThreshold: number;
  
  constructor(consensusThreshold: number = 3) {
    this.consensusThreshold = consensusThreshold;
  }
  
  /**
   * Verify entity facts across multiple sources
   */
  verifyEntity(sourceDataList: EntityData[]): VerificationResult {
    if (sourceDataList.length === 0) {
      throw new Error('No source data provided for verification');
    }
    
    const base = sourceDataList[0];
    const conflicts: FactConflict[] = [];
    
    // Verify first appearance
    const firstAppearance = this.verifyFirstAppearance(sourceDataList, conflicts);
    
    // Verify attributes
    const attributes = this.verifyAttributes(sourceDataList, conflicts);
    
    // Verify relationships
    const relationships = this.verifyRelationships(sourceDataList, conflicts);
    
    // Calculate overall confidence
    const confidenceScores = [
      firstAppearance?.confidence || 0,
      ...attributes.map(a => a.confidence),
      ...relationships.map(r => r.confidence),
    ].filter(s => s > 0);
    
    const overallConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0;
    
    return {
      entityId: base.entityId,
      entityName: base.entityName,
      firstAppearance,
      attributes,
      relationships,
      overallConfidence,
      hasConflicts: conflicts.length > 0,
      conflicts,
    };
  }
  
  /**
   * Verify first appearance across sources
   */
  private verifyFirstAppearance(
    sourceDataList: EntityData[],
    conflicts: FactConflict[]
  ): VerifiedFact<EntityData['firstAppearance']> | null {
    const firstAppearances = sourceDataList
      .map(sd => ({
        value: sd.firstAppearance,
        source: sd.sourceData?.sourceName || 'unknown',
        reliability: sd.sourceData?.sourceReliability || 0.8,
      }))
      .filter(fa => fa.value);
    
    if (firstAppearances.length === 0) return null;
    
    // Group by comic title (normalized)
    const grouped = this.groupByKey(
      firstAppearances,
      fa => fa.value ? this.normalizeComicTitle(fa.value.comicTitle) : 'unknown'
    );
    
    // Find consensus group (most sources agree)
    const consensusGroup = Array.from(grouped.entries())
      .sort((a, b) => b[1].length - a[1].length)[0];
    
    const sourceCount = consensusGroup[1].length;
    const isConsensus = sourceCount >= this.consensusThreshold;
    const sources = consensusGroup[1].map(fa => fa.source);
    
    // Calculate confidence based on BOTH source count AND reliability
    const avgReliability = consensusGroup[1]
      .reduce((sum, fa) => sum + fa.reliability, 0) / sourceCount;
    
    // Weight by source count: (sourceCount / threshold) capped at 1.0
    const sourceCountWeight = Math.min(1, sourceCount / this.consensusThreshold);
    
    // Final confidence: reliability × source weight (0-1 scale)
    const confidence = avgReliability * sourceCountWeight;
    
    // Check for conflicts
    if (grouped.size > 1) {
      conflicts.push({
        fact: 'firstAppearance',
        values: Array.from(grouped.values()).map(group => ({
          value: group[0]?.value?.comicTitle || 'unknown',
          sources: group.map(fa => fa.source),
          reliability: group.reduce((sum, fa) => sum + fa.reliability, 0) / group.length,
        })),
      });
    }
    
    // Use most complete first appearance from consensus group
    const mostComplete = consensusGroup[1]
      .sort((a, b) => {
        const aComplete = (a.value?.coverUrl ? 1 : 0) + (a.value?.issue ? 1 : 0);
        const bComplete = (b.value?.coverUrl ? 1 : 0) + (b.value?.issue ? 1 : 0);
        return bComplete - aComplete;
      })[0].value;
    
    return {
      value: mostComplete,
      confidence,
      sourceCount,
      isConsensus,
      sources,
    };
  }
  
  /**
   * Verify attributes across sources
   */
  private verifyAttributes(
    sourceDataList: EntityData[],
    conflicts: FactConflict[]
  ): VerifiedFact<EntityData['attributes']>[] {
    // Flatten all attributes with source info
    const allAttributes = sourceDataList.flatMap(sd =>
      (sd.attributes || []).map(attr => ({
        value: attr,
        source: sd.sourceData?.sourceName || 'unknown',
        reliability: sd.sourceData?.sourceReliability || 0.8,
      }))
    );
    
    if (allAttributes.length === 0) return [];
    
    // Group by normalized attribute name
    const grouped = this.groupByKey(
      allAttributes,
      attr => this.normalizeAttributeName(attr.value.name)
    );
    
    const verified: VerifiedFact<EntityData['attributes']>[] = [];
    
    for (const [key, group] of grouped.entries()) {
      // Check for value conflicts by comparing ALL significant fields
      const uniqueVariants = group.map(a => ({
        description: a.value.description || '',
        level: a.value.level || '',
        isActive: a.value.isActive ?? true,
        originType: a.value.originType || '',
        source: a.source,
        reliability: a.reliability,
        fullValue: a.value,
      }));
      
      // Create hash for each variant to detect duplicates
      const variantHashes = uniqueVariants.map(v => 
        `${v.description}|${v.level}|${v.isActive}|${v.originType}`
      );
      const uniqueHashes = [...new Set(variantHashes)];
      
      if (uniqueHashes.length > 1) {
        conflicts.push({
          fact: `attribute:${key}`,
          values: uniqueHashes.map(hash => {
            const matchingVariants = uniqueVariants.filter((v, i) => variantHashes[i] === hash);
            return {
              value: matchingVariants[0].fullValue,
              sources: matchingVariants.map(v => v.source),
              reliability: matchingVariants.reduce((sum, v) => sum + v.reliability, 0) / matchingVariants.length,
            };
          }),
        });
      }
      
      // Use most complete value from most common variant
      const variantCounts = uniqueHashes.map(hash => ({
        hash,
        count: variantHashes.filter(h => h === hash).length,
        variants: uniqueVariants.filter((v, i) => variantHashes[i] === hash),
      }));
      const mostCommonVariant = variantCounts.sort((a, b) => b.count - a.count)[0];
      
      // Calculate confidence based ONLY on consensus variant sources (not all sources)
      const consensusVariants = mostCommonVariant.variants;
      const sourceCount = consensusVariants.length;
      const isConsensus = sourceCount >= this.consensusThreshold;
      const sources = consensusVariants.map(v => v.source);
      
      const avgReliability = consensusVariants.reduce((sum, v) => sum + v.reliability, 0) / sourceCount;
      const sourceCountWeight = Math.min(1, sourceCount / this.consensusThreshold);
      const confidence = avgReliability * sourceCountWeight;
      
      // Pick most complete from consensus variant
      const verifiedAttr = consensusVariants
        .sort((a, b) => {
          const aComplete = (a.description ? 1 : 0) + (a.level ? 1 : 0) + (a.originType ? 1 : 0);
          const bComplete = (b.description ? 1 : 0) + (b.level ? 1 : 0) + (b.originType ? 1 : 0);
          return bComplete - aComplete;
        })[0].fullValue;
      if (verifiedAttr) {
        verified.push({
          value: [verifiedAttr],
          confidence,
          sourceCount,
          isConsensus,
          sources,
        });
      }
    }
    
    return verified;
  }
  
  /**
   * Verify relationships across sources
   */
  private verifyRelationships(
    sourceDataList: EntityData[],
    conflicts: FactConflict[]
  ): VerifiedFact<EntityData['relationships']>[] {
    const allRelationships = sourceDataList.flatMap(sd =>
      (sd.relationships || []).map(rel => ({
        value: rel,
        source: sd.sourceData?.sourceName || 'unknown',
        reliability: sd.sourceData?.sourceReliability || 0.8,
      }))
    );
    
    if (allRelationships.length === 0) return [];
    
    // Group by relationship key (type + target)
    const grouped = this.groupByKey(
      allRelationships,
      rel => `${rel.value.relationshipType}:${this.normalizeEntityName(rel.value.targetEntityName)}`
    );
    
    const verified: VerifiedFact<EntityData['relationships']>[] = [];
    
    for (const [key, group] of grouped.entries()) {
      // Check for conflicts by comparing ALL relationship fields
      const uniqueVariants = group.map(r => ({
        relationshipType: r.value.relationshipType,
        targetEntityName: r.value.targetEntityName,
        relationshipSubtype: r.value.relationshipSubtype || '',
        strength: r.value.strength || 0,
        isActive: r.value.isActive ?? true,
        source: r.source,
        reliability: r.reliability,
        fullValue: r.value,
      }));
      
      // Create hash for each variant to detect duplicates
      const variantHashes = uniqueVariants.map(v => 
        `${v.relationshipType}|${v.targetEntityName}|${v.relationshipSubtype}|${v.strength}|${v.isActive}`
      );
      const uniqueHashes = [...new Set(variantHashes)];
      
      if (uniqueHashes.length > 1) {
        conflicts.push({
          fact: `relationship:${key}`,
          values: uniqueHashes.map(hash => {
            const matchingVariants = uniqueVariants.filter((v, i) => variantHashes[i] === hash);
            return {
              value: matchingVariants[0].fullValue,
              sources: matchingVariants.map(v => v.source),
              reliability: matchingVariants.reduce((sum, v) => sum + v.reliability, 0) / matchingVariants.length,
            };
          }),
        });
      }
      
      // Use most complete value from most common variant
      const variantCounts = uniqueHashes.map(hash => ({
        hash,
        count: variantHashes.filter(h => h === hash).length,
        variants: uniqueVariants.filter((v, i) => variantHashes[i] === hash),
      }));
      const mostCommonVariant = variantCounts.sort((a, b) => b.count - a.count)[0];
      
      // Calculate confidence based ONLY on consensus variant sources (not all sources)
      const consensusVariants = mostCommonVariant.variants;
      const sourceCount = consensusVariants.length;
      const isConsensus = sourceCount >= this.consensusThreshold;
      const sources = consensusVariants.map(v => v.source);
      
      const avgReliability = consensusVariants.reduce((sum, v) => sum + v.reliability, 0) / sourceCount;
      const sourceCountWeight = Math.min(1, sourceCount / this.consensusThreshold);
      const confidence = avgReliability * sourceCountWeight;
      
      // Pick most complete from consensus variant
      const verifiedRel = consensusVariants
        .sort((a, b) => {
          const aComplete = (a.relationshipSubtype ? 1 : 0) + (a.strength > 0 ? 1 : 0);
          const bComplete = (b.relationshipSubtype ? 1 : 0) + (b.strength > 0 ? 1 : 0);
          return bComplete - aComplete;
        })[0].fullValue;
      
      verified.push({
        value: [verifiedRel],
        confidence,
        sourceCount,
        isConsensus,
        sources,
      });
    }
    
    return verified;
  }
  
  /**
   * Group items by a key function
   */
  private groupByKey<T>(
    items: T[],
    keyFn: (item: T) => string
  ): Map<string, T[]> {
    const groups = new Map<string, T[]>();
    
    for (const item of items) {
      const key = keyFn(item);
      const group = groups.get(key) || [];
      group.push(item);
      groups.set(key, group);
    }
    
    return groups;
  }
  
  /**
   * Normalize comic title for comparison
   */
  private normalizeComicTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }
  
  /**
   * Normalize attribute name for comparison
   */
  private normalizeAttributeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }
  
  /**
   * Normalize entity name for comparison
   */
  private normalizeEntityName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }
  
  /**
   * Filter verified facts by minimum confidence
   */
  filterByConfidence(
    result: VerificationResult,
    minConfidence: number = 0.7
  ): VerificationResult {
    return {
      ...result,
      firstAppearance: result.firstAppearance && result.firstAppearance.confidence >= minConfidence
        ? result.firstAppearance
        : null,
      attributes: result.attributes.filter(a => a.confidence >= minConfidence),
      relationships: result.relationships.filter(r => r.confidence >= minConfidence),
    };
  }
}

// Singleton instance
export const factVerificationService = new FactVerificationService(3);
