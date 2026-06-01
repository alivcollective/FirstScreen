import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { RISK_COLORS } from '@/lib/constants'

const conditionItems = [
  { key: 'diabetes', slug: 'type-2-diabetes', risk: 'very_high' as const },
  { key: 'hypertension', slug: 'hypertension', risk: 'high' as const },
  { key: 'cervical', slug: 'cervical-cancer', risk: 'high' as const },
  { key: 'liver', slug: 'liver-cancer', risk: 'very_high' as const },
  { key: 'cardiovascular', slug: 'cardiovascular-disease', risk: 'high' as const },
  { key: 'colorectal', slug: 'colorectal-cancer', risk: 'moderate' as const },
]

export async function ThailandConditions() {
  const t = await getTranslations()

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-white text-slate-600 border-slate-200">
            {t('conditions.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('conditions.title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('conditions.subtitle')}
          </p>
        </div>

        {/* Conditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {conditionItems.map(({ key, slug, risk }) => {
            const riskConfig = RISK_COLORS[risk]
            const name = t(`conditions.items.${key}.name` as Parameters<typeof t>[0])
            return (
              <Link
                key={slug}
                href={`/diseases/${slug}`}
                className="group rounded-2xl bg-white border border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {name}
                  </h3>
                  <span className={`shrink-0 ml-2 text-xs font-medium px-2.5 py-1 rounded-full ${riskConfig.bg} ${riskConfig.text}`}>
                    {risk.replace('_', ' ')}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-3">
                  <div>
                    <div className="text-xs text-slate-500">{t('conditions.prevalenceLabel')}</div>
                    <div className="text-sm font-semibold text-slate-700">
                      {t(`conditions.items.${key}.prevalence` as Parameters<typeof t>[0])}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">{t('conditions.screeningLabel')}</div>
                    <div className="text-sm font-semibold text-slate-700">
                      {t(`conditions.items.${key}.screeningAge` as Parameters<typeof t>[0])}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {t(`conditions.items.${key}.desc` as Parameters<typeof t>[0])}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                  <TrendingUp className="h-4 w-4" />
                  {t('conditions.learnMore', { name })}
                  <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/diseases"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            {t('conditions.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
