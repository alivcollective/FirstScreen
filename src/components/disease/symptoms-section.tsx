import { AlertTriangle } from 'lucide-react'
import { SEVERITY_META } from '@/types/disease'
import type { DiseaseSymptom } from '@/types/disease'
import { cn } from '@/lib/utils'

interface Props { symptoms: DiseaseSymptom[]; redFlags: string[] }

export function SymptomsSection({ symptoms, redFlags }: Props) {
  const grouped = {
    red_flag: symptoms.filter(s => s.severity === 'red_flag'),
    severe:   symptoms.filter(s => s.severity === 'severe'),
    moderate: symptoms.filter(s => s.severity === 'moderate'),
    mild:     symptoms.filter(s => s.severity === 'mild'),
  }

  return (
    <div className="space-y-6">
      {/* Red flags first */}
      {redFlags.length > 0 && (
        <div className="rounded-2xl bg-red-50 border border-red-300 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-sm font-bold text-red-800">สัญญาณเตือนที่ต้องไปห้องฉุกเฉิน / โทร 1669</h3>
          </div>
          <ul className="space-y-1.5">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Symptom cards by severity */}
      {(['red_flag', 'severe', 'moderate', 'mild'] as const).map(sev => {
        const items = grouped[sev]
        if (!items.length) return null
        const cfg = SEVERITY_META[sev]
        return (
          <div key={sev}>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', cfg.dot)} />
              <h3 className={cn('text-xs font-bold uppercase tracking-wide', cfg.color)}>
                {sev === 'red_flag' ? 'อาการเตือน' : sev === 'severe' ? 'อาการรุนแรง' : sev === 'moderate' ? 'อาการปานกลาง' : 'อาการเบา'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map(s => (
                <div key={s.id} className={cn('rounded-xl border p-4', cfg.bg, cfg.border)}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className={cn('text-sm font-semibold', cfg.color)}>{s.nameTh}</h4>
                    <span className={cn('shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full', cfg.bg, cfg.color)}>
                      {cfg.labelTh}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.descriptionTh}</p>
                  {s.frequencyNote && (
                    <p className="text-[11px] text-slate-400 mt-1.5 italic">{s.frequencyNote}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
