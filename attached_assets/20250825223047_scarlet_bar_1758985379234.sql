/*
  # News and Content Management Schema

  1. New Tables
    - `news_articles`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `content` (text, required)
      - `published_at` (timestamp, required)
      - `url` (text, required)
      - `source` (text, required)
      - `impact` (enum: positive, negative, neutral)
      - `image_url` (text, optional)
      - `keywords` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_featured` (boolean, default false)
      - `view_count` (integer, default 0)
      - `author` (text, optional)
      - `category` (text, default 'general')
      - `status` (enum: draft, published, archived)

    - `related_securities`
      - `id` (uuid, primary key)  
      - `news_article_id` (uuid, foreign key)
      - `security_type` (enum: comic, creator, publisher, option)
      - `symbol` (text, required)
      - `name` (text, required)
      - `created_at` (timestamp)

    - `news_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `keywords` (text array)
      - `notification_enabled` (boolean, default true)
      - `email_enabled` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all news tables
    - Add policies for public read access to published articles
    - Add policies for authenticated users to manage subscriptions
    - Add policies for admin users to manage articles

  3. Indexes
    - Articles by published date
    - Articles by source and category
    - Full-text search on title and content
    - Related securities by symbol
*/

-- Create custom types
CREATE TYPE article_impact AS ENUM ('positive', 'negative', 'neutral');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE security_type AS ENUM ('comic', 'creator', 'publisher', 'option');

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  impact article_impact NOT NULL DEFAULT 'neutral',
  image_url TEXT,
  keywords TEXT[] DEFAULT '{}',
  author TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  status article_status NOT NULL DEFAULT 'published',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Related securities table
CREATE TABLE IF NOT EXISTS related_securities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  security_type security_type NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News subscriptions table
CREATE TABLE IF NOT EXISTS news_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  keywords TEXT[] DEFAULT '{}',
  notification_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_securities ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for news_articles
CREATE POLICY "Anyone can read published articles"
  ON news_articles
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all articles"
  ON news_articles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for related_securities
CREATE POLICY "Anyone can read related securities"
  ON related_securities
  FOR SELECT
  USING (true);

-- Policies for news_subscriptions
CREATE POLICY "Users can manage their own subscriptions"
  ON news_subscriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_source ON news_articles(source);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_keywords ON news_articles USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_news_articles_search ON news_articles USING GIN(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_related_securities_article ON related_securities(news_article_id);
CREATE INDEX IF NOT EXISTS idx_related_securities_symbol ON related_securities(symbol);
CREATE INDEX IF NOT EXISTS idx_news_subscriptions_user ON news_subscriptions(user_id);

-- Insert sample news data
INSERT INTO news_articles (title, description, content, url, source, impact, image_url, keywords, author, category) VALUES
(
  'Marvel Studios Announces New Phase 5 Movies',
  'Disney reveals upcoming Marvel Cinematic Universe films through 2025',
  'Marvel Studios has officially announced their Phase 5 lineup, featuring new heroes and returning favorites. The announcement has sparked excitement among comic book fans and investors alike, with several character stocks seeing immediate upward movement in after-hours trading.',
  'https://example.com/marvel-phase-5',
  'Comic Book News',
  'positive',
  'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400',
  ARRAY['Marvel', 'Phase 5', 'Movies', 'MCU', 'Disney'],
  'Sarah Johnson',
  'movies'
),
(
  'DC Comics Restructures Creative Teams', 
  'Major shake-up in editorial leadership affects multiple ongoing series',
  'DC Comics has announced significant changes to their creative structure, with new editors taking over key titles. This restructuring could impact the direction of major storylines and may affect related character stock prices in the coming weeks.',
  'https://example.com/dc-restructure',
  'Comics Alliance',
  'neutral',
  'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400',
  ARRAY['DC Comics', 'Editorial', 'Restructure', 'Creative Teams'],
  'Mike Rodriguez',
  'industry'
),
(
  'Image Comics Sales Decline in Q3',
  'Independent publisher reports lower than expected quarterly performance',
  'Image Comics has reported a decline in sales for the third quarter, raising concerns about the independent comic market. Several key titles underperformed expectations, leading to decreased investor confidence in independent publisher stocks.',
  'https://example.com/image-q3-decline',
  'Publishers Weekly',
  'negative',
  'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400',
  ARRAY['Image Comics', 'Sales', 'Q3', 'Performance', 'Independent'],
  'Jennifer Lee',
  'financial'
),
(
  'Todd McFarlane Teases Major Spawn Announcement',
  'Creator hints at biggest Spawn project in decades',
  'Todd McFarlane has been dropping hints about a major Spawn-related announcement coming next month. Industry insiders speculate it could be anything from a new movie deal to a massive crossover event. McFarlane stock has seen increased trading volume as investors position themselves.',
  '/news/4',
  'Comic Creator News',
  'positive',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  ARRAY['Todd McFarlane', 'Spawn', 'Announcement', 'Creator News'],
  'Alex Chen',
  'creators'
),
(
  'CGC Grading Standards Update Affects Market',
  'New grading criteria could impact comic valuations across all eras',
  'CGC has announced updates to their grading standards that could affect how comics are valued in the market. The changes primarily impact Silver and Bronze Age comics, with some previously high-graded books potentially receiving lower scores under the new system.',
  '/news/5',
  'Grading News Today',
  'neutral',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
  ARRAY['CGC', 'Grading', 'Standards', 'Valuation', 'Market Impact'],
  'Robert Kim',
  'grading'
);

-- Insert related securities
INSERT INTO related_securities (news_article_id, security_type, symbol, name) VALUES
((SELECT id FROM news_articles WHERE title LIKE 'Marvel Studios%'), 'publisher', 'MRVL', 'Marvel Entertainment'),
((SELECT id FROM news_articles WHERE title LIKE 'Marvel Studios%'), 'comic', 'ASM300', 'Amazing Spider-Man #300'),
((SELECT id FROM news_articles WHERE title LIKE 'DC Comics Restructures%'), 'publisher', 'DCCP', 'DC Comics'),
((SELECT id FROM news_articles WHERE title LIKE 'DC Comics Restructures%'), 'comic', 'BATM', 'Batman'),
((SELECT id FROM news_articles WHERE title LIKE 'Image Comics%'), 'publisher', 'IMGC', 'Image Comics'),
((SELECT id FROM news_articles WHERE title LIKE 'Todd McFarlane%'), 'creator', 'TMFS', 'Todd McFarlane'),
((SELECT id FROM news_articles WHERE title LIKE 'Todd McFarlane%'), 'comic', 'SPWN', 'Spawn');