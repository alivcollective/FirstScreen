'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { makeId } from '@/types/clinical-pathway'
import type { PathwayDraft, PathwayQuestion, QuestionType } from '@/types/clinical-pathway'

interface StepProps { draft: PathwayDraft; onChange: (u: Partial<PathwayDraft>) => void }

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  yes_no: 'ใช่ / ไม่ใช่',
  single_choice: 'เลือกตอบ 1 ข้อ',
  multiple_choice: 'เลือกได้หลายข้อ',
  number: 'ตัวเลข',
  text: 'ข้อความอิสระ',
  scale: 'ระดับ 1-10',
}

function QuestionCard({
  q, idx, onUpdate, onDelete,
}: {
  q: PathwayQuestion; idx: number; onUpdate: (id: string, u: Partial<PathwayQuestion>) => void; onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  function addOption() {
    onUpdate(q.id, {
      options: [...q.options, { id: makeId(), option_th: '', sort_order: q.options.length }]
    })
  }

  function updateOption(optId: string, text: string) {
    onUpdate(q.id, {
      options: q.options.map(o => o.id === optId ? { ...o, option_th: text } : o)
    })
  }

  function removeOption(optId: string) {
    onUpdate(q.id, { options: q.options.filter(o => o.id !== optId) })
  }

  const showOptions = q.question_type === 'single_choice' || q.question_type === 'multiple_choice'

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/60 overflow-hidden">
      {/* Question header */}
      <div className="flex items-start gap-2 p-4">
        <GripVertical className="h-4 w-4 text-slate-600 mt-1 shrink-0 cursor-grab" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">Q{idx + 1}</span>
            <select
              value={q.question_type}
              onChange={e => onUpdate(q.id, { question_type: e.target.value as QuestionType })}
              className="text-[11px] rounded-lg border border-slate-700 bg-slate-900 text-slate-400 px-2 py-0.5 focus:outline-none focus:border-teal-500"
            >
              {Object.entries(QUESTION_TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <input
            value={q.question_th}
            onChange={e => onUpdate(q.id, { question_th: e.target.value })}
            placeholder="พิมพ์คำถาม... เช่น เจ็บเมื่อยกแขนหรือไม่?"
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none border-b border-slate-700 focus:border-teal-500 pb-1 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded text-slate-500 hover:text-slate-300 transition-colors">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => onDelete(q.id)} className="p-1.5 rounded text-slate-600 hover:text-red-400 transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded options */}
      {expanded && showOptions && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-700/50 pt-3">
          <p className="text-xs font-semibold text-slate-500 mb-2">ตัวเลือก</p>
          {q.options.map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-4 shrink-0">{i + 1}.</span>
              <input
                value={opt.option_th}
                onChange={e => updateOption(opt.id, e.target.value)}
                placeholder={`ตัวเลือก ${i + 1}`}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
              />
              <button onClick={() => removeOption(opt.id)} className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button onClick={addOption}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-400 transition-colors mt-1">
            <Plus className="h-3.5 w-3.5" /> เพิ่มตัวเลือก
          </button>
        </div>
      )}

      {/* Required toggle */}
      {expanded && (
        <div className="px-4 pb-3 flex items-center gap-2 border-t border-slate-700/50 pt-2.5">
          <input type="checkbox" id={`req-${q.id}`} checked={q.is_required}
            onChange={e => onUpdate(q.id, { is_required: e.target.checked })}
            className="accent-teal-500 h-3.5 w-3.5" />
          <label htmlFor={`req-${q.id}`} className="text-xs text-slate-500 cursor-pointer">
            คำถามบังคับ
          </label>
        </div>
      )}
    </div>
  )
}

export function Step4Questions({ draft, onChange }: StepProps) {
  function addQuestion() {
    const newQ: PathwayQuestion = {
      id: makeId(), question_th: '', question_en: '',
      question_type: 'yes_no', is_required: false, options: [], sort_order: draft.questions.length,
    }
    onChange({ questions: [...draft.questions, newQ] })
  }

  function updateQuestion(id: string, updates: Partial<PathwayQuestion>) {
    onChange({ questions: draft.questions.map(q => q.id === id ? { ...q, ...updates } : q) })
  }

  function deleteQuestion(id: string) {
    onChange({ questions: draft.questions.filter(q => q.id !== id) })
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <p className="text-xs font-semibold text-teal-400 mb-1">History Taking แบบที่แพทย์คิด</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          เขียนคำถามเหมือนถามผู้ป่วยจริงๆ ในภาษาไทย ระบบจัดการการให้คะแนนเองเบื้องหลัง
        </p>
      </div>

      <div className="space-y-3">
        {draft.questions.map((q, i) => (
          <QuestionCard key={q.id} q={q} idx={i} onUpdate={updateQuestion} onDelete={deleteQuestion} />
        ))}
      </div>

      <button onClick={addQuestion}
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-slate-700 hover:border-teal-600 hover:text-teal-400 px-4 py-3 text-sm text-slate-500 transition-colors">
        <Plus className="h-4 w-4" />
        เพิ่มคำถาม
      </button>

      {draft.questions.length === 0 && (
        <div className="text-center py-4 text-xs text-slate-500">
          ตัวอย่าง: "เจ็บเมื่อยกแขนเหนือศีรษะหรือไม่?" · "มีอาการชาร้าวลงแขนหรือไม่?"
        </div>
      )}
    </div>
  )
}
