import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Link } from '@/i18n/navigation'

// Hero — merged with mission quote, ~25% tighter than previous split version
export async function HeroV2() {
  const t = await getTranslations()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0a1628]">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[280px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-5 pt-12 pb-10 sm:pt-16 sm:pb-14 text-center">

        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/8 px-4 py-1.5 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-medium text-teal-300">
            {t('hero2.badge')}
          </span>
        </div>

        {/* Primary headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4">
          {t('hero2.line1')}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-300">
            {t('hero2.line2')}
          </span>
        </h1>

        {/* Mission line — medium-large, emotional */}
        <p className="text-xl sm:text-2xl font-semibold text-white/80 mb-4 leading-tight">
          ไม่มีใครควรรู้ตัวเมื่อสายเกินไป
        </p>

        {/* Supporting copy — smaller, readable */}
        <p className="text-sm sm:text-base text-slate-400 leading-[1.75] mb-7 max-w-lg mx-auto">
          FirstScreen ช่วยให้คุณประเมินความเสี่ยงสุขภาพใน 3 นาที
          พร้อมแผนตรวจคัดกรองเฉพาะบุคคลที่อิงหลักฐานทางการแพทย์
        </p>

        {/* Single primary CTA + ghost secondary */}
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <ButtonLink
            href="/risk"
            size="lg"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-semibold px-9 py-3.5 text-base rounded-xl shadow-lg shadow-teal-900/40 hover:shadow-teal-800/50 transition-all"
          >
            เริ่มประเมินฟรี
            <ArrowRight className="ml-2 h-5 w-5" />
          </ButtonLink>
          <Link
            href="/symptoms"
            className="text-sm text-slate-400 hover:text-teal-300 transition-colors underline underline-offset-4 decoration-slate-700"
          >
            {t('hero2.ctaSymptoms')}
          </Link>
        </div>

        {/* Trust sources */}
        <p className="text-slate-600 text-xs">
          {t('hero2.trustLabel')}{' '}
          <span className="text-slate-400 font-medium">{t('hero2.trustSources')}</span>
        </p>
      </div>
    </section>
  )
}
