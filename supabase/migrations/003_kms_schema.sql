-- ============================================================
-- Knowledge Management System (KMS) — FirstScreen
-- Migration 003: Full KMS schema
-- ============================================================
-- SAFETY: All content tables pending medical review before publication.

-- ── Enums ─────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE article_status   AS ENUM ('draft','review','approved','published','archived');
  CREATE TYPE evidence_level   AS ENUM ('high','moderate','low','insufficient');
  CREATE TYPE content_language AS ENUM ('th','en','both');
  CREATE TYPE urgency_type     AS ENUM ('emergency','urgent','routine','self_care');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ── Authors / Reviewers ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_authors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  title        TEXT,                          -- "แพทย์ผู้เชี่ยวชาญ"
  specialty    TEXT,                          -- "Cardiology"
  credential   TEXT,                          -- "MD, PhD"
  bio_th       TEXT,
  bio_en       TEXT,
  avatar_url   TEXT,
  is_reviewer  BOOLEAN DEFAULT false,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ── Article Categories ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,
  name_th    TEXT NOT NULL,
  name_en    TEXT NOT NULL,
  parent_id  UUID REFERENCES kms_categories(id),
  color      TEXT DEFAULT 'teal',
  is_active  BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- Seed default categories
INSERT INTO kms_categories (slug, name_th, name_en, sort_order) VALUES
  ('general',            'สุขภาพทั่วไป',        'General Health',     1),
  ('cancer',             'มะเร็ง',               'Cancer',             2),
  ('heart',              'โรคหัวใจ',             'Heart Disease',      3),
  ('diabetes',           'เบาหวาน',              'Diabetes',           4),
  ('mental-health',      'สุขภาพจิต',            'Mental Health',      5),
  ('sleep',              'การนอนหลับ',           'Sleep',              6),
  ('nutrition',          'โภชนาการ',             'Nutrition',          7),
  ('exercise',           'การออกกำลังกาย',       'Exercise',           8),
  ('screening',          'การคัดกรอง',           'Screening',          9),
  ('athlete',            'นักกีฬา',              'Athlete Health',     10),
  ('running',            'วิ่ง',                 'Running',            11),
  ('weight-training',    'เวทเทรนนิ่ง',          'Weight Training',    12),
  ('injury-prevention',  'ป้องกันการบาดเจ็บ',    'Injury Prevention',  13)
ON CONFLICT (slug) DO NOTHING;

-- ── Medical References ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_references (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_org   TEXT NOT NULL,   -- 'WHO', 'USPSTF', 'MOPH', etc.
  title        TEXT NOT NULL,
  title_en     TEXT,
  url          TEXT,
  doi          TEXT,
  pubmed_id    TEXT,
  year         INT,
  evidence_level evidence_level DEFAULT 'moderate',
  guideline_name TEXT,
  is_verified  BOOLEAN DEFAULT false,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── Main Articles Table ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,

  -- Content (bilingual)
  title_th        TEXT NOT NULL,
  title_en        TEXT,
  excerpt_th      TEXT,
  excerpt_en      TEXT,
  content         JSONB NOT NULL DEFAULT '{}',  -- TipTap JSON
  language        content_language DEFAULT 'th',

  -- Classification
  category_id     UUID REFERENCES kms_categories(id),
  tags            TEXT[] DEFAULT '{}',

  -- Editorial
  status          article_status DEFAULT 'draft',
  author_id       UUID REFERENCES kms_authors(id),
  reviewer_id     UUID REFERENCES kms_authors(id),
  review_date     TIMESTAMPTZ,
  review_notes    TEXT,
  published_at    TIMESTAMPTZ,
  archived_at     TIMESTAMPTZ,

  -- Medical metadata
  evidence_level  evidence_level,
  is_pending_review BOOLEAN DEFAULT true,
  medical_disclaimer TEXT,

  -- SEO
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[] DEFAULT '{}',
  og_image_url    TEXT,
  canonical_url   TEXT,

  -- Stats
  read_time_minutes INT DEFAULT 5,
  view_count      BIGINT DEFAULT 0,
  is_featured     BOOLEAN DEFAULT false,

  -- AI preparation
  ai_summary      TEXT,         -- for future AI assistant
  ai_embeddings   vector(1536), -- for semantic search (pgvector)

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Conditions Database ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_conditions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,

  name_th         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  icd10_code      TEXT,
  icd11_code      TEXT,

  description_th  TEXT,
  description_en  TEXT,

  category        TEXT,                     -- 'cancer','cardiovascular', etc.
  body_regions    TEXT[] DEFAULT '{}',      -- region slugs
  sport_relevance TEXT[] DEFAULT '{}',      -- for athlete conditions

  -- Clinical
  symptoms        TEXT[] DEFAULT '{}',
  risk_factors    TEXT[] DEFAULT '{}',
  red_flags       JSONB DEFAULT '[]',       -- [{text_th, urgency}]
  screening_tool  TEXT,                     -- 'framingham', 'findrisc', etc.
  recommendations JSONB DEFAULT '[]',

  evidence_level  evidence_level DEFAULT 'moderate',
  urgency         urgency_type DEFAULT 'routine',

  is_athlete_condition BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,

  -- AI
  ai_summary      TEXT,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Symptoms Database ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_symptoms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,

  name_th         TEXT NOT NULL,
  name_en         TEXT NOT NULL,

  description_th  TEXT,
  body_regions    TEXT[] DEFAULT '{}',
  severity        TEXT DEFAULT 'moderate',  -- 'mild','moderate','severe','emergency'
  is_emergency    BOOLEAN DEFAULT false,
  emergency_note_th TEXT,

  possible_conditions TEXT[] DEFAULT '{}', -- condition slugs
  icd11_code      TEXT,

  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Body Regions Database ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_body_regions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name_th         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  category        TEXT,

  -- SVG coordinates (JSON for flexibility)
  svg_front       JSONB,   -- {type:'ellipse'|'rect', ...props}
  svg_back        JSONB,
  svg_label_front JSONB,   -- {x, y}
  svg_label_back  JSONB,

  possible_symptoms   TEXT[] DEFAULT '{}',
  related_conditions  TEXT[] DEFAULT '{}',
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- ── Athlete Conditions ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_athlete_conditions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name_th         TEXT NOT NULL,
  name_en         TEXT NOT NULL,

  related_regions TEXT[] DEFAULT '{}',  -- kms_body_regions slugs
  relevant_sports TEXT[] DEFAULT '{}',
  trigger_activities TEXT[] DEFAULT '{}',

  symptoms        TEXT[] DEFAULT '{}',
  description_th  TEXT,

  red_flags       JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  when_to_seek_help_th TEXT,

  urgency         urgency_type DEFAULT 'monitor',
  evidence_level  evidence_level DEFAULT 'moderate',

  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Analytics Events ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kms_analytics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   TEXT NOT NULL,  -- 'article_view','assessment_start','body_map_click', etc.
  entity_type  TEXT,           -- 'article','condition','symptom','body_region'
  entity_id    UUID,
  entity_slug  TEXT,
  session_id   TEXT,
  user_agent   TEXT,
  country      TEXT,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── Junction Tables ───────────────────────────────────────────

-- Articles ↔ Conditions
CREATE TABLE IF NOT EXISTS kms_article_conditions (
  article_id   UUID REFERENCES kms_articles(id) ON DELETE CASCADE,
  condition_id UUID REFERENCES kms_conditions(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, condition_id)
);

-- Articles ↔ Symptoms
CREATE TABLE IF NOT EXISTS kms_article_symptoms (
  article_id   UUID REFERENCES kms_articles(id) ON DELETE CASCADE,
  symptom_id   UUID REFERENCES kms_symptoms(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, symptom_id)
);

-- Articles ↔ References
CREATE TABLE IF NOT EXISTS kms_article_references (
  article_id    UUID REFERENCES kms_articles(id) ON DELETE CASCADE,
  reference_id  UUID REFERENCES kms_references(id) ON DELETE CASCADE,
  sort_order    INT DEFAULT 0,
  PRIMARY KEY (article_id, reference_id)
);

-- ── Indexes for performance ───────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_articles_status        ON kms_articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category      ON kms_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug          ON kms_articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published     ON kms_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_conditions_slug        ON kms_conditions(slug);
CREATE INDEX IF NOT EXISTS idx_symptoms_slug          ON kms_symptoms(slug);
CREATE INDEX IF NOT EXISTS idx_athlete_slug           ON kms_athlete_conditions(slug);
CREATE INDEX IF NOT EXISTS idx_analytics_event        ON kms_analytics(event_type, created_at);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE kms_articles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE kms_conditions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE kms_symptoms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE kms_body_regions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE kms_athlete_conditions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE kms_references          ENABLE ROW LEVEL SECURITY;
ALTER TABLE kms_authors             ENABLE ROW LEVEL SECURITY;
ALTER TABLE kms_analytics           ENABLE ROW LEVEL SECURITY;

-- Public read for published articles
DROP POLICY IF EXISTS "public_read_articles" ON kms_articles;
CREATE POLICY "public_read_articles" ON kms_articles
  FOR SELECT USING (status = 'published');

-- Public read for all conditions/symptoms/body-regions
DROP POLICY IF EXISTS "public_read_conditions" ON kms_conditions;
CREATE POLICY "public_read_conditions" ON kms_conditions FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_symptoms" ON kms_symptoms;
CREATE POLICY "public_read_symptoms" ON kms_symptoms FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_body_regions" ON kms_body_regions;
CREATE POLICY "public_read_body_regions" ON kms_body_regions FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_athlete_conditions" ON kms_athlete_conditions;
CREATE POLICY "public_read_athlete_conditions" ON kms_athlete_conditions FOR SELECT USING (is_active = true);

-- Service role can do everything (admin)
DROP POLICY IF EXISTS "service_all_articles" ON kms_articles;
CREATE POLICY "service_all_articles" ON kms_articles
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_kms_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER kms_articles_updated_at
  BEFORE UPDATE ON kms_articles
  FOR EACH ROW EXECUTE FUNCTION update_kms_updated_at();

CREATE OR REPLACE TRIGGER kms_conditions_updated_at
  BEFORE UPDATE ON kms_conditions
  FOR EACH ROW EXECUTE FUNCTION update_kms_updated_at();

CREATE OR REPLACE TRIGGER kms_athlete_conditions_updated_at
  BEFORE UPDATE ON kms_athlete_conditions
  FOR EACH ROW EXECUTE FUNCTION update_kms_updated_at();

-- Analytics insert policy (allow all inserts for event tracking)
DROP POLICY IF EXISTS "insert_analytics" ON kms_analytics;
CREATE POLICY "insert_analytics" ON kms_analytics FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "read_analytics" ON kms_analytics;
CREATE POLICY "read_analytics" ON kms_analytics FOR SELECT USING (auth.role() = 'service_role');
