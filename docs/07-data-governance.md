# Data Governance Framework
# Health Compass — Privacy by Design

---

## Governing Principles

1. **Minimum Necessary** — Collect only what serves the user's health journey
2. **Purpose Limitation** — Data collected for health navigation is not used for advertising
3. **User Sovereignty** — The user owns their health data; we are stewards, not owners
4. **Transparency** — Users always know what data we hold and why
5. **Privacy by Default** — The most privacy-protective setting is the default

---

## Regulatory Compliance Matrix

| Regulation | Jurisdiction | Status | Key Requirements |
|------------|-------------|--------|-----------------|
| PDPA (Personal Data Protection Act) | Thailand | Full compliance | Consent, rights, DPO, 30-day breach notification |
| GDPR | EU (future) | Architecture-ready | Consent, DSAR, data portability, DPO |
| HIPAA-inspired | US (future) | Architecture-inspired | PHI safeguards, audit controls |
| PDPA Malaysia | Malaysia (Phase 2) | Architecture-ready | 7 principles |
| PDPA Singapore | Singapore (Phase 2) | Architecture-ready | Accountability, notification |

---

## Data Classification

### Class 1: Public Content
- Disease information, screening guidelines, provider directory
- No privacy controls needed
- Freely shareable

### Class 2: Anonymous Behavioral
- Page views, search queries (no PII), feature usage
- Aggregated into population health metrics
- No user identity linkage

### Class 3: Pseudonymous User Data
- Health profile (age band, not birth date)
- Risk assessment inputs and results
- Screening plan data
- Linked to UUID, not to name/email
- Requires authentication to access

### Class 4: Personal Health Information
- Symptom session history
- Screening completion records
- Course progress
- Full encryption at rest; RLS in database

### Class 5: PII (Personally Identifiable Information)
- Email address
- Phone number
- Full name (optional)
- Stored separately in `user_pii` table
- Field-level encryption
- Separate access controls

---

## Consent Management

### Consent Categories

```
┌─────────────────────────────────────────────────────────┐
│              HEALTH COMPASS CONSENT CENTER                │
├─────────────────────────────────────────────────────────┤
│  ✅ Essential (Cannot disable)                           │
│     Account authentication and security                  │
│     PDPA-required processing                            │
├─────────────────────────────────────────────────────────┤
│  ☐ Analytics (Opt-in)                                   │
│     Anonymous usage data to improve the platform         │
│     No health data included                             │
├─────────────────────────────────────────────────────────┤
│  ☐ Research (Opt-in, strict)                           │
│     Anonymized aggregate health trends                   │
│     For public health research only                     │
│     IRB oversight required for any study                │
├─────────────────────────────────────────────────────────┤
│  ☐ Marketing Communications (Opt-in)                    │
│     Health tips and platform updates                     │
│     Unsubscribe anytime                                 │
└─────────────────────────────────────────────────────────┘
```

### Never Permitted
- Selling health data to third parties
- Advertising targeting based on health data
- Insurance underwriting discrimination
- Employer data sharing without explicit consent
- Government sharing without legal process

---

## User Rights Implementation

| Right | Implementation | Timeline |
|-------|---------------|----------|
| Access | `/settings/my-data` — full JSON export | Immediate |
| Rectification | Edit health profile | Immediate |
| Erasure | Account deletion → data deletion | 30 days |
| Portability | Export in JSON/PDF | Immediate |
| Restriction | Pause processing | Immediate |
| Object | Granular consent withdrawal | Immediate |

---

## Data Retention Policy

| Data Type | Retention Period | Rationale |
|-----------|-----------------|-----------|
| Active user profile | Until account deletion | User service |
| Risk assessment history | 5 years after creation | Longitudinal health value |
| Audit logs | 7 years | PDPA compliance |
| Anonymous analytics | 3 years | Platform improvement |
| Deleted account data | 30 days (then purged) | Legal requirement |
| Consent records | 10 years | Regulatory compliance |

---

## Data Breach Response

### Notification Timeline (PDPA Thailand)
- Internal detection → PDPC notification: 72 hours
- Affected users notification: Without undue delay if high risk
- Documentation: Within 30 days

### Breach Response Plan
1. Detect → Contain → Assess
2. PDPC notification at 72 hours if required
3. User notification if health data exposed
4. Post-incident review and controls update

---

## Medical Content Governance

### Content Review Process

Every health claim must have:
1. **Source** — Peer-reviewed publication, systematic review, or recognized guideline
2. **Grade** — Evidence quality (GRADE A-D)
3. **Reviewer** — Licensed medical professional credentials
4. **Date** — Initial review and scheduled next review
5. **Version** — Changelog maintained

### Prohibited Content
- Unsubstantiated health claims
- Diagnostic language ("you have", "this means you have")
- Treatment prescriptions
- Supplement/product recommendations without evidence grade
- Political health statements

---

## AI Ethics Framework

### AI Health Assistant Guardrails

**Hard Constraints (Cannot be overridden):**
- Never state, imply, or suggest a diagnosis
- Always include professional referral offer
- Always display disclaimer
- Never recommend specific medications or dosages
- Never contradict a user's stated medical team

**Soft Guidelines:**
- Default to caution when evidence is limited
- Express uncertainty explicitly
- Cite sources for all health claims
- Use plain language (6th-grade reading level)
- Adapt language complexity to user's demonstrated literacy

### AI Audit Trail
- All AI conversations logged (with consent)
- Random sample reviewed by medical team monthly
- Hallucination/safety incident reporting
- Model version locked per deployment (no silent updates)
