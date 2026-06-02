import { cn } from '@/lib/utils'
import type { ArticleStatus } from '@/types/kms'

const STATUS_CONFIG: Record<ArticleStatus, { label: string; color: string }> = {
  draft:     { label: 'ร่าง',        color: 'bg-slate-700 text-slate-300' },
  review:    { label: 'รอตรวจสอบ',   color: 'bg-amber-900/50 text-amber-300 border border-amber-700/50' },
  approved:  { label: 'อนุมัติแล้ว', color: 'bg-blue-900/50 text-blue-300 border border-blue-700/50' },
  published: { label: 'เผยแพร่แล้ว', color: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' },
  archived:  { label: 'เก็บถาวร',    color: 'bg-slate-800 text-slate-500' },
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', cfg.color)}>
      {cfg.label}
    </span>
  )
}
