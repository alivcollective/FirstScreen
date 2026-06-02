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

const PRESET_REGIONS = [
  { slug: "head", name_th: "ศีรษะ" },
  { slug: "neck", name_th: "คอ" },
  { slug: "shoulder", name_th: "ไหล่" },
  { slug: "scapula", name_th: "สะบัก" },
  { slug: "chest", name_th: "หน้าอก" },
  { slug: "upper_back", name_th: "หลังส่วนบน" },
  { slug: "low_back", name_th: "หลังส่วนล่าง" },
  { slug: "abdomen", name_th: "ช่องท้อง" },
  { slug: "hip", name_th: "สะโพก" },
  { slug: "knee", name_th: "เข่า" },
  { slug: "calf", name_th: "น่อง" },
  { slug: "ankle", name_th: "ข้อเท้า" },
  { slug: "foot", name_th: "เท้า" },
  { slug: "elbow", name_th: "ข้อศอก" },
  { slug: "wrist", name_th: "ข้อมือ" },
]

export function Step2Regions({ draft, onChange }: StepProps) {
  const [custom, setCustom] = useState("")

  function toggle(slug: string, name_th: string) {
    const has = draft.body_regions.some(r => r.region_slug === slug)
    if (has) {
      onChange({ body_regions: draft.body_regions.filter(r => r.region_slug !== slug) })
    } else {
      onChange({
        body_regions: [...draft.body_regions, {
          id: makeId(), region_slug: slug, region_name_th: name_th, sort_order: draft.body_regions.length
        }]
      })
    }
  }

  function addCustom() {
    const trimmed = custom.trim()
    if (!trimmed) return
    const slug = "custom_" + trimmed.replace(/\s+/g, "_").toLowerCase()
    toggle(slug, trimmed)
    setCustom("")
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <p className="text-sm text-slate-400">เลือกบริเวณร่างกายที่เส้นทางนี้ครอบคลุม (เลือกได้หลายบริเวณ)</p>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {PRESET_REGIONS.map(r => {
          const selected = draft.body_regions.some(br => br.region_slug === r.slug)
          return (
            <button
              key={r.slug}
              onClick={() => toggle(r.slug, r.name_th)}
              className={"rounded-xl border px-3.5 py-2 text-sm font-medium transition-all " +
                (selected
                  ? "bg-teal-600/20 border-teal-500 text-teal-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                )
              }
            >
              {selected && <span className="mr-1">✓</span>}
              {r.name_th}
            </button>
          )
        })}
      </div>

      {/* Custom region */}
      <div>
        <label className={labelCls}>เพิ่มบริเวณที่กำหนดเอง</label>
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addCustom()}
            placeholder="เช่น สะบ้าเข่า, Rotator Cuff"
            className={inputCls + " flex-1"}
          />
          <button onClick={addCustom}
            className="flex items-center gap-1 rounded-xl bg-slate-700 hover:bg-slate-600 px-4 py-2.5 text-sm text-slate-300 transition-colors">
            <Plus className="h-3.5 w-3.5" /> เพิ่ม
          </button>
        </div>
      </div>

      {/* Selected summary */}
      {draft.body_regions.length > 0 && (
        <div className={cardCls}>
          <p className="text-xs text-slate-400 mb-2">บริเวณที่เลือก ({draft.body_regions.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {draft.body_regions.map(r => (
              <span key={r.id} className="flex items-center gap-1 rounded-full bg-teal-900/40 border border-teal-700/40 text-teal-300 text-xs px-2.5 py-1">
                {r.region_name_th}
                <button onClick={() => toggle(r.region_slug, r.region_name_th)} className="text-teal-500 hover:text-red-400 ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
