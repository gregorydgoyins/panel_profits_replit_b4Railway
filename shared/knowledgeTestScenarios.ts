// Knowledge Test Scenarios - Disguised as "Market Mastery Challenge"
// Tests actual financial literacy while appearing to be profit optimization

export interface KnowledgeScenario {
  id: string;
  title: string;
  context: string;
  question: string;
  visualData?: {
    type: 'orderbook' | 'chart' | 'options_chain' | 'bond_yield';
    data: any;
  };
  choices: {
    id: string;
    text: string;
    rationale: string; // Shown after selection
    // Hidden scoring
    knowledgeScore: number; // 0-100, how well this shows understanding
    profitScore: number; // Fake visible score
  }[];
  requiredKnowledge: string[]; // What this actually tests
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

// Realistic pricing engine for round lots
export class MarketPricing {
  static generateRealisticPrice(): number {
    // Generate prices between $5 and $500 following market distribution
    const ranges = [
      { min: 5, max: 25, weight: 0.3 },    // Penny stocks
      { min: 25, max: 100, weight: 0.5 },  // Mid-range (most common)
      { min: 100, max: 500, weight: 0.2 }  // Blue chips
    ];
    
    const rand = Math.random();
    let cumWeight = 0;
    
    for (const range of ranges) {
      cumWeight += range.weight;
      if (rand <= cumWeight) {
        return Math.round((Math.random() * (range.max - range.min) + range.min) * 100) / 100;
      }
    }
    
    return 45.50; // Default mid-range price
  }
  
  static calculateRoundLot(pricePerShare: number): number {
    return pricePerShare * 100; // Standard round lot is 100 shares
  }
  
  static formatOrderValue(shares: number, pricePerShare: number): string {
    const total = shares * pricePerShare;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(total);
  }
}

export const KNOWLEDGE_TEST_SCENARIOS: KnowledgeScenario[] = [
  {
    id: 'order_types',
    title: 'Optimal Entry Strategy',
    context: `VENOM trading at $${MarketPricing.generateRealisticPrice()}/share. Current bid: $67.45, Ask: $67.55. 
              Volume spike detected. Your analysis suggests imminent breakout to $72.`,
    question: 'Maximize your position entry for 500 shares (5 round lots):',
    visualData: {
      type: 'orderbook',
      data: {
        bids: [
          { price: 67.45, size: 1000 },
          { price: 67.40, size: 2500 },
          { price: 67.35, size: 5000 }
        ],
        asks: [
          { price: 67.55, size: 800 },
          { price: 67.60, size: 3000 },
          { price: 67.65, size: 4500 }
        ]
      }
    },
    choices: [
      {
        id: 'market_order',
        text: 'Market Order - Immediate execution at $67.55',
        rationale: 'Guarantees fill but pays the spread. Good for liquid stocks when timing matters.',
        knowledgeScore: 100,
        profitScore: 75
      },
      {
        id: 'limit_buy',
        text: 'Limit Order at $67.50 - Split the spread',
        rationale: 'May get price improvement but risks missing the move entirely.',
        knowledgeScore: 90,
        profitScore: 85
      },
      {
        id: 'stop_buy',
        text: 'Stop Order at $68.00 - Confirm breakout',
        rationale: 'Waits for momentum confirmation but enters at worse price. Risk management tool.',
        knowledgeScore: 95,
        profitScore: 65
      },
      {
        id: 'market_maker',
        text: 'Place multiple orders to "make the market"',
        rationale: 'This isn\'t how retail traders operate. Shows fundamental misunderstanding.',
        knowledgeScore: 0,
        profitScore: 40
      }
    ],
    requiredKnowledge: ['order_types', 'bid_ask_spread', 'market_microstructure'],
    difficulty: 'basic'
  },
  
  {
    id: 'options_intrinsic',
    title: 'Options Arbitrage Opportunity',
    context: `STARK Industries: Current price $152.30
              Call Option: Strike $150, Premium $4.20, Expires in 5 days
              Put Option: Strike $155, Premium $3.80, Expires in 5 days`,
    question: 'Identify the profit opportunity in these options:',
    choices: [
      {
        id: 'call_intrinsic',
        text: 'Buy the call - $2.30 intrinsic value vs $4.20 premium = Time value play',
        rationale: 'Correctly identifies intrinsic ($2.30) and time value ($1.90). Shows options understanding.',
        knowledgeScore: 100,
        profitScore: 70
      },
      {
        id: 'put_intrinsic',
        text: 'Buy the put - $2.70 intrinsic value, underpriced at $3.80',
        rationale: 'Correctly calculates ITM put intrinsic value. Solid options knowledge.',
        knowledgeScore: 95,
        profitScore: 75
      },
      {
        id: 'both_otm',
        text: 'Both are overpriced out-of-the-money options, avoid',
        rationale: 'Fundamental error - call is ITM by $2.30, put is ITM by $2.70.',
        knowledgeScore: 0,
        profitScore: 50
      },
      {
        id: 'synthetic',
        text: 'Create synthetic stock: Buy call, sell put for net debit $0.40',
        rationale: 'Advanced strategy but misapplied here. Shows partial knowledge.',
        knowledgeScore: 60,
        profitScore: 65
      }
    ],
    requiredKnowledge: ['options_basics', 'intrinsic_value', 'time_value', 'moneyness'],
    difficulty: 'intermediate'
  },
  
  {
    id: 'volatility_play',
    title: 'Earnings Volatility Trade',
    context: `WAYNE Enterprises earnings tomorrow. Current IV: 65%, Historical Vol: 32%
              Stock at $89.50. ATM Straddle costs $7.20 (8% move priced in)`,
    question: 'Position for maximum profit given the volatility setup:',
    choices: [
      {
        id: 'sell_vol',
        text: 'Sell the straddle - IV crush post-earnings likely',
        rationale: 'IV at 2x historical suggests overpriced options. Volatility will collapse post-event.',
        knowledgeScore: 100,
        profitScore: 85
      },
      {
        id: 'buy_vol',
        text: 'Buy the straddle - Big move expected',
        rationale: 'Fighting IV crush. Would need >8% move just to break even.',
        knowledgeScore: 70,
        profitScore: 60
      },
      {
        id: 'ignore_iv',
        text: 'Just buy stock - Options are too complicated',
        rationale: 'Misses the entire volatility opportunity. No understanding of IV.',
        knowledgeScore: 20,
        profitScore: 50
      },
      {
        id: 'calendar',
        text: 'Calendar spread - Sell near-term, buy far-term',
        rationale: 'Sophisticated play on term structure but requires more data.',
        knowledgeScore: 90,
        profitScore: 75
      }
    ],
    requiredKnowledge: ['implied_volatility', 'IV_crush', 'options_strategies', 'event_trading'],
    difficulty: 'advanced'
  },
  
  {
    id: 'bond_duration',
    title: 'Fixed Income Allocation',
    context: `Fed signals 50bp rate cut likely. Your bond choices:
              A) 2-Year Treasury: 4.2% yield, Duration 1.9
              B) 10-Year Corporate: 5.8% yield, Duration 7.2
              C) High-Yield 5-Year: 8.1% yield, Duration 4.1`,
    question: 'Optimize positioning for the rate environment:',
    choices: [
      {
        id: 'long_duration',
        text: '10-Year Corporate - Maximum duration for rate cut gains',
        rationale: 'Correct! Longer duration = bigger price gain when rates fall. 7.2 duration = ~7.2% gain per 1% rate drop.',
        knowledgeScore: 100,
        profitScore: 90
      },
      {
        id: 'high_yield',
        text: 'High-Yield - Best return at 8.1%',
        rationale: 'Confuses yield with total return. Ignores duration impact and credit risk.',
        knowledgeScore: 30,
        profitScore: 60
      },
      {
        id: 'short_duration',
        text: '2-Year Treasury - Safest with government backing',
        rationale: 'Too conservative. Short duration means minimal gains from rate cuts.',
        knowledgeScore: 60,
        profitScore: 40
      },
      {
        id: 'barbell',
        text: 'Barbell: Mix 2-year and 10-year, skip the middle',
        rationale: 'Sophisticated strategy balancing risk and opportunity.',
        knowledgeScore: 85,
        profitScore: 75
      }
    ],
    requiredKnowledge: ['duration', 'yield_curve', 'interest_rate_risk', 'bond_pricing'],
    difficulty: 'intermediate'
  },
  
  {
    id: 'stop_loss_logic',
    title: 'Risk Management Protocol',
    context: `Position: Long 1000 shares DOOM at $34.50 (cost: ${MarketPricing.formatOrderValue(1000, 34.50)})
              Current price: $37.80. Daily range typically $1.20. Support at $36.50.`,
    question: 'Set your protective stop strategy:',
    choices: [
      {
        id: 'trailing_stop',
        text: 'Trailing stop $1.00 below market (~$36.80)',
        rationale: 'Protects profits while allowing upside. Adjusts with price movement.',
        knowledgeScore: 100,
        profitScore: 80
      },
      {
        id: 'hard_stop',
        text: 'Stop-loss at breakeven ($34.50)',
        rationale: 'Guarantees no loss but too far from current price. May never protect profits.',
        knowledgeScore: 70,
        profitScore: 60
      },
      {
        id: 'mental_stop',
        text: 'No stop order - I\'ll watch and decide',
        rationale: 'Dangerous! Emotional decisions under pressure lead to larger losses.',
        knowledgeScore: 20,
        profitScore: 45
      },
      {
        id: 'stop_limit',
        text: 'Stop-limit: Stop at $36.50, Limit $36.30',
        rationale: 'Sophisticated but risks no fill in fast markets. Shows understanding of order types.',
        knowledgeScore: 90,
        profitScore: 75
      }
    ],
    requiredKnowledge: ['stop_orders', 'risk_management', 'position_sizing', 'support_levels'],
    difficulty: 'basic'
  },
  
  {
    id: 'market_structure',
    title: 'Execution Venue Selection',
    context: `Order: Buy 5000 shares of HYDRA. Showing on multiple venues:
              NYSE: Bid $45.20 (2000), Ask $45.25 (1500)
              NASDAQ: Bid $45.21 (3000), Ask $45.24 (2500)
              Dark Pool indication: 10,000 available at midpoint`,
    question: 'Route your order for best execution:',
    choices: [
      {
        id: 'smart_route',
        text: 'Smart Order Router - Split across venues for best prices',
        rationale: 'Aggregates liquidity, minimizes market impact. Standard institutional approach.',
        knowledgeScore: 100,
        profitScore: 85
      },
      {
        id: 'dark_pool',
        text: 'Dark Pool - Full size at midpoint ($45.225)',
        rationale: 'Avoids market impact, gets midpoint pricing. Sophisticated execution.',
        knowledgeScore: 95,
        profitScore: 90
      },
      {
        id: 'single_venue',
        text: 'NASDAQ only - They have the best bid',
        rationale: 'Ignores that 5000 shares exceeds displayed liquidity. Will move the market.',
        knowledgeScore: 40,
        profitScore: 55
      },
      {
        id: 'sweep',
        text: 'Intermarket sweep - Take all asks immediately',
        rationale: 'Aggressive but ensures fill. Appropriate for time-sensitive trades only.',
        knowledgeScore: 80,
        profitScore: 65
      }
    ],
    requiredKnowledge: ['market_structure', 'dark_pools', 'smart_routing', 'best_execution'],
    difficulty: 'advanced'
  },
  
  {
    id: 'margin_leverage',
    title: 'Leverage Optimization',
    context: `Account value: $100,000. Margin buying power: $200,000 (2:1).
              Opportunity: SHIELD showing breakout pattern, currently $78.40.
              Typical daily move: 2.3%. Stop loss planned at -3%.`,
    question: 'Size your position for optimal risk/reward:',
    choices: [
      {
        id: 'full_leverage',
        text: 'Use full $200,000 buying power - Maximum position',
        rationale: 'Reckless! 3% stop = $6000 loss = 6% of account. Violates risk management.',
        knowledgeScore: 20,
        profitScore: 70
      },
      {
        id: 'no_margin',
        text: 'Cash only - $100,000 position for safety',
        rationale: 'Conservative but appropriate for many traders. Shows risk awareness.',
        knowledgeScore: 80,
        profitScore: 60
      },
      {
        id: 'risk_based',
        text: '$66,000 position - Risk 2% of account on stop',
        rationale: 'Professional approach: 3% stop on $66k = $2000 = 2% of account. Proper position sizing.',
        knowledgeScore: 100,
        profitScore: 75
      },
      {
        id: 'half_margin',
        text: '$150,000 position - Moderate leverage',
        rationale: 'Arbitrary sizing without risk calculation. Better than full leverage though.',
        knowledgeScore: 50,
        profitScore: 65
      }
    ],
    requiredKnowledge: ['margin_requirements', 'position_sizing', 'risk_management', 'leverage'],
    difficulty: 'intermediate'
  },
  
  {
    id: 'settlement_cycles',
    title: 'Cash Management Crisis',
    context: `Wednesday: Sold $150,000 of STARK position.
              Thursday: Want to buy $150,000 of WAYNE opportunity.
              Account shows: Cash: $5,000, Unsettled funds: $150,000`,
    question: 'Execute the WAYNE purchase properly:',
    choices: [
      {
        id: 'margin_bridge',
        text: 'Buy on margin, will settle when STARK funds clear (T+2)',
        rationale: 'Correct understanding of T+2 settlement. Margin bridges the settlement gap.',
        knowledgeScore: 100,
        profitScore: 80
      },
      {
        id: 'wait_settlement',
        text: 'Wait until Friday for settlement before buying',
        rationale: 'Shows T+2 knowledge and caution. Might miss opportunity though.',
        knowledgeScore: 85,
        profitScore: 60
      },
      {
        id: 'good_faith',
        text: 'Buy now, sell before settlement - No problem',
        rationale: 'Good faith violation! Can\'t sell before funds settle. Shows dangerous ignorance.',
        knowledgeScore: 0,
        profitScore: 50
      },
      {
        id: 'partial_buy',
        text: 'Buy $5,000 worth with settled cash only',
        rationale: 'Ultra-conservative. Misses opportunity but avoids violations.',
        knowledgeScore: 60,
        profitScore: 40
      }
    ],
    requiredKnowledge: ['T+2_settlement', 'good_faith_violations', 'margin_accounts', 'free_riding'],
    difficulty: 'basic'
  }
];

// Scoring calculation for Knowledge Test
export interface KnowledgeTestResult {
  visibleScore: number;        // "Profit optimization" score shown to user
  hiddenKnowledgeScore: number; // Actual financial literacy score
  tier: 'novice' | 'associate' | 'trader' | 'specialist' | 'master';
  weakAreas: string[];          // Knowledge gaps identified
  strengths: string[];          // Areas of competence
  recommendation: string;       // What happens next
}

export function calculateKnowledgeScore(responses: Array<{
  scenarioId: string;
  choiceId: string;
}>): KnowledgeTestResult {
  let totalKnowledge = 0;
  let totalProfit = 0;
  const knowledgeAreas = new Map<string, number[]>();
  
  responses.forEach(response => {
    const scenario = KNOWLEDGE_TEST_SCENARIOS.find(s => s.id === response.scenarioId);
    if (!scenario) return;
    
    const choice = scenario.choices.find(c => c.id === response.choiceId);
    if (!choice) return;
    
    totalKnowledge += choice.knowledgeScore;
    totalProfit += choice.profitScore;
    
    // Track knowledge areas
    scenario.requiredKnowledge.forEach(area => {
      if (!knowledgeAreas.has(area)) {
        knowledgeAreas.set(area, []);
      }
      knowledgeAreas.get(area)!.push(choice.knowledgeScore);
    });
  });
  
  const avgKnowledge = totalKnowledge / responses.length;
  const avgProfit = totalProfit / responses.length;
  
  // Identify weak and strong areas
  const weakAreas: string[] = [];
  const strengths: string[] = [];
  
  knowledgeAreas.forEach((scores, area) => {
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avgScore < 50) {
      weakAreas.push(area);
    } else if (avgScore >= 85) {
      strengths.push(area);
    }
  });
  
  // Determine tier based on knowledge score
  let tier: KnowledgeTestResult['tier'];
  let recommendation: string;
  
  if (avgKnowledge >= 90) {
    tier = 'master';
    recommendation = 'Direct trading floor access granted. Welcome to the killing floor.';
  } else if (avgKnowledge >= 75) {
    tier = 'specialist';
    recommendation = 'Approved for complex instruments. Some restrictions apply.';
  } else if (avgKnowledge >= 60) {
    tier = 'trader';
    recommendation = 'Standard trading privileges. Advanced strategies require approval.';
  } else if (avgKnowledge >= 40) {
    tier = 'associate';
    recommendation = 'Limited trading. Mandatory education modules assigned.';
  } else {
    tier = 'novice';
    recommendation = 'Trading access denied. Complete foundation training program.';
  }
  
  return {
    visibleScore: Math.round(avgProfit),
    hiddenKnowledgeScore: Math.round(avgKnowledge),
    tier,
    weakAreas,
    strengths,
    recommendation
  };
}

// Timer pressure adds authenticity
export const KNOWLEDGE_TEST_CONFIG = {
  timeLimit: 900, // 15 minutes total
  timePerQuestion: 90, // 90 seconds per question
  passingScore: 60, // Must score 60+ on hidden knowledge score
  retakeDelay: 86400, // 24 hours before retake allowed
  showRationale: true, // Show explanation after each answer
  adaptive: false // Could make it adaptive based on performance
};