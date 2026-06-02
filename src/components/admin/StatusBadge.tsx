import { cn } from '@/lib/utils'
import type { ArticleStatus } from '@/types/kms'
import type { ContentStatus } from '@/types/medical'

// ── Legacy ArticleStatus support (used by KMS admin pages) ───

const ARTICLE_STATUS_CONFIG: Record<ArticleStatus, { label: string; color: string }> = {
  draft:     { label: 'ร่าง',        color: 'bg-slate-700 text-slate-300' },
  review:    { label: 'รอตรวจสอบ',   color: 'bg-amber-900/50 text-amber-300 border border-amber-700/50' },
  approved:  { label: 'อนุมัติแล้ว', color: 'bg-blue-900/50 text-blue-300 border border-blue-700/50' },
  published: { label: 'เผยแพร่แล้ว', color: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' },
  archived:  { label: 'เก็บถาวร',    color: 'bg-slate-800 text-slate-500' },
}

export function StatusBadge({ status, size = 'md' }: { status: ArticleStatus | ContentStatus | string; size?: 'sm' | 'md' }) {
  // Prefer inline-style ContentStatus rendering for medical content statuses
  const contentConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
    draft:          { label: 'Draft',        bg: '#1e293b', color: '#94a3b8', border: '#334155' },
    pending_review: { label: 'รอตรวจสอบ',   bg: '#451a03', color: '#fbbf24', border: '#92400e' },
    needs_revision: { label: 'ต้องแก้ไข',   bg: '#450a0a', color: '#f87171', border: '#991b1b' },
    approved:       { label: 'อนุมัติแล้ว', bg: '#052e16', color: '#4ade80', border: '#14532d' },
    published:      { label: 'เผยแพร่',     bg: '#042f2e', color: '#2dd4bf', border: '#134e4a' },
    archived:       { label: 'เก็บถาวร',    bg: '#1e2535', color: '#64748b', border: '#2d3748' },
    // KMS-specific
    review:         { label: 'รอตรวจสอบ',   bg: '#451a03', color: '#fbbf24', border: '#92400e' },
  }

  const cfg = contentConfig[status]
  if (cfg) {
    const fontSize = size === 'sm' ? 10 : 11
    const padding  = size === 'sm' ? '1px 6px' : '2px 8px'
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 99, border: `1px solid ${cfg.border}`, background: cfg.bg, color: cfg.color, fontSize, fontWeight: 600, padding, whiteSpace: 'nowrap', lineHeight: '1.6' }}>
        {cfg.label}
      </span>
    )
  }

  // Fallback to legacy Tailwind style
  const legacyCfg = ARTICLE_STATUS_CONFIG[status as ArticleStatus] ?? { label: status, color: 'bg-slate-700 text-slate-300' }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', legacyCfg.color)}>
      {legacyCfg.label}
    </span>
  )
}

// ── SeverityBadge ─────────────────────────────────────────────

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  mild:     { label: 'เล็กน้อย', color: '#059669' },
  moderate: { label: 'ปานกลาง', color: '#d97706' },
  severe:   { label: 'รุนแรง',   color: '#dc2626' },
  critical: { label: 'วิกฤติ',   color: '#7c3aed' },
}

export function SeverityBadge({ severity, size = 'md' }: { severity: string; size?: 'sm' | 'md' }) {
  const cfg = SEVERITY_CONFIG[severity] ?? { label: severity, color: '#64748b' }
  const fontSize = size === 'sm' ? 10 : 11
  const padding  = size === 'sm' ? '1px 6px' : '2px 8px'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 99, border: `1px solid ${cfg.color}44`, background: `${cfg.color}18`, color: cfg.color, fontSize, fontWeight: 600, padding, whiteSpace: 'nowrap', lineHeight: '1.6' }}>
      {cfg.label}
    </span>
  )
}
