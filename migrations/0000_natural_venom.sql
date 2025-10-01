CREATE TABLE "ai_market_predictions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"prediction_type" text NOT NULL,
	"timeframe" text NOT NULL,
	"current_price" numeric(15, 2),
	"predicted_price" numeric(15, 2),
	"predicted_change" numeric(8, 4),
	"confidence" numeric(5, 4),
	"reasoning" text,
	"market_factors" jsonb,
	"risk_level" text,
	"ai_model" text DEFAULT 'gpt-4o-mini',
	"house_bonus" jsonb,
	"karma_influence" numeric(5, 4),
	"actual_outcome" numeric(8, 4),
	"accuracy" numeric(5, 4),
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_oracle_personas" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"persona_name" text NOT NULL,
	"description" text,
	"house_affinity" text,
	"personality_traits" jsonb,
	"response_style" jsonb,
	"expertise" jsonb,
	"mystical_language" jsonb,
	"divine_symbols" jsonb,
	"power_level" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"avg_user_rating" numeric(3, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alignment_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"previous_lawful_chaotic" numeric(8, 2) NOT NULL,
	"previous_good_evil" numeric(8, 2) NOT NULL,
	"new_lawful_chaotic" numeric(8, 2) NOT NULL,
	"new_good_evil" numeric(8, 2) NOT NULL,
	"alignment_shift_magnitude" numeric(8, 2) NOT NULL,
	"triggering_action_type" text NOT NULL,
	"triggering_action_id" varchar,
	"karma_at_time_of_shift" integer NOT NULL,
	"house_id" text,
	"alignment_phase" text NOT NULL,
	"cosmic_event" text,
	"prophecy_unlocked" text,
	"significance_level" text DEFAULT 'minor',
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alignment_scores" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"ruthlessness_score" numeric(6, 2) DEFAULT '0.00',
	"individualism_score" numeric(6, 2) DEFAULT '0.00',
	"lawfulness_score" numeric(6, 2) DEFAULT '0.00',
	"greed_score" numeric(6, 2) DEFAULT '0.00',
	"ruthlessness_confidence" numeric(4, 2) DEFAULT '1.00',
	"individualism_confidence" numeric(4, 2) DEFAULT '1.00',
	"lawfulness_confidence" numeric(4, 2) DEFAULT '1.00',
	"greed_confidence" numeric(4, 2) DEFAULT '1.00',
	"assigned_house_id" varchar,
	"assignment_score" numeric(8, 2),
	"secondary_house_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alignment_thresholds" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"threshold_name" text NOT NULL,
	"alignment_type" text NOT NULL,
	"min_lawful_chaotic" numeric(8, 2),
	"max_lawful_chaotic" numeric(8, 2),
	"min_good_evil" numeric(8, 2),
	"max_good_evil" numeric(8, 2),
	"min_karma" integer,
	"max_karma" integer,
	"compatible_houses" text[],
	"conflicting_houses" text[],
	"trading_bonuses" jsonb,
	"trading_restrictions" jsonb,
	"special_abilities" jsonb,
	"cosmic_title" text NOT NULL,
	"mystical_description" text NOT NULL,
	"alignment_aura" text,
	"prophecy_text" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "asset_current_prices" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"current_price" numeric(10, 2) NOT NULL,
	"bid_price" numeric(10, 2),
	"ask_price" numeric(10, 2),
	"day_change" numeric(10, 2),
	"day_change_percent" numeric(8, 2),
	"week_high" numeric(10, 2),
	"volume" integer DEFAULT 0,
	"last_trade_price" numeric(10, 2),
	"last_trade_quantity" numeric(10, 4),
	"last_trade_time" timestamp,
	"market_status" text DEFAULT 'open',
	"price_source" text DEFAULT 'simulation',
	"volatility" numeric(8, 2),
	"beta" numeric(3, 2),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "asset_financial_mapping" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"instrument_type" text NOT NULL,
	"instrument_subtype" text,
	"underlying_asset_id" varchar,
	"share_class" text DEFAULT 'A',
	"voting_rights" boolean DEFAULT true,
	"dividend_eligible" boolean DEFAULT false,
	"dividend_yield" numeric(8, 4),
	"credit_rating" text,
	"maturity_date" timestamp,
	"coupon_rate" numeric(8, 4),
	"face_value" numeric(10, 2),
	"fund_components" text[],
	"expense_ratio" numeric(8, 4),
	"tracking_index" text,
	"rebalance_frequency" text,
	"lot_size" integer DEFAULT 1,
	"tick_size" numeric(8, 4) DEFAULT '0.0100',
	"margin_requirement" numeric(8, 2) DEFAULT '50.00',
	"short_sell_allowed" boolean DEFAULT true,
	"last_split_date" timestamp,
	"split_ratio" text,
	"last_dividend_date" timestamp,
	"ex_dividend_date" timestamp,
	"security_type" text NOT NULL,
	"exchange_listing" text DEFAULT 'PPX',
	"cusip" text,
	"isin" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"image_url" text,
	"metadata" jsonb,
	"house_id" varchar,
	"house_influence_percent" numeric(5, 2) DEFAULT '0.00',
	"narrative_weight" numeric(5, 2) DEFAULT '50.00',
	"controlled_since" timestamp,
	"previous_house_id" varchar,
	"metadata_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "assets_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "balances" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"cash" numeric(15, 2) DEFAULT '100000.00' NOT NULL,
	"total_value" numeric(15, 2) DEFAULT '100000.00' NOT NULL,
	"buying_power" numeric(15, 2) DEFAULT '100000.00' NOT NULL,
	"positions_value" numeric(15, 2) DEFAULT '0.00',
	"total_cost_basis" numeric(15, 2) DEFAULT '0.00',
	"realized_pnl" numeric(15, 2) DEFAULT '0.00',
	"unrealized_pnl" numeric(15, 2) DEFAULT '0.00',
	"total_pnl" numeric(15, 2) DEFAULT '0.00',
	"day_start_balance" numeric(15, 2),
	"day_pnl" numeric(15, 2) DEFAULT '0.00',
	"day_pnl_percent" numeric(8, 2) DEFAULT '0.00',
	"all_time_high" numeric(15, 2) DEFAULT '100000.00',
	"all_time_low" numeric(15, 2) DEFAULT '100000.00',
	"win_rate" numeric(5, 2),
	"sharpe_ratio" numeric(5, 2),
	"margin_used" numeric(15, 2) DEFAULT '0.00',
	"maintenance_margin" numeric(15, 2) DEFAULT '0.00',
	"margin_call_level" numeric(15, 2),
	"last_trade_at" timestamp,
	"last_calculated_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "battle_scenarios" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character1_id" varchar NOT NULL,
	"character2_id" varchar,
	"battle_type" text DEFAULT 'one_vs_one',
	"outcome" integer NOT NULL,
	"environment" text,
	"weather_conditions" text,
	"additional_factors" jsonb,
	"market_impact_percent" numeric(8, 2),
	"fan_engagement" integer DEFAULT 0,
	"media_attention" numeric(3, 2) DEFAULT '1.00',
	"duration" integer,
	"decisiveness" text,
	"is_canonical" boolean DEFAULT false,
	"event_date" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "beat_the_ai_challenges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"target_assets" text[] NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"prize_pool" numeric(10, 2) NOT NULL,
	"participant_count" integer DEFAULT 0,
	"ai_prediction" numeric(8, 2) NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beat_the_ai_leaderboard" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"username" text NOT NULL,
	"total_score" numeric(10, 2) DEFAULT '0',
	"accuracy" numeric(8, 2) DEFAULT '0',
	"total_predictions" integer DEFAULT 0,
	"winnings" numeric(10, 2) DEFAULT '0',
	"rank" integer DEFAULT 0,
	"last_active" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beat_the_ai_predictions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"username" text NOT NULL,
	"asset_symbol" text NOT NULL,
	"predicted_change" numeric(8, 2) NOT NULL,
	"submission_time" timestamp DEFAULT now() NOT NULL,
	"actual_change" numeric(8, 2),
	"score" numeric(8, 2),
	"is_winner" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "career_pathway_levels" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pathway" text NOT NULL,
	"level" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"display_order" integer NOT NULL,
	"trading_feature_unlocks" jsonb,
	"base_salary_max" numeric(15, 2) NOT NULL,
	"certification_bonus_percent" numeric(5, 2) DEFAULT '100.00',
	"master_bonus_percent" numeric(5, 2) DEFAULT '150.00',
	"prerequisite_level" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "certification_courses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pathway_level_id" varchar NOT NULL,
	"course_number" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text NOT NULL,
	"estimated_duration_hours" integer DEFAULT 2,
	"modules" jsonb NOT NULL,
	"learning_objectives" text[],
	"prerequisites" text[],
	"exam_questions" jsonb NOT NULL,
	"passing_score" integer DEFAULT 70,
	"max_attempts" integer DEFAULT 3,
	"retry_penalty_amount" numeric(10, 2),
	"feature_unlocks" jsonb,
	"trading_permissions" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "character_battle_scenarios" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character1_id" varchar NOT NULL,
	"character2_id" varchar NOT NULL,
	"battle_type" text NOT NULL,
	"battle_context" text,
	"power_level_data" jsonb,
	"win_probability" numeric(5, 4),
	"battle_factors" jsonb,
	"historical_data" jsonb,
	"house_advantages" jsonb,
	"predicted_outcome" text,
	"market_impact" numeric(8, 4),
	"confidence" numeric(5, 4),
	"actual_result" text,
	"accuracy" numeric(5, 4),
	"is_active" boolean DEFAULT true,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "club_activity_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" varchar NOT NULL,
	"action_type" text NOT NULL,
	"user_id" varchar,
	"details" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "club_memberships" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"contribution_amount" numeric(15, 2),
	"share_percentage" numeric(5, 2),
	"joined_at" timestamp DEFAULT now(),
	"left_at" timestamp,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club_portfolios" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"total_value" numeric(15, 2),
	"cash_balance" numeric(15, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "club_proposals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" varchar NOT NULL,
	"proposer_id" varchar NOT NULL,
	"proposal_type" text NOT NULL,
	"asset_id" varchar,
	"quantity" integer,
	"target_price" numeric(10, 2),
	"rationale" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"votes_for" integer DEFAULT 0,
	"votes_against" integer DEFAULT 0,
	"votes_needed" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"executed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "club_votes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"vote" text NOT NULL,
	"voted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collection_challenges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_title" text NOT NULL,
	"challenge_description" text NOT NULL,
	"challenge_type" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"challenge_duration" text,
	"challenge_goal" jsonb NOT NULL,
	"target_metric" text NOT NULL,
	"target_value" numeric(15, 2) NOT NULL,
	"eligibility_requirements" jsonb,
	"house_specific" boolean DEFAULT false,
	"target_house" text,
	"cross_house_bonus" boolean DEFAULT false,
	"completion_rewards" jsonb NOT NULL,
	"leaderboard_rewards" jsonb,
	"participation_rewards" jsonb,
	"exclusive_unlocks" text[],
	"difficulty_level" integer DEFAULT 3,
	"max_participants" integer,
	"current_participants" integer DEFAULT 0,
	"leaderboard_enabled" boolean DEFAULT true,
	"real_time_tracking" boolean DEFAULT true,
	"progress_visibility" text DEFAULT 'public',
	"challenge_banner" text,
	"challenge_icon" text,
	"theme_color" text,
	"narrative_context" text,
	"created_by" varchar,
	"is_active" boolean DEFAULT true,
	"is_recurring" boolean DEFAULT false,
	"recurring_pattern" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collection_storage_boxes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"box_name" text NOT NULL,
	"box_type" text NOT NULL,
	"capacity" integer NOT NULL,
	"current_count" integer DEFAULT 0,
	"organization_method" text DEFAULT 'alphabetical',
	"series_filter" text,
	"publisher_filter" text,
	"location" text,
	"condition" text DEFAULT 'excellent',
	"total_value" numeric(15, 2) DEFAULT '0.00',
	"average_grade" numeric(3, 1),
	"key_issues_count" integer DEFAULT 0,
	"common_count" integer DEFAULT 0,
	"uncommon_count" integer DEFAULT 0,
	"rare_count" integer DEFAULT 0,
	"ultra_rare_count" integer DEFAULT 0,
	"legendary_count" integer DEFAULT 0,
	"mythic_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comic_collection_achievements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"achievement_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"requirement_type" text NOT NULL,
	"required_count" integer,
	"required_value" numeric(15, 2),
	"required_rarity" text,
	"specific_requirements" jsonb,
	"achievement_points" integer DEFAULT 0,
	"trading_tools_unlocked" text[],
	"house_progression_bonus" jsonb,
	"special_abilities" text[],
	"trading_bonuses" jsonb,
	"badge_icon" text,
	"badge_color" text,
	"tier" text DEFAULT 'bronze',
	"rarity" text DEFAULT 'common',
	"achievement_story" text,
	"comic_panel_style" text,
	"speech_bubble_text" text,
	"prerequisite_achievements" text[],
	"blocked_by" text[],
	"is_hidden" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "comic_collection_achievements_achievement_id_unique" UNIQUE("achievement_id")
);
--> statement-breakpoint
CREATE TABLE "comic_creators" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"biography" text,
	"image_url" text,
	"birth_date" text,
	"death_date" text,
	"nationality" text,
	"total_issues" integer DEFAULT 0,
	"active_years" text,
	"notable_works" text[],
	"awards" text[],
	"market_influence" numeric(8, 2),
	"trending_score" numeric(8, 2),
	"creator_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comic_grading_predictions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"image_url" text NOT NULL,
	"image_name" text,
	"predicted_grade" numeric(3, 1) NOT NULL,
	"grade_category" text NOT NULL,
	"condition_factors" jsonb NOT NULL,
	"confidence_score" numeric(8, 2) NOT NULL,
	"analysis_details" text NOT NULL,
	"grading_notes" text,
	"processing_time_ms" integer,
	"ai_model" text DEFAULT 'gpt-5',
	"status" text DEFAULT 'completed' NOT NULL,
	"image_embedding" vector(1536),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comic_issue_variants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"issue_number" text NOT NULL,
	"series_title" text NOT NULL,
	"publisher" text NOT NULL,
	"cover_type" text NOT NULL,
	"variant_ratio" text,
	"variant_description" text,
	"artist_name" text,
	"rarity_score" numeric(8, 2) NOT NULL,
	"progression_tier" integer DEFAULT 1 NOT NULL,
	"trading_tools_unlocked" text[],
	"issue_type" text DEFAULT 'regular',
	"key_characters" text[],
	"significant_events" text[],
	"story_arcs" text[],
	"house_relevance" jsonb,
	"primary_house" text,
	"base_market_value" numeric(10, 2) NOT NULL,
	"progression_multiplier" numeric(3, 2) DEFAULT '1.00',
	"collector_demand" numeric(3, 2) DEFAULT '1.00',
	"release_date" text,
	"comic_grading_eligible" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comic_issues" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"series_id" varchar,
	"comic_name" text NOT NULL,
	"active_years" text,
	"issue_title" text NOT NULL,
	"publish_date" text,
	"issue_description" text,
	"penciler" text,
	"writer" text,
	"cover_artist" text,
	"imprint" text,
	"format" text,
	"rating" text,
	"price" text,
	"cover_image_url" text,
	"issue_number" integer,
	"volume" integer,
	"current_value" numeric(10, 2),
	"grade_condition" text,
	"market_trend" text,
	"content_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comic_series" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"series_name" text NOT NULL,
	"publisher" text NOT NULL,
	"year" integer,
	"issue_count" text,
	"cover_status" text,
	"published_period" text,
	"series_url" text,
	"covers_url" text,
	"scans_url" text,
	"featured_cover_url" text,
	"description" text,
	"series_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "competition_leagues" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"season" text NOT NULL,
	"entry_fee" numeric(10, 2) DEFAULT '0',
	"prize_pool" numeric(10, 2) DEFAULT '0',
	"max_participants" integer DEFAULT 100,
	"current_participants" integer DEFAULT 0,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"rules" jsonb,
	"ai_opponents" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "competition_participants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" varchar NOT NULL,
	"user_id" varchar,
	"participant_type" text NOT NULL,
	"participant_name" text NOT NULL,
	"ai_strategy" text,
	"portfolio_value" numeric(15, 2) DEFAULT '100000',
	"total_return" numeric(10, 2) DEFAULT '0',
	"total_return_percent" numeric(8, 2) DEFAULT '0',
	"current_rank" integer,
	"trades" integer DEFAULT 0,
	"win_rate" numeric(8, 2),
	"risk_score" numeric(3, 1),
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"required_tier" text DEFAULT 'free' NOT NULL,
	"duration" integer,
	"modules" jsonb,
	"prerequisites" text[],
	"learning_outcomes" text[],
	"thumbnail_url" text,
	"video_url" text,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dark_pools" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"shadow_liquidity" numeric(15, 2) NOT NULL,
	"hidden_orders" integer DEFAULT 0,
	"average_spread" numeric(8, 4),
	"access_level" integer DEFAULT 30 NOT NULL,
	"participant_count" integer DEFAULT 0,
	"pool_type" text DEFAULT 'standard',
	"volatility" numeric(8, 2),
	"blood_in_water" boolean DEFAULT false,
	"last_blood_time" timestamp,
	"total_volume_24h" numeric(15, 2) DEFAULT '0.00',
	"total_trades_24h" integer DEFAULT 0,
	"largest_trade" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "detailed_karma_actions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"action_type" text NOT NULL,
	"action_category" text NOT NULL,
	"action_subtype" text,
	"karma_change" integer NOT NULL,
	"lawful_chaotic_impact" numeric(8, 2) DEFAULT '0.00',
	"good_evil_impact" numeric(8, 2) DEFAULT '0.00',
	"trading_behavior_pattern" text,
	"community_interaction" text,
	"risk_taking_behavior" text,
	"asset_id" varchar,
	"order_id" varchar,
	"house_id" text,
	"house_alignment_bonus" numeric(8, 2) DEFAULT '1.00',
	"trading_consequence_triggered" boolean DEFAULT false,
	"consequence_severity" text,
	"mystical_description" text NOT NULL,
	"time_of_day" text,
	"trading_volume" numeric(15, 2),
	"portfolio_value" numeric(15, 2),
	"action_duration_minutes" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "divine_certifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"house_id" text,
	"certification_level" text NOT NULL,
	"category" text NOT NULL,
	"requirements" jsonb NOT NULL,
	"prerequisite_certifications" text[],
	"minimum_karma" integer DEFAULT 0,
	"minimum_house_standing" text,
	"badge_design" jsonb,
	"certificate_template" text,
	"public_title" text NOT NULL,
	"title_abbreviation" text,
	"prestige_points" integer DEFAULT 100,
	"trading_bonuses" jsonb,
	"exclusive_access" jsonb,
	"teaching_privileges" boolean DEFAULT false,
	"leadership_privileges" boolean DEFAULT false,
	"display_border" text DEFAULT 'golden',
	"glow_effect" text,
	"rarity_level" text DEFAULT 'rare',
	"limited_edition" boolean DEFAULT false,
	"max_issuances" integer,
	"current_issuances" integer DEFAULT 0,
	"validity_period_months" integer,
	"renewal_required" boolean DEFAULT false,
	"retire_date" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "easter_egg_definitions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"internal_code" text NOT NULL,
	"description" text NOT NULL,
	"discovery_hint" text,
	"trigger_type" text NOT NULL,
	"trigger_conditions" jsonb NOT NULL,
	"requires_previous_eggs" text[],
	"reward_type" text NOT NULL,
	"reward_value" text NOT NULL,
	"reward_description" text NOT NULL,
	"subscribers_only" boolean DEFAULT true,
	"required_subscription_tier" text,
	"is_secret" boolean DEFAULT true,
	"difficulty_rating" integer DEFAULT 1,
	"rarity" text DEFAULT 'common',
	"category" text,
	"icon_url" text,
	"badge_color" text,
	"flavor_text" text,
	"times_unlocked" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "easter_egg_definitions_internal_code_unique" UNIQUE("internal_code")
);
--> statement-breakpoint
CREATE TABLE "easter_egg_unlocks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"egg_id" varchar NOT NULL,
	"progress_id" varchar,
	"unlocked_at" timestamp DEFAULT now(),
	"unlock_method" text,
	"unlock_context" jsonb,
	"reward_claimed" boolean DEFAULT false,
	"reward_claimed_at" timestamp,
	"reward_type" text NOT NULL,
	"reward_value" text NOT NULL,
	"reward_applied" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"display_on_profile" boolean DEFAULT true,
	"notification_sent" boolean DEFAULT false,
	"notification_seen_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "easter_egg_user_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"egg_id" varchar NOT NULL,
	"progress_value" numeric(15, 2) DEFAULT '0',
	"progress_percentage" numeric(5, 2) DEFAULT '0',
	"progress_data" jsonb,
	"is_unlocked" boolean DEFAULT false,
	"unlocked_at" timestamp,
	"last_progress_update" timestamp DEFAULT now(),
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"streak_broken_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enhanced_characters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"universe" text NOT NULL,
	"page_id" text,
	"url" text,
	"identity" text,
	"gender" text,
	"marital_status" text,
	"teams" text[],
	"weight" numeric(5, 1),
	"creators" text[],
	"strength" integer,
	"speed" integer,
	"intelligence" integer,
	"special_abilities" text[],
	"weaknesses" text[],
	"power_level" numeric(8, 2),
	"battle_win_rate" numeric(8, 2),
	"total_battles" integer DEFAULT 0,
	"battles_won" integer DEFAULT 0,
	"market_value" numeric(10, 2),
	"popularity_score" numeric(8, 2),
	"movie_appearances" integer DEFAULT 0,
	"asset_id" varchar,
	"character_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enhanced_comic_issues" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_title" text NOT NULL,
	"issue_name" text NOT NULL,
	"issue_link" text,
	"comic_series" text NOT NULL,
	"comic_type" text,
	"pencilers" text[],
	"cover_artists" text[],
	"inkers" text[],
	"writers" text[],
	"editors" text[],
	"executive_editor" text,
	"letterers" text[],
	"colourists" text[],
	"release_date" text,
	"rating" text,
	"current_market_value" numeric(10, 2),
	"historical_high" numeric(10, 2),
	"historical_low" numeric(10, 2),
	"price_volatility" numeric(8, 2),
	"first_appearances" text[],
	"significant_events" text[],
	"key_issue_rating" numeric(3, 1),
	"rarity_score" numeric(8, 2),
	"condition_sensitivity" numeric(3, 2),
	"asset_id" varchar,
	"content_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "entity_aliases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonical_entity_id" varchar NOT NULL,
	"alias_name" text NOT NULL,
	"alias_type" text NOT NULL,
	"usage_context" text,
	"universe" text,
	"timeline" text,
	"media" text,
	"popularity_score" numeric(3, 2),
	"official_status" boolean DEFAULT false,
	"currently_in_use" boolean DEFAULT true,
	"language" text DEFAULT 'en',
	"cultural_context" text,
	"pronunciation" text,
	"etymology" text,
	"source_entity" varchar,
	"alternate_universe_id" text,
	"character_variation" text,
	"source_issues" text[],
	"source_media" text[],
	"introduced_by" text[],
	"first_usage_date" text,
	"last_usage_date" text,
	"search_priority" integer DEFAULT 0,
	"exact_match_weight" numeric(3, 2) DEFAULT '1.00',
	"fuzzy_match_weight" numeric(3, 2) DEFAULT '0.80',
	"verification_level" text DEFAULT 'unverified',
	"confidence_score" numeric(3, 2) DEFAULT '1.00',
	"quality_flags" text[],
	"notes" text,
	"tags" text[],
	"alias_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "entity_interactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_entity_id" varchar NOT NULL,
	"secondary_entity_id" varchar,
	"interaction_type" text NOT NULL,
	"interaction_subtype" text,
	"relationship_type" text,
	"outcome" text,
	"outcome_confidence" numeric(3, 2),
	"primary_entity_result" text,
	"secondary_entity_result" text,
	"environment" text,
	"time_of_day" text,
	"weather_conditions" text,
	"public_visibility" text,
	"power_differential" numeric(8, 2),
	"strategic_advantage" text,
	"preparation_time" text,
	"home_field_advantage" text,
	"duration_minutes" integer,
	"intensity_level" integer,
	"collateral_damage" text,
	"casualty_count" integer,
	"moral_context" text,
	"ethical_implications" text[],
	"justification" text,
	"source_issue" text,
	"source_media" text,
	"writer_credits" text[],
	"artist_credits" text[],
	"canonicity" text DEFAULT 'main',
	"continuity_era" text,
	"event_date" text,
	"publication_date" text,
	"short_term_consequences" text[],
	"long_term_consequences" text[],
	"character_development" jsonb,
	"relationship_change" text,
	"fan_reaction" text,
	"cultural_significance" numeric(3, 2),
	"market_impact" numeric(8, 2),
	"iconic_status" boolean DEFAULT false,
	"verification_level" text DEFAULT 'unverified',
	"data_completeness" numeric(3, 2),
	"source_reliability" numeric(3, 2),
	"additional_participants" text[],
	"team_affiliations" text[],
	"tags" text[],
	"keywords" text[],
	"summary" text,
	"detailed_description" text,
	"interaction_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "exam_attempts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"course_id" varchar NOT NULL,
	"enrollment_id" varchar NOT NULL,
	"attempt_number" integer NOT NULL,
	"is_penalty_attempt" boolean DEFAULT false,
	"penalty_charged" numeric(10, 2),
	"score" numeric(5, 2) NOT NULL,
	"passed" boolean NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"responses" jsonb NOT NULL,
	"time_spent_seconds" integer,
	"feedback" text,
	"areas_for_improvement" text[],
	"attempted_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "external_integrations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"integration_name" text NOT NULL,
	"integration_display_name" text NOT NULL,
	"status" text DEFAULT 'disconnected' NOT NULL,
	"auth_type" text NOT NULL,
	"encrypted_credentials" text,
	"auth_scopes" jsonb,
	"connection_metadata" jsonb,
	"configuration" jsonb,
	"last_health_check" timestamp,
	"health_status" text DEFAULT 'unknown',
	"error_message" text,
	"retry_count" integer DEFAULT 0,
	"total_syncs" integer DEFAULT 0,
	"last_sync_at" timestamp,
	"next_scheduled_sync" timestamp,
	"house_id" text,
	"house_bonus_multiplier" numeric(3, 2) DEFAULT '1.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "external_user_mappings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"integration_id" varchar NOT NULL,
	"external_user_id" text NOT NULL,
	"external_user_name" text,
	"external_user_email" text,
	"permissions" jsonb,
	"data_mapping" jsonb,
	"sync_preferences" jsonb,
	"last_sync_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "featured_comics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issue_id" varchar,
	"series_id" varchar,
	"feature_type" text NOT NULL,
	"display_order" integer DEFAULT 0,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"featured_image_url" text,
	"call_to_action" text,
	"is_active" boolean DEFAULT true,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "global_market_hours" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"market_code" text NOT NULL,
	"market_name" text NOT NULL,
	"timezone" text NOT NULL,
	"regular_open_time" text NOT NULL,
	"regular_close_time" text NOT NULL,
	"pre_market_open_time" text,
	"after_hours_close_time" text,
	"is_active" boolean DEFAULT true,
	"current_status" text DEFAULT 'closed',
	"last_status_update" timestamp DEFAULT now(),
	"holiday_schedule" jsonb,
	"early_close_schedule" jsonb,
	"enables_cross_trading" boolean DEFAULT true,
	"cross_trading_fee" numeric(8, 4) DEFAULT '0.0010',
	"daily_volume_target" numeric(15, 2),
	"current_day_volume" numeric(15, 2) DEFAULT '0.00',
	"avg_daily_volume" numeric(15, 2),
	"influence_weight" numeric(8, 4) DEFAULT '1.0000',
	"lead_market" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "global_market_hours_market_code_unique" UNIQUE("market_code")
);
--> statement-breakpoint
CREATE TABLE "graded_asset_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"overall_grade" numeric(3, 1) NOT NULL,
	"condition_score" numeric(3, 1) NOT NULL,
	"centering_score" numeric(3, 1) NOT NULL,
	"corners_score" numeric(3, 1) NOT NULL,
	"edges_score" numeric(3, 1) NOT NULL,
	"surface_score" numeric(3, 1) NOT NULL,
	"certification_authority" text NOT NULL,
	"certification_number" text,
	"grading_date" timestamp NOT NULL,
	"grading_notes" text,
	"variant_type" text,
	"print_run" integer,
	"is_key_issue" boolean DEFAULT false,
	"is_first_appearance" boolean DEFAULT false,
	"is_signed" boolean DEFAULT false,
	"signature_authenticated" boolean DEFAULT false,
	"rarity_tier" text NOT NULL,
	"rarity_score" numeric(5, 2) NOT NULL,
	"market_demand_score" numeric(5, 2),
	"storage_type" text DEFAULT 'bag_and_board',
	"storage_condition" text DEFAULT 'excellent',
	"acquisition_date" timestamp NOT NULL,
	"acquisition_price" numeric(10, 2),
	"current_market_value" numeric(10, 2),
	"collection_series" text,
	"issue_number" text,
	"volume_number" integer,
	"personal_rating" integer,
	"collector_notes" text,
	"display_priority" integer DEFAULT 0,
	"house_affiliation" text,
	"house_progression_value" numeric(8, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "graded_asset_profiles_certification_number_unique" UNIQUE("certification_number")
);
--> statement-breakpoint
CREATE TABLE "grading_certifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"graded_asset_id" varchar NOT NULL,
	"certification_type" text NOT NULL,
	"previous_grade" numeric(3, 1),
	"new_grade" numeric(3, 1) NOT NULL,
	"certifying_authority" text NOT NULL,
	"certificate_number" text,
	"certification_fee" numeric(8, 2),
	"submission_date" timestamp,
	"completion_date" timestamp NOT NULL,
	"turnaround_days" integer,
	"certification_notes" text,
	"quality_assessment" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "holdings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"quantity" numeric(10, 4) NOT NULL,
	"average_cost" numeric(10, 2) NOT NULL,
	"current_value" numeric(10, 2),
	"unrealized_gain_loss" numeric(10, 2),
	"unrealized_gain_loss_percent" numeric(8, 2),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "house_financial_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" text NOT NULL,
	"house_name" text NOT NULL,
	"volatility_profile" text NOT NULL,
	"base_volatility_multiplier" numeric(8, 4) NOT NULL,
	"trend_strength_modifier" numeric(8, 4) DEFAULT '1.0000',
	"mean_reversion_factor" numeric(8, 4) DEFAULT '0.1000',
	"market_pattern_type" text NOT NULL,
	"seasonality_pattern" jsonb,
	"event_response_profile" jsonb,
	"preferred_instruments" text[],
	"risk_tolerance_level" text NOT NULL,
	"leverage_preference" numeric(8, 4) DEFAULT '1.0000',
	"story_beat_multipliers" jsonb,
	"character_power_level_weights" jsonb,
	"cosmic_event_sensitivity" numeric(8, 4) DEFAULT '1.0000',
	"specialty_asset_types" text[],
	"weakness_asset_types" text[],
	"trading_bonus_percentage" numeric(8, 4) DEFAULT '0.0000',
	"penalty_percentage" numeric(8, 4) DEFAULT '0.0000',
	"alignment_requirements" jsonb,
	"synergistic_houses" text[],
	"conflicting_houses" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "house_financial_profiles_house_id_unique" UNIQUE("house_id")
);
--> statement-breakpoint
CREATE TABLE "house_market_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"trigger_house_id" varchar,
	"target_house_id" varchar,
	"affected_asset_ids" text[],
	"power_shift" numeric(8, 2),
	"market_impact" jsonb,
	"event_title" text NOT NULL,
	"event_narrative" text,
	"impact_description" text,
	"sound_effect" text,
	"comic_panel_style" text,
	"event_timestamp" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "house_power_rankings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" varchar NOT NULL,
	"week" timestamp NOT NULL,
	"rank_position" integer NOT NULL,
	"power_score" numeric(10, 2) NOT NULL,
	"weekly_volume" numeric(15, 2) NOT NULL,
	"weekly_profit" numeric(15, 2) NOT NULL,
	"market_share_percent" numeric(5, 2) NOT NULL,
	"territory_gains" integer DEFAULT 0,
	"territory_losses" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "house_progression_paths" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" text NOT NULL,
	"progression_level" integer NOT NULL,
	"level_title" text NOT NULL,
	"level_description" text NOT NULL,
	"required_issues_count" integer DEFAULT 0,
	"required_variant_rarity" text,
	"required_collection_value" numeric(15, 2) DEFAULT '0.00',
	"required_storyline_completion" text[],
	"required_character_collection" text[],
	"trading_bonuses" jsonb,
	"special_abilities" text[],
	"market_access_level" text,
	"house_specific_tools" text[],
	"badge_icon" text,
	"badge_color" text,
	"level_quote" text,
	"background_image" text,
	"progression_story" text,
	"next_level_preview" text,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "imf_vault_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"total_shares_issued" numeric(15, 4) NOT NULL,
	"shares_in_vault" numeric(15, 4) DEFAULT '0.0000',
	"shares_in_circulation" numeric(15, 4) NOT NULL,
	"max_shares_allowed" numeric(15, 4) NOT NULL,
	"share_creation_cutoff_date" timestamp NOT NULL,
	"vaulting_threshold" numeric(8, 2) DEFAULT '90.00',
	"min_holding_period_days" integer DEFAULT 30,
	"vaulting_fee" numeric(8, 4) DEFAULT '0.0025',
	"scarcity_multiplier" numeric(8, 4) DEFAULT '1.0000',
	"last_scarcity_update" timestamp DEFAULT now(),
	"demand_pressure" numeric(8, 2) DEFAULT '0.00',
	"supply_constraint" numeric(8, 2) DEFAULT '0.00',
	"is_vaulting_active" boolean DEFAULT true,
	"vault_status" text DEFAULT 'active',
	"next_vaulting_evaluation" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "information_tiers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier_name" text NOT NULL,
	"tier_level" integer NOT NULL,
	"news_delay_minutes" integer DEFAULT 0,
	"market_data_delay_ms" integer DEFAULT 0,
	"analysis_quality" text NOT NULL,
	"insight_depth" text NOT NULL,
	"advanced_charting" boolean DEFAULT false,
	"real_time_alerts" boolean DEFAULT false,
	"whale_tracking_access" boolean DEFAULT false,
	"firm_intelligence" boolean DEFAULT false,
	"early_market_events" boolean DEFAULT false,
	"exclusive_research" boolean DEFAULT false,
	"monthly_price" numeric(8, 2),
	"annual_price" numeric(8, 2),
	"credits_cost" integer DEFAULT 0,
	"max_price_alerts" integer DEFAULT 5,
	"max_watchlist_assets" integer DEFAULT 20,
	"max_portfolios" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "information_tiers_tier_name_unique" UNIQUE("tier_name")
);
--> statement-breakpoint
CREATE TABLE "ingestion_errors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"run_id" varchar,
	"staging_record_id" varchar,
	"error_code" text,
	"error_type" text NOT NULL,
	"error_category" text NOT NULL,
	"error_severity" integer NOT NULL,
	"error_message" text NOT NULL,
	"detailed_description" text,
	"technical_details" jsonb,
	"error_context" jsonb,
	"record_data" jsonb,
	"record_identifier" text,
	"record_line_number" integer,
	"record_hash" text,
	"field_name" text,
	"field_value" text,
	"expected_format" text,
	"actual_format" text,
	"processing_stage" text,
	"processing_step" text,
	"validation_rule" text,
	"transformation_rule" text,
	"is_resolvable" boolean DEFAULT true,
	"resolution_strategy" text,
	"suggested_fix" text,
	"automated_fix_attempted" boolean DEFAULT false,
	"automated_fix_succeeded" boolean DEFAULT false,
	"manual_review_required" boolean DEFAULT false,
	"retryable" boolean DEFAULT true,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"next_retry_at" timestamp,
	"retry_backoff_multiplier" numeric(3, 2) DEFAULT '2.00',
	"last_retry_at" timestamp,
	"retry_history" jsonb,
	"status" text DEFAULT 'unresolved',
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"resolution_method" text,
	"resolution_notes" text,
	"resolution_changes" jsonb,
	"impact_level" text,
	"affected_entities" text[],
	"downstream_impact" text,
	"business_impact" text,
	"error_pattern" text,
	"is_known_issue" boolean DEFAULT false,
	"knowledge_base_article" text,
	"related_errors" text[],
	"notifications_sent" text[],
	"escalation_level" integer DEFAULT 0,
	"escalated_at" timestamp,
	"escalated_to" varchar,
	"alerts_triggered" text[],
	"error_frequency" numeric(8, 4),
	"first_occurrence" timestamp,
	"last_occurrence" timestamp,
	"occurrence_count" integer DEFAULT 1,
	"trend_direction" text,
	"tags" text[],
	"custom_properties" jsonb,
	"attachments" text[],
	"system_info" jsonb,
	"environment_info" jsonb,
	"configuration_info" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"acknowledged_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ingestion_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_name" text NOT NULL,
	"job_type" text NOT NULL,
	"batch_id" text,
	"dataset_type" text NOT NULL,
	"source_type" text NOT NULL,
	"processing_mode" text DEFAULT 'standard',
	"input_files" text[],
	"input_parameters" jsonb,
	"validation_rules" jsonb,
	"normalization_rules" jsonb,
	"deduplication_strategy" text DEFAULT 'strict',
	"batch_size" integer DEFAULT 1000,
	"max_retries" integer DEFAULT 3,
	"timeout_minutes" integer DEFAULT 60,
	"priority_level" integer DEFAULT 5,
	"max_concurrency" integer DEFAULT 1,
	"memory_limit_mb" integer DEFAULT 1024,
	"cpu_limit" numeric(3, 2) DEFAULT '1.00',
	"status" text DEFAULT 'queued',
	"progress" numeric(5, 2) DEFAULT '0.00',
	"current_stage" text,
	"stage_progress" numeric(5, 2) DEFAULT '0.00',
	"total_records" integer DEFAULT 0,
	"processed_records" integer DEFAULT 0,
	"successful_records" integer DEFAULT 0,
	"failed_records" integer DEFAULT 0,
	"skipped_records" integer DEFAULT 0,
	"duplicate_records" integer DEFAULT 0,
	"records_per_second" numeric(8, 2),
	"average_processing_time" numeric(8, 4),
	"peak_memory_usage_mb" integer,
	"total_cpu_time" numeric(10, 3),
	"error_count" integer DEFAULT 0,
	"warning_count" integer DEFAULT 0,
	"last_error_message" text,
	"error_categories" jsonb,
	"error_sample_size" integer DEFAULT 10,
	"data_quality_score" numeric(3, 2),
	"deduplication_efficiency" numeric(3, 2),
	"normalization_accuracy" numeric(3, 2),
	"validation_pass_rate" numeric(3, 2),
	"created_by" varchar,
	"assigned_worker" text,
	"environment_info" jsonb,
	"depends_on_jobs" text[],
	"prerequisite_conditions" jsonb,
	"output_format" text DEFAULT 'database',
	"output_location" text,
	"retention_policy" text DEFAULT 'standard',
	"notification_settings" jsonb,
	"notifications_sent" text[],
	"description" text,
	"tags" text[],
	"metadata" jsonb,
	"configuration_snapshot" jsonb,
	"queued_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp,
	"last_heartbeat" timestamp,
	"estimated_completion_time" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ingestion_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"run_number" integer NOT NULL,
	"run_type" text DEFAULT 'standard',
	"triggered_by" text DEFAULT 'system',
	"trigger_user_id" varchar,
	"parent_run_id" varchar,
	"worker_id" text,
	"worker_host" text,
	"worker_version" text,
	"process_id" integer,
	"thread_id" text,
	"allocated_memory_mb" integer,
	"peak_memory_usage_mb" integer,
	"average_memory_usage_mb" integer,
	"allocated_cpu_cores" numeric(3, 2),
	"total_cpu_time" numeric(10, 3),
	"wall_clock_time" numeric(10, 3),
	"disk_space_used_mb" integer,
	"network_bytes_transferred" bigint,
	"records_in_scope" integer,
	"starting_offset" integer DEFAULT 0,
	"ending_offset" integer,
	"batch_size" integer,
	"batches_processed" integer DEFAULT 0,
	"records_processed" integer DEFAULT 0,
	"records_successful" integer DEFAULT 0,
	"records_failed" integer DEFAULT 0,
	"records_skipped" integer DEFAULT 0,
	"records_duplicate" integer DEFAULT 0,
	"entities_created" integer DEFAULT 0,
	"entities_updated" integer DEFAULT 0,
	"entities_merged" integer DEFAULT 0,
	"aliases_created" integer DEFAULT 0,
	"traits_created" integer DEFAULT 0,
	"interactions_created" integer DEFAULT 0,
	"records_per_second" numeric(8, 2),
	"average_record_processing_time" numeric(8, 4),
	"min_record_processing_time" numeric(8, 4),
	"max_record_processing_time" numeric(8, 4),
	"throughput_mb_per_second" numeric(8, 2),
	"error_count" integer DEFAULT 0,
	"warning_count" integer DEFAULT 0,
	"critical_error_count" integer DEFAULT 0,
	"error_rate" numeric(8, 4),
	"primary_error_type" text,
	"primary_error_message" text,
	"status" text DEFAULT 'running',
	"exit_code" integer,
	"exit_reason" text,
	"was_interrupted" boolean DEFAULT false,
	"was_retried" boolean DEFAULT false,
	"retry_count" integer DEFAULT 0,
	"data_quality_score" numeric(3, 2),
	"success_rate" numeric(8, 4),
	"deduplication_accuracy" numeric(3, 2),
	"normalization_accuracy" numeric(3, 2),
	"configuration_used" jsonb,
	"parameters_used" jsonb,
	"environment_variables" jsonb,
	"last_checkpoint" jsonb,
	"checkpoint_interval_records" integer DEFAULT 1000,
	"checkpoints_created" integer DEFAULT 0,
	"recovered_from_checkpoint" boolean DEFAULT false,
	"recovery_checkpoint_id" text,
	"output_summary" jsonb,
	"log_file_location" text,
	"artifact_locations" text[],
	"notifications_sent" text[],
	"reports_generated" text[],
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"last_heartbeat" timestamp,
	"last_checkpoint_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"analytics_date" timestamp NOT NULL,
	"timeframe" text NOT NULL,
	"api_calls" integer DEFAULT 0,
	"successful_calls" integer DEFAULT 0,
	"failed_calls" integer DEFAULT 0,
	"data_transferred" integer DEFAULT 0,
	"average_response_time" numeric(8, 3),
	"min_response_time" numeric(8, 3),
	"max_response_time" numeric(8, 3),
	"error_categories" jsonb,
	"rate_limit_hits" integer DEFAULT 0,
	"timeout_count" integer DEFAULT 0,
	"automations_triggered" integer DEFAULT 0,
	"workflows_completed" integer DEFAULT 0,
	"data_points_synced" integer DEFAULT 0,
	"estimated_cost" numeric(10, 4),
	"credits_used" integer DEFAULT 0,
	"house_id" text,
	"house_bonus_applied" numeric(3, 2),
	"karma_generated" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_sync_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" varchar NOT NULL,
	"sync_type" text NOT NULL,
	"direction" text NOT NULL,
	"status" text NOT NULL,
	"data_type" text,
	"records_processed" integer DEFAULT 0,
	"records_successful" integer DEFAULT 0,
	"records_failed" integer DEFAULT 0,
	"duration_ms" integer,
	"started_at" timestamp,
	"completed_at" timestamp,
	"error_message" text,
	"error_details" jsonb,
	"sync_metadata" jsonb,
	"transformation_rules" jsonb,
	"validation_errors" jsonb,
	"conflict_resolution" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_webhooks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" varchar NOT NULL,
	"webhook_type" text NOT NULL,
	"event_type" text NOT NULL,
	"webhook_url" text,
	"secret_key" text,
	"is_active" boolean DEFAULT true,
	"http_method" text DEFAULT 'POST',
	"headers" jsonb,
	"payload" jsonb,
	"retry_policy" jsonb,
	"total_triggers" integer DEFAULT 0,
	"successful_triggers" integer DEFAULT 0,
	"failed_triggers" integer DEFAULT 0,
	"last_triggered_at" timestamp,
	"last_success_at" timestamp,
	"last_failure_at" timestamp,
	"last_error_message" text,
	"average_response_time" numeric(8, 3),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investment_clubs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"owner_id" varchar NOT NULL,
	"description" text,
	"min_members" integer DEFAULT 3,
	"min_months_positive_returns" integer DEFAULT 3,
	"status" text DEFAULT 'active' NOT NULL,
	"total_value" numeric(15, 2),
	"monthly_returns" numeric(8, 2)[],
	"created_at" timestamp DEFAULT now(),
	"dissolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"entry_type" text NOT NULL,
	"content" text NOT NULL,
	"title" text,
	"corruption_at_time" numeric(5, 2),
	"related_trade_id" varchar,
	"related_victim_id" varchar,
	"mood" text,
	"intensity" integer DEFAULT 1,
	"word_count" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "karma_actions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" text NOT NULL,
	"house_id" text,
	"karma_change" integer NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "karmic_actions_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"action_type" text NOT NULL,
	"action_category" text NOT NULL,
	"karma_impact" numeric(8, 2) NOT NULL,
	"description" text NOT NULL,
	"related_asset_id" varchar,
	"related_order_id" varchar,
	"target_user_id" varchar,
	"metadata" jsonb,
	"alignment_direction" text,
	"strength_impact" numeric(3, 2) DEFAULT '0.00',
	"is_visible_to_user" boolean DEFAULT false,
	"revealed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "karmic_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"current_alignment_threshold" varchar,
	"alignment_stability" numeric(8, 2) DEFAULT '100.00',
	"alignment_trend" text DEFAULT 'stable',
	"dominant_behavior_pattern" text,
	"secondary_behavior_pattern" text,
	"behavior_consistency" numeric(8, 2) DEFAULT '50.00',
	"trading_personality" text,
	"risk_profile" text,
	"social_trading" text,
	"karma_acceleration_rate" numeric(8, 2) DEFAULT '1.00',
	"total_karma_earned" integer DEFAULT 0,
	"total_karma_lost" integer DEFAULT 0,
	"largest_karma_gain" integer DEFAULT 0,
	"largest_karma_loss" integer DEFAULT 0,
	"house_alignment_compatibility" numeric(8, 2) DEFAULT '50.00',
	"optimal_house_id" text,
	"alignment_conflict_level" text DEFAULT 'none',
	"predicted_alignment_direction" text,
	"next_threshold_distance" numeric(8, 2),
	"estimated_time_to_next_threshold" integer,
	"cosmic_resonance" numeric(8, 2) DEFAULT '0.00',
	"divine_favor" numeric(8, 2) DEFAULT '0.00',
	"shadow_influence" numeric(8, 2) DEFAULT '0.00',
	"alignment_shifts_count" integer DEFAULT 0,
	"last_major_shift" timestamp,
	"profile_last_calculated" timestamp DEFAULT now(),
	"next_recalculation_due" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "knowledge_test_responses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"result_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"scenario_id" text NOT NULL,
	"choice_id" text NOT NULL,
	"knowledge_score" numeric(6, 2) NOT NULL,
	"profit_score" numeric(6, 2) NOT NULL,
	"response_time" integer,
	"is_correct" boolean NOT NULL,
	"knowledge_areas" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "knowledge_test_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"profit_score" numeric(6, 2) NOT NULL,
	"performance_rating" text NOT NULL,
	"displayed_feedback" text NOT NULL,
	"knowledge_score" numeric(6, 2) NOT NULL,
	"tier" text NOT NULL,
	"weak_areas" text[],
	"strengths" text[],
	"trading_floor_access" boolean DEFAULT false,
	"access_level" text DEFAULT 'restricted',
	"restriction_reason" text,
	"completed_at" timestamp DEFAULT now(),
	"time_spent" integer,
	"questions_answered" integer NOT NULL,
	"retake_allowed_at" timestamp,
	"attempt_number" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leaderboard_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category_type" text NOT NULL,
	"timeframe" text NOT NULL,
	"sort_order" text DEFAULT 'desc',
	"points_formula" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"min_trades_required" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learn_modules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"progression_level" text NOT NULL,
	"house_specialization" varchar,
	"module_content" jsonb NOT NULL,
	"estimated_duration" integer,
	"difficulty_level" integer,
	"prerequisites" text[],
	"movie_stills" text[],
	"interactive_elements" jsonb,
	"learning_objectives" text[],
	"completion_karma_bonus" numeric(8, 2) DEFAULT '0.00',
	"trading_skill_bonus" numeric(3, 2) DEFAULT '0.00',
	"house_reputation_bonus" numeric(8, 2) DEFAULT '0.00',
	"unlocks_trading_privileges" text[],
	"is_published" boolean DEFAULT false,
	"required_for_progression" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_experience_earned" integer DEFAULT 0,
	"total_lessons_completed" integer DEFAULT 0,
	"total_skills_unlocked" integer DEFAULT 0,
	"total_trials_passed" integer DEFAULT 0,
	"total_certifications_earned" integer DEFAULT 0,
	"lessons_per_week" numeric(8, 2) DEFAULT '0.00',
	"avg_score_achieved" numeric(8, 2) DEFAULT '0.00',
	"learning_streak_days" integer DEFAULT 0,
	"longest_learning_streak_days" integer DEFAULT 0,
	"preferred_learning_time" text,
	"avg_session_duration_minutes" integer DEFAULT 0,
	"primary_house_mastery" numeric(8, 2) DEFAULT '0.00',
	"secondary_houses_explored" text[],
	"cross_house_progress" jsonb,
	"house_rank" integer DEFAULT 0,
	"preferred_lesson_types" text[],
	"learning_style_profile" jsonb,
	"difficulty_preference" text DEFAULT 'adaptive',
	"pace_preference" text DEFAULT 'self_paced',
	"mentorship_given_hours" integer DEFAULT 0,
	"mentorship_received_hours" integer DEFAULT 0,
	"peer_reviews_given" integer DEFAULT 0,
	"peer_reviews_received" integer DEFAULT 0,
	"community_contributions" integer DEFAULT 0,
	"teaching_rating" numeric(3, 2),
	"knowledge_gaps" jsonb,
	"strength_areas" jsonb,
	"recommended_paths" jsonb,
	"personalized_difficulty" numeric(3, 2) DEFAULT '3.00',
	"motivation_level" numeric(3, 2) DEFAULT '3.00',
	"engagement_trend" text DEFAULT 'stable',
	"last_active_date" timestamp,
	"total_time_spent_minutes" integer DEFAULT 0,
	"achievement_celebrations" integer DEFAULT 0,
	"predicted_completion_date" timestamp,
	"risk_of_dropout" numeric(3, 2) DEFAULT '0.00',
	"recommended_interventions" jsonb,
	"calculated_at" timestamp DEFAULT now(),
	"next_calculation_due" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_paths" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"house_id" text NOT NULL,
	"specialization" text NOT NULL,
	"difficulty_level" text NOT NULL,
	"prerequisites" jsonb,
	"estimated_hours" integer DEFAULT 0,
	"experience_reward" integer DEFAULT 0,
	"karma_reward" integer DEFAULT 0,
	"sacred_title" text NOT NULL,
	"mystical_description" text NOT NULL,
	"path_icon" text DEFAULT 'BookOpen',
	"path_color" text DEFAULT 'blue-600',
	"lesson_sequence" text[],
	"unlock_conditions" jsonb,
	"completion_rewards" jsonb,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"path_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "margin_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"margin_equity" numeric(15, 2) DEFAULT '0.00',
	"margin_cash" numeric(15, 2) DEFAULT '0.00',
	"margin_debt" numeric(15, 2) DEFAULT '0.00',
	"buying_power" numeric(15, 2) DEFAULT '0.00',
	"day_trading_buying_power" numeric(15, 2) DEFAULT '0.00',
	"maintenance_margin" numeric(15, 2) DEFAULT '0.00',
	"initial_margin_req" numeric(8, 2) DEFAULT '50.00',
	"maintenance_margin_req" numeric(8, 2) DEFAULT '25.00',
	"max_leverage" numeric(8, 2) DEFAULT '2.00',
	"current_leverage" numeric(8, 2) DEFAULT '1.00',
	"leverage_utilization" numeric(8, 2) DEFAULT '0.00',
	"margin_call_threshold" numeric(8, 2) DEFAULT '30.00',
	"liquidation_threshold" numeric(8, 2) DEFAULT '20.00',
	"last_margin_call" timestamp,
	"margin_calls_count" integer DEFAULT 0,
	"day_trades_used" integer DEFAULT 0,
	"day_trades_max" integer DEFAULT 3,
	"account_status" text DEFAULT 'good_standing',
	"margin_trading_enabled" boolean DEFAULT false,
	"short_selling_enabled" boolean DEFAULT false,
	"options_trading_level" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_anomalies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar,
	"anomaly_type" text NOT NULL,
	"severity" text NOT NULL,
	"description" text,
	"detection_data" jsonb,
	"historical_comparison" jsonb,
	"potential_causes" jsonb,
	"market_impact" numeric(8, 4),
	"ai_confidence" numeric(5, 4),
	"user_notifications" integer DEFAULT 0,
	"follow_up_actions" jsonb,
	"resolved" boolean DEFAULT false,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_comparables" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"graded_asset_id" varchar NOT NULL,
	"sale_price" numeric(10, 2) NOT NULL,
	"sale_date" timestamp NOT NULL,
	"marketplace" text,
	"comparable_grade" numeric(3, 1) NOT NULL,
	"grading_authority" text NOT NULL,
	"sale_conditions" text,
	"relevance_score" numeric(3, 2),
	"age_relevance" numeric(3, 2),
	"sale_reference" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_data" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"timeframe" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"open" numeric(10, 2) NOT NULL,
	"high" numeric(10, 2) NOT NULL,
	"low" numeric(10, 2) NOT NULL,
	"close" numeric(10, 2) NOT NULL,
	"volume" integer NOT NULL,
	"change" numeric(10, 2),
	"percent_change" numeric(8, 2),
	"market_cap" numeric(15, 2),
	"technical_indicators" jsonb,
	"price_pattern_embedding" vector(1536),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"impact" text,
	"significance" numeric(2, 1),
	"affected_assets" text[],
	"event_date" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_index_data" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index_id" varchar NOT NULL,
	"timeframe" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"open" numeric(10, 2) NOT NULL,
	"high" numeric(10, 2) NOT NULL,
	"low" numeric(10, 2) NOT NULL,
	"close" numeric(10, 2) NOT NULL,
	"volume" integer,
	"change" numeric(10, 2),
	"percent_change" numeric(8, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_indices" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"index_type" text NOT NULL,
	"methodology" text,
	"constituents" jsonb,
	"rebalance_frequency" text DEFAULT 'monthly',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "market_indices_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "market_insights" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"sentiment_score" numeric(3, 2),
	"confidence" numeric(3, 2),
	"tags" text[],
	"source" text,
	"video_url" text,
	"thumbnail_url" text,
	"category" text,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"content_embedding" vector(1536),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_intelligence_cache" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_key" text NOT NULL,
	"data_type" text NOT NULL,
	"scope" text NOT NULL,
	"target_id" varchar,
	"analysis_data" jsonb,
	"insights" jsonb,
	"confidence" numeric(5, 4),
	"processing_time" integer,
	"data_freshness" timestamp,
	"access_count" integer DEFAULT 0,
	"last_accessed" timestamp,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "market_intelligence_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "media_performance_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_title" text NOT NULL,
	"media_type" text NOT NULL,
	"release_format" text,
	"franchise" text NOT NULL,
	"universe" text NOT NULL,
	"continuity" text,
	"featured_entities" text[],
	"main_characters" text[],
	"supporting_characters" text[],
	"villains" text[],
	"teams" text[],
	"release_date" text,
	"release_year" integer,
	"release_quarter" integer,
	"release_month" integer,
	"release_territories" text[],
	"production_budget" numeric(15, 2),
	"marketing_budget" numeric(15, 2),
	"total_budget" numeric(15, 2),
	"opening_weekend_gross" numeric(15, 2),
	"domestic_gross" numeric(15, 2),
	"international_gross" numeric(15, 2),
	"worldwide_gross" numeric(15, 2),
	"inflation_adjusted_budget" numeric(15, 2),
	"inflation_adjusted_gross" numeric(15, 2),
	"profit_margin" numeric(8, 2),
	"return_on_investment" numeric(8, 2),
	"gross_to_budget_ratio" numeric(8, 2),
	"domestic_percentage" numeric(8, 2),
	"international_percentage" numeric(8, 2),
	"metacritic_score" integer,
	"rotten_tomatoes_score" integer,
	"rotten_tomatoes_audience_score" integer,
	"imdb_rating" numeric(3, 1),
	"imdb_votes" integer,
	"major_awards_won" text[],
	"major_awards_nominated" text[],
	"genre_awards" text[],
	"festival_awards" text[],
	"opening_theater_count" integer,
	"max_theater_count" integer,
	"weeks_in_theaters" integer,
	"attendance_estimate" integer,
	"streaming_viewership" numeric(15, 0),
	"digital_sales" numeric(15, 2),
	"physical_media_sales" numeric(15, 2),
	"merchandising_revenue" numeric(15, 2),
	"social_media_mentions" integer,
	"social_media_sentiment" numeric(3, 2),
	"cultural_reach" numeric(8, 2),
	"meme_culture" boolean DEFAULT false,
	"fan_community_size" integer,
	"primary_demographic" text,
	"gender_appeal" text,
	"age_rating" text,
	"asset_price_impact" jsonb,
	"market_event_trigger" boolean DEFAULT false,
	"trading_volume_increase" numeric(8, 2),
	"director" text[],
	"producers" text[],
	"writers" text[],
	"studio" text,
	"distributor" text,
	"production_companies" text[],
	"runtime_minutes" integer,
	"format" text,
	"technology_used" text[],
	"filming_locations" text[],
	"is_sequel" boolean DEFAULT false,
	"is_reboot" boolean DEFAULT false,
	"is_spinoff" boolean DEFAULT false,
	"franchise_position" integer,
	"predecessor_id" varchar,
	"successor_id" varchar,
	"data_completeness" numeric(3, 2),
	"source_reliability" numeric(3, 2),
	"data_sources" text[],
	"last_data_update" timestamp,
	"imdb_id" text,
	"tmdb_id" text,
	"rotten_tomatoes_id" text,
	"metacritic_id" text,
	"external_urls" text[],
	"content_embedding" vector(1536),
	"performance_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "moral_standings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"corruption_level" numeric(5, 2) DEFAULT '0.00',
	"total_victims" integer DEFAULT 0,
	"blood_money" numeric(15, 2) DEFAULT '0.00',
	"total_harm" numeric(15, 2) DEFAULT '0.00',
	"last_confession" timestamp,
	"confession_count" integer DEFAULT 0,
	"soul_weight" text DEFAULT 'unburdened',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "movie_performance_data" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"film_title" text NOT NULL,
	"release_date" text,
	"franchise" text NOT NULL,
	"character_family" text NOT NULL,
	"distributor" text,
	"mpaa_rating" text,
	"domestic_gross" numeric(15, 2),
	"international_gross" numeric(15, 2),
	"worldwide_gross" numeric(15, 2),
	"budget" numeric(15, 2),
	"gross_to_budget_ratio" numeric(8, 2),
	"domestic_percentage" numeric(8, 2),
	"rotten_tomatoes_score" integer,
	"is_mcu_film" boolean DEFAULT false,
	"mcu_phase" text,
	"inflation_adjusted_gross" numeric(15, 2),
	"inflation_adjusted_budget" numeric(15, 2),
	"market_impact_score" numeric(8, 2),
	"success_category" text,
	"featured_characters" text[],
	"related_assets" text[],
	"runtime_minutes" integer,
	"release_year" integer,
	"opening_weekend_gross" numeric(15, 2),
	"total_weeks_in_theaters" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mystical_skills" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"house_id" text,
	"skill_category" text NOT NULL,
	"skill_type" text NOT NULL,
	"tier" text NOT NULL,
	"trading_privileges" jsonb,
	"trading_bonuses" jsonb,
	"interface_features" jsonb,
	"special_abilities" jsonb,
	"prerequisite_skills" text[],
	"prerequisite_lessons" text[],
	"karma_requirement" integer DEFAULT 0,
	"trading_performance_requirement" jsonb,
	"house_standing_requirement" text,
	"experience_cost" integer DEFAULT 500,
	"mastery_levels" integer DEFAULT 1,
	"max_mastery_bonus" numeric(8, 2) DEFAULT '1.50',
	"sacred_name" text NOT NULL,
	"mystical_description" text NOT NULL,
	"awaken_ritual" text,
	"skill_icon" text DEFAULT 'Zap',
	"skill_aura" text,
	"rarity_level" text DEFAULT 'common',
	"parent_skills" text[],
	"child_skills" text[],
	"skill_tree_position" jsonb,
	"times_unlocked" integer DEFAULT 0,
	"avg_time_to_unlock_days" integer,
	"user_satisfaction_rating" numeric(3, 2),
	"impact_on_trading" numeric(8, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mythological_houses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"mythology" text NOT NULL,
	"firm_name" text NOT NULL,
	"description" text NOT NULL,
	"philosophy" text NOT NULL,
	"primary_specialization" text NOT NULL,
	"weakness_specialization" text NOT NULL,
	"trading_bonus_percent" numeric(8, 2) DEFAULT '0.00',
	"karma_multiplier" numeric(3, 2) DEFAULT '1.00',
	"primary_color" text,
	"icon_name" text,
	"background_image_url" text,
	"origin_story" text,
	"notable_members" text[],
	"traditions" text[],
	"total_members" integer DEFAULT 0,
	"average_performance" numeric(8, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "narrative_entities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonical_name" text NOT NULL,
	"entity_type" text NOT NULL,
	"subtype" text,
	"universe" text NOT NULL,
	"real_name" text,
	"secret_identity" boolean DEFAULT false,
	"public_identity" boolean DEFAULT false,
	"is_deceased" boolean DEFAULT false,
	"gender" text,
	"species" text DEFAULT 'human',
	"height" numeric(5, 2),
	"weight" numeric(5, 1),
	"eye_color" text,
	"hair_color" text,
	"first_appearance" text,
	"first_appearance_date" text,
	"creators" text[],
	"current_creators" text[],
	"teams" text[],
	"allies" text[],
	"enemies" text[],
	"family_members" text[],
	"origin_location" text,
	"current_location" text,
	"timeline_era" text,
	"publication_status" text DEFAULT 'active',
	"last_appearance" text,
	"last_appearance_date" text,
	"asset_id" varchar,
	"market_value" numeric(10, 2),
	"popularity_score" numeric(8, 2),
	"cultural_impact" numeric(8, 2),
	"biography" text,
	"description" text,
	"key_storylines" text[],
	"notable_quotes" text[],
	"primary_image_url" text,
	"alternate_image_urls" text[],
	"iconographic_elements" text[],
	"canonicality_score" numeric(3, 2) DEFAULT '1.00',
	"data_completeness" numeric(3, 2),
	"verification_status" text DEFAULT 'unverified',
	"verified_by" varchar,
	"external_ids" jsonb,
	"source_urls" text[],
	"wikipedia_url" text,
	"official_website" text,
	"entity_embedding" vector(1536),
	"biography_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "narrative_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_type" text NOT NULL,
	"affected_houses" text[],
	"affected_assets" text[],
	"impact_percentage" numeric(8, 2) NOT NULL,
	"duration" integer NOT NULL,
	"severity" text DEFAULT 'low' NOT NULL,
	"sound_effect" text,
	"visual_style" text,
	"narrative" text,
	"is_active" boolean DEFAULT false,
	"start_time" timestamp,
	"end_time" timestamp,
	"trigger_condition" text,
	"market_context" jsonb,
	"parent_event_id" varchar,
	"chain_reaction_probability" numeric(5, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "narrative_market_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger_event_id" varchar,
	"event_title" text NOT NULL,
	"event_description" text NOT NULL,
	"narrative_context" text,
	"affected_assets" text[],
	"price_impacts" jsonb,
	"volume_changes" jsonb,
	"volatility_adjustments" jsonb,
	"house_impacts" jsonb,
	"cross_house_interactions" jsonb,
	"event_start_time" timestamp NOT NULL,
	"event_end_time" timestamp,
	"peak_impact_time" timestamp,
	"current_phase" text DEFAULT 'immediate',
	"market_response" jsonb,
	"prediction_accuracy" numeric(8, 4),
	"unexpected_effects" jsonb,
	"narrative_relevance_score" numeric(8, 4) DEFAULT '1.0000',
	"cultural_impact_measure" numeric(8, 4) DEFAULT '0.0000',
	"fan_engagement_correlation" numeric(8, 4) DEFAULT '0.0000',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "narrative_timelines" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timeline_name" text NOT NULL,
	"timeline_type" text NOT NULL,
	"scope" text NOT NULL,
	"universe" text NOT NULL,
	"continuity" text,
	"start_date" text,
	"end_date" text,
	"timeline_status" text DEFAULT 'active',
	"timeline_era" text,
	"chronological_order" integer,
	"primary_entities" text[],
	"secondary_entities" text[],
	"featured_teams" text[],
	"major_villains" text[],
	"key_creators" text[],
	"associated_houses" text[],
	"primary_house" text,
	"house_relevance_score" numeric(3, 2),
	"trading_education_value" numeric(3, 2),
	"market_influence" numeric(3, 2),
	"volatility_potential" numeric(3, 2),
	"speculative_value" numeric(3, 2),
	"long_term_impact" numeric(3, 2),
	"total_story_beats" integer DEFAULT 0,
	"completed_story_beats" integer DEFAULT 0,
	"critical_story_beats" integer DEFAULT 0,
	"plot_complexity" numeric(3, 2),
	"character_development_depth" numeric(3, 2),
	"primary_themes" text[],
	"moral_alignment" text,
	"emotional_tone" text,
	"narrative_genre" text[],
	"cultural_significance" numeric(3, 2),
	"social_commentary" text[],
	"historical_context" text,
	"first_publication_date" text,
	"last_publication_date" text,
	"publication_status" text DEFAULT 'ongoing',
	"published_issue_count" integer DEFAULT 0,
	"planned_issue_count" integer,
	"adapted_to_media" text[],
	"adaptation_quality" numeric(3, 2),
	"adaptation_fidelity" numeric(3, 2),
	"cross_media_impact" numeric(3, 2),
	"fan_engagement_level" numeric(3, 2),
	"controversy_level" numeric(3, 2),
	"critical_reception" numeric(3, 2),
	"commercial_success" numeric(3, 2),
	"character_study_value" numeric(3, 2),
	"plot_analysis_value" numeric(3, 2),
	"thematic_depth" numeric(3, 2),
	"market_lesson_value" numeric(3, 2),
	"parent_timelines" text[],
	"child_timelines" text[],
	"crossover_timelines" text[],
	"related_assets" text[],
	"synopsis" text,
	"detailed_description" text,
	"key_plot_points" text[],
	"character_arcs" jsonb,
	"thematic_analysis" text,
	"key_image_urls" text[],
	"iconic_panels" text[],
	"cover_gallery" text[],
	"video_content" text[],
	"curation_status" text DEFAULT 'draft',
	"curated_by" varchar,
	"quality_score" numeric(3, 2),
	"completeness_score" numeric(3, 2),
	"accuracy_score" numeric(3, 2),
	"timeline_embedding" vector(1536),
	"theme_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"curated_at" timestamp,
	"last_reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "narrative_trading_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" varchar NOT NULL,
	"mythic_volatility_score" numeric(8, 4) NOT NULL,
	"base_volatility" numeric(8, 4) DEFAULT '0.0250',
	"story_arc_volatility_multiplier" numeric(8, 4) DEFAULT '1.0000',
	"power_level_volatility_factor" numeric(8, 4) DEFAULT '1.0000',
	"cosmic_event_volatility_boost" numeric(8, 4) DEFAULT '0.0000',
	"narrative_momentum_score" numeric(8, 4) NOT NULL,
	"cultural_impact_index" numeric(8, 4) DEFAULT '1.0000',
	"story_progression_rate" numeric(8, 4) DEFAULT '0.0000',
	"theme_relevance_score" numeric(8, 4) DEFAULT '1.0000',
	"media_boost_factor" numeric(8, 4) DEFAULT '1.0000',
	"momentum_decay_rate" numeric(8, 4) DEFAULT '0.0500',
	"house_affiliation" text,
	"house_volatility_profile" text,
	"house_trading_multiplier" numeric(8, 4) DEFAULT '1.0000',
	"house_specialty_bonus" numeric(8, 4) DEFAULT '0.0000',
	"narrative_correlation_strength" numeric(8, 4) DEFAULT '1.0000',
	"story_beat_sensitivity" numeric(8, 4) DEFAULT '1.0000',
	"character_death_impact" numeric(8, 4) DEFAULT '0.0000',
	"power_upgrade_impact" numeric(8, 4) DEFAULT '0.0000',
	"resurrection_impact" numeric(8, 4) DEFAULT '0.0000',
	"narrative_margin_requirement" numeric(8, 2) DEFAULT '50.00',
	"story_risk_adjustment" numeric(8, 4) DEFAULT '0.0000',
	"volatility_risk_premium" numeric(8, 4) DEFAULT '0.0000',
	"last_narrative_event" timestamp,
	"next_predicted_event" timestamp,
	"story_arc_phase" text,
	"seasonal_narrative_pattern" text,
	"metrics_reliability_score" numeric(8, 4) DEFAULT '0.5000',
	"prediction_accuracy" numeric(8, 4) DEFAULT '0.0000',
	"last_recalculation" timestamp DEFAULT now(),
	"calculation_version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "narrative_traits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" varchar NOT NULL,
	"trait_category" text NOT NULL,
	"trait_type" text NOT NULL,
	"trait_name" text NOT NULL,
	"potency_level" integer,
	"mastery_level" integer,
	"reliability_level" integer,
	"versatility_score" numeric(3, 2),
	"description" text NOT NULL,
	"limitations" text[],
	"triggers" text[],
	"duration" text,
	"range" text,
	"energy_cost" text,
	"environmental_factors" text[],
	"combat_effectiveness" numeric(3, 2),
	"utility_value" numeric(3, 2),
	"rarity_score" numeric(3, 2),
	"acquisition_method" text,
	"development_stage" text DEFAULT 'stable',
	"evolution_potential" numeric(3, 2),
	"canonicity" text DEFAULT 'main',
	"continuity_era" text,
	"retcon_status" text DEFAULT 'current',
	"source_issues" text[],
	"source_media" text[],
	"verification_level" text DEFAULT 'unverified',
	"market_relevance" numeric(3, 2),
	"fan_appeal" numeric(3, 2),
	"tags" text[],
	"aliases" text[],
	"related_traits" text[],
	"trait_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"headline" text NOT NULL,
	"summary" text NOT NULL,
	"full_content" text,
	"source_organization" text NOT NULL,
	"author_name" text,
	"news_category" text NOT NULL,
	"impact_level" text NOT NULL,
	"affected_assets" text[],
	"created_at" timestamp DEFAULT now(),
	"publish_time" timestamp NOT NULL,
	"elite_release_time" timestamp NOT NULL,
	"pro_release_time" timestamp NOT NULL,
	"free_release_time" timestamp NOT NULL,
	"price_impact_direction" text,
	"price_impact_magnitude" numeric(8, 2),
	"volatility_impact" numeric(8, 2),
	"is_verified" boolean DEFAULT true,
	"verified_by" text DEFAULT 'panel_profits_oracle',
	"confidence_score" numeric(8, 2) DEFAULT '100.00',
	"is_active" boolean DEFAULT true,
	"tags" text[],
	"related_articles" text[],
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"order_notifications" boolean DEFAULT true,
	"price_alerts" boolean DEFAULT true,
	"market_updates" boolean DEFAULT true,
	"portfolio_alerts" boolean DEFAULT true,
	"email_notifications" boolean DEFAULT false,
	"push_notifications" boolean DEFAULT true,
	"toast_notifications" boolean DEFAULT true,
	"low_priority_enabled" boolean DEFAULT true,
	"medium_priority_enabled" boolean DEFAULT true,
	"high_priority_enabled" boolean DEFAULT true,
	"critical_priority_enabled" boolean DEFAULT true,
	"quiet_hours_enabled" boolean DEFAULT false,
	"quiet_hours_start" text,
	"quiet_hours_end" text,
	"quiet_hours_timezone" text DEFAULT 'UTC',
	"group_similar_notifications" boolean DEFAULT true,
	"max_daily_notifications" integer DEFAULT 50,
	"sound_enabled" boolean DEFAULT true,
	"vibration_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"title_template" text NOT NULL,
	"message_template" text NOT NULL,
	"action_url_template" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"read" boolean DEFAULT false,
	"action_url" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "npc_trader_activity_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trader_id" varchar NOT NULL,
	"action" text NOT NULL,
	"asset_id" varchar,
	"quantity" integer,
	"price" numeric(10, 2),
	"reasoning" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "npc_trader_positions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trader_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"quantity" integer NOT NULL,
	"entry_price" numeric(10, 2) NOT NULL,
	"entry_date" timestamp NOT NULL,
	"unrealized_pnl" numeric(10, 2) DEFAULT '0.00',
	"target_exit_price" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "npc_trader_psychology" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trader_id" varchar NOT NULL,
	"panic_threshold" numeric(5, 2) NOT NULL,
	"greed_threshold" numeric(5, 2) NOT NULL,
	"fomo_susceptibility" integer NOT NULL,
	"confidence_bias" integer NOT NULL,
	"loss_cut_speed" text NOT NULL,
	"news_reaction" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "npc_trader_strategies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trader_id" varchar NOT NULL,
	"preferred_assets" text[],
	"holding_period_days" integer NOT NULL,
	"position_sizing_strategy" text NOT NULL,
	"max_position_size" numeric(5, 2) NOT NULL,
	"stop_loss_percent" numeric(5, 2),
	"take_profit_percent" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "npc_traders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"personality_archetype" text NOT NULL,
	"risk_tolerance" numeric(5, 2) NOT NULL,
	"skill_level" integer NOT NULL,
	"starting_capital" numeric(15, 2) NOT NULL,
	"current_capital" numeric(15, 2) NOT NULL,
	"total_trades" integer DEFAULT 0,
	"win_rate" numeric(5, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "npc_traders_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "options_chain" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"underlying_asset_id" varchar NOT NULL,
	"option_symbol" text NOT NULL,
	"contract_type" text NOT NULL,
	"strike_price" numeric(10, 2) NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"exercise_style" text DEFAULT 'american',
	"contract_size" integer DEFAULT 100,
	"bid_price" numeric(10, 4),
	"ask_price" numeric(10, 4),
	"last_price" numeric(10, 4),
	"mark_price" numeric(10, 4),
	"delta" numeric(8, 6),
	"gamma" numeric(8, 6),
	"theta" numeric(8, 6),
	"vega" numeric(8, 6),
	"rho" numeric(8, 6),
	"implied_volatility" numeric(8, 4),
	"historical_volatility" numeric(8, 4),
	"volume" integer DEFAULT 0,
	"open_interest" integer DEFAULT 0,
	"last_trade_time" timestamp,
	"intrinsic_value" numeric(10, 4),
	"time_value" numeric(10, 4),
	"break_even_price" numeric(10, 2),
	"max_risk" numeric(10, 2),
	"max_reward" numeric(10, 2),
	"is_active" boolean DEFAULT true,
	"last_greeks_update" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "options_chain_option_symbol_unique" UNIQUE("option_symbol")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"type" text NOT NULL,
	"side" text NOT NULL,
	"order_type" text NOT NULL,
	"quantity" numeric(10, 4) NOT NULL,
	"price" numeric(10, 2),
	"total_value" numeric(10, 2),
	"status" text NOT NULL,
	"filled_quantity" numeric(10, 4) DEFAULT '0',
	"average_fill_price" numeric(10, 2),
	"fees" numeric(10, 2) DEFAULT '0.00',
	"stop_loss_price" numeric(10, 2),
	"take_profit_price" numeric(10, 2),
	"order_expiry" timestamp,
	"execution_details" jsonb,
	"rejection_reason" text,
	"filled_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "phase1_market_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"severity" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"impact" jsonb,
	"visual_effect" text,
	"trigger_volatility_level" numeric(8, 2),
	"duration" integer DEFAULT 60,
	"timestamp" timestamp DEFAULT now(),
	"end_timestamp" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"total_value" numeric(15, 2),
	"day_change" numeric(10, 2),
	"day_change_percent" numeric(8, 2),
	"total_return" numeric(10, 2),
	"total_return_percent" numeric(8, 2),
	"diversification_score" numeric(3, 1),
	"cash_balance" numeric(15, 2) DEFAULT '100000.00',
	"initial_cash_allocation" numeric(15, 2) DEFAULT '100000.00',
	"portfolio_type" text DEFAULT 'default',
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"quantity" numeric(10, 4) NOT NULL,
	"average_cost" numeric(10, 2) NOT NULL,
	"total_cost_basis" numeric(15, 2) NOT NULL,
	"current_value" numeric(15, 2),
	"current_price" numeric(10, 2),
	"unrealized_pnl" numeric(15, 2),
	"unrealized_pnl_percent" numeric(8, 2),
	"first_buy_date" timestamp NOT NULL,
	"last_trade_date" timestamp NOT NULL,
	"total_buys" integer DEFAULT 1,
	"total_sells" integer DEFAULT 0,
	"holding_period_days" integer,
	"stop_loss_price" numeric(10, 2),
	"take_profit_price" numeric(10, 2),
	"max_position_value" numeric(15, 2),
	"max_unrealized_profit" numeric(15, 2),
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_alerts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"alert_type" text NOT NULL,
	"threshold_value" numeric(10, 2) NOT NULL,
	"percentage_threshold" numeric(8, 2),
	"is_active" boolean DEFAULT true,
	"last_triggered_price" numeric(10, 2),
	"trigger_count" integer DEFAULT 0,
	"cooldown_minutes" integer DEFAULT 60,
	"name" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"triggered_at" timestamp,
	"last_checked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "psychological_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"pattern" text NOT NULL,
	"analysis" text NOT NULL,
	"dominant_traits" jsonb,
	"moral_alignment" text,
	"trading_style" text,
	"empathy_score" numeric(5, 2),
	"ruthlessness_index" numeric(5, 2),
	"denial_level" numeric(5, 2),
	"previous_profile" text,
	"turning_points" jsonb,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_dataset_files" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"checksum" text NOT NULL,
	"checksum_algorithm" text DEFAULT 'sha256',
	"dataset_type" text NOT NULL,
	"source" text NOT NULL,
	"source_url" text,
	"universe" text,
	"processing_status" text DEFAULT 'uploaded',
	"processing_progress" numeric(5, 2) DEFAULT '0.00',
	"total_rows" integer,
	"processed_rows" integer DEFAULT 0,
	"failed_rows" integer DEFAULT 0,
	"storage_location" text NOT NULL,
	"compression_type" text,
	"uploaded_by" varchar,
	"ingestion_job_id" varchar,
	"csv_headers" text[],
	"sample_data" jsonb,
	"validation_rules" jsonb,
	"error_summary" jsonb,
	"last_error_message" text,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"uploaded_at" timestamp DEFAULT now(),
	"processing_started_at" timestamp,
	"processing_completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sacred_lessons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"house_id" text,
	"path_id" varchar,
	"lesson_type" text NOT NULL,
	"difficulty_level" text NOT NULL,
	"estimated_minutes" integer DEFAULT 15,
	"experience_reward" integer DEFAULT 100,
	"karma_reward" integer DEFAULT 5,
	"content_format" text NOT NULL,
	"content_data" jsonb NOT NULL,
	"media_urls" jsonb,
	"interactive_elements" jsonb,
	"prerequisites" jsonb,
	"unlock_conditions" jsonb,
	"next_lessons" text[],
	"mastery_threshold" numeric(8, 2) DEFAULT '80.00',
	"allow_retakes" boolean DEFAULT true,
	"max_attempts" integer DEFAULT 3,
	"sacred_title" text NOT NULL,
	"mystical_narrative" text NOT NULL,
	"guiding_spirit" text,
	"ritual_description" text,
	"lesson_icon" text DEFAULT 'BookOpen',
	"atmospheric_effects" jsonb,
	"avg_completion_time_minutes" integer,
	"avg_score_achieved" numeric(8, 2),
	"completion_rate" numeric(8, 2),
	"user_rating" numeric(3, 2),
	"is_active" boolean DEFAULT true,
	"published_at" timestamp,
	"content_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seven_houses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"specialization" text NOT NULL,
	"color" text NOT NULL,
	"symbol" text,
	"reputation_score" numeric(10, 2) DEFAULT '100.00',
	"power_level" numeric(10, 2) DEFAULT '100.00',
	"market_cap" numeric(15, 2) DEFAULT '0.00',
	"daily_volume" numeric(15, 2) DEFAULT '0.00',
	"controlled_assets_count" integer DEFAULT 0,
	"house_slogan" text,
	"headquarters_location" text,
	"rival_houses" text[],
	"alliance_houses" text[],
	"boss_name" text,
	"member_count" integer DEFAULT 0,
	"lieutenants" text[],
	"trading_bonus_percent" numeric(8, 2) DEFAULT '0.00',
	"special_power_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "seven_houses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "shadow_order_book" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"order_type" text NOT NULL,
	"side" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"filled" integer DEFAULT 0,
	"visibility_level" integer NOT NULL,
	"is_hidden" boolean DEFAULT true,
	"reveal_at" timestamp,
	"target_user_id" varchar,
	"target_price" numeric(10, 2),
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shadow_traders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"shadow_name" text NOT NULL,
	"strength" numeric(10, 2) DEFAULT '100.00',
	"corruption_level" numeric(5, 2) DEFAULT '0.00',
	"portfolio_value" numeric(15, 2) DEFAULT '0.00',
	"status" text DEFAULT 'active' NOT NULL,
	"fallen_at" timestamp,
	"consumed_by" varchar,
	"shadow_color" text DEFAULT '#000000',
	"opacity" numeric(3, 2) DEFAULT '0.80',
	"is_ai" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shadow_trades" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"shadow_price" numeric(10, 2) NOT NULL,
	"real_price" numeric(10, 2) NOT NULL,
	"price_divergence" numeric(8, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"side" text NOT NULL,
	"order_type" text NOT NULL,
	"profit_loss" numeric(15, 2) NOT NULL,
	"corruption_gained" integer NOT NULL,
	"victim_id" varchar,
	"victim_loss" numeric(15, 2),
	"status" text DEFAULT 'pending' NOT NULL,
	"executed_at" timestamp NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "short_positions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"shares_shorted" numeric(10, 4) NOT NULL,
	"short_price" numeric(10, 2) NOT NULL,
	"current_price" numeric(10, 2),
	"unrealized_pnl" numeric(15, 2),
	"realized_pnl" numeric(15, 2) DEFAULT '0.00',
	"borrow_rate" numeric(8, 4),
	"borrow_fee_accrued" numeric(10, 2) DEFAULT '0.00',
	"last_borrow_fee_calc" timestamp DEFAULT now(),
	"stop_loss_price" numeric(10, 2),
	"margin_requirement" numeric(15, 2),
	"position_status" text DEFAULT 'open',
	"can_borrow" boolean DEFAULT true,
	"borrow_source" text,
	"opened_at" timestamp DEFAULT now(),
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staging_records" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_file_id" varchar NOT NULL,
	"row_number" integer NOT NULL,
	"raw_data" jsonb NOT NULL,
	"data_hash" text NOT NULL,
	"processing_status" text DEFAULT 'pending',
	"normalization_attempts" integer DEFAULT 0,
	"record_type" text,
	"detected_entity_type" text,
	"confidence_score" numeric(3, 2),
	"mapped_fields" jsonb,
	"extracted_entities" jsonb,
	"relationship_hints" jsonb,
	"data_quality_score" numeric(3, 2),
	"missing_fields" text[],
	"data_inconsistencies" jsonb,
	"is_duplicate" boolean DEFAULT false,
	"duplicate_of" varchar,
	"similarity_score" numeric(3, 2),
	"error_messages" text[],
	"last_error_details" jsonb,
	"content_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp,
	"normalized_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "stolen_positions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thief_id" varchar NOT NULL,
	"victim_id" varchar NOT NULL,
	"position_id" varchar NOT NULL,
	"original_value" numeric(15, 2) NOT NULL,
	"stolen_value" numeric(15, 2) NOT NULL,
	"discount_rate" numeric(5, 2) DEFAULT '50.00',
	"corruption_gained" numeric(5, 2) DEFAULT '30.00',
	"victim_harm" numeric(15, 2) NOT NULL,
	"steal_method" text DEFAULT 'vulture',
	"stolen_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_beats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timeline_id" varchar NOT NULL,
	"beat_title" text NOT NULL,
	"beat_type" text NOT NULL,
	"beat_category" text NOT NULL,
	"narrative_function" text,
	"chronological_order" integer NOT NULL,
	"relative_position" numeric(5, 4),
	"story_act" integer,
	"source_issue" text,
	"source_media" text,
	"page_number" integer,
	"panel_number" integer,
	"publication_date" text,
	"writer_credits" text[],
	"artist_credits" text[],
	"primary_entities" text[],
	"secondary_entities" text[],
	"entity_roles" jsonb,
	"relationships" jsonb,
	"market_relevance" numeric(3, 2),
	"price_impact_potential" numeric(3, 2),
	"volatility_trigger" boolean DEFAULT false,
	"speculation_opportunity" numeric(3, 2),
	"long_term_value_impact" numeric(3, 2),
	"affected_assets" text[],
	"expected_price_direction" text,
	"impact_magnitude" numeric(3, 2),
	"house_resonance" jsonb,
	"primary_house" text,
	"educational_value" numeric(3, 2),
	"strategic_insight" text,
	"emotional_tone" text,
	"emotional_intensity" numeric(3, 2),
	"thematic_significance" text[],
	"symbolism" text[],
	"archetypes" text[],
	"character_growth" jsonb,
	"power_changes" jsonb,
	"relationship_changes" jsonb,
	"status_changes" jsonb,
	"plot_significance" numeric(3, 2),
	"is_climax" boolean DEFAULT false,
	"is_turning_point" boolean DEFAULT false,
	"sets_up_future" boolean DEFAULT false,
	"pays_off_setup" boolean DEFAULT false,
	"callbacks" text[],
	"setup_for_beats" text[],
	"iconic_status" boolean DEFAULT false,
	"memes_generated" boolean DEFAULT false,
	"fan_reaction" text,
	"critical_reception" text,
	"cultural_reference" boolean DEFAULT false,
	"summary" text NOT NULL,
	"detailed_description" text,
	"dialogue" text[],
	"visual_description" text,
	"action_sequence" text,
	"stakes_level" text,
	"consequences" text[],
	"permanent_changes" text[],
	"reversible_changes" text[],
	"image_urls" text[],
	"panel_images" text[],
	"video_clips" text[],
	"audio_references" text[],
	"beat_quality" numeric(3, 2),
	"narrative_importance" numeric(3, 2),
	"execution_quality" numeric(3, 2),
	"originality_score" numeric(3, 2),
	"tags" text[],
	"keywords" text[],
	"spoiler_level" text DEFAULT 'minor',
	"content_warnings" text[],
	"beat_embedding" vector(1536),
	"dialogue_embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"curated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "story_event_triggers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger_name" text NOT NULL,
	"trigger_type" text NOT NULL,
	"event_severity" text NOT NULL,
	"story_beat_id" varchar,
	"character_id" varchar,
	"timeline_id" varchar,
	"price_impact_range" jsonb,
	"volatility_impact_multiplier" numeric(8, 4) DEFAULT '1.0000',
	"volume_impact_multiplier" numeric(8, 4) DEFAULT '1.0000',
	"sentiment_shift" numeric(8, 4) DEFAULT '0.0000',
	"affected_asset_types" text[],
	"directly_affected_assets" text[],
	"indirectly_affected_assets" text[],
	"house_response_multipliers" jsonb,
	"cross_house_effects" jsonb,
	"immediate_impact_duration" integer DEFAULT 1440,
	"medium_term_effect_duration" integer DEFAULT 10080,
	"long_term_memory_decay" numeric(8, 4) DEFAULT '0.0100',
	"trigger_conditions" jsonb,
	"cooldown_period" integer DEFAULT 0,
	"max_activations_per_day" integer DEFAULT 10,
	"is_active" boolean DEFAULT true,
	"last_triggered" timestamp,
	"total_activations" integer DEFAULT 0,
	"successful_activations" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriber_active_benefits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_capital_bonus_earned" numeric(15, 2) DEFAULT '0.00',
	"pending_capital_bonus" numeric(15, 2) DEFAULT '0.00',
	"trading_fee_discount" numeric(5, 2) DEFAULT '0.00',
	"fee_discount_expires_at" timestamp,
	"xp_multiplier" numeric(5, 2) DEFAULT '1.00',
	"xp_multiplier_expires_at" timestamp,
	"has_early_access" boolean DEFAULT false,
	"early_access_features" text[],
	"early_access_expires_at" timestamp,
	"certification_badge_tier" text,
	"display_badge" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriber_course_incentives" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"course_id" varchar,
	"pathway_level_id" varchar,
	"incentive_type" text NOT NULL,
	"incentive_value" numeric(15, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"activated_at" timestamp,
	"expires_at" timestamp,
	"claimed_at" timestamp,
	"is_active" boolean DEFAULT true,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriber_incentive_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"incentive_id" varchar,
	"event_type" text NOT NULL,
	"incentive_type" text NOT NULL,
	"incentive_value" numeric(15, 2) NOT NULL,
	"source_type" text NOT NULL,
	"source_id" varchar,
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_number" integer NOT NULL,
	"category" text NOT NULL,
	"scenario" text NOT NULL,
	"contextual_setup" text,
	"options" jsonb NOT NULL,
	"dimensions" jsonb NOT NULL,
	"house_weights" jsonb NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "test_questions_question_number_unique" UNIQUE("question_number")
);
--> statement-breakpoint
CREATE TABLE "test_responses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_id" varchar NOT NULL,
	"question_id" varchar NOT NULL,
	"selected_option_id" text NOT NULL,
	"response_time" integer,
	"dimension_scores" jsonb,
	"house_affinities" jsonb,
	"responded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_id" varchar NOT NULL,
	"psychological_profile" jsonb NOT NULL,
	"assigned_house_id" text NOT NULL,
	"primary_affinity" numeric(5, 2) NOT NULL,
	"secondary_house_id" text,
	"secondary_affinity" numeric(5, 2),
	"tertiary_house_id" text,
	"tertiary_affinity" numeric(5, 2),
	"all_house_scores" jsonb NOT NULL,
	"dimension_breakdown" jsonb NOT NULL,
	"total_questions" integer NOT NULL,
	"completion_time" integer,
	"consistency_score" numeric(5, 2),
	"assignment_rationale" text,
	"completed_at" timestamp DEFAULT now(),
	CONSTRAINT "test_results_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "test_results_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "test_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_id" varchar NOT NULL,
	"current_question_number" integer DEFAULT 1,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"last_activity_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	CONSTRAINT "test_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "trader_stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_portfolio_value" numeric(15, 2) DEFAULT '0.00',
	"total_pnl" numeric(15, 2) DEFAULT '0.00',
	"total_realized_pnl" numeric(15, 2) DEFAULT '0.00',
	"total_unrealized_pnl" numeric(15, 2) DEFAULT '0.00',
	"roi_percentage" numeric(8, 2) DEFAULT '0.00',
	"total_trades" integer DEFAULT 0,
	"profitable_trades" integer DEFAULT 0,
	"win_rate" numeric(8, 2) DEFAULT '0.00',
	"average_trade_size" numeric(15, 2) DEFAULT '0.00',
	"total_trading_volume" numeric(15, 2) DEFAULT '0.00',
	"biggest_win" numeric(15, 2) DEFAULT '0.00',
	"biggest_loss" numeric(15, 2) DEFAULT '0.00',
	"current_winning_streak" integer DEFAULT 0,
	"current_losing_streak" integer DEFAULT 0,
	"longest_winning_streak" integer DEFAULT 0,
	"longest_losing_streak" integer DEFAULT 0,
	"sharpe_ratio" numeric(5, 3),
	"max_drawdown" numeric(8, 2),
	"volatility" numeric(8, 2),
	"rank_points" numeric(10, 2) DEFAULT '0.00',
	"current_rank" integer,
	"best_rank" integer,
	"achievement_points" integer DEFAULT 0,
	"trading_days_active" integer DEFAULT 0,
	"last_trade_date" timestamp,
	"first_trade_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trader_warfare" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attacker_id" varchar NOT NULL,
	"defender_id" varchar NOT NULL,
	"warfare_type" text NOT NULL,
	"outcome" text NOT NULL,
	"attacker_gain" numeric(15, 2) DEFAULT '0.00',
	"defender_loss" numeric(15, 2) DEFAULT '0.00',
	"collateral_damage" numeric(15, 2) DEFAULT '0.00',
	"brutality_score" numeric(5, 2) DEFAULT '0.00',
	"victims_created" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"order_id" varchar,
	"side" text NOT NULL,
	"quantity" numeric(10, 4) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"total_value" numeric(15, 2) NOT NULL,
	"fees" numeric(10, 2) DEFAULT '0.00',
	"pnl" numeric(15, 2),
	"pnl_percent" numeric(8, 2),
	"cost_basis" numeric(15, 2),
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"trade_type" text DEFAULT 'manual',
	"notes" text,
	"moral_impact" numeric(10, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trading_consequences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"order_id" varchar,
	"user_lawful_chaotic" numeric(8, 2) NOT NULL,
	"user_good_evil" numeric(8, 2) NOT NULL,
	"user_karma" integer NOT NULL,
	"user_house_id" text,
	"consequence_type" text NOT NULL,
	"consequence_category" text NOT NULL,
	"modifier_value" numeric(5, 4) NOT NULL,
	"modifier_type" text NOT NULL,
	"original_value" numeric(15, 2),
	"modified_value" numeric(15, 2),
	"impact_description" text NOT NULL,
	"mystical_flavor" text NOT NULL,
	"is_temporary" boolean DEFAULT true,
	"duration_minutes" integer,
	"expires_at" timestamp,
	"stacks_with_others" boolean DEFAULT false,
	"consequence_applied" boolean DEFAULT true,
	"resulting_outcome" text,
	"user_satisfaction" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trading_firms" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" text NOT NULL,
	"firm_name" text NOT NULL,
	"firm_code" text NOT NULL,
	"ceo_name" text NOT NULL,
	"ceo_mythology_ref" text,
	"advisors" jsonb,
	"primary_specialties" text[],
	"weaknesses" text[],
	"specialty_bonuses" jsonb,
	"weakness_penalties" jsonb,
	"trading_style" text NOT NULL,
	"risk_tolerance" text NOT NULL,
	"market_capacity_usd" numeric(15, 2) NOT NULL,
	"minimum_trade_size" numeric(10, 2) DEFAULT '1000.00',
	"total_aum" numeric(15, 2) DEFAULT '0.00',
	"ytd_return" numeric(8, 2) DEFAULT '0.00',
	"sharpe_ratio" numeric(8, 4),
	"max_drawdown" numeric(8, 2),
	"win_rate" numeric(8, 2),
	"avg_trade_size" numeric(10, 2),
	"is_active" boolean DEFAULT true,
	"market_hours" jsonb,
	"communication_channels" jsonb,
	"reputation" numeric(8, 2) DEFAULT '50.00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "trading_firms_firm_code_unique" UNIQUE("firm_code")
);
--> statement-breakpoint
CREATE TABLE "trading_limits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"asset_id" varchar,
	"limit_type" text NOT NULL,
	"limit_value" numeric(15, 2) NOT NULL,
	"current_usage" numeric(15, 2) DEFAULT '0.00',
	"reset_period" text DEFAULT 'daily',
	"last_reset" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"breach_count" integer DEFAULT 0,
	"last_breach" timestamp,
	"breach_action" text DEFAULT 'block',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trading_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"portfolio_id" varchar NOT NULL,
	"session_start" timestamp DEFAULT now() NOT NULL,
	"session_end" timestamp,
	"starting_balance" numeric(15, 2) NOT NULL,
	"ending_balance" numeric(15, 2),
	"total_trades" integer DEFAULT 0,
	"profitable_trades" integer DEFAULT 0,
	"session_profit" numeric(15, 2) DEFAULT '0.00',
	"session_profit_percent" numeric(8, 2) DEFAULT '0.00',
	"largest_win" numeric(15, 2) DEFAULT '0.00',
	"largest_loss" numeric(15, 2) DEFAULT '0.00',
	"assets_traded" text[],
	"trading_strategy" text,
	"notes" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trading_tool_unlocks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"tool_name" text NOT NULL,
	"tool_category" text NOT NULL,
	"required_progression_tier" integer NOT NULL,
	"required_variant_rarity" text,
	"required_achievements" text[],
	"required_house_level" jsonb,
	"is_unlocked" boolean DEFAULT false,
	"unlocked_at" timestamp,
	"unlocked_by" text,
	"tool_description" text NOT NULL,
	"tool_benefits" text[],
	"trading_bonuses" jsonb,
	"market_access_level" text,
	"times_used" integer DEFAULT 0,
	"last_used_at" timestamp,
	"effectiveness_rating" numeric(3, 2),
	"icon_name" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trading_victims" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trade_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"victim_name" text NOT NULL,
	"victim_story" text NOT NULL,
	"loss_amount" numeric(15, 2) NOT NULL,
	"impact_level" text NOT NULL,
	"age" integer,
	"occupation" text,
	"family_size" integer,
	"consequence" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trials_of_mastery" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"house_id" text,
	"trial_type" text NOT NULL,
	"difficulty_level" text NOT NULL,
	"phases" jsonb NOT NULL,
	"time_limit_minutes" integer DEFAULT 60,
	"max_attempts" integer DEFAULT 3,
	"passing_score" numeric(8, 2) DEFAULT '75.00',
	"perfect_score" numeric(8, 2) DEFAULT '100.00',
	"prerequisites" jsonb,
	"experience_reward" integer DEFAULT 1000,
	"karma_reward" integer DEFAULT 50,
	"skills_unlocked" text[],
	"trading_privileges_granted" jsonb,
	"certifications_awarded" text[],
	"sacred_title" text NOT NULL,
	"mythical_lore" text NOT NULL,
	"trial_master" text,
	"sacred_location" text,
	"completion_ritual" text,
	"trial_icon" text DEFAULT 'Award',
	"atmospheric_theme" text DEFAULT 'mystical',
	"attempt_count" integer DEFAULT 0,
	"success_rate" numeric(8, 2) DEFAULT '0.00',
	"avg_score" numeric(8, 2) DEFAULT '0.00',
	"avg_completion_time_minutes" integer,
	"difficulty_rating" numeric(3, 2),
	"is_active" boolean DEFAULT true,
	"seasonal_availability" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"achievement_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"icon_name" text,
	"badge_color" text DEFAULT 'blue',
	"tier" text DEFAULT 'bronze',
	"points" integer DEFAULT 0,
	"rarity" text DEFAULT 'common',
	"criteria" jsonb,
	"progress" jsonb,
	"unlocked_at" timestamp DEFAULT now(),
	"notification_sent" boolean DEFAULT false,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_ai_interactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"interaction_type" text NOT NULL,
	"input_data" jsonb,
	"ai_response" jsonb,
	"mystical_presentation" text,
	"user_house" text,
	"karma_alignment" jsonb,
	"confidence" numeric(5, 4),
	"user_rating" integer,
	"followed_advice" boolean,
	"outcome_tracking" jsonb,
	"session_id" varchar,
	"processing_time" integer,
	"tokens" integer,
	"cost" numeric(8, 6),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_certifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"certification_id" varchar NOT NULL,
	"achievement_method" text NOT NULL,
	"verification_data" jsonb,
	"witnessed_by" text[],
	"awarding_master" text,
	"certificate_number" text NOT NULL,
	"certificate_url" text,
	"badge_image_url" text,
	"public_title" text NOT NULL,
	"ceremony_completed" boolean DEFAULT false,
	"ceremony_date" timestamp,
	"public_announcement" boolean DEFAULT true,
	"featured_in_house" boolean DEFAULT false,
	"community_reactions" jsonb,
	"status" text DEFAULT 'active' NOT NULL,
	"valid_until" timestamp,
	"renewal_reminder_sent" boolean DEFAULT false,
	"display_in_profile" boolean DEFAULT true,
	"sharable_url" text,
	"timestamp_proof" text,
	"achievement_score" numeric(8, 2),
	"awarded_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_certifications_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
CREATE TABLE "user_challenge_participation" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"challenge_id" varchar NOT NULL,
	"enrolled_at" timestamp DEFAULT now(),
	"participation_status" text DEFAULT 'active',
	"current_progress" numeric(15, 2) DEFAULT '0.00',
	"progress_percentage" numeric(5, 2) DEFAULT '0.00',
	"milestones_met" text[],
	"last_progress_update" timestamp DEFAULT now(),
	"leaderboard_position" integer,
	"best_position" integer,
	"final_position" integer,
	"rewards_earned" jsonb,
	"rewards_claimed" boolean DEFAULT false,
	"rewards_claimed_at" timestamp,
	"challenge_specific_data" jsonb,
	"effort_rating" numeric(3, 2),
	"satisfaction_rating" numeric(3, 2),
	"completed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_comic_collection" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"variant_id" varchar NOT NULL,
	"quantity" integer DEFAULT 1,
	"acquisition_method" text DEFAULT 'purchase',
	"acquisition_price" numeric(10, 2),
	"current_grade" text,
	"grade_value" numeric(3, 1),
	"is_first_owned" boolean DEFAULT false,
	"contributes_to_progression" boolean DEFAULT true,
	"display_in_collection" boolean DEFAULT true,
	"available_for_trade" boolean DEFAULT false,
	"minimum_trade_value" numeric(10, 2),
	"notes" text,
	"tags" text[],
	"acquired_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_course_enrollments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"course_id" varchar NOT NULL,
	"pathway_level_id" varchar NOT NULL,
	"status" text DEFAULT 'enrolled' NOT NULL,
	"progress_percent" numeric(5, 2) DEFAULT '0.00',
	"current_module" integer DEFAULT 1,
	"completed_modules" integer[] DEFAULT ARRAY[]::integer[],
	"time_spent_minutes" integer DEFAULT 0,
	"exam_attempts" integer DEFAULT 0,
	"best_score" numeric(5, 2),
	"last_attempt_score" numeric(5, 2),
	"passed" boolean DEFAULT false,
	"passed_at" timestamp,
	"penalty_charges" numeric(10, 2) DEFAULT '0.00',
	"penalty_attempts" integer DEFAULT 0,
	"enrolled_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_course_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"course_id" varchar NOT NULL,
	"progress" numeric(8, 2) DEFAULT '0',
	"current_module" integer DEFAULT 1,
	"completed_modules" integer[],
	"time_spent" integer DEFAULT 0,
	"quiz_scores" jsonb,
	"certificate_earned" boolean DEFAULT false,
	"certificate_url" text,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_decisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"decision_type" text NOT NULL,
	"scenario_id" text,
	"choice_id" text,
	"ruthlessness_impact" numeric(5, 2) DEFAULT '0.00',
	"individualism_impact" numeric(5, 2) DEFAULT '0.00',
	"lawfulness_impact" numeric(5, 2) DEFAULT '0.00',
	"greed_impact" numeric(5, 2) DEFAULT '0.00',
	"displayed_score" integer,
	"displayed_feedback" text,
	"response_time" integer,
	"context_data" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_house_membership" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"house_id" varchar NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	"membership_level" text DEFAULT 'initiate',
	"house_loyalty" numeric(8, 2) DEFAULT '0.00',
	"house_contributions" integer DEFAULT 0,
	"house_rank" integer,
	"current_bonus_percent" numeric(8, 2) DEFAULT '0.00',
	"total_bonus_earned" numeric(15, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true,
	"left_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_house_progression" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"house_id" text NOT NULL,
	"current_level" integer DEFAULT 1,
	"experience_points" integer DEFAULT 0,
	"next_level_required_xp" integer DEFAULT 100,
	"progression_percentage" numeric(5, 2) DEFAULT '0.00',
	"current_issues_count" integer DEFAULT 0,
	"current_collection_value" numeric(15, 2) DEFAULT '0.00',
	"storylines_completed" text[],
	"character_collections_completed" text[],
	"current_trading_bonuses" jsonb,
	"unlocked_abilities" text[],
	"current_market_access_level" text DEFAULT 'basic',
	"available_house_tools" text[],
	"levels_unlocked" integer DEFAULT 1,
	"total_xp_earned" integer DEFAULT 0,
	"first_level_achieved_at" timestamp,
	"last_level_achieved_at" timestamp,
	"house_specific_achievements" text[],
	"house_contribution_score" numeric(8, 2) DEFAULT '0.00',
	"house_ranking_position" integer,
	"last_progression_activity" timestamp DEFAULT now(),
	"progression_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_karmic_alignment" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"current_alignment" text,
	"karma_score" numeric(8, 2) DEFAULT '0.00',
	"alignment_strength" numeric(8, 2) DEFAULT '0.00',
	"honesty_score" numeric(8, 2) DEFAULT '50.00',
	"cooperation_score" numeric(8, 2) DEFAULT '50.00',
	"exploitation_score" numeric(8, 2) DEFAULT '0.00',
	"generosity_score" numeric(8, 2) DEFAULT '50.00',
	"honest_actions" integer DEFAULT 0,
	"deceptive_actions" integer DEFAULT 0,
	"helpful_actions" integer DEFAULT 0,
	"harmful_actions" integer DEFAULT 0,
	"success_modifier" numeric(3, 2) DEFAULT '1.00',
	"lucky_break_chance" numeric(3, 2) DEFAULT '0.05',
	"bad_luck_chance" numeric(3, 2) DEFAULT '0.05',
	"has_experienced_reckoning" boolean DEFAULT false,
	"reckoning_date" timestamp,
	"chosen_alignment" text,
	"alignment_locked" boolean DEFAULT false,
	"learning_module_bonuses" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_learn_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"module_id" varchar NOT NULL,
	"status" text DEFAULT 'not_started',
	"progress_percent" numeric(8, 2) DEFAULT '0.00',
	"current_section" integer DEFAULT 1,
	"completed_sections" integer[],
	"time_spent" integer DEFAULT 0,
	"quiz_scores" jsonb,
	"final_score" numeric(8, 2),
	"passing_grade" numeric(8, 2) DEFAULT '70.00',
	"attempts" integer DEFAULT 0,
	"max_attempts" integer DEFAULT 3,
	"karma_earned" numeric(8, 2) DEFAULT '0.00',
	"skill_bonus_applied" boolean DEFAULT false,
	"certificate_url" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"last_accessed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_lesson_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"lesson_id" varchar NOT NULL,
	"path_id" varchar,
	"status" text DEFAULT 'not_started' NOT NULL,
	"progress_percent" numeric(8, 2) DEFAULT '0.00',
	"current_section" integer DEFAULT 1,
	"sections_completed" integer[],
	"time_spent_minutes" integer DEFAULT 0,
	"attempts" integer DEFAULT 0,
	"best_score" numeric(8, 2),
	"latest_score" numeric(8, 2),
	"mastery_achieved" boolean DEFAULT false,
	"interaction_data" jsonb,
	"difficulty_rating" integer,
	"enjoyment_rating" integer,
	"notes" text,
	"ceremony_viewed" boolean DEFAULT false,
	"experience_awarded" integer DEFAULT 0,
	"karma_awarded" integer DEFAULT 0,
	"skills_unlocked" text[],
	"started_at" timestamp,
	"completed_at" timestamp,
	"last_accessed_at" timestamp DEFAULT now(),
	"next_review_due" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_pathway_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"pathway" text NOT NULL,
	"current_level_id" varchar,
	"courses_passed" integer DEFAULT 0,
	"is_certified" boolean DEFAULT false,
	"is_master_certified" boolean DEFAULT false,
	"certification_bonus_revealed" boolean DEFAULT false,
	"certification_bonus_amount" numeric(15, 2),
	"master_bonus_revealed" boolean DEFAULT false,
	"master_bonus_amount" numeric(15, 2),
	"current_salary_max" numeric(15, 2),
	"total_courses_completed" integer DEFAULT 0,
	"total_exam_attempts" integer DEFAULT 0,
	"total_penalties_charged" numeric(10, 2) DEFAULT '0.00',
	"pathway_started_at" timestamp DEFAULT now(),
	"last_level_completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_progression_status" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"overall_progression_tier" integer DEFAULT 1,
	"progression_title" text DEFAULT 'Rookie Collector',
	"total_collection_value" numeric(15, 2) DEFAULT '0.00',
	"total_issues_owned" integer DEFAULT 0,
	"total_variants_owned" integer DEFAULT 0,
	"standard_covers_owned" integer DEFAULT 0,
	"variant_covers_owned" integer DEFAULT 0,
	"rare_variants_owned" integer DEFAULT 0,
	"ultra_rare_variants_owned" integer DEFAULT 0,
	"legendary_variants_owned" integer DEFAULT 0,
	"first_appearances_owned" integer DEFAULT 0,
	"death_issues_owned" integer DEFAULT 0,
	"resurrection_issues_owned" integer DEFAULT 0,
	"key_storyline_issues_owned" integer DEFAULT 0,
	"crossover_issues_owned" integer DEFAULT 0,
	"creator_milestones_completed" integer DEFAULT 0,
	"iconic_splash_pages_owned" integer DEFAULT 0,
	"trading_tools_unlocked" text[],
	"max_trading_tier" integer DEFAULT 1,
	"special_trading_abilities" text[],
	"house_progression_levels" jsonb,
	"house_bonuses_unlocked" jsonb,
	"inter_house_bonuses" text[],
	"achievement_milestones_completed" integer DEFAULT 0,
	"legendary_achievements_unlocked" integer DEFAULT 0,
	"series_completion_count" integer DEFAULT 0,
	"publisher_completion_percentage" jsonb,
	"last_progression_update" timestamp DEFAULT now(),
	"next_milestone_target" text,
	"progression_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_skill_unlocks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"skill_id" varchar NOT NULL,
	"unlock_method" text NOT NULL,
	"mastery_level" integer DEFAULT 1,
	"max_mastery_level" integer DEFAULT 1,
	"effectiveness_bonus" numeric(8, 2) DEFAULT '1.00',
	"times_used" integer DEFAULT 0,
	"last_used_at" timestamp,
	"total_benefit_gained" numeric(15, 2) DEFAULT '0.00',
	"experience_invested" integer DEFAULT 0,
	"mastery_progress_percent" numeric(8, 2) DEFAULT '0.00',
	"next_upgrade_cost" integer DEFAULT 500,
	"awakening_ceremony_completed" boolean DEFAULT false,
	"awakening_date" timestamp,
	"ceremonial_witnesses" text[],
	"mystical_bond" numeric(8, 2) DEFAULT '1.00',
	"skill_rating" numeric(3, 2),
	"recommends_to_others" boolean DEFAULT true,
	"personal_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_trial_attempts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"trial_id" varchar NOT NULL,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"overall_score" numeric(8, 2),
	"phase_scores" jsonb,
	"time_spent_minutes" integer DEFAULT 0,
	"passed" boolean DEFAULT false,
	"perfect_score" boolean DEFAULT false,
	"responses" jsonb,
	"trade_simulation_results" jsonb,
	"peer_review_scores" jsonb,
	"master_comments" text,
	"experience_awarded" integer DEFAULT 0,
	"karma_awarded" integer DEFAULT 0,
	"skills_unlocked" text[],
	"certifications_earned" text[],
	"trading_privileges_granted" jsonb,
	"completion_ceremony_viewed" boolean DEFAULT false,
	"public_recognition" boolean DEFAULT false,
	"witnessed_by" text[],
	"legendary_achievement" boolean DEFAULT false,
	"difficulty_rating" integer,
	"enjoyment_rating" integer,
	"would_recommend" boolean DEFAULT true,
	"feedback" text,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"password" text,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"subscription_tier" text DEFAULT 'free' NOT NULL,
	"subscription_status" text DEFAULT 'active',
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"stripe_customer_id" text,
	"monthly_trading_credits" integer DEFAULT 0,
	"used_trading_credits" integer DEFAULT 0,
	"competition_wins" integer DEFAULT 0,
	"competition_ranking" integer,
	"virtual_trading_balance" numeric(15, 2) DEFAULT '100000.00',
	"daily_trading_limit" numeric(15, 2) DEFAULT '10000.00',
	"daily_trading_used" numeric(15, 2) DEFAULT '0.00',
	"max_position_size" numeric(10, 2) DEFAULT '5000.00',
	"risk_tolerance" text DEFAULT 'moderate',
	"trading_permissions" jsonb DEFAULT '{"canTrade": true, "canUseMargin": false, "canShort": false}',
	"last_trading_activity" timestamp,
	"trading_streak_days" integer DEFAULT 0,
	"total_trading_profit" numeric(15, 2) DEFAULT '0.00',
	"house_id" text,
	"house_joined_at" timestamp,
	"karma" integer DEFAULT 0,
	"lawful_chaotic_alignment" numeric(8, 2) DEFAULT '0.00',
	"good_evil_alignment" numeric(8, 2) DEFAULT '0.00',
	"alignment_revealed" boolean DEFAULT false,
	"alignment_last_updated" timestamp DEFAULT now(),
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "variant_cover_registry" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_asset_id" varchar NOT NULL,
	"variant_identifier" text NOT NULL,
	"variant_name" text NOT NULL,
	"cover_artist" text,
	"variant_type" text NOT NULL,
	"print_run" integer,
	"incentive_ratio" text,
	"exclusive_retailer" text,
	"release_date" timestamp,
	"cover_image_url" text,
	"thumbnail_url" text,
	"back_cover_url" text,
	"base_rarity_multiplier" numeric(5, 2) DEFAULT '1.00',
	"current_premium" numeric(8, 2),
	"description" text,
	"special_features" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "volatility_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" numeric(8, 2) NOT NULL,
	"market_phase" text NOT NULL,
	"time_until_terminal" integer,
	"active_events" jsonb,
	"affected_assets" integer DEFAULT 0,
	"trading_volume" numeric(15, 2),
	"price_swings" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "watchlist_assets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"watchlist_id" varchar NOT NULL,
	"asset_id" varchar NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "watchlists" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workflow_automations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"trigger_type" text NOT NULL,
	"trigger_config" jsonb NOT NULL,
	"action_steps" jsonb NOT NULL,
	"conditions" jsonb,
	"ritual_type" text,
	"house_bonus" numeric(3, 2) DEFAULT '1.00',
	"karma_requirement" integer DEFAULT 0,
	"mystical_power" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"status" text DEFAULT 'active',
	"total_runs" integer DEFAULT 0,
	"successful_runs" integer DEFAULT 0,
	"failed_runs" integer DEFAULT 0,
	"last_run_at" timestamp,
	"last_success_at" timestamp,
	"last_failure_at" timestamp,
	"next_run_at" timestamp,
	"last_error_message" text,
	"average_execution_time" numeric(8, 3),
	"priority" integer DEFAULT 5,
	"timeout" integer DEFAULT 300000,
	"retry_policy" jsonb,
	"notification_settings" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workflow_executions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" varchar NOT NULL,
	"execution_id" varchar NOT NULL,
	"status" text NOT NULL,
	"trigger_source" text,
	"trigger_data" jsonb,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"duration_ms" integer,
	"total_steps" integer,
	"completed_steps" integer,
	"failed_steps" integer,
	"current_step" integer,
	"step_executions" jsonb,
	"output_data" jsonb,
	"error_message" text,
	"error_details" jsonb,
	"karma_earned" integer DEFAULT 0,
	"mystical_effects" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_market_predictions" ADD CONSTRAINT "ai_market_predictions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alignment_history" ADD CONSTRAINT "alignment_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alignment_scores" ADD CONSTRAINT "alignment_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_current_prices" ADD CONSTRAINT "asset_current_prices_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_financial_mapping" ADD CONSTRAINT "asset_financial_mapping_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_financial_mapping" ADD CONSTRAINT "asset_financial_mapping_underlying_asset_id_assets_id_fk" FOREIGN KEY ("underlying_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_house_id_seven_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."seven_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battle_scenarios" ADD CONSTRAINT "battle_scenarios_character1_id_enhanced_characters_id_fk" FOREIGN KEY ("character1_id") REFERENCES "public"."enhanced_characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battle_scenarios" ADD CONSTRAINT "battle_scenarios_character2_id_enhanced_characters_id_fk" FOREIGN KEY ("character2_id") REFERENCES "public"."enhanced_characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beat_the_ai_predictions" ADD CONSTRAINT "beat_the_ai_predictions_challenge_id_beat_the_ai_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."beat_the_ai_challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certification_courses" ADD CONSTRAINT "certification_courses_pathway_level_id_career_pathway_levels_id_fk" FOREIGN KEY ("pathway_level_id") REFERENCES "public"."career_pathway_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_battle_scenarios" ADD CONSTRAINT "character_battle_scenarios_character1_id_assets_id_fk" FOREIGN KEY ("character1_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_battle_scenarios" ADD CONSTRAINT "character_battle_scenarios_character2_id_assets_id_fk" FOREIGN KEY ("character2_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_activity_log" ADD CONSTRAINT "club_activity_log_club_id_investment_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."investment_clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_activity_log" ADD CONSTRAINT "club_activity_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_club_id_investment_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."investment_clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_portfolios" ADD CONSTRAINT "club_portfolios_club_id_investment_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."investment_clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_portfolios" ADD CONSTRAINT "club_portfolios_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_proposals" ADD CONSTRAINT "club_proposals_club_id_investment_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."investment_clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_proposals" ADD CONSTRAINT "club_proposals_proposer_id_users_id_fk" FOREIGN KEY ("proposer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_proposals" ADD CONSTRAINT "club_proposals_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_votes" ADD CONSTRAINT "club_votes_proposal_id_club_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."club_proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_votes" ADD CONSTRAINT "club_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_challenges" ADD CONSTRAINT "collection_challenges_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_storage_boxes" ADD CONSTRAINT "collection_storage_boxes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comic_grading_predictions" ADD CONSTRAINT "comic_grading_predictions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comic_issue_variants" ADD CONSTRAINT "comic_issue_variants_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comic_issues" ADD CONSTRAINT "comic_issues_series_id_comic_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."comic_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_participants" ADD CONSTRAINT "competition_participants_league_id_competition_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."competition_leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_participants" ADD CONSTRAINT "competition_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dark_pools" ADD CONSTRAINT "dark_pools_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detailed_karma_actions" ADD CONSTRAINT "detailed_karma_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detailed_karma_actions" ADD CONSTRAINT "detailed_karma_actions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detailed_karma_actions" ADD CONSTRAINT "detailed_karma_actions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easter_egg_unlocks" ADD CONSTRAINT "easter_egg_unlocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easter_egg_unlocks" ADD CONSTRAINT "easter_egg_unlocks_egg_id_easter_egg_definitions_id_fk" FOREIGN KEY ("egg_id") REFERENCES "public"."easter_egg_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easter_egg_unlocks" ADD CONSTRAINT "easter_egg_unlocks_progress_id_easter_egg_user_progress_id_fk" FOREIGN KEY ("progress_id") REFERENCES "public"."easter_egg_user_progress"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easter_egg_user_progress" ADD CONSTRAINT "easter_egg_user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "easter_egg_user_progress" ADD CONSTRAINT "easter_egg_user_progress_egg_id_easter_egg_definitions_id_fk" FOREIGN KEY ("egg_id") REFERENCES "public"."easter_egg_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enhanced_characters" ADD CONSTRAINT "enhanced_characters_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enhanced_comic_issues" ADD CONSTRAINT "enhanced_comic_issues_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_aliases" ADD CONSTRAINT "entity_aliases_canonical_entity_id_narrative_entities_id_fk" FOREIGN KEY ("canonical_entity_id") REFERENCES "public"."narrative_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_interactions" ADD CONSTRAINT "entity_interactions_primary_entity_id_narrative_entities_id_fk" FOREIGN KEY ("primary_entity_id") REFERENCES "public"."narrative_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_interactions" ADD CONSTRAINT "entity_interactions_secondary_entity_id_narrative_entities_id_fk" FOREIGN KEY ("secondary_entity_id") REFERENCES "public"."narrative_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_course_id_certification_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."certification_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_enrollment_id_user_course_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."user_course_enrollments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_integrations" ADD CONSTRAINT "external_integrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_integrations" ADD CONSTRAINT "external_integrations_house_id_users_house_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."users"("house_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_user_mappings" ADD CONSTRAINT "external_user_mappings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_user_mappings" ADD CONSTRAINT "external_user_mappings_integration_id_external_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."external_integrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_comics" ADD CONSTRAINT "featured_comics_issue_id_comic_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."comic_issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_comics" ADD CONSTRAINT "featured_comics_series_id_comic_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."comic_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graded_asset_profiles" ADD CONSTRAINT "graded_asset_profiles_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graded_asset_profiles" ADD CONSTRAINT "graded_asset_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grading_certifications" ADD CONSTRAINT "grading_certifications_graded_asset_id_graded_asset_profiles_id_fk" FOREIGN KEY ("graded_asset_id") REFERENCES "public"."graded_asset_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "house_market_events" ADD CONSTRAINT "house_market_events_trigger_house_id_seven_houses_id_fk" FOREIGN KEY ("trigger_house_id") REFERENCES "public"."seven_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "house_market_events" ADD CONSTRAINT "house_market_events_target_house_id_seven_houses_id_fk" FOREIGN KEY ("target_house_id") REFERENCES "public"."seven_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "house_power_rankings" ADD CONSTRAINT "house_power_rankings_house_id_seven_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."seven_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imf_vault_settings" ADD CONSTRAINT "imf_vault_settings_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_job_id_ingestion_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."ingestion_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_run_id_ingestion_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."ingestion_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_staging_record_id_staging_records_id_fk" FOREIGN KEY ("staging_record_id") REFERENCES "public"."staging_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_escalated_to_users_id_fk" FOREIGN KEY ("escalated_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_jobs" ADD CONSTRAINT "ingestion_jobs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_runs" ADD CONSTRAINT "ingestion_runs_job_id_ingestion_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."ingestion_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_runs" ADD CONSTRAINT "ingestion_runs_trigger_user_id_users_id_fk" FOREIGN KEY ("trigger_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingestion_runs" ADD CONSTRAINT "ingestion_runs_parent_run_id_ingestion_runs_id_fk" FOREIGN KEY ("parent_run_id") REFERENCES "public"."ingestion_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_analytics" ADD CONSTRAINT "integration_analytics_integration_id_external_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."external_integrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_analytics" ADD CONSTRAINT "integration_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_sync_logs" ADD CONSTRAINT "integration_sync_logs_integration_id_external_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."external_integrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_webhooks" ADD CONSTRAINT "integration_webhooks_integration_id_external_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."external_integrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_clubs" ADD CONSTRAINT "investment_clubs_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_related_trade_id_trades_id_fk" FOREIGN KEY ("related_trade_id") REFERENCES "public"."trades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_related_victim_id_trading_victims_id_fk" FOREIGN KEY ("related_victim_id") REFERENCES "public"."trading_victims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karma_actions" ADD CONSTRAINT "karma_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karmic_actions_log" ADD CONSTRAINT "karmic_actions_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karmic_actions_log" ADD CONSTRAINT "karmic_actions_log_related_asset_id_assets_id_fk" FOREIGN KEY ("related_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karmic_actions_log" ADD CONSTRAINT "karmic_actions_log_related_order_id_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karmic_actions_log" ADD CONSTRAINT "karmic_actions_log_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karmic_profiles" ADD CONSTRAINT "karmic_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karmic_profiles" ADD CONSTRAINT "karmic_profiles_current_alignment_threshold_alignment_thresholds_id_fk" FOREIGN KEY ("current_alignment_threshold") REFERENCES "public"."alignment_thresholds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_test_responses" ADD CONSTRAINT "knowledge_test_responses_result_id_knowledge_test_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."knowledge_test_results"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_test_responses" ADD CONSTRAINT "knowledge_test_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_test_results" ADD CONSTRAINT "knowledge_test_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learn_modules" ADD CONSTRAINT "learn_modules_house_specialization_mythological_houses_id_fk" FOREIGN KEY ("house_specialization") REFERENCES "public"."mythological_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_analytics" ADD CONSTRAINT "learning_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "margin_accounts" ADD CONSTRAINT "margin_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "margin_accounts" ADD CONSTRAINT "margin_accounts_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_anomalies" ADD CONSTRAINT "market_anomalies_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_comparables" ADD CONSTRAINT "market_comparables_graded_asset_id_graded_asset_profiles_id_fk" FOREIGN KEY ("graded_asset_id") REFERENCES "public"."graded_asset_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_data" ADD CONSTRAINT "market_data_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_index_data" ADD CONSTRAINT "market_index_data_index_id_market_indices_id_fk" FOREIGN KEY ("index_id") REFERENCES "public"."market_indices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_insights" ADD CONSTRAINT "market_insights_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_performance_metrics" ADD CONSTRAINT "media_performance_metrics_predecessor_id_media_performance_metrics_id_fk" FOREIGN KEY ("predecessor_id") REFERENCES "public"."media_performance_metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_performance_metrics" ADD CONSTRAINT "media_performance_metrics_successor_id_media_performance_metrics_id_fk" FOREIGN KEY ("successor_id") REFERENCES "public"."media_performance_metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moral_standings" ADD CONSTRAINT "moral_standings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_entities" ADD CONSTRAINT "narrative_entities_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_entities" ADD CONSTRAINT "narrative_entities_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_market_events" ADD CONSTRAINT "narrative_market_events_trigger_event_id_story_event_triggers_id_fk" FOREIGN KEY ("trigger_event_id") REFERENCES "public"."story_event_triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_timelines" ADD CONSTRAINT "narrative_timelines_curated_by_users_id_fk" FOREIGN KEY ("curated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_trading_metrics" ADD CONSTRAINT "narrative_trading_metrics_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_traits" ADD CONSTRAINT "narrative_traits_entity_id_narrative_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."narrative_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_trader_activity_log" ADD CONSTRAINT "npc_trader_activity_log_trader_id_npc_traders_id_fk" FOREIGN KEY ("trader_id") REFERENCES "public"."npc_traders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_trader_activity_log" ADD CONSTRAINT "npc_trader_activity_log_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_trader_positions" ADD CONSTRAINT "npc_trader_positions_trader_id_npc_traders_id_fk" FOREIGN KEY ("trader_id") REFERENCES "public"."npc_traders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_trader_positions" ADD CONSTRAINT "npc_trader_positions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_trader_psychology" ADD CONSTRAINT "npc_trader_psychology_trader_id_npc_traders_id_fk" FOREIGN KEY ("trader_id") REFERENCES "public"."npc_traders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_trader_strategies" ADD CONSTRAINT "npc_trader_strategies_trader_id_npc_traders_id_fk" FOREIGN KEY ("trader_id") REFERENCES "public"."npc_traders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "options_chain" ADD CONSTRAINT "options_chain_underlying_asset_id_assets_id_fk" FOREIGN KEY ("underlying_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psychological_profiles" ADD CONSTRAINT "psychological_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_dataset_files" ADD CONSTRAINT "raw_dataset_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sacred_lessons" ADD CONSTRAINT "sacred_lessons_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_order_book" ADD CONSTRAINT "shadow_order_book_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_order_book" ADD CONSTRAINT "shadow_order_book_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_order_book" ADD CONSTRAINT "shadow_order_book_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_traders" ADD CONSTRAINT "shadow_traders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_traders" ADD CONSTRAINT "shadow_traders_consumed_by_users_id_fk" FOREIGN KEY ("consumed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_trades" ADD CONSTRAINT "shadow_trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_trades" ADD CONSTRAINT "shadow_trades_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadow_trades" ADD CONSTRAINT "shadow_trades_victim_id_users_id_fk" FOREIGN KEY ("victim_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_positions" ADD CONSTRAINT "short_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_positions" ADD CONSTRAINT "short_positions_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_positions" ADD CONSTRAINT "short_positions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staging_records" ADD CONSTRAINT "staging_records_dataset_file_id_raw_dataset_files_id_fk" FOREIGN KEY ("dataset_file_id") REFERENCES "public"."raw_dataset_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staging_records" ADD CONSTRAINT "staging_records_duplicate_of_staging_records_id_fk" FOREIGN KEY ("duplicate_of") REFERENCES "public"."staging_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stolen_positions" ADD CONSTRAINT "stolen_positions_thief_id_users_id_fk" FOREIGN KEY ("thief_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stolen_positions" ADD CONSTRAINT "stolen_positions_victim_id_users_id_fk" FOREIGN KEY ("victim_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stolen_positions" ADD CONSTRAINT "stolen_positions_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_beats" ADD CONSTRAINT "story_beats_timeline_id_narrative_timelines_id_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."narrative_timelines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_event_triggers" ADD CONSTRAINT "story_event_triggers_story_beat_id_story_beats_id_fk" FOREIGN KEY ("story_beat_id") REFERENCES "public"."story_beats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_event_triggers" ADD CONSTRAINT "story_event_triggers_character_id_enhanced_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."enhanced_characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_event_triggers" ADD CONSTRAINT "story_event_triggers_timeline_id_narrative_timelines_id_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."narrative_timelines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriber_active_benefits" ADD CONSTRAINT "subscriber_active_benefits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriber_course_incentives" ADD CONSTRAINT "subscriber_course_incentives_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriber_course_incentives" ADD CONSTRAINT "subscriber_course_incentives_course_id_certification_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."certification_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriber_course_incentives" ADD CONSTRAINT "subscriber_course_incentives_pathway_level_id_career_pathway_levels_id_fk" FOREIGN KEY ("pathway_level_id") REFERENCES "public"."career_pathway_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriber_incentive_history" ADD CONSTRAINT "subscriber_incentive_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriber_incentive_history" ADD CONSTRAINT "subscriber_incentive_history_incentive_id_subscriber_course_incentives_id_fk" FOREIGN KEY ("incentive_id") REFERENCES "public"."subscriber_course_incentives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_question_id_test_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."test_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_sessions" ADD CONSTRAINT "test_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trader_stats" ADD CONSTRAINT "trader_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trader_warfare" ADD CONSTRAINT "trader_warfare_attacker_id_users_id_fk" FOREIGN KEY ("attacker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trader_warfare" ADD CONSTRAINT "trader_warfare_defender_id_users_id_fk" FOREIGN KEY ("defender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_consequences" ADD CONSTRAINT "trading_consequences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_consequences" ADD CONSTRAINT "trading_consequences_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_limits" ADD CONSTRAINT "trading_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_limits" ADD CONSTRAINT "trading_limits_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_sessions" ADD CONSTRAINT "trading_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_sessions" ADD CONSTRAINT "trading_sessions_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_tool_unlocks" ADD CONSTRAINT "trading_tool_unlocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_victims" ADD CONSTRAINT "trading_victims_trade_id_trades_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."trades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_victims" ADD CONSTRAINT "trading_victims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ai_interactions" ADD CONSTRAINT "user_ai_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_certifications" ADD CONSTRAINT "user_certifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_certifications" ADD CONSTRAINT "user_certifications_certification_id_divine_certifications_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."divine_certifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_participation" ADD CONSTRAINT "user_challenge_participation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_participation" ADD CONSTRAINT "user_challenge_participation_challenge_id_collection_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."collection_challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_comic_collection" ADD CONSTRAINT "user_comic_collection_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_comic_collection" ADD CONSTRAINT "user_comic_collection_variant_id_comic_issue_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."comic_issue_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_enrollments" ADD CONSTRAINT "user_course_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_enrollments" ADD CONSTRAINT "user_course_enrollments_course_id_certification_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."certification_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_enrollments" ADD CONSTRAINT "user_course_enrollments_pathway_level_id_career_pathway_levels_id_fk" FOREIGN KEY ("pathway_level_id") REFERENCES "public"."career_pathway_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_decisions" ADD CONSTRAINT "user_decisions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_house_membership" ADD CONSTRAINT "user_house_membership_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_house_membership" ADD CONSTRAINT "user_house_membership_house_id_mythological_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."mythological_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_house_progression" ADD CONSTRAINT "user_house_progression_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_karmic_alignment" ADD CONSTRAINT "user_karmic_alignment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_learn_progress" ADD CONSTRAINT "user_learn_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_learn_progress" ADD CONSTRAINT "user_learn_progress_module_id_learn_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."learn_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lesson_id_sacred_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."sacred_lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_path_id_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pathway_progress" ADD CONSTRAINT "user_pathway_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pathway_progress" ADD CONSTRAINT "user_pathway_progress_current_level_id_career_pathway_levels_id_fk" FOREIGN KEY ("current_level_id") REFERENCES "public"."career_pathway_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progression_status" ADD CONSTRAINT "user_progression_status_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_unlocks" ADD CONSTRAINT "user_skill_unlocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_skill_unlocks" ADD CONSTRAINT "user_skill_unlocks_skill_id_mystical_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."mystical_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_trial_attempts" ADD CONSTRAINT "user_trial_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_trial_attempts" ADD CONSTRAINT "user_trial_attempts_trial_id_trials_of_mastery_id_fk" FOREIGN KEY ("trial_id") REFERENCES "public"."trials_of_mastery"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_cover_registry" ADD CONSTRAINT "variant_cover_registry_base_asset_id_assets_id_fk" FOREIGN KEY ("base_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist_assets" ADD CONSTRAINT "watchlist_assets_watchlist_id_watchlists_id_fk" FOREIGN KEY ("watchlist_id") REFERENCES "public"."watchlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist_assets" ADD CONSTRAINT "watchlist_assets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_automations" ADD CONSTRAINT "workflow_automations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflow_id_workflow_automations_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow_automations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_alignment_history_user_id" ON "alignment_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_alignment_history_recorded_at" ON "alignment_history" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "idx_alignment_history_significance" ON "alignment_history" USING btree ("significance_level");--> statement-breakpoint
CREATE INDEX "idx_alignment_history_action_type" ON "alignment_history" USING btree ("triggering_action_type");--> statement-breakpoint
CREATE INDEX "idx_alignment_thresholds_name" ON "alignment_thresholds" USING btree ("threshold_name");--> statement-breakpoint
CREATE INDEX "idx_alignment_thresholds_type" ON "alignment_thresholds" USING btree ("alignment_type");--> statement-breakpoint
CREATE INDEX "idx_alignment_thresholds_active" ON "alignment_thresholds" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_alignment_thresholds_display_order" ON "alignment_thresholds" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_career_pathway_pathway" ON "career_pathway_levels" USING btree ("pathway");--> statement-breakpoint
CREATE INDEX "idx_career_pathway_level" ON "career_pathway_levels" USING btree ("level");--> statement-breakpoint
CREATE INDEX "idx_career_pathway_order" ON "career_pathway_levels" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_cert_courses_pathway_level" ON "certification_courses" USING btree ("pathway_level_id");--> statement-breakpoint
CREATE INDEX "idx_cert_courses_number" ON "certification_courses" USING btree ("course_number");--> statement-breakpoint
CREATE INDEX "idx_cert_courses_difficulty" ON "certification_courses" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "idx_collection_challenges_challenge_type" ON "collection_challenges" USING btree ("challenge_type");--> statement-breakpoint
CREATE INDEX "idx_collection_challenges_start_date" ON "collection_challenges" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "idx_collection_challenges_end_date" ON "collection_challenges" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "idx_collection_challenges_is_active" ON "collection_challenges" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_collection_challenges_target_house" ON "collection_challenges" USING btree ("target_house");--> statement-breakpoint
CREATE INDEX "idx_collection_challenges_difficulty" ON "collection_challenges" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "idx_comic_collection_achievements_achievement_id" ON "comic_collection_achievements" USING btree ("achievement_id");--> statement-breakpoint
CREATE INDEX "idx_comic_collection_achievements_category" ON "comic_collection_achievements" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_comic_collection_achievements_tier" ON "comic_collection_achievements" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "idx_comic_collection_achievements_rarity" ON "comic_collection_achievements" USING btree ("rarity");--> statement-breakpoint
CREATE INDEX "idx_comic_collection_achievements_requirement_type" ON "comic_collection_achievements" USING btree ("requirement_type");--> statement-breakpoint
CREATE INDEX "idx_comic_collection_achievements_is_hidden" ON "comic_collection_achievements" USING btree ("is_hidden");--> statement-breakpoint
CREATE INDEX "idx_comic_collection_achievements_display_order" ON "comic_collection_achievements" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_comic_issue_variants_asset_id" ON "comic_issue_variants" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_comic_issue_variants_cover_type" ON "comic_issue_variants" USING btree ("cover_type");--> statement-breakpoint
CREATE INDEX "idx_comic_issue_variants_progression_tier" ON "comic_issue_variants" USING btree ("progression_tier");--> statement-breakpoint
CREATE INDEX "idx_comic_issue_variants_rarity_score" ON "comic_issue_variants" USING btree ("rarity_score");--> statement-breakpoint
CREATE INDEX "idx_comic_issue_variants_issue_type" ON "comic_issue_variants" USING btree ("issue_type");--> statement-breakpoint
CREATE INDEX "idx_comic_issue_variants_primary_house" ON "comic_issue_variants" USING btree ("primary_house");--> statement-breakpoint
CREATE INDEX "idx_comic_issue_variants_series_title" ON "comic_issue_variants" USING btree ("series_title");--> statement-breakpoint
CREATE INDEX "idx_dark_pools_asset" ON "dark_pools" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_dark_pools_access" ON "dark_pools" USING btree ("access_level");--> statement-breakpoint
CREATE INDEX "idx_detailed_karma_user_id" ON "detailed_karma_actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_detailed_karma_action_type" ON "detailed_karma_actions" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "idx_detailed_karma_category" ON "detailed_karma_actions" USING btree ("action_category");--> statement-breakpoint
CREATE INDEX "idx_detailed_karma_house_id" ON "detailed_karma_actions" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_detailed_karma_created_at" ON "detailed_karma_actions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_detailed_karma_behavior_pattern" ON "detailed_karma_actions" USING btree ("trading_behavior_pattern");--> statement-breakpoint
CREATE INDEX "idx_divine_certifications_house_id" ON "divine_certifications" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_divine_certifications_level" ON "divine_certifications" USING btree ("certification_level");--> statement-breakpoint
CREATE INDEX "idx_divine_certifications_category" ON "divine_certifications" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_divine_certifications_rarity" ON "divine_certifications" USING btree ("rarity_level");--> statement-breakpoint
CREATE INDEX "idx_divine_certifications_active" ON "divine_certifications" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_easter_egg_trigger_type" ON "easter_egg_definitions" USING btree ("trigger_type");--> statement-breakpoint
CREATE INDEX "idx_easter_egg_subscribers_only" ON "easter_egg_definitions" USING btree ("subscribers_only");--> statement-breakpoint
CREATE INDEX "idx_easter_egg_active" ON "easter_egg_definitions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_egg_unlocks_user" ON "easter_egg_unlocks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_egg_unlocks_egg" ON "easter_egg_unlocks" USING btree ("egg_id");--> statement-breakpoint
CREATE INDEX "idx_egg_unlocks_claimed" ON "easter_egg_unlocks" USING btree ("reward_claimed");--> statement-breakpoint
CREATE INDEX "idx_egg_unlocks_public" ON "easter_egg_unlocks" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_egg_progress_user" ON "easter_egg_user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_egg_progress_egg" ON "easter_egg_user_progress" USING btree ("egg_id");--> statement-breakpoint
CREATE INDEX "idx_egg_progress_unlocked" ON "easter_egg_user_progress" USING btree ("is_unlocked");--> statement-breakpoint
CREATE INDEX "idx_egg_progress_user_egg" ON "easter_egg_user_progress" USING btree ("user_id","egg_id");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_canonical_id" ON "entity_aliases" USING btree ("canonical_entity_id");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_name" ON "entity_aliases" USING btree ("alias_name");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_type" ON "entity_aliases" USING btree ("alias_type");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_usage_context" ON "entity_aliases" USING btree ("usage_context");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_universe" ON "entity_aliases" USING btree ("universe");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_popularity" ON "entity_aliases" USING btree ("popularity_score");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_official" ON "entity_aliases" USING btree ("official_status");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_current" ON "entity_aliases" USING btree ("currently_in_use");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_search_priority" ON "entity_aliases" USING btree ("search_priority");--> statement-breakpoint
CREATE INDEX "idx_entity_aliases_unique" ON "entity_aliases" USING btree ("canonical_entity_id","alias_name","universe");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_primary" ON "entity_interactions" USING btree ("primary_entity_id");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_secondary" ON "entity_interactions" USING btree ("secondary_entity_id");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_type" ON "entity_interactions" USING btree ("interaction_type");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_outcome" ON "entity_interactions" USING btree ("outcome");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_canonicity" ON "entity_interactions" USING btree ("canonicity");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_significance" ON "entity_interactions" USING btree ("cultural_significance");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_market_impact" ON "entity_interactions" USING btree ("market_impact");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_iconic" ON "entity_interactions" USING btree ("iconic_status");--> statement-breakpoint
CREATE INDEX "idx_entity_interactions_publication_date" ON "entity_interactions" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_user" ON "exam_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_course" ON "exam_attempts" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_enrollment" ON "exam_attempts" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_passed" ON "exam_attempts" USING btree ("passed");--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_penalty" ON "exam_attempts" USING btree ("is_penalty_attempt");--> statement-breakpoint
CREATE INDEX "idx_external_integrations_user" ON "external_integrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_external_integrations_name" ON "external_integrations" USING btree ("integration_name");--> statement-breakpoint
CREATE INDEX "idx_external_integrations_status" ON "external_integrations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_external_integrations_health" ON "external_integrations" USING btree ("health_status");--> statement-breakpoint
CREATE INDEX "idx_external_user_mappings_user" ON "external_user_mappings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_external_user_mappings_integration" ON "external_user_mappings" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "idx_external_user_mappings_external_id" ON "external_user_mappings" USING btree ("external_user_id");--> statement-breakpoint
CREATE INDEX "idx_house_progression_paths_house_id" ON "house_progression_paths" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_house_progression_paths_level" ON "house_progression_paths" USING btree ("progression_level");--> statement-breakpoint
CREATE INDEX "idx_house_progression_paths_display_order" ON "house_progression_paths" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_house_progression_paths_unique" ON "house_progression_paths" USING btree ("house_id","progression_level");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_job_id" ON "ingestion_errors" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_run_id" ON "ingestion_errors" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_staging_record" ON "ingestion_errors" USING btree ("staging_record_id");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_type" ON "ingestion_errors" USING btree ("error_type");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_category" ON "ingestion_errors" USING btree ("error_category");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_severity" ON "ingestion_errors" USING btree ("error_severity");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_status" ON "ingestion_errors" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_retryable" ON "ingestion_errors" USING btree ("retryable");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_next_retry" ON "ingestion_errors" USING btree ("next_retry_at");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_resolved_at" ON "ingestion_errors" USING btree ("resolved_at");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_escalation_level" ON "ingestion_errors" USING btree ("escalation_level");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_impact_level" ON "ingestion_errors" USING btree ("impact_level");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_occurrence_count" ON "ingestion_errors" USING btree ("occurrence_count");--> statement-breakpoint
CREATE INDEX "idx_ingestion_errors_record_hash" ON "ingestion_errors" USING btree ("record_hash");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_status" ON "ingestion_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_type" ON "ingestion_jobs" USING btree ("job_type");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_dataset_type" ON "ingestion_jobs" USING btree ("dataset_type");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_batch_id" ON "ingestion_jobs" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_priority" ON "ingestion_jobs" USING btree ("priority_level");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_created_by" ON "ingestion_jobs" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_queued_at" ON "ingestion_jobs" USING btree ("queued_at");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_started_at" ON "ingestion_jobs" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_progress" ON "ingestion_jobs" USING btree ("progress");--> statement-breakpoint
CREATE INDEX "idx_ingestion_jobs_last_heartbeat" ON "ingestion_jobs" USING btree ("last_heartbeat");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_job_id" ON "ingestion_runs" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_run_number" ON "ingestion_runs" USING btree ("run_number");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_status" ON "ingestion_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_started_at" ON "ingestion_runs" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_worker_id" ON "ingestion_runs" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_success_rate" ON "ingestion_runs" USING btree ("success_rate");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_records_per_second" ON "ingestion_runs" USING btree ("records_per_second");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_error_count" ON "ingestion_runs" USING btree ("error_count");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_parent_run" ON "ingestion_runs" USING btree ("parent_run_id");--> statement-breakpoint
CREATE INDEX "idx_ingestion_runs_unique" ON "ingestion_runs" USING btree ("job_id","run_number");--> statement-breakpoint
CREATE INDEX "idx_integration_analytics_integration" ON "integration_analytics" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "idx_integration_analytics_user" ON "integration_analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_integration_analytics_date" ON "integration_analytics" USING btree ("analytics_date");--> statement-breakpoint
CREATE INDEX "idx_integration_analytics_timeframe" ON "integration_analytics" USING btree ("timeframe");--> statement-breakpoint
CREATE INDEX "idx_integration_sync_logs_integration" ON "integration_sync_logs" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "idx_integration_sync_logs_status" ON "integration_sync_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_integration_sync_logs_type" ON "integration_sync_logs" USING btree ("sync_type");--> statement-breakpoint
CREATE INDEX "idx_integration_sync_logs_started" ON "integration_sync_logs" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "idx_integration_webhooks_integration" ON "integration_webhooks" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "idx_integration_webhooks_type" ON "integration_webhooks" USING btree ("webhook_type");--> statement-breakpoint
CREATE INDEX "idx_integration_webhooks_event" ON "integration_webhooks" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_integration_webhooks_active" ON "integration_webhooks" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_journal_entries_user" ON "journal_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_journal_entries_type" ON "journal_entries" USING btree ("entry_type");--> statement-breakpoint
CREATE INDEX "idx_journal_entries_created" ON "journal_entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_karma_actions_user_id" ON "karma_actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_karma_actions_type" ON "karma_actions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_karma_actions_house_id" ON "karma_actions" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_karma_actions_created_at" ON "karma_actions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_karmic_profiles_user_id" ON "karmic_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_karmic_profiles_threshold" ON "karmic_profiles" USING btree ("current_alignment_threshold");--> statement-breakpoint
CREATE INDEX "idx_karmic_profiles_personality" ON "karmic_profiles" USING btree ("trading_personality");--> statement-breakpoint
CREATE INDEX "idx_karmic_profiles_house_compatibility" ON "karmic_profiles" USING btree ("house_alignment_compatibility");--> statement-breakpoint
CREATE INDEX "idx_karmic_profiles_last_calculated" ON "karmic_profiles" USING btree ("profile_last_calculated");--> statement-breakpoint
CREATE INDEX "idx_karmic_profiles_unique_user" ON "karmic_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_leaderboard_categories_type_timeframe" ON "leaderboard_categories" USING btree ("category_type","timeframe");--> statement-breakpoint
CREATE INDEX "idx_leaderboard_categories_active" ON "leaderboard_categories" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_leaderboard_categories_display_order" ON "leaderboard_categories" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_learning_analytics_user_id" ON "learning_analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_learning_analytics_house_mastery" ON "learning_analytics" USING btree ("primary_house_mastery");--> statement-breakpoint
CREATE INDEX "idx_learning_analytics_last_active" ON "learning_analytics" USING btree ("last_active_date");--> statement-breakpoint
CREATE INDEX "idx_learning_analytics_calculated" ON "learning_analytics" USING btree ("calculated_at");--> statement-breakpoint
CREATE INDEX "idx_learning_analytics_unique_user" ON "learning_analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_learning_paths_house_id" ON "learning_paths" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_learning_paths_difficulty" ON "learning_paths" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "idx_learning_paths_active" ON "learning_paths" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_learning_paths_display_order" ON "learning_paths" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_media_performance_media_type" ON "media_performance_metrics" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "idx_media_performance_franchise" ON "media_performance_metrics" USING btree ("franchise");--> statement-breakpoint
CREATE INDEX "idx_media_performance_universe" ON "media_performance_metrics" USING btree ("universe");--> statement-breakpoint
CREATE INDEX "idx_media_performance_release_year" ON "media_performance_metrics" USING btree ("release_year");--> statement-breakpoint
CREATE INDEX "idx_media_performance_worldwide_gross" ON "media_performance_metrics" USING btree ("worldwide_gross");--> statement-breakpoint
CREATE INDEX "idx_media_performance_roi" ON "media_performance_metrics" USING btree ("return_on_investment");--> statement-breakpoint
CREATE INDEX "idx_media_performance_critical_score" ON "media_performance_metrics" USING btree ("metacritic_score");--> statement-breakpoint
CREATE INDEX "idx_media_performance_cultural_reach" ON "media_performance_metrics" USING btree ("cultural_reach");--> statement-breakpoint
CREATE INDEX "idx_media_performance_franchise_position" ON "media_performance_metrics" USING btree ("franchise_position");--> statement-breakpoint
CREATE INDEX "idx_mystical_skills_house_id" ON "mystical_skills" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_mystical_skills_category" ON "mystical_skills" USING btree ("skill_category");--> statement-breakpoint
CREATE INDEX "idx_mystical_skills_tier" ON "mystical_skills" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "idx_mystical_skills_rarity" ON "mystical_skills" USING btree ("rarity_level");--> statement-breakpoint
CREATE INDEX "idx_mystical_skills_active" ON "mystical_skills" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_type" ON "narrative_entities" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_universe" ON "narrative_entities" USING btree ("universe");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_subtype" ON "narrative_entities" USING btree ("subtype");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_canonical_name" ON "narrative_entities" USING btree ("canonical_name");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_asset_id" ON "narrative_entities" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_popularity" ON "narrative_entities" USING btree ("popularity_score");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_verification" ON "narrative_entities" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_narrative_entities_unique" ON "narrative_entities" USING btree ("canonical_name","universe","entity_type");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_type" ON "narrative_timelines" USING btree ("timeline_type");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_universe" ON "narrative_timelines" USING btree ("universe");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_status" ON "narrative_timelines" USING btree ("timeline_status");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_primary_house" ON "narrative_timelines" USING btree ("primary_house");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_market_influence" ON "narrative_timelines" USING btree ("market_influence");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_cultural_significance" ON "narrative_timelines" USING btree ("cultural_significance");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_curation_status" ON "narrative_timelines" USING btree ("curation_status");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_quality_score" ON "narrative_timelines" USING btree ("quality_score");--> statement-breakpoint
CREATE INDEX "idx_narrative_timelines_chronological_order" ON "narrative_timelines" USING btree ("chronological_order");--> statement-breakpoint
CREATE INDEX "idx_narrative_traits_entity_id" ON "narrative_traits" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "idx_narrative_traits_category" ON "narrative_traits" USING btree ("trait_category");--> statement-breakpoint
CREATE INDEX "idx_narrative_traits_type" ON "narrative_traits" USING btree ("trait_type");--> statement-breakpoint
CREATE INDEX "idx_narrative_traits_potency" ON "narrative_traits" USING btree ("potency_level");--> statement-breakpoint
CREATE INDEX "idx_narrative_traits_mastery" ON "narrative_traits" USING btree ("mastery_level");--> statement-breakpoint
CREATE INDEX "idx_narrative_traits_canonicity" ON "narrative_traits" USING btree ("canonicity");--> statement-breakpoint
CREATE INDEX "idx_narrative_traits_market_relevance" ON "narrative_traits" USING btree ("market_relevance");--> statement-breakpoint
CREATE INDEX "idx_psychological_profiles_user" ON "psychological_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_raw_dataset_files_status" ON "raw_dataset_files" USING btree ("processing_status");--> statement-breakpoint
CREATE INDEX "idx_raw_dataset_files_type" ON "raw_dataset_files" USING btree ("dataset_type");--> statement-breakpoint
CREATE INDEX "idx_raw_dataset_files_source" ON "raw_dataset_files" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_raw_dataset_files_uploaded_by" ON "raw_dataset_files" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "idx_raw_dataset_files_checksum" ON "raw_dataset_files" USING btree ("checksum");--> statement-breakpoint
CREATE INDEX "idx_sacred_lessons_house_id" ON "sacred_lessons" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_sacred_lessons_path_id" ON "sacred_lessons" USING btree ("path_id");--> statement-breakpoint
CREATE INDEX "idx_sacred_lessons_type" ON "sacred_lessons" USING btree ("lesson_type");--> statement-breakpoint
CREATE INDEX "idx_sacred_lessons_difficulty" ON "sacred_lessons" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "idx_sacred_lessons_active" ON "sacred_lessons" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_sacred_lessons_published" ON "sacred_lessons" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_shadow_order_book_user" ON "shadow_order_book" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_shadow_order_book_asset" ON "shadow_order_book" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_shadow_order_book_status" ON "shadow_order_book" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_shadow_traders_status" ON "shadow_traders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_shadow_traders_user" ON "shadow_traders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_shadow_trades_user" ON "shadow_trades" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_shadow_trades_asset" ON "shadow_trades" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_shadow_trades_executed" ON "shadow_trades" USING btree ("executed_at");--> statement-breakpoint
CREATE INDEX "idx_staging_records_file_id" ON "staging_records" USING btree ("dataset_file_id");--> statement-breakpoint
CREATE INDEX "idx_staging_records_status" ON "staging_records" USING btree ("processing_status");--> statement-breakpoint
CREATE INDEX "idx_staging_records_type" ON "staging_records" USING btree ("record_type");--> statement-breakpoint
CREATE INDEX "idx_staging_records_hash" ON "staging_records" USING btree ("data_hash");--> statement-breakpoint
CREATE INDEX "idx_staging_records_duplicate" ON "staging_records" USING btree ("is_duplicate");--> statement-breakpoint
CREATE INDEX "idx_staging_records_unique" ON "staging_records" USING btree ("dataset_file_id","row_number");--> statement-breakpoint
CREATE INDEX "idx_stolen_positions_thief" ON "stolen_positions" USING btree ("thief_id");--> statement-breakpoint
CREATE INDEX "idx_stolen_positions_victim" ON "stolen_positions" USING btree ("victim_id");--> statement-breakpoint
CREATE INDEX "idx_stolen_positions_stolen_at" ON "stolen_positions" USING btree ("stolen_at");--> statement-breakpoint
CREATE INDEX "idx_story_beats_timeline_id" ON "story_beats" USING btree ("timeline_id");--> statement-breakpoint
CREATE INDEX "idx_story_beats_chronological_order" ON "story_beats" USING btree ("chronological_order");--> statement-breakpoint
CREATE INDEX "idx_story_beats_type" ON "story_beats" USING btree ("beat_type");--> statement-breakpoint
CREATE INDEX "idx_story_beats_category" ON "story_beats" USING btree ("beat_category");--> statement-breakpoint
CREATE INDEX "idx_story_beats_market_relevance" ON "story_beats" USING btree ("market_relevance");--> statement-breakpoint
CREATE INDEX "idx_story_beats_price_impact" ON "story_beats" USING btree ("price_impact_potential");--> statement-breakpoint
CREATE INDEX "idx_story_beats_volatility_trigger" ON "story_beats" USING btree ("volatility_trigger");--> statement-breakpoint
CREATE INDEX "idx_story_beats_primary_house" ON "story_beats" USING btree ("primary_house");--> statement-breakpoint
CREATE INDEX "idx_story_beats_plot_significance" ON "story_beats" USING btree ("plot_significance");--> statement-breakpoint
CREATE INDEX "idx_story_beats_iconic_status" ON "story_beats" USING btree ("iconic_status");--> statement-breakpoint
CREATE INDEX "idx_story_beats_relative_position" ON "story_beats" USING btree ("relative_position");--> statement-breakpoint
CREATE INDEX "idx_story_beats_unique_position" ON "story_beats" USING btree ("timeline_id","chronological_order");--> statement-breakpoint
CREATE INDEX "idx_subscriber_benefits_user" ON "subscriber_active_benefits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_subscriber_benefits_badge" ON "subscriber_active_benefits" USING btree ("certification_badge_tier");--> statement-breakpoint
CREATE INDEX "idx_subscriber_incentives_user" ON "subscriber_course_incentives" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_subscriber_incentives_type" ON "subscriber_course_incentives" USING btree ("incentive_type");--> statement-breakpoint
CREATE INDEX "idx_subscriber_incentives_status" ON "subscriber_course_incentives" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_subscriber_incentives_course" ON "subscriber_course_incentives" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "idx_incentive_history_user" ON "subscriber_incentive_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_incentive_history_event" ON "subscriber_incentive_history" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_incentive_history_source" ON "subscriber_incentive_history" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "idx_trader_stats_user_id" ON "trader_stats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_trader_stats_rank_points" ON "trader_stats" USING btree ("rank_points");--> statement-breakpoint
CREATE INDEX "idx_trader_stats_current_rank" ON "trader_stats" USING btree ("current_rank");--> statement-breakpoint
CREATE INDEX "idx_trader_stats_total_pnl" ON "trader_stats" USING btree ("total_pnl");--> statement-breakpoint
CREATE INDEX "idx_trader_stats_win_rate" ON "trader_stats" USING btree ("win_rate");--> statement-breakpoint
CREATE INDEX "idx_trader_stats_total_volume" ON "trader_stats" USING btree ("total_trading_volume");--> statement-breakpoint
CREATE INDEX "idx_trader_warfare_attacker" ON "trader_warfare" USING btree ("attacker_id");--> statement-breakpoint
CREATE INDEX "idx_trader_warfare_defender" ON "trader_warfare" USING btree ("defender_id");--> statement-breakpoint
CREATE INDEX "idx_trader_warfare_created" ON "trader_warfare" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_trading_consequences_user_id" ON "trading_consequences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_trading_consequences_order_id" ON "trading_consequences" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_trading_consequences_type" ON "trading_consequences" USING btree ("consequence_type");--> statement-breakpoint
CREATE INDEX "idx_trading_consequences_category" ON "trading_consequences" USING btree ("consequence_category");--> statement-breakpoint
CREATE INDEX "idx_trading_consequences_created_at" ON "trading_consequences" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_trading_consequences_expires_at" ON "trading_consequences" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_trading_tool_unlocks_user_id" ON "trading_tool_unlocks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_trading_tool_unlocks_tool_name" ON "trading_tool_unlocks" USING btree ("tool_name");--> statement-breakpoint
CREATE INDEX "idx_trading_tool_unlocks_category" ON "trading_tool_unlocks" USING btree ("tool_category");--> statement-breakpoint
CREATE INDEX "idx_trading_tool_unlocks_progression_tier" ON "trading_tool_unlocks" USING btree ("required_progression_tier");--> statement-breakpoint
CREATE INDEX "idx_trading_tool_unlocks_is_unlocked" ON "trading_tool_unlocks" USING btree ("is_unlocked");--> statement-breakpoint
CREATE INDEX "idx_trading_tool_unlocks_unlocked_at" ON "trading_tool_unlocks" USING btree ("unlocked_at");--> statement-breakpoint
CREATE INDEX "idx_trading_tool_unlocks_unique" ON "trading_tool_unlocks" USING btree ("user_id","tool_name");--> statement-breakpoint
CREATE INDEX "idx_trials_mastery_house_id" ON "trials_of_mastery" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_trials_mastery_type" ON "trials_of_mastery" USING btree ("trial_type");--> statement-breakpoint
CREATE INDEX "idx_trials_mastery_difficulty" ON "trials_of_mastery" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "idx_trials_mastery_active" ON "trials_of_mastery" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_user_achievements_user_id" ON "user_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_achievements_achievement_id" ON "user_achievements" USING btree ("achievement_id");--> statement-breakpoint
CREATE INDEX "idx_user_achievements_category" ON "user_achievements" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_user_achievements_tier" ON "user_achievements" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "idx_user_achievements_unlocked_at" ON "user_achievements" USING btree ("unlocked_at");--> statement-breakpoint
CREATE INDEX "idx_user_achievements_unique" ON "user_achievements" USING btree ("user_id","achievement_id");--> statement-breakpoint
CREATE INDEX "idx_user_certifications_user_id" ON "user_certifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_certifications_cert_id" ON "user_certifications" USING btree ("certification_id");--> statement-breakpoint
CREATE INDEX "idx_user_certifications_status" ON "user_certifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_user_certifications_awarded" ON "user_certifications" USING btree ("awarded_at");--> statement-breakpoint
CREATE INDEX "idx_user_certifications_public" ON "user_certifications" USING btree ("display_in_profile");--> statement-breakpoint
CREATE INDEX "idx_user_cert_unique" ON "user_certifications" USING btree ("user_id","certification_id");--> statement-breakpoint
CREATE INDEX "idx_user_challenge_participation_user_id" ON "user_challenge_participation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_challenge_participation_challenge_id" ON "user_challenge_participation" USING btree ("challenge_id");--> statement-breakpoint
CREATE INDEX "idx_user_challenge_participation_status" ON "user_challenge_participation" USING btree ("participation_status");--> statement-breakpoint
CREATE INDEX "idx_user_challenge_participation_leaderboard" ON "user_challenge_participation" USING btree ("leaderboard_position");--> statement-breakpoint
CREATE INDEX "idx_user_challenge_participation_enrolled_at" ON "user_challenge_participation" USING btree ("enrolled_at");--> statement-breakpoint
CREATE INDEX "idx_user_challenge_participation_unique" ON "user_challenge_participation" USING btree ("user_id","challenge_id");--> statement-breakpoint
CREATE INDEX "idx_user_comic_collection_user_id" ON "user_comic_collection" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_comic_collection_variant_id" ON "user_comic_collection" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "idx_user_comic_collection_acquisition_method" ON "user_comic_collection" USING btree ("acquisition_method");--> statement-breakpoint
CREATE INDEX "idx_user_comic_collection_is_first_owned" ON "user_comic_collection" USING btree ("is_first_owned");--> statement-breakpoint
CREATE INDEX "idx_user_comic_collection_acquired_at" ON "user_comic_collection" USING btree ("acquired_at");--> statement-breakpoint
CREATE INDEX "idx_user_comic_collection_unique" ON "user_comic_collection" USING btree ("user_id","variant_id");--> statement-breakpoint
CREATE INDEX "idx_user_enrollments_user" ON "user_course_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_enrollments_course" ON "user_course_enrollments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "idx_user_enrollments_pathway" ON "user_course_enrollments" USING btree ("pathway_level_id");--> statement-breakpoint
CREATE INDEX "idx_user_enrollments_status" ON "user_course_enrollments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_user_house_progression_user_id" ON "user_house_progression" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_house_progression_house_id" ON "user_house_progression" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "idx_user_house_progression_current_level" ON "user_house_progression" USING btree ("current_level");--> statement-breakpoint
CREATE INDEX "idx_user_house_progression_xp" ON "user_house_progression" USING btree ("experience_points");--> statement-breakpoint
CREATE INDEX "idx_user_house_progression_contribution" ON "user_house_progression" USING btree ("house_contribution_score");--> statement-breakpoint
CREATE INDEX "idx_user_house_progression_unique" ON "user_house_progression" USING btree ("user_id","house_id");--> statement-breakpoint
CREATE INDEX "idx_user_lesson_progress_user_id" ON "user_lesson_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_lesson_progress_lesson_id" ON "user_lesson_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "idx_user_lesson_progress_path_id" ON "user_lesson_progress" USING btree ("path_id");--> statement-breakpoint
CREATE INDEX "idx_user_lesson_progress_status" ON "user_lesson_progress" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_user_lesson_progress_completed" ON "user_lesson_progress" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "idx_user_lesson_progress_last_accessed" ON "user_lesson_progress" USING btree ("last_accessed_at");--> statement-breakpoint
CREATE INDEX "idx_user_lesson_unique" ON "user_lesson_progress" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "idx_user_pathway_user" ON "user_pathway_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_pathway_pathway" ON "user_pathway_progress" USING btree ("pathway");--> statement-breakpoint
CREATE INDEX "idx_user_pathway_level" ON "user_pathway_progress" USING btree ("current_level_id");--> statement-breakpoint
CREATE INDEX "idx_user_pathway_certified" ON "user_pathway_progress" USING btree ("is_certified");--> statement-breakpoint
CREATE INDEX "idx_user_pathway_master" ON "user_pathway_progress" USING btree ("is_master_certified");--> statement-breakpoint
CREATE INDEX "idx_user_progression_status_user_id" ON "user_progression_status" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_progression_status_tier" ON "user_progression_status" USING btree ("overall_progression_tier");--> statement-breakpoint
CREATE INDEX "idx_user_progression_status_total_value" ON "user_progression_status" USING btree ("total_collection_value");--> statement-breakpoint
CREATE INDEX "idx_user_progression_status_max_trading_tier" ON "user_progression_status" USING btree ("max_trading_tier");--> statement-breakpoint
CREATE INDEX "idx_user_progression_status_last_update" ON "user_progression_status" USING btree ("last_progression_update");--> statement-breakpoint
CREATE INDEX "idx_user_skill_unlocks_user_id" ON "user_skill_unlocks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_skill_unlocks_skill_id" ON "user_skill_unlocks" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "idx_user_skill_unlocks_mastery" ON "user_skill_unlocks" USING btree ("mastery_level");--> statement-breakpoint
CREATE INDEX "idx_user_skill_unlocks_awakening" ON "user_skill_unlocks" USING btree ("awakening_date");--> statement-breakpoint
CREATE INDEX "idx_user_skill_unique" ON "user_skill_unlocks" USING btree ("user_id","skill_id");--> statement-breakpoint
CREATE INDEX "idx_user_trial_attempts_user_id" ON "user_trial_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_trial_attempts_trial_id" ON "user_trial_attempts" USING btree ("trial_id");--> statement-breakpoint
CREATE INDEX "idx_user_trial_attempts_status" ON "user_trial_attempts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_user_trial_attempts_passed" ON "user_trial_attempts" USING btree ("passed");--> statement-breakpoint
CREATE INDEX "idx_user_trial_attempts_completed" ON "user_trial_attempts" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "idx_workflow_automations_user" ON "workflow_automations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_automations_category" ON "workflow_automations" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_workflow_automations_trigger" ON "workflow_automations" USING btree ("trigger_type");--> statement-breakpoint
CREATE INDEX "idx_workflow_automations_active" ON "workflow_automations" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_workflow_automations_next_run" ON "workflow_automations" USING btree ("next_run_at");--> statement-breakpoint
CREATE INDEX "idx_workflow_executions_workflow" ON "workflow_executions" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_executions_status" ON "workflow_executions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_workflow_executions_started" ON "workflow_executions" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "idx_workflow_executions_execution_id" ON "workflow_executions" USING btree ("execution_id");