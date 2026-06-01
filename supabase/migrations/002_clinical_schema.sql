-- ============================================================
-- Health Compass — Clinical Schema Migration v2.0
-- Clinical-grade database for Symptom Checker & Risk Assessment
-- Standards: ICD-11, WHO Guidelines, Thai MoPH, OLDCARTS
-- ============================================================
-- SAFETY NOTE: All content is educational only.
-- Must be reviewed by licensed physicians before production use.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- SYMPTOMS TABLE
-- ICD-11 coded symptoms for clinical-grade documentation
-- ─────────────────────────────────────────────────────────────
create table if not exists public.symptoms (
  id           uuid default uuid_generate_v4() primary key,
  code         text unique not null,      -- ICD-11 symptom/sign code
  name_th      text not null,             -- ชื่อไทย
  name_en      text not null,             -- English name
  body_region  text not null
    check (body_region in ('head','chest','abdomen','back','limbs','skin','general')),
  system       text not null
    check (system in ('neurological','cardiovascular','respiratory','GI',
                      'musculoskeletal','dermatological','psychiatric','endocrine','general')),
  severity_weight integer not null
    check (severity_weight between 1 and 4),
    -- 1=low concern, 2=moderate, 3=high, 4=critical/emergency
  is_emergency boolean not null default false,
    -- true = immediately show 1669 banner
  follow_up_questions jsonb not null default '[]',
    -- OLDCARTS-structured follow-up questions for this symptom
    -- Schema: [{ key, q_th, q_en, type, options, depends_on, depends_value }]
  created_at   timestamptz not null default now()
);

comment on table public.symptoms is
  'ICD-11 coded symptoms. severity_weight 4 + is_emergency=true triggers immediate 1669 banner.
   follow_up_questions implements OLDCARTS framework per symptom.
   REQUIRES medical review before adding/editing entries.';

-- ─────────────────────────────────────────────────────────────
-- CONDITIONS TABLE
-- ICD-11 coded diagnoses for differential diagnosis engine
-- ─────────────────────────────────────────────────────────────
create table if not exists public.conditions (
  id                  uuid default uuid_generate_v4() primary key,
  icd11_code          text unique not null,
  name_th             text not null,
  name_en             text not null,
  category            text not null
    check (category in ('cancer','cardiovascular','endocrine','infectious','psychiatric',
                        'neurological','respiratory','GI','musculoskeletal','other')),
  severity            text not null
    check (severity in ('mild','moderate','severe','critical')),
  urgency_level       integer not null
    check (urgency_level between 1 and 4),
    -- 1=routine, 2=see doctor within weeks, 3=urgent 24-48h, 4=emergency now
  prevalence_thailand text,               -- Thai epidemiology context
  specialty_required  text,               -- อายุรแพทย์ / ศัลยแพทย์ ฯลฯ
  encyclopedia_slug   text,               -- link to /diseases/[slug]
  created_at          timestamptz not null default now()
);

comment on table public.conditions is
  'ICD-11 coded conditions used in differential diagnosis.
   urgency_level drives UI: 4=immediate ER, 3=urgent clinic, 2=schedule, 1=routine.
   REQUIRES medical review.';

-- ─────────────────────────────────────────────────────────────
-- DIFFERENTIAL DIAGNOSIS MAPPING
-- Core engine: symptom + patient modifiers → condition probability
-- Based on: Harrison's IM, Thai MoPH CPGs, WHO ICD-11 guidelines
-- ─────────────────────────────────────────────────────────────
create table if not exists public.differential_dx (
  id           uuid default uuid_generate_v4() primary key,
  condition_id uuid not null references public.conditions(id) on delete cascade,
  symptom_id   uuid not null references public.symptoms(id) on delete cascade,

  -- Base likelihood: P(condition | symptom) from clinical literature
  -- Range 0.0–1.0; used as starting weight before modifiers
  base_score   numeric not null check (base_score between 0 and 1),

  -- ── Demographic modifiers (added to base_score) ─────────────
  -- Positive = increases likelihood, negative = decreases
  modifier_age_over_50   numeric not null default 0,
  modifier_age_over_60   numeric not null default 0,
  modifier_male          numeric not null default 0,
  modifier_female        numeric not null default 0,

  -- ── Lifestyle/risk factor modifiers ─────────────────────────
  modifier_smoker        numeric not null default 0,
  modifier_ex_smoker_5y  numeric not null default 0,   -- quit < 5 years
  modifier_heavy_alcohol numeric not null default 0,   -- AUDIT-C ≥ 3/4
  modifier_obese         numeric not null default 0,   -- BMI ≥ 30
  modifier_sedentary     numeric not null default 0,   -- <1 exercise day/wk

  -- ── Comorbidity modifiers ────────────────────────────────────
  modifier_diabetes      numeric not null default 0,
  modifier_hypertension  numeric not null default 0,
  modifier_hbv           numeric not null default 0,   -- HBV carrier
  modifier_hiv           numeric not null default 0,
  modifier_family_hx     numeric not null default 0,   -- family history of condition

  -- ── Symptom characteristic modifiers ────────────────────────
  modifier_duration_chronic  numeric not null default 0, -- > 4 weeks
  modifier_duration_acute    numeric not null default 0, -- < 48 hours
  modifier_severity_high     numeric not null default 0, -- severity ≥ 7/10
  modifier_sudden_onset      numeric not null default 0,
  modifier_worsening         numeric not null default 0,
  modifier_night_predominant numeric not null default 0, -- worse at night

  unique (condition_id, symptom_id)
);

comment on table public.differential_dx is
  'Core symptom→condition likelihood engine.
   Final score = base_score + applicable modifiers, capped at 1.0.
   Multiple symptoms for same condition are combined.
   Scores normalized to 0–100 in application layer.
   All scores must be validated by physician before production.';

-- ─────────────────────────────────────────────────────────────
-- SOCIAL HISTORY QUESTIONS
-- Standardized questionnaire matching AUDIT-C, WHO, Thai MoPH
-- ─────────────────────────────────────────────────────────────
create table if not exists public.social_history_questions (
  id              uuid default uuid_generate_v4() primary key,
  category        text not null
    check (category in ('smoking','alcohol','exercise','diet','occupation','travel','sexual')),
  question_key    text unique not null,
  question_th     text not null,
  question_en     text not null,
  input_type      text not null
    check (input_type in ('radio','number','select','boolean','text')),
  options         jsonb,               -- array of option strings for radio/select
  depends_on      text,                -- question_key that must be answered first
  depends_value   text,                -- value that triggers this question
  display_order   integer not null,
  clinical_weight text                 -- which risk calculations this affects
);

-- ─────────────────────────────────────────────────────────────
-- RISK ASSESSMENT TOOLS
-- Validated scoring tools stored as structured data
-- ─────────────────────────────────────────────────────────────
create table if not exists public.risk_tools (
  id                   uuid default uuid_generate_v4() primary key,
  tool_key             text unique not null,
  name_th              text not null,
  name_en              text not null,
  description_th       text,
  target_condition     text not null,
  validated_population text,
  reference_guideline  text,
  questions            jsonb not null default '[]',
  scoring_logic        jsonb not null default '{}',
  interpretation       jsonb not null default '{}',
  active               boolean not null default true,
  version              text not null default '1.0'
);

-- ─────────────────────────────────────────────────────────────
-- CLINICAL SESSIONS
-- Anonymous session storage for symptom checker + risk assessments
-- NO PII stored by design (privacy by default)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.clinical_sessions (
  id             uuid default uuid_generate_v4() primary key,
  session_token  text unique not null,  -- browser-generated UUID, no user link

  -- Demographics (age band only, not DOB)
  age            integer check (age between 1 and 120),
  sex            text check (sex in ('male','female','other')),

  -- Chief complaint
  chief_complaint  text,
  symptom_ids      uuid[],            -- selected symptom UUIDs

  -- OLDCARTS structured data
  onset_date            date,
  onset_description     text,         -- "ทันที" | "ค่อยๆ เป็น"
  location              text,
  duration_days         integer,
  character_description text,
  aggravating_factors   text[],
  relieving_factors     text[],
  timing                text,         -- "ตลอดเวลา" | "เป็นๆ หายๆ"
  severity_score        integer check (severity_score between 1 and 10),
  associated_symptoms   text[],       -- additional symptoms from OLDCARTS

  -- Social History (see schema in comment)
  social_history jsonb default '{}'::jsonb,
  /*
  {
    smoking: {
      status: "never" | "current" | "former",
      cigarettes_per_day: number,
      years_smoked: number,
      pack_years: number,          -- computed: (cigs/day ÷ 20) × years
      quit_years_ago: number
    },
    alcohol: {
      status: "never" | "current" | "former",
      audit_c_frequency: string,   -- AUDIT-C Q1 response
      audit_c_amount: string,      -- AUDIT-C Q2 response
      audit_c_binge: string,       -- AUDIT-C Q3 response
      audit_c_score: number,       -- computed 0-12
      years_drinking: number,
      quit_years_ago: number
    },
    exercise: {
      days_per_week: number,
      minutes_per_session: number,
      meets_who_guideline: boolean  -- ≥150 min/week
    },
    bmi: number,
    height_cm: number,
    weight_kg: number
  }
  */

  -- Past Medical History
  pmh_conditions     text[],          -- ["diabetes","hypertension","hbv"]
  pmh_surgeries      text[],
  pmh_allergies      text[],
  current_medications text[],

  -- Family History
  family_hx jsonb default '{}'::jsonb,
  /*
  {
    first_degree: {
      heart_disease: boolean,
      diabetes: boolean,
      cancer: string,              -- type if any
      stroke: boolean,
      hypertension: boolean
    }
  }
  */

  -- Computed Results
  differential_results jsonb,         -- array of {condition_id, score, confidence, matched_symptoms}
  urgency_level        integer check (urgency_level between 1 and 4),
  recommended_actions  text[],

  -- Risk Tool Results
  risk_results jsonb default '{}'::jsonb,
  /*
  {
    framingham: { score: number, risk_pct: number, risk_category: string },
    findrisc: { score: number, risk_category: string },
    phq9: { score: number, severity: string },
    gad7: { score: number, severity: string },
    audit_c: { score: number, interpretation: string }
  }
  */

  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

comment on table public.clinical_sessions is
  'Anonymous clinical sessions. session_token is browser-generated UUID.
   No user_id column by design — privacy by default.
   differential_results computed server-side or client-side from differential_dx table.
   For population analytics only — no individual clinical use.';

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
alter table public.symptoms               enable row level security;
alter table public.conditions             enable row level security;
alter table public.differential_dx        enable row level security;
alter table public.social_history_questions enable row level security;
alter table public.risk_tools             enable row level security;
alter table public.clinical_sessions      enable row level security;

-- Public read for clinical reference tables
create policy "public_read_symptoms"
  on public.symptoms for select using (true);

create policy "public_read_conditions"
  on public.conditions for select using (true);

create policy "public_read_differential_dx"
  on public.differential_dx for select using (true);

create policy "public_read_social_hx_questions"
  on public.social_history_questions for select using (true);

create policy "public_read_risk_tools"
  on public.risk_tools for select using (active = true);

-- Sessions: anonymous insert + read by token
create policy "anon_insert_session"
  on public.clinical_sessions for insert to anon with check (true);

create policy "anon_update_session"
  on public.clinical_sessions for update to anon using (true);

create policy "read_session_by_token"
  on public.clinical_sessions for select using (true);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
create index if not exists symptoms_body_region_idx   on public.symptoms(body_region);
create index if not exists symptoms_system_idx        on public.symptoms(system);
create index if not exists symptoms_emergency_idx     on public.symptoms(is_emergency) where is_emergency = true;
create index if not exists symptoms_code_idx          on public.symptoms(code);

create index if not exists conditions_category_idx    on public.conditions(category);
create index if not exists conditions_urgency_idx     on public.conditions(urgency_level);
create index if not exists conditions_icd11_idx       on public.conditions(icd11_code);

create index if not exists diff_dx_condition_idx      on public.differential_dx(condition_id);
create index if not exists diff_dx_symptom_idx        on public.differential_dx(symptom_id);
create index if not exists diff_dx_base_score_idx     on public.differential_dx(base_score desc);

create index if not exists social_hx_category_idx     on public.social_history_questions(category);
create index if not exists social_hx_order_idx        on public.social_history_questions(display_order);

create index if not exists clinical_sessions_token_idx on public.clinical_sessions(session_token);
create index if not exists clinical_sessions_age_idx   on public.clinical_sessions(age, sex);

-- ─────────────────────────────────────────────────────────────
-- HELPER FUNCTION: Compute differential dx score for a session
-- Called from application layer to get sorted conditions
-- ─────────────────────────────────────────────────────────────
create or replace function compute_differential_dx(
  p_symptom_ids    uuid[],
  p_age            integer default null,
  p_sex            text default null,
  p_pmh            text[] default '{}',
  p_pack_years     numeric default 0,
  p_quit_years     numeric default null,  -- null = never smoked
  p_audit_c_score  integer default 0,
  p_has_diabetes   boolean default false,
  p_has_htn        boolean default false,
  p_has_hbv        boolean default false,
  p_family_hx_cvd  boolean default false,
  p_severity       integer default 5,
  p_duration_days  integer default 1,
  p_worsening      boolean default false
)
returns table (
  condition_id    uuid,
  icd11_code      text,
  name_th         text,
  name_en         text,
  category        text,
  severity        text,
  urgency_level   integer,
  specialty_required text,
  encyclopedia_slug  text,
  total_score     numeric,
  matched_count   integer,
  confidence      text
)
language sql stable as $$
  select
    c.id,
    c.icd11_code,
    c.name_th,
    c.name_en,
    c.category,
    c.severity,
    c.urgency_level,
    c.specialty_required,
    c.encyclopedia_slug,
    least(1.0, sum(
      d.base_score
      + case when p_age > 60               then d.modifier_age_over_60  else 0 end
      + case when p_age > 50               then d.modifier_age_over_50  else 0 end
      + case when p_sex = 'male'           then d.modifier_male         else 0 end
      + case when p_sex = 'female'         then d.modifier_female       else 0 end
      + case when p_pack_years >= 10 and (p_quit_years is null or p_quit_years < 5)
                                           then d.modifier_smoker       else 0 end
      + case when p_quit_years between 0 and 5
                                           then d.modifier_ex_smoker_5y else 0 end
      + case when p_audit_c_score >= 3     then d.modifier_heavy_alcohol else 0 end
      + case when p_has_diabetes           then d.modifier_diabetes     else 0 end
      + case when p_has_htn                then d.modifier_hypertension else 0 end
      + case when p_has_hbv                then d.modifier_hbv          else 0 end
      + case when p_family_hx_cvd          then d.modifier_family_hx    else 0 end
      + case when p_duration_days > 28     then d.modifier_duration_chronic else 0 end
      + case when p_duration_days < 2      then d.modifier_duration_acute   else 0 end
      + case when p_severity >= 7          then d.modifier_severity_high    else 0 end
      + case when p_worsening              then d.modifier_worsening        else 0 end
    )) as total_score,
    count(*)::integer as matched_count,
    case
      when sum(d.base_score) > 0.5 then 'high'
      when sum(d.base_score) > 0.25 then 'moderate'
      else 'low'
    end as confidence
  from public.differential_dx d
  join public.conditions c on c.id = d.condition_id
  where d.symptom_id = any(p_symptom_ids)
  group by c.id, c.icd11_code, c.name_th, c.name_en, c.category,
           c.severity, c.urgency_level, c.specialty_required, c.encyclopedia_slug
  order by total_score desc, c.urgency_level desc
  limit 6
$$;
