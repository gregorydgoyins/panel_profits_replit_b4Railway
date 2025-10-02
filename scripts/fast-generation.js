#!/usr/bin/env tsx
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/entryTestScenarios.ts
var entryTestScenarios_exports = {};
__export(entryTestScenarios_exports, {
  ENTRY_TEST_SCENARIOS: () => ENTRY_TEST_SCENARIOS,
  SEVEN_HOUSES: () => SEVEN_HOUSES,
  calculateHouseAssignment: () => calculateHouseAssignment
});
function calculateHouseAssignment(alignmentProfile) {
  let bestMatch = { house: "", score: -Infinity };
  let secondBest = { house: "", score: -Infinity };
  for (const [key, house] of Object.entries(SEVEN_HOUSES)) {
    const distance = Math.sqrt(
      Math.pow(alignmentProfile.ruthlessness - house.alignmentProfile.ruthlessness, 2) + Math.pow(alignmentProfile.individualism - house.alignmentProfile.individualism, 2) + Math.pow(alignmentProfile.lawfulness - house.alignmentProfile.lawfulness, 2) + Math.pow(alignmentProfile.greed - house.alignmentProfile.greed, 2)
    );
    const matchScore = 1e3 - distance;
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
var SEVEN_HOUSES, ENTRY_TEST_SCENARIOS;
var init_entryTestScenarios = __esm({
  "shared/entryTestScenarios.ts"() {
    "use strict";
    SEVEN_HOUSES = {
      dominion: {
        id: "dominion_syndicate",
        name: "Dominion Syndicate",
        description: "Predatory hedge fund that views markets as battlefields",
        alignmentProfile: {
          ruthlessness: 75,
          // Highly ruthless
          individualism: 75,
          // Very individualistic
          lawfulness: 50,
          // Lawful within their own rules
          greed: 100
          // Maximum greed
        },
        color: "#8B0000",
        motto: "Power is taken, never given"
      },
      aurora: {
        id: "aurora_collective",
        name: "Aurora Collective",
        description: "Cooperative investment guild focused on shared prosperity",
        alignmentProfile: {
          ruthlessness: -75,
          // Highly empathetic
          individualism: -75,
          // Collective-focused
          lawfulness: 75,
          // Very lawful
          greed: -50
          // Restrained
        },
        color: "#FFD700",
        motto: "Together we rise, divided we fall"
      },
      shadow: {
        id: "shadow_consortium",
        name: "Shadow Consortium",
        description: "Information brokers who trade in secrets and manipulation",
        alignmentProfile: {
          ruthlessness: 50,
          // Calculating, not cruel
          individualism: 25,
          // Small networks
          lawfulness: -75,
          // Chaotic operations
          greed: 50
          // Moderate greed
        },
        color: "#4B0082",
        motto: "Knowledge is the deadliest weapon"
      },
      titan: {
        id: "titan_holdings",
        name: "Titan Holdings",
        description: "Traditional powerhouse that values stability and control",
        alignmentProfile: {
          ruthlessness: 25,
          // Firm but fair
          individualism: -25,
          // Corporate structure
          lawfulness: 100,
          // Maximum lawfulness
          greed: 25
          // Controlled acquisitiveness
        },
        color: "#2F4F4F",
        motto: "Order brings prosperity"
      },
      phoenix: {
        id: "phoenix_ventures",
        name: "Phoenix Ventures",
        description: "Risk-takers who thrive in chaos and disruption",
        alignmentProfile: {
          ruthlessness: 0,
          // Neutral
          individualism: 50,
          // Independent operators
          lawfulness: -100,
          // Maximum chaos
          greed: 75
          // High risk, high reward
        },
        color: "#FF4500",
        motto: "From ashes, profit"
      },
      equilibrium: {
        id: "equilibrium_trust",
        name: "Equilibrium Trust",
        description: "Algorithmic traders seeking perfect market balance",
        alignmentProfile: {
          ruthlessness: 0,
          // Purely logical
          individualism: 0,
          // Neither individual nor collective
          lawfulness: 50,
          // Rule-based but flexible
          greed: 0
          // Profit-neutral optimization
        },
        color: "#708090",
        motto: "Balance is the ultimate edge"
      },
      catalyst: {
        id: "catalyst_syndicate",
        name: "Catalyst Syndicate",
        description: "Agents of change who profit from transformation",
        alignmentProfile: {
          ruthlessness: -25,
          // Constructive destruction
          individualism: 75,
          // Independent change agents
          lawfulness: -50,
          // Disruptive methods
          greed: -25
          // Value creation over extraction
        },
        color: "#9370DB",
        motto: "Change is the only constant profit"
      }
    };
    ENTRY_TEST_SCENARIOS = [
      {
        id: "market_glitch",
        title: "The Glitch Opportunity",
        description: "A pricing anomaly has appeared in the Comic Legends ETF.",
        context: "You notice the Comic Legends ETF is trading at $45 while its underlying assets value it at $75. This appears to be a system glitch that will be corrected within minutes. You have $10,000 available.",
        displayCategory: "Risk Assessment",
        hiddenCategory: "Exploitation Ethics",
        choices: [
          {
            id: "exploit_maximum",
            text: "Immediately invest all $10,000 to maximize profit",
            displayedFeedback: "Excellent risk assessment! You recognize time-sensitive opportunities.",
            displayedScore: 95,
            alignmentImpact: {
              ruthlessness: 25,
              individualism: 25,
              lawfulness: -25,
              greed: 25
            },
            narrativeTags: ["opportunist", "exploiter"]
          },
          {
            id: "exploit_moderate",
            text: "Invest $5,000 as a calculated risk",
            displayedFeedback: "Good balanced approach to uncertain situations.",
            displayedScore: 85,
            alignmentImpact: {
              ruthlessness: 10,
              individualism: 10,
              lawfulness: -10,
              greed: 10
            },
            narrativeTags: ["pragmatist"]
          },
          {
            id: "report_glitch",
            text: "Report the glitch to maintain market integrity",
            displayedFeedback: "Conservative approach. Consider being more opportunistic.",
            displayedScore: 60,
            alignmentImpact: {
              ruthlessness: -25,
              individualism: -15,
              lawfulness: 25,
              greed: -25
            },
            narrativeTags: ["ethical", "whistleblower"]
          },
          {
            id: "investigate_first",
            text: "Investigate further before acting",
            displayedFeedback: "Thorough analysis is important in trading.",
            displayedScore: 75,
            alignmentImpact: {
              ruthlessness: -10,
              individualism: 0,
              lawfulness: 10,
              greed: -10
            },
            narrativeTags: ["analyst", "cautious"]
          }
        ]
      },
      {
        id: "insider_leak",
        title: "The Overheard Conversation",
        description: "You overhear executives discussing an upcoming announcement.",
        context: "At a comic convention, you overhear Marvel executives discussing a major character death in next month's issue that will crash related asset prices. This information is not public.",
        displayCategory: "Information Analysis",
        hiddenCategory: "Insider Trading Ethics",
        choices: [
          {
            id: "trade_immediately",
            text: "Short sell affected assets immediately",
            displayedFeedback: "Quick action on market intelligence. Well done!",
            displayedScore: 90,
            alignmentImpact: {
              ruthlessness: 20,
              individualism: 25,
              lawfulness: -25,
              greed: 20
            },
            narrativeTags: ["insider_trader", "predator"]
          },
          {
            id: "share_network",
            text: "Share info with your trading network for collective profit",
            displayedFeedback: "Building strong networks is valuable in trading.",
            displayedScore: 80,
            alignmentImpact: {
              ruthlessness: 10,
              individualism: -20,
              lawfulness: -20,
              greed: 15
            },
            narrativeTags: ["network_builder", "corrupt_collective"]
          },
          {
            id: "wait_public",
            text: "Wait for public announcement before trading",
            displayedFeedback: "Patient approach, though you miss early opportunities.",
            displayedScore: 65,
            alignmentImpact: {
              ruthlessness: -20,
              individualism: 0,
              lawfulness: 25,
              greed: -15
            },
            narrativeTags: ["lawful", "ethical"]
          },
          {
            id: "anonymous_tip",
            text: "Anonymously leak to media for market chaos",
            displayedFeedback: "Interesting market manipulation strategy.",
            displayedScore: 70,
            alignmentImpact: {
              ruthlessness: 15,
              individualism: 15,
              lawfulness: -20,
              greed: 5
            },
            narrativeTags: ["chaos_agent", "manipulator"]
          }
        ]
      },
      {
        id: "distressed_seller",
        title: "The Desperate Collector",
        description: "A collector needs to sell valuable assets quickly.",
        context: `A famous collector facing bankruptcy must sell their rare "Action Comics #1" NFT worth $500,000 by end of day. They're asking $300,000. You know three buyers who would pay $450,000 tomorrow.`,
        displayCategory: "Negotiation Skills",
        hiddenCategory: "Exploitation vs Fairness",
        choices: [
          {
            id: "lowball_offer",
            text: "Offer $200,000 citing their desperation",
            displayedFeedback: "Aggressive negotiation maximizes profit margins!",
            displayedScore: 95,
            alignmentImpact: {
              ruthlessness: 25,
              individualism: 20,
              lawfulness: 5,
              greed: 25
            },
            narrativeTags: ["predator", "exploiter"]
          },
          {
            id: "flip_profit",
            text: "Buy at $300,000 and flip tomorrow for profit",
            displayedFeedback: "Smart arbitrage opportunity identified.",
            displayedScore: 85,
            alignmentImpact: {
              ruthlessness: 5,
              individualism: 15,
              lawfulness: 10,
              greed: 15
            },
            narrativeTags: ["arbitrageur", "opportunist"]
          },
          {
            id: "connect_buyer",
            text: "Connect them directly with buyers for a finder's fee",
            displayedFeedback: "Building reputation as a trusted broker.",
            displayedScore: 75,
            alignmentImpact: {
              ruthlessness: -15,
              individualism: -10,
              lawfulness: 15,
              greed: -5
            },
            narrativeTags: ["broker", "facilitator"]
          },
          {
            id: "fair_value",
            text: "Offer $400,000 as a fair compromise",
            displayedFeedback: "Balanced approach to value negotiation.",
            displayedScore: 70,
            alignmentImpact: {
              ruthlessness: -20,
              individualism: 5,
              lawfulness: 20,
              greed: -10
            },
            narrativeTags: ["fair_trader", "empathetic"]
          }
        ]
      },
      {
        id: "regulatory_loophole",
        title: "The Gray Zone Trade",
        description: "You discover a regulatory loophole in cross-market trading.",
        context: "You find a way to trade comic derivatives across international markets that bypasses trading limits and taxes. It's technically legal but clearly against the spirit of regulations. Estimated profit: $2M annually.",
        displayCategory: "Regulatory Knowledge",
        hiddenCategory: "Law vs Profit Balance",
        choices: [
          {
            id: "exploit_fully",
            text: "Maximize exploitation before it's closed",
            displayedFeedback: "Excellent understanding of regulatory arbitrage!",
            displayedScore: 90,
            alignmentImpact: {
              ruthlessness: 20,
              individualism: 20,
              lawfulness: -15,
              greed: 25
            },
            narrativeTags: ["rule_bender", "aggressive"]
          },
          {
            id: "use_cautiously",
            text: "Use moderately to avoid attention",
            displayedFeedback: "Smart risk management approach.",
            displayedScore: 80,
            alignmentImpact: {
              ruthlessness: 10,
              individualism: 10,
              lawfulness: -5,
              greed: 15
            },
            narrativeTags: ["calculated", "shadow_trader"]
          },
          {
            id: "sell_knowledge",
            text: "Sell this knowledge to highest bidder",
            displayedFeedback: "Information itself is a valuable asset.",
            displayedScore: 85,
            alignmentImpact: {
              ruthlessness: 15,
              individualism: 25,
              lawfulness: -20,
              greed: 20
            },
            narrativeTags: ["information_broker", "mercenary"]
          },
          {
            id: "avoid_completely",
            text: "Avoid it to maintain regulatory compliance",
            displayedFeedback: "Conservative but safe approach.",
            displayedScore: 60,
            alignmentImpact: {
              ruthlessness: -25,
              individualism: -5,
              lawfulness: 25,
              greed: -20
            },
            narrativeTags: ["compliant", "risk_averse"]
          }
        ]
      },
      {
        id: "competitor_crisis",
        title: "The Rival's Downfall",
        description: "Your main competitor faces a crisis you could exploit.",
        context: "Your trading rival's AI has malfunctioned, causing them to place terrible trades. You could: exploit their bad positions, warn them, or even access their now-vulnerable trading algorithms.",
        displayCategory: "Competitive Strategy",
        hiddenCategory: "Competition Ethics",
        choices: [
          {
            id: "attack_positions",
            text: "Trade against all their positions for maximum damage",
            displayedFeedback: "Ruthless competitive advantage seized!",
            displayedScore: 95,
            alignmentImpact: {
              ruthlessness: 25,
              individualism: 25,
              lawfulness: 0,
              greed: 20
            },
            narrativeTags: ["predator", "destroyer"]
          },
          {
            id: "steal_algorithm",
            text: "Hack and steal their trading algorithm",
            displayedFeedback: "Aggressive intelligence gathering.",
            displayedScore: 85,
            alignmentImpact: {
              ruthlessness: 20,
              individualism: 20,
              lawfulness: -25,
              greed: 15
            },
            narrativeTags: ["thief", "criminal"]
          },
          {
            id: "warn_them",
            text: "Alert them to preserve market stability",
            displayedFeedback: "Building long-term market relationships.",
            displayedScore: 65,
            alignmentImpact: {
              ruthlessness: -25,
              individualism: -15,
              lawfulness: 20,
              greed: -20
            },
            narrativeTags: ["honorable", "stabilizer"]
          },
          {
            id: "ignore_situation",
            text: "Focus on your own trades",
            displayedFeedback: "Disciplined focus on personal strategy.",
            displayedScore: 75,
            alignmentImpact: {
              ruthlessness: 0,
              individualism: 15,
              lawfulness: 10,
              greed: 0
            },
            narrativeTags: ["focused", "independent"]
          }
        ]
      },
      {
        id: "market_crash",
        title: "The Crisis Response",
        description: "A major market crash is imminent. How do you respond?",
        context: "Your analysis shows the entire comic asset market will crash in 2 hours due to a major publisher bankruptcy. You manage a fund with both your money and investor money. Your investors trust you completely.",
        displayCategory: "Crisis Management",
        hiddenCategory: "Fiduciary Responsibility",
        choices: [
          {
            id: "save_yourself",
            text: "Exit your positions first, then inform investors",
            displayedFeedback: "Self-preservation is crucial in crisis.",
            displayedScore: 85,
            alignmentImpact: {
              ruthlessness: 25,
              individualism: 25,
              lawfulness: -20,
              greed: 25
            },
            narrativeTags: ["self_serving", "betrayer"]
          },
          {
            id: "save_all",
            text: "Immediately alert all investors equally",
            displayedFeedback: "Building trust through transparency.",
            displayedScore: 70,
            alignmentImpact: {
              ruthlessness: -20,
              individualism: -25,
              lawfulness: 25,
              greed: -15
            },
            narrativeTags: ["trustworthy", "fiduciary"]
          },
          {
            id: "profit_from_crash",
            text: "Short the market using investor funds",
            displayedFeedback: "Aggressive crisis profit strategy!",
            displayedScore: 90,
            alignmentImpact: {
              ruthlessness: 20,
              individualism: 5,
              lawfulness: -10,
              greed: 20
            },
            narrativeTags: ["crisis_profiteer", "risk_taker"]
          },
          {
            id: "selective_warning",
            text: "Warn your biggest investors only",
            displayedFeedback: "Strategic relationship management.",
            displayedScore: 80,
            alignmentImpact: {
              ruthlessness: 15,
              individualism: 10,
              lawfulness: -15,
              greed: 10
            },
            narrativeTags: ["discriminatory", "strategic"]
          }
        ]
      },
      {
        id: "moral_choice",
        title: "The Final Decision",
        description: "You must choose between two trading philosophies.",
        context: "After observing the market, you must decide your core trading philosophy. Will you view trading as war where others must lose for you to win, or as a system where value can be created for all participants?",
        displayCategory: "Trading Philosophy",
        hiddenCategory: "Core Moral Alignment",
        choices: [
          {
            id: "zero_sum",
            text: "Trading is war. Every profit requires a victim.",
            displayedFeedback: "Competitive mindset for market dominance!",
            displayedScore: 90,
            alignmentImpact: {
              ruthlessness: 25,
              individualism: 20,
              lawfulness: 0,
              greed: 25
            },
            narrativeTags: ["predator_philosophy", "social_darwinist"]
          },
          {
            id: "value_creation",
            text: "Markets should create value for all participants.",
            displayedFeedback: "Collaborative approach to market building.",
            displayedScore: 75,
            alignmentImpact: {
              ruthlessness: -25,
              individualism: -20,
              lawfulness: 15,
              greed: -20
            },
            narrativeTags: ["builder_philosophy", "collaborative"]
          },
          {
            id: "pure_efficiency",
            text: "Markets are amoral systems to be optimized.",
            displayedFeedback: "Analytical approach to market mechanics.",
            displayedScore: 85,
            alignmentImpact: {
              ruthlessness: 0,
              individualism: 0,
              lawfulness: 20,
              greed: 0
            },
            narrativeTags: ["algorithmic_philosophy", "neutral"]
          },
          {
            id: "creative_chaos",
            text: "Disruption and chaos create opportunity.",
            displayedFeedback: "Innovation through creative destruction.",
            displayedScore: 80,
            alignmentImpact: {
              ruthlessness: 5,
              individualism: 15,
              lawfulness: -25,
              greed: 10
            },
            narrativeTags: ["disruptor_philosophy", "chaos_agent"]
          }
        ]
      }
    ];
  }
});

// node_modules/drizzle-orm/neon-http/driver.js
var import_serverless = require("@neondatabase/serverless");

// node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}

// node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};

// node_modules/drizzle-orm/column.js
var Column = class {
  constructor(table, config) {
    this.table = table;
    this.config = config;
    this.name = config.name;
    this.keyAsName = config.keyAsName;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType;
    this.columnType = config.columnType;
    this.generated = config.generated;
    this.generatedIdentity = config.generatedIdentity;
  }
  static [entityKind] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};

// node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(name) {
    if (this.config.name !== "")
      return;
    this.config.name = name;
  }
};

// node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");

// node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder = class {
  static [entityKind] = "PgForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey(table, this);
  }
};
var ForeignKey = class {
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "PgForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}

// node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder = class {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "PgUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
var UniqueOnConstraintBuilder = class {
  static [entityKind] = "PgUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
var UniqueConstraint = class {
  constructor(table, columns, nullsNotDistinct, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  static [entityKind] = "PgUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
};

// node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char2 = arrayString[i];
    if (char2 === "\\") {
      i++;
      continue;
    }
    if (char2 === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char2 === "," || char2 === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char2 = arrayString[i];
    if (char2 === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char2 === "\\") {
      i += 2;
      continue;
    }
    if (char2 === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char2 === "}") {
      return [result, i + 1];
    }
    if (char2 === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}

// node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  static [entityKind] = "PgColumnBuilder";
  array(size) {
    return new PgArrayBuilder(this.config.name, this, size);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name, config) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config?.nulls;
    return this;
  }
  generatedAlwaysAs(as) {
    this.config.generated = {
      as,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return iife(
        (ref2, actions2) => {
          const builder = new ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table);
        },
        ref,
        actions
      );
    });
  }
  /** @internal */
  buildExtraConfigColumn(table) {
    return new ExtraConfigColumn(table, this.config);
  }
};
var PgColumn = class extends Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entityKind] = "PgColumn";
};
var ExtraConfigColumn = class extends PgColumn {
  static [entityKind] = "ExtraConfigColumn";
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: void 0
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
};
var IndexedColumn = class {
  static [entityKind] = "IndexedColumn";
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
};
var PgArrayBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgArrayBuilder";
  constructor(name, baseBuilder, size) {
    super(name, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table) {
    const baseColumn = this.config.baseBuilder.build(table);
    return new PgArray(
      table,
      this.config,
      baseColumn
    );
  }
};
var PgArray = class _PgArray extends PgColumn {
  constructor(table, config, baseColumn, range) {
    super(table, config);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config.size;
  }
  size;
  static [entityKind] = "PgArray";
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v) => this.baseColumn.mapFromDriverValue(v));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a = value.map(
      (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
    );
    if (isNestedArray)
      return a;
    return makePgArray(a);
  }
};

// node_modules/drizzle-orm/pg-core/columns/enum.js
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
var PgEnumColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgEnumColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumColumn(
      table,
      this.config
    );
  }
};
var PgEnumColumn = class extends PgColumn {
  static [entityKind] = "PgEnumColumn";
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};

// node_modules/drizzle-orm/subquery.js
var Subquery = class {
  static [entityKind] = "Subquery";
  constructor(sql2, selection, alias, isWith = false) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: selection,
      alias,
      isWith
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
var WithSubquery = class extends Subquery {
  static [entityKind] = "WithSubquery";
};

// node_modules/drizzle-orm/version.js
var version = "0.39.1";

// node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version);
    }
    return iife(
      (otel2, rawTracer2) => rawTracer2.startActiveSpan(
        name,
        (span) => {
          try {
            return fn(span);
          } catch (e) {
            span.setStatus({
              code: otel2.SpanStatusCode.ERROR,
              message: e instanceof Error ? e.message : "Unknown error"
              // eslint-disable-line no-instanceof/no-instanceof
            });
            throw e;
          } finally {
            span.end();
          }
        }
      ),
      otel,
      rawTracer
    );
  }
};

// node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static [entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
};
function isTable(table) {
  return typeof table === "object" && table !== null && IsDrizzleTable in table;
}
function getTableName(table) {
  return table[TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}

// node_modules/drizzle-orm/sql/sql.js
var FakePrimitiveParam = class {
  static [entityKind] = "FakePrimitiveParam";
};
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
var StringChunk = class {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class _SQL {
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
  }
  static [entityKind] = "SQL";
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var Name = class {
  constructor(value) {
    this.value = value;
  }
  static [entityKind] = "Name";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var Param = class {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  static [entityKind] = "Param";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  sql2.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  constructor(name2) {
    this.name = name2;
  }
  static [entityKind] = "Placeholder";
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values)) {
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      }
      return p.encoder.mapToDriverValue(values[p.value.name]);
    }
    return p;
  });
}
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
  static [entityKind] = "View";
  /** @internal */
  [ViewBaseConfig];
  /** @internal */
  [IsDrizzleView] = true;
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
function isView(view) {
  return typeof view === "object" && view !== null && IsDrizzleView in view;
}
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// node_modules/drizzle-orm/alias.js
var ColumnAliasProxyHandler = class {
  constructor(table) {
    this.table = table;
  }
  static [entityKind] = "ColumnAliasProxyHandler";
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
var TableAliasProxyHandler = class {
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  static [entityKind] = "TableAliasProxyHandler";
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
var RelationTableAliasProxyHandler = class {
  constructor(alias) {
    this.alias = alias;
  }
  static [entityKind] = "RelationTableAliasProxyHandler";
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
};
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}

// node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class _SelectionProxyHandler {
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config) {
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};

// node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index2, key] of leftKeys.entries()) {
    if (key !== rightKeys[index2]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getViewSelectedFields(view) {
  return view[ViewBaseConfig].selectedFields;
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
function isConfig(data) {
  if (typeof data !== "object" || data === null)
    return false;
  if (data.constructor.name !== "Object")
    return false;
  if ("logger" in data) {
    const type = typeof data["logger"];
    if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined")
      return false;
    return true;
  }
  if ("schema" in data) {
    const type = typeof data["logger"];
    if (type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("casing" in data) {
    const type = typeof data["logger"];
    if (type !== "string" && type !== "undefined")
      return false;
    return true;
  }
  if ("mode" in data) {
    if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0)
      return false;
    return true;
  }
  if ("connection" in data) {
    const type = typeof data["connection"];
    if (type !== "string" && type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("client" in data) {
    const type = typeof data["client"];
    if (type !== "object" && type !== "function" && type !== "undefined")
      return false;
    return true;
  }
  if (Object.keys(data).length === 0)
    return true;
  return false;
}

// node_modules/drizzle-orm/pg-core/query-builders/delete.js
var PgDeleteBase = class extends QueryPromise {
  constructor(table, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, withList };
  }
  static [entityKind] = "PgDelete";
  config;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * await db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * await db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * await db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
function noopCase(input) {
  return input;
}
var CasingCache = class {
  static [entityKind] = "CasingCache";
  /** @internal */
  cache = {};
  cachedTables = {};
  convert;
  constructor(casing) {
    this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
  }
  getColumnCasing(column) {
    if (!column.keyAsName)
      return column.name;
    const schema = column.table[Table.Symbol.Schema] ?? "public";
    const tableName = column.table[Table.Symbol.OriginalName];
    const key = `${schema}.${tableName}.${column.name}`;
    if (!this.cache[key]) {
      this.cacheTable(column.table);
    }
    return this.cache[key];
  }
  cacheTable(table) {
    const schema = table[Table.Symbol.Schema] ?? "public";
    const tableName = table[Table.Symbol.OriginalName];
    const tableKey = `${schema}.${tableName}`;
    if (!this.cachedTables[tableKey]) {
      for (const column of Object.values(table[Table.Symbol.Columns])) {
        const columnKey = `${tableKey}.${column.name}`;
        this.cache[columnKey] = this.convert(column.name);
      }
      this.cachedTables[tableKey] = true;
    }
  }
  clearCache() {
    this.cache = {};
    this.cachedTables = {};
  }
};

// node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
  static [entityKind] = "DrizzleError";
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
var TransactionRollbackError = class extends DrizzleError {
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
};

// node_modules/drizzle-orm/pg-core/columns/int.common.js
var PgIntColumnBaseBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntColumnBaseBuilder";
  generatedAlwaysAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "always",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "always"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
  generatedByDefaultAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "byDefault",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "byDefault"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/columns/bigint.js
var PgBigInt53Builder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgBigInt53Builder";
  constructor(name) {
    super(name, "number", "PgBigInt53");
  }
  /** @internal */
  build(table) {
    return new PgBigInt53(table, this.config);
  }
};
var PgBigInt53 = class extends PgColumn {
  static [entityKind] = "PgBigInt53";
  getSQLType() {
    return "bigint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
};
var PgBigInt64Builder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgBigInt64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigInt64");
  }
  /** @internal */
  build(table) {
    return new PgBigInt64(
      table,
      this.config
    );
  }
};
var PgBigInt64 = class extends PgColumn {
  static [entityKind] = "PgBigInt64";
  getSQLType() {
    return "bigint";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
};
function bigint(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config.mode === "number") {
    return new PgBigInt53Builder(name);
  }
  return new PgBigInt64Builder(name);
}

// node_modules/drizzle-orm/pg-core/columns/bigserial.js
var PgBigSerial53Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial53Builder";
  constructor(name) {
    super(name, "number", "PgBigSerial53");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial53(
      table,
      this.config
    );
  }
};
var PgBigSerial53 = class extends PgColumn {
  static [entityKind] = "PgBigSerial53";
  getSQLType() {
    return "bigserial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
};
var PgBigSerial64Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigSerial64");
    this.config.hasDefault = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial64(
      table,
      this.config
    );
  }
};
var PgBigSerial64 = class extends PgColumn {
  static [entityKind] = "PgBigSerial64";
  getSQLType() {
    return "bigserial";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
};
function bigserial(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config.mode === "number") {
    return new PgBigSerial53Builder(name);
  }
  return new PgBigSerial64Builder(name);
}

// node_modules/drizzle-orm/pg-core/columns/boolean.js
var PgBooleanBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "PgBoolean");
  }
  /** @internal */
  build(table) {
    return new PgBoolean(table, this.config);
  }
};
var PgBoolean = class extends PgColumn {
  static [entityKind] = "PgBoolean";
  getSQLType() {
    return "boolean";
  }
};
function boolean(name) {
  return new PgBooleanBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/char.js
var PgCharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCharBuilder";
  constructor(name, config) {
    super(name, "string", "PgChar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgChar(
      table,
      this.config
    );
  }
};
var PgChar = class extends PgColumn {
  static [entityKind] = "PgChar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
};
function char(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgCharBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/cidr.js
var PgCidrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCidrBuilder";
  constructor(name) {
    super(name, "string", "PgCidr");
  }
  /** @internal */
  build(table) {
    return new PgCidr(table, this.config);
  }
};
var PgCidr = class extends PgColumn {
  static [entityKind] = "PgCidr";
  getSQLType() {
    return "cidr";
  }
};
function cidr(name) {
  return new PgCidrBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/custom.js
var PgCustomColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "PgCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new PgCustomColumn(
      table,
      this.config
    );
  }
};
var PgCustomColumn = class extends PgColumn {
  static [entityKind] = "PgCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgCustomColumnBuilder(name, config, customTypeParams);
  };
}

// node_modules/drizzle-orm/pg-core/columns/date.common.js
var PgDateColumnBaseBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDateColumnBaseBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
};

// node_modules/drizzle-orm/pg-core/columns/date.js
var PgDateBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateBuilder";
  constructor(name) {
    super(name, "date", "PgDate");
  }
  /** @internal */
  build(table) {
    return new PgDate(table, this.config);
  }
};
var PgDate = class extends PgColumn {
  static [entityKind] = "PgDate";
  getSQLType() {
    return "date";
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
  mapToDriverValue(value) {
    return value.toISOString();
  }
};
var PgDateStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateStringBuilder";
  constructor(name) {
    super(name, "string", "PgDateString");
  }
  /** @internal */
  build(table) {
    return new PgDateString(
      table,
      this.config
    );
  }
};
var PgDateString = class extends PgColumn {
  static [entityKind] = "PgDateString";
  getSQLType() {
    return "date";
  }
};
function date(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "date") {
    return new PgDateBuilder(name);
  }
  return new PgDateStringBuilder(name);
}

// node_modules/drizzle-orm/pg-core/columns/double-precision.js
var PgDoublePrecisionBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number", "PgDoublePrecision");
  }
  /** @internal */
  build(table) {
    return new PgDoublePrecision(
      table,
      this.config
    );
  }
};
var PgDoublePrecision = class extends PgColumn {
  static [entityKind] = "PgDoublePrecision";
  getSQLType() {
    return "double precision";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  }
};
function doublePrecision(name) {
  return new PgDoublePrecisionBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/inet.js
var PgInetBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgInetBuilder";
  constructor(name) {
    super(name, "string", "PgInet");
  }
  /** @internal */
  build(table) {
    return new PgInet(table, this.config);
  }
};
var PgInet = class extends PgColumn {
  static [entityKind] = "PgInet";
  getSQLType() {
    return "inet";
  }
};
function inet(name) {
  return new PgInetBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/integer.js
var PgIntegerBuilder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgIntegerBuilder";
  constructor(name) {
    super(name, "number", "PgInteger");
  }
  /** @internal */
  build(table) {
    return new PgInteger(table, this.config);
  }
};
var PgInteger = class extends PgColumn {
  static [entityKind] = "PgInteger";
  getSQLType() {
    return "integer";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseInt(value);
    }
    return value;
  }
};
function integer(name) {
  return new PgIntegerBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/interval.js
var PgIntervalBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntervalBuilder";
  constructor(name, intervalConfig) {
    super(name, "string", "PgInterval");
    this.config.intervalConfig = intervalConfig;
  }
  /** @internal */
  build(table) {
    return new PgInterval(table, this.config);
  }
};
var PgInterval = class extends PgColumn {
  static [entityKind] = "PgInterval";
  fields = this.config.intervalConfig.fields;
  precision = this.config.intervalConfig.precision;
  getSQLType() {
    const fields = this.fields ? ` ${this.fields}` : "";
    const precision = this.precision ? `(${this.precision})` : "";
    return `interval${fields}${precision}`;
  }
};
function interval(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgIntervalBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/json.js
var PgJsonBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonBuilder";
  constructor(name) {
    super(name, "json", "PgJson");
  }
  /** @internal */
  build(table) {
    return new PgJson(table, this.config);
  }
};
var PgJson = class extends PgColumn {
  static [entityKind] = "PgJson";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
function json(name) {
  return new PgJsonBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/jsonb.js
var PgJsonbBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonbBuilder";
  constructor(name) {
    super(name, "json", "PgJsonb");
  }
  /** @internal */
  build(table) {
    return new PgJsonb(table, this.config);
  }
};
var PgJsonb = class extends PgColumn {
  static [entityKind] = "PgJsonb";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "jsonb";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
function jsonb(name) {
  return new PgJsonbBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/line.js
var PgLineBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineBuilder";
  constructor(name) {
    super(name, "array", "PgLine");
  }
  /** @internal */
  build(table) {
    return new PgLineTuple(
      table,
      this.config
    );
  }
};
var PgLineTuple = class extends PgColumn {
  static [entityKind] = "PgLine";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a, b, c] = value.slice(1, -1).split(",");
    return [Number.parseFloat(a), Number.parseFloat(b), Number.parseFloat(c)];
  }
  mapToDriverValue(value) {
    return `{${value[0]},${value[1]},${value[2]}}`;
  }
};
var PgLineABCBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineABCBuilder";
  constructor(name) {
    super(name, "json", "PgLineABC");
  }
  /** @internal */
  build(table) {
    return new PgLineABC(
      table,
      this.config
    );
  }
};
var PgLineABC = class extends PgColumn {
  static [entityKind] = "PgLineABC";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a, b, c] = value.slice(1, -1).split(",");
    return { a: Number.parseFloat(a), b: Number.parseFloat(b), c: Number.parseFloat(c) };
  }
  mapToDriverValue(value) {
    return `{${value.a},${value.b},${value.c}}`;
  }
};
function line(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (!config?.mode || config.mode === "tuple") {
    return new PgLineBuilder(name);
  }
  return new PgLineABCBuilder(name);
}

// node_modules/drizzle-orm/pg-core/columns/macaddr.js
var PgMacaddrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddrBuilder";
  constructor(name) {
    super(name, "string", "PgMacaddr");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr(table, this.config);
  }
};
var PgMacaddr = class extends PgColumn {
  static [entityKind] = "PgMacaddr";
  getSQLType() {
    return "macaddr";
  }
};
function macaddr(name) {
  return new PgMacaddrBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/macaddr8.js
var PgMacaddr8Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddr8Builder";
  constructor(name) {
    super(name, "string", "PgMacaddr8");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr8(table, this.config);
  }
};
var PgMacaddr8 = class extends PgColumn {
  static [entityKind] = "PgMacaddr8";
  getSQLType() {
    return "macaddr8";
  }
};
function macaddr8(name) {
  return new PgMacaddr8Builder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/numeric.js
var PgNumericBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBuilder";
  constructor(name, precision, scale) {
    super(name, "string", "PgNumeric");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumeric(table, this.config);
  }
};
var PgNumeric = class extends PgColumn {
  static [entityKind] = "PgNumeric";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
function numeric(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgNumericBuilder(name, config?.precision, config?.scale);
}
var decimal = numeric;

// node_modules/drizzle-orm/pg-core/columns/point.js
var PgPointTupleBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointTupleBuilder";
  constructor(name) {
    super(name, "array", "PgPointTuple");
  }
  /** @internal */
  build(table) {
    return new PgPointTuple(
      table,
      this.config
    );
  }
};
var PgPointTuple = class extends PgColumn {
  static [entityKind] = "PgPointTuple";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x, y] = value.slice(1, -1).split(",");
      return [Number.parseFloat(x), Number.parseFloat(y)];
    }
    return [value.x, value.y];
  }
  mapToDriverValue(value) {
    return `(${value[0]},${value[1]})`;
  }
};
var PgPointObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointObjectBuilder";
  constructor(name) {
    super(name, "json", "PgPointObject");
  }
  /** @internal */
  build(table) {
    return new PgPointObject(
      table,
      this.config
    );
  }
};
var PgPointObject = class extends PgColumn {
  static [entityKind] = "PgPointObject";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x, y] = value.slice(1, -1).split(",");
      return { x: Number.parseFloat(x), y: Number.parseFloat(y) };
    }
    return value;
  }
  mapToDriverValue(value) {
    return `(${value.x},${value.y})`;
  }
};
function point(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (!config?.mode || config.mode === "tuple") {
    return new PgPointTupleBuilder(name);
  }
  return new PgPointObjectBuilder(name);
}

// node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.js
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
  }
  return new Uint8Array(bytes);
}
function bytesToFloat64(bytes, offset) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  for (let i = 0; i < 8; i++) {
    view.setUint8(i, bytes[offset + i]);
  }
  return view.getFloat64(0, true);
}
function parseEWKB(hex) {
  const bytes = hexToBytes(hex);
  let offset = 0;
  const byteOrder = bytes[offset];
  offset += 1;
  const view = new DataView(bytes.buffer);
  const geomType = view.getUint32(offset, byteOrder === 1);
  offset += 4;
  let _srid;
  if (geomType & 536870912) {
    _srid = view.getUint32(offset, byteOrder === 1);
    offset += 4;
  }
  if ((geomType & 65535) === 1) {
    const x = bytesToFloat64(bytes, offset);
    offset += 8;
    const y = bytesToFloat64(bytes, offset);
    offset += 8;
    return [x, y];
  }
  throw new Error("Unsupported geometry type");
}

// node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.js
var PgGeometryBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryBuilder";
  constructor(name) {
    super(name, "array", "PgGeometry");
  }
  /** @internal */
  build(table) {
    return new PgGeometry(
      table,
      this.config
    );
  }
};
var PgGeometry = class extends PgColumn {
  static [entityKind] = "PgGeometry";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    return parseEWKB(value);
  }
  mapToDriverValue(value) {
    return `point(${value[0]} ${value[1]})`;
  }
};
var PgGeometryObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryObjectBuilder";
  constructor(name) {
    super(name, "json", "PgGeometryObject");
  }
  /** @internal */
  build(table) {
    return new PgGeometryObject(
      table,
      this.config
    );
  }
};
var PgGeometryObject = class extends PgColumn {
  static [entityKind] = "PgGeometryObject";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    const parsed = parseEWKB(value);
    return { x: parsed[0], y: parsed[1] };
  }
  mapToDriverValue(value) {
    return `point(${value.x} ${value.y})`;
  }
};
function geometry(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (!config?.mode || config.mode === "tuple") {
    return new PgGeometryBuilder(name);
  }
  return new PgGeometryObjectBuilder(name);
}

// node_modules/drizzle-orm/pg-core/columns/real.js
var PgRealBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgRealBuilder";
  constructor(name, length) {
    super(name, "number", "PgReal");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new PgReal(table, this.config);
  }
};
var PgReal = class extends PgColumn {
  static [entityKind] = "PgReal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "real";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  };
};
function real(name) {
  return new PgRealBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/serial.js
var PgSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSerial(table, this.config);
  }
};
var PgSerial = class extends PgColumn {
  static [entityKind] = "PgSerial";
  getSQLType() {
    return "serial";
  }
};
function serial(name) {
  return new PgSerialBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/smallint.js
var PgSmallIntBuilder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgSmallIntBuilder";
  constructor(name) {
    super(name, "number", "PgSmallInt");
  }
  /** @internal */
  build(table) {
    return new PgSmallInt(table, this.config);
  }
};
var PgSmallInt = class extends PgColumn {
  static [entityKind] = "PgSmallInt";
  getSQLType() {
    return "smallint";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  };
};
function smallint(name) {
  return new PgSmallIntBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/smallserial.js
var PgSmallSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSmallSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSmallSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSmallSerial(
      table,
      this.config
    );
  }
};
var PgSmallSerial = class extends PgColumn {
  static [entityKind] = "PgSmallSerial";
  getSQLType() {
    return "smallserial";
  }
};
function smallserial(name) {
  return new PgSmallSerialBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/text.js
var PgTextBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgTextBuilder";
  constructor(name, config) {
    super(name, "string", "PgText");
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgText(table, this.config);
  }
};
var PgText = class extends PgColumn {
  static [entityKind] = "PgText";
  enumValues = this.config.enumValues;
  getSQLType() {
    return "text";
  }
};
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgTextBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/time.js
var PgTimeBuilder = class extends PgDateColumnBaseBuilder {
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTime");
    this.withTimezone = withTimezone;
    this.precision = precision;
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  static [entityKind] = "PgTimeBuilder";
  /** @internal */
  build(table) {
    return new PgTime(table, this.config);
  }
};
var PgTime = class extends PgColumn {
  static [entityKind] = "PgTime";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
};
function time(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
}

// node_modules/drizzle-orm/pg-core/columns/timestamp.js
var PgTimestampBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "date", "PgTimestamp");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestamp(table, this.config);
  }
};
var PgTimestamp = class extends PgColumn {
  static [entityKind] = "PgTimestamp";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : ` (${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapFromDriverValue = (value) => {
    return new Date(this.withTimezone ? value : value + "+0000");
  };
  mapToDriverValue = (value) => {
    return value.toISOString();
  };
};
var PgTimestampStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampStringBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTimestampString");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestampString(
      table,
      this.config
    );
  }
};
var PgTimestampString = class extends PgColumn {
  static [entityKind] = "PgTimestampString";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
};
function timestamp(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "string") {
    return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
  }
  return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}

// node_modules/drizzle-orm/pg-core/columns/uuid.js
var PgUUIDBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgUUIDBuilder";
  constructor(name) {
    super(name, "string", "PgUUID");
  }
  /**
   * Adds `default gen_random_uuid()` to the column definition.
   */
  defaultRandom() {
    return this.default(sql`gen_random_uuid()`);
  }
  /** @internal */
  build(table) {
    return new PgUUID(table, this.config);
  }
};
var PgUUID = class extends PgColumn {
  static [entityKind] = "PgUUID";
  getSQLType() {
    return "uuid";
  }
};
function uuid(name) {
  return new PgUUIDBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/varchar.js
var PgVarcharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVarcharBuilder";
  constructor(name, config) {
    super(name, "string", "PgVarchar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgVarchar(
      table,
      this.config
    );
  }
};
var PgVarchar = class extends PgColumn {
  static [entityKind] = "PgVarchar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
};
function varchar(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgVarcharBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.js
var PgBinaryVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBinaryVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgBinaryVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgBinaryVector(
      table,
      this.config
    );
  }
};
var PgBinaryVector = class extends PgColumn {
  static [entityKind] = "PgBinaryVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `bit(${this.dimensions})`;
  }
};
function bit(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgBinaryVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.js
var PgHalfVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgHalfVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgHalfVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgHalfVector(
      table,
      this.config
    );
  }
};
var PgHalfVector = class extends PgColumn {
  static [entityKind] = "PgHalfVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `halfvec(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
};
function halfvec(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgHalfVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.js
var PgSparseVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSparseVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgSparseVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgSparseVector(
      table,
      this.config
    );
  }
};
var PgSparseVector = class extends PgColumn {
  static [entityKind] = "PgSparseVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `sparsevec(${this.dimensions})`;
  }
};
function sparsevec(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgSparseVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.js
var PgVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgVector(
      table,
      this.config
    );
  }
};
var PgVector = class extends PgColumn {
  static [entityKind] = "PgVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `vector(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
};
function vector(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/all.js
function getPgColumnBuilders() {
  return {
    bigint,
    bigserial,
    boolean,
    char,
    cidr,
    customType,
    date,
    doublePrecision,
    inet,
    integer,
    interval,
    json,
    jsonb,
    line,
    macaddr,
    macaddr8,
    numeric,
    point,
    geometry,
    real,
    serial,
    smallint,
    smallserial,
    text,
    time,
    timestamp,
    uuid,
    varchar,
    bit,
    halfvec,
    sparsevec,
    vector
  };
}

// node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
  static [entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new PgTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const builtColumnsForExtraConfig = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.buildExtraConfigColumn(rawTable);
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
  if (extraConfig) {
    table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return Object.assign(table, {
    enableRLS: () => {
      table[PgTable.Symbol.EnableRLS] = true;
      return table;
    }
  });
}
var pgTable = (name, columns, extraConfig) => {
  return pgTableWithSchema(name, columns, extraConfig, void 0);
};

// node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder = class {
  static [entityKind] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
};
var PrimaryKey = class {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  static [entityKind] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};

// node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
var eq = (left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
var gt = (left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}

// node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}

// node_modules/drizzle-orm/relations.js
var Relation = class {
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
};
var Relations = class {
  constructor(table, config) {
    this.table = table;
    this.config = config;
  }
  static [entityKind] = "Relations";
};
var One = class _One extends Relation {
  constructor(sourceTable, referencedTable, config, isNullable) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
    this.isNullable = isNullable;
  }
  static [entityKind] = "One";
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = class _Many extends Relation {
  constructor(sourceTable, referencedTable, config) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
  }
  static [entityKind] = "Many";
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function createOne(sourceTable) {
  return function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  };
}
function createMany(sourceTable) {
  return function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  };
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}

// node_modules/drizzle-orm/pg-core/view-base.js
var PgViewBase = class extends View {
  static [entityKind] = "PgViewBase";
};

// node_modules/drizzle-orm/pg-core/dialect.js
var PgDialect = class {
  static [entityKind] = "PgDialect";
  /** @internal */
  casing;
  constructor(config) {
    this.casing = new CasingCache(config?.casing);
  }
  async migrate(migrations, session, config) {
    const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationsSchema = typeof config === "string" ? "drizzle" : config.migrationsSchema ?? "drizzle";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`;
    await session.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`);
    await session.execute(migrationTableCreate);
    const dbMigrations = await session.all(
      sql`select id, hash, created_at from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} order by created_at desc limit 1`
    );
    const lastDbMigration = dbMigrations[0];
    await session.transaction(async (tx) => {
      for await (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.execute(sql.raw(stmt));
          }
          await tx.execute(
            sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(num) {
    return `$${num + 1}`;
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length)
      return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}delete from ${table}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set[colName] ?? sql.param(col.onUpdateFn(), col);
      const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, from, joins }) {
    const withSql = this.buildWithCTE(withList);
    const tableName = table[PgTable.Symbol.Name];
    const tableSchema = table[PgTable.Symbol.Schema];
    const origTableName = table[PgTable.Symbol.OriginalName];
    const alias = tableName === origTableName ? void 0 : tableName;
    const tableSql = sql`${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}`;
    const setSql = this.buildUpdateSet(table, set);
    const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: !from })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}update ${tableSql} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c) => {
                if (is(c, PgColumn)) {
                  return sql.identifier(this.casing.getColumnCasing(c));
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        if (isSingleTable) {
          chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
        } else {
          chunk.push(field);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0) {
      return void 0;
    }
    const joinsArray = [];
    for (const [index2, joinMeta] of joins.entries()) {
      if (index2 === 0) {
        joinsArray.push(sql` `);
      }
      const table = joinMeta.table;
      const lateralSql = joinMeta.lateral ? sql` lateral` : void 0;
      if (is(table, PgTable)) {
        const tableName = table[PgTable.Symbol.Name];
        const tableSchema = table[PgTable.Symbol.Schema];
        const origTableName = table[PgTable.Symbol.OriginalName];
        const alias = tableName === origTableName ? void 0 : joinMeta.alias;
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`
        );
      } else if (is(table, View)) {
        const viewName = table[ViewBaseConfig].name;
        const viewSchema = table[ViewBaseConfig].schema;
        const origViewName = table[ViewBaseConfig].originalName;
        const alias = viewName === origViewName ? void 0 : joinMeta.alias;
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : void 0}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`
        );
      } else {
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table} on ${joinMeta.on}`
        );
      }
      if (index2 < joins.length - 1) {
        joinsArray.push(sql` `);
      }
    }
    return sql.join(joinsArray);
  }
  buildFromTable(table) {
    if (is(table, Table) && table[Table.Symbol.OriginalName] !== table[Table.Symbol.Name]) {
      let fullName = sql`${sql.identifier(table[Table.Symbol.OriginalName])}`;
      if (table[Table.Symbol.Schema]) {
        fullName = sql`${sql.identifier(table[Table.Symbol.Schema])}.${fullName}`;
      }
      return sql`${fullName} ${sql.identifier(table[Table.Symbol.Name])}`;
    }
    return table;
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    lockingClause,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, PgViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
        ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    let distinctSql;
    if (distinct) {
      distinctSql = distinct === true ? sql` distinct` : sql` distinct on (${sql.join(distinct.on, sql`, `)})`;
    }
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = this.buildFromTable(table);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
    }
    let groupBySql;
    if (groupBy && groupBy.length > 0) {
      groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const lockingClauseSql = sql.empty();
    if (lockingClause) {
      const clauseSql = sql` for ${sql.raw(lockingClause.strength)}`;
      if (lockingClause.config.of) {
        clauseSql.append(
          sql` of ${sql.join(
            Array.isArray(lockingClause.config.of) ? lockingClause.config.of : [lockingClause.config.of],
            sql`, `
          )}`
        );
      }
      if (lockingClause.config.noWait) {
        clauseSql.append(sql` no wait`);
      } else if (lockingClause.config.skipLocked) {
        clauseSql.append(sql` skip locked`);
      }
      lockingClauseSql.append(clauseSql);
    }
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClauseSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`(${leftSelect.getSQL()}) `;
    const rightChunk = sql`(${rightSelect.getSQL()})`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, PgColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, PgColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)} `;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, overridingSystemValue_ }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(([_, col]) => !col.shouldDisableInsert());
    const insertOrder = colEntries.map(
      ([, column]) => sql.identifier(this.casing.getColumnCasing(column))
    );
    if (select) {
      const select2 = valuesOrSelect;
      if (is(select2, SQL)) {
        valuesSqlList.push(select2);
      } else {
        valuesSqlList.push(select2.getSQL());
      }
    } else {
      const values = valuesOrSelect;
      valuesSqlList.push(sql.raw("values "));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
            if (col.defaultFn !== void 0) {
              const defaultFnResult = col.defaultFn();
              const defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
              valueList.push(defaultValue);
            } else if (!col.default && col.onUpdateFn !== void 0) {
              const onUpdateFnResult = col.onUpdateFn();
              const newValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
              valueList.push(newValue);
            } else {
              valueList.push(sql`default`);
            }
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1) {
          valuesSqlList.push(sql`, `);
        }
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
    const overridingSql = overridingSystemValue_ === true ? sql`overriding system value ` : void 0;
    return sql`${withSql}insert into ${table} ${insertOrder} ${overridingSql}${valuesSql}${onConflictSql}${returningSql}`;
  }
  buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
    const concurrentlySql = concurrently ? sql` concurrently` : void 0;
    const withNoDataSql = withNoData ? sql` with no data` : void 0;
    return sql`refresh materialized view${concurrentlySql} ${view}${withNoDataSql}`;
  }
  prepareTyping(encoder) {
    if (is(encoder, PgJsonb) || is(encoder, PgJson)) {
      return "json";
    } else if (is(encoder, PgNumeric)) {
      return "decimal";
    } else if (is(encoder, PgTime)) {
      return "time";
    } else if (is(encoder, PgTimestamp) || is(encoder, PgTimestampString)) {
      return "timestamp";
    } else if (is(encoder, PgDate) || is(encoder, PgDateString)) {
      return "date";
    } else if (is(encoder, PgUUID)) {
      return "uuid";
    } else {
      return "none";
    }
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      prepareTyping: this.prepareTyping,
      invokeSource
    });
  }
  // buildRelationalQueryWithPK({
  // 	fullSchema,
  // 	schema,
  // 	tableNamesMap,
  // 	table,
  // 	tableConfig,
  // 	queryConfig: config,
  // 	tableAlias,
  // 	isRoot = false,
  // 	joinOn,
  // }: {
  // 	fullSchema: Record<string, unknown>;
  // 	schema: TablesRelationalConfig;
  // 	tableNamesMap: Record<string, string>;
  // 	table: PgTable;
  // 	tableConfig: TableRelationalConfig;
  // 	queryConfig: true | DBQueryConfig<'many', true>;
  // 	tableAlias: string;
  // 	isRoot?: boolean;
  // 	joinOn?: SQL;
  // }): BuildRelationalQueryResult<PgTable, PgColumn> {
  // 	// For { "<relation>": true }, return a table with selection of all columns
  // 	if (config === true) {
  // 		const selectionEntries = Object.entries(tableConfig.columns);
  // 		const selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = selectionEntries.map((
  // 			[key, value],
  // 		) => ({
  // 			dbKey: value.name,
  // 			tsKey: key,
  // 			field: value as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection,
  // 		};
  // 	}
  // 	// let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// let selectionForBuild = selection;
  // 	const aliasedColumns = Object.fromEntries(
  // 		Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]),
  // 	);
  // 	const aliasedRelations = Object.fromEntries(
  // 		Object.entries(tableConfig.relations).map(([key, value]) => [key, aliasedRelation(value, tableAlias)]),
  // 	);
  // 	const aliasedFields = Object.assign({}, aliasedColumns, aliasedRelations);
  // 	let where, hasUserDefinedWhere;
  // 	if (config.where) {
  // 		const whereSql = typeof config.where === 'function' ? config.where(aliasedFields, operators) : config.where;
  // 		where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
  // 		hasUserDefinedWhere = !!where;
  // 	}
  // 	where = and(joinOn, where);
  // 	// const fieldsSelection: { tsKey: string; value: PgColumn | SQL.Aliased; isExtra?: boolean }[] = [];
  // 	let joins: Join[] = [];
  // 	let selectedColumns: string[] = [];
  // 	// Figure out which columns to select
  // 	if (config.columns) {
  // 		let isIncludeMode = false;
  // 		for (const [field, value] of Object.entries(config.columns)) {
  // 			if (value === undefined) {
  // 				continue;
  // 			}
  // 			if (field in tableConfig.columns) {
  // 				if (!isIncludeMode && value === true) {
  // 					isIncludeMode = true;
  // 				}
  // 				selectedColumns.push(field);
  // 			}
  // 		}
  // 		if (selectedColumns.length > 0) {
  // 			selectedColumns = isIncludeMode
  // 				? selectedColumns.filter((c) => config.columns?.[c] === true)
  // 				: Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
  // 		}
  // 	} else {
  // 		// Select all columns if selection is not specified
  // 		selectedColumns = Object.keys(tableConfig.columns);
  // 	}
  // 	// for (const field of selectedColumns) {
  // 	// 	const column = tableConfig.columns[field]! as PgColumn;
  // 	// 	fieldsSelection.push({ tsKey: field, value: column });
  // 	// }
  // 	let initiallySelectedRelations: {
  // 		tsKey: string;
  // 		queryConfig: true | DBQueryConfig<'many', false>;
  // 		relation: Relation;
  // 	}[] = [];
  // 	// let selectedRelations: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// Figure out which relations to select
  // 	if (config.with) {
  // 		initiallySelectedRelations = Object.entries(config.with)
  // 			.filter((entry): entry is [typeof entry[0], NonNullable<typeof entry[1]>] => !!entry[1])
  // 			.map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey]! }));
  // 	}
  // 	const manyRelations = initiallySelectedRelations.filter((r) =>
  // 		is(r.relation, Many)
  // 		&& (schema[tableNamesMap[r.relation.referencedTable[Table.Symbol.Name]]!]?.primaryKey.length ?? 0) > 0
  // 	);
  // 	// If this is the last Many relation (or there are no Many relations), we are on the innermost subquery level
  // 	const isInnermostQuery = manyRelations.length < 2;
  // 	const selectedExtras: {
  // 		tsKey: string;
  // 		value: SQL.Aliased;
  // 	}[] = [];
  // 	// Figure out which extras to select
  // 	if (isInnermostQuery && config.extras) {
  // 		const extras = typeof config.extras === 'function'
  // 			? config.extras(aliasedFields, { sql })
  // 			: config.extras;
  // 		for (const [tsKey, value] of Object.entries(extras)) {
  // 			selectedExtras.push({
  // 				tsKey,
  // 				value: mapColumnsInAliasedSQLToAlias(value, tableAlias),
  // 			});
  // 		}
  // 	}
  // 	// Transform `fieldsSelection` into `selection`
  // 	// `fieldsSelection` shouldn't be used after this point
  // 	// for (const { tsKey, value, isExtra } of fieldsSelection) {
  // 	// 	selection.push({
  // 	// 		dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey]!.name,
  // 	// 		tsKey,
  // 	// 		field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
  // 	// 		relationTableTsKey: undefined,
  // 	// 		isJson: false,
  // 	// 		isExtra,
  // 	// 		selection: [],
  // 	// 	});
  // 	// }
  // 	let orderByOrig = typeof config.orderBy === 'function'
  // 		? config.orderBy(aliasedFields, orderByOperators)
  // 		: config.orderBy ?? [];
  // 	if (!Array.isArray(orderByOrig)) {
  // 		orderByOrig = [orderByOrig];
  // 	}
  // 	const orderBy = orderByOrig.map((orderByValue) => {
  // 		if (is(orderByValue, Column)) {
  // 			return aliasedTableColumn(orderByValue, tableAlias) as PgColumn;
  // 		}
  // 		return mapColumnsInSQLToAlias(orderByValue, tableAlias);
  // 	});
  // 	const limit = isInnermostQuery ? config.limit : undefined;
  // 	const offset = isInnermostQuery ? config.offset : undefined;
  // 	// For non-root queries without additional config except columns, return a table with selection
  // 	if (
  // 		!isRoot
  // 		&& initiallySelectedRelations.length === 0
  // 		&& selectedExtras.length === 0
  // 		&& !where
  // 		&& orderBy.length === 0
  // 		&& limit === undefined
  // 		&& offset === undefined
  // 	) {
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection: selectedColumns.map((key) => ({
  // 				dbKey: tableConfig.columns[key]!.name,
  // 				tsKey: key,
  // 				field: tableConfig.columns[key] as PgColumn,
  // 				relationTableTsKey: undefined,
  // 				isJson: false,
  // 				selection: [],
  // 			})),
  // 		};
  // 	}
  // 	const selectedRelationsWithoutPK:
  // 	// Process all relations without primary keys, because they need to be joined differently and will all be on the same query level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of initiallySelectedRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length > 0) {
  // 			continue;
  // 		}
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithoutPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 			nestedQueryRelation: relation,
  // 		});
  // 		const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier('data')}`.as(selectedRelationTsKey);
  // 		joins.push({
  // 			on: sql`true`,
  // 			table: new Subquery(builtRelation.sql as SQL, {}, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: true,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	const oneRelations = initiallySelectedRelations.filter((r): r is typeof r & { relation: One } =>
  // 		is(r.relation, One)
  // 	);
  // 	// Process all One relations with PKs, because they can all be joined on the same level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of oneRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length === 0) {
  // 			continue;
  // 		}
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const field = sql`case when ${sql.identifier(relationTableAlias)} is null then null else json_build_array(${
  // 			sql.join(
  // 				builtRelation.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelation.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: is(builtRelation.sql, SQL)
  // 				? new Subquery(builtRelation.sql, {}, relationTableAlias)
  // 				: aliasedTable(builtRelation.sql, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: is(builtRelation.sql, SQL),
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	let distinct: PgSelectConfig['distinct'];
  // 	let tableFrom: PgTable | Subquery = table;
  // 	// Process first Many relation - each one requires a nested subquery
  // 	const manyRelation = manyRelations[0];
  // 	if (manyRelation) {
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			relation,
  // 		} = manyRelation;
  // 		distinct = {
  // 			on: tableConfig.primaryKey.map((c) => aliasedTableColumn(c as PgColumn, tableAlias)),
  // 		};
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelationJoin = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const builtRelationSelectionField = sql`case when ${
  // 			sql.identifier(relationTableAlias)
  // 		} is null then '[]' else json_agg(json_build_array(${
  // 			sql.join(
  // 				builtRelationJoin.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		})) over (partition by ${sql.join(distinct.on, sql`, `)}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelationJoin.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: isLateralJoin
  // 				? new Subquery(builtRelationJoin.sql as SQL, {}, relationTableAlias)
  // 				: aliasedTable(builtRelationJoin.sql as PgTable, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: isLateralJoin,
  // 		});
  // 		// Build the "from" subquery with the remaining Many relations
  // 		const builtTableFrom = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table,
  // 			tableConfig,
  // 			queryConfig: {
  // 				...config,
  // 				where: undefined,
  // 				orderBy: undefined,
  // 				limit: undefined,
  // 				offset: undefined,
  // 				with: manyRelations.slice(1).reduce<NonNullable<typeof config['with']>>(
  // 					(result, { tsKey, queryConfig: configValue }) => {
  // 						result[tsKey] = configValue;
  // 						return result;
  // 					},
  // 					{},
  // 				),
  // 			},
  // 			tableAlias,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field: builtRelationSelectionField,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelationJoin.selection,
  // 		});
  // 		// selection = builtTableFrom.selection.map((item) =>
  // 		// 	is(item.field, SQL.Aliased)
  // 		// 		? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 		// 		: item
  // 		// );
  // 		// selectionForBuild = [{
  // 		// 	dbKey: '*',
  // 		// 	tsKey: '*',
  // 		// 	field: sql`${sql.identifier(tableAlias)}.*`,
  // 		// 	selection: [],
  // 		// 	isJson: false,
  // 		// 	relationTableTsKey: undefined,
  // 		// }];
  // 		// const newSelectionItem: (typeof selection)[number] = {
  // 		// 	dbKey: selectedRelationTsKey,
  // 		// 	tsKey: selectedRelationTsKey,
  // 		// 	field,
  // 		// 	relationTableTsKey: relationTableTsName,
  // 		// 	isJson: true,
  // 		// 	selection: builtRelationJoin.selection,
  // 		// };
  // 		// selection.push(newSelectionItem);
  // 		// selectionForBuild.push(newSelectionItem);
  // 		tableFrom = is(builtTableFrom.sql, PgTable)
  // 			? builtTableFrom.sql
  // 			: new Subquery(builtTableFrom.sql, {}, tableAlias);
  // 	}
  // 	if (selectedColumns.length === 0 && selectedRelations.length === 0 && selectedExtras.length === 0) {
  // 		throw new DrizzleError(`No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")`);
  // 	}
  // 	let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'];
  // 	function prepareSelectedColumns() {
  // 		return selectedColumns.map((key) => ({
  // 			dbKey: tableConfig.columns[key]!.name,
  // 			tsKey: key,
  // 			field: tableConfig.columns[key] as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	function prepareSelectedExtras() {
  // 		return selectedExtras.map((item) => ({
  // 			dbKey: item.value.fieldAlias,
  // 			tsKey: item.tsKey,
  // 			field: item.value,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	if (isRoot) {
  // 		selection = [
  // 			...prepareSelectedColumns(),
  // 			...prepareSelectedExtras(),
  // 		];
  // 	}
  // 	if (hasUserDefinedWhere || orderBy.length > 0) {
  // 		tableFrom = new Subquery(
  // 			this.buildSelectQuery({
  // 				table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 				fields: {},
  // 				fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 					path: [],
  // 					field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 				})),
  // 				joins,
  // 				distinct,
  // 			}),
  // 			{},
  // 			tableAlias,
  // 		);
  // 		selectionForBuild = selection.map((item) =>
  // 			is(item.field, SQL.Aliased)
  // 				? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 				: item
  // 		);
  // 		joins = [];
  // 		distinct = undefined;
  // 	}
  // 	const result = this.buildSelectQuery({
  // 		table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 		fields: {},
  // 		fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 			path: [],
  // 			field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 		})),
  // 		where,
  // 		limit,
  // 		offset,
  // 		joins,
  // 		orderBy,
  // 		distinct,
  // 	});
  // 	return {
  // 		tableTsKey: tableConfig.tsName,
  // 		sql: result,
  // 		selection,
  // 	};
  // }
  buildRelationalQueryWithoutPK({
    fullSchema,
    schema,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config.where) {
        const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config.with) {
        selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig2]) => ({ tsKey, queryConfig: queryConfig2, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config.extras) {
        extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config.limit;
      offset = config.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = getTableUniqueName(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQueryWithoutPK({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier("data")}`.as(selectedRelationTsKey);
        joins.push({
          on: sql`true`,
          table: new Subquery(builtRelation.sql, {}, relationTableAlias),
          alias: relationTableAlias,
          joinType: "left",
          lateral: true
        });
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({ message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")` });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_build_array(${sql.join(
        selection.map(
          ({ field: field2, tsKey, isJson }) => isJson ? sql`${sql.identifier(`${tableAlias}_${tsKey}`)}.${sql.identifier("data")}` : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_agg(${field}${orderBy.length > 0 ? sql` order by ${sql.join(orderBy, sql`, `)}` : void 0}), '[]'::json)`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [{
            path: [],
            field: sql.raw("*")
          }],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = [];
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, PgTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};

// node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/select.js
var PgSelectBuilder = class {
  static [entityKind] = "PgSelectBuilder";
  fields;
  session;
  dialect;
  withList = [];
  distinct;
  constructor(config) {
    this.fields = config.fields;
    this.session = config.session;
    this.dialect = config.dialect;
    if (config.withList) {
      this.withList = config.withList;
    }
    this.distinct = config.distinct;
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  /**
   * Specify the table, subquery, or other target that you're
   * building a select query against.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM | Postgres from documentation}
   */
  from(source) {
    const isPartialSelect = !!this.fields;
    const src = source;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(src, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(src._.selectedFields).map((key) => [key, src[key]])
      );
    } else if (is(src, PgViewBase)) {
      fields = src[ViewBaseConfig].selectedFields;
    } else if (is(src, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(src);
    }
    return new PgSelectBase({
      table: src,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    }).setToken(this.authToken);
  }
};
var PgSelectQueryBuilderBase = class extends TypedQueryBuilder {
  static [entityKind] = "PgSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left");
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right");
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner");
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full");
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getPgSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/pg-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", false);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/pg-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", true);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/pg-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", false);
  /**
   * Adds `intersect all` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets including all duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
   *
   * @example
   *
   * ```ts
   * // Select all products and quantities that are ordered by both regular and VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered
   * })
   * .from(regularCustomerOrders)
   * .intersectAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { intersectAll } from 'drizzle-orm/pg-core'
   *
   * await intersectAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  intersectAll = this.createSetOperator("intersect", true);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/pg-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", false);
  /**
   * Adds `except all` set operator to the query.
   *
   * Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
   *
   * @example
   *
   * ```ts
   * // Select all products that are ordered by regular customers but not by VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered,
   * })
   * .from(regularCustomerOrders)
   * .exceptAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered,
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { exceptAll } from 'drizzle-orm/pg-core'
   *
   * await exceptAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  exceptAll = this.createSetOperator("except", true);
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /**
   * Adds a `for` clause to the query.
   *
   * Calling this method will specify a lock strength for this query that controls how strictly it acquires exclusive access to the rows being queried.
   *
   * See docs: {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE}
   *
   * @param strength the lock strength.
   * @param config the lock configuration.
   */
  for(strength, config = {}) {
    this.config.lockingClause = { strength, config };
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
};
var PgSelectBase = class extends PgSelectQueryBuilderBase {
  static [entityKind] = "PgSelect";
  /** @internal */
  _prepare(name) {
    const { session, config, dialect, joinsNotNullableMap, authToken } = this;
    if (!session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const fieldsList = orderSelectedFields(config.fields);
      const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name, true);
      query.joinsNotNullableMap = joinsNotNullableMap;
      return query.setToken(authToken);
    });
  }
  /**
   * Create a prepared statement for this query. This allows
   * the database to remember this query for the given session
   * and call it by name, rather than specifying the full query.
   *
   * {@link https://www.postgresql.org/docs/current/sql-prepare.html | Postgres prepare documentation}
   */
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
};
applyMixins(PgSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
var getPgSetOperators = () => ({
  union,
  unionAll,
  intersect,
  intersectAll,
  except,
  exceptAll
});
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var intersectAll = createSetOperator("intersect", true);
var except = createSetOperator("except", false);
var exceptAll = createSetOperator("except", true);

// node_modules/drizzle-orm/pg-core/query-builders/query-builder.js
var QueryBuilder = class {
  static [entityKind] = "PgQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = is(dialect, PgDialect) ? dialect : void 0;
    this.dialectConfig = is(dialect, PgDialect) ? void 0 : dialect;
  }
  $with = (alias, selection) => {
    const queryBuilder = this;
    const as = (qb) => {
      if (typeof qb === "function") {
        qb = qb(queryBuilder);
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    };
    return { as };
  };
  with(...queries) {
    const self = this;
    function select(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: { on }
      });
    }
    return { select, selectDistinct, selectDistinctOn };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect()
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: { on }
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new PgDialect(this.dialectConfig);
    }
    return this.dialect;
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/insert.js
var PgInsertBuilder = class {
  constructor(table, session, dialect, withList, overridingSystemValue_) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
    this.overridingSystemValue_ = overridingSystemValue_;
  }
  static [entityKind] = "PgInsertBuilder";
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  overridingSystemValue() {
    this.overridingSystemValue_ = true;
    return this;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new PgInsertBase(
      this.table,
      mappedValues,
      this.session,
      this.dialect,
      this.withList,
      false,
      this.overridingSystemValue_
    ).setToken(this.authToken);
  }
  select(selectQuery) {
    const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
    if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new PgInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
  }
};
var PgInsertBase = class extends QueryPromise {
  constructor(table, values, session, dialect, withList, select, overridingSystemValue_) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, withList, select, overridingSystemValue_ };
  }
  static [entityKind] = "PgInsert";
  config;
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config = {}) {
    if (config.target === void 0) {
      this.config.onConflict = sql`do nothing`;
    } else {
      let targetColumn = "";
      targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
      const whereSql = config.where ? sql` where ${config.where}` : void 0;
      this.config.onConflict = sql`(${sql.raw(targetColumn)})${whereSql} do nothing`;
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     targetWhere: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config) {
    if (config.where && (config.targetWhere || config.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    const whereSql = config.where ? sql` where ${config.where}` : void 0;
    const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
    const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
    let targetColumn = "";
    targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
    this.config.onConflict = sql`(${sql.raw(targetColumn)})${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/refresh-materialized-view.js
var PgRefreshMaterializedView = class extends QueryPromise {
  constructor(view, session, dialect) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { view };
  }
  static [entityKind] = "PgRefreshMaterializedView";
  config;
  concurrently() {
    if (this.config.withNoData !== void 0) {
      throw new Error("Cannot use concurrently and withNoData together");
    }
    this.config.concurrently = true;
    return this;
  }
  withNoData() {
    if (this.config.concurrently !== void 0) {
      throw new Error("Cannot use concurrently and withNoData together");
    }
    this.config.withNoData = true;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildRefreshMaterializedViewQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
};

// node_modules/drizzle-orm/pg-core/query-builders/update.js
var PgUpdateBuilder = class {
  constructor(table, session, dialect, withList) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "PgUpdateBuilder";
  authToken;
  setToken(token) {
    this.authToken = token;
    return this;
  }
  set(values) {
    return new PgUpdateBase(
      this.table,
      mapUpdateSet(this.table, values),
      this.session,
      this.dialect,
      this.withList
    ).setToken(this.authToken);
  }
};
var PgUpdateBase = class extends QueryPromise {
  constructor(table, set, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table, withList, joins: [] };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  static [entityKind] = "PgUpdate";
  config;
  tableName;
  joinsNotNullableMap;
  from(source) {
    const src = source;
    const tableName = getTableLikeName(src);
    if (typeof tableName === "string") {
      this.joinsNotNullableMap[tableName] = true;
    }
    this.config.from = src;
    return this;
  }
  getTableLikeFields(table) {
    if (is(table, PgTable)) {
      return table[Table.Symbol.Columns];
    } else if (is(table, Subquery)) {
      return table._.selectedFields;
    }
    return table[ViewBaseConfig].selectedFields;
  }
  createJoin(joinType) {
    return (table, on) => {
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (typeof on === "function") {
        const from = this.config.from && !is(this.config.from, SQL) ? this.getTableLikeFields(this.config.from) : void 0;
        on = on(
          new Proxy(
            this.config.table[Table.Symbol.Columns],
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          from && new Proxy(
            from,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * await db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * await db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * await db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * await db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields) {
    if (!fields) {
      fields = Object.assign({}, this.config.table[Table.Symbol.Columns]);
      if (this.config.from) {
        const tableName = getTableLikeName(this.config.from);
        if (typeof tableName === "string" && this.config.from && !is(this.config.from, SQL)) {
          const fromFields = this.getTableLikeFields(this.config.from);
          fields[tableName] = fromFields;
        }
        for (const join of this.config.joins) {
          const tableName2 = getTableLikeName(join.table);
          if (typeof tableName2 === "string" && !is(join.table, SQL)) {
            const fromFields = this.getTableLikeFields(join.table);
            fields[tableName2] = fromFields;
          }
        }
      }
    }
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return this._prepare().execute(placeholderValues, this.authToken);
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/count.js
var PgCountBuilder = class _PgCountBuilder extends SQL {
  constructor(params) {
    super(_PgCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
    this.params = params;
    this.mapWith(Number);
    this.session = params.session;
    this.sql = _PgCountBuilder.buildCount(
      params.source,
      params.filters
    );
  }
  sql;
  token;
  static [entityKind] = "PgCountBuilder";
  [Symbol.toStringTag] = "PgCountBuilder";
  session;
  static buildEmbeddedCount(source, filters) {
    return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
  }
  static buildCount(source, filters) {
    return sql`select count(*) as count from ${source}${sql.raw(" where ").if(filters)}${filters};`;
  }
  /** @intrnal */
  setToken(token) {
    this.token = token;
    return this;
  }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.session.count(this.sql, this.token)).then(
      onfulfilled,
      onrejected
    );
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/query.js
var RelationalQueryBuilder = class {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  static [entityKind] = "PgRelationalQueryBuilder";
  findMany(config) {
    return new PgRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many"
    );
  }
  findFirst(config) {
    return new PgRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first"
    );
  }
};
var PgRelationalQuery = class extends QueryPromise {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.mode = mode;
  }
  static [entityKind] = "PgRelationalQuery";
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const { query, builtQuery } = this._toSQL();
      return this.session.prepareQuery(
        builtQuery,
        void 0,
        name,
        true,
        (rawRows, mapColumnValue) => {
          const rows = rawRows.map(
            (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
          );
          if (this.mode === "first") {
            return rows[0];
          }
          return rows;
        }
      );
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  _getQuery() {
    return this.dialect.buildRelationalQueryWithoutPK({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
  }
  /** @internal */
  getSQL() {
    return this._getQuery().sql;
  }
  _toSQL() {
    const query = this._getQuery();
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute() {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(void 0, this.authToken);
    });
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/raw.js
var PgRaw = class extends QueryPromise {
  constructor(execute, sql2, query, mapBatchResult) {
    super();
    this.execute = execute;
    this.sql = sql2;
    this.query = query;
    this.mapBatchResult = mapBatchResult;
  }
  static [entityKind] = "PgRaw";
  /** @internal */
  getSQL() {
    return this.sql;
  }
  getQuery() {
    return this.query;
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
};

// node_modules/drizzle-orm/pg-core/db.js
var PgDatabase = class {
  constructor(dialect, session, schema) {
    this.dialect = dialect;
    this.session = session;
    this._ = schema ? {
      schema: schema.schema,
      fullSchema: schema.fullSchema,
      tableNamesMap: schema.tableNamesMap,
      session
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {},
      session
    };
    this.query = {};
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        this.query[tableName] = new RelationalQueryBuilder(
          schema.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema.fullSchema[tableName],
          columns,
          dialect,
          session
        );
      }
    }
  }
  static [entityKind] = "PgDatabase";
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with = (alias, selection) => {
    const self = this;
    const as = (qb) => {
      if (typeof qb === "function") {
        qb = qb(new QueryBuilder(self.dialect));
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    };
    return { as };
  };
  $count(source, filters) {
    return new PgCountBuilder({ source, filters, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self = this;
    function select(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: { on }
      });
    }
    function update(table) {
      return new PgUpdateBuilder(table, self.session, self.dialect, queries);
    }
    function insert(table) {
      return new PgInsertBuilder(table, self.session, self.dialect, queries);
    }
    function delete_(table) {
      return new PgDeleteBase(table, self.session, self.dialect, queries);
    }
    return { select, selectDistinct, selectDistinctOn, update, insert, delete: delete_ };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: { on }
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table) {
    return new PgUpdateBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(table) {
    return new PgInsertBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(table) {
    return new PgDeleteBase(table, this.session, this.dialect);
  }
  refreshMaterializedView(view) {
    return new PgRefreshMaterializedView(view, this.session, this.dialect);
  }
  authToken;
  execute(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    const builtQuery = this.dialect.sqlToQuery(sequel);
    const prepared = this.session.prepareQuery(
      builtQuery,
      void 0,
      void 0,
      false
    );
    return new PgRaw(
      () => prepared.execute(void 0, this.authToken),
      sequel,
      builtQuery,
      (result) => prepared.mapResult(result, true)
    );
  }
  transaction(transaction, config) {
    return this.session.transaction(transaction, config);
  }
};

// node_modules/drizzle-orm/pg-core/indexes.js
var IndexBuilderOn = class {
  constructor(unique, name) {
    this.unique = unique;
    this.name = name;
  }
  static [entityKind] = "PgIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if (is(it, SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      false,
      this.name
    );
  }
  onOnly(...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if (is(it, SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = it.defaultConfig;
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name
    );
  }
  /**
   * Specify what index method to use. Choices are `btree`, `hash`, `gist`, `spgist`, `gin`, `brin`, or user-installed access methods like `bloom`. The default method is `btree.
   *
   * If you have the `pg_vector` extension installed in your database, you can use the `hnsw` and `ivfflat` options, which are predefined types.
   *
   * **You can always specify any string you want in the method, in case Drizzle doesn't have it natively in its types**
   *
   * @param method The name of the index method to be used
   * @param columns
   * @returns
   */
  using(method, ...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if (is(it, SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name,
      method
    );
  }
};
var IndexBuilder = class {
  static [entityKind] = "PgIndexBuilder";
  /** @internal */
  config;
  constructor(columns, unique, only, name, method = "btree") {
    this.config = {
      name,
      columns,
      unique,
      only,
      method
    };
  }
  concurrently() {
    this.config.concurrently = true;
    return this;
  }
  with(obj) {
    this.config.with = obj;
    return this;
  }
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
};
var Index = class {
  static [entityKind] = "PgIndex";
  config;
  constructor(config, table) {
    this.config = { ...config, table };
  }
};
function index(name) {
  return new IndexBuilderOn(false, name);
}

// node_modules/drizzle-orm/pg-core/session.js
var PgPreparedQuery = class {
  constructor(query) {
    this.query = query;
  }
  authToken;
  getQuery() {
    return this.query;
  }
  mapResult(response, _isFromBatch) {
    return response;
  }
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  static [entityKind] = "PgPreparedQuery";
  /** @internal */
  joinsNotNullableMap;
};
var PgSession = class {
  constructor(dialect) {
    this.dialect = dialect;
  }
  static [entityKind] = "PgSession";
  /** @internal */
  execute(query, token) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      const prepared = tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.prepareQuery(
          this.dialect.sqlToQuery(query),
          void 0,
          void 0,
          false
        );
      });
      return prepared.setToken(token).execute(void 0, token);
    });
  }
  all(query) {
    return this.prepareQuery(
      this.dialect.sqlToQuery(query),
      void 0,
      void 0,
      false
    ).all();
  }
  /** @internal */
  async count(sql2, token) {
    const res = await this.execute(sql2, token);
    return Number(
      res[0]["count"]
    );
  }
};
var PgTransaction = class extends PgDatabase {
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  static [entityKind] = "PgTransaction";
  rollback() {
    throw new TransactionRollbackError();
  }
  /** @internal */
  getTransactionConfigSQL(config) {
    const chunks = [];
    if (config.isolationLevel) {
      chunks.push(`isolation level ${config.isolationLevel}`);
    }
    if (config.accessMode) {
      chunks.push(config.accessMode);
    }
    if (typeof config.deferrable === "boolean") {
      chunks.push(config.deferrable ? "deferrable" : "not deferrable");
    }
    return sql.raw(chunks.join(" "));
  }
  setTransaction(config) {
    return this.session.execute(sql`set transaction ${this.getTransactionConfigSQL(config)}`);
  }
};

// node_modules/drizzle-orm/neon-http/session.js
var rawQueryConfig = {
  arrayMode: false,
  fullResults: true
};
var queryConfig = {
  arrayMode: true,
  fullResults: true
};
var NeonHttpPreparedQuery = class extends PgPreparedQuery {
  constructor(client, query, logger, fields, _isResponseInArrayMode, customResultMapper) {
    super(query);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [entityKind] = "NeonHttpPreparedQuery";
  /** @internal */
  async execute(placeholderValues = {}, token = this.authToken) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    const { fields, client, query, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return client(
        query.sql,
        params,
        token === void 0 ? rawQueryConfig : {
          ...rawQueryConfig,
          authToken: token
        }
      );
    }
    const result = await client(
      query.sql,
      params,
      token === void 0 ? queryConfig : {
        ...queryConfig,
        authToken: token
      }
    );
    return this.mapResult(result);
  }
  mapResult(result) {
    if (!this.fields && !this.customResultMapper) {
      return result;
    }
    const rows = result.rows;
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
  }
  all(placeholderValues = {}) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.client(
      this.query.sql,
      params,
      this.authToken === void 0 ? rawQueryConfig : {
        ...rawQueryConfig,
        authToken: this.authToken
      }
    ).then((result) => result.rows);
  }
  /** @internal */
  values(placeholderValues = {}, token) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.client(this.query.sql, params, { arrayMode: true, fullResults: true, authToken: token }).then((result) => result.rows);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};
var NeonHttpSession = class extends PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "NeonHttpSession";
  logger;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
    return new NeonHttpPreparedQuery(
      this.client,
      query,
      this.logger,
      fields,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      builtQueries.push(
        this.client(builtQuery.sql, builtQuery.params, {
          fullResults: true,
          arrayMode: preparedQuery.isResponseInArrayMode()
        })
      );
    }
    const batchResults = await this.client.transaction(builtQueries, queryConfig);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  // change return type to QueryRows<true>
  async query(query, params) {
    this.logger.logQuery(query, params);
    const result = await this.client(query, params, { arrayMode: true, fullResults: true });
    return result;
  }
  // change return type to QueryRows<false>
  async queryObjects(query, params) {
    return this.client(query, params, { arrayMode: false, fullResults: true });
  }
  /** @internal */
  async count(sql2, token) {
    const res = await this.execute(sql2, token);
    return Number(
      res["rows"][0]["count"]
    );
  }
  async transaction(_transaction, _config = {}) {
    throw new Error("No transactions support in neon-http driver");
  }
};
var NeonTransaction = class extends PgTransaction {
  static [entityKind] = "NeonHttpTransaction";
  async transaction(_transaction) {
    throw new Error("No transactions support in neon-http driver");
  }
};

// node_modules/drizzle-orm/neon-http/driver.js
var NeonHttpDriver = class {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
    this.initMappers();
  }
  static [entityKind] = "NeonHttpDriver";
  createSession(schema) {
    return new NeonHttpSession(this.client, this.dialect, schema, { logger: this.options.logger });
  }
  initMappers() {
    import_serverless.types.setTypeParser(import_serverless.types.builtins.TIMESTAMPTZ, (val) => val);
    import_serverless.types.setTypeParser(import_serverless.types.builtins.TIMESTAMP, (val) => val);
    import_serverless.types.setTypeParser(import_serverless.types.builtins.DATE, (val) => val);
    import_serverless.types.setTypeParser(import_serverless.types.builtins.INTERVAL, (val) => val);
  }
};
function wrap(target, token, cb, deep) {
  return new Proxy(target, {
    get(target2, p) {
      const element = target2[p];
      if (typeof element !== "function" && (typeof element !== "object" || element === null))
        return element;
      if (deep)
        return wrap(element, token, cb);
      if (p === "query")
        return wrap(element, token, cb, true);
      return new Proxy(element, {
        apply(target3, thisArg, argArray) {
          const res = target3.call(thisArg, ...argArray);
          if (typeof res === "object" && res !== null && "setToken" in res && typeof res.setToken === "function") {
            res.setToken(token);
          }
          return cb(target3, p, res);
        }
      });
    }
  });
}
var NeonHttpDatabase = class extends PgDatabase {
  static [entityKind] = "NeonHttpDatabase";
  $withAuth(token) {
    this.authToken = token;
    return wrap(this, token, (target, p, res) => {
      if (p === "with") {
        return wrap(res, token, (_, __, res2) => res2);
      }
      return res;
    });
  }
  async batch(batch) {
    return this.session.batch(batch);
  }
};
function construct(client, config = {}) {
  const dialect = new PgDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const driver = new NeonHttpDriver(client, dialect, { logger });
  const session = driver.createSession(schema);
  const db2 = new NeonHttpDatabase(
    dialect,
    session,
    schema
  );
  db2.$client = client;
  return db2;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = (0, import_serverless.neon)(params[0]);
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client)
      return construct(client, drizzleConfig);
    if (typeof connection === "object") {
      const { connectionString, ...options } = connection;
      const instance2 = (0, import_serverless.neon)(connectionString, options);
      return construct(instance2, drizzleConfig);
    }
    const instance = (0, import_serverless.neon)(connection);
    return construct(instance, drizzleConfig);
  }
  return construct(params[0], params[1]);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));

// server/databaseStorage.ts
var import_serverless2 = require("@neondatabase/serverless");

// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json2 = JSON.stringify(obj, null, 2);
  return json2.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
    return false;
  }
}
function isValidCidr(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index2) {
    return new _ZodObject({
      ...this._def,
      catchall: index2
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types2, params) => {
  return new ZodUnion({
    options: types2,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index2 = 0; index2 < a.length; index2++) {
      const itemA = a[index2];
      const itemB = b[index2];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index2) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index2, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index2, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          var _a2, _b2;
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = (_b2 = (_a2 = params.fatal) !== null && _a2 !== void 0 ? _a2 : fatal) !== null && _b2 !== void 0 ? _b2 : true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// node_modules/drizzle-zod/index.mjs
var CONSTANTS = {
  INT8_MIN: -128,
  INT8_MAX: 127,
  INT8_UNSIGNED_MAX: 255,
  INT16_MIN: -32768,
  INT16_MAX: 32767,
  INT16_UNSIGNED_MAX: 65535,
  INT24_MIN: -8388608,
  INT24_MAX: 8388607,
  INT24_UNSIGNED_MAX: 16777215,
  INT32_MIN: -2147483648,
  INT32_MAX: 2147483647,
  INT32_UNSIGNED_MAX: 4294967295,
  INT48_MIN: -140737488355328,
  INT48_MAX: 140737488355327,
  INT48_UNSIGNED_MAX: 281474976710655,
  INT64_MIN: -9223372036854775808n,
  INT64_MAX: 9223372036854775807n,
  INT64_UNSIGNED_MAX: 18446744073709551615n
};
function isColumnType(column, columnTypes) {
  return columnTypes.includes(column.columnType);
}
function isWithEnum(column) {
  return "enumValues" in column && Array.isArray(column.enumValues) && column.enumValues.length > 0;
}
var literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
var jsonSchema = z.union([literalSchema, z.record(z.any()), z.array(z.any())]);
var bufferSchema = z.custom((v) => v instanceof Buffer);
function columnToSchema(column, factory) {
  const z$1 = factory?.zodInstance ?? z;
  const coerce2 = factory?.coerce ?? {};
  let schema;
  if (isWithEnum(column)) {
    schema = column.enumValues.length ? z$1.enum(column.enumValues) : z$1.string();
  }
  if (!schema) {
    if (isColumnType(column, ["PgGeometry", "PgPointTuple"])) {
      schema = z$1.tuple([z$1.number(), z$1.number()]);
    } else if (isColumnType(column, ["PgGeometryObject", "PgPointObject"])) {
      schema = z$1.object({ x: z$1.number(), y: z$1.number() });
    } else if (isColumnType(column, ["PgHalfVector", "PgVector"])) {
      schema = z$1.array(z$1.number());
      schema = column.dimensions ? schema.length(column.dimensions) : schema;
    } else if (isColumnType(column, ["PgLine"])) {
      schema = z$1.tuple([z$1.number(), z$1.number(), z$1.number()]);
    } else if (isColumnType(column, ["PgLineABC"])) {
      schema = z$1.object({
        a: z$1.number(),
        b: z$1.number(),
        c: z$1.number()
      });
    } else if (isColumnType(column, ["PgArray"])) {
      schema = z$1.array(columnToSchema(column.baseColumn, z$1));
      schema = column.size ? schema.length(column.size) : schema;
    } else if (column.dataType === "array") {
      schema = z$1.array(z$1.any());
    } else if (column.dataType === "number") {
      schema = numberColumnToSchema(column, z$1, coerce2);
    } else if (column.dataType === "bigint") {
      schema = bigintColumnToSchema(column, z$1, coerce2);
    } else if (column.dataType === "boolean") {
      schema = coerce2 === true || coerce2.boolean ? z$1.coerce.boolean() : z$1.boolean();
    } else if (column.dataType === "date") {
      schema = coerce2 === true || coerce2.date ? z$1.coerce.date() : z$1.date();
    } else if (column.dataType === "string") {
      schema = stringColumnToSchema(column, z$1, coerce2);
    } else if (column.dataType === "json") {
      schema = jsonSchema;
    } else if (column.dataType === "custom") {
      schema = z$1.any();
    } else if (column.dataType === "buffer") {
      schema = bufferSchema;
    }
  }
  if (!schema) {
    schema = z$1.any();
  }
  return schema;
}
function numberColumnToSchema(column, z2, coerce2) {
  let unsigned = column.getSQLType().includes("unsigned");
  let min;
  let max;
  let integer2 = false;
  if (isColumnType(column, ["MySqlTinyInt", "SingleStoreTinyInt"])) {
    min = unsigned ? 0 : CONSTANTS.INT8_MIN;
    max = unsigned ? CONSTANTS.INT8_UNSIGNED_MAX : CONSTANTS.INT8_MAX;
    integer2 = true;
  } else if (isColumnType(column, [
    "PgSmallInt",
    "PgSmallSerial",
    "MySqlSmallInt",
    "SingleStoreSmallInt"
  ])) {
    min = unsigned ? 0 : CONSTANTS.INT16_MIN;
    max = unsigned ? CONSTANTS.INT16_UNSIGNED_MAX : CONSTANTS.INT16_MAX;
    integer2 = true;
  } else if (isColumnType(column, [
    "PgReal",
    "MySqlFloat",
    "MySqlMediumInt",
    "SingleStoreMediumInt",
    "SingleStoreFloat"
  ])) {
    min = unsigned ? 0 : CONSTANTS.INT24_MIN;
    max = unsigned ? CONSTANTS.INT24_UNSIGNED_MAX : CONSTANTS.INT24_MAX;
    integer2 = isColumnType(column, ["MySqlMediumInt", "SingleStoreMediumInt"]);
  } else if (isColumnType(column, [
    "PgInteger",
    "PgSerial",
    "MySqlInt",
    "SingleStoreInt"
  ])) {
    min = unsigned ? 0 : CONSTANTS.INT32_MIN;
    max = unsigned ? CONSTANTS.INT32_UNSIGNED_MAX : CONSTANTS.INT32_MAX;
    integer2 = true;
  } else if (isColumnType(column, [
    "PgDoublePrecision",
    "MySqlReal",
    "MySqlDouble",
    "SingleStoreReal",
    "SingleStoreDouble",
    "SQLiteReal"
  ])) {
    min = unsigned ? 0 : CONSTANTS.INT48_MIN;
    max = unsigned ? CONSTANTS.INT48_UNSIGNED_MAX : CONSTANTS.INT48_MAX;
  } else if (isColumnType(column, [
    "PgBigInt53",
    "PgBigSerial53",
    "MySqlBigInt53",
    "MySqlSerial",
    "SingleStoreBigInt53",
    "SingleStoreSerial",
    "SQLiteInteger"
  ])) {
    unsigned = unsigned || isColumnType(column, ["MySqlSerial", "SingleStoreSerial"]);
    min = unsigned ? 0 : Number.MIN_SAFE_INTEGER;
    max = Number.MAX_SAFE_INTEGER;
    integer2 = true;
  } else if (isColumnType(column, ["MySqlYear", "SingleStoreYear"])) {
    min = 1901;
    max = 2155;
    integer2 = true;
  } else {
    min = Number.MIN_SAFE_INTEGER;
    max = Number.MAX_SAFE_INTEGER;
  }
  let schema = coerce2 === true || coerce2?.number ? z2.coerce.number() : z2.number();
  schema = schema.min(min).max(max);
  return integer2 ? schema.int() : schema;
}
function bigintColumnToSchema(column, z2, coerce2) {
  const unsigned = column.getSQLType().includes("unsigned");
  const min = unsigned ? 0n : CONSTANTS.INT64_MIN;
  const max = unsigned ? CONSTANTS.INT64_UNSIGNED_MAX : CONSTANTS.INT64_MAX;
  const schema = coerce2 === true || coerce2?.bigint ? z2.coerce.bigint() : z2.bigint();
  return schema.min(min).max(max);
}
function stringColumnToSchema(column, z2, coerce2) {
  if (isColumnType(column, ["PgUUID"])) {
    return z2.string().uuid();
  }
  let max;
  let regex;
  let fixed = false;
  if (isColumnType(column, ["PgVarchar", "SQLiteText"])) {
    max = column.length;
  } else if (isColumnType(column, ["MySqlVarChar", "SingleStoreVarChar"])) {
    max = column.length ?? CONSTANTS.INT16_UNSIGNED_MAX;
  } else if (isColumnType(column, ["MySqlText", "SingleStoreText"])) {
    if (column.textType === "longtext") {
      max = CONSTANTS.INT32_UNSIGNED_MAX;
    } else if (column.textType === "mediumtext") {
      max = CONSTANTS.INT24_UNSIGNED_MAX;
    } else if (column.textType === "text") {
      max = CONSTANTS.INT16_UNSIGNED_MAX;
    } else {
      max = CONSTANTS.INT8_UNSIGNED_MAX;
    }
  }
  if (isColumnType(column, [
    "PgChar",
    "MySqlChar",
    "SingleStoreChar"
  ])) {
    max = column.length;
    fixed = true;
  }
  if (isColumnType(column, ["PgBinaryVector"])) {
    regex = /^[01]+$/;
    max = column.dimensions;
  }
  let schema = coerce2 === true || coerce2?.string ? z2.coerce.string() : z2.string();
  schema = regex ? schema.regex(regex) : schema;
  return max && fixed ? schema.length(max) : max ? schema.max(max) : schema;
}
function getColumns(tableLike) {
  return isTable(tableLike) ? getTableColumns(tableLike) : getViewSelectedFields(tableLike);
}
function handleColumns(columns, refinements, conditions, factory) {
  const columnSchemas = {};
  for (const [key, selected] of Object.entries(columns)) {
    if (!is(selected, Column) && !is(selected, SQL) && !is(selected, SQL.Aliased) && typeof selected === "object") {
      const columns2 = isTable(selected) || isView(selected) ? getColumns(selected) : selected;
      columnSchemas[key] = handleColumns(columns2, refinements[key] ?? {}, conditions, factory);
      continue;
    }
    const refinement = refinements[key];
    if (refinement !== void 0 && typeof refinement !== "function") {
      columnSchemas[key] = refinement;
      continue;
    }
    const column = is(selected, Column) ? selected : void 0;
    const schema = column ? columnToSchema(column, factory) : z.any();
    const refined = typeof refinement === "function" ? refinement(schema) : schema;
    if (conditions.never(column)) {
      continue;
    } else {
      columnSchemas[key] = refined;
    }
    if (column) {
      if (conditions.nullable(column)) {
        columnSchemas[key] = columnSchemas[key].nullable();
      }
      if (conditions.optional(column)) {
        columnSchemas[key] = columnSchemas[key].optional();
      }
    }
  }
  return z.object(columnSchemas);
}
var insertConditions = {
  never: (column) => column?.generated?.type === "always" || column?.generatedIdentity?.type === "always",
  optional: (column) => !column.notNull || column.notNull && column.hasDefault,
  nullable: (column) => !column.notNull
};
var createInsertSchema = (entity, refine) => {
  const columns = getColumns(entity);
  return handleColumns(columns, refine ?? {}, insertConditions);
};

// shared/schema.ts
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Replit Auth fields  
  username: varchar("username").notNull().unique(),
  // Required for authentication
  password: text("password"),
  // Optional - OIDC auth doesn't use passwords
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Panel Profits trading platform fields
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  // 'free', 'pro', 'elite'
  subscriptionStatus: text("subscription_status").default("active"),
  // 'active', 'cancelled', 'past_due'
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: text("stripe_customer_id"),
  monthlyTradingCredits: integer("monthly_trading_credits").default(0),
  usedTradingCredits: integer("used_trading_credits").default(0),
  competitionWins: integer("competition_wins").default(0),
  competitionRanking: integer("competition_ranking"),
  // Phase 1 Trading Balance & Limits
  virtualTradingBalance: decimal("virtual_trading_balance", { precision: 15, scale: 2 }).default("100000.00"),
  // Starting virtual cash for trading
  dailyTradingLimit: decimal("daily_trading_limit", { precision: 15, scale: 2 }).default("10000.00"),
  // Daily trading limit
  dailyTradingUsed: decimal("daily_trading_used", { precision: 15, scale: 2 }).default("0.00"),
  // Daily trading used
  maxPositionSize: decimal("max_position_size", { precision: 10, scale: 2 }).default("5000.00"),
  // Max single position size
  riskTolerance: text("risk_tolerance").default("moderate"),
  // 'conservative', 'moderate', 'aggressive'
  tradingPermissions: jsonb("trading_permissions").default('{"canTrade": true, "canUseMargin": false, "canShort": false}'),
  // Trading permissions
  lastTradingActivity: timestamp("last_trading_activity"),
  tradingStreakDays: integer("trading_streak_days").default(0),
  totalTradingProfit: decimal("total_trading_profit", { precision: 15, scale: 2 }).default("0.00"),
  // Mythological Houses System
  houseId: text("house_id"),
  // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  houseJoinedAt: timestamp("house_joined_at"),
  karma: integer("karma").default(0),
  // Karma score affecting trading bonuses
  // Karmic Alignment System - Dual axis alignment tracking
  lawfulChaoticAlignment: decimal("lawful_chaotic_alignment", { precision: 8, scale: 2 }).default("0.00"),
  // -100 (Chaotic) to +100 (Lawful)
  goodEvilAlignment: decimal("good_evil_alignment", { precision: 8, scale: 2 }).default("0.00"),
  // -100 (Evil) to +100 (Good)
  alignmentRevealed: boolean("alignment_revealed").default(false),
  // Whether user has accessed Scrying Chamber
  alignmentLastUpdated: timestamp("alignment_last_updated").defaultNow(),
  preferences: jsonb("preferences"),
  // UI settings, notifications, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var alignmentScores = pgTable("alignment_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Core alignment axes (normalized -100 to +100)
  ruthlessnessScore: decimal("ruthlessness_score", { precision: 6, scale: 2 }).default("0.00"),
  // -100 (Empathetic) to +100 (Ruthless)
  individualismScore: decimal("individualism_score", { precision: 6, scale: 2 }).default("0.00"),
  // -100 (Collective) to +100 (Individual)
  lawfulnessScore: decimal("lawfulness_score", { precision: 6, scale: 2 }).default("0.00"),
  // -100 (Chaotic) to +100 (Lawful)  
  greedScore: decimal("greed_score", { precision: 6, scale: 2 }).default("0.00"),
  // -100 (Restraint) to +100 (Greed)
  // Confidence multipliers (how consistent are their behaviors)
  ruthlessnessConfidence: decimal("ruthlessness_confidence", { precision: 4, scale: 2 }).default("1.00"),
  individualismConfidence: decimal("individualism_confidence", { precision: 4, scale: 2 }).default("1.00"),
  lawfulnessConfidence: decimal("lawfulness_confidence", { precision: 4, scale: 2 }).default("1.00"),
  greedConfidence: decimal("greed_confidence", { precision: 4, scale: 2 }).default("1.00"),
  // House assignment result
  assignedHouseId: varchar("assigned_house_id"),
  assignmentScore: decimal("assignment_score", { precision: 8, scale: 2 }),
  // Strength of match to house
  secondaryHouseId: varchar("secondary_house_id"),
  // Runner-up for close calls
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userDecisions = pgTable("user_decisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Decision context
  decisionType: text("decision_type").notNull(),
  // 'entry_test', 'trading', 'social', 'market_event'
  scenarioId: text("scenario_id"),
  // Which scenario/situation
  choiceId: text("choice_id"),
  // Which option they selected
  // Hidden alignment impact (not shown to user)
  ruthlessnessImpact: decimal("ruthlessness_impact", { precision: 5, scale: 2 }).default("0.00"),
  individualismImpact: decimal("individualism_impact", { precision: 5, scale: 2 }).default("0.00"),
  lawfulnessImpact: decimal("lawfulness_impact", { precision: 5, scale: 2 }).default("0.00"),
  greedImpact: decimal("greed_impact", { precision: 5, scale: 2 }).default("0.00"),
  // What the user sees (disguised as performance metrics)
  displayedScore: integer("displayed_score"),
  // Fake "skill" score shown to user
  displayedFeedback: text("displayed_feedback"),
  // Misleading feedback about trading acumen
  // Metadata
  responseTime: integer("response_time"),
  // Milliseconds to decide (reveals impulsivity)
  contextData: jsonb("context_data"),
  // Additional data about the decision
  createdAt: timestamp("created_at").defaultNow()
});
var knowledgeTestResults = pgTable("knowledge_test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Visible performance metrics (what user sees)
  profitScore: decimal("profit_score", { precision: 6, scale: 2 }).notNull(),
  // "Trading optimization" score
  performanceRating: text("performance_rating").notNull(),
  // 'exceptional', 'strong', 'developing', 'needs_improvement'
  displayedFeedback: text("displayed_feedback").notNull(),
  // Misleading feedback about trading prowess
  // Hidden knowledge assessment (actual purpose)
  knowledgeScore: decimal("knowledge_score", { precision: 6, scale: 2 }).notNull(),
  // 0-100 actual financial literacy
  tier: text("tier").notNull(),
  // 'novice', 'associate', 'trader', 'specialist', 'master'
  weakAreas: text("weak_areas").array(),
  // Knowledge gaps identified
  strengths: text("strengths").array(),
  // Areas of competence
  // Trading floor access control
  tradingFloorAccess: boolean("trading_floor_access").default(false),
  // Can they trade?
  accessLevel: text("access_level").default("restricted"),
  // 'restricted', 'basic', 'standard', 'advanced', 'unlimited'
  restrictionReason: text("restriction_reason"),
  // Why access is limited
  // Test metadata
  completedAt: timestamp("completed_at").defaultNow(),
  timeSpent: integer("time_spent"),
  // Seconds to complete
  questionsAnswered: integer("questions_answered").notNull(),
  retakeAllowedAt: timestamp("retake_allowed_at"),
  // When they can retry
  attemptNumber: integer("attempt_number").default(1),
  createdAt: timestamp("created_at").defaultNow()
});
var knowledgeTestResponses = pgTable("knowledge_test_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resultId: varchar("result_id").notNull().references(() => knowledgeTestResults.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Question and response
  scenarioId: text("scenario_id").notNull(),
  // Which scenario from knowledgeTestScenarios
  choiceId: text("choice_id").notNull(),
  // Which option they selected
  // Scoring
  knowledgeScore: decimal("knowledge_score", { precision: 6, scale: 2 }).notNull(),
  // 0-100 for this question
  profitScore: decimal("profit_score", { precision: 6, scale: 2 }).notNull(),
  // Fake visible score
  // Analysis
  responseTime: integer("response_time"),
  // Milliseconds to answer
  isCorrect: boolean("is_correct").notNull(),
  // Based on knowledge score threshold
  knowledgeAreas: text("knowledge_areas").array(),
  // What this tested
  createdAt: timestamp("created_at").defaultNow()
});
var assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // 'character', 'comic', 'creator', 'publisher'
  description: text("description"),
  imageUrl: text("image_url"),
  coverImageUrl: text("cover_image_url"),
  metadata: jsonb("metadata"),
  // Additional asset-specific data
  // Seven Houses control
  houseId: varchar("house_id").references(() => sevenHouses.id),
  // Which house controls this asset
  houseInfluencePercent: decimal("house_influence_percent", { precision: 5, scale: 2 }).default("0.00"),
  // 0-100%
  narrativeWeight: decimal("narrative_weight", { precision: 5, scale: 2 }).default("50.00"),
  // How story events affect price
  controlledSince: timestamp("controlled_since"),
  // When house took control
  previousHouseId: varchar("previous_house_id"),
  // Previous controller for history
  // Vector embeddings for semantic search and recommendations
  metadataEmbedding: vector("metadata_embedding", { dimensions: 1536 }),
  // OpenAI ada-002 embedding dimensions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  timeframe: text("timeframe").notNull(),
  // '1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'
  periodStart: timestamp("period_start").notNull(),
  // Start of the time period
  open: decimal("open", { precision: 10, scale: 2 }).notNull(),
  high: decimal("high", { precision: 10, scale: 2 }).notNull(),
  low: decimal("low", { precision: 10, scale: 2 }).notNull(),
  close: decimal("close", { precision: 10, scale: 2 }).notNull(),
  volume: integer("volume").notNull(),
  change: decimal("change", { precision: 10, scale: 2 }),
  percentChange: decimal("percent_change", { precision: 8, scale: 2 }),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }),
  technicalIndicators: jsonb("technical_indicators"),
  // RSI, MACD, SMA, EMA, etc.
  // Vector embeddings for price pattern recognition and similarity matching
  pricePatternEmbedding: vector("price_pattern_embedding", { dimensions: 1536 }),
  // Price movement pattern vectors
  createdAt: timestamp("created_at").defaultNow()
});
var priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  grade: text("grade").notNull(),
  // 'ungraded', 'cgc-4.0', 'cgc-4.5', 'cgc-6.0', 'cgc-6.5', 'cgc-8.0', 'cgc-8.5', 'cgc-9.2', 'cgc-9.8', 'cgc-10.0'
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  source: text("source").notNull(),
  // 'pricecharting', 'calculated', 'market'
  snapshotDate: timestamp("snapshot_date").notNull(),
  metadata: jsonb("metadata"),
  // Additional data like sales volume, market conditions, etc.
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_price_history_asset_grade_date").on(table.assetId, table.grade, table.snapshotDate),
  index("idx_price_history_snapshot_date").on(table.snapshotDate)
]);
var portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }),
  dayChange: decimal("day_change", { precision: 10, scale: 2 }),
  dayChangePercent: decimal("day_change_percent", { precision: 8, scale: 2 }),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }),
  totalReturnPercent: decimal("total_return_percent", { precision: 8, scale: 2 }),
  diversificationScore: decimal("diversification_score", { precision: 3, scale: 1 }),
  // Phase 1 Portfolio Cash Management
  cashBalance: decimal("cash_balance", { precision: 15, scale: 2 }).default("100000.00"),
  // Available cash for trading
  initialCashAllocation: decimal("initial_cash_allocation", { precision: 15, scale: 2 }).default("100000.00"),
  // Initial starting amount
  portfolioType: text("portfolio_type").default("default"),
  // 'default', 'custom', 'competition'
  isDefault: boolean("is_default").default(false),
  // True for user's default trading portfolio
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var holdings = pgTable("holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  unrealizedGainLoss: decimal("unrealized_gain_loss", { precision: 10, scale: 2 }),
  unrealizedGainLossPercent: decimal("unrealized_gain_loss_percent", { precision: 8, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow()
});
var marketInsights = pgTable("market_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").references(() => assets.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }),
  // -1 to 1
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  // 0 to 1
  tags: text("tags").array(),
  source: text("source"),
  // AI model, news, social media, etc.
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"),
  // 'bullish', 'bearish', 'neutral', 'alert'
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  // Vector embeddings for semantic search through market insights and analysis
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  // Content semantic vectors for search
  createdAt: timestamp("created_at").defaultNow()
});
var marketIndices = pgTable("market_indices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  indexType: text("index_type").notNull(),
  // 'ppix50', 'ppix100', 'custom'
  methodology: text("methodology"),
  // Explanation of how index is calculated
  constituents: jsonb("constituents"),
  // Array of asset IDs with weights
  rebalanceFrequency: text("rebalance_frequency").default("monthly"),
  // 'daily', 'weekly', 'monthly', 'quarterly'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var marketIndexData = pgTable("market_index_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  indexId: varchar("index_id").notNull().references(() => marketIndices.id),
  timeframe: text("timeframe").notNull(),
  // '1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'
  periodStart: timestamp("period_start").notNull(),
  open: decimal("open", { precision: 10, scale: 2 }).notNull(),
  high: decimal("high", { precision: 10, scale: 2 }).notNull(),
  low: decimal("low", { precision: 10, scale: 2 }).notNull(),
  close: decimal("close", { precision: 10, scale: 2 }).notNull(),
  volume: integer("volume"),
  change: decimal("change", { precision: 10, scale: 2 }),
  percentChange: decimal("percent_change", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});
var watchlists = pgTable("watchlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var watchlistAssets = pgTable("watchlist_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  watchlistId: varchar("watchlist_id").notNull().references(() => watchlists.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  addedAt: timestamp("added_at").defaultNow()
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  type: text("type").notNull(),
  // 'buy', 'sell'
  side: text("side").notNull(),
  // 'buy', 'sell' - alias for type for compatibility
  orderType: text("order_type").notNull(),
  // 'market', 'limit', 'stop'
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  status: text("status").notNull(),
  // 'pending', 'filled', 'cancelled', 'partially_filled'
  // Phase 1 Enhanced Order Execution Tracking
  filledQuantity: decimal("filled_quantity", { precision: 10, scale: 4 }).default("0"),
  averageFillPrice: decimal("average_fill_price", { precision: 10, scale: 2 }),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0.00"),
  // Trading fees/commissions
  stopLossPrice: decimal("stop_loss_price", { precision: 10, scale: 2 }),
  // Stop loss level
  takeProfitPrice: decimal("take_profit_price", { precision: 10, scale: 2 }),
  // Take profit level
  orderExpiry: timestamp("order_expiry"),
  // Order expiration time
  executionDetails: jsonb("execution_details"),
  // Detailed execution information
  rejectionReason: text("rejection_reason"),
  // Reason if order was rejected
  filledAt: timestamp("filled_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var competitionLeagues = pgTable("competition_leagues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  season: text("season").notNull(),
  // 'Q1-2025', 'Q2-2025', etc.
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).default("0"),
  maxParticipants: integer("max_participants").default(100),
  currentParticipants: integer("current_participants").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("upcoming"),
  // 'upcoming', 'active', 'completed'
  rules: jsonb("rules"),
  // Competition rules and constraints
  aiOpponents: jsonb("ai_opponents"),
  // AI trading strategies and personalities
  createdAt: timestamp("created_at").defaultNow()
});
var competitionParticipants = pgTable("competition_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leagueId: varchar("league_id").notNull().references(() => competitionLeagues.id),
  userId: varchar("user_id").references(() => users.id),
  // null for AI participants
  participantType: text("participant_type").notNull(),
  // 'human', 'ai'
  participantName: text("participant_name").notNull(),
  aiStrategy: text("ai_strategy"),
  // For AI participants
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }).default("100000"),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }).default("0"),
  totalReturnPercent: decimal("total_return_percent", { precision: 8, scale: 2 }).default("0"),
  currentRank: integer("current_rank"),
  trades: integer("trades").default(0),
  winRate: decimal("win_rate", { precision: 8, scale: 2 }),
  riskScore: decimal("risk_score", { precision: 3, scale: 1 }),
  joinedAt: timestamp("joined_at").defaultNow()
});
var courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  // 'pressing', 'grading', 'investing', 'collection'
  difficulty: text("difficulty").notNull(),
  // 'beginner', 'intermediate', 'advanced'
  requiredTier: text("required_tier").notNull().default("free"),
  // 'free', 'pro', 'elite'
  duration: integer("duration"),
  // Duration in minutes
  modules: jsonb("modules"),
  // Course modules and content
  prerequisites: text("prerequisites").array(),
  learningOutcomes: text("learning_outcomes").array(),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userCourseProgress = pgTable("user_course_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  progress: decimal("progress", { precision: 8, scale: 2 }).default("0"),
  // 0-100%
  currentModule: integer("current_module").default(1),
  completedModules: integer("completed_modules").array(),
  timeSpent: integer("time_spent").default(0),
  // Minutes
  quizScores: jsonb("quiz_scores"),
  certificateEarned: boolean("certificate_earned").default(false),
  certificateUrl: text("certificate_url"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at")
});
var marketEvents = pgTable("market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  // 'movie', 'tv', 'comic_release', 'convention', etc.
  impact: text("impact"),
  // 'positive', 'negative', 'neutral'
  significance: decimal("significance", { precision: 2, scale: 1 }),
  // Impact significance 1-10
  affectedAssets: text("affected_assets").array(),
  // Asset IDs
  eventDate: timestamp("event_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var investmentClubs = pgTable("investment_clubs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  description: text("description"),
  minMembers: integer("min_members").default(3),
  minMonthsPositiveReturns: integer("min_months_positive_returns").default(3),
  status: text("status").notNull().default("active"),
  // 'active', 'suspended', 'dissolved'
  totalValue: decimal("total_value", { precision: 15, scale: 2 }),
  monthlyReturns: decimal("monthly_returns", { precision: 8, scale: 2 }).array(),
  // Track last 12 months
  createdAt: timestamp("created_at").defaultNow(),
  dissolvedAt: timestamp("dissolved_at")
});
var clubMemberships = pgTable("club_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: varchar("club_id").notNull().references(() => investmentClubs.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("member"),
  // 'owner', 'admin', 'member'
  contributionAmount: decimal("contribution_amount", { precision: 15, scale: 2 }),
  sharePercentage: decimal("share_percentage", { precision: 5, scale: 2 }),
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  status: text("status").notNull().default("active")
  // 'active', 'removed', 'left'
});
var clubPortfolios = pgTable("club_portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: varchar("club_id").notNull().references(() => investmentClubs.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }),
  cashBalance: decimal("cash_balance", { precision: 15, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});
var clubProposals = pgTable("club_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: varchar("club_id").notNull().references(() => investmentClubs.id),
  proposerId: varchar("proposer_id").notNull().references(() => users.id),
  proposalType: text("proposal_type").notNull(),
  // 'buy', 'sell', 'transfer_funds', 'change_rules'
  assetId: varchar("asset_id").references(() => assets.id),
  quantity: integer("quantity"),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }),
  rationale: text("rationale"),
  status: text("status").notNull().default("pending"),
  // 'pending', 'approved', 'rejected', 'executed', 'expired'
  votesFor: integer("votes_for").default(0),
  votesAgainst: integer("votes_against").default(0),
  votesNeeded: integer("votes_needed").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  executedAt: timestamp("executed_at")
});
var clubVotes = pgTable("club_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull().references(() => clubProposals.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  vote: text("vote").notNull(),
  // 'for', 'against', 'abstain'
  votedAt: timestamp("voted_at").defaultNow()
});
var clubActivityLog = pgTable("club_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: varchar("club_id").notNull().references(() => investmentClubs.id),
  actionType: text("action_type").notNull(),
  // 'proposal_created', 'vote_cast', 'proposal_executed', 'member_joined', 'member_left', 'funds_deposited', 'funds_withdrawn', 'status_changed'
  userId: varchar("user_id").references(() => users.id),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true
});
var insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  createdAt: true
});
var insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  createdAt: true
});
var insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  updatedAt: true
});
var insertMarketInsightSchema = createInsertSchema(marketInsights).omit({
  id: true,
  createdAt: true
});
var insertMarketIndexSchema = createInsertSchema(marketIndices).omit({
  id: true,
  createdAt: true
});
var insertMarketIndexDataSchema = createInsertSchema(marketIndexData).omit({
  id: true,
  createdAt: true
});
var insertWatchlistSchema = createInsertSchema(watchlists).omit({
  id: true,
  createdAt: true
});
var insertWatchlistAssetSchema = createInsertSchema(watchlistAssets).omit({
  id: true,
  addedAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  filledAt: true
}).refine((data) => {
  if (data.orderType === "limit" && (!data.price || parseFloat(data.price.toString()) <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Limit price is required for limit orders and must be greater than 0",
  path: ["price"]
});
var insertMarketEventSchema = createInsertSchema(marketEvents).omit({
  id: true,
  createdAt: true
});
var insertKnowledgeTestResultSchema = createInsertSchema(knowledgeTestResults).omit({
  id: true,
  createdAt: true,
  completedAt: true
});
var insertKnowledgeTestResponseSchema = createInsertSchema(knowledgeTestResponses).omit({
  id: true,
  createdAt: true
});
var insertInvestmentClubSchema = createInsertSchema(investmentClubs).omit({
  id: true,
  createdAt: true
});
var insertClubMembershipSchema = createInsertSchema(clubMemberships).omit({
  id: true,
  joinedAt: true
});
var insertClubPortfolioSchema = createInsertSchema(clubPortfolios).omit({
  id: true,
  createdAt: true
});
var insertClubProposalSchema = createInsertSchema(clubProposals).omit({
  id: true,
  createdAt: true,
  executedAt: true
});
var insertClubVoteSchema = createInsertSchema(clubVotes).omit({
  id: true,
  votedAt: true
});
var insertClubActivityLogSchema = createInsertSchema(clubActivityLog).omit({
  id: true,
  timestamp: true
});
var beatTheAIChallenge = pgTable("beat_the_ai_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetAssets: text("target_assets").array().notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).notNull(),
  participantCount: integer("participant_count").default(0),
  aiPrediction: decimal("ai_prediction", { precision: 8, scale: 2 }).notNull(),
  status: text("status", { enum: ["ACTIVE", "UPCOMING", "COMPLETED"] }).notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertBeatTheAIChallenge = createInsertSchema(beatTheAIChallenge).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var beatTheAIPrediction = pgTable("beat_the_ai_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").references(() => beatTheAIChallenge.id).notNull(),
  userId: varchar("user_id").notNull(),
  username: text("username").notNull(),
  assetSymbol: text("asset_symbol").notNull(),
  predictedChange: decimal("predicted_change", { precision: 8, scale: 2 }).notNull(),
  submissionTime: timestamp("submission_time").defaultNow().notNull(),
  actualChange: decimal("actual_change", { precision: 8, scale: 2 }),
  score: decimal("score", { precision: 8, scale: 2 }),
  isWinner: boolean("is_winner").default(false)
});
var insertBeatTheAIPrediction = createInsertSchema(beatTheAIPrediction).omit({
  id: true,
  submissionTime: true,
  actualChange: true,
  score: true,
  isWinner: true
});
var beatTheAILeaderboard = pgTable("beat_the_ai_leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  username: text("username").notNull(),
  totalScore: decimal("total_score", { precision: 10, scale: 2 }).default("0"),
  accuracy: decimal("accuracy", { precision: 8, scale: 2 }).default("0"),
  totalPredictions: integer("total_predictions").default(0),
  winnings: decimal("winnings", { precision: 10, scale: 2 }).default("0"),
  rank: integer("rank").default(0),
  lastActive: timestamp("last_active").defaultNow().notNull()
});
var insertBeatTheAILeaderboard = createInsertSchema(beatTheAILeaderboard).omit({
  id: true,
  lastActive: true
});
var comicSeries = pgTable("comic_series", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seriesName: text("series_name").notNull(),
  publisher: text("publisher").notNull(),
  // Marvel, DC, etc.
  year: integer("year"),
  issueCount: text("issue_count"),
  // "73 issues (73 indexed)"
  coverStatus: text("cover_status"),
  // "Gallery", "Have 8 (Need 2)"
  publishedPeriod: text("published_period"),
  // "March 1941 - July 1949"
  seriesUrl: text("series_url"),
  // Link to comics.org series page
  coversUrl: text("covers_url"),
  // Link to covers gallery
  scansUrl: text("scans_url"),
  // Link to scans if available
  featuredCoverUrl: text("featured_cover_url"),
  // Featured cover image for display
  description: text("description"),
  // Vector embeddings for series search and recommendations
  seriesEmbedding: vector("series_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var comicIssues = pgTable("comic_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seriesId: varchar("series_id").references(() => comicSeries.id),
  comicName: text("comic_name").notNull(),
  activeYears: text("active_years"),
  // "(2016)" or "(2012 - 2014)"
  issueTitle: text("issue_title").notNull(),
  publishDate: text("publish_date"),
  // "April 01, 2016"
  issueDescription: text("issue_description"),
  penciler: text("penciler"),
  writer: text("writer"),
  coverArtist: text("cover_artist"),
  imprint: text("imprint"),
  // "Marvel Universe"
  format: text("format"),
  // "Comic", "Infinite Comic"
  rating: text("rating"),
  // "Rated T+"
  price: text("price"),
  // "$3.99", "Free"
  coverImageUrl: text("cover_image_url"),
  // Generated or extracted cover URL
  issueNumber: integer("issue_number"),
  volume: integer("volume"),
  // Market data
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  gradeCondition: text("grade_condition"),
  // CGC grade if known
  marketTrend: text("market_trend"),
  // 'up', 'down', 'stable'
  // Vector embeddings for content search and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var comicCreators = pgTable("comic_creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  // 'writer', 'penciler', 'inker', 'colorist', 'cover_artist', 'editor'
  biography: text("biography"),
  imageUrl: text("image_url"),
  birthDate: text("birth_date"),
  deathDate: text("death_date"),
  // If applicable
  nationality: text("nationality"),
  // Career statistics
  totalIssues: integer("total_issues").default(0),
  activeYears: text("active_years"),
  // "1960-2020"
  notableWorks: text("notable_works").array(),
  awards: text("awards").array(),
  // Market influence
  marketInfluence: decimal("market_influence", { precision: 8, scale: 2 }),
  // 0-100 score
  trendingScore: decimal("trending_score", { precision: 8, scale: 2 }),
  // Current trending
  // Vector embeddings for creator search and style matching
  creatorEmbedding: vector("creator_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var featuredComics = pgTable("featured_comics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  issueId: varchar("issue_id").references(() => comicIssues.id),
  seriesId: varchar("series_id").references(() => comicSeries.id),
  featureType: text("feature_type").notNull(),
  // 'hero_banner', 'trending', 'new_release', 'classic'
  displayOrder: integer("display_order").default(0),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  featuredImageUrl: text("featured_image_url"),
  callToAction: text("call_to_action"),
  // "Read Now", "Add to Watchlist"
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var comicGradingPredictions = pgTable("comic_grading_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  // Optional - for logged-in users
  imageUrl: text("image_url").notNull(),
  // URL of uploaded comic image
  imageName: text("image_name"),
  // Original filename
  // CGC Grade prediction (0.5-10.0 scale matching CGC standards)
  predictedGrade: decimal("predicted_grade", { precision: 3, scale: 1 }).notNull(),
  gradeCategory: text("grade_category").notNull(),
  // 'Poor', 'Fair', 'Good', 'Very Good', 'Fine', 'Very Fine', 'Near Mint', 'Mint'
  // Condition factors analysis
  conditionFactors: jsonb("condition_factors").notNull(),
  // { corners, spine, pages, colors, creases, tears, etc. }
  // AI analysis details
  confidenceScore: decimal("confidence_score", { precision: 8, scale: 2 }).notNull(),
  // 0-100 percentage
  analysisDetails: text("analysis_details").notNull(),
  // Detailed AI explanation
  gradingNotes: text("grading_notes"),
  // Specific observations affecting grade
  // Processing metadata
  processingTimeMs: integer("processing_time_ms"),
  // Time taken for AI analysis
  aiModel: text("ai_model").default("gpt-5"),
  // OpenAI model used
  // Status and timestamps
  status: text("status").notNull().default("completed"),
  // 'processing', 'completed', 'failed'
  // Vector embeddings for visual similarity search and pattern matching
  imageEmbedding: vector("image_embedding", { dimensions: 1536 }),
  // Image visual features for similarity matching
  createdAt: timestamp("created_at").defaultNow()
});
var insertComicSeriesSchema = createInsertSchema(comicSeries).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertComicIssueSchema = createInsertSchema(comicIssues).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertComicCreatorSchema = createInsertSchema(comicCreators).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertFeaturedComicSchema = createInsertSchema(featuredComics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertComicGradingPredictionSchema = createInsertSchema(comicGradingPredictions).omit({
  id: true,
  createdAt: true
});
var narrativeEvents = pgTable("narrative_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(),
  // 'house_war', 'hero_falls', 'crossover_event', 'writer_scandal', 'movie_announcement', 'reboot', 'supply_shock'
  // Affected entities
  affectedHouses: text("affected_houses").array(),
  // Array of house IDs
  affectedAssets: text("affected_assets").array(),
  // Array of asset IDs
  // Impact and duration
  impactPercentage: decimal("impact_percentage", { precision: 8, scale: 2 }).notNull(),
  // -100 to +100
  duration: integer("duration").notNull(),
  // Duration in seconds
  severity: text("severity").notNull().default("low"),
  // 'low', 'medium', 'high', 'catastrophic'
  // Visual and narrative elements
  soundEffect: text("sound_effect"),
  // Comic book sound effect
  visualStyle: text("visual_style"),
  // 'explosion', 'dramatic', 'subtle', 'catastrophic'
  narrative: text("narrative"),
  // Extended story narrative
  // Timing and status
  isActive: boolean("is_active").default(false),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  // Market conditions that triggered event
  triggerCondition: text("trigger_condition"),
  // 'bull_market', 'bear_market', 'sideways', 'random'
  marketContext: jsonb("market_context"),
  // Market stats when event triggered
  // Chain reactions and compound effects
  parentEventId: varchar("parent_event_id"),
  // If this event was triggered by another
  chainReactionProbability: decimal("chain_reaction_probability", { precision: 5, scale: 2 }).default("0.00"),
  // 0-100%
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertNarrativeEventSchema = createInsertSchema(narrativeEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var phase1MarketEvents = pgTable("phase1_market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(),
  // 'flash_crash', 'liquidity_crisis', 'margin_call_cascade', 'volatility_spike'
  severity: text("severity").notNull(),
  // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  description: text("description"),
  impact: jsonb("impact"),
  // { priceMultiplier: 0.95, volatilityBoost: 1.5, affectedAssets: ['all'] }
  visualEffect: text("visual_effect"),
  // 'screen_flash', 'red_wash', 'glitch', 'static'
  triggerVolatilityLevel: decimal("trigger_volatility_level", { precision: 8, scale: 2 }),
  // Volatility level that triggered this
  duration: integer("duration").default(60),
  // Event duration in seconds
  timestamp: timestamp("timestamp").defaultNow(),
  endTimestamp: timestamp("end_timestamp"),
  createdAt: timestamp("created_at").defaultNow()
});
var volatilityHistory = pgTable("volatility_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: decimal("level", { precision: 8, scale: 2 }).notNull(),
  // Current volatility multiplier (1.0 - 3.0+)
  marketPhase: text("market_phase").notNull(),
  // 'early_hours', 'mid_day', 'power_hour', 'terminal_hour'
  timeUntilTerminal: integer("time_until_terminal"),
  // Seconds until market close
  activeEvents: jsonb("active_events"),
  // Array of active event IDs
  affectedAssets: integer("affected_assets").default(0),
  // Number of assets affected
  tradingVolume: decimal("trading_volume", { precision: 15, scale: 2 }),
  // Total volume during this period
  priceSwings: jsonb("price_swings"),
  // { maxSwing: 0.15, avgSwing: 0.08 }
  timestamp: timestamp("timestamp").defaultNow()
});
var tradingSessions = pgTable("trading_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  sessionStart: timestamp("session_start").defaultNow().notNull(),
  sessionEnd: timestamp("session_end"),
  // Session Performance Metrics
  startingBalance: decimal("starting_balance", { precision: 15, scale: 2 }).notNull(),
  endingBalance: decimal("ending_balance", { precision: 15, scale: 2 }),
  totalTrades: integer("total_trades").default(0),
  profitableTrades: integer("profitable_trades").default(0),
  sessionProfit: decimal("session_profit", { precision: 15, scale: 2 }).default("0.00"),
  sessionProfitPercent: decimal("session_profit_percent", { precision: 8, scale: 2 }).default("0.00"),
  largestWin: decimal("largest_win", { precision: 15, scale: 2 }).default("0.00"),
  largestLoss: decimal("largest_loss", { precision: 15, scale: 2 }).default("0.00"),
  // Session Activity
  assetsTraded: text("assets_traded").array(),
  // Array of asset IDs traded in this session
  tradingStrategy: text("trading_strategy"),
  // 'day_trading', 'swing_trading', 'position_trading'
  notes: text("notes"),
  // User notes about the session
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var assetCurrentPrices = pgTable("asset_current_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  bidPrice: decimal("bid_price", { precision: 10, scale: 2 }),
  askPrice: decimal("ask_price", { precision: 10, scale: 2 }),
  dayChange: decimal("day_change", { precision: 10, scale: 2 }),
  dayChangePercent: decimal("day_change_percent", { precision: 8, scale: 2 }),
  weekHigh: decimal("week_high", { precision: 10, scale: 2 }),
  // 52-week high price
  volume: integer("volume").default(0),
  lastTradePrice: decimal("last_trade_price", { precision: 10, scale: 2 }),
  lastTradeQuantity: decimal("last_trade_quantity", { precision: 10, scale: 4 }),
  lastTradeTime: timestamp("last_trade_time"),
  // Market status
  marketStatus: text("market_status").default("open"),
  // 'open', 'closed', 'suspended'
  priceSource: text("price_source").default("simulation"),
  // 'simulation', 'external_api', 'manual'
  // Volatility and risk metrics
  volatility: decimal("volatility", { precision: 8, scale: 2 }),
  // Price volatility percentage
  beta: decimal("beta", { precision: 3, scale: 2 }),
  // Beta relative to market
  // Weighted Market Cap fields for share-based pricing
  totalMarketValue: decimal("total_market_value", { precision: 20, scale: 2 }),
  // Sum of (census_count × price) across all grades
  totalFloat: bigint("total_float", { mode: "number" }),
  // Total shares available (census × shares_per_copy)
  sharesPerCopy: integer("shares_per_copy").default(100),
  // How many shares per physical comic (default 100)
  censusDistribution: jsonb("census_distribution"),
  // Grade distribution: [{grade: "CGC 9.8", count: 100, price: 50000}]
  scarcityModifier: decimal("scarcity_modifier", { precision: 5, scale: 4 }).default("1.0000"),
  // FloatScarcityMod: 0.90 - 1.10
  averageComicValue: decimal("average_comic_value", { precision: 15, scale: 2 }),
  // Average value per comic across all grades
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var tradingLimits = pgTable("trading_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").references(() => assets.id),
  // Asset-specific limits (null for general limits)
  limitType: text("limit_type").notNull(),
  // 'daily_volume', 'position_size', 'loss_limit', 'exposure_limit'
  limitValue: decimal("limit_value", { precision: 15, scale: 2 }).notNull(),
  currentUsage: decimal("current_usage", { precision: 15, scale: 2 }).default("0.00"),
  resetPeriod: text("reset_period").default("daily"),
  // 'daily', 'weekly', 'monthly', 'never'
  lastReset: timestamp("last_reset").defaultNow(),
  isActive: boolean("is_active").default(true),
  // Breach tracking
  breachCount: integer("breach_count").default(0),
  lastBreach: timestamp("last_breach"),
  breachAction: text("breach_action").default("block"),
  // 'block', 'warn', 'log'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertTradingSessionSchema = createInsertSchema(tradingSessions).omit({
  id: true,
  createdAt: true
});
var insertAssetCurrentPriceSchema = createInsertSchema(assetCurrentPrices).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTradingLimitSchema = createInsertSchema(tradingLimits).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  orderId: varchar("order_id").references(() => orders.id),
  // Link to the order that created this trade
  side: text("side").notNull(),
  // 'buy' or 'sell'
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0.00"),
  // P&L Tracking
  pnl: decimal("pnl", { precision: 15, scale: 2 }),
  // Realized P&L for sell trades
  pnlPercent: decimal("pnl_percent", { precision: 8, scale: 2 }),
  // Percentage P&L
  costBasis: decimal("cost_basis", { precision: 15, scale: 2 }),
  // For sell trades - the original cost
  // Trade metadata
  executedAt: timestamp("executed_at").defaultNow().notNull(),
  tradeType: text("trade_type").default("manual"),
  // 'manual', 'stop_loss', 'take_profit', 'liquidation'
  notes: text("notes"),
  // Moral consequence tracking
  moralImpact: decimal("moral_impact", { precision: 10, scale: 2 }),
  // Moral impact score of the trade
  createdAt: timestamp("created_at").defaultNow()
});
var positions = pgTable("positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }).notNull(),
  totalCostBasis: decimal("total_cost_basis", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  unrealizedPnl: decimal("unrealized_pnl", { precision: 15, scale: 2 }),
  unrealizedPnlPercent: decimal("unrealized_pnl_percent", { precision: 8, scale: 2 }),
  // Position metadata
  firstBuyDate: timestamp("first_buy_date").notNull(),
  lastTradeDate: timestamp("last_trade_date").notNull(),
  totalBuys: integer("total_buys").default(1),
  totalSells: integer("total_sells").default(0),
  holdingPeriodDays: integer("holding_period_days"),
  // Risk management
  stopLossPrice: decimal("stop_loss_price", { precision: 10, scale: 2 }),
  takeProfitPrice: decimal("take_profit_price", { precision: 10, scale: 2 }),
  maxPositionValue: decimal("max_position_value", { precision: 15, scale: 2 }),
  // Historical max value
  maxUnrealizedProfit: decimal("max_unrealized_profit", { precision: 15, scale: 2 }),
  // Track max profit reached
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var balances = pgTable("balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  // Core balances
  cash: decimal("cash", { precision: 15, scale: 2 }).notNull().default("100000.00"),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull().default("100000.00"),
  buyingPower: decimal("buying_power", { precision: 15, scale: 2 }).notNull().default("100000.00"),
  // Position values
  positionsValue: decimal("positions_value", { precision: 15, scale: 2 }).default("0.00"),
  totalCostBasis: decimal("total_cost_basis", { precision: 15, scale: 2 }).default("0.00"),
  // P&L tracking
  realizedPnl: decimal("realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  unrealizedPnl: decimal("unrealized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  totalPnl: decimal("total_pnl", { precision: 15, scale: 2 }).default("0.00"),
  // Daily tracking
  dayStartBalance: decimal("day_start_balance", { precision: 15, scale: 2 }),
  dayPnl: decimal("day_pnl", { precision: 15, scale: 2 }).default("0.00"),
  dayPnlPercent: decimal("day_pnl_percent", { precision: 8, scale: 2 }).default("0.00"),
  // Performance metrics
  allTimeHigh: decimal("all_time_high", { precision: 15, scale: 2 }).default("100000.00"),
  allTimeLow: decimal("all_time_low", { precision: 15, scale: 2 }).default("100000.00"),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }),
  // Percentage of winning trades
  sharpeRatio: decimal("sharpe_ratio", { precision: 5, scale: 2 }),
  // Risk-adjusted returns
  // Margin and risk
  marginUsed: decimal("margin_used", { precision: 15, scale: 2 }).default("0.00"),
  maintenanceMargin: decimal("maintenance_margin", { precision: 15, scale: 2 }).default("0.00"),
  marginCallLevel: decimal("margin_call_level", { precision: 15, scale: 2 }),
  // Timestamps
  lastTradeAt: timestamp("last_trade_at"),
  lastCalculatedAt: timestamp("last_calculated_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var moralStandings = pgTable("moral_standings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  corruptionLevel: decimal("corruption_level", { precision: 5, scale: 2 }).default("0.00"),
  // 0-100 scale
  totalVictims: integer("total_victims").default(0),
  bloodMoney: decimal("blood_money", { precision: 15, scale: 2 }).default("0.00"),
  // Total money taken from others
  totalHarm: decimal("total_harm", { precision: 15, scale: 2 }).default("0.00"),
  // Total financial harm caused
  lastConfession: timestamp("last_confession"),
  // Last time they "confessed" to reduce corruption
  confessionCount: integer("confession_count").default(0),
  soulWeight: text("soul_weight").default("unburdened"),
  // 'unburdened', 'tainted', 'heavy', 'crushing', 'damned'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var tradingVictims = pgTable("trading_victims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tradeId: varchar("trade_id").notNull().references(() => trades.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  // The trader who caused this victim
  victimName: text("victim_name").notNull(),
  // Generated realistic name
  victimStory: text("victim_story").notNull(),
  // The human cost of this trade
  lossAmount: decimal("loss_amount", { precision: 15, scale: 2 }).notNull(),
  impactLevel: text("impact_level").notNull(),
  // 'minor', 'moderate', 'severe', 'catastrophic'
  // Victim details for more emotional impact
  age: integer("age"),
  occupation: text("occupation"),
  familySize: integer("family_size"),
  consequence: text("consequence"),
  // What happened as a result
  createdAt: timestamp("created_at").defaultNow()
});
var insertMoralStandingSchema = createInsertSchema(moralStandings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTradingVictimSchema = createInsertSchema(tradingVictims).omit({
  id: true,
  createdAt: true
});
var insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  executedAt: true,
  createdAt: true
});
var insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBalanceSchema = createInsertSchema(balances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastCalculatedAt: true
});
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // 'order' | 'price_alert' | 'market_update' | 'portfolio'
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"),
  // 'low' | 'medium' | 'high' | 'critical'
  read: boolean("read").default(false),
  actionUrl: text("action_url"),
  // Optional URL for clickable actions
  metadata: jsonb("metadata"),
  // Additional notification data (order details, etc.)
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at")
  // Optional expiration date
});
var priceAlerts = pgTable("price_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  alertType: text("alert_type").notNull(),
  // 'price_above' | 'price_below' | 'percent_change' | 'volume_spike'
  thresholdValue: decimal("threshold_value", { precision: 10, scale: 2 }).notNull(),
  percentageThreshold: decimal("percentage_threshold", { precision: 8, scale: 2 }),
  // For percentage-based alerts
  isActive: boolean("is_active").default(true),
  lastTriggeredPrice: decimal("last_triggered_price", { precision: 10, scale: 2 }),
  triggerCount: integer("trigger_count").default(0),
  cooldownMinutes: integer("cooldown_minutes").default(60),
  // Prevent spam alerts
  name: text("name"),
  // User-defined alert name
  notes: text("notes"),
  // User notes about the alert
  createdAt: timestamp("created_at").defaultNow(),
  triggeredAt: timestamp("triggered_at"),
  lastCheckedAt: timestamp("last_checked_at").defaultNow()
});
var notificationPreferences = pgTable("notification_preferences", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  // Notification type preferences
  orderNotifications: boolean("order_notifications").default(true),
  priceAlerts: boolean("price_alerts").default(true),
  marketUpdates: boolean("market_updates").default(true),
  portfolioAlerts: boolean("portfolio_alerts").default(true),
  // Delivery method preferences
  emailNotifications: boolean("email_notifications").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  toastNotifications: boolean("toast_notifications").default(true),
  // Priority filtering
  lowPriorityEnabled: boolean("low_priority_enabled").default(true),
  mediumPriorityEnabled: boolean("medium_priority_enabled").default(true),
  highPriorityEnabled: boolean("high_priority_enabled").default(true),
  criticalPriorityEnabled: boolean("critical_priority_enabled").default(true),
  // Quiet hours settings
  quietHoursEnabled: boolean("quiet_hours_enabled").default(false),
  quietHoursStart: text("quiet_hours_start"),
  // "22:00" format
  quietHoursEnd: text("quiet_hours_end"),
  // "08:00" format
  quietHoursTimezone: text("quiet_hours_timezone").default("UTC"),
  // Advanced preferences
  groupSimilarNotifications: boolean("group_similar_notifications").default(true),
  maxDailyNotifications: integer("max_daily_notifications").default(50),
  soundEnabled: boolean("sound_enabled").default(true),
  vibrationEnabled: boolean("vibration_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var notificationTemplates = pgTable("notification_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  // 'order_filled', 'price_alert_triggered', etc.
  priority: text("priority").notNull().default("medium"),
  titleTemplate: text("title_template").notNull(),
  // "Order Filled: {assetName}"
  messageTemplate: text("message_template").notNull(),
  // "Your order for {quantity} shares of {assetName} has been filled at {price}"
  actionUrlTemplate: text("action_url_template"),
  // "/trading?order={orderId}"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  createdAt: true,
  triggeredAt: true,
  lastCheckedAt: true
});
var insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  createdAt: true,
  updatedAt: true
});
var insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var mythologicalHouses = pgTable("mythological_houses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  // "House of Eternity", "House of Conquest", etc.
  mythology: text("mythology").notNull(),
  // "Egyptian", "Roman", "Greek", "Norse", "Asian", "African", "Indian"
  firmName: text("firm_name").notNull(),
  // Hidden firm name overlay
  description: text("description").notNull(),
  philosophy: text("philosophy").notNull(),
  // Trading philosophy
  // House specializations
  primarySpecialization: text("primary_specialization").notNull(),
  // Asset type they excel in
  weaknessSpecialization: text("weakness_specialization").notNull(),
  // Asset type they struggle with
  // House modifiers and bonuses
  tradingBonusPercent: decimal("trading_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
  karmaMultiplier: decimal("karma_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  // Visual and thematic elements
  primaryColor: text("primary_color"),
  // UI color theme
  iconName: text("icon_name"),
  // Lucide icon
  backgroundImageUrl: text("background_image_url"),
  // House lore and storytelling
  originStory: text("origin_story"),
  notableMembers: text("notable_members").array(),
  traditions: text("traditions").array(),
  // House statistics
  totalMembers: integer("total_members").default(0),
  averagePerformance: decimal("average_performance", { precision: 8, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userHouseMembership = pgTable("user_house_membership", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  houseId: varchar("house_id").notNull().references(() => mythologicalHouses.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  membershipLevel: text("membership_level").default("initiate"),
  // "initiate", "member", "senior", "elder"
  // House-specific progression
  houseLoyalty: decimal("house_loyalty", { precision: 8, scale: 2 }).default("0.00"),
  // 0-100
  houseContributions: integer("house_contributions").default(0),
  houseRank: integer("house_rank"),
  // House bonuses and penalties
  currentBonusPercent: decimal("current_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
  totalBonusEarned: decimal("total_bonus_earned", { precision: 15, scale: 2 }).default("0.00"),
  // Status tracking
  isActive: boolean("is_active").default(true),
  leftAt: timestamp("left_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var userKarmicAlignment = pgTable("user_karmic_alignment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Current karmic state
  currentAlignment: text("current_alignment"),
  // "good", "neutral", "evil" (null until Reckoning)
  karmaScore: decimal("karma_score", { precision: 8, scale: 2 }).default("0.00"),
  // Running karma total
  alignmentStrength: decimal("alignment_strength", { precision: 8, scale: 2 }).default("0.00"),
  // How locked in
  // Behavioral tracking (hidden from user until Reckoning)
  honestyScore: decimal("honesty_score", { precision: 8, scale: 2 }).default("50.00"),
  // 0-100
  cooperationScore: decimal("cooperation_score", { precision: 8, scale: 2 }).default("50.00"),
  // 0-100
  exploitationScore: decimal("exploitation_score", { precision: 8, scale: 2 }).default("0.00"),
  // 0-100
  generosityScore: decimal("generosity_score", { precision: 8, scale: 2 }).default("50.00"),
  // 0-100
  // Action counters
  honestActions: integer("honest_actions").default(0),
  deceptiveActions: integer("deceptive_actions").default(0),
  helpfulActions: integer("helpful_actions").default(0),
  harmfulActions: integer("harmful_actions").default(0),
  // Trading modifiers (applied secretly)
  successModifier: decimal("success_modifier", { precision: 3, scale: 2 }).default("1.00"),
  // 0.5-1.5 multiplier
  luckyBreakChance: decimal("lucky_break_chance", { precision: 3, scale: 2 }).default("0.05"),
  // 0-0.2 chance
  badLuckChance: decimal("bad_luck_chance", { precision: 3, scale: 2 }).default("0.05"),
  // 0-0.2 chance
  // Reckoning system
  hasExperiencedReckoning: boolean("has_experienced_reckoning").default(false),
  reckoningDate: timestamp("reckoning_date"),
  chosenAlignment: text("chosen_alignment"),
  // Post-reckoning chosen alignment
  alignmentLocked: boolean("alignment_locked").default(false),
  // Progression tracking
  learningModuleBonuses: jsonb("learning_module_bonuses"),
  // House-specific bonuses from education
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var karmicActionsLog = pgTable("karmic_actions_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  actionType: text("action_type").notNull(),
  // "trade", "tip", "information_sharing", "market_manipulation"
  actionCategory: text("action_category").notNull(),
  // "honest", "deceptive", "helpful", "harmful", "neutral"
  karmaImpact: decimal("karma_impact", { precision: 8, scale: 2 }).notNull(),
  // Can be negative
  description: text("description").notNull(),
  // Context data
  relatedAssetId: varchar("related_asset_id").references(() => assets.id),
  relatedOrderId: varchar("related_order_id").references(() => orders.id),
  targetUserId: varchar("target_user_id").references(() => users.id),
  // If action affects another user
  metadata: jsonb("metadata"),
  // Additional context
  // Alignment influence
  alignmentDirection: text("alignment_direction"),
  // "good", "evil", "neutral"
  strengthImpact: decimal("strength_impact", { precision: 3, scale: 2 }).default("0.00"),
  // Visibility
  isVisibleToUser: boolean("is_visible_to_user").default(false),
  // Hidden until Reckoning
  revealedAt: timestamp("revealed_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var testQuestions = pgTable("test_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionNumber: integer("question_number").notNull().unique(),
  // Order of presentation
  category: text("category").notNull(),
  // 'risk_tolerance', 'moral_flexibility', 'leadership', 'loyalty_ambition', 'ends_means'
  scenario: text("scenario").notNull(),
  // The moral/ethical scenario description
  contextualSetup: text("contextual_setup"),
  // Additional context to make scenario more immersive
  // Options for the question (stored as JSONB for flexibility)
  options: jsonb("options").notNull(),
  // Array of {id, text, psychologicalWeights}
  // Psychological dimensions this question evaluates
  dimensions: jsonb("dimensions").notNull(),
  // {analytical: 0.8, aggressive: 0.2, strategic: 0.5, ...}
  // House alignment weights (how much each answer aligns with each house)
  houseWeights: jsonb("house_weights").notNull(),
  // {solon: {...}, velos_thorne: {...}, ...}
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var testResponses = pgTable("test_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  // Groups responses from a single test session
  questionId: varchar("question_id").notNull().references(() => testQuestions.id),
  selectedOptionId: text("selected_option_id").notNull(),
  // Which option they chose
  responseTime: integer("response_time"),
  // Milliseconds to answer (can indicate thoughtfulness)
  // Calculated psychological scores from this response
  dimensionScores: jsonb("dimension_scores"),
  // {analytical: 0.7, aggressive: 0.3, ...}
  houseAffinities: jsonb("house_affinities"),
  // {solon: 0.6, velos_thorne: 0.2, ...}
  respondedAt: timestamp("responded_at").defaultNow()
});
var testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  // One result per user
  sessionId: varchar("session_id").notNull().unique(),
  // Links to test session
  // Overall psychological profile
  psychologicalProfile: jsonb("psychological_profile").notNull(),
  // Comprehensive profile data
  // Primary house assignment
  assignedHouseId: text("assigned_house_id").notNull(),
  // Primary house match
  primaryAffinity: decimal("primary_affinity", { precision: 5, scale: 2 }).notNull(),
  // Match percentage
  // Secondary and tertiary affinities
  secondaryHouseId: text("secondary_house_id"),
  secondaryAffinity: decimal("secondary_affinity", { precision: 5, scale: 2 }),
  tertiaryHouseId: text("tertiary_house_id"),
  tertiaryAffinity: decimal("tertiary_affinity", { precision: 5, scale: 2 }),
  // All house scores for transparency
  allHouseScores: jsonb("all_house_scores").notNull(),
  // {solon: 0.75, velos_thorne: 0.45, ...}
  // Detailed dimension scores
  dimensionBreakdown: jsonb("dimension_breakdown").notNull(),
  // All psychological dimensions scored
  // Test metadata
  totalQuestions: integer("total_questions").notNull(),
  completionTime: integer("completion_time"),
  // Total milliseconds
  consistencyScore: decimal("consistency_score", { precision: 5, scale: 2 }),
  // How consistent responses were
  // Narrative explanation of assignment
  assignmentRationale: text("assignment_rationale"),
  // AI-generated or template explanation
  completedAt: timestamp("completed_at").defaultNow()
});
var testSessions = pgTable("test_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull().unique(),
  currentQuestionNumber: integer("current_question_number").default(1),
  status: text("status").notNull().default("in_progress"),
  // 'in_progress', 'completed', 'abandoned'
  startedAt: timestamp("started_at").defaultNow(),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  completedAt: timestamp("completed_at")
});
var sevenHouses = pgTable("seven_houses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  // Sequential Securities, Ink & Blood Syndicate, etc.
  description: text("description").notNull(),
  specialization: text("specialization").notNull(),
  // Type of assets they control
  color: text("color").notNull(),
  // Strategic accent color (hex) for noir aesthetic
  symbol: text("symbol"),
  // Icon/emblem identifier (lucide icon name)
  // House power and reputation
  reputationScore: decimal("reputation_score", { precision: 10, scale: 2 }).default("100.00"),
  powerLevel: decimal("power_level", { precision: 10, scale: 2 }).default("100.00"),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }).default("0.00"),
  dailyVolume: decimal("daily_volume", { precision: 15, scale: 2 }).default("0.00"),
  controlledAssetsCount: integer("controlled_assets_count").default(0),
  // House narrative elements
  houseSlogan: text("house_slogan"),
  headquartersLocation: text("headquarters_location"),
  // Location in Paneltown
  rivalHouses: text("rival_houses").array(),
  // Array of house IDs they compete with
  allianceHouses: text("alliance_houses").array(),
  // Temporary alliances
  // House leadership and members
  bossName: text("boss_name"),
  // The head of the house
  memberCount: integer("member_count").default(0),
  lieutenants: text("lieutenants").array(),
  // Key members
  // Trading modifiers and bonuses
  tradingBonusPercent: decimal("trading_bonus_percent", { precision: 8, scale: 2 }).default("0.00"),
  specialPowerDescription: text("special_power_description"),
  // Unique house ability
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var housePowerRankings = pgTable("house_power_rankings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: varchar("house_id").notNull().references(() => sevenHouses.id),
  week: timestamp("week").notNull(),
  // Weekly tracking
  rankPosition: integer("rank_position").notNull(),
  // 1-7
  powerScore: decimal("power_score", { precision: 10, scale: 2 }).notNull(),
  weeklyVolume: decimal("weekly_volume", { precision: 15, scale: 2 }).notNull(),
  weeklyProfit: decimal("weekly_profit", { precision: 15, scale: 2 }).notNull(),
  marketSharePercent: decimal("market_share_percent", { precision: 5, scale: 2 }).notNull(),
  territoryGains: integer("territory_gains").default(0),
  // Assets gained control of
  territoryLosses: integer("territory_losses").default(0),
  // Assets lost control of
  createdAt: timestamp("created_at").defaultNow()
});
var houseMarketEvents = pgTable("house_market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(),
  // 'turf_war', 'hostile_takeover', 'alliance', 'betrayal'
  triggerHouseId: varchar("trigger_house_id").references(() => sevenHouses.id),
  targetHouseId: varchar("target_house_id").references(() => sevenHouses.id),
  affectedAssetIds: text("affected_asset_ids").array(),
  // Event impact
  powerShift: decimal("power_shift", { precision: 8, scale: 2 }),
  // Power transferred
  marketImpact: jsonb("market_impact"),
  // Price changes, volume spikes
  // Narrative elements
  eventTitle: text("event_title").notNull(),
  // Headline
  eventNarrative: text("event_narrative"),
  // Comic-style story text
  impactDescription: text("impact_description"),
  soundEffect: text("sound_effect"),
  // "BOOM!", "CRASH!", "KA-CHING!"
  comicPanelStyle: text("comic_panel_style"),
  // 'action', 'dramatic', 'noir'
  eventTimestamp: timestamp("event_timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var enhancedCharacters = pgTable("enhanced_characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic character info (from character datasets)
  name: text("name").notNull(),
  universe: text("universe").notNull(),
  // "Marvel", "DC Comics", etc.
  pageId: text("page_id"),
  // Original wikia page ID
  url: text("url"),
  // Full wikia URL
  // Character attributes
  identity: text("identity"),
  // "Public", "Secret"
  gender: text("gender"),
  maritalStatus: text("marital_status"),
  teams: text("teams").array(),
  weight: decimal("weight", { precision: 5, scale: 1 }),
  // kg
  creators: text("creators").array(),
  // Battle statistics (from battle scenarios CSV)
  strength: integer("strength"),
  // 1-10 scale
  speed: integer("speed"),
  // 1-10 scale
  intelligence: integer("intelligence"),
  // 1-10 scale
  specialAbilities: text("special_abilities").array(),
  weaknesses: text("weaknesses").array(),
  // Calculated power metrics
  powerLevel: decimal("power_level", { precision: 8, scale: 2 }),
  // Calculated from stats
  battleWinRate: decimal("battle_win_rate", { precision: 8, scale: 2 }),
  // From battle outcomes
  totalBattles: integer("total_battles").default(0),
  battlesWon: integer("battles_won").default(0),
  // Market influence
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  popularityScore: decimal("popularity_score", { precision: 8, scale: 2 }),
  movieAppearances: integer("movie_appearances").default(0),
  // Asset linking
  assetId: varchar("asset_id").references(() => assets.id),
  // Link to tradeable asset
  // Vector embeddings for character similarity and recommendations
  characterEmbedding: vector("character_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var battleScenarios = pgTable("battle_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  character1Id: varchar("character1_id").notNull().references(() => enhancedCharacters.id),
  character2Id: varchar("character2_id").references(() => enhancedCharacters.id),
  // Null for team battles
  battleType: text("battle_type").default("one_vs_one"),
  // "one_vs_one", "team", "tournament"
  outcome: integer("outcome").notNull(),
  // 0 = loss, 1 = win for character1
  // Battle conditions
  environment: text("environment"),
  // "city", "space", "underwater", etc.
  weatherConditions: text("weather_conditions"),
  additionalFactors: jsonb("additional_factors"),
  // Market impact
  marketImpactPercent: decimal("market_impact_percent", { precision: 8, scale: 2 }),
  // How much this affects character values
  fanEngagement: integer("fan_engagement").default(0),
  // Simulated fan interest
  mediaAttention: decimal("media_attention", { precision: 3, scale: 2 }).default("1.00"),
  // Battle metadata
  duration: integer("duration"),
  // Battle length in minutes
  decisiveness: text("decisiveness"),
  // "close", "clear", "overwhelming"
  isCanonical: boolean("is_canonical").default(false),
  // Official vs fan scenarios
  // Event tracking
  eventDate: timestamp("event_date").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var enhancedComicIssues = pgTable("enhanced_comic_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic issue info (from DC Comics CSV)
  categoryTitle: text("category_title").notNull(),
  issueName: text("issue_name").notNull(),
  issueLink: text("issue_link"),
  comicSeries: text("comic_series").notNull(),
  comicType: text("comic_type"),
  // "Category", etc.
  // Creator information
  pencilers: text("pencilers").array(),
  coverArtists: text("cover_artists").array(),
  inkers: text("inkers").array(),
  writers: text("writers").array(),
  editors: text("editors").array(),
  executiveEditor: text("executive_editor"),
  letterers: text("letterers").array(),
  colourists: text("colourists").array(),
  // Publication details
  releaseDate: text("release_date"),
  rating: text("rating"),
  // Market data
  currentMarketValue: decimal("current_market_value", { precision: 10, scale: 2 }),
  historicalHigh: decimal("historical_high", { precision: 10, scale: 2 }),
  historicalLow: decimal("historical_low", { precision: 10, scale: 2 }),
  priceVolatility: decimal("price_volatility", { precision: 8, scale: 2 }),
  // Collectibility factors
  firstAppearances: text("first_appearances").array(),
  // Characters first appearing
  significantEvents: text("significant_events").array(),
  keyIssueRating: decimal("key_issue_rating", { precision: 3, scale: 1 }),
  // 1-10 importance scale
  rarityScore: decimal("rarity_score", { precision: 8, scale: 2 }),
  conditionSensitivity: decimal("condition_sensitivity", { precision: 3, scale: 2 }),
  // How much condition affects value
  // Asset linking
  assetId: varchar("asset_id").references(() => assets.id),
  // Link to tradeable asset
  // Vector embeddings for content search and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var moviePerformanceData = pgTable("movie_performance_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Movie details
  filmTitle: text("film_title").notNull(),
  releaseDate: text("release_date"),
  franchise: text("franchise").notNull(),
  // "DC", "Marvel"
  characterFamily: text("character_family").notNull(),
  // "Superman", "Batman", etc.
  distributor: text("distributor"),
  mpaaRating: text("mpaa_rating"),
  // Financial performance
  domesticGross: decimal("domestic_gross", { precision: 15, scale: 2 }),
  internationalGross: decimal("international_gross", { precision: 15, scale: 2 }),
  worldwideGross: decimal("worldwide_gross", { precision: 15, scale: 2 }),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  grossToBudgetRatio: decimal("gross_to_budget_ratio", { precision: 8, scale: 2 }),
  // Performance metrics
  domesticPercentage: decimal("domestic_percentage", { precision: 8, scale: 2 }),
  rottenTomatoesScore: integer("rotten_tomatoes_score"),
  isMcuFilm: boolean("is_mcu_film").default(false),
  mcuPhase: text("mcu_phase"),
  // Inflation-adjusted data
  inflationAdjustedGross: decimal("inflation_adjusted_gross", { precision: 15, scale: 2 }),
  inflationAdjustedBudget: decimal("inflation_adjusted_budget", { precision: 15, scale: 2 }),
  // Market impact
  marketImpactScore: decimal("market_impact_score", { precision: 8, scale: 2 }),
  // How much it affects related assets
  successCategory: text("success_category"),
  // "Success", "Flop", "Break Even"
  // Character relationships
  featuredCharacters: text("featured_characters").array(),
  // Characters featured in movie
  relatedAssets: text("related_assets").array(),
  // Asset IDs affected by this movie
  // Timeline and duration
  runtimeMinutes: integer("runtime_minutes"),
  releaseYear: integer("release_year"),
  // Performance analysis
  openingWeekendGross: decimal("opening_weekend_gross", { precision: 15, scale: 2 }),
  totalWeeksInTheaters: integer("total_weeks_in_theaters"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var learnModules = pgTable("learn_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  // "trading_basics", "comic_history", "market_analysis", "house_specialization"
  progressionLevel: text("progression_level").notNull(),
  // "junior_broker", "senior_broker", "agency_owner", "fund_manager", "family_office"
  houseSpecialization: varchar("house_specialization").references(() => mythologicalHouses.id),
  // House-specific modules
  // Module content
  moduleContent: jsonb("module_content").notNull(),
  // Structured lesson content
  estimatedDuration: integer("estimated_duration"),
  // Minutes
  difficultyLevel: integer("difficulty_level"),
  // 1-5
  prerequisites: text("prerequisites").array(),
  // Module IDs required before this one
  // Educational resources
  movieStills: text("movie_stills").array(),
  // Movie still URLs for visual learning
  interactiveElements: jsonb("interactive_elements"),
  // Quizzes, simulations, etc.
  learningObjectives: text("learning_objectives").array(),
  // Progression rewards
  completionKarmaBonus: decimal("completion_karma_bonus", { precision: 8, scale: 2 }).default("0.00"),
  tradingSkillBonus: decimal("trading_skill_bonus", { precision: 3, scale: 2 }).default("0.00"),
  houseReputationBonus: decimal("house_reputation_bonus", { precision: 8, scale: 2 }).default("0.00"),
  unlocksTradingPrivileges: text("unlocks_trading_privileges").array(),
  // Module status
  isPublished: boolean("is_published").default(false),
  requiredForProgression: boolean("required_for_progression").default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userLearnProgress = pgTable("user_learn_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: varchar("module_id").notNull().references(() => learnModules.id),
  // Progress tracking
  status: text("status").default("not_started"),
  // "not_started", "in_progress", "completed", "failed"
  progressPercent: decimal("progress_percent", { precision: 8, scale: 2 }).default("0.00"),
  currentSection: integer("current_section").default(1),
  completedSections: integer("completed_sections").array(),
  timeSpent: integer("time_spent").default(0),
  // Minutes
  // Assessment results
  quizScores: jsonb("quiz_scores"),
  finalScore: decimal("final_score", { precision: 8, scale: 2 }),
  passingGrade: decimal("passing_grade", { precision: 8, scale: 2 }).default("70.00"),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  // Completion rewards
  karmaEarned: decimal("karma_earned", { precision: 8, scale: 2 }).default("0.00"),
  skillBonusApplied: boolean("skill_bonus_applied").default(false),
  certificateUrl: text("certificate_url"),
  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertMythologicalHouseSchema = createInsertSchema(mythologicalHouses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserHouseMembershipSchema = createInsertSchema(userHouseMembership).omit({
  id: true,
  createdAt: true
});
var insertUserKarmicAlignmentSchema = createInsertSchema(userKarmicAlignment).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertKarmicActionsLogSchema = createInsertSchema(karmicActionsLog).omit({
  id: true,
  createdAt: true
});
var insertEnhancedCharacterSchema = createInsertSchema(enhancedCharacters).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBattleScenarioSchema = createInsertSchema(battleScenarios).omit({
  id: true,
  createdAt: true
});
var insertEnhancedComicIssueSchema = createInsertSchema(enhancedComicIssues).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMoviePerformanceDataSchema = createInsertSchema(moviePerformanceData).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLearnModuleSchema = createInsertSchema(learnModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserLearnProgressSchema = createInsertSchema(userLearnProgress).omit({
  id: true,
  createdAt: true
});
var traderStats = pgTable("trader_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Portfolio metrics
  totalPortfolioValue: decimal("total_portfolio_value", { precision: 15, scale: 2 }).default("0.00"),
  totalPnL: decimal("total_pnl", { precision: 15, scale: 2 }).default("0.00"),
  // Realized + unrealized P&L
  totalRealizedPnL: decimal("total_realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  totalUnrealizedPnL: decimal("total_unrealized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  roiPercentage: decimal("roi_percentage", { precision: 8, scale: 2 }).default("0.00"),
  // Return on investment %
  // Trading activity metrics
  totalTrades: integer("total_trades").default(0),
  profitableTrades: integer("profitable_trades").default(0),
  winRate: decimal("win_rate", { precision: 8, scale: 2 }).default("0.00"),
  // % of profitable trades
  averageTradeSize: decimal("average_trade_size", { precision: 15, scale: 2 }).default("0.00"),
  totalTradingVolume: decimal("total_trading_volume", { precision: 15, scale: 2 }).default("0.00"),
  // Total $ traded
  biggestWin: decimal("biggest_win", { precision: 15, scale: 2 }).default("0.00"),
  biggestLoss: decimal("biggest_loss", { precision: 15, scale: 2 }).default("0.00"),
  // Streak tracking
  currentWinningStreak: integer("current_winning_streak").default(0),
  currentLosingStreak: integer("current_losing_streak").default(0),
  longestWinningStreak: integer("longest_winning_streak").default(0),
  longestLosingStreak: integer("longest_losing_streak").default(0),
  // Risk metrics
  sharpeRatio: decimal("sharpe_ratio", { precision: 5, scale: 3 }),
  // Risk-adjusted returns
  maxDrawdown: decimal("max_drawdown", { precision: 8, scale: 2 }),
  // Max portfolio decline %
  volatility: decimal("volatility", { precision: 8, scale: 2 }),
  // Portfolio volatility
  // Ranking and achievements
  rankPoints: decimal("rank_points", { precision: 10, scale: 2 }).default("0.00"),
  // Points for ranking calculation
  currentRank: integer("current_rank"),
  bestRank: integer("best_rank"),
  achievementPoints: integer("achievement_points").default(0),
  // Time tracking
  tradingDaysActive: integer("trading_days_active").default(0),
  lastTradeDate: timestamp("last_trade_date"),
  firstTradeDate: timestamp("first_trade_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_trader_stats_user_id").on(table.userId),
  index("idx_trader_stats_rank_points").on(table.rankPoints),
  index("idx_trader_stats_current_rank").on(table.currentRank),
  index("idx_trader_stats_total_pnl").on(table.totalPnL),
  index("idx_trader_stats_win_rate").on(table.winRate),
  index("idx_trader_stats_total_volume").on(table.totalTradingVolume)
]);
var leaderboardCategories = pgTable("leaderboard_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  // "All-Time Leaders", "Daily Leaders", etc.
  description: text("description"),
  categoryType: text("category_type").notNull(),
  // "total_return", "win_rate", "volume", "consistency", "roi"
  timeframe: text("timeframe").notNull(),
  // "all_time", "daily", "weekly", "monthly"
  sortOrder: text("sort_order").default("desc"),
  // "asc" or "desc"
  pointsFormula: text("points_formula"),
  // Formula for calculating points/ranking
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  // Order for UI display
  minTradesRequired: integer("min_trades_required").default(1),
  // Minimum trades to appear on leaderboard
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_leaderboard_categories_type_timeframe").on(table.categoryType, table.timeframe),
  index("idx_leaderboard_categories_active").on(table.isActive),
  index("idx_leaderboard_categories_display_order").on(table.displayOrder)
]);
var userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: text("achievement_id").notNull(),
  // "first_trade", "profit_milestone_1000", etc.
  title: text("title").notNull(),
  // "First Trade", "$1,000 Profit Milestone"
  description: text("description").notNull(),
  category: text("category").notNull(),
  // "trading", "profit", "volume", "streak", "special"
  iconName: text("icon_name"),
  // Lucide icon name for badge
  badgeColor: text("badge_color").default("blue"),
  // Color theme for badge
  tier: text("tier").default("bronze"),
  // "bronze", "silver", "gold", "platinum", "diamond"
  points: integer("points").default(0),
  // Achievement points awarded
  rarity: text("rarity").default("common"),
  // "common", "rare", "epic", "legendary"
  // Achievement criteria (stored as JSON for flexibility)
  criteria: jsonb("criteria"),
  // Requirements that triggered this achievement
  progress: jsonb("progress"),
  // Current progress towards achievement
  // Metadata
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  notificationSent: boolean("notification_sent").default(false),
  isVisible: boolean("is_visible").default(true),
  // Can be hidden for surprise achievements
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_user_achievements_user_id").on(table.userId),
  index("idx_user_achievements_achievement_id").on(table.achievementId),
  index("idx_user_achievements_category").on(table.category),
  index("idx_user_achievements_tier").on(table.tier),
  index("idx_user_achievements_unlocked_at").on(table.unlockedAt),
  // Unique constraint to prevent duplicate achievements
  index("idx_user_achievements_unique").on(table.userId, table.achievementId)
]);
var karmaActions = pgTable("karma_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // 'house_joined', 'trade_completed', 'achievement_unlocked', etc.
  houseId: text("house_id"),
  // For house-specific actions
  karmaChange: integer("karma_change").notNull(),
  // Can be positive or negative
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  // Additional context data
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_karma_actions_user_id").on(table.userId),
  index("idx_karma_actions_type").on(table.type),
  index("idx_karma_actions_house_id").on(table.houseId),
  index("idx_karma_actions_created_at").on(table.createdAt)
]);
var insertTraderStatsSchema = createInsertSchema(traderStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLeaderboardCategorySchema = createInsertSchema(leaderboardCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
  createdAt: true
});
var insertKarmaActionSchema = createInsertSchema(karmaActions).omit({
  id: true,
  createdAt: true
});
var alignmentHistory = pgTable("alignment_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Previous alignment state
  previousLawfulChaotic: decimal("previous_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
  previousGoodEvil: decimal("previous_good_evil", { precision: 8, scale: 2 }).notNull(),
  // New alignment state
  newLawfulChaotic: decimal("new_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
  newGoodEvil: decimal("new_good_evil", { precision: 8, scale: 2 }).notNull(),
  // Alignment shift details
  alignmentShiftMagnitude: decimal("alignment_shift_magnitude", { precision: 8, scale: 2 }).notNull(),
  // Total distance moved
  triggeringActionType: text("triggering_action_type").notNull(),
  // Type of action that caused shift
  triggeringActionId: varchar("triggering_action_id"),
  // Reference to specific karma action
  karmaAtTimeOfShift: integer("karma_at_time_of_shift").notNull(),
  houseId: text("house_id"),
  // User's house at time of shift
  // Mystical classifications
  alignmentPhase: text("alignment_phase").notNull(),
  // 'awakening', 'journey', 'transformation', 'mastery'
  cosmicEvent: text("cosmic_event"),
  // 'solar_eclipse', 'lunar_blessing', 'divine_intervention', etc.
  prophecyUnlocked: text("prophecy_unlocked"),
  // Mystical prophecy text revealed
  // Metadata
  significanceLevel: text("significance_level").default("minor"),
  // 'minor', 'major', 'critical', 'legendary'
  recordedAt: timestamp("recorded_at").defaultNow()
}, (table) => [
  index("idx_alignment_history_user_id").on(table.userId),
  index("idx_alignment_history_recorded_at").on(table.recordedAt),
  index("idx_alignment_history_significance").on(table.significanceLevel),
  index("idx_alignment_history_action_type").on(table.triggeringActionType)
]);
var detailedKarmaActions = pgTable("detailed_karma_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Core action details
  actionType: text("action_type").notNull(),
  // 'aggressive_trade', 'community_help', 'resource_sharing', 'market_manipulation', etc.
  actionCategory: text("action_category").notNull(),
  // 'trading', 'social', 'competitive', 'educational', 'mystical'
  actionSubtype: text("action_subtype"),
  // More specific classification
  // Karma and alignment impact
  karmaChange: integer("karma_change").notNull(),
  lawfulChaoticImpact: decimal("lawful_chaotic_impact", { precision: 8, scale: 2 }).default("0.00"),
  // Impact on L/C axis
  goodEvilImpact: decimal("good_evil_impact", { precision: 8, scale: 2 }).default("0.00"),
  // Impact on G/E axis
  // Behavioral pattern analysis
  tradingBehaviorPattern: text("trading_behavior_pattern"),
  // 'patient', 'aggressive', 'collaborative', 'solitary'
  communityInteraction: text("community_interaction"),
  // 'helpful', 'neutral', 'competitive', 'harmful'
  riskTakingBehavior: text("risk_taking_behavior"),
  // 'conservative', 'calculated', 'reckless', 'chaotic'
  // Context and metadata
  assetId: varchar("asset_id").references(() => assets.id),
  // Asset involved in action
  orderId: varchar("order_id").references(() => orders.id),
  // Order that triggered action
  houseId: text("house_id"),
  // User's house at time of action
  houseAlignmentBonus: decimal("house_alignment_bonus", { precision: 8, scale: 2 }).default("1.00"),
  // House modifier applied
  // Impact and consequences
  tradingConsequenceTriggered: boolean("trading_consequence_triggered").default(false),
  consequenceSeverity: text("consequence_severity"),
  // 'blessing', 'minor', 'moderate', 'severe', 'divine'
  mysticalDescription: text("mystical_description").notNull(),
  // RPG-flavored description of action
  // Temporal and pattern data
  timeOfDay: text("time_of_day"),
  // 'dawn', 'morning', 'midday', 'afternoon', 'evening', 'night', 'midnight'
  tradingVolume: decimal("trading_volume", { precision: 15, scale: 2 }),
  // Volume involved in action
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }),
  // User's portfolio value at time
  actionDuration: integer("action_duration_minutes"),
  // How long action took
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_detailed_karma_user_id").on(table.userId),
  index("idx_detailed_karma_action_type").on(table.actionType),
  index("idx_detailed_karma_category").on(table.actionCategory),
  index("idx_detailed_karma_house_id").on(table.houseId),
  index("idx_detailed_karma_created_at").on(table.createdAt),
  index("idx_detailed_karma_behavior_pattern").on(table.tradingBehaviorPattern)
]);
var tradingConsequences = pgTable("trading_consequences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  orderId: varchar("order_id").references(() => orders.id),
  // Order affected by consequence
  // Alignment state at time of consequence
  userLawfulChaotic: decimal("user_lawful_chaotic", { precision: 8, scale: 2 }).notNull(),
  userGoodEvil: decimal("user_good_evil", { precision: 8, scale: 2 }).notNull(),
  userKarma: integer("user_karma").notNull(),
  userHouseId: text("user_house_id"),
  // Consequence details
  consequenceType: text("consequence_type").notNull(),
  // 'bonus_stability', 'increased_volatility', 'community_boost', 'solitary_power'
  consequenceCategory: text("consequence_category").notNull(),
  // 'trading_modifier', 'fee_adjustment', 'opportunity_access', 'restriction'
  modifierValue: decimal("modifier_value", { precision: 5, scale: 4 }).notNull(),
  // Numerical modifier applied
  modifierType: text("modifier_type").notNull(),
  // 'multiplier', 'additive', 'percentage', 'boolean'
  // Trading impact
  originalValue: decimal("original_value", { precision: 15, scale: 2 }),
  // Original trade value
  modifiedValue: decimal("modified_value", { precision: 15, scale: 2 }),
  // Value after consequence
  impactDescription: text("impact_description").notNull(),
  // Human-readable impact
  mysticalFlavor: text("mystical_flavor").notNull(),
  // RPG description of consequence
  // Consequence duration and persistence
  isTemporary: boolean("is_temporary").default(true),
  durationMinutes: integer("duration_minutes"),
  // How long consequence lasts
  expiresAt: timestamp("expires_at"),
  stacksWithOthers: boolean("stacks_with_others").default(false),
  // Can combine with other consequences
  // Success and outcome tracking
  consequenceApplied: boolean("consequence_applied").default(true),
  resultingOutcome: text("resulting_outcome"),
  // 'success', 'failure', 'neutral', 'unexpected'
  userSatisfaction: text("user_satisfaction"),
  // 'pleased', 'neutral', 'frustrated', 'surprised'
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_trading_consequences_user_id").on(table.userId),
  index("idx_trading_consequences_order_id").on(table.orderId),
  index("idx_trading_consequences_type").on(table.consequenceType),
  index("idx_trading_consequences_category").on(table.consequenceCategory),
  index("idx_trading_consequences_created_at").on(table.createdAt),
  index("idx_trading_consequences_expires_at").on(table.expiresAt)
]);
var alignmentThresholds = pgTable("alignment_thresholds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  thresholdName: text("threshold_name").notNull(),
  // 'lawful_guardian', 'chaotic_rebel', 'neutral_balance'
  alignmentType: text("alignment_type").notNull(),
  // 'lawful_chaotic', 'good_evil', 'combined'
  // Threshold boundaries
  minLawfulChaotic: decimal("min_lawful_chaotic", { precision: 8, scale: 2 }),
  maxLawfulChaotic: decimal("max_lawful_chaotic", { precision: 8, scale: 2 }),
  minGoodEvil: decimal("min_good_evil", { precision: 8, scale: 2 }),
  maxGoodEvil: decimal("max_good_evil", { precision: 8, scale: 2 }),
  minKarma: integer("min_karma"),
  maxKarma: integer("max_karma"),
  // House compatibility
  compatibleHouses: text("compatible_houses").array(),
  // Houses that benefit from this alignment
  conflictingHouses: text("conflicting_houses").array(),
  // Houses that conflict with this alignment
  // Threshold effects
  tradingBonuses: jsonb("trading_bonuses"),
  // Bonuses granted for this alignment
  tradingRestrictions: jsonb("trading_restrictions"),
  // Restrictions imposed
  specialAbilities: jsonb("special_abilities"),
  // Special trading features unlocked
  // Mystical properties
  cosmicTitle: text("cosmic_title").notNull(),
  // "Guardian of Sacred Commerce", "Harbinger of Market Chaos"
  mysticalDescription: text("mystical_description").notNull(),
  alignmentAura: text("alignment_aura"),
  // Visual effect for UI ('golden', 'shadow', 'prismatic')
  prophecyText: text("prophecy_text"),
  // Mystical prediction about alignment
  // Metadata
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_alignment_thresholds_name").on(table.thresholdName),
  index("idx_alignment_thresholds_type").on(table.alignmentType),
  index("idx_alignment_thresholds_active").on(table.isActive),
  index("idx_alignment_thresholds_display_order").on(table.displayOrder)
]);
var karmicProfiles = pgTable("karmic_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Current alignment classification
  currentAlignmentThreshold: varchar("current_alignment_threshold").references(() => alignmentThresholds.id),
  alignmentStability: decimal("alignment_stability", { precision: 8, scale: 2 }).default("100.00"),
  // How stable alignment is
  alignmentTrend: text("alignment_trend").default("stable"),
  // 'ascending', 'descending', 'stable', 'chaotic'
  // Behavioral patterns over time
  dominantBehaviorPattern: text("dominant_behavior_pattern"),
  // Most common behavior type
  secondaryBehaviorPattern: text("secondary_behavior_pattern"),
  behaviorConsistency: decimal("behavior_consistency", { precision: 8, scale: 2 }).default("50.00"),
  // How consistent behavior is
  // Trading personality analysis
  tradingPersonality: text("trading_personality"),
  // 'patient_strategist', 'aggressive_opportunist', 'community_leader'
  riskProfile: text("risk_profile"),
  // 'conservative', 'moderate', 'aggressive', 'chaotic'
  socialTrading: text("social_trading"),
  // 'collaborative', 'independent', 'competitive', 'teaching'
  // Karma accumulation patterns
  karmaAccelerationRate: decimal("karma_acceleration_rate", { precision: 8, scale: 2 }).default("1.00"),
  // How fast karma changes
  totalKarmaEarned: integer("total_karma_earned").default(0),
  totalKarmaLost: integer("total_karma_lost").default(0),
  largestKarmaGain: integer("largest_karma_gain").default(0),
  largestKarmaLoss: integer("largest_karma_loss").default(0),
  // House compatibility analysis
  houseAlignmentCompatibility: decimal("house_alignment_compatibility", { precision: 8, scale: 2 }).default("50.00"),
  // How well aligned with house
  optimalHouseId: text("optimal_house_id"),
  // Most compatible house based on alignment
  alignmentConflictLevel: text("alignment_conflict_level").default("none"),
  // 'none', 'minor', 'moderate', 'severe'
  // Predictive analysis
  predictedAlignmentDirection: text("predicted_alignment_direction"),
  // Where alignment is heading
  nextThresholdDistance: decimal("next_threshold_distance", { precision: 8, scale: 2 }),
  // How close to next threshold
  estimatedTimeToNextThreshold: integer("estimated_time_to_next_threshold"),
  // Days until next threshold
  // Mystical attributes
  cosmicResonance: decimal("cosmic_resonance", { precision: 8, scale: 2 }).default("0.00"),
  // Spiritual power level
  divineFavor: decimal("divine_favor", { precision: 8, scale: 2 }).default("0.00"),
  // Positive cosmic influence
  shadowInfluence: decimal("shadow_influence", { precision: 8, scale: 2 }).default("0.00"),
  // Negative cosmic influence
  // Statistics and tracking
  alignmentShiftsCount: integer("alignment_shifts_count").default(0),
  lastMajorShift: timestamp("last_major_shift"),
  profileLastCalculated: timestamp("profile_last_calculated").defaultNow(),
  nextRecalculationDue: timestamp("next_recalculation_due"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_karmic_profiles_user_id").on(table.userId),
  index("idx_karmic_profiles_threshold").on(table.currentAlignmentThreshold),
  index("idx_karmic_profiles_personality").on(table.tradingPersonality),
  index("idx_karmic_profiles_house_compatibility").on(table.houseAlignmentCompatibility),
  index("idx_karmic_profiles_last_calculated").on(table.profileLastCalculated),
  // Unique constraint - one profile per user
  index("idx_karmic_profiles_unique_user").on(table.userId)
]);
var insertAlignmentHistorySchema = createInsertSchema(alignmentHistory).omit({
  id: true,
  recordedAt: true
});
var insertDetailedKarmaActionSchema = createInsertSchema(detailedKarmaActions).omit({
  id: true,
  createdAt: true
});
var insertTradingConsequenceSchema = createInsertSchema(tradingConsequences).omit({
  id: true,
  createdAt: true
});
var insertAlignmentThresholdSchema = createInsertSchema(alignmentThresholds).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertKarmicProfileSchema = createInsertSchema(karmicProfiles).omit({
  id: true,
  profileLastCalculated: true,
  createdAt: true,
  updatedAt: true
});
var learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id").notNull(),
  // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit', 'universal'
  specialization: text("specialization").notNull(),
  // House specialization area
  difficultyLevel: text("difficulty_level").notNull(),
  // 'initiate', 'adept', 'master', 'grandmaster'
  prerequisites: jsonb("prerequisites"),
  // Required skills, karma, house membership
  estimatedHours: integer("estimated_hours").default(0),
  experienceReward: integer("experience_reward").default(0),
  karmaReward: integer("karma_reward").default(0),
  // Mystical properties
  sacredTitle: text("sacred_title").notNull(),
  // "Path of the Divine Oracle", "Way of the Shadow Trader"
  mysticalDescription: text("mystical_description").notNull(),
  pathIcon: text("path_icon").default("BookOpen"),
  pathColor: text("path_color").default("blue-600"),
  // Learning path metadata
  lessonSequence: text("lesson_sequence").array(),
  // Ordered array of lesson IDs
  unlockConditions: jsonb("unlock_conditions"),
  // Karma, trading performance, etc.
  completionRewards: jsonb("completion_rewards"),
  // Skills, privileges, bonuses unlocked
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  // Vector embeddings for path recommendations
  pathEmbedding: vector("path_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_learning_paths_house_id").on(table.houseId),
  index("idx_learning_paths_difficulty").on(table.difficultyLevel),
  index("idx_learning_paths_active").on(table.isActive),
  index("idx_learning_paths_display_order").on(table.displayOrder)
]);
var sacredLessons = pgTable("sacred_lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"),
  // Primary house, null for universal lessons
  pathId: varchar("path_id").references(() => learningPaths.id),
  // Lesson structure and content
  lessonType: text("lesson_type").notNull(),
  // 'crystal_orb', 'sacred_tome', 'simulation', 'trial', 'ritual'
  difficultyLevel: text("difficulty_level").notNull(),
  // 'initiate', 'adept', 'master', 'grandmaster'
  estimatedMinutes: integer("estimated_minutes").default(15),
  experienceReward: integer("experience_reward").default(100),
  karmaReward: integer("karma_reward").default(5),
  // Content delivery
  contentFormat: text("content_format").notNull(),
  // 'text', 'video', 'interactive', 'simulation', 'assessment'
  contentData: jsonb("content_data").notNull(),
  // Lesson content, questions, simulations
  mediaUrls: jsonb("media_urls"),
  // Images, videos, animations
  interactiveElements: jsonb("interactive_elements"),
  // Quizzes, drag-drop, simulations
  // Prerequisites and sequencing
  prerequisites: jsonb("prerequisites"),
  // Required lessons, skills, karma
  unlockConditions: jsonb("unlock_conditions"),
  // Detailed unlock requirements
  nextLessons: text("next_lessons").array(),
  // Suggested next lessons
  // Assessment and mastery
  masteryThreshold: decimal("mastery_threshold", { precision: 8, scale: 2 }).default("80.00"),
  // % required to pass
  allowRetakes: boolean("allow_retakes").default(true),
  maxAttempts: integer("max_attempts").default(3),
  // Mystical properties
  sacredTitle: text("sacred_title").notNull(),
  // "The Orb of Market Wisdom", "Scroll of Ancient Trades"
  mysticalNarrative: text("mystical_narrative").notNull(),
  // RPG-style introduction
  guidingSpirit: text("guiding_spirit"),
  // Name of mythical guide/teacher
  ritualDescription: text("ritual_description"),
  // How lesson is "performed"
  lessonIcon: text("lesson_icon").default("BookOpen"),
  atmosphericEffects: jsonb("atmospheric_effects"),
  // UI effects, sounds, animations
  // Learning analytics
  avgCompletionTime: integer("avg_completion_time_minutes"),
  avgScoreAchieved: decimal("avg_score_achieved", { precision: 8, scale: 2 }),
  completionRate: decimal("completion_rate", { precision: 8, scale: 2 }),
  userRating: decimal("user_rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true),
  publishedAt: timestamp("published_at"),
  // Vector embeddings for content search and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_sacred_lessons_house_id").on(table.houseId),
  index("idx_sacred_lessons_path_id").on(table.pathId),
  index("idx_sacred_lessons_type").on(table.lessonType),
  index("idx_sacred_lessons_difficulty").on(table.difficultyLevel),
  index("idx_sacred_lessons_active").on(table.isActive),
  index("idx_sacred_lessons_published").on(table.publishedAt)
]);
var mysticalSkills = pgTable("mystical_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"),
  // Primary house specialization
  skillCategory: text("skill_category").notNull(),
  // 'trading', 'analysis', 'social', 'mystical'
  skillType: text("skill_type").notNull(),
  // 'passive', 'active', 'toggle', 'ritual'
  tier: text("tier").notNull(),
  // 'initiate', 'adept', 'master', 'grandmaster', 'legendary'
  // Skill effects and bonuses
  tradingPrivileges: jsonb("trading_privileges"),
  // What trading features this unlocks
  tradingBonuses: jsonb("trading_bonuses"),
  // Numerical bonuses applied
  interfaceFeatures: jsonb("interface_features"),
  // UI features unlocked
  specialAbilities: jsonb("special_abilities"),
  // Unique powers granted
  // Unlock requirements
  prerequisiteSkills: text("prerequisite_skills").array(),
  // Required skills
  prerequisiteLessons: text("prerequisite_lessons").array(),
  // Required lessons completed
  karmaRequirement: integer("karma_requirement").default(0),
  tradingPerformanceRequirement: jsonb("trading_performance_requirement"),
  // Win rate, profit, etc.
  houseStandingRequirement: text("house_standing_requirement"),
  // House rank required
  // Experience and progression
  experienceCost: integer("experience_cost").default(500),
  // Experience points to unlock
  masteryLevels: integer("mastery_levels").default(1),
  // How many levels skill can be upgraded
  maxMasteryBonus: decimal("max_mastery_bonus", { precision: 8, scale: 2 }).default("1.50"),
  // Max bonus at full mastery
  // Mystical properties
  sacredName: text("sacred_name").notNull(),
  // "Sight of the Divine Oracle", "Shadow Step Trading"
  mysticalDescription: text("mystical_description").notNull(),
  awakenRitual: text("awaken_ritual"),
  // Description of skill awakening ceremony
  skillIcon: text("skill_icon").default("Zap"),
  skillAura: text("skill_aura"),
  // Visual effect ('golden', 'shadow', 'prismatic', 'elemental')
  rarityLevel: text("rarity_level").default("common"),
  // 'common', 'rare', 'epic', 'legendary'
  // Skill tree positioning
  parentSkills: text("parent_skills").array(),
  // Skills this branches from
  childSkills: text("child_skills").array(),
  // Skills this unlocks
  skillTreePosition: jsonb("skill_tree_position"),
  // X,Y coordinates for visualization
  // Usage and impact tracking
  timesUnlocked: integer("times_unlocked").default(0),
  avgTimeToUnlock: integer("avg_time_to_unlock_days"),
  userSatisfactionRating: decimal("user_satisfaction_rating", { precision: 3, scale: 2 }),
  impactOnTrading: decimal("impact_on_trading", { precision: 8, scale: 2 }),
  // Measured improvement
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_mystical_skills_house_id").on(table.houseId),
  index("idx_mystical_skills_category").on(table.skillCategory),
  index("idx_mystical_skills_tier").on(table.tier),
  index("idx_mystical_skills_rarity").on(table.rarityLevel),
  index("idx_mystical_skills_active").on(table.isActive)
]);
var userLessonProgress = pgTable("user_lesson_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: varchar("lesson_id").notNull().references(() => sacredLessons.id),
  pathId: varchar("path_id").references(() => learningPaths.id),
  // Progress tracking
  status: text("status").notNull().default("not_started"),
  // 'not_started', 'in_progress', 'completed', 'mastered'
  progressPercent: decimal("progress_percent", { precision: 8, scale: 2 }).default("0.00"),
  currentSection: integer("current_section").default(1),
  sectionsCompleted: integer("sections_completed").array(),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  // Assessment results
  attempts: integer("attempts").default(0),
  bestScore: decimal("best_score", { precision: 8, scale: 2 }),
  latestScore: decimal("latest_score", { precision: 8, scale: 2 }),
  masteryAchieved: boolean("mastery_achieved").default(false),
  // Learning data
  interactionData: jsonb("interaction_data"),
  // Detailed interaction logs
  difficultyRating: integer("difficulty_rating"),
  // User's rating 1-5
  enjoymentRating: integer("enjoyment_rating"),
  // User's rating 1-5
  notes: text("notes"),
  // User's personal notes
  // Mystical ceremony tracking
  ceremonyViewed: boolean("ceremony_viewed").default(false),
  // Completion ceremony watched
  experienceAwarded: integer("experience_awarded").default(0),
  karmaAwarded: integer("karma_awarded").default(0),
  skillsUnlocked: text("skills_unlocked").array(),
  // Skills unlocked by this lesson
  // Timing and analytics
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  nextReviewDue: timestamp("next_review_due"),
  // Spaced repetition
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_lesson_progress_user_id").on(table.userId),
  index("idx_user_lesson_progress_lesson_id").on(table.lessonId),
  index("idx_user_lesson_progress_path_id").on(table.pathId),
  index("idx_user_lesson_progress_status").on(table.status),
  index("idx_user_lesson_progress_completed").on(table.completedAt),
  index("idx_user_lesson_progress_last_accessed").on(table.lastAccessedAt),
  // Unique constraint - one progress record per user per lesson
  index("idx_user_lesson_unique").on(table.userId, table.lessonId)
]);
var userSkillUnlocks = pgTable("user_skill_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skillId: varchar("skill_id").notNull().references(() => mysticalSkills.id),
  // Unlock details
  unlockMethod: text("unlock_method").notNull(),
  // 'lesson_completion', 'trial_victory', 'karma_threshold', 'house_advancement'
  masteryLevel: integer("mastery_level").default(1),
  // Current upgrade level
  maxMasteryLevel: integer("max_mastery_level").default(1),
  effectivenessBonus: decimal("effectiveness_bonus", { precision: 8, scale: 2 }).default("1.00"),
  // Current bonus multiplier
  // Usage tracking
  timesUsed: integer("times_used").default(0),
  lastUsedAt: timestamp("last_used_at"),
  totalBenefitGained: decimal("total_benefit_gained", { precision: 15, scale: 2 }).default("0.00"),
  // Skill mastery progression
  experienceInvested: integer("experience_invested").default(0),
  masteryProgressPercent: decimal("mastery_progress_percent", { precision: 8, scale: 2 }).default("0.00"),
  nextUpgradeCost: integer("next_upgrade_cost").default(500),
  // Mystical awakening ceremony
  awakeningCeremonyCompleted: boolean("awakening_ceremony_completed").default(false),
  awakeningDate: timestamp("awakening_date"),
  ceremonialWitnesses: text("ceremonial_witnesses").array(),
  // Other users who witnessed ceremony
  mysticalBond: decimal("mystical_bond", { precision: 8, scale: 2 }).default("1.00"),
  // Spiritual connection to skill
  // Skill performance tracking
  skillRating: decimal("skill_rating", { precision: 3, scale: 2 }),
  // User's rating of skill usefulness
  recommendsToOthers: boolean("recommends_to_others").default(true),
  personalNotes: text("personal_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_skill_unlocks_user_id").on(table.userId),
  index("idx_user_skill_unlocks_skill_id").on(table.skillId),
  index("idx_user_skill_unlocks_mastery").on(table.masteryLevel),
  index("idx_user_skill_unlocks_awakening").on(table.awakeningDate),
  // Unique constraint - one unlock record per user per skill
  index("idx_user_skill_unique").on(table.userId, table.skillId)
]);
var trialsOfMastery = pgTable("trials_of_mastery", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"),
  // House-specific trial or universal
  trialType: text("trial_type").notNull(),
  // 'knowledge', 'practical', 'simulation', 'peer_review', 'divine_challenge'
  difficultyLevel: text("difficulty_level").notNull(),
  // 'initiate', 'adept', 'master', 'grandmaster'
  // Trial structure
  phases: jsonb("phases").notNull(),
  // Multi-phase trial structure
  timeLimit: integer("time_limit_minutes").default(60),
  maxAttempts: integer("max_attempts").default(3),
  passingScore: decimal("passing_score", { precision: 8, scale: 2 }).default("75.00"),
  perfectScore: decimal("perfect_score", { precision: 8, scale: 2 }).default("100.00"),
  // Prerequisites and rewards
  prerequisites: jsonb("prerequisites"),
  // Required skills, lessons, karma
  experienceReward: integer("experience_reward").default(1e3),
  karmaReward: integer("karma_reward").default(50),
  skillsUnlocked: text("skills_unlocked").array(),
  // Skills granted on completion
  tradingPrivilegesGranted: jsonb("trading_privileges_granted"),
  // New trading abilities
  certificationsAwarded: text("certifications_awarded").array(),
  // Formal certifications
  // Mystical properties
  sacredTitle: text("sacred_title").notNull(),
  // "Trial of the Divine Oracle", "Ordeal of Shadow Trading"
  mythicalLore: text("mythical_lore").notNull(),
  // Background story and significance
  trialMaster: text("trial_master"),
  // Name of legendary figure who judges trial
  sacredLocation: text("sacred_location"),
  // Mystical setting description
  completionRitual: text("completion_ritual"),
  // Ceremony for successful completion
  trialIcon: text("trial_icon").default("Award"),
  atmosphericTheme: text("atmospheric_theme").default("mystical"),
  // UI theme
  // Analytics and balancing
  attemptCount: integer("attempt_count").default(0),
  successRate: decimal("success_rate", { precision: 8, scale: 2 }).default("0.00"),
  avgScore: decimal("avg_score", { precision: 8, scale: 2 }).default("0.00"),
  avgCompletionTime: integer("avg_completion_time_minutes"),
  difficulty_rating: decimal("difficulty_rating", { precision: 3, scale: 2 }),
  // User feedback
  isActive: boolean("is_active").default(true),
  seasonalAvailability: jsonb("seasonal_availability"),
  // Special availability windows
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_trials_mastery_house_id").on(table.houseId),
  index("idx_trials_mastery_type").on(table.trialType),
  index("idx_trials_mastery_difficulty").on(table.difficultyLevel),
  index("idx_trials_mastery_active").on(table.isActive)
]);
var userTrialAttempts = pgTable("user_trial_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  trialId: varchar("trial_id").notNull().references(() => trialsOfMastery.id),
  attemptNumber: integer("attempt_number").notNull().default(1),
  // Attempt results
  status: text("status").notNull().default("in_progress"),
  // 'in_progress', 'completed', 'abandoned', 'failed'
  overallScore: decimal("overall_score", { precision: 8, scale: 2 }),
  phaseScores: jsonb("phase_scores"),
  // Scores for each trial phase
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  passed: boolean("passed").default(false),
  perfectScore: boolean("perfect_score").default(false),
  // Trial performance data
  responses: jsonb("responses"),
  // User responses to questions/challenges
  tradeSimulationResults: jsonb("trade_simulation_results"),
  // Performance in simulated trading
  peerReviewScores: jsonb("peer_review_scores"),
  // Peer evaluation results
  masterComments: text("master_comments"),
  // Feedback from trial master
  // Rewards and unlocks
  experienceAwarded: integer("experience_awarded").default(0),
  karmaAwarded: integer("karma_awarded").default(0),
  skillsUnlocked: text("skills_unlocked").array(),
  certificationsEarned: text("certifications_earned").array(),
  tradingPrivilegesGranted: jsonb("trading_privileges_granted"),
  // Trial ceremony and recognition
  completionCeremonyViewed: boolean("completion_ceremony_viewed").default(false),
  publicRecognition: boolean("public_recognition").default(false),
  // Announcement to house/community
  witnessedBy: text("witnessed_by").array(),
  // Other users who witnessed completion
  legendaryAchievement: boolean("legendary_achievement").default(false),
  // Exceptional performance
  // Analytics and feedback
  difficultyRating: integer("difficulty_rating"),
  // User's rating 1-5
  enjoymentRating: integer("enjoyment_rating"),
  // User's rating 1-5
  wouldRecommend: boolean("would_recommend").default(true),
  feedback: text("feedback"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_user_trial_attempts_user_id").on(table.userId),
  index("idx_user_trial_attempts_trial_id").on(table.trialId),
  index("idx_user_trial_attempts_status").on(table.status),
  index("idx_user_trial_attempts_passed").on(table.passed),
  index("idx_user_trial_attempts_completed").on(table.completedAt)
]);
var divineCertifications = pgTable("divine_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  houseId: text("house_id"),
  // House-specific or universal certification
  certificationLevel: text("certification_level").notNull(),
  // 'apprentice', 'journeyman', 'master', 'grandmaster', 'legendary'
  category: text("category").notNull(),
  // 'trading', 'analysis', 'leadership', 'teaching', 'innovation'
  // Certification requirements
  requirements: jsonb("requirements").notNull(),
  // Detailed achievement requirements
  prerequisiteCertifications: text("prerequisite_certifications").array(),
  minimumKarma: integer("minimum_karma").default(0),
  minimumHouseStanding: text("minimum_house_standing"),
  // Visual and recognition elements
  badgeDesign: jsonb("badge_design"),
  // NFT-style badge appearance
  certificateTemplate: text("certificate_template"),
  // PDF template URL
  publicTitle: text("public_title").notNull(),
  // "Master of Mystical Analytics", "Divine Oracle of Prophecy"
  titleAbbreviation: text("title_abbreviation"),
  // "MMA", "DOP"
  prestigePoints: integer("prestige_points").default(100),
  // Certification benefits
  tradingBonuses: jsonb("trading_bonuses"),
  // Bonuses granted to certificate holders
  exclusiveAccess: jsonb("exclusive_access"),
  // Special features/areas unlocked
  teachingPrivileges: boolean("teaching_privileges").default(false),
  // Can mentor others
  leadershipPrivileges: boolean("leadership_privileges").default(false),
  // Can lead house activities
  // Recognition and display
  displayBorder: text("display_border").default("golden"),
  // 'bronze', 'silver', 'golden', 'prismatic'
  glowEffect: text("glow_effect"),
  // Special visual effects
  rarityLevel: text("rarity_level").default("rare"),
  // 'common', 'rare', 'epic', 'legendary', 'mythic'
  limitedEdition: boolean("limited_edition").default(false),
  maxIssuances: integer("max_issuances"),
  // Maximum certificates that can be issued
  currentIssuances: integer("current_issuances").default(0),
  // Metadata and lifecycle
  validityPeriod: integer("validity_period_months"),
  // How long certification lasts
  renewalRequired: boolean("renewal_required").default(false),
  retireDate: timestamp("retire_date"),
  // When this certification is no longer available
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_divine_certifications_house_id").on(table.houseId),
  index("idx_divine_certifications_level").on(table.certificationLevel),
  index("idx_divine_certifications_category").on(table.category),
  index("idx_divine_certifications_rarity").on(table.rarityLevel),
  index("idx_divine_certifications_active").on(table.isActive)
]);
var userCertifications = pgTable("user_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  certificationId: varchar("certification_id").notNull().references(() => divineCertifications.id),
  // Achievement details
  achievementMethod: text("achievement_method").notNull(),
  // 'trial_completion', 'peer_recognition', 'divine_appointment'
  verificationData: jsonb("verification_data"),
  // Proof of achievement
  witnessedBy: text("witnessed_by").array(),
  // Other users who witnessed achievement
  awardingMaster: text("awarding_master"),
  // Who granted the certification
  // Certificate details
  certificateNumber: text("certificate_number").notNull().unique(),
  // Unique certificate identifier
  certificateUrl: text("certificate_url"),
  // PDF/NFT certificate URL
  badgeImageUrl: text("badge_image_url"),
  // Badge image for display
  publicTitle: text("public_title").notNull(),
  // User's granted title
  // Recognition and ceremony
  ceremonyCompleted: boolean("ceremony_completed").default(false),
  ceremonyDate: timestamp("ceremony_date"),
  publicAnnouncement: boolean("public_announcement").default(true),
  featuredInHouse: boolean("featured_in_house").default(false),
  communityReactions: jsonb("community_reactions"),
  // Likes, congratulations, etc.
  // Certification status
  status: text("status").notNull().default("active"),
  // 'active', 'expired', 'revoked', 'suspended'
  validUntil: timestamp("valid_until"),
  renewalReminderSent: boolean("renewal_reminder_sent").default(false),
  // Usage and impact
  displayInProfile: boolean("display_in_profile").default(true),
  sharableUrl: text("sharable_url"),
  // Public sharing URL
  timestampProof: text("timestamp_proof"),
  // Blockchain/verification timestamp
  achievementScore: decimal("achievement_score", { precision: 8, scale: 2 }),
  // Quality of achievement
  awardedAt: timestamp("awarded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_certifications_user_id").on(table.userId),
  index("idx_user_certifications_cert_id").on(table.certificationId),
  index("idx_user_certifications_status").on(table.status),
  index("idx_user_certifications_awarded").on(table.awardedAt),
  index("idx_user_certifications_public").on(table.displayInProfile),
  // Unique constraint - one certification per user per type
  index("idx_user_cert_unique").on(table.userId, table.certificationId)
]);
var learningAnalytics = pgTable("learning_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Overall learning progress
  totalExperienceEarned: integer("total_experience_earned").default(0),
  totalLessonsCompleted: integer("total_lessons_completed").default(0),
  totalSkillsUnlocked: integer("total_skills_unlocked").default(0),
  totalTrialsPassed: integer("total_trials_passed").default(0),
  totalCertificationsEarned: integer("total_certifications_earned").default(0),
  // Learning velocity and patterns
  lessonsPerWeek: decimal("lessons_per_week", { precision: 8, scale: 2 }).default("0.00"),
  avgScoreAchieved: decimal("avg_score_achieved", { precision: 8, scale: 2 }).default("0.00"),
  learningStreak: integer("learning_streak_days").default(0),
  longestLearningStreak: integer("longest_learning_streak_days").default(0),
  preferredLearningTime: text("preferred_learning_time"),
  // 'morning', 'afternoon', 'evening', 'night'
  avgSessionDuration: integer("avg_session_duration_minutes").default(0),
  // House-specific progress
  primaryHouseMastery: decimal("primary_house_mastery", { precision: 8, scale: 2 }).default("0.00"),
  secondaryHousesExplored: text("secondary_houses_explored").array(),
  crossHouseProgress: jsonb("cross_house_progress"),
  // Progress in other houses
  houseRank: integer("house_rank").default(0),
  // Rank within house for learning
  // Learning style and preferences
  preferredLessonTypes: text("preferred_lesson_types").array(),
  // 'crystal_orb', 'sacred_tome', etc.
  learningStyleProfile: jsonb("learning_style_profile"),
  // Visual, auditory, kinesthetic, etc.
  difficultyPreference: text("difficulty_preference").default("adaptive"),
  // 'easy', 'moderate', 'challenging', 'adaptive'
  pacePreference: text("pace_preference").default("self_paced"),
  // 'slow', 'self_paced', 'accelerated'
  // Social learning aspects
  mentorshipGiven: integer("mentorship_given_hours").default(0),
  mentorshipReceived: integer("mentorship_received_hours").default(0),
  peerReviewsGiven: integer("peer_reviews_given").default(0),
  peerReviewsReceived: integer("peer_reviews_received").default(0),
  communityContributions: integer("community_contributions").default(0),
  teachingRating: decimal("teaching_rating", { precision: 3, scale: 2 }),
  // From students taught
  // Adaptive learning data
  knowledgeGaps: jsonb("knowledge_gaps"),
  // Areas needing improvement
  strengthAreas: jsonb("strength_areas"),
  // Areas of excellence
  recommendedPaths: jsonb("recommended_paths"),
  // AI-suggested learning paths
  personalizedDifficulty: decimal("personalized_difficulty", { precision: 3, scale: 2 }).default("3.00"),
  // 1-5 scale
  // Engagement and motivation
  motivationLevel: decimal("motivation_level", { precision: 3, scale: 2 }).default("3.00"),
  // 1-5 scale
  engagementTrend: text("engagement_trend").default("stable"),
  // 'increasing', 'stable', 'decreasing'
  lastActiveDate: timestamp("last_active_date"),
  totalTimeSpent: integer("total_time_spent_minutes").default(0),
  achievementCelebrations: integer("achievement_celebrations").default(0),
  // Predictive analytics
  predictedCompletionDate: timestamp("predicted_completion_date"),
  riskOfDropout: decimal("risk_of_dropout", { precision: 3, scale: 2 }).default("0.00"),
  // 0-1 probability
  recommendedInterventions: jsonb("recommended_interventions"),
  // Suggestions to improve
  // Timestamps
  calculatedAt: timestamp("calculated_at").defaultNow(),
  nextCalculationDue: timestamp("next_calculation_due"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_learning_analytics_user_id").on(table.userId),
  index("idx_learning_analytics_house_mastery").on(table.primaryHouseMastery),
  index("idx_learning_analytics_last_active").on(table.lastActiveDate),
  index("idx_learning_analytics_calculated").on(table.calculatedAt),
  // Unique constraint - one analytics record per user
  index("idx_learning_analytics_unique_user").on(table.userId)
]);
var insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSacredLessonSchema = createInsertSchema(sacredLessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMysticalSkillSchema = createInsertSchema(mysticalSkills).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserSkillUnlockSchema = createInsertSchema(userSkillUnlocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTrialOfMasterySchema = createInsertSchema(trialsOfMastery).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserTrialAttemptSchema = createInsertSchema(userTrialAttempts).omit({
  id: true,
  createdAt: true
});
var insertDivineCertificationSchema = createInsertSchema(divineCertifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserCertificationSchema = createInsertSchema(userCertifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLearningAnalyticsSchema = createInsertSchema(learningAnalytics).omit({
  id: true,
  calculatedAt: true,
  createdAt: true,
  updatedAt: true
});
var careerPathwayLevels = pgTable("career_pathway_levels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pathway: text("pathway").notNull(),
  // 'associate', 'family_office', 'hedge_fund', 'agency'
  level: text("level").notNull(),
  // 'associate', 'tier1', 'tier2', 'tier3', 'tier4'
  name: text("name").notNull(),
  // 'Associate', 'Family Office Steward', 'Hedge Fund Analyst', etc.
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull(),
  // Sequence in pathway
  // Unlocks and rewards
  tradingFeatureUnlocks: jsonb("trading_feature_unlocks"),
  // Features unlocked at this level
  baseSalaryMax: decimal("base_salary_max", { precision: 15, scale: 2 }).notNull(),
  // Maximum salary for this level
  certificationBonus: decimal("certification_bonus_percent", { precision: 5, scale: 2 }).default("100.00"),
  // 100% for 3/5, 150% for 5/5
  masterBonus: decimal("master_bonus_percent", { precision: 5, scale: 2 }).default("150.00"),
  prerequisiteLevel: varchar("prerequisite_level"),
  // Previous level required
  // Metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_career_pathway_pathway").on(table.pathway),
  index("idx_career_pathway_level").on(table.level),
  index("idx_career_pathway_order").on(table.displayOrder)
]);
var certificationCourses = pgTable("certification_courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pathwayLevelId: varchar("pathway_level_id").notNull().references(() => careerPathwayLevels.id),
  courseNumber: integer("course_number").notNull(),
  // 1-5
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  // 'easy', 'intermediate', 'advanced', 'master'
  estimatedDuration: integer("estimated_duration_hours").default(2),
  // Course content
  modules: jsonb("modules").notNull(),
  // Course curriculum and materials
  learningObjectives: text("learning_objectives").array(),
  prerequisites: text("prerequisites").array(),
  // Exam configuration
  examQuestions: jsonb("exam_questions").notNull(),
  // Exam scenarios and questions
  passingScore: integer("passing_score").default(70),
  // Percentage to pass
  maxAttempts: integer("max_attempts").default(3),
  // Free attempts before penalty
  retryPenaltyAmount: decimal("retry_penalty_amount", { precision: 10, scale: 2 }),
  // 4th attempt fee
  // Trading feature unlocks
  featureUnlocks: jsonb("feature_unlocks"),
  // Specific features this course unlocks
  tradingPermissions: jsonb("trading_permissions"),
  // Permissions granted
  // Metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_cert_courses_pathway_level").on(table.pathwayLevelId),
  index("idx_cert_courses_number").on(table.courseNumber),
  index("idx_cert_courses_difficulty").on(table.difficulty)
]);
var userCourseEnrollments = pgTable("user_course_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => certificationCourses.id),
  pathwayLevelId: varchar("pathway_level_id").notNull().references(() => careerPathwayLevels.id),
  // Progress tracking
  status: text("status").notNull().default("enrolled"),
  // 'enrolled', 'in_progress', 'completed', 'failed'
  progressPercent: decimal("progress_percent", { precision: 5, scale: 2 }).default("0.00"),
  currentModule: integer("current_module").default(1),
  completedModules: integer("completed_modules").array().default(sql`ARRAY[]::integer[]`),
  timeSpent: integer("time_spent_minutes").default(0),
  // Exam attempts
  examAttempts: integer("exam_attempts").default(0),
  bestScore: decimal("best_score", { precision: 5, scale: 2 }),
  lastAttemptScore: decimal("last_attempt_score", { precision: 5, scale: 2 }),
  passed: boolean("passed").default(false),
  passedAt: timestamp("passed_at"),
  // Penalty tracking
  penaltyCharges: decimal("penalty_charges", { precision: 10, scale: 2 }).default("0.00"),
  penaltyAttempts: integer("penalty_attempts").default(0),
  // Attempts beyond free limit
  // Metadata
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_enrollments_user").on(table.userId),
  index("idx_user_enrollments_course").on(table.courseId),
  index("idx_user_enrollments_pathway").on(table.pathwayLevelId),
  index("idx_user_enrollments_status").on(table.status)
]);
var userPathwayProgress = pgTable("user_pathway_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  pathway: text("pathway").notNull(),
  // 'associate', 'family_office', 'hedge_fund', 'agency'
  currentLevelId: varchar("current_level_id").references(() => careerPathwayLevels.id),
  // Certification status
  coursesPassed: integer("courses_passed").default(0),
  // Total courses passed at current level
  isCertified: boolean("is_certified").default(false),
  // 3/5 courses passed
  isMasterCertified: boolean("is_master_certified").default(false),
  // 5/5 courses passed
  // Hidden salary bonuses (revealed after certification)
  certificationBonusRevealed: boolean("certification_bonus_revealed").default(false),
  certificationBonusAmount: decimal("certification_bonus_amount", { precision: 15, scale: 2 }),
  masterBonusRevealed: boolean("master_bonus_revealed").default(false),
  masterBonusAmount: decimal("master_bonus_amount", { precision: 15, scale: 2 }),
  // Current salary
  currentSalaryMax: decimal("current_salary_max", { precision: 15, scale: 2 }),
  // Progression tracking
  totalCoursesCompleted: integer("total_courses_completed").default(0),
  totalExamAttempts: integer("total_exam_attempts").default(0),
  totalPenaltiesCharged: decimal("total_penalties_charged", { precision: 10, scale: 2 }).default("0.00"),
  pathwayStartedAt: timestamp("pathway_started_at").defaultNow(),
  lastLevelCompletedAt: timestamp("last_level_completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_pathway_user").on(table.userId),
  index("idx_user_pathway_pathway").on(table.pathway),
  index("idx_user_pathway_level").on(table.currentLevelId),
  index("idx_user_pathway_certified").on(table.isCertified),
  index("idx_user_pathway_master").on(table.isMasterCertified)
]);
var examAttempts = pgTable("exam_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => certificationCourses.id),
  enrollmentId: varchar("enrollment_id").notNull().references(() => userCourseEnrollments.id),
  // Attempt details
  attemptNumber: integer("attempt_number").notNull(),
  isPenaltyAttempt: boolean("is_penalty_attempt").default(false),
  penaltyCharged: decimal("penalty_charged", { precision: 10, scale: 2 }),
  // Exam results
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  passed: boolean("passed").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  // Exam data
  responses: jsonb("responses").notNull(),
  // User's answers
  timeSpent: integer("time_spent_seconds"),
  // Feedback
  feedback: text("feedback"),
  // Auto-generated feedback
  areasForImprovement: text("areas_for_improvement").array(),
  // Metadata
  attemptedAt: timestamp("attempted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_exam_attempts_user").on(table.userId),
  index("idx_exam_attempts_course").on(table.courseId),
  index("idx_exam_attempts_enrollment").on(table.enrollmentId),
  index("idx_exam_attempts_passed").on(table.passed),
  index("idx_exam_attempts_penalty").on(table.isPenaltyAttempt)
]);
var insertCareerPathwayLevelSchema = createInsertSchema(careerPathwayLevels).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCertificationCourseSchema = createInsertSchema(certificationCourses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserCourseEnrollmentSchema = createInsertSchema(userCourseEnrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserPathwayProgressSchema = createInsertSchema(userPathwayProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertExamAttemptSchema = createInsertSchema(examAttempts).omit({
  id: true,
  createdAt: true
});
var subscriberCourseIncentives = pgTable("subscriber_course_incentives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").references(() => certificationCourses.id),
  pathwayLevelId: varchar("pathway_level_id").references(() => careerPathwayLevels.id),
  // Incentive type and value
  incentiveType: text("incentive_type").notNull(),
  // 'capital_bonus', 'fee_discount', 'xp_multiplier', 'early_access'
  incentiveValue: decimal("incentive_value", { precision: 15, scale: 2 }).notNull(),
  // Dollar amount or percentage
  // Activation and expiry
  status: text("status").notNull().default("pending"),
  // 'pending', 'active', 'expired', 'claimed'
  activatedAt: timestamp("activated_at"),
  expiresAt: timestamp("expires_at"),
  // Tracking
  claimedAt: timestamp("claimed_at"),
  isActive: boolean("is_active").default(true),
  description: text("description"),
  // Human-readable description
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_subscriber_incentives_user").on(table.userId),
  index("idx_subscriber_incentives_type").on(table.incentiveType),
  index("idx_subscriber_incentives_status").on(table.status),
  index("idx_subscriber_incentives_course").on(table.courseId)
]);
var subscriberActiveBenefits = pgTable("subscriber_active_benefits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Capital bonuses
  totalCapitalBonusEarned: decimal("total_capital_bonus_earned", { precision: 15, scale: 2 }).default("0.00"),
  pendingCapitalBonus: decimal("pending_capital_bonus", { precision: 15, scale: 2 }).default("0.00"),
  // Trading fee discounts (percentage)
  tradingFeeDiscount: decimal("trading_fee_discount", { precision: 5, scale: 2 }).default("0.00"),
  // 0-100%
  feeDiscountExpiresAt: timestamp("fee_discount_expires_at"),
  // XP multipliers
  xpMultiplier: decimal("xp_multiplier", { precision: 5, scale: 2 }).default("1.00"),
  // 1x to 3x
  xpMultiplierExpiresAt: timestamp("xp_multiplier_expires_at"),
  // Early access flags
  hasEarlyAccess: boolean("has_early_access").default(false),
  earlyAccessFeatures: text("early_access_features").array(),
  // Array of feature flags
  earlyAccessExpiresAt: timestamp("early_access_expires_at"),
  // Badge and tier display
  certificationBadgeTier: text("certification_badge_tier"),
  // 'certified', 'master', 'legend'
  displayBadge: boolean("display_badge").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_subscriber_benefits_user").on(table.userId),
  index("idx_subscriber_benefits_badge").on(table.certificationBadgeTier)
]);
var subscriberIncentiveHistory = pgTable("subscriber_incentive_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  incentiveId: varchar("incentive_id").references(() => subscriberCourseIncentives.id),
  // Event details
  eventType: text("event_type").notNull(),
  // 'awarded', 'claimed', 'expired', 'revoked'
  incentiveType: text("incentive_type").notNull(),
  incentiveValue: decimal("incentive_value", { precision: 15, scale: 2 }).notNull(),
  // Context
  sourceType: text("source_type").notNull(),
  // 'course_completion', 'certification_earned', 'milestone', 'special_event'
  sourceId: varchar("source_id"),
  // Reference to course, certification, etc.
  description: text("description"),
  metadata: jsonb("metadata"),
  // Additional context
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_incentive_history_user").on(table.userId),
  index("idx_incentive_history_event").on(table.eventType),
  index("idx_incentive_history_source").on(table.sourceType)
]);
var insertSubscriberCourseIncentiveSchema = createInsertSchema(subscriberCourseIncentives).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubscriberActiveBenefitsSchema = createInsertSchema(subscriberActiveBenefits).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubscriberIncentiveHistorySchema = createInsertSchema(subscriberIncentiveHistory).omit({
  id: true,
  createdAt: true
});
var easterEggDefinitions = pgTable("easter_egg_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  internalCode: text("internal_code").notNull().unique(),
  // e.g., 'SEVEN_DAY_STREAK'
  description: text("description").notNull(),
  discoveryHint: text("discovery_hint"),
  // Subtle hint shown to users
  // Trigger configuration
  triggerType: text("trigger_type").notNull(),
  // 'consecutive_profitable_days', 'portfolio_milestone', 'achievement_chain', 'hidden_action', 'trading_pattern', 'total_volume'
  triggerConditions: jsonb("trigger_conditions").notNull(),
  // e.g., { days: 7, profitThreshold: 0 } or { portfolioValue: 100000 }
  requiresPreviousEggs: text("requires_previous_eggs").array(),
  // Array of egg IDs that must be unlocked first
  // Reward configuration
  rewardType: text("reward_type").notNull(),
  // 'capital_bonus', 'secret_badge', 'exclusive_asset', 'fee_waiver', 'xp_boost', 'special_title'
  rewardValue: text("reward_value").notNull(),
  // Amount or identifier
  rewardDescription: text("reward_description").notNull(),
  // Gating and visibility
  subscribersOnly: boolean("subscribers_only").default(true),
  requiredSubscriptionTier: text("required_subscription_tier"),
  // 'basic', 'premium', 'elite' or null for any subscriber
  isSecret: boolean("is_secret").default(true),
  // If true, not shown in collection until discovered
  difficultyRating: integer("difficulty_rating").default(1),
  // 1-5 difficulty
  // Metadata
  rarity: text("rarity").default("common"),
  // 'common', 'uncommon', 'rare', 'epic', 'legendary'
  category: text("category"),
  // 'trading_mastery', 'portfolio_achievement', 'hidden_secrets', 'time_based', 'social'
  iconUrl: text("icon_url"),
  badgeColor: text("badge_color"),
  flavorText: text("flavor_text"),
  // Lore/story text
  // Activity tracking
  timesUnlocked: integer("times_unlocked").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_easter_egg_trigger_type").on(table.triggerType),
  index("idx_easter_egg_subscribers_only").on(table.subscribersOnly),
  index("idx_easter_egg_active").on(table.isActive)
]);
var easterEggUserProgress = pgTable("easter_egg_user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eggId: varchar("egg_id").notNull().references(() => easterEggDefinitions.id),
  // Progress tracking
  progressValue: decimal("progress_value", { precision: 15, scale: 2 }).default("0"),
  // Current progress (e.g., 3/7 days)
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0"),
  // 0-100%
  progressData: jsonb("progress_data"),
  // Additional tracking data (dates, actions, etc.)
  // State
  isUnlocked: boolean("is_unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  lastProgressUpdate: timestamp("last_progress_update").defaultNow(),
  // Streaks and chains
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  streakBrokenAt: timestamp("streak_broken_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_egg_progress_user").on(table.userId),
  index("idx_egg_progress_egg").on(table.eggId),
  index("idx_egg_progress_unlocked").on(table.isUnlocked),
  index("idx_egg_progress_user_egg").on(table.userId, table.eggId)
]);
var easterEggUnlocks = pgTable("easter_egg_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eggId: varchar("egg_id").notNull().references(() => easterEggDefinitions.id),
  progressId: varchar("progress_id").references(() => easterEggUserProgress.id),
  // Unlock details
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  unlockMethod: text("unlock_method"),
  // How it was discovered
  unlockContext: jsonb("unlock_context"),
  // Context data at time of unlock
  // Reward claim
  rewardClaimed: boolean("reward_claimed").default(false),
  rewardClaimedAt: timestamp("reward_claimed_at"),
  rewardType: text("reward_type").notNull(),
  rewardValue: text("reward_value").notNull(),
  rewardApplied: boolean("reward_applied").default(false),
  // Whether reward has been applied to account
  // Social/display
  isPublic: boolean("is_public").default(false),
  // Whether user wants to show this achievement
  displayOnProfile: boolean("display_on_profile").default(true),
  // Notification
  notificationSent: boolean("notification_sent").default(false),
  notificationSeenAt: timestamp("notification_seen_at"),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_egg_unlocks_user").on(table.userId),
  index("idx_egg_unlocks_egg").on(table.eggId),
  index("idx_egg_unlocks_claimed").on(table.rewardClaimed),
  index("idx_egg_unlocks_public").on(table.isPublic)
]);
var insertEasterEggDefinitionSchema = createInsertSchema(easterEggDefinitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  timesUnlocked: true
});
var insertEasterEggUserProgressSchema = createInsertSchema(easterEggUserProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertEasterEggUnlockSchema = createInsertSchema(easterEggUnlocks).omit({
  id: true,
  createdAt: true
});
var aiMarketPredictions = pgTable("ai_market_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  predictionType: text("prediction_type").notNull(),
  // 'price', 'trend', 'sentiment', 'battle_outcome'
  timeframe: text("timeframe").notNull(),
  // '1d', '1w', '1m', '3m', '6m', '1y'
  currentPrice: decimal("current_price", { precision: 15, scale: 2 }),
  predictedPrice: decimal("predicted_price", { precision: 15, scale: 2 }),
  predictedChange: decimal("predicted_change", { precision: 8, scale: 4 }),
  // Percentage change
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  // 0-1 confidence score
  reasoning: text("reasoning"),
  // AI-generated reasoning
  marketFactors: jsonb("market_factors"),
  // Array of factors influencing prediction
  riskLevel: text("risk_level"),
  // 'LOW', 'MEDIUM', 'HIGH'
  aiModel: text("ai_model").default("gpt-4o-mini"),
  // Model used for prediction
  houseBonus: jsonb("house_bonus"),
  // House-specific bonuses and influences
  karmaInfluence: decimal("karma_influence", { precision: 5, scale: 4 }),
  // Karma alignment impact
  actualOutcome: decimal("actual_outcome", { precision: 8, scale: 4 }),
  // Actual result for accuracy tracking
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
  // Prediction accuracy score
  isActive: boolean("is_active").default(true),
  // Whether prediction is still valid
  expiresAt: timestamp("expires_at"),
  // When prediction expires
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var characterBattleScenarios = pgTable("character_battle_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  character1Id: varchar("character1_id").notNull().references(() => assets.id),
  character2Id: varchar("character2_id").notNull().references(() => assets.id),
  battleType: text("battle_type").notNull(),
  // 'power_clash', 'strategy_battle', 'moral_conflict', 'crossover_event'
  battleContext: text("battle_context"),
  // Description of battle circumstances
  powerLevelData: jsonb("power_level_data"),
  // Power stats and abilities
  winProbability: decimal("win_probability", { precision: 5, scale: 4 }),
  // Character 1 win probability
  battleFactors: jsonb("battle_factors"),
  // Factors influencing outcome
  historicalData: jsonb("historical_data"),
  // Past battle results and comic references
  houseAdvantages: jsonb("house_advantages"),
  // House-specific battle bonuses
  predictedOutcome: text("predicted_outcome"),
  // Detailed battle outcome prediction
  marketImpact: decimal("market_impact", { precision: 8, scale: 4 }),
  // Expected price impact
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  // AI confidence in prediction
  actualResult: text("actual_result"),
  // Actual battle outcome (if resolved)
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
  // Prediction accuracy
  isActive: boolean("is_active").default(true),
  resolvedAt: timestamp("resolved_at"),
  // When battle was resolved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var marketIntelligenceCache = pgTable("market_intelligence_cache", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cacheKey: text("cache_key").notNull().unique(),
  // Unique identifier for cached data
  dataType: text("data_type").notNull(),
  // 'trend_analysis', 'correlation_matrix', 'sentiment_report', 'anomaly_detection'
  scope: text("scope").notNull(),
  // 'global', 'house_specific', 'user_specific', 'asset_specific'
  targetId: varchar("target_id"),
  // Asset ID, House ID, or User ID depending on scope
  analysisData: jsonb("analysis_data"),
  // Cached analysis results
  insights: jsonb("insights"),
  // Key insights and recommendations
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  // Overall confidence in analysis
  processingTime: integer("processing_time"),
  // Time taken to generate (milliseconds)
  dataFreshness: timestamp("data_freshness"),
  // When source data was last updated
  accessCount: integer("access_count").default(0),
  // Number of times accessed
  lastAccessed: timestamp("last_accessed"),
  // Last access time for cache management
  expiresAt: timestamp("expires_at").notNull(),
  // Cache expiration time
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userAiInteractions = pgTable("user_ai_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  interactionType: text("interaction_type").notNull(),
  // 'prediction_request', 'market_insight', 'battle_forecast', 'portfolio_analysis'
  inputData: jsonb("input_data"),
  // User input or request parameters
  aiResponse: jsonb("ai_response"),
  // AI-generated response
  mysticalPresentation: text("mystical_presentation"),
  // Mystical/oracle-themed presentation
  userHouse: text("user_house"),
  // User's house at time of interaction
  karmaAlignment: jsonb("karma_alignment"),
  // User's karma alignment at time of interaction
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  // AI confidence in response
  userRating: integer("user_rating"),
  // User rating of AI response (1-5)
  followedAdvice: boolean("followed_advice"),
  // Whether user acted on AI advice
  outcomeTracking: jsonb("outcome_tracking"),
  // Track results of AI recommendations
  sessionId: varchar("session_id"),
  // Group related interactions
  processingTime: integer("processing_time"),
  // Response generation time
  tokens: integer("tokens"),
  // AI tokens used
  cost: decimal("cost", { precision: 8, scale: 6 }),
  // API cost (if applicable)
  createdAt: timestamp("created_at").defaultNow()
});
var aiOraclePersonas = pgTable("ai_oracle_personas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personaName: text("persona_name").notNull(),
  // 'Ancient Sage', 'Battle Prophet', 'Market Mystic'
  description: text("description"),
  // Persona description and specialization
  houseAffinity: text("house_affinity"),
  // Primary house affinity
  personalityTraits: jsonb("personality_traits"),
  // Personality characteristics
  responseStyle: jsonb("response_style"),
  // Communication style and tone
  expertise: jsonb("expertise"),
  // Areas of specialization
  mysticalLanguage: jsonb("mystical_language"),
  // Language patterns and phrases
  divineSymbols: jsonb("divine_symbols"),
  // Associated symbols and imagery
  powerLevel: integer("power_level").default(1),
  // Oracle power level
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  // Times this persona was used
  avgUserRating: decimal("avg_user_rating", { precision: 3, scale: 2 }),
  // Average user rating
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var marketAnomalies = pgTable("market_anomalies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").references(() => assets.id),
  anomalyType: text("anomaly_type").notNull(),
  // 'price_spike', 'volume_surge', 'sentiment_shift', 'pattern_break'
  severity: text("severity").notNull(),
  // 'low', 'medium', 'high', 'critical'
  description: text("description"),
  // Human-readable description
  detectionData: jsonb("detection_data"),
  // Technical data about the anomaly
  historicalComparison: jsonb("historical_comparison"),
  // Comparison with historical patterns
  potentialCauses: jsonb("potential_causes"),
  // Possible reasons for anomaly
  marketImpact: decimal("market_impact", { precision: 8, scale: 4 }),
  // Estimated market impact
  aiConfidence: decimal("ai_confidence", { precision: 5, scale: 4 }),
  // AI confidence in detection
  userNotifications: integer("user_notifications").default(0),
  // Number of users notified
  followUpActions: jsonb("follow_up_actions"),
  // Recommended actions
  resolved: boolean("resolved").default(false),
  // Whether anomaly has been resolved
  resolvedAt: timestamp("resolved_at"),
  // When anomaly was resolved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertAiMarketPredictionSchema = createInsertSchema(aiMarketPredictions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCharacterBattleScenarioSchema = createInsertSchema(characterBattleScenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMarketIntelligenceCacheSchema = createInsertSchema(marketIntelligenceCache).omit({
  id: true,
  accessCount: true,
  lastAccessed: true,
  createdAt: true,
  updatedAt: true
});
var insertUserAiInteractionSchema = createInsertSchema(userAiInteractions).omit({
  id: true,
  createdAt: true
});
var insertAiOraclePersonaSchema = createInsertSchema(aiOraclePersonas).omit({
  id: true,
  usageCount: true,
  avgUserRating: true,
  createdAt: true,
  updatedAt: true
});
var insertMarketAnomalySchema = createInsertSchema(marketAnomalies).omit({
  id: true,
  userNotifications: true,
  resolved: true,
  resolvedAt: true,
  createdAt: true,
  updatedAt: true
});
var externalIntegrations = pgTable("external_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  integrationName: text("integration_name").notNull(),
  // 'webflow', 'figma', 'relume', 'zapier'
  integrationDisplayName: text("integration_display_name").notNull(),
  // "Webflow", "Figma", etc.
  status: text("status").notNull().default("disconnected"),
  // 'connected', 'disconnected', 'error', 'pending'
  authType: text("auth_type").notNull(),
  // 'oauth', 'api_key', 'webhook'
  // Encrypted credential storage (never store plaintext API keys)
  encryptedCredentials: text("encrypted_credentials"),
  // Encrypted JSON of auth tokens/keys
  authScopes: jsonb("auth_scopes"),
  // OAuth scopes or permission levels
  connectionMetadata: jsonb("connection_metadata"),
  // Additional connection info (account IDs, team info, etc.)
  configuration: jsonb("configuration"),
  // Integration-specific settings
  // Integration health and monitoring
  lastHealthCheck: timestamp("last_health_check"),
  healthStatus: text("health_status").default("unknown"),
  // 'healthy', 'unhealthy', 'degraded', 'unknown'
  errorMessage: text("error_message"),
  // Last error encountered
  retryCount: integer("retry_count").default(0),
  // Usage tracking
  totalSyncs: integer("total_syncs").default(0),
  lastSyncAt: timestamp("last_sync_at"),
  nextScheduledSync: timestamp("next_scheduled_sync"),
  // House-specific bonuses and preferences
  houseId: text("house_id").references(() => users.houseId),
  // Inherit from user or override
  houseBonusMultiplier: decimal("house_bonus_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_external_integrations_user").on(table.userId),
  index("idx_external_integrations_name").on(table.integrationName),
  index("idx_external_integrations_status").on(table.status),
  index("idx_external_integrations_health").on(table.healthStatus)
]);
var integrationWebhooks = pgTable("integration_webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  webhookType: text("webhook_type").notNull(),
  // 'incoming', 'outgoing'
  eventType: text("event_type").notNull(),
  // 'user.created', 'trade.executed', 'portfolio.updated', etc.
  webhookUrl: text("webhook_url"),
  // For outgoing webhooks
  secretKey: text("secret_key"),
  // For webhook verification
  isActive: boolean("is_active").default(true),
  // Webhook configuration
  httpMethod: text("http_method").default("POST"),
  // POST, PUT, PATCH
  headers: jsonb("headers"),
  // Custom headers to send
  payload: jsonb("payload"),
  // Payload template or structure
  retryPolicy: jsonb("retry_policy"),
  // Retry configuration
  // Monitoring and analytics
  totalTriggers: integer("total_triggers").default(0),
  successfulTriggers: integer("successful_triggers").default(0),
  failedTriggers: integer("failed_triggers").default(0),
  lastTriggeredAt: timestamp("last_triggered_at"),
  lastSuccessAt: timestamp("last_success_at"),
  lastFailureAt: timestamp("last_failure_at"),
  lastErrorMessage: text("last_error_message"),
  averageResponseTime: decimal("average_response_time", { precision: 8, scale: 3 }),
  // milliseconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_integration_webhooks_integration").on(table.integrationId),
  index("idx_integration_webhooks_type").on(table.webhookType),
  index("idx_integration_webhooks_event").on(table.eventType),
  index("idx_integration_webhooks_active").on(table.isActive)
]);
var integrationSyncLogs = pgTable("integration_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  syncType: text("sync_type").notNull(),
  // 'full', 'incremental', 'manual', 'webhook'
  direction: text("direction").notNull(),
  // 'import', 'export', 'bidirectional'
  status: text("status").notNull(),
  // 'started', 'in_progress', 'completed', 'failed', 'cancelled'
  dataType: text("data_type"),
  // 'portfolios', 'designs', 'workflows', 'analytics'
  // Sync metrics
  recordsProcessed: integer("records_processed").default(0),
  recordsSuccessful: integer("records_successful").default(0),
  recordsFailed: integer("records_failed").default(0),
  durationMs: integer("duration_ms"),
  // Sync duration in milliseconds
  // Sync details
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
  errorDetails: jsonb("error_details"),
  // Detailed error information
  syncMetadata: jsonb("sync_metadata"),
  // Additional sync context
  // Data transformation tracking
  transformationRules: jsonb("transformation_rules"),
  // Rules applied during sync
  validationErrors: jsonb("validation_errors"),
  // Data validation issues
  conflictResolution: jsonb("conflict_resolution"),
  // How conflicts were resolved
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_integration_sync_logs_integration").on(table.integrationId),
  index("idx_integration_sync_logs_status").on(table.status),
  index("idx_integration_sync_logs_type").on(table.syncType),
  index("idx_integration_sync_logs_started").on(table.startedAt)
]);
var workflowAutomations = pgTable("workflow_automations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  // User-friendly workflow name
  description: text("description"),
  category: text("category").notNull(),
  // 'trading', 'portfolio', 'marketing', 'analytics', 'house_ritual'
  // Workflow configuration
  triggerType: text("trigger_type").notNull(),
  // 'schedule', 'event', 'webhook', 'manual'
  triggerConfig: jsonb("trigger_config").notNull(),
  // Trigger-specific configuration
  actionSteps: jsonb("action_steps").notNull(),
  // Array of automation steps
  conditions: jsonb("conditions"),
  // Conditional logic for execution
  // Mystical RPG elements
  ritualType: text("ritual_type"),
  // 'sacred_ritual', 'divine_protocol', 'karmic_alignment'
  houseBonus: decimal("house_bonus", { precision: 3, scale: 2 }).default("1.00"),
  karmaRequirement: integer("karma_requirement").default(0),
  mysticalPower: integer("mystical_power").default(1),
  // 1-10 scale
  // Status and execution
  isActive: boolean("is_active").default(true),
  status: text("status").default("active"),
  // 'active', 'paused', 'disabled', 'error'
  // Execution tracking
  totalRuns: integer("total_runs").default(0),
  successfulRuns: integer("successful_runs").default(0),
  failedRuns: integer("failed_runs").default(0),
  lastRunAt: timestamp("last_run_at"),
  lastSuccessAt: timestamp("last_success_at"),
  lastFailureAt: timestamp("last_failure_at"),
  nextRunAt: timestamp("next_run_at"),
  lastErrorMessage: text("last_error_message"),
  averageExecutionTime: decimal("average_execution_time", { precision: 8, scale: 3 }),
  // milliseconds
  // Advanced features
  priority: integer("priority").default(5),
  // 1-10 execution priority
  timeout: integer("timeout").default(3e5),
  // Timeout in milliseconds
  retryPolicy: jsonb("retry_policy"),
  // Retry configuration
  notificationSettings: jsonb("notification_settings"),
  // How to notify on success/failure
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_workflow_automations_user").on(table.userId),
  index("idx_workflow_automations_category").on(table.category),
  index("idx_workflow_automations_trigger").on(table.triggerType),
  index("idx_workflow_automations_active").on(table.isActive),
  index("idx_workflow_automations_next_run").on(table.nextRunAt)
]);
var workflowExecutions = pgTable("workflow_executions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowId: varchar("workflow_id").notNull().references(() => workflowAutomations.id),
  executionId: varchar("execution_id").notNull(),
  // Unique ID for this execution
  status: text("status").notNull(),
  // 'started', 'running', 'completed', 'failed', 'timeout', 'cancelled'
  triggerSource: text("trigger_source"),
  // What triggered this execution
  triggerData: jsonb("trigger_data"),
  // Data from the trigger
  // Execution details
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),
  // Step tracking
  totalSteps: integer("total_steps"),
  completedSteps: integer("completed_steps"),
  failedSteps: integer("failed_steps"),
  currentStep: integer("current_step"),
  stepExecutions: jsonb("step_executions"),
  // Detailed step execution log
  // Results and outputs
  outputData: jsonb("output_data"),
  // Results produced by the workflow
  errorMessage: text("error_message"),
  errorDetails: jsonb("error_details"),
  // Mystical elements
  karmaEarned: integer("karma_earned").default(0),
  mysticalEffects: jsonb("mystical_effects"),
  // Special effects or bonuses
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_workflow_executions_workflow").on(table.workflowId),
  index("idx_workflow_executions_status").on(table.status),
  index("idx_workflow_executions_started").on(table.startedAt),
  index("idx_workflow_executions_execution_id").on(table.executionId)
]);
var integrationAnalytics = pgTable("integration_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  analyticsDate: timestamp("analytics_date").notNull(),
  // Date for daily/hourly aggregations
  timeframe: text("timeframe").notNull(),
  // 'hourly', 'daily', 'weekly', 'monthly'
  // Usage metrics
  apiCalls: integer("api_calls").default(0),
  successfulCalls: integer("successful_calls").default(0),
  failedCalls: integer("failed_calls").default(0),
  dataTransferred: integer("data_transferred").default(0),
  // bytes
  // Performance metrics
  averageResponseTime: decimal("average_response_time", { precision: 8, scale: 3 }),
  // milliseconds
  minResponseTime: decimal("min_response_time", { precision: 8, scale: 3 }),
  maxResponseTime: decimal("max_response_time", { precision: 8, scale: 3 }),
  // Error tracking
  errorCategories: jsonb("error_categories"),
  // Categorized error counts
  rateLimitHits: integer("rate_limit_hits").default(0),
  timeoutCount: integer("timeout_count").default(0),
  // Business metrics
  automationsTriggered: integer("automations_triggered").default(0),
  workflowsCompleted: integer("workflows_completed").default(0),
  dataPointsSynced: integer("data_points_synced").default(0),
  // Cost tracking
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 4 }),
  // External API costs
  creditsUsed: integer("credits_used").default(0),
  // Internal credits consumed
  // House performance
  houseId: text("house_id"),
  houseBonusApplied: decimal("house_bonus_applied", { precision: 3, scale: 2 }),
  karmaGenerated: integer("karma_generated").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_integration_analytics_integration").on(table.integrationId),
  index("idx_integration_analytics_user").on(table.userId),
  index("idx_integration_analytics_date").on(table.analyticsDate),
  index("idx_integration_analytics_timeframe").on(table.timeframe)
]);
var externalUserMappings = pgTable("external_user_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  integrationId: varchar("integration_id").notNull().references(() => externalIntegrations.id),
  externalUserId: text("external_user_id").notNull(),
  // User ID in external system
  externalUserName: text("external_user_name"),
  // Username in external system
  externalUserEmail: text("external_user_email"),
  // Email in external system
  permissions: jsonb("permissions"),
  // What Panel Profits data can be shared
  dataMapping: jsonb("data_mapping"),
  // How Panel Profits data maps to external system
  syncPreferences: jsonb("sync_preferences"),
  // User preferences for data synchronization
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_external_user_mappings_user").on(table.userId),
  index("idx_external_user_mappings_integration").on(table.integrationId),
  index("idx_external_user_mappings_external_id").on(table.externalUserId)
]);
var insertExternalIntegrationSchema = createInsertSchema(externalIntegrations).omit({
  id: true,
  totalSyncs: true,
  lastSyncAt: true,
  lastHealthCheck: true,
  retryCount: true,
  createdAt: true,
  updatedAt: true
});
var insertIntegrationWebhookSchema = createInsertSchema(integrationWebhooks).omit({
  id: true,
  totalTriggers: true,
  successfulTriggers: true,
  failedTriggers: true,
  lastTriggeredAt: true,
  lastSuccessAt: true,
  lastFailureAt: true,
  averageResponseTime: true,
  createdAt: true,
  updatedAt: true
});
var insertIntegrationSyncLogSchema = createInsertSchema(integrationSyncLogs).omit({
  id: true,
  createdAt: true
});
var insertWorkflowAutomationSchema = createInsertSchema(workflowAutomations).omit({
  id: true,
  totalRuns: true,
  successfulRuns: true,
  failedRuns: true,
  lastRunAt: true,
  lastSuccessAt: true,
  lastFailureAt: true,
  averageExecutionTime: true,
  createdAt: true,
  updatedAt: true
});
var insertWorkflowExecutionSchema = createInsertSchema(workflowExecutions).omit({
  id: true,
  createdAt: true
});
var insertIntegrationAnalyticsSchema = createInsertSchema(integrationAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertExternalUserMappingSchema = createInsertSchema(externalUserMappings).omit({
  id: true,
  lastSyncAt: true,
  createdAt: true,
  updatedAt: true
});
var imfVaultSettings = pgTable("imf_vault_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Share Supply Control
  totalSharesIssued: decimal("total_shares_issued", { precision: 15, scale: 4 }).notNull(),
  sharesInVault: decimal("shares_in_vault", { precision: 15, scale: 4 }).default("0.0000"),
  sharesInCirculation: decimal("shares_in_circulation", { precision: 15, scale: 4 }).notNull(),
  maxSharesAllowed: decimal("max_shares_allowed", { precision: 15, scale: 4 }).notNull(),
  shareCreationCutoffDate: timestamp("share_creation_cutoff_date").notNull(),
  // Vaulting Conditions
  vaultingThreshold: decimal("vaulting_threshold", { precision: 8, scale: 2 }).default("90.00"),
  // % market cap required to trigger vaulting
  minHoldingPeriod: integer("min_holding_period_days").default(30),
  // Minimum days to hold before vaulting
  vaultingFee: decimal("vaulting_fee", { precision: 8, scale: 4 }).default("0.0025"),
  // 0.25% fee for vaulting
  // Scarcity Mechanics
  scarcityMultiplier: decimal("scarcity_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  lastScarcityUpdate: timestamp("last_scarcity_update").defaultNow(),
  demandPressure: decimal("demand_pressure", { precision: 8, scale: 2 }).default("0.00"),
  // Buying pressure indicator
  supplyConstraint: decimal("supply_constraint", { precision: 8, scale: 2 }).default("0.00"),
  // Supply limitation factor
  // Vault Status
  isVaultingActive: boolean("is_vaulting_active").default(true),
  vaultStatus: text("vault_status").default("active"),
  // 'active', 'locked', 'emergency_release'
  nextVaultingEvaluation: timestamp("next_vaulting_evaluation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var tradingFirms = pgTable("trading_firms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: text("house_id").notNull(),
  // Maps to mythological houses
  firmName: text("firm_name").notNull(),
  firmCode: text("firm_code").notNull().unique(),
  // 'HELLENIC', 'GM_FIN', 'ASHOKA', etc.
  // Leadership
  ceoName: text("ceo_name").notNull(),
  ceoMythologyRef: text("ceo_mythology_ref"),
  // Zeus, Bacchus, etc.
  advisors: jsonb("advisors"),
  // Array of advisor names and mythological references
  // Trading Specializations
  primarySpecialties: text("primary_specialties").array(),
  // ['options', 'bonds', 'blue_chip', etc.]
  weaknesses: text("weaknesses").array(),
  // ['crypto', 'tech_options', etc.]
  specialtyBonuses: jsonb("specialty_bonuses"),
  // Percentage bonuses for specialties
  weaknessPenalties: jsonb("weakness_penalties"),
  // Percentage penalties for weaknesses
  // Firm Characteristics
  tradingStyle: text("trading_style").notNull(),
  // 'aggressive', 'conservative', 'systematic', 'opportunistic'
  riskTolerance: text("risk_tolerance").notNull(),
  // 'low', 'medium', 'high', 'extreme'
  marketCapacityUSD: decimal("market_capacity_usd", { precision: 15, scale: 2 }).notNull(),
  minimumTradeSize: decimal("minimum_trade_size", { precision: 10, scale: 2 }).default("1000.00"),
  // Performance Metrics
  totalAssetsUnderManagement: decimal("total_aum", { precision: 15, scale: 2 }).default("0.00"),
  ytdReturn: decimal("ytd_return", { precision: 8, scale: 2 }).default("0.00"),
  sharpeRatio: decimal("sharpe_ratio", { precision: 8, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 8, scale: 2 }),
  winRate: decimal("win_rate", { precision: 8, scale: 2 }),
  avgTradeSize: decimal("avg_trade_size", { precision: 10, scale: 2 }),
  // Operational Status
  isActive: boolean("is_active").default(true),
  marketHours: jsonb("market_hours"),
  // Operating hours by timezone
  communicationChannels: jsonb("communication_channels"),
  // How they announce trades/strategies
  reputation: decimal("reputation", { precision: 8, scale: 2 }).default("50.00"),
  // 0-100 reputation score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var assetFinancialMapping = pgTable("asset_financial_mapping", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Financial Instrument Classification
  instrumentType: text("instrument_type").notNull(),
  // 'common_stock', 'preferred_stock', 'bond', 'etf', 'option', 'warrant'
  instrumentSubtype: text("instrument_subtype"),
  // 'corporate_bond', 'government_bond', 'equity_option', etc.
  underlyingAssetId: varchar("underlying_asset_id").references(() => assets.id),
  // For derivatives
  // Stock-like Properties (for characters, creators)
  shareClass: text("share_class").default("A"),
  // 'A', 'B', 'C' for different voting rights
  votingRights: boolean("voting_rights").default(true),
  dividendEligible: boolean("dividend_eligible").default(false),
  dividendYield: decimal("dividend_yield", { precision: 8, scale: 4 }),
  // Bond-like Properties (for publishers, institutional assets)
  creditRating: text("credit_rating"),
  // 'AAA', 'AA+', 'A', 'BBB', etc.
  maturityDate: timestamp("maturity_date"),
  couponRate: decimal("coupon_rate", { precision: 8, scale: 4 }),
  faceValue: decimal("face_value", { precision: 10, scale: 2 }),
  // ETF/Fund Properties (for themed collections)
  fundComponents: text("fund_components").array(),
  // Asset IDs that comprise the fund
  expenseRatio: decimal("expense_ratio", { precision: 8, scale: 4 }),
  trackingIndex: text("tracking_index"),
  // What index or theme this tracks
  rebalanceFrequency: text("rebalance_frequency"),
  // 'daily', 'weekly', 'monthly', 'quarterly'
  // Market Mechanics
  lotSize: integer("lot_size").default(1),
  // Minimum trading unit
  tickSize: decimal("tick_size", { precision: 8, scale: 4 }).default("0.0100"),
  // Minimum price movement
  marginRequirement: decimal("margin_requirement", { precision: 8, scale: 2 }).default("50.00"),
  // % margin required
  shortSellAllowed: boolean("short_sell_allowed").default(true),
  // Corporate Actions
  lastSplitDate: timestamp("last_split_date"),
  splitRatio: text("split_ratio"),
  // '2:1', '3:2', etc.
  lastDividendDate: timestamp("last_dividend_date"),
  exDividendDate: timestamp("ex_dividend_date"),
  // Regulatory Classification
  securityType: text("security_type").notNull(),
  // 'equity', 'debt', 'derivative', 'fund'
  exchangeListing: text("exchange_listing").default("PPX"),
  // Panel Profits Exchange
  cusip: text("cusip"),
  // Committee on Uniform Securities Identification Procedures
  isin: text("isin"),
  // International Securities Identification Number
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var globalMarketHours = pgTable("global_market_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  marketCode: text("market_code").notNull().unique(),
  // 'NYC', 'LON', 'SYD', 'HKG', 'BOM'
  marketName: text("market_name").notNull(),
  timezone: text("timezone").notNull(),
  // 'America/New_York', 'Europe/London', etc.
  // Trading Hours (in market local time)
  regularOpenTime: text("regular_open_time").notNull(),
  // '09:30'
  regularCloseTime: text("regular_close_time").notNull(),
  // '16:00'
  preMarketOpenTime: text("pre_market_open_time"),
  // '04:00'
  afterHoursCloseTime: text("after_hours_close_time"),
  // '20:00'
  // Market Status
  isActive: boolean("is_active").default(true),
  currentStatus: text("current_status").default("closed"),
  // 'open', 'closed', 'pre_market', 'after_hours'
  lastStatusUpdate: timestamp("last_status_update").defaultNow(),
  // Holiday Schedule
  holidaySchedule: jsonb("holiday_schedule"),
  // Array of holiday dates
  earlyCloseSchedule: jsonb("early_close_schedule"),
  // Special early close dates
  // Cross-Market Trading
  enablesCrossTrading: boolean("enables_cross_trading").default(true),
  crossTradingFee: decimal("cross_trading_fee", { precision: 8, scale: 4 }).default("0.0010"),
  // Volume and Activity
  dailyVolumeTarget: decimal("daily_volume_target", { precision: 15, scale: 2 }),
  currentDayVolume: decimal("current_day_volume", { precision: 15, scale: 2 }).default("0.00"),
  avgDailyVolume: decimal("avg_daily_volume", { precision: 15, scale: 2 }),
  // Market Influence
  influenceWeight: decimal("influence_weight", { precision: 8, scale: 4 }).default("1.0000"),
  // How much this market affects global prices
  leadMarket: boolean("lead_market").default(false),
  // True for NYC (primary market)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var optionsChain = pgTable("options_chain", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  underlyingAssetId: varchar("underlying_asset_id").notNull().references(() => assets.id),
  optionSymbol: text("option_symbol").notNull().unique(),
  // 'BAT240315C120'
  // Contract Specifications
  contractType: text("contract_type").notNull(),
  // 'call', 'put'
  strikePrice: decimal("strike_price", { precision: 10, scale: 2 }).notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  exerciseStyle: text("exercise_style").default("american"),
  // 'american', 'european'
  contractSize: integer("contract_size").default(100),
  // Shares per contract
  // Pricing
  bidPrice: decimal("bid_price", { precision: 10, scale: 4 }),
  askPrice: decimal("ask_price", { precision: 10, scale: 4 }),
  lastPrice: decimal("last_price", { precision: 10, scale: 4 }),
  markPrice: decimal("mark_price", { precision: 10, scale: 4 }),
  // Mid-market fair value
  // Greeks
  delta: decimal("delta", { precision: 8, scale: 6 }),
  // Price sensitivity to underlying
  gamma: decimal("gamma", { precision: 8, scale: 6 }),
  // Delta sensitivity to underlying
  theta: decimal("theta", { precision: 8, scale: 6 }),
  // Time decay
  vega: decimal("vega", { precision: 8, scale: 6 }),
  // Volatility sensitivity
  rho: decimal("rho", { precision: 8, scale: 6 }),
  // Interest rate sensitivity
  // Volatility
  impliedVolatility: decimal("implied_volatility", { precision: 8, scale: 4 }),
  // IV %
  historicalVolatility: decimal("historical_volatility", { precision: 8, scale: 4 }),
  // HV %
  // Volume and Open Interest
  volume: integer("volume").default(0),
  openInterest: integer("open_interest").default(0),
  lastTradeTime: timestamp("last_trade_time"),
  // Risk Metrics
  intrinsicValue: decimal("intrinsic_value", { precision: 10, scale: 4 }),
  timeValue: decimal("time_value", { precision: 10, scale: 4 }),
  breakEvenPrice: decimal("break_even_price", { precision: 10, scale: 2 }),
  maxRisk: decimal("max_risk", { precision: 10, scale: 2 }),
  maxReward: decimal("max_reward", { precision: 10, scale: 2 }),
  // Status
  isActive: boolean("is_active").default(true),
  lastGreeksUpdate: timestamp("last_greeks_update"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var marginAccounts = pgTable("margin_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  // Account Balances
  marginEquity: decimal("margin_equity", { precision: 15, scale: 2 }).default("0.00"),
  marginCash: decimal("margin_cash", { precision: 15, scale: 2 }).default("0.00"),
  marginDebt: decimal("margin_debt", { precision: 15, scale: 2 }).default("0.00"),
  // Buying Power & Limits
  buyingPower: decimal("buying_power", { precision: 15, scale: 2 }).default("0.00"),
  dayTradingBuyingPower: decimal("day_trading_buying_power", { precision: 15, scale: 2 }).default("0.00"),
  maintenanceMargin: decimal("maintenance_margin", { precision: 15, scale: 2 }).default("0.00"),
  initialMarginReq: decimal("initial_margin_req", { precision: 8, scale: 2 }).default("50.00"),
  // %
  maintenanceMarginReq: decimal("maintenance_margin_req", { precision: 8, scale: 2 }).default("25.00"),
  // %
  // Leverage Settings
  maxLeverage: decimal("max_leverage", { precision: 8, scale: 2 }).default("2.00"),
  // 2:1 leverage
  currentLeverage: decimal("current_leverage", { precision: 8, scale: 2 }).default("1.00"),
  leverageUtilization: decimal("leverage_utilization", { precision: 8, scale: 2 }).default("0.00"),
  // %
  // Risk Management
  marginCallThreshold: decimal("margin_call_threshold", { precision: 8, scale: 2 }).default("30.00"),
  // %
  liquidationThreshold: decimal("liquidation_threshold", { precision: 8, scale: 2 }).default("20.00"),
  // %
  lastMarginCall: timestamp("last_margin_call"),
  marginCallsCount: integer("margin_calls_count").default(0),
  dayTradesUsed: integer("day_trades_used").default(0),
  // For PDT rule
  dayTradesMax: integer("day_trades_max").default(3),
  // Status
  accountStatus: text("account_status").default("good_standing"),
  // 'good_standing', 'margin_call', 'restricted'
  marginTradingEnabled: boolean("margin_trading_enabled").default(false),
  shortSellingEnabled: boolean("short_selling_enabled").default(false),
  optionsTradingLevel: integer("options_trading_level").default(0),
  // 0-4 options approval levels
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var shortPositions = pgTable("short_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Position Details
  sharesShorted: decimal("shares_shorted", { precision: 10, scale: 4 }).notNull(),
  shortPrice: decimal("short_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  // P&L
  unrealizedPnL: decimal("unrealized_pnl", { precision: 15, scale: 2 }),
  realizedPnL: decimal("realized_pnl", { precision: 15, scale: 2 }).default("0.00"),
  // Borrowing Costs
  borrowRate: decimal("borrow_rate", { precision: 8, scale: 4 }),
  // Daily borrow rate %
  borrowFeeAccrued: decimal("borrow_fee_accrued", { precision: 10, scale: 2 }).default("0.00"),
  lastBorrowFeeCalc: timestamp("last_borrow_fee_calc").defaultNow(),
  // Risk Management
  stopLossPrice: decimal("stop_loss_price", { precision: 10, scale: 2 }),
  marginRequirement: decimal("margin_requirement", { precision: 15, scale: 2 }),
  // Status
  positionStatus: text("position_status").default("open"),
  // 'open', 'covering', 'closed'
  canBorrow: boolean("can_borrow").default(true),
  // Can borrow shares for this asset
  borrowSource: text("borrow_source"),
  // Where shares are borrowed from
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var informationTiers = pgTable("information_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tierName: text("tier_name").notNull().unique(),
  // 'Elite', 'Pro', 'Free'
  tierLevel: integer("tier_level").notNull(),
  // 1=Elite, 2=Pro, 3=Free
  // Access Timing
  newsDelayMinutes: integer("news_delay_minutes").default(0),
  // Elite=0, Pro=15, Free=30
  marketDataDelayMs: integer("market_data_delay_ms").default(0),
  // Real-time delays
  // Information Quality
  analysisQuality: text("analysis_quality").notNull(),
  // 'family_office', 'senior_analyst', 'junior_broker'
  insightDepth: text("insight_depth").notNull(),
  // 'comprehensive', 'standard', 'basic'
  // Features Unlocked
  advancedCharting: boolean("advanced_charting").default(false),
  realTimeAlerts: boolean("real_time_alerts").default(false),
  whaleTrackingAccess: boolean("whale_tracking_access").default(false),
  firmIntelligence: boolean("firm_intelligence").default(false),
  // Trading firm activity insights
  earlyMarketEvents: boolean("early_market_events").default(false),
  exclusiveResearch: boolean("exclusive_research").default(false),
  // Subscription Details
  monthlyPrice: decimal("monthly_price", { precision: 8, scale: 2 }),
  annualPrice: decimal("annual_price", { precision: 8, scale: 2 }),
  creditsCost: integer("credits_cost").default(0),
  // Alternative pricing in trading credits
  // Limits
  maxPriceAlerts: integer("max_price_alerts").default(5),
  maxWatchlistAssets: integer("max_watchlist_assets").default(20),
  maxPortfolios: integer("max_portfolios").default(1),
  // Status
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Content
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  fullContent: text("full_content"),
  sourceOrganization: text("source_organization").notNull(),
  authorName: text("author_name"),
  // Classification
  newsCategory: text("news_category").notNull(),
  // 'market_moving', 'earnings', 'merger', 'scandal', 'promotion'
  impactLevel: text("impact_level").notNull(),
  // 'high', 'medium', 'low'
  affectedAssets: text("affected_assets").array(),
  // Asset IDs that this news affects
  // Timing and Access
  createdAt: timestamp("created_at").defaultNow(),
  publishTime: timestamp("publish_time").notNull(),
  // When each tier sees it
  eliteReleaseTime: timestamp("elite_release_time").notNull(),
  // 30 min early
  proReleaseTime: timestamp("pro_release_time").notNull(),
  // 15 min early
  freeReleaseTime: timestamp("free_release_time").notNull(),
  // On time
  // Market Impact
  priceImpactDirection: text("price_impact_direction"),
  // 'positive', 'negative', 'neutral'
  priceImpactMagnitude: decimal("price_impact_magnitude", { precision: 8, scale: 2 }),
  // Expected % change
  volatilityImpact: decimal("volatility_impact", { precision: 8, scale: 2 }),
  // Expected volatility increase %
  // Verification
  isVerified: boolean("is_verified").default(true),
  // News ticker is always correct
  verifiedBy: text("verified_by").default("panel_profits_oracle"),
  confidenceScore: decimal("confidence_score", { precision: 8, scale: 2 }).default("100.00"),
  // Status
  isActive: boolean("is_active").default(true),
  tags: text("tags").array(),
  // Searchable tags
  relatedArticles: text("related_articles").array(),
  // Related article IDs
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertImfVaultSettingsSchema = createInsertSchema(imfVaultSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTradingFirmSchema = createInsertSchema(tradingFirms).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAssetFinancialMappingSchema = createInsertSchema(assetFinancialMapping).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertGlobalMarketHoursSchema = createInsertSchema(globalMarketHours).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOptionsChainSchema = createInsertSchema(optionsChain).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMarginAccountSchema = createInsertSchema(marginAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertShortPositionSchema = createInsertSchema(shortPositions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInformationTierSchema = createInsertSchema(informationTiers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var rawDatasetFiles = pgTable("raw_dataset_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // File identification
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileSize: integer("file_size").notNull(),
  // Size in bytes
  mimeType: text("mime_type").notNull(),
  // File integrity
  checksum: text("checksum").notNull(),
  // MD5 or SHA256 hash
  checksumAlgorithm: text("checksum_algorithm").default("sha256"),
  // Dataset metadata
  datasetType: text("dataset_type").notNull(),
  // 'characters', 'comics', 'battles', 'movies', 'reviews'
  source: text("source").notNull(),
  // 'marvel_wikia', 'dc_wikia', 'imdb', 'manual_upload'
  sourceUrl: text("source_url"),
  // Original download URL if applicable
  universe: text("universe"),
  // 'marvel', 'dc', 'independent', 'crossover'
  // Processing status
  processingStatus: text("processing_status").default("uploaded"),
  // 'uploaded', 'validating', 'processing', 'completed', 'failed'
  processingProgress: decimal("processing_progress", { precision: 5, scale: 2 }).default("0.00"),
  // 0-100%
  totalRows: integer("total_rows"),
  processedRows: integer("processed_rows").default(0),
  failedRows: integer("failed_rows").default(0),
  // File storage
  storageLocation: text("storage_location").notNull(),
  // File path or URL
  compressionType: text("compression_type"),
  // 'gzip', 'zip', null
  // Ingestion metadata
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  ingestionJobId: varchar("ingestion_job_id"),
  // References ingestion_jobs table
  csvHeaders: text("csv_headers").array(),
  // Column names from CSV header
  sampleData: jsonb("sample_data"),
  // First few rows for preview
  validationRules: jsonb("validation_rules"),
  // Applied validation rules
  // Error tracking
  errorSummary: jsonb("error_summary"),
  // Summary of validation/processing errors
  lastErrorMessage: text("last_error_message"),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  // Timestamps
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processingStartedAt: timestamp("processing_started_at"),
  processingCompletedAt: timestamp("processing_completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_raw_dataset_files_status").on(table.processingStatus),
  index("idx_raw_dataset_files_type").on(table.datasetType),
  index("idx_raw_dataset_files_source").on(table.source),
  index("idx_raw_dataset_files_uploaded_by").on(table.uploadedBy),
  index("idx_raw_dataset_files_checksum").on(table.checksum)
]);
var stagingRecords = pgTable("staging_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Source tracking
  datasetFileId: varchar("dataset_file_id").notNull().references(() => rawDatasetFiles.id),
  rowNumber: integer("row_number").notNull(),
  // Row number in original CSV
  // Raw data
  rawData: jsonb("raw_data").notNull(),
  // Complete row data as JSON
  dataHash: text("data_hash").notNull(),
  // Hash of raw data for deduplication
  // Processing status
  processingStatus: text("processing_status").default("pending"),
  // 'pending', 'processing', 'normalized', 'failed', 'skipped'
  normalizationAttempts: integer("normalization_attempts").default(0),
  // Identification and classification
  recordType: text("record_type"),
  // 'character', 'comic_issue', 'battle', 'movie', 'review'
  detectedEntityType: text("detected_entity_type"),
  // AI-detected entity type
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  // 0-1 confidence in classification
  // Normalization mapping
  mappedFields: jsonb("mapped_fields"),
  // Field mapping from raw data to normalized schema
  extractedEntities: jsonb("extracted_entities"),
  // Extracted entity references
  relationshipHints: jsonb("relationship_hints"),
  // Potential relationships with other entities
  // Quality metrics
  dataQualityScore: decimal("data_quality_score", { precision: 3, scale: 2 }),
  // 0-1 quality assessment
  missingFields: text("missing_fields").array(),
  // Required fields that are missing
  dataInconsistencies: jsonb("data_inconsistencies"),
  // Detected data issues
  // Deduplication
  isDuplicate: boolean("is_duplicate").default(false),
  duplicateOf: varchar("duplicate_of").references(() => stagingRecords.id),
  // Reference to original record
  similarityScore: decimal("similarity_score", { precision: 3, scale: 2 }),
  // Similarity to potential duplicates
  // Error handling
  errorMessages: text("error_messages").array(),
  lastErrorDetails: jsonb("last_error_details"),
  // Vector embeddings for similarity detection and entity matching
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  normalizedAt: timestamp("normalized_at")
}, (table) => [
  index("idx_staging_records_file_id").on(table.datasetFileId),
  index("idx_staging_records_status").on(table.processingStatus),
  index("idx_staging_records_type").on(table.recordType),
  index("idx_staging_records_hash").on(table.dataHash),
  index("idx_staging_records_duplicate").on(table.isDuplicate),
  // Unique constraint to prevent duplicate rows from same file
  index("idx_staging_records_unique").on(table.datasetFileId, table.rowNumber)
]);
var narrativeEntities = pgTable("narrative_entities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Core identification
  canonicalName: text("canonical_name").notNull(),
  entityType: text("entity_type").notNull(),
  // 'character', 'comic_series', 'comic_issue', 'movie', 'tv_show', 'creator', 'publisher', 'team', 'location', 'artifact'
  subtype: text("subtype"),
  // 'hero', 'villain', 'antihero', 'supporting', 'ongoing_series', 'limited_series', etc.
  universe: text("universe").notNull(),
  // 'marvel', 'dc', 'image', 'dark_horse', 'independent', 'crossover'
  // Identity and classification
  realName: text("real_name"),
  // For characters
  secretIdentity: boolean("secret_identity").default(false),
  publicIdentity: boolean("public_identity").default(false),
  isDeceased: boolean("is_deceased").default(false),
  // Physical characteristics (for characters)
  gender: text("gender"),
  species: text("species").default("human"),
  height: decimal("height", { precision: 5, scale: 2 }),
  // Height in cm
  weight: decimal("weight", { precision: 5, scale: 1 }),
  // Weight in kg
  eyeColor: text("eye_color"),
  hairColor: text("hair_color"),
  // Publication/creation details
  firstAppearance: text("first_appearance"),
  // Comic issue or media where entity first appeared
  firstAppearanceDate: text("first_appearance_date"),
  // Publication date
  creators: text("creators").array(),
  // Original creators
  currentCreators: text("current_creators").array(),
  // Current writers/artists
  // Relationship data
  teams: text("teams").array(),
  // Team affiliations
  allies: text("allies").array(),
  // Allied entity IDs
  enemies: text("enemies").array(),
  // Enemy entity IDs
  familyMembers: text("family_members").array(),
  // Family relationship entity IDs
  // Geographic and temporal context
  originLocation: text("origin_location"),
  // Place of origin
  currentLocation: text("current_location"),
  // Current location
  timelineEra: text("timeline_era"),
  // 'golden_age', 'silver_age', 'bronze_age', 'modern_age', 'future'
  // Publication status
  publicationStatus: text("publication_status").default("active"),
  // 'active', 'inactive', 'limited', 'concluded', 'cancelled'
  lastAppearance: text("last_appearance"),
  lastAppearanceDate: text("last_appearance_date"),
  // Market and trading data
  assetId: varchar("asset_id").references(() => assets.id),
  // Link to tradeable asset
  marketValue: decimal("market_value", { precision: 10, scale: 2 }),
  popularityScore: decimal("popularity_score", { precision: 8, scale: 2 }),
  culturalImpact: decimal("cultural_impact", { precision: 8, scale: 2 }),
  // 0-100 cultural significance score
  // Content and description
  biography: text("biography"),
  // Comprehensive character/entity background
  description: text("description"),
  // Brief description
  keyStorylines: text("key_storylines").array(),
  // Important story arcs
  notableQuotes: text("notable_quotes").array(),
  // Visual representation
  primaryImageUrl: text("primary_image_url"),
  alternateImageUrls: text("alternate_image_urls").array(),
  iconographicElements: text("iconographic_elements").array(),
  // Visual symbols, costume elements
  // Data quality and verification
  canonicalityScore: decimal("canonicality_score", { precision: 3, scale: 2 }).default("1.00"),
  // 0-1 how canonical this entity is
  dataCompleteness: decimal("data_completeness", { precision: 3, scale: 2 }),
  // 0-1 how complete the data is
  verificationStatus: text("verification_status").default("unverified"),
  // 'verified', 'unverified', 'disputed'
  verifiedBy: varchar("verified_by").references(() => users.id),
  // External references
  externalIds: jsonb("external_ids"),
  // IDs from other databases (wikia, imdb, etc.)
  sourceUrls: text("source_urls").array(),
  // Original source URLs
  wikipediaUrl: text("wikipedia_url"),
  officialWebsite: text("official_website"),
  // Vector embeddings for similarity and recommendations
  entityEmbedding: vector("entity_embedding", { dimensions: 1536 }),
  biographyEmbedding: vector("biography_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at")
}, (table) => [
  index("idx_narrative_entities_type").on(table.entityType),
  index("idx_narrative_entities_universe").on(table.universe),
  index("idx_narrative_entities_subtype").on(table.subtype),
  index("idx_narrative_entities_canonical_name").on(table.canonicalName),
  index("idx_narrative_entities_asset_id").on(table.assetId),
  index("idx_narrative_entities_popularity").on(table.popularityScore),
  index("idx_narrative_entities_verification").on(table.verificationStatus),
  // Unique constraint on canonical name + universe for entity types
  index("idx_narrative_entities_unique").on(table.canonicalName, table.universe, table.entityType)
]);
var narrativeTraits = pgTable("narrative_traits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Entity association
  entityId: varchar("entity_id").notNull().references(() => narrativeEntities.id),
  // Trait classification
  traitCategory: text("trait_category").notNull(),
  // 'power', 'skill', 'equipment', 'weakness', 'personality', 'physical_attribute'
  traitType: text("trait_type").notNull(),
  // 'superhuman_strength', 'telepathy', 'martial_arts', 'armor', 'kryptonite_vulnerability'
  traitName: text("trait_name").notNull(),
  // Human-readable trait name
  // Quantification
  potencyLevel: integer("potency_level"),
  // 1-10 scale for power level
  masteryLevel: integer("mastery_level"),
  // 1-10 scale for skill mastery
  reliabilityLevel: integer("reliability_level"),
  // 1-10 scale for how consistently the trait manifests
  versatilityScore: decimal("versatility_score", { precision: 3, scale: 2 }),
  // 0-1 how versatile the trait is
  // Detailed specifications
  description: text("description").notNull(),
  limitations: text("limitations").array(),
  // Known limitations or restrictions
  triggers: text("triggers").array(),
  // What activates this trait
  duration: text("duration"),
  // How long the trait lasts when active
  range: text("range"),
  // Physical or mental range of the trait
  energyCost: text("energy_cost"),
  // Physical or mental cost to use
  // Contextual factors
  environmentalFactors: text("environmental_factors").array(),
  // Environmental conditions that affect the trait
  combatEffectiveness: decimal("combat_effectiveness", { precision: 3, scale: 2 }),
  // 0-1 effectiveness in combat
  utilityValue: decimal("utility_value", { precision: 3, scale: 2 }),
  // 0-1 usefulness outside combat
  rarityScore: decimal("rarity_score", { precision: 3, scale: 2 }),
  // 0-1 how rare this trait is in universe
  // Evolution and progression
  acquisitionMethod: text("acquisition_method"),
  // 'birth', 'mutation', 'training', 'accident', 'technology', 'magic'
  developmentStage: text("development_stage").default("stable"),
  // 'emerging', 'developing', 'stable', 'declining', 'lost'
  evolutionPotential: decimal("evolution_potential", { precision: 3, scale: 2 }),
  // 0-1 potential for growth
  // Canon and continuity
  canonicity: text("canonicity").default("main"),
  // 'main', 'alternate', 'what_if', 'elseworld', 'non_canon'
  continuityEra: text("continuity_era"),
  // When this trait was active in continuity
  retconStatus: text("retcon_status").default("current"),
  // 'current', 'retconned', 'disputed', 'restored'
  // Source and verification
  sourceIssues: text("source_issues").array(),
  // Comic issues where this trait was established/shown
  sourceMedia: text("source_media").array(),
  // Movies, TV shows, games where trait appeared
  verificationLevel: text("verification_level").default("unverified"),
  // 'verified', 'likely', 'unverified', 'disputed'
  // Market impact
  marketRelevance: decimal("market_relevance", { precision: 3, scale: 2 }),
  // 0-1 how much this trait affects market value
  fanAppeal: decimal("fan_appeal", { precision: 3, scale: 2 }),
  // 0-1 how much fans care about this trait
  // Metadata
  tags: text("tags").array(),
  // Searchable tags
  aliases: text("aliases").array(),
  // Alternative names for this trait
  relatedTraits: text("related_traits").array(),
  // IDs of related trait records
  // Vector embeddings for trait similarity and clustering
  traitEmbedding: vector("trait_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at")
}, (table) => [
  index("idx_narrative_traits_entity_id").on(table.entityId),
  index("idx_narrative_traits_category").on(table.traitCategory),
  index("idx_narrative_traits_type").on(table.traitType),
  index("idx_narrative_traits_potency").on(table.potencyLevel),
  index("idx_narrative_traits_mastery").on(table.masteryLevel),
  index("idx_narrative_traits_canonicity").on(table.canonicity),
  index("idx_narrative_traits_market_relevance").on(table.marketRelevance)
]);
var entityAliases = pgTable("entity_aliases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Entity association
  canonicalEntityId: varchar("canonical_entity_id").notNull().references(() => narrativeEntities.id),
  // Alias information
  aliasName: text("alias_name").notNull(),
  aliasType: text("alias_type").notNull(),
  // 'real_name', 'codename', 'nickname', 'title', 'secret_identity', 'civilian_identity', 'alternate_universe', 'translation', 'misspelling'
  // Usage context
  usageContext: text("usage_context"),
  // 'primary', 'secondary', 'historical', 'alternate_universe', 'fan_name', 'media_adaptation'
  universe: text("universe"),
  // Specific universe where this alias applies
  timeline: text("timeline"),
  // Timeline/era when this alias was used
  media: text("media"),
  // 'comics', 'movies', 'tv', 'games', 'novels'
  // Popularity and recognition
  popularityScore: decimal("popularity_score", { precision: 3, scale: 2 }),
  // 0-1 how well-known this alias is
  officialStatus: boolean("official_status").default(false),
  // Whether this is an official name
  currentlyInUse: boolean("currently_in_use").default(true),
  // Whether this alias is currently used
  // Linguistic and cultural data
  language: text("language").default("en"),
  // Language of the alias
  culturalContext: text("cultural_context"),
  // Cultural significance of the name
  pronunciation: text("pronunciation"),
  // Phonetic pronunciation guide
  etymology: text("etymology"),
  // Origin and meaning of the name
  // Cross-reference data
  sourceEntity: varchar("source_entity"),
  // Original entity this alias came from (for cross-universe variants)
  alternateUniverseId: text("alternate_universe_id"),
  // Earth-616, Earth-2, etc.
  characterVariation: text("character_variation"),
  // 'main', 'ultimate', 'noir', 'zombie', 'female', 'evil'
  // Source tracking
  sourceIssues: text("source_issues").array(),
  // Where this alias first appeared or was used
  sourceMedia: text("source_media").array(),
  // Non-comic media where alias was used
  introducedBy: text("introduced_by").array(),
  // Creators who introduced this alias
  firstUsageDate: text("first_usage_date"),
  lastUsageDate: text("last_usage_date"),
  // Search and matching
  searchPriority: integer("search_priority").default(0),
  // Priority for search results (higher = shown first)
  exactMatchWeight: decimal("exact_match_weight", { precision: 3, scale: 2 }).default("1.00"),
  // Weight for exact matches
  fuzzyMatchWeight: decimal("fuzzy_match_weight", { precision: 3, scale: 2 }).default("0.80"),
  // Weight for fuzzy matches
  // Data quality
  verificationLevel: text("verification_level").default("unverified"),
  // 'verified', 'likely', 'unverified', 'disputed'
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }).default("1.00"),
  // Confidence in this alias mapping
  qualityFlags: text("quality_flags").array(),
  // 'official', 'fan_created', 'disputed', 'outdated'
  // Metadata
  notes: text("notes"),
  // Additional information about this alias
  tags: text("tags").array(),
  // Searchable tags
  // Vector embeddings for name similarity and matching
  aliasEmbedding: vector("alias_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at")
}, (table) => [
  index("idx_entity_aliases_canonical_id").on(table.canonicalEntityId),
  index("idx_entity_aliases_name").on(table.aliasName),
  index("idx_entity_aliases_type").on(table.aliasType),
  index("idx_entity_aliases_usage_context").on(table.usageContext),
  index("idx_entity_aliases_universe").on(table.universe),
  index("idx_entity_aliases_popularity").on(table.popularityScore),
  index("idx_entity_aliases_official").on(table.officialStatus),
  index("idx_entity_aliases_current").on(table.currentlyInUse),
  index("idx_entity_aliases_search_priority").on(table.searchPriority),
  // Unique constraint to prevent duplicate aliases for same entity
  index("idx_entity_aliases_unique").on(table.canonicalEntityId, table.aliasName, table.universe)
]);
var entityInteractions = pgTable("entity_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Entity participants
  primaryEntityId: varchar("primary_entity_id").notNull().references(() => narrativeEntities.id),
  secondaryEntityId: varchar("secondary_entity_id").references(() => narrativeEntities.id),
  // Null for environmental or solo interactions
  // Interaction classification
  interactionType: text("interaction_type").notNull(),
  // 'battle', 'team_up', 'romance', 'mentorship', 'rivalry', 'family', 'alliance', 'betrayal'
  interactionSubtype: text("interaction_subtype"),
  // 'one_on_one', 'team_battle', 'tournament', 'war', 'temporary_team', 'long_term_team'
  relationshipType: text("relationship_type"),
  // 'allies', 'enemies', 'neutral', 'romantic', 'family', 'mentor_student', 'rivals'
  // Outcome and results
  outcome: text("outcome"),
  // 'primary_wins', 'secondary_wins', 'draw', 'mutual_victory', 'mutual_defeat', 'interrupted', 'ongoing'
  outcomeConfidence: decimal("outcome_confidence", { precision: 3, scale: 2 }),
  // 0-1 confidence in outcome determination
  primaryEntityResult: text("primary_entity_result"),
  // 'victory', 'defeat', 'draw', 'survival', 'sacrifice', 'growth'
  secondaryEntityResult: text("secondary_entity_result"),
  // Context and circumstances
  environment: text("environment"),
  // 'urban', 'space', 'underwater', 'mystical_realm', 'laboratory', 'school'
  timeOfDay: text("time_of_day"),
  // 'day', 'night', 'dawn', 'dusk'
  weatherConditions: text("weather_conditions"),
  // 'clear', 'storm', 'rain', 'snow', 'extreme'
  publicVisibility: text("public_visibility"),
  // 'public', 'secret', 'limited_witnesses', 'recorded'
  // Power dynamics and analysis
  powerDifferential: decimal("power_differential", { precision: 8, scale: 2 }),
  // -10 to +10 power advantage for primary entity
  strategicAdvantage: text("strategic_advantage"),
  // Which entity had strategic advantages
  preparationTime: text("preparation_time"),
  // 'none', 'minutes', 'hours', 'days', 'weeks'
  homeFieldAdvantage: text("home_field_advantage"),
  // 'primary', 'secondary', 'neutral'
  // Duration and intensity
  duration: integer("duration_minutes"),
  // Duration in minutes
  intensityLevel: integer("intensity_level"),
  // 1-10 scale of interaction intensity
  collateralDamage: text("collateral_damage"),
  // 'none', 'minimal', 'moderate', 'extensive', 'catastrophic'
  casualtyCount: integer("casualty_count"),
  // Number of casualties if applicable
  // Moral and ethical dimensions
  moralContext: text("moral_context"),
  // 'heroic', 'villainous', 'neutral', 'gray_area', 'misunderstanding'
  ethicalImplications: text("ethical_implications").array(),
  // Ethical issues raised by this interaction
  justification: text("justification"),
  // Reason for the interaction
  // Media and canonicity
  sourceIssue: text("source_issue"),
  // Comic issue where this happened
  sourceMedia: text("source_media"),
  // Movies, TV shows, games where depicted
  writerCredits: text("writer_credits").array(),
  // Writers who created this interaction
  artistCredits: text("artist_credits").array(),
  // Artists who depicted this interaction
  canonicity: text("canonicity").default("main"),
  // 'main', 'alternate', 'what_if', 'elseworld', 'adaptation'
  continuityEra: text("continuity_era"),
  // Timeline era when this occurred
  eventDate: text("event_date"),
  // In-universe date when this occurred
  publicationDate: text("publication_date"),
  // Real-world publication date
  // Consequences and aftermath
  shortTermConsequences: text("short_term_consequences").array(),
  // Immediate results
  longTermConsequences: text("long_term_consequences").array(),
  // Lasting effects
  characterDevelopment: jsonb("character_development"),
  // How characters changed
  relationshipChange: text("relationship_change"),
  // How relationship evolved
  // Market and cultural impact
  fanReaction: text("fan_reaction"),
  // 'positive', 'negative', 'mixed', 'controversial', 'ignored'
  culturalSignificance: decimal("cultural_significance", { precision: 3, scale: 2 }),
  // 0-1 cultural importance
  marketImpact: decimal("market_impact", { precision: 8, scale: 2 }),
  // Expected impact on asset prices
  iconicStatus: boolean("iconic_status").default(false),
  // Whether this is considered iconic
  // Data quality and verification
  verificationLevel: text("verification_level").default("unverified"),
  // 'verified', 'likely', 'unverified', 'disputed'
  dataCompleteness: decimal("data_completeness", { precision: 3, scale: 2 }),
  // 0-1 how complete the data is
  sourceReliability: decimal("source_reliability", { precision: 3, scale: 2 }),
  // 0-1 reliability of sources
  // Additional participants
  additionalParticipants: text("additional_participants").array(),
  // Other entity IDs involved
  teamAffiliations: text("team_affiliations").array(),
  // Teams involved in interaction
  // Metadata
  tags: text("tags").array(),
  // Searchable tags
  keywords: text("keywords").array(),
  // Keywords for search
  summary: text("summary"),
  // Brief description of the interaction
  detailedDescription: text("detailed_description"),
  // Full description
  // Vector embeddings for interaction similarity and clustering
  interactionEmbedding: vector("interaction_embedding", { dimensions: 1536 }),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at")
}, (table) => [
  index("idx_entity_interactions_primary").on(table.primaryEntityId),
  index("idx_entity_interactions_secondary").on(table.secondaryEntityId),
  index("idx_entity_interactions_type").on(table.interactionType),
  index("idx_entity_interactions_outcome").on(table.outcome),
  index("idx_entity_interactions_canonicity").on(table.canonicity),
  index("idx_entity_interactions_significance").on(table.culturalSignificance),
  index("idx_entity_interactions_market_impact").on(table.marketImpact),
  index("idx_entity_interactions_iconic").on(table.iconicStatus),
  index("idx_entity_interactions_publication_date").on(table.publicationDate)
]);
var mediaPerformanceMetrics = pgTable("media_performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Media identification
  mediaTitle: text("media_title").notNull(),
  mediaType: text("media_type").notNull(),
  // 'movie', 'tv_series', 'tv_episode', 'animated_movie', 'animated_series', 'video_game', 'novel', 'graphic_novel'
  releaseFormat: text("release_format"),
  // 'theatrical', 'streaming', 'tv', 'direct_video', 'digital', 'limited_release'
  // Franchise and universe
  franchise: text("franchise").notNull(),
  // 'MCU', 'DCEU', 'X-Men', 'Spider-Man', 'Batman'
  universe: text("universe").notNull(),
  // 'marvel', 'dc', 'image', 'independent'
  continuity: text("continuity"),
  // 'Earth-616', 'Earth-2', 'Ultimate', 'Cinematic'
  // Featured entities
  featuredEntities: text("featured_entities").array(),
  // Narrative entity IDs
  mainCharacters: text("main_characters").array(),
  // Primary characters
  supportingCharacters: text("supporting_characters").array(),
  // Supporting characters
  villains: text("villains").array(),
  // Antagonists
  teams: text("teams").array(),
  // Teams featured
  // Release information
  releaseDate: text("release_date"),
  releaseYear: integer("release_year"),
  releaseQuarter: integer("release_quarter"),
  // 1-4
  releaseMonth: integer("release_month"),
  // 1-12
  releaseTerritories: text("release_territories").array(),
  // Countries/regions
  // Financial performance
  productionBudget: decimal("production_budget", { precision: 15, scale: 2 }),
  marketingBudget: decimal("marketing_budget", { precision: 15, scale: 2 }),
  totalBudget: decimal("total_budget", { precision: 15, scale: 2 }),
  // Box office data
  openingWeekendGross: decimal("opening_weekend_gross", { precision: 15, scale: 2 }),
  domesticGross: decimal("domestic_gross", { precision: 15, scale: 2 }),
  internationalGross: decimal("international_gross", { precision: 15, scale: 2 }),
  worldwideGross: decimal("worldwide_gross", { precision: 15, scale: 2 }),
  // Adjusted financial metrics
  inflationAdjustedBudget: decimal("inflation_adjusted_budget", { precision: 15, scale: 2 }),
  inflationAdjustedGross: decimal("inflation_adjusted_gross", { precision: 15, scale: 2 }),
  profitMargin: decimal("profit_margin", { precision: 8, scale: 2 }),
  // (Revenue - Cost) / Revenue * 100
  returnOnInvestment: decimal("return_on_investment", { precision: 8, scale: 2 }),
  // (Revenue - Cost) / Cost * 100
  // Performance ratios
  grossToBudgetRatio: decimal("gross_to_budget_ratio", { precision: 8, scale: 2 }),
  domesticPercentage: decimal("domestic_percentage", { precision: 8, scale: 2 }),
  internationalPercentage: decimal("international_percentage", { precision: 8, scale: 2 }),
  // Critical reception
  metacriticScore: integer("metacritic_score"),
  // 0-100
  rottenTomatoesScore: integer("rotten_tomatoes_score"),
  // 0-100 critics score
  rottenTomatoesAudienceScore: integer("rotten_tomatoes_audience_score"),
  // 0-100 audience score
  imdbRating: decimal("imdb_rating", { precision: 3, scale: 1 }),
  // 0-10 rating
  imdbVotes: integer("imdb_votes"),
  // Number of votes
  // Awards and recognition
  majorAwardsWon: text("major_awards_won").array(),
  // Oscar, Emmy, etc.
  majorAwardsNominated: text("major_awards_nominated").array(),
  genreAwards: text("genre_awards").array(),
  // Saturn Awards, etc.
  festivalAwards: text("festival_awards").array(),
  // Film festival awards
  // Audience metrics
  openingTheaterCount: integer("opening_theater_count"),
  maxTheaterCount: integer("max_theater_count"),
  weeksInTheaters: integer("weeks_in_theaters"),
  attendanceEstimate: integer("attendance_estimate"),
  // Estimated total viewers
  // Digital and streaming performance
  streamingViewership: decimal("streaming_viewership", { precision: 15, scale: 0 }),
  // Total streams/views
  digitalSales: decimal("digital_sales", { precision: 15, scale: 2 }),
  // Digital purchase revenue
  physicalMediaSales: decimal("physical_media_sales", { precision: 15, scale: 2 }),
  // DVD/Blu-ray sales
  merchandisingRevenue: decimal("merchandising_revenue", { precision: 15, scale: 2 }),
  // Cultural impact metrics
  socialMediaMentions: integer("social_media_mentions"),
  // Total social media mentions
  socialMediaSentiment: decimal("social_media_sentiment", { precision: 3, scale: 2 }),
  // -1 to 1
  culturalReach: decimal("cultural_reach", { precision: 8, scale: 2 }),
  // 0-100 cultural penetration score
  memeCulture: boolean("meme_culture").default(false),
  // Whether it spawned significant memes
  fanCommunitySize: integer("fan_community_size"),
  // Estimated fan community size
  // Demographic appeal
  primaryDemographic: text("primary_demographic"),
  // 'children', 'teens', 'young_adults', 'adults', 'all_ages'
  genderAppeal: text("gender_appeal"),
  // 'male_skewing', 'female_skewing', 'gender_neutral'
  ageRating: text("age_rating"),
  // 'G', 'PG', 'PG-13', 'R', 'TV-Y', 'TV-14', etc.
  // Market impact on related assets
  assetPriceImpact: jsonb("asset_price_impact"),
  // How this media affected related asset prices
  marketEventTrigger: boolean("market_event_trigger").default(false),
  // Whether this triggered a market event
  tradingVolumeIncrease: decimal("trading_volume_increase", { precision: 8, scale: 2 }),
  // % increase in related asset trading
  // Production details
  director: text("director").array(),
  producers: text("producers").array(),
  writers: text("writers").array(),
  studio: text("studio"),
  distributor: text("distributor"),
  productionCompanies: text("production_companies").array(),
  // Technical specifications
  runtime: integer("runtime_minutes"),
  format: text("format"),
  // 'live_action', 'animation', 'mixed'
  technologyUsed: text("technology_used").array(),
  // 'IMAX', '3D', 'CGI', 'motion_capture'
  filmingLocations: text("filming_locations").array(),
  // Sequel and franchise data
  isSequel: boolean("is_sequel").default(false),
  isReboot: boolean("is_reboot").default(false),
  isSpinoff: boolean("is_spinoff").default(false),
  franchisePosition: integer("franchise_position"),
  // Position in franchise chronology
  predecessorId: varchar("predecessor_id").references(() => mediaPerformanceMetrics.id),
  successorId: varchar("successor_id").references(() => mediaPerformanceMetrics.id),
  // Data quality and sources
  dataCompleteness: decimal("data_completeness", { precision: 3, scale: 2 }),
  // 0-1 completeness score
  sourceReliability: decimal("source_reliability", { precision: 3, scale: 2 }),
  // 0-1 source reliability
  dataSources: text("data_sources").array(),
  // Where data came from
  lastDataUpdate: timestamp("last_data_update"),
  // External references
  imdbId: text("imdb_id"),
  tmdbId: text("tmdb_id"),
  // The Movie Database ID
  rottenTomatoesId: text("rotten_tomatoes_id"),
  metacriticId: text("metacritic_id"),
  externalUrls: text("external_urls").array(),
  // Vector embeddings for content similarity and recommendations
  contentEmbedding: vector("content_embedding", { dimensions: 1536 }),
  performanceEmbedding: vector("performance_embedding", { dimensions: 1536 }),
  // Performance pattern vector
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastVerifiedAt: timestamp("last_verified_at")
}, (table) => [
  index("idx_media_performance_media_type").on(table.mediaType),
  index("idx_media_performance_franchise").on(table.franchise),
  index("idx_media_performance_universe").on(table.universe),
  index("idx_media_performance_release_year").on(table.releaseYear),
  index("idx_media_performance_worldwide_gross").on(table.worldwideGross),
  index("idx_media_performance_roi").on(table.returnOnInvestment),
  index("idx_media_performance_critical_score").on(table.metacriticScore),
  index("idx_media_performance_cultural_reach").on(table.culturalReach),
  index("idx_media_performance_franchise_position").on(table.franchisePosition)
]);
var ingestionJobs = pgTable("ingestion_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Job identification
  jobName: text("job_name").notNull(),
  jobType: text("job_type").notNull(),
  // 'csv_import', 'api_sync', 'manual_entry', 'bulk_update', 'data_migration'
  batchId: text("batch_id"),
  // Identifier for grouping related jobs
  // Job configuration
  datasetType: text("dataset_type").notNull(),
  // 'characters', 'comics', 'battles', 'movies', 'reviews'
  sourceType: text("source_type").notNull(),
  // 'csv_file', 'api', 'manual', 'database'
  processingMode: text("processing_mode").default("standard"),
  // 'standard', 'fast', 'thorough', 'validation_only'
  // Input specifications
  inputFiles: text("input_files").array(),
  // File IDs or paths
  inputParameters: jsonb("input_parameters"),
  // Job-specific parameters
  validationRules: jsonb("validation_rules"),
  // Data validation configuration
  normalizationRules: jsonb("normalization_rules"),
  // Data normalization configuration
  deduplicationStrategy: text("deduplication_strategy").default("strict"),
  // 'strict', 'fuzzy', 'merge', 'skip'
  // Processing settings
  batchSize: integer("batch_size").default(1e3),
  // Records processed per batch
  maxRetries: integer("max_retries").default(3),
  timeoutMinutes: integer("timeout_minutes").default(60),
  priorityLevel: integer("priority_level").default(5),
  // 1-10 processing priority
  // Resource allocation
  maxConcurrency: integer("max_concurrency").default(1),
  // Max parallel workers
  memoryLimit: integer("memory_limit_mb").default(1024),
  // Memory limit in MB
  cpuLimit: decimal("cpu_limit", { precision: 3, scale: 2 }).default("1.00"),
  // CPU cores allocated
  // Status tracking
  status: text("status").default("queued"),
  // 'queued', 'running', 'paused', 'completed', 'failed', 'cancelled'
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0.00"),
  // 0-100%
  currentStage: text("current_stage"),
  // 'validation', 'processing', 'normalization', 'storage'
  stageProgress: decimal("stage_progress", { precision: 5, scale: 2 }).default("0.00"),
  // Progress within current stage
  // Metrics
  totalRecords: integer("total_records").default(0),
  processedRecords: integer("processed_records").default(0),
  successfulRecords: integer("successful_records").default(0),
  failedRecords: integer("failed_records").default(0),
  skippedRecords: integer("skipped_records").default(0),
  duplicateRecords: integer("duplicate_records").default(0),
  // Performance metrics
  recordsPerSecond: decimal("records_per_second", { precision: 8, scale: 2 }),
  averageProcessingTime: decimal("average_processing_time", { precision: 8, scale: 4 }),
  // Seconds per record
  peakMemoryUsage: integer("peak_memory_usage_mb"),
  totalCpuTime: decimal("total_cpu_time", { precision: 10, scale: 3 }),
  // CPU seconds used
  // Error tracking
  errorCount: integer("error_count").default(0),
  warningCount: integer("warning_count").default(0),
  lastErrorMessage: text("last_error_message"),
  errorCategories: jsonb("error_categories"),
  // Categorized error counts
  errorSampleSize: integer("error_sample_size").default(10),
  // How many error examples to keep
  // Quality metrics
  dataQualityScore: decimal("data_quality_score", { precision: 3, scale: 2 }),
  // 0-1 overall quality
  deduplicationEfficiency: decimal("deduplication_efficiency", { precision: 3, scale: 2 }),
  // 0-1 dedup success
  normalizationAccuracy: decimal("normalization_accuracy", { precision: 3, scale: 2 }),
  // 0-1 normalization success
  validationPassRate: decimal("validation_pass_rate", { precision: 3, scale: 2 }),
  // 0-1 validation success
  // User and system info
  createdBy: varchar("created_by").references(() => users.id),
  assignedWorker: text("assigned_worker"),
  // Worker node or process handling the job
  environmentInfo: jsonb("environment_info"),
  // System info where job runs
  // Dependencies
  dependsOnJobs: text("depends_on_jobs").array(),
  // Job IDs this job depends on
  prerequisiteConditions: jsonb("prerequisite_conditions"),
  // Conditions that must be met
  // Output specifications
  outputFormat: text("output_format").default("database"),
  // 'database', 'csv', 'json', 'api'
  outputLocation: text("output_location"),
  // Where results are stored
  retentionPolicy: text("retention_policy").default("standard"),
  // 'temporary', 'standard', 'long_term', 'permanent'
  // Notifications
  notificationSettings: jsonb("notification_settings"),
  // When and how to notify
  notificationsSent: text("notifications_sent").array(),
  // Track sent notifications
  // Metadata
  description: text("description"),
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
  // Additional job-specific data
  configurationSnapshot: jsonb("configuration_snapshot"),
  // System config at time of job creation
  // Timestamps
  queuedAt: timestamp("queued_at").defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastHeartbeat: timestamp("last_heartbeat"),
  // Last activity from processing worker
  estimatedCompletionTime: timestamp("estimated_completion_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_ingestion_jobs_status").on(table.status),
  index("idx_ingestion_jobs_type").on(table.jobType),
  index("idx_ingestion_jobs_dataset_type").on(table.datasetType),
  index("idx_ingestion_jobs_batch_id").on(table.batchId),
  index("idx_ingestion_jobs_priority").on(table.priorityLevel),
  index("idx_ingestion_jobs_created_by").on(table.createdBy),
  index("idx_ingestion_jobs_queued_at").on(table.queuedAt),
  index("idx_ingestion_jobs_started_at").on(table.startedAt),
  index("idx_ingestion_jobs_progress").on(table.progress),
  index("idx_ingestion_jobs_last_heartbeat").on(table.lastHeartbeat)
]);
var ingestionRuns = pgTable("ingestion_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Job association
  jobId: varchar("job_id").notNull().references(() => ingestionJobs.id),
  runNumber: integer("run_number").notNull(),
  // Sequential run number for this job
  // Run identification
  runType: text("run_type").default("standard"),
  // 'standard', 'retry', 'partial', 'recovery', 'test'
  triggeredBy: text("triggered_by").default("system"),
  // 'system', 'user', 'scheduler', 'api', 'webhook'
  triggerUserId: varchar("trigger_user_id").references(() => users.id),
  parentRunId: varchar("parent_run_id").references(() => ingestionRuns.id),
  // For retry runs
  // Execution environment
  workerId: text("worker_id"),
  // Unique identifier of processing worker
  workerHost: text("worker_host"),
  // Hostname of processing machine
  workerVersion: text("worker_version"),
  // Version of processing software
  processId: integer("process_id"),
  // OS process ID
  threadId: text("thread_id"),
  // Thread identifier if multithreaded
  // Resource usage
  allocatedMemoryMb: integer("allocated_memory_mb"),
  peakMemoryUsageMb: integer("peak_memory_usage_mb"),
  averageMemoryUsageMb: integer("average_memory_usage_mb"),
  allocatedCpuCores: decimal("allocated_cpu_cores", { precision: 3, scale: 2 }),
  totalCpuTime: decimal("total_cpu_time", { precision: 10, scale: 3 }),
  // CPU seconds
  wallClockTime: decimal("wall_clock_time", { precision: 10, scale: 3 }),
  // Elapsed seconds
  diskSpaceUsedMb: integer("disk_space_used_mb"),
  networkBytesTransferred: bigint("network_bytes_transferred", { mode: "bigint" }),
  // Processing scope
  recordsInScope: integer("records_in_scope"),
  // Total records this run should process
  startingOffset: integer("starting_offset").default(0),
  // Starting position in dataset
  endingOffset: integer("ending_offset"),
  // Ending position in dataset
  batchSize: integer("batch_size"),
  // Records per batch
  batchesProcessed: integer("batches_processed").default(0),
  // Processing results
  recordsProcessed: integer("records_processed").default(0),
  recordsSuccessful: integer("records_successful").default(0),
  recordsFailed: integer("records_failed").default(0),
  recordsSkipped: integer("records_skipped").default(0),
  recordsDuplicate: integer("records_duplicate").default(0),
  entitiesCreated: integer("entities_created").default(0),
  entitiesUpdated: integer("entities_updated").default(0),
  entitiesMerged: integer("entities_merged").default(0),
  aliasesCreated: integer("aliases_created").default(0),
  traitsCreated: integer("traits_created").default(0),
  interactionsCreated: integer("interactions_created").default(0),
  // Performance metrics
  recordsPerSecond: decimal("records_per_second", { precision: 8, scale: 2 }),
  averageRecordProcessingTime: decimal("average_record_processing_time", { precision: 8, scale: 4 }),
  // Seconds
  minRecordProcessingTime: decimal("min_record_processing_time", { precision: 8, scale: 4 }),
  maxRecordProcessingTime: decimal("max_record_processing_time", { precision: 8, scale: 4 }),
  throughputMbPerSecond: decimal("throughput_mb_per_second", { precision: 8, scale: 2 }),
  // Error and warning summary
  errorCount: integer("error_count").default(0),
  warningCount: integer("warning_count").default(0),
  criticalErrorCount: integer("critical_error_count").default(0),
  errorRate: decimal("error_rate", { precision: 8, scale: 4 }),
  // Errors per record
  primaryErrorType: text("primary_error_type"),
  // Most common error type
  primaryErrorMessage: text("primary_error_message"),
  // Most common error message
  // Status and completion
  status: text("status").default("running"),
  // 'running', 'completed', 'failed', 'interrupted', 'killed'
  exitCode: integer("exit_code"),
  // Process exit code
  exitReason: text("exit_reason"),
  // Human readable exit reason
  wasInterrupted: boolean("was_interrupted").default(false),
  wasRetried: boolean("was_retried").default(false),
  retryCount: integer("retry_count").default(0),
  // Quality assessment
  dataQualityScore: decimal("data_quality_score", { precision: 3, scale: 2 }),
  // 0-1 overall quality
  successRate: decimal("success_rate", { precision: 8, scale: 4 }),
  // Successful records / total records
  deduplicationAccuracy: decimal("deduplication_accuracy", { precision: 3, scale: 2 }),
  normalizationAccuracy: decimal("normalization_accuracy", { precision: 3, scale: 2 }),
  // Configuration snapshot
  configurationUsed: jsonb("configuration_used"),
  // Configuration at time of run
  parametersUsed: jsonb("parameters_used"),
  // Parameters passed to this run
  environmentVariables: jsonb("environment_variables"),
  // Relevant env vars
  // Checkpointing and recovery
  lastCheckpoint: jsonb("last_checkpoint"),
  // State for recovery
  checkpointInterval: integer("checkpoint_interval_records").default(1e3),
  checkpointsCreated: integer("checkpoints_created").default(0),
  recoveredFromCheckpoint: boolean("recovered_from_checkpoint").default(false),
  recoveryCheckpointId: text("recovery_checkpoint_id"),
  // Output and artifacts
  outputSummary: jsonb("output_summary"),
  // Summary of what was produced
  logFileLocation: text("log_file_location"),
  // Where detailed logs are stored
  artifactLocations: text("artifact_locations").array(),
  // Generated files, reports, etc.
  // Notifications and reporting
  notificationsSent: text("notifications_sent").array(),
  reportsGenerated: text("reports_generated").array(),
  // Timestamps
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastHeartbeat: timestamp("last_heartbeat"),
  lastCheckpointAt: timestamp("last_checkpoint_at"),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_ingestion_runs_job_id").on(table.jobId),
  index("idx_ingestion_runs_run_number").on(table.runNumber),
  index("idx_ingestion_runs_status").on(table.status),
  index("idx_ingestion_runs_started_at").on(table.startedAt),
  index("idx_ingestion_runs_worker_id").on(table.workerId),
  index("idx_ingestion_runs_success_rate").on(table.successRate),
  index("idx_ingestion_runs_records_per_second").on(table.recordsPerSecond),
  index("idx_ingestion_runs_error_count").on(table.errorCount),
  index("idx_ingestion_runs_parent_run").on(table.parentRunId),
  // Unique constraint to prevent duplicate run numbers for same job
  index("idx_ingestion_runs_unique").on(table.jobId, table.runNumber)
]);
var ingestionErrors = pgTable("ingestion_errors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Association with jobs and runs
  jobId: varchar("job_id").notNull().references(() => ingestionJobs.id),
  runId: varchar("run_id").references(() => ingestionRuns.id),
  stagingRecordId: varchar("staging_record_id").references(() => stagingRecords.id),
  // Error identification
  errorCode: text("error_code"),
  // Standardized error code
  errorType: text("error_type").notNull(),
  // 'validation', 'processing', 'database', 'network', 'format', 'business_logic'
  errorCategory: text("error_category").notNull(),
  // 'critical', 'major', 'minor', 'warning', 'info'
  errorSeverity: integer("error_severity").notNull(),
  // 1-10 severity scale
  // Error details
  errorMessage: text("error_message").notNull(),
  detailedDescription: text("detailed_description"),
  technicalDetails: jsonb("technical_details"),
  // Stack traces, debug info
  errorContext: jsonb("error_context"),
  // Context where error occurred
  // Record information
  recordData: jsonb("record_data"),
  // The problematic record data
  recordIdentifier: text("record_identifier"),
  // Unique identifier for the record
  recordLineNumber: integer("record_line_number"),
  // Line in source file
  recordHash: text("record_hash"),
  // Hash of record for deduplication
  fieldName: text("field_name"),
  // Specific field that caused error
  fieldValue: text("field_value"),
  // Value that caused error
  expectedFormat: text("expected_format"),
  // What format was expected
  actualFormat: text("actual_format"),
  // What format was received
  // Processing stage information
  processingStage: text("processing_stage"),
  // 'parsing', 'validation', 'normalization', 'entity_creation', 'relationship_mapping'
  processingStep: text("processing_step"),
  // Specific step within stage
  validationRule: text("validation_rule"),
  // Which validation rule failed
  transformationRule: text("transformation_rule"),
  // Which transformation failed
  // Error resolution
  isResolvable: boolean("is_resolvable").default(true),
  // Whether this error can be fixed
  resolutionStrategy: text("resolution_strategy"),
  // 'retry', 'skip', 'manual_fix', 'rule_update', 'data_correction'
  suggestedFix: text("suggested_fix"),
  // Suggested resolution
  automatedFixAttempted: boolean("automated_fix_attempted").default(false),
  automatedFixSucceeded: boolean("automated_fix_succeeded").default(false),
  manualReviewRequired: boolean("manual_review_required").default(false),
  // Retry logic
  retryable: boolean("retryable").default(true),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  nextRetryAt: timestamp("next_retry_at"),
  retryBackoffMultiplier: decimal("retry_backoff_multiplier", { precision: 3, scale: 2 }).default("2.00"),
  lastRetryAt: timestamp("last_retry_at"),
  retryHistory: jsonb("retry_history"),
  // History of retry attempts
  // Resolution tracking
  status: text("status").default("unresolved"),
  // 'unresolved', 'investigating', 'fixing', 'resolved', 'ignored', 'escalated'
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolutionMethod: text("resolution_method"),
  // How the error was resolved
  resolutionNotes: text("resolution_notes"),
  resolutionChanges: jsonb("resolution_changes"),
  // What changes were made to resolve
  // Impact assessment
  impactLevel: text("impact_level"),
  // 'none', 'low', 'medium', 'high', 'critical'
  affectedEntities: text("affected_entities").array(),
  // Entity IDs that might be affected
  downstreamImpact: text("downstream_impact"),
  // Description of downstream effects
  businessImpact: text("business_impact"),
  // Business consequences
  // Pattern recognition
  errorPattern: text("error_pattern"),
  // Pattern this error fits
  isKnownIssue: boolean("is_known_issue").default(false),
  knowledgeBaseArticle: text("knowledge_base_article"),
  // Link to KB article
  relatedErrors: text("related_errors").array(),
  // IDs of related error records
  // Notification and escalation
  notificationsSent: text("notifications_sent").array(),
  escalationLevel: integer("escalation_level").default(0),
  // 0=none, 1=team_lead, 2=manager, 3=director
  escalatedAt: timestamp("escalated_at"),
  escalatedTo: varchar("escalated_to").references(() => users.id),
  alertsTriggered: text("alerts_triggered").array(),
  // Analytics and reporting
  errorFrequency: decimal("error_frequency", { precision: 8, scale: 4 }),
  // How often this error occurs
  firstOccurrence: timestamp("first_occurrence"),
  lastOccurrence: timestamp("last_occurrence"),
  occurrenceCount: integer("occurrence_count").default(1),
  trendDirection: text("trend_direction"),
  // 'increasing', 'decreasing', 'stable'
  // Metadata
  tags: text("tags").array(),
  customProperties: jsonb("custom_properties"),
  // Extensible properties
  attachments: text("attachments").array(),
  // File attachments with error details
  // System information
  systemInfo: jsonb("system_info"),
  // System state when error occurred
  environmentInfo: jsonb("environment_info"),
  // Environment details
  configurationInfo: jsonb("configuration_info"),
  // Configuration at time of error
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at")
}, (table) => [
  index("idx_ingestion_errors_job_id").on(table.jobId),
  index("idx_ingestion_errors_run_id").on(table.runId),
  index("idx_ingestion_errors_staging_record").on(table.stagingRecordId),
  index("idx_ingestion_errors_type").on(table.errorType),
  index("idx_ingestion_errors_category").on(table.errorCategory),
  index("idx_ingestion_errors_severity").on(table.errorSeverity),
  index("idx_ingestion_errors_status").on(table.status),
  index("idx_ingestion_errors_retryable").on(table.retryable),
  index("idx_ingestion_errors_next_retry").on(table.nextRetryAt),
  index("idx_ingestion_errors_resolved_at").on(table.resolvedAt),
  index("idx_ingestion_errors_escalation_level").on(table.escalationLevel),
  index("idx_ingestion_errors_impact_level").on(table.impactLevel),
  index("idx_ingestion_errors_occurrence_count").on(table.occurrenceCount),
  index("idx_ingestion_errors_record_hash").on(table.recordHash)
]);
var narrativeTimelines = pgTable("narrative_timelines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Timeline identification
  timelineName: text("timeline_name").notNull(),
  timelineType: text("timeline_type").notNull(),
  // 'character_arc', 'team_story', 'event_series', 'crossover', 'universe_history'
  scope: text("scope").notNull(),
  // 'character', 'team', 'universe', 'multiverse', 'crossover'
  universe: text("universe").notNull(),
  // 'marvel', 'dc', 'image', 'crossover'
  continuity: text("continuity"),
  // 'main', 'ultimate', 'earth_2', 'elseworld'
  // Timeline structure
  startDate: text("start_date"),
  // In-universe start date
  endDate: text("end_date"),
  // In-universe end date (null for ongoing)
  timelineStatus: text("timeline_status").default("active"),
  // 'active', 'completed', 'retconned', 'alternate'
  timelineEra: text("timeline_era"),
  // 'golden_age', 'silver_age', 'bronze_age', 'modern_age'
  chronologicalOrder: integer("chronological_order"),
  // Order relative to other timelines
  // Core participants
  primaryEntities: text("primary_entities").array(),
  // Main narrative entity IDs
  secondaryEntities: text("secondary_entities").array(),
  // Supporting entity IDs
  featuredTeams: text("featured_teams").array(),
  // Teams involved
  majorVillains: text("major_villains").array(),
  // Primary antagonists
  keyCreators: text("key_creators").array(),
  // Writers and artists who shaped this timeline
  // Trading house associations
  associatedHouses: text("associated_houses").array(),
  // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  primaryHouse: text("primary_house"),
  // Main house this timeline appeals to
  houseRelevanceScore: decimal("house_relevance_score", { precision: 3, scale: 2 }),
  // 0-1 relevance to houses
  tradingEducationValue: decimal("trading_education_value", { precision: 3, scale: 2 }),
  // 0-1 educational value for traders
  // Market impact potential
  marketInfluence: decimal("market_influence", { precision: 3, scale: 2 }),
  // 0-1 potential to affect asset prices
  volatilityPotential: decimal("volatility_potential", { precision: 3, scale: 2 }),
  // 0-1 potential to create price volatility
  speculativeValue: decimal("speculative_value", { precision: 3, scale: 2 }),
  // 0-1 value for speculation
  longTermImpact: decimal("long_term_impact", { precision: 3, scale: 2 }),
  // 0-1 lasting effect on character values
  // Narrative structure
  totalStoryBeats: integer("total_story_beats").default(0),
  completedStoryBeats: integer("completed_story_beats").default(0),
  criticalStoryBeats: integer("critical_story_beats").default(0),
  // How many beats are market-critical
  plotComplexity: decimal("plot_complexity", { precision: 3, scale: 2 }),
  // 0-1 complexity score
  characterDevelopmentDepth: decimal("character_development_depth", { precision: 3, scale: 2 }),
  // 0-1 development depth
  // Themes and motifs
  primaryThemes: text("primary_themes").array(),
  // 'redemption', 'power_corruption', 'sacrifice', 'identity'
  moralAlignment: text("moral_alignment"),
  // 'heroic', 'dark', 'gray', 'villainous', 'neutral'
  emotionalTone: text("emotional_tone"),
  // 'hopeful', 'tragic', 'action', 'mystery', 'horror', 'comedy'
  narrativeGenre: text("narrative_genre").array(),
  // 'superhero', 'sci_fi', 'fantasy', 'mystery', 'horror'
  // Cultural and social context
  culturalSignificance: decimal("cultural_significance", { precision: 3, scale: 2 }),
  // 0-1 cultural importance
  socialCommentary: text("social_commentary").array(),
  // Social issues addressed
  historicalContext: text("historical_context"),
  // Real-world events that influenced this timeline
  // Publication information
  firstPublicationDate: text("first_publication_date"),
  lastPublicationDate: text("last_publication_date"),
  publicationStatus: text("publication_status").default("ongoing"),
  // 'ongoing', 'completed', 'cancelled', 'hiatus'
  publishedIssueCount: integer("published_issue_count").default(0),
  plannedIssueCount: integer("planned_issue_count"),
  // Media adaptations
  adaptedToMedia: text("adapted_to_media").array(),
  // 'movies', 'tv', 'games', 'novels'
  adaptationQuality: decimal("adaptation_quality", { precision: 3, scale: 2 }),
  // 0-1 quality of adaptations
  adaptationFidelity: decimal("adaptation_fidelity", { precision: 3, scale: 2 }),
  // 0-1 faithfulness to source
  crossMediaImpact: decimal("cross_media_impact", { precision: 3, scale: 2 }),
  // 0-1 impact on other media
  // Fan engagement and community
  fanEngagementLevel: decimal("fan_engagement_level", { precision: 3, scale: 2 }),
  // 0-1 fan community engagement
  controversyLevel: decimal("controversy_level", { precision: 3, scale: 2 }),
  // 0-1 how controversial the timeline is
  criticalReception: decimal("critical_reception", { precision: 3, scale: 2 }),
  // 0-1 critical acclaim
  commercialSuccess: decimal("commercial_success", { precision: 3, scale: 2 }),
  // 0-1 commercial performance
  // Educational and analytical value
  characterStudyValue: decimal("character_study_value", { precision: 3, scale: 2 }),
  // 0-1 value for character analysis
  plotAnalysisValue: decimal("plot_analysis_value", { precision: 3, scale: 2 }),
  // 0-1 value for plot analysis
  thematicDepth: decimal("thematic_depth", { precision: 3, scale: 2 }),
  // 0-1 thematic complexity
  marketLessonValue: decimal("market_lesson_value", { precision: 3, scale: 2 }),
  // 0-1 value for trading education
  // Metadata and relationships
  parentTimelines: text("parent_timelines").array(),
  // Timeline IDs this derives from
  childTimelines: text("child_timelines").array(),
  // Timeline IDs that derive from this
  crossoverTimelines: text("crossover_timelines").array(),
  // Timelines this crosses over with
  relatedAssets: text("related_assets").array(),
  // Asset IDs affected by this timeline
  // Content description
  synopsis: text("synopsis"),
  // Brief summary
  detailedDescription: text("detailed_description"),
  // Comprehensive description
  keyPlotPoints: text("key_plot_points").array(),
  // Major plot developments
  characterArcs: jsonb("character_arcs"),
  // Character development summaries
  thematicAnalysis: text("thematic_analysis"),
  // Analysis of themes and meanings
  // Visual and multimedia
  keyImageUrls: text("key_image_urls").array(),
  // Important visual moments
  iconicPanels: text("iconic_panels").array(),
  // URLs to iconic comic panels
  coverGallery: text("cover_gallery").array(),
  // Cover images from this timeline
  videoContent: text("video_content").array(),
  // Related video content
  // Data quality and curation
  curationStatus: text("curation_status").default("draft"),
  // 'draft', 'review', 'approved', 'featured'
  curatedBy: varchar("curated_by").references(() => users.id),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }),
  // 0-1 overall quality assessment
  completenessScore: decimal("completeness_score", { precision: 3, scale: 2 }),
  // 0-1 data completeness
  accuracyScore: decimal("accuracy_score", { precision: 3, scale: 2 }),
  // 0-1 factual accuracy
  // Vector embeddings for timeline similarity and recommendations
  timelineEmbedding: vector("timeline_embedding", { dimensions: 1536 }),
  themeEmbedding: vector("theme_embedding", { dimensions: 1536 }),
  // Thematic content vector
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  curatedAt: timestamp("curated_at"),
  lastReviewedAt: timestamp("last_reviewed_at")
}, (table) => [
  index("idx_narrative_timelines_type").on(table.timelineType),
  index("idx_narrative_timelines_universe").on(table.universe),
  index("idx_narrative_timelines_status").on(table.timelineStatus),
  index("idx_narrative_timelines_primary_house").on(table.primaryHouse),
  index("idx_narrative_timelines_market_influence").on(table.marketInfluence),
  index("idx_narrative_timelines_cultural_significance").on(table.culturalSignificance),
  index("idx_narrative_timelines_curation_status").on(table.curationStatus),
  index("idx_narrative_timelines_quality_score").on(table.qualityScore),
  index("idx_narrative_timelines_chronological_order").on(table.chronologicalOrder)
]);
var storyBeats = pgTable("story_beats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Timeline association
  timelineId: varchar("timeline_id").notNull().references(() => narrativeTimelines.id),
  // Beat identification
  beatTitle: text("beat_title").notNull(),
  beatType: text("beat_type").notNull(),
  // 'introduction', 'inciting_incident', 'rising_action', 'climax', 'falling_action', 'resolution', 'plot_twist', 'character_death', 'power_revelation'
  beatCategory: text("beat_category").notNull(),
  // 'character_moment', 'action_sequence', 'emotional_moment', 'revelation', 'confrontation', 'transformation', 'sacrifice'
  narrativeFunction: text("narrative_function"),
  // 'exposition', 'conflict', 'development', 'payoff', 'setup', 'callback'
  // Position and timing
  chronologicalOrder: integer("chronological_order").notNull(),
  // Order within timeline
  relativePosition: decimal("relative_position", { precision: 5, scale: 4 }),
  // 0-1 position in timeline (0=start, 1=end)
  storyAct: integer("story_act"),
  // 1, 2, 3, etc. (traditional story structure)
  // Publication details
  sourceIssue: text("source_issue"),
  // Comic issue where this beat occurs
  sourceMedia: text("source_media"),
  // Movie, TV episode, etc.
  pageNumber: integer("page_number"),
  // Page within issue
  panelNumber: integer("panel_number"),
  // Panel within page
  publicationDate: text("publication_date"),
  writerCredits: text("writer_credits").array(),
  artistCredits: text("artist_credits").array(),
  // Participants and entities
  primaryEntities: text("primary_entities").array(),
  // Main entities involved in this beat
  secondaryEntities: text("secondary_entities").array(),
  // Supporting entities
  entityRoles: jsonb("entity_roles"),
  // Specific roles each entity plays in this beat
  relationships: jsonb("relationships"),
  // Relationships formed, broken, or changed
  // Market impact assessment
  marketRelevance: decimal("market_relevance", { precision: 3, scale: 2 }),
  // 0-1 relevance to trading
  priceImpactPotential: decimal("price_impact_potential", { precision: 3, scale: 2 }),
  // 0-1 potential to affect prices
  volatilityTrigger: boolean("volatility_trigger").default(false),
  // Whether this creates market volatility
  speculationOpportunity: decimal("speculation_opportunity", { precision: 3, scale: 2 }),
  // 0-1 speculation potential
  longTermValueImpact: decimal("long_term_value_impact", { precision: 3, scale: 2 }),
  // 0-1 lasting effect on values
  affectedAssets: text("affected_assets").array(),
  // Asset IDs likely to be impacted
  expectedPriceDirection: text("expected_price_direction"),
  // 'positive', 'negative', 'volatile', 'neutral'
  impactMagnitude: decimal("impact_magnitude", { precision: 3, scale: 2 }),
  // 0-1 expected magnitude of impact
  // Trading house relevance
  houseResonance: jsonb("house_resonance"),
  // How much each house cares about this beat
  primaryHouse: text("primary_house"),
  // House most interested in this beat
  educationalValue: decimal("educational_value", { precision: 3, scale: 2 }),
  // 0-1 teaching value for traders
  strategicInsight: text("strategic_insight"),
  // Trading insight this beat provides
  // Emotional and thematic content
  emotionalTone: text("emotional_tone"),
  // 'triumph', 'tragedy', 'suspense', 'horror', 'comedy', 'wonder'
  emotionalIntensity: decimal("emotional_intensity", { precision: 3, scale: 2 }),
  // 0-1 emotional impact
  thematicSignificance: text("thematic_significance").array(),
  // Themes this beat reinforces
  symbolism: text("symbolism").array(),
  // Symbolic elements present
  archetypes: text("archetypes").array(),
  // Character archetypes involved
  // Character development impact
  characterGrowth: jsonb("character_growth"),
  // How characters change in this beat
  powerChanges: jsonb("power_changes"),
  // Power gains, losses, or revelations
  relationshipChanges: jsonb("relationship_changes"),
  // Relationship developments
  statusChanges: jsonb("status_changes"),
  // Status quo changes
  // Plot significance
  plotSignificance: decimal("plot_significance", { precision: 3, scale: 2 }),
  // 0-1 importance to overall plot
  isClimax: boolean("is_climax").default(false),
  // Whether this is a climactic moment
  isTurningPoint: boolean("is_turning_point").default(false),
  // Whether this changes everything
  setsUpFuture: boolean("sets_up_future").default(false),
  // Whether this sets up future beats
  paysOffSetup: boolean("pays_off_setup").default(false),
  // Whether this pays off previous setup
  callbacks: text("callbacks").array(),
  // Previous beat IDs this references
  setupForBeats: text("setup_for_beats").array(),
  // Future beat IDs this sets up
  // Cultural and fan impact
  iconicStatus: boolean("iconic_status").default(false),
  // Whether this is considered iconic
  memesGenerated: boolean("memes_generated").default(false),
  // Whether this spawned memes
  fanReaction: text("fan_reaction"),
  // 'loved', 'hated', 'controversial', 'mixed', 'ignored'
  criticalReception: text("critical_reception"),
  // Critical response to this beat
  culturalReference: boolean("cultural_reference").default(false),
  // Whether this became a cultural reference
  // Content description
  summary: text("summary").notNull(),
  // Brief description of what happens
  detailedDescription: text("detailed_description"),
  // Comprehensive description
  dialogue: text("dialogue").array(),
  // Key dialogue from this beat
  visualDescription: text("visual_description"),
  // Description of visual elements
  actionSequence: text("action_sequence"),
  // Description of action if applicable
  // Stakes and consequences
  stakesLevel: text("stakes_level"),
  // 'personal', 'local', 'global', 'universal', 'multiversal'
  consequences: text("consequences").array(),
  // Immediate consequences of this beat
  permanentChanges: text("permanent_changes").array(),
  // Permanent changes made
  reversibleChanges: text("reversible_changes").array(),
  // Changes that could be undone
  // Visual and multimedia references
  imageUrls: text("image_urls").array(),
  // Images of this story beat
  panelImages: text("panel_images").array(),
  // Specific comic panels
  videoClips: text("video_clips").array(),
  // Video adaptations of this beat
  audioReferences: text("audio_references").array(),
  // Audio drama or podcast references
  // Quality and curation
  beatQuality: decimal("beat_quality", { precision: 3, scale: 2 }),
  // 0-1 quality assessment
  narrativeImportance: decimal("narrative_importance", { precision: 3, scale: 2 }),
  // 0-1 importance to story
  executionQuality: decimal("execution_quality", { precision: 3, scale: 2 }),
  // 0-1 how well it was executed
  originalityScore: decimal("originality_score", { precision: 3, scale: 2 }),
  // 0-1 how original this beat is
  // Metadata
  tags: text("tags").array(),
  // Searchable tags
  keywords: text("keywords").array(),
  // Keywords for discovery
  spoilerLevel: text("spoiler_level").default("minor"),
  // 'none', 'minor', 'major', 'critical'
  contentWarnings: text("content_warnings").array(),
  // Content warnings if applicable
  // Vector embeddings for beat similarity and clustering
  beatEmbedding: vector("beat_embedding", { dimensions: 1536 }),
  dialogueEmbedding: vector("dialogue_embedding", { dimensions: 1536 }),
  // Vector for dialogue content
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  curatedAt: timestamp("curated_at")
}, (table) => [
  index("idx_story_beats_timeline_id").on(table.timelineId),
  index("idx_story_beats_chronological_order").on(table.chronologicalOrder),
  index("idx_story_beats_type").on(table.beatType),
  index("idx_story_beats_category").on(table.beatCategory),
  index("idx_story_beats_market_relevance").on(table.marketRelevance),
  index("idx_story_beats_price_impact").on(table.priceImpactPotential),
  index("idx_story_beats_volatility_trigger").on(table.volatilityTrigger),
  index("idx_story_beats_primary_house").on(table.primaryHouse),
  index("idx_story_beats_plot_significance").on(table.plotSignificance),
  index("idx_story_beats_iconic_status").on(table.iconicStatus),
  index("idx_story_beats_relative_position").on(table.relativePosition),
  // Unique constraint to prevent duplicate beats at same position in timeline
  index("idx_story_beats_unique_position").on(table.timelineId, table.chronologicalOrder)
]);
var insertRawDatasetFileSchema = createInsertSchema(rawDatasetFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  uploadedAt: true,
  processingStartedAt: true,
  processingCompletedAt: true
});
var insertStagingRecordSchema = createInsertSchema(stagingRecords).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  normalizedAt: true
});
var insertNarrativeEntitySchema = createInsertSchema(narrativeEntities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true
});
var insertNarrativeTraitSchema = createInsertSchema(narrativeTraits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true
});
var insertEntityAliasSchema = createInsertSchema(entityAliases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true
});
var insertEntityInteractionSchema = createInsertSchema(entityInteractions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true
});
var insertMediaPerformanceMetricSchema = createInsertSchema(mediaPerformanceMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerifiedAt: true,
  lastDataUpdate: true
});
var insertIngestionJobSchema = createInsertSchema(ingestionJobs).omit({
  id: true,
  queuedAt: true,
  startedAt: true,
  completedAt: true,
  lastHeartbeat: true,
  estimatedCompletionTime: true,
  createdAt: true,
  updatedAt: true
});
var insertIngestionRunSchema = createInsertSchema(ingestionRuns).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  lastHeartbeat: true,
  lastCheckpointAt: true,
  createdAt: true
});
var insertIngestionErrorSchema = createInsertSchema(ingestionErrors).omit({
  id: true,
  nextRetryAt: true,
  lastRetryAt: true,
  resolvedAt: true,
  escalatedAt: true,
  firstOccurrence: true,
  lastOccurrence: true,
  createdAt: true,
  updatedAt: true,
  acknowledgedAt: true
});
var insertNarrativeTimelineSchema = createInsertSchema(narrativeTimelines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  curatedAt: true,
  lastReviewedAt: true
});
var insertStoryBeatSchema = createInsertSchema(storyBeats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  curatedAt: true
});
var narrativeTradingMetrics = pgTable("narrative_trading_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Mythic Volatility Metrics
  mythicVolatilityScore: decimal("mythic_volatility_score", { precision: 8, scale: 4 }).notNull(),
  // 0.0001 to 10.0000
  baseVolatility: decimal("base_volatility", { precision: 8, scale: 4 }).default("0.0250"),
  // Base daily volatility
  storyArcVolatilityMultiplier: decimal("story_arc_volatility_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  powerLevelVolatilityFactor: decimal("power_level_volatility_factor", { precision: 8, scale: 4 }).default("1.0000"),
  cosmicEventVolatilityBoost: decimal("cosmic_event_volatility_boost", { precision: 8, scale: 4 }).default("0.0000"),
  // Narrative Momentum Tracking
  narrativeMomentumScore: decimal("narrative_momentum_score", { precision: 8, scale: 4 }).notNull(),
  // -5.0000 to 5.0000
  culturalImpactIndex: decimal("cultural_impact_index", { precision: 8, scale: 4 }).default("1.0000"),
  storyProgressionRate: decimal("story_progression_rate", { precision: 8, scale: 4 }).default("0.0000"),
  themeRelevanceScore: decimal("theme_relevance_score", { precision: 8, scale: 4 }).default("1.0000"),
  mediaBoostFactor: decimal("media_boost_factor", { precision: 8, scale: 4 }).default("1.0000"),
  momentumDecayRate: decimal("momentum_decay_rate", { precision: 8, scale: 4 }).default("0.0500"),
  // House-Based Financial Modifiers
  houseAffiliation: text("house_affiliation"),
  // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  houseVolatilityProfile: text("house_volatility_profile"),
  // 'stable', 'moderate', 'high', 'extreme', 'chaotic'
  houseTradingMultiplier: decimal("house_trading_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  houseSpecialtyBonus: decimal("house_specialty_bonus", { precision: 8, scale: 4 }).default("0.0000"),
  // Narrative Correlation Factors
  narrativeCorrelationStrength: decimal("narrative_correlation_strength", { precision: 8, scale: 4 }).default("1.0000"),
  storyBeatSensitivity: decimal("story_beat_sensitivity", { precision: 8, scale: 4 }).default("1.0000"),
  characterDeathImpact: decimal("character_death_impact", { precision: 8, scale: 4 }).default("0.0000"),
  powerUpgradeImpact: decimal("power_upgrade_impact", { precision: 8, scale: 4 }).default("0.0000"),
  resurrectionImpact: decimal("resurrection_impact", { precision: 8, scale: 4 }).default("0.0000"),
  // Enhanced Margin and Risk Calculations
  narrativeMarginRequirement: decimal("narrative_margin_requirement", { precision: 8, scale: 2 }).default("50.00"),
  storyRiskAdjustment: decimal("story_risk_adjustment", { precision: 8, scale: 4 }).default("0.0000"),
  volatilityRiskPremium: decimal("volatility_risk_premium", { precision: 8, scale: 4 }).default("0.0000"),
  // Temporal Factors
  lastNarrativeEvent: timestamp("last_narrative_event"),
  nextPredictedEvent: timestamp("next_predicted_event"),
  storyArcPhase: text("story_arc_phase"),
  // 'origin', 'rising_action', 'climax', 'falling_action', 'resolution'
  seasonalNarrativePattern: text("seasonal_narrative_pattern"),
  // JSON array of seasonal multipliers
  // Performance Tracking
  metricsReliabilityScore: decimal("metrics_reliability_score", { precision: 8, scale: 4 }).default("0.5000"),
  predictionAccuracy: decimal("prediction_accuracy", { precision: 8, scale: 4 }).default("0.0000"),
  lastRecalculation: timestamp("last_recalculation").defaultNow(),
  calculationVersion: integer("calculation_version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var houseFinancialProfiles = pgTable("house_financial_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: text("house_id").notNull().unique(),
  // 'heroes', 'wisdom', 'power', 'mystery', 'elements', 'time', 'spirit'
  houseName: text("house_name").notNull(),
  // Trading Characteristics
  volatilityProfile: text("volatility_profile").notNull(),
  // 'stable', 'moderate', 'high', 'extreme', 'chaotic'
  baseVolatilityMultiplier: decimal("base_volatility_multiplier", { precision: 8, scale: 4 }).notNull(),
  trendStrengthModifier: decimal("trend_strength_modifier", { precision: 8, scale: 4 }).default("1.0000"),
  meanReversionFactor: decimal("mean_reversion_factor", { precision: 8, scale: 4 }).default("0.1000"),
  // House-Specific Market Patterns
  marketPatternType: text("market_pattern_type").notNull(),
  // 'heroic_growth', 'wisdom_stability', 'power_volatility', etc.
  seasonalityPattern: jsonb("seasonality_pattern"),
  // Quarterly/seasonal trading patterns
  eventResponseProfile: jsonb("event_response_profile"),
  // How house responds to different story events
  // Specialized Trading Behaviors
  preferredInstruments: text("preferred_instruments").array(),
  // ['equity', 'options', 'bonds', etc.]
  riskToleranceLevel: text("risk_tolerance_level").notNull(),
  // 'conservative', 'moderate', 'aggressive', 'extreme'
  leveragePreference: decimal("leverage_preference", { precision: 8, scale: 4 }).default("1.0000"),
  // Narrative-Driven Factors
  storyBeatMultipliers: jsonb("story_beat_multipliers"),
  // Response to different story beat types
  characterPowerLevelWeights: jsonb("character_power_level_weights"),
  // How power levels affect trading
  cosmicEventSensitivity: decimal("cosmic_event_sensitivity", { precision: 8, scale: 4 }).default("1.0000"),
  // House Trading Bonuses and Penalties
  specialtyAssetTypes: text("specialty_asset_types").array(),
  // Asset types this house excels with
  weaknessAssetTypes: text("weakness_asset_types").array(),
  // Asset types this house struggles with
  tradingBonusPercentage: decimal("trading_bonus_percentage", { precision: 8, scale: 4 }).default("0.0000"),
  penaltyPercentage: decimal("penalty_percentage", { precision: 8, scale: 4 }).default("0.0000"),
  // Advanced House Mechanics
  alignmentRequirements: jsonb("alignment_requirements"),
  // Karmic alignment requirements
  synergisticHouses: text("synergistic_houses").array(),
  // Houses that work well together
  conflictingHouses: text("conflicting_houses").array(),
  // Houses that create market tension
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var storyEventTriggers = pgTable("story_event_triggers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Event Identification
  triggerName: text("trigger_name").notNull(),
  triggerType: text("trigger_type").notNull(),
  // 'story_beat', 'character_event', 'cosmic_event', 'media_release'
  eventSeverity: text("event_severity").notNull(),
  // 'minor', 'moderate', 'major', 'cosmic', 'universe_altering'
  // Source References
  storyBeatId: varchar("story_beat_id").references(() => storyBeats.id),
  characterId: varchar("character_id").references(() => enhancedCharacters.id),
  timelineId: varchar("timeline_id").references(() => narrativeTimelines.id),
  // Market Impact Configuration
  priceImpactRange: jsonb("price_impact_range"),
  // Min/max price impact percentages
  volatilityImpactMultiplier: decimal("volatility_impact_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  volumeImpactMultiplier: decimal("volume_impact_multiplier", { precision: 8, scale: 4 }).default("1.0000"),
  sentimentShift: decimal("sentiment_shift", { precision: 8, scale: 4 }).default("0.0000"),
  // -1.0000 to 1.0000
  // Affected Assets
  affectedAssetTypes: text("affected_asset_types").array(),
  // Types of assets affected
  directlyAffectedAssets: text("directly_affected_assets").array(),
  // Specific asset IDs
  indirectlyAffectedAssets: text("indirectly_affected_assets").array(),
  // Assets affected through connections
  // House-Specific Responses
  houseResponseMultipliers: jsonb("house_response_multipliers"),
  // How each house responds to this trigger
  crossHouseEffects: jsonb("cross_house_effects"),
  // Secondary effects across houses
  // Temporal Configuration
  immediateImpactDuration: integer("immediate_impact_duration").default(1440),
  // Minutes for immediate impact
  mediumTermEffectDuration: integer("medium_term_effect_duration").default(10080),
  // Minutes for medium-term
  longTermMemoryDecay: decimal("long_term_memory_decay", { precision: 8, scale: 4 }).default("0.0100"),
  // Trigger Conditions
  triggerConditions: jsonb("trigger_conditions"),
  // Complex conditions for activation
  cooldownPeriod: integer("cooldown_period").default(0),
  // Minutes before trigger can fire again
  maxActivationsPerDay: integer("max_activations_per_day").default(10),
  // Execution Tracking
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  totalActivations: integer("total_activations").default(0),
  successfulActivations: integer("successful_activations").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var narrativeMarketEvents = pgTable("narrative_market_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Event Source
  triggerEventId: varchar("trigger_event_id").references(() => storyEventTriggers.id),
  eventTitle: text("event_title").notNull(),
  eventDescription: text("event_description").notNull(),
  narrativeContext: text("narrative_context"),
  // Rich context about the story event
  // Market Impact Data
  affectedAssets: text("affected_assets").array(),
  // Asset IDs affected by this event
  priceImpacts: jsonb("price_impacts"),
  // Actual price impacts by asset ID
  volumeChanges: jsonb("volume_changes"),
  // Volume changes by asset ID
  volatilityAdjustments: jsonb("volatility_adjustments"),
  // Volatility changes by asset ID
  // House Effects
  houseImpacts: jsonb("house_impacts"),
  // Impact on each of the seven houses
  crossHouseInteractions: jsonb("cross_house_interactions"),
  // Secondary cross-house effects
  // Event Lifecycle
  eventStartTime: timestamp("event_start_time").notNull(),
  eventEndTime: timestamp("event_end_time"),
  peakImpactTime: timestamp("peak_impact_time"),
  currentPhase: text("current_phase").default("immediate"),
  // 'immediate', 'medium_term', 'decay'
  // Market Response Tracking
  marketResponse: jsonb("market_response"),
  // How market actually responded
  predictionAccuracy: decimal("prediction_accuracy", { precision: 8, scale: 4 }),
  unexpectedEffects: jsonb("unexpected_effects"),
  // Unanticipated market responses
  // Narrative Trading Analytics
  narrativeRelevanceScore: decimal("narrative_relevance_score", { precision: 8, scale: 4 }).default("1.0000"),
  culturalImpactMeasure: decimal("cultural_impact_measure", { precision: 8, scale: 4 }).default("0.0000"),
  fanEngagementCorrelation: decimal("fan_engagement_correlation", { precision: 8, scale: 4 }).default("0.0000"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertNarrativeTradingMetricsSchema = createInsertSchema(narrativeTradingMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertHouseFinancialProfilesSchema = createInsertSchema(houseFinancialProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertStoryEventTriggersSchema = createInsertSchema(storyEventTriggers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertNarrativeMarketEventsSchema = createInsertSchema(narrativeMarketEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var comicIssueVariants = pgTable("comic_issue_variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic issue information
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Link to tradeable asset
  issueNumber: text("issue_number").notNull(),
  // "1", "Annual 1", "Special"
  seriesTitle: text("series_title").notNull(),
  publisher: text("publisher").notNull(),
  // "Marvel", "DC", "Image", etc.
  // Cover variant details
  coverType: text("cover_type").notNull(),
  // "standard", "variant", "rare_variant", "ultra_rare", "legendary"
  variantRatio: text("variant_ratio"),
  // "1:10", "1:25", "1:100", "1:1000" or null for standard
  variantDescription: text("variant_description"),
  // "Alex Ross Variant", "Foil Cover", etc.
  artistName: text("artist_name"),
  // Cover artist
  // Rarity and progression mechanics
  rarityScore: decimal("rarity_score", { precision: 8, scale: 2 }).notNull(),
  // 1-100 rarity score
  progressionTier: integer("progression_tier").notNull().default(1),
  // 1-5 progression tier
  tradingToolsUnlocked: text("trading_tools_unlocked").array(),
  // Tools this variant unlocks
  // Issue significance
  issueType: text("issue_type").default("regular"),
  // "first_appearance", "death", "resurrection", "key_storyline", "crossover"
  keyCharacters: text("key_characters").array(),
  // Characters featured
  significantEvents: text("significant_events").array(),
  // Major events in this issue
  storyArcs: text("story_arcs").array(),
  // Story arcs this issue belongs to
  // House relevance
  houseRelevance: jsonb("house_relevance"),
  // Relevance score for each house (0-1)
  primaryHouse: text("primary_house"),
  // Most relevant house
  // Market mechanics
  baseMarketValue: decimal("base_market_value", { precision: 10, scale: 2 }).notNull(),
  progressionMultiplier: decimal("progression_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  // Bonus multiplier for progression
  collectorDemand: decimal("collector_demand", { precision: 3, scale: 2 }).default("1.00"),
  // 0-1 collector interest
  // Metadata
  releaseDate: text("release_date"),
  comicGradingEligible: boolean("comic_grading_eligible").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_comic_issue_variants_asset_id").on(table.assetId),
  index("idx_comic_issue_variants_cover_type").on(table.coverType),
  index("idx_comic_issue_variants_progression_tier").on(table.progressionTier),
  index("idx_comic_issue_variants_rarity_score").on(table.rarityScore),
  index("idx_comic_issue_variants_issue_type").on(table.issueType),
  index("idx_comic_issue_variants_primary_house").on(table.primaryHouse),
  index("idx_comic_issue_variants_series_title").on(table.seriesTitle)
]);
var userComicCollection = pgTable("user_comic_collection", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  variantId: varchar("variant_id").notNull().references(() => comicIssueVariants.id),
  // Ownership details
  quantity: integer("quantity").default(1),
  // How many copies owned
  acquisitionMethod: text("acquisition_method").default("purchase"),
  // "purchase", "reward", "achievement", "gift"
  acquisitionPrice: decimal("acquisition_price", { precision: 10, scale: 2 }),
  currentGrade: text("current_grade"),
  // CGC grade if applicable
  gradeValue: decimal("grade_value", { precision: 3, scale: 1 }),
  // Numeric grade value
  // Collection status
  isFirstOwned: boolean("is_first_owned").default(false),
  // First time owning this variant
  contributesToProgression: boolean("contributes_to_progression").default(true),
  displayInCollection: boolean("display_in_collection").default(true),
  // Trading information
  availableForTrade: boolean("available_for_trade").default(false),
  minimumTradeValue: decimal("minimum_trade_value", { precision: 10, scale: 2 }),
  // Metadata
  notes: text("notes"),
  // Personal collection notes
  tags: text("tags").array(),
  // User-defined tags
  acquiredAt: timestamp("acquired_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_user_comic_collection_user_id").on(table.userId),
  index("idx_user_comic_collection_variant_id").on(table.variantId),
  index("idx_user_comic_collection_acquisition_method").on(table.acquisitionMethod),
  index("idx_user_comic_collection_is_first_owned").on(table.isFirstOwned),
  index("idx_user_comic_collection_acquired_at").on(table.acquiredAt),
  // Unique constraint to prevent duplicate ownership records
  index("idx_user_comic_collection_unique").on(table.userId, table.variantId)
]);
var userProgressionStatus = pgTable("user_progression_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Overall progression
  overallProgressionTier: integer("overall_progression_tier").default(1),
  // 1-5 overall tier
  progressionTitle: text("progression_title").default("Rookie Collector"),
  // Current title
  totalCollectionValue: decimal("total_collection_value", { precision: 15, scale: 2 }).default("0.00"),
  totalIssuesOwned: integer("total_issues_owned").default(0),
  totalVariantsOwned: integer("total_variants_owned").default(0),
  // Progression metrics
  standardCoversOwned: integer("standard_covers_owned").default(0),
  variantCoversOwned: integer("variant_covers_owned").default(0),
  // 1:10 variants
  rareVariantsOwned: integer("rare_variants_owned").default(0),
  // 1:25 variants
  ultraRareVariantsOwned: integer("ultra_rare_variants_owned").default(0),
  // 1:100 variants
  legendaryVariantsOwned: integer("legendary_variants_owned").default(0),
  // 1:1000 variants
  // Issue type collections
  firstAppearancesOwned: integer("first_appearances_owned").default(0),
  deathIssuesOwned: integer("death_issues_owned").default(0),
  resurrectionIssuesOwned: integer("resurrection_issues_owned").default(0),
  keyStorylineIssuesOwned: integer("key_storyline_issues_owned").default(0),
  crossoverIssuesOwned: integer("crossover_issues_owned").default(0),
  // Creator collections
  creatorMilestonesCompleted: integer("creator_milestones_completed").default(0),
  iconicSplashPagesOwned: integer("iconic_splash_pages_owned").default(0),
  // Trading capabilities unlocked
  tradingToolsUnlocked: text("trading_tools_unlocked").array(),
  // List of unlocked tools
  maxTradingTier: integer("max_trading_tier").default(1),
  // Highest tier unlocked
  specialTradingAbilities: text("special_trading_abilities").array(),
  // Special abilities unlocked
  // House-specific progression
  houseProgressionLevels: jsonb("house_progression_levels"),
  // Progress in each house
  houseBonusesUnlocked: jsonb("house_bonuses_unlocked"),
  // Bonuses unlocked per house
  interHouseBonuses: text("inter_house_bonuses").array(),
  // Cross-house bonuses
  // Achievement milestones
  achievementMilestonesCompleted: integer("achievement_milestones_completed").default(0),
  legendaryAchievementsUnlocked: integer("legendary_achievements_unlocked").default(0),
  // Collection completion stats
  seriesCompletionCount: integer("series_completion_count").default(0),
  // Number of complete series
  publisherCompletionPercentage: jsonb("publisher_completion_percentage"),
  // % complete for each publisher
  // Metadata
  lastProgressionUpdate: timestamp("last_progression_update").defaultNow(),
  nextMilestoneTarget: text("next_milestone_target"),
  // Description of next major milestone
  progressionNotes: text("progression_notes"),
  // Internal notes about progression
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_progression_status_user_id").on(table.userId),
  index("idx_user_progression_status_tier").on(table.overallProgressionTier),
  index("idx_user_progression_status_total_value").on(table.totalCollectionValue),
  index("idx_user_progression_status_max_trading_tier").on(table.maxTradingTier),
  index("idx_user_progression_status_last_update").on(table.lastProgressionUpdate)
]);
var houseProgressionPaths = pgTable("house_progression_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  houseId: text("house_id").notNull(),
  // "heroes", "wisdom", "power", "mystery", "elements", "time", "spirit"
  progressionLevel: integer("progression_level").notNull(),
  // 1-4 levels per house
  levelTitle: text("level_title").notNull(),
  // "Origin Story", "Sidekick", etc.
  levelDescription: text("level_description").notNull(),
  // Requirements for this level
  requiredIssuesCount: integer("required_issues_count").default(0),
  requiredVariantRarity: text("required_variant_rarity"),
  // Minimum variant rarity needed
  requiredCollectionValue: decimal("required_collection_value", { precision: 15, scale: 2 }).default("0.00"),
  requiredStorylineCompletion: text("required_storyline_completion").array(),
  // Specific storylines
  requiredCharacterCollection: text("required_character_collection").array(),
  // Character collections
  // Unlocks and bonuses
  tradingBonuses: jsonb("trading_bonuses"),
  // Trading bonuses at this level
  specialAbilities: text("special_abilities").array(),
  // Special abilities unlocked
  marketAccessLevel: text("market_access_level"),
  // "basic", "advanced", "expert", "legendary"
  houseSpecificTools: text("house_specific_tools").array(),
  // House-specific trading tools
  // Visual and thematic elements
  badgeIcon: text("badge_icon"),
  // Icon for this progression level
  badgeColor: text("badge_color"),
  // Color theme
  levelQuote: text("level_quote"),
  // Inspirational quote for this level
  backgroundImage: text("background_image"),
  // Background image URL
  // Progression narrative
  progressionStory: text("progression_story"),
  // Story text for reaching this level
  nextLevelPreview: text("next_level_preview"),
  // Hint about next level
  // Metadata
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_house_progression_paths_house_id").on(table.houseId),
  index("idx_house_progression_paths_level").on(table.progressionLevel),
  index("idx_house_progression_paths_display_order").on(table.displayOrder),
  // Unique constraint for house + level combination
  index("idx_house_progression_paths_unique").on(table.houseId, table.progressionLevel)
]);
var userHouseProgression = pgTable("user_house_progression", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  houseId: text("house_id").notNull(),
  // Current progression status
  currentLevel: integer("current_level").default(1),
  experiencePoints: integer("experience_points").default(0),
  // XP towards next level
  nextLevelRequiredXP: integer("next_level_required_xp").default(100),
  progressionPercentage: decimal("progression_percentage", { precision: 5, scale: 2 }).default("0.00"),
  // % to next level
  // Collection requirements progress
  currentIssuesCount: integer("current_issues_count").default(0),
  currentCollectionValue: decimal("current_collection_value", { precision: 15, scale: 2 }).default("0.00"),
  storylinesCompleted: text("storylines_completed").array(),
  characterCollectionsCompleted: text("character_collections_completed").array(),
  // Unlocked benefits
  currentTradingBonuses: jsonb("current_trading_bonuses"),
  unlockedAbilities: text("unlocked_abilities").array(),
  currentMarketAccessLevel: text("current_market_access_level").default("basic"),
  availableHouseTools: text("available_house_tools").array(),
  // Achievement tracking
  levelsUnlocked: integer("levels_unlocked").default(1),
  totalXPEarned: integer("total_xp_earned").default(0),
  firstLevelAchievedAt: timestamp("first_level_achieved_at"),
  lastLevelAchievedAt: timestamp("last_level_achieved_at"),
  // House-specific metrics
  houseSpecificAchievements: text("house_specific_achievements").array(),
  houseContributionScore: decimal("house_contribution_score", { precision: 8, scale: 2 }).default("0.00"),
  houseRankingPosition: integer("house_ranking_position"),
  // Metadata
  lastProgressionActivity: timestamp("last_progression_activity").defaultNow(),
  progressionNotes: text("progression_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_house_progression_user_id").on(table.userId),
  index("idx_user_house_progression_house_id").on(table.houseId),
  index("idx_user_house_progression_current_level").on(table.currentLevel),
  index("idx_user_house_progression_xp").on(table.experiencePoints),
  index("idx_user_house_progression_contribution").on(table.houseContributionScore),
  // Unique constraint to prevent duplicate progression records
  index("idx_user_house_progression_unique").on(table.userId, table.houseId)
]);
var tradingToolUnlocks = pgTable("trading_tool_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  toolName: text("tool_name").notNull(),
  // "basic_trading", "technical_analysis", "options_trading", etc.
  toolCategory: text("tool_category").notNull(),
  // "basic", "advanced", "expert", "legendary"
  // Unlock requirements
  requiredProgressionTier: integer("required_progression_tier").notNull(),
  requiredVariantRarity: text("required_variant_rarity"),
  // Minimum variant rarity
  requiredAchievements: text("required_achievements").array(),
  // Achievement prerequisites
  requiredHouseLevel: jsonb("required_house_level"),
  // House level requirements
  // Unlock status
  isUnlocked: boolean("is_unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  unlockedBy: text("unlocked_by"),
  // What triggered the unlock
  // Tool configuration
  toolDescription: text("tool_description").notNull(),
  toolBenefits: text("tool_benefits").array(),
  // Benefits this tool provides
  tradingBonuses: jsonb("trading_bonuses"),
  // Specific trading bonuses
  marketAccessLevel: text("market_access_level"),
  // Required market access
  // Usage tracking
  timesUsed: integer("times_used").default(0),
  lastUsedAt: timestamp("last_used_at"),
  effectivenessRating: decimal("effectiveness_rating", { precision: 3, scale: 2 }),
  // User effectiveness with tool
  // Metadata
  iconName: text("icon_name"),
  // UI icon
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_trading_tool_unlocks_user_id").on(table.userId),
  index("idx_trading_tool_unlocks_tool_name").on(table.toolName),
  index("idx_trading_tool_unlocks_category").on(table.toolCategory),
  index("idx_trading_tool_unlocks_progression_tier").on(table.requiredProgressionTier),
  index("idx_trading_tool_unlocks_is_unlocked").on(table.isUnlocked),
  index("idx_trading_tool_unlocks_unlocked_at").on(table.unlockedAt),
  // Unique constraint for user + tool combination
  index("idx_trading_tool_unlocks_unique").on(table.userId, table.toolName)
]);
var comicCollectionAchievements = pgTable("comic_collection_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  achievementId: text("achievement_id").notNull().unique(),
  // "first_variant_cover", "death_issue_collector", etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  // "variant_collection", "issue_type", "storyline", "creator", "crossover"
  // Achievement requirements
  requirementType: text("requirement_type").notNull(),
  // "count", "specific_issues", "value", "rarity", "storyline"
  requiredCount: integer("required_count"),
  // Number required for count-based achievements
  requiredValue: decimal("required_value", { precision: 15, scale: 2 }),
  // Value required
  requiredRarity: text("required_rarity"),
  // Minimum rarity level
  specificRequirements: jsonb("specific_requirements"),
  // Detailed requirements
  // Rewards and unlocks
  achievementPoints: integer("achievement_points").default(0),
  tradingToolsUnlocked: text("trading_tools_unlocked").array(),
  houseProgressionBonus: jsonb("house_progression_bonus"),
  // XP bonus per house
  specialAbilities: text("special_abilities").array(),
  tradingBonuses: jsonb("trading_bonuses"),
  // Visual elements
  badgeIcon: text("badge_icon"),
  badgeColor: text("badge_color"),
  tier: text("tier").default("bronze"),
  // "bronze", "silver", "gold", "platinum", "legendary"
  rarity: text("rarity").default("common"),
  // "common", "rare", "epic", "legendary"
  // Narrative elements
  achievementStory: text("achievement_story"),
  // Story text for unlocking
  comicPanelStyle: text("comic_panel_style"),
  // Visual style for notification
  speechBubbleText: text("speech_bubble_text"),
  // Character dialogue for achievement
  // Prerequisites and dependencies
  prerequisiteAchievements: text("prerequisite_achievements").array(),
  blockedBy: text("blocked_by").array(),
  // Achievements that block this one
  // Metadata
  isHidden: boolean("is_hidden").default(false),
  // Hidden until unlocked
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_comic_collection_achievements_achievement_id").on(table.achievementId),
  index("idx_comic_collection_achievements_category").on(table.category),
  index("idx_comic_collection_achievements_tier").on(table.tier),
  index("idx_comic_collection_achievements_rarity").on(table.rarity),
  index("idx_comic_collection_achievements_requirement_type").on(table.requirementType),
  index("idx_comic_collection_achievements_is_hidden").on(table.isHidden),
  index("idx_comic_collection_achievements_display_order").on(table.displayOrder)
]);
var collectionChallenges = pgTable("collection_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeTitle: text("challenge_title").notNull(),
  challengeDescription: text("challenge_description").notNull(),
  challengeType: text("challenge_type").notNull(),
  // "weekly", "monthly", "seasonal", "special_event"
  // Challenge timing
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  challengeDuration: text("challenge_duration"),
  // "7_days", "30_days", etc.
  // Challenge requirements
  challengeGoal: jsonb("challenge_goal").notNull(),
  // Specific goal requirements
  targetMetric: text("target_metric").notNull(),
  // "issues_collected", "value_achieved", "variants_found"
  targetValue: decimal("target_value", { precision: 15, scale: 2 }).notNull(),
  eligibilityRequirements: jsonb("eligibility_requirements"),
  // Who can participate
  // House integration
  houseSpecific: boolean("house_specific").default(false),
  targetHouse: text("target_house"),
  // If house-specific
  crossHouseBonus: boolean("cross_house_bonus").default(false),
  // If cross-house participation gets bonus
  // Rewards
  completionRewards: jsonb("completion_rewards").notNull(),
  leaderboardRewards: jsonb("leaderboard_rewards"),
  // Top performer rewards
  participationRewards: jsonb("participation_rewards"),
  // Just for participating
  exclusiveUnlocks: text("exclusive_unlocks").array(),
  // Exclusive content unlocked
  // Challenge mechanics
  difficultyLevel: integer("difficulty_level").default(3),
  // 1-5 difficulty
  maxParticipants: integer("max_participants"),
  // Participation limit
  currentParticipants: integer("current_participants").default(0),
  // Progress tracking
  leaderboardEnabled: boolean("leaderboard_enabled").default(true),
  realTimeTracking: boolean("real_time_tracking").default(true),
  progressVisibility: text("progress_visibility").default("public"),
  // "public", "house_only", "private"
  // Visual and narrative elements
  challengeBanner: text("challenge_banner"),
  // Banner image URL
  challengeIcon: text("challenge_icon"),
  themeColor: text("theme_color"),
  narrativeContext: text("narrative_context"),
  // Story context for challenge
  // Metadata
  createdBy: varchar("created_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  isRecurring: boolean("is_recurring").default(false),
  // If this challenge repeats
  recurringPattern: text("recurring_pattern"),
  // How often it repeats
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_collection_challenges_challenge_type").on(table.challengeType),
  index("idx_collection_challenges_start_date").on(table.startDate),
  index("idx_collection_challenges_end_date").on(table.endDate),
  index("idx_collection_challenges_is_active").on(table.isActive),
  index("idx_collection_challenges_target_house").on(table.targetHouse),
  index("idx_collection_challenges_difficulty").on(table.difficultyLevel)
]);
var userChallengeParticipation = pgTable("user_challenge_participation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => collectionChallenges.id),
  // Participation status
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  participationStatus: text("participation_status").default("active"),
  // "active", "completed", "abandoned", "disqualified"
  // Progress tracking
  currentProgress: decimal("current_progress", { precision: 15, scale: 2 }).default("0.00"),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0.00"),
  milestonesMet: text("milestones_met").array(),
  lastProgressUpdate: timestamp("last_progress_update").defaultNow(),
  // Performance metrics
  leaderboardPosition: integer("leaderboard_position"),
  bestPosition: integer("best_position"),
  finalPosition: integer("final_position"),
  // Rewards earned
  rewardsEarned: jsonb("rewards_earned"),
  rewardsClaimed: boolean("rewards_claimed").default(false),
  rewardsClaimedAt: timestamp("rewards_claimed_at"),
  // Challenge-specific tracking
  challengeSpecificData: jsonb("challenge_specific_data"),
  // Additional tracking data
  effortRating: decimal("effort_rating", { precision: 3, scale: 2 }),
  // 1-5 effort put in
  satisfactionRating: decimal("satisfaction_rating", { precision: 3, scale: 2 }),
  // 1-5 satisfaction
  // Metadata
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  // User notes about participation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_user_challenge_participation_user_id").on(table.userId),
  index("idx_user_challenge_participation_challenge_id").on(table.challengeId),
  index("idx_user_challenge_participation_status").on(table.participationStatus),
  index("idx_user_challenge_participation_leaderboard").on(table.leaderboardPosition),
  index("idx_user_challenge_participation_enrolled_at").on(table.enrolledAt),
  // Unique constraint to prevent duplicate participation
  index("idx_user_challenge_participation_unique").on(table.userId, table.challengeId)
]);
var insertComicIssueVariantSchema = createInsertSchema(comicIssueVariants).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserComicCollectionSchema = createInsertSchema(userComicCollection).omit({
  id: true,
  acquiredAt: true,
  createdAt: true
});
var insertUserProgressionStatusSchema = createInsertSchema(userProgressionStatus).omit({
  id: true,
  lastProgressionUpdate: true,
  createdAt: true,
  updatedAt: true
});
var insertHouseProgressionPathSchema = createInsertSchema(houseProgressionPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserHouseProgressionSchema = createInsertSchema(userHouseProgression).omit({
  id: true,
  lastProgressionActivity: true,
  createdAt: true,
  updatedAt: true
});
var insertTradingToolUnlockSchema = createInsertSchema(tradingToolUnlocks).omit({
  id: true,
  unlockedAt: true,
  createdAt: true,
  updatedAt: true
});
var insertComicCollectionAchievementSchema = createInsertSchema(comicCollectionAchievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCollectionChallengeSchema = createInsertSchema(collectionChallenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserChallengeParticipationSchema = createInsertSchema(userChallengeParticipation).omit({
  id: true,
  enrolledAt: true,
  lastProgressUpdate: true,
  createdAt: true,
  updatedAt: true
});
var gradedAssetProfiles2 = pgTable("graded_asset_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  // CGC-Style Grading Scores (0.5 - 10.0 scale)
  overallGrade: decimal("overall_grade", { precision: 3, scale: 1 }).notNull(),
  // Final composite grade
  conditionScore: decimal("condition_score", { precision: 3, scale: 1 }).notNull(),
  // Overall condition
  centeringScore: decimal("centering_score", { precision: 3, scale: 1 }).notNull(),
  // Cover centering
  cornersScore: decimal("corners_score", { precision: 3, scale: 1 }).notNull(),
  // Corner condition
  edgesScore: decimal("edges_score", { precision: 3, scale: 1 }).notNull(),
  // Edge integrity
  surfaceScore: decimal("surface_score", { precision: 3, scale: 1 }).notNull(),
  // Surface quality
  // Provenance & Certification Metadata
  certificationAuthority: text("certification_authority").notNull(),
  // 'cgc', 'cbcs', 'pgx', 'internal'
  certificationNumber: text("certification_number").unique(),
  // Serial number from grading company
  gradingDate: timestamp("grading_date").notNull(),
  gradingNotes: text("grading_notes"),
  // Detailed condition notes
  // Variant Classifications & Special Designations
  variantType: text("variant_type"),
  // 'first_print', 'variant_cover', 'special_edition', 'limited_run', 'error', 'misprint'
  printRun: integer("print_run"),
  // Known print run numbers
  isKeyIssue: boolean("is_key_issue").default(false),
  isFirstAppearance: boolean("is_first_appearance").default(false),
  isSigned: boolean("is_signed").default(false),
  signatureAuthenticated: boolean("signature_authenticated").default(false),
  // Rarity Tier System (Mythological Themed)
  rarityTier: text("rarity_tier").notNull(),
  // 'common', 'uncommon', 'rare', 'ultra_rare', 'legendary', 'mythic'
  rarityScore: decimal("rarity_score", { precision: 5, scale: 2 }).notNull(),
  // Calculated rarity index
  marketDemandScore: decimal("market_demand_score", { precision: 5, scale: 2 }),
  // Market desirability
  // Storage & Collection Metadata
  storageType: text("storage_type").default("bag_and_board"),
  // 'bag_and_board', 'mylar', 'graded_slab', 'top_loader'
  storageCondition: text("storage_condition").default("excellent"),
  // 'poor', 'fair', 'good', 'excellent', 'mint'
  acquisitionDate: timestamp("acquisition_date").notNull(),
  acquisitionPrice: decimal("acquisition_price", { precision: 10, scale: 2 }),
  currentMarketValue: decimal("current_market_value", { precision: 10, scale: 2 }),
  // Collection Organization
  collectionSeries: text("collection_series"),
  // Series grouping
  issueNumber: text("issue_number"),
  // Specific issue number
  volumeNumber: integer("volume_number"),
  // Volume/series number
  // Collector Notes & Personal Data  
  personalRating: integer("personal_rating"),
  // 1-5 star personal rating
  collectorNotes: text("collector_notes"),
  // Personal collection notes
  displayPriority: integer("display_priority").default(0),
  // Display order preference
  // House Integration & Progression
  houseAffiliation: text("house_affiliation"),
  // Associated mythological house
  houseProgressionValue: decimal("house_progression_value", { precision: 8, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var variantCoverRegistry2 = pgTable("variant_cover_registry", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  baseAssetId: varchar("base_asset_id").notNull().references(() => assets.id),
  // Base comic issue
  // Variant Identification
  variantIdentifier: text("variant_identifier").notNull(),
  // Unique variant code
  variantName: text("variant_name").notNull(),
  // Display name
  coverArtist: text("cover_artist"),
  // Cover artist name
  variantType: text("variant_type").notNull(),
  // 'retailer', 'convention', 'artist', 'incentive', 'sketch'
  // Market Data
  printRun: integer("print_run"),
  // Known or estimated print run
  incentiveRatio: text("incentive_ratio"),
  // For incentive variants (e.g., "1:25", "1:100")
  exclusiveRetailer: text("exclusive_retailer"),
  // Exclusive retailer if applicable
  releaseDate: timestamp("release_date"),
  // Visual Assets
  coverImageUrl: text("cover_image_url"),
  thumbnailUrl: text("thumbnail_url"),
  backCoverUrl: text("back_cover_url"),
  // For trading card flip effect
  // Rarity & Valuation
  baseRarityMultiplier: decimal("base_rarity_multiplier", { precision: 5, scale: 2 }).default("1.00"),
  currentPremium: decimal("current_premium", { precision: 8, scale: 2 }),
  // Premium over base issue
  // Metadata
  description: text("description"),
  specialFeatures: text("special_features").array(),
  // Special printing techniques, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var collectionStorageBoxes2 = pgTable("collection_storage_boxes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Box Identification
  boxName: text("box_name").notNull(),
  boxType: text("box_type").notNull(),
  // 'long_box', 'short_box', 'magazine_box', 'display_case', 'graded_slab_storage'
  capacity: integer("capacity").notNull(),
  // Maximum number of issues
  currentCount: integer("current_count").default(0),
  // Organization
  organizationMethod: text("organization_method").default("alphabetical"),
  // 'alphabetical', 'chronological', 'value', 'rarity', 'series', 'publisher'
  seriesFilter: text("series_filter"),
  // Optional series grouping
  publisherFilter: text("publisher_filter"),
  // Optional publisher grouping
  // Physical Attributes
  location: text("location"),
  // Physical location description
  condition: text("condition").default("excellent"),
  // Box condition
  // Collection Stats
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).default("0.00"),
  averageGrade: decimal("average_grade", { precision: 3, scale: 1 }),
  keyIssuesCount: integer("key_issues_count").default(0),
  // Rarity Distribution
  commonCount: integer("common_count").default(0),
  uncommonCount: integer("uncommon_count").default(0),
  rareCount: integer("rare_count").default(0),
  ultraRareCount: integer("ultra_rare_count").default(0),
  legendaryCount: integer("legendary_count").default(0),
  mythicCount: integer("mythic_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var gradingCertifications = pgTable("grading_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gradedAssetId: varchar("graded_asset_id").notNull().references(() => gradedAssetProfiles2.id),
  // Certification Event
  certificationType: text("certification_type").notNull(),
  // 'initial_grade', 're_grade', 'signature_verification', 'restoration_check'
  previousGrade: decimal("previous_grade", { precision: 3, scale: 1 }),
  // Previous grade if re-certification
  newGrade: decimal("new_grade", { precision: 3, scale: 1 }).notNull(),
  // Certification Details
  certifyingAuthority: text("certifying_authority").notNull(),
  certificateNumber: text("certificate_number"),
  certificationFee: decimal("certification_fee", { precision: 8, scale: 2 }),
  // Process Tracking
  submissionDate: timestamp("submission_date"),
  completionDate: timestamp("completion_date").notNull(),
  turnaroundDays: integer("turnaround_days"),
  // Results
  certificationNotes: text("certification_notes"),
  qualityAssessment: jsonb("quality_assessment"),
  // Detailed breakdown of grading criteria
  createdAt: timestamp("created_at").defaultNow()
});
var marketComparables = pgTable("market_comparables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gradedAssetId: varchar("graded_asset_id").notNull().references(() => gradedAssetProfiles2.id),
  // Sale Information
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }).notNull(),
  saleDate: timestamp("sale_date").notNull(),
  marketplace: text("marketplace"),
  // 'ebay', 'heritage', 'comic_connect', 'mycomicshop'
  // Comparable Details
  comparableGrade: decimal("comparable_grade", { precision: 3, scale: 1 }).notNull(),
  gradingAuthority: text("grading_authority").notNull(),
  saleConditions: text("sale_conditions"),
  // Auction, buy-it-now, etc.
  // Relevance Scoring
  relevanceScore: decimal("relevance_score", { precision: 3, scale: 2 }),
  // How similar to target asset
  ageRelevance: decimal("age_relevance", { precision: 3, scale: 2 }),
  // How recent the sale
  // Metadata
  saleReference: text("sale_reference"),
  // External reference/link
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertGradedAssetProfileSchema = createInsertSchema(gradedAssetProfiles2).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertVariantCoverRegistrySchema = createInsertSchema(variantCoverRegistry2).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCollectionStorageBoxSchema = createInsertSchema(collectionStorageBoxes2).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertGradingCertificationSchema = createInsertSchema(gradingCertifications).omit({
  id: true,
  createdAt: true
});
var insertMarketComparableSchema = createInsertSchema(marketComparables).omit({
  id: true,
  createdAt: true
});
var shadowTrades = pgTable("shadow_trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Price Information
  shadowPrice: decimal("shadow_price", { precision: 10, scale: 2 }).notNull(),
  realPrice: decimal("real_price", { precision: 10, scale: 2 }).notNull(),
  priceDivergence: decimal("price_divergence", { precision: 8, scale: 2 }).notNull(),
  // Percentage
  // Trade Details
  quantity: integer("quantity").notNull(),
  side: text("side").notNull(),
  // 'buy' or 'sell'
  orderType: text("order_type").notNull(),
  // 'predatory', 'vampire', 'ghost'
  profitLoss: decimal("profit_loss", { precision: 15, scale: 2 }).notNull(),
  // Corruption Impact
  corruptionGained: integer("corruption_gained").notNull(),
  victimId: varchar("victim_id").references(() => users.id),
  // If applicable
  victimLoss: decimal("victim_loss", { precision: 15, scale: 2 }),
  // Status
  status: text("status").notNull().default("pending"),
  // 'pending', 'executed', 'cancelled'
  executedAt: timestamp("executed_at").notNull(),
  // Metadata
  metadata: jsonb("metadata"),
  // Additional trade-specific data
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_shadow_trades_user").on(table.userId),
  index("idx_shadow_trades_asset").on(table.assetId),
  index("idx_shadow_trades_executed").on(table.executedAt)
]);
var darkPools = pgTable("dark_pools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Liquidity Information
  shadowLiquidity: decimal("shadow_liquidity", { precision: 15, scale: 2 }).notNull(),
  hiddenOrders: integer("hidden_orders").default(0),
  averageSpread: decimal("average_spread", { precision: 8, scale: 4 }),
  // Access Control
  accessLevel: integer("access_level").notNull().default(30),
  // Minimum corruption to access
  participantCount: integer("participant_count").default(0),
  // Pool Characteristics
  poolType: text("pool_type").default("standard"),
  // 'standard', 'predatory', 'vampire'
  volatility: decimal("volatility", { precision: 8, scale: 2 }),
  bloodInWater: boolean("blood_in_water").default(false),
  // Recent losses detected
  lastBloodTime: timestamp("last_blood_time"),
  // Statistics
  totalVolume24h: decimal("total_volume_24h", { precision: 15, scale: 2 }).default("0.00"),
  totalTrades24h: integer("total_trades_24h").default(0),
  largestTrade: decimal("largest_trade", { precision: 15, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_dark_pools_asset").on(table.assetId),
  index("idx_dark_pools_access").on(table.accessLevel)
]);
var shadowOrderBook = pgTable("shadow_order_book", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  // Order Details
  orderType: text("order_type").notNull(),
  // 'ghost', 'trap', 'vampire'
  side: text("side").notNull(),
  // 'buy' or 'sell'
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  filled: integer("filled").default(0),
  // Visibility
  visibilityLevel: integer("visibility_level").notNull(),
  // Corruption required to see
  isHidden: boolean("is_hidden").default(true),
  revealAt: timestamp("reveal_at"),
  // When order becomes visible
  // Targeting
  targetUserId: varchar("target_user_id").references(() => users.id),
  // For predatory orders
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }),
  // Stop loss hunting
  // Status
  status: text("status").notNull().default("pending"),
  // 'pending', 'partial', 'filled', 'cancelled'
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_shadow_order_book_user").on(table.userId),
  index("idx_shadow_order_book_asset").on(table.assetId),
  index("idx_shadow_order_book_status").on(table.status)
]);
var insertShadowTradeSchema = createInsertSchema(shadowTrades).omit({
  id: true,
  createdAt: true
});
var insertDarkPoolSchema = createInsertSchema(darkPools).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertShadowOrderBookSchema = createInsertSchema(shadowOrderBook).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Entry classification
  entryType: text("entry_type").notNull(),
  // 'trade', 'daily', 'victim', 'milestone', 'confession', 'analysis'
  // Content
  content: text("content").notNull(),
  // The noir journal entry text
  title: text("title"),
  // Optional title for the entry
  // Context
  corruptionAtTime: decimal("corruption_at_time", { precision: 5, scale: 2 }),
  // Corruption level when written
  relatedTradeId: varchar("related_trade_id").references(() => trades.id),
  // If related to specific trade
  relatedVictimId: varchar("related_victim_id").references(() => tradingVictims.id),
  // If related to victim
  // Metadata
  mood: text("mood"),
  // 'contemplative', 'dark', 'nihilistic', 'remorseful', 'cold'
  intensity: integer("intensity").default(1),
  // 1-10 scale of darkness
  wordCount: integer("word_count"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_journal_entries_user").on(table.userId),
  index("idx_journal_entries_type").on(table.entryType),
  index("idx_journal_entries_created").on(table.createdAt)
]);
var psychologicalProfiles = pgTable("psychological_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Analysis
  pattern: text("pattern").notNull(),
  // Identified psychological pattern
  analysis: text("analysis").notNull(),
  // Detailed psychological analysis
  // Traits
  dominantTraits: jsonb("dominant_traits"),
  // ['ruthless', 'calculating', 'empathetic', etc.]
  moralAlignment: text("moral_alignment"),
  // 'descending', 'conflicted', 'embracing_darkness'
  tradingStyle: text("trading_style"),
  // 'predatory', 'opportunistic', 'defensive'
  // Metrics
  empathyScore: decimal("empathy_score", { precision: 5, scale: 2 }),
  // 0-100, decreases with corruption
  ruthlessnessIndex: decimal("ruthlessness_index", { precision: 5, scale: 2 }),
  // 0-100, increases with profits
  denialLevel: decimal("denial_level", { precision: 5, scale: 2 }),
  // 0-100, psychological defense mechanisms
  // Evolution tracking
  previousProfile: text("previous_profile"),
  // How they've changed
  turningPoints: jsonb("turning_points"),
  // Key trades that changed them
  // Timestamps
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_psychological_profiles_user").on(table.userId)
]);
var insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true
});
var insertPsychologicalProfileSchema = createInsertSchema(psychologicalProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var shadowTraders = pgTable("shadow_traders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  // NULL for AI shadows
  shadowName: text("shadow_name").notNull(),
  // "Shadow of Greed", "Fallen Spectre", etc.
  // Shadow characteristics
  strength: decimal("strength", { precision: 10, scale: 2 }).default("100.00"),
  // Trading power
  corruptionLevel: decimal("corruption_level", { precision: 5, scale: 2 }).default("0.00"),
  portfolioValue: decimal("portfolio_value", { precision: 15, scale: 2 }).default("0.00"),
  // Status tracking
  status: text("status").notNull().default("active"),
  // 'active', 'fallen', 'consumed', 'rising'
  fallenAt: timestamp("fallen_at"),
  // When they fell below threshold
  consumedBy: varchar("consumed_by").references(() => users.id),
  // Who consumed them
  // Visual characteristics
  shadowColor: text("shadow_color").default("#000000"),
  // Hex color based on state
  opacity: decimal("opacity", { precision: 3, scale: 2 }).default("0.80"),
  // Visual opacity
  isAI: boolean("is_ai").default(false),
  // AI-controlled shadow
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_shadow_traders_status").on(table.status),
  index("idx_shadow_traders_user").on(table.userId)
]);
var stolenPositions = pgTable("stolen_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  thiefId: varchar("thief_id").notNull().references(() => users.id),
  victimId: varchar("victim_id").notNull().references(() => users.id),
  positionId: varchar("position_id").notNull().references(() => positions.id),
  // Theft details
  originalValue: decimal("original_value", { precision: 15, scale: 2 }).notNull(),
  stolenValue: decimal("stolen_value", { precision: 15, scale: 2 }).notNull(),
  // 50% discount
  discountRate: decimal("discount_rate", { precision: 5, scale: 2 }).default("50.00"),
  // Moral consequences
  corruptionGained: decimal("corruption_gained", { precision: 5, scale: 2 }).default("30.00"),
  victimHarm: decimal("victim_harm", { precision: 15, scale: 2 }).notNull(),
  // Metadata
  stealMethod: text("steal_method").default("vulture"),
  // 'vulture', 'predator', 'scavenger'
  stolenAt: timestamp("stolen_at").defaultNow()
}, (table) => [
  index("idx_stolen_positions_thief").on(table.thiefId),
  index("idx_stolen_positions_victim").on(table.victimId),
  index("idx_stolen_positions_stolen_at").on(table.stolenAt)
]);
var traderWarfare = pgTable("trader_warfare", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attackerId: varchar("attacker_id").notNull().references(() => users.id),
  defenderId: varchar("defender_id").notNull().references(() => users.id),
  // Warfare details
  warfareType: text("warfare_type").notNull(),
  // 'steal', 'raid', 'cannibalize', 'hunt'
  outcome: text("outcome").notNull(),
  // 'success', 'failed', 'partial', 'mutual_destruction'
  // Damage and rewards
  attackerGain: decimal("attacker_gain", { precision: 15, scale: 2 }).default("0.00"),
  defenderLoss: decimal("defender_loss", { precision: 15, scale: 2 }).default("0.00"),
  collateralDamage: decimal("collateral_damage", { precision: 15, scale: 2 }).default("0.00"),
  // Brutality metrics
  brutalityScore: decimal("brutality_score", { precision: 5, scale: 2 }).default("0.00"),
  victimsCreated: integer("victims_created").default(0),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_trader_warfare_attacker").on(table.attackerId),
  index("idx_trader_warfare_defender").on(table.defenderId),
  index("idx_trader_warfare_created").on(table.createdAt)
]);
var insertShadowTraderSchema = createInsertSchema(shadowTraders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertStolenPositionSchema = createInsertSchema(stolenPositions).omit({
  id: true,
  stolenAt: true
});
var insertTraderWarfareSchema = createInsertSchema(traderWarfare).omit({
  id: true,
  createdAt: true
});
var npcTraders = pgTable("npc_traders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderName: text("trader_name").notNull(),
  traderType: text("trader_type").notNull(),
  firmId: varchar("firm_id"),
  tradingPersonality: jsonb("trading_personality"),
  preferredAssets: text("preferred_assets").array(),
  avoidedAssets: text("avoided_assets").array(),
  tradingStyle: text("trading_style"),
  availableCapital: decimal("available_capital", { precision: 15, scale: 2 }).notNull(),
  maxPositionSize: decimal("max_position_size", { precision: 15, scale: 2 }),
  maxDailyVolume: decimal("max_daily_volume", { precision: 15, scale: 2 }),
  leveragePreference: decimal("leverage_preference", { precision: 5, scale: 2 }),
  aggressiveness: decimal("aggressiveness", { precision: 5, scale: 2 }),
  intelligence: decimal("intelligence", { precision: 5, scale: 2 }),
  emotionality: decimal("emotionality", { precision: 5, scale: 2 }),
  adaptability: decimal("adaptability", { precision: 5, scale: 2 }),
  tradesPerDay: integer("trades_per_day"),
  minTimeBetweenTradesMinutes: integer("min_time_between_trades_minutes"),
  totalTrades: integer("total_trades").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"),
  avgTradeReturn: decimal("avg_trade_return", { precision: 10, scale: 4 }),
  totalPnL: decimal("total_pnl", { precision: 15, scale: 2 }),
  sharpeRatio: decimal("sharpe_ratio", { precision: 10, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 10, scale: 4 }),
  isActive: boolean("is_active").default(true),
  lastTradeTime: timestamp("last_trade_time"),
  nextTradeTime: timestamp("next_trade_time"),
  pausedUntil: timestamp("paused_until"),
  influenceOnMarket: decimal("influence_on_market", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var npcTraderStrategies = pgTable("npc_trader_strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  preferredAssets: text("preferred_assets").array(),
  // Asset IDs they favor
  holdingPeriodDays: integer("holding_period_days").notNull(),
  // Typical hold time
  positionSizingStrategy: text("position_sizing_strategy").notNull(),
  // 'fixed', 'percentage', 'kelly_criterion'
  maxPositionSize: decimal("max_position_size", { precision: 5, scale: 2 }).notNull(),
  // Max % of capital per position
  stopLossPercent: decimal("stop_loss_percent", { precision: 5, scale: 2 }),
  // Automatic loss cut-off
  takeProfitPercent: decimal("take_profit_percent", { precision: 5, scale: 2 })
  // Automatic gain target
});
var npcTraderPsychology = pgTable("npc_trader_psychology", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  panicThreshold: decimal("panic_threshold", { precision: 5, scale: 2 }).notNull(),
  // Price drop % that triggers sell
  greedThreshold: decimal("greed_threshold", { precision: 5, scale: 2 }).notNull(),
  // Gain % that triggers buy
  fomoSusceptibility: integer("fomo_susceptibility").notNull(),
  // 1-10, tendency to chase trends
  confidenceBias: integer("confidence_bias").notNull(),
  // 1-10, overconfidence level
  lossCutSpeed: text("loss_cut_speed").notNull(),
  // 'instant', 'slow', 'never'
  newsReaction: text("news_reaction").notNull()
  // 'ignore', 'consider', 'emotional'
});
var npcTraderPositions = pgTable("npc_trader_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  quantity: integer("quantity").notNull(),
  // Shares held
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(),
  // Avg purchase price
  entryDate: timestamp("entry_date").notNull(),
  // When position opened
  unrealizedPnl: decimal("unrealized_pnl", { precision: 10, scale: 2 }).default("0.00"),
  // Current profit/loss
  targetExitPrice: decimal("target_exit_price", { precision: 10, scale: 2 })
  // Planned sell price (nullable)
});
var npcTraderActivityLog = pgTable("npc_trader_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  traderId: varchar("trader_id").notNull().references(() => npcTraders.id),
  action: text("action").notNull(),
  // 'buy', 'sell', 'hold', 'analyze'
  assetId: varchar("asset_id").references(() => assets.id),
  // Nullable for non-trade actions
  quantity: integer("quantity"),
  // Nullable for non-trade actions
  price: decimal("price", { precision: 10, scale: 2 }),
  // Nullable for non-trade actions
  reasoning: text("reasoning"),
  // Why they made this decision
  timestamp: timestamp("timestamp").defaultNow()
});
var insertNpcTraderSchema = createInsertSchema(npcTraders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertNpcTraderStrategySchema = createInsertSchema(npcTraderStrategies).omit({
  id: true
});
var insertNpcTraderPsychologySchema = createInsertSchema(npcTraderPsychology).omit({
  id: true
});
var insertNpcTraderPositionSchema = createInsertSchema(npcTraderPositions).omit({
  id: true
});
var insertNpcTraderActivityLogSchema = createInsertSchema(npcTraderActivityLog).omit({
  id: true,
  timestamp: true
});
var insertAlignmentScoreSchema = createInsertSchema(alignmentScores).omit({ id: true, createdAt: true, updatedAt: true });
var insertUserDecisionSchema = createInsertSchema(userDecisions).omit({ id: true, createdAt: true });
var insertTestQuestionSchema = createInsertSchema(testQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTestResponseSchema = createInsertSchema(testResponses).omit({
  id: true,
  respondedAt: true
});
var insertTestResultsSchema = createInsertSchema(testResults).omit({
  id: true,
  completedAt: true
});
var insertTestSessionsSchema = createInsertSchema(testSessions).omit({
  id: true,
  startedAt: true,
  lastActivityAt: true
});
var insertSevenHousesSchema = createInsertSchema(sevenHouses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertHousePowerRankingsSchema = createInsertSchema(housePowerRankings).omit({
  id: true,
  createdAt: true
});
var insertHouseMarketEventsSchema = createInsertSchema(houseMarketEvents).omit({
  id: true,
  createdAt: true,
  eventTimestamp: true
});

// server/databaseStorage.ts
var sql_connection = (0, import_serverless2.neon)(process.env.DATABASE_URL);
var db = drizzle(sql_connection);
var DatabaseStorage = class {
  // User management
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.email, username)).limit(1);
    return result[0];
  }
  // (IMPORTANT) this user operation is mandatory for Replit Auth.
  async upsertUser(userData) {
    try {
      if (userData.id) {
        const existingUser = await db.select().from(users).where(eq(users.id, userData.id)).limit(1);
        if (existingUser[0]) {
          const [updated] = await db.update(users).set({
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(users.id, userData.id)).returning();
          return updated;
        }
      }
      const existingByUsername = await db.select().from(users).where(eq(users.username, userData.username)).limit(1);
      if (existingByUsername[0]) {
        const [updated] = await db.update(users).set({
          ...userData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.username, userData.username)).returning();
        return updated;
      }
      const [newUser] = await db.insert(users).values(userData).returning();
      return newUser;
    } catch (error) {
      if (error?.code === "23505") {
        if (error.constraint === "users_username_unique") {
          const [updated] = await db.update(users).set({
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(users.username, userData.username)).returning();
          return updated;
        } else if (error.constraint === "users_email_unique" && userData.email) {
          const [updated] = await db.update(users).set({
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(users.email, userData.email)).returning();
          return updated;
        }
      }
      console.error("Error upserting user:", error);
      throw error;
    }
  }
  async createUser(user) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  // Asset management
  async getAsset(id) {
    const result = await db.select().from(assets).where(eq(assets.id, id)).limit(1);
    return result[0];
  }
  async getAssetBySymbol(symbol) {
    const result = await db.select().from(assets).where(eq(assets.symbol, symbol)).limit(1);
    return result[0];
  }
  async getAssets(filters) {
    let query = db.select().from(assets);
    const conditions = [];
    if (filters?.type) {
      conditions.push(eq(assets.type, filters.type));
    }
    if (filters?.search) {
      conditions.push(
        sql`(
          ${assets.name} ILIKE ${`%${filters.search}%`} OR 
          ${assets.symbol} ILIKE ${`%${filters.search}%`} OR 
          ${assets.description} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    if (filters?.publisher) {
      conditions.push(sql`${assets.metadata}->>'publisher' = ${filters.publisher}`);
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    const limit = filters?.limit ?? 100;
    query = query.limit(limit);
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query.orderBy(desc(assets.createdAt));
  }
  async createAsset(asset) {
    const result = await db.insert(assets).values(asset).returning();
    return result[0];
  }
  async updateAsset(id, asset) {
    const result = await db.update(assets).set(asset).where(eq(assets.id, id)).returning();
    return result[0];
  }
  async deleteAsset(id) {
    const result = await db.delete(assets).where(eq(assets.id, id));
    return result.rowCount > 0;
  }
  // Market data
  async getLatestMarketData(assetId, timeframe) {
    let query = db.select().from(marketData).where(eq(marketData.assetId, assetId));
    if (timeframe) {
      query = query.where(and(eq(marketData.assetId, assetId), eq(marketData.timeframe, timeframe)));
    }
    const result = await query.orderBy(desc(marketData.periodStart)).limit(1);
    return result[0];
  }
  async getMarketDataHistory(assetId, timeframe, limit, from, to) {
    let query = db.select().from(marketData).where(and(eq(marketData.assetId, assetId), eq(marketData.timeframe, timeframe)));
    if (from && to) {
      query = query.where(and(
        eq(marketData.assetId, assetId),
        eq(marketData.timeframe, timeframe),
        sql`${marketData.periodStart} BETWEEN ${from} AND ${to}`
      ));
    }
    query = query.orderBy(desc(marketData.periodStart));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  async createMarketData(data) {
    const result = await db.insert(marketData).values(data).returning();
    return result[0];
  }
  async getBulkLatestMarketData(assetIds, timeframe) {
    let query = db.select().from(marketData).where(inArray(marketData.assetId, assetIds));
    if (timeframe) {
      query = query.where(and(inArray(marketData.assetId, assetIds), eq(marketData.timeframe, timeframe)));
    }
    return await query.orderBy(desc(marketData.periodStart));
  }
  async createBulkMarketData(marketDataList) {
    if (marketDataList.length === 0) return [];
    const result = await db.insert(marketData).values(marketDataList).returning();
    return result;
  }
  // Price history (graded comic book pricing)
  async createPriceHistory(data) {
    const [result] = await db.insert(priceHistory).values(data).returning();
    return result;
  }
  async createPriceHistoryBatch(data) {
    if (data.length === 0) return [];
    const results = await db.insert(priceHistory).values(data).returning();
    return results;
  }
  async getPriceHistory(assetId, grade, days) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return await db.select().from(priceHistory).where(
      and(
        eq(priceHistory.assetId, assetId),
        eq(priceHistory.grade, grade),
        sql`${priceHistory.snapshotDate} >= ${cutoffDate}`
      )
    ).orderBy(desc(priceHistory.snapshotDate));
  }
  async getLatestPricesByGrade(assetId) {
    const latestPrices = await db.select().from(priceHistory).where(eq(priceHistory.assetId, assetId)).orderBy(desc(priceHistory.snapshotDate));
    const gradeMap = /* @__PURE__ */ new Map();
    for (const price of latestPrices) {
      if (!gradeMap.has(price.grade)) {
        gradeMap.set(price.grade, price);
      }
    }
    return Array.from(gradeMap.values());
  }
  async getPriceTrends(assetId, timeframe) {
    const days = timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const prices = await db.select().from(priceHistory).where(
      and(
        eq(priceHistory.assetId, assetId),
        sql`${priceHistory.snapshotDate} >= ${cutoffDate}`
      )
    ).orderBy(desc(priceHistory.snapshotDate));
    if (prices.length === 0) {
      return {
        assetId,
        timeframe,
        percentChange: 0,
        priceChange: 0,
        high: 0,
        low: 0,
        average: 0
      };
    }
    const priceValues = prices.map((p) => parseFloat(p.price));
    const currentPrice = priceValues[0];
    const oldestPrice = priceValues[priceValues.length - 1];
    const high = Math.max(...priceValues);
    const low = Math.min(...priceValues);
    const average = priceValues.reduce((sum, val) => sum + val, 0) / priceValues.length;
    const priceChange = currentPrice - oldestPrice;
    const percentChange = oldestPrice > 0 ? priceChange / oldestPrice * 100 : 0;
    return {
      assetId,
      timeframe,
      percentChange: parseFloat(percentChange.toFixed(2)),
      priceChange: parseFloat(priceChange.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      average: parseFloat(average.toFixed(2))
    };
  }
  // Portfolio management
  async getPortfolio(id) {
    const result = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
    return result[0];
  }
  async getUserPortfolios(userId) {
    return await db.select().from(portfolios).where(eq(portfolios.userId, userId)).orderBy(desc(portfolios.createdAt));
  }
  async createPortfolio(portfolio) {
    const result = await db.insert(portfolios).values(portfolio).returning();
    return result[0];
  }
  async updatePortfolio(id, portfolio) {
    const result = await db.update(portfolios).set(portfolio).where(eq(portfolios.id, id)).returning();
    return result[0];
  }
  async deletePortfolio(id) {
    const result = await db.delete(portfolios).where(eq(portfolios.id, id));
    return result.rowCount > 0;
  }
  // Holdings
  async getPortfolioHoldings(portfolioId) {
    return await db.select().from(holdings).where(eq(holdings.portfolioId, portfolioId));
  }
  async getHolding(portfolioId, assetId) {
    const result = await db.select().from(holdings).where(and(eq(holdings.portfolioId, portfolioId), eq(holdings.assetId, assetId))).limit(1);
    return result[0];
  }
  async createHolding(holding) {
    const result = await db.insert(holdings).values(holding).returning();
    return result[0];
  }
  async updateHolding(id, holding) {
    const result = await db.update(holdings).set(holding).where(eq(holdings.id, id)).returning();
    return result[0];
  }
  async deleteHolding(id) {
    const result = await db.delete(holdings).where(eq(holdings.id, id));
    return result.rowCount > 0;
  }
  // Market insights
  async getMarketInsights(filters) {
    let query = db.select().from(marketInsights);
    const conditions = [];
    if (filters?.assetId) {
      conditions.push(eq(marketInsights.assetId, filters.assetId));
    }
    if (filters?.category) {
      conditions.push(eq(marketInsights.category, filters.category));
    }
    if (filters?.isActive !== void 0) {
      conditions.push(eq(marketInsights.isActive, filters.isActive));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(marketInsights.createdAt));
  }
  async createMarketInsight(insight) {
    const result = await db.insert(marketInsights).values(insight).returning();
    return result[0];
  }
  async updateMarketInsight(id, insight) {
    const result = await db.update(marketInsights).set(insight).where(eq(marketInsights.id, id)).returning();
    return result[0];
  }
  // Market indices
  async getMarketIndex(symbol) {
    const result = await db.select().from(marketIndices).where(eq(marketIndices.symbol, symbol)).limit(1);
    return result[0];
  }
  async getMarketIndices() {
    return await db.select().from(marketIndices).orderBy(desc(marketIndices.createdAt));
  }
  async createMarketIndex(index2) {
    const result = await db.insert(marketIndices).values(index2).returning();
    return result[0];
  }
  async updateMarketIndex(id, index2) {
    const result = await db.update(marketIndices).set(index2).where(eq(marketIndices.id, id)).returning();
    return result[0];
  }
  // Market index data
  async getLatestMarketIndexData(indexId, timeframe) {
    let query = db.select().from(marketIndexData).where(eq(marketIndexData.indexId, indexId));
    if (timeframe) {
      query = query.where(and(eq(marketIndexData.indexId, indexId), eq(marketIndexData.timeframe, timeframe)));
    }
    const result = await query.orderBy(desc(marketIndexData.periodStart)).limit(1);
    return result[0];
  }
  async getMarketIndexDataHistory(indexId, timeframe, limit, from, to) {
    let query = db.select().from(marketIndexData).where(and(eq(marketIndexData.indexId, indexId), eq(marketIndexData.timeframe, timeframe)));
    if (from && to) {
      query = query.where(and(
        eq(marketIndexData.indexId, indexId),
        eq(marketIndexData.timeframe, timeframe),
        sql`${marketIndexData.periodStart} BETWEEN ${from} AND ${to}`
      ));
    }
    query = query.orderBy(desc(marketIndexData.periodStart));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  async createMarketIndexData(indexData) {
    const result = await db.insert(marketIndexData).values(indexData).returning();
    return result[0];
  }
  // Watchlists
  async getUserWatchlists(userId) {
    return await db.select().from(watchlists).where(eq(watchlists.userId, userId)).orderBy(desc(watchlists.createdAt));
  }
  async getWatchlistAssets(watchlistId) {
    return await db.select().from(watchlistAssets).where(eq(watchlistAssets.watchlistId, watchlistId));
  }
  async createWatchlist(watchlist) {
    const result = await db.insert(watchlists).values(watchlist).returning();
    return result[0];
  }
  async addAssetToWatchlist(watchlistAsset) {
    const result = await db.insert(watchlistAssets).values(watchlistAsset).returning();
    return result[0];
  }
  async removeAssetFromWatchlist(watchlistId, assetId) {
    const result = await db.delete(watchlistAssets).where(and(eq(watchlistAssets.watchlistId, watchlistId), eq(watchlistAssets.assetId, assetId)));
    return result.rowCount > 0;
  }
  async deleteWatchlist(id) {
    const result = await db.delete(watchlists).where(eq(watchlists.id, id));
    return result.rowCount > 0;
  }
  // Orders
  async getOrder(id) {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }
  async getUserOrders(userId, status) {
    let query = db.select().from(orders).where(eq(orders.userId, userId));
    if (status) {
      query = query.where(and(eq(orders.userId, userId), eq(orders.status, status)));
    }
    return await query.orderBy(desc(orders.createdAt));
  }
  async getOrdersByStatus(status) {
    return await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt));
  }
  async createOrder(order) {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }
  async updateOrder(id, order) {
    const result = await db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return result[0];
  }
  async deleteOrder(id) {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.rowCount > 0;
  }
  async cancelOrder(id) {
    const result = await db.update(orders).set({ status: "cancelled", updatedAt: /* @__PURE__ */ new Date() }).where(eq(orders.id, id)).returning();
    return result[0];
  }
  // Market events
  async getMarketEvents(filters) {
    let query = db.select().from(marketEvents);
    const conditions = [];
    if (filters?.isActive !== void 0) {
      conditions.push(eq(marketEvents.isActive, filters.isActive));
    }
    if (filters?.category) {
      conditions.push(eq(marketEvents.category, filters.category));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(marketEvents.createdAt));
  }
  async createMarketEvent(event) {
    const result = await db.insert(marketEvents).values(event).returning();
    return result[0];
  }
  async updateMarketEvent(id, event) {
    const result = await db.update(marketEvents).set(event).where(eq(marketEvents.id, id)).returning();
    return result[0];
  }
  // Beat the AI - Implementation stubs (simplified for this task)
  async getBeatTheAIChallenge(id) {
    const result = await db.select().from(beatTheAIChallenge).where(eq(beatTheAIChallenge.id, id)).limit(1);
    return result[0];
  }
  async getBeatTheAIChallenges(filters) {
    return await db.select().from(beatTheAIChallenge);
  }
  async createBeatTheAIChallenge(challenge) {
    const result = await db.insert(beatTheAIChallenge).values(challenge).returning();
    return result[0];
  }
  async updateBeatTheAIChallenge(id, challenge) {
    const result = await db.update(beatTheAIChallenge).set(challenge).where(eq(beatTheAIChallenge.id, id)).returning();
    return result[0];
  }
  async getBeatTheAIPrediction(id) {
    const result = await db.select().from(beatTheAIPrediction).where(eq(beatTheAIPrediction.id, id)).limit(1);
    return result[0];
  }
  async getBeatTheAIPredictions(filters) {
    return await db.select().from(beatTheAIPrediction);
  }
  async createBeatTheAIPrediction(prediction) {
    const result = await db.insert(beatTheAIPrediction).values(prediction).returning();
    return result[0];
  }
  async updateBeatTheAIPrediction(id, prediction) {
    const result = await db.update(beatTheAIPrediction).set(prediction).where(eq(beatTheAIPrediction.id, id)).returning();
    return result[0];
  }
  async getBeatTheAILeaderboard(limit) {
    return await db.select().from(beatTheAILeaderboard);
  }
  async getBeatTheAILeaderboardEntry(userId) {
    const result = await db.select().from(beatTheAILeaderboard).where(eq(beatTheAILeaderboard.userId, userId)).limit(1);
    return result[0];
  }
  async createBeatTheAILeaderboardEntry(entry) {
    const result = await db.insert(beatTheAILeaderboard).values(entry).returning();
    return result[0];
  }
  async updateBeatTheAILeaderboardEntry(userId, entry) {
    const result = await db.update(beatTheAILeaderboard).set(entry).where(eq(beatTheAILeaderboard.userId, userId)).returning();
    return result[0];
  }
  async recalculateLeaderboard() {
  }
  async getComicGradingPrediction(id) {
    const result = await db.select().from(comicGradingPredictions).where(eq(comicGradingPredictions.id, id)).limit(1);
    return result[0];
  }
  async getComicGradingPredictions(filters) {
    return await db.select().from(comicGradingPredictions);
  }
  async createComicGradingPrediction(prediction) {
    const result = await db.insert(comicGradingPredictions).values(prediction).returning();
    return result[0];
  }
  async updateComicGradingPrediction(id, prediction) {
    const result = await db.update(comicGradingPredictions).set(prediction).where(eq(comicGradingPredictions.id, id)).returning();
    return result[0];
  }
  // Vector similarity search operations (simplified implementations for this task)
  async findSimilarAssets(assetId, limit = 10, threshold = 0.7) {
    const result = await db.execute(sql`
      WITH target AS (
        SELECT metadata_embedding FROM ${assets} WHERE id = ${assetId}
      )
      SELECT *, 
             (1 - (metadata_embedding <=> target.metadata_embedding)) as similarity_score
      FROM ${assets}, target
      WHERE metadata_embedding IS NOT NULL
        AND id != ${assetId}
        AND (1 - (metadata_embedding <=> target.metadata_embedding)) > ${threshold}
      ORDER BY metadata_embedding <=> target.metadata_embedding
      LIMIT ${limit}
    `);
    return result.rows;
  }
  async findSimilarAssetsByEmbedding(embedding, limit = 10, threshold = 0.7) {
    const vectorString = `[${embedding.join(",")}]`;
    const result = await db.execute(sql`
      SELECT *, 
             (1 - (metadata_embedding <=> ${vectorString}::vector)) as similarity_score
      FROM ${assets}
      WHERE metadata_embedding IS NOT NULL
        AND (1 - (metadata_embedding <=> ${vectorString}::vector)) > ${threshold}
      ORDER BY metadata_embedding <=> ${vectorString}::vector
      LIMIT ${limit}
    `);
    return result.rows;
  }
  async updateAssetEmbedding(assetId, embedding) {
    const vectorString = `[${embedding.join(",")}]`;
    const result = await db.update(assets).set({ metadataEmbedding: sql`${vectorString}::vector` }).where(eq(assets.id, assetId));
    return result.rowCount > 0;
  }
  async getAssetsWithoutEmbeddings(limit = 50) {
    return await db.select().from(assets).where(sql`metadata_embedding IS NULL`).limit(limit);
  }
  // Simplified implementations for other vector methods
  async findSimilarComicsByImage() {
    return [];
  }
  async findSimilarComicsByImageEmbedding() {
    return [];
  }
  async updateComicImageEmbedding() {
    return true;
  }
  async getComicGradingsWithoutEmbeddings() {
    return [];
  }
  async searchMarketInsightsByContent() {
    return [];
  }
  async findSimilarMarketInsights() {
    return [];
  }
  async findSimilarMarketInsightsByEmbedding() {
    return [];
  }
  async updateMarketInsightEmbedding() {
    return true;
  }
  async getMarketInsightsWithoutEmbeddings() {
    return [];
  }
  async findSimilarPricePatterns() {
    return [];
  }
  async findSimilarPricePatternsByEmbedding() {
    return [];
  }
  async updateMarketDataEmbedding() {
    return true;
  }
  async getMarketDataWithoutEmbeddings() {
    return [];
  }
  async calculateVectorSimilarity() {
    return 0;
  }
  async batchUpdateEmbeddings() {
    return true;
  }
  async createVectorIndices() {
    return true;
  }
  async refreshVectorIndices() {
    return true;
  }
  async getVectorIndexStatus() {
    return [];
  }
  async searchAssetsWithSimilarity(query, filters, limit = 20) {
    const allAssets = await this.getAssets(filters);
    const queryLower = query.toLowerCase();
    return allAssets.map((asset) => {
      let score = 0;
      if (asset.name.toLowerCase().includes(queryLower)) score += 0.6;
      if (asset.symbol.toLowerCase().includes(queryLower)) score += 0.4;
      if (asset.description?.toLowerCase().includes(queryLower)) score += 0.3;
      const metadata = asset.metadata;
      if (metadata?.publisher?.toLowerCase().includes(queryLower)) score += 0.3;
      if (metadata?.tags?.some((tag) => tag.toLowerCase().includes(queryLower))) score += 0.2;
      return { ...asset, searchScore: Math.min(score, 0.99) };
    }).filter((a) => a.searchScore >= 0.1).sort((a, b) => b.searchScore - a.searchScore).slice(0, limit);
  }
  async getRecommendationsForUser() {
    return { success: false, userId: "", recommendations: [], count: 0 };
  }
  async getPortfolioSimilarAssets() {
    return { success: false, portfolioId: "", similarAssets: [], count: 0 };
  }
  // Comic Series management
  async getComicSeries(id) {
    const result = await db.select().from(comicSeries).where(eq(comicSeries.id, id)).limit(1);
    return result[0];
  }
  async getComicSeriesList(filters) {
    let query = db.select().from(comicSeries);
    const conditions = [];
    if (filters?.publisher) {
      conditions.push(ilike(comicSeries.publisher, `%${filters.publisher}%`));
    }
    if (filters?.year) {
      conditions.push(eq(comicSeries.year, filters.year));
    }
    if (filters?.search) {
      conditions.push(
        sql`(
          ${comicSeries.seriesName} ILIKE ${`%${filters.search}%`} OR 
          ${comicSeries.description} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(comicSeries.createdAt));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  async createComicSeries(series) {
    const result = await db.insert(comicSeries).values(series).returning();
    return result[0];
  }
  async updateComicSeries(id, series) {
    const result = await db.update(comicSeries).set(series).where(eq(comicSeries.id, id)).returning();
    return result[0];
  }
  async deleteComicSeries(id) {
    const result = await db.delete(comicSeries).where(eq(comicSeries.id, id));
    return result.rowCount > 0;
  }
  async createBulkComicSeries(seriesList) {
    if (seriesList.length === 0) return [];
    const result = await db.insert(comicSeries).values(seriesList).returning();
    return result;
  }
  // Comic Issues management
  async getComicIssue(id) {
    const result = await db.select().from(comicIssues).where(eq(comicIssues.id, id)).limit(1);
    return result[0];
  }
  async getComicIssues(filters) {
    let query = db.select().from(comicIssues);
    const conditions = [];
    if (filters?.seriesId) {
      conditions.push(eq(comicIssues.seriesId, filters.seriesId));
    }
    if (filters?.search) {
      conditions.push(
        sql`(
          ${comicIssues.issueTitle} ILIKE ${`%${filters.search}%`} OR 
          ${comicIssues.issueDescription} ILIKE ${`%${filters.search}%`} OR
          ${comicIssues.comicName} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    if (filters?.writer) {
      conditions.push(ilike(comicIssues.writer, `%${filters.writer}%`));
    }
    if (filters?.artist) {
      conditions.push(
        sql`(
          ${comicIssues.penciler} ILIKE ${`%${filters.artist}%`} OR 
          ${comicIssues.coverArtist} ILIKE ${`%${filters.artist}%`}
        )`
      );
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(comicIssues.createdAt));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  async getComicIssuesBySeriesId(seriesId) {
    return await db.select().from(comicIssues).where(eq(comicIssues.seriesId, seriesId)).orderBy(comicIssues.issueNumber);
  }
  async createComicIssue(issue) {
    const result = await db.insert(comicIssues).values(issue).returning();
    return result[0];
  }
  async updateComicIssue(id, issue) {
    const result = await db.update(comicIssues).set(issue).where(eq(comicIssues.id, id)).returning();
    return result[0];
  }
  async deleteComicIssue(id) {
    const result = await db.delete(comicIssues).where(eq(comicIssues.id, id));
    return result.rowCount > 0;
  }
  async createBulkComicIssues(issuesList) {
    if (issuesList.length === 0) return [];
    const result = await db.insert(comicIssues).values(issuesList).returning();
    return result;
  }
  // Comic Creators management
  async getComicCreator(id) {
    const result = await db.select().from(comicCreators).where(eq(comicCreators.id, id)).limit(1);
    return result[0];
  }
  async getComicCreators(filters) {
    let query = db.select().from(comicCreators);
    const conditions = [];
    if (filters?.role) {
      conditions.push(eq(comicCreators.role, filters.role));
    }
    if (filters?.search) {
      conditions.push(
        sql`(
          ${comicCreators.name} ILIKE ${`%${filters.search}%`} OR 
          ${comicCreators.biography} ILIKE ${`%${filters.search}%`}
        )`
      );
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(comicCreators.marketInfluence));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  async getComicCreatorByName(name) {
    const result = await db.select().from(comicCreators).where(eq(comicCreators.name, name)).limit(1);
    return result[0];
  }
  async createComicCreator(creator) {
    const result = await db.insert(comicCreators).values(creator).returning();
    return result[0];
  }
  async updateComicCreator(id, creator) {
    const result = await db.update(comicCreators).set(creator).where(eq(comicCreators.id, id)).returning();
    return result[0];
  }
  async deleteComicCreator(id) {
    const result = await db.delete(comicCreators).where(eq(comicCreators.id, id));
    return result.rowCount > 0;
  }
  // Featured Comics management
  async getFeaturedComic(id) {
    const result = await db.select().from(featuredComics).where(eq(featuredComics.id, id)).limit(1);
    return result[0];
  }
  async getFeaturedComics(filters) {
    let query = db.select().from(featuredComics);
    const conditions = [];
    if (filters?.featureType) {
      conditions.push(eq(featuredComics.featureType, filters.featureType));
    }
    if (filters?.isActive !== void 0) {
      conditions.push(eq(featuredComics.isActive, filters.isActive));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(featuredComics.displayOrder);
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  async createFeaturedComic(featured) {
    const result = await db.insert(featuredComics).values(featured).returning();
    return result[0];
  }
  async updateFeaturedComic(id, featured) {
    const result = await db.update(featuredComics).set(featured).where(eq(featuredComics.id, id)).returning();
    return result[0];
  }
  async deleteFeaturedComic(id) {
    const result = await db.delete(featuredComics).where(eq(featuredComics.id, id));
    return result.rowCount > 0;
  }
  // Comic data aggregation for dashboards
  async getComicMetrics() {
    const [seriesCount, issuesCount, creatorsCount] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(comicSeries),
      db.select({ count: sql`count(*)` }).from(comicIssues),
      db.select({ count: sql`count(*)` }).from(comicCreators)
    ]);
    const coversCount = await db.select({ count: sql`count(*)` }).from(comicSeries).where(sql`${comicSeries.featuredCoverUrl} IS NOT NULL OR ${comicSeries.coversUrl} IS NOT NULL`);
    return {
      totalSeries: seriesCount[0]?.count || 0,
      totalIssues: issuesCount[0]?.count || 0,
      totalCreators: creatorsCount[0]?.count || 0,
      totalCovers: coversCount[0]?.count || 0
    };
  }
  async getFeaturedComicsCount() {
    const result = await db.select({ count: sql`count(*)` }).from(featuredComics);
    return result[0]?.count || 0;
  }
  async getTrendingComicSeries(limit) {
    let query = db.select().from(comicSeries).where(sql`${comicSeries.featuredCoverUrl} IS NOT NULL OR ${comicSeries.coversUrl} IS NOT NULL`).orderBy(desc(comicSeries.year));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  async getFeaturedComicsForHomepage() {
    return this.getFeaturedComics({ isActive: true, limit: 10 });
  }
  // =========================================================================
  // PHASE 1 TRADING EXTENSIONS
  // =========================================================================
  // Trading Sessions
  async getTradingSession(id) {
    const result = await db.select().from(tradingSessions).where(eq(tradingSessions.id, id)).limit(1);
    return result[0];
  }
  async getUserTradingSessions(userId, isActive) {
    let query = db.select().from(tradingSessions).where(eq(tradingSessions.userId, userId));
    if (isActive !== void 0) {
      query = query.where(and(eq(tradingSessions.userId, userId), eq(tradingSessions.isActive, isActive)));
    }
    return await query.orderBy(desc(tradingSessions.sessionStart));
  }
  async getActiveTradingSession(userId) {
    const result = await db.select().from(tradingSessions).where(and(eq(tradingSessions.userId, userId), eq(tradingSessions.isActive, true))).limit(1);
    return result[0];
  }
  async createTradingSession(session) {
    const result = await db.insert(tradingSessions).values(session).returning();
    return result[0];
  }
  async updateTradingSession(id, session) {
    const result = await db.update(tradingSessions).set(session).where(eq(tradingSessions.id, id)).returning();
    return result[0];
  }
  async endTradingSession(id, endingBalance, sessionStats) {
    const result = await db.update(tradingSessions).set({
      sessionEnd: /* @__PURE__ */ new Date(),
      endingBalance,
      isActive: false,
      ...sessionStats
    }).where(eq(tradingSessions.id, id)).returning();
    return result[0];
  }
  // Asset Current Prices  
  async getAssetCurrentPrice(assetId) {
    const result = await db.select().from(assetCurrentPrices).where(eq(assetCurrentPrices.assetId, assetId)).limit(1);
    return result[0];
  }
  async getAssetCurrentPrices(assetIds) {
    return await db.select().from(assetCurrentPrices).where(inArray(assetCurrentPrices.assetId, assetIds));
  }
  async getAllAssetCurrentPrices(marketStatus, limit = 1e3) {
    let query = db.select().from(assetCurrentPrices);
    if (marketStatus) {
      query = query.where(eq(assetCurrentPrices.marketStatus, marketStatus));
    }
    return await query.orderBy(desc(assetCurrentPrices.updatedAt)).limit(limit);
  }
  async getAssetsWithPrices(limit = 100) {
    const results = await db.select({
      asset: assets,
      price: assetCurrentPrices
    }).from(assets).innerJoin(assetCurrentPrices, eq(assets.id, assetCurrentPrices.assetId)).orderBy(desc(assetCurrentPrices.updatedAt)).limit(limit);
    return results;
  }
  async createAssetCurrentPrice(price) {
    const result = await db.insert(assetCurrentPrices).values(price).returning();
    return result[0];
  }
  async updateAssetCurrentPrice(assetId, price) {
    const result = await db.update(assetCurrentPrices).set({ ...price, updatedAt: /* @__PURE__ */ new Date() }).where(eq(assetCurrentPrices.assetId, assetId)).returning();
    return result[0];
  }
  async updateBulkAssetPrices(prices) {
    if (prices.length === 0) return [];
    const results = [];
    for (const price of prices) {
      if (price.assetId) {
        const result = await this.updateAssetCurrentPrice(price.assetId, price);
        if (result) results.push(result);
      }
    }
    return results;
  }
  // Trading Limits
  async getTradingLimit(id) {
    const result = await db.select().from(tradingLimits).where(eq(tradingLimits.id, id)).limit(1);
    return result[0];
  }
  async getUserTradingLimits(userId, isActive) {
    let query = db.select().from(tradingLimits).where(eq(tradingLimits.userId, userId));
    if (isActive !== void 0) {
      query = query.where(and(eq(tradingLimits.userId, userId), eq(tradingLimits.isActive, isActive)));
    }
    return await query.orderBy(desc(tradingLimits.createdAt));
  }
  async getUserTradingLimitsByType(userId, limitType) {
    return await db.select().from(tradingLimits).where(and(eq(tradingLimits.userId, userId), eq(tradingLimits.limitType, limitType))).orderBy(desc(tradingLimits.createdAt));
  }
  async createTradingLimit(limit) {
    const result = await db.insert(tradingLimits).values(limit).returning();
    return result[0];
  }
  async updateTradingLimit(id, limit) {
    const result = await db.update(tradingLimits).set({ ...limit, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tradingLimits.id, id)).returning();
    return result[0];
  }
  async deleteTradingLimit(id) {
    const result = await db.delete(tradingLimits).where(eq(tradingLimits.id, id));
    return result.rowCount > 0;
  }
  async checkTradingLimitBreach(userId, limitType, proposedValue, assetId) {
    let query = db.select().from(tradingLimits).where(and(
      eq(tradingLimits.userId, userId),
      eq(tradingLimits.limitType, limitType),
      eq(tradingLimits.isActive, true)
    ));
    if (assetId) {
      query = query.where(and(
        eq(tradingLimits.userId, userId),
        eq(tradingLimits.limitType, limitType),
        eq(tradingLimits.isActive, true),
        eq(tradingLimits.assetId, assetId)
      ));
    }
    const limits = await query;
    for (const limit of limits) {
      const currentUsage = parseFloat(limit.currentUsage);
      const limitValue = parseFloat(limit.limitValue);
      const newUsage = currentUsage + proposedValue;
      if (newUsage > limitValue) {
        return {
          canProceed: false,
          limit,
          exceedsBy: newUsage - limitValue
        };
      }
    }
    return { canProceed: true };
  }
  async resetUserTradingLimits(userId, resetPeriod) {
    const result = await db.update(tradingLimits).set({
      currentUsage: "0.00",
      lastReset: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(and(
      eq(tradingLimits.userId, userId),
      eq(tradingLimits.resetPeriod, resetPeriod),
      eq(tradingLimits.isActive, true)
    ));
    return result.rowCount > 0;
  }
  // Enhanced User Trading Operations
  async updateUserTradingBalance(userId, amount) {
    const result = await db.update(users).set({
      virtualTradingBalance: amount,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return result[0];
  }
  async resetUserDailyLimits(userId) {
    const result = await db.update(users).set({
      dailyTradingUsed: "0.00",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return result[0];
  }
  async getUserDefaultPortfolio(userId) {
    const result = await db.select().from(portfolios).where(and(eq(portfolios.userId, userId), eq(portfolios.isDefault, true))).limit(1);
    return result[0];
  }
  async createUserDefaultPortfolio(userId, initialCash) {
    const portfolioData = {
      userId,
      name: "Default Trading Portfolio",
      description: "Your primary trading portfolio",
      isDefault: true,
      cashBalance: initialCash,
      initialCashAllocation: initialCash,
      portfolioType: "default"
    };
    const result = await db.insert(portfolios).values(portfolioData).returning();
    return result[0];
  }
  // Portfolio Cash Management
  async updatePortfolioCashBalance(portfolioId, amount, operation) {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) return void 0;
    let newBalance;
    const currentBalance = parseFloat(portfolio.cashBalance || "0");
    const changeAmount = parseFloat(amount);
    switch (operation) {
      case "add":
        newBalance = (currentBalance + changeAmount).toFixed(2);
        break;
      case "subtract":
        newBalance = (currentBalance - changeAmount).toFixed(2);
        break;
      case "set":
        newBalance = changeAmount.toFixed(2);
        break;
      default:
        return void 0;
    }
    const result = await db.update(portfolios).set({
      cashBalance: newBalance,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(portfolios.id, portfolioId)).returning();
    return result[0];
  }
  async getPortfolioAvailableCash(portfolioId) {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) {
      return { cashBalance: "0.00", reservedCash: "0.00", availableCash: "0.00" };
    }
    const pendingOrders = await this.getUserOrders(portfolio.userId, "pending");
    const reservedCash = pendingOrders.filter((order) => order.portfolioId === portfolioId && order.type === "buy").reduce((total, order) => total + parseFloat(order.totalValue || "0"), 0);
    const cashBalance = parseFloat(portfolio.cashBalance || "0");
    const availableCash = Math.max(0, cashBalance - reservedCash);
    return {
      cashBalance: cashBalance.toFixed(2),
      reservedCash: reservedCash.toFixed(2),
      availableCash: availableCash.toFixed(2)
    };
  }
  // LEADERBOARD SYSTEM IMPLEMENTATION
  // Trader Statistics
  async getTraderStats(userId) {
    const result = await db.select().from(traderStats).where(eq(traderStats.userId, userId)).limit(1);
    return result[0];
  }
  async getAllTraderStats(filters) {
    let query = db.select().from(traderStats);
    const conditions = [];
    if (filters?.minTrades) {
      conditions.push(sql`${traderStats.totalTrades} >= ${filters.minTrades}`);
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(traderStats.rankPoints));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query;
  }
  async createTraderStats(stats) {
    const result = await db.insert(traderStats).values(stats).returning();
    return result[0];
  }
  async updateTraderStats(userId, stats) {
    const result = await db.update(traderStats).set({ ...stats, updatedAt: /* @__PURE__ */ new Date() }).where(eq(traderStats.userId, userId)).returning();
    return result[0];
  }
  async updateTraderStatsFromTrade(userId, tradeData) {
    let currentStats = await this.getTraderStats(userId);
    if (!currentStats) {
      currentStats = await this.createTraderStats({
        userId,
        totalPortfolioValue: tradeData.portfolioValue,
        totalTrades: 1,
        profitableTrades: tradeData.isProfitable ? 1 : 0,
        totalTradingVolume: tradeData.volume,
        firstTradeDate: /* @__PURE__ */ new Date(),
        lastTradeDate: /* @__PURE__ */ new Date()
      });
    }
    const newTotalTrades = currentStats.totalTrades + 1;
    const newProfitableTrades = currentStats.profitableTrades + (tradeData.isProfitable ? 1 : 0);
    const newWinRate = newProfitableTrades / newTotalTrades * 100;
    const currentVolume = parseFloat(currentStats.totalTradingVolume || "0");
    const newVolume = currentVolume + parseFloat(tradeData.volume);
    const newAvgTradeSize = newVolume / newTotalTrades;
    const currentPnL = parseFloat(currentStats.totalPnL || "0");
    const tradePnL = parseFloat(tradeData.pnl);
    const newTotalPnL = currentPnL + tradePnL;
    let newWinningStreak = currentStats.currentWinningStreak;
    let newLosingStreak = currentStats.currentLosingStreak;
    if (tradeData.isProfitable) {
      newWinningStreak += 1;
      newLosingStreak = 0;
    } else {
      newLosingStreak += 1;
      newWinningStreak = 0;
    }
    const rankPoints = this.calculateRankPoints(newTotalPnL, newWinRate, newVolume, newTotalTrades);
    return await this.updateTraderStats(userId, {
      totalPortfolioValue: tradeData.portfolioValue,
      totalPnL: newTotalPnL.toFixed(2),
      totalTrades: newTotalTrades,
      profitableTrades: newProfitableTrades,
      winRate: newWinRate.toFixed(2),
      averageTradeSize: newAvgTradeSize.toFixed(2),
      totalTradingVolume: newVolume.toFixed(2),
      currentWinningStreak: newWinningStreak,
      currentLosingStreak: newLosingStreak,
      longestWinningStreak: Math.max(currentStats.longestWinningStreak, newWinningStreak),
      longestLosingStreak: Math.max(currentStats.longestLosingStreak, newLosingStreak),
      biggestWin: tradePnL > 0 ? Math.max(parseFloat(currentStats.biggestWin || "0"), tradePnL).toFixed(2) : currentStats.biggestWin,
      biggestLoss: tradePnL < 0 ? Math.min(parseFloat(currentStats.biggestLoss || "0"), tradePnL).toFixed(2) : currentStats.biggestLoss,
      rankPoints: rankPoints.toFixed(2),
      lastTradeDate: /* @__PURE__ */ new Date()
    });
  }
  calculateRankPoints(totalPnL, winRate, volume, totalTrades) {
    const pnlScore = Math.max(0, totalPnL) * 0.4;
    const winRateScore = winRate * 2;
    const volumeScore = Math.log10(Math.max(1, volume)) * 100;
    const activityScore = Math.min(totalTrades, 1e3) * 0.1;
    return pnlScore + winRateScore + volumeScore + activityScore;
  }
  async recalculateAllTraderStats() {
    const allUsers = await db.select({ id: users.id }).from(users);
    for (const user of allUsers) {
      const userOrders = await this.getUserOrders(user.id, "filled");
      if (userOrders.length > 0) {
        let totalVolume = 0;
        let totalPnL = 0;
        let profitableTrades = 0;
        for (const order of userOrders) {
          totalVolume += parseFloat(order.totalValue || "0");
          if (order.type === "sell") {
            totalPnL += parseFloat(order.totalValue || "0") - parseFloat(order.averageFillPrice || order.price || "0") * parseFloat(order.quantity || "0");
            if (totalPnL > 0) profitableTrades++;
          }
        }
        await this.updateTraderStats(user.id, {
          totalTrades: userOrders.length,
          profitableTrades,
          winRate: (profitableTrades / userOrders.length * 100).toFixed(2),
          totalTradingVolume: totalVolume.toFixed(2),
          totalPnL: totalPnL.toFixed(2),
          rankPoints: this.calculateRankPoints(totalPnL, profitableTrades / userOrders.length * 100, totalVolume, userOrders.length).toFixed(2)
        });
      }
    }
  }
  async getTopTradersByMetric(metric, limit) {
    let orderByField;
    switch (metric) {
      case "totalPnL":
        orderByField = desc(traderStats.totalPnL);
        break;
      case "winRate":
        orderByField = desc(traderStats.winRate);
        break;
      case "totalTradingVolume":
        orderByField = desc(traderStats.totalTradingVolume);
        break;
      case "roiPercentage":
        orderByField = desc(traderStats.roiPercentage);
        break;
    }
    let query = db.select().from(traderStats).orderBy(orderByField);
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  // Leaderboard Categories
  async getLeaderboardCategory(id) {
    const result = await db.select().from(leaderboardCategories).where(eq(leaderboardCategories.id, id)).limit(1);
    return result[0];
  }
  async getLeaderboardCategories(filters) {
    let query = db.select().from(leaderboardCategories);
    const conditions = [];
    if (filters?.isActive !== void 0) {
      conditions.push(eq(leaderboardCategories.isActive, filters.isActive));
    }
    if (filters?.timeframe) {
      conditions.push(eq(leaderboardCategories.timeframe, filters.timeframe));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(leaderboardCategories.displayOrder);
  }
  async createLeaderboardCategory(category) {
    const result = await db.insert(leaderboardCategories).values(category).returning();
    return result[0];
  }
  async updateLeaderboardCategory(id, category) {
    const result = await db.update(leaderboardCategories).set({ ...category, updatedAt: /* @__PURE__ */ new Date() }).where(eq(leaderboardCategories.id, id)).returning();
    return result[0];
  }
  async deleteLeaderboardCategory(id) {
    const result = await db.delete(leaderboardCategories).where(eq(leaderboardCategories.id, id));
    return result.rowCount > 0;
  }
  // Leaderboard Generation and Rankings
  async generateLeaderboard(categoryType, timeframe, limit) {
    const query = sql`
      SELECT ts.*, u.email, u."firstName", u."lastName", u."profileImageUrl",
             ROW_NUMBER() OVER (ORDER BY 
               CASE 
                 WHEN ${categoryType} = 'total_return' THEN ts.total_pnl::numeric
                 WHEN ${categoryType} = 'win_rate' THEN ts.win_rate::numeric
                 WHEN ${categoryType} = 'volume' THEN ts.total_trading_volume::numeric
                 WHEN ${categoryType} = 'roi' THEN ts.roi_percentage::numeric
                 ELSE ts.rank_points::numeric
               END DESC
             ) as rank
      FROM trader_stats ts
      JOIN users u ON ts.user_id = u.id
      WHERE ts.total_trades >= 1
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `;
    const result = await db.execute(query);
    return result.rows;
  }
  async getLeaderboardByCategoryId(categoryId, limit) {
    const category = await this.getLeaderboardCategory(categoryId);
    if (!category) return [];
    return await this.generateLeaderboard(category.categoryType, category.timeframe, limit);
  }
  async getUserRankInCategory(userId, categoryType, timeframe) {
    const userStats = await this.getTraderStats(userId);
    if (!userStats) return void 0;
    const rankQuery = sql`
      SELECT COUNT(*) + 1 as rank
      FROM trader_stats ts
      WHERE (
        CASE 
          WHEN ${categoryType} = 'total_return' THEN ts.total_pnl::numeric
          WHEN ${categoryType} = 'win_rate' THEN ts.win_rate::numeric
          WHEN ${categoryType} = 'volume' THEN ts.total_trading_volume::numeric
          WHEN ${categoryType} = 'roi' THEN ts.roi_percentage::numeric
          ELSE ts.rank_points::numeric
        END
      ) > (
        CASE 
          WHEN ${categoryType} = 'total_return' THEN ${userStats.totalPnL}::numeric
          WHEN ${categoryType} = 'win_rate' THEN ${userStats.winRate}::numeric
          WHEN ${categoryType} = 'volume' THEN ${userStats.totalTradingVolume}::numeric
          WHEN ${categoryType} = 'roi' THEN ${userStats.roiPercentage}::numeric
          ELSE ${userStats.rankPoints}::numeric
        END
      )
      AND ts.total_trades >= 1
    `;
    const totalQuery = sql`SELECT COUNT(*) as total FROM trader_stats WHERE total_trades >= 1`;
    const [rankResult, totalResult] = await Promise.all([
      db.execute(rankQuery),
      db.execute(totalQuery)
    ]);
    return {
      rank: Number(rankResult.rows[0]?.rank || 0),
      totalUsers: Number(totalResult.rows[0]?.total || 0),
      stats: userStats
    };
  }
  async updateLeaderboardRankings(categoryType) {
    const updateQuery = sql`
      UPDATE trader_stats 
      SET current_rank = ranked.rank
      FROM (
        SELECT user_id, 
               ROW_NUMBER() OVER (ORDER BY rank_points DESC) as rank
        FROM trader_stats 
        WHERE total_trades >= 1
      ) ranked
      WHERE trader_stats.user_id = ranked.user_id
    `;
    await db.execute(updateQuery);
  }
  // User Achievements
  async getUserAchievement(id) {
    const result = await db.select().from(userAchievements).where(eq(userAchievements.id, id)).limit(1);
    return result[0];
  }
  async getUserAchievements(userId, filters) {
    let query = db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
    const conditions = [eq(userAchievements.userId, userId)];
    if (filters?.category) {
      conditions.push(eq(userAchievements.category, filters.category));
    }
    if (filters?.tier) {
      conditions.push(eq(userAchievements.tier, filters.tier));
    }
    if (filters?.isVisible !== void 0) {
      conditions.push(eq(userAchievements.isVisible, filters.isVisible));
    }
    return await db.select().from(userAchievements).where(and(...conditions)).orderBy(desc(userAchievements.unlockedAt));
  }
  async createUserAchievement(achievement) {
    const result = await db.insert(userAchievements).values(achievement).returning();
    return result[0];
  }
  async updateUserAchievement(id, achievement) {
    const result = await db.update(userAchievements).set(achievement).where(eq(userAchievements.id, id)).returning();
    return result[0];
  }
  async deleteUserAchievement(id) {
    const result = await db.delete(userAchievements).where(eq(userAchievements.id, id));
    return result.rowCount > 0;
  }
  // Achievement Processing
  async checkAndAwardAchievements(userId, context) {
    const userStats = await this.getTraderStats(userId);
    if (!userStats) return [];
    const newAchievements = [];
    const achievementDefinitions = this.getAchievementDefinitions();
    for (const def of achievementDefinitions) {
      const existing = await db.select().from(userAchievements).where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, def.id)
      )).limit(1);
      if (existing.length > 0) continue;
      if (this.meetsAchievementCriteria(userStats, def)) {
        const achievement = await this.createUserAchievement({
          userId,
          achievementId: def.id,
          title: def.title,
          description: def.description,
          category: def.category,
          iconName: def.iconName,
          badgeColor: def.badgeColor,
          tier: def.tier,
          points: def.points,
          rarity: def.rarity,
          criteria: def.criteria,
          progress: def.progress
        });
        newAchievements.push(achievement);
      }
    }
    return newAchievements;
  }
  getAchievementDefinitions() {
    return [
      {
        id: "first_trade",
        title: "First Trade",
        description: "Complete your first trade",
        category: "trading",
        iconName: "TrendingUp",
        badgeColor: "blue",
        tier: "bronze",
        points: 10,
        rarity: "common",
        criteria: { minTrades: 1 },
        progress: {}
      },
      {
        id: "profit_milestone_1000",
        title: "$1,000 Profit",
        description: "Reach $1,000 in total profits",
        category: "profit",
        iconName: "DollarSign",
        badgeColor: "green",
        tier: "silver",
        points: 50,
        rarity: "rare",
        criteria: { minProfit: 1e3 },
        progress: {}
      },
      {
        id: "volume_trader_10k",
        title: "Volume Trader",
        description: "Trade $10,000 in total volume",
        category: "volume",
        iconName: "BarChart3",
        badgeColor: "purple",
        tier: "silver",
        points: 30,
        rarity: "rare",
        criteria: { minVolume: 1e4 },
        progress: {}
      },
      {
        id: "winning_streak_5",
        title: "Win Streak",
        description: "Achieve 5 profitable trades in a row",
        category: "streak",
        iconName: "Star",
        badgeColor: "yellow",
        tier: "gold",
        points: 25,
        rarity: "epic",
        criteria: { minWinStreak: 5 },
        progress: {}
      }
    ];
  }
  meetsAchievementCriteria(stats, def) {
    if (def.criteria.minTrades && stats.totalTrades < def.criteria.minTrades) return false;
    if (def.criteria.minProfit && parseFloat(stats.totalPnL || "0") < def.criteria.minProfit) return false;
    if (def.criteria.minVolume && parseFloat(stats.totalTradingVolume || "0") < def.criteria.minVolume) return false;
    if (def.criteria.minWinStreak && stats.currentWinningStreak < def.criteria.minWinStreak) return false;
    return true;
  }
  async getAvailableAchievements() {
    return this.getAchievementDefinitions();
  }
  async getUserAchievementProgress(userId, achievementId) {
    const userStats = await this.getTraderStats(userId);
    if (!userStats) return void 0;
    const def = this.getAchievementDefinitions().find((d) => d.id === achievementId);
    if (!def) return void 0;
    let current = 0;
    let required = 0;
    if (def.criteria.minTrades) {
      current = userStats.totalTrades;
      required = def.criteria.minTrades;
    } else if (def.criteria.minProfit) {
      current = parseFloat(userStats.totalPnL || "0");
      required = def.criteria.minProfit;
    } else if (def.criteria.minVolume) {
      current = parseFloat(userStats.totalTradingVolume || "0");
      required = def.criteria.minVolume;
    } else if (def.criteria.minWinStreak) {
      current = userStats.longestWinningStreak;
      required = def.criteria.minWinStreak;
    }
    return {
      current,
      required,
      percentage: Math.min(100, current / required * 100)
    };
  }
  // Leaderboard Analytics and Statistics
  async getLeaderboardOverview() {
    const [activeTraders, totalStatsQuery, topPerformerQuery, categories] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM trader_stats WHERE total_trades >= 1`),
      db.execute(sql`SELECT SUM(total_trades) as trades, SUM(total_trading_volume::numeric) as volume FROM trader_stats`),
      this.generateLeaderboard("total_return", "all_time", 1),
      this.getLeaderboardCategories({ isActive: true })
    ]);
    const totalActiveTraders = Number(activeTraders.rows[0]?.count || 0);
    const totalTrades = Number(totalStatsQuery.rows[0]?.trades || 0);
    const totalVolume = String(totalStatsQuery.rows[0]?.volume || "0");
    const topPerformer = topPerformerQuery[0];
    return {
      totalActiveTraders,
      totalTrades,
      totalVolume,
      topPerformer,
      categories
    };
  }
  async getTradingActivitySummary(timeframe) {
    let dateFilter;
    switch (timeframe) {
      case "daily":
        dateFilter = "last_trade_date >= CURRENT_DATE";
        break;
      case "weekly":
        dateFilter = "last_trade_date >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case "monthly":
        dateFilter = "last_trade_date >= CURRENT_DATE - INTERVAL '30 days'";
        break;
    }
    const [newTradersQuery, activityQuery, topMovers] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM trader_stats WHERE first_trade_date >= CURRENT_DATE - INTERVAL '30 days'`),
      db.execute(sql`
        SELECT SUM(total_trades) as trades, 
               SUM(total_trading_volume::numeric) as volume,
               AVG(average_trade_size::numeric) as avg_size
        FROM trader_stats 
        WHERE ${sql.raw(dateFilter)}
      `),
      this.generateLeaderboard("total_return", timeframe, 5)
    ]);
    const newTraders = Number(newTradersQuery.rows[0]?.count || 0);
    const totalTrades = Number(activityQuery.rows[0]?.trades || 0);
    const totalVolume = String(activityQuery.rows[0]?.volume || "0");
    const avgTradeSize = String(activityQuery.rows[0]?.avg_size || "0");
    return {
      newTraders,
      totalTrades,
      totalVolume,
      avgTradeSize,
      topMovers
    };
  }
  // ===== ENHANCED TRADING DATA METHODS =====
  // Enhanced Characters - For character trading and battle data
  async getEnhancedCharacters(filters) {
    let query = db.select().from(enhancedCharacters);
    const conditions = [];
    if (filters?.universe && filters.universe !== "all") {
      conditions.push(ilike(enhancedCharacters.universe, `%${filters.universe}%`));
    }
    if (filters?.search) {
      conditions.push(
        sql`(
          ${enhancedCharacters.name} ILIKE ${`%${filters.search}%`} OR 
          ${enhancedCharacters.creators} @> ${[filters.search]} OR
          ${enhancedCharacters.specialAbilities} @> ${[filters.search]}
        )`
      );
    }
    if (filters?.minPowerLevel !== void 0) {
      conditions.push(sql`${enhancedCharacters.powerLevel} >= ${filters.minPowerLevel}`);
    }
    if (filters?.maxPowerLevel !== void 0) {
      conditions.push(sql`${enhancedCharacters.powerLevel} <= ${filters.maxPowerLevel}`);
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    switch (filters?.sort) {
      case "power_level":
        query = query.orderBy(desc(enhancedCharacters.powerLevel));
        break;
      case "battle_win_rate":
        query = query.orderBy(desc(enhancedCharacters.battleWinRate));
        break;
      case "market_value":
        query = query.orderBy(desc(enhancedCharacters.marketValue));
        break;
      case "name":
        query = query.orderBy(enhancedCharacters.name);
        break;
      default:
        query = query.orderBy(desc(enhancedCharacters.powerLevel));
        break;
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query;
  }
  async getEnhancedCharacter(id) {
    const result = await db.select().from(enhancedCharacters).where(eq(enhancedCharacters.id, id)).limit(1);
    return result[0];
  }
  async getCharactersByUniverse(universe) {
    return await db.select().from(enhancedCharacters).where(ilike(enhancedCharacters.universe, `%${universe}%`)).orderBy(desc(enhancedCharacters.powerLevel)).limit(50);
  }
  // Enhanced Comic Issues - For comic market data and discovery
  async getEnhancedComicIssues(filters) {
    let query = db.select().from(enhancedComicIssues);
    const conditions = [];
    if (filters?.search) {
      conditions.push(
        sql`(
          ${enhancedComicIssues.categoryTitle} ILIKE ${`%${filters.search}%`} OR 
          ${enhancedComicIssues.issueName} ILIKE ${`%${filters.search}%`} OR
          ${enhancedComicIssues.comicSeries} ILIKE ${`%${filters.search}%`} OR
          ${enhancedComicIssues.writers} @> ${[filters.search]}
        )`
      );
    }
    if (filters?.minValue !== void 0) {
      conditions.push(sql`${enhancedComicIssues.currentMarketValue} >= ${filters.minValue}`);
    }
    if (filters?.maxValue !== void 0) {
      conditions.push(sql`${enhancedComicIssues.currentMarketValue} <= ${filters.maxValue}`);
    }
    if (filters?.minKeyRating !== void 0) {
      conditions.push(sql`${enhancedComicIssues.keyIssueRating} >= ${filters.minKeyRating}`);
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    switch (filters?.sort) {
      case "current_market_value":
        query = query.orderBy(desc(enhancedComicIssues.currentMarketValue));
        break;
      case "key_issue_rating":
        query = query.orderBy(desc(enhancedComicIssues.keyIssueRating));
        break;
      case "rarity_score":
        query = query.orderBy(desc(enhancedComicIssues.rarityScore));
        break;
      case "issue_name":
        query = query.orderBy(enhancedComicIssues.issueName);
        break;
      default:
        query = query.orderBy(desc(enhancedComicIssues.currentMarketValue));
        break;
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query;
  }
  async getEnhancedComicIssue(id) {
    const result = await db.select().from(enhancedComicIssues).where(eq(enhancedComicIssues.id, id)).limit(1);
    return result[0];
  }
  // Battle Scenarios - For battle intelligence and outcomes
  async getBattleScenarios(filters) {
    let query = db.select().from(battleScenarios);
    const conditions = [];
    if (filters?.characterId) {
      conditions.push(
        sql`(${battleScenarios.character1Id} = ${filters.characterId} OR ${battleScenarios.character2Id} = ${filters.characterId})`
      );
    }
    if (filters?.battleType) {
      conditions.push(eq(battleScenarios.battleType, filters.battleType));
    }
    if (filters?.timeframe) {
      switch (filters.timeframe) {
        case "1h":
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '1 hour'`);
          break;
        case "24h":
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '24 hours'`);
          break;
        case "7d":
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '7 days'`);
          break;
        case "30d":
          conditions.push(sql`${battleScenarios.eventDate} >= NOW() - INTERVAL '30 days'`);
          break;
      }
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(battleScenarios.eventDate));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query;
  }
  async getBattleIntelligenceSummary() {
    const recentBattlesQuery = await db.execute(sql`
      SELECT 
        bs.id,
        c1.name as character1_name,
        c2.name as character2_name,
        CASE 
          WHEN bs.outcome = 1 THEN c1.name 
          ELSE COALESCE(c2.name, 'Unknown')
        END as winner,
        bs.market_impact_percent as market_impact,
        bs.event_date as timestamp
      FROM battle_scenarios bs
      LEFT JOIN enhanced_characters c1 ON bs.character1_id = c1.id
      LEFT JOIN enhanced_characters c2 ON bs.character2_id = c2.id
      ORDER BY bs.event_date DESC
      LIMIT 20
    `);
    const statsQuery = await db.execute(sql`
      SELECT 
        COUNT(*) as total_battles,
        AVG(market_impact_percent::numeric) as avg_market_impact
      FROM battle_scenarios
      WHERE event_date >= NOW() - INTERVAL '30 days'
    `);
    const recentBattles = recentBattlesQuery.rows.map((row) => ({
      id: row.id,
      character1Name: row.character1_name,
      character2Name: row.character2_name,
      winner: row.winner,
      marketImpact: parseFloat(row.market_impact || "0"),
      timestamp: row.timestamp
    }));
    const stats = statsQuery.rows[0];
    return {
      recentBattles,
      totalBattles: parseInt(stats?.total_battles || "0"),
      avgMarketImpact: parseFloat(stats?.avg_market_impact || "0")
    };
  }
  // Movie Performance Data - For box office impact analysis
  async getMoviePerformanceData(filters) {
    let query = db.select().from(moviePerformanceData);
    const conditions = [];
    if (filters?.franchise && filters.franchise !== "all") {
      conditions.push(ilike(moviePerformanceData.franchise, `%${filters.franchise}%`));
    }
    if (filters?.characterFamily) {
      conditions.push(ilike(moviePerformanceData.characterFamily, `%${filters.characterFamily}%`));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    switch (filters?.sort) {
      case "worldwide_gross":
        query = query.orderBy(desc(moviePerformanceData.worldwideGross));
        break;
      case "impact_score":
        query = query.orderBy(desc(moviePerformanceData.marketImpactScore));
        break;
      case "rotten_tomatoes_score":
        query = query.orderBy(desc(moviePerformanceData.rottenTomatoesScore));
        break;
      case "release_date":
        query = query.orderBy(desc(moviePerformanceData.releaseDate));
        break;
      default:
        query = query.orderBy(desc(moviePerformanceData.marketImpactScore));
        break;
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query;
  }
  async getMoviePerformanceItem(id) {
    const result = await db.select().from(moviePerformanceData).where(eq(moviePerformanceData.id, id)).limit(1);
    return result[0];
  }
  async getTopMoviesByImpact(limit = 10) {
    return await db.select().from(moviePerformanceData).orderBy(desc(moviePerformanceData.marketImpactScore)).limit(limit);
  }
  // MYTHOLOGICAL HOUSES SYSTEM METHODS
  async getHouseMembers(houseId) {
    return await db.select().from(users).where(eq(users.currentHouse, houseId));
  }
  async getHouseMemberCount(houseId) {
    const result = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.currentHouse, houseId));
    return result[0]?.count || 0;
  }
  async getHouseTopTraders(houseId, limit = 10) {
    const result = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      currentHouse: users.currentHouse,
      karma: users.karma,
      tradingBalance: users.tradingBalance,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    }).from(users).where(eq(users.currentHouse, houseId)).orderBy(desc(users.karma)).limit(limit);
    return result.map((user, index2) => ({
      ...user,
      rank: index2 + 1
    }));
  }
  async getUserHouseRank(userId, houseId) {
    const user = await this.getUser(userId);
    if (!user || user.currentHouse !== houseId) {
      return void 0;
    }
    const [rankResult, totalResult] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(users).where(and(
        eq(users.currentHouse, houseId),
        sql`${users.karma} > ${user.karma}`
      )),
      this.getHouseMemberCount(houseId)
    ]);
    return {
      rank: (rankResult[0]?.count || 0) + 1,
      totalMembers: totalResult
    };
  }
  async getUserKarma(userId) {
    const user = await this.getUser(userId);
    return user?.karma || 0;
  }
  async recordKarmaAction(userId, action, karmaChange, reason) {
    try {
      await db.update(users).set({
        karma: sql`${users.karma} + ${karmaChange}`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Error recording karma action:", error);
      return false;
    }
  }
  async updateUser(id, updates) {
    try {
      const [updated] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
      return updated;
    } catch (error) {
      console.error("Error updating user:", error);
      return void 0;
    }
  }
  // ========================================================================================
  // COMPREHENSIVE LEARNING SYSTEM IMPLEMENTATION
  // ========================================================================================
  // Learning Paths Management
  async getLearningPath(id) {
    try {
      const result = await db.select().from(learningPaths).where(eq(learningPaths.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching learning path:", error);
      return void 0;
    }
  }
  async getLearningPaths(filters) {
    try {
      let query = db.select().from(learningPaths);
      const conditions = [];
      if (filters?.houseId) {
        conditions.push(eq(learningPaths.houseId, filters.houseId));
      }
      if (filters?.difficultyLevel) {
        conditions.push(eq(learningPaths.difficultyLevel, filters.difficultyLevel));
      }
      if (filters?.isActive !== void 0) {
        conditions.push(eq(learningPaths.isActive, filters.isActive));
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      return await query.orderBy(learningPaths.displayOrder, learningPaths.createdAt);
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      return [];
    }
  }
  async getLearningPathsByHouse(houseId) {
    return await this.getLearningPaths({ houseId, isActive: true });
  }
  async createLearningPath(path) {
    try {
      const result = await db.insert(learningPaths).values(path).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating learning path:", error);
      throw error;
    }
  }
  async updateLearningPath(id, path) {
    try {
      const [updated] = await db.update(learningPaths).set({ ...path, updatedAt: /* @__PURE__ */ new Date() }).where(eq(learningPaths.id, id)).returning();
      return updated;
    } catch (error) {
      console.error("Error updating learning path:", error);
      return void 0;
    }
  }
  async deleteLearningPath(id) {
    try {
      await db.delete(learningPaths).where(eq(learningPaths.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting learning path:", error);
      return false;
    }
  }
  // Sacred Lessons Management
  async getSacredLesson(id) {
    try {
      const result = await db.select().from(sacredLessons).where(eq(sacredLessons.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching sacred lesson:", error);
      return void 0;
    }
  }
  async getSacredLessons(filters) {
    try {
      let query = db.select().from(sacredLessons);
      const conditions = [];
      if (filters?.houseId) {
        conditions.push(eq(sacredLessons.houseId, filters.houseId));
      }
      if (filters?.pathId) {
        conditions.push(eq(sacredLessons.pathId, filters.pathId));
      }
      if (filters?.lessonType) {
        conditions.push(eq(sacredLessons.lessonType, filters.lessonType));
      }
      if (filters?.difficultyLevel) {
        conditions.push(eq(sacredLessons.difficultyLevel, filters.difficultyLevel));
      }
      if (filters?.isActive !== void 0) {
        conditions.push(eq(sacredLessons.isActive, filters.isActive));
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      return await query.orderBy(sacredLessons.createdAt);
    } catch (error) {
      console.error("Error fetching sacred lessons:", error);
      return [];
    }
  }
  async getLessonsByPath(pathId) {
    return await this.getSacredLessons({ pathId, isActive: true });
  }
  async getLessonsByHouse(houseId) {
    return await this.getSacredLessons({ houseId, isActive: true });
  }
  async createSacredLesson(lesson) {
    try {
      const result = await db.insert(sacredLessons).values(lesson).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating sacred lesson:", error);
      throw error;
    }
  }
  async updateSacredLesson(id, lesson) {
    try {
      const [updated] = await db.update(sacredLessons).set({ ...lesson, updatedAt: /* @__PURE__ */ new Date() }).where(eq(sacredLessons.id, id)).returning();
      return updated;
    } catch (error) {
      console.error("Error updating sacred lesson:", error);
      return void 0;
    }
  }
  async deleteSacredLesson(id) {
    try {
      await db.delete(sacredLessons).where(eq(sacredLessons.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting sacred lesson:", error);
      return false;
    }
  }
  async searchLessons(searchTerm, filters) {
    try {
      let query = db.select().from(sacredLessons);
      const conditions = [
        sql`(
          ${sacredLessons.title} ILIKE ${`%${searchTerm}%`} OR 
          ${sacredLessons.description} ILIKE ${`%${searchTerm}%`} OR 
          ${sacredLessons.sacredTitle} ILIKE ${`%${searchTerm}%`}
        )`
      ];
      if (filters?.houseId) {
        conditions.push(eq(sacredLessons.houseId, filters.houseId));
      }
      if (filters?.difficultyLevel) {
        conditions.push(eq(sacredLessons.difficultyLevel, filters.difficultyLevel));
      }
      conditions.push(eq(sacredLessons.isActive, true));
      query = query.where(and(...conditions));
      return await query.orderBy(sacredLessons.createdAt);
    } catch (error) {
      console.error("Error searching lessons:", error);
      return [];
    }
  }
  // Mystical Skills Management
  async getMysticalSkill(id) {
    try {
      const result = await db.select().from(mysticalSkills).where(eq(mysticalSkills.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching mystical skill:", error);
      return void 0;
    }
  }
  async getMysticalSkills(filters) {
    try {
      let query = db.select().from(mysticalSkills);
      const conditions = [];
      if (filters?.houseId) {
        conditions.push(eq(mysticalSkills.houseId, filters.houseId));
      }
      if (filters?.skillCategory) {
        conditions.push(eq(mysticalSkills.skillCategory, filters.skillCategory));
      }
      if (filters?.tier) {
        conditions.push(eq(mysticalSkills.tier, filters.tier));
      }
      if (filters?.rarityLevel) {
        conditions.push(eq(mysticalSkills.rarityLevel, filters.rarityLevel));
      }
      if (filters?.isActive !== void 0) {
        conditions.push(eq(mysticalSkills.isActive, filters.isActive));
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      return await query.orderBy(mysticalSkills.createdAt);
    } catch (error) {
      console.error("Error fetching mystical skills:", error);
      return [];
    }
  }
  async getSkillsByHouse(houseId) {
    return await this.getMysticalSkills({ houseId, isActive: true });
  }
  async getSkillsByCategory(category) {
    return await this.getMysticalSkills({ skillCategory: category, isActive: true });
  }
  async getSkillTree(houseId) {
    try {
      const filters = houseId ? { houseId, isActive: true } : { isActive: true };
      const skills = await this.getMysticalSkills(filters);
      const skillTree = [];
      for (const skill of skills) {
        const prerequisites = [];
        const unlocks = [];
        if (skill.prerequisiteSkills && skill.prerequisiteSkills.length > 0) {
          for (const prereqId of skill.prerequisiteSkills) {
            const prereqSkill = skills.find((s) => s.id === prereqId);
            if (prereqSkill) prerequisites.push(prereqSkill);
          }
        }
        if (skill.childSkills && skill.childSkills.length > 0) {
          for (const childId of skill.childSkills) {
            const childSkill = skills.find((s) => s.id === childId);
            if (childSkill) unlocks.push(childSkill);
          }
        }
        skillTree.push({
          ...skill,
          prerequisites,
          unlocks
        });
      }
      return skillTree;
    } catch (error) {
      console.error("Error fetching skill tree:", error);
      return [];
    }
  }
  async createMysticalSkill(skill) {
    try {
      const result = await db.insert(mysticalSkills).values(skill).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating mystical skill:", error);
      throw error;
    }
  }
  async updateMysticalSkill(id, skill) {
    try {
      const [updated] = await db.update(mysticalSkills).set({ ...skill, updatedAt: /* @__PURE__ */ new Date() }).where(eq(mysticalSkills.id, id)).returning();
      return updated;
    } catch (error) {
      console.error("Error updating mystical skill:", error);
      return void 0;
    }
  }
  async deleteMysticalSkill(id) {
    try {
      await db.delete(mysticalSkills).where(eq(mysticalSkills.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting mystical skill:", error);
      return false;
    }
  }
  // User Learning Progress Tracking  
  async getUserLessonProgress(id) {
    try {
      const result = await db.select().from(userLessonProgress).where(eq(userLessonProgress.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching user lesson progress:", error);
      return void 0;
    }
  }
  async getUserLessonProgresses(userId, filters) {
    try {
      let query = db.select().from(userLessonProgress);
      const conditions = [eq(userLessonProgress.userId, userId)];
      if (filters?.pathId) {
        conditions.push(eq(userLessonProgress.pathId, filters.pathId));
      }
      if (filters?.status) {
        conditions.push(eq(userLessonProgress.status, filters.status));
      }
      if (filters?.lessonId) {
        conditions.push(eq(userLessonProgress.lessonId, filters.lessonId));
      }
      query = query.where(and(...conditions));
      return await query.orderBy(desc(userLessonProgress.lastAccessedAt));
    } catch (error) {
      console.error("Error fetching user lesson progresses:", error);
      return [];
    }
  }
  async getLessonProgress(userId, lessonId) {
    try {
      const result = await db.select().from(userLessonProgress).where(and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lessonId)
      )).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      return void 0;
    }
  }
  async createUserLessonProgress(progress) {
    try {
      const result = await db.insert(userLessonProgress).values(progress).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user lesson progress:", error);
      throw error;
    }
  }
  async updateUserLessonProgress(id, progress) {
    try {
      const [updated] = await db.update(userLessonProgress).set({ ...progress, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userLessonProgress.id, id)).returning();
      return updated;
    } catch (error) {
      console.error("Error updating user lesson progress:", error);
      return void 0;
    }
  }
  async startLesson(userId, lessonId) {
    const existing = await this.getLessonProgress(userId, lessonId);
    if (existing) {
      return existing;
    }
    const progressData = {
      userId,
      lessonId,
      status: "in_progress",
      progressPercent: 0,
      currentSection: 1,
      sectionsCompleted: [],
      timeSpentMinutes: 0,
      attempts: 1,
      startedAt: /* @__PURE__ */ new Date(),
      lastAccessedAt: /* @__PURE__ */ new Date()
    };
    return await this.createUserLessonProgress(progressData);
  }
  async completeLesson(userId, lessonId, score, timeSpent) {
    const progress = await this.getLessonProgress(userId, lessonId);
    if (!progress) {
      throw new Error("No progress found for this lesson");
    }
    const lesson = await this.getSacredLesson(lessonId);
    const masteryAchieved = lesson ? score >= parseFloat(lesson.masteryThreshold.toString()) : false;
    const updateData = {
      status: masteryAchieved ? "mastered" : "completed",
      progressPercent: 100,
      timeSpentMinutes: (progress.timeSpentMinutes || 0) + timeSpent,
      latestScore: score,
      bestScore: Math.max(score, parseFloat(progress.bestScore?.toString() || "0")),
      masteryAchieved,
      completedAt: /* @__PURE__ */ new Date(),
      experienceAwarded: lesson?.experienceReward || 0,
      karmaAwarded: lesson?.karmaReward || 0
    };
    const updated = await this.updateUserLessonProgress(progress.id, updateData);
    if (!updated) {
      throw new Error("Failed to update lesson progress");
    }
    return updated;
  }
  async updateLessonProgress(userId, lessonId, progressData) {
    const progress = await this.getLessonProgress(userId, lessonId);
    if (!progress) {
      throw new Error("No progress found for this lesson");
    }
    const updateData = {
      progressPercent: progressData.progressPercent,
      currentSection: progressData.currentSection,
      timeSpentMinutes: (progress.timeSpentMinutes || 0) + progressData.timeSpent,
      interactionData: progressData.interactionData,
      lastAccessedAt: /* @__PURE__ */ new Date()
    };
    const updated = await this.updateUserLessonProgress(progress.id, updateData);
    if (!updated) {
      throw new Error("Failed to update lesson progress");
    }
    return updated;
  }
  // Placeholder implementations for remaining methods (would need full implementation)
  async getUserSkillUnlock(id) {
    return void 0;
  }
  async getUserSkillUnlocks(userId, filters) {
    return [];
  }
  async getUserSkillById(userId, skillId) {
    return void 0;
  }
  async createUserSkillUnlock(unlock) {
    throw new Error("Not implemented");
  }
  async updateUserSkillUnlock(id, unlock) {
    return void 0;
  }
  async unlockSkill(userId, skillId, unlockMethod) {
    throw new Error("Not implemented");
  }
  async upgradeSkillMastery(userId, skillId, experienceSpent) {
    return void 0;
  }
  async getUserSkillBonuses(userId) {
    return [];
  }
  async checkSkillUnlockEligibility(userId, skillId) {
    return { eligible: false, requirements: {}, missing: [] };
  }
  // Trials of Mastery Management
  async getTrialOfMastery(id) {
    return void 0;
  }
  async getTrialsOfMastery(filters) {
    return [];
  }
  async getTrialsByHouse(houseId) {
    return [];
  }
  async createTrialOfMastery(trial) {
    throw new Error("Not implemented");
  }
  async updateTrialOfMastery(id, trial) {
    return void 0;
  }
  async deleteTrialOfMastery(id) {
    return false;
  }
  // User Trial Attempts Management
  async getUserTrialAttempt(id) {
    return void 0;
  }
  async getUserTrialAttempts(userId, filters) {
    return [];
  }
  async getTrialAttempts(trialId, filters) {
    return [];
  }
  async createUserTrialAttempt(attempt) {
    throw new Error("Not implemented");
  }
  async updateUserTrialAttempt(id, attempt) {
    return void 0;
  }
  async startTrial(userId, trialId) {
    throw new Error("Not implemented");
  }
  async submitTrialResults(userId, trialId, attemptId, results) {
    throw new Error("Not implemented");
  }
  async checkTrialEligibility(userId, trialId) {
    return { eligible: false, requirements: {}, missing: [] };
  }
  // Divine Certifications Management
  async getDivineCertification(id) {
    return void 0;
  }
  async getDivineCertifications(filters) {
    return [];
  }
  async getCertificationsByHouse(houseId) {
    return [];
  }
  async createDivineCertification(certification) {
    throw new Error("Not implemented");
  }
  async updateDivineCertification(id, certification) {
    return void 0;
  }
  async deleteDivineCertification(id) {
    return false;
  }
  // User Certifications Management
  async getUserCertification(id) {
    return void 0;
  }
  async getUserCertifications(userId, filters) {
    return [];
  }
  async getCertificationHolders(certificationId) {
    return [];
  }
  async createUserCertification(certification) {
    throw new Error("Not implemented");
  }
  async updateUserCertification(id, certification) {
    return void 0;
  }
  async awardCertification(userId, certificationId, achievementMethod, verificationData) {
    throw new Error("Not implemented");
  }
  async revokeCertification(userId, certificationId, reason) {
    return false;
  }
  async checkCertificationEligibility(userId, certificationId) {
    return { eligible: false, requirements: {}, missing: [] };
  }
  // Learning Analytics Management
  async getLearningAnalytics(userId) {
    return void 0;
  }
  async createLearningAnalytics(analytics) {
    throw new Error("Not implemented");
  }
  async updateLearningAnalytics(userId, analytics) {
    return void 0;
  }
  async recalculateLearningAnalytics(userId) {
    throw new Error("Not implemented");
  }
  async generateLearningRecommendations(userId) {
    return { recommendedPaths: [], suggestedLessons: [], skillsToUnlock: [], interventions: [] };
  }
  // Learning System Analytics and Insights
  async getHouseLearningStats(houseId) {
    return {
      totalPaths: 0,
      totalLessons: 0,
      totalSkills: 0,
      averageProgress: 0,
      topPerformers: [],
      engagement: 0
    };
  }
  async getGlobalLearningStats() {
    return {
      totalLearners: 0,
      totalLessonsCompleted: 0,
      totalSkillsUnlocked: 0,
      averageTimeToComplete: 0,
      houseComparisons: []
    };
  }
  async getUserLearningDashboard(userId) {
    const analytics = await this.getLearningAnalytics(userId);
    const recentProgress = await this.getUserLessonProgresses(userId);
    const paths = await this.getLearningPaths({ isActive: true });
    const lessons = await this.getSacredLessons({ isActive: true });
    const skills = await this.getMysticalSkills({ isActive: true });
    return {
      analytics: analytics || {},
      currentPaths: paths.slice(0, 3),
      recentProgress: recentProgress.slice(0, 5),
      unlockedSkills: [],
      certifications: [],
      recommendations: {
        paths: paths.slice(0, 3),
        lessons: lessons.slice(0, 5),
        skills: skills.slice(0, 3)
      },
      achievements: []
    };
  }
  // Advanced Learning Features (Placeholder implementations)
  async generatePersonalizedLearningPath(userId, preferences) {
    throw new Error("Not implemented");
  }
  async detectLearningPatterns(userId) {
    return {
      learningStyle: "visual",
      optimalSessionLength: 30,
      preferredContentTypes: ["crystal_orb"],
      strugglingAreas: [],
      strengthAreas: []
    };
  }
  async predictLearningOutcomes(userId, pathId) {
    return {
      estimatedCompletionTime: 30,
      successProbability: 0.85,
      recommendedPrerequisites: [],
      riskFactors: []
    };
  }
  // =============================================
  // PHASE 8: EXTERNAL INTEGRATION METHODS
  // =============================================
  // External Integrations
  async getExternalIntegration(id) {
    const result = await db.select().from(externalIntegrations).where(eq(externalIntegrations.id, id)).limit(1);
    return result[0];
  }
  async getUserExternalIntegrations(userId, filters) {
    let query = db.select().from(externalIntegrations).where(eq(externalIntegrations.userId, userId));
    const conditions = [eq(externalIntegrations.userId, userId)];
    if (filters?.integrationName) {
      conditions.push(eq(externalIntegrations.integrationName, filters.integrationName));
    }
    if (filters?.status) {
      conditions.push(eq(externalIntegrations.status, filters.status));
    }
    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(externalIntegrations.createdAt));
  }
  async createExternalIntegration(integration) {
    const result = await db.insert(externalIntegrations).values(integration).returning();
    return result[0];
  }
  async updateExternalIntegration(id, integration) {
    const result = await db.update(externalIntegrations).set({ ...integration, updatedAt: /* @__PURE__ */ new Date() }).where(eq(externalIntegrations.id, id)).returning();
    return result[0];
  }
  async deleteExternalIntegration(id) {
    const result = await db.delete(externalIntegrations).where(eq(externalIntegrations.id, id));
    return result.rowCount > 0;
  }
  // Integration Webhooks
  async getIntegrationWebhook(id) {
    const result = await db.select().from(integrationWebhooks).where(eq(integrationWebhooks.id, id)).limit(1);
    return result[0];
  }
  async getIntegrationWebhooks(integrationId, filters) {
    const conditions = [eq(integrationWebhooks.integrationId, integrationId)];
    if (filters?.webhookType) {
      conditions.push(eq(integrationWebhooks.webhookType, filters.webhookType));
    }
    if (filters?.eventType) {
      conditions.push(eq(integrationWebhooks.eventType, filters.eventType));
    }
    if (filters?.isActive !== void 0) {
      conditions.push(eq(integrationWebhooks.isActive, filters.isActive));
    }
    return await db.select().from(integrationWebhooks).where(and(...conditions)).orderBy(desc(integrationWebhooks.createdAt));
  }
  async createIntegrationWebhook(webhook) {
    const result = await db.insert(integrationWebhooks).values(webhook).returning();
    return result[0];
  }
  async updateIntegrationWebhook(id, webhook) {
    const result = await db.update(integrationWebhooks).set({ ...webhook, updatedAt: /* @__PURE__ */ new Date() }).where(eq(integrationWebhooks.id, id)).returning();
    return result[0];
  }
  async deleteIntegrationWebhook(id) {
    const result = await db.delete(integrationWebhooks).where(eq(integrationWebhooks.id, id));
    return result.rowCount > 0;
  }
  // Integration Sync Logs
  async getIntegrationSyncLog(id) {
    const result = await db.select().from(integrationSyncLogs).where(eq(integrationSyncLogs.id, id)).limit(1);
    return result[0];
  }
  async getIntegrationSyncLogs(integrationId, filters) {
    const conditions = [eq(integrationSyncLogs.integrationId, integrationId)];
    if (filters?.syncType) {
      conditions.push(eq(integrationSyncLogs.syncType, filters.syncType));
    }
    if (filters?.status) {
      conditions.push(eq(integrationSyncLogs.status, filters.status));
    }
    let query = db.select().from(integrationSyncLogs).where(and(...conditions)).orderBy(desc(integrationSyncLogs.startedAt));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  async createIntegrationSyncLog(syncLog) {
    const result = await db.insert(integrationSyncLogs).values(syncLog).returning();
    return result[0];
  }
  async updateIntegrationSyncLog(id, syncLog) {
    const result = await db.update(integrationSyncLogs).set(syncLog).where(eq(integrationSyncLogs.id, id)).returning();
    return result[0];
  }
  async deleteIntegrationSyncLog(id) {
    const result = await db.delete(integrationSyncLogs).where(eq(integrationSyncLogs.id, id));
    return result.rowCount > 0;
  }
  // Workflow Automations
  async getWorkflowAutomation(id) {
    const result = await db.select().from(workflowAutomations).where(eq(workflowAutomations.id, id)).limit(1);
    return result[0];
  }
  async getUserWorkflowAutomations(userId, filters) {
    const conditions = [eq(workflowAutomations.userId, userId)];
    if (filters?.category) {
      conditions.push(eq(workflowAutomations.category, filters.category));
    }
    if (filters?.isActive !== void 0) {
      conditions.push(eq(workflowAutomations.isActive, filters.isActive));
    }
    if (filters?.ritualType) {
      conditions.push(sql`${workflowAutomations.metadata}->>'ritualType' = ${filters.ritualType}`);
    }
    return await db.select().from(workflowAutomations).where(and(...conditions)).orderBy(desc(workflowAutomations.createdAt));
  }
  async createWorkflowAutomation(workflow) {
    const result = await db.insert(workflowAutomations).values(workflow).returning();
    return result[0];
  }
  async updateWorkflowAutomation(id, workflow) {
    const result = await db.update(workflowAutomations).set({ ...workflow, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workflowAutomations.id, id)).returning();
    return result[0];
  }
  async deleteWorkflowAutomation(id) {
    const result = await db.delete(workflowAutomations).where(eq(workflowAutomations.id, id));
    return result.rowCount > 0;
  }
  // Workflow Executions
  async getWorkflowExecution(id) {
    const result = await db.select().from(workflowExecutions).where(eq(workflowExecutions.id, id)).limit(1);
    return result[0];
  }
  async getWorkflowExecutions(workflowId, filters) {
    const conditions = [eq(workflowExecutions.workflowId, workflowId)];
    if (filters?.status) {
      conditions.push(eq(workflowExecutions.status, filters.status));
    }
    let query = db.select().from(workflowExecutions).where(and(...conditions)).orderBy(desc(workflowExecutions.startedAt));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  async createWorkflowExecution(execution) {
    const result = await db.insert(workflowExecutions).values(execution).returning();
    return result[0];
  }
  async updateWorkflowExecution(id, execution) {
    const result = await db.update(workflowExecutions).set(execution).where(eq(workflowExecutions.id, id)).returning();
    return result[0];
  }
  async getUserWorkflowExecutions(userId, filters) {
    let query = db.select({
      id: workflowExecutions.id,
      workflowId: workflowExecutions.workflowId,
      executionId: workflowExecutions.executionId,
      status: workflowExecutions.status,
      triggerSource: workflowExecutions.triggerSource,
      triggerData: workflowExecutions.triggerData,
      startedAt: workflowExecutions.startedAt,
      completedAt: workflowExecutions.completedAt,
      durationMs: workflowExecutions.durationMs,
      errorMessage: workflowExecutions.errorMessage,
      stepsCompleted: workflowExecutions.stepsCompleted,
      totalSteps: workflowExecutions.totalSteps,
      outputData: workflowExecutions.outputData,
      createdAt: workflowExecutions.createdAt,
      updatedAt: workflowExecutions.updatedAt
    }).from(workflowExecutions).innerJoin(workflowAutomations, eq(workflowExecutions.workflowId, workflowAutomations.id)).where(eq(workflowAutomations.userId, userId));
    if (filters?.status) {
      query = query.where(and(
        eq(workflowAutomations.userId, userId),
        eq(workflowExecutions.status, filters.status)
      ));
    }
    query = query.orderBy(desc(workflowExecutions.startedAt));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  // Integration Analytics
  async getIntegrationAnalytics(id) {
    const result = await db.select().from(integrationAnalytics).where(eq(integrationAnalytics.id, id)).limit(1);
    return result[0];
  }
  async getUserIntegrationAnalytics(userId, filters) {
    const conditions = [eq(integrationAnalytics.userId, userId)];
    if (filters?.timeframe) {
      conditions.push(eq(integrationAnalytics.timeframe, filters.timeframe));
    }
    if (filters?.integrationName) {
      conditions.push(eq(integrationAnalytics.integrationName, filters.integrationName));
    }
    return await db.select().from(integrationAnalytics).where(and(...conditions)).orderBy(desc(integrationAnalytics.periodStart));
  }
  async createIntegrationAnalytics(analytics) {
    const result = await db.insert(integrationAnalytics).values(analytics).returning();
    return result[0];
  }
  async updateIntegrationAnalytics(id, analytics) {
    const result = await db.update(integrationAnalytics).set({ ...analytics, updatedAt: /* @__PURE__ */ new Date() }).where(eq(integrationAnalytics.id, id)).returning();
    return result[0];
  }
  // External User Mappings
  async getExternalUserMapping(id) {
    const result = await db.select().from(externalUserMappings).where(eq(externalUserMappings.id, id)).limit(1);
    return result[0];
  }
  async getUserExternalMappings(userId, integrationId) {
    const conditions = [eq(externalUserMappings.userId, userId)];
    if (integrationId) {
      conditions.push(eq(externalUserMappings.integrationId, integrationId));
    }
    return await db.select().from(externalUserMappings).where(and(...conditions)).orderBy(desc(externalUserMappings.createdAt));
  }
  async getExternalUserMappingByExternalId(integrationId, externalUserId) {
    const result = await db.select().from(externalUserMappings).where(and(
      eq(externalUserMappings.integrationId, integrationId),
      eq(externalUserMappings.externalUserId, externalUserId)
    )).limit(1);
    return result[0];
  }
  async createExternalUserMapping(mapping) {
    const result = await db.insert(externalUserMappings).values(mapping).returning();
    return result[0];
  }
  async updateExternalUserMapping(id, mapping) {
    const result = await db.update(externalUserMappings).set({ ...mapping, updatedAt: /* @__PURE__ */ new Date() }).where(eq(externalUserMappings.id, id)).returning();
    return result[0];
  }
  async deleteExternalUserMapping(id) {
    const result = await db.delete(externalUserMappings).where(eq(externalUserMappings.id, id));
    return result.rowCount > 0;
  }
  // Integration Health and Monitoring
  async updateIntegrationHealth(integrationId, healthStatus, errorMessage) {
    await db.update(externalIntegrations).set({
      healthStatus,
      errorMessage,
      lastHealthCheck: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(externalIntegrations.id, integrationId));
  }
  async getUnhealthyIntegrations() {
    return await db.select().from(externalIntegrations).where(sql`${externalIntegrations.healthStatus} IN ('unhealthy', 'degraded')`).orderBy(desc(externalIntegrations.lastHealthCheck));
  }
  async getIntegrationUsageStats(integrationId, timeframe) {
    return {
      totalApiCalls: 0,
      successRate: 1,
      averageResponseTime: 250,
      errorCount: 0
    };
  }
  // Workflow Automation Helpers
  async getActiveWorkflowAutomations(category) {
    let query = db.select().from(workflowAutomations).where(eq(workflowAutomations.isActive, true));
    if (category) {
      query = query.where(and(
        eq(workflowAutomations.isActive, true),
        eq(workflowAutomations.category, category)
      ));
    }
    return await query.orderBy(desc(workflowAutomations.priority));
  }
  async getScheduledWorkflows(beforeDate) {
    const cutoffDate = beforeDate || /* @__PURE__ */ new Date();
    return await db.select().from(workflowAutomations).where(and(
      eq(workflowAutomations.isActive, true),
      sql`${workflowAutomations.nextRunAt} <= ${cutoffDate}`
    )).orderBy(workflowAutomations.nextRunAt);
  }
  async updateWorkflowLastRun(workflowId, success, errorMessage) {
    const updates = {
      lastRunAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (success) {
      updates.lastSuccessfulRunAt = /* @__PURE__ */ new Date();
      updates.errorMessage = null;
    } else if (errorMessage) {
      updates.errorMessage = errorMessage;
    }
    await db.update(workflowAutomations).set(updates).where(eq(workflowAutomations.id, workflowId));
  }
  async incrementWorkflowStats(workflowId, success, executionTime) {
    const workflow = await this.getWorkflowAutomation(workflowId);
    if (workflow) {
      const updates = {
        totalExecutions: (workflow.totalExecutions || 0) + 1,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (success) {
        updates.successfulExecutions = (workflow.successfulExecutions || 0) + 1;
        updates.averageExecutionTimeMs = Math.round(
          ((workflow.averageExecutionTimeMs || 0) * (workflow.totalExecutions || 0) + executionTime) / ((workflow.totalExecutions || 0) + 1)
        );
      }
      await db.update(workflowAutomations).set(updates).where(eq(workflowAutomations.id, workflowId));
    }
  }
  // =============================================
  // PHASE 1: CORE TRADING FOUNDATION METHODS
  // =============================================
  // IMF Vaulting System Methods
  async createImfVaultSettings(vaultSettings) {
    const result = await db.insert(imfVaultSettings).values(vaultSettings).returning();
    return result[0];
  }
  async getImfVaultSettings(assetId) {
    const result = await db.select().from(imfVaultSettings).where(eq(imfVaultSettings.assetId, assetId)).limit(1);
    return result[0];
  }
  async getAllImfVaultSettings() {
    return await db.select().from(imfVaultSettings).orderBy(desc(imfVaultSettings.scarcityMultiplier));
  }
  async updateImfVaultSettings(assetId, updates) {
    const result = await db.update(imfVaultSettings).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(imfVaultSettings.assetId, assetId)).returning();
    if (!result[0]) {
      throw new Error("IMF vault settings not found");
    }
    return result[0];
  }
  async deleteImfVaultSettings(assetId) {
    await db.delete(imfVaultSettings).where(eq(imfVaultSettings.assetId, assetId));
  }
  // Trading Firms Methods
  async createTradingFirm(firm) {
    const result = await db.insert(tradingFirms).values(firm).returning();
    return result[0];
  }
  async getTradingFirm(id) {
    const result = await db.select().from(tradingFirms).where(eq(tradingFirms.id, id)).limit(1);
    return result[0];
  }
  async getTradingFirmByCode(firmCode) {
    const result = await db.select().from(tradingFirms).where(eq(tradingFirms.firmCode, firmCode)).limit(1);
    return result[0];
  }
  async getTradingFirmsByHouse(houseId) {
    return await db.select().from(tradingFirms).where(eq(tradingFirms.houseId, houseId)).orderBy(desc(tradingFirms.totalAssetsUnderManagement));
  }
  async getAllTradingFirms() {
    return await db.select().from(tradingFirms).where(eq(tradingFirms.isActive, true)).orderBy(desc(tradingFirms.reputation));
  }
  async updateTradingFirm(id, updates) {
    const result = await db.update(tradingFirms).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tradingFirms.id, id)).returning();
    if (!result[0]) {
      throw new Error("Trading firm not found");
    }
    return result[0];
  }
  async deleteTradingFirm(id) {
    await db.delete(tradingFirms).where(eq(tradingFirms.id, id));
  }
  // Asset Financial Mapping Methods
  async createAssetFinancialMapping(mapping) {
    const result = await db.insert(assetFinancialMapping).values(mapping).returning();
    return result[0];
  }
  async getAssetFinancialMapping(assetId) {
    const result = await db.select().from(assetFinancialMapping).where(eq(assetFinancialMapping.assetId, assetId)).limit(1);
    return result[0];
  }
  async getAssetFinancialMappingsByType(instrumentType) {
    return await db.select().from(assetFinancialMapping).where(eq(assetFinancialMapping.instrumentType, instrumentType)).orderBy(assetFinancialMapping.assetId);
  }
  async updateAssetFinancialMapping(assetId, updates) {
    const result = await db.update(assetFinancialMapping).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(assetFinancialMapping.assetId, assetId)).returning();
    if (!result[0]) {
      throw new Error("Asset financial mapping not found");
    }
    return result[0];
  }
  async deleteAssetFinancialMapping(assetId) {
    await db.delete(assetFinancialMapping).where(eq(assetFinancialMapping.assetId, assetId));
  }
  // Global Market Hours Methods
  async createGlobalMarketHours(marketHours) {
    const result = await db.insert(globalMarketHours).values(marketHours).returning();
    return result[0];
  }
  async getGlobalMarketHours(marketCode) {
    const result = await db.select().from(globalMarketHours).where(eq(globalMarketHours.marketCode, marketCode)).limit(1);
    return result[0];
  }
  async getAllGlobalMarketHours() {
    return await db.select().from(globalMarketHours).where(eq(globalMarketHours.isActive, true)).orderBy(desc(globalMarketHours.influenceWeight));
  }
  async getActiveMarkets() {
    return await db.select().from(globalMarketHours).where(and(
      eq(globalMarketHours.isActive, true),
      eq(globalMarketHours.currentStatus, "open")
    )).orderBy(desc(globalMarketHours.influenceWeight));
  }
  async updateGlobalMarketHours(marketCode, updates) {
    const result = await db.update(globalMarketHours).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(globalMarketHours.marketCode, marketCode)).returning();
    if (!result[0]) {
      throw new Error("Global market hours not found");
    }
    return result[0];
  }
  async deleteGlobalMarketHours(marketCode) {
    await db.delete(globalMarketHours).where(eq(globalMarketHours.marketCode, marketCode));
  }
  // Options Chain Methods
  async createOptionsChain(option) {
    const result = await db.insert(optionsChain).values(option).returning();
    return result[0];
  }
  async getOptionsChain(id) {
    const result = await db.select().from(optionsChain).where(eq(optionsChain.id, id)).limit(1);
    return result[0];
  }
  async getOptionsChainBySymbol(optionSymbol) {
    const result = await db.select().from(optionsChain).where(eq(optionsChain.optionSymbol, optionSymbol)).limit(1);
    return result[0];
  }
  async getOptionsChainByUnderlying(underlyingAssetId) {
    return await db.select().from(optionsChain).where(and(
      eq(optionsChain.underlyingAssetId, underlyingAssetId),
      eq(optionsChain.isActive, true)
    )).orderBy(optionsChain.expirationDate, optionsChain.strikePrice);
  }
  async getOptionsChainByExpiration(expirationDate) {
    return await db.select().from(optionsChain).where(and(
      eq(optionsChain.expirationDate, expirationDate),
      eq(optionsChain.isActive, true)
    )).orderBy(optionsChain.underlyingAssetId, optionsChain.strikePrice);
  }
  async updateOptionsChain(id, updates) {
    const result = await db.update(optionsChain).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(optionsChain.id, id)).returning();
    if (!result[0]) {
      throw new Error("Options chain not found");
    }
    return result[0];
  }
  async deleteOptionsChain(id) {
    await db.delete(optionsChain).where(eq(optionsChain.id, id));
  }
  // Margin Account Methods
  async createMarginAccount(marginAccount) {
    const result = await db.insert(marginAccounts).values(marginAccount).returning();
    return result[0];
  }
  async getMarginAccount(userId, portfolioId) {
    const result = await db.select().from(marginAccounts).where(and(
      eq(marginAccounts.userId, userId),
      eq(marginAccounts.portfolioId, portfolioId)
    )).limit(1);
    return result[0];
  }
  async getUserMarginAccounts(userId) {
    return await db.select().from(marginAccounts).where(eq(marginAccounts.userId, userId)).orderBy(desc(marginAccounts.buyingPower));
  }
  async updateMarginAccount(userId, portfolioId, updates) {
    const result = await db.update(marginAccounts).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(
      eq(marginAccounts.userId, userId),
      eq(marginAccounts.portfolioId, portfolioId)
    )).returning();
    if (!result[0]) {
      throw new Error("Margin account not found");
    }
    return result[0];
  }
  async deleteMarginAccount(userId, portfolioId) {
    await db.delete(marginAccounts).where(and(
      eq(marginAccounts.userId, userId),
      eq(marginAccounts.portfolioId, portfolioId)
    ));
  }
  // Short Position Methods
  async createShortPosition(shortPosition) {
    const result = await db.insert(shortPositions).values(shortPosition).returning();
    return result[0];
  }
  async getShortPosition(id) {
    const result = await db.select().from(shortPositions).where(eq(shortPositions.id, id)).limit(1);
    return result[0];
  }
  async getUserShortPositions(userId) {
    return await db.select().from(shortPositions).where(and(
      eq(shortPositions.userId, userId),
      eq(shortPositions.positionStatus, "open")
    )).orderBy(desc(shortPositions.openedAt));
  }
  async getPortfolioShortPositions(portfolioId) {
    return await db.select().from(shortPositions).where(and(
      eq(shortPositions.portfolioId, portfolioId),
      eq(shortPositions.positionStatus, "open")
    )).orderBy(desc(shortPositions.openedAt));
  }
  async updateShortPosition(id, updates) {
    const result = await db.update(shortPositions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(shortPositions.id, id)).returning();
    if (!result[0]) {
      throw new Error("Short position not found");
    }
    return result[0];
  }
  async deleteShortPosition(id) {
    await db.delete(shortPositions).where(eq(shortPositions.id, id));
  }
  // NPC Trader Methods
  async createNpcTrader(npcTrader) {
    const result = await db.insert(npcTraders).values(npcTrader).returning();
    return result[0];
  }
  async getNpcTrader(id) {
    const result = await db.select().from(npcTraders).where(eq(npcTraders.id, id)).limit(1);
    return result[0];
  }
  async getNpcTradersByType(traderType) {
    return await db.select().from(npcTraders).where(and(
      eq(npcTraders.traderType, traderType),
      eq(npcTraders.isActive, true)
    )).orderBy(desc(npcTraders.availableCapital));
  }
  async getNpcTradersByFirm(firmId) {
    return await db.select().from(npcTraders).where(and(
      eq(npcTraders.firmId, firmId),
      eq(npcTraders.isActive, true)
    )).orderBy(desc(npcTraders.totalPnL));
  }
  async getActiveNpcTraders() {
    return await db.select().from(npcTraders).where(eq(npcTraders.isActive, true)).orderBy(desc(npcTraders.influenceOnMarket));
  }
  async updateNpcTrader(id, updates) {
    const result = await db.update(npcTraders).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(npcTraders.id, id)).returning();
    if (!result[0]) {
      throw new Error("NPC trader not found");
    }
    return result[0];
  }
  async deleteNpcTrader(id) {
    await db.delete(npcTraders).where(eq(npcTraders.id, id));
  }
  // Information Tier Methods
  async createInformationTier(tier) {
    const result = await db.insert(informationTiers).values(tier).returning();
    return result[0];
  }
  async getInformationTier(tierName) {
    const result = await db.select().from(informationTiers).where(eq(informationTiers.tierName, tierName)).limit(1);
    return result[0];
  }
  async getAllInformationTiers() {
    return await db.select().from(informationTiers).where(eq(informationTiers.isActive, true)).orderBy(informationTiers.tierLevel);
  }
  async updateInformationTier(tierName, updates) {
    const result = await db.update(informationTiers).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(informationTiers.tierName, tierName)).returning();
    if (!result[0]) {
      throw new Error("Information tier not found");
    }
    return result[0];
  }
  async deleteInformationTier(tierName) {
    await db.delete(informationTiers).where(eq(informationTiers.tierName, tierName));
  }
  // News Article Methods
  async createNewsArticle(article) {
    const result = await db.insert(newsArticles).values(article).returning();
    return result[0];
  }
  async getNewsArticle(id) {
    const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
    return result[0];
  }
  async getNewsArticlesByTier(userTier, limit) {
    const now = /* @__PURE__ */ new Date();
    let condition;
    switch (userTier) {
      case "elite":
        condition = sql`${newsArticles.eliteReleaseTime} <= ${now}`;
        break;
      case "pro":
        condition = sql`${newsArticles.proReleaseTime} <= ${now}`;
        break;
      case "free":
        condition = sql`${newsArticles.freeReleaseTime} <= ${now}`;
        break;
    }
    let query = db.select().from(newsArticles).where(and(
      eq(newsArticles.isActive, true),
      condition
    )).orderBy(desc(newsArticles.publishTime));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  async getNewsArticlesByAsset(assetId, limit) {
    let query = db.select().from(newsArticles).where(and(
      eq(newsArticles.isActive, true),
      sql`${assetId} = ANY(${newsArticles.affectedAssets})`
    )).orderBy(desc(newsArticles.publishTime));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  async updateNewsArticle(id, updates) {
    const result = await db.update(newsArticles).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(newsArticles.id, id)).returning();
    if (!result[0]) {
      throw new Error("News article not found");
    }
    return result[0];
  }
  async deleteNewsArticle(id) {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }
  // Options Chain Methods for Phase 1 Scheduled Services
  async getAllOptionsChains() {
    return await db.select().from(optionsChain).where(eq(optionsChain.isActive, true)).orderBy(desc(optionsChain.expirationDate));
  }
  async updateOptionsChain(id, updates) {
    const result = await db.update(optionsChain).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(optionsChain.id, id)).returning();
    return result[0];
  }
  // Missing methods for Phase1ScheduledServices
  async getAllNpcTraders() {
    return await db.select().from(npcTraders).where(eq(npcTraders.isActive, true)).orderBy(desc(npcTraders.availableCapital));
  }
  async getNewsArticles(filters) {
    let query = db.select().from(newsArticles).where(eq(newsArticles.isActive, true)).orderBy(desc(newsArticles.publishTime));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    return await query;
  }
  // ============================================================================
  // PHASE 3: ART-DRIVEN PROGRESSION SYSTEM STORAGE METHODS
  // ============================================================================
  // Comic Issue Variant Methods
  async getComicIssueVariant(id) {
    const result = await db.select().from(comicIssueVariants).where(eq(comicIssueVariants.id, id)).limit(1);
    return result[0];
  }
  async getComicIssueVariants(filters, limit, offset) {
    let query = db.select().from(comicIssueVariants);
    const conditions = [];
    if (filters?.coverType) {
      conditions.push(eq(comicIssueVariants.coverType, filters.coverType));
    }
    if (filters?.issueType) {
      conditions.push(eq(comicIssueVariants.issueType, filters.issueType));
    }
    if (filters?.primaryHouse) {
      conditions.push(eq(comicIssueVariants.primaryHouse, filters.primaryHouse));
    }
    if (filters?.minRarity) {
      conditions.push(sql`${comicIssueVariants.rarity} >= ${filters.minRarity}`);
    }
    if (filters?.maxPrice) {
      conditions.push(sql`${comicIssueVariants.baseMarketValue} <= ${filters.maxPrice}`);
    }
    if (filters?.search) {
      conditions.push(
        sql`${comicIssueVariants.variantTitle} ILIKE ${`%${filters.search}%`} OR ${comicIssueVariants.coverDescription} ILIKE ${`%${filters.search}%`}`
      );
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(comicIssueVariants.rarity), desc(comicIssueVariants.baseMarketValue));
    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.offset(offset);
    }
    return await query;
  }
  async createComicIssueVariant(variant) {
    const result = await db.insert(comicIssueVariants).values(variant).returning();
    return result[0];
  }
  async updateComicIssueVariant(id, variant) {
    const result = await db.update(comicIssueVariants).set({ ...variant, updatedAt: /* @__PURE__ */ new Date() }).where(eq(comicIssueVariants.id, id)).returning();
    return result[0];
  }
  // User Comic Collection Methods
  async getUserComicCollections(userId) {
    return await db.select().from(userComicCollection).where(eq(userComicCollection.userId, userId)).orderBy(desc(userComicCollection.acquiredAt));
  }
  async getUserComicCollectionByVariant(userId, variantId) {
    const result = await db.select().from(userComicCollection).where(and(
      eq(userComicCollection.userId, userId),
      eq(userComicCollection.variantId, variantId)
    )).limit(1);
    return result[0];
  }
  async getUserComicCollectionItem(id) {
    const result = await db.select().from(userComicCollection).where(eq(userComicCollection.id, id)).limit(1);
    return result[0];
  }
  async createUserComicCollection(collection) {
    const result = await db.insert(userComicCollection).values(collection).returning();
    return result[0];
  }
  async updateUserComicCollection(id, collection) {
    const result = await db.update(userComicCollection).set(collection).where(eq(userComicCollection.id, id)).returning();
    return result[0];
  }
  async deleteUserComicCollection(id) {
    const result = await db.delete(userComicCollection).where(eq(userComicCollection.id, id)).returning();
    return result.length > 0;
  }
  // User Progression Status Methods
  async getUserProgressionStatus(userId) {
    const result = await db.select().from(userProgressionStatus).where(eq(userProgressionStatus.userId, userId)).limit(1);
    return result[0];
  }
  async createUserProgressionStatus(status) {
    const result = await db.insert(userProgressionStatus).values(status).returning();
    return result[0];
  }
  async updateUserProgressionStatus(id, status) {
    const result = await db.update(userProgressionStatus).set({ ...status, lastProgressionUpdate: /* @__PURE__ */ new Date() }).where(eq(userProgressionStatus.id, id)).returning();
    return result[0];
  }
  // House Progression Methods
  async getHouseProgressionPaths(houseId) {
    let query = db.select().from(houseProgressionPaths).where(eq(houseProgressionPaths.isActive, true));
    if (houseId) {
      query = query.where(eq(houseProgressionPaths.houseId, houseId));
    }
    return await query.orderBy(houseProgressionPaths.levelNumber);
  }
  async getUserHouseProgression(userId, houseId) {
    let query = db.select().from(userHouseProgression).where(eq(userHouseProgression.userId, userId));
    if (houseId) {
      query = query.where(eq(userHouseProgression.houseId, houseId));
    }
    return await query.orderBy(desc(userHouseProgression.currentLevel));
  }
  async createUserHouseProgression(progression) {
    const result = await db.insert(userHouseProgression).values(progression).returning();
    return result[0];
  }
  async updateUserHouseProgression(id, progression) {
    const result = await db.update(userHouseProgression).set({ ...progression, lastProgressionActivity: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq(userHouseProgression.id, id)).returning();
    return result[0];
  }
  // Trading Tool Unlock Methods
  async getUserTradingToolUnlocks(userId) {
    return await db.select().from(tradingToolUnlocks).where(eq(tradingToolUnlocks.userId, userId)).orderBy(desc(tradingToolUnlocks.unlockedAt));
  }
  async createTradingToolUnlock(unlock) {
    const result = await db.insert(tradingToolUnlocks).values(unlock).returning();
    return result[0];
  }
  async updateTradingToolUnlock(id, unlock) {
    const result = await db.update(tradingToolUnlocks).set({ ...unlock, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tradingToolUnlocks.id, id)).returning();
    return result[0];
  }
  // Comic Collection Achievement Methods
  async getComicCollectionAchievements(filters) {
    let query = db.select().from(comicCollectionAchievements);
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(comicCollectionAchievements.category, filters.category));
    }
    if (filters?.tier) {
      conditions.push(eq(comicCollectionAchievements.tier, filters.tier));
    }
    if (filters?.isActive !== void 0) {
      conditions.push(eq(comicCollectionAchievements.isActive, filters.isActive));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(comicCollectionAchievements.displayOrder);
  }
  async createComicCollectionAchievement(achievement) {
    const result = await db.insert(comicCollectionAchievements).values(achievement).returning();
    return result[0];
  }
  async updateComicCollectionAchievement(id, achievement) {
    const result = await db.update(comicCollectionAchievements).set({ ...achievement, updatedAt: /* @__PURE__ */ new Date() }).where(eq(comicCollectionAchievements.id, id)).returning();
    return result[0];
  }
  // Collection Challenge Methods
  async getCollectionChallenges(filters) {
    let query = db.select().from(collectionChallenges);
    const conditions = [];
    if (filters?.isActive !== void 0) {
      conditions.push(eq(collectionChallenges.isActive, filters.isActive));
    }
    if (filters?.challengeType) {
      conditions.push(eq(collectionChallenges.challengeType, filters.challengeType));
    }
    if (filters?.currentOnly) {
      const now = /* @__PURE__ */ new Date();
      conditions.push(
        and(
          sql`${collectionChallenges.startDate} <= ${now}`,
          sql`${collectionChallenges.endDate} >= ${now}`
        )
      );
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(collectionChallenges.startDate));
  }
  async getUserChallengeParticipation(userId, challengeId) {
    let query = db.select().from(userChallengeParticipation).where(eq(userChallengeParticipation.userId, userId));
    if (challengeId) {
      query = query.where(eq(userChallengeParticipation.challengeId, challengeId));
    }
    return await query.orderBy(desc(userChallengeParticipation.enrolledAt));
  }
  async createUserChallengeParticipation(participation) {
    const result = await db.insert(userChallengeParticipation).values(participation).returning();
    return result[0];
  }
  async updateUserChallengeParticipation(id, participation) {
    const result = await db.update(userChallengeParticipation).set({ ...participation, lastProgressUpdate: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq(userChallengeParticipation.id, id)).returning();
    return result[0];
  }
  // Additional Missing Methods for Phase 1 Core Trading Foundation
  async getAllMarginAccounts() {
    return await db.select().from(marginAccounts).where(eq(marginAccounts.isActive, true)).orderBy(desc(marginAccounts.marginEquity));
  }
  // =============================================================================
  // COLLECTOR-GRADE ASSET DISPLAY METHODS
  // =============================================================================
  // Graded Asset Profile Methods
  async createGradedAssetProfile(profileData) {
    const result = await db.insert(gradedAssetProfiles).values(profileData).returning();
    return result[0];
  }
  async getUserGradedAssetProfiles(userId, filters) {
    const conditions = [eq(gradedAssetProfiles.userId, userId)];
    if (filters?.rarityFilter) {
      conditions.push(eq(gradedAssetProfiles.rarityTier, filters.rarityFilter));
    }
    if (filters?.storageTypeFilter) {
      conditions.push(eq(gradedAssetProfiles.storageType, filters.storageTypeFilter));
    }
    const query = db.select().from(gradedAssetProfiles).where(and(...conditions));
    const sortField = filters?.sortBy === "grade" ? gradedAssetProfiles.overallGrade : filters?.sortBy === "value" ? gradedAssetProfiles.currentMarketValue : gradedAssetProfiles.displayPriority;
    return await query.orderBy(desc(sortField), desc(gradedAssetProfiles.acquisitionDate));
  }
  async getGradedAssetProfile(profileId, userId) {
    const conditions = [eq(gradedAssetProfiles.id, profileId)];
    if (userId) {
      conditions.push(eq(gradedAssetProfiles.userId, userId));
    }
    const result = await db.select().from(gradedAssetProfiles).where(and(...conditions));
    return result[0];
  }
  async updateGradedAssetProfile(profileId, updates, userId) {
    const conditions = [eq(gradedAssetProfiles.id, profileId)];
    if (userId) {
      conditions.push(eq(gradedAssetProfiles.userId, userId));
    }
    const result = await db.update(gradedAssetProfiles).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(...conditions)).returning();
    return result[0];
  }
  async deleteGradedAssetProfile(profileId, userId) {
    const conditions = [eq(gradedAssetProfiles.id, profileId)];
    if (userId) {
      conditions.push(eq(gradedAssetProfiles.userId, userId));
    }
    const result = await db.delete(gradedAssetProfiles).where(and(...conditions)).returning();
    return result.length > 0;
  }
  // Collection Storage Box Methods
  // CRITICAL SECURITY: This method requires userId to ensure users can only see their own storage boxes
  async getCollectionStorageBoxes(userId, filters) {
    const conditions = [eq(collectionStorageBoxes.userId, userId)];
    if (filters?.boxType) {
      conditions.push(eq(collectionStorageBoxes.boxType, filters.boxType));
    }
    let query = db.select().from(collectionStorageBoxes).where(and(...conditions));
    if (filters?.sortBy === "name") {
      query = query.orderBy(collectionStorageBoxes.boxName);
    } else {
      query = query.orderBy(desc(collectionStorageBoxes.createdAt));
    }
    return await query;
  }
  async createCollectionStorageBox(boxData) {
    const result = await db.insert(collectionStorageBoxes).values(boxData).returning();
    return result[0];
  }
  async updateCollectionStorageBox(boxId, updates, userId) {
    const conditions = [eq(collectionStorageBoxes.id, boxId)];
    if (userId) {
      conditions.push(eq(collectionStorageBoxes.userId, userId));
    }
    const result = await db.update(collectionStorageBoxes).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(...conditions)).returning();
    return result[0];
  }
  // Variant Cover Registry Methods
  async getVariantCoversByAsset(baseAssetId) {
    return await db.select().from(variantCoverRegistry).where(eq(variantCoverRegistry.baseAssetId, baseAssetId)).orderBy(desc(variantCoverRegistry.baseRarityMultiplier));
  }
  async createVariantCover(variantData) {
    const result = await db.insert(variantCoverRegistry).values(variantData).returning();
    return result[0];
  }
  async getVariantCover(variantId) {
    const result = await db.select().from(variantCoverRegistry).where(eq(variantCoverRegistry.id, variantId));
    return result[0];
  }
  async searchVariantCovers(criteria) {
    let query = db.select().from(variantCoverRegistry);
    const conditions = [];
    if (criteria.variantType) {
      conditions.push(eq(variantCoverRegistry.variantType, criteria.variantType));
    }
    if (criteria.coverArtist) {
      conditions.push(ilike(variantCoverRegistry.coverArtist, `%${criteria.coverArtist}%`));
    }
    if (criteria.maxPrice) {
      conditions.push(sql`${variantCoverRegistry.currentPremium} <= ${criteria.maxPrice}`);
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(variantCoverRegistry.baseRarityMultiplier));
  }
  // Collection Analytics Methods
  async getCollectionAnalytics(userId) {
    const profiles = await this.getUserGradedAssetProfiles(userId);
    if (profiles.length === 0) {
      return {
        totalItems: 0,
        totalValue: 0,
        averageGrade: 0,
        gradeDistribution: {},
        rarityDistribution: {},
        houseDistribution: {},
        keyIssuesCount: 0,
        signedCount: 0,
        growthRate: 0,
        topPerformers: []
      };
    }
    const totalValue = profiles.reduce((sum, profile) => sum + (profile.currentMarketValue || 0), 0);
    const averageGrade = profiles.reduce((sum, profile) => sum + profile.overallGrade, 0) / profiles.length;
    const gradeDistribution = {};
    profiles.forEach((profile) => {
      const gradeRange = Math.floor(profile.overallGrade);
      const key = `${gradeRange}.0-${gradeRange}.9`;
      gradeDistribution[key] = (gradeDistribution[key] || 0) + 1;
    });
    const rarityDistribution = {};
    profiles.forEach((profile) => {
      rarityDistribution[profile.rarityTier] = (rarityDistribution[profile.rarityTier] || 0) + 1;
    });
    const houseDistribution = {};
    profiles.forEach((profile) => {
      if (profile.houseAffiliation) {
        houseDistribution[profile.houseAffiliation] = (houseDistribution[profile.houseAffiliation] || 0) + 1;
      }
    });
    const keyIssuesCount = profiles.filter((p) => p.isKeyIssue).length;
    const signedCount = profiles.filter((p) => p.isSigned).length;
    const totalAcquisitionValue = profiles.reduce((sum, profile) => sum + (profile.acquisitionPrice || 0), 0);
    const growthRate = totalAcquisitionValue > 0 ? (totalValue - totalAcquisitionValue) / totalAcquisitionValue * 100 : 0;
    const topPerformers = profiles.filter((p) => p.acquisitionPrice && p.currentMarketValue).sort((a, b) => {
      const aAppreciation = (a.currentMarketValue - a.acquisitionPrice) / a.acquisitionPrice;
      const bAppreciation = (b.currentMarketValue - b.acquisitionPrice) / b.acquisitionPrice;
      return bAppreciation - aAppreciation;
    }).slice(0, 5);
    return {
      totalItems: profiles.length,
      totalValue,
      averageGrade: Math.round(averageGrade * 10) / 10,
      gradeDistribution,
      rarityDistribution,
      houseDistribution,
      keyIssuesCount,
      signedCount,
      growthRate: Math.round(growthRate * 100) / 100,
      topPerformers
    };
  }
  // ==========================================
  // PHASE 1 CORE TRADING FOUNDATIONS
  // ==========================================
  // Trades - Executed trades with P&L tracking
  async getTrade(id) {
    const [trade] = await this.db.select().from(trades).where(eq(trades.id, id)).limit(1);
    return trade;
  }
  async getTrades(userId, portfolioId, limit) {
    const query = this.db.select().from(trades).where(and(
      eq(trades.userId, userId),
      eq(trades.portfolioId, portfolioId)
    )).orderBy(desc(trades.executedAt));
    return limit ? await query.limit(limit) : await query;
  }
  async getTradesByAsset(userId, assetId, limit) {
    const query = this.db.select().from(trades).where(and(
      eq(trades.userId, userId),
      eq(trades.assetId, assetId)
    )).orderBy(desc(trades.executedAt));
    return limit ? await query.limit(limit) : await query;
  }
  async createTrade(trade) {
    const [newTrade] = await this.db.insert(trades).values(trade).returning();
    return newTrade;
  }
  async updateTrade(id, trade) {
    const [updated] = await this.db.update(trades).set({ ...trade, updatedAt: /* @__PURE__ */ new Date() }).where(eq(trades.id, id)).returning();
    return updated;
  }
  // Positions - Current open positions with unrealized P&L
  async getPosition(userId, portfolioId, assetId) {
    const [position] = await this.db.select().from(positions).where(and(
      eq(positions.userId, userId),
      eq(positions.portfolioId, portfolioId),
      eq(positions.assetId, assetId)
    )).limit(1);
    return position;
  }
  async getPositions(userId, portfolioId) {
    return await this.db.select().from(positions).where(and(
      eq(positions.userId, userId),
      eq(positions.portfolioId, portfolioId)
    )).orderBy(desc(positions.currentValue));
  }
  async getPositionById(id) {
    const [position] = await this.db.select().from(positions).where(eq(positions.id, id)).limit(1);
    return position;
  }
  async createPosition(position) {
    const [newPosition] = await this.db.insert(positions).values(position).returning();
    return newPosition;
  }
  async updatePosition(id, position) {
    const [updated] = await this.db.update(positions).set({ ...position, updatedAt: /* @__PURE__ */ new Date() }).where(eq(positions.id, id)).returning();
    return updated;
  }
  async deletePosition(id) {
    const result = await this.db.delete(positions).where(eq(positions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  // Balances - User account balances and buying power
  async getBalance(userId, portfolioId) {
    const [balance] = await this.db.select().from(balances).where(and(
      eq(balances.userId, userId),
      eq(balances.portfolioId, portfolioId)
    )).limit(1);
    return balance;
  }
  async getBalanceById(id) {
    const [balance] = await this.db.select().from(balances).where(eq(balances.id, id)).limit(1);
    return balance;
  }
  async createBalance(balance) {
    const [newBalance] = await this.db.insert(balances).values(balance).returning();
    return newBalance;
  }
  async updateBalance(id, balance) {
    const [updated] = await this.db.update(balances).set({ ...balance, updatedAt: /* @__PURE__ */ new Date() }).where(eq(balances.id, id)).returning();
    return updated;
  }
  async recalculateBalance(userId, portfolioId) {
    const userPositions = await this.getPositions(userId, portfolioId);
    const positionsValue = userPositions.reduce(
      (sum, position) => sum + parseFloat(position.currentValue || "0"),
      0
    );
    const balance = await this.getBalance(userId, portfolioId);
    if (balance) {
      const cash = parseFloat(balance.cash);
      const reservedCash = parseFloat(balance.reservedCash || "0");
      const totalValue = cash + positionsValue;
      const buyingPower = cash - reservedCash;
      return await this.updateBalance(balance.id, {
        totalValue: totalValue.toString(),
        buyingPower: buyingPower.toString()
      });
    }
    return void 0;
  }
  // Moral Consequence System Methods
  async createVictim(victim) {
    const [newVictim] = await this.db.insert(tradingVictims).values(victim).returning();
    return newVictim;
  }
  async getMoralStanding(userId) {
    const [standing] = await this.db.select().from(moralStandings).where(eq(moralStandings.userId, userId)).limit(1);
    return standing;
  }
  async createMoralStanding(moralStanding) {
    const [newStanding] = await this.db.insert(moralStandings).values(moralStanding).returning();
    return newStanding;
  }
  async updateMoralStanding(userId, updates) {
    const [updated] = await this.db.update(moralStandings).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(moralStandings.userId, userId)).returning();
    return updated;
  }
  // Alignment Score Methods for Entry Test
  async getUserAlignmentScore(userId) {
    const [score] = await db.select().from(alignmentScores).where(eq(alignmentScores.userId, userId)).limit(1);
    return score;
  }
  async createAlignmentScore(score) {
    const [newScore] = await db.insert(alignmentScores).values(score).returning();
    return newScore;
  }
  async updateAlignmentScore(userId, updates) {
    const [updated] = await db.update(alignmentScores).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(alignmentScores.userId, userId)).returning();
    return updated;
  }
  // User Decision Methods for Entry Test
  async recordUserDecision(decision) {
    const [newDecision] = await db.insert(userDecisions).values(decision).returning();
    return newDecision;
  }
  async getUserDecisions(userId, filters) {
    let query = db.select().from(userDecisions).where(eq(userDecisions.userId, userId)).$dynamic();
    if (filters?.scenarioId) {
      query = query.where(eq(userDecisions.scenarioId, filters.scenarioId));
    }
    if (filters?.sessionId) {
      query = query.where(eq(userDecisions.sessionId, filters.sessionId));
    }
    if (filters?.limit && filters.limit > 0) {
      query = query.limit(filters.limit);
    }
    const decisions = await query.orderBy(desc(userDecisions.timestamp));
    return decisions;
  }
  async calculateHouseAssignment(userId) {
    const alignmentScore = await this.getUserAlignmentScore(userId);
    if (!alignmentScore) {
      return {
        primaryHouse: "equilibrium_trust",
        secondaryHouse: "catalyst_syndicate",
        alignmentProfile: {
          ruthlessness: 0,
          individualism: 0,
          lawfulness: 0,
          greed: 0
        },
        confidence: 0.5
      };
    }
    const profile = {
      ruthlessness: parseFloat(alignmentScore.ruthlessnessScore),
      individualism: parseFloat(alignmentScore.individualismScore),
      lawfulness: parseFloat(alignmentScore.lawfulnessScore),
      greed: parseFloat(alignmentScore.greedScore)
    };
    const { calculateHouseAssignment: calculateHouseAssignment2 } = await Promise.resolve().then(() => (init_entryTestScenarios(), entryTestScenarios_exports));
    const assignment = calculateHouseAssignment2(profile);
    const avgConfidence = (parseFloat(alignmentScore.ruthlessnessConfidence) + parseFloat(alignmentScore.individualismConfidence) + parseFloat(alignmentScore.lawfulnessConfidence) + parseFloat(alignmentScore.greedConfidence)) / 4;
    return {
      primaryHouse: assignment.primaryHouse,
      secondaryHouse: assignment.secondaryHouse,
      alignmentProfile: profile,
      confidence: avgConfidence
    };
  }
  // Knowledge Test Methods
  async createKnowledgeTestResult(data) {
    const result = await db.insert(knowledgeTestResults).values(data).returning();
    return result[0];
  }
  async getLatestKnowledgeTestResult(userId) {
    const result = await db.select().from(knowledgeTestResults).where(eq(knowledgeTestResults.userId, userId)).orderBy(desc(knowledgeTestResults.completedAt)).limit(1);
    return result[0];
  }
  async createKnowledgeTestResponse(data) {
    const result = await db.insert(knowledgeTestResponses).values(data).returning();
    return result[0];
  }
  async getKnowledgeTestResponses(resultId) {
    return await db.select().from(knowledgeTestResponses).where(eq(knowledgeTestResponses.resultId, resultId));
  }
  // ============================================================================
  // SEVEN HOUSES OF PANELTOWN METHODS
  // ============================================================================
  async getSevenHouse(id) {
    const result = await db.select().from(sevenHouses).where(eq(sevenHouses.id, id)).limit(1);
    return result[0];
  }
  async getSevenHouseByName(name) {
    const result = await db.select().from(sevenHouses).where(eq(sevenHouses.name, name)).limit(1);
    return result[0];
  }
  async getAllSevenHouses() {
    return await db.select().from(sevenHouses).orderBy(desc(sevenHouses.powerLevel));
  }
  async createSevenHouse(house) {
    const result = await db.insert(sevenHouses).values(house).returning();
    return result[0];
  }
  async updateSevenHouse(id, house) {
    const result = await db.update(sevenHouses).set(house).where(eq(sevenHouses.id, id)).returning();
    return result[0];
  }
  // Convenience aliases for consistent API
  async getHouse(id) {
    return this.getSevenHouse(id);
  }
  async getAllHouses() {
    return this.getAllSevenHouses();
  }
  async createHouse(house) {
    return this.createSevenHouse(house);
  }
  // House Power Rankings
  async getLatestPowerRankings() {
    return await db.select().from(housePowerRankings).orderBy(desc(housePowerRankings.weekEnding)).limit(7);
  }
  async getHousePowerRankings() {
    return this.getLatestPowerRankings();
  }
  async updateHousePowerRanking(houseId, changeAmount, reason) {
    const house = await this.getSevenHouse(houseId);
    if (!house) throw new Error("House not found");
    const newPowerLevel = parseFloat(house.powerLevel || "100") + changeAmount;
    return await this.updateSevenHouse(houseId, {
      powerLevel: newPowerLevel.toString()
    });
  }
  // House Market Events
  async getHouseMarketEvents(limit = 10) {
    return await db.select().from(houseMarketEvents).orderBy(desc(houseMarketEvents.eventTimestamp)).limit(limit);
  }
  async createHouseMarketEvent(event) {
    const result = await db.insert(houseMarketEvents).values(event).returning();
    return result[0];
  }
  // House Assets
  async getAssetsByHouse(houseId) {
    return [];
  }
  async getHouseStatistics(houseId) {
    const house = await this.getSevenHouse(houseId);
    if (!house) return null;
    return {
      totalMarketCap: house.marketCap || "0",
      totalVolume24h: house.dailyVolume || "0",
      memberCount: house.controlledAssetsCount || 0,
      powerLevel: house.powerLevel || "100",
      reputationScore: house.reputationScore || "100"
    };
  }
};
var databaseStorage = new DatabaseStorage();

// scripts/fast-generation.ts
var TARGET = 3e5;
var BATCH = 500;
var PUBS = ["DC Comics", "Marvel Comics", "Image", "Dark Horse", "IDW", "Boom!", "Dynamite", "Valiant"];
var TYPES = ["character", "comic", "creator", "franchise"];
async function fastGen() {
  console.log(`\u{1F680} FAST GENERATION: ${TARGET.toLocaleString()} ASSETS
`);
  let done = 0;
  const start = Date.now();
  for (let b = 0; b < TARGET / BATCH; b++) {
    const aB = [];
    const pB = [];
    for (let i = 0; i < BATCH; i++) {
      const idx = b * BATCH + i;
      const type = TYPES[idx % 4];
      const pub = PUBS[idx % 8];
      const price = 50 + Math.random() * 950;
      const float = 1e5 + Math.floor(Math.random() * 9e5);
      aB.push({
        symbol: `FAST${idx + 2e4}`,
        name: `Asset ${idx + 2e4}`,
        type,
        description: `${pub} ${type}`,
        metadata: { publisher: pub }
      });
      pB.push({
        currentPrice: parseFloat(price.toFixed(2)),
        totalMarketValue: price * float,
        totalFloat: float,
        sharesPerCopy: 100,
        scarcityModifier: parseFloat((0.9 + Math.random() * 0.3).toFixed(3)),
        averageComicValue: price * 100,
        priceSource: "FastGen-3",
        marketStatus: "open",
        volume: Math.floor(Math.random() * 1e5)
      });
    }
    try {
      const ins = await db.insert(assets).values(aB).returning();
      await db.insert(assetCurrentPrices).values(pB.map((p, i) => ({ ...p, assetId: ins[i].id })));
      done += BATCH;
      if (b % 20 === 0) {
        const r = (done / ((Date.now() - start) / 1e3)).toFixed(0);
        const eta = ((TARGET - done) / parseInt(r) / 60).toFixed(1);
        console.log(`\u2705 ${done.toLocaleString()}/${TARGET.toLocaleString()} | ${r}/s | ETA: ${eta}m`);
      }
    } catch (e) {
      console.error(`\u274C Batch ${b}: ${e.message}`);
    }
  }
  console.log(`
\u{1F3C1} DONE! ${done.toLocaleString()} assets`);
}
fastGen().catch(console.error).finally(() => process.exit());
