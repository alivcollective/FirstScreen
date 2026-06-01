-- Health Compass — Initial Schema Migration
-- v1.0.0 — Thailand Launch

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";
create extension if not exists "pg_trgm";

-- ============================================================
-- DOMAIN 1: IDENTITY & PRIVACY
-- ============================================================

create table users (
  id uuid primary key default gen_random_uuid(),
  email_hash text unique,
  phone_hash text unique,
  created_at timestamptz default now(),
  last_active_at timestamptz,
  account_status text default 'active' check (account_status in ('active', 'suspended', 'deleted')),
  deletion_requested_at timestamptz,
  country_code char(2) not null default 'TH',
  preferred_language char(5) default 'th',
  timezone text default 'Asia/Bangkok'
);

create table user_pii (
  user_id uuid primary key references users(id) on delete cascade,
  encrypted_email bytea,
  encrypted_phone bytea,
  encrypted_name bytea,
  encryption_key_id text,
  updated_at timestamptz default now()
);

create table consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  consent_type text not null check (consent_type in ('analytics', 'marketing', 'research', 'ai_training', 'data_sharing')),
  granted boolean not null,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  consent_version text not null,
  ip_address_hash text,
  user_agent_hash text
);

create table health_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete cascade,
  birth_year smallint,
  biological_sex text check (biological_sex in ('male', 'female', 'intersex', 'prefer_not_to_say')),
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  country_code char(2),
  province text,
  ethnicity text[],
  is_smoker boolean default false,
  smoking_pack_years numeric(5,1),
  alcohol_units_per_week smallint default 0,
  exercise_days_per_week smallint default 0 check (exercise_days_per_week between 0 and 7),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- DOMAIN 2: MEDICAL REVIEWERS
-- ============================================================

create table medical_reviewers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  credentials text[],
  specialties text[],
  institution text,
  country_code char(2),
  is_active boolean default true
);

-- ============================================================
-- DOMAIN 3: DISEASE INTELLIGENCE
-- ============================================================

create table conditions (
  id uuid primary key default gen_random_uuid(),
  icd10_code text,
  icd11_code text,
  snomed_code text,
  slug text unique not null,
  category text,
  subcategory text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_conditions_icd10 on conditions(icd10_code);
create index idx_conditions_slug on conditions(slug);

create table condition_translations (
  id uuid primary key default gen_random_uuid(),
  condition_id uuid references conditions(id) on delete cascade,
  language_code char(5) not null,
  name text not null,
  short_description text,
  full_description text,
  symptoms_text text,
  risk_factors_text text,
  prevention_text text,
  treatment_overview text,
  when_to_see_doctor text,
  key_fact text,
  search_vector tsvector,
  unique(condition_id, language_code)
);

create index idx_condition_translations_search on condition_translations using gin(search_vector);
create index idx_condition_translations_trgm on condition_translations using gin(name gin_trgm_ops);

-- Trigger to update search vector
create or replace function update_condition_search_vector()
returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.short_description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.symptoms_text, '')), 'C');
  return new;
end;
$$ language plpgsql;

create trigger condition_translation_search_update
  before insert or update on condition_translations
  for each row execute function update_condition_search_vector();

create table condition_evidence (
  id uuid primary key default gen_random_uuid(),
  condition_id uuid references conditions(id) on delete cascade,
  claim_type text,
  evidence_grade text check (evidence_grade in ('A', 'B', 'C', 'D')),
  source_type text,
  source_name text,
  source_url text,
  doi text,
  publication_year smallint,
  last_reviewed_at date
);

create table content_reviews (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  reviewer_id uuid references medical_reviewers(id),
  review_status text check (review_status in ('pending', 'approved', 'rejected', 'needs_revision')),
  reviewed_at timestamptz,
  next_review_date date,
  review_notes text,
  version_reviewed text
);

create table family_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  condition_id uuid references conditions(id),
  relationship text check (relationship in ('parent', 'sibling', 'grandparent', 'aunt_uncle')),
  age_of_onset smallint,
  created_at timestamptz default now()
);

-- ============================================================
-- DOMAIN 4: SYMPTOMS
-- ============================================================

create table symptoms (
  id uuid primary key default gen_random_uuid(),
  snomed_code text,
  slug text unique not null,
  body_system text,
  urgency_level text check (urgency_level in ('routine', 'soon', 'urgent', 'emergency')),
  created_at timestamptz default now()
);

create table symptom_translations (
  id uuid primary key default gen_random_uuid(),
  symptom_id uuid references symptoms(id) on delete cascade,
  language_code char(5) not null,
  name text not null,
  description text,
  unique(symptom_id, language_code)
);

create table symptom_conditions (
  symptom_id uuid references symptoms(id),
  condition_id uuid references conditions(id),
  frequency text check (frequency in ('very_common', 'common', 'uncommon', 'rare')),
  specificity numeric(4,3),
  sensitivity numeric(4,3),
  primary key (symptom_id, condition_id)
);

create table symptom_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  session_token text,
  symptoms_reported jsonb,
  navigation_output jsonb,
  care_recommendation text,
  urgency_level text,
  country_code char(2),
  created_at timestamptz default now()
);

-- ============================================================
-- DOMAIN 5: SCREENING
-- ============================================================

create table screening_tests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  condition_id uuid references conditions(id),
  test_type text check (test_type in ('blood_test', 'imaging', 'physical_exam', 'questionnaire', 'biopsy', 'endoscopy')),
  sensitivity numeric(4,3),
  specificity numeric(4,3),
  created_at timestamptz default now()
);

create table screening_test_translations (
  screening_test_id uuid references screening_tests(id) on delete cascade,
  language_code char(5),
  name text not null,
  description text,
  preparation_instructions text,
  what_to_expect text,
  primary key (screening_test_id, language_code)
);

create table screening_guidelines (
  id uuid primary key default gen_random_uuid(),
  screening_test_id uuid references screening_tests(id),
  country_code char(2) not null,
  issuing_organization text not null,
  guideline_name text,
  guideline_url text,
  guideline_version text,
  published_date date,
  min_age smallint,
  max_age smallint,
  biological_sex text check (biological_sex in ('all', 'male', 'female')),
  frequency_months smallint,
  additional_criteria jsonb,
  is_universal boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_screening_guidelines_country on screening_guidelines(country_code, biological_sex, min_age, max_age);

create table screening_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  screening_test_id uuid references screening_tests(id),
  guideline_id uuid references screening_guidelines(id),
  recommended_date date,
  completed_date date,
  reminder_enabled boolean default true,
  reminder_days_before integer default 30,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- DOMAIN 6: RISK ASSESSMENT
-- ============================================================

create table risk_calculators (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text check (category in ('cardiovascular', 'diabetes', 'cancer', 'mental_health', 'lifestyle', 'renal', 'respiratory')),
  validated_populations text[],
  source_publication text,
  doi text,
  version text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table risk_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  calculator_id uuid references risk_calculators(id),
  inputs jsonb not null,
  raw_score numeric(8,4),
  risk_category text check (risk_category in ('low', 'moderate', 'high', 'very_high')),
  risk_percentage numeric(5,2),
  risk_label text,
  action_plan jsonb,
  created_at timestamptz default now()
);

create index idx_risk_assessments_user on risk_assessments(user_id, created_at desc);

-- ============================================================
-- DOMAIN 7: HEALTHCARE PROVIDERS
-- ============================================================

create table provider_organizations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  organization_type text check (organization_type in ('hospital', 'clinic', 'specialist_center', 'screening_center', 'pharmacy')),
  country_code char(2) not null,
  province text,
  city text,
  address jsonb,
  lat numeric(9,6),
  lng numeric(9,6),
  phone text,
  website text,
  email text,
  accreditations text[],
  accreditation_details jsonb,
  languages_spoken char(5)[],
  insurance_accepted text[],
  operating_hours jsonb,
  rating_average numeric(3,2),
  rating_count integer default 0,
  is_verified boolean default false,
  verified_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_providers_country on provider_organizations(country_code, is_active);

create table provider_translations (
  provider_id uuid references provider_organizations(id) on delete cascade,
  language_code char(5),
  name text not null,
  description text,
  specialties_text text,
  primary key (provider_id, language_code)
);

create table provider_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references provider_organizations(id),
  service_type text,
  screening_test_id uuid references screening_tests(id),
  price_thb numeric(10,2),
  price_usd numeric(10,2),
  duration_minutes smallint,
  appointment_required boolean default true,
  booking_url text,
  is_active boolean default true
);

-- ============================================================
-- DOMAIN 8: CONTENT & ACADEMY
-- ============================================================

create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  article_type text check (article_type in ('disease_guide', 'prevention_tip', 'screening_guide', 'lifestyle', 'news')),
  condition_id uuid references conditions(id),
  author_id uuid references medical_reviewers(id),
  published_at timestamptz,
  is_published boolean default false,
  reading_time_minutes smallint,
  feature_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table article_translations (
  article_id uuid references articles(id) on delete cascade,
  language_code char(5),
  title text not null,
  subtitle text,
  content jsonb,
  meta_description text,
  search_vector tsvector,
  primary key (article_id, language_code)
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  estimated_minutes smallint,
  certificate_available boolean default false,
  thumbnail_url text,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table course_translations (
  course_id uuid references courses(id) on delete cascade,
  language_code char(5),
  title text not null,
  description text,
  primary key (course_id, language_code)
);

create table course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  sequence_number smallint not null,
  module_type text check (module_type in ('video', 'text', 'quiz', 'infographic')),
  video_url text,
  content jsonb,
  duration_minutes smallint,
  created_at timestamptz default now()
);

create table user_course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id),
  modules_completed integer default 0,
  total_modules integer,
  is_completed boolean default false,
  completed_at timestamptz,
  certificate_url text,
  last_activity_at timestamptz,
  unique(user_id, course_id)
);

-- ============================================================
-- DOMAIN 9: ANALYTICS & AUDIT
-- ============================================================

create table population_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  country_code char(2),
  region text,
  age_band text,
  biological_sex text,
  condition_slug text,
  risk_category text,
  action_taken boolean,
  created_at timestamptz default now()
);

create index idx_population_events_analytics on population_events(country_code, event_type, created_at);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  resource_type text,
  resource_id uuid,
  ip_address_hash text,
  user_agent_hash text,
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_audit_log_user on audit_log(user_id, created_at desc);

-- Vector embeddings for semantic search
create table content_embeddings (
  id uuid primary key default gen_random_uuid(),
  content_type text check (content_type in ('condition', 'article', 'symptom', 'course')),
  content_id uuid not null,
  language_code char(5),
  embedding vector(1536),
  created_at timestamptz default now()
);

create index idx_content_embeddings on content_embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ============================================================
-- SEED DATA: Risk Calculators
-- ============================================================

insert into risk_calculators (slug, name, category, validated_populations, source_publication, version, is_active)
values
  ('findrisc-asian-adapted', 'FINDRISC Diabetes Risk Score (Asian Adapted)', 'diabetes',
   array['thai', 'asian', 'southeast_asian'],
   'Lindström & Tuomilehto, Diabetes Care 2003 — adapted WHO Asia-Pacific BMI thresholds', '2.0', true),
  ('framingham-cvd-10year', 'Framingham 10-Year Cardiovascular Risk Score', 'cardiovascular',
   array['thai', 'asian', 'general'],
   'D\'Agostino et al, Circulation 2008', '2.0', true),
  ('phq-9', 'Patient Health Questionnaire-9 (Depression)', 'mental_health',
   array['general', 'thai'],
   'Kroenke K et al, J Gen Intern Med 2001', '1.0', true),
  ('gad-7', 'Generalized Anxiety Disorder 7-item scale', 'mental_health',
   array['general', 'thai'],
   'Spitzer et al, Arch Intern Med 2006', '1.0', true);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table health_profiles enable row level security;
alter table risk_assessments enable row level security;
alter table screening_plans enable row level security;
alter table user_course_progress enable row level security;
alter table family_history enable row level security;
alter table consent_records enable row level security;
alter table symptom_sessions enable row level security;

-- Users see only their own data
create policy "users_own_health_profile" on health_profiles
  for all using (auth.uid()::uuid = user_id);

create policy "users_own_risk_assessments" on risk_assessments
  for all using (auth.uid()::uuid = user_id);

create policy "users_own_screening_plans" on screening_plans
  for all using (auth.uid()::uuid = user_id);

create policy "users_own_course_progress" on user_course_progress
  for all using (auth.uid()::uuid = user_id);

create policy "users_own_family_history" on family_history
  for all using (auth.uid()::uuid = user_id);

create policy "users_own_consents" on consent_records
  for all using (auth.uid()::uuid = user_id);

-- Public read access for content
alter table conditions enable row level security;
create policy "public_read_conditions" on conditions for select using (true);

alter table condition_translations enable row level security;
create policy "public_read_condition_translations" on condition_translations for select using (true);

alter table screening_guidelines enable row level security;
create policy "public_read_screening_guidelines" on screening_guidelines for select using (true);

alter table provider_organizations enable row level security;
create policy "public_read_providers" on provider_organizations for select using (is_active = true);

alter table articles enable row level security;
create policy "public_read_published_articles" on articles for select using (is_published = true);

alter table courses enable row level security;
create policy "public_read_published_courses" on courses for select using (is_published = true);
