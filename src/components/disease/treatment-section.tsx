'use client'

import { useState } from 'react'
import { ChevronDown, Pill } from 'lucide-react'
import type { TreatmentOption } from '@/types/disease'
import { cn } from '@/lib/utils'

interface Props { treatments: TreatmentOption[] }

export function TreatmentSection({ treatments }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  if (!treatments.length) return <p className="text-slate-500 text-sm">ไม่มีข้อมูลการรักษา</p>

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-4">
        <p className="text-xs text-amber-800">
          <strong>สำคัญ:</strong> ข้อมูลการรักษานี้เพื่อการศึกษาเท่านั้น การเลือกแนวทางรักษาต้องขึ้นอยู่กับการวินิจฉัยและแนะนำโดยแพทย์เฉพาะทาง
        </p>
      </div>

      {treatments.map((t, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                <Pill className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide">{t.categoryTh}</p>
                <p className="text-sm font-bold text-slate-900">{t.nameTh}</p>
              </div>
            </div>
            <ChevronDown className={cn('h-5 w-5 text-slate-400 transition-transform shrink-0', openIdx === i && 'rotate-180')} />
          </button>

          {openIdx === i && (
            <div className="px-5 pb-5 border-t border-slate-100">
              <div className="pt-4 space-y-3">
                {t.forStage && (
                  <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-1.5 inline-block font-medium">
                    ใช้สำหรับ: {t.forStage}
                  </p>
                )}
                <p className="text-sm text-slate-700 leading-relaxed">{t.descriptionTh}</p>
                {t.sideEffectsTh && t.sideEffectsTh.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">ผลข้างเคียงที่อาจพบ:</p>
                    <div className="flex flex-wrap gap-2">
                      {t.sideEffectsTh.map((se, j) => (
                        <span key={j} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5">
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
