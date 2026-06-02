
'use client'
import type { PathwayDraft, EvidenceLevelPathway } from '@/types/clinical-pathway'

interface StepProps { draft: PathwayDraft; onChange: (u: Partial<PathwayDraft>) => void }

const EVIDENCE_LEVELS: { value: EvidenceLevelPathway; label: string; desc: string; color: string }[] = [
  { value: 'high', label: 'สูง', desc: 'Systematic Reviews / RCTs', color: 'text-emerald-400 border-emerald-500 bg-emerald-900/20' },
  { value: 'moderate', label: 'ปานกลาง', desc: 'Cohort Studies', color: 'text-teal-400 border-teal-500 bg-teal-900/20' },
  { value: 'low', label: 'ต่ำ', desc: 'Observational Studies', color: 'text-amber-400 border-amber-500 bg-amber-900/20' },
  { value: 'expert_consensus', label: 'ฉันทามติ', desc: 'Expert Opinion', color: 'text-slate-300 border-slate-600 bg-slate-800' },
]

const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide"

export function Step9Review({ draft, onChange }: StepProps) {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <p className="text-xs text-slate-400">
          ระบุแพทย์ผู้รับผิดชอบเนื้อหาทางการแพทย์ในเส้นทางนี้ ช่วยสร้างความน่าเชื่อถือให้กับผู้ใช้
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>ชื่อแพทย์ผู้ตรวจสอบ</label>
          <input value={draft.reviewer_name ?? ""} onChange={e => onChange({ reviewer_name: e.target.value })}
            placeholder="นพ. / พญ. ..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>ความเชี่ยวชาญ</label>
          <input value={draft.reviewer_specialty ?? ""} onChange={e => onChange({ reviewer_specialty: e.target.value })}
            placeholder="เช่น ออร์โธปิดิกส์" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>วันที่ตรวจสอบ</label>
          <input type="date" value={draft.review_date ?? ""} onChange={e => onChange({ review_date: e.target.value })}
            className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>ระดับหลักฐาน</label>
        <div className="grid grid-cols-2 gap-2">
          {EVIDENCE_LEVELS.map(ev => (
            <button key={ev.value} onClick={() => onChange({ evidence_level: ev.value })}
              className={"rounded-xl border p-3 text-left transition-all " +
                (draft.evidence_level === ev.value ? ev.color : "border-slate-700 bg-slate-800/40 text-slate-500 hover:border-slate-600")}>
              <p className="text-sm font-semibold">{ev.label}</p>
              <p className="text-[11px] opacity-70">{ev.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
