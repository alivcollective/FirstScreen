'use client'

import { useEffect } from 'react'
import { AlertTriangle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WizardFollowUp } from '@/types/symptom'

interface Props {
  selectedSymptoms: string[]
  followUp: WizardFollowUp
  onChange: (field: keyof WizardFollowUp, value: string | number | boolean | null) => void
  onEmergencyDetected: () => void
}

const SEVERITY_EMOJI: Record<number, string> = {
  1: '😊', 2: '😊', 3: '🙂', 4: '🙂', 5: '😐',
  6: '😟', 7: '😣', 8: '😰', 9: '😱', 10: '🤕',
}

const DURATION_OPTIONS = [
  { value: 'less_24h', label: 'น้อยกว่า 24 ชั่วโมง' },
  { value: '2_7d', label: '2–7 วัน' },
  { value: '1_4w', label: '1–4 สัปดาห์' },
  { value: 'more_1m', label: 'มากกว่า 1 เดือน' },
]

const PROGRESSION_OPTIONS = [
  { value: 'worsening', label: 'แย่ลงเรื่อยๆ', icon: '📈' },
  { value: 'stable', label: 'คงที่', icon: '➡️' },
  { value: 'improving', label: 'ดีขึ้นแล้ว', icon: '📉' },
]

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; icon?: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all min-h-[48px]',
            value === opt.value
              ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
          )}
        >
          {opt.icon && <span className="text-base shrink-0">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function YesNo({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex gap-3">
      {[{ v: true, l: 'ใช่' }, { v: false, l: 'ไม่ใช่' }].map(({ v, l }) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            'flex-1 rounded-xl border px-4 py-3 text-sm font-semibold text-center transition-all min-h-[48px]',
            value === v
              ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export function FollowUpQuestions({ selectedSymptoms: ss, followUp: fu, onChange, onEmergencyDetected }: Props) {
  // Real-time cardiac emergency detection
  const hasChest = ss.includes('chest_pain') || ss.includes('chest_tightness')
  const hasLeftArm = ss.includes('left_arm_pain')
  const isCardiacCombo = hasChest && hasLeftArm
  const cardiacEmergency = isCardiacCombo && fu.sudden_onset === true && fu.cold_sweat === true

  const hasBleeding = ss.includes('blood_stool') || ss.includes('cough_blood')
  const hasWeightLoss = ss.includes('weight_loss')
  const hasFever = ss.includes('fever') || ss.includes('high_fever')

  // Notify parent when emergency detected
  useEffect(() => {
    if (cardiacEmergency) onEmergencyDetected()
  }, [cardiacEmergency, onEmergencyDetected])

  return (
    <div className="space-y-7">
      {/* ── Cardiac Emergency Banner ── */}
      {cardiacEmergency && (
        <div className="rounded-2xl bg-red-600 text-white p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="h-6 w-6 shrink-0" />
            <h3 className="text-lg font-bold">⚠️ อาการฉุกเฉิน — โทร 1669 ทันที</h3>
          </div>
          <p className="text-sm text-red-100 mb-3">
            อาการเจ็บหน้าอก + ปวดแขนซ้าย + เกิดทันที + เหงื่อเย็น อาจบ่งชี้ถึงกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน
          </p>
          <a
            href="tel:1669"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-red-700 font-bold px-5 py-2.5 text-sm hover:bg-red-50 transition-colors"
          >
            <Phone className="h-4 w-4" />
            โทร 1669 ฉุกเฉิน
          </a>
        </div>
      )}

      {/* ── Q1: Duration ── */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          อาการเริ่มมานานแค่ไหน? <span className="text-red-500">*</span>
        </h3>
        <RadioGroup
          options={DURATION_OPTIONS}
          value={fu.duration}
          onChange={v => onChange('duration', v)}
        />
      </div>

      {/* ── Q2: Severity slider ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-900">
            ระดับความรุนแรงของอาการ <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{SEVERITY_EMOJI[fu.severity]}</span>
            <span className={cn(
              'text-xl font-bold',
              fu.severity >= 9 ? 'text-red-600' :
              fu.severity >= 7 ? 'text-orange-500' :
              fu.severity >= 5 ? 'text-amber-500' : 'text-emerald-600'
            )}>
              {fu.severity}
            </span>
            <span className="text-slate-400 text-sm">/10</span>
          </div>
        </div>
        <input
          type="range" min={1} max={10} step={1}
          value={fu.severity}
          onChange={e => onChange('severity', parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-sky-500"
          style={{
            background: `linear-gradient(to right, #0ea5e9 ${(fu.severity - 1) / 9 * 100}%, #e2e8f0 ${(fu.severity - 1) / 9 * 100}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>เล็กน้อย (1)</span>
          <span>ปานกลาง (5)</span>
          <span>รุนแรงมาก (10)</span>
        </div>

        {/* Real-time high severity warning */}
        {fu.severity >= 9 && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-300 p-3 flex gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">
              ความรุนแรงสูงมาก — แนะนำพบแพทย์หรือไปห้องฉุกเฉินทันที
            </p>
          </div>
        )}
      </div>

      {/* ── Q3: Progression ── */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          อาการเป็นอย่างไร? <span className="text-red-500">*</span>
        </h3>
        <RadioGroup
          options={PROGRESSION_OPTIONS}
          value={fu.progression}
          onChange={v => onChange('progression', v)}
        />
      </div>

      {/* ── Conditional: Cardiac ── */}
      {isCardiacCombo && (
        <div className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
            <h3 className="text-sm font-bold text-orange-800">
              ตรวจสอบอาการหัวใจ — กรุณาตอบคำถามนี้
            </h3>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">
              อาการเจ็บหน้าอกเกิดขึ้นทันที (ไม่ใช่ค่อยๆ เป็น)?
            </p>
            <YesNo value={fu.sudden_onset} onChange={v => onChange('sudden_onset', v)} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">
              มีเหงื่อออกเย็น คลื่นไส้ หรือหายใจลำบากร่วมด้วยหรือไม่?
            </p>
            <YesNo value={fu.cold_sweat} onChange={v => onChange('cold_sweat', v)} />
          </div>
        </div>
      )}

      {/* ── Conditional: Bleeding ── */}
      {hasBleeding && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-4">
          <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            คำถามเพิ่มเติมเกี่ยวกับเลือดออก
          </h3>
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">เลือดออกมากหรือน้อย?</p>
            <div className="flex gap-3">
              {[{ v: 'small', l: 'น้อย (นิดหน่อย)' }, { v: 'large', l: 'มาก (ชัดเจน)' }].map(({ v, l }) => (
                <button key={v} type="button" onClick={() => onChange('blood_amount', v as 'small' | 'large')}
                  className={cn('flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-all min-h-[48px]',
                    fu.blood_amount === v ? 'border-red-500 bg-red-100 text-red-800' : 'border-slate-200 bg-white text-slate-700 hover:border-red-300'
                  )}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">เกิดครั้งแรกหรือเคยเป็นมาก่อน?</p>
            <YesNo value={fu.blood_first_time} onChange={v => onChange('blood_first_time', v)} />
          </div>
        </div>
      )}

      {/* ── Conditional: Weight loss ── */}
      {hasWeightLoss && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <h3 className="text-sm font-bold text-amber-800">น้ำหนักลดโดยไม่ตั้งใจ</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">ลดไปกี่กิโลกรัม?</label>
              <input type="number" min="0" max="50" placeholder="กก."
                value={fu.weight_loss_kg}
                onChange={e => onChange('weight_loss_kg', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">ในช่วงกี่เดือน?</label>
              <input type="number" min="0" max="24" placeholder="เดือน"
                value={fu.weight_loss_months}
                onChange={e => onChange('weight_loss_months', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Conditional: Fever ── */}
      {hasFever && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <h3 className="text-sm font-bold text-amber-800">คำถามเกี่ยวกับไข้</h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">ไข้ขึ้นสูงสุดเท่าไหร่?</label>
            <input type="number" step="0.1" min="36" max="43" placeholder="°C เช่น 38.5"
              value={fu.max_temp}
              onChange={e => onChange('max_temp', e.target.value)}
              className="w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">มีผื่นแดงหรือจุดเลือดออกร่วมด้วยหรือไม่?</p>
            <YesNo value={fu.has_rash} onChange={v => onChange('has_rash', v)} />
            {fu.has_rash && (
              <p className="mt-2 text-xs font-medium text-amber-700 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                ไข้ + ผื่น อาจเป็นสัญญาณของไข้เลือดออก — ควรพบแพทย์ด่วน
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
