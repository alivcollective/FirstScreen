import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Ribbon, HeartPulse, Droplets, Brain, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { key: 'cancer',   href: '/risk#cancer',   icon: Ribbon,    iconBg: 'bg-violet-50', iconColor: 'text-violet-600', accent: 'group-hover:border-violet-200', badge: 'bg-violet-50 text-violet-600' },
  { key: 'heart',    href: '/risk#cvd',      icon: HeartPulse, iconBg: 'bg-red-50',    iconColor: 'text-red-600',    accent: 'group-hover:border-red-200',    badge: 'bg-red-50 text-red-600' },
  { key: 'diabetes', href: '/risk#diabetes', icon: Droplets,  iconBg: 'bg-amber-50',  iconColor: 'text-amber-600', accent: 'group-hover:border-amber-200',  badge: 'bg-amber-50 text-amber-600' },
  { key: 'mental',   href: '/risk#mental',   icon: Brain,     iconBg: 'bg-cyan-50',   iconColor: 'text-cyan-600',  accent: 'group-hover:border-cyan-200',   badge: 'bg-cyan-50 text-cyan-600' },
] as const

export async function RiskCategories() {
  const t = await getTranslations('assessments')

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-5">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
              {t('label')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t('title')}
            </h2>
          </div>
          <Link href="/risk" className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
            {t('viewAll')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map(({ key, href, icon: Icon, iconBg, iconColor, accent, badge }) => (
            <Link
              key={key}
              href={href}
              className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 ${accent} hover:shadow-sm transition-all`}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} mb-3`}>
                <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.75} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-tight group-hover:text-teal-700 transition-colors">
                {t(`${key}.title` as Parameters<typeof t>[0])}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-3">
                {t(`${key}.benefit` as Parameters<typeof t>[0])}
              </p>
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge}`}>
                  {t(`${key}.time` as Parameters<typeof t>[0])}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link href="/risk" className="text-sm font-medium text-teal-600">
            {t('viewAll')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
