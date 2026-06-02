'use client'

import { useReducer, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Save, Eye, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PathwayDraft } from '@/types/clinical-pathway'
import { EMPTY_DRAFT } from '@/types/clinical-pathway'

// Steps
import { Step1Info } from './steps/Step1Info'
import { Step2Regions } from './steps/Step2Regions'
import { Step3Symptoms } from './steps/Step3Symptoms'
import { Step4Questions } from './steps/Step4Questions'
import { Step5Conditions } from './steps/Step5Conditions'
import { Step6RedFlags } from './steps/Step6RedFlags'
import { Step7Recommendations } from './steps/Step7Recommendations'
import { Step8References } from './steps/Step8References'
import { Step9Review } from './steps/Step9Review'
import { Step10Translation } from './steps/Step10Translation'

// ── Wizard config ─────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'ข้อมูลหลัก',      desc: 'ชื่อและความเชี่ยวชาญ' },
  { n: 2, label: 'บริเวณร่างกาย',  desc: 'เลือกตำแหน่งที่เกี่ยวข้อง' },
  { n: 3, label: 'อาการ',           desc: 'อาการหลักที่ประเมิน' },
  { n: 4, label: 'คำถาม',           desc: 'ถามผู้ป่วยแบบ History Taking' },
  { n: 5, label: 'ภาวะที่อาจเป็น', desc: 'Differential Diagnosis' },
  { n: 6, label: 'สัญญาณอันตราย',  desc: 'Red Flags ที่ต้องระวัง' },
  { n: 7, label: 'คำแนะนำ',         desc: 'สิ่งที่ควรทำต่อไป' },
  { n: 8, label: 'แหล่งอ้างอิง',   desc: 'Guideline และงานวิจัย' },
  { n: 9, label: 'ตรวจสอบ',         desc: 'แพทย์ผู้รับผิดชอบ' },
  { n: 10, label: 'ภาษา',           desc: 'ตรวจสอบคำแปล' },
]

// ── Reducer ───────────────────────────────────────────────────

type WizardAction =
  | { type: 'PATCH'; updates: Partial<PathwayDraft> }
  | { type: 'RESET' }

function reducer(state: PathwayDraft, action: WizardAction): PathwayDraft {
  switch (action.type) {
    case 'PATCH': return { ...state, ...action.updates }
    case 'RESET': return EMPTY_DRAFT
    default: return state
  }
}

// ── Progress Bar ──────────────────────────────────────────────

function WizardProgress({ current }: { current: number }) {
  return (
    <div className="shrink-0 border-b border-slate-800 bg-slate-900/80 px-6 py-3">
      {/* Mobile: just step count */}
      <div className="sm:hidden flex items-center justify-between">
        <span className="text-xs text-slate-400">ขั้นตอน {current} จาก {STEPS.length}</span>
        <span className="text-sm font-semibold text-white">{STEPS[current - 1]?.label}</span>
      </div>

      {/* Desktop: full step list */}
      <div className="hidden sm:flex items-center gap-1 overflow-x-auto pb-0.5">
        {STEPS.map((s, i) => {
          const done = current > s.n
          const active = current === s.n
          return (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center min-w-0">
                <div className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors shrink-0',
                  active ? 'bg-teal-500 text-white' :
                  done ? 'bg-teal-800 text-teal-300' :
                  'bg-slate-800 text-slate-500'
                )}>
                  {done ? <Check className="h-3 w-3" /> : s.n}
                </div>
                <span className={cn(
                  'text-[9px] mt-0.5 whitespace-nowrap font-medium',
                  active ? 'text-teal-300' : done ? 'text-slate-500' : 'text-slate-600'
                )}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('h-px w-4 mx-0.5 mb-3 shrink-0', done ? 'bg-teal-700' : 'bg-slate-800')} />
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-0.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${(current / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ── Step content panel ────────────────────────────────────────

function StepPanel({ step, label, desc, children }: {
  step: number; label: string; desc: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Step header */}
      <div className="shrink-0 px-6 pt-6 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600/20 text-teal-400 text-[11px] font-bold">
            {step}
          </span>
          <h2 className="text-base font-bold text-white">{label}</h2>
        </div>
        <p className="text-sm text-slate-400">{desc}</p>
      </div>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {children}
      </div>
    </div>
  )
}

// ── Navigation ────────────────────────────────────────────────

function WizardNav({
  step, onBack, onNext, onSave, onPreview, saving, canNext,
}: {
  step: number
  onBack: () => void
  onNext: () => void
  onSave: (status?: 'draft' | 'review') => void
  onPreview: () => void
  saving: boolean
  canNext: boolean
}) {
  const isLast = step === STEPS.length
  return (
    <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900">
      <div className="flex items-center gap-2">
        {step > 1 && (
          <button onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            ย้อนกลับ
          </button>
        )}
        <button onClick={() => onSave('draft')} disabled={saving}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          บันทึกร่าง
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onPreview}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:text-teal-300 hover:border-teal-700 transition-colors">
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>

        {isLast ? (
          <button onClick={() => onSave('review')} disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 px-5 py-2 text-sm font-semibold text-white transition-colors">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            ส่งตรวจสอบ
          </button>
        ) : (
          <button onClick={onNext} disabled={!canNext}
            className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 px-5 py-2 text-sm font-semibold text-white transition-colors">
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Wizard ───────────────────────────────────────────────

interface PathwayWizardProps {
  initialDraft?: Partial<PathwayDraft>
  pathwayId?: string
}

export function PathwayWizard({ initialDraft, pathwayId }: PathwayWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | undefined>(pathwayId)
  const [draft, dispatch] = useReducer(reducer, { ...EMPTY_DRAFT, ...initialDraft })

  const patch = useCallback((updates: Partial<PathwayDraft>) => {
    dispatch({ type: 'PATCH', updates })
  }, [])

  // Validate current step before proceeding
  function canAdvance(): boolean {
    if (step === 1) return draft.name_th.trim().length > 0 && draft.specialty.length > 0
    return true // all other steps are optional
  }

  async function save(status?: 'draft' | 'review') {
    setSaving(true)
    try {
      const body = { ...draft, status: status ?? draft.status ?? 'draft' }
      const url = savedId ? `/api/admin/pathways/${savedId}` : '/api/admin/pathways'
      const method = savedId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const d = await res.json()
        if (d.id) {
          setSavedId(d.id)
          if (status === 'review') {
            router.push('/admin/clinical-pathways')
          }
        }
      }
    } catch { /* silent */ }
    setSaving(false)
  }

  function openPreview() {
    if (savedId) {
      window.open(`/admin/clinical-pathways/${savedId}/preview`, '_blank')
    }
  }

  const currentStep = STEPS[step - 1]

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <WizardProgress current={step} />

      {/* Step content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <StepPanel step={step} label={currentStep.label} desc={currentStep.desc}>
          {step === 1 && <Step1Info draft={draft} onChange={patch} />}
          {step === 2 && <Step2Regions draft={draft} onChange={patch} />}
          {step === 3 && <Step3Symptoms draft={draft} onChange={patch} />}
          {step === 4 && <Step4Questions draft={draft} onChange={patch} />}
          {step === 5 && <Step5Conditions draft={draft} onChange={patch} />}
          {step === 6 && <Step6RedFlags draft={draft} onChange={patch} />}
          {step === 7 && <Step7Recommendations draft={draft} onChange={patch} />}
          {step === 8 && <Step8References draft={draft} onChange={patch} />}
          {step === 9 && <Step9Review draft={draft} onChange={patch} />}
          {step === 10 && <Step10Translation draft={draft} onChange={patch} />}
        </StepPanel>
      </div>

      <WizardNav
        step={step}
        onBack={() => setStep(s => Math.max(1, s - 1))}
        onNext={() => setStep(s => Math.min(STEPS.length, s + 1))}
        onSave={save}
        onPreview={openPreview}
        saving={saving}
        canNext={canAdvance()}
      />
    </div>
  )
}
