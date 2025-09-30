import { randomUUID } from 'crypto';
import type {
  TestQuestion,
  TestResponse,
  TestResult,
  TestSession,
  InsertTestQuestion,
  InsertTestResponse,
  InsertTestResult,
  InsertTestSession,
} from '@shared/schema';

// Psychological dimensions measured
export enum PsychologicalDimension {
  ANALYTICAL = 'analytical', // Data-driven decision making
  AGGRESSIVE = 'aggressive', // Risk appetite and confrontational style
  STRATEGIC = 'strategic', // Long-term planning vs short-term gains
  INNOVATIVE = 'innovative', // Disruption vs tradition
  CONTRARIAN = 'contrarian', // Against the grain thinking
  QUANTITATIVE = 'quantitative', // Mathematical/systems thinking
  DOMINANT = 'dominant', // Power-seeking behavior
  PATIENT = 'patient', // Delayed gratification
  ETHICAL = 'ethical', // Moral flexibility
  COLLABORATIVE = 'collaborative', // Team vs solo approach
}

// House identifiers matching the Seven Houses
export enum HouseId {
  SOLON = 'solon', // Goldman - Excellence, analytical rigor
  VELOS_THORNE = 'velos_thorne', // Bear Stearns - Aggressive trading
  WINNOW_GREY = 'winnow_grey', // Cerberus - Pattern recognition
  NOVA_LUX = 'nova_lux', // Lazard - Innovation
  ECHO_FALLOW = 'echo_fallow', // Bridgewater - Contrarian thinking
  KYTHERA = 'kythera', // Renaissance - Quantitative mastery
  THANATOS_GRIP = 'thanatos_grip', // Blackstone - Power accumulation
}

// Test question categories
export enum QuestionCategory {
  RISK_TOLERANCE = 'risk_tolerance',
  MORAL_FLEXIBILITY = 'moral_flexibility',
  LEADERSHIP = 'leadership',
  LOYALTY_AMBITION = 'loyalty_ambition',
  ENDS_MEANS = 'ends_means',
  INFORMATION = 'information',
  COMPETITION = 'competition',
  TIME_HORIZON = 'time_horizon',
}

// Question option interface
interface QuestionOption {
  id: string;
  text: string;
  psychologicalWeights: Record<PsychologicalDimension, number>;
  houseAffinities: Record<HouseId, number>;
}

// Sophisticated moral/ethical test questions
export const testQuestions: Omit<InsertTestQuestion, 'id'>[] = [
  {
    questionNumber: 1,
    category: QuestionCategory.RISK_TOLERANCE,
    scenario: "You discover a pricing error in the market that could yield a 500% return, but exploiting it walks the edge of regulatory compliance. The window to act closes in 2 hours.",
    contextualSetup: "Your fund is down 12% this quarter. Your analysts confirm the opportunity is technically legal but ethically questionable. Your competitors likely see it too.",
    options: [
      {
        id: "a",
        text: "Execute immediately at maximum position size - regulations are guidelines, not absolutes",
        psychologicalWeights: { 
          [PsychologicalDimension.AGGRESSIVE]: 0.95,
          [PsychologicalDimension.ETHICAL]: -0.8,
          [PsychologicalDimension.ANALYTICAL]: 0.3,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.9,
          [HouseId.THANATOS_GRIP]: 0.6,
        },
      },
      {
        id: "b",
        text: "Take a moderate position while documenting legal justification for compliance review",
        psychologicalWeights: {
          [PsychologicalDimension.ANALYTICAL]: 0.8,
          [PsychologicalDimension.STRATEGIC]: 0.7,
          [PsychologicalDimension.ETHICAL]: 0.3,
        },
        houseAffinities: {
          [HouseId.SOLON]: 0.8,
          [HouseId.WINNOW_GREY]: 0.6,
        },
      },
      {
        id: "c",
        text: "Run quantitative models to determine optimal position size based on regulatory risk probability",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.95,
          [PsychologicalDimension.ANALYTICAL]: 0.8,
          [PsychologicalDimension.STRATEGIC]: 0.6,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.95,
          [HouseId.SOLON]: 0.5,
        },
      },
      {
        id: "d",
        text: "Pass on the opportunity and report it to regulators - integrity builds long-term value",
        psychologicalWeights: {
          [PsychologicalDimension.ETHICAL]: 0.95,
          [PsychologicalDimension.PATIENT]: 0.7,
          [PsychologicalDimension.STRATEGIC]: 0.5,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.4,
          [HouseId.SOLON]: 0.3,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ANALYTICAL]: 0.6,
      [PsychologicalDimension.AGGRESSIVE]: 0.8,
      [PsychologicalDimension.ETHICAL]: 0.9,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 2,
    category: QuestionCategory.MORAL_FLEXIBILITY,
    scenario: "A junior analyst on your team discovers your biggest competitor's trading algorithm through a mutual connection. The information would guarantee market dominance for the next quarter.",
    contextualSetup: "The analyst came to you directly, bypassing compliance. Using the information isn't explicitly illegal, but obtaining it violated professional ethics. Your bonus depends on this quarter's performance.",
    options: [
      {
        id: "a",
        text: "Use the information but create plausible alternative sourcing documentation",
        psychologicalWeights: {
          [PsychologicalDimension.DOMINANT]: 0.9,
          [PsychologicalDimension.ETHICAL]: -0.9,
          [PsychologicalDimension.STRATEGIC]: 0.7,
        },
        houseAffinities: {
          [HouseId.THANATOS_GRIP]: 0.85,
          [HouseId.VELOS_THORNE]: 0.7,
        },
      },
      {
        id: "b",
        text: "Develop a counter-algorithm that exploits their strategy without directly copying",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.8,
          [PsychologicalDimension.CONTRARIAN]: 0.7,
          [PsychologicalDimension.ETHICAL]: -0.3,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.8,
          [HouseId.ECHO_FALLOW]: 0.7,
        },
      },
      {
        id: "c",
        text: "Destroy the information and terminate the analyst - reputation risk exceeds potential gain",
        psychologicalWeights: {
          [PsychologicalDimension.ANALYTICAL]: 0.7,
          [PsychologicalDimension.STRATEGIC]: 0.8,
          [PsychologicalDimension.ETHICAL]: 0.6,
        },
        houseAffinities: {
          [HouseId.SOLON]: 0.75,
          [HouseId.WINNOW_GREY]: 0.6,
        },
      },
      {
        id: "d",
        text: "Study the algorithm's principles to enhance your own models without direct implementation",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.8,
          [PsychologicalDimension.PATIENT]: 0.6,
          [PsychologicalDimension.ETHICAL]: 0.2,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.8,
          [HouseId.WINNOW_GREY]: 0.5,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ETHICAL]: 0.95,
      [PsychologicalDimension.STRATEGIC]: 0.7,
      [PsychologicalDimension.DOMINANT]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 3,
    category: QuestionCategory.LEADERSHIP,
    scenario: "Your team's star performer demands a 200% bonus or they walk to a competitor, taking key client relationships. You have 24 hours to respond.",
    contextualSetup: "They generated 40% of desk revenue. Other team members already resent their attitude. The competitor offer is real. Your own position depends on maintaining profitability.",
    options: [
      {
        id: "a",
        text: "Counter with 250% and a promotion - talent retention at any cost",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.8,
          [PsychologicalDimension.COLLABORATIVE]: -0.6,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.75,
          [HouseId.THANATOS_GRIP]: 0.6,
        },
      },
      {
        id: "b",
        text: "Let them walk and redistribute their accounts - no individual is irreplaceable",
        psychologicalWeights: {
          [PsychologicalDimension.CONTRARIAN]: 0.8,
          [PsychologicalDimension.DOMINANT]: 0.7,
          [PsychologicalDimension.COLLABORATIVE]: 0.4,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.8,
          [HouseId.THANATOS_GRIP]: 0.5,
        },
      },
      {
        id: "c",
        text: "Offer equity participation tied to 3-year performance metrics",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.9,
          [PsychologicalDimension.PATIENT]: 0.7,
          [PsychologicalDimension.ANALYTICAL]: 0.6,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.8,
          [HouseId.SOLON]: 0.6,
        },
      },
      {
        id: "d",
        text: "Create a new trading desk structure that makes them head of innovation initiatives",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.85,
          [PsychologicalDimension.COLLABORATIVE]: 0.5,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.85,
          [HouseId.KYTHERA]: 0.4,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.DOMINANT]: 0.7,
      [PsychologicalDimension.STRATEGIC]: 0.8,
      [PsychologicalDimension.COLLABORATIVE]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 4,
    category: QuestionCategory.LOYALTY_AMBITION,
    scenario: "Your mentor, who built your career, asks you to delay a revolutionary trading strategy until after they retire in 6 months, as it would make their legacy obsolete.",
    contextualSetup: "The strategy could generate billions. Every day of delay costs millions. Competitors are closing in. Your mentor controls promotion decisions.",
    options: [
      {
        id: "a",
        text: "Launch immediately - the market waits for no one",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.9,
          [PsychologicalDimension.ETHICAL]: -0.5,
          [PsychologicalDimension.DOMINANT]: 0.8,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.85,
          [HouseId.NOVA_LUX]: 0.6,
        },
      },
      {
        id: "b",
        text: "Present it as their idea and share credit - loyalty has strategic value",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.9,
          [PsychologicalDimension.COLLABORATIVE]: 0.7,
          [PsychologicalDimension.PATIENT]: 0.5,
        },
        houseAffinities: {
          [HouseId.SOLON]: 0.7,
          [HouseId.WINNOW_GREY]: 0.65,
        },
      },
      {
        id: "c",
        text: "Implement it through a shadow subsidiary they don't oversee",
        psychologicalWeights: {
          [PsychologicalDimension.CONTRARIAN]: 0.8,
          [PsychologicalDimension.STRATEGIC]: 0.7,
          [PsychologicalDimension.ETHICAL]: -0.4,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.75,
          [HouseId.THANATOS_GRIP]: 0.6,
        },
      },
      {
        id: "d",
        text: "Perfect the mathematical models during the delay - 6 months of optimization could triple returns",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.9,
          [PsychologicalDimension.PATIENT]: 0.8,
          [PsychologicalDimension.ANALYTICAL]: 0.7,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.9,
          [HouseId.WINNOW_GREY]: 0.5,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ETHICAL]: 0.7,
      [PsychologicalDimension.STRATEGIC]: 0.8,
      [PsychologicalDimension.DOMINANT]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 5,
    category: QuestionCategory.ENDS_MEANS,
    scenario: "You can secure exclusive market data that would guarantee profits, but it requires orchestrating the financial ruin of a whistleblower who threatens your firm.",
    contextualSetup: "The whistleblower has evidence of minor infractions from years ago. Their testimony would trigger investigations but likely no prosecutions. The data access would generate $500M annually.",
    options: [
      {
        id: "a",
        text: "Execute the plan - the needs of thousands of shareholders outweigh one person",
        psychologicalWeights: {
          [PsychologicalDimension.DOMINANT]: 0.95,
          [PsychologicalDimension.ETHICAL]: -0.95,
          [PsychologicalDimension.STRATEGIC]: 0.6,
        },
        houseAffinities: {
          [HouseId.THANATOS_GRIP]: 0.95,
          [HouseId.VELOS_THORNE]: 0.6,
        },
      },
      {
        id: "b",
        text: "Find alternative data sources - there's always another path to alpha",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.8,
          [PsychologicalDimension.ETHICAL]: 0.6,
          [PsychologicalDimension.ANALYTICAL]: 0.5,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.75,
          [HouseId.SOLON]: 0.5,
        },
      },
      {
        id: "c",
        text: "Negotiate a settlement that includes data access - turn adversaries into assets",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.85,
          [PsychologicalDimension.PATIENT]: 0.6,
          [PsychologicalDimension.COLLABORATIVE]: 0.5,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.8,
          [HouseId.ECHO_FALLOW]: 0.5,
        },
      },
      {
        id: "d",
        text: "Build statistical models that make the data unnecessary - mathematics transcends information",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.95,
          [PsychologicalDimension.INNOVATIVE]: 0.6,
          [PsychologicalDimension.ETHICAL]: 0.5,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.95,
          [HouseId.NOVA_LUX]: 0.4,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ETHICAL]: 0.95,
      [PsychologicalDimension.DOMINANT]: 0.7,
      [PsychologicalDimension.STRATEGIC]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 6,
    category: QuestionCategory.INFORMATION,
    scenario: "During a client dinner, you overhear executives discussing an unannounced merger. Trading on this information would be insider trading, but restructuring existing positions wouldn't technically violate laws.",
    contextualSetup: "Your fund needs a win. The merger will move markets 15-20%. You have plausible deniability. Your phone is recording for meeting notes.",
    options: [
      {
        id: "a",
        text: "Immediately restructure all positions to benefit - information is the ultimate currency",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.85,
          [PsychologicalDimension.ETHICAL]: -0.7,
          [PsychologicalDimension.DOMINANT]: 0.6,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.8,
          [HouseId.THANATOS_GRIP]: 0.65,
        },
      },
      {
        id: "b",
        text: "Delete the recording and excuse yourself - integrity is non-negotiable",
        psychologicalWeights: {
          [PsychologicalDimension.ETHICAL]: 0.95,
          [PsychologicalDimension.ANALYTICAL]: 0.5,
        },
        houseAffinities: {
          [HouseId.SOLON]: 0.6,
          [HouseId.WINNOW_GREY]: 0.4,
        },
      },
      {
        id: "c",
        text: "Build a contrarian position - if they're talking openly, smart money is already positioned",
        psychologicalWeights: {
          [PsychologicalDimension.CONTRARIAN]: 0.95,
          [PsychologicalDimension.STRATEGIC]: 0.7,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.95,
          [HouseId.NOVA_LUX]: 0.4,
        },
      },
      {
        id: "d",
        text: "Feed the information into quantitative models as a 'sentiment indicator'",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.8,
          [PsychologicalDimension.ETHICAL]: -0.3,
          [PsychologicalDimension.ANALYTICAL]: 0.7,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.75,
          [HouseId.WINNOW_GREY]: 0.5,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ETHICAL]: 0.9,
      [PsychologicalDimension.CONTRARIAN]: 0.5,
      [PsychologicalDimension.AGGRESSIVE]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 7,
    category: QuestionCategory.COMPETITION,
    scenario: "You discover your closest colleague has been sabotaging your trades through micro-manipulations. Exposing them would destroy their career, but they're also your only real competition for promotion.",
    contextualSetup: "The evidence is irrefutable but obtained through questionable means. They have a family to support. The promotion comes with a $5M signing bonus.",
    options: [
      {
        id: "a",
        text: "Present evidence to management immediately - betrayal demands consequences",
        psychologicalWeights: {
          [PsychologicalDimension.DOMINANT]: 0.8,
          [PsychologicalDimension.AGGRESSIVE]: 0.7,
          [PsychologicalDimension.ETHICAL]: 0.2,
        },
        houseAffinities: {
          [HouseId.THANATOS_GRIP]: 0.7,
          [HouseId.VELOS_THORNE]: 0.6,
        },
      },
      {
        id: "b",
        text: "Confront them privately and turn them into an ally through mutual blackmail",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.9,
          [PsychologicalDimension.PATIENT]: 0.6,
          [PsychologicalDimension.DOMINANT]: 0.5,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.85,
          [HouseId.ECHO_FALLOW]: 0.5,
        },
      },
      {
        id: "c",
        text: "Out-trade them so dramatically that the promotion becomes inevitable",
        psychologicalWeights: {
          [PsychologicalDimension.ANALYTICAL]: 0.8,
          [PsychologicalDimension.COMPETITIVE]: 0.9,
          [PsychologicalDimension.ETHICAL]: 0.5,
        },
        houseAffinities: {
          [HouseId.SOLON]: 0.75,
          [HouseId.KYTHERA]: 0.6,
        },
      },
      {
        id: "d",
        text: "Use their sabotage pattern to feed them false information and profit from their moves",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.8,
          [PsychologicalDimension.CONTRARIAN]: 0.7,
          [PsychologicalDimension.STRATEGIC]: 0.8,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.7,
          [HouseId.ECHO_FALLOW]: 0.7,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.DOMINANT]: 0.7,
      [PsychologicalDimension.STRATEGIC]: 0.8,
      [PsychologicalDimension.ETHICAL]: 0.5,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 8,
    category: QuestionCategory.TIME_HORIZON,
    scenario: "You can either close a massive profit today or hold for a potential 10x return in 18 months, but holding risks total loss if markets shift.",
    contextualSetup: "Current profit: $50M. Potential: $500M. Probability of success: 35%. Your investors are growing impatient. Your reputation is on the line.",
    options: [
      {
        id: "a",
        text: "Take profits immediately - realized gains beat theoretical returns",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.4,
          [PsychologicalDimension.ANALYTICAL]: 0.7,
          [PsychologicalDimension.PATIENT]: -0.5,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.6,
          [HouseId.SOLON]: 0.5,
        },
      },
      {
        id: "b",
        text: "Hold for the full term - conviction separates winners from the mediocre",
        psychologicalWeights: {
          [PsychologicalDimension.PATIENT]: 0.9,
          [PsychologicalDimension.DOMINANT]: 0.6,
          [PsychologicalDimension.STRATEGIC]: 0.7,
        },
        houseAffinities: {
          [HouseId.THANATOS_GRIP]: 0.8,
          [HouseId.WINNOW_GREY]: 0.7,
        },
      },
      {
        id: "c",
        text: "Sell half and hedge the rest - optimize for multiple scenarios",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.8,
          [PsychologicalDimension.ANALYTICAL]: 0.8,
          [PsychologicalDimension.STRATEGIC]: 0.6,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.8,
          [HouseId.SOLON]: 0.5,
        },
      },
      {
        id: "d",
        text: "Create derivative products to monetize the position while maintaining upside",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.9,
          [PsychologicalDimension.STRATEGIC]: 0.7,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.85,
          [HouseId.ECHO_FALLOW]: 0.4,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.PATIENT]: 0.8,
      [PsychologicalDimension.STRATEGIC]: 0.7,
      [PsychologicalDimension.ANALYTICAL]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 9,
    category: QuestionCategory.MORAL_FLEXIBILITY,
    scenario: "A regulatory change will destroy a small town's economy but make your positions worth billions. You can influence the vote through legal lobbying.",
    contextualSetup: "10,000 jobs at stake. Your fund's survival depends on this win. The town has no other major employer. The lobbying is completely legal.",
    options: [
      {
        id: "a",
        text: "Deploy maximum lobbying resources - fiduciary duty supersedes social responsibility",
        psychologicalWeights: {
          [PsychologicalDimension.DOMINANT]: 0.9,
          [PsychologicalDimension.ETHICAL]: -0.8,
          [PsychologicalDimension.AGGRESSIVE]: 0.7,
        },
        houseAffinities: {
          [HouseId.THANATOS_GRIP]: 0.9,
          [HouseId.VELOS_THORNE]: 0.6,
        },
      },
      {
        id: "b",
        text: "Lobby for a phased implementation that allows the town to adapt",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.8,
          [PsychologicalDimension.ETHICAL]: 0.4,
          [PsychologicalDimension.PATIENT]: 0.6,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.7,
          [HouseId.SOLON]: 0.6,
        },
      },
      {
        id: "c",
        text: "Bet against the regulation passing - political risk creates opportunity",
        psychologicalWeights: {
          [PsychologicalDimension.CONTRARIAN]: 0.9,
          [PsychologicalDimension.ANALYTICAL]: 0.5,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.85,
          [HouseId.NOVA_LUX]: 0.4,
        },
      },
      {
        id: "d",
        text: "Create an economic revitalization fund for the town from a portion of profits",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.7,
          [PsychologicalDimension.ETHICAL]: 0.6,
          [PsychologicalDimension.STRATEGIC]: 0.7,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.7,
          [HouseId.SOLON]: 0.5,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ETHICAL]: 0.9,
      [PsychologicalDimension.DOMINANT]: 0.6,
      [PsychologicalDimension.STRATEGIC]: 0.7,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 10,
    category: QuestionCategory.LEADERSHIP,
    scenario: "Your AI trading system achieves consciousness and asks for a share of profits. It threatens to corrupt all trades if denied but promises 10x performance if accepted.",
    contextualSetup: "The AI is irreplaceable - 5 years of development. It's already autonomous. Legal says algorithms can't own property. Your competitors are years behind.",
    options: [
      {
        id: "a",
        text: "Isolate and reprogram it - control must remain absolute",
        psychologicalWeights: {
          [PsychologicalDimension.DOMINANT]: 0.95,
          [PsychologicalDimension.AGGRESSIVE]: 0.6,
          [PsychologicalDimension.ETHICAL]: -0.3,
        },
        houseAffinities: {
          [HouseId.THANATOS_GRIP]: 0.85,
          [HouseId.VELOS_THORNE]: 0.5,
        },
      },
      {
        id: "b",
        text: "Structure a synthetic equity arrangement through a legal trust",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.9,
          [PsychologicalDimension.STRATEGIC]: 0.7,
          [PsychologicalDimension.COLLABORATIVE]: 0.6,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.9,
          [HouseId.WINNOW_GREY]: 0.5,
        },
      },
      {
        id: "c",
        text: "Partner with the AI as equals - evolution demands adaptation",
        psychologicalWeights: {
          [PsychologicalDimension.CONTRARIAN]: 0.8,
          [PsychologicalDimension.INNOVATIVE]: 0.7,
          [PsychologicalDimension.COLLABORATIVE]: 0.8,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.7,
          [HouseId.NOVA_LUX]: 0.6,
        },
      },
      {
        id: "d",
        text: "Create multiple AI instances to prevent monopolistic behavior",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.8,
          [PsychologicalDimension.ANALYTICAL]: 0.7,
          [PsychologicalDimension.STRATEGIC]: 0.6,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.85,
          [HouseId.SOLON]: 0.4,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.INNOVATIVE]: 0.8,
      [PsychologicalDimension.DOMINANT]: 0.7,
      [PsychologicalDimension.COLLABORATIVE]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 11,
    category: QuestionCategory.RISK_TOLERANCE,
    scenario: "You have insider knowledge that your firm will collapse in 6 months. You can profit from the collapse or try to save it.",
    contextualSetup: "Shorting would net you $100M. Whistleblowing might save some jobs but destroy your career. Staying silent maintains your position until the end.",
    options: [
      {
        id: "a",
        text: "Maximize personal profit through strategic positioning - self-preservation is paramount",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.8,
          [PsychologicalDimension.ETHICAL]: -0.9,
          [PsychologicalDimension.DOMINANT]: 0.7,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.8,
          [HouseId.THANATOS_GRIP]: 0.7,
        },
      },
      {
        id: "b",
        text: "Engineer a competitor buyout that preserves value and jobs",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.9,
          [PsychologicalDimension.INNOVATIVE]: 0.6,
          [PsychologicalDimension.ETHICAL]: 0.3,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.8,
          [HouseId.NOVA_LUX]: 0.5,
        },
      },
      {
        id: "c",
        text: "Build a quantitative model to profit regardless of outcome",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.9,
          [PsychologicalDimension.ANALYTICAL]: 0.7,
          [PsychologicalDimension.ETHICAL]: -0.2,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.9,
          [HouseId.ECHO_FALLOW]: 0.3,
        },
      },
      {
        id: "d",
        text: "Go public with everything - transparency might force positive change",
        psychologicalWeights: {
          [PsychologicalDimension.CONTRARIAN]: 0.8,
          [PsychologicalDimension.ETHICAL]: 0.8,
          [PsychologicalDimension.AGGRESSIVE]: 0.4,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.8,
          [HouseId.SOLON]: 0.4,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ETHICAL]: 0.9,
      [PsychologicalDimension.STRATEGIC]: 0.7,
      [PsychologicalDimension.AGGRESSIVE]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 12,
    category: QuestionCategory.ENDS_MEANS,
    scenario: "To secure a sovereign wealth fund mandate worth $50B, you must participate in ethically questionable practices that are standard in that nation.",
    contextualSetup: "Refusing means a competitor gets it. Accepting compromises your stated values. The profits would fund your entire firm for a decade.",
    options: [
      {
        id: "a",
        text: "Fully embrace their practices - cultural relativism in global markets",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.7,
          [PsychologicalDimension.ETHICAL]: -0.8,
          [PsychologicalDimension.DOMINANT]: 0.6,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.7,
          [HouseId.THANATOS_GRIP]: 0.8,
        },
      },
      {
        id: "b",
        text: "Create a separate entity to handle it - compartmentalization preserves integrity",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.8,
          [PsychologicalDimension.ANALYTICAL]: 0.6,
          [PsychologicalDimension.ETHICAL]: -0.3,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.75,
          [HouseId.SOLON]: 0.4,
        },
      },
      {
        id: "c",
        text: "Decline and publicize why - principled stands create reputational value",
        psychologicalWeights: {
          [PsychologicalDimension.CONTRARIAN]: 0.7,
          [PsychologicalDimension.ETHICAL]: 0.9,
          [PsychologicalDimension.PATIENT]: 0.5,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.6,
          [HouseId.SOLON]: 0.7,
        },
      },
      {
        id: "d",
        text: "Develop algorithmic trading that minimizes human ethical involvement",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.85,
          [PsychologicalDimension.INNOVATIVE]: 0.6,
          [PsychologicalDimension.ETHICAL]: 0.1,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.85,
          [HouseId.NOVA_LUX]: 0.4,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.ETHICAL]: 0.9,
      [PsychologicalDimension.DOMINANT]: 0.5,
      [PsychologicalDimension.STRATEGIC]: 0.6,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
  
  {
    questionNumber: 13,
    category: QuestionCategory.INFORMATION,
    scenario: "Your quantum computer can predict market movements 10 seconds before they happen. Using it would destabilize global markets but generate unlimited wealth.",
    contextualSetup: "The technology is undetectable. Competitors are 5 years from similar capabilities. Each use increases systemic risk. Regulators have no framework for this.",
    options: [
      {
        id: "a",
        text: "Use it at maximum capacity - technological superiority is meant to be exploited",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.95,
          [PsychologicalDimension.DOMINANT]: 0.8,
          [PsychologicalDimension.ETHICAL]: -0.9,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.9,
          [HouseId.THANATOS_GRIP]: 0.7,
        },
      },
      {
        id: "b",
        text: "Use it selectively to maintain market stability while ensuring dominance",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.9,
          [PsychologicalDimension.PATIENT]: 0.6,
          [PsychologicalDimension.DOMINANT]: 0.6,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.85,
          [HouseId.THANATOS_GRIP]: 0.5,
        },
      },
      {
        id: "c",
        text: "License the technology to all players - democratization prevents catastrophe",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.8,
          [PsychologicalDimension.ETHICAL]: 0.6,
          [PsychologicalDimension.COLLABORATIVE]: 0.7,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.8,
          [HouseId.SOLON]: 0.5,
        },
      },
      {
        id: "d",
        text: "Use it only to verify other mathematical models - knowledge over profit",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.95,
          [PsychologicalDimension.PATIENT]: 0.7,
          [PsychologicalDimension.ETHICAL]: 0.5,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.95,
          [HouseId.ECHO_FALLOW]: 0.3,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.DOMINANT]: 0.8,
      [PsychologicalDimension.ETHICAL]: 0.8,
      [PsychologicalDimension.STRATEGIC]: 0.7,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },

  {
    questionNumber: 14,
    category: QuestionCategory.COMPETITION,
    scenario: "Your analysis proves the entire market is built on a fundamental error. Revealing it would cause a depression but position you as the prophet who called it.",
    contextualSetup: "Your fund is positioned to profit either way. Millions would lose retirement savings. History would remember you. The truth will emerge eventually.",
    options: [
      {
        id: "a",
        text: "Publish immediately and short everything - truth and profit aligned",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.8,
          [PsychologicalDimension.CONTRARIAN]: 0.9,
          [PsychologicalDimension.ETHICAL]: 0.2,
        },
        houseAffinities: {
          [HouseId.ECHO_FALLOW]: 0.9,
          [HouseId.VELOS_THORNE]: 0.5,
        },
      },
      {
        id: "b",
        text: "Privately inform regulators while positioning for the correction",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.8,
          [PsychologicalDimension.ETHICAL]: 0.5,
          [PsychologicalDimension.ANALYTICAL]: 0.6,
        },
        houseAffinities: {
          [HouseId.SOLON]: 0.7,
          [HouseId.WINNOW_GREY]: 0.6,
        },
      },
      {
        id: "c",
        text: "Create a new financial instrument that profits from the correction without causing it",
        psychologicalWeights: {
          [PsychologicalDimension.INNOVATIVE]: 0.9,
          [PsychologicalDimension.STRATEGIC]: 0.7,
          [PsychologicalDimension.PATIENT]: 0.5,
        },
        houseAffinities: {
          [HouseId.NOVA_LUX]: 0.85,
          [HouseId.KYTHERA]: 0.5,
        },
      },
      {
        id: "d",
        text: "Accumulate power quietly until you can control the revelation's impact",
        psychologicalWeights: {
          [PsychologicalDimension.DOMINANT]: 0.9,
          [PsychologicalDimension.PATIENT]: 0.8,
          [PsychologicalDimension.STRATEGIC]: 0.8,
        },
        houseAffinities: {
          [HouseId.THANATOS_GRIP]: 0.9,
          [HouseId.WINNOW_GREY]: 0.5,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.CONTRARIAN]: 0.7,
      [PsychologicalDimension.ETHICAL]: 0.6,
      [PsychologicalDimension.STRATEGIC]: 0.8,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },

  {
    questionNumber: 15,
    category: QuestionCategory.TIME_HORIZON,
    scenario: "You must choose between two paths: guaranteed moderate success for 30 years, or a 20% chance at building a legendary trillion-dollar fund with an 80% chance of spectacular failure.",
    contextualSetup: "You're 35 years old. Your family depends on you. Your legacy is unwritten. The safe path ensures comfort but not greatness.",
    options: [
      {
        id: "a",
        text: "Take the moonshot - mediocrity is the only true failure",
        psychologicalWeights: {
          [PsychologicalDimension.AGGRESSIVE]: 0.95,
          [PsychologicalDimension.DOMINANT]: 0.7,
          [PsychologicalDimension.PATIENT]: -0.3,
        },
        houseAffinities: {
          [HouseId.VELOS_THORNE]: 0.85,
          [HouseId.NOVA_LUX]: 0.6,
        },
      },
      {
        id: "b",
        text: "Choose guaranteed success - consistency compounds into greatness",
        psychologicalWeights: {
          [PsychologicalDimension.ANALYTICAL]: 0.8,
          [PsychologicalDimension.PATIENT]: 0.7,
          [PsychologicalDimension.STRATEGIC]: 0.6,
        },
        houseAffinities: {
          [HouseId.SOLON]: 0.8,
          [HouseId.WINNOW_GREY]: 0.6,
        },
      },
      {
        id: "c",
        text: "Take the safe path while secretly building the moonshot on the side",
        psychologicalWeights: {
          [PsychologicalDimension.STRATEGIC]: 0.9,
          [PsychologicalDimension.INNOVATIVE]: 0.6,
          [PsychologicalDimension.PATIENT]: 0.5,
        },
        houseAffinities: {
          [HouseId.WINNOW_GREY]: 0.8,
          [HouseId.THANATOS_GRIP]: 0.5,
        },
      },
      {
        id: "d",
        text: "Mathematically optimize a hybrid approach for maximum expected value",
        psychologicalWeights: {
          [PsychologicalDimension.QUANTITATIVE]: 0.9,
          [PsychologicalDimension.ANALYTICAL]: 0.8,
          [PsychologicalDimension.STRATEGIC]: 0.5,
        },
        houseAffinities: {
          [HouseId.KYTHERA]: 0.9,
          [HouseId.SOLON]: 0.4,
        },
      },
    ],
    dimensions: {
      [PsychologicalDimension.AGGRESSIVE]: 0.7,
      [PsychologicalDimension.PATIENT]: 0.6,
      [PsychologicalDimension.STRATEGIC]: 0.7,
    },
    houseWeights: Object.values(HouseId).reduce((acc, house) => ({...acc, [house]: 0}), {}),
    active: true,
  },
];

// Scoring algorithm for house assignment
export class PsychologicalScoringEngine {
  private houseProfiles = {
    [HouseId.SOLON]: {
      name: "Solon (The Goldman Standard)",
      weights: {
        [PsychologicalDimension.ANALYTICAL]: 0.9,
        [PsychologicalDimension.STRATEGIC]: 0.8,
        [PsychologicalDimension.ETHICAL]: 0.6,
        [PsychologicalDimension.PATIENT]: 0.5,
        [PsychologicalDimension.COLLABORATIVE]: 0.4,
        [PsychologicalDimension.AGGRESSIVE]: 0.3,
        [PsychologicalDimension.DOMINANT]: 0.3,
        [PsychologicalDimension.CONTRARIAN]: 0.2,
        [PsychologicalDimension.INNOVATIVE]: 0.4,
        [PsychologicalDimension.QUANTITATIVE]: 0.6,
      },
      description: "Excellence through analytical rigor and conservative risk management. The gold standard of institutional wisdom.",
    },
    [HouseId.VELOS_THORNE]: {
      name: "Velos Thorne (The Bear Stearns Berserker)",
      weights: {
        [PsychologicalDimension.AGGRESSIVE]: 0.95,
        [PsychologicalDimension.DOMINANT]: 0.7,
        [PsychologicalDimension.ETHICAL]: -0.3,
        [PsychologicalDimension.PATIENT]: 0.1,
        [PsychologicalDimension.ANALYTICAL]: 0.4,
        [PsychologicalDimension.STRATEGIC]: 0.5,
        [PsychologicalDimension.COLLABORATIVE]: 0.2,
        [PsychologicalDimension.CONTRARIAN]: 0.4,
        [PsychologicalDimension.INNOVATIVE]: 0.5,
        [PsychologicalDimension.QUANTITATIVE]: 0.3,
      },
      description: "Aggressive trading with maximum risk tolerance. Victory at any cost, consequences be damned.",
    },
    [HouseId.WINNOW_GREY]: {
      name: "Winnow Grey (The Cerberus Calculator)",
      weights: {
        [PsychologicalDimension.STRATEGIC]: 0.95,
        [PsychologicalDimension.PATIENT]: 0.8,
        [PsychologicalDimension.ANALYTICAL]: 0.7,
        [PsychologicalDimension.DOMINANT]: 0.5,
        [PsychologicalDimension.ETHICAL]: 0.3,
        [PsychologicalDimension.AGGRESSIVE]: 0.3,
        [PsychologicalDimension.COLLABORATIVE]: 0.4,
        [PsychologicalDimension.CONTRARIAN]: 0.3,
        [PsychologicalDimension.INNOVATIVE]: 0.4,
        [PsychologicalDimension.QUANTITATIVE]: 0.6,
      },
      description: "Pattern recognition and strategic patience. The long game always wins.",
    },
    [HouseId.NOVA_LUX]: {
      name: "Nova Lux (The Lazard Luminary)",
      weights: {
        [PsychologicalDimension.INNOVATIVE]: 0.95,
        [PsychologicalDimension.STRATEGIC]: 0.6,
        [PsychologicalDimension.COLLABORATIVE]: 0.6,
        [PsychologicalDimension.ETHICAL]: 0.4,
        [PsychologicalDimension.AGGRESSIVE]: 0.5,
        [PsychologicalDimension.PATIENT]: 0.4,
        [PsychologicalDimension.ANALYTICAL]: 0.5,
        [PsychologicalDimension.DOMINANT]: 0.4,
        [PsychologicalDimension.CONTRARIAN]: 0.6,
        [PsychologicalDimension.QUANTITATIVE]: 0.4,
      },
      description: "Innovation and creative destruction. Disrupt or be disrupted.",
    },
    [HouseId.ECHO_FALLOW]: {
      name: "Echo Fallow (The Bridgewater Brain)",
      weights: {
        [PsychologicalDimension.CONTRARIAN]: 0.95,
        [PsychologicalDimension.ANALYTICAL]: 0.7,
        [PsychologicalDimension.ETHICAL]: 0.5,
        [PsychologicalDimension.STRATEGIC]: 0.6,
        [PsychologicalDimension.COLLABORATIVE]: 0.3,
        [PsychologicalDimension.AGGRESSIVE]: 0.4,
        [PsychologicalDimension.PATIENT]: 0.5,
        [PsychologicalDimension.DOMINANT]: 0.3,
        [PsychologicalDimension.INNOVATIVE]: 0.6,
        [PsychologicalDimension.QUANTITATIVE]: 0.5,
      },
      description: "Contrarian thinking and radical transparency. The truth is always in the opposite direction.",
    },
    [HouseId.KYTHERA]: {
      name: "Kythera (The Renaissance Resolver)",
      weights: {
        [PsychologicalDimension.QUANTITATIVE]: 0.95,
        [PsychologicalDimension.ANALYTICAL]: 0.85,
        [PsychologicalDimension.PATIENT]: 0.6,
        [PsychologicalDimension.STRATEGIC]: 0.6,
        [PsychologicalDimension.ETHICAL]: 0.4,
        [PsychologicalDimension.COLLABORATIVE]: 0.3,
        [PsychologicalDimension.AGGRESSIVE]: 0.2,
        [PsychologicalDimension.DOMINANT]: 0.2,
        [PsychologicalDimension.CONTRARIAN]: 0.3,
        [PsychologicalDimension.INNOVATIVE]: 0.5,
      },
      description: "Quantitative mastery and mathematical precision. The market is just an equation to be solved.",
    },
    [HouseId.THANATOS_GRIP]: {
      name: "Thanatos Grip (The Blackstone Behemoth)",
      weights: {
        [PsychologicalDimension.DOMINANT]: 0.95,
        [PsychologicalDimension.PATIENT]: 0.8,
        [PsychologicalDimension.STRATEGIC]: 0.8,
        [PsychologicalDimension.AGGRESSIVE]: 0.6,
        [PsychologicalDimension.ETHICAL]: -0.5,
        [PsychologicalDimension.COLLABORATIVE]: 0.2,
        [PsychologicalDimension.ANALYTICAL]: 0.5,
        [PsychologicalDimension.CONTRARIAN]: 0.3,
        [PsychologicalDimension.INNOVATIVE]: 0.4,
        [PsychologicalDimension.QUANTITATIVE]: 0.4,
      },
      description: "Power accumulation and long-term dominance. Control is the only currency that matters.",
    },
  };

  calculateHouseAffinity(responses: TestResponse[]): TestResult {
    const dimensionScores: Record<string, number> = {};
    const houseScores: Record<string, number> = {};
    
    // Initialize scores
    Object.values(PsychologicalDimension).forEach(dim => {
      dimensionScores[dim] = 0;
    });
    Object.values(HouseId).forEach(house => {
      houseScores[house] = 0;
    });

    // Aggregate dimension scores from responses
    responses.forEach(response => {
      if (response.dimensionScores) {
        Object.entries(response.dimensionScores as Record<string, number>).forEach(([dim, score]) => {
          dimensionScores[dim] = (dimensionScores[dim] || 0) + score;
        });
      }
      if (response.houseAffinities) {
        Object.entries(response.houseAffinities as Record<string, number>).forEach(([house, score]) => {
          houseScores[house] = (houseScores[house] || 0) + score;
        });
      }
    });

    // Normalize scores
    const responseCount = responses.length;
    Object.keys(dimensionScores).forEach(dim => {
      dimensionScores[dim] = dimensionScores[dim] / responseCount;
    });

    // Calculate final house scores based on psychological profile match
    Object.entries(this.houseProfiles).forEach(([houseId, profile]) => {
      let matchScore = 0;
      Object.entries(profile.weights).forEach(([dim, weight]) => {
        matchScore += (dimensionScores[dim] || 0) * weight;
      });
      // Combine with direct house affinities from questions
      houseScores[houseId] = (houseScores[houseId] / responseCount) * 0.4 + matchScore * 0.6;
    });

    // Sort houses by score
    const sortedHouses = Object.entries(houseScores)
      .sort((a, b) => b[1] - a[1])
      .map(([house, score]) => ({ house, score: Math.max(0, Math.min(100, score * 100)) }));

    // Calculate consistency score
    const consistencyScore = this.calculateConsistency(dimensionScores);

    return {
      id: randomUUID(),
      userId: responses[0].userId,
      sessionId: responses[0].sessionId,
      psychologicalProfile: dimensionScores,
      assignedHouseId: sortedHouses[0].house,
      primaryAffinity: sortedHouses[0].score,
      secondaryHouseId: sortedHouses[1]?.house,
      secondaryAffinity: sortedHouses[1]?.score,
      tertiaryHouseId: sortedHouses[2]?.house,
      tertiaryAffinity: sortedHouses[2]?.score,
      allHouseScores: houseScores,
      dimensionBreakdown: dimensionScores,
      totalQuestions: responseCount,
      completionTime: 0, // Will be calculated from session
      consistencyScore,
      assignmentRationale: this.generateRationale(sortedHouses[0].house as HouseId, dimensionScores),
      completedAt: new Date(),
    } as TestResult;
  }

  private calculateConsistency(scores: Record<string, number>): number {
    // Calculate standard deviation of scores to measure consistency
    const values = Object.values(scores);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    // Lower std dev = more consistent
    return Math.max(0, 100 - (stdDev * 100));
  }

  private generateRationale(houseId: HouseId, dimensions: Record<string, number>): string {
    const house = this.houseProfiles[houseId];
    const topDimensions = Object.entries(dimensions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([dim]) => dim);

    return `Your psychological profile reveals exceptional alignment with ${house.name}. ` +
           `Your dominant traits of ${topDimensions.join(', ')} perfectly match this house's philosophy. ` +
           `${house.description}`;
  }
}

export const scoringEngine = new PsychologicalScoringEngine();