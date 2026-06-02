'use client'

import { useReducer, useEffect, useState, useCallback, useTransition } from 'react'
import {
  ChevronRight, ChevronLeft, AlertTriangle, Phone, Loader2,
  User, MapPin, Clock, BarChart2, Activity, Users, FlaskConical
} from 'lucide-react'
import { BodyMap } from './BodyMap'
import { runClinicalAssessment } from '@/actions/clinical'
import { calculatePackYears } from '@/lib/clinical/calculators/pack-year'
import { calculateAUDITC } from '@/lib/clinical/calculators/audit-c'
import { calculateBMI } from '@/lib/clinical/calculators/bmi'
import type { Symptom } from '@/types/clinical'
import type { BodyRegion as MapRegion } from '@/types/symptom'
import { ClinicalResults } from './ClinicalResults'
import type { AssessmentResult } from '@/actions/clinical'
import type { ClinicalSession } from '@/types/clinical'

// ── Clinical BodyRegion (from Supabase) → Map region ─────────
const CLINICAL_TO_MAP: Record<string, MapRegion[]> = {
  head: ['head'],
  chest: ['chest'],
  abdomen: ['abdomen'],
  back: ['back'],
  limbs: ['left-arm', 'right-arm', 'left-leg', 'right-leg'],
  skin: ['skin'],
  general: ['general'],
}

// ── State ─────────────────────────────────────────────────────

interface WizardState {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7
  session: ClinicalSession
  allSymptoms: Symptom[]
  selectedRegion: MapRegion | null
  emergencyDetected: boolean
  emergencyMsg: string
}

type Action =
  | { type: 'GOTO'; step: WizardState['step'] }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SET_SYMPTOMS'; symptoms: Symptom[] }
  | { type: 'SET_REGION'; region: MapRegion | null }
  | { type: 'PATCH_SESSION'; updates: Partial<ClinicalSession> }
  | { type: 'TOGGLE_SYMPTOM'; symptom: Symptom }
  | { type: 'CLEAR_EMERGENCY' }

function makeToken() {
  return typeof crypto !== 'undefined'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

function initState(): WizardState {
  return {
    step: 1,
    session: { session_token: makeToken(), symptom_ids: [] },
    allSymptoms: [],
    selectedRegion: null,
    emergencyDetected: false,
    emergencyMsg: '',
  }
}

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'GOTO': return { ...state, step: action.step }
    case 'NEXT': return { ...state, step: Math.min(7, state.step + 1) as WizardState['step'] }
    case 'BACK': return { ...state, step: Math.max(1, state.step - 1) as WizardState['step'] }
    case 'SET_SYMPTOMS': return { ...state, allSymptoms: action.symptoms }
    case 'SET_REGION': return { ...state, selectedRegion: action.region }
    case 'PATCH_SESSION': return {
      ...state,
      session: { ...state.session, ...action.updates },
    }
    case 'TOGGLE_SYMPTOM': {
      const s = action.symptom
      const ids = state.session.symptom_ids ?? []
      const has = ids.includes(s.id)
      const newIds = has ? ids.filter(id => id !== s.id) : [...ids, s.id]
      const emergencyDetected = !has && s.is_emergency
      return {
        ...state,
        session: { ...state.session, symptom_ids: newIds },
        emergencyDetected: emergencyDetected || state.emergencyDetected,
        emergencyMsg: emergencyDetected
          ? `"${s.name_th}" — อาการนี้ต้องการการดูแลฉุกเฉิน`
          : state.emergencyMsg,
      }
    }
    case 'CLEAR_EMERGENCY': return { ...state, emergencyDetected: false, emergencyMsg: '' }
    default: return state
  }
}

// ── Step Indicator ────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'อาการหลัก', icon: User },
  { n: 2, label: 'เลือกอาการ', icon: MapPin },
  { n: 3, label: 'รายละเอียด', icon: Clock },
  { n: 4, label: 'ประวัติส่วนตัว', icon: Activity },
  { n: 5, label: 'โรคประจำตัว', icon: FlaskConical },
  { n: 6, label: 'ประวัติครอบครัว', icon: Users },
  { n: 7, label: 'ผลการวิเคราะห์', icon: BarChart2 },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between px-1 mb-6 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const done = current > s.n
        const active = current === s.n
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${active ? 'bg-sky-500 text-white' : done ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                {done ? '✓' : s.n}
              </div>
              <span className={`text-[10px] hidden sm:block whitespace-nowrap
                ${active ? 'text-sky-400' : done ? 'text-teal-400' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 sm:w-10 mx-1 transition-colors
                ${done ? 'bg-teal-600' : 'bg-slate-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Navigation Bar ────────────────────────────────────────────

function NavBar({
  step,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  loading,
}: {
  step: number
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  loading?: boolean
}) {
  return (
    <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700">
      {step > 1 ? (
        <button onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white
          hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {nextLabel ?? 'ถัดไป'}
        {!loading && step < 7 && <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STEP 1 — Chief Complaint
// ════════════════════════════════════════════════════════════════

const QUICK_COMPLAINTS = [
  'ปวดหัว', 'เจ็บหน้าอก', 'ปวดท้อง', 'ไข้', 'ไอ', 'เวียนหัว',
  'อ่อนเพลีย', 'ปวดหลัง', 'หายใจไม่สะดวก', 'ใจสั่น',
]

function Step1({ session, onPatch, onNext }: {
  session: ClinicalSession
  onPatch: (u: Partial<ClinicalSession>) => void
  onNext: () => void
}) {
  const age = session.age ?? ''
  const sex = session.sex ?? ''
  const complaint = session.chief_complaint ?? ''

  const canNext = age !== '' && sex !== '' && complaint.trim().length > 0

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">อาการที่คุณเป็นอยู่คืออะไร?</h2>
      <p className="text-slate-400 text-sm mb-6">ข้อมูลเบื้องต้นช่วยให้การวิเคราะห์แม่นยำขึ้น</p>

      {/* Demographics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">อายุ (ปี)</label>
          <input
            type="number" min={1} max={120}
            value={age}
            onChange={e => onPatch({ age: Number(e.target.value) || undefined })}
            placeholder="เช่น 45"
            className="w-full rounded-xl bg-slate-700/60 border border-slate-600 px-3 py-2.5 text-sm text-white
              placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">เพศ</label>
          <div className="flex gap-2">
            {(['male', 'female', 'other'] as const).map(s => (
              <button key={s}
                onClick={() => onPatch({ sex: s })}
                className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-colors
                  ${sex === s
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-700/40 border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                {s === 'male' ? 'ชาย' : s === 'female' ? 'หญิง' : 'อื่นๆ'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chief Complaint */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-300 mb-1.5">อาการหลักที่มาพบ</label>
        <input
          type="text"
          value={complaint}
          onChange={e => onPatch({ chief_complaint: e.target.value })}
          placeholder="เช่น ปวดหัวรุนแรง 2 วันมาแล้ว"
          className="w-full rounded-xl bg-slate-700/60 border border-slate-600 px-3 py-2.5 text-sm text-white
            placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Quick chips */}
      <div>
        <p className="text-xs text-slate-400 mb-2">หรือเลือกจากอาการทั่วไป</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_COMPLAINTS.map(c => (
            <button key={c}
              onClick={() => onPatch({ chief_complaint: c })}
              className={`rounded-full border px-3 py-1 text-xs transition-colors
                ${complaint === c
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-sky-500/50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <NavBar step={1} onBack={() => {}} onNext={onNext} nextDisabled={!canNext} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STEP 2 — Symptom Selection
// ════════════════════════════════════════════════════════════════

function Step2({ state, dispatch, onNext }: {
  state: WizardState
  dispatch: React.Dispatch<Action>
  onNext: () => void
}) {
  const { allSymptoms, selectedRegion, session, emergencyDetected, emergencyMsg } = state
  const selectedIds = session.symptom_ids ?? []

  // Filter symptoms shown: by region if selected, else all
  const visibleSymptoms = selectedRegion
    ? allSymptoms.filter(s => {
        const mapRegions = CLINICAL_TO_MAP[s.body_region] ?? []
        return mapRegions.includes(selectedRegion)
      })
    : allSymptoms

  const canNext = selectedIds.length > 0

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">เลือกตำแหน่งและอาการ</h2>
      <p className="text-slate-400 text-sm mb-4">คลิกร่างกายเพื่อกรอง หรือเลือกอาการโดยตรง</p>

      {emergencyDetected && (
        <div className="mb-4 rounded-xl border border-red-500/60 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-300">อาการฉุกเฉิน — ต้องการความช่วยเหลือทันที</p>
              <p className="text-xs text-red-400 mt-0.5">{emergencyMsg}</p>
            </div>
          </div>
          <a href="tel:1669"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors">
            <Phone className="h-4 w-4" />
            โทร 1669 ทันที
          </a>
          <button onClick={() => dispatch({ type: 'CLEAR_EMERGENCY' })}
            className="mt-2 w-full text-center text-xs text-red-400/70 hover:text-red-400 transition-colors">
            อาการไม่ฉุกเฉิน — ดำเนินการต่อ
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Body Map */}
        <div className="flex flex-col items-center">
          <BodyMap
            selectedRegion={selectedRegion}
            onSelectRegion={r => dispatch({ type: 'SET_REGION', region: r === selectedRegion ? null : r })}
          />
          {selectedRegion && (
            <button onClick={() => dispatch({ type: 'SET_REGION', region: null })}
              className="mt-2 text-xs text-slate-400 hover:text-sky-400 transition-colors underline">
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* Symptom chips */}
        <div>
          <p className="text-xs font-medium text-slate-400 mb-2">
            {selectedRegion ? `อาการบริเวณ: ${selectedRegion}` : 'อาการทั้งหมด'} ({visibleSymptoms.length})
          </p>
          {allSymptoms.length === 0 ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              กำลังโหลดอาการ...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
              {visibleSymptoms.map(s => {
                const active = selectedIds.includes(s.id)
                return (
                  <button key={s.id}
                    onClick={() => dispatch({ type: 'TOGGLE_SYMPTOM', symptom: s })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                      ${active
                        ? s.is_emergency
                          ? 'bg-red-500/20 border-red-500 text-red-300'
                          : 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-sky-500/50'}
                      ${s.is_emergency ? 'ring-1 ring-red-500/30' : ''}`}>
                    {s.name_th}
                  </button>
                )
              })}
            </div>
          )}

          {selectedIds.length > 0 && (
            <div className="mt-3 rounded-lg bg-slate-700/40 px-3 py-2">
              <p className="text-xs text-slate-400">เลือกแล้ว: <span className="text-sky-400 font-medium">{selectedIds.length} อาการ</span></p>
            </div>
          )}
        </div>
      </div>

      <NavBar step={2} onBack={() => dispatch({ type: 'BACK' })} onNext={onNext} nextDisabled={!canNext} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STEP 3 — OLDCARTS
// ════════════════════════════════════════════════════════════════

const ONSET_OPTIONS = ['ทันที (วินาที)', 'เฉียบพลัน (ชั่วโมง)', 'ค่อยๆ เป็น (วัน)', 'เรื้อรัง (สัปดาห์/เดือน)']
const CHARACTER_OPTIONS = ['ปวดตุ้บๆ', 'ปวดเฉียบ/แทง', 'ปวดแสบ', 'ปวดบีบ/กด', 'ปวดตื้อ', 'ชา', 'เจ็บคอ', 'อื่นๆ']
const AGGRAVATING_OPTIONS = ['ออกกำลังกาย', 'ทานอาหาร', 'นอนราบ', 'เครียด', 'หายใจลึก', 'การเคลื่อนไหว']
const RELIEVING_OPTIONS = ['พัก', 'ยาแก้ปวด', 'อาหาร/น้ำ', 'ความร้อน/ความเย็น', 'ท่าทาง']
const TIMING_OPTIONS = ['ตลอดเวลา', 'เป็นพักๆ', 'ตอนเช้า', 'กลางคืน', 'หลังอาหาร', 'ออกกำลังกาย']

function MultiChips({ options, selected, onChange }: {
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} onClick={() => toggle(o)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors
            ${selected.includes(o)
              ? 'bg-sky-500/20 border-sky-500 text-sky-300'
              : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-sky-500/50'}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

function Step3({ session, onPatch, dispatch }: {
  session: ClinicalSession
  onPatch: (u: Partial<ClinicalSession>) => void
  dispatch: React.Dispatch<Action>
}) {
  const o = session.oldcarts ?? {}
  const patch = (updates: object) => onPatch({ oldcarts: { ...o, ...updates } })

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">รายละเอียดอาการ</h2>
      <p className="text-slate-400 text-sm mb-6">OLDCARTS — ช่วยให้การวิเคราะห์ถูกต้องมากขึ้น</p>

      <div className="space-y-6">
        {/* Onset */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">การเริ่มต้นของอาการ (Onset)</label>
          <div className="flex flex-wrap gap-2">
            {ONSET_OPTIONS.map(opt => (
              <button key={opt} onClick={() => patch({ onset_description: opt })}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors
                  ${o.onset_description === opt
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-sky-500/50'}`}>
                {opt}
              </button>
            ))}
          </div>
          {o.onset_description?.includes('ทันที') && (
            <p className="mt-2 text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> อาการเริ่มทันทีอาจเป็นสัญญาณฉุกเฉิน
            </p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            ระยะเวลา (Duration): <span className="text-sky-400">{o.duration_days ?? 0} วัน</span>
          </label>
          <input type="range" min={0} max={365} step={1}
            value={o.duration_days ?? 0}
            onChange={e => patch({ duration_days: Number(e.target.value) })}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>วันนี้</span><span>1 เดือน</span><span>3 เดือน</span><span>1 ปี</span>
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            ความรุนแรง (Severity): <span className={`font-bold ${
              (o.severity_score ?? 5) >= 8 ? 'text-red-400' :
              (o.severity_score ?? 5) >= 5 ? 'text-amber-400' : 'text-emerald-400'
            }`}>{o.severity_score ?? 5}/10</span>
          </label>
          <input type="range" min={1} max={10}
            value={o.severity_score ?? 5}
            onChange={e => patch({ severity_score: Number(e.target.value) })}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-0.5">
            <span>เล็กน้อย (1)</span><span>ปานกลาง (5)</span><span>รุนแรงมาก (10)</span>
          </div>
        </div>

        {/* Character */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">ลักษณะอาการ (Character)</label>
          <MultiChips
            options={CHARACTER_OPTIONS}
            selected={o.character_description ? [o.character_description] : []}
            onChange={v => patch({ character_description: v[v.length - 1] })}
          />
        </div>

        {/* Aggravating / Relieving */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">สิ่งที่ทำให้แย่ลง</label>
            <MultiChips
              options={AGGRAVATING_OPTIONS}
              selected={o.aggravating_factors ?? []}
              onChange={v => patch({ aggravating_factors: v })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">สิ่งที่ทำให้ดีขึ้น</label>
            <MultiChips
              options={RELIEVING_OPTIONS}
              selected={o.relieving_factors ?? []}
              onChange={v => patch({ relieving_factors: v })}
            />
          </div>
        </div>

        {/* Timing */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">ช่วงเวลา (Timing)</label>
          <MultiChips
            options={TIMING_OPTIONS}
            selected={o.timing ? [o.timing] : []}
            onChange={v => patch({ timing: v[v.length - 1] })}
          />
        </div>

        {/* Worsening */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">อาการเปลี่ยนแปลง</label>
          <div className="flex gap-3">
            {(['แย่ลง', 'เหมือนเดิม', 'ดีขึ้น'] as const).map(v => {
              const ans = (o.answers?.worsening_trend) as string | undefined
              const active = ans === v
              return (
                <button key={v} onClick={() => patch({ answers: { ...o.answers, worsening_trend: v } })}
                  className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-colors
                    ${active
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                      : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                  {v}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <NavBar step={3} onBack={() => dispatch({ type: 'BACK' })} onNext={() => dispatch({ type: 'NEXT' })} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STEP 4 — Social History
// ════════════════════════════════════════════════════════════════

const AUDIT_FREQ = ['ไม่เคยดื่ม', 'น้อยกว่าเดือนละครั้ง', '2–4 ครั้ง/เดือน', '2–3 ครั้ง/สัปดาห์', '4 ครั้งขึ้นไป/สัปดาห์']
const AUDIT_AMOUNT = ['1–2 แก้ว', '3–4 แก้ว', '5–6 แก้ว', '7–9 แก้ว', '10 แก้วขึ้นไป']
const AUDIT_BINGE = ['ไม่เคย', 'น้อยกว่าเดือนละครั้ง', 'เดือนละครั้ง', 'สัปดาห์ละครั้ง', 'ทุกวัน/เกือบทุกวัน']

function Step4({ session, onPatch, dispatch }: {
  session: ClinicalSession
  onPatch: (u: Partial<ClinicalSession>) => void
  dispatch: React.Dispatch<Action>
}) {
  const sh = session.social_history ?? {}
  const smoke = sh.smoking ?? { status: 'never' as const }
  const alc = sh.alcohol ?? { status: 'never' as const }
  const ex = sh.exercise ?? {}
  const heightCm = sh.height_cm ?? 0
  const weightKg = sh.weight_kg ?? 0

  const patchSH = (updates: object) => onPatch({ social_history: { ...sh, ...updates } })
  const patchSmoke = (u: object) => patchSH({ smoking: { ...smoke, ...u } })
  const patchAlc = (u: object) => patchSH({ alcohol: { ...alc, ...u } })
  const patchEx = (u: object) => patchSH({ exercise: { ...ex, ...u } })

  // Computed values
  const packYears = smoke.status !== 'never'
    ? calculatePackYears(smoke.cigarettes_per_day ?? 0, smoke.years_smoked ?? 0)
    : 0

  const auditScore = alc.audit_c_frequency && alc.audit_c_amount && alc.audit_c_binge
    ? calculateAUDITC({
        frequencyKey: alc.audit_c_frequency,
        amountKey: alc.audit_c_amount,
        bingeKey: alc.audit_c_binge,
        sex: session.sex ?? 'other',
      })
    : null

  const bmi = heightCm > 0 && weightKg > 0
    ? calculateBMI(weightKg, heightCm)
    : null

  const whoExerciseOk = ((ex.days_per_week ?? 0) * (ex.minutes_per_session ?? 0)) >= 150

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">ประวัติส่วนตัว</h2>
      <p className="text-slate-400 text-sm mb-6">ข้อมูลนี้มีผลต่อการวิเคราะห์ความเสี่ยง</p>

      <div className="space-y-6">
        {/* Height / Weight */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">น้ำหนักและส่วนสูง</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">ส่วนสูง (ซม.)</label>
              <input type="number" min={100} max={220}
                value={heightCm || ''}
                onChange={e => patchSH({ height_cm: Number(e.target.value) || 0 })}
                placeholder="160"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
                  placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">น้ำหนัก (กก.)</label>
              <input type="number" min={20} max={300}
                value={weightKg || ''}
                onChange={e => patchSH({ weight_kg: Number(e.target.value) || 0 })}
                placeholder="65"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
                  placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          {bmi && (
            <div className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-medium
              ${bmi.bmi >= 27.5 ? 'bg-red-500/10 text-red-400' : bmi.bmi >= 23 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              BMI: {bmi.bmi} — {bmi.categoryAsian === 'normal' ? 'ปกติ' : bmi.categoryAsian === 'at_risk' ? 'น้ำหนักเกิน' : 'อ้วน'} (เกณฑ์เอเชีย)
            </div>
          )}
        </div>

        {/* Smoking */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">การสูบบุหรี่</h3>
          <div className="flex gap-2 mb-3">
            {(['never', 'current', 'former'] as const).map(s => (
              <button key={s} onClick={() => patchSmoke({ status: s })}
                className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-colors
                  ${smoke.status === s
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-700/40 border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                {s === 'never' ? 'ไม่สูบ' : s === 'current' ? 'สูบอยู่' : 'เลิกแล้ว'}
              </button>
            ))}
          </div>

          {smoke.status !== 'never' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">บุหรี่/วัน</label>
                <input type="number" min={0} max={100}
                  value={smoke.cigarettes_per_day ?? ''}
                  onChange={e => patchSmoke({ cigarettes_per_day: Number(e.target.value) })}
                  placeholder="10"
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
                    placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">จำนวนปีที่สูบ</label>
                <input type="number" min={0} max={80}
                  value={smoke.years_smoked ?? ''}
                  onChange={e => patchSmoke({ years_smoked: Number(e.target.value) })}
                  placeholder="10"
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
                    placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              {smoke.status === 'former' && (
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">เลิกมาแล้ว (ปี)</label>
                  <input type="number" min={0} max={60}
                    value={smoke.quit_years_ago ?? ''}
                    onChange={e => patchSmoke({ quit_years_ago: Number(e.target.value) })}
                    placeholder="5"
                    className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
                      placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
              {packYears > 0 && (
                <div className="col-span-2 rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs">
                  <span className="text-slate-400">Pack-years: </span>
                  <span className={`font-bold ${packYears >= 20 ? 'text-amber-400' : 'text-sky-400'}`}>{packYears.toFixed(1)}</span>
                  {packYears >= 20 && (
                    <span className="ml-2 text-amber-400/80">⚠️ เกณฑ์คัดกรองมะเร็งปอด NLST</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Alcohol — AUDIT-C */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">แอลกอฮอล์ (AUDIT-C)</h3>
          <div className="space-y-3">
            {[
              { key: 'audit_c_frequency', label: 'ดื่มบ่อยแค่ไหน?', opts: AUDIT_FREQ },
              { key: 'audit_c_amount', label: 'ปกติดื่มครั้งละกี่แก้ว?', opts: AUDIT_AMOUNT },
              { key: 'audit_c_binge', label: 'ดื่มมากกว่า 5 แก้ว/ครั้ง บ่อยแค่ไหน?', opts: AUDIT_BINGE },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
                <div className="flex flex-col gap-1">
                  {opts.map((opt, i) => (
                    <button key={opt} onClick={() => patchAlc({ [key]: opt })}
                      className={`rounded-lg border px-3 py-1.5 text-left text-xs transition-colors
                        ${(alc as unknown as Record<string, unknown>)[key] === opt
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                          : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                      <span className="text-slate-500 mr-1.5">{i}</span> {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {auditScore && (
              <div className={`rounded-lg px-3 py-1.5 text-xs font-medium
                ${auditScore.hazardous ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                AUDIT-C: {auditScore.score}/12 — {auditScore.hazardous ? 'ดื่มเกินเกณฑ์' : 'ไม่เกินเกณฑ์'}
                {auditScore.hazardous && ' (ควรปรึกษาแพทย์)'}
              </div>
            )}
          </div>
        </div>

        {/* Exercise */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">การออกกำลังกาย</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">วัน/สัปดาห์</label>
              <input type="number" min={0} max={7}
                value={ex.days_per_week ?? ''}
                onChange={e => patchEx({ days_per_week: Number(e.target.value) })}
                placeholder="3"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
                  placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">นาที/ครั้ง</label>
              <input type="number" min={0} max={180}
                value={ex.minutes_per_session ?? ''}
                onChange={e => patchEx({ minutes_per_session: Number(e.target.value) })}
                placeholder="30"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
                  placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          {ex.days_per_week && ex.minutes_per_session && (
            <div className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-medium
              ${whoExerciseOk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {whoExerciseOk ? 'ตรงตามเกณฑ์ WHO (≥150 นาที/สัปดาห์)' : `⚠️ ยังน้อยกว่าเกณฑ์ WHO (${(ex.days_per_week * ex.minutes_per_session)} นาที/สัปดาห์)`}
            </div>
          )}
        </div>
      </div>

      <NavBar step={4} onBack={() => dispatch({ type: 'BACK' })} onNext={() => dispatch({ type: 'NEXT' })} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STEP 5 — Past Medical History
// ════════════════════════════════════════════════════════════════

const PMH_CONDITIONS = [
  { key: 'diabetes', label: 'เบาหวาน (Diabetes)' },
  { key: 'hypertension', label: 'ความดันโลหิตสูง (Hypertension)' },
  { key: 'heart_disease', label: 'โรคหัวใจ (Heart Disease)' },
  { key: 'stroke', label: 'โรคหลอดเลือดสมอง (Stroke)' },
  { key: 'copd', label: 'ถุงลมโป่งพอง/หอบหืด (COPD/Asthma)' },
  { key: 'ckd', label: 'ไตเรื้อรัง (Chronic Kidney Disease)' },
  { key: 'cancer', label: 'มะเร็ง (Cancer) — ระบุชนิด' },
  { key: 'hbv', label: 'ไวรัสตับอักเสบบี (HBV)' },
  { key: 'hiv', label: 'HIV/AIDS' },
  { key: 'depression', label: 'ซึมเศร้า/วิตกกังวล (Depression/Anxiety)' },
  { key: 'thyroid', label: 'ไทรอยด์ (Thyroid Disease)' },
  { key: 'dyslipidemia', label: 'ไขมันในเลือดสูง (Dyslipidemia)' },
]

function TagInput({ label, items, onAdd, onRemove, placeholder }: {
  label: string
  items: string[]
  onAdd: (s: string) => void
  onRemove: (s: string) => void
  placeholder?: string
}) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !items.includes(v)) { onAdd(v); setInput('') }
  }
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          className="flex-1 rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-sm text-white
            placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button onClick={add}
          className="rounded-lg bg-slate-600 px-3 py-2 text-xs text-slate-300 hover:bg-slate-500 transition-colors">
          เพิ่ม
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className="flex items-center gap-1 rounded-full bg-slate-700 px-2.5 py-1 text-xs text-slate-300">
            {item}
            <button onClick={() => onRemove(item)} className="text-slate-500 hover:text-red-400 ml-0.5">×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

function Step5({ session, onPatch, dispatch }: {
  session: ClinicalSession
  onPatch: (u: Partial<ClinicalSession>) => void
  dispatch: React.Dispatch<Action>
}) {
  const conditions = session.pmh_conditions ?? []
  const meds = session.current_medications ?? []
  const allergies = session.pmh_allergies ?? []

  const toggleCondition = (key: string) => {
    const next = conditions.includes(key)
      ? conditions.filter(c => c !== key)
      : [...conditions, key]
    onPatch({ pmh_conditions: next })
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">โรคประจำตัวและประวัติรักษา</h2>
      <p className="text-slate-400 text-sm mb-6">เลือกทุกข้อที่ตรงกับคุณ</p>

      {/* Conditions */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-slate-300 mb-2">โรคประจำตัว</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PMH_CONDITIONS.map(c => (
            <button key={c.key} onClick={() => toggleCondition(c.key)}
              className={`rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition-colors
                ${conditions.includes(c.key)
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <TagInput
          label="ยาที่ใช้อยู่ปัจจุบัน"
          items={meds}
          onAdd={s => onPatch({ current_medications: [...meds, s] })}
          onRemove={s => onPatch({ current_medications: meds.filter(m => m !== s) })}
          placeholder="พิมพ์ชื่อยาแล้วกด Enter หรือคลิก เพิ่ม"
        />
        <TagInput
          label="การแพ้ยา / แพ้อาหาร"
          items={allergies}
          onAdd={s => onPatch({ pmh_allergies: [...allergies, s] })}
          onRemove={s => onPatch({ pmh_allergies: allergies.filter(a => a !== s) })}
          placeholder="เช่น แพ้ Penicillin, แพ้อาหารทะเล"
        />
      </div>

      <NavBar step={5} onBack={() => dispatch({ type: 'BACK' })} onNext={() => dispatch({ type: 'NEXT' })} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STEP 6 — Family History
// ════════════════════════════════════════════════════════════════

const FHX_CONDITIONS = [
  { key: 'heart_disease', label: 'โรคหัวใจ (อายุน้อยกว่า 60 ปี)' },
  { key: 'diabetes', label: 'เบาหวาน' },
  { key: 'stroke', label: 'โรคหลอดเลือดสมอง' },
  { key: 'hypertension', label: 'ความดันโลหิตสูง' },
  { key: 'breast_cancer', label: 'มะเร็งเต้านม' },
  { key: 'colorectal_cancer', label: 'มะเร็งลำไส้ใหญ่' },
  { key: 'liver_cancer', label: 'มะเร็งตับ' },
]

function Step6({ session, onPatch, dispatch }: {
  session: ClinicalSession
  onPatch: (u: Partial<ClinicalSession>) => void
  dispatch: React.Dispatch<Action>
}) {
  const fhx = session.family_hx?.first_degree ?? {}

  const toggle = (key: string) => {
    const current = (fhx as Record<string, unknown>)[key] as boolean | undefined
    onPatch({
      family_hx: {
        first_degree: {
          ...fhx,
          [key]: !current,
        },
      },
    })
  }

  const anySelected = Object.values(fhx).some(Boolean)

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">ประวัติสุขภาพครอบครัว</h2>
      <p className="text-slate-400 text-sm mb-6">
        ญาติสายตรง (พ่อ แม่ พี่น้อง) — มีใครเป็นโรคเหล่านี้ไหม?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {FHX_CONDITIONS.map(c => {
          const selected = Boolean((fhx as Record<string, unknown>)[c.key])
          return (
            <button key={c.key} onClick={() => toggle(c.key)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors
                ${selected
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-700/40 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
              {c.label}
            </button>
          )
        })}
      </div>

      {!anySelected && (
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-sm text-slate-400">
          ไม่มีประวัติโรคในครอบครัว — ยังคงเป็นข้อมูลที่มีประโยชน์
        </div>
      )}

      <NavBar step={6} onBack={() => dispatch({ type: 'BACK' })} onNext={() => dispatch({ type: 'NEXT' })}
        nextLabel="วิเคราะห์ผล" />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STEP 7 — Results
// ════════════════════════════════════════════════════════════════

function Step7({ session, allSymptoms, dispatch }: {
  session: ClinicalSession
  allSymptoms: Symptom[]
  dispatch: React.Dispatch<Action>
}) {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await runClinicalAssessment(session)
      setResult(res)
    })
  }, []) // run once on mount

  if (isPending || !result) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
        <p className="text-slate-400 text-sm">กำลังวิเคราะห์อาการ...</p>
        <p className="text-slate-500 text-xs max-w-xs text-center">
          ระบบกำลังประมวลผลข้อมูลทางคลินิก กรุณารอสักครู่
        </p>
      </div>
    )
  }

  return (
    <div>
      <ClinicalResults
        session={session}
        result={result}
        allSymptoms={allSymptoms}
        onRestart={() => dispatch({ type: 'GOTO', step: 1 })}
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN WIZARD
// ════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'fs_clinical_session'

export function ClinicalWizard() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  // Load all symptoms from Supabase once
  useEffect(() => {
    async function loadSymptoms() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const sb = createClient()
        if (!sb) return
        const { data } = await sb
          .from('symptoms')
          .select('*')
          .order('name_th')
        if (data) dispatch({ type: 'SET_SYMPTOMS', symptoms: data as Symptom[] })
      } catch {
        // silent — wizard works without symptoms loaded
      }
    }
    loadSymptoms()
  }, [])

  // Persist session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.session))
    } catch { /* silent */ }
  }, [state.session])

  const patchSession = useCallback((updates: Partial<ClinicalSession>) => {
    dispatch({ type: 'PATCH_SESSION', updates })
  }, [])

  const { step, session } = state

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <StepIndicator current={step} />

      <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-6 shadow-xl">
        {step === 1 && (
          <Step1
            session={session}
            onPatch={patchSession}
            onNext={() => dispatch({ type: 'NEXT' })}
          />
        )}
        {step === 2 && (
          <Step2
            state={state}
            dispatch={dispatch}
            onNext={() => dispatch({ type: 'NEXT' })}
          />
        )}
        {step === 3 && (
          <Step3
            session={session}
            onPatch={patchSession}
            dispatch={dispatch}
          />
        )}
        {step === 4 && (
          <Step4
            session={session}
            onPatch={patchSession}
            dispatch={dispatch}
          />
        )}
        {step === 5 && (
          <Step5
            session={session}
            onPatch={patchSession}
            dispatch={dispatch}
          />
        )}
        {step === 6 && (
          <Step6
            session={session}
            onPatch={patchSession}
            dispatch={dispatch}
          />
        )}
        {step === 7 && (
          <Step7
            session={session}
            allSymptoms={state.allSymptoms}
            dispatch={dispatch}
          />
        )}
      </div>
    </div>
  )
}
