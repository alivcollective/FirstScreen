'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Filter, ChevronRight, Calendar, Shield, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SCREENING_TESTS } from '@/data/screening-guidelines'

// ── Types ─────────────────────────────────────────────────────

type AgeGroup = '20-29' | '30-39' | '40-49' | '50-59' | '60+'
type Gender = 'male' | 'female' | 'all'
type RiskFactor = 'smoking' | 'diabetes' | 'hypertension' | 'obesity' | 'family_history' | 'none'

const AGE_RANGES: Record<AgeGroup, { min: number; max: number }> = {
  '20-29': { min: 20, max: 29 },
  '30-39': { min: 30, max: 39 },
  '40-49': { min: 40, max: 49 },
  '50-59': { min: 50, max: 59 },
  '60+': { min: 60, max: 120 },
}

// ── Recommendation engine ─────────────────────────────────────

function getRecommendations(age: AgeGroup, gender: Gender, risks: RiskFactor[]) {
  const { min, max } = AGE_RANGES[age]
  const midAge = (min + max) / 2
  const hasRisk = (factor: string) =>
    risks.includes('none') ? false : risks.some(r => r === factor || factor.includes(r))

  const filtered = SCREENING_TESTS.filter(test => {
    // Age check
    if (midAge < test.minAge) return false
    if (test.maxAge !== null && midAge > test.maxAge) return false

    // Gender check
    if (test.sex === 'male' && gender === 'female') return false
    if (test.sex === 'female' && gender === 'male') return false

    // Risk level
    if (test.riskLevel === 'high_risk') {
      const relevantRisks = test.riskFactors ?? []
      const userHasRisk = relevantRisks.some(r =>
        risks.includes(r as RiskFactor) ||
        (r === 'family_cvd' && hasRisk('family_history'))
      )
      if (!userHasRisk && risks.length > 0 && !risks.includes('none')) return false
      // If no risks selected, still show high_risk items for awareness
    }

    return true
  })

  return filtered.sort((a, b) => {
    const urgencyOrder = { critical: 0, important: 1, routine: 2 }
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  })
}

// ── UI Components ─────────────────────────────────────────────

function SelectChip<T extends string>({
  value,
  selected,
  onToggle,
  children,
  multi = false,
}: {
  value: T
  selected: T | T[]
  onToggle: (v: T) => void
  children: React.ReactNode
  multi?: boolean
}) {
  const isSelected = multi
    ? (selected as T[]).includes(value)
    : selected === value
  return (
    <button
      onClick={() => onToggle(value)}
      className={cn(
        'rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors',
        isSelected
          ? 'bg-teal-600 border-teal-600 text-white'
          : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700'
      )}
    >
      {children}
    </button>
  )
}

function ScreeningCard({ test, highlight = false }: { test: typeof SCREENING_TESTS[0]; highlight?: boolean }) {
  const urgencyColors = {
    critical: 'border-red-200 bg-red-50',
    important: 'border-amber-200 bg-amber-50',
    routine: 'border-slate-200 bg-white',
  }
  const urgencyBadge = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    important: 'bg-amber-100 text-amber-700 border-amber-200',
    routine: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  const urgencyLabel = { critical: 'สำคัญมาก', important: 'สำคัญ', routine: 'ทั่วไป' }

  return (
    <div className={cn(
      'rounded-2xl border p-4 transition-all',
      urgencyColors[test.urgency],
      highlight && 'ring-2 ring-teal-400'
    )}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{test.nameTh}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold', urgencyBadge[test.urgency])}>
            {urgencyLabel[test.urgency]}
          </span>
          {test.nhsoCovered && (
            <span className="rounded-full bg-teal-100 border border-teal-200 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
              ฟรี สปสช.
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-3">{test.descriptionTh}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          ทุก {test.intervalMonths < 12 ? `${test.intervalMonths} เดือน` : `${test.intervalMonths / 12} ปี`}
        </span>
        <span>ราคา: {test.costRange}</span>
        {test.guidelineTh && <span className="text-teal-600">{test.guidelineTh}</span>}
      </div>

      {test.diseaseSlug && (
        <div className="mt-2 pt-2 border-t border-slate-200/60">
          <Link
            href={`/diseases/${test.diseaseSlug}`}
            className="text-[10px] text-teal-600 hover:underline flex items-center gap-1"
          >
            ข้อมูลโรค <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────

export function ScreeningKnowledgeEngine() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('40-49')
  const [gender, setGender] = useState<Gender>('all')
  const [risks, setRisks] = useState<RiskFactor[]>(['none'])

  const toggleRisk = (risk: RiskFactor) => {
    if (risk === 'none') {
      setRisks(['none'])
      return
    }
    setRisks(prev => {
      const without = prev.filter(r => r !== 'none')
      if (without.includes(risk)) {
        const next = without.filter(r => r !== risk)
        return next.length === 0 ? ['none'] : next
      }
      return [...without, risk]
    })
  }

  const recommendations = getRecommendations(ageGroup, gender, risks)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Filters */}
      <div className="bg-gradient-to-r from-teal-50 to-slate-50 border-b border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-slate-800">ตั้งค่าโปรไฟล์</h3>
        </div>

        <div className="space-y-4">
          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">กลุ่มอายุ</label>
            <div className="flex flex-wrap gap-2">
              {(['20-29', '30-39', '40-49', '50-59', '60+'] as AgeGroup[]).map(ag => (
                <SelectChip key={ag} value={ag} selected={ageGroup} onToggle={setAgeGroup}>
                  {ag}
                </SelectChip>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">เพศ</label>
            <div className="flex flex-wrap gap-2">
              <SelectChip value="all" selected={gender} onToggle={setGender}>ทั้งหมด</SelectChip>
              <SelectChip value="male" selected={gender} onToggle={setGender}>ชาย</SelectChip>
              <SelectChip value="female" selected={gender} onToggle={setGender}>หญิง</SelectChip>
            </div>
          </div>

          {/* Risk factors */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">ปัจจัยเสี่ยง (เลือกได้หลายข้อ)</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'none', label: 'ไม่มี' },
                { value: 'smoking', label: 'สูบบุหรี่' },
                { value: 'diabetes', label: 'เบาหวาน' },
                { value: 'hypertension', label: 'ความดันสูง' },
                { value: 'obesity', label: 'อ้วน (BMI≥27.5)' },
                { value: 'family_history', label: 'ประวัติครอบครัว' },
              ].map(r => (
                <SelectChip
                  key={r.value}
                  value={r.value as RiskFactor}
                  selected={risks}
                  onToggle={toggleRisk}
                  multi
                >
                  {r.label}
                </SelectChip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              แนะนำการตรวจ {recommendations.length} รายการ
            </h3>
            <p className="text-xs text-slate-400">
              {ageGroup} ปี · {gender === 'all' ? 'ทุกเพศ' : gender === 'male' ? 'ชาย' : 'หญิง'}
              {!risks.includes('none') && ` · ${risks.length} ปัจจัยเสี่ยง`}
            </p>
          </div>
          <Link href="/screening" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
            แผนส่วนตัว <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            ไม่พบการตรวจที่แนะนำสำหรับโปรไฟล์นี้
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map(test => (
              <ScreeningCard key={test.id} test={test} />
            ))}
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-700">
            ผลลัพธ์นี้เป็นข้อมูลเพื่อการศึกษา ควรปรึกษาแพทย์เพื่อแผนคัดกรองที่เหมาะกับคุณโดยเฉพาะ
          </p>
        </div>
      </div>
    </div>
  )
}
