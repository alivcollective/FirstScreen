'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, Activity, Heart, Droplets, Brain } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Badge } from '@/components/ui/badge'
import { RISK_COLORS } from '@/lib/constants'

export function RiskAssessmentPreview() {
  const [activeAssessment, setActiveAssessment] = useState(0)
  const t = useTranslations()

  const assessments = [
    { icon: Heart,    titleKey: 'riskPreview.assessments.cvd.title',     subtitleKey: 'riskPreview.assessments.cvd.subtitle',     timeKey: 'riskPreview.assessments.cvd.time',     color: 'text-red-500',    bgColor: 'bg-red-50' },
    { icon: Droplets, titleKey: 'riskPreview.assessments.diabetes.title', subtitleKey: 'riskPreview.assessments.diabetes.subtitle', timeKey: 'riskPreview.assessments.diabetes.time', color: 'text-amber-500',  bgColor: 'bg-amber-50' },
    { icon: Activity, titleKey: 'riskPreview.assessments.cancer.title',   subtitleKey: 'riskPreview.assessments.cancer.subtitle',   timeKey: 'riskPreview.assessments.cancer.time',   color: 'text-violet-500', bgColor: 'bg-violet-50' },
    { icon: Brain,    titleKey: 'riskPreview.assessments.mental.title',   subtitleKey: 'riskPreview.assessments.mental.subtitle',   timeKey: 'riskPreview.assessments.mental.time',   color: 'text-cyan-500',   bgColor: 'bg-cyan-50' },
  ] as const

  const riskConfig = RISK_COLORS['high']

  const sampleActions = [
    t('riskPreview.sample.action1'),
    t('riskPreview.sample.action2'),
    t('riskPreview.sample.action3'),
    t('riskPreview.sample.action4'),
  ]

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200">
              {t('riskPreview.badge')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t('riskPreview.title')}
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              {t('riskPreview.subtitle')}
            </p>

            {/* Assessment Cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {assessments.map((assessment, index) => {
                const Icon = assessment.icon
                return (
                  <button
                    key={index}
                    onClick={() => setActiveAssessment(index)}
                    className={`text-left rounded-xl p-4 border transition-all ${
                      activeAssessment === index
                        ? 'border-teal-300 bg-teal-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${assessment.bgColor} mb-2`}>
                      <Icon className={`h-4 w-4 ${assessment.color}`} />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{t(assessment.titleKey)}</div>
                    <div className="text-xs text-slate-500">{t(assessment.timeKey)}</div>
                  </button>
                )
              })}
            </div>

            <ButtonLink href="/risk" size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
              {t('riskPreview.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>

          {/* Right: Sample Result */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className={`p-4 ${riskConfig.bg} border-b ${riskConfig.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">{t('riskPreview.sample.label')}</div>
                    <div className="text-base font-semibold text-slate-900">{t('riskPreview.sample.name')}</div>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-white shadow-sm">
                    <div className={`text-3xl font-bold ${riskConfig.text}`}>14</div>
                    <div className="text-xs text-slate-500">{t('riskPreview.sample.scoreLabel')}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white">
                {/* Risk gauge */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>{t('riskPreview.sample.lowGauge')}</span>
                    <span className={`font-semibold ${riskConfig.text}`}>
                      {t('calculator.diabetes.labels.high')}
                    </span>
                    <span>{t('riskPreview.sample.highGauge')}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500">
                    <div className="relative h-full" style={{ width: '66%' }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-orange-500 shadow-md" />
                    </div>
                  </div>
                  <div className={`text-center text-sm font-bold mt-2 ${riskConfig.text}`}>
                    {t('riskPreview.sample.risk10yr', { value: '33' })}
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4">{t('riskPreview.sample.interpretation')}</p>

                {/* Actions */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    {t('riskPreview.sample.actionsTitle')}
                  </div>
                  {sampleActions.map((action, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2">
                      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${i < 2 ? 'bg-red-500' : 'bg-teal-500'}`} />
                      <span className="text-sm text-slate-700">{action}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700">{t('riskPreview.sample.disclaimer')}</p>
                </div>
              </div>
            </div>

            {/* Decorative badge */}
            <div className="absolute -top-3 -right-3 rounded-xl bg-teal-600 text-white px-3 py-1.5 text-xs font-bold shadow-lg">
              {t('riskPreview.sample.architectureBadge')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
