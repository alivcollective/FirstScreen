# Multi-Language Strategy
# Health Compass — Global Localization Architecture

---

## Why Localization is a Clinical Imperative

In health communication, linguistic precision is a patient safety issue. A mistranslation in a health context isn't an inconvenience — it can lead to delayed care, wrong health decisions, or dangerous misunderstanding of symptoms.

Health Compass's localization strategy is built on this principle: **every language must be treated as a primary language, not a translation target.**

---

## Language Tiers

### Tier 1: Launch Languages (2026)
**Full localization** — Professional translation, native speaker review, culturally adapted content

- **Thai (th)** — Primary market, 71M population; native content creation
- **English (en)** — Expat community, medical professionals, fallback language

**Investment:** Full content creation + professional medical translation in both languages simultaneously.

### Tier 2: Phase 2 Languages (2027)
**Full localization**

- **Malay (ms)** — Malaysia + Brunei, 25M
- **Vietnamese (vi)** — Vietnam, 97M
- **Indonesian (id)** — Indonesia, 270M (largest ASEAN)

### Tier 3: Phase 3 Languages (2028–2029)
**Full localization**

- **Simplified Chinese (zh-CN)** — China + diaspora
- **Traditional Chinese (zh-TW)** — Taiwan + Hong Kong
- **Japanese (ja)** — Japan, 125M
- **Korean (ko)** — South Korea, 52M
- **Filipino/Tagalog (fil)** — Philippines, 115M
- **Burmese (my)** — Myanmar

### Tier 4: Global Expansion Languages (2030+)
**Progressive localization** — Core content first, full localization over 12 months

- Hindi (hi), Bengali (bn), Tamil (ta), Telugu (te) — South Asia
- Arabic (ar) — MENA region (RTL architecture required from Day 1)
- Spanish (es), Portuguese (pt) — Latin America
- French (fr), German (de), Dutch (nl) — Europe
- Swahili (sw), Hausa (ha) — Africa

---

## Localization Architecture

### Technical Foundation

**next-intl** powers all i18n routing, translations, and locale management.

```
/messages
  /en.json      — English (en)
  /th.json      — Thai (th)
  /ms.json      — Malay (ms)
  /vi.json      — Vietnamese (vi)
  ...
```

**Locale routing:**
```
healthcompass.com/           → Redirect to browser locale preference
healthcompass.com/th/        → Thai (default for Thailand)
healthcompass.com/en/        → English
healthcompass.com/zh/        → Chinese
```

**Database-level localization:**
All medical content stored in translation tables with `language_code` foreign key. Fallback chain: requested language → English → Thai.

### Right-to-Left (RTL) Support

Arabic, Farsi, Hebrew — required for Phase 4.

**RTL architecture decisions made in Phase 1:**
- CSS logical properties (`margin-inline-start` not `margin-left`)
- Tailwind CSS with `rtl:` variant enabled
- Icon mirroring for directional icons (arrows, etc.)
- Date/number formatting via `Intl` API (not hardcoded)

### Font Architecture

| Language | Primary Font | Fallback |
|----------|-------------|---------|
| Thai | Noto Sans Thai | Tahoma |
| Chinese | Noto Sans SC/TC | PingFang SC |
| Japanese | Noto Sans JP | Hiragino Sans |
| Korean | Noto Sans KR | Malgun Gothic |
| Arabic | Noto Sans Arabic | Arial |
| Devanagari | Noto Sans Devanagari | Mangal |
| Latin | Inter | -apple-system |

All Noto fonts: Google Fonts subset loading (only characters used in actual content).

---

## Medical Translation Standards

### What Cannot Be Machine-Translated

1. **Clinical descriptions** — Symptoms, conditions, treatments
2. **Risk assessment outputs** — User-facing result interpretations
3. **Emergency guidance** — Any content with safety implications
4. **Screening recommendations** — Age/sex/frequency guidance
5. **Legal/consent language** — Privacy policy, terms, disclaimers

### Translation Workflow for Medical Content

```
Source Content (English or Thai)
        ↓
Professional Medical Translator
(Must be: native speaker + medical background or review)
        ↓
In-Language Medical Review
(Licensed clinician in target language)
        ↓
Back-Translation Spot Check (10% of content)
        ↓
Native Speaker Quality Review
        ↓
Publication
```

### Machine Translation Policy

Machine translation (DeepL, Google Translate) is acceptable **only** for:
- UI strings (button labels, navigation)
- Non-medical content (careers, about pages)
- First draft acceleration (must be professionally reviewed before publication)

Never acceptable:
- Final medical content without human review
- Risk assessment result text
- Symptom navigation output
- Emergency guidance

---

## Country-Specific Health Content

Localization is more than language. Health content must be adapted for:

### Healthcare System Differences

| Country | Key System Differences |
|---------|----------------------|
| Thailand | UCS (30-baht), NHSO, MOPH guidelines |
| Singapore | MediShield Life, MOH guidelines, 3M (Medisave/Medishield/Medifund) |
| Malaysia | MySalam, MoH guidelines, private + public dual system |
| Vietnam | BHYT social health insurance, Ministry of Health |
| Indonesia | BPJS Kesehatan (JKN), universal health coverage |
| Japan | National Health Insurance, MHLW guidelines |

### Cultural Health Adaptations

- **Traditional medicine integration:** Acknowledge traditional Thai medicine (traditional Thai massage, herbal medicine) while clearly distinguishing evidence-based from traditional
- **Family-centric decision making:** Thai, Chinese, Japanese cultures involve family in health decisions — content framing adjusts
- **Body image:** BMI thresholds use Asian-Pacific WHO guidelines across all Asian markets
- **Gender and health:** Culturally sensitive language for reproductive health topics
- **Food and lifestyle:** Dietary advice uses locally recognized foods (rice, pad Thai for Thailand; pho, banh mi for Vietnam)

### Disease Prevalence Adaptation

Content emphasis adjusted per country:
- Thailand: Liver cancer, thalassemia, tropical diseases, dengue
- Vietnam: Nasopharyngeal cancer, liver cancer, H. pylori
- Indonesia: Malaria (endemic regions), TB, dengue
- Japan: Stomach cancer, H. pylori, HNPCC
- India: Oral cancer, TB, cervical cancer, diabetes

---

## Localization Quality Metrics

| Metric | Standard |
|--------|---------|
| Medical translation accuracy (back-translation) | >98% semantic equivalence |
| Dialect coverage | Standard written dialect for each language |
| Cultural appropriateness score | >4.5/5 (native speaker panel) |
| Time to publish in Tier 1 language after English | Simultaneous |
| Time to publish in Tier 2 language | <2 weeks |
| Translation memory reuse rate | >40% (reducing costs over time) |

---

## Thai Language Specifics

### Script and Encoding

- Full UTF-8 support (Thai script range U+0E00–U+0E7F)
- No word-breaking character in Thai — requires ICU library for proper text wrapping
- Thai numerals supported but Arabic numerals (0-9) used by default (more familiar in health contexts)
- Buddhist Era calendar displayed where culturally appropriate (BE = CE + 543)

### Thai Medical Terminology

- Use standard Thai medical terminology (as per Royal College of Physicians Thailand)
- Always include English term in parentheses for medical conditions on first mention
- Common names used alongside clinical terms: "มะเร็งปากมดลูก" (cervical cancer / มะเร็งปากมดลูก)

### Thai Search

- Thai requires word segmentation (no spaces between words)
- ICU word break iterator for proper tokenization
- PostgreSQL `th_simple` text search configuration
- Trigram search as fallback for partial matches
