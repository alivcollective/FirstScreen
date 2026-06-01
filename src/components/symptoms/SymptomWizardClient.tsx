'use client'

import { useReducer, useCallback } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { BodyMap } from './BodyMap'
import { SymptomChips } from './SymptomChips'
import { FollowUpQuestions } from './FollowUpQuestions'
import { ResultPage } from './ResultPage'
import { cn } from '@/lib/utils'
import type { WizardState, WizardAction, WizardProfile, WizardFollowUp } from '@/types/symptom'

// ── State ────────────────────────────────────────────────────

const INITIAL_PROFILE: WizardProfile = {
  age: '', sex: '', smoking: false, existing_conditions: [],
}

const INITIAL_FOLLOWUP: WizardFollowUp = {
  duration: '', severity: 5, progression: '',
  sudden_onset: null, cold_sweat: null,
  blood_amount: null, blood_first_time: null,
  weight_loss_kg: '', weight_loss_months: '',
  max_temp: '', has_rash: null,
}

const INITIAL_STATE: WizardState = {
  step: 1, profile: INITIAL_PROFILE,
  selected_region: null, selected_symptoms: [],
  custom_symptom: '', follow_up: INITIAL_FOLLOWUP,
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':         return { ...state, step: action.step }
    case 'UPDATE_PROFILE':  return { ...state, profile: { ...state.profile, [action.field]: action.value } }
    case 'SET_REGION':      return { ...state, selected_region: action.region }
    case 'TOGGLE_SYMPTOM': {
      const has = state.selected_symptoms.includes(action.id)
      return { ...state, selected_symptoms: has ? state.selected_symptoms.filter(s => s !== action.id) : [...state.selected_symptoms, action.id] }
    }
    case 'CLEAR_SYMPTOMS':      return { ...state, selected_symptoms: [], custom_symptom: '' }
    case 'SET_CUSTOM_SYMPTOM':  return { ...state, custom_symptom: action.text }
    case 'UPDATE_FOLLOWUP':     return { ...state, follow_up: { ...state.follow_up, [action.field]: action.value } }
    case 'RESET':               return INITIAL_STATE
    default:                    return state
  }
}

// ── Step Indicator ───────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'ข้อมูลของคุณ' },
  { num: 2, label: 'เลือกอาการ' },
  { num: 3, label: 'คำถามเพิ่มเติม' },
  { num: 4, label: 'ผลการตรวจ' },
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex sm:hidden items-center justify-between mb-2">
        <span className="text-sm font-semibold text-sky-700">{STEPS[currentStep - 1]?.label}</span>
        <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-3 py-0.5">{currentStep} / {STEPS.length}</span>
      </div>
      <div className="hidden sm:flex items-center">
        {STEPS.map(({ num, label }, i) => {
          const done = currentStep > num
          const active = currentStep === num
          return (
            <div key={num} className="flex items-center flex-1">
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-all',
                  active && 'border-sky-500 bg-sky-500 text-white',
                  done && 'border-sky-300 bg-sky-50 text-sky-600',
                  !active && !done && 'border-slate-200 bg-white text-slate-400'
                )}>
                  {done ? <Check className="h-4 w-4" /> : num}
                </div>
                <span className={cn('text-xs font-medium', active ? 'text-sky-700' : done ? 'text-sky-500' : 'text-slate-400')}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('h-px flex-1 mx-2', done ? 'bg-sky-300' : 'bg-slate-200')} />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
      </div>
    </div>
  )
}

// ── Step 1: Profile ──────────────────────────────────────────

const EXISTING_CONDITIONS = [
  { value: 'diabetes', label: 'เบาหวาน' },
  { value: 'hypertension', label: 'ความดันโลหิตสูง' },
  { value: 'heart_disease', label: 'โรคหัวใจ' },
  { value: 'asthma', label: 'หอบหืด / โรคปอด' },
  { value: 'cancer', label: 'ประวัติมะเร็ง' },
  { value: 'kidney', label: 'โรคไต' },
  { value: 'liver', label: 'โรคตับ' },
  { value: 'thyroid', label: 'โรคต่อมไทรอยด์' },
  { value: 'none', label: 'ไม่มีโรคประจำตัว' },
]

function Step1Profile({ state, dispatch, onNext }: {
  state: WizardState; dispatch: React.Dispatch<WizardAction>; onNext: () => void
}) {
  const { profile } = state
  const canNext = profile.age !== '' && profile.sex !== ''

  const toggleCondition = (v: string) => {
    const curr = profile.existing_conditions
    dispatch({ type: 'UPDATE_PROFILE', field: 'existing_conditions',
      value: curr.includes(v) ? curr.filter(c => c !== v) : [...curr, v] })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">บอกเราเกี่ยวกับตัวคุณ</h2>
        <p className="text-sm text-slate-500">ข้อมูลเหล่านี้ช่วยให้การวิเคราะห์แม่นยำขึ้น</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">อายุ (ปี) *</label>
        <input type="number" min="1" max="120" placeholder="เช่น 35" value={profile.age}
          onChange={e => dispatch({ type: 'UPDATE_PROFILE', field: 'age', value: e.target.value })}
          className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          style={{ fontSize: '16px' }} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">เพศ *</label>
        <div className="flex gap-3 max-w-xs">
          {[{ v: 'male', l: 'ชาย' }, { v: 'female', l: 'หญิง' }, { v: 'other', l: 'อื่นๆ' }].map(({ v, l }) => (
            <button key={v} type="button" onClick={() => dispatch({ type: 'UPDATE_PROFILE', field: 'sex', value: v })}
              className={cn('flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-all min-h-[48px]',
                profile.sex === v ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 hover:border-sky-200')}
            >{l}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">สูบบุหรี่หรือไม่?</label>
        <div className="flex gap-3 max-w-xs">
          {[{ v: false, l: 'ไม่สูบ' }, { v: true, l: 'สูบบุหรี่' }].map(({ v, l }) => (
            <button key={String(v)} type="button" onClick={() => dispatch({ type: 'UPDATE_PROFILE', field: 'smoking', value: v })}
              className={cn('flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-all min-h-[48px]',
                profile.smoking === v ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 hover:border-sky-200')}
            >{l}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">โรคประจำตัว (เลือกทั้งหมดที่มี)</label>
        <div className="flex flex-wrap gap-2">
          {EXISTING_CONDITIONS.map(({ value, label }) => (
            <button key={value} type="button" onClick={() => toggleCondition(value)}
              className={cn('rounded-full border px-3 py-2 text-xs font-medium transition-all min-h-[40px]',
                profile.existing_conditions.includes(value)
                  ? 'border-sky-400 bg-sky-50 text-sky-700'
                  : 'border-slate-200 text-slate-600 hover:border-sky-300')}
            >{label}</button>
          ))}
        </div>
      </div>

      <button onClick={onNext} disabled={!canNext}
        className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
        ถัดไป — เลือกอาการ <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}

// ── Main wizard component ────────────────────────────────────

export function SymptomWizardClient() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const goNext = () => {
    if (state.step < 4) dispatch({ type: 'SET_STEP', step: (state.step + 1) as WizardState['step'] })
  }
  const goBack = () => {
    if (state.step > 1) dispatch({ type: 'SET_STEP', step: (state.step - 1) as WizardState['step'] })
  }
  const handleEmergency = useCallback(() => {}, [])

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <StepIndicator currentStep={state.step} />

      {state.step === 1 && (
        <Step1Profile state={state} dispatch={dispatch} onNext={goNext} />
      )}

      {state.step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">เลือกบริเวณที่มีอาการ</h2>
            <p className="text-sm text-slate-500">คลิกที่แผนที่ร่างกาย จากนั้นเลือกอาการด้านล่าง</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <BodyMap selectedRegion={state.selected_region}
                onSelectRegion={r => dispatch({ type: 'SET_REGION', region: r })} />
            </div>
            <div className="flex-1 min-w-0">
              <SymptomChips
                selectedRegion={state.selected_region}
                selectedSymptoms={state.selected_symptoms}
                customSymptom={state.custom_symptom}
                onToggleSymptom={id => dispatch({ type: 'TOGGLE_SYMPTOM', id })}
                onClearAll={() => dispatch({ type: 'CLEAR_SYMPTOMS' })}
                onCustomSymptomChange={text => dispatch({ type: 'SET_CUSTOM_SYMPTOM', text })} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={goBack}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
            </button>
            <button onClick={goNext}
              disabled={state.selected_symptoms.length === 0 && !state.custom_symptom.trim()}
              className="flex-1 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              ถัดไป — คำถามเพิ่มเติม <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {state.step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">คำถามเพิ่มเติม</h2>
            <p className="text-sm text-slate-500">ช่วยให้การวิเคราะห์แม่นยำขึ้น — ใช้เวลา 1–2 นาที</p>
          </div>
          <FollowUpQuestions
            selectedSymptoms={state.selected_symptoms}
            followUp={state.follow_up}
            onChange={(field, value) => dispatch({ type: 'UPDATE_FOLLOWUP', field, value })}
            onEmergencyDetected={handleEmergency} />
          <div className="flex gap-3 pt-2">
            <button onClick={goBack}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
            </button>
            <button onClick={goNext}
              disabled={!state.follow_up.duration || !state.follow_up.progression}
              className="flex-1 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              ดูผลการตรวจ <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {state.step === 4 && (
        <ResultPage state={state} onReset={() => dispatch({ type: 'RESET' })} />
      )}
    </div>
  )
}
