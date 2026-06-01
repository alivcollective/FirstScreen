# Trust Framework
# Health Compass — Medical Credibility Architecture

---

## Why Trust is the Product

In consumer health technology, trust is not a feature — it is the product itself. Every design decision, every architectural choice, every content policy must answer one question:

**"Does this earn or erode the user's trust in their health information?"**

Health Compass competes in a market flooded with AI-generated health misinformation, advertising-driven health "advice," and diagnostic overreach by apps that skirt medical device regulations. Our competitive moat is not technology — it's trustworthiness at scale.

---

## The Seven Trust Pillars

### 1. Evidence Grading (GRADE Methodology)

Every health claim on Health Compass is graded using the **GRADE (Grading of Recommendations Assessment, Development and Evaluation)** methodology — the international standard used by WHO, Cochrane, and major clinical guidelines bodies.

| Grade | Meaning | What it looks like |
|-------|---------|-------------------|
| **A** | Strong | Multiple high-quality RCTs or systematic reviews with consistent findings |
| **B** | Moderate | Well-designed trials or consistent observational studies |
| **C** | Limited | Expert consensus, small studies, or inconsistent findings |
| **D** | Expert Opinion | Based primarily on clinical experience and expert judgment |

**Display rule:** Every health recommendation shows its evidence grade. Users can tap for explanation. Grade D content is always labeled "Expert Opinion."

### 2. Source Citation (Always Show Your Work)

No claim exists without a citation.

**Minimum citation standard:**
- Author(s) or Organization
- Publication name or Guideline body
- Year
- Link to source (DOI preferred)

**Guideline sources are prioritized:**
- WHO Guidelines
- Thai Ministry of Public Health (MOPH)
- Royal College of Physicians Thailand
- National Health Security Office (NHSO)
- International society guidelines (ACC/AHA, ESC, IDF, etc.)

### 3. Medical Review Process

**No content publishes without human medical review.**

```
Draft Creation (Medical Writer or AI-assisted)
          ↓
Automated Quality Check
  - Citation format validation
  - Evidence grade present?
  - Disclaimer language compliant?
  - No diagnostic language?
          ↓
Medical Reviewer Assignment (by specialty)
          ↓
Expert Review (Licensed MD or equivalent)
  - Clinical accuracy
  - Guideline alignment
  - Evidence grade verification
  - Safety language check
          ↓
Editorial Review
  - Readability
  - Plain language
  - Disclaimer compliance
          ↓
Translation (Professional medical translator)
          ↓
Publication
```

**Review cadence:**
- All published content re-reviewed every 90 days
- Immediate review triggered by: major guideline update, published safety concern, user flagging

### 4. Medical Advisory Board

Health Compass maintains an active Medical Advisory Board with representation across:
- Internal Medicine
- Cardiology
- Oncology
- Endocrinology / Diabetes
- Public Health / Epidemiology
- Mental Health Psychiatry
- Women's Health / OB-GYN
- Geriatrics
- Emergency Medicine

Each advisor:
- Reviews content in their specialty domain
- Approves clinical guidelines alignment
- Receives quarterly platform health report
- Named and credentialed on platform

### 5. Persistent Disclaimer Architecture

Medical disclaimers are not buried in footers. They are architecturally integrated.

**Disclaimer placement rules:**
- **Risk assessments**: Before, during, and after — every result page
- **Symptom navigation**: Persistent banner throughout session; forced acknowledgment at start
- **AI Health Assistant**: Visible in every message thread, every response
- **Disease content**: Footnote on every page; expanded on conditions with high misuse potential
- **Footer**: Global persistent disclaimer on all pages

**Disclaimer language principles:**
- Plain language (6th grade reading level)
- Not buried — visually prominent
- Not alarming — educational tone
- Always includes "consult a healthcare professional"

### 6. No Diagnostic Language Policy

Health Compass has a **zero tolerance policy** for diagnostic language.

**Prohibited patterns:**
- "You have [condition]"
- "This suggests you have..."
- "Your symptoms indicate..."
- "You are likely suffering from..."
- "This means you need [treatment]..."

**Permitted patterns:**
- "These symptoms can be associated with..."
- "People with similar symptoms sometimes have..."
- "This is for educational awareness. A doctor can properly evaluate you."
- "Your risk score suggests discussing with your healthcare provider"

**Technical enforcement:**
- AI output safety classifier scans for diagnostic language
- Content review checklist item #1: No diagnostic claims
- Automated flagging if prohibited phrases detected in AI output

### 7. Safety Escalation Protocol

When a user's inputs suggest acute risk, Health Compass escalates immediately.

**Trigger conditions:**
- Symptom navigation: chest pain + shortness of breath + sweating
- Mental health: PHQ-9 item 9 (suicidal ideation) positive
- Any "emergency" urgency flag
- AI assistant conversation contains self-harm language

**Escalation response:**
```
[Immediate, high-visibility banner]

If you are experiencing a medical emergency, call:
Thailand: 1669 (Emergency Medical Service)

[Large, prominent button: "Call Emergency Now"]
[Large, prominent button: "Find Nearest Emergency Room"]

Do not rely on this platform in emergencies.
```

---

## Trust Signals Display

Every condition page, risk assessment, and educational article shows:

```
┌────────────────────────────────────────────────────┐
│ 📋 Content Information                              │
│                                                    │
│ Medically Reviewed by:                             │
│ Dr. Somchai Prasertsak, MD, FACC                  │
│ Cardiologist, Siriraj Hospital                    │
│                                                    │
│ Evidence Grade: A (Strong)                         │
│ Sources: 3 systematic reviews, 5 RCTs             │
│                                                    │
│ Last Review: March 2026                            │
│ Next Review Due: June 2026                        │
│                                                    │
│ [View Sources] [Report an Issue]                  │
└────────────────────────────────────────────────────┘
```

---

## Trust Metrics (Tracked Quarterly)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Content with active medical review | 100% | Internal tracking |
| Average days since last content review | <90 | Automated dashboard |
| User trust score (NPS-adjacent) | >70 | User surveys |
| Accuracy complaints resolved | >95% within 5 days | Ticketing system |
| Zero diagnostic language violations | 0 | AI monitoring |
| Emergency escalation response time | <100ms to display | Performance monitoring |

---

## The Anti-Pattern List (What We Will Never Do)

1. ❌ Never allow advertisers to influence health content selection
2. ❌ Never allow sponsored content to appear without clear labeling
3. ❌ Never use health data for behavioral advertising
4. ❌ Never present AI-generated health content without human review
5. ❌ Never make diagnostic claims under any framing
6. ❌ Never create urgency to sell products ("You have X, buy Y now")
7. ❌ Never recommend specific prescription medications
8. ❌ Never present alternative medicine as equivalent to evidence-based care without evidence grading
9. ❌ Never suppress user risk information to maintain a positive user experience
10. ❌ Never gate critical safety information behind paywalls
