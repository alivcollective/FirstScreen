import { getTranslations } from 'next-intl/server'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

export async function HeroV2() {
  const t = await getTranslations()

  const subPoints = ['hero2.sub1', 'hero2.sub2', 'hero2.sub3'] as const

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Teal ambient glow — subtle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/8 px-4 py-1.5 mb-10">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-medium tracking-wide text-teal-300 uppercase">
            {t('hero2.badge')}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          {t('hero2.line1')}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-300">
            {t('hero2.line2')}
          </span>
        </h1>

        {/* Sub-points — 3 checkmarks */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-12">
          {subPoints.map((key) => (
            <div key={key} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
              <span className="text-slate-300 text-base">{t(key)}</span>
            </div>
          ))}
        </div>

        {/* CTAs — both equally prominent */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <ButtonLink
            href="/risk"
            size="lg"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-5 text-base rounded-xl shadow-xl shadow-teal-900/40 hover:shadow-teal-800/50 transition-all min-h-[52px]"
          >
            {t('hero2.primary')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </ButtonLink>
          <ButtonLink
            href="/symptoms"
            size="lg"
            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white font-semibold px-8 py-5 text-base rounded-xl transition-all min-h-[52px]"
          >
            {t('hero2.ctaSymptoms')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </ButtonLink>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
          <span className="text-slate-600">{t('hero2.trustLabel')}</span>
          <span className="font-medium text-slate-400">{t('hero2.trustSources')}</span>
        </div>
      </div>
    </section>
  )
}
