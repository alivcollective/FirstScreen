import { IMPACT_META } from '@/types/disease'
import type { PreventionAction } from '@/types/disease'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface Props { prevention: PreventionAction[] }

export function PreventionSection({ prevention }: Props) {
  const sorted = [...prevention].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.impact] - order[b.impact]
  })

  return (
    <div className="space-y-3">
      {sorted.map((p, i) => {
        const cfg = IMPACT_META[p.impact]
        return (
          <div key={i} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-200 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{p.actionTh}</h4>
                <span className={cn('shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full', cfg.bg, cfg.color)}>
                  {cfg.labelTh}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{p.descriptionTh}</p>
              <p className="text-[10px] text-slate-400 italic">{p.evidence}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
