import { Calendar, CheckCircle2, Shield } from 'lucide-react'
import type { ScreeningTest } from '@/types/disease'
import { cn } from '@/lib/utils'

interface Props { screening: ScreeningTest[] }

export function ScreeningSection({ screening }: Props) {
  if (!screening.length) return <p className="text-slate-500 text-sm">ไม่มีข้อมูลการตรวจคัดกรอง</p>

  return (
    <div className="space-y-4">
      {screening.map((test, i) => (
        <div key={test.id} className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
          <div className="flex items-start gap-4">
            {/* Step number */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="text-base font-bold text-teal-900">{test.nameTh}</h3>
                  <p className="text-xs text-teal-600">{test.nameEn}</p>
                </div>
                {test.isNHSOCovered && (
                  <span className="shrink-0 text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full px-2.5 py-1">
                    ฟรี สปสช.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 mb-3">
                <div>
                  <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide mb-0.5">อายุที่แนะนำ</p>
                  <p className="text-xs font-medium text-slate-800">{test.ageRange}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide mb-0.5">ความถี่</p>
                  <p className="text-xs font-medium text-slate-800">{test.frequency}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide mb-0.5">สำหรับ</p>
                  <p className="text-xs font-medium text-slate-800">
                    {test.sex === 'female' ? 'ผู้หญิง' : test.sex === 'male' ? 'ผู้ชาย' : 'ทุกเพศ'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">{test.descriptionTh}</p>

              <div className="flex items-center gap-1.5 text-[11px] text-teal-600">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>{test.guidelineSource}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs text-amber-800">
          <strong>หมายเหตุ:</strong> ข้อมูลการตรวจคัดกรองเพื่อการศึกษาเท่านั้น ควรปรึกษาแพทย์เพื่อกำหนดแผนการตรวจที่เหมาะสมกับคุณ ต้องตรวจสอบแหล่งอ้างอิงก่อนนำไปใช้จริง
        </p>
      </div>
    </div>
  )
}
