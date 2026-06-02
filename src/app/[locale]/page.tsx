import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PopularScreenings } from '@/components/home/popular-screenings'
import { RiskCategories } from '@/components/home/risk-categories'
import { TrustCompact } from '@/components/home/trust-compact'
import { HealthNews } from '@/components/home/health-news'
import { FinalCtaV2 } from '@/components/home/final-cta-v2'
import { MobileStickyAssessmentCTA } from '@/components/shared/mobile-sticky-cta'

// ── Inline section components (dark theme, no Tailwind) ───────

function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1628 60%, #0a1020 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }}
      />
      {/* Teal glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 560,
          height: 280,
          background: 'radial-gradient(ellipse, rgba(20,184,166,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: 720,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 99,
            border: '1px solid rgba(20,184,166,0.25)',
            background: 'rgba(20,184,166,0.08)',
            padding: '6px 16px',
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#14b8a6',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 13, color: '#5eead4', fontWeight: 500 }}>
            อิงหลักฐานทางการแพทย์ · ฟรี
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(42px, 7vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}
        >
          <span style={{ color: '#ffffff', display: 'block' }}>รู้ความเสี่ยง</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}
          >
            ก่อนโรครู้จักคุณ
          </span>
        </h1>

        {/* Checkmark bullets */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto 32px',
            maxWidth: 420,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {[
            'ประเมินความเสี่ยงสุขภาพ 3 นาที',
            'รับแผนตรวจคัดกรองเฉพาะบุคคล',
            'ข้อมูลที่อ้างอิงจากหลักฐานทางการแพทย์',
          ].map((item) => (
            <li
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#cbd5e1',
                fontSize: 16,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(20,184,166,0.18)',
                  border: '1px solid rgba(20,184,166,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: '#14b8a6',
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          <Link
            href="/risk"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#14b8a6',
              color: '#fff',
              borderRadius: 12,
              padding: '14px 28px',
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 0 32px rgba(20,184,166,0.30)',
              transition: 'background 0.15s',
            }}
          >
            เริ่มประเมินความเสี่ยงฟรี →
          </Link>
          <Link
            href="/symptom-assessment"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              color: '#e2e8f0',
              borderRadius: 12,
              padding: '14px 28px',
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            ตรวจอาการเบื้องต้น →
          </Link>
        </div>

        {/* References */}
        <p style={{ fontSize: 13, color: '#475569' }}>
          อ้างอิงจาก{' '}
          {['WHO', 'อส. ไทย', 'USPSTF', 'GRADE'].map((src, i, arr) => (
            <span key={src}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{src}</span>
              {i < arr.length - 1 && <span style={{ margin: '0 6px', color: '#1e2d40' }}>·</span>}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { icon: '👥', value: '15K+', label: 'คน ใช้งานแล้ว' },
    { icon: '📊', value: '4', label: 'เครื่องมือประเมินความเสี่ยง' },
    { icon: '📚', value: '12+', label: 'แหล่งข้อมูลทางการแพทย์' },
    { icon: '✅', value: '100%', label: 'ตรวจสอบโดยผู้เชี่ยวชาญ' },
  ]

  return (
    <section style={{ background: '#0d1424', borderTop: '1px solid #1e2d40', borderBottom: '1px solid #1e2d40' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '28px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '12px 8px',
              borderRight: i < stats.length - 1 ? '1px solid #1e2d40' : 'none',
            }}
          >
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#14b8a6', lineHeight: 1 }}>
              {s.value}
            </span>
            <span style={{ fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.4 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      {/* Responsive: stack on mobile via style tag */}
      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-item { border-right: none !important; border-bottom: 1px solid #1e2d40; }
          .stats-item:nth-child(odd) { border-right: 1px solid #1e2d40 !important; }
          .stats-item:nth-last-child(-n+2) { border-bottom: none !important; }
        }
      `}</style>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { n: 1, label: 'ตอบคำถาม 3 นาที' },
    { n: 2, label: 'รับผลประเมินความเสี่ยง' },
    { n: 3, label: 'รับแผนตรวจคัดกรองเฉพาะบุคคล' },
  ]

  return (
    <section style={{ background: '#0a0f1a', padding: '72px 24px' }}>
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center',
        }}
      >
        {/* Left: steps */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#14b8a6',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 14,
            }}
          >
            วิธีการทำงาน
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: 32,
            }}
          >
            ง่าย รวดเร็ว อิงหลักฐาน
          </h2>

          {steps.map((step, i) => (
            <div
              key={step.n}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: i < steps.length - 1 ? 0 : 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#14b8a6',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {step.n}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, height: 28, background: 'rgba(20,184,166,0.25)', margin: '4px 0' }} />
                )}
              </div>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#e2e8f0',
                  paddingTop: 5,
                  paddingBottom: i < steps.length - 1 ? 28 : 0,
                }}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>

        {/* Right: description */}
        <div
          style={{
            background: 'rgba(20,184,166,0.05)',
            border: '1px solid rgba(20,184,166,0.15)',
            borderRadius: 16,
            padding: '28px 32px',
          }}
        >
          <p
            style={{
              fontSize: 17,
              color: '#94a3b8',
              lineHeight: 1.75,
              marginBottom: 20,
            }}
          >
            ใช้แนวทางเดียวกับระบบคัดกรองสุขภาพสมัยใหม่
            อิงมาตรฐาน WHO, USPSTF และ อส. ไทย
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['WHO', 'USPSTF', 'อส. ไทย', 'GRADE'].map((src) => (
              <span
                key={src}
                style={{
                  borderRadius: 6,
                  border: '1px solid rgba(20,184,166,0.2)',
                  background: 'rgba(20,184,166,0.08)',
                  color: '#14b8a6',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 10px',
                }}
              >
                {src}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 640px) {
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────

export default async function HomePage() {
  return (
    <div style={{ background: '#0a0f1a' }}>
      <Navbar />
      <main>
        {/* S1 — Hero */}
        <HeroSection />

        {/* S2 — Stats bar */}
        <StatsBar />

        {/* S3 — How it works */}
        <HowItWorksSection />

        {/* S4 — คัดกรองยอดนิยม (existing component, repositioned here) */}
        <div style={{ background: '#0d1424' }}>
          <PopularScreenings />
        </div>

        {/* S5+ — Keep existing sections */}
        <RiskCategories />
        <TrustCompact />
        <HealthNews />
        <FinalCtaV2 />
      </main>
      <Footer />
      <MobileStickyAssessmentCTA />
    </div>
  )
}
