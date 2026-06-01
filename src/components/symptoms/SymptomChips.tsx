'use client'

import { useState } from 'react'
import { X, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSymptomsByRegion, allSymptoms, SEVERITY_COLORS } from '@/data/symptoms'
import type { BodyRegion, Symptom } from '@/types/symptom'

interface SymptomChipsProps {
  selectedRegion: BodyRegion | null
  selectedSymptoms: string[]
  customSymptom: string
  onToggleSymptom: (id: string) => void
  onClearAll: () => void
  onCustomSymptomChange: (text: string) => void
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢',
}

export function SymptomChips({
  selectedRegion,
  selectedSymptoms,
  customSymptom,
  onToggleSymptom,
  onClearAll,
  onCustomSymptomChange,
}: SymptomChipsProps) {
  const [filter, setFilter] = useState('')

  // Symptoms to show: region-filtered OR all if no region
  const regionSymptoms: Symptom[] = selectedRegion
    ? getSymptomsByRegion(selectedRegion)
    : allSymptoms

  const filtered = filter.trim()
    ? allSymptoms.filter(s => s.label.includes(filter.trim()))
    : regionSymptoms

  const hasSelected = selectedSymptoms.length > 0

  return (
    <div className="space-y-4">
      {/* Selected chips summary */}
      {hasSelected && (
        <div className="rounded-xl bg-sky-50 border border-sky-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-700">
              เลือกแล้ว {selectedSymptoms.length} อาการ
            </span>
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              ล้างทั้งหมด
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedSymptoms.map(id => {
              const sym = allSymptoms.find(s => s.id === id)
              if (!sym) return null
              return (
                <span key={id} className="inline-flex items-center gap-1 rounded-full bg-sky-500 text-white text-xs font-medium px-2.5 py-1">
                  {sym.label}
                  <button onClick={() => onToggleSymptom(id)} className="hover:opacity-70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
            {customSymptom && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-500 text-white text-xs font-medium px-2.5 py-1">
                {customSymptom}
                <button onClick={() => onCustomSymptomChange('')} className="hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="ค้นหาอาการ..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Chip grid */}
      <div>
        {!selectedRegion && !filter && (
          <p className="text-xs text-slate-400 mb-2">
            เลือกบริเวณร่างกายด้านบน หรือค้นหาอาการโดยตรง
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {filtered.map(symptom => {
            const isSelected = selectedSymptoms.includes(symptom.id)
            return (
              <button
                key={symptom.id}
                onClick={() => onToggleSymptom(symptom.id)}
                aria-pressed={isSelected}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-all min-h-[40px]',
                  isSelected
                    ? 'bg-sky-500 border-sky-500 text-white shadow-sm'
                    : cn(
                        'bg-white hover:border-sky-400 hover:text-sky-700',
                        symptom.severity === 'critical'
                          ? 'border-red-200 text-red-700'
                          : symptom.severity === 'high'
                          ? 'border-orange-200 text-orange-700'
                          : 'border-slate-200 text-slate-700'
                      )
                )}
              >
                <span className="text-[11px]">{SEVERITY_BADGE[symptom.severity]}</span>
                {symptom.label}
              </button>
            )
          })}
        </div>

        {filter && filtered.length === 0 && (
          <p className="text-sm text-slate-400 mt-2">ไม่พบอาการที่ค้นหา</p>
        )}
      </div>

      {/* Custom symptom */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          อาการอื่นๆ ที่ไม่อยู่ในรายการ
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ระบุอาการเพิ่มเติม..."
            value={customSymptom}
            onChange={e => onCustomSymptomChange(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Severity legend */}
      <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span>ระดับ:</span>
        <span>🔴 ฉุกเฉิน</span>
        <span>🟠 สูง</span>
        <span>🟡 ปานกลาง</span>
        <span>🟢 ต่ำ</span>
      </div>
    </div>
  )
}
