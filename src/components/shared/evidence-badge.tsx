import { ShieldCheck, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EvidenceMetadata } from '@/lib/evidence-types'
import { EVIDENCE_LEVEL_LABELS } from '@/lib/evidence-types'

interface EvidenceBadgeProps {
  evidence: EvidenceMetadata
  locale?: string
  compact?: boolean
  className?: string
}

export function EvidenceBadge({
  evidence,
  locale = 'th',
  compact = false,
  className,
}: EvidenceBadgeProps) {
  const levelLabel = EVIDENCE_LEVEL_LABELS[evidence.overallEvidenceLevel]

  if (compact) {
    return (
      <div className={cn('inline-flex items-center gap-1.5', className)}>
        {evidence.isPendingVerification ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            <Clock className="h-3 w-3" />
            {locale === 'th' ? 'รอตรวจสอบ' : 'Pending review'}
          </span>
        ) : (
          <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium', levelLabel.color)}>
            <ShieldCheck className="h-3 w-3" />
            {locale === 'th' ? levelLabel.th : levelLabel.en}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2', className)}>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0" />
        <span className="text-xs font-semibold text-slate-700">
          {locale === 'th' ? 'แหล่งอ้างอิงและระดับหลักฐาน' : 'Evidence & Sources'}
        </span>
      </div>

      {evidence.isPendingVerification && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 font-medium">
            {locale === 'th'
              ? 'ต้องตรวจสอบแหล่งอ้างอิงก่อนเผยแพร่จริง'
              : 'Pending verification before publication'}
          </p>
        </div>
      )}

      {evidence.sources.map((src, i) => (
        <div key={i} className="text-xs text-slate-600">
          <span className="font-medium">{src.name}</span>
          {src.guidelineName && (
            <span className="text-slate-500"> · {src.guidelineName}</span>
          )}
          {src.year && (
            <span className="text-slate-400"> ({src.year})</span>
          )}
          <span className={cn('ml-2 font-medium text-[11px]', EVIDENCE_LEVEL_LABELS[src.evidenceLevel].color)}>
            {locale === 'th'
              ? EVIDENCE_LEVEL_LABELS[src.evidenceLevel].th
              : EVIDENCE_LEVEL_LABELS[src.evidenceLevel].en}
          </span>
        </div>
      ))}

      <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-2">
        {evidence.disclaimer}
      </p>
    </div>
  )
}
