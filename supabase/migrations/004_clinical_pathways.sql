-- ============================================================
-- Clinical Pathway Builder Schema — FirstScreen
-- Migration 004
-- "Design for doctors, not engineers."
-- ============================================================

-- ── Enums ─────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE pathway_status          AS ENUM ('draft','review','approved','published','archived');
  CREATE TYPE question_type           AS ENUM ('yes_no','single_choice','multiple_choice','number','text','scale');
  CREATE TYPE relationship_strength   AS ENUM ('strongly_suggests','supports','possibly_related','less_likely');
  CREATE TYPE emergency_level         AS ENUM ('call_1669','go_to_er','urgent_care','see_doctor_today');
  CREATE TYPE recommendation_type     AS ENUM ('education','self_care','lifestyle','exercise','physical_therapy','see_doctor','urgent_care','emergency');
  CREATE TYPE evidence_level_pathway  AS ENUM ('high','moderate','low','expert_consensus');
  CREATE TYPE translation_status      AS ENUM ('auto_suggested','accepted','edited','rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ── Main Pathway Table ────────────────────────────────────────
-- Doctors see: "Pathway Name", "Specialty", "Description"
-- Internal: rules, scores, logic are all computed fields

CREATE TABLE IF NOT EXISTS clinical_pathways (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,

  -- Doctor-facing fields (what they fill in)
  name_th           TEXT NOT NULL,
  name_en           TEXT,
  description_th    TEXT,
  description_en    TEXT,
  specialty         TEXT NOT NULL DEFAULT 'general',

  -- Status & review
  status            pathway_status DEFAULT 'draft',
  reviewer_id       UUID,   -- kms_authors.id
  reviewer_name     TEXT,
  reviewer_specialty TEXT,
  review_date       TIMESTAMPTZ,
  evidence_level    evidence_level_pathway DEFAULT 'moderate',

  -- Internal metadata
  version           INT DEFAULT 1,
  is_public         BOOLEAN DEFAULT false,  -- visible in public Body Map
  created_by        UUID,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ── Pathway Body Regions ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS pathway_body_regions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id    UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  region_slug   TEXT NOT NULL,   -- matches kms_body_regions.slug
  region_name_th TEXT NOT NULL,
  region_name_en TEXT,
  sort_order    INT DEFAULT 0,
  UNIQUE (pathway_id, region_slug)
);

-- ── Pathway Symptoms ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pathway_symptoms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id      UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  symptom_slug    TEXT NOT NULL,
  name_th         TEXT NOT NULL,
  name_en         TEXT,
  is_primary      BOOLEAN DEFAULT true,
  is_custom       BOOLEAN DEFAULT false,  -- doctor added custom symptom
  sort_order      INT DEFAULT 0,
  UNIQUE (pathway_id, symptom_slug)
);

-- ── Follow-up Questions ───────────────────────────────────────
-- Doctors write in natural language: "เจ็บเมื่อยกแขนหรือไม่?"
-- System handles scoring internally

CREATE TABLE IF NOT EXISTS pathway_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id      UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  question_th     TEXT NOT NULL,       -- Thai question text
  question_en     TEXT,
  question_type   question_type DEFAULT 'yes_no',
  is_required     BOOLEAN DEFAULT false,
  hint_th         TEXT,                -- Optional helper text for doctor UI
  depends_on_id   UUID REFERENCES pathway_questions(id),  -- conditional display
  depends_value   TEXT,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Question options (for single/multiple choice)
CREATE TABLE IF NOT EXISTS pathway_question_options (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES pathway_questions(id) ON DELETE CASCADE,
  option_th     TEXT NOT NULL,
  option_en     TEXT,
  sort_order    INT DEFAULT 0
);

-- ── Possible Conditions ───────────────────────────────────────
-- Doctors pick conditions and set relationship strength
-- "Strongly Suggests" → score=90 internally (hidden from doctors)

CREATE TABLE IF NOT EXISTS pathway_conditions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id        UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  condition_slug    TEXT NOT NULL,
  condition_name_th TEXT NOT NULL,
  condition_name_en TEXT,
  strength          relationship_strength DEFAULT 'supports',
  strength_score    INT GENERATED ALWAYS AS (
    CASE strength
      WHEN 'strongly_suggests' THEN 90
      WHEN 'supports'          THEN 70
      WHEN 'possibly_related'  THEN 50
      WHEN 'less_likely'       THEN 30
    END
  ) STORED,  -- computed — doctors never see this
  notes_th          TEXT,
  sort_order        INT DEFAULT 0,
  UNIQUE (pathway_id, condition_slug)
);

-- Condition-Question links (which questions affect which conditions)
-- Doctors set this visually — "when patient answers YES to Q3, it supports Impingement"
CREATE TABLE IF NOT EXISTS pathway_condition_triggers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id    UUID NOT NULL REFERENCES pathway_conditions(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES pathway_questions(id) ON DELETE CASCADE,
  answer_value    TEXT NOT NULL,   -- the answer that triggers this condition
  weight          TEXT DEFAULT 'supports',  -- stored as text for display
  weight_score    SMALLINT DEFAULT 1  -- internal: 1-3
);

-- ── Red Flags ─────────────────────────────────────────────────
-- Doctor writes: "Sudden chest pain + shortness of breath"
-- System shows emergency banner when matched

CREATE TABLE IF NOT EXISTS pathway_red_flags (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id          UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  name_th             TEXT NOT NULL,       -- "ปวดหน้าอกรุนแรง"
  name_en             TEXT,
  description_th      TEXT NOT NULL,       -- what to tell the patient
  description_en      TEXT,
  emergency_level     emergency_level DEFAULT 'see_doctor_today',
  action_th           TEXT,                -- "โทร 1669 ทันที"
  action_en           TEXT,
  sort_order          INT DEFAULT 0
);

-- ── Recommendations ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pathway_recommendations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id      UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  type            recommendation_type DEFAULT 'see_doctor',
  title_th        TEXT NOT NULL,
  title_en        TEXT,
  detail_th       TEXT,
  detail_en       TEXT,
  condition_slug  TEXT,   -- optional: specific to a condition
  sort_order      INT DEFAULT 0
);

-- ── Medical References ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pathway_references (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id    UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  source_org    TEXT NOT NULL,    -- 'WHO', 'USPSTF', 'MOPH', 'PubMed', etc.
  title_th      TEXT,
  title_en      TEXT,
  url           TEXT,
  year          INT,
  sort_order    INT DEFAULT 0
);

-- ── Translation Layer ─────────────────────────────────────────
-- Auto-suggestion + doctor review workflow

CREATE TABLE IF NOT EXISTS pathway_translations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT NOT NULL,  -- 'pathway','symptom','question','condition','red_flag'
  entity_id       UUID NOT NULL,
  field_name      TEXT NOT NULL,  -- 'name','description','question_text', etc.
  source_text     TEXT NOT NULL,  -- original Thai
  translation     TEXT,           -- English translation
  status          translation_status DEFAULT 'auto_suggested',
  reviewed_by     TEXT,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Pathway Integrations ──────────────────────────────────────
-- Connect pathway to KMS entities

CREATE TABLE IF NOT EXISTS pathway_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id      UUID NOT NULL REFERENCES clinical_pathways(id) ON DELETE CASCADE,
  linked_type     TEXT NOT NULL,   -- 'article','condition','assessment','guideline'
  linked_id       TEXT NOT NULL,   -- the entity id or slug
  link_label_th   TEXT,
  sort_order      INT DEFAULT 0
);

-- ── Indexes ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_pathways_status     ON clinical_pathways(status);
CREATE INDEX IF NOT EXISTS idx_pathways_specialty  ON clinical_pathways(specialty);
CREATE INDEX IF NOT EXISTS idx_pathway_questions   ON pathway_questions(pathway_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_pathway_conditions  ON pathway_conditions(pathway_id);
CREATE INDEX IF NOT EXISTS idx_pathway_red_flags   ON pathway_red_flags(pathway_id);

-- ── RLS ───────────────────────────────────────────────────────

ALTER TABLE clinical_pathways            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_body_regions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_symptoms             ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_questions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_question_options     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_conditions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_condition_triggers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_red_flags            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_recommendations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_references           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_translations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_links                ENABLE ROW LEVEL SECURITY;

-- Public can read published pathways
DROP POLICY IF EXISTS "public_read_pathways" ON clinical_pathways;
CREATE POLICY "public_read_pathways" ON clinical_pathways
  FOR SELECT USING (status = 'published' AND is_public = true);

-- Auth users can read all for admin
DROP POLICY IF EXISTS "auth_all_pathways" ON clinical_pathways;
CREATE POLICY "auth_all_pathways" ON clinical_pathways
  USING (auth.role() IN ('authenticated', 'service_role'));

-- Updated_at trigger
CREATE OR REPLACE TRIGGER clinical_pathways_updated_at
  BEFORE UPDATE ON clinical_pathways
  FOR EACH ROW EXECUTE FUNCTION update_kms_updated_at();
