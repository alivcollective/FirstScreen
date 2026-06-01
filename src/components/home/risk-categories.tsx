import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Ribbon, Heart, Droplets, Activity, ArrowRight } from 'lucide-react'

const categories = [
  {
    key: 'cancer',
    href: '/risk',
    icon: Ribbon,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderHover: 'hover:border-violet-200',
    numBg: 'bg-violet-600',
  },
  {
    key: 'heart',
    href: '/risk',
    icon: Heart,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    borderHover: 'hover:border-red-200',
    numBg: 'bg-red-600',
  },
  {
    key: 'diabetes',
    href: '/risk',
    icon: Droplets,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderHover: 'hover:border-amber-200',
    numBg: 'bg-amber-600',
  },
  {
    key: 'general',
    href: '/screening',
    icon: Activity,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderHover: 'hover:border-teal-200',
    numBg: 'bg-teal-600',
  },
] as const

export async function RiskCategories() {
  const t = await getTranslations()

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-3">
            {t('riskCats.badge')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            {t('riskCats.title')}
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            {t('riskCats.subtitle')}
          </p>
        </div>

        {/* 4 Cards — 2×2 on mobile, 4-col on md+ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {categories.map(({ key, href, icon: Icon, iconBg, iconColor, borderHover }) => (
            <Link
              key={key}
              href={href}
              className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 ${borderHover} hover:shadow-md transition-all duration-200`}
            >
              {/* Icon */}
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} mb-5`}>
                <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.75} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-teal-700 transition-colors">
                {t(`riskCats.${key}.title` as Parameters<typeof t>[0])}
              </h3>

              {/* Types */}
              <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">
                {t(`riskCats.${key}.types` as Parameters<typeof t>[0])}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                {t(`riskCats.${key}.cta` as Parameters<typeof t>[0])}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center">
          <Link
            href="/risk"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors"
          >
            {t('riskCats.viewAll')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
