'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import {
  X, ArrowRight, MapPin, ChevronRight, ShieldCheck,
} from 'lucide-react'
import type { BodyRegion } from '@/types/body-map'
import { RedFlagAlert } from './RedFlagAlert'
import { cn } from '@/lib/utils'

interface SymptomPanelProps {
  region: BodyRegion | null
  onClose: () => void
  variant: 'panel' | 'sheet'   // panel = desktop sidebar, sheet = mobile bottom sheet
}

export function SymptomPanel({ region, onClose, variant }: SymptomPanelProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const router = useRouter()

  // Reset selections when region changes
  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    )
  }

  const handleStartAssessment = () => {
    if (!region) return
    const symptomParam = selectedSymptoms.join(',')
    const url = `/symptom-assessment?bodyPart=${region.slug}${symptomParam ? `&symptom=${symptomParam}` : ''}`
    router.push(url as Parameters<typeof router.push>[0])
    onClose()
  }

  // Get any red flags from selected symptoms
  const activeRedFlags = region?.redFlags.filter(flag => {
    const selectedSymptomObjs = region.symptoms.filter(s => selectedSymptoms.includes(s.id))
    return selectedSymptomObjs.some(s => s.urgency === 'emergency' || s.urgency === 'urgent')
  }) ?? []

  if (!region) return null

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
            <MapPin className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400">ตำแหน่งที่เลือก</p>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {region.name_th}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="ปิด"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Red flags first */}
        {activeRedFlags.length > 0 && (
          <RedFlagAlert flags={activeRedFlags} />
        )}

        {/* Region-level red flags (always shown) */}
        {region.redFlags.length > 0 && activeRedFlags.length === 0 && (
          <RedFlagAlert flags={region.redFlags} />
        )}

        {/* Symptom question */}
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-3">
            คุณมีอาการอะไรที่บริเวณ{region.name_th}?
          </p>
          <div className="flex flex-wrap gap-2">
            {region.symptoms.map((symptom) => {
              const selected = selectedSymptoms.includes(symptom.id)
              const isUrgent = symptom.urgency === 'emergency' || symptom.urgency === 'urgent'
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    'rounded-xl border px-3 py-1.5 text-sm font-medium transition-all',
                    selected
                      ? isUrgent
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-teal-50 border-teal-400 text-teal-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700'
                  )}
                >
                  {symptom.label_th}
                  {isUrgent && selected && (
                    <span className="ml-1 text-red-500">!</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Red flag note from selected symptoms */}
        {selectedSymptoms.length > 0 && (() => {
          const urgentSymptom = region.symptoms.find(
            s => selectedSymptoms.includes(s.id) && s.redFlagNote
          )
          if (!urgentSymptom?.redFlagNote) return null
          return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-800 leading-relaxed">
                {urgentSymptom.redFlagNote}
              </p>
            </div>
          )
        })()}

        {/* Related conditions — non-diagnostic */}
        {region.possibleConditions.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
              อาจเกี่ยวข้องกับ
            </p>
            <div className="flex flex-wrap gap-1.5">
              {region.possibleConditions.map(c => (
                <span
                  key={c}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              ข้อมูลเพื่อการศึกษา ไม่ใช่การวินิจฉัย
            </p>
          </div>
        )}

        {/* Direct assessment shortcut */}
        {region.nextRoute && (
          <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3">
            <a
              href={region.nextRoute}
              className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-600 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              ประเมินความเสี่ยงที่เกี่ยวข้อง
              <ChevronRight className="h-4 w-4 ml-auto" />
            </a>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <button
          onClick={handleStartAssessment}
          disabled={selectedSymptoms.length === 0}
          className={cn(
            'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all',
            selectedSymptoms.length > 0
              ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          เริ่มประเมินอาการ
          {selectedSymptoms.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {selectedSymptoms.length}
            </span>
          )}
          <ArrowRight className="h-4 w-4" />
        </button>
        {selectedSymptoms.length === 0 && (
          <p className="text-xs text-slate-400 text-center mt-2">
            เลือกอาการอย่างน้อย 1 รายการ
          </p>
        )}

        {/* Safety disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
          FirstScreen ให้ข้อมูลเพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค
        </p>
      </div>
    </div>
  )

  if (variant === 'sheet') {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Sheet */}
        <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
          {/* Pull handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-8 rounded-full bg-slate-200" />
          </div>
          {content}
        </div>
      </div>
    )
  }

  // Desktop panel
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-100">
      {content}
    </div>
  )
}
