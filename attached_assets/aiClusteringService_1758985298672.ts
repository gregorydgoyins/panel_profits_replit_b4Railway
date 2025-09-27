import { Idea, IdeaCluster, ClusteringResult, SubscriptionTier } from '../types';

// Mock AI clustering service that simulates different levels of sophistication based on subscription tier
export class AIClusteringService {
  private static instance: AIClusteringService;

  private constructor() {}

  public static getInstance(): AIClusteringService {
    if (!AIClusteringService.instance) {
      AIClusteringService.instance = new AIClusteringService();
    }
    return AIClusteringService.instance;
  }

  /**
   * Cluster ideas based on subscription tier
   */
  public async clusterIdeas(ideas: Idea[], subscriptionTier: SubscriptionTier): Promise<ClusteringResult> {
    // Simulate processing time based on tier
    const processingTime = this.getProcessingTime(subscriptionTier);
    await new Promise(resolve => setTimeout(resolve, processingTime));

    switch (subscriptionTier) {
      case 'basic':
        return this.basicClustering(ideas);
      case 'standard':
        return this.standardClustering(ideas);
      case 'premium':
        return this.premiumClustering(ideas);
      default:
        return this.basicClustering(ideas);
    }
  }

  private getProcessingTime(tier: SubscriptionTier): number {
    switch (tier) {
      case 'basic': return 2000; // 2 seconds
      case 'standard': return 1500; // 1.5 seconds
      case 'premium': return 500; // 0.5 seconds (priority processing)
      default: return 2000;
    }
  }

  private basicClustering(ideas: Idea[]): ClusteringResult {
    // Basic clustering: Simple keyword-based grouping into 5-7 clusters
    const clusters: IdeaCluster[] = [
      {
        id: 'tech-cluster',
        name: 'Technology & AI',
        description: 'Ideas related to technology, artificial intelligence, and automation',
        ideas: ideas.filter(idea => 
          idea.tags.some(tag => ['AI', 'technology', 'automation', 'mobile', 'API', 'blockchain'].includes(tag)) ||
          idea.content.toLowerCase().includes('ai') ||
          idea.content.toLowerCase().includes('technology') ||
          idea.content.toLowerCase().includes('automation')
        ),
        keyTerms: ['AI', 'technology', 'automation'],
        confidence: 0.75,
        size: 0
      },
      {
        id: 'trading-cluster',
        name: 'Trading & Finance',
        description: 'Ideas focused on trading features and financial tools',
        ideas: ideas.filter(idea => 
          idea.tags.some(tag => ['trading', 'analytics', 'risk', 'orders'].includes(tag)) ||
          idea.content.toLowerCase().includes('trading') ||
          idea.content.toLowerCase().includes('portfolio')
        ),
        keyTerms: ['trading', 'portfolio', 'analytics'],
        confidence: 0.80,
        size: 0
      },
      {
        id: 'community-cluster',
        name: 'Community & Social',
        description: 'Ideas about building community and social features',
        ideas: ideas.filter(idea => 
          idea.tags.some(tag => ['social', 'community', 'forums', 'events'].includes(tag)) ||
          idea.content.toLowerCase().includes('community') ||
          idea.content.toLowerCase().includes('social')
        ),
        keyTerms: ['community', 'social', 'engagement'],
        confidence: 0.70,
        size: 0
      },
      {
        id: 'content-cluster',
        name: 'Content & Education',
        description: 'Ideas related to educational content and marketing',
        ideas: ideas.filter(idea => 
          idea.tags.some(tag => ['content', 'education', 'marketing', 'learning'].includes(tag)) ||
          idea.content.toLowerCase().includes('education') ||
          idea.content.toLowerCase().includes('content')
        ),
        keyTerms: ['content', 'education', 'learning'],
        confidence: 0.65,
        size: 0
      },
      {
        id: 'business-cluster',
        name: 'Business & Operations',
        description: 'Ideas about business operations and partnerships',
        ideas: ideas.filter(idea => 
          idea.tags.some(tag => ['partnerships', 'compliance', 'support'].includes(tag)) ||
          idea.content.toLowerCase().includes('partnership') ||
          idea.content.toLowerCase().includes('business')
        ),
        keyTerms: ['business', 'partnerships', 'operations'],
        confidence: 0.60,
        size: 0
      }
    ];

    // Update cluster sizes and remove empty clusters
    const nonEmptyClusters = clusters
      .map(cluster => ({ ...cluster, size: cluster.ideas.length }))
      .filter(cluster => cluster.size > 0);

    // Add remaining ideas to a miscellaneous cluster
    const clusteredIdeaIds = new Set(nonEmptyClusters.flatMap(c => c.ideas.map(i => i.id)));
    const remainingIdeas = ideas.filter(idea => !clusteredIdeaIds.has(idea.id));
    
    if (remainingIdeas.length > 0) {
      nonEmptyClusters.push({
        id: 'misc-cluster',
        name: 'Miscellaneous',
        description: 'Other ideas that don\'t fit into main categories',
        ideas: remainingIdeas,
        keyTerms: ['various', 'other'],
        confidence: 0.50,
        size: remainingIdeas.length
      });
    }

    return {
      clusters: nonEmptyClusters.slice(0, 7), // Limit to 7 clusters for basic tier
      totalIdeas: ideas.length,
      processingTime: 2000,
      confidence: 0.70
    };
  }

  private standardClustering(ideas: Idea[]): ClusteringResult {
    // Standard clustering: More granular clustering with sentiment analysis
    const basicResult = this.basicClustering(ideas);
    
    // Add more detailed sub-clusters
    const enhancedClusters = basicResult.clusters.map(cluster => {
      // Add sentiment analysis to each cluster
      const sentiments = cluster.ideas.map(idea => idea.sentiment || 'neutral');
      const positiveSentiments = sentiments.filter(s => s === 'positive').length;
      const negativeSentiments = sentiments.filter(s => s === 'negative').length;
      
      let clusterSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (positiveSentiments > negativeSentiments) {
        clusterSentiment = 'positive';
      } else if (negativeSentiments > positiveSentiments) {
        clusterSentiment = 'negative';
      }

      return {
        ...cluster,
        sentiment: clusterSentiment,
        confidence: cluster.confidence + 0.1 // Higher confidence for standard tier
      };
    });

    // Create additional sub-clusters for larger groups
    const expandedClusters: IdeaCluster[] = [];
    enhancedClusters.forEach(cluster => {
      if (cluster.ideas.length > 3) {
        // Split large clusters into sub-clusters
        const midpoint = Math.ceil(cluster.ideas.length / 2);
        const subCluster1 = {
          ...cluster,
          id: `${cluster.id}-1`,
          name: `${cluster.name} (Core)`,
          ideas: cluster.ideas.slice(0, midpoint),
          size: midpoint
        };
        const subCluster2 = {
          ...cluster,
          id: `${cluster.id}-2`,
          name: `${cluster.name} (Extended)`,
          ideas: cluster.ideas.slice(midpoint),
          size: cluster.ideas.length - midpoint
        };
        expandedClusters.push(subCluster1, subCluster2);
      } else {
        expandedClusters.push(cluster);
      }
    });

    return {
      clusters: expandedClusters.slice(0, 25), // Limit to 25 clusters for standard tier
      totalIdeas: ideas.length,
      processingTime: 1500,
      confidence: 0.85,
      suggestions: [
        'Consider merging similar clusters to reduce redundancy',
        'Focus on high-priority ideas in the Technology cluster',
        'Review sentiment patterns across different categories'
      ]
    };
  }

  private premiumClustering(ideas: Idea[]): ClusteringResult {
    // Premium clustering: Advanced semantic analysis with cross-project capabilities
    const standardResult = this.standardClustering(ideas);
    
    // Add advanced clustering features
    const premiumClusters = standardResult.clusters.map(cluster => ({
      ...cluster,
      confidence: Math.min(0.95, cluster.confidence + 0.15), // Even higher confidence
      keyTerms: [
        ...cluster.keyTerms,
        // Add more sophisticated key terms
        ...this.extractAdvancedKeyTerms(cluster.ideas)
      ]
    }));

    // Add cross-category relationship clusters
    const relationshipClusters = this.createRelationshipClusters(ideas);
    
    const allClusters = [...premiumClusters, ...relationshipClusters];

    return {
      clusters: allClusters.slice(0, 100), // Up to 100 clusters for premium tier
      totalIdeas: ideas.length,
      processingTime: 500,
      confidence: 0.92,
      suggestions: [
        'Leverage cross-category insights to identify innovation opportunities',
        'Use sentiment trends to prioritize development roadmap',
        'Consider creating dedicated teams for high-confidence clusters',
        'Explore synergies between Technology and Trading clusters',
        'Monitor emerging themes in Community engagement ideas'
      ]
    };
  }

  private extractAdvancedKeyTerms(ideas: Idea[]): string[] {
    // Simulate advanced NLP key term extraction
    const allText = ideas.map(idea => `${idea.title} ${idea.content}`).join(' ');
    const words = allText.toLowerCase().split(/\s+/);
    
    // Simple frequency analysis (in real implementation, this would use NLP)
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 3 && !['the', 'and', 'for', 'with', 'that', 'this'].includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private createRelationshipClusters(ideas: Idea[]): IdeaCluster[] {
    // Create clusters based on relationships between different categories
    return [
      {
        id: 'tech-trading-synergy',
        name: 'Tech-Trading Synergy',
        description: 'Ideas that combine technology with trading functionality',
        ideas: ideas.filter(idea => 
          (idea.tags.includes('AI') || idea.tags.includes('technology')) &&
          (idea.tags.includes('trading') || idea.tags.includes('analytics'))
        ),
        keyTerms: ['AI', 'trading', 'automation', 'analytics'],
        sentiment: 'positive',
        confidence: 0.88,
        size: 0
      },
      {
        id: 'community-engagement',
        name: 'Community Engagement',
        description: 'Ideas focused on building and engaging user communities',
        ideas: ideas.filter(idea => 
          idea.tags.some(tag => ['social', 'community', 'events', 'gamification'].includes(tag))
        ),
        keyTerms: ['community', 'engagement', 'social', 'events'],
        sentiment: 'positive',
        confidence: 0.85,
        size: 0
      }
    ].map(cluster => ({ ...cluster, size: cluster.ideas.length }))
     .filter(cluster => cluster.size > 0);
  }

  /**
   * Get tier-specific feature availability
   */
  public getTierFeatures(tier: SubscriptionTier) {
    const features = {
      basic: {
        maxClusters: 7,
        realTimeClustering: false,
        sentimentAnalysis: false,
        crossProjectClustering: false,
        advancedVisualization: false,
        customClusterMerging: false,
        priorityProcessing: false,
        exportCapabilities: false,
        apiAccess: false
      },
      standard: {
        maxClusters: 25,
        realTimeClustering: false,
        sentimentAnalysis: true,
        crossProjectClustering: false,
        advancedVisualization: false,
        customClusterMerging: true,
        priorityProcessing: false,
        exportCapabilities: true,
        apiAccess: false
      },
      premium: {
        maxClusters: 100,
        realTimeClustering: true,
        sentimentAnalysis: true,
        crossProjectClustering: true,
        advancedVisualization: true,
        customClusterMerging: true,
        priorityProcessing: true,
        exportCapabilities: true,
        apiAccess: true
      }
    };

    return features[tier];
  }
}

export const aiClusteringService = AIClusteringService.getInstance();
export default aiClusteringService;