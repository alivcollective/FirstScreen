
'use client'
import { Check, X, RefreshCw } from 'lucide-react'
import type { PathwayDraft } from '@/types/clinical-pathway'

interface StepProps { draft: PathwayDraft; onChange: (u: Partial<PathwayDraft>) => void }

function suggest(thai: string): string {
  // Simplified auto-suggestion mapping (real implementation would call API)
  const map: Record<string, string> = {
    "ปวด": "Pain", "ชา": "Numbness", "อ่อนแรง": "Weakness",
    "ตึง": "Stiffness", "บวม": "Swelling", "แสบ": "Burning",
    "สะบัก": "Scapula", "ไหล่": "Shoulder", "เข่า": "Knee",
    "คอ": "Neck", "หลัง": "Back", "สะโพก": "Hip",
  }
  for (const [th, en] of Object.entries(map)) {
    if (thai.includes(th)) return en
  }
  return "[ต้องแปล]"
}

export function Step10Translation({ draft, onChange }: StepProps) {
  // Build translation items from draft
  const items = [
    { key: "pathway_name", label: "ชื่อเส้นทาง", thai: draft.name_th, en: draft.name_en },
    { key: "description", label: "คำอธิบาย", thai: draft.description_th ?? "", en: draft.description_en },
    ...draft.symptoms.map(s => ({ key: "sym_" + s.id, label: "อาการ: " + s.name_th, thai: s.name_th, en: s.name_en })),
    ...draft.conditions.map(c => ({ key: "cond_" + c.id, label: "ภาวะ: " + c.condition_name_th, thai: c.condition_name_th, en: c.condition_name_en })),
  ].filter(i => i.thai)

  function updateTranslation(key: string, en: string) {
    if (key === "pathway_name") onChange({ name_en: en })
    else if (key === "description") onChange({ description_en: en })
    else if (key.startsWith("sym_")) {
      const id = key.replace("sym_", "")
      onChange({ symptoms: draft.symptoms.map(s => s.id === id ? { ...s, name_en: en } : s) })
    } else if (key.startsWith("cond_")) {
      const id = key.replace("cond_", "")
      onChange({ conditions: draft.conditions.map(c => c.id === id ? { ...c, condition_name_en: en } : c) })
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <p className="text-xs font-semibold text-teal-400 mb-1">ระบบแปลภาษาอัตโนมัติ</p>
        <p className="text-xs text-slate-400">
          ตรวจสอบคำแปลภาษาอังกฤษ แก้ไขได้ทันที ระบบจะเก็บทั้งภาษาไทยและอังกฤษ
        </p>
      </div>

      <div className="space-y-2.5">
        {items.map(item => {
          const autoEn = suggest(item.thai)
          const current = item.en ?? autoEn
          return (
            <div key={item.key} className="rounded-xl border border-slate-700 bg-slate-800/60 p-3.5">
              <p className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">{item.label}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">ภาษาไทย</p>
                  <p className="text-sm text-slate-300 bg-slate-900/40 rounded-lg px-2.5 py-1.5">{item.thai}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-slate-500">ภาษาอังกฤษ</p>
                    {!item.en && (
                      <span className="text-[9px] text-amber-400 flex items-center gap-0.5">
                        <RefreshCw className="h-2.5 w-2.5" /> แนะนำอัตโนมัติ
                      </span>
                    )}
                  </div>
                  <input
                    value={current}
                    onChange={e => updateTranslation(item.key, e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-xs text-slate-500">
          กรอกข้อมูลในขั้นตอนก่อนหน้าก่อน ระบบจะแสดงรายการคำที่ต้องแปลที่นี่
        </div>
      )}
    </div>
  )
}
