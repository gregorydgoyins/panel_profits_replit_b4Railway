import { IdeaNode, IdeaRelationship, IdeaNetwork, NetworkAnalysis, RelationshipType, RelationshipStrength, RelationshipDirection } from '../types';

// Mock data for demonstration
const mockIdeaNodes: IdeaNode[] = [
  {
    id: 'node-1',
    label: 'AI Trading Bot',
    description: 'Develop an intelligent trading bot that uses machine learning to analyze market patterns and execute trades automatically.',
    category: 'technology',
    tags: ['AI', 'trading', 'automation'],
    position: { x: 100, y: 100 },
    value: 500000,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01')
  },
  {
    id: 'node-2',
    label: 'Market Data API',
    description: 'Build a robust API that provides real-time market data and historical price information.',
    category: 'technology',
    tags: ['API', 'data', 'infrastructure'],
    position: { x: 300, y: 150 },
    value: 250000,
    createdAt: new Date('2024-05-02'),
    updatedAt: new Date('2024-05-02')
  },
  {
    id: 'node-3',
    label: 'Risk Management System',
    description: 'Implement comprehensive risk management tools to protect user portfolios.',
    category: 'finance',
    tags: ['risk', 'portfolio', 'protection'],
    position: { x: 200, y: 300 },
    value: 350000,
    createdAt: new Date('2024-05-03'),
    updatedAt: new Date('2024-05-03')
  },
  {
    id: 'node-4',
    label: 'User Authentication',
    description: 'Secure user authentication system with multi-factor authentication support.',
    category: 'security',
    tags: ['auth', 'security', 'users'],
    position: { x: 400, y: 200 },
    value: 150000,
    createdAt: new Date('2024-05-04'),
    updatedAt: new Date('2024-05-04')
  },
  {
    id: 'node-5',
    label: 'Mobile App',
    description: 'Native mobile application for iOS and Android platforms.',
    category: 'technology',
    tags: ['mobile', 'app', 'cross-platform'],
    position: { x: 150, y: 450 },
    value: 400000,
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date('2024-05-05')
  }
];

const mockRelationships: IdeaRelationship[] = [
  {
    id: 'rel-1',
    sourceId: 'node-1',
    targetId: 'node-2',
    type: 'depends-on',
    strength: 'strong',
    direction: 'unidirectional',
    weight: 0.9,
    description: 'Trading bot requires market data to function',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01')
  },
  {
    id: 'rel-2',
    sourceId: 'node-1',
    targetId: 'node-3',
    type: 'enables',
    strength: 'moderate',
    direction: 'unidirectional',
    weight: 0.7,
    description: 'Trading bot enables automated risk management',
    createdAt: new Date('2024-05-02'),
    updatedAt: new Date('2024-05-02')
  },
  {
    id: 'rel-3',
    sourceId: 'node-2',
    targetId: 'node-4',
    type: 'depends-on',
    strength: 'strong',
    direction: 'unidirectional',
    weight: 0.8,
    description: 'API requires authentication for secure access',
    createdAt: new Date('2024-05-03'),
    updatedAt: new Date('2024-05-03')
  },
  {
    id: 'rel-4',
    sourceId: 'node-5',
    targetId: 'node-2',
    type: 'depends-on',
    strength: 'strong',
    direction: 'unidirectional',
    weight: 0.85,
    description: 'Mobile app needs API for data access',
    createdAt: new Date('2024-05-04'),
    updatedAt: new Date('2024-05-04')
  },
  {
    id: 'rel-5',
    sourceId: 'node-3',
    targetId: 'node-5',
    type: 'related-to',
    strength: 'moderate',
    direction: 'bidirectional',
    weight: 0.6,
    description: 'Risk management features should be available on mobile',
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date('2024-05-05')
  }
];

export class IdeaMappingService {
  private static instance: IdeaMappingService;
  private nodes: IdeaNode[] = [...mockIdeaNodes];
  private relationships: IdeaRelationship[] = [...mockRelationships];
  private storageKey = 'panel-profits-idea-network';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): IdeaMappingService {
    if (!IdeaMappingService.instance) {
      IdeaMappingService.instance = new IdeaMappingService();
    }
    return IdeaMappingService.instance;
  }

  // Node Management
  public getAllNodes(): IdeaNode[] {
    return [...this.nodes];
  }

  public getNode(id: string): IdeaNode | undefined {
    return this.nodes.find(node => node.id === id);
  }

  public createNode(nodeData: Omit<IdeaNode, 'id' | 'createdAt' | 'updatedAt'>): IdeaNode {
    const newNode: IdeaNode = {
      ...nodeData,
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.nodes.push(newNode);
    this.saveToStorage();
    return newNode;
  }

  public updateNode(id: string, updates: Partial<Omit<IdeaNode, 'id' | 'createdAt'>>): IdeaNode | null {
    const nodeIndex = this.nodes.findIndex(node => node.id === id);
    if (nodeIndex === -1) return null;

    this.nodes[nodeIndex] = {
      ...this.nodes[nodeIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveToStorage();
    return this.nodes[nodeIndex];
  }

  public deleteNode(id: string): boolean {
    const nodeIndex = this.nodes.findIndex(node => node.id === id);
    if (nodeIndex === -1) return false;

    // Remove the node
    this.nodes.splice(nodeIndex, 1);
    
    // Remove all relationships involving this node
    this.relationships = this.relationships.filter(
      rel => rel.sourceId !== id && rel.targetId !== id
    );
    
    this.saveToStorage();
    return true;
  }

  // Relationship Management
  public getAllRelationships(): IdeaRelationship[] {
    return [...this.relationships];
  }

  public getRelationship(id: string): IdeaRelationship | undefined {
    return this.relationships.find(rel => rel.id === id);
  }

  public getNodeRelationships(nodeId: string): IdeaRelationship[] {
    return this.relationships.filter(
      rel => rel.sourceId === nodeId || rel.targetId === nodeId
    );
  }

  public createRelationship(relationshipData: Omit<IdeaRelationship, 'id' | 'createdAt' | 'updatedAt'>): IdeaRelationship {
    // Check if relationship already exists
    const existingRel = this.relationships.find(
      rel => (rel.sourceId === relationshipData.sourceId && rel.targetId === relationshipData.targetId) ||
             (rel.direction === 'bidirectional' && rel.sourceId === relationshipData.targetId && rel.targetId === relationshipData.sourceId)
    );
    
    if (existingRel) {
      throw new Error('Relationship already exists between these nodes');
    }

    const newRelationship: IdeaRelationship = {
      ...relationshipData,
      id: `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.relationships.push(newRelationship);
    this.saveToStorage();
    return newRelationship;
  }

  public updateRelationship(id: string, updates: Partial<Omit<IdeaRelationship, 'id' | 'createdAt'>>): IdeaRelationship | null {
    const relIndex = this.relationships.findIndex(rel => rel.id === id);
    if (relIndex === -1) return null;

    this.relationships[relIndex] = {
      ...this.relationships[relIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveToStorage();
    return this.relationships[relIndex];
  }

  public deleteRelationship(id: string): boolean {
    const relIndex = this.relationships.findIndex(rel => rel.id === id);
    if (relIndex === -1) return false;

    this.relationships.splice(relIndex, 1);
    this.saveToStorage();
    return true;
  }

  // Network Analysis
  public getNetwork(): IdeaNetwork {
    const totalNodes = this.nodes.length;
    const totalRelationships = this.relationships.length;
    const averageConnections = totalNodes > 0 ? (totalRelationships * 2) / totalNodes : 0;
    
    // Find most connected node
    const connectionCounts = this.nodes.map(node => ({
      id: node.id,
      count: this.getNodeRelationships(node.id).length
    }));
    
    const mostConnected = connectionCounts.reduce((max, current) => 
      current.count > max.count ? current : max, 
      { id: '', count: 0 }
    );

    // Generate critical paths (simplified)
    const criticalPaths = this.findCriticalPaths();

    return {
      nodes: this.nodes,
      relationships: this.relationships,
      metadata: {
        totalNodes,
        totalRelationships,
        averageConnections,
        mostConnectedNode: mostConnected.id,
        criticalPaths
      }
    };
  }

  public analyzeNetwork(): NetworkAnalysis {
    // Calculate centrality scores (simplified betweenness centrality)
    const centralityScores: Record<string, number> = {};
    this.nodes.forEach(node => {
      const connections = this.getNodeRelationships(node.id).length;
      centralityScores[node.id] = connections / Math.max(this.nodes.length - 1, 1);
    });

    // Find influential nodes
    const influentialNodes = this.nodes
      .map(node => ({
        nodeId: node.id,
        score: centralityScores[node.id],
        connections: this.getNodeRelationships(node.id).length
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Find dependency chains
    const dependencyChains = this.findDependencyChains();

    return {
      centralityScores,
      clusteringCoefficient: this.calculateClusteringCoefficient(),
      shortestPaths: this.calculateShortestPaths(),
      influentialNodes,
      dependencyChains
    };
  }

  // Search and Filter
  public searchNodes(query: string): IdeaNode[] {
    const lowercaseQuery = query.toLowerCase();
    return this.nodes.filter(node =>
      node.label.toLowerCase().includes(lowercaseQuery) ||
      node.description.toLowerCase().includes(lowercaseQuery) ||
      node.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  public filterNodesByCategory(category: string): IdeaNode[] {
    return this.nodes.filter(node => node.category === category);
  }

  public filterRelationshipsByType(type: RelationshipType): IdeaRelationship[] {
    return this.relationships.filter(rel => rel.type === type);
  }

  // Export functionality
  public exportNetwork(): string {
    return JSON.stringify({
      nodes: this.nodes,
      relationships: this.relationships,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  public importNetwork(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.nodes && parsed.relationships) {
        this.nodes = parsed.nodes;
        this.relationships = parsed.relationships;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Private helper methods
  private findCriticalPaths(): Array<{ path: string[]; strength: number }> {
    // Simplified critical path finding
    const paths: Array<{ path: string[]; strength: number }> = [];
    
    // Find dependency chains
    const dependencyRels = this.relationships.filter(rel => rel.type === 'depends-on');
    
    dependencyRels.forEach(rel => {
      const path = this.traceDependencyPath(rel.sourceId, new Set());
      if (path.length > 1) {
        const strength = this.calculatePathStrength(path);
        paths.push({ path, strength });
      }
    });

    return paths.sort((a, b) => b.strength - a.strength).slice(0, 5);
  }

  private traceDependencyPath(nodeId: string, visited: Set<string>): string[] {
    if (visited.has(nodeId)) return []; // Avoid cycles
    
    visited.add(nodeId);
    const dependencies = this.relationships.filter(
      rel => rel.targetId === nodeId && rel.type === 'depends-on'
    );

    if (dependencies.length === 0) {
      return [nodeId];
    }

    let longestPath = [nodeId];
    dependencies.forEach(dep => {
      const subPath = this.traceDependencyPath(dep.sourceId, new Set(visited));
      if (subPath.length > 0) {
        const fullPath = [...subPath, nodeId];
        if (fullPath.length > longestPath.length) {
          longestPath = fullPath;
        }
      }
    });

    return longestPath;
  }

  private calculatePathStrength(path: string[]): number {
    let totalStrength = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const rel = this.relationships.find(
        r => r.sourceId === path[i] && r.targetId === path[i + 1]
      );
      if (rel) {
        const strengthValue = rel.strength === 'strong' ? 3 : rel.strength === 'moderate' ? 2 : 1;
        totalStrength += strengthValue;
      }
    }
    return totalStrength / Math.max(path.length - 1, 1);
  }

  private findDependencyChains(): Array<{ chain: string[]; depth: number }> {
    const chains: Array<{ chain: string[]; depth: number }> = [];
    
    this.nodes.forEach(node => {
      const chain = this.traceDependencyPath(node.id, new Set());
      if (chain.length > 1) {
        chains.push({ chain, depth: chain.length });
      }
    });

    return chains.sort((a, b) => b.depth - a.depth).slice(0, 10);
  }

  private calculateClusteringCoefficient(): number {
    // Simplified clustering coefficient calculation
    let totalCoefficient = 0;
    let nodeCount = 0;

    this.nodes.forEach(node => {
      const neighbors = this.getNeighbors(node.id);
      if (neighbors.length < 2) return;

      let connections = 0;
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          if (this.areConnected(neighbors[i], neighbors[j])) {
            connections++;
          }
        }
      }

      const possibleConnections = (neighbors.length * (neighbors.length - 1)) / 2;
      totalCoefficient += connections / possibleConnections;
      nodeCount++;
    });

    return nodeCount > 0 ? totalCoefficient / nodeCount : 0;
  }

  private getNeighbors(nodeId: string): string[] {
    const neighbors = new Set<string>();
    
    this.relationships.forEach(rel => {
      if (rel.sourceId === nodeId) {
        neighbors.add(rel.targetId);
      }
      if (rel.targetId === nodeId) {
        neighbors.add(rel.sourceId);
      }
    });

    return Array.from(neighbors);
  }

  private areConnected(nodeId1: string, nodeId2: string): boolean {
    return this.relationships.some(rel =>
      (rel.sourceId === nodeId1 && rel.targetId === nodeId2) ||
      (rel.sourceId === nodeId2 && rel.targetId === nodeId1)
    );
  }

  private calculateShortestPaths(): Record<string, Record<string, string[]>> {
    // Simplified shortest path calculation using BFS
    const paths: Record<string, Record<string, string[]>> = {};
    
    this.nodes.forEach(startNode => {
      paths[startNode.id] = {};
      
      this.nodes.forEach(endNode => {
        if (startNode.id !== endNode.id) {
          const path = this.findShortestPath(startNode.id, endNode.id);
          paths[startNode.id][endNode.id] = path;
        }
      });
    });

    return paths;
  }

  private findShortestPath(startId: string, endId: string): string[] {
    const queue: Array<{ nodeId: string; path: string[] }> = [{ nodeId: startId, path: [startId] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (nodeId === endId) {
        return path;
      }

      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const neighbors = this.getNeighbors(nodeId);
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          queue.push({ nodeId: neighbor, path: [...path, neighbor] });
        }
      });
    }

    return []; // No path found
  }

  // Storage management
  private saveToStorage(): void {
    try {
      const data = {
        nodes: this.nodes,
        relationships: this.relationships,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.nodes && data.relationships) {
          this.nodes = data.nodes;
          this.relationships = data.relationships;
        }
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
      // Fall back to mock data
      this.nodes = [...mockIdeaNodes];
      this.relationships = [...mockRelationships];
    }
  }

  // Utility methods
  public getCategories(): string[] {
    return Array.from(new Set(this.nodes.map(node => node.category)));
  }

  public getRelationshipTypes(): RelationshipType[] {
    return ['depends-on', 'related-to', 'contradicts', 'sub-idea-of', 'influences', 'blocks', 'enables', 'custom'];
  }

  public clearNetwork(): void {
    this.nodes = [];
    this.relationships = [];
    this.saveToStorage();
  }

  public resetToMockData(): void {
    this.nodes = [...mockIdeaNodes];
    this.relationships = [...mockRelationships];
    this.saveToStorage();
  }
}

export const ideaMappingService = IdeaMappingService.getInstance();
export default ideaMappingService;