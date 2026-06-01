import { getTranslations } from 'next-intl/server'
import { Calendar, CheckCircle2, Clock, AlertCircle, ArrowRight, Shield, FileText } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type ScreeningStatus = 'overdue' | 'upcoming' | 'not-started'

const screeningItemKeys = [
  {
    id: 'bloodGlucose',
    status: 'overdue' as ScreeningStatus,
    lastDone: null,
    daysValue: 151,
    daysType: 'overdue',
  },
  {
    id: 'bloodPressure',
    status: 'upcoming' as ScreeningStatus,
    lastDone: '2025-10-15',
    daysValue: 136,
    daysType: 'until',
  },
  {
    id: 'papSmear',
    status: 'upcoming' as ScreeningStatus,
    lastDone: '2024-03-10',
    daysValue: 281,
    daysType: 'until',
  },
  {
    id: 'cholesterol',
    status: 'not-started' as ScreeningStatus,
    lastDone: null,
    daysValue: null,
    daysType: null,
  },
]

export default async function ScreeningPage() {
  const t = await getTranslations()

  const statusConfig = {
    overdue: {
      labelKey: 'screening.status.overdue',
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: AlertCircle,
    },
    upcoming: {
      labelKey: 'screening.status.scheduled',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      icon: Calendar,
    },
    'not-started': {
      labelKey: 'screening.status.notStarted',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      icon: Clock,
    },
  } as const

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <Calendar className="h-5 w-5 text-teal-400" />
              </div>
              <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20">
                {t('screening.badge')}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('screening.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mb-8">
              {t('screening.subtitle')}
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-xs text-slate-400 mb-0.5">{t('screening.guidelineSource')}</div>
                <div className="text-sm font-semibold text-white">{t('screening.guidelineValue')}</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-xs text-slate-400 mb-0.5">{t('screening.profileLabel')}</div>
                <div className="text-sm font-semibold text-white">{t('screening.profileValue')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Complete Profile CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 p-6 mb-10 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {t('screening.personalizedTitle')}
              </h3>
              <p className="text-sm text-teal-100">
                {t('screening.personalizedDesc')}
              </p>
            </div>
            <Button className="bg-white text-teal-700 hover:bg-teal-50 shrink-0 font-semibold">
              {t('screening.completeProfile')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-xs text-red-700">{t('screening.overdueLabel')}</div>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">1</div>
              <div className="text-xs text-amber-700">{t('screening.notStartedLabel')}</div>
            </div>
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">2</div>
              <div className="text-xs text-teal-700">{t('screening.onScheduleLabel')}</div>
            </div>
          </div>

          {/* Screening Items */}
          <div className="space-y-4">
            {screeningItemKeys.map(({ id, status, daysValue, daysType }) => {
              const statusCfg = statusConfig[status]
              const StatusIcon = statusCfg.icon

              return (
                <div
                  key={id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 mb-1">
                          {t(`screening.items.${id}.name` as Parameters<typeof t>[0])}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">
                            {t(`screening.items.${id}.category` as Parameters<typeof t>[0])}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">
                            {t(`screening.items.${id}.condition` as Parameters<typeof t>[0])}
                          </Badge>
                        </div>
                      </div>

                      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {t(statusCfg.labelKey)}
                        {daysValue !== null && daysType === 'overdue' && (
                          <span>{t('screening.daysOverdue', { days: daysValue })}</span>
                        )}
                        {daysValue !== null && daysType === 'until' && (
                          <span>{t('screening.daysUntil', { days: daysValue })}</span>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">{t('screening.recommendedFor')}</div>
                        <div className="text-xs font-medium text-slate-700">
                          {t(`screening.items.${id}.for` as Parameters<typeof t>[0])}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">{t('screening.frequency')}</div>
                        <div className="text-xs font-medium text-slate-700">
                          {t(`screening.items.${id}.frequency` as Parameters<typeof t>[0])}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">{t('screening.cost')}</div>
                        <div className="text-xs font-medium text-slate-700">
                          {t(`screening.items.${id}.cost` as Parameters<typeof t>[0])}
                        </div>
                      </div>
                    </div>

                    {/* Guideline Source */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                      <Shield className="h-3.5 w-3.5" />
                      <span>{t(`screening.items.${id}.guideline` as Parameters<typeof t>[0])}</span>
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                        {t('screening.findCenter')}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                        {t('screening.learnTest')}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        {t('screening.markDone')}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Guideline note */}
          <div className="mt-10 rounded-xl bg-blue-50 border border-blue-200 p-5">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-500 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-blue-900 mb-1">
                  {t('screening.guidelineNoteTitle')}
                </div>
                <p className="text-sm text-blue-700">
                  {t('screening.guidelineNoteText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
