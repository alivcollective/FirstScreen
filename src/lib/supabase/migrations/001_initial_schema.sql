-- ============================================================
-- Health Compass — Initial Schema Migration
-- Version: 001
-- Run in: Supabase Dashboard > SQL Editor
-- Project: Health Compass Thailand
-- SAFETY: All tables store educational health data only.
--         assessment_results is anonymous (no user_id).
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────

create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";      -- Thai-friendly text search
create extension if not exists "pg_trgm";       -- trigram similarity

-- ── ENUM types ───────────────────────────────────────────────

do $$ begin
  create type disease_category as enum (
    'cancer', 'heart', 'diabetes', 'mental',
    'respiratory', 'infectious', 'general'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type risk_level as enum ('low', 'moderate', 'high', 'very_high');
exception when duplicate_object then null; end $$;

do $$ begin
  create type symptom_severity as enum ('mild', 'moderate', 'severe', 'critical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type urgency_level as enum ('emergency', 'urgent', 'appointment', 'selfcare');
exception when duplicate_object then null; end $$;

do $$ begin
  create type hospital_type as enum ('public', 'private', 'clinic');
exception when duplicate_object then null; end $$;

do $$ begin
  create type assessment_type as enum (
    'diabetes', 'cardiovascular', 'mental_health', 'cancer', 'symptom_check'
  );
exception when duplicate_object then null; end $$;

-- ════════════════════════════════════════════════════════════
-- TABLE 1: diseases
-- ════════════════════════════════════════════════════════════

create table if not exists diseases (
  id               uuid primary key default uuid_generate_v4(),
  slug             text not null unique,
  name_th          text not null,
  name_en          text not null,
  name_th_short    text not null,
  category         disease_category not null,
  category_th      text not null,
  icd10            text not null,
  risk_level       risk_level not null default 'moderate',
  short_description_th text not null,

  -- Full rich content as JSONB (maps to RichDisease TypeScript type)
  content          jsonb not null default '{}',

  -- Key stats in a queryable JSONB column
  stats            jsonb not null default '{}',

  last_reviewed    text not null,      -- 'YYYY-MM'
  reviewed_by      text not null default 'รอการรับรอง',
  published        boolean not null default false,

  -- Full-text search vector (auto-updated by trigger)
  search_vector    tsvector,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Full-text search trigger
create or replace function diseases_update_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.name_th, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.name_en, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.icd10, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.short_description_th, '')), 'C');
  return new;
end $$;

drop trigger if exists diseases_search_vector_update on diseases;
create trigger diseases_search_vector_update
  before insert or update on diseases
  for each row execute function diseases_update_search_vector();

-- updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger diseases_updated_at
  before update on diseases
  for each row execute function update_updated_at();

-- ════════════════════════════════════════════════════════════
-- TABLE 2: symptoms
-- ════════════════════════════════════════════════════════════

create table if not exists symptoms (
  id              text primary key,   -- e.g. 'chest_pain', 'headache'
  name_th         text not null,
  name_en         text not null,
  body_region     text not null,      -- 'head', 'chest', etc.
  severity_level  symptom_severity not null default 'moderate',
  description_th  text not null default '',
  frequency_note  text,
  keywords        text[] not null default '{}',
  created_at      timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════
-- TABLE 3: symptom_conditions
--   Maps symptom combinations → possible condition groups.
--   SAFETY: descriptionTh must never imply diagnosis.
-- ════════════════════════════════════════════════════════════

create table if not exists symptom_conditions (
  id                  uuid primary key default uuid_generate_v4(),
  symptom_ids         text[] not null,   -- symptom IDs that trigger this group
  condition_name_th   text not null,
  condition_name_en   text not null,
  description_th      text not null,     -- must use "อาจเกี่ยวข้องกับ" language
  urgency_level       urgency_level not null default 'appointment',
  specialty_th        text not null,
  specialty_en        text not null default '',
  disease_slug        text references diseases(slug) on delete set null,
  suggested_tests_th  text[] not null default '{}',
  red_flags_th        text[] not null default '{}',
  weights             jsonb not null default '{}',  -- symptom_id → score weight
  min_score           integer not null default 3,
  is_emergency        boolean not null default false,
  created_at          timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════
-- TABLE 4: hospitals
-- ════════════════════════════════════════════════════════════

create table if not exists hospitals (
  id                 uuid primary key default uuid_generate_v4(),
  name_th            text not null,
  name_en            text not null,
  province           text not null,
  district           text,
  address            text,
  lat                double precision,
  lng                double precision,
  specialties        text[] not null default '{}',
  phone              text,
  website            text,
  email              text,
  accreditations     text[] not null default '{}',
  insurance_accepted text[] not null default '{}',
  languages_spoken   text[] not null default '{}',
  type               hospital_type not null default 'private',
  rating             numeric(3,2),
  rating_count       integer not null default 0,
  is_verified        boolean not null default false,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger hospitals_updated_at
  before update on hospitals
  for each row execute function update_updated_at();

-- ════════════════════════════════════════════════════════════
-- TABLE 5: assessment_results
--   Fully anonymous. No user_id. Used for population analytics.
-- ════════════════════════════════════════════════════════════

create table if not exists assessment_results (
  id               uuid primary key default uuid_generate_v4(),
  session_id       uuid not null,         -- browser-generated, NOT linked to any user
  assessment_type  assessment_type not null,
  input_data       jsonb not null,         -- anonymized inputs (no dob, no name)
  result_data      jsonb not null,         -- risk scores, action plan
  locale           text not null default 'th',
  user_age_band    text,                   -- '25-34', '35-44', etc. — never exact
  user_sex         text,                   -- 'male' | 'female' | 'other' | null
  created_at       timestamptz not null default now()
  -- NO user_id column intentionally — privacy by design
);

comment on table assessment_results is
  'Anonymous assessment results for population health analytics. '
  'No PII stored. session_id is browser-generated and cannot be linked to a user.';

-- ════════════════════════════════════════════════════════════
-- TABLE 6: risk_assessments
--   Metadata + question schemas for each assessment tool.
-- ════════════════════════════════════════════════════════════

create table if not exists risk_assessments (
  id               uuid primary key default uuid_generate_v4(),
  type             text not null unique,     -- 'diabetes', 'cardiovascular', etc.
  version          text not null default '1.0',
  name_th          text not null,
  description_th   text not null default '',
  schema           jsonb not null default '{}',  -- question definitions
  source_citation  text not null default '',
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════
-- INDEXES
-- ════════════════════════════════════════════════════════════

-- Diseases
create index if not exists idx_diseases_slug       on diseases(slug);
create index if not exists idx_diseases_category   on diseases(category);
create index if not exists idx_diseases_published  on diseases(published);
create index if not exists idx_diseases_search     on diseases using gin(search_vector);
create index if not exists idx_diseases_trgm       on diseases using gin(name_th gin_trgm_ops);

-- Symptoms
create index if not exists idx_symptoms_region     on symptoms(body_region);
create index if not exists idx_symptoms_severity   on symptoms(severity_level);
create index if not exists idx_symptoms_ids        on symptom_conditions using gin(symptom_ids);

-- Hospitals
create index if not exists idx_hospitals_province  on hospitals(province);
create index if not exists idx_hospitals_active    on hospitals(is_active);
create index if not exists idx_hospitals_type      on hospitals(type);

-- Assessment results (analytics queries)
create index if not exists idx_results_type        on assessment_results(assessment_type);
create index if not exists idx_results_created     on assessment_results(created_at desc);
create index if not exists idx_results_session     on assessment_results(session_id);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table diseases          enable row level security;
alter table symptoms          enable row level security;
alter table symptom_conditions enable row level security;
alter table hospitals         enable row level security;
alter table assessment_results enable row level security;
alter table risk_assessments  enable row level security;

-- ── diseases: public read of published rows ──────────────────
create policy "diseases_public_read"
  on diseases for select
  using (published = true);

-- ── symptoms: public read ────────────────────────────────────
create policy "symptoms_public_read"
  on symptoms for select
  using (true);

-- ── symptom_conditions: public read ─────────────────────────
create policy "symptom_conditions_public_read"
  on symptom_conditions for select
  using (true);

-- ── hospitals: public read of active hospitals ───────────────
create policy "hospitals_public_read"
  on hospitals for select
  using (is_active = true);

-- ── assessment_results: insert-only from anon clients ────────
--    No SELECT policy = nobody can read back results (privacy)
--    Only the service role (admin) can read for analytics.
create policy "assessment_results_anon_insert"
  on assessment_results for insert
  to anon
  with check (true);

-- ── risk_assessments: public read of active ──────────────────
create policy "risk_assessments_public_read"
  on risk_assessments for select
  using (active = true);

-- ════════════════════════════════════════════════════════════
-- STORED FUNCTIONS
-- ════════════════════════════════════════════════════════════

-- Full-text search for diseases (supports Thai + English)
create or replace function search_diseases(
  query text,
  category text default null
)
returns setof diseases language sql stable as $$
  select * from diseases
  where
    published = true
    and (category is null or diseases.category::text = category)
    and (
      search_vector @@ plainto_tsquery('simple', unaccent(query))
      or name_th ilike '%' || query || '%'
      or name_en ilike '%' || query || '%'
      or icd10 ilike '%' || query || '%'
    )
  order by
    ts_rank(search_vector, plainto_tsquery('simple', unaccent(query))) desc,
    name_th;
$$;

-- Nearby hospitals (requires lat/lng)
create or replace function nearby_hospitals(
  user_lat double precision,
  user_lng double precision,
  radius_km double precision default 50
)
returns table (
  id uuid, name_th text, name_en text, province text,
  lat double precision, lng double precision,
  specialties text[], phone text, type hospital_type,
  is_verified boolean, distance_km double precision
) language sql stable as $$
  select
    id, name_th, name_en, province, lat, lng,
    specialties, phone, type, is_verified,
    round(
      (6371 * acos(
        cos(radians(user_lat)) * cos(radians(lat)) *
        cos(radians(lng) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(lat))
      ))::numeric, 2
    ) as distance_km
  from hospitals
  where
    is_active = true
    and lat is not null
    and lng is not null
    and (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(lat)) *
        cos(radians(lng) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(lat))
      )
    ) <= radius_km
  order by distance_km;
$$;

-- ════════════════════════════════════════════════════════════
-- SEED DATA — 3 initial diseases
-- ════════════════════════════════════════════════════════════

insert into diseases (
  slug, name_th, name_en, name_th_short,
  category, category_th, icd10, risk_level,
  short_description_th, stats, published, last_reviewed, reviewed_by
) values
(
  'breast-cancer',
  'มะเร็งเต้านม (Breast Cancer)',
  'Breast Cancer',
  'มะเร็งเต้านม',
  'cancer', 'มะเร็งวิทยา', 'C50', 'high',
  'มะเร็งที่พบบ่อยที่สุดในผู้หญิงไทย ตรวจพบตั้งแต่เนิ่นๆ อัตราการรอดชีวิต 5 ปีสูงถึง 98%',
  '{"prevalenceThailand": "~26,000 ราย/ปี", "primaryRiskGroupTh": "ผู้หญิงอายุ 40 ปีขึ้นไป", "survivalRate": "ระยะที่ 1: ~98%"}',
  false, '2026-06', 'รอการรับรองจากศัลยแพทย์มะเร็ง'
),
(
  'type-2-diabetes',
  'เบาหวานชนิดที่ 2 (Type 2 Diabetes)',
  'Type 2 Diabetes Mellitus',
  'เบาหวานชนิดที่ 2',
  'diabetes', 'ต่อมไร้ท่อและเมตาบอลิซึม', 'E11', 'high',
  'โรคเรื้อรังจากน้ำตาลในเลือดสูง ป้องกันและควบคุมได้ด้วยการเปลี่ยนวิถีชีวิต',
  '{"prevalenceThailand": "~7.4 ล้านคน (11%)", "primaryRiskGroupTh": "ผู้ใหญ่อายุ 35 ปีขึ้นไป น้ำหนักเกิน"}',
  false, '2026-06', 'รอการรับรองจากอายุรแพทย์ต่อมไร้ท่อ'
),
(
  'hypertension',
  'ความดันโลหิตสูง (Hypertension)',
  'Hypertension',
  'ความดันโลหิตสูง',
  'heart', 'หัวใจและหลอดเลือด', 'I10', 'high',
  '"ฆาตกรเงียบ" ที่มักไม่มีอาการ แต่เพิ่มความเสี่ยงโรคหัวใจและหลอดเลือดสมองอย่างมีนัยสำคัญ',
  '{"prevalenceThailand": "~13 ล้านคน (24%)", "primaryRiskGroupTh": "ผู้ใหญ่อายุ 40 ปีขึ้นไป"}',
  false, '2026-06', 'รอการรับรองจากอายุรแพทย์โรคหัวใจ'
)
on conflict (slug) do nothing;

-- Seed risk_assessments metadata
insert into risk_assessments (type, version, name_th, description_th, source_citation) values
(
  'diabetes', '2.0',
  'ประเมินความเสี่ยงเบาหวาน (FINDRISC)',
  'FINDRISC ปรับสำหรับประชากรเอเชีย ประเมินความเสี่ยงเบาหวานชนิดที่ 2',
  'Lindström J, Tuomilehto J. Diabetes Care. 2003 — adapted WHO Asia-Pacific BMI thresholds'
),
(
  'cardiovascular', '2.0',
  'ประเมินความเสี่ยงหัวใจและหลอดเลือด (Framingham)',
  'Framingham Heart Study 10-Year CVD Risk Score',
  'D''Agostino et al, Circulation 2008'
),
(
  'mental_health', '1.0',
  'ตรวจสุขภาพจิต (PHQ-9 + GAD-7)',
  'PHQ-9 สำหรับซึมเศร้า + GAD-7 สำหรับวิตกกังวล',
  'Kroenke K et al, J Gen Intern Med 2001 / Spitzer RL et al, Arch Intern Med 2006'
),
(
  'cancer', '1.0',
  'ประเมินความเสี่ยงมะเร็ง (Multi-Cancer)',
  'คัดกรองความเสี่ยงมะเร็ง 4 ชนิด: เต้านม ปากมดลูก ลำไส้ใหญ่ ตับ',
  'NCCN Cancer Screening Guidelines / WHO / กรมการแพทย์ สธ.'
)
on conflict (type) do nothing;

-- ════════════════════════════════════════════════════════════
-- NOTES FOR DEPLOYMENT
-- ════════════════════════════════════════════════════════════
--
-- 1. Run this entire file in Supabase Dashboard > SQL Editor
-- 2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel
-- 3. Set NEXT_PUBLIC_USE_SUPABASE=true to switch from static to Supabase mode
-- 4. Upload disease content to 'content' JSONB column (or use admin panel)
-- 5. Set published=true for each disease after medical review is complete
--
-- MEDICAL SAFETY CHECKLIST before publishing diseases:
-- □ Content reviewed by licensed physician
-- □ No diagnostic language ("คุณเป็น..." / "you have...")
-- □ All citations verified
-- □ Medical disclaimer displayed on all disease pages
-- □ Emergency number 1669 visible on symptom/urgent pages
-- ════════════════════════════════════════════════════════════
