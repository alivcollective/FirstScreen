# Database Architecture
# Health Compass — Global Schema Design

## Design Principles

1. **Multi-tenancy ready** — Every table scoped to country/region
2. **Privacy by design** — PII isolated; pseudonymization at schema level
3. **Event sourcing** — Audit trail for all clinical interactions
4. **GDPR/PDPA compliant** — Data residency, retention, deletion support
5. **Globally scalable** — Supabase multi-region with read replicas
6. **Medical-grade versioning** — All clinical content versioned

---

## Schema Domains

### Domain 1: Identity & Privacy
```sql
-- Core user identity (minimal PII)
create table users (
  id uuid primary key default gen_random_uuid(),
  email_hash text unique, -- hashed, not stored raw
  phone_hash text unique,
  created_at timestamptz default now(),
  last_active_at timestamptz,
  account_status text default 'active', -- active, suspended, deleted
  deletion_requested_at timestamptz,
  country_code char(2) not null default 'TH',
  preferred_language char(5) default 'th',
  timezone text default 'Asia/Bangkok'
);

-- Separate PII vault (encrypted, different access controls)
create table user_pii (
  user_id uuid primary key references users(id) on delete cascade,
  encrypted_email bytea,
  encrypted_phone bytea,
  encrypted_name bytea,
  encryption_key_id text, -- references KMS key
  updated_at timestamptz default now()
);

-- Consent management (PDPA/GDPR)
create table consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  consent_type text not null, -- analytics, marketing, research, ai_training, data_sharing
  granted boolean not null,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  consent_version text not null, -- version of privacy policy
  ip_address_hash text,
  user_agent_hash text
);

-- Health profile (de-identified demographic data)
create table health_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete cascade,
  birth_year smallint, -- year only, not full DOB
  biological_sex text, -- male, female, intersex
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  country_code char(2),
  province text,
  ethnicity text[], -- array for multi-ethnicity
  is_smoker boolean,
  smoking_pack_years numeric(5,1),
  alcohol_units_per_week smallint,
  exercise_days_per_week smallint,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Family history
create table family_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  condition_id uuid references conditions(id),
  relationship text, -- parent, sibling, grandparent
  age_of_onset smallint,
  created_at timestamptz default now()
);
```

### Domain 2: Disease Intelligence
```sql
-- Conditions (10,000+ entries)
create table conditions (
  id uuid primary key default gen_random_uuid(),
  icd10_code text,
  icd11_code text,
  snomed_code text,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Condition translations (multi-language)
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
  -- Full-text search
  search_vector tsvector generated always as (
    setweight(to_tsvector(language_code::regconfig, name), 'A') ||
    setweight(to_tsvector(language_code::regconfig, coalesce(short_description,'')), 'B') ||
    setweight(to_tsvector(language_code::regconfig, coalesce(symptoms_text,'')), 'C')
  ) stored,
  unique(condition_id, language_code)
);

-- Evidence grading for condition content
create table condition_evidence (
  id uuid primary key default gen_random_uuid(),
  condition_id uuid references conditions(id) on delete cascade,
  claim_type text, -- prevention, screening, risk_factor, treatment
  evidence_grade text, -- A, B, C, D (GRADE methodology)
  source_type text, -- systematic_review, rct, guideline, expert_opinion
  source_name text,
  source_url text,
  doi text,
  publication_year smallint,
  last_reviewed_at date
);

-- Medical review log
create table content_reviews (
  id uuid primary key default gen_random_uuid(),
  content_type text not null, -- condition, article, course, screening_guideline
  content_id uuid not null,
  reviewer_id uuid references medical_reviewers(id),
  review_status text, -- pending, approved, rejected, needs_revision
  reviewed_at timestamptz,
  next_review_date date,
  review_notes text,
  version_reviewed text
);

-- Medical reviewers registry
create table medical_reviewers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  credentials text[], -- MD, PhD, FACC, etc.
  specialties text[],
  institution text,
  country_code char(2),
  is_active boolean default true
);
```

### Domain 3: Symptoms
```sql
-- Symptom taxonomy
create table symptoms (
  id uuid primary key default gen_random_uuid(),
  snomed_code text,
  slug text unique not null,
  body_system text, -- cardiovascular, respiratory, neurological, etc.
  urgency_level text, -- routine, soon, urgent, emergency
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

-- Symptom-condition relationships
create table symptom_conditions (
  symptom_id uuid references symptoms(id),
  condition_id uuid references conditions(id),
  frequency text, -- very_common, common, uncommon, rare
  specificity numeric(4,3), -- 0-1 specificity score
  sensitivity numeric(4,3),
  primary key (symptom_id, condition_id)
);

-- User symptom sessions (anonymous by default)
create table symptom_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id), -- nullable for anonymous
  session_token text, -- for anonymous continuity
  symptoms_reported jsonb,
  navigation_output jsonb,
  care_recommendation text,
  urgency_level text,
  country_code char(2),
  created_at timestamptz default now()
);
```

### Domain 4: Screening
```sql
-- Screening test definitions
create table screening_tests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  condition_id uuid references conditions(id),
  test_type text, -- blood_test, imaging, physical_exam, questionnaire
  sensitivity numeric(4,3),
  specificity numeric(4,3),
  created_at timestamptz default now()
);

create table screening_test_translations (
  screening_test_id uuid references screening_tests(id),
  language_code char(5),
  name text not null,
  description text,
  preparation_instructions text,
  what_to_expect text,
  primary key (screening_test_id, language_code)
);

-- Country-specific screening guidelines
create table screening_guidelines (
  id uuid primary key default gen_random_uuid(),
  screening_test_id uuid references screening_tests(id),
  country_code char(2) not null,
  issuing_organization text not null,
  guideline_name text,
  guideline_url text,
  guideline_version text,
  published_date date,
  -- Age/sex criteria
  min_age smallint,
  max_age smallint,
  biological_sex text, -- all, male, female
  frequency_months smallint, -- how often in months
  -- Additional criteria (stored as JSON for flexibility)
  additional_criteria jsonb, -- risk factors, family history triggers, etc.
  is_universal boolean default false, -- recommended for all vs. risk-based
  is_active boolean default true,
  created_at timestamptz default now()
);

-- User screening plans
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
```

### Domain 5: Risk Assessment
```sql
-- Risk calculator definitions
create table risk_calculators (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, -- e.g., 'framingham-cvd-10year', 'findrisc-diabetes'
  name text not null,
  category text, -- cardiovascular, diabetes, cancer, mental_health, lifestyle
  validated_populations text[], -- e.g., ['thai', 'asian', 'western']
  source_publication text,
  doi text,
  version text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Risk assessment results
create table risk_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  calculator_id uuid references risk_calculators(id),
  inputs jsonb not null, -- the input values used
  raw_score numeric(8,4),
  risk_category text, -- low, moderate, high, very_high
  risk_percentage numeric(5,2),
  risk_label text, -- human readable
  action_plan jsonb, -- recommended actions
  created_at timestamptz default now()
);

-- Action plans (reusable)
create table action_plans (
  id uuid primary key default gen_random_uuid(),
  risk_category text not null,
  condition_id uuid references conditions(id),
  country_code char(2),
  actions jsonb not null, -- array of action objects
  created_at timestamptz default now()
);
```

### Domain 6: Healthcare Providers
```sql
-- Provider organizations
create table provider_organizations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  organization_type text, -- hospital, clinic, specialist_center, screening_center
  country_code char(2) not null,
  province text,
  city text,
  address jsonb,
  coordinates point,
  phone text,
  website text,
  email text,
  -- Accreditation
  accreditations text[], -- JCI, HA_Thailand, ISO, etc.
  accreditation_details jsonb,
  -- Languages spoken
  languages_spoken char(5)[],
  -- Insurance accepted
  insurance_accepted text[],
  -- Operating hours
  operating_hours jsonb,
  -- Quality metrics
  rating_average numeric(3,2),
  rating_count integer default 0,
  -- Verification
  is_verified boolean default false,
  verified_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Provider services
create table provider_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references provider_organizations(id),
  service_type text, -- screening, consultation, emergency, etc.
  screening_test_id uuid references screening_tests(id),
  price_thb numeric(10,2),
  price_usd numeric(10,2),
  duration_minutes smallint,
  appointment_required boolean default true,
  booking_url text,
  is_active boolean default true
);

-- Provider translations
create table provider_translations (
  provider_id uuid references provider_organizations(id),
  language_code char(5),
  name text not null,
  description text,
  specialties_text text,
  primary key (provider_id, language_code)
);
```

### Domain 7: Content & Academy
```sql
-- Health articles
create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  article_type text, -- disease_guide, prevention_tip, screening_guide, lifestyle
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
  article_id uuid references articles(id),
  language_code char(5),
  title text not null,
  subtitle text,
  content jsonb, -- structured content (blocks)
  meta_description text,
  search_vector tsvector,
  primary key (article_id, language_code)
);

-- Courses (Health Literacy Academy)
create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text, -- cardiovascular, cancer, diabetes, mental_health, nutrition
  difficulty_level text, -- beginner, intermediate, advanced
  estimated_minutes smallint,
  certificate_available boolean default false,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  sequence_number smallint not null,
  module_type text, -- video, text, quiz, infographic
  video_url text,
  content jsonb,
  created_at timestamptz default now()
);

-- User learning progress
create table user_course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id),
  modules_completed integer default 0,
  total_modules integer,
  is_completed boolean default false,
  completed_at timestamptz,
  certificate_url text,
  last_activity_at timestamptz
);
```

### Domain 8: Analytics & Population Health
```sql
-- Anonymized population health events (no PII)
create table population_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null, -- risk_assessment, screening_planned, symptom_navigation
  country_code char(2),
  region text,
  age_band text, -- '25-34', '35-44', etc.
  biological_sex text,
  condition_slug text,
  risk_category text,
  action_taken boolean,
  created_at timestamptz default now()
);

-- Aggregated public health metrics
create table health_metrics_aggregated (
  id uuid primary key default gen_random_uuid(),
  metric_type text, -- screening_rate, risk_prevalence, action_completion
  country_code char(2),
  region text,
  condition_slug text,
  period_start date,
  period_end date,
  metric_value numeric(12,4),
  sample_size integer,
  updated_at timestamptz default now()
);

-- Audit log (all sensitive operations)
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
```

---

## Indexes

```sql
-- Performance indexes
create index idx_conditions_icd10 on conditions(icd10_code);
create index idx_condition_translations_search on condition_translations using gin(search_vector);
create index idx_providers_country_location on provider_organizations(country_code, coordinates);
create index idx_screening_guidelines_country on screening_guidelines(country_code, biological_sex, min_age, max_age);
create index idx_risk_assessments_user on risk_assessments(user_id, created_at desc);
create index idx_population_events_analytics on population_events(country_code, event_type, created_at);
create index idx_audit_log_user on audit_log(user_id, created_at desc);

-- Vector search (pgvector) for AI/semantic search
create extension if not exists vector;
create table content_embeddings (
  id uuid primary key default gen_random_uuid(),
  content_type text, -- condition, article, symptom
  content_id uuid,
  language_code char(5),
  embedding vector(1536), -- OpenAI ada-002 dimensions
  created_at timestamptz default now()
);
create index idx_content_embeddings on content_embeddings using ivfflat (embedding vector_cosine_ops);
```

---

## Row Level Security (RLS) Policies

```sql
-- Users can only see their own data
alter table health_profiles enable row level security;
create policy "Users see own profile" on health_profiles
  for all using (auth.uid() = user_id);

alter table risk_assessments enable row level security;
create policy "Users see own assessments" on risk_assessments
  for all using (auth.uid() = user_id);

alter table screening_plans enable row level security;
create policy "Users see own plans" on screening_plans
  for all using (auth.uid() = user_id);

-- Public read for disease content
alter table conditions enable row level security;
create policy "Public read conditions" on conditions
  for select using (true);

alter table condition_translations enable row level security;
create policy "Public read condition translations" on condition_translations
  for select using (true);
```
