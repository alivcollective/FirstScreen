# System Architecture
# Health Compass — Global Platform

---

## Architecture Overview

Health Compass is built on a **multi-tier, globally distributed architecture** designed to serve 1 billion users across 100+ countries while maintaining healthcare-grade security, sub-500ms response times, and 99.9% uptime.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                   │
│  Web (Next.js)  │  iOS/Android (Future)  │  API Partners         │
└────────┬────────────────────┬──────────────────┬────────────────┘
         │                    │                  │
         ▼                    ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EDGE NETWORK (Vercel)                          │
│  Cloudflare CDN │ DDoS Protection │ Edge Middleware              │
│  Multi-region: AP-SE, AP-NE, EU-W, US-E, US-W                  │
└─────────────────────┬────────────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────────────────┐
│  Next.js     │ │  Edge Funcs  │ │  API Gateway                  │
│  App Router  │ │  (Auth/i18n) │ │  (Rate Limit / Audit)         │
└──────┬───────┘ └──────────────┘ └────────────┬─────────────────┘
       │                                        │
       ▼                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                              │
│                                                                   │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Risk Engine  │  │  Screening   │  │  Symptom Navigator  │   │
│  │  Service      │  │  Planner     │  │  Service            │   │
│  └───────────────┘  └──────────────┘  └─────────────────────┘   │
│                                                                   │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Disease      │  │  Provider    │  │  AI Education       │   │
│  │  Intelligence │  │  Network     │  │  Assistant          │   │
│  └───────────────┘  └──────────────┘  └─────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
         ┌────────────────┼──────────────────────┐
         ▼                ▼                       ▼
┌──────────────┐  ┌──────────────┐  ┌────────────────────────────┐
│  Supabase    │  │  AI Layer    │  │  Search Infrastructure     │
│  PostgreSQL  │  │  Claude API  │  │  pgvector + Full-text      │
│  + Auth      │  │  + RAG       │  └────────────────────────────┘
│  + Storage   │  └──────────────┘
│  + Realtime  │
└──────────────┘
```

---

## Core Services

### 1. Web Application (Next.js 15)

**Technology:** Next.js 15, App Router, TypeScript, Tailwind CSS, shadcn/ui

**Architecture Pattern:**
- Server Components for data-fetching (disease content, provider listings)
- Client Components for interactive features (risk calculators, symptom navigator)
- Edge Middleware for i18n routing and auth
- ISR (Incremental Static Regeneration) for disease content (revalidate: 3600s)
- Streaming for AI responses

**Internationalization:**
- next-intl for routing, translations, and locale management
- 8 languages at launch; architecture supports 100+
- Thai as default locale; locale-specific metadata

### 2. Database Layer (Supabase)

**Technology:** Supabase (PostgreSQL 16 + pgvector + Supabase Auth)

**Schema Design Principles:**
- Multi-tenancy via `country_code` columns
- PII isolation in separate `user_pii` table with field-level encryption
- Row-Level Security (RLS) on all user data tables
- Event sourcing via `audit_log` table
- pgvector for semantic search (1536-dim embeddings)
- Full-text search indexes (tsvector) for multi-language content

**Regional Strategy:**
- Primary: Singapore (AP-Southeast)
- Read Replicas: Tokyo (AP-Northeast), Frankfurt (EU), Virginia (US)
- Supabase edge functions deployed to nearest region

### 3. Authentication (Supabase Auth)

- Email/password
- Social: Google, LINE (Thailand priority), Apple
- OTP via SMS (Thai carriers: True, DTAC, AIS)
- JWT with row-level security enforcement
- Session management with refresh token rotation
- MFA support (TOTP)

### 4. AI Health Education Assistant

**Architecture:** RAG (Retrieval Augmented Generation)

```
User Query
    │
    ▼
Query Embedding (Supabase Edge Function)
    │
    ▼
Vector Search (pgvector — disease content, guidelines)
    │
    ▼
Context Assembly (top-k=5 relevant passages)
    │
    ▼
Claude claude-sonnet-4-6 API (with system prompt guardrails)
    │
    ▼
Safety Filter (no diagnostic language checker)
    │
    ▼
Response + Citations
```

**Safety Constraints:**
- Hard-coded system prompt: Never diagnose, always cite, always offer professional referral
- Content-safety classifier post-processing
- All conversations logged for safety audit
- Explicit disclaimer in every response

### 5. Risk Assessment Engine

**Architecture:** Pure computation service (no external dependencies)

- Validated medical calculators implemented in TypeScript
- All calculations client-side for privacy (no health data sent to server unless user saves)
- Server-side calculation for logged-in users (saves history to Supabase)
- Calculator registry for versioning (update calculations without breaking history)

### 6. Search Infrastructure

**Multi-layer search:**
1. **Exact match**: PostgreSQL full-text search (tsvector) with language-specific configs
2. **Semantic search**: pgvector cosine similarity on content embeddings
3. **Autocomplete**: Edge-deployed prefix search (Supabase Edge Function)
4. **ICD-10 / SNOMED lookup**: Direct code matching

### 7. Content Management

**Medical Content Pipeline:**
```
Medical Writer → Draft
    ↓
Automated Quality Checks (citation format, grade labeling)
    ↓
Medical Reviewer (assigned by specialty)
    ↓
Editorial Review
    ↓
Translation (professional, not machine-only for medical claims)
    ↓
Embedding Generation (pgvector)
    ↓
Publication (ISR cache invalidated)
```

**Version Control:**
- All content versioned in database
- Full changelog accessible via API
- Rollback capability per content item

---

## Infrastructure Architecture

### Multi-Region Deployment

```
┌─────────────────────────────────────────────────┐
│                  Cloudflare                       │
│  Anycast DNS → Nearest PoP → Edge Cache          │
└─────────────────────┬───────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Vercel   │  │ Vercel   │  │ Vercel   │
  │ AP-SE    │  │ EU-W     │  │ US-E     │
  │(Primary) │  │          │  │          │
  └────┬─────┘  └────┬─────┘  └────┬─────┘
       │              │              │
       ▼              ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │Supabase  │  │Supabase  │  │Supabase  │
  │Singapore │  │Frankfurt │  │Virginia  │
  │(Primary) │  │(Replica) │  │(Replica) │
  └──────────┘  └──────────┘  └──────────┘
```

### Caching Strategy

| Layer | Technology | TTL | What |
|-------|-----------|-----|------|
| Browser | Cache-Control headers | 1 hour | Static assets |
| CDN | Cloudflare | 24 hours | Disease content pages |
| Next.js | ISR | 1 hour | Disease pages, provider listings |
| Database | Supabase connection pooler | N/A | Query result caching |
| Application | Redis (Upstash) | 5 min | Search suggestions, hot content |

---

## Security Architecture

### Data Classification

| Class | Examples | Controls |
|-------|---------|----------|
| Public | Disease content, provider listings | No special controls |
| Internal | Aggregated analytics | Authenticated API only |
| Confidential | User profiles, health history | RLS + encryption at rest |
| Restricted | PII (name, email) | Separate PII vault, field encryption |

### Encryption

- **In transit**: TLS 1.3 everywhere
- **At rest**: AES-256 (Supabase default)
- **PII fields**: Application-layer encryption (AES-256-GCM) with KMS key management
- **Health data**: Supabase encrypted storage

### Audit Trail

```sql
-- Every sensitive operation writes to audit_log
INSERT INTO audit_log (user_id, action, resource_type, resource_id, metadata)
VALUES (auth.uid(), 'risk_assessment_completed', 'risk_assessment', new.id, 
        jsonb_build_object('calculator', 'findrisc', 'risk_category', new.risk_category));
```

---

## Scalability Architecture

### Horizontal Scaling

- **Next.js**: Vercel auto-scaling (serverless, infinite horizontal scale)
- **Database**: Supabase read replicas + connection pooling (PgBouncer)
- **AI**: Anthropic API rate limits managed via queue (Upstash QStash)
- **Search**: pgvector with IVFFlat indexes for O(√n) approximate nearest-neighbor

### Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | <2.5s | ISR + CDN |
| FID | <100ms | Server Components |
| TTFB | <200ms | Edge deployment |
| Search | <500ms | Cached embeddings |
| Risk calc | <100ms | Client-side computation |
| AI response | First token <1s | Streaming |

---

## Disaster Recovery

- **RTO (Recovery Time Objective)**: 1 hour
- **RPO (Recovery Point Objective)**: 5 minutes
- **Backup**: Supabase daily backups + WAL streaming
- **Failover**: Supabase automatic failover to read replica
- **Health checks**: Uptime monitoring every 30 seconds
- **Incident response**: PagerDuty integration, on-call rotation

---

## API Design

### Public API (Future Partner Access)

```
GET /api/v1/conditions/{slug}
GET /api/v1/conditions/search?q={query}&lang={lang}&country={country}
GET /api/v1/screening-guidelines?country={country}&age={age}&sex={sex}
GET /api/v1/providers/search?country={country}&lat={lat}&lng={lng}&specialty={specialty}
POST /api/v1/risk/calculate
  Body: { calculator: "findrisc", inputs: {...} }
```

**Authentication:** JWT Bearer token (API key for partners)
**Rate Limiting:** 1000 req/min (free), 10000 req/min (partner)
**Versioning:** URI versioning (v1, v2...)
