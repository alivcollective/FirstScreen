'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import { makeId, RELATIONSHIP_LABELS } from '@/types/clinical-pathway'
import type { PathwayDraft, RelationshipStrength } from '@/types/clinical-pathway'

interface StepProps { draft: PathwayDraft; onChange: (u: Partial<PathwayDraft>) => void }

const PRESET_CONDITIONS = [
  'Scapular Dyskinesis', 'Shoulder Impingement', 'Rotator Cuff Tendinopathy',
  'Thoracic Mobility Restriction', 'Upper Cross Syndrome',
  "Runner's Knee", 'IT Band Syndrome', 'Patellar Tendinopathy',
  'Hamstring Strain', 'Achilles Tendinopathy', 'Plantar Fasciitis',
  'Low Back Pain', 'Shin Splints', 'Hip Flexor Strain',
]

const STRENGTH_COLOR: Record<RelationshipStrength, string> = {
  strongly_suggests: 'border-teal-500 bg-teal-600/20 text-teal-300',
  supports:          'border-sky-500 bg-sky-600/20 text-sky-300',
  possibly_related:  'border-amber-500 bg-amber-600/20 text-amber-300',
  less_likely:       'border-slate-600 bg-slate-700/40 text-slate-400',
}

export function Step5Conditions({ draft, onChange }: StepProps) {
  const [custom, setCustom] = useState('')

  function addCondition(name_th: string) {
    const slug = name_th.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
    if (draft.conditions.some(c => c.condition_name_th === name_th)) return
    onChange({
      conditions: [...draft.conditions, {
        id: makeId(), condition_slug: slug, condition_name_th: name_th,
        strength: 'supports', sort_order: draft.conditions.length
      }]
    })
  }

  function updateStrength(id: string, strength: RelationshipStrength) {
    onChange({ conditions: draft.conditions.map(c => c.id === id ? { ...c, strength } : c) })
  }

  function remove(id: string) {
    onChange({ conditions: draft.conditions.filter(c => c.id !== id) })
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <p className="text-xs font-semibold text-teal-400 mb-1">Differential Diagnosis แบบที่แพทย์ใช้</p>
        <p className="text-xs text-slate-400">
          เลือกภาวะที่อาจเกี่ยวข้อง แล้วบอกว่า "บ่งชี้แค่ไหน" ระบบแปลเป็นคะแนนเองเบื้องหลัง
        </p>
      </div>

      {/* Preset conditions */}
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">ภาวะที่พบบ่อย</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_CONDITIONS.map(c => {
            const selected = draft.conditions.some(dc => dc.condition_name_th === c)
            return (
              <button key={c} onClick={() => selected ? remove(draft.conditions.find(dc => dc.condition_name_th === c)!.id) : addCondition(c)}
                className={'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ' +
                  (selected ? 'bg-teal-600/20 border-teal-500 text-teal-300' : 'border-slate-700 text-slate-400 hover:border-slate-500')}>
                {selected ? '✓ ' : ''}{c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom condition */}
      <div className="flex gap-2">
        <input value={custom} onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && custom.trim() && (addCondition(custom.trim()), setCustom(''))}
          placeholder="เพิ่มภาวะอื่น... เช่น Biceps Tendinitis"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500" />
        <button onClick={() => { if (custom.trim()) { addCondition(custom.trim()); setCustom('') } }}
          className="flex items-center gap-1 rounded-xl bg-slate-700 hover:bg-slate-600 px-4 py-2.5 text-sm text-slate-300">
          <Plus className="h-3.5 w-3.5" /> เพิ่ม
        </button>
      </div>

      {/* Selected conditions with strength */}
      {draft.conditions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ภาวะที่เลือก — กำหนดความสัมพันธ์</p>
          {draft.conditions.map(c => (
            <div key={c.id} className={'rounded-xl border p-3.5 flex items-center gap-3 ' + STRENGTH_COLOR[c.strength]}>
              <span className="flex-1 text-sm font-medium">{c.condition_name_th}</span>
              {/* Strength selector */}
              <div className="relative">
                <select
                  value={c.strength}
                  onChange={e => updateStrength(c.id, e.target.value as RelationshipStrength)}
                  className="appearance-none bg-transparent border-0 text-[11px] font-semibold focus:outline-none cursor-pointer pr-4"
                >
                  {(Object.keys(RELATIONSHIP_LABELS) as RelationshipStrength[]).map(k => (
                    <option key={k} value={k}>{RELATIONSHIP_LABELS[k]}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
              </div>
              <button onClick={() => remove(c.id)} className="text-current/50 hover:text-red-400 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Strength legend */}
          <div className="rounded-lg bg-slate-900/40 border border-slate-800 p-3">
            <p className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">ความหมาย</p>
            <div className="grid grid-cols-2 gap-1">
              {(Object.entries(RELATIONSHIP_LABELS) as [RelationshipStrength, string][]).map(([k, l]) => (
                <div key={k} className="flex items-center gap-1.5 text-[11px]">
                  <span className={'h-2 w-2 rounded-full ' + (k === 'strongly_suggests' ? 'bg-teal-400' : k === 'supports' ? 'bg-sky-400' : k === 'possibly_related' ? 'bg-amber-400' : 'bg-slate-500')} />
                  <span className="text-slate-400">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
