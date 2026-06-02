import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { makeId } from '@/types/clinical-pathway'
import type { PathwayDraft } from '@/types/clinical-pathway'

interface StepProps {
  draft: PathwayDraft
  onChange: (updates: Partial<PathwayDraft>) => void
}

// Shared input styling
const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide"
const cardCls = "rounded-xl border border-slate-700 bg-slate-800/60 p-4"
const addBtnCls = "flex items-center gap-2 rounded-xl border border-dashed border-slate-700 hover:border-teal-600 hover:text-teal-400 px-3 py-2 text-sm text-slate-500 transition-colors w-full"

const PRESET_SYMPTOMS = [
  "ปวด", "อ่อนแรง", "ชา", "ตึง/แข็ง", "บวม",
  "แสบร้อน", "ขยับลำบาก", "มีเสียงดัง", "เจ็บตอนออกกำลัง", "อื่นๆ"
]

export function Step3Symptoms({ draft, onChange }: StepProps) {
  const [custom, setCustom] = useState("")

  function toggle(name_th: string) {
    const slug = "sym_" + name_th.replace(/\s+/g, "_")
    const has = draft.symptoms.some(s => s.symptom_slug === slug)
    if (has) {
      onChange({ symptoms: draft.symptoms.filter(s => s.symptom_slug !== slug) })
    } else {
      onChange({
        symptoms: [...draft.symptoms, {
          id: makeId(), symptom_slug: slug, name_th,
          is_primary: true, is_custom: !PRESET_SYMPTOMS.includes(name_th),
          sort_order: draft.symptoms.length
        }]
      })
    }
  }

  function addCustom() {
    if (custom.trim()) { toggle(custom.trim()); setCustom("") }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <p className="text-sm text-slate-400">อาการหลักที่เส้นทางนี้ใช้ประเมิน</p>
      <div className="flex flex-wrap gap-2">
        {PRESET_SYMPTOMS.map(s => {
          const selected = draft.symptoms.some(sym => sym.name_th === s)
          return (
            <button key={s} onClick={() => toggle(s)}
              className={"rounded-xl border px-3.5 py-2 text-sm font-medium transition-all " +
                (selected ? "bg-teal-600/20 border-teal-500 text-teal-300" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300")}>
              {selected && "✓ "}{s}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        <input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustom()}
          placeholder="เพิ่มอาการอื่น..." className={inputCls + " flex-1"} />
        <button onClick={addCustom} className="flex items-center gap-1 rounded-xl bg-slate-700 hover:bg-slate-600 px-4 py-2.5 text-sm text-slate-300 transition-colors">
          <Plus className="h-3.5 w-3.5" /> เพิ่ม
        </button>
      </div>
      {draft.symptoms.length > 0 && (
        <div className={cardCls}>
          <p className="text-xs text-slate-400 mb-2">เลือกแล้ว ({draft.symptoms.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {draft.symptoms.map(s => (
              <span key={s.id} className="flex items-center gap-1 rounded-full bg-teal-900/40 border border-teal-700/40 text-teal-300 text-xs px-2.5 py-1">
                {s.name_th}
                <button onClick={() => toggle(s.name_th)} className="text-teal-500 hover:text-red-400 ml-0.5"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
