import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  Activity,
  Calendar,
  Search,
  MapPin,
  BookOpen,
  MessageCircle,
  BarChart3,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export async function ModulesGrid() {
  const t = await getTranslations()

  const modules = [
    {
      icon: Activity,
      titleKey: 'modules.risk.title',
      descKey: 'modules.risk.desc',
      href: '/risk',
      color: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50',
      iconColor: 'text-red-600',
      tags: ['modules.risk.tag1', 'modules.risk.tag2', 'modules.risk.tag3'],
      featured: true,
    },
    {
      icon: Calendar,
      titleKey: 'modules.screening.title',
      descKey: 'modules.screening.desc',
      href: '/screening',
      color: 'from-teal-500 to-cyan-600',
      bgLight: 'bg-teal-50',
      iconColor: 'text-teal-600',
      tags: ['modules.screening.tag1', 'modules.screening.tag2'],
      featured: true,
    },
    {
      icon: Search,
      titleKey: 'modules.symptoms.title',
      descKey: 'modules.symptoms.desc',
      href: '/symptoms',
      color: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50',
      iconColor: 'text-violet-600',
      tags: ['modules.symptoms.tag1', 'modules.symptoms.tag2'],
      featured: false,
    },
    {
      icon: MapPin,
      titleKey: 'modules.providers.title',
      descKey: 'modules.providers.desc',
      href: '/providers',
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      iconColor: 'text-blue-600',
      tags: ['modules.providers.tag1', 'modules.providers.tag2'],
      featured: false,
    },
    {
      icon: BookOpen,
      titleKey: 'modules.diseases.title',
      descKey: 'modules.diseases.desc',
      href: '/diseases',
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      iconColor: 'text-amber-600',
      tags: ['modules.diseases.tag1', 'modules.diseases.tag2'],
      featured: false,
    },
    {
      icon: BookOpen,
      titleKey: 'modules.academy.title',
      descKey: 'modules.academy.desc',
      href: '/academy',
      color: 'from-emerald-500 to-green-600',
      bgLight: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      tags: ['modules.academy.tag1', 'modules.academy.tag2', 'modules.academy.tag3'],
      featured: false,
    },
    {
      icon: MessageCircle,
      titleKey: 'modules.ai.title',
      descKey: 'modules.ai.desc',
      href: '/assistant',
      color: 'from-cyan-500 to-sky-600',
      bgLight: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      tags: ['modules.ai.tag1', 'modules.ai.tag2'],
      featured: false,
    },
    {
      icon: BarChart3,
      titleKey: 'modules.population.title',
      descKey: 'modules.population.desc',
      href: '/analytics',
      color: 'from-slate-500 to-gray-600',
      bgLight: 'bg-slate-50',
      iconColor: 'text-slate-600',
      tags: ['modules.population.tag1', 'modules.population.tag2'],
      featured: false,
    },
  ] as const

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200">
            {t('modules.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('modules.title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('modules.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link
                key={module.href}
                href={module.href}
                className={`group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-lg transition-all duration-200 ${
                  module.featured ? 'lg:col-span-2' : ''
                }`}
              >
                {/* Icon */}
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${module.bgLight} mb-4`}>
                  <Icon className={`h-5 w-5 ${module.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                  {t(module.titleKey)}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {t(module.descKey)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {module.tags.map((tagKey) => (
                    <span
                      key={tagKey}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                    >
                      {t(tagKey)}
                    </span>
                  ))}
                </div>

                {/* CTA Arrow */}
                <div className="flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                  {t('common.explore')}
                  <ArrowRight className="h-4 w-4" />
                </div>

                {/* Gradient accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
