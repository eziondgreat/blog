-- 1. DROP TABLES IF THEY EXIST (Uncomment if you want to reset)
-- DROP TABLE IF EXISTS comments;
-- DROP TABLE IF EXISTS slides;
-- DROP TABLE IF EXISTS posts;
-- DROP TABLE IF EXISTS system_config;

-- 2. CREATE system_config TABLE
CREATE TABLE system_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  primary_color TEXT NOT NULL DEFAULT '#00677f',
  secondary_color TEXT NOT NULL DEFAULT '#a90097',
  tertiary_color TEXT NOT NULL DEFAULT '#506600',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  ads JSONB NOT NULL DEFAULT '{
    "sidebarGlobal": true,
    "inFeedUnits": true,
    "midArticleInjector": true,
    "publisherId": "ca-pub-9876543210987654",
    "googleAdSenseEnabled": false,
    "sidebarAdSlot": "8877665544",
    "inFeedAdSlot": "1122334455",
    "midArticleAdSlot": "9988776655"
  }'::jsonb,
  access_key TEXT NOT NULL DEFAULT 'ELIZION_SEC_F97BA2',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initialize default configuration
INSERT INTO system_config (id, primary_color, secondary_color, tertiary_color, font_family, ads, access_key)
VALUES (
  1, 
  '#00677f', 
  '#a90097', 
  '#506600', 
  'Inter', 
  '{
    "sidebarGlobal": true,
    "inFeedUnits": true,
    "midArticleInjector": true,
    "publisherId": "ca-pub-9876543210987654",
    "googleAdSenseEnabled": false,
    "sidebarAdSlot": "8877665544",
    "inFeedAdSlot": "1122334455",
    "midArticleAdSlot": "9988776655"
  }'::jsonb, 
  'ELIZION_SEC_F97BA2'
) ON CONFLICT (id) DO NOTHING;


-- 3. CREATE posts TABLE
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Published', 'Scheduled', 'Draft')),
  category TEXT NOT NULL,
  audience TEXT NOT NULL CHECK (audience IN ('EXEC', 'PRO', 'STUDENT')),
  tags TEXT[] DEFAULT '{}'::text[] NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  ad_clicks INTEGER DEFAULT 0 NOT NULL,
  image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. CREATE slides TABLE
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge TEXT NOT NULL,
  headline TEXT NOT NULL,
  highlight_word TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  gradient_from TEXT NOT NULL,
  gradient_via TEXT NOT NULL,
  gradient_to TEXT NOT NULL,
  link_post_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 5. CREATE comments TABLE
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
  time TEXT NOT NULL,
  text TEXT NOT NULL,
  approved BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- A. Enable RLS on all tables
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- B. RLS Policies for system_config
CREATE POLICY "Allow public read system_config" ON system_config
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write system_config" ON system_config
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- C. RLS Policies for posts
CREATE POLICY "Allow public read published posts" ON posts
  FOR SELECT USING (status = 'Published');

CREATE POLICY "Allow admin read all posts" ON posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin write posts" ON posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- D. RLS Policies for slides
CREATE POLICY "Allow public read slides" ON slides
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write slides" ON slides
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- E. RLS Policies for comments
CREATE POLICY "Allow public read approved comments" ON comments
  FOR SELECT USING (approved = true);

CREATE POLICY "Allow admin read all comments" ON comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow public insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin write comments" ON comments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
