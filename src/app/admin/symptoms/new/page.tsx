'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ChevronRight, Save, Send, Loader2, Sparkles, CheckCircle2, X, Plus, AlertCircle, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import type { AIUsageStatus } from '@/types/medical'

// ── Types ─────────────────────────────────────────────────────

type QuestionType = 'yes_no' | 'multiple_choice' | 'scale_1_10' | 'duration' | 'text'

interface FollowUpQuestion {
  key: string
  q_th: string
  q_en: string
  type: QuestionType
  options: string[]
  depends_on: string
  depends_value: string
}

interface SymptomForm {
  name_th: string
  name_en: string
  code: string
  body_region: string
  system: string
  severity_weight: 1 | 2 | 3 | 4
  is_emergency: boolean
  description_th: string
  aliases: string[]
  follow_up_questions: FollowUpQuestion[]
}

// ── Constants ─────────────────────────────────────────────────

const TABS = ['ข้อมูลหลัก', 'คำถามติดตาม', 'ส่วนร่างกาย', 'References']

const BODY_REGIONS = [
  { value: 'head', label: 'ศีรษะ' }, { value: 'face', label: 'ใบหน้า' },
  { value: 'chest', label: 'หน้าอก' }, { value: 'abdomen', label: 'ท้อง' },
  { value: 'back', label: 'หลัง' }, { value: 'limbs', label: 'แขนขา' },
  { value: 'skin', label: 'ผิวหนัง' }, { value: 'general', label: 'ทั่วไป' },
]

const SYSTEMS = [
  { value: 'neurological', label: 'ระบบประสาท' },
  { value: 'cardiovascular', label: 'ระบบหัวใจหลอดเลือด' },
  { value: 'respiratory', label: 'ระบบหายใจ' },
  { value: 'GI', label: 'ระบบทางเดินอาหาร' },
  { value: 'musculoskeletal', label: 'กล้ามเนื้อและกระดูก' },
  { value: 'dermatological', label: 'ผิวหนัง' },
  { value: 'psychiatric', label: 'จิตเวช' },
  { value: 'endocrine', label: 'ต่อมไร้ท่อ' },
  { value: 'general', label: 'ทั่วไป' },
]

const Q_TYPES: Array<{ value: QuestionType; label: string }> = [
  { value: 'yes_no', label: 'ใช่/ไม่ใช่' },
  { value: 'multiple_choice', label: 'หลายตัวเลือก' },
  { value: 'scale_1_10', label: 'ระดับ 1-10' },
  { value: 'duration', label: 'ระยะเวลา' },
  { value: 'text', label: 'ข้อความอิสระ' },
]

const EMPTY_FORM: SymptomForm = {
  name_th: '', name_en: '', code: '', body_region: 'general', system: 'general',
  severity_weight: 1, is_emergency: false, description_th: '', aliases: [], follow_up_questions: [],
}

// ── Completeness ──────────────────────────────────────────────

function calcCompleteness(f: SymptomForm): number {
  return (
    (f.name_th.trim() ? 20 : 0) +
    (f.name_en.trim() ? 10 : 0) +
    (f.code.trim() ? 10 : 0) +
    (f.body_region ? 10 : 0) +
    (f.system ? 10 : 0) +
    (f.description_th.trim() ? 15 : 0) +
    (f.follow_up_questions.length > 0 ? 15 : 0) +
    (f.severity_weight >= 1 ? 5 : 0) +
    (f.aliases.length > 0 ? 5 : 0)
  )
}

// ── Inline styles ─────────────────────────────────────────────

const S = {
  page: { background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const },
  topBar: { background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0 1.25rem', height: 52, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  tabBar: { background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0 1.25rem', display: 'flex', gap: 4, flexShrink: 0 },
  body: { flex: 1, display: 'flex', overflow: 'hidden' as const, minHeight: 0 },
  main: { flex: 1, overflowY: 'auto' as const, padding: '1.5rem' },
  aside: { width: 260, flexShrink: 0, borderLeft: '1px solid #1e2d40', display: 'flex', flexDirection: 'column' as const, background: '#0d1626', overflowY: 'auto' as const },
  statusBar: { background: '#0d1626', borderTop: '1px solid #1e2d40', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, minHeight: 44 },
  input: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const },
  textarea: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', resize: 'vertical' as const, minHeight: 80, boxSizing: 'border-box' as const },
  select: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', cursor: 'pointer' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  section: { marginBottom: '1.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#1e2d40', color: '#94a3b8', borderRadius: 6, padding: '2px 8px', fontSize: 12 },
}

// ── AliasManager ──────────────────────────────────────────────

function AliasManager({ aliases, onChange }: { aliases: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  function add() {
    const v = input.trim()
    if (v && !aliases.includes(v)) onChange([...aliases, v])
    setInput('')
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 8 }}>
        {aliases.map(a => (
          <span key={a} style={S.chip}>{a}
            <button onClick={() => onChange(aliases.filter(x => x !== a))} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={10} /></button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }} placeholder="เพิ่มชื่อเรียกอื่น... (กด Enter)" style={{ ...S.input, flex: 1 }} />
        <button onClick={add} style={{ borderRadius: 8, background: '#1e2d40', border: 'none', color: '#94a3b8', padding: '0 10px', cursor: 'pointer' }}><Plus size={14} /></button>
      </div>
    </div>
  )
}

// ── Question Builder ──────────────────────────────────────────

function newQuestion(index: number): FollowUpQuestion {
  return { key: `q${Date.now()}_${index}`, q_th: '', q_en: '', type: 'yes_no', options: [], depends_on: '', depends_value: '' }
}

function QuestionCard({
  q, index, total, questions,
  onChange, onDelete, onMoveUp, onMoveDown,
}: {
  q: FollowUpQuestion; index: number; total: number; questions: FollowUpQuestion[]
  onChange: (key: string, updates: Partial<FollowUpQuestion>) => void
  onDelete: (key: string) => void
  onMoveUp: (key: string) => void
  onMoveDown: (key: string) => void
}) {
  const [optInput, setOptInput] = useState('')

  function addOption() {
    const v = optInput.trim()
    if (v && !q.options.includes(v)) onChange(q.key, { options: [...q.options, v] })
    setOptInput('')
  }

  return (
    <div style={{ borderRadius: 12, border: '1px solid #1e2d40', background: '#111827', padding: '1rem', marginBottom: 10 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>คำถาม {index + 1}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onMoveUp(q.key)} disabled={index === 0} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 5, padding: '2px 5px', color: index === 0 ? '#1e2d40' : '#64748b', cursor: index === 0 ? 'not-allowed' : 'pointer' }}><ArrowUp size={11} /></button>
          <button onClick={() => onMoveDown(q.key)} disabled={index === total - 1} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 5, padding: '2px 5px', color: index === total - 1 ? '#1e2d40' : '#64748b', cursor: index === total - 1 ? 'not-allowed' : 'pointer' }}><ArrowDown size={11} /></button>
          <button onClick={() => onDelete(q.key)} style={{ background: 'none', border: '1px solid #450a0a', borderRadius: 5, padding: '2px 5px', color: '#f87171', cursor: 'pointer' }}><Trash2 size={11} /></button>
        </div>
      </div>

      {/* Question TH */}
      <div style={S.section}>
        <label style={S.label}>คำถาม (ไทย) *</label>
        <input value={q.q_th} onChange={e => onChange(q.key, { q_th: e.target.value })} placeholder="เช่น อาการเริ่มเมื่อไหร่?" style={S.input} />
      </div>

      {/* Question EN */}
      <div style={S.section}>
        <label style={S.label}>คำถาม (EN)</label>
        <input value={q.q_en} onChange={e => onChange(q.key, { q_en: e.target.value })} placeholder="e.g. When did it start?" style={S.input} />
      </div>

      {/* Type */}
      <div style={{ ...S.section, ...S.grid2 }}>
        <div>
          <label style={S.label}>ประเภทคำถาม</label>
          <select value={q.type} onChange={e => onChange(q.key, { type: e.target.value as QuestionType, options: [] })} style={S.select}>
            {Q_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Depends on */}
        <div>
          <label style={S.label}>แสดงเมื่อ (depends on)</label>
          <select value={q.depends_on} onChange={e => onChange(q.key, { depends_on: e.target.value, depends_value: '' })} style={S.select}>
            <option value="">— ไม่มีเงื่อนไข —</option>
            {questions.filter(oq => oq.key !== q.key).map(oq => (
              <option key={oq.key} value={oq.key}>{oq.q_th || `คำถาม #${questions.indexOf(oq) + 1}`}</option>
            ))}
          </select>
        </div>
      </div>

      {q.depends_on && (
        <div style={S.section}>
          <label style={S.label}>ค่าที่ต้องตรงกัน</label>
          <input value={q.depends_value} onChange={e => onChange(q.key, { depends_value: e.target.value })} placeholder="เช่น yes, ใช่" style={S.input} />
        </div>
      )}

      {/* Options (multiple choice) */}
      {q.type === 'multiple_choice' && (
        <div style={S.section}>
          <label style={S.label}>ตัวเลือก</label>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 6 }}>
            {q.options.map(opt => (
              <span key={opt} style={S.chip}>{opt}
                <button onClick={() => onChange(q.key, { options: q.options.filter(o => o !== opt) })} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={optInput} onChange={e => setOptInput(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); addOption() } }} placeholder="เพิ่มตัวเลือก... (Enter)" style={{ ...S.input, flex: 1, fontSize: 12 }} />
            <button onClick={addOption} style={{ borderRadius: 8, background: '#1e2d40', border: 'none', color: '#94a3b8', padding: '0 8px', cursor: 'pointer' }}><Plus size={13} /></button>
          </div>
        </div>
      )}

      {/* Preview */}
      <div style={{ borderRadius: 8, background: '#0a1015', border: '1px solid #1e2d40', padding: '8px 10px' }}>
        <p style={{ fontSize: 10, color: '#475569', fontWeight: 600, marginBottom: 4 }}>PREVIEW</p>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>{q.q_th || '(ยังไม่มีคำถาม)'}</p>
        {q.type === 'yes_no' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {['ใช่', 'ไม่ใช่'].map(l => <span key={l} style={{ borderRadius: 6, border: '1px solid #1e2d40', padding: '3px 12px', fontSize: 12, color: '#64748b' }}>{l}</span>)}
          </div>
        )}
        {q.type === 'scale_1_10' && (
          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' as const }}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <span key={n} style={{ borderRadius: 5, border: '1px solid #1e2d40', padding: '2px 7px', fontSize: 11, color: '#64748b' }}>{n}</span>)}
          </div>
        )}
        {q.type === 'multiple_choice' && q.options.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3, marginTop: 6 }}>
            {q.options.map(opt => <span key={opt} style={{ borderRadius: 6, border: '1px solid #1e2d40', padding: '3px 10px', fontSize: 12, color: '#64748b' }}>○ {opt}</span>)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab: Follow-up Questions ──────────────────────────────────

function Tab1Questions({ questions, onChange }: { questions: FollowUpQuestion[]; onChange: (q: FollowUpQuestion[]) => void }) {
  function addQuestion() {
    onChange([...questions, newQuestion(questions.length)])
  }

  function updateQuestion(key: string, updates: Partial<FollowUpQuestion>) {
    onChange(questions.map(q => q.key === key ? { ...q, ...updates } : q))
  }

  function deleteQuestion(key: string) {
    onChange(questions.filter(q => q.key !== key))
  }

  function moveUp(key: string) {
    const i = questions.findIndex(q => q.key === key)
    if (i <= 0) return
    const next = [...questions]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  function moveDown(key: string) {
    const i = questions.findIndex(q => q.key === key)
    if (i >= questions.length - 1) return
    const next = [...questions]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next)
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>คำถามติดตาม (Follow-up Questions)</p>
          <p style={{ fontSize: 12, color: '#475569' }}>ระบบ OLDCARTS — ถามเพื่อประเมินอาการเพิ่มเติม</p>
        </div>
        <button onClick={addQuestion} style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 8, background: '#14b8a6', border: 'none', color: '#fff', padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> เพิ่มคำถาม
        </button>
      </div>

      {questions.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '3rem', borderRadius: 12, border: '1px dashed #1e2d40', color: '#475569', fontSize: 14 }}>
          <AlertCircle size={32} style={{ color: '#1e2d40', marginBottom: 8 }} />
          <p>ยังไม่มีคำถาม — คลิก "+ เพิ่มคำถาม" เพื่อเริ่ม</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>แนะนำ: ตั้งคำถาม Onset, Location, Duration, Character, Severity</p>
        </div>
      ) : (
        questions.map((q, i) => (
          <QuestionCard key={q.key} q={q} index={i} total={questions.length} questions={questions}
            onChange={updateQuestion} onDelete={deleteQuestion} onMoveUp={moveUp} onMoveDown={moveDown} />
        ))
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

function NewSymptomContent() {
  const [activeTab, setActiveTab] = useState(0)
  const [form, setForm] = useState<SymptomForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [autofilling, setAutofilling] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiUsage, setAiUsage] = useState<AIUsageStatus>({ used: 0, limit: 10, remaining: 10, resets_at: '' })
  const [missingFields, setMissingFields] = useState<string[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/ai/autofill-symptom').then(r => r.json()).then(d => { if (d.usage) setAiUsage(d.usage) }).catch(() => {})
  }, [])

  const completeness = calcCompleteness(form)
  const barColor = completeness >= 80 ? '#22c55e' : completeness >= 50 ? '#14b8a6' : '#eab308'

  function patch(u: Partial<SymptomForm>) { setForm(prev => ({ ...prev, ...u })); setSavedId(null) }

  async function handleSave() {
    if (saving || !form.name_th.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_th: form.name_th, name_en: form.name_en,
          code: form.code, body_region: form.body_region,
          system: form.system, severity_weight: form.severity_weight,
          is_emergency: form.is_emergency, description_th: form.description_th,
          aliases: form.aliases, follow_up_questions: form.follow_up_questions,
          slug: form.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `symptom-${Date.now()}`,
        }),
      })
      const d = await res.json()
      if (res.ok && d.id) setSavedId(d.id)
    } catch {} finally { setSaving(false) }
  }

  async function handleAutofill() {
    if (!form.name_th.trim() || autofilling) return
    setAutofilling(true); setAiError(null); setAiResult(null)
    try {
      const res = await fetch('/api/admin/ai/autofill-symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name_th: form.name_th, body_region: form.body_region, system: form.system }),
      })
      const data = await res.json()
      if (!res.ok) { setAiError(data.error ?? `Error ${res.status}`); return }
      if (data.usage) setAiUsage(data.usage)
      const r = data.result
      patch({
        name_en: r.name_en || form.name_en,
        description_th: r.description_th || form.description_th,
        code: r.icd11_suggestion || form.code,
        severity_weight: r.severity_weight ?? form.severity_weight,
        is_emergency: r.is_emergency ?? form.is_emergency,
        aliases: r.aliases?.length ? r.aliases : form.aliases,
        follow_up_questions: r.follow_up_questions?.length
          ? r.follow_up_questions.map((q: Record<string, unknown>, i: number) => ({
              key: `ai_q${i}_${Date.now()}`,
              q_th: q.q_th as string ?? '',
              q_en: q.q_en as string ?? '',
              type: (q.type as QuestionType) ?? 'yes_no',
              options: (q.options as string[]) ?? [],
              depends_on: '',
              depends_value: '',
            }))
          : form.follow_up_questions,
      })
      setAiResult(`✅ เติมข้อมูลสำเร็จ\n• EN: ${r.name_en}\n• ICD-11: ${r.icd11_suggestion ?? '—'}\n• คำถาม: ${r.follow_up_questions?.length ?? 0} ข้อ`)
    } catch { setAiError('ไม่สามารถเชื่อมต่อ AI ได้') }
    finally { setAutofilling(false) }
  }

  function handleCheckCompleteness() {
    const missing: string[] = []
    if (!form.name_th.trim()) missing.push('ชื่อภาษาไทย')
    if (!form.name_en.trim()) missing.push('ชื่อภาษาอังกฤษ')
    if (!form.code.trim()) missing.push('รหัส ICD-11')
    if (!form.description_th.trim()) missing.push('คำอธิบาย')
    if (form.follow_up_questions.length === 0) missing.push('คำถามติดตาม')
    if (form.aliases.length === 0) missing.push('ชื่อเรียกอื่น')
    setMissingFields(missing)
  }

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Top bar */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
          <Link href="/admin/symptoms" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>อาการ</Link>
          <ChevronRight size={13} style={{ color: '#475569' }} />
          <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>เพิ่มใหม่</span>
        </div>
        {form.is_emergency && <span style={{ fontSize: 11, color: '#f87171', background: '#450a0a', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>🚨 Emergency — จะแสดง banner 1669</span>}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleSave} disabled={saving || !form.name_th.trim()} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: `1px solid ${savedId ? '#134e4a' : '#1e2d40'}`, background: savedId ? '#14b8a611' : 'none', color: savedId ? '#14b8a6' : '#94a3b8', padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : savedId ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {savedId ? 'บันทึกแล้ว' : 'บันทึก'}
          </button>
          <button onClick={handleSave} disabled={completeness < 60 || saving} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: 'none', background: completeness >= 60 ? '#14b8a6' : '#1e2d40', color: completeness >= 60 ? '#fff' : '#475569', padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: completeness >= 60 ? 'pointer' : 'not-allowed' }}>
            <Send size={13} /> ส่งตรวจสอบ
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={S.tabBar}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} style={{ padding: '0.625rem 0.875rem', fontSize: 13, fontWeight: activeTab === i ? 600 : 400, color: activeTab === i ? '#14b8a6' : '#64748b', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: activeTab === i ? '2px solid #14b8a6' : '2px solid transparent', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
            {tab}{i === 1 && form.follow_up_questions.length > 0 && <span style={{ marginLeft: 4, fontSize: 10, background: '#14b8a622', color: '#14b8a6', borderRadius: 99, padding: '1px 5px' }}>{form.follow_up_questions.length}</span>}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={S.body}>
        <div style={S.main}>
          {activeTab === 0 && (
            <div style={{ maxWidth: 720 }}>
              <div style={{ ...S.section, ...S.grid2 }}>
                <div><label style={S.label}>ชื่ออาการ (ไทย) *</label><input value={form.name_th} onChange={e => patch({ name_th: e.target.value })} placeholder="เช่น ปวดหัว" style={S.input} /></div>
                <div><label style={S.label}>ชื่ออาการ (EN)</label><input value={form.name_en} onChange={e => patch({ name_en: e.target.value })} placeholder="e.g. Headache" style={S.input} /></div>
              </div>
              <div style={{ ...S.section, ...S.grid2 }}>
                <div><label style={S.label}>รหัส ICD-11</label><input value={form.code} onChange={e => patch({ code: e.target.value })} placeholder="เช่น MB40" style={S.input} /></div>
                <div><label style={S.label}>บริเวณร่างกาย</label>
                  <select value={form.body_region} onChange={e => patch({ body_region: e.target.value })} style={S.select}>
                    {BODY_REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ ...S.section, ...S.grid2 }}>
                <div><label style={S.label}>ระบบร่างกาย</label>
                  <select value={form.system} onChange={e => patch({ system: e.target.value })} style={S.select}>
                    {SYSTEMS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>ระดับความรุนแรง (1-4)</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4].map(w => {
                      const colors = ['#22c55e', '#eab308', '#f97316', '#ef4444']
                      const active = form.severity_weight === w
                      return (
                        <button key={w} onClick={() => patch({ severity_weight: w as 1 | 2 | 3 | 4 })} style={{ flex: 1, borderRadius: 8, padding: '8px 0', fontWeight: 700, fontSize: 14, border: `1px solid ${active ? colors[w - 1] : '#1e2d40'}`, background: active ? `${colors[w - 1]}22` : 'none', color: active ? colors[w - 1] : '#64748b', cursor: 'pointer' }}>
                          {w}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              {/* Emergency toggle */}
              <div style={S.section}>
                <label style={S.label}>สัญญาณฉุกเฉิน</label>
                <button onClick={() => patch({ is_emergency: !form.is_emergency })} style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 10, border: `1px solid ${form.is_emergency ? '#991b1b' : '#1e2d40'}`, background: form.is_emergency ? '#450a0a' : '#111827', padding: '10px 14px', cursor: 'pointer', width: '100%', textAlign: 'left' as const }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${form.is_emergency ? '#ef4444' : '#475569'}`, background: form.is_emergency ? '#ef4444' : 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {form.is_emergency && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                  </span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: form.is_emergency ? '#f87171' : '#94a3b8', marginBottom: 1 }}>
                      {form.is_emergency ? '🚨 เปิด — เป็นอาการฉุกเฉิน' : 'ปิด — อาการปกติ'}
                    </p>
                    {form.is_emergency && <p style={{ fontSize: 11, color: '#f87171' }}>จะแสดง banner "โทร 1669 ทันที" เมื่อผู้ใช้เลือกอาการนี้</p>}
                  </div>
                </button>
              </div>
              <div style={S.section}>
                <label style={S.label}>คำอธิบาย</label>
                <textarea value={form.description_th} onChange={e => patch({ description_th: e.target.value })} placeholder="อธิบายอาการนี้โดยย่อ..." rows={3} style={S.textarea} />
              </div>
              <div style={S.section}>
                <label style={S.label}>ชื่อเรียกอื่น</label>
                <AliasManager aliases={form.aliases} onChange={v => patch({ aliases: v })} />
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <Tab1Questions questions={form.follow_up_questions} onChange={q => patch({ follow_up_questions: q })} />
          )}
          {activeTab > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
              <AlertCircle size={36} style={{ color: '#1e2d40' }} />
              <p style={{ color: '#475569', fontSize: 15 }}>บันทึกข้อมูลหลักก่อน แล้วค่อยเพิ่ม <strong style={{ color: '#64748b' }}>{TABS[activeTab]}</strong></p>
            </div>
          )}
        </div>

        {/* AI Aside */}
        <aside style={S.aside}>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={14} style={{ color: '#14b8a6' }} /><span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>AI Assist</span></div>
              <span style={{ fontSize: 11, color: aiUsage.remaining > 0 ? '#64748b' : '#ef4444' }}>{aiUsage.used}/{aiUsage.limit}</span>
            </div>
            <button onClick={handleAutofill} disabled={!form.name_th.trim() || autofilling || aiUsage.remaining <= 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 8, border: 'none', background: form.name_th.trim() && !autofilling && aiUsage.remaining > 0 ? '#14b8a6' : '#1e2d40', color: form.name_th.trim() && aiUsage.remaining > 0 ? '#fff' : '#475569', padding: '9px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
              {autofilling ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} />}
              {autofilling ? 'กำลังเติม...' : '⚡ Autofill ชื่อ + คำถาม (1 call)'}
            </button>
            <button onClick={handleCheckCompleteness} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 8, border: '1px solid #1e2d40', background: 'none', color: '#94a3b8', padding: '8px 12px', fontSize: 12, cursor: 'pointer', width: '100%' }}>
              <CheckCircle2 size={13} /> 🔍 ตรวจสอบความสมบูรณ์
            </button>
            <div style={{ borderBottom: '1px solid #1e2d40' }} />
            <div style={{ borderRadius: 8, background: '#0a1015', border: '1px solid #1e2d40', padding: '8px 10px' }}>
              <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>Tier 1 — ฟรี ไม่ใช้ API</p>
              <p style={{ fontSize: 10, color: '#475569' }}>ตรวจสอบความสมบูรณ์ทำงาน local</p>
            </div>
            {missingFields !== null && (
              <div style={{ borderRadius: 8, background: missingFields.length === 0 ? '#052e16' : '#1c0a00', border: `1px solid ${missingFields.length === 0 ? '#14532d' : '#451a03'}`, padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: missingFields.length === 0 ? '#22c55e' : '#f97316' }}>{missingFields.length === 0 ? '✅ ครบถ้วน!' : `⚠ ขาด ${missingFields.length} ฟิลด์`}</span>
                  <button onClick={() => setMissingFields(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                </div>
                {missingFields.map(f => <p key={f} style={{ fontSize: 11, color: '#f97316', margin: '1px 0' }}>• {f}</p>)}
              </div>
            )}
            {aiResult && (
              <div style={{ borderRadius: 8, background: '#0d2b2b', border: '1px solid #134e4a', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#14b8a6' }}>ผลลัพธ์</span>
                  <button onClick={() => setAiResult(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                </div>
                <pre style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'pre-wrap' as const, margin: 0 }}>{aiResult}</pre>
              </div>
            )}
            {aiError && (
              <div style={{ borderRadius: 8, background: '#1c0a00', border: '1px solid #7c2d12', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>ข้อผิดพลาด</span>
                  <button onClick={() => setAiError(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                </div>
                <p style={{ fontSize: 11, color: '#f87171', margin: 0 }}>{aiError}</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Status bar */}
      <div style={S.statusBar}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: barColor, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>ความสมบูรณ์</span>
        <div style={{ flex: 1, height: 6, background: '#1e2d40', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completeness}%`, background: barColor, borderRadius: 99, transition: 'width 0.3s, background 0.3s' }} />
        </div>
        <span style={{ fontSize: 12, color: barColor, fontWeight: 600, minWidth: 32, textAlign: 'right' as const }}>{completeness}%</span>
      </div>
    </div>
  )
}

export default function NewSymptomPage() {
  return (
    <AdminLayout title="เพิ่มอาการใหม่">
      <div style={{ height: 'calc(100vh - 3.5rem)', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
        <NewSymptomContent />
      </div>
    </AdminLayout>
  )
}
