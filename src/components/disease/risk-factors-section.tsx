import { ShieldCheck, ShieldAlert, ShieldHalf } from 'lucide-react'
import type { RiskFactor } from '@/types/disease'
import { cn } from '@/lib/utils'

interface Props { riskFactors: RiskFactor[]; causes: string[] }

const TYPE_CONFIG = {
  modifiable: {
    label: 'ปรับเปลี่ยนได้',
    icon: ShieldCheck,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    headerBg: 'bg-emerald-600',
  },
  non_modifiable: {
    label: 'ปรับเปลี่ยนไม่ได้',
    icon: ShieldAlert,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    headerBg: 'bg-slate-600',
  },
  partially_modifiable: {
    label: 'ปรับได้บางส่วน',
    icon: ShieldHalf,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    headerBg: 'bg-amber-500',
  },
}

export function RiskFactorsSection({ riskFactors, causes }: Props) {
  const grouped = {
    modifiable: riskFactors.filter(r => r.type === 'modifiable'),
    partially_modifiable: riskFactors.filter(r => r.type === 'partially_modifiable'),
    non_modifiable: riskFactors.filter(r => r.type === 'non_modifiable'),
  }

  return (
    <div className="space-y-8">
      {/* Causes */}
      {causes.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">สาเหตุ</h3>
          <div className="space-y-2">
            {causes.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <p className="text-sm text-slate-700">{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors grouped */}
      {(['modifiable', 'partially_modifiable', 'non_modifiable'] as const).map(type => {
        const items = grouped[type]
        if (!items.length) return null
        const cfg = TYPE_CONFIG[type]
        const Icon = cfg.icon
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn('flex h-6 w-6 items-center justify-center rounded-full', cfg.headerBg)}>
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <h3 className={cn('text-sm font-bold', cfg.color)}>
                ปัจจัยเสี่ยงที่{cfg.label}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((rf, i) => (
                <div key={i} className={cn('rounded-xl border p-4', cfg.bg, cfg.border)}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className={cn('text-sm font-semibold', cfg.color)}>{rf.nameTh}</h4>
                    {rf.relativeRisk && (
                      <span className={cn('shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border', cfg.border, cfg.color)}>
                        {rf.relativeRisk}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rf.descriptionTh}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
