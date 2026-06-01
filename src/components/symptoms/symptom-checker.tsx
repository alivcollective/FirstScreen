'use client'

import { useReducer, useMemo } from 'react'
import { useLocale } from 'next-intl'
import {
  Phone, ArrowRight, ArrowLeft, CheckCircle2, X,
  MapPin, Activity, AlertTriangle, Clock, Calendar, Leaf,
  ChevronRight, Search, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BodyMap } from './body-map'
import {
  SYMPTOM_DATA,
  CONDITIONS,
  getConditionsForSymptoms,
  determineUrgencyLevel,
  type BodyRegion,
} from '@/data/symptom-conditions'

// ============================================================
// STATE
// ============================================================

interface CheckerProfile {
  age: string
  sex: 'male' | 'female' | ''
  isSmoker: boolean
  existingConditions: string[]
}

interface FollowUp {
  duration: string     // '<24h' | '2-7d' | '1-4w' | '>1m'
  severity: number     // 1-10
  progression: string  // 'worsening' | 'stable' | 'improving'
  onsetType: string    // 'sudden' | 'gradual' — only for chest/breath
}

interface CheckerState {
  step: 1 | 2 | 3 | 4
  profile: CheckerProfile
  selectedRegion: BodyRegion | null
  selectedSymptoms: string[]
  freeText: string
  followUp: FollowUp
  urgencyAcknowledged: boolean
}

type Action =
  | { type: 'SET_STEP'; step: CheckerState['step'] }
  | { type: 'SET_PROFILE'; field: keyof CheckerProfile; value: string | boolean | string[] }
  | { type: 'SET_REGION'; region: BodyRegion | null }
  | { type: 'TOGGLE_SYMPTOM'; id: string }
  | { type: 'SET_FREE_TEXT'; text: string }
  | { type: 'SET_FOLLOWUP'; field: keyof FollowUp; value: string | number }
  | { type: 'ACK_URGENCY' }
  | { type: 'RESET' }

const INITIAL: CheckerState = {
  step: 1,
  profile: { age: '', sex: '', isSmoker: false, existingConditions: [] },
  selectedRegion: null,
  selectedSymptoms: [],
  freeText: '',
  followUp: { duration: '', severity: 5, progression: '', onsetType: '' },
  urgencyAcknowledged: false,
}

function reducer(state: CheckerState, action: Action): CheckerState {
  switch (action.type) {
    case 'SET_STEP': return { ...state, step: action.step }
    case 'SET_PROFILE': return { ...state, profile: { ...state.profile, [action.field]: action.value } }
    case 'SET_REGION': return { ...state, selectedRegion: action.region }
    case 'TOGGLE_SYMPTOM': {
      const exists = state.selectedSymptoms.includes(action.id)
      return {
        ...state,
        selectedSymptoms: exists
          ? state.selectedSymptoms.filter(s => s !== action.id)
          : [...state.selectedSymptoms, action.id],
      }
    }
    case 'SET_FREE_TEXT': return { ...state, freeText: action.text }
    case 'SET_FOLLOWUP': return { ...state, followUp: { ...state.followUp, [action.field]: action.value } }
    case 'ACK_URGENCY': return { ...state, urgencyAcknowledged: true }
    case 'RESET': return INITIAL
    default: return state
  }
}

// ============================================================
// STEP INDICATOR
// ============================================================

const STEP_LABELS = ['ข้อมูลของคุณ', 'เลือกอาการ', 'คำถามเพิ่มเติม', 'ผลการวิเคราะห์']

function StepIndicator({ step }: { step: number }) {
  const totalSteps = STEP_LABELS.length
  return (
    <div className="mb-8">
      {/* Mobile: compact step counter */}
      <div className="flex sm:hidden items-center justify-between mb-3">
        <span className="text-sm font-semibold text-teal-700">
          {STEP_LABELS[step - 1]}
        </span>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-3 py-1">
          {step} / {totalSteps}
        </span>
      </div>
      {/* Desktop: full step row */}
      <div className="hidden sm:flex items-center">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1
          const isDone = step > num
          const isActive = step === num
          return (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-all',
                  isActive && 'border-teal-500 bg-teal-500 text-white',
                  isDone && 'border-teal-300 bg-teal-50 text-teal-600',
                  !isActive && !isDone && 'border-slate-200 bg-white text-slate-400'
                )}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : num}
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-teal-700' : isDone ? 'text-teal-500' : 'text-slate-400'
                )}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={cn('h-px flex-1 mx-2', isDone ? 'bg-teal-300' : 'bg-slate-200')} />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ============================================================
// URGENCY BANNER — shows real-time when critical symptom selected
// ============================================================

function UrgencyBanner({ show, onAck }: { show: boolean; onAck: () => void }) {
  if (!show) return null
  return (
    <div className="rounded-2xl bg-red-50 border-2 border-red-400 p-4 mb-5 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 shrink-0">
          <Phone className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-red-900 mb-1">⚠ อาการที่เลือกอาจเป็นภาวะฉุกเฉิน</p>
          <p className="text-xs text-red-800 mb-3">หากอาการรุนแรง อย่ารอกรอกแบบสอบถาม — ไปห้องฉุกเฉินหรือโทรทันที</p>
          <div className="flex flex-wrap gap-2">
            <a href="tel:1669" className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">
              <Phone className="h-3.5 w-3.5" /> โทร 1669 (EMS)
            </a>
            <button onClick={onAck} className="text-xs font-medium text-red-700 underline">
              อาการไม่รุนแรง ทำต่อ →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP 1 — Profile
// ============================================================

const EXISTING_CONDITIONS = [
  { value: 'diabetes', label: 'เบาหวาน' },
  { value: 'hypertension', label: 'ความดันโลหิตสูง' },
  { value: 'heart', label: 'โรคหัวใจ' },
  { value: 'asthma', label: 'หอบหืด / โรคปอด' },
  { value: 'cancer', label: 'ประวัติมะเร็ง' },
  { value: 'kidney', label: 'โรคไต' },
  { value: 'liver', label: 'โรคตับ' },
  { value: 'none', label: 'ไม่มีโรคประจำตัว' },
]

function Step1Profile({ state, dispatch, onNext }: { state: CheckerState; dispatch: React.Dispatch<Action>; onNext: () => void }) {
  const { profile } = state
  const canProceed = profile.age !== '' && profile.sex !== ''

  const toggleCondition = (v: string) => {
    const curr = profile.existingConditions
    dispatch({
      type: 'SET_PROFILE',
      field: 'existingConditions',
      value: curr.includes(v) ? curr.filter(c => c !== v) : [...curr, v],
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">บอกเราเกี่ยวกับตัวคุณ</h2>
        <p className="text-sm text-slate-500">ข้อมูลนี้ช่วยให้การวิเคราะห์อาการแม่นยำขึ้น และไม่ถูกบันทึกไว้</p>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          ข้อมูลนี้ใช้เพื่อการนำทางสุขภาพเท่านั้น ไม่ใช่การวินิจฉัยโรค กรุณาพบแพทย์เพื่อการวินิจฉัยที่ถูกต้อง
        </p>
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">อายุ (ปี) *</label>
        <input
          type="number" min="1" max="120" placeholder="เช่น 35"
          value={profile.age}
          onChange={e => dispatch({ type: 'SET_PROFILE', field: 'age', value: e.target.value })}
          className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          style={{ fontSize: '16px' }} // prevent iOS zoom
        />
      </div>

      {/* Sex */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">เพศกำเนิด *</label>
        <div className="flex gap-3 max-w-xs">
          {[{ v: 'male', l: 'ชาย (Male)' }, { v: 'female', l: 'หญิง (Female)' }].map(({ v, l }) => (
            <button key={v} onClick={() => dispatch({ type: 'SET_PROFILE', field: 'sex', value: v })}
              className={cn('flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all min-h-[44px]',
                profile.sex === v ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-200')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Smoking */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">สูบบุหรี่?</label>
        <div className="flex gap-3 max-w-xs">
          {[{ v: false, l: 'ไม่สูบ' }, { v: true, l: 'สูบบุหรี่' }].map(({ v, l }) => (
            <button key={String(v)} onClick={() => dispatch({ type: 'SET_PROFILE', field: 'isSmoker', value: v })}
              className={cn('flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all min-h-[44px]',
                profile.isSmoker === v ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-200')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Existing Conditions */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">โรคประจำตัว (เลือกทั้งหมดที่มี)</label>
        <div className="flex flex-wrap gap-2">
          {EXISTING_CONDITIONS.map(({ value, label }) => (
            <button key={value} onClick={() => toggleCondition(value)}
              className={cn('rounded-full border px-3 py-2 text-xs font-medium transition-all min-h-[40px]',
                profile.existingConditions.includes(value)
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:border-teal-200')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={onNext} disabled={!canProceed}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
        ถัดไป — เลือกอาการ <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

// ============================================================
// STEP 2 — Body Map + Symptom Chips
// ============================================================

function Step2Symptoms({ state, dispatch, onNext, onBack }: {
  state: CheckerState; dispatch: React.Dispatch<Action>; onNext: () => void; onBack: () => void
}) {
  const symptomsForRegion = state.selectedRegion ? SYMPTOM_DATA[state.selectedRegion] : []

  // All symptoms flat (for display count)
  const allSymptoms = Object.values(SYMPTOM_DATA).flat()

  // Check if any critical symptom selected
  const hasCritical = state.selectedSymptoms.some(id => {
    const s = allSymptoms.find(x => x.id === id)
    return s?.severity === 'critical'
  })

  const showUrgency = hasCritical && !state.urgencyAcknowledged

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">คุณมีอาการตรงไหนบ้าง?</h2>
        <p className="text-sm text-slate-500">คลิกที่ส่วนของร่างกายเพื่อเลือกอาการ สามารถเลือกได้หลายอาการ</p>
      </div>

      <UrgencyBanner show={showUrgency} onAck={() => dispatch({ type: 'ACK_URGENCY' })} />

      {/* Selected symptoms chips */}
      {state.selectedSymptoms.length > 0 && (
        <div className="rounded-xl bg-teal-50 border border-teal-200 p-3">
          <p className="text-xs font-semibold text-teal-700 mb-2">
            เลือกแล้ว {state.selectedSymptoms.length} อาการ
          </p>
          <div className="flex flex-wrap gap-1.5">
            {state.selectedSymptoms.map(id => {
              const sym = allSymptoms.find(s => s.id === id)
              if (!sym) return null
              const severityColor = sym.severity === 'critical' ? 'bg-red-100 text-red-700 border-red-300'
                : sym.severity === 'high' ? 'bg-orange-100 text-orange-700 border-orange-300'
                : 'bg-teal-100 text-teal-800 border-teal-300'
              return (
                <span key={id} className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', severityColor)}>
                  {sym.label}
                  <button onClick={() => dispatch({ type: 'TOGGLE_SYMPTOM', id })} className="hover:opacity-70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Body map */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <BodyMap
            selectedRegion={state.selectedRegion}
            onSelectRegion={r => dispatch({ type: 'SET_REGION', region: r })}
          />
        </div>

        {/* Symptom chips for selected region */}
        <div className="flex-1 min-w-0">
          {state.selectedRegion ? (
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                อาการบริเวณ{' '}
                <span className="text-teal-700">
                  {{
                    head: 'ศีรษะ / คอ', chest: 'หน้าอก', abdomen: 'ท้อง',
                    back: 'หลัง', arms: 'แขน / มือ', legs: 'ขา / เท้า',
                    skin: 'ผิวหนัง', general: 'ทั่วร่างกาย',
                  }[state.selectedRegion]}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {symptomsForRegion.map(symptom => {
                  const isSelected = state.selectedSymptoms.includes(symptom.id)
                  const sevBorder = symptom.severity === 'critical' ? 'border-red-300'
                    : symptom.severity === 'high' ? 'border-orange-200'
                    : 'border-slate-200'
                  const selStyle = isSelected
                    ? symptom.severity === 'critical' ? 'border-red-400 bg-red-50 text-red-700'
                      : symptom.severity === 'high' ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-teal-400 bg-teal-50 text-teal-700'
                    : `${sevBorder} bg-white text-slate-700 hover:border-teal-200`

                  return (
                    <button key={symptom.id} onClick={() => dispatch({ type: 'TOGGLE_SYMPTOM', id: symptom.id })}
                      className={cn('flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all min-h-[40px]', selStyle)}>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                      {symptom.label}
                      {symptom.severity === 'critical' && !isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 text-slate-400">
              <Search className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">คลิกส่วนของร่างกายเพื่อดูอาการ</p>
              <p className="text-xs mt-1">หรือเลือก หลัง / ผิวหนัง / อาการทั่วไป ด้านล่างรูป</p>
            </div>
          )}
        </div>
      </div>

      {/* Free text */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">อาการอื่นๆ ที่ไม่ได้อยู่ในรายการ (ไม่บังคับ)</label>
        <input type="text" placeholder="เช่น เจ็บเวลาหายใจ, ปัสสาวะแสบ..."
          value={state.freeText}
          onChange={e => dispatch({ type: 'SET_FREE_TEXT', text: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          style={{ fontSize: '16px' }} // prevent iOS zoom
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> ย้อนกลับ
        </Button>
        <Button onClick={onNext} disabled={state.selectedSymptoms.length === 0}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl disabled:opacity-50">
          ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// STEP 3 — Follow-up Questions
// ============================================================

const DURATION_OPTIONS = [
  { value: '<24h', label: 'น้อยกว่า 24 ชั่วโมง' },
  { value: '2-7d', label: '2–7 วัน' },
  { value: '1-4w', label: '1–4 สัปดาห์' },
  { value: '>1m', label: 'มากกว่า 1 เดือน' },
]

const SEVERITY_EMOJIS = ['', '😊', '🙂', '😐', '😕', '😟', '😣', '😰', '😱', '🤕', '💀']

const PROGRESSION_OPTIONS = [
  { value: 'worsening', label: 'แย่ลงเรื่อยๆ', icon: '📈' },
  { value: 'stable', label: 'คงที่', icon: '➡️' },
  { value: 'improving', label: 'ดีขึ้นบ้าง', icon: '📉' },
]

const ONSET_OPTIONS = [
  { value: 'sudden', label: 'เกิดขึ้นทันที (ภายในนาที)' },
  { value: 'gradual', label: 'ค่อยๆ เป็น (ชั่วโมง/วัน)' },
]

function Step3FollowUp({ state, dispatch, onNext, onBack }: {
  state: CheckerState; dispatch: React.Dispatch<Action>; onNext: () => void; onBack: () => void
}) {
  const { followUp, selectedSymptoms } = state
  const needsOnsetQ = selectedSymptoms.includes('chest_pain') || selectedSymptoms.includes('shortness_breath')
  const allSymptoms = Object.values(SYMPTOM_DATA).flat()
  const hasCritical = selectedSymptoms.some(id => allSymptoms.find(s => s.id === id)?.severity === 'critical')

  const canProceed = followUp.duration !== '' && followUp.progression !== ''
    && (!needsOnsetQ || followUp.onsetType !== '')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">คำถามเพิ่มเติมเกี่ยวกับอาการ</h2>
        <p className="text-sm text-slate-500">ช่วยให้ประเมินได้แม่นยำขึ้น</p>
      </div>

      {hasCritical && (
        <div className="rounded-xl bg-red-50 border border-red-300 p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 font-medium">
            หากอาการรุนแรงมาก โทร 1669 ทันที อย่ารอกรอกแบบสอบถาม
          </p>
        </div>
      )}

      {/* Duration */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2.5">
          อาการเริ่มมานานแค่ไหน? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {DURATION_OPTIONS.map(({ value, label }) => (
            <button key={value} onClick={() => dispatch({ type: 'SET_FOLLOWUP', field: 'duration', value })}
              className={cn('rounded-xl border px-3 py-2.5 text-xs font-medium text-left transition-all',
                followUp.duration === value
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Severity slider */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          ความรุนแรงของอาการ *
          <span className="ml-3 text-2xl">{SEVERITY_EMOJIS[followUp.severity]}</span>
          <span className="ml-2 text-base font-bold text-teal-700">{followUp.severity}/10</span>
        </label>
        <input
          type="range" min="1" max="10" step="1"
          value={followUp.severity}
          onChange={e => dispatch({ type: 'SET_FOLLOWUP', field: 'severity', value: parseInt(e.target.value) })}
          className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-emerald-300 via-amber-300 to-red-400 accent-teal-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1 เล็กน้อยมาก</span>
          <span>5 ปานกลาง</span>
          <span>10 รุนแรงมาก</span>
        </div>
      </div>

      {/* Progression */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2.5">
          อาการเป็นอย่างไรในช่วงที่ผ่านมา? *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PROGRESSION_OPTIONS.map(({ value, label, icon }) => (
            <button key={value} onClick={() => dispatch({ type: 'SET_FOLLOWUP', field: 'progression', value })}
              className={cn('rounded-xl border px-3 py-3 text-xs font-medium text-center transition-all',
                followUp.progression === value
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200')}>
              <div className="text-xl mb-1">{icon}</div>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Onset type — only for chest/breath */}
      {needsOnsetQ && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <label className="block text-sm font-semibold text-amber-800 mb-2.5">
            ⚠ อาการเจ็บหน้าอก/หายใจลำบาก เกิดขึ้นอย่างไร? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ONSET_OPTIONS.map(({ value, label }) => (
              <button key={value} onClick={() => dispatch({ type: 'SET_FOLLOWUP', field: 'onsetType', value })}
                className={cn('rounded-xl border px-4 py-2.5 text-sm font-medium transition-all text-left',
                  followUp.onsetType === value
                    ? value === 'sudden' ? 'border-red-400 bg-red-50 text-red-700' : 'border-teal-400 bg-teal-50 text-teal-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300')}>
                {label}
              </button>
            ))}
          </div>
          {followUp.onsetType === 'sudden' && (
            <p className="mt-2 text-xs font-bold text-red-700 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> การเกิดทันทีเป็นสัญญาณเตือนสำคัญ — โทร 1669 หากไม่แน่ใจ
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> ย้อนกลับ
        </Button>
        <Button onClick={onNext} disabled={!canProceed}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl disabled:opacity-50">
          ดูผลการวิเคราะห์ <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// STEP 4 — Results
// ============================================================

const URGENCY_CONFIG = {
  emergency: {
    bg: 'bg-red-50', border: 'border-red-400', textColor: 'text-red-800',
    badgeBg: 'bg-red-600', dot: '🔴',
    title: 'ควรไปห้องฉุกเฉินทันที',
    subtitle: 'หรือโทร 1669 ทันที อย่ารอดูอาการ',
    icon: Phone,
  },
  urgent: {
    bg: 'bg-orange-50', border: 'border-orange-300', textColor: 'text-orange-800',
    badgeBg: 'bg-orange-500', dot: '🟠',
    title: 'ควรพบแพทย์ภายใน 24–48 ชั่วโมง',
    subtitle: 'ไปคลินิก/โรงพยาบาลวันนี้หรือพรุ่งนี้',
    icon: AlertTriangle,
  },
  appointment: {
    bg: 'bg-amber-50', border: 'border-amber-300', textColor: 'text-amber-800',
    badgeBg: 'bg-amber-500', dot: '🟡',
    title: 'นัดพบแพทย์ภายใน 1–2 สัปดาห์',
    subtitle: 'ควรปรึกษาแพทย์เพื่อการประเมินที่ถูกต้อง',
    icon: Calendar,
  },
  selfcare: {
    bg: 'bg-emerald-50', border: 'border-emerald-300', textColor: 'text-emerald-800',
    badgeBg: 'bg-emerald-500', dot: '🟢',
    title: 'ดูแลตัวเองได้ + เฝ้าระวัง',
    subtitle: 'หากอาการแย่ลงหรือไม่ดีขึ้นใน 3–5 วัน ควรพบแพทย์',
    icon: Leaf,
  },
}

function Step4Results({ state, dispatch }: { state: CheckerState; dispatch: React.Dispatch<Action> }) {
  const urgency = determineUrgencyLevel(
    state.selectedSymptoms,
    state.followUp.severity,
    state.followUp.duration,
    state.followUp.onsetType
  )
  const conditions = getConditionsForSymptoms(state.selectedSymptoms)
  const cfg = URGENCY_CONFIG[urgency]
  const UrgencyIcon = cfg.icon

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">ผลการวิเคราะห์อาการ</h2>
        <p className="text-xs text-slate-500">ผลนี้เพื่อการนำทางเท่านั้น ไม่ใช่การวินิจฉัยโรค</p>
      </div>

      {/* Urgency Level — most prominent */}
      <div className={cn('rounded-2xl border-2 p-5', cfg.bg, cfg.border)}>
        <div className="flex items-start gap-4">
          <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full', cfg.badgeBg)}>
            <UrgencyIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{cfg.dot}</span>
              <h3 className={cn('text-lg font-bold', cfg.textColor)}>{cfg.title}</h3>
            </div>
            <p className={cn('text-sm', cfg.textColor)}>{cfg.subtitle}</p>
            {urgency === 'emergency' && (
              <a href="tel:1669" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-red-700">
                <Phone className="h-4 w-4" /> โทร 1669 ทันที
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary of selections */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-600 mb-2">สรุปอาการที่เลือก</p>
        <div className="flex flex-wrap gap-1.5">
          {state.selectedSymptoms.map(id => {
            const sym = Object.values(SYMPTOM_DATA).flat().find(s => s.id === id)
            if (!sym) return null
            return (
              <span key={id} className="text-xs rounded-full bg-white border border-slate-300 px-2.5 py-0.5 text-slate-700">
                {sym.label}
              </span>
            )
          })}
          {state.freeText && (
            <span className="text-xs rounded-full bg-white border border-slate-300 px-2.5 py-0.5 text-slate-500 italic">
              {state.freeText}
            </span>
          )}
        </div>
      </div>

      {/* Possible conditions */}
      {conditions.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">ภาวะที่อาจเกี่ยวข้อง</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ระบบไม่สามารถวินิจฉัยโรคได้ — ข้อมูลนี้เพื่อให้คุณเตรียมคำถามก่อนพบแพทย์
            </p>
          </div>
          {conditions.map(({ condition, score }) => (
            <div key={condition.id} className={cn(
              'rounded-xl border p-4 transition-all',
              condition.isEmergency ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white hover:border-teal-200'
            )}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {condition.isEmergency && (
                    <Badge className="mb-1.5 text-[10px] bg-red-100 text-red-700 border-red-200">ภาวะฉุกเฉิน</Badge>
                  )}
                  <h4 className="text-sm font-bold text-slate-900">{condition.nameTh}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{condition.descriptionTh}</p>
                </div>
                {condition.slug ? (
                  <a href={`/diseases/${condition.slug}`}
                    className="shrink-0 flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 whitespace-nowrap">
                    อ่านเพิ่มเติม <ChevronRight className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="shrink-0 text-[10px] text-slate-400 whitespace-nowrap">ข้อมูลเพิ่มเติม<br/>กำลังพัฒนา</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <div className="flex gap-2">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>ข้อจำกัด:</strong> ระบบนี้ไม่สามารถวินิจฉัยโรคได้ กรุณาพบแพทย์เพื่อการวินิจฉัยที่ถูกต้อง อย่าใช้ผลนี้แทนคำแนะนำของแพทย์ หากมีอาการรุนแรงหรือเร่งด่วน ควรไปห้องฉุกเฉินหรือโทร 1669 ทันที
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a href="/providers" className="flex items-center justify-center gap-2 rounded-xl border border-teal-300 bg-teal-50 text-teal-700 py-3 text-sm font-semibold hover:bg-teal-100 transition-colors">
          <MapPin className="h-4 w-4" /> ค้นหาโรงพยาบาลใกล้ฉัน
        </a>
        <a href="/risk" className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 py-3 text-sm font-semibold hover:border-teal-300 hover:text-teal-700 transition-colors">
          <Activity className="h-4 w-4" /> ประเมินความเสี่ยงเพิ่มเติม
        </a>
      </div>

      <Button variant="outline" onClick={() => dispatch({ type: 'RESET' })} className="w-full rounded-xl text-sm">
        เริ่มตรวจอาการใหม่
      </Button>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function SymptomChecker() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const locale = useLocale()

  const goToStep = (step: CheckerState['step']) => dispatch({ type: 'SET_STEP', step })

  return (
    <div className="mx-auto max-w-2xl">
      <StepIndicator step={state.step} />

      {state.step === 1 && (
        <Step1Profile
          state={state}
          dispatch={dispatch}
          onNext={() => goToStep(2)}
        />
      )}
      {state.step === 2 && (
        <Step2Symptoms
          state={state}
          dispatch={dispatch}
          onNext={() => goToStep(3)}
          onBack={() => goToStep(1)}
        />
      )}
      {state.step === 3 && (
        <Step3FollowUp
          state={state}
          dispatch={dispatch}
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
        />
      )}
      {state.step === 4 && (
        <Step4Results
          state={state}
          dispatch={dispatch}
        />
      )}
    </div>
  )
}
