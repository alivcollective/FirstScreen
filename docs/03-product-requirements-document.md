# Product Requirements Document (PRD)
# Health Compass — Version 1.0

---

## 1. Product Overview

**Product Name:** Health Compass
**Tagline:** Navigate Your Health Journey
**Version:** 1.0 (Thailand Launch)
**Last Updated:** 2026-06-01
**Owner:** Health Compass Product Team

---

## 2. Problem Statement

Hundreds of millions of people suffer from preventable or early-detectable diseases not because they lack access to medicine, but because they lack the information architecture to navigate their own health. No platform exists that combines evidence-based disease intelligence, personalized screening planning, risk awareness, and care navigation at global scale.

---

## 3. Goals & Success Criteria

### Primary Goals
1. Reduce time-to-screening for at-risk users by 50%
2. Increase health literacy scores among users by measurable metrics
3. Enable 1M+ screening facilitations in Year 1 (Thailand)
4. Achieve NPS > 60

### Non-Goals
- Diagnosing medical conditions
- Prescribing treatments
- Replacing physicians
- Building an EHR system
- Telemedicine (Phase 1)

---

## 4. User Personas

### Persona 1: Nok (Urban Professional, Bangkok)
- Age: 34, female, marketing manager
- Concern: Family history of breast cancer; doesn't know what tests to take
- Behavior: Uses LINE, Instagram, trusts peer recommendations
- Need: Personalized screening schedule, trusted information, clinic booking

### Persona 2: Somchai (Middle-aged Professional, Chiang Mai)
- Age: 52, male, business owner
- Concern: Overweight, stress, doesn't feel "sick" but knows risks
- Behavior: Uses Facebook, sporadic gym attendance
- Need: Cardiovascular risk score, actionable lifestyle plan, specialist referral

### Persona 3: Malee (Rural Teacher, Khon Kaen)
- Age: 44, female, school teacher
- Concern: Diabetes family history; limited access to specialists
- Behavior: Uses smartphone, has basic health insurance
- Need: Diabetes risk assessment, local screening center, Thai-language content

### Persona 4: David (Expat, Bangkok)
- Age: 41, male, English-speaking executive
- Concern: Navigating Thai healthcare system, language barrier
- Need: English-language provider directory, international insurance compatibility

### Persona 5: HR Manager (Corporate Wellness Buyer)
- Concern: Employee health outcomes, insurance costs, ESG reporting
- Need: Dashboard, group assessments, corporate health reports

---

## 5. Feature Requirements

### Module 1: Disease Intelligence Network

**Priority:** P0 (MVP)

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Disease library | 500+ conditions at launch, 5,000+ Year 1 | Each entry includes: description, symptoms, risk factors, prevention, screening, sources |
| Evidence grading | GRADE methodology for all claims | Every claim tagged with evidence level (A/B/C/D) |
| Source citation | Primary literature + guidelines | DOI links, guideline version, last review date |
| Medical review | Human reviewer required for all content | Reviewer name, credentials, review date displayed |
| Version history | All content versioned | Full changelog accessible |
| Multi-language | Thai + English at launch | Professionally translated, not machine-only |
| Search | Full-text + semantic search | Results in <500ms |

### Module 2: Symptom Navigation Engine

**Priority:** P0 (MVP)

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Symptom input | Free-text + structured selection | Handles Thai + English input |
| Symptom analysis | Educational output only | Zero diagnostic language; always includes "see a doctor" guidance |
| Risk signals | Flag urgent symptoms | Red flags route immediately to emergency care |
| Condition education | Show relevant conditions for learning | Labeled "for educational purposes" |
| Care recommendation | Suggest appropriate care level | GP / Specialist / Emergency / Self-care |
| Symptom history | Save user symptom patterns | Requires login, explicit consent |

### Module 3: Preventive Screening Planner

**Priority:** P0 (MVP)

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Screening profile | Age, sex, family history, lifestyle inputs | <5 minute completion |
| Schedule generation | Personalized based on profile | Shows next 5 years of recommended screenings |
| Guideline source | Each recommendation sourced | Guideline name, version, link displayed |
| Country-specific | Thailand guidelines at launch | MOPH + NHSO + Royal College guidelines |
| Reminder system | Email/push/LINE notifications | User-controlled frequency |
| Provider matching | Link screening to nearby providers | Shows cost, distance, ratings |
| Calendar export | Export to Google/Apple Calendar | iCal format |

### Module 4: Risk Assessment Platform

**Priority:** P0 (MVP)

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Cardiovascular risk | RAMA-II adapted for Thai population | 10-year risk score + action plan |
| Diabetes risk | FINDRISC + Thai adaptation | Low/Medium/High/Very High output |
| Cancer risk | Breast (BCRAT), Cervical, Colorectal | Lifetime and 10-year risk |
| Mental health screening | PHQ-9, GAD-7 | Validated instruments; always routes to professional |
| Lifestyle risk | Composite score | Nutrition, exercise, sleep, smoking, alcohol |
| Result storage | Longitudinal tracking | User can see risk trend over time |
| Action planning | Each risk output has action steps | 3-5 specific, actionable recommendations |

### Module 5: Health Literacy Academy

**Priority:** P1**

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Course library | 50 courses at launch | Each course: video + text + quiz |
| Video content | Professional medical video | Reviewed by medical advisory board |
| Interactive learning | Quizzes, assessments | Knowledge check after each module |
| Certificates | Completion certificates | Shareable on LinkedIn/social |
| Progress tracking | User learning dashboard | Streak system, completion % |
| Content calendar | New content weekly | Editorial calendar published |

### Module 6: Healthcare Provider Network

**Priority:** P1**

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Provider profiles | Hospital, clinic, specialist, screening center | Name, address, specialties, accreditation, insurance accepted |
| Search & filter | Location, specialty, insurance, language | Results sorted by relevance + distance |
| Quality indicators | Accreditation, ratings | JCI, HA Thailand, user ratings |
| Maps integration | Google Maps/Apple Maps | Directions, distance, travel time |
| Appointment | Deep link or embedded booking | Partner hospitals only; Phase 1 |
| Insurance match | Show which plans accepted | Major Thai insurers at launch |
| Reviews | Verified patient reviews | Anti-gaming measures |

### Module 7: Insurance & Prevention Marketplace

**Priority:** P2

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Product listings | Prevention-linked insurance products | Minimum 3 insurer partners at launch |
| Screening packages | Pre-priced screening bundles | 5 packages at launch |
| Comparison | Side-by-side product comparison | Price, coverage, network |
| Affiliate tracking | Revenue sharing with partners | Full attribution system |
| Corporate wellness | Group product listings | HR buyer dashboard |

### Module 8: AI Health Education Assistant

**Priority:** P1**

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Conversational UI | Chat interface | Mobile-first, supports Thai + English |
| Evidence grounding | All responses sourced | Citations shown for every health claim |
| Safety guardrails | No diagnostic claims | Hard limits on language; safety classifiers |
| Escalation | Always offers professional referral | After every health concern interaction |
| Disclaimer | Persistent disclaimer | "This is educational information, not medical advice" always visible |
| Audit trail | All conversations logged | For safety review; user-consented |

### Module 9: User Onboarding & Profile

**Priority:** P0 (MVP)

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|---------------------|
| Registration | Email, phone, social SSO | LINE Login, Google, Apple at launch |
| Profile setup | Guided health profile wizard | <3 minutes; saves progress |
| Consent management | Granular privacy controls | PDPA compliant; easy to understand |
| Data portability | Export all user data | JSON/PDF export |
| Account deletion | Full data deletion | Completed within 30 days |

---

## 6. Non-Functional Requirements

### Performance
- Page load: <2 seconds on 4G mobile connection
- API response: <500ms for search, <2 seconds for AI responses
- Uptime: 99.9% SLA
- Concurrent users: 100,000 Thailand launch; 10M global

### Security
- Encryption at rest and in transit (AES-256, TLS 1.3)
- SOC 2 Type II readiness
- PDPA compliance (Thailand)
- GDPR-ready architecture
- Penetration testing quarterly
- Bug bounty program

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Font size adjustable
- High contrast mode
- Low-bandwidth mode

### Scalability
- Multi-region deployment (AP Southeast, AP South, EU, US)
- Horizontal auto-scaling
- Database read replicas per region
- CDN for all static assets

---

## 7. Technical Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript 5.x
- Tailwind CSS 4.x
- shadcn/ui components
- Framer Motion (animations)
- Recharts (data visualization)
- next-intl (internationalization)
- Zustand (state management)
- TanStack Query (data fetching)

### Backend
- Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- PostgreSQL 16
- pgvector (semantic search)
- Redis (caching — Upstash)
- Supabase Edge Functions (Deno)

### AI Infrastructure
- Claude claude-sonnet-4-6 (AI Health Education Assistant)
- Vercel AI SDK
- RAG pipeline (pgvector + Supabase)
- Prompt versioning system

### Infrastructure
- Vercel (frontend + edge)
- Supabase (database + auth)
- Cloudflare (CDN + DDoS)
- AWS S3 / Supabase Storage (media)

---

## 8. Dependencies & Risks

| Dependency | Risk | Mitigation |
|------------|------|------------|
| MOPH guideline access | Delayed partnership | Use WHO guidelines as fallback |
| Medical reviewer availability | Slow content production | Build reviewer network ahead of content |
| Thai language quality | Machine translation errors | Human translation for all P0 content |
| Provider data accuracy | Outdated information | Provider-verified data only; 90-day refresh cycle |
| AI hallucination | Medical misinformation | RAG only; no free-generation health claims |

---

## 9. Launch Criteria

### MVP Gate (Must Have)
- [ ] Health profile + risk assessment for diabetes + cardiovascular
- [ ] Screening planner (Thai guidelines)
- [ ] Disease library (top 50 Thai conditions)
- [ ] Provider directory (Bangkok, 100+ providers)
- [ ] Thai + English language
- [ ] PDPA-compliant consent flows
- [ ] Mobile-responsive (PWA)
- [ ] Medical disclaimer system
- [ ] User registration + login

### Quality Gate
- [ ] Medical review completed for all published content
- [ ] Penetration test passed
- [ ] WCAG 2.1 AA audit passed
- [ ] Performance audit: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Legal review of all health content
