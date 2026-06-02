
'use client'
import { Plus, X } from 'lucide-react'
import { makeId, RECOMMENDATION_LABELS } from '@/types/clinical-pathway'
import type { PathwayDraft, RecommendationType } from '@/types/clinical-pathway'

interface StepProps { draft: PathwayDraft; onChange: (u: Partial<PathwayDraft>) => void }

const TYPE_COLOR: Record<RecommendationType, string> = {
  education: 'bg-slate-700 text-slate-300',
  self_care: 'bg-teal-900/40 text-teal-300',
  lifestyle: 'bg-emerald-900/40 text-emerald-300',
  exercise: 'bg-sky-900/40 text-sky-300',
  physical_therapy: 'bg-blue-900/40 text-blue-300',
  see_doctor: 'bg-amber-900/40 text-amber-300',
  urgent_care: 'bg-orange-900/40 text-orange-300',
  emergency: 'bg-red-900/40 text-red-300',
}

export function Step7Recommendations({ draft, onChange }: StepProps) {
  function add(type: RecommendationType) {
    onChange({
      recommendations: [...draft.recommendations, {
        id: makeId(), type,
        title_th: RECOMMENDATION_LABELS[type],
        sort_order: draft.recommendations.length
      }]
    })
  }

  function update(id: string, updates: object) {
    onChange({ recommendations: draft.recommendations.map(r => r.id === id ? { ...r, ...updates } : r) })
  }

  function remove(id: string) {
    onChange({ recommendations: draft.recommendations.filter(r => r.id !== id) })
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <p className="text-sm text-slate-400">กำหนดสิ่งที่ผู้ป่วยควรทำหลังประเมิน</p>

      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">เลือกประเภทคำแนะนำ</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(RECOMMENDATION_LABELS) as RecommendationType[]).map(t => (
            <button key={t} onClick={() => add(t)}
              className={"rounded-xl px-3 py-1.5 text-xs font-medium transition-all border border-slate-700 hover:border-slate-500 " + TYPE_COLOR[t]}>
              <Plus className="h-3 w-3 inline mr-1" />
              {RECOMMENDATION_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {draft.recommendations.length > 0 && (
        <div className="space-y-2.5">
          {draft.recommendations.map(r => (
            <div key={r.id} className={"rounded-xl border border-slate-700 bg-slate-800/60 p-4"}>
              <div className="flex items-center gap-2 mb-2">
                <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + TYPE_COLOR[r.type]}>
                  {RECOMMENDATION_LABELS[r.type]}
                </span>
                <button onClick={() => remove(r.id)} className="ml-auto text-slate-600 hover:text-red-400 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input value={r.title_th} onChange={e => update(r.id, { title_th: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-200 border-b border-slate-700 focus:border-teal-500 pb-1 focus:outline-none mb-2" />
              <textarea value={r.detail_th ?? ""} onChange={e => update(r.id, { detail_th: e.target.value })}
                placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)" rows={2}
                className="w-full bg-transparent text-xs text-slate-400 border-0 focus:outline-none resize-none placeholder:text-slate-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
