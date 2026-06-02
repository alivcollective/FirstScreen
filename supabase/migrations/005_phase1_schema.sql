-- ============================================================
-- FirstScreen — Phase 1 Schema
-- Migration 005 — Additive only, idempotent (safe to re-run)
-- Extends clinical tables & adds new Phase 1 entities
-- ============================================================

-- ── Shared updated_at trigger function ───────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- EXTEND: public.conditions (from 002_clinical_schema)
-- ============================================================

ALTER TABLE public.conditions
  ADD COLUMN IF NOT EXISTS slug                  text UNIQUE,
  ADD COLUMN IF NOT EXISTS aliases               text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags                  text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_th        text,
  ADD COLUMN IF NOT EXISTS description_en        text,
  ADD COLUMN IF NOT EXISTS age_group             text
    CHECK (age_group IN ('all','child','teen','adult','elderly')),
  ADD COLUMN IF NOT EXISTS sex_predominant       text
    CHECK (sex_predominant IN ('all','male','female')),
  ADD COLUMN IF NOT EXISTS evidence_level        text
    CHECK (evidence_level IN ('high','moderate','low','expert_opinion')),
  ADD COLUMN IF NOT EXISTS reviewer_name         text,
  ADD COLUMN IF NOT EXISTS reviewed_at           timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at            timestamptz,
  ADD COLUMN IF NOT EXISTS disclaimer_th         text
    DEFAULT 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์',
  ADD COLUMN IF NOT EXISTS status                text DEFAULT 'draft'
    CHECK (status IN ('draft','pending_review','needs_revision','approved','published','archived')),
  ADD COLUMN IF NOT EXISTS embeddings_placeholder jsonb,
  ADD COLUMN IF NOT EXISTS updated_at            timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS conditions_updated_at ON public.conditions;
CREATE TRIGGER conditions_updated_at
  BEFORE UPDATE ON public.conditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_conditions_status  ON public.conditions(status);
CREATE INDEX IF NOT EXISTS idx_conditions_slug_p1 ON public.conditions(slug)
  WHERE slug IS NOT NULL;

-- ============================================================
-- EXTEND: public.symptoms (from 002_clinical_schema)
-- ============================================================

ALTER TABLE public.symptoms
  ADD COLUMN IF NOT EXISTS slug                  text UNIQUE,
  ADD COLUMN IF NOT EXISTS aliases               text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags                  text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_th        text,
  ADD COLUMN IF NOT EXISTS status                text DEFAULT 'draft'
    CHECK (status IN ('draft','pending_review','needs_revision','approved','published','archived')),
  ADD COLUMN IF NOT EXISTS embeddings_placeholder jsonb,
  ADD COLUMN IF NOT EXISTS updated_at            timestamptz DEFAULT now();

DROP TRIGGER IF EXISTS symptoms_updated_at ON public.symptoms;
CREATE TRIGGER symptoms_updated_at
  BEFORE UPDATE ON public.symptoms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_symptoms_status ON public.symptoms(status);

-- ============================================================
-- EXTEND: clinical_pathways (from 004_clinical_pathways)
-- ============================================================

ALTER TABLE public.clinical_pathways
  ADD COLUMN IF NOT EXISTS screening_questions    jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS red_flags_jsonb        jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS recommendations_jsonb  jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS expires_at             timestamptz,
  ADD COLUMN IF NOT EXISTS disclaimer_th          text
    DEFAULT 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์',
  ADD COLUMN IF NOT EXISTS tags                   text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS aliases                text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS embeddings_placeholder jsonb;

-- ============================================================
-- NEW TABLE: body_regions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.body_regions (
  id              uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug            text UNIQUE NOT NULL,
  name_th         text NOT NULL,
  name_en         text NOT NULL,
  parent_id       uuid REFERENCES public.body_regions(id),
  coord_front_x   numeric,
  coord_front_y   numeric,
  coord_back_x    numeric,
  coord_back_y    numeric,
  display_order   integer DEFAULT 0,
  tags            text[] DEFAULT '{}',
  status          text DEFAULT 'published'
    CHECK (status IN ('draft','pending_review','needs_revision','approved','published','archived')),
  embeddings_placeholder jsonb,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.body_regions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_body_regions" ON public.body_regions;
CREATE POLICY "public_read_body_regions"
  ON public.body_regions FOR SELECT USING (true);

DROP POLICY IF EXISTS "service_manage_body_regions" ON public.body_regions;
CREATE POLICY "service_manage_body_regions"
  ON public.body_regions
  USING (auth.role() IN ('service_role', 'authenticated'));

CREATE INDEX IF NOT EXISTS idx_body_regions_slug         ON public.body_regions(slug);
CREATE INDEX IF NOT EXISTS idx_body_regions_parent       ON public.body_regions(parent_id)
  WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_body_regions_order        ON public.body_regions(display_order);

-- Seed 22 canonical body regions
INSERT INTO public.body_regions
  (slug, name_th, name_en, display_order)
VALUES
  ('head',         'ศีรษะ',            'Head',           1),
  ('face',         'ใบหน้า',           'Face',           2),
  ('neck',         'คอ',               'Neck',           3),
  ('chest',        'หน้าอก',           'Chest',          4),
  ('upper-back',   'หลังส่วนบน',       'Upper Back',     5),
  ('abdomen',      'ท้อง',             'Abdomen',        6),
  ('lower-back',   'หลังส่วนล่าง',     'Lower Back',     7),
  ('shoulder',     'ไหล่',             'Shoulder',       8),
  ('upper-arm',    'ต้นแขน',           'Upper Arm',      9),
  ('elbow',        'ข้อศอก',           'Elbow',          10),
  ('forearm',      'แขนท่อนล่าง',      'Forearm',        11),
  ('wrist',        'ข้อมือ',           'Wrist',          12),
  ('hand',         'มือ',              'Hand',           13),
  ('pelvis',       'อุ้งเชิงกราน',     'Pelvis',         14),
  ('hip',          'สะโพก',            'Hip',            15),
  ('thigh',        'ต้นขา',            'Thigh',          16),
  ('knee',         'เข่า',             'Knee',           17),
  ('lower-leg',    'แข้ง/น่อง',        'Lower Leg',      18),
  ('ankle',        'ข้อเท้า',          'Ankle',          19),
  ('foot',         'เท้า',             'Foot',           20),
  ('skin-general', 'ผิวหนังทั่วไป',    'Skin (General)', 21),
  ('general',      'ทั่วร่างกาย',      'General',        22)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- JUNCTION: region_symptoms
-- ============================================================

CREATE TABLE IF NOT EXISTS public.region_symptoms (
  region_id  uuid NOT NULL REFERENCES public.body_regions(id) ON DELETE CASCADE,
  symptom_id uuid NOT NULL REFERENCES public.symptoms(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  PRIMARY KEY (region_id, symptom_id)
);

ALTER TABLE public.region_symptoms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_region_symptoms" ON public.region_symptoms;
CREATE POLICY "public_read_region_symptoms"
  ON public.region_symptoms FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_region_symptoms_region  ON public.region_symptoms(region_id);
CREATE INDEX IF NOT EXISTS idx_region_symptoms_symptom ON public.region_symptoms(symptom_id);

-- ============================================================
-- JUNCTION: region_conditions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.region_conditions (
  region_id    uuid NOT NULL REFERENCES public.body_regions(id) ON DELETE CASCADE,
  condition_id uuid NOT NULL REFERENCES public.conditions(id) ON DELETE CASCADE,
  is_primary   boolean DEFAULT false,
  PRIMARY KEY (region_id, condition_id)
);

ALTER TABLE public.region_conditions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_region_conditions" ON public.region_conditions;
CREATE POLICY "public_read_region_conditions"
  ON public.region_conditions FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_region_conditions_region    ON public.region_conditions(region_id);
CREATE INDEX IF NOT EXISTS idx_region_conditions_condition ON public.region_conditions(condition_id);

-- ============================================================
-- JUNCTION: pathway_regions  (FK-based, distinct from pathway_body_regions)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pathway_regions (
  pathway_id uuid NOT NULL REFERENCES public.clinical_pathways(id) ON DELETE CASCADE,
  region_id  uuid NOT NULL REFERENCES public.body_regions(id) ON DELETE CASCADE,
  PRIMARY KEY (pathway_id, region_id)
);

ALTER TABLE public.pathway_regions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_pathway_regions" ON public.pathway_regions;
CREATE POLICY "public_read_pathway_regions"
  ON public.pathway_regions FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_pathway_regions_pathway ON public.pathway_regions(pathway_id);
CREATE INDEX IF NOT EXISTS idx_pathway_regions_region  ON public.pathway_regions(region_id);

-- ============================================================
-- JUNCTION: condition_symptoms
-- ============================================================

CREATE TABLE IF NOT EXISTS public.condition_symptoms (
  condition_id uuid NOT NULL REFERENCES public.conditions(id) ON DELETE CASCADE,
  symptom_id   uuid NOT NULL REFERENCES public.symptoms(id) ON DELETE CASCADE,
  is_primary   boolean DEFAULT false,
  frequency    text CHECK (frequency IN ('very_common','common','uncommon','rare')),
  PRIMARY KEY (condition_id, symptom_id)
);

ALTER TABLE public.condition_symptoms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_condition_symptoms" ON public.condition_symptoms;
CREATE POLICY "public_read_condition_symptoms"
  ON public.condition_symptoms FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_condition_symptoms_condition ON public.condition_symptoms(condition_id);
CREATE INDEX IF NOT EXISTS idx_condition_symptoms_symptom   ON public.condition_symptoms(symptom_id);

-- ============================================================
-- SUPPORTING: medical_references
-- ============================================================

CREATE TABLE IF NOT EXISTS public.medical_references (
  id               uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_type      text NOT NULL
    CHECK (source_type IN ('guideline','systematic_review','rct','cohort','case_series','expert_opinion','textbook')),
  title            text NOT NULL,
  authors          text,
  journal          text,
  publication_year integer,
  url              text,
  doi              text,
  pmid             text,
  evidence_level   text
    CHECK (evidence_level IN ('high','moderate','low','expert_opinion')),
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE public.medical_references ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_medical_references" ON public.medical_references;
CREATE POLICY "public_read_medical_references"
  ON public.medical_references FOR SELECT USING (true);
DROP POLICY IF EXISTS "service_manage_medical_references" ON public.medical_references;
CREATE POLICY "service_manage_medical_references"
  ON public.medical_references
  USING (auth.role() IN ('service_role', 'authenticated'));

CREATE INDEX IF NOT EXISTS idx_medical_refs_doi  ON public.medical_references(doi) WHERE doi IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_medical_refs_pmid ON public.medical_references(pmid) WHERE pmid IS NOT NULL;

-- ============================================================
-- SUPPORTING: entity_references (polymorphic link table)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.entity_references (
  reference_id uuid NOT NULL REFERENCES public.medical_references(id) ON DELETE CASCADE,
  entity_type  text NOT NULL,
  entity_id    uuid NOT NULL,
  PRIMARY KEY (reference_id, entity_type, entity_id)
);

ALTER TABLE public.entity_references ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_entity_references" ON public.entity_references;
CREATE POLICY "public_read_entity_references"
  ON public.entity_references FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_entity_refs_entity ON public.entity_references(entity_type, entity_id);

-- ============================================================
-- SUPPORTING: admin_audit_log
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id   uuid NOT NULL,
  action      text NOT NULL
    CHECK (action IN ('create','update','delete','status_change','publish','archive')),
  changed_by  text,
  changed_at  timestamptz DEFAULT now(),
  diff        jsonb
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_manage_audit_log" ON public.admin_audit_log;
CREATE POLICY "service_manage_audit_log"
  ON public.admin_audit_log
  USING (auth.role() IN ('service_role', 'authenticated'));

CREATE INDEX IF NOT EXISTS idx_admin_audit_entity     ON public.admin_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_changed_at ON public.admin_audit_log(changed_at DESC);

-- ============================================================
-- SUPPORTING: ai_usage
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_usage (
  id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     text NOT NULL,
  action_type text NOT NULL,
  tokens_used integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_manage_ai_usage" ON public.ai_usage;
CREATE POLICY "service_manage_ai_usage"
  ON public.ai_usage
  USING (auth.role() IN ('service_role', 'authenticated'));

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date ON public.ai_usage(user_id, created_at DESC);

-- ============================================================
-- HELPER FUNCTION: get_ai_usage_today
-- ============================================================

CREATE OR REPLACE FUNCTION get_ai_usage_today(p_user_id text)
RETURNS integer AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM public.ai_usage
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE::timestamptz
    AND created_at <  (CURRENT_DATE + INTERVAL '1 day')::timestamptz;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
