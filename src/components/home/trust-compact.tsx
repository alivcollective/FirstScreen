'use client'
import { useState } from 'react'
import { ShieldCheck, ChevronDown } from 'lucide-react'

const ORGS = [
  { abbr: 'WHO', name: 'องค์การอนามัยโลก', desc: 'แนวทางสุขภาพระดับโลก' },
  { abbr: 'USPSTF', name: 'US Preventive Services', desc: 'มาตรฐานคัดกรองป้องกันโรค' },
  { abbr: 'NCCN', name: 'Cancer Network', desc: 'แนวทางมะเร็งชั้นนำ' },
  { abbr: 'GRADE', name: 'Evidence Framework', desc: 'กรอบประเมินหลักฐาน' },
] as const

export function TrustCompact() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="bg-white border-y border-slate-100 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl px-5">

        {/* Header row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0" />
            <p className="text-sm font-semibold text-slate-700 text-left">
              ทำไม FirstScreen ถึงน่าเชื่อถือ?
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">ใช้แนวทางเดียวกับองค์กรสุขภาพระดับโลก</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Compact org pills — always visible */}
        <div className="flex flex-wrap gap-2 mt-3">
          {ORGS.map(o => (
            <span key={o.abbr} className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
              {o.abbr}
            </span>
          ))}
        </div>

        {/* Expandable detail */}
        {expanded && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
            {ORGS.map(o => (
              <div key={o.abbr} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-800 mb-0.5">{o.abbr}</p>
                <p className="text-[11px] text-slate-500 leading-snug">{o.name}</p>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{o.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
