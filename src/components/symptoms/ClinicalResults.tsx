'use client'

import Link from 'next/link'
import { Phone, Calendar, AlertTriangle, CheckCircle, Info, ChevronRight, RefreshCw } from 'lucide-react'
import type { ClinicalSession, Symptom } from '@/types/clinical'
import type { AssessmentResult } from '@/actions/clinical'
import type { DifferentialResult } from '@/types/clinical'

// ── Urgency Banner ────────────────────────────────────────────

function UrgencyBanner({ urgency }: { urgency: AssessmentResult['urgency'] }) {
  const configs = {
    green: {
      bg: 'bg-emerald-500/10 border-emerald-500/40',
      text: 'text-emerald-400',
      icon: CheckCircle,
    },
    yellow: {
      bg: 'bg-amber-500/10 border-amber-500/40',
      text: 'text-amber-400',
      icon: Info,
    },
    orange: {
      bg: 'bg-orange-500/10 border-orange-500/40',
      text: 'text-orange-400',
      icon: AlertTriangle,
    },
    red: {
      bg: 'bg-red-500/10 border-red-500/40',
      text: 'text-red-400',
      icon: AlertTriangle,
    },
  }
  const cfg = configs[urgency.color]
  const Icon = cfg.icon
  const level = urgency.level

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.text}`} />
        <div className="flex-1">
          <p className={`font-semibold text-sm ${cfg.text}`}>{urgency.labelTh}</p>
          <p className="text-slate-300 text-xs mt-0.5">{urgency.actionTh}</p>
          <p className="text-slate-400 text-xs mt-0.5">{urgency.timeframeTh}</p>
          {urgency.triggerReason && urgency.triggerReason !== 'fallback' && (
            <p className="text-slate-500 text-xs mt-1">เหตุผล: {urgency.triggerReason}</p>
          )}
        </div>
        <span className={`text-2xl font-black ${cfg.text} opacity-30`}>{level}</span>
      </div>

      {urgency.show1669 && (
        <a href="tel:1669"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-500 transition-colors">
          <Phone className="h-4 w-4" />
          โทร 1669 — ฉุกเฉินทางการแพทย์
        </a>
      )}

      {level <= 2 && (
        <Link href="/hospitals"
          className={`mt-3 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors
            ${cfg.bg} ${cfg.text} hover:opacity-80`}>
          <Calendar className="h-4 w-4" />
          ค้นหาโรงพยาบาล / นัดพบแพทย์
        </Link>
      )}
    </div>
  )
}

// ── Differential Diagnosis Card ───────────────────────────────

function DifferentialCard({ result, rank }: { result: DifferentialResult; rank: number }) {
  const confidenceColor = {
    high: 'text-red-400 bg-red-500/10 border-red-500/30',
    moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-slate-400 bg-slate-700/40 border-slate-600',
  }[result.confidence]

  const confidenceLabel = {
    high: 'ความน่าจะเป็นสูง',
    moderate: 'ความน่าจะเป็นปานกลาง',
    low: 'ความน่าจะเป็นต่ำ',
  }[result.confidence]

  const severityColor = {
    mild: 'text-emerald-400',
    moderate: 'text-amber-400',
    severe: 'text-orange-400',
    critical: 'text-red-400',
  }[result.condition.severity]

  const severityLabel = {
    mild: 'ไม่รุนแรง',
    moderate: 'ปานกลาง',
    severe: 'รุนแรง',
    critical: 'วิกฤต',
  }[result.condition.severity]

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
            {rank}
          </span>
          <div>
            <p className="font-semibold text-white text-sm">{result.condition.name_th}</p>
            <p className="text-slate-400 text-xs">{result.condition.name_en}</p>
          </div>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${confidenceColor}`}>
          {confidenceLabel}
        </span>
      </div>

      {/* Score bar */}
      <div className="mt-3 mb-2">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>คะแนนความสอดคล้อง</span>
          <span className="font-medium text-slate-300">{result.score}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-700">
          <div
            className={`h-1.5 rounded-full transition-all ${
              result.score >= 60 ? 'bg-red-500' : result.score >= 40 ? 'bg-amber-500' : 'bg-slate-500'
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${severityColor}`}>{severityLabel}</span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">
            {result.condition.specialty_required ?? 'แพทย์ทั่วไป'}
          </span>
        </div>
        {result.condition.encyclopedia_slug && (
          <Link href={`/diseases/${result.condition.encyclopedia_slug}`}
            className="flex items-center gap-0.5 text-xs text-sky-400 hover:text-sky-300 transition-colors">
            รายละเอียด <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Key modifiers */}
      {result.key_modifiers.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-700/60">
          <p className="text-xs text-slate-500 mb-1">ปัจจัยที่เกี่ยวข้อง:</p>
          <div className="flex flex-wrap gap-1">
            {result.key_modifiers.map(m => (
              <span key={m} className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Social History Summary ─────────────────────────────────────

function SocialSummary({ session }: { session: ClinicalSession }) {
  const sh = session.social_history
  if (!sh) return null

  const items: { label: string; value: string; flag?: boolean }[] = []

  if (sh.height_cm && sh.weight_kg) {
    const bmi = Math.round((sh.weight_kg / Math.pow(sh.height_cm / 100, 2)) * 10) / 10
    items.push({ label: 'BMI', value: `${bmi} (${bmi >= 27.5 ? 'อ้วน' : bmi >= 23 ? 'น้ำหนักเกิน' : 'ปกติ'})`, flag: bmi >= 27.5 })
  }
  if (sh.smoking?.status !== 'never') {
    const py = ((sh.smoking?.cigarettes_per_day ?? 0) / 20) * (sh.smoking?.years_smoked ?? 0)
    items.push({ label: 'สูบบุหรี่', value: `${py.toFixed(1)} pack-years`, flag: py >= 20 })
  }
  if (sh.alcohol?.audit_c_frequency && sh.alcohol.audit_c_frequency !== 'ไม่เคยดื่ม') {
    items.push({ label: 'แอลกอฮอล์', value: sh.alcohol.audit_c_frequency })
  }

  if (items.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">ข้อมูลสุขภาพ</h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map(item => (
          <div key={item.label} className="flex justify-between text-xs">
            <span className="text-slate-400">{item.label}</span>
            <span className={item.flag ? 'text-amber-400 font-medium' : 'text-slate-300'}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PMH Summary ───────────────────────────────────────────────

const CONDITION_LABELS: Record<string, string> = {
  diabetes: 'เบาหวาน', hypertension: 'ความดันสูง', heart_disease: 'โรคหัวใจ',
  stroke: 'หลอดเลือดสมอง', copd: 'COPD/หอบหืด', ckd: 'ไตเรื้อรัง',
  cancer: 'มะเร็ง', hbv: 'ตับอักเสบบี', hiv: 'HIV',
  depression: 'ซึมเศร้า', thyroid: 'ไทรอยด์', dyslipidemia: 'ไขมันสูง',
}

// ── Main ClinicalResults ───────────────────────────────────────

export function ClinicalResults({
  session,
  result,
  allSymptoms,
  onRestart,
}: {
  session: ClinicalSession
  result: AssessmentResult
  allSymptoms: Symptom[]
  onRestart: () => void
}) {
  const selectedSymptoms = allSymptoms.filter(s => session.symptom_ids?.includes(s.id))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">ผลการวิเคราะห์อาการ</h2>
        <p className="text-xs text-amber-400/80 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          เพื่อการนำทางเท่านั้น — ไม่ใช่การวินิจฉัยโรค
        </p>
      </div>

      {/* Error fallback */}
      {result.error && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-400">
          ⚠️ ไม่สามารถโหลดข้อมูลจาก Supabase ได้ครบถ้วน — แสดงผลบางส่วน
        </div>
      )}

      {/* Urgency Banner */}
      <UrgencyBanner urgency={result.urgency} />

      {/* Selected symptoms summary */}
      {selectedSymptoms.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">อาการที่รายงาน</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(s => (
              <span key={s.id} className={`rounded-full px-2.5 py-1 text-xs font-medium
                ${s.is_emergency ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
                {s.name_th}
              </span>
            ))}
          </div>
          {session.oldcarts && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400 border-t border-slate-700/60 pt-2">
              {session.oldcarts.duration_days !== undefined && (
                <span>ระยะเวลา: <span className="text-slate-300">{session.oldcarts.duration_days} วัน</span></span>
              )}
              {session.oldcarts.severity_score !== undefined && (
                <span>ความรุนแรง: <span className={`font-medium ${
                  session.oldcarts.severity_score >= 7 ? 'text-red-400' :
                  session.oldcarts.severity_score >= 4 ? 'text-amber-400' : 'text-emerald-400'
                }`}>{session.oldcarts.severity_score}/10</span></span>
              )}
              {session.oldcarts.onset_description && (
                <span className="col-span-2">เริ่ม: <span className="text-slate-300">{session.oldcarts.onset_description}</span></span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Differential Diagnosis */}
      {result.differential.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            ภาวะที่อาจเกี่ยวข้อง ({result.differential.length})
          </h3>
          <div className="space-y-3">
            {result.differential.map((d, i) => (
              <DifferentialCard key={d.condition.id} result={d} rank={i + 1} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-6 text-center text-sm text-slate-400">
          ไม่พบข้อมูลที่ตรงกับอาการในฐานข้อมูล
          <br />
          <span className="text-xs text-slate-500">แนะนำให้ปรึกษาแพทย์โดยตรง</span>
        </div>
      )}

      {/* PMH conditions if any */}
      {(session.pmh_conditions?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">โรคประจำตัว</h3>
          <div className="flex flex-wrap gap-1.5">
            {session.pmh_conditions!.map(c => (
              <span key={c} className="rounded-full bg-slate-700 px-2.5 py-1 text-xs text-slate-300">
                {CONDITION_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social History Summary */}
      <SocialSummary session={session} />

      {/* Disclaimer */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-medium text-slate-400">คำเตือน:</span> ผลการวิเคราะห์นี้เป็นเครื่องมือช่วยนำทางเท่านั้น
          ไม่สามารถแทนที่การตรวจจากแพทย์ผู้เชี่ยวชาญได้
          ข้อมูลรอการตรวจสอบจากแพทย์ก่อนนำไปใช้จริงในทางคลินิก
        </p>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onRestart}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700/60 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
          <RefreshCw className="h-4 w-4" />
          เริ่มใหม่
        </button>
        <Link href="/risk"
          className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-500 transition-colors">
          ประเมินความเสี่ยง
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
