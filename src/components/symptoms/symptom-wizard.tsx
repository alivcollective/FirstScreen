'use client'

import { useState, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { ArrowRight, ArrowLeft, Search, X, CheckCircle2, Stethoscope, FlaskConical, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { UrgencyBadge } from '@/components/shared/urgency-badge'
import { EvidenceBadge } from '@/components/shared/evidence-badge'
import {
  SYMPTOMS,
  FOLLOW_UP_QUESTIONS,
  BODY_SYSTEM_LABELS,
  EXISTING_CONDITIONS_OPTIONS,
  getQuestionsForSymptoms,
  detectRedFlags,
  scoreConditionGroups,
  determineUrgency,
  type UrgencyLevel,
  type ConditionGroup,
} from '@/lib/symptoms-data'
import { cn } from '@/lib/utils'

// ============================================================
// TYPES
// ============================================================

interface UserProfile {
  age: string
  sex: 'male' | 'female' | 'other' | ''
  isPregnant: boolean
  isSmoker: boolean
  alcoholUse: 'none' | 'occasional' | 'regular' | ''
  existingConditions: string[]
}

interface WizardState {
  step: 1 | 2 | 3 | 4
  profile: UserProfile
  selectedSymptomIds: string[]
  followUpAnswers: Record<string, string>
}

const INITIAL_PROFILE: UserProfile = {
  age: '',
  sex: '',
  isPregnant: false,
  isSmoker: false,
  alcoholUse: '',
  existingConditions: [],
}

const STEPS = [
  { th: 'ข้อมูลส่วนตัว', en: 'Your Profile' },
  { th: 'เลือกอาการ', en: 'Select Symptoms' },
  { th: 'คำถามเพิ่มเติม', en: 'Follow-up' },
  { th: 'ผลการนำทาง', en: 'Results' },
]

// ============================================================
// MAIN WIZARD
// ============================================================

export function SymptomWizard() {
  const locale = useLocale()
  const isTh = locale !== 'en'

  const [state, setState] = useState<WizardState>({
    step: 1,
    profile: INITIAL_PROFILE,
    selectedSymptomIds: [],
    followUpAnswers: {},
  })

  const [symptomSearch, setSymptomSearch] = useState('')

  // Computed questions for selected symptoms
  const questions = useMemo(
    () => getQuestionsForSymptoms(state.selectedSymptomIds),
    [state.selectedSymptomIds]
  )

  // Computed results
  const results = useMemo(() => {
    if (state.step < 4) return null
    const age = parseInt(state.profile.age) || null
    const profile = { age, isSmoker: state.profile.isSmoker, sex: state.profile.sex }
    const redFlags = detectRedFlags(state.selectedSymptomIds, state.followUpAnswers)
    const conditionGroups = scoreConditionGroups(state.selectedSymptomIds, state.followUpAnswers, profile)
    const urgency = determineUrgency(state.selectedSymptomIds, state.followUpAnswers, redFlags)
    return { redFlags, conditionGroups, urgency }
  }, [state.step, state.selectedSymptomIds, state.followUpAnswers, state.profile])

  // Filtered symptoms for search
  const filteredSymptoms = useMemo(() => {
    if (!symptomSearch.trim()) return SYMPTOMS
    const q = symptomSearch.toLowerCase()
    return SYMPTOMS.filter(s =>
      s.nameTh.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.keywords.some(k => k.toLowerCase().includes(q))
    )
  }, [symptomSearch])

  // Navigation helpers
  const canProceed = () => {
    if (state.step === 1) return state.profile.age !== '' && state.profile.sex !== ''
    if (state.step === 2) return state.selectedSymptomIds.length > 0
    if (state.step === 3) return true // optional questions
    return true
  }

  const goNext = () => {
    if (!canProceed()) return
    if (state.step === 2 && questions.length === 0) {
      setState(s => ({ ...s, step: 4 }))
    } else {
      setState(s => ({ ...s, step: (s.step + 1) as WizardState['step'] }))
    }
  }

  const goBack = () => {
    setState(s => ({ ...s, step: (s.step - 1) as WizardState['step'] }))
  }

  const reset = () => {
    setState({ step: 1, profile: INITIAL_PROFILE, selectedSymptomIds: [], followUpAnswers: {} })
    setSymptomSearch('')
  }

  const toggleSymptom = (id: string) => {
    setState(s => ({
      ...s,
      selectedSymptomIds: s.selectedSymptomIds.includes(id)
        ? s.selectedSymptomIds.filter(x => x !== id)
        : [...s.selectedSymptomIds, id],
    }))
  }

  const toggleCondition = (value: string) => {
    setState(s => ({
      ...s,
      profile: {
        ...s.profile,
        existingConditions: s.profile.existingConditions.includes(value)
          ? s.profile.existingConditions.filter(x => x !== value)
          : [...s.profile.existingConditions, value],
      },
    }))
  }

  const setAnswer = (questionId: string, value: string) => {
    setState(s => ({
      ...s,
      followUpAnswers: { ...s.followUpAnswers, [questionId]: value },
    }))
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step, i) => {
            const num = i + 1
            const isActive = state.step === num
            const isDone = state.step > num
            return (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors',
                  isActive && 'border-teal-500 bg-teal-500 text-white',
                  isDone && 'border-teal-300 bg-teal-50 text-teal-600',
                  !isActive && !isDone && 'border-slate-200 bg-white text-slate-400'
                )}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : num}
                </div>
                <span className={cn(
                  'hidden sm:block text-xs font-medium transition-colors',
                  isActive ? 'text-teal-700' : isDone ? 'text-teal-500' : 'text-slate-400'
                )}>
                  {isTh ? step.th : step.en}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={cn('h-px flex-1 mx-2', isDone ? 'bg-teal-300' : 'bg-slate-200')} />
                )}
              </div>
            )
          })}
        </div>
        {/* Progress bar */}
        <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${((state.step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Profile */}
      {state.step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {isTh ? 'บอกเราเกี่ยวกับตัวคุณ' : 'Tell us about yourself'}
            </h2>
            <p className="text-sm text-slate-500">
              {isTh ? 'ข้อมูลเหล่านี้ช่วยให้การนำทางสุขภาพของคุณแม่นยำมากขึ้น' : 'This helps personalize your health navigation'}
            </p>
          </div>

          <MedicalDisclaimer variant="banner" locale={locale} />

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isTh ? 'อายุ (ปี) *' : 'Age (years) *'}
            </label>
            <input
              type="number"
              min="1" max="120"
              placeholder={isTh ? 'เช่น 35' : 'e.g. 35'}
              value={state.profile.age}
              onChange={e => setState(s => ({ ...s, profile: { ...s.profile, age: e.target.value } }))}
              className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isTh ? 'เพศกำเนิด *' : 'Biological sex *'}
            </label>
            <div className="flex gap-3">
              {[
                { value: 'male', th: 'ชาย', en: 'Male' },
                { value: 'female', th: 'หญิง', en: 'Female' },
                { value: 'other', th: 'อื่นๆ', en: 'Other' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setState(s => ({ ...s, profile: { ...s.profile, sex: opt.value as UserProfile['sex'] } }))}
                  className={cn(
                    'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                    state.profile.sex === opt.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-teal-200'
                  )}
                >
                  {isTh ? opt.th : opt.en}
                </button>
              ))}
            </div>
          </div>

          {/* Pregnancy (female only) */}
          {state.profile.sex === 'female' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {isTh ? 'ตั้งครรภ์หรือไม่?' : 'Are you pregnant?'}
              </label>
              <div className="flex gap-3 max-w-xs">
                {[
                  { value: true, th: 'ใช่', en: 'Yes' },
                  { value: false, th: 'ไม่', en: 'No' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setState(s => ({ ...s, profile: { ...s.profile, isPregnant: opt.value } }))}
                    className={cn(
                      'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                      state.profile.isPregnant === opt.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-600 hover:border-teal-200'
                    )}
                  >
                    {isTh ? opt.th : opt.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Smoker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isTh ? 'สูบบุหรี่หรือไม่?' : 'Do you smoke?'}
            </label>
            <div className="flex gap-3 max-w-xs">
              {[
                { value: true, th: 'ใช่', en: 'Yes' },
                { value: false, th: 'ไม่', en: 'No' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setState(s => ({ ...s, profile: { ...s.profile, isSmoker: opt.value } }))}
                  className={cn(
                    'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                    state.profile.isSmoker === opt.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-teal-200'
                  )}
                >
                  {isTh ? opt.th : opt.en}
                </button>
              ))}
            </div>
          </div>

          {/* Existing conditions */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isTh ? 'โรคประจำตัว (เลือกทั้งหมดที่มี)' : 'Existing conditions (select all that apply)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {EXISTING_CONDITIONS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleCondition(opt.value)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    state.profile.existingConditions.includes(opt.value)
                      ? 'border-teal-400 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-teal-200'
                  )}
                >
                  {isTh ? opt.labelTh : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={goNext}
            disabled={!canProceed()}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {isTh ? 'ถัดไป — เลือกอาการ' : 'Next — Select Symptoms'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* STEP 2: Symptoms */}
      {state.step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {isTh ? 'คุณมีอาการอะไรบ้าง?' : 'What symptoms do you have?'}
            </h2>
            <p className="text-sm text-slate-500">
              {isTh ? 'เลือกทุกอาการที่คุณมี (เลือกได้มากกว่า 1 ข้อ)' : 'Select all symptoms you are experiencing'}
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={isTh ? 'ค้นหาอาการ เช่น ปวดหัว, chest pain...' : 'Search symptoms, e.g. headache, chest pain...'}
              value={symptomSearch}
              onChange={e => setSymptomSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {symptomSearch && (
              <button
                onClick={() => setSymptomSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Selected symptoms chips */}
          {state.selectedSymptomIds.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-teal-50 border border-teal-200">
              <span className="text-xs font-semibold text-teal-700 w-full mb-1">
                {isTh ? `เลือกแล้ว ${state.selectedSymptomIds.length} อาการ` : `${state.selectedSymptomIds.length} selected`}
              </span>
              {state.selectedSymptomIds.map(id => {
                const sym = SYMPTOMS.find(s => s.id === id)
                if (!sym) return null
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800"
                  >
                    {isTh ? sym.nameTh : sym.nameEn}
                    <button onClick={() => toggleSymptom(id)} className="hover:text-red-600 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Symptom list */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {filteredSymptoms.map(symptom => {
              const isSelected = state.selectedSymptomIds.includes(symptom.id)
              const bodyLabel = BODY_SYSTEM_LABELS[symptom.bodySystem].th
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all',
                    isSelected
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30'
                  )}
                >
                  <div>
                    <div className={cn('text-sm font-medium', isSelected ? 'text-teal-700' : 'text-slate-800')}>
                      {isTh ? symptom.nameTh : symptom.nameEn}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {isTh ? bodyLabel : symptom.nameEn} {!isTh && `· ${bodyLabel}`}
                    </div>
                  </div>
                  <div className={cn(
                    'h-5 w-5 rounded-full border-2 transition-all shrink-0',
                    isSelected ? 'border-teal-500 bg-teal-500' : 'border-slate-300'
                  )}>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={goBack} className="flex-1 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isTh ? 'ย้อนกลับ' : 'Back'}
            </Button>
            <Button
              onClick={goNext}
              disabled={!canProceed()}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl disabled:opacity-50"
            >
              {questions.length > 0
                ? (isTh ? 'ถัดไป — คำถามเพิ่มเติม' : 'Next — Follow-up')
                : (isTh ? 'ดูผล' : 'See Results')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Follow-up Questions */}
      {state.step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {isTh ? 'คำถามเพิ่มเติม' : 'A few more questions'}
            </h2>
            <p className="text-sm text-slate-500">
              {isTh ? 'คำตอบจะช่วยให้การนำทางของคุณแม่นยำขึ้น' : 'Your answers help us navigate you more accurately'}
            </p>
          </div>

          {/* Emergency detection — show in real-time */}
          {(() => {
            const flags = detectRedFlags(state.selectedSymptomIds, state.followUpAnswers)
            const emergencyFlag = flags.find(f => f.urgencyLevel === 'emergency')
            if (!emergencyFlag) return null
            return (
              <MedicalDisclaimer variant="emergency" locale={locale} />
            )
          })()}

          {questions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              {isTh ? 'ไม่มีคำถามเพิ่มเติม กดดูผลได้เลย' : 'No additional questions. Proceed to results.'}
            </div>
          ) : (
            questions.map(question => (
              <div key={question.id} className="space-y-2.5">
                <p className="text-sm font-semibold text-slate-800">
                  {isTh ? question.questionTh : question.questionEn}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {question.options?.map(opt => {
                    const isSelected = state.followUpAnswers[question.id] === opt.value
                    const isRedFlag = question.redFlagValues?.includes(opt.value) ?? false
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAnswer(question.id, opt.value)}
                        className={cn(
                          'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all text-sm',
                          isSelected && isRedFlag && 'border-orange-400 bg-orange-50 text-orange-800',
                          isSelected && !isRedFlag && 'border-teal-400 bg-teal-50 text-teal-800',
                          !isSelected && 'border-slate-200 bg-white hover:border-teal-200 text-slate-700'
                        )}
                      >
                        <span>{isTh ? opt.labelTh : opt.labelEn}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={goBack} className="flex-1 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isTh ? 'ย้อนกลับ' : 'Back'}
            </Button>
            <Button
              onClick={goNext}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
            >
              {isTh ? 'ดูผลการนำทาง' : 'See Results'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Results */}
      {state.step === 4 && results && (
        <div className="space-y-6">
          {/* Emergency Banner — always first */}
          {results.urgency === 'emergency' && (
            <MedicalDisclaimer variant="emergency" locale={locale} />
          )}

          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {isTh ? 'ผลการนำทางสุขภาพของคุณ' : 'Your Health Navigation Results'}
            </h2>
            <p className="text-xs text-slate-500">
              {isTh
                ? 'ผลต่อไปนี้คือการนำทางเพื่อการศึกษา ไม่ใช่การวินิจฉัยโรค'
                : 'The following is educational navigation, not a medical diagnosis'}
            </p>
          </div>

          {/* Urgency Level */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">
              {isTh ? 'ระดับความเร่งด่วนที่แนะนำ:' : 'Recommended urgency:'}
            </span>
            <UrgencyBadge level={results.urgency} locale={locale} size="md" />
          </div>

          {/* Disclaimer */}
          <MedicalDisclaimer variant="banner" locale={locale} showEmergencyNumber />

          {/* Condition Groups */}
          {results.conditionGroups.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {isTh ? 'ภาวะที่อาจเกี่ยวข้อง — ควรได้รับการประเมินเพิ่มเติม' : 'Possible related condition groups — Requires medical evaluation'}
              </h3>
              <p className="text-xs text-slate-500 -mt-2">
                {isTh
                  ? 'นี่ไม่ใช่การวินิจฉัย แพทย์เท่านั้นที่สามารถวินิจฉัยโรคได้'
                  : 'These are navigation guides only. Only a doctor can diagnose.'}
              </p>

              {results.conditionGroups.map(group => (
                <ConditionGroupCard key={group.id} group={group} locale={locale} isTh={isTh} />
              ))}
            </div>
          )}

          {/* No results */}
          {results.conditionGroups.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <Stethoscope className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600">
                {isTh
                  ? 'ไม่พบภาวะที่เด่นชัดจากอาการที่เลือก อย่างไรก็ตาม หากมีข้อสงสัย ควรปรึกษาแพทย์'
                  : 'No specific condition groups identified. If concerned, consult a healthcare professional.'}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
            >
              {isTh ? 'ประเมินใหม่' : 'Start Over'}
            </button>
            <a
              href="/screening"
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition-colors"
            >
              {isTh ? 'ดูแผนตรวจคัดกรอง' : 'View Screening Plan'}
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// CONDITION GROUP CARD
// ============================================================

function ConditionGroupCard({
  group,
  locale,
  isTh,
}: {
  group: ConditionGroup
  locale: string
  isTh: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  const urgencyColors: Record<UrgencyLevel, string> = {
    emergency: 'border-red-200 bg-red-50',
    urgent: 'border-orange-200 bg-orange-50',
    soon: 'border-amber-200 bg-amber-50',
    routine: 'border-teal-100 bg-teal-50',
  }

  return (
    <div className={cn('rounded-2xl border p-5 transition-colors', urgencyColors[group.urgencyLevel])}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-base font-semibold text-slate-900 leading-snug">
          {isTh ? group.nameTh : group.nameEn}
        </h4>
        <UrgencyBadge level={group.urgencyLevel} locale={locale} size="sm" />
      </div>

      <p className="text-sm text-slate-600 mb-3 leading-relaxed">
        {isTh ? group.descriptionTh : group.descriptionTh}
      </p>

      {/* Specialty */}
      <div className="flex items-center gap-2 mb-3">
        <Stethoscope className="h-4 w-4 text-slate-400 shrink-0" />
        <span className="text-sm text-slate-700">
          <span className="font-medium">{isTh ? 'แพทย์ที่ควรพบ:' : 'See:'}</span>{' '}
          {isTh ? group.specialtyTh : group.specialtyEn}
        </span>
      </div>

      {/* Toggle details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
      >
        {expanded
          ? (isTh ? 'ซ่อนรายละเอียด' : 'Hide details')
          : (isTh ? 'ดูรายละเอียดเพิ่มเติม' : 'View details')}
        <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-90')} />
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t border-slate-200/60">
          {/* Suggested Tests */}
          {group.suggestedTestsTh.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <FlaskConical className="h-4 w-4 text-teal-500" />
                <span className="text-xs font-semibold text-slate-700">
                  {isTh ? 'การตรวจที่อาจแนะนำ' : 'Possible tests'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.suggestedTestsTh.map((test, i) => (
                  <span key={i} className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600">
                    {test}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags */}
          {group.redFlagsTh.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-700 mb-1.5">
                {isTh ? '⚠ สัญญาณเตือนที่ต้องพบแพทย์ด่วน' : '⚠ Red flags — seek care urgently'}
              </p>
              <ul className="space-y-0.5">
                {group.redFlagsTh.map((flag, i) => (
                  <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                    <span className="shrink-0 mt-0.5">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence */}
          <EvidenceBadge evidence={group.evidence} locale={locale} />
        </div>
      )}
    </div>
  )
}
