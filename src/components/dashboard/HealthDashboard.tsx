'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Activity, Heart, Calendar, Clock, ChevronRight,
  TrendingUp, Shield, AlertTriangle, RotateCcw,
  Brain, Ribbon, Stethoscope, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────

interface StoredAssessment {
  type: 'cvd' | 'diabetes' | 'cancer' | 'mental' | 'symptoms'
  completedAt: string
  riskCategory?: 'low' | 'moderate' | 'high' | 'very_high'
  score?: number
  urgencyLevel?: 1 | 2 | 3 | 4
  label?: string
}

interface ScreeningDue {
  name: string
  dueDate: string
  overdue: boolean
  href: string
}

// ── Risk Score Card ───────────────────────────────────────────

const RISK_COLORS = {
  low: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500', label: 'ต่ำ' },
  moderate: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500', label: 'ปานกลาง' },
  high: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', bar: 'bg-orange-500', label: 'สูง' },
  very_high: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', bar: 'bg-red-500', label: 'สูงมาก' },
}

const ASSESSMENT_ICONS = {
  cvd: Heart,
  diabetes: Activity,
  cancer: Ribbon,
  mental: Brain,
  symptoms: Stethoscope,
}

const ASSESSMENT_LABELS = {
  cvd: 'ความเสี่ยงหัวใจ',
  diabetes: 'ความเสี่ยงเบาหวาน',
  cancer: 'ความเสี่ยงมะเร็ง',
  mental: 'สุขภาพจิต',
  symptoms: 'ตรวจอาการ',
}

function RiskCard({ assessment }: { assessment: StoredAssessment }) {
  const Icon = ASSESSMENT_ICONS[assessment.type]
  const cat = assessment.riskCategory ?? 'low'
  const cfg = RISK_COLORS[cat]
  const date = new Date(assessment.completedAt).toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className={cn('rounded-2xl border p-5', cfg.bg)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80">
            <Icon className={cn('h-4.5 w-4.5', cfg.text)} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{ASSESSMENT_LABELS[assessment.type]}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {date}
            </p>
          </div>
        </div>
        <span className={cn('text-sm font-bold rounded-full px-3 py-1', cfg.bg, cfg.text, 'border')}>
          {cfg.label}
        </span>
      </div>

      {assessment.score !== undefined && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>คะแนน</span>
            <span className={cn('font-semibold', cfg.text)}>{assessment.score}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/60">
            <div
              className={cn('h-1.5 rounded-full', cfg.bar)}
              style={{ width: `${Math.min((assessment.score / 30) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {assessment.urgencyLevel && (
        <div className={cn('mt-2 text-xs font-medium rounded-lg px-2.5 py-1',
          assessment.urgencyLevel >= 4 ? 'bg-red-100 text-red-700' :
          assessment.urgencyLevel >= 3 ? 'bg-orange-100 text-orange-700' :
          assessment.urgencyLevel >= 2 ? 'bg-amber-100 text-amber-700' :
          'bg-emerald-100 text-emerald-700'
        )}>
          ระดับเร่งด่วน: {['', 'นัดพบแพทย์', 'พบแพทย์เร็วๆ นี้', 'พบแพทย์ด่วน', 'ฉุกเฉิน'][assessment.urgencyLevel]}
        </div>
      )}
    </div>
  )
}

// ── Screening Timeline ────────────────────────────────────────

function ScreeningTimeline({ items }: { items: ScreeningDue[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 hover:border-teal-200 hover:bg-teal-50/30 transition-colors group"
        >
          <div className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            item.overdue ? 'bg-red-100' : 'bg-teal-100'
          )}>
            <Calendar className={cn('h-4 w-4', item.overdue ? 'text-red-600' : 'text-teal-600')} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
            <p className={cn('text-xs', item.overdue ? 'text-red-500 font-medium' : 'text-slate-400')}>
              {item.overdue ? '! ครบกำหนดแล้ว — ' : 'ถัดไป: '}{item.dueDate}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
        </Link>
      ))}
    </div>
  )
}

// ── Health Tips ────────────────────────────────────────────────

const DAILY_TIPS = [
  { tip: 'ออกกำลังกาย 30 นาที/วัน ลดความเสี่ยงหัวใจ 35%', icon: Activity, category: 'หัวใจ' },
  { tip: 'กินผัก 5 มื้อ/วัน ลดความเสี่ยงมะเร็งลำไส้ 20%', icon: Shield, category: 'มะเร็ง' },
  { tip: 'วัดความดันทุก 6 เดือนถ้าอายุ 40+ ปี', icon: Heart, category: 'ความดัน' },
  { tip: 'ตรวจน้ำตาลในเลือดทุกปีถ้า BMI ≥23', icon: TrendingUp, category: 'เบาหวาน' },
  { tip: 'Mammogram ทุก 1-2 ปีสำหรับผู้หญิง 40+ ปี', icon: Calendar, category: 'มะเร็ง' },
]

// ── Empty State ────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Activity className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-2">ยังไม่มีประวัติการประเมิน</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
        เริ่มต้นประเมินสุขภาพเพื่อดูผลและติดตามความเสี่ยงของคุณที่นี่
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/risk"
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          <Activity className="h-4 w-4" />
          เริ่มประเมินความเสี่ยง
        </Link>
        <Link
          href="/symptoms"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Stethoscope className="h-4 w-4" />
          ตรวจอาการ
        </Link>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────

export function HealthDashboard() {
  const [assessments, setAssessments] = useState<StoredAssessment[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage (populated by risk/symptom assessments)
  useEffect(() => {
    try {
      // Check for clinical session
      const clinicalRaw = localStorage.getItem('fs_clinical_session')
      const all: StoredAssessment[] = []

      if (clinicalRaw) {
        const sess = JSON.parse(clinicalRaw)
        if (sess.chief_complaint || (sess.symptom_ids?.length > 0)) {
          all.push({
            type: 'symptoms',
            completedAt: new Date().toISOString(),
            urgencyLevel: sess.urgency_level ?? 1,
            label: sess.chief_complaint,
          })
        }
      }

      // Add demo data if nothing exists yet
      if (all.length === 0) {
        // No assessments yet — show empty state
      }

      setAssessments(all)
    } catch {
      // ignore
    } finally {
      setLoaded(true)
    }
  }, [])

  // Demo screening dates (would come from screening planner)
  const screeningItems: ScreeningDue[] = [
    { name: 'ตรวจน้ำตาลในเลือด (FBS)', dueDate: 'ม.ค. 2027', overdue: false, href: '/screening' },
    { name: 'วัดความดันโลหิต', dueDate: 'ส.ค. 2026', overdue: false, href: '/screening' },
    { name: 'Mammogram', dueDate: 'มี.ค. 2026', overdue: true, href: '/screening' },
  ]

  const tip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length]
  const TipIcon = tip.icon

  if (!loaded) return null

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">

      {/* Health tip banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <TipIcon className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-teal-100 mb-0.5">เคล็ดลับสุขภาพวันนี้ · {tip.category}</p>
            <p className="text-sm font-medium text-white">{tip.tip}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Assessment history */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">ผลการประเมินของฉัน</h2>
              <Link href="/risk" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                ประเมินใหม่ <RefreshCw className="h-3 w-3" />
              </Link>
            </div>

            {assessments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assessments.map((a, i) => (
                  <RiskCard key={i} assessment={a} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8">
                <EmptyState />
              </div>
            )}
          </section>

          {/* Quick actions */}
          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-4">ประเมินสุขภาพ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'หัวใจ', href: '/risk#cvd', icon: Heart, color: 'bg-red-50 text-red-600 border-red-100' },
                { label: 'เบาหวาน', href: '/risk#diabetes', icon: Activity, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { label: 'มะเร็ง', href: '/risk#cancer', icon: Ribbon, color: 'bg-violet-50 text-violet-600 border-violet-100' },
                { label: 'สุขภาพจิต', href: '/risk#mental', icon: Brain, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 text-center hover:scale-105 transition-transform', color)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Screening due */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">กำหนดตรวจคัดกรอง</h2>
              <Link href="/screening" className="text-xs text-teal-600 hover:underline">
                ดูทั้งหมด
              </Link>
            </div>
            <ScreeningTimeline items={screeningItems} />
          </section>

          {/* Health score summary */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">สรุปสุขภาพ</h2>
            <div className="space-y-3">
              {[
                { label: 'การประเมินที่ทำแล้ว', value: assessments.length.toString(), icon: Activity, color: 'text-teal-600' },
                { label: 'แผนคัดกรอง', value: '3 รายการ', icon: Calendar, color: 'text-amber-600' },
                { label: 'โรงพยาบาลใกล้เคียง', value: 'ดูแผนที่', icon: Shield, color: 'text-sky-600' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                    <Icon className={cn('h-4 w-4', color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/screening"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              ดูแผนคัดกรองของฉัน
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
