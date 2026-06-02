'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ChevronRight, AlertTriangle, Check, X,
  Activity, Zap,
} from 'lucide-react'
import { ATHLETE_REGIONS, ATHLETE_SPORTS, type AthleteRegion } from '@/data/athlete/regions'
import { ATHLETE_CONDITIONS } from '@/data/athlete/conditions'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────

type Step = 'region' | 'sport' | 'activity' | 'symptoms' | 'results'

interface AthleteState {
  step: Step
  region: AthleteRegion | null
  sport: string | null
  activities: string[]
  symptoms: string[]
  timing: string | null
}

// ── Symptom options ───────────────────────────────────────────

const SYMPTOM_OPTIONS = [
  { id: 'pain', label: 'ปวด' },
  { id: 'tightness', label: 'ตึง/แข็ง' },
  { id: 'weakness', label: 'อ่อนแรง' },
  { id: 'clicking', label: 'มีเสียงดัง' },
  { id: 'burning', label: 'แสบร้อน' },
  { id: 'pins', label: 'ชา/เสียว' },
  { id: 'numbness', label: 'ชาสนิท' },
  { id: 'reduced_rom', label: 'ขยับได้น้อยลง' },
] as const

const TIMING_OPTIONS = [
  { id: 'start', label: 'ต้นการเคลื่อนไหว' },
  { id: 'during', label: 'ระหว่างออกกำลัง' },
  { id: 'end_range', label: 'ท้ายช่วงการเคลื่อนไหว' },
  { id: 'after', label: 'หลังออกกำลัง' },
  { id: 'next_day', label: 'เช้าวันถัดไป' },
  { id: 'constant', label: 'ตลอดเวลา' },
] as const

// ── Chip component ────────────────────────────────────────────

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all',
        selected
          ? 'bg-teal-50 border-teal-400 text-teal-700'
          : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700'
      )}
    >
      {selected && <Check className="h-3.5 w-3.5" />}
      {label}
    </button>
  )
}

// ── Step indicator ────────────────────────────────────────────

const STEPS: { key: Step; label: string }[] = [
  { key: 'region', label: 'ตำแหน่ง' },
  { key: 'sport', label: 'กีฬา' },
  { key: 'activity', label: 'กิจกรรม' },
  { key: 'symptoms', label: 'อาการ' },
  { key: 'results', label: 'ผล' },
]

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors',
                active ? 'bg-teal-500 text-white' : done ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'
              )}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn('text-[10px] whitespace-nowrap', active ? 'text-teal-600' : 'text-slate-400')}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px w-8 sm:w-12 mx-1 mb-3 transition-colors', done ? 'bg-teal-200' : 'bg-slate-100')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export function AthleteMap() {
  const [state, setState] = useState<AthleteState>({
    step: 'region',
    region: null,
    sport: null,
    activities: [],
    symptoms: [],
    timing: null,
  })

  const patch = (updates: Partial<AthleteState>) =>
    setState(prev => ({ ...prev, ...updates }))

  const toggleActivity = (act: string) =>
    patch({ activities: state.activities.includes(act) ? state.activities.filter(a => a !== act) : [...state.activities, act] })

  const toggleSymptom = (sym: string) =>
    patch({ symptoms: state.symptoms.includes(sym) ? state.symptoms.filter(s => s !== sym) : [...state.symptoms, sym] })

  // Get matching conditions
  const matchedConditions = state.region
    ? ATHLETE_CONDITIONS.filter(c =>
        c.relatedRegions.includes(state.region!.id) &&
        (state.sport === 'general' || !state.sport || c.relevantSports.includes(state.sport as string))
      ).slice(0, 4)
    : []

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-6">
          <StepBar current={state.step} />

          {/* ── STEP 1: Body Region ─────────────────────────── */}
          {state.step === 'region' && (
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">เลือกตำแหน่งที่เจ็บ</h2>
              <p className="text-sm text-slate-500 mb-5">คลิกที่ส่วนร่างกายที่มีอาการ</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {ATHLETE_REGIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => patch({ region: r, step: 'sport', activities: [], symptoms: [], timing: null })}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-teal-300 hover:bg-teal-50 transition-all group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 group-hover:border-teal-200">
                      <Activity className="h-4 w-4 text-slate-400 group-hover:text-teal-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 group-hover:text-teal-700">{r.name_th}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Sport ───────────────────────────────── */}
          {state.step === 'sport' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => patch({ step: 'region' })} className="text-xs text-slate-400 hover:text-teal-600 transition-colors">
                  ← กลับ
                </button>
                <span className="text-xs text-slate-300">/</span>
                <span className="text-xs font-medium text-teal-600">{state.region?.name_th}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">คุณเล่นกีฬาอะไร?</h2>
              <p className="text-sm text-slate-500 mb-5">เลือกกีฬาหลักของคุณ</p>
              <div className="flex flex-wrap gap-2">
                {ATHLETE_SPORTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => patch({ sport: s.id, step: 'activity' })}
                    className={cn(
                      'rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                      state.sport === s.id
                        ? 'bg-teal-50 border-teal-400 text-teal-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300'
                    )}
                  >
                    {s.label_th}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Activity ────────────────────────────── */}
          {state.step === 'activity' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => patch({ step: 'sport' })} className="text-xs text-slate-400 hover:text-teal-600 transition-colors">
                  ← กลับ
                </button>
                <span className="text-xs text-slate-300">/</span>
                <span className="text-xs text-teal-600">{state.region?.name_th}</span>
                <span className="text-xs text-slate-300">/</span>
                <span className="text-xs text-teal-600">
                  {ATHLETE_SPORTS.find(s => s.id === state.sport)?.label_th}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">กิจกรรมที่ทำให้เจ็บ</h2>
              <p className="text-sm text-slate-500 mb-5">เลือกได้หลายรายการ</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(state.region?.activities ?? []).map((act) => (
                  <Chip
                    key={act}
                    label={act}
                    selected={state.activities.includes(act)}
                    onClick={() => toggleActivity(act)}
                  />
                ))}
              </div>
              <div className="mb-5">
                <p className="text-sm font-medium text-slate-700 mb-3">อาการเกิดขึ้นเมื่อไหร่?</p>
                <div className="flex flex-wrap gap-2">
                  {TIMING_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => patch({ timing: t.id })}
                      className={cn(
                        'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all',
                        state.timing === t.id
                          ? 'bg-teal-50 border-teal-400 text-teal-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => patch({ step: 'symptoms' })}
                disabled={state.activities.length === 0}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ถัดไป <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── STEP 4: Symptoms ────────────────────────────── */}
          {state.step === 'symptoms' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => patch({ step: 'activity' })} className="text-xs text-slate-400 hover:text-teal-600 transition-colors">
                  ← กลับ
                </button>
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">
                อาการที่บริเวณ{state.region?.name_th}
              </h2>
              <p className="text-sm text-slate-500 mb-5">เลือกทุกอาการที่รู้สึก</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {SYMPTOM_OPTIONS.map((s) => (
                  <Chip
                    key={s.id}
                    label={s.label}
                    selected={state.symptoms.includes(s.id)}
                    onClick={() => toggleSymptom(s.id)}
                  />
                ))}
              </div>

              {/* Red flag check */}
              {state.region?.redFlags && state.region.redFlags.length > 0 && (
                state.symptoms.some(s => state.region!.redFlags!.some(rf => rf.symptomId === s)) && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-800 mb-1">อาการที่ต้องระวัง</p>
                        {state.region.redFlags
                          .filter(rf => state.symptoms.includes(rf.symptomId))
                          .map(rf => (
                            <p key={rf.symptomId} className="text-xs text-red-700">{rf.warning_th}</p>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              )}

              <button
                onClick={() => patch({ step: 'results' })}
                disabled={state.symptoms.length === 0}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ดูผลเบื้องต้น <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── STEP 5: Results ─────────────────────────────── */}
          {state.step === 'results' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">ผลเบื้องต้น</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {state.region?.name_th} · {ATHLETE_SPORTS.find(s => s.id === state.sport)?.label_th}
                  </p>
                </div>
                <button
                  onClick={() => setState({ step: 'region', region: null, sport: null, activities: [], symptoms: [], timing: null })}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> เริ่มใหม่
                </button>
              </div>

              {matchedConditions.length > 0 ? (
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                    อาจเกี่ยวข้องกับ — ข้อมูลเพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัย
                  </p>
                  {matchedConditions.map((c) => (
                    <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{c.name_th}</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.description_th}</p>
                        </div>
                        <span className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold border',
                          c.urgency === 'urgent' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-teal-50 text-teal-700 border-teal-200'
                        )}>
                          {c.urgency === 'urgent' ? 'ควรพบแพทย์' : 'ติดตามดู'}
                        </span>
                      </div>
                      {c.whenToSeekHelp_th && (
                        <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-200">
                          {c.whenToSeekHelp_th}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center mb-6">
                  <p className="text-sm text-slate-500">ไม่พบข้อมูลตรงกับอาการที่เลือก</p>
                  <p className="text-xs text-slate-400 mt-1">แนะนำให้พบนักกายภาพบำบัดหรือแพทย์กีฬา</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/symptoms"
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500 transition-colors"
                >
                  ตรวจอาการละเอียด <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/providers"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:border-teal-200 hover:bg-teal-50 transition-colors"
                >
                  ค้นหาผู้เชี่ยวชาญ <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
