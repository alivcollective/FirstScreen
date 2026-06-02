
'use client'
import { useState } from 'react'
import { Plus, X, AlertTriangle } from 'lucide-react'
import { makeId, EMERGENCY_LABELS } from '@/types/clinical-pathway'
import type { PathwayDraft, PathwayRedFlag, EmergencyLevel } from '@/types/clinical-pathway'

interface StepProps { draft: PathwayDraft; onChange: (u: Partial<PathwayDraft>) => void }

const PRESET_FLAGS = [
  { name_th: "ปวดหน้าอกรุนแรง", level: "call_1669" as EmergencyLevel },
  { name_th: "หายใจลำบาก", level: "call_1669" as EmergencyLevel },
  { name_th: "หมดสติ", level: "call_1669" as EmergencyLevel },
  { name_th: "อ่อนแรงแขนขาเฉียบพลัน", level: "call_1669" as EmergencyLevel },
  { name_th: "ชาครึ่งซีก", level: "go_to_er" as EmergencyLevel },
  { name_th: "ปวดหัวรุนแรงที่สุดในชีวิต", level: "call_1669" as EmergencyLevel },
]

const LEVEL_COLOR: Record<EmergencyLevel, string> = {
  call_1669: "border-red-500 bg-red-900/20",
  go_to_er: "border-red-400 bg-red-900/10",
  urgent_care: "border-amber-500 bg-amber-900/10",
  see_doctor_today: "border-amber-400 bg-amber-900/5",
}

export function Step6RedFlags({ draft, onChange }: StepProps) {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [level, setLevel] = useState<EmergencyLevel>("see_doctor_today")

  function add(preset?: { name_th: string; level: EmergencyLevel }) {
    const n = preset?.name_th ?? name.trim()
    if (!n) return
    const flag: PathwayRedFlag = {
      id: makeId(), name_th: n,
      description_th: desc.trim() || `พบอาการ ${n} ควรปฏิบัติดังนี้`,
      emergency_level: preset?.level ?? level,
      action_th: EMERGENCY_LABELS[preset?.level ?? level],
      sort_order: draft.red_flags.length
    }
    onChange({ red_flags: [...draft.red_flags, flag] })
    setName(""); setDesc("")
  }

  function remove(id: string) {
    onChange({ red_flags: draft.red_flags.filter(f => f.id !== id) })
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-xl border border-red-800/40 bg-red-900/10 p-4">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <p className="text-xs font-semibold text-red-400">สัญญาณอันตราย (Red Flags)</p>
        </div>
        <p className="text-xs text-slate-400">อาการที่ต้องให้ผู้ป่วยรีบพบแพทย์ทันที ระบบจะแสดง banner เตือนทันที</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">สัญญาณอันตรายที่พบบ่อย</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_FLAGS.map(f => (
            <button key={f.name_th} onClick={() => add(f)}
              className="rounded-xl border border-red-800/50 bg-red-900/10 hover:bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors">
              + {f.name_th}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">เพิ่มสัญญาณอันตราย</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="ชื่ออาการ เช่น ปวดหน้าอกรุนแรง"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500" />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
          placeholder="คำอธิบายหรือสิ่งที่ผู้ป่วยควรทำ (ไม่บังคับ)"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500 resize-none" />
        <div className="flex gap-2">
          <select value={level} onChange={e => setLevel(e.target.value as EmergencyLevel)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-red-500">
            {(Object.entries(EMERGENCY_LABELS) as [EmergencyLevel, string][]).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
          <button onClick={() => add()} className="flex items-center gap-1 rounded-xl bg-red-700 hover:bg-red-600 px-4 py-2.5 text-sm text-white transition-colors">
            <Plus className="h-3.5 w-3.5" /> เพิ่ม
          </button>
        </div>
      </div>

      {draft.red_flags.length > 0 && (
        <div className="space-y-2">
          {draft.red_flags.map(f => (
            <div key={f.id} className={"rounded-xl border p-3.5 " + LEVEL_COLOR[f.emergency_level]}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-red-300">{f.name_th}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{f.description_th}</p>
                  <span className="text-[10px] font-bold text-red-400 mt-1 block">{EMERGENCY_LABELS[f.emergency_level]}</span>
                </div>
                <button onClick={() => remove(f.id)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
