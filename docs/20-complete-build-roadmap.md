# Complete Build Roadmap
# Health Compass — From Zero to Global Platform

---

## Sprint 0: Foundation (Weeks 1–2)

### Infrastructure Setup
- [ ] Supabase project creation (Singapore region)
- [ ] Vercel project linked to GitHub repo
- [ ] Environment variables configured
- [ ] Domain setup (healthcompass.co.th + healthcompass.io)
- [ ] Cloudflare CDN + DDoS protection
- [ ] GitHub Actions CI/CD pipeline
- [ ] Sentry error monitoring
- [ ] PostHog analytics (self-hosted)
- [ ] Uptime monitoring (Better Stack)

### Database
- [ ] Run migration 001_initial_schema.sql
- [ ] Seed risk calculators
- [ ] Seed screening guidelines (Thailand — MOPH + NHSO)
- [ ] Seed top 50 disease conditions (Thai + English)
- [ ] Seed 500 symptoms
- [ ] Seed Bangkok provider directory (100 initial providers)
- [ ] RLS policies verified
- [ ] Database backup configured

---

## Sprint 1: Core User Journey (Weeks 3–6)

### Authentication
- [ ] Email/password registration
- [ ] Google OAuth
- [ ] LINE Login (Thailand critical)
- [ ] OTP SMS (True Move H, DTAC, AIS)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Session management

### Health Profile
- [ ] Profile wizard (Step 1: Demographics)
- [ ] Profile wizard (Step 2: Lifestyle)
- [ ] Profile wizard (Step 3: Family history)
- [ ] Profile wizard (Step 4: Medical history)
- [ ] Profile completion indicator
- [ ] Profile editing
- [ ] Data export (JSON + PDF)

### Risk Assessment
- [ ] Diabetes risk (FINDRISC) — fully functional
- [ ] Cardiovascular risk (Framingham)
- [ ] Risk result display + action plan
- [ ] Risk history tracking
- [ ] Shareable risk results (privacy-safe)
- [ ] Find a screening center CTA

---

## Sprint 2: Screening & Disease (Weeks 7–10)

### Screening Planner
- [ ] Personalized schedule generation
- [ ] Thailand guideline engine
- [ ] Screening item cards
- [ ] Mark as done
- [ ] Reminder system (email, Line, push)
- [ ] Calendar export (iCal)
- [ ] Provider matching for each screening

### Disease Library
- [ ] Disease listing page
- [ ] Search (full-text + trigram)
- [ ] Filter by category, risk level
- [ ] Disease detail page
- [ ] Evidence badge display
- [ ] Medical reviewer display
- [ ] Source citations
- [ ] Related screenings
- [ ] Related risk assessments
- [ ] ICD-10 display

---

## Sprint 3: Symptoms & Providers (Weeks 11–14)

### Symptom Navigator
- [ ] Symptom input (structured + free text)
- [ ] Body system categorization
- [ ] Urgency detection
- [ ] Care recommendation logic
- [ ] Emergency routing (immediate display if triggered)
- [ ] Educational condition associations
- [ ] Symptom history (logged-in users)

### Provider Network
- [ ] Provider search (location, specialty, insurance)
- [ ] Map integration
- [ ] Provider detail page
- [ ] Services + pricing
- [ ] Insurance accepted
- [ ] Ratings + reviews
- [ ] Directions integration
- [ ] Booking deep-link

---

## Sprint 4: AI & Academy (Weeks 15–18)

### AI Health Education Assistant
- [ ] Chat interface
- [ ] RAG pipeline (disease content as knowledge base)
- [ ] Safety classifier
- [ ] Citation display
- [ ] Emergency escalation
- [ ] Conversation history
- [ ] Rate limiting per user
- [ ] Audit logging

### Health Literacy Academy
- [ ] Course listing
- [ ] Course detail + module list
- [ ] Video player
- [ ] Text + quiz modules
- [ ] Progress tracking
- [ ] Certificate generation
- [ ] 25 courses published

---

## Sprint 5: Revenue & Partnerships (Weeks 19–22)

### Premium Subscription
- [ ] Subscription plan pages
- [ ] Stripe integration (Thai Baht)
- [ ] PromptPay QR integration (Thailand)
- [ ] Subscription management
- [ ] Feature gating for premium features
- [ ] Free trial flow

### Corporate Wellness
- [ ] Organization account creation
- [ ] Employee invite system
- [ ] Group analytics dashboard
- [ ] Aggregate (anonymized) reporting
- [ ] HR admin portal

### Insurance Marketplace
- [ ] Product listing pages
- [ ] Partner integration (3 insurers)
- [ ] Comparison tool
- [ ] Attribution tracking
- [ ] Application deep-link

---

## Sprint 6: Trust & Compliance (Weeks 23–26)

### PDPA Compliance
- [ ] Consent management center
- [ ] Granular consent toggles
- [ ] Consent recording in database
- [ ] Data subject request portal
  - [ ] Data access request
  - [ ] Data deletion request
  - [ ] Data portability export
- [ ] Cookie consent (banner + management)
- [ ] Privacy policy (Thai + English legal review)
- [ ] DPO contact published

### Medical Disclaimer System
- [ ] Disclaimer architecture across all pages
- [ ] Risk assessment disclaimers
- [ ] Symptom navigation disclaimers
- [ ] AI assistant disclaimers
- [ ] Emergency escalation flows

### Content Governance
- [ ] Medical review workflow system
- [ ] Content version control
- [ ] Review queue dashboard
- [ ] Medical reviewer portal
- [ ] Evidence grade display
- [ ] Source citation system

---

## Sprint 7: Performance & Mobile (Weeks 27–30)

### Performance
- [ ] Core Web Vitals audit (LCP < 2.5s target)
- [ ] Image optimization
- [ ] Font subsetting (Thai characters)
- [ ] ISR for disease content
- [ ] API response caching (Redis/Upstash)
- [ ] Edge deployment verification

### Progressive Web App
- [ ] Service worker
- [ ] Offline mode (core content cached)
- [ ] Install prompt
- [ ] Push notifications (screening reminders)
- [ ] App manifest

### Accessibility
- [ ] WCAG 2.1 AA audit
- [ ] Screen reader testing
- [ ] Keyboard navigation testing
- [ ] Color contrast verification
- [ ] Font size accessibility

---

## Sprint 8: Localization (Weeks 31–34)

### Thai Language
- [ ] Complete UI translation
- [ ] Medical content in Thai (all conditions)
- [ ] Thai-specific screening guidelines
- [ ] Thai health system references
- [ ] LINE notification templates in Thai
- [ ] Thai language search configuration
- [ ] Native Thai speaker QA

### Multi-Language Infrastructure
- [ ] Language switcher
- [ ] Locale persistence
- [ ] Language-specific SEO (hreflang)
- [ ] Translation management system
- [ ] Machine translation pipeline (non-medical)

---

## Sprint 9: Analytics & Population Health (Weeks 35–38)

### User Analytics
- [ ] Funnel tracking (registration → risk assessment → action)
- [ ] Feature usage tracking
- [ ] Health journey mapping
- [ ] A/B testing framework
- [ ] Cohort analysis

### Population Health
- [ ] Anonymized event pipeline
- [ ] Aggregate metrics dashboard
- [ ] Country health report generation
- [ ] API endpoints for analytics products
- [ ] Ministry reporting export

---

## Sprint 10: Launch Preparation (Weeks 39–42)

### Security
- [ ] Penetration test (external firm)
- [ ] Bug bounty program launch
- [ ] OWASP Top 10 audit
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Rate limiting on all APIs
- [ ] DDoS simulation test

### Load Testing
- [ ] 10,000 concurrent user simulation
- [ ] Database query optimization
- [ ] Auto-scaling verification

### Quality Assurance
- [ ] End-to-end test suite
- [ ] Mobile device testing (iOS + Android, Thai language)
- [ ] Cross-browser testing
- [ ] Medical content accuracy audit (external medical review)

### Launch Readiness
- [ ] MOPH partnership MOU signed
- [ ] 3 hospital partnerships confirmed
- [ ] Press kit prepared
- [ ] Launch PR strategy
- [ ] Customer support team trained
- [ ] On-call rotation established
- [ ] Incident response runbook

---

## Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js | 16 (App Router) |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui + Base UI | Latest |
| Language | TypeScript | 5.x |
| Database | Supabase PostgreSQL | 16 |
| Auth | Supabase Auth | Latest |
| Storage | Supabase Storage | Latest |
| AI | Anthropic Claude API | claude-sonnet-4-6 |
| AI SDK | Vercel AI SDK | Latest |
| i18n | next-intl | Latest |
| State | Zustand | Latest |
| Data fetching | TanStack Query | v5 |
| Forms | react-hook-form + Zod | Latest |
| Charts | Recharts | Latest |
| Animations | Framer Motion | Latest |
| Deployment | Vercel | Latest |
| CDN | Cloudflare | Enterprise |
| Monitoring | Sentry | Latest |
| Analytics | PostHog | Latest |
| Payments | Stripe + PromptPay | Latest |

---

## Team Requirements

### Core Team (Thailand Launch)

| Role | Count | Focus |
|------|-------|-------|
| Founding CTO / Lead Engineer | 1 | Architecture, backend |
| Senior Full-Stack Engineer | 2 | Feature development |
| Frontend Engineer | 1 | UI/UX implementation |
| Medical Content Lead | 1 | Content strategy, reviewer coordination |
| Medical Reviewer (Part-time) | 3 | Content review by specialty |
| Thai Medical Translator | 2 | Professional medical translation |
| Product Manager | 1 | Roadmap, partnerships |
| Country Manager (Thailand) | 1 | Partnerships, government relations |
| Data/Analytics Engineer | 1 | Population health, analytics |
| Security Engineer (Part-time) | 1 | PDPA, pen testing, audit |

### Estimated Year 1 Team Cost (Thailand)
| Function | Monthly | Annual |
|---------|---------|--------|
| Engineering (5 people) | ฿1.5M | ฿18M |
| Product + Medical Content | ฿600K | ฿7.2M |
| Business Development | ฿400K | ฿4.8M |
| Infrastructure + tools | ฿100K | ฿1.2M |
| **Total** | **฿2.6M** | **฿31.2M (~$870K)** |
