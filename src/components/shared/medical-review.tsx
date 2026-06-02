import { ShieldCheck, Clock, ExternalLink, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Medical Review Trust Banner ───────────────────────────────
// Used on every disease page, article, and assessment result
// Adds credibility signals like Healthline / WebMD / Mayo Clinic

interface MedicalReviewProps {
  reviewedBy?: string
  reviewDate?: string       // "YYYY-MM" format
  evidenceLevel?: 'A' | 'B' | 'C' | 'D' | 'pending'
  isPending?: boolean
  referenceCount?: number
  className?: string
  compact?: boolean
}

const EVIDENCE_LABELS: Record<NonNullable<MedicalReviewProps['evidenceLevel']>, {
  label: string
  desc: string
  color: string
  bg: string
}> = {
  A: { label: 'Grade A', desc: 'Systematic reviews / RCTs', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  B: { label: 'Grade B', desc: 'Cohort studies', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  C: { label: 'Grade C', desc: 'Observational studies', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  D: { label: 'Grade D', desc: 'Expert consensus', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  pending: { label: 'รอตรวจสอบ', desc: 'Pending medical review', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
}

function formatReviewDate(ym?: string): string {
  if (!ym) return ''
  const [year, month] = ym.split('-')
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  const m = parseInt(month, 10) - 1
  return `${monthNames[m] ?? ''} ${year}`
}

export function MedicalReview({
  reviewedBy,
  reviewDate,
  evidenceLevel = 'pending',
  isPending,
  referenceCount,
  className,
  compact = false,
}: MedicalReviewProps) {
  const ev = EVIDENCE_LABELS[evidenceLevel]
  const isActuallyPending = isPending || evidenceLevel === 'pending'

  if (compact) {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        <div className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium', ev.bg, ev.color)}>
          <ShieldCheck className="h-3 w-3" />
          {isActuallyPending ? 'รอการตรวจสอบ' : 'ตรวจสอบแล้ว'}
        </div>
        {reviewDate && !isActuallyPending && (
          <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            อัปเดต {formatReviewDate(reviewDate)}
          </div>
        )}
        {isActuallyPending && (
          <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
            <AlertCircle className="h-3 w-3" />
            เนื้อหาต้องตรวจสอบก่อนเผยแพร่จริง
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border bg-slate-50 p-4', className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100">
          <ShieldCheck className="h-4.5 w-4.5 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-700">
              {isActuallyPending ? 'ตรวจสอบทางการแพทย์' : 'ตรวจสอบแล้ว'}
            </span>
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold', ev.bg, ev.color)}>
              {ev.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {reviewedBy && (
              <span className="flex items-center gap-1">
                <span className="font-medium text-slate-600">โดย:</span> {reviewedBy}
              </span>
            )}
            {reviewDate && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                อัปเดต {formatReviewDate(reviewDate)}
              </span>
            )}
            {referenceCount && (
              <span>{referenceCount} แหล่งอ้างอิง</span>
            )}
          </div>

          {isActuallyPending && (
            <p className="mt-2 text-[11px] leading-relaxed text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              เนื้อหานี้อยู่ระหว่างการตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ — ใช้เพื่อการศึกษาเท่านั้น
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Inline Review Strip (for article cards & page tops) ──────

export function ReviewStrip({
  reviewedBy,
  reviewDate,
  isPending,
  className,
}: Pick<MedicalReviewProps, 'reviewedBy' | 'reviewDate' | 'isPending' | 'className'>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3 text-xs text-slate-500', className)}>
      <span className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium',
        isPending
          ? 'bg-amber-50 text-amber-700 border border-amber-200'
          : 'bg-teal-50 text-teal-700 border border-teal-200'
      )}>
        <ShieldCheck className="h-3 w-3" />
        {isPending ? 'รอการตรวจสอบ' : 'ตรวจสอบแล้ว'}
      </span>
      {reviewedBy && <span>โดย {reviewedBy}</span>}
      {reviewDate && (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatReviewDate(reviewDate)}
        </span>
      )}
    </div>
  )
}

// ── Reference Chip ────────────────────────────────────────────

export function ReferenceChip({
  source,
  year,
  url,
}: {
  source: string
  year?: number
  url?: string
}) {
  const content = (
    <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-600 hover:border-teal-300 hover:text-teal-700 transition-colors">
      {source}
      {year && <span className="text-slate-400">{year}</span>}
      {url && <ExternalLink className="h-2.5 w-2.5" />}
    </span>
  )
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer">{content}</a>
  return content
}
