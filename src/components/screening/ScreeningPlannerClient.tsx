'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, Clock, AlertTriangle, Calendar, Shield, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getRecommendations, RISK_FACTOR_OPTIONS, CATEGORY_LABELS,
  type ScreeningRecommendation, type ScreeningCategory,
} from '@/data/screening-guidelines'

// ── Helpers ──────────────────────────────────────────────────

function formatDueDate(dueDate: Date | null): string {
  if (!dueDate) return 'ควรตรวจเดี๋ยวนี้'
  const now = new Date()
  const diff = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `เกินกำหนด ${Math.abs(diff)} วัน`
  if (diff === 0) return 'ครบกำหนดวันนี้'
  if (diff < 30) return `อีก ${diff} วัน`
  if (diff < 365) return `อีก ${Math.floor(diff / 30)} เดือน`
  return `อีก ${Math.floor(diff / 365)} ปี`
}

const STATUS_CONFIG = {
  overdue:   { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500',    label: 'เกินกำหนด' },
  due_soon:  { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500',  label: 'ควรตรวจ' },
  on_track:  { bg: 'bg-white',     border: 'border-slate-200',  badge: 'bg-slate-100 text-slate-600', dot: 'bg-emerald-500',label: 'ปกติ' },
  not_applicable: { bg: 'bg-white', border: 'border-slate-100', badge: 'bg-slate-50 text-slate-400',  dot: 'bg-slate-300',  label: 'N/A' },
}

// ── Recommendation Card ───────────────────────────────────────

function RecommendationCard({ rec }: { rec: ScreeningRecommendation }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[rec.status]
  const catCfg = CATEGORY_LABELS[rec.test.category]

  return (
    <div className={cn('rounded-2xl border p-4 transition-all', cfg.bg, cfg.border)}>
      <div className="flex items-start gap-3">
        {/* Dot */}
        <div className={cn('mt-1.5 h-2.5 w-2.5 rounded-full shrink-0', cfg.dot)} />

        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className={cn('inline-block text-[10px] font-semibold rounded-full border px-2 py-0.5 mr-2 mb-1', catCfg.color)}>
                {catCfg.icon} {catCfg.th}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{rec.test.nameTh}</h3>
            </div>
            <div className="shrink-0 text-right">
              <span className={cn('text-[10px] font-bold rounded-full px-2 py-0.5', cfg.badge)}>
                {cfg.label}
              </span>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {formatDueDate(rec.dueDate)}
              </div>
            </div>
          </div>

          {/* Reason tag */}
          <p className="text-xs text-slate-500 mb-2">{rec.reason}</p>

          {/* Key info strip */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {rec.test.intervalMonths === 0 ? 'ครั้งเดียว' : `ทุก ${rec.test.intervalMonths >= 12 ? `${rec.test.intervalMonths / 12} ปี` : `${rec.test.intervalMonths} เดือน`}`}
            </span>
            <span>{rec.test.costRange}</span>
            {rec.test.nhsoCovered && (
              <span className="text-emerald-600 font-medium">✓ สปสช. ครอบคลุม</span>
            )}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            {expanded ? 'ซ่อน' : 'ดูรายละเอียด'}
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-black/5 space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">{rec.test.descriptionTh}</p>
              {rec.test.preparationTh && (
                <div className="flex items-start gap-1.5 rounded-lg bg-blue-50 px-3 py-2">
                  <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700"><strong>เตรียมตัว:</strong> {rec.test.preparationTh}</p>
                </div>
              )}
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {rec.test.guidelineTh}
              </p>
              {rec.test.diseaseSlug && (
                <a href={`/diseases/${rec.test.diseaseSlug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-600 hover:text-teal-700">
                  <ExternalLink className="h-3 w-3" />
                  อ่านข้อมูลโรคเพิ่มเติม
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────

export function ScreeningPlannerClient() {
  const [age, setAge] = useState('')
  const [sex, setSex] = useState<'male' | 'female' | ''>('')
  const [riskFactors, setRiskFactors] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<ScreeningCategory | 'all'>('all')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = age !== '' && sex !== ''

  const toggleRisk = (v: string) => {
    setRiskFactors(prev =>
      prev.includes(v) ? prev.filter(r => r !== v) : [...prev, v]
    )
  }

  const recs = useMemo(() => {
    if (!submitted || !age || !sex) return []
    return getRecommendations({
      age: parseInt(age),
      sex: sex as 'male' | 'female',
      riskFactors,
    })
  }, [submitted, age, sex, riskFactors])

  const filtered = activeCategory === 'all'
    ? recs
    : recs.filter(r => r.test.category === activeCategory)

  const overdue = recs.filter(r => r.status === 'overdue').length
  const dueSoon = recs.filter(r => r.status === 'due_soon').length

  const categories = [
    { id: 'all' as const, label: 'ทั้งหมด' },
    ...Object.entries(CATEGORY_LABELS)
      .filter(([cat]) => recs.some(r => r.test.category === cat))
      .map(([cat, cfg]) => ({ id: cat as ScreeningCategory, label: cfg.th })),
  ]

  if (!submitted) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">กรอกข้อมูลเพื่อรับแผนเฉพาะบุคคล</h2>
          <p className="text-sm text-slate-500">อ้างอิงแนวทาง สธ. + NHSO + Royal Colleges</p>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">อายุ (ปี) *</label>
          <input type="number" min="18" max="90" placeholder="เช่น 40"
            value={age} onChange={e => setAge(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            style={{ fontSize: '16px' }} />
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">เพศ *</label>
          <div className="flex gap-3 max-w-xs">
            {[{ v: 'male', l: 'ชาย' }, { v: 'female', l: 'หญิง' }].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => setSex(v as 'male' | 'female')}
                className={cn(
                  'flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all min-h-[48px]',
                  sex === v ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-200'
                )}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            ปัจจัยเสี่ยง (เลือกทั้งหมดที่มี)
          </label>
          <div className="flex flex-wrap gap-2">
            {RISK_FACTOR_OPTIONS.map(({ value, labelTh }) => (
              <button key={value} type="button" onClick={() => toggleRisk(value)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-all min-h-[36px]',
                  riskFactors.includes(value)
                    ? 'border-teal-400 bg-teal-50 text-teal-700'
                    : 'border-slate-200 text-slate-600 hover:border-teal-200'
                )}>
                {labelTh}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setSubmitted(true)} disabled={!canSubmit}
          className="w-full rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          ดูแผนตรวจคัดกรองของฉัน
        </button>

        <p className="text-xs text-slate-400 text-center">
          ข้อมูลนี้ไม่ถูกบันทึก · ใช้เพื่อสร้างแผนเฉพาะบุคคลเท่านั้น
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile summary + reset */}
      <div className="flex items-center justify-between rounded-2xl bg-teal-50 border border-teal-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-teal-800">
            แผนสำหรับ: อายุ {age} ปี · {sex === 'male' ? 'ชาย' : 'หญิง'}
          </p>
          {riskFactors.filter(r => r !== 'none').length > 0 && (
            <p className="text-xs text-teal-600 mt-0.5">
              ปัจจัยเสี่ยง: {riskFactors.filter(r => r !== 'none').slice(0, 3).map(r =>
                RISK_FACTOR_OPTIONS.find(o => o.value === r)?.labelTh
              ).join(', ')}
              {riskFactors.filter(r => r !== 'none').length > 3 && ` +${riskFactors.filter(r => r !== 'none').length - 3}`}
            </p>
          )}
        </div>
        <button onClick={() => { setSubmitted(false); setAge(''); setSex(''); setRiskFactors([]) }}
          className="text-xs font-medium text-teal-600 hover:text-teal-700 underline">
          เปลี่ยนข้อมูล
        </button>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{overdue}</div>
          <div className="text-xs text-red-700">เกินกำหนด</div>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
          <div className="text-2xl font-bold text-amber-600">{dueSoon}</div>
          <div className="text-xs text-amber-700">ควรตรวจ</div>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
          <div className="text-2xl font-bold text-emerald-600">{recs.length}</div>
          <div className="text-xs text-emerald-700">ทั้งหมด</div>
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'
              )}>
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">ไม่มีการตรวจที่แนะนำสำหรับหมวดนี้</p>
          </div>
        ) : (
          filtered.map(rec => (
            <RecommendationCard key={rec.test.id} rec={rec} />
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-2.5">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>ข้อจำกัด:</strong> แผนนี้เป็นคำแนะนำทั่วไปตามแนวทางสุขภาพ ไม่ใช่คำแนะนำทางการแพทย์เฉพาะบุคคล กรุณาปรึกษาแพทย์ของคุณเพื่อแผนที่เหมาะสมที่สุด · ต้องตรวจสอบและรับรองโดยแพทย์ก่อนเผยแพร่จริง
        </p>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a href="/providers"
          className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 text-sm transition-colors">
          ค้นหาสถานพยาบาลใกล้ฉัน
        </a>
        <a href="/risk"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-slate-700 font-semibold py-3.5 text-sm hover:border-teal-300 hover:text-teal-700 transition-colors">
          ประเมินความเสี่ยงเพิ่มเติม
        </a>
      </div>
    </div>
  )
}
