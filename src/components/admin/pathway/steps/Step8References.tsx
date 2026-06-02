
'use client'
import { useState } from 'react'
import { Plus, X, Link as LinkIcon } from 'lucide-react'
import { makeId } from '@/types/clinical-pathway'
import type { PathwayDraft } from '@/types/clinical-pathway'

interface StepProps { draft: PathwayDraft; onChange: (u: Partial<PathwayDraft>) => void }

const PRESET_ORGS = ["WHO", "USPSTF", "NCCN", "GRADE", "PubMed", "กรมการแพทย์", "ราชวิทยาลัย", "สมาคมเวชศาสตร์", "Royal College"]

export function Step8References({ draft, onChange }: StepProps) {
  const [org, setOrg] = useState("")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [year, setYear] = useState("")

  function add() {
    if (!org.trim()) return
    onChange({
      references: [...draft.references, {
        id: makeId(), source_org: org.trim(),
        title_en: title.trim() || undefined, url: url.trim() || undefined,
        year: year ? parseInt(year) : undefined, sort_order: draft.references.length
      }]
    })
    setOrg(""); setTitle(""); setUrl(""); setYear("")
  }

  function remove(id: string) {
    onChange({ references: draft.references.filter(r => r.id !== id) })
  }

  const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"

  return (
    <div className="space-y-5 max-w-2xl">
      <p className="text-sm text-slate-400">ระบุแหล่งอ้างอิงทางการแพทย์สำหรับเส้นทางนี้</p>

      <div className="space-y-2.5 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <p className="text-xs font-semibold text-slate-400">เพิ่มแหล่งอ้างอิง</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_ORGS.map(o => (
            <button key={o} onClick={() => setOrg(o)}
              className={"text-[11px] rounded-lg border px-2 py-0.5 transition-colors " + (org === o ? "border-teal-500 bg-teal-900/30 text-teal-300" : "border-slate-700 text-slate-500 hover:border-slate-600")}>
              {o}
            </button>
          ))}
        </div>
        <input value={org} onChange={e => setOrg(e.target.value)} placeholder="แหล่งอ้างอิง *" className={inputCls} />
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="ชื่อบทความหรือ Guideline (ไม่บังคับ)" className={inputCls} />
        <div className="grid grid-cols-2 gap-2">
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL หรือ DOI" className={inputCls} />
          <input value={year} onChange={e => setYear(e.target.value)} type="number" placeholder="ปี (เช่น 2023)" className={inputCls} />
        </div>
        <button onClick={add} className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
          <Plus className="h-3.5 w-3.5" /> เพิ่มแหล่งอ้างอิง
        </button>
      </div>

      {draft.references.length > 0 && (
        <div className="space-y-2">
          {draft.references.map((r, i) => (
            <div key={r.id} className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-3">
              <span className="text-xs font-bold text-slate-500 mt-0.5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-bold text-teal-400 bg-teal-900/30 rounded px-1.5 py-0.5 mb-1">{r.source_org}</span>
                {r.title_en && <p className="text-xs text-slate-300 truncate">{r.title_en}</p>}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 mt-0.5 truncate">
                    <LinkIcon className="h-3 w-3 shrink-0" /> {r.url}
                  </a>
                )}
                {r.year && <span className="text-[11px] text-slate-500">{r.year}</span>}
              </div>
              <button onClick={() => remove(r.id)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
