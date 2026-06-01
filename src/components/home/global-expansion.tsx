import { getTranslations } from 'next-intl/server'
import { Badge } from '@/components/ui/badge'

export async function GlobalExpansion() {
  const t = await getTranslations()

  const phases = [
    { key: '1', flag: '🇹🇭', status: 'active' as const, highlights: ['h1', 'h2', 'h3'] as const },
    { key: '2', flag: '🌏', status: 'planned' as const, highlights: ['h1', 'h2', 'h3'] as const },
    { key: '3', flag: '🌏', status: 'roadmap' as const, highlights: ['h1', 'h2', 'h3'] as const },
    { key: '4', flag: '🌍', status: 'vision' as const, highlights: ['h1', 'h2', 'h3', 'h4'] as const },
  ]

  const scaleMetrics = [
    { value: '100+', labelKey: 'globalExpansion.metrics.languages' },
    { value: '100+', labelKey: 'globalExpansion.metrics.countries' },
    { value: '1B',   labelKey: 'globalExpansion.metrics.users' },
    { value: '10M',  labelKey: 'globalExpansion.metrics.concurrent' },
    { value: '99.9%',    labelKey: 'globalExpansion.metrics.uptime' },
    { value: '<500ms',   labelKey: 'globalExpansion.metrics.api' },
  ] as const

  const infraItems = [
    { titleKey: 'globalExpansion.infra.multiRegion', descKey: 'globalExpansion.infra.multiRegionDesc' },
    { titleKey: 'globalExpansion.infra.localization', descKey: 'globalExpansion.infra.localizationDesc' },
    { titleKey: 'globalExpansion.infra.privacy', descKey: 'globalExpansion.infra.privacyDesc' },
  ] as const

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            {t('globalExpansion.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('globalExpansion.title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('globalExpansion.subtitle')}
          </p>
        </div>

        {/* Phase Timeline */}
        <div className="relative mb-16">
          {/* Connection line */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(100%-200px)] h-0.5 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {phases.map(({ key, flag, status, highlights }) => (
              <div
                key={key}
                className={`relative rounded-2xl border p-6 ${
                  status === 'active'
                    ? 'border-teal-300 bg-teal-50 shadow-sm'
                    : status === 'planned'
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Phase indicator */}
                <div className="hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs font-bold">
                  {key}
                </div>

                <div className="text-3xl mb-3">{flag}</div>
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  {t(`globalExpansion.phases.${key}.label` as Parameters<typeof t>[0])} · {t(`globalExpansion.phases.${key}.timeline` as Parameters<typeof t>[0])}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t(`globalExpansion.phases.${key}.title` as Parameters<typeof t>[0])}
                </h3>
                <div className="text-sm text-slate-600 mb-4">
                  {t(`globalExpansion.phases.${key}.population` as Parameters<typeof t>[0])}
                </div>

                <div className="space-y-1.5">
                  {highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-1 w-1 rounded-full bg-teal-500" />
                      {t(`globalExpansion.phases.${key}.${h}` as Parameters<typeof t>[0])}
                    </div>
                  ))}
                </div>

                {status === 'active' && (
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                    {t('globalExpansion.phases.1.status')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global Scale Metrics */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 p-8">
          <h3 className="text-center text-lg font-semibold text-white mb-8">
            {t('globalExpansion.scaleTitle')}
          </h3>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {scaleMetrics.map(({ value, labelKey }) => (
              <div key={labelKey} className="text-center">
                <div className="text-2xl font-bold text-teal-400">{value}</div>
                <div className="text-xs text-slate-400">{t(labelKey)}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {infraItems.map(({ titleKey, descKey }) => (
              <div key={titleKey} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-sm font-semibold text-white mb-1.5">{t(titleKey)}</div>
                <div className="text-xs text-slate-400">{t(descKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
