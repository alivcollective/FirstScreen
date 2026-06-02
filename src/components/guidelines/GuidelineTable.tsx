import { ShieldCheck, AlertCircle, Info, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getOrgMeta, type DiseaseGuideline, type EvidenceGrade, type Organization } from '@/data/guidelines'

// ── Evidence grade badge ──────────────────────────────────────

const GRADE_CONFIG: Record<EvidenceGrade, { label: string; color: string; bg: string; border: string; desc: string }> = {
  A: { label: 'Grade A', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', desc: 'หลักฐานแข็งแกร่ง (RCT / Systematic Review)' },
  B: { label: 'Grade B', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-300', desc: 'หลักฐานปานกลาง (Cohort / Observational)' },
  C: { label: 'Grade C', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', desc: 'หลักฐานจำกัด (Expert Consensus)' },
  I: { label: 'ไม่เพียงพอ', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300', desc: 'หลักฐานไม่เพียงพอ' },
  pending: { label: 'รอตรวจสอบ', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', desc: 'อยู่ระหว่างตรวจสอบ' },
}

export function EvidenceBadge({ grade, compact = false }: { grade: EvidenceGrade; compact?: boolean }) {
  const cfg = GRADE_CONFIG[grade]
  if (compact) {
    return (
      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold', cfg.bg, cfg.border, cfg.color)}>
        {cfg.label}
      </span>
    )
  }
  return (
    <div className={cn('rounded-lg border px-3 py-2', cfg.bg, cfg.border)}>
      <p className={cn('text-xs font-bold', cfg.color)}>{cfg.label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{cfg.desc}</p>
    </div>
  )
}

// ── Org badge ─────────────────────────────────────────────────

export function OrgBadge({ org }: { org: Organization }) {
  const meta = getOrgMeta(org)
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold', meta.color)}>
      {meta.badge}
    </span>
  )
}

// ── Main comparison table ─────────────────────────────────────

interface GuidelineTableProps {
  guideline: DiseaseGuideline
  showThaiFirst?: boolean
}

export function GuidelineTable({ guideline, showThaiFirst = true }: GuidelineTableProps) {
  const recs = showThaiFirst
    ? [
        ...guideline.recommendations.filter(r => ['MOPH', 'NHSO', 'RCPT'].includes(r.org)),
        ...guideline.recommendations.filter(r => !['MOPH', 'NHSO', 'RCPT'].includes(r.org)),
      ]
    : guideline.recommendations

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0 rounded-2xl overflow-hidden border border-slate-200">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-32">แนวทาง</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">คำแนะนำ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-28">เริ่มอายุ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-28">ความถี่</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-24">หลักฐาน</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-20">ปรับปรุง</th>
            </tr>
          </thead>
          <tbody>
            {recs.map((rec, i) => {
              const isThaiOrg = ['MOPH', 'NHSO', 'RCPT'].includes(rec.org)
              const orgMeta = getOrgMeta(rec.org)
              const gradeCfg = GRADE_CONFIG[rec.evidenceGrade]
              return (
                <tr key={i} className={cn(
                  'border-b border-slate-100 transition-colors hover:bg-slate-50',
                  isThaiOrg ? 'bg-teal-50/30' : 'bg-white'
                )}>
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1.5">
                      <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold', orgMeta.color)}>
                        {orgMeta.badge}
                      </span>
                      {isThaiOrg && (
                        <span className="block text-[10px] font-semibold text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5">
                          TH
                        </span>
                      )}
                      <p className="text-[10px] text-slate-400 leading-tight">{rec.orgFullTh}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm text-slate-800 leading-relaxed">{rec.recommendation}</p>
                    {rec.keyNote && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5">
                        <Info className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-amber-700">{rec.keyNote}</p>
                      </div>
                    )}
                    {rec.riskGroups.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.riskGroups.slice(0, 3).map(g => (
                          <span key={g} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{g}</span>
                        ))}
                        {rec.riskGroups.length > 3 && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">+{rec.riskGroups.length - 3}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm font-semibold text-slate-800">{rec.startingAge}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm text-slate-700">{rec.frequency}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold', gradeCfg.bg, gradeCfg.border, gradeCfg.color)}>
                      {gradeCfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {rec.lastUpdated}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {recs.map((rec, i) => {
          const isThaiOrg = ['MOPH', 'NHSO', 'RCPT'].includes(rec.org)
          const orgMeta = getOrgMeta(rec.org)
          const gradeCfg = GRADE_CONFIG[rec.evidenceGrade]
          return (
            <div key={i} className={cn(
              'rounded-2xl border p-4',
              isThaiOrg ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-200'
            )}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn('rounded-full border px-2.5 py-1 text-xs font-bold', orgMeta.color)}>
                    {orgMeta.badge}
                  </span>
                  {isThaiOrg && <span className="text-xs text-teal-600 font-medium">แนวทางไทย</span>}
                </div>
                <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold', gradeCfg.bg, gradeCfg.border, gradeCfg.color)}>
                  {gradeCfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{rec.orgFullTh}</p>
              <p className="text-sm text-slate-800 leading-relaxed mb-3">{rec.recommendation}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/60 border border-slate-200 px-2.5 py-2">
                  <p className="text-slate-400 mb-0.5">เริ่มอายุ</p>
                  <p className="font-semibold text-slate-800">{rec.startingAge}</p>
                </div>
                <div className="rounded-lg bg-white/60 border border-slate-200 px-2.5 py-2">
                  <p className="text-slate-400 mb-0.5">ความถี่</p>
                  <p className="font-semibold text-slate-800">{rec.frequency}</p>
                </div>
              </div>
              {rec.keyNote && (
                <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5">
                  <Info className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-700">{rec.keyNote}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Key differences callout ───────────────────────────────────

export function KeyDifferences({ differences }: { differences: string[] }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
        <h3 className="text-sm font-semibold text-amber-800">ความแตกต่างสำคัญระหว่างแนวทาง</h3>
      </div>
      <ul className="space-y-2">
        {differences.map((d, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Safety disclaimer for guidelines ─────────────────────────

export function GuidelineDisclaimer() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-1">ข้อสำคัญด้านความปลอดภัย</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ข้อมูลแนวทางปฏิบัตินี้เป็นเพื่อการศึกษาเท่านั้น อยู่ระหว่างการตรวจสอบโดยแพทย์ผู้เชี่ยวชาญก่อนเผยแพร่อย่างเป็นทางการ
            แนวทางอาจมีการปรับปรุงและแตกต่างตามบริบทของผู้ป่วยแต่ละราย
            <strong className="text-slate-600"> ควรปรึกษาแพทย์เสมอเพื่อรับคำแนะนำที่เหมาะกับคุณโดยเฉพาะ</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
