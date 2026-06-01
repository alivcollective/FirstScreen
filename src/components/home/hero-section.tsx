import { getTranslations } from 'next-intl/server'
import { ArrowRight, Shield, BookOpen, Globe, TrendingDown } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Badge } from '@/components/ui/badge'

export async function HeroSection() {
  const t = await getTranslations()

  const stats = [
    { valueKey: 'hero.stat1Value', labelKey: 'hero.stat1Label', icon: BookOpen },
    { valueKey: 'hero.stat2Value', labelKey: 'hero.stat2Label', icon: Globe },
    { valueKey: 'hero.stat3Value', labelKey: 'hero.stat3Label', icon: Shield },
    { valueKey: 'hero.stat4Value', labelKey: 'hero.stat4Label', icon: TrendingDown },
  ] as const

  const conditionKeys = [
    'hero.conditions.diabetes',
    'hero.conditions.heart',
    'hero.conditions.cervical',
    'hero.conditions.hypertension',
    'hero.conditions.breast',
    'hero.conditions.colorectal',
    'hero.conditions.mental',
    'hero.conditions.liver',
  ] as const

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm text-teal-300 font-medium">{t('hero.launching')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight mb-6">
            {t('hero.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-slate-300 leading-relaxed mb-10">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <ButtonLink
              href="/risk"
              size="lg"
              className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 transition-all"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </ButtonLink>
            <ButtonLink
              href="/diseases"
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white px-8 py-6 text-base rounded-xl"
            >
              {t('hero.ctaSecondary')}
            </ButtonLink>
          </div>

          {/* Floating condition tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {conditionKeys.map((key) => (
              <Badge
                key={key}
                variant="outline"
                className="border-slate-700 text-slate-400 bg-slate-800/50 hover:border-teal-600 hover:text-teal-300 cursor-pointer transition-colors"
              >
                {t(key)}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map(({ valueKey, labelKey, icon: Icon }) => (
              <div
                key={labelKey}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 text-teal-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{t(valueKey)}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t(labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
