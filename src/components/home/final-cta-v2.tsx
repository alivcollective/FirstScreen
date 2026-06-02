import { ArrowRight, Shield } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

const TRUST_BADGES = ['ฟรี', 'ไม่ต้องสมัครสมาชิก', 'เป็นไปตาม PDPA', 'ไม่ขายข้อมูล'] as const

export async function FinalCtaV2() {
  return (
    <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 py-14 sm:py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-xl px-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-200 mb-3">
          ใช้เวลาเพียง 3 นาที
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
          ประเมินความเสี่ยงสุขภาพ
          <br />ของคุณวันนี้
        </h2>

        {/* Trust badges row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
          {TRUST_BADGES.map(badge => (
            <span key={badge} className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white font-medium">
              <Shield className="h-3 w-3 text-teal-200" />
              {badge}
            </span>
          ))}
        </div>

        <ButtonLink
          href="/risk"
          size="lg"
          className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-10 py-4 text-base rounded-xl shadow-lg shadow-teal-900/30 hover:shadow-teal-900/40 transition-all"
        >
          เริ่มประเมินฟรี
          <ArrowRight className="ml-2 h-5 w-5" />
        </ButtonLink>
      </div>
    </section>
  )
}
