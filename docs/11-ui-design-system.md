# UI/UX Design System
# Health Compass — Visual Language & Components

---

## Design Philosophy

Health Compass sits at the intersection of clinical precision and human warmth. The visual language must simultaneously communicate:

1. **Medical authority** — This is serious, accurate health information
2. **Human warmth** — This is a helpful guide, not a clinical institution
3. **Global clarity** — Works across cultures, languages, and literacy levels
4. **Actionability** — Every screen motivates a health action

**Core design tension resolved:** Clinical credibility without coldness. Warmth without triviality.

---

## Color System

### Primary Palette

```
Teal-500   #14b8a6   Primary action, CTAs, brand
Teal-600   #0d9488   Primary hover state
Teal-700   #0f766e   Active states, emphasis
Cyan-500   #06b6d4   Secondary, gradients
Cyan-600   #0891b2   Secondary hover
```

**Why teal?** Medical without being cold blue. Natural without being casual green. Unique in the health tech space dominated by deep blues and clinical whites.

### Risk/Status Colors (Clinically Validated Mapping)

```
Emerald (Low Risk)    #10b981   Safe, positive
Amber (Moderate)      #f59e0b   Caution, attention
Orange (High)         #f97316   Concern, action needed
Red (Very High)       #ef4444   Urgent, see doctor
```

These colors follow internationally recognized traffic light conventions used in clinical decision support systems.

### Semantic Colors

```
Slate-900   #0f172a   Primary text (headings)
Slate-700   #334155   Body text
Slate-500   #64748b   Secondary text, labels
Slate-400   #94a3b8   Placeholder, hints
Slate-200   #e2e8f0   Borders
Slate-100   #f1f5f9   Backgrounds, cards
Slate-50    #f8fafc   Page background
```

### Medical Status Colors

```
Emergency   Red-600   #dc2626   Always highest contrast
Urgent      Orange-600 #ea580c  Warning
Soon        Amber-600  #d97706  Attention
Routine     Blue-600   #2563eb  Informational
```

---

## Typography

### Font Stack

```css
/* Headings + Latin script */
--font-inter: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Thai script */
--font-noto-thai: 'Noto Sans Thai', Tahoma, sans-serif;
```

**Why Noto Sans Thai?** Google-designed, free, extensive Unicode coverage, renders Thai script at high quality across all platforms. Critical for the Thai market.

### Type Scale

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `text-4xl` | 36px | 700 | Hero headlines |
| `text-3xl` | 30px | 700 | Section headings |
| `text-2xl` | 24px | 600 | Card headings |
| `text-xl` | 20px | 600 | Sub-headings |
| `text-lg` | 18px | 400 | Lead text, descriptions |
| `text-base` | 16px | 400 | Body text |
| `text-sm` | 14px | 400 | Labels, secondary |
| `text-xs` | 12px | 400–500 | Meta, captions |

**Thai language line-height:** Increased to 1.7 from 1.5 to accommodate Thai ascending/descending characters.

---

## Component Library

### Button System

```tsx
// Primary — main CTA
<Button>Get Started</Button>

// Secondary — secondary action
<Button variant="outline">Learn More</Button>

// Ghost — tertiary, nav
<Button variant="ghost">Sign In</Button>

// Destructive — dangerous actions
<Button variant="destructive">Delete Account</Button>

// Sizes
<Button size="sm">Small</Button>     // 28px height
<Button size="default">Default</Button> // 32px height
<Button size="lg">Large</Button>     // 36px height
```

### Risk Badge

```tsx
// Risk level display
<RiskBadge level="low" />        // Green background
<RiskBadge level="moderate" />   // Amber
<RiskBadge level="high" />       // Orange
<RiskBadge level="very_high" />  // Red
```

### Evidence Grade Badge

```tsx
<EvidenceBadge grade="A" />  // Strong — Emerald
<EvidenceBadge grade="B" />  // Moderate — Blue
<EvidenceBadge grade="C" />  // Limited — Amber
<EvidenceBadge grade="D" />  // Expert Opinion — Gray
```

### Medical Disclaimer Component

```tsx
// Short (inline)
<MedicalDisclaimer variant="short" />

// Full (page footer)
<MedicalDisclaimer variant="full" />

// Emergency (red banner)
<MedicalDisclaimer variant="emergency" emergencyNumber="1669" />
```

---

## Layout System

### Grid

- 12-column grid
- Gutters: 16px mobile, 24px tablet, 32px desktop
- Max content width: 1280px
- Container padding: 16px mobile, 24px tablet, 32px desktop

### Breakpoints

```
mobile:   0–639px    (Thai mobile majority)
sm:       640–767px
md:       768–1023px
lg:       1024–1279px
xl:       1280–1535px
2xl:      1536px+
```

### Card Anatomy

```
┌──────────────────────────────────────┐
│  [Icon] [Category Badge]  [Risk Tag] │  Header
├──────────────────────────────────────┤
│  Title (text-base font-semibold)     │  Title
│  Sub-title (text-xs text-slate-500)  │  Subtitle
├──────────────────────────────────────┤
│  Body text (text-sm leading-relaxed) │  Content
│  ...                                 │
├──────────────────────────────────────┤
│  [Key Fact highlight box]            │  Highlight
├──────────────────────────────────────┤
│  Meta: Source · Grade · Date  →      │  Footer
└──────────────────────────────────────┘
```

---

## Accessibility Standards

**WCAG 2.1 AA compliance required:**

- Minimum contrast ratio: 4.5:1 (text), 3:1 (large text)
- All interactive elements: minimum 44×44px touch target
- Focus indicators: 3px ring, minimum 3:1 contrast against adjacent colors
- Images: alt text required on all health-related images
- Screen reader: ARIA labels on all icon-only buttons
- Keyboard navigation: Full keyboard accessibility on all interactive flows
- Motion: `prefers-reduced-motion` respected for all animations

**Language accessibility:**
- Thai content: native Thai language speakers review all translations
- Reading level: health content targets 6th grade in both Thai and English
- Plain language: technical medical terms always explained in plain language
- Icon + text: never icon-only for critical health information

---

## Mobile-First Design Principles

**Thailand usage data:** 87% of target users access health information on mobile

1. **Thumb-friendly:** Primary CTAs at bottom of screen where possible
2. **Single-column default:** All critical flows work in 320px width
3. **Progressive disclosure:** Complex risk explanations expand, not shown by default
4. **Offline awareness:** Core content works on slow/intermittent connections
5. **LINE-native look:** Familiar card patterns from LINE's design language
6. **Low-bandwidth mode:** Text-first option for <1Mbps connections

---

## Healthcare-Specific UX Patterns

### Risk Score Visualization

```
Low    [●───────────────────────] Very High
         ↑
     Your Risk: 18%
```
Always show: scale, position, percentage, label

### Symptom Input

- Chips/tags for structured input
- Free text for natural language
- Auto-suggest with medical synonyms (e.g., "stomach ache" → "abdominal pain")
- Never show "Your symptoms match [Condition]" — always educational framing

### Screening Plan Timeline

```
[2026]──[2027]──[2028]──[2029]──[2030]
   ↓        ↓
Blood    Pap    ...
Glucose  Smear
✓Done   📅Due
```

### Provider Card

```
┌──────────────────────────────────────┐
│ [Hospital Icon]  Bangkok Hospital  ✓ │ Verified
│ 2.3 km away · Open now              │
│ ★★★★☆ 4.2 (283 reviews)            │
│                                      │
│ Accepts: AIA · FWD · Muang Thai     │
│ Languages: 🇹🇭 Thai · 🇬🇧 English   │
│ JCI Accredited                       │
│                                      │
│ [View Services]    [Get Directions]  │
└──────────────────────────────────────┘
```
