'use client'

import { useRef } from 'react'
import { Printer, Download, ShieldCheck, Calendar, Activity, Heart, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────

export interface ReportData {
  generatedAt: string
  patientAge?: number
  patientSex?: 'male' | 'female' | 'other'
  riskScores: {
    category: string
    score: number
    maxScore?: number
    riskLevel: 'low' | 'moderate' | 'high' | 'very_high'
    label: string
  }[]
  screeningRecommendations: {
    name: string
    dueDate?: string
    priority: 'urgent' | 'soon' | 'routine'
    nhsoCovered: boolean
    guidelineSource: string
  }[]
  differentialDiagnosis?: {
    condition: string
    confidence: 'high' | 'moderate' | 'low'
    score: number
  }[]
  urgencyLevel?: 1 | 2 | 3 | 4
  urgencyLabel?: string
  chiefComplaint?: string
  guidelineReferences: {
    org: string
    recommendation: string
    evidenceGrade: string
  }[]
  nextActions: string[]
  disclaimer: string
}

// ── Risk level config ─────────────────────────────────────────

const RISK_CONFIG = {
  low: { label: 'ต่ำ', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' },
  moderate: { label: 'ปานกลาง', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' },
  high: { label: 'สูง', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500' },
  very_high: { label: 'สูงมาก', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500' },
}

// ── Print/PDF styles ──────────────────────────────────────────

const PRINT_STYLES = `
@media print {
  .no-print { display: none !important; }
  .print-page {
    background: white !important;
    color: black !important;
    font-size: 11pt !important;
    max-width: 100% !important;
    padding: 0 !important;
  }
  body { margin: 0; padding: 0; }
}
`

// ── Report sections ───────────────────────────────────────────

function ReportHeader({ data }: { data: ReportData }) {
  return (
    <div className="border-b-2 border-teal-600 pb-5 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">รายงานสุขภาพส่วนบุคคล</h1>
          <p className="text-sm text-slate-500">รายงานสุขภาพส่วนบุคคล</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">สร้างโดย</p>
          <p className="text-sm font-bold text-teal-700">FirstScreen</p>
          <p className="text-xs text-slate-400 mt-1">
            วันที่: {new Date(data.generatedAt).toLocaleDateString('th-TH', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Patient profile */}
      {(data.patientAge || data.patientSex) && (
        <div className="mt-4 flex gap-6 text-sm">
          {data.patientAge && (
            <div>
              <p className="text-slate-400 text-xs">อายุ</p>
              <p className="font-semibold text-slate-800">{data.patientAge} ปี</p>
            </div>
          )}
          {data.patientSex && (
            <div>
              <p className="text-slate-400 text-xs">เพศ</p>
              <p className="font-semibold text-slate-800">
                {data.patientSex === 'male' ? 'ชาย' : data.patientSex === 'female' ? 'หญิง' : 'อื่นๆ'}
              </p>
            </div>
          )}
          {data.chiefComplaint && (
            <div>
              <p className="text-slate-400 text-xs">อาการหลัก</p>
              <p className="font-semibold text-slate-800">{data.chiefComplaint}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RiskScoresSection({ scores }: { scores: ReportData['riskScores'] }) {
  return (
    <section className="mb-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
        <Activity className="h-4 w-4 text-teal-600" />
        ผลการประเมินความเสี่ยง
      </h2>
      <div className="space-y-3">
        {scores.map(s => {
          const cfg = RISK_CONFIG[s.riskLevel]
          const pct = s.maxScore ? Math.round((s.score / s.maxScore) * 100) : s.score
          return (
            <div key={s.category} className={cn('rounded-xl border p-3.5', cfg.bg, cfg.border)}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-800">{s.category}</p>
                <span className={cn('text-xs font-bold rounded-full px-2 py-0.5 border', cfg.bg, cfg.border, cfg.color)}>
                  {cfg.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-white/60">
                  <div className={cn('h-2 rounded-full', cfg.bar)} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <span className={cn('text-sm font-bold', cfg.color)}>{s.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ScreeningSection({ items }: { items: ReportData['screeningRecommendations'] }) {
  const priorityOrder = { urgent: 0, soon: 1, routine: 2 }
  const sorted = [...items].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const priorityCfg = {
    urgent: { label: 'ด่วน', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    soon: { label: 'เร็วๆ นี้', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    routine: { label: 'ตามกำหนด', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
  }

  return (
    <section className="mb-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
        <Calendar className="h-4 w-4 text-teal-600" />
        คำแนะนำการตรวจคัดกรอง
      </h2>
      <div className="space-y-2">
        {sorted.map((item, i) => {
          const cfg = priorityCfg[item.priority]
          return (
            <div key={i} className={cn('flex items-start gap-3 rounded-xl border p-3', cfg.bg, cfg.border)}>
              <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0', cfg.bg, cfg.border, cfg.color)}>
                {cfg.label}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{item.name}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-slate-500">
                  {item.dueDate && <span>กำหนด: {item.dueDate}</span>}
                  {item.nhsoCovered && <span className="text-teal-600 font-medium">✓ ฟรี สปสช.</span>}
                  <span>{item.guidelineSource}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function GuidelinesSection({ refs }: { refs: ReportData['guidelineReferences'] }) {
  return (
    <section className="mb-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
        <ShieldCheck className="h-4 w-4 text-teal-600" />
        แนวทางอ้างอิง
      </h2>
      <div className="space-y-2">
        {refs.map((ref, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 shrink-0">
              {ref.org}
            </span>
            <div className="flex-1">
              <p className="text-xs text-slate-700 leading-relaxed">{ref.recommendation}</p>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 shrink-0">
              {ref.evidenceGrade}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function NextActionsSection({ actions }: { actions: string[] }) {
  return (
    <section className="mb-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
        <Heart className="h-4 w-4 text-teal-600" />
        ขั้นตอนถัดไปที่แนะนำ
      </h2>
      <ol className="space-y-2">
        {actions.map((action, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">{action}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────

interface HealthReportProps {
  data: ReportData
  className?: string
}

export function HealthReport({ data, className }: HealthReportProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={cn('', className)}>
      {/* Print button */}
      <div className="no-print flex gap-3 mb-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Printer className="h-4 w-4" />
          พิมพ์รายงาน
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          บันทึก PDF
        </button>
      </div>

      {/* Print styles */}
      <style>{PRINT_STYLES}</style>

      {/* Report content */}
      <div ref={reportRef} className={cn('print-page rounded-2xl border border-slate-200 bg-white p-6 sm:p-8', className)}>
        <ReportHeader data={data} />

        {data.urgencyLevel && data.urgencyLevel >= 3 && (
          <div className={cn(
            'mb-6 rounded-xl border p-4',
            data.urgencyLevel === 4 ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-300'
          )}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={cn('h-5 w-5 shrink-0', data.urgencyLevel === 4 ? 'text-red-600' : 'text-orange-600')} />
              <div>
                <p className={cn('text-sm font-bold', data.urgencyLevel === 4 ? 'text-red-800' : 'text-orange-800')}>
                  {data.urgencyLevel === 4 ? '🔴 ฉุกเฉิน — ต้องพบแพทย์ทันที' : '🟠 ควรพบแพทย์โดยด่วน'}
                </p>
                {data.urgencyLabel && (
                  <p className="text-xs mt-1 text-slate-600">{data.urgencyLabel}</p>
                )}
                {data.urgencyLevel === 4 && (
                  <p className="text-sm font-bold text-red-700 mt-1">โทร 1669</p>
                )}
              </div>
            </div>
          </div>
        )}

        {data.riskScores.length > 0 && <RiskScoresSection scores={data.riskScores} />}
        {data.screeningRecommendations.length > 0 && <ScreeningSection items={data.screeningRecommendations} />}
        {data.guidelineReferences.length > 0 && <GuidelinesSection refs={data.guidelineReferences} />}
        {data.nextActions.length > 0 && <NextActionsSection actions={data.nextActions} />}

        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t-2 border-slate-100">
          <p className="text-[10px] text-slate-400 leading-relaxed">{data.disclaimer}</p>
          <div className="mt-2 flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-teal-500" />
            <p className="text-[10px] text-slate-400">สร้างโดย FirstScreen · firstscreen.health · เพื่อการศึกษาเท่านั้น</p>
          </div>
        </div>
      </div>
    </div>
  )
}
