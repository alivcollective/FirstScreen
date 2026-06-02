'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle, CheckCircle2, Phone, ChevronRight,
  ShieldCheck, ArrowLeft, Loader2, Eye,
} from 'lucide-react'
import type { ClinicalPathway } from '@/types/clinical-pathway'
import { EMERGENCY_LABELS, RECOMMENDATION_LABELS } from '@/types/clinical-pathway'
import { cn } from '@/lib/utils'

export default function PathwayPreviewPage() {
  const params = useParams()
  const [pathway, setPathway] = useState<ClinicalPathway | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/admin/pathways/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(setPathway)
      .finally(() => setLoading(false))
  }, [params?.id])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
    </div>
  )

  if (!pathway) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
      ไม่พบข้อมูล
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Preview banner */}
      <div className="bg-teal-900 text-teal-100 px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2">
        <Eye className="h-3.5 w-3.5" />
        โหมด Preview — นี่คือสิ่งที่ผู้ใช้จะเห็น
        <Link href={`/admin/clinical-pathways/${params?.id}`} className="ml-2 underline hover:text-white">
          กลับแก้ไข
        </Link>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-3 py-0.5">
              {pathway.specialty}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{pathway.name_th}</h1>
          {pathway.description_th && (
            <p className="text-slate-500 leading-relaxed">{pathway.description_th}</p>
          )}
        </div>

        {/* Red flags */}
        {pathway.red_flags?.length > 0 && (
          <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-bold text-red-800">อาการที่ต้องระวัง</p>
            </div>
            <div className="space-y-2">
              {pathway.red_flags.map(rf => (
                <div key={rf.id} className="text-sm text-red-700">
                  <span className="font-semibold">{rf.name_th}</span>
                  {rf.emergency_level === 'call_1669' && (
                    <a href="tel:1669" className="ml-2 inline-flex items-center gap-1 text-red-600 underline font-bold">
                      <Phone className="h-3 w-3" /> โทร 1669
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms */}
        {pathway.symptoms?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">คุณมีอาการใดบ้าง?</p>
            <div className="flex flex-wrap gap-2">
              {pathway.symptoms.map(s => (
                <button key={s.id}
                  onClick={() => {
                    const cur = selectedAnswers[`sym_${s.id}`]
                    setSelectedAnswers(prev => cur
                      ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== `sym_${s.id}`))
                      : { ...prev, [`sym_${s.id}`]: 'yes' }
                    )
                  }}
                  className={cn(
                    'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                    selectedAnswers[`sym_${s.id}`]
                      ? 'bg-teal-50 border-teal-400 text-teal-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                  )}>
                  {selectedAnswers[`sym_${s.id}`] && <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" />}
                  {s.name_th}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Questions */}
        {pathway.questions?.length > 0 && (
          <div className="space-y-4 mb-6">
            <p className="text-sm font-semibold text-slate-700">คำถามเพิ่มเติม</p>
            {pathway.questions.map((q, i) => (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-800 mb-3">
                  <span className="text-slate-400 mr-2">{i + 1}.</span>{q.question_th}
                </p>
                {q.question_type === 'yes_no' && (
                  <div className="flex gap-3">
                    {['ใช่', 'ไม่ใช่'].map(opt => (
                      <button key={opt} onClick={() => setSelectedAnswers(p => ({ ...p, [q.id]: opt }))}
                        className={cn('flex-1 rounded-xl border py-2 text-sm font-medium transition-all',
                          selectedAnswers[q.id] === opt ? 'bg-teal-50 border-teal-400 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-300')}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {(q.question_type === 'single_choice' || q.question_type === 'multiple_choice') && (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <button key={opt.id} onClick={() => setSelectedAnswers(p => ({ ...p, [q.id]: opt.option_th }))}
                        className={cn('rounded-xl border px-3 py-1.5 text-sm transition-all',
                          selectedAnswers[q.id] === opt.option_th ? 'bg-teal-50 border-teal-400 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-300')}>
                        {opt.option_th}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Possible conditions */}
        {pathway.conditions?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">ภาวะที่อาจเกี่ยวข้อง</p>
            <div className="space-y-2">
              {pathway.conditions.map(c => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-sm font-medium text-slate-800">{c.condition_name_th}</p>
                  <span className={cn('text-xs font-semibold rounded-full px-2.5 py-0.5',
                    c.strength === 'strongly_suggests' ? 'bg-teal-100 text-teal-700' :
                    c.strength === 'supports' ? 'bg-sky-100 text-sky-700' :
                    c.strength === 'possibly_related' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                  )}>
                    {c.strength === 'strongly_suggests' ? 'บ่งชี้ชัด' : c.strength === 'supports' ? 'สนับสนุน' : c.strength === 'possibly_related' ? 'อาจเกี่ยว' : 'โอกาสน้อย'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {pathway.recommendations?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">คำแนะนำ</p>
            <div className="space-y-2">
              {pathway.recommendations.map(r => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <ChevronRight className="h-4 w-4 text-teal-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{r.title_th}</p>
                    {r.detail_th && <p className="text-xs text-slate-500 mt-0.5">{r.detail_th}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              FirstScreen ให้ข้อมูลเพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค
              หากมีอาการรุนแรง ควรพบแพทย์ทันที
            </p>
          </div>
        </div>

        {/* Advanced Mode (hidden by default) */}
        <div className="mt-8">
          <button onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline">
            {showAdvanced ? 'ซ่อน' : 'แสดง'} Advanced Mode (สำหรับทีมเทคนิค)
          </button>

          {showAdvanced && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-700 mb-3">Advanced Mode — ข้อมูลภายใน</p>
              <p className="text-[11px] text-amber-600 mb-2">แพทย์ไม่จำเป็นต้องเข้าใจส่วนนี้ — ระบบจัดการให้อัตโนมัติ</p>
              <div className="bg-amber-900/10 rounded-lg p-3 font-mono text-[10px] text-amber-800 overflow-auto">
                <pre>{JSON.stringify({
                  id: pathway.id,
                  conditions_with_scores: pathway.conditions?.map(c => ({
                    name: c.condition_name_th,
                    strength: c.strength,
                    internal_score: c.strength === 'strongly_suggests' ? 90 : c.strength === 'supports' ? 70 : c.strength === 'possibly_related' ? 50 : 30
                  })),
                  questions_count: pathway.questions?.length,
                  red_flags_count: pathway.red_flags?.length,
                }, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
