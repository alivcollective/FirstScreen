import { SPECIALTY_OPTIONS } from '@/types/clinical-pathway'
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

export function Step1Info({ draft, onChange }: StepProps) {
  return (
    <div className="space-y-5 max-w-2xl">
      {/* Pathway Name */}
      <div>
        <label className={labelCls}>ชื่อเส้นทาง *</label>
        <input
          value={draft.name_th}
          onChange={e => onChange({ name_th: e.target.value })}
          placeholder="เช่น ปวดสะบักและไหล่ในนักกีฬา"
          className={inputCls}
        />
        <p className="text-xs text-slate-500 mt-1">ชื่อที่ผู้ป่วยจะเห็น ใช้ภาษาที่เข้าใจง่าย</p>
      </div>

      {/* Specialty */}
      <div>
        <label className={labelCls}>ความเชี่ยวชาญ *</label>
        <select
          value={draft.specialty}
          onChange={e => onChange({ specialty: e.target.value })}
          className={inputCls + " cursor-pointer"}
        >
          {SPECIALTY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>คำอธิบาย</label>
        <textarea
          value={draft.description_th ?? ""}
          onChange={e => onChange({ description_th: e.target.value })}
          placeholder="อธิบายเส้นทางนี้ใช้สำหรับอะไร กลุ่มผู้ป่วยใด"
          rows={3}
          className={inputCls + " resize-none"}
        />
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-teal-800/40 bg-teal-900/10 p-4">
        <p className="text-xs text-teal-400 font-medium mb-1">แนวทางการตั้งชื่อ</p>
        <ul className="text-xs text-slate-400 space-y-0.5 list-disc list-inside">
          <li>ใช้ชื่ออาการ ไม่ใช่ชื่อโรค: "ปวดไหล่" ไม่ใช่ "Shoulder Impingement"</li>
          <li>ระบุกลุ่มเป้าหมายถ้าจำเป็น: "ปวดเข่าในนักวิ่ง"</li>
          <li>ภาษาไทยเป็นหลัก ระบบจัดการคำแปลให้</li>
        </ul>
      </div>
    </div>
  )
}
