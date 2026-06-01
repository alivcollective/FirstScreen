'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Droplets, AlertCircle, ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { calculateDiabetesRisk } from '@/lib/risk-calculators'
import { RISK_COLORS } from '@/lib/constants'
import type { RiskCategory, BiologicalSex } from '@/types'

const schema = z.object({
  birthYear: z.number().min(1920).max(2006),
  biologicalSex: z.enum(['male', 'female', 'intersex', 'prefer_not_to_say']),
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(30).max(300),
  isSmoker: z.boolean(),
  exerciseDaysPerWeek: z.number().min(0).max(7),
  hasDiabetesFamilyHistory: z.boolean(),
})
type FormData = z.infer<typeof schema>

interface CalcResult {
  riskCategory: RiskCategory
  score: number
  riskPercentage?: number
  bmi: number
}

function getBMICategory(bmi: number, t: ReturnType<typeof useTranslations>): string {
  if (bmi < 18.5) return t('calculator.diabetes.bmi.underweight')
  if (bmi < 23)   return t('calculator.diabetes.bmi.normal')
  if (bmi < 27.5) return t('calculator.diabetes.bmi.overweight')
  return t('calculator.diabetes.bmi.obese')
}

function getActionsForRisk(
  riskCategory: RiskCategory,
  bmi: number,
  t: ReturnType<typeof useTranslations>
) {
  const actions: Array<{ priority: 'immediate' | 'soon' | 'ongoing'; category: string; title: string; description: string }> = []

  if (riskCategory !== 'low') {
    actions.push({
      priority: 'immediate',
      category: 'screening',
      title: t('calculator.diabetes.actions.bloodTestTitle'),
      description: t('calculator.diabetes.actions.bloodTestDesc'),
    })
  }
  actions.push({
    priority: 'ongoing',
    category: 'lifestyle',
    title: t('calculator.diabetes.actions.exerciseTitle'),
    description: t('calculator.diabetes.actions.exerciseDesc'),
  })
  actions.push({
    priority: 'ongoing',
    category: 'lifestyle',
    title: t('calculator.diabetes.actions.dietTitle'),
    description: t('calculator.diabetes.actions.dietDesc'),
  })
  if (bmi >= 23) {
    actions.push({
      priority: 'soon',
      category: 'medical',
      title: t('calculator.diabetes.actions.weightTitle'),
      description: t('calculator.diabetes.actions.weightDesc'),
    })
  }
  return actions
}

export function DiabetesCalculator() {
  const [result, setResult] = useState<CalcResult | null>(null)
  const [step, setStep] = useState(1)
  const t = useTranslations()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isSmoker: false,
      exerciseDaysPerWeek: 3,
      hasDiabetesFamilyHistory: false,
    },
  })

  const heightCm = watch('heightCm')
  const weightKg = watch('weightKg')
  const bmi = heightCm && weightKg ? Math.round((weightKg / Math.pow(heightCm / 100, 2)) * 10) / 10 : null
  const bmiCategory = bmi ? getBMICategory(bmi, t) : null

  const onSubmit = (data: FormData) => {
    const profile = {
      userId: 'anonymous',
      birthYear: data.birthYear,
      biologicalSex: data.biologicalSex as BiologicalSex,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      countryCode: 'TH' as const,
      isSmoker: data.isSmoker,
      exerciseDaysPerWeek: data.exerciseDaysPerWeek,
      alcoholUnitsPerWeek: 0,
      familyHistory: data.hasDiabetesFamilyHistory
        ? [{ conditionId: 'diabetes', conditionName: 'Diabetes', relationship: 'parent' as const }]
        : [],
    }
    const calcResult = calculateDiabetesRisk(profile)
    const calculatedBmi = data.heightCm && data.weightKg
      ? Math.round((data.weightKg / Math.pow(data.heightCm / 100, 2)) * 10) / 10
      : 22
    setResult({ riskCategory: calcResult.riskCategory, score: calcResult.score ?? 0, riskPercentage: calcResult.riskPercentage, bmi: calculatedBmi })
    setStep(3)
  }

  const riskConfig = result ? RISK_COLORS[result.riskCategory] : null
  const riskLabel = result ? t(`calculator.diabetes.labels.${result.riskCategory === 'very_high' ? 'veryHigh' : result.riskCategory}` as Parameters<typeof t>[0]) : ''
  const interpretation = result ? t(`calculator.diabetes.interpretation.${result.riskCategory === 'very_high' ? 'veryHigh' : result.riskCategory}` as Parameters<typeof t>[0]) : ''
  const actions = result ? getActionsForRisk(result.riskCategory, result.bmi, t) : []

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-amber-50 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Droplets className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t('calculator.diabetes.title')}</h3>
            <p className="text-sm text-slate-600">{t('calculator.diabetes.subtitle')}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-amber-500' : 'bg-amber-200'}`}
            />
          ))}
        </div>
      </div>

      {step < 3 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {step === 1 && (
            <>
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {t('calculator.diabetes.step1Title')}
              </h4>

              {/* Birth Year */}
              <div>
                <Label htmlFor="birthYear" className="text-sm font-medium text-slate-700">
                  {t('calculator.diabetes.birthYear')}
                </Label>
                <input
                  type="number"
                  id="birthYear"
                  placeholder={t('calculator.diabetes.birthYearPlaceholder')}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  {...register('birthYear', { valueAsNumber: true })}
                />
                {errors.birthYear && <p className="mt-1 text-xs text-red-600">{errors.birthYear.message}</p>}
              </div>

              {/* Biological Sex */}
              <div>
                <Label className="text-sm font-medium text-slate-700">
                  {t('calculator.diabetes.biologicalSex')}
                </Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {[
                    { value: 'male', labelKey: 'calculator.diabetes.male' },
                    { value: 'female', labelKey: 'calculator.diabetes.female' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 cursor-pointer hover:border-teal-300 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
                    >
                      <input type="radio" value={option.value} className="text-teal-600" {...register('biologicalSex')} />
                      <span className="text-sm font-medium text-slate-700">
                        {t(option.labelKey as Parameters<typeof t>[0])}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heightCm" className="text-sm font-medium text-slate-700">
                    {t('calculator.diabetes.heightCm')}
                  </Label>
                  <input
                    type="number"
                    id="heightCm"
                    placeholder={t('calculator.diabetes.heightPlaceholder')}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    {...register('heightCm', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="weightKg" className="text-sm font-medium text-slate-700">
                    {t('calculator.diabetes.weightKg')}
                  </Label>
                  <input
                    type="number"
                    id="weightKg"
                    placeholder={t('calculator.diabetes.weightPlaceholder')}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    {...register('weightKg', { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* BMI Display */}
              {bmi && bmiCategory && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {t('calculator.diabetes.bmiDisplay', { bmi, category: bmiCategory })}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="button"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => setStep(2)}
              >
                {t('calculator.diabetes.continueBtn')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {t('calculator.diabetes.step2Title')}
              </h4>

              {/* Exercise */}
              <div>
                <Label className="text-sm font-medium text-slate-700">
                  {t('calculator.diabetes.exerciseDays')}
                </Label>
                <div className="mt-1.5 flex gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((days) => (
                    <label key={days} className="flex-1">
                      <input
                        type="radio"
                        value={days}
                        className="sr-only"
                        {...register('exerciseDaysPerWeek', { valueAsNumber: true })}
                      />
                      <div className="h-9 flex items-center justify-center rounded-lg border border-slate-200 text-sm cursor-pointer hover:border-teal-300 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700 has-[:checked]:font-medium">
                        {days}
                      </div>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {t('calculator.diabetes.exerciseDaysHelper')}
                </p>
              </div>

              {/* Smoking */}
              <div>
                <Label className="text-sm font-medium text-slate-700">
                  {t('calculator.diabetes.smokingQuestion')}
                </Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {[
                    { value: false, labelKey: 'calculator.diabetes.noSmoking' },
                    { value: true, labelKey: 'calculator.diabetes.yesSmoking' },
                  ].map((option) => (
                    <label
                      key={String(option.value)}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 cursor-pointer hover:border-teal-300 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
                    >
                      <input
                        type="radio"
                        value={String(option.value)}
                        className="text-teal-600"
                        {...register('isSmoker', { setValueAs: (v) => v === 'true' })}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {t(option.labelKey as Parameters<typeof t>[0])}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Family History */}
              <div>
                <Label className="text-sm font-medium text-slate-700">
                  {t('calculator.diabetes.familyHistoryLabel')}
                </Label>
                <p className="text-xs text-slate-500 mb-2">
                  {t('calculator.diabetes.familyHistoryHelper')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: false, labelKey: 'calculator.diabetes.noFamilyHistory' },
                    { value: true, labelKey: 'calculator.diabetes.yesFamilyHistory' },
                  ].map((option) => (
                    <label
                      key={String(option.value)}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 cursor-pointer hover:border-teal-300 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
                    >
                      <input
                        type="radio"
                        value={String(option.value)}
                        className="text-teal-600"
                        {...register('hasDiabetesFamilyHistory', { setValueAs: (v) => v === 'true' })}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {t(option.labelKey as Parameters<typeof t>[0])}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">{t('calculator.diabetes.disclaimer')}</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  {t('calculator.diabetes.backBtn')}
                </Button>
                <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                  {t('calculator.diabetes.calculateBtn')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </form>
      ) : result && riskConfig ? (
        /* Results */
        <div className="p-6">
          {/* Risk Score Display */}
          <div className={`rounded-xl ${riskConfig.bg} border ${riskConfig.border} p-5 mb-6`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  {t('calculator.diabetes.resultTitle')}
                </div>
                <div className={`text-2xl font-bold ${riskConfig.text}`}>{riskLabel}</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${riskConfig.text}`}>{result.score}</div>
                <div className="text-xs text-slate-500">{t('calculator.diabetes.scoreLabel')}</div>
              </div>
            </div>

            {result.riskPercentage !== undefined && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{t('calculator.diabetes.lowGauge')}</span>
                  <span>{t('calculator.diabetes.highGauge')}</span>
                </div>
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 mb-1">
                  <div className="relative h-full" style={{ width: `${Math.min(result.riskPercentage * 2, 100)}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-orange-500 shadow" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interpretation */}
          <p className="text-sm text-slate-700 leading-relaxed mb-6">{interpretation}</p>

          {/* Action Plan */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-900 mb-3">
              {t('calculator.diabetes.actionsTitle')}
            </div>
            <div className="space-y-2.5">
              {actions.map((action, i) => (
                <div key={i} className="flex gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                  <div className="shrink-0 mt-0.5">
                    {action.priority === 'immediate' ? (
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-red-600">!</span>
                      </div>
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-teal-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{action.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{action.description}</div>
                    <Badge className={`mt-1.5 text-[10px] px-2 py-0 ${
                      action.priority === 'immediate' ? 'bg-red-50 text-red-600'
                        : action.priority === 'soon' ? 'bg-amber-50 text-amber-600'
                        : 'bg-teal-50 text-teal-600'
                    }`}>
                      {t(`common.priority.${action.priority}` as Parameters<typeof t>[0])}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Info */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 mb-4">
            <div className="text-xs text-slate-500">
              <strong>{t('calculator.diabetes.calculatorLabel')}</strong>{' '}
              {t('calculator.diabetes.title')} ·{' '}
              <strong>{t('calculator.diabetes.sourceLabel')}</strong>{' '}
              {t('calculator.diabetes.sourceValue')}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-5">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700">{t('calculator.diabetes.resultDisclaimer')}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => { setResult(null); setStep(1) }}
            >
              {t('calculator.diabetes.retakeBtn')}
            </Button>
            <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
              {t('calculator.diabetes.findCenterBtn')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
