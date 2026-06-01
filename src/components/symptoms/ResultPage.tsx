'use client'

import { MapPin, MessageCircle, RefreshCw, FlaskConical, ExternalLink, BookOpen, AlertCircle } from 'lucide-react'
import { UrgencyBanner } from './UrgencyBanner'
import { getMatchingConditions, calculateUrgency } from '@/data/condition-mapping'
import { allSymptoms } from '@/data/symptoms'
import type { WizardState, ConditionMatch } from '@/types/symptom'
import { cn } from '@/lib/utils'

interface ResultPageProps {
  state: WizardState
  onReset: () => void
}

function ConditionCard({ match }: { match: ConditionMatch }) {
  const { condition, score, matched_symptoms } = match

  const urgencyColors: Record<string, string> = {
    emergency: 'bg-red-50 border-red-200',
    urgent: 'bg-orange-50 border-orange-200',
    appointment: 'bg-amber-50 border-amber-200',
    selfcare: 'bg-emerald-50 border-emerald-200',
  }

  const matchedLabels = matched_symptoms.map(id =>
    allSymptoms.find(s => s.id === id)?.label ?? id
  )

  // Build symptom checker URL params for AI assistant
  const aiParams = new URLSearchParams({
    conditions: condition.id,
    symptoms: matched_symptoms.join(','),
  })

  return (
    <div className={cn('rounded-2xl border p-5', urgencyColors[condition.urgency_hint] ?? 'bg-white border-slate-200')}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {condition.name_th}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{condition.name_en}</p>
        </div>
        {/* Match score */}
        <div className="shrink-0 text-right">
          <div className={cn(
            'text-lg font-black',
            score >= 60 ? 'text-red-600' : score >= 40 ? 'text-orange-500' : 'text-amber-600'
          )}>
            {score}%
          </div>
          <div className="text-[10px] text-slate-400">ความเกี่ยวข้อง</div>
        </div>
      </div>

      {/* Match bar */}
      <div className="h-1.5 rounded-full bg-white/60 mb-3 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', score >= 60 ? 'bg-red-500' : score >= 40 ? 'bg-orange-400' : 'bg-amber-400')}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-sm text-slate-700 mb-3">{condition.description_th}</p>

      {/* Matched symptoms */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {matchedLabels.map(label => (
          <span key={label} className="text-[11px] rounded-full bg-white/70 border border-slate-200 px-2 py-0.5 text-slate-600">
            {label}
          </span>
        ))}
      </div>

      {/* Specialty */}
      <p className="text-xs text-slate-500 mb-3">
        <span className="font-medium">แพทย์ที่แนะนำ:</span> {condition.recommended_specialty}
      </p>

      {/* Lab tests */}
      {condition.lab_tests.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <FlaskConical className="h-3.5 w-3.5" />
            การตรวจที่แนะนำ
          </p>
          <div className="space-y-1">
            {condition.lab_tests.slice(0, 3).map(lab => (
              <div key={lab.id} className="flex items-start gap-2 text-xs">
                <span className={cn(
                  'shrink-0 rounded-full px-1.5 py-0.5 font-bold text-[10px]',
                  lab.priority === 'essential' ? 'bg-red-100 text-red-700' :
                  lab.priority === 'recommended' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                )}>
                  {lab.priority === 'essential' ? 'จำเป็น' : lab.priority === 'recommended' ? 'แนะนำ' : 'ทางเลือก'}
                </span>
                <span className="text-slate-700">{lab.name_th}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-black/5">
        <a
          href={`/diseases/${condition.encyclopedia_slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-700 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          อ่านข้อมูลเพิ่มเติม
        </a>
        <a
          href={`/ai-assistant?${aiParams.toString()}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-sky-600 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          คุยกับ AI
        </a>
      </div>
    </div>
  )
}

function AllLabTestsSection({ matches }: { matches: ConditionMatch[] }) {
  // Deduplicate lab tests across all matched conditions
  const labMap = new Map<string, { name_th: string; priority: string; count: number }>()
  for (const m of matches) {
    for (const lab of m.condition.lab_tests) {
      const existing = labMap.get(lab.id)
      if (existing) {
        existing.count++
        if (lab.priority === 'essential') existing.priority = 'essential'
      } else {
        labMap.set(lab.id, { name_th: lab.name_th, priority: lab.priority, count: 1 })
      }
    }
  }

  const sorted = [...labMap.entries()]
    .sort((a, b) => {
      const pOrder = { essential: 0, recommended: 1, optional: 2 }
      return (pOrder[a[1].priority as keyof typeof pOrder] ?? 2) - (pOrder[b[1].priority as keyof typeof pOrder] ?? 2)
    })

  if (sorted.length === 0) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="h-5 w-5 text-sky-600" />
        <h3 className="text-base font-bold text-slate-900">การตรวจแนะนำ (รวมทั้งหมด)</h3>
      </div>
      <div className="space-y-2">
        {sorted.map(([id, lab]) => (
          <div key={id} className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5">
            <span className={cn(
              'shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5',
              lab.priority === 'essential' ? 'bg-red-100 text-red-700' :
              lab.priority === 'recommended' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-600'
            )}>
              {lab.priority === 'essential' ? 'จำเป็น' : lab.priority === 'recommended' ? 'แนะนำ' : 'ทางเลือก'}
            </span>
            <span className="text-sm text-slate-700 flex-1">{lab.name_th}</span>
            {lab.count > 1 && (
              <span className="text-[10px] text-slate-400">({lab.count} ภาวะ)</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-3">
        * การตรวจขั้นสุดท้ายขึ้นอยู่กับดุลพินิจของแพทย์
      </p>
    </div>
  )
}

export function ResultPage({ state, onReset }: ResultPageProps) {
  const urgency = calculateUrgency(state)
  const matches = getMatchingConditions(state.selected_symptoms)

  // Build symptom names for display
  const symptomLabels = state.selected_symptoms.map(id =>
    allSymptoms.find(s => s.id === id)?.label ?? id
  )

  // Build AI assistant URL
  const aiUrl = `/ai-assistant?symptoms=${state.selected_symptoms.join(',')}&urgency=${urgency}`

  return (
    <div className="space-y-6">
      {/* Urgency Banner */}
      <UrgencyBanner level={urgency} />

      {/* Summary */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">สรุปอาการที่รายงาน</h3>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {symptomLabels.map(label => (
            <span key={label} className="text-xs rounded-full bg-white border border-slate-200 px-2.5 py-1 text-slate-600">
              {label}
            </span>
          ))}
          {state.custom_symptom && (
            <span className="text-xs rounded-full bg-white border border-slate-200 px-2.5 py-1 text-slate-500 italic">
              {state.custom_symptom}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          ความรุนแรง: {state.follow_up.severity}/10 ·{' '}
          {state.follow_up.progression === 'worsening' ? 'แย่ลง' :
           state.follow_up.progression === 'stable' ? 'คงที่' : 'ดีขึ้น'}
        </p>
      </div>

      {/* Possible Conditions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">ภาวะที่อาจเกี่ยวข้อง</h2>
        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          ไม่ใช่การวินิจฉัย — แสดงเพื่อการศึกษาเท่านั้น ค่าเปอร์เซ็นต์ = ความเกี่ยวข้องของอาการ
        </p>

        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map(match => (
              <ConditionCard key={match.condition.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
            <p className="text-slate-500 text-sm">
              ไม่พบภาวะที่ตรงกับอาการที่เลือก กรุณาพบแพทย์เพื่อการประเมินที่ถูกต้อง
            </p>
          </div>
        )}
      </div>

      {/* All lab tests */}
      {matches.length > 0 && <AllLabTestsSection matches={matches} />}

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={aiUrl}
          className="flex items-center justify-center gap-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-4 text-sm transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          คุยกับ AI Health Assistant
        </a>
        <a
          href="/hospitals"
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:border-sky-400 hover:text-sky-700 text-slate-700 font-semibold px-5 py-4 text-sm transition-colors"
        >
          <MapPin className="h-5 w-5" />
          ค้นหาโรงพยาบาล
        </a>
      </div>

      {/* Disabled save + reset */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          disabled
          title="ต้องการเข้าสู่ระบบ"
          className="flex-1 rounded-2xl border border-dashed border-slate-200 py-3 text-sm text-slate-400 cursor-not-allowed"
        >
          บันทึกผลนี้ (ต้องเข้าสู่ระบบ)
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium py-3 text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          เริ่มตรวจใหม่
        </button>
      </div>

      {/* Full Disclaimer */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-2.5">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>ข้อจำกัด:</strong> ระบบนี้ใช้เพื่อการศึกษาเท่านั้น ไม่สามารถวินิจฉัยโรคได้
          กรุณาพบแพทย์เพื่อการวินิจฉัยที่ถูกต้อง หากมีอาการรุนแรงหรือฉุกเฉิน
          โทร <a href="tel:1669" className="font-bold underline">1669</a> หรือไปห้องฉุกเฉินทันที
        </p>
      </div>
    </div>
  )
}
