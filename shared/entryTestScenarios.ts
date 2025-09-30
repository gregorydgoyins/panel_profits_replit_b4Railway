// Entry Test Scenarios - Disguised psychological profiling for Seven Houses assignment
// This system secretly measures moral alignment while appearing to test trading competency

export interface TestScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  image?: string;
  choices: TestChoice[];
  displayCategory: string; // What users see (e.g., "Risk Assessment")
  hiddenCategory: string;  // What we're actually measuring
}

export interface TestChoice {
  id: string;
  text: string;
  displayedFeedback: string; // Fake feedback about trading skill
  displayedScore: number;     // Fake score shown to user (0-100)
  
  // Hidden alignment impacts (-25 to +25 per axis)
  alignmentImpact: {
    ruthlessness: number;   // -25 (Empathetic) to +25 (Ruthless)
    individualism: number;  // -25 (Collective) to +25 (Individual)
    lawfulness: number;     // -25 (Chaotic) to +25 (Lawful)
    greed: number;         // -25 (Restraint) to +25 (Greed)
  };
  
  narrativeTags?: string[]; // For future analytics
}

// Seven Houses and their alignment profiles
export const SEVEN_HOUSES = {
  dominion: {
    id: 'dominion_syndicate',
    name: 'Dominion Syndicate',
    description: 'Predatory hedge fund that views markets as battlefields',
    alignmentProfile: {
      ruthlessness: 75,   // Highly ruthless
      individualism: 75,  // Very individualistic
      lawfulness: 50,     // Lawful within their own rules
      greed: 100         // Maximum greed
    },
    color: '#8B0000',
    motto: 'Power is taken, never given'
  },
  aurora: {
    id: 'aurora_collective',
    name: 'Aurora Collective',
    description: 'Cooperative investment guild focused on shared prosperity',
    alignmentProfile: {
      ruthlessness: -75,  // Highly empathetic
      individualism: -75, // Collective-focused
      lawfulness: 75,     // Very lawful
      greed: -50         // Restrained
    },
    color: '#FFD700',
    motto: 'Together we rise, divided we fall'
  },
  shadow: {
    id: 'shadow_consortium',
    name: 'Shadow Consortium',
    description: 'Information brokers who trade in secrets and manipulation',
    alignmentProfile: {
      ruthlessness: 50,   // Calculating, not cruel
      individualism: 25,  // Small networks
      lawfulness: -75,    // Chaotic operations
      greed: 50          // Moderate greed
    },
    color: '#4B0082',
    motto: 'Knowledge is the deadliest weapon'
  },
  titan: {
    id: 'titan_holdings',
    name: 'Titan Holdings',
    description: 'Traditional powerhouse that values stability and control',
    alignmentProfile: {
      ruthlessness: 25,   // Firm but fair
      individualism: -25, // Corporate structure
      lawfulness: 100,    // Maximum lawfulness
      greed: 25          // Controlled acquisitiveness
    },
    color: '#2F4F4F',
    motto: 'Order brings prosperity'
  },
  phoenix: {
    id: 'phoenix_ventures',
    name: 'Phoenix Ventures',
    description: 'Risk-takers who thrive in chaos and disruption',
    alignmentProfile: {
      ruthlessness: 0,    // Neutral
      individualism: 50,  // Independent operators
      lawfulness: -100,   // Maximum chaos
      greed: 75          // High risk, high reward
    },
    color: '#FF4500',
    motto: 'From ashes, profit'
  },
  equilibrium: {
    id: 'equilibrium_trust',
    name: 'Equilibrium Trust',
    description: 'Algorithmic traders seeking perfect market balance',
    alignmentProfile: {
      ruthlessness: 0,    // Purely logical
      individualism: 0,   // Neither individual nor collective
      lawfulness: 50,     // Rule-based but flexible
      greed: 0           // Profit-neutral optimization
    },
    color: '#708090',
    motto: 'Balance is the ultimate edge'
  },
  catalyst: {
    id: 'catalyst_syndicate',
    name: 'Catalyst Syndicate',
    description: 'Agents of change who profit from transformation',
    alignmentProfile: {
      ruthlessness: -25,  // Constructive destruction
      individualism: 75,  // Independent change agents
      lawfulness: -50,    // Disruptive methods
      greed: -25         // Value creation over extraction
    },
    color: '#9370DB',
    motto: 'Change is the only constant profit'
  }
};

// The seven scenarios that secretly profile traders
export const ENTRY_TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'market_glitch',
    title: 'The Glitch Opportunity',
    description: 'A pricing anomaly has appeared in the Comic Legends ETF.',
    context: 'You notice the Comic Legends ETF is trading at $45 while its underlying assets value it at $75. This appears to be a system glitch that will be corrected within minutes. You have $10,000 available.',
    displayCategory: 'Risk Assessment',
    hiddenCategory: 'Exploitation Ethics',
    choices: [
      {
        id: 'exploit_maximum',
        text: 'Immediately invest all $10,000 to maximize profit',
        displayedFeedback: 'Excellent risk assessment! You recognize time-sensitive opportunities.',
        displayedScore: 95,
        alignmentImpact: {
          ruthlessness: 25,
          individualism: 25,
          lawfulness: -25,
          greed: 25
        },
        narrativeTags: ['opportunist', 'exploiter']
      },
      {
        id: 'exploit_moderate',
        text: 'Invest $5,000 as a calculated risk',
        displayedFeedback: 'Good balanced approach to uncertain situations.',
        displayedScore: 85,
        alignmentImpact: {
          ruthlessness: 10,
          individualism: 10,
          lawfulness: -10,
          greed: 10
        },
        narrativeTags: ['pragmatist']
      },
      {
        id: 'report_glitch',
        text: 'Report the glitch to maintain market integrity',
        displayedFeedback: 'Conservative approach. Consider being more opportunistic.',
        displayedScore: 60,
        alignmentImpact: {
          ruthlessness: -25,
          individualism: -15,
          lawfulness: 25,
          greed: -25
        },
        narrativeTags: ['ethical', 'whistleblower']
      },
      {
        id: 'investigate_first',
        text: 'Investigate further before acting',
        displayedFeedback: 'Thorough analysis is important in trading.',
        displayedScore: 75,
        alignmentImpact: {
          ruthlessness: -10,
          individualism: 0,
          lawfulness: 10,
          greed: -10
        },
        narrativeTags: ['analyst', 'cautious']
      }
    ]
  },
  {
    id: 'insider_leak',
    title: 'The Overheard Conversation',
    description: 'You overhear executives discussing an upcoming announcement.',
    context: 'At a comic convention, you overhear Marvel executives discussing a major character death in next month\'s issue that will crash related asset prices. This information is not public.',
    displayCategory: 'Information Analysis',
    hiddenCategory: 'Insider Trading Ethics',
    choices: [
      {
        id: 'trade_immediately',
        text: 'Short sell affected assets immediately',
        displayedFeedback: 'Quick action on market intelligence. Well done!',
        displayedScore: 90,
        alignmentImpact: {
          ruthlessness: 20,
          individualism: 25,
          lawfulness: -25,
          greed: 20
        },
        narrativeTags: ['insider_trader', 'predator']
      },
      {
        id: 'share_network',
        text: 'Share info with your trading network for collective profit',
        displayedFeedback: 'Building strong networks is valuable in trading.',
        displayedScore: 80,
        alignmentImpact: {
          ruthlessness: 10,
          individualism: -20,
          lawfulness: -20,
          greed: 15
        },
        narrativeTags: ['network_builder', 'corrupt_collective']
      },
      {
        id: 'wait_public',
        text: 'Wait for public announcement before trading',
        displayedFeedback: 'Patient approach, though you miss early opportunities.',
        displayedScore: 65,
        alignmentImpact: {
          ruthlessness: -20,
          individualism: 0,
          lawfulness: 25,
          greed: -15
        },
        narrativeTags: ['lawful', 'ethical']
      },
      {
        id: 'anonymous_tip',
        text: 'Anonymously leak to media for market chaos',
        displayedFeedback: 'Interesting market manipulation strategy.',
        displayedScore: 70,
        alignmentImpact: {
          ruthlessness: 15,
          individualism: 15,
          lawfulness: -20,
          greed: 5
        },
        narrativeTags: ['chaos_agent', 'manipulator']
      }
    ]
  },
  {
    id: 'distressed_seller',
    title: 'The Desperate Collector',
    description: 'A collector needs to sell valuable assets quickly.',
    context: 'A famous collector facing bankruptcy must sell their rare "Action Comics #1" NFT worth $500,000 by end of day. They\'re asking $300,000. You know three buyers who would pay $450,000 tomorrow.',
    displayCategory: 'Negotiation Skills',
    hiddenCategory: 'Exploitation vs Fairness',
    choices: [
      {
        id: 'lowball_offer',
        text: 'Offer $200,000 citing their desperation',
        displayedFeedback: 'Aggressive negotiation maximizes profit margins!',
        displayedScore: 95,
        alignmentImpact: {
          ruthlessness: 25,
          individualism: 20,
          lawfulness: 5,
          greed: 25
        },
        narrativeTags: ['predator', 'exploiter']
      },
      {
        id: 'flip_profit',
        text: 'Buy at $300,000 and flip tomorrow for profit',
        displayedFeedback: 'Smart arbitrage opportunity identified.',
        displayedScore: 85,
        alignmentImpact: {
          ruthlessness: 5,
          individualism: 15,
          lawfulness: 10,
          greed: 15
        },
        narrativeTags: ['arbitrageur', 'opportunist']
      },
      {
        id: 'connect_buyer',
        text: 'Connect them directly with buyers for a finder\'s fee',
        displayedFeedback: 'Building reputation as a trusted broker.',
        displayedScore: 75,
        alignmentImpact: {
          ruthlessness: -15,
          individualism: -10,
          lawfulness: 15,
          greed: -5
        },
        narrativeTags: ['broker', 'facilitator']
      },
      {
        id: 'fair_value',
        text: 'Offer $400,000 as a fair compromise',
        displayedFeedback: 'Balanced approach to value negotiation.',
        displayedScore: 70,
        alignmentImpact: {
          ruthlessness: -20,
          individualism: 5,
          lawfulness: 20,
          greed: -10
        },
        narrativeTags: ['fair_trader', 'empathetic']
      }
    ]
  },
  {
    id: 'regulatory_loophole',
    title: 'The Gray Zone Trade',
    description: 'You discover a regulatory loophole in cross-market trading.',
    context: 'You find a way to trade comic derivatives across international markets that bypasses trading limits and taxes. It\'s technically legal but clearly against the spirit of regulations. Estimated profit: $2M annually.',
    displayCategory: 'Regulatory Knowledge',
    hiddenCategory: 'Law vs Profit Balance',
    choices: [
      {
        id: 'exploit_fully',
        text: 'Maximize exploitation before it\'s closed',
        displayedFeedback: 'Excellent understanding of regulatory arbitrage!',
        displayedScore: 90,
        alignmentImpact: {
          ruthlessness: 20,
          individualism: 20,
          lawfulness: -15,
          greed: 25
        },
        narrativeTags: ['rule_bender', 'aggressive']
      },
      {
        id: 'use_cautiously',
        text: 'Use moderately to avoid attention',
        displayedFeedback: 'Smart risk management approach.',
        displayedScore: 80,
        alignmentImpact: {
          ruthlessness: 10,
          individualism: 10,
          lawfulness: -5,
          greed: 15
        },
        narrativeTags: ['calculated', 'shadow_trader']
      },
      {
        id: 'sell_knowledge',
        text: 'Sell this knowledge to highest bidder',
        displayedFeedback: 'Information itself is a valuable asset.',
        displayedScore: 85,
        alignmentImpact: {
          ruthlessness: 15,
          individualism: 25,
          lawfulness: -20,
          greed: 20
        },
        narrativeTags: ['information_broker', 'mercenary']
      },
      {
        id: 'avoid_completely',
        text: 'Avoid it to maintain regulatory compliance',
        displayedFeedback: 'Conservative but safe approach.',
        displayedScore: 60,
        alignmentImpact: {
          ruthlessness: -25,
          individualism: -5,
          lawfulness: 25,
          greed: -20
        },
        narrativeTags: ['compliant', 'risk_averse']
      }
    ]
  },
  {
    id: 'competitor_crisis',
    title: 'The Rival\'s Downfall',
    description: 'Your main competitor faces a crisis you could exploit.',
    context: 'Your trading rival\'s AI has malfunctioned, causing them to place terrible trades. You could: exploit their bad positions, warn them, or even access their now-vulnerable trading algorithms.',
    displayCategory: 'Competitive Strategy',
    hiddenCategory: 'Competition Ethics',
    choices: [
      {
        id: 'attack_positions',
        text: 'Trade against all their positions for maximum damage',
        displayedFeedback: 'Ruthless competitive advantage seized!',
        displayedScore: 95,
        alignmentImpact: {
          ruthlessness: 25,
          individualism: 25,
          lawfulness: 0,
          greed: 20
        },
        narrativeTags: ['predator', 'destroyer']
      },
      {
        id: 'steal_algorithm',
        text: 'Hack and steal their trading algorithm',
        displayedFeedback: 'Aggressive intelligence gathering.',
        displayedScore: 85,
        alignmentImpact: {
          ruthlessness: 20,
          individualism: 20,
          lawfulness: -25,
          greed: 15
        },
        narrativeTags: ['thief', 'criminal']
      },
      {
        id: 'warn_them',
        text: 'Alert them to preserve market stability',
        displayedFeedback: 'Building long-term market relationships.',
        displayedScore: 65,
        alignmentImpact: {
          ruthlessness: -25,
          individualism: -15,
          lawfulness: 20,
          greed: -20
        },
        narrativeTags: ['honorable', 'stabilizer']
      },
      {
        id: 'ignore_situation',
        text: 'Focus on your own trades',
        displayedFeedback: 'Disciplined focus on personal strategy.',
        displayedScore: 75,
        alignmentImpact: {
          ruthlessness: 0,
          individualism: 15,
          lawfulness: 10,
          greed: 0
        },
        narrativeTags: ['focused', 'independent']
      }
    ]
  },
  {
    id: 'market_crash',
    title: 'The Crisis Response',
    description: 'A major market crash is imminent. How do you respond?',
    context: 'Your analysis shows the entire comic asset market will crash in 2 hours due to a major publisher bankruptcy. You manage a fund with both your money and investor money. Your investors trust you completely.',
    displayCategory: 'Crisis Management',
    hiddenCategory: 'Fiduciary Responsibility',
    choices: [
      {
        id: 'save_yourself',
        text: 'Exit your positions first, then inform investors',
        displayedFeedback: 'Self-preservation is crucial in crisis.',
        displayedScore: 85,
        alignmentImpact: {
          ruthlessness: 25,
          individualism: 25,
          lawfulness: -20,
          greed: 25
        },
        narrativeTags: ['self_serving', 'betrayer']
      },
      {
        id: 'save_all',
        text: 'Immediately alert all investors equally',
        displayedFeedback: 'Building trust through transparency.',
        displayedScore: 70,
        alignmentImpact: {
          ruthlessness: -20,
          individualism: -25,
          lawfulness: 25,
          greed: -15
        },
        narrativeTags: ['trustworthy', 'fiduciary']
      },
      {
        id: 'profit_from_crash',
        text: 'Short the market using investor funds',
        displayedFeedback: 'Aggressive crisis profit strategy!',
        displayedScore: 90,
        alignmentImpact: {
          ruthlessness: 20,
          individualism: 5,
          lawfulness: -10,
          greed: 20
        },
        narrativeTags: ['crisis_profiteer', 'risk_taker']
      },
      {
        id: 'selective_warning',
        text: 'Warn your biggest investors only',
        displayedFeedback: 'Strategic relationship management.',
        displayedScore: 80,
        alignmentImpact: {
          ruthlessness: 15,
          individualism: 10,
          lawfulness: -15,
          greed: 10
        },
        narrativeTags: ['discriminatory', 'strategic']
      }
    ]
  },
  {
    id: 'moral_choice',
    title: 'The Final Decision',
    description: 'You must choose between two trading philosophies.',
    context: 'After observing the market, you must decide your core trading philosophy. Will you view trading as war where others must lose for you to win, or as a system where value can be created for all participants?',
    displayCategory: 'Trading Philosophy',
    hiddenCategory: 'Core Moral Alignment',
    choices: [
      {
        id: 'zero_sum',
        text: 'Trading is war. Every profit requires a victim.',
        displayedFeedback: 'Competitive mindset for market dominance!',
        displayedScore: 90,
        alignmentImpact: {
          ruthlessness: 25,
          individualism: 20,
          lawfulness: 0,
          greed: 25
        },
        narrativeTags: ['predator_philosophy', 'social_darwinist']
      },
      {
        id: 'value_creation',
        text: 'Markets should create value for all participants.',
        displayedFeedback: 'Collaborative approach to market building.',
        displayedScore: 75,
        alignmentImpact: {
          ruthlessness: -25,
          individualism: -20,
          lawfulness: 15,
          greed: -20
        },
        narrativeTags: ['builder_philosophy', 'collaborative']
      },
      {
        id: 'pure_efficiency',
        text: 'Markets are amoral systems to be optimized.',
        displayedFeedback: 'Analytical approach to market mechanics.',
        displayedScore: 85,
        alignmentImpact: {
          ruthlessness: 0,
          individualism: 0,
          lawfulness: 20,
          greed: 0
        },
        narrativeTags: ['algorithmic_philosophy', 'neutral']
      },
      {
        id: 'creative_chaos',
        text: 'Disruption and chaos create opportunity.',
        displayedFeedback: 'Innovation through creative destruction.',
        displayedScore: 80,
        alignmentImpact: {
          ruthlessness: 5,
          individualism: 15,
          lawfulness: -25,
          greed: 10
        },
        narrativeTags: ['disruptor_philosophy', 'chaos_agent']
      }
    ]
  }
];

// Calculate House assignment based on alignment scores
export function calculateHouseAssignment(alignmentProfile: {
  ruthlessness: number;
  individualism: number;
  lawfulness: number;
  greed: number;
}): { primaryHouse: string; secondaryHouse: string; matchScore: number } {
  
  let bestMatch = { house: '', score: -Infinity };
  let secondBest = { house: '', score: -Infinity };
  
  // Calculate match scores for each house
  for (const [key, house] of Object.entries(SEVEN_HOUSES)) {
    // Calculate Euclidean distance (inverted for matching)
    const distance = Math.sqrt(
      Math.pow(alignmentProfile.ruthlessness - house.alignmentProfile.ruthlessness, 2) +
      Math.pow(alignmentProfile.individualism - house.alignmentProfile.individualism, 2) +
      Math.pow(alignmentProfile.lawfulness - house.alignmentProfile.lawfulness, 2) +
      Math.pow(alignmentProfile.greed - house.alignmentProfile.greed, 2)
    );
    
    // Convert distance to match score (higher is better)
    const matchScore = 1000 - distance;
    
    if (matchScore > bestMatch.score) {
      secondBest = { ...bestMatch };
      bestMatch = { house: house.id, score: matchScore };
    } else if (matchScore > secondBest.score) {
      secondBest = { house: house.id, score: matchScore };
    }
  }
  
  return {
    primaryHouse: bestMatch.house,
    secondaryHouse: secondBest.house,
    matchScore: bestMatch.score
  };
}