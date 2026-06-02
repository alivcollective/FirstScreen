'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ChevronRight, Save, Send, Loader2, Sparkles, CheckCircle2, X, Plus, AlertCircle } from 'lucide-react'
import type { ConditionFormData, ContentStatus, AIAutofillResponse, AIUsageStatus } from '@/types/medical'

// ── Constants ─────────────────────────────────────────────────

const TABS = ['ข้อมูลหลัก', 'อาการ', 'ส่วนร่างกาย', 'Pathways', 'Red Flags', 'References']

const SPECIALTIES = [
  { value: 'general', label: 'เวชกรรมทั่วไป' },
  { value: 'internal_medicine', label: 'อายุรกรรม' },
  { value: 'cardiology', label: 'โรคหัวใจ' },
  { value: 'neurology', label: 'ประสาทวิทยา' },
  { value: 'orthopedics', label: 'ออร์โธปิดิกส์' },
  { value: 'gastroenterology', label: 'โรคระบบทางเดินอาหาร' },
  { value: 'pulmonology', label: 'โรคระบบทางเดินหายใจ' },
  { value: 'endocrinology', label: 'ต่อมไร้ท่อ' },
  { value: 'psychiatry', label: 'จิตเวชศาสตร์' },
  { value: 'dermatology', label: 'ผิวหนัง' },
  { value: 'oncology', label: 'มะเร็งวิทยา' },
  { value: 'surgery', label: 'ศัลยกรรม' },
  { value: 'emergency', label: 'เวชศาสตร์ฉุกเฉิน' },
  { value: 'pediatrics', label: 'กุมารเวชศาสตร์' },
  { value: 'obgyn', label: 'สูติ-นรีเวช' },
  { value: 'infectious_disease', label: 'โรคติดเชื้อ' },
]

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'เล็กน้อย', color: '#22c55e' },
  { value: 'moderate', label: 'ปานกลาง', color: '#eab308' },
  { value: 'severe', label: 'รุนแรง', color: '#f97316' },
  { value: 'critical', label: 'วิกฤติ', color: '#ef4444' },
] as const

const URGENCY_OPTIONS = [
  { value: 1, label: '1 — ตรวจตามนัด', sub: 'routine' },
  { value: 2, label: '2 — พบแพทย์ภายในไม่กี่สัปดาห์', sub: 'schedule' },
  { value: 3, label: '3 — ด่วน 24–48 ชั่วโมง', sub: 'urgent' },
  { value: 4, label: '4 — ฉุกเฉิน ไปห้องฉุกเฉินเดี๋ยวนี้', sub: 'emergency' },
] as const

const AGE_GROUP_OPTIONS = [
  { value: 'all', label: 'ทุกวัย' },
  { value: 'child', label: 'เด็ก (<12 ปี)' },
  { value: 'teen', label: 'วัยรุ่น (12–18)' },
  { value: 'adult', label: 'ผู้ใหญ่ (18–65)' },
  { value: 'elderly', label: 'ผู้สูงอายุ (>65)' },
]

const SEX_OPTIONS = [
  { value: 'all', label: 'ทุกเพศ' },
  { value: 'male', label: 'ชายมากกว่า' },
  { value: 'female', label: 'หญิงมากกว่า' },
]

const EVIDENCE_CARDS = [
  { value: 'high', label: 'ระดับสูง', sub: 'Systematic Review / RCT', icon: '★★★' },
  { value: 'moderate', label: 'ระดับปานกลาง', sub: 'Cohort / Case-Control', icon: '★★' },
  { value: 'low', label: 'ระดับต่ำ', sub: 'Case Series / Observational', icon: '★' },
  { value: 'expert_opinion', label: 'ความเห็นผู้เชี่ยวชาญ', sub: 'Expert Consensus', icon: '⚕' },
] as const

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'Draft',
  pending_review: 'รอตรวจสอบ',
  needs_revision: 'ต้องแก้ไข',
  approved: 'อนุมัติแล้ว',
  published: 'เผยแพร่',
  archived: 'เก็บถาวร',
}

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: '#64748b',
  pending_review: '#f59e0b',
  needs_revision: '#ef4444',
  approved: '#22c55e',
  published: '#14b8a6',
  archived: '#6b7280',
}

const EMPTY_FORM: ConditionFormData = {
  name_th: '',
  name_en: '',
  icd11_code: '',
  specialty: 'general',
  category: 'other',
  severity: '',
  urgency_level: null,
  description_th: '',
  aliases: [],
  tags: [],
  age_group: '',
  sex_predominant: '',
  evidence_level: '',
  reviewer_name: '',
  disclaimer_th: 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ กรุณาปรึกษาแพทย์',
}

// ── Completeness (local, no API) ──────────────────────────────

function calcCompleteness(form: ConditionFormData): number {
  const checks: Array<() => boolean> = [
    () => form.name_th.trim().length > 0,        // 25
    () => form.name_en.trim().length > 0,         // 10
    () => form.icd11_code.trim().length > 0,      // 10
    () => form.description_th.trim().length > 0,  // 20
    () => !!form.severity,                        // 10
    () => form.urgency_level !== null,            // 5
    () => !!form.age_group,                       // 5
    () => !!form.evidence_level,                  // 10
    () => form.reviewer_name.trim().length > 0,  // 5
  ]
  const weights = [25, 10, 10, 20, 10, 5, 5, 10, 5]
  return checks.reduce((sum, check, i) => sum + (check() ? weights[i] : 0), 0)
}

function getMissingFields(form: ConditionFormData): string[] {
  const missing: string[] = []
  if (!form.name_th.trim()) missing.push('ชื่อภาษาไทย')
  if (!form.name_en.trim()) missing.push('ชื่อภาษาอังกฤษ')
  if (!form.icd11_code.trim()) missing.push('รหัส ICD-11')
  if (!form.description_th.trim()) missing.push('คำอธิบายภาษาไทย')
  if (!form.severity) missing.push('ระดับความรุนแรง')
  if (form.urgency_level === null) missing.push('ระดับความเร่งด่วน')
  if (!form.age_group) missing.push('กลุ่มอายุ')
  if (!form.evidence_level) missing.push('ระดับหลักฐาน')
  if (!form.reviewer_name.trim()) missing.push('ชื่อผู้ตรวจสอบ')
  return missing
}

// ── Inline styles ─────────────────────────────────────────────

const S = {
  page: { background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const },
  topBar: { background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0 1.25rem', height: 52, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  tabBar: { background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0 1.25rem', display: 'flex', gap: 4, flexShrink: 0 as const },
  body: { flex: 1, display: 'flex', overflow: 'hidden' as const, minHeight: 0 },
  main: { flex: 1, overflowY: 'auto' as const, padding: '1.5rem' },
  aside: { width: 270, flexShrink: 0, borderLeft: '1px solid #1e2d40', display: 'flex', flexDirection: 'column' as const, background: '#0d1626', overflowY: 'auto' as const },
  statusBar: { background: '#0d1626', borderTop: '1px solid #1e2d40', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, minHeight: 44 },
  input: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const },
  textarea: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', resize: 'vertical' as const, minHeight: 100, boxSizing: 'border-box' as const },
  select: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', cursor: 'pointer' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  card: { borderRadius: 12, border: '1px solid #1e2d40', background: '#111827', padding: '1rem' },
  section: { marginBottom: '1.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#1e2d40', color: '#94a3b8', borderRadius: 6, padding: '2px 8px', fontSize: 12 },
}

// ── Sub-components ────────────────────────────────────────────

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.625rem 0.875rem',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? '#14b8a6' : '#64748b',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: active ? '2px solid #14b8a6' : '2px solid transparent',
        background: 'none',
        cursor: 'pointer',
        transition: 'color 0.15s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </button>
  )
}

function AliasManager({
  aliases,
  onChange,
}: {
  aliases: string[]
  onChange: (v: string[]) => void
}) {
  const [input, setInput] = useState('')

  function add() {
    const val = input.trim()
    if (val && !aliases.includes(val)) {
      onChange([...aliases, val])
    }
    setInput('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 8 }}>
        {aliases.map((a) => (
          <span key={a} style={S.chip}>
            {a}
            <button
              onClick={() => onChange(aliases.filter((x) => x !== a))}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', lineHeight: 1, padding: 0 }}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="เพิ่มชื่อเรียกอื่น... (กด Enter)"
          style={{ ...S.input, flex: 1 }}
        />
        <button
          onClick={add}
          style={{ borderRadius: 8, background: '#1e2d40', border: 'none', color: '#94a3b8', padding: '0 10px', cursor: 'pointer' }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

function TabPlaceholder({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
      <AlertCircle size={36} style={{ color: '#1e2d40' }} />
      <p style={{ color: '#475569', fontSize: 15, textAlign: 'center' as const }}>
        บันทึกข้อมูลหลักก่อน แล้วค่อยเพิ่ม <strong style={{ color: '#64748b' }}>{name}</strong>
      </p>
    </div>
  )
}

// ── Main Form ─────────────────────────────────────────────────

function ConditionFormContent() {
  const [activeTab, setActiveTab] = useState(0)
  const [form, setForm] = useState<ConditionFormData>(EMPTY_FORM)
  const [status, setStatus] = useState<ContentStatus>('draft')
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [autofilling, setAutofilling] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiUsage, setAiUsage] = useState<AIUsageStatus>({ used: 0, limit: 10, remaining: 10, resets_at: '' })
  const [checkingFields, setCheckingFields] = useState(false)
  const [missingFields, setMissingFields] = useState<string[] | null>(null)
  const completeness = calcCompleteness(form)
  const canSubmit = completeness >= 60

  function patch(updates: Partial<ConditionFormData>) {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  // Fetch current AI usage on mount
  useEffect(() => {
    fetch('/api/admin/ai/autofill-condition')
      .then((r) => r.json())
      .then((d) => { if (d.usage) setAiUsage(d.usage) })
      .catch(() => {})
  }, [])

  async function handleAutofill() {
    if (!form.name_th.trim() || autofilling) return
    setAutofilling(true)
    setAiError(null)
    setAiResult(null)

    try {
      const res = await fetch('/api/admin/ai/autofill-condition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name_th: form.name_th }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAiError(data.error ?? `Error ${res.status}`)
        return
      }

      const result: AIAutofillResponse = data.result
      if (data.usage) setAiUsage(data.usage)

      // Apply result to form
      patch({
        name_en: result.name_en || form.name_en,
        description_th: result.description_th || form.description_th,
        icd11_code: result.icd11_suggestion || form.icd11_code,
        aliases: result.aliases?.length ? result.aliases : form.aliases,
        age_group: (result.age_group as ConditionFormData['age_group']) || form.age_group,
        sex_predominant: (result.sex_predominant as ConditionFormData['sex_predominant']) || form.sex_predominant,
        evidence_level: (result.evidence_level as ConditionFormData['evidence_level']) || form.evidence_level,
      })

      setAiResult(
        `✅ เติมข้อมูลสำเร็จ\n` +
        `• ชื่อ EN: ${result.name_en}\n` +
        `• ICD-11: ${result.icd11_suggestion ?? '—'}\n` +
        `• อาการ: ${result.symptoms?.slice(0, 3).join(', ')}\n` +
        `• Red Flags: ${result.red_flags?.slice(0, 2).join(', ')}`
      )
    } catch {
      setAiError('ไม่สามารถเชื่อมต่อ AI ได้ กรุณาลองใหม่')
    } finally {
      setAutofilling(false)
    }
  }

  function handleCheckCompleteness() {
    setCheckingFields(true)
    setMissingFields(getMissingFields(form))
    setTimeout(() => setCheckingFields(false), 500)
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/conditions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status }),
      })
      const data = await res.json()
      if (res.ok && data.id) {
        setSavedId(data.id)
      }
    } catch {
      // silent — user sees no change in button
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit() {
    if (!canSubmit || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/conditions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'pending_review' }),
      })
      const data = await res.json()
      if (res.ok && data.id) {
        setSavedId(data.id)
        setStatus('pending_review')
      }
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  // ── Progress bar color
  const barColor = completeness >= 80 ? '#22c55e' : completeness >= 50 ? '#14b8a6' : '#eab308'

  return (
    <div style={S.page}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div style={S.topBar}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
          <Link href="/admin/conditions" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>
            โรคและภาวะ
          </Link>
          <ChevronRight size={13} style={{ color: '#475569' }} />
          <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>เพิ่มใหม่</span>
        </div>

        {/* Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[status], display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: STATUS_COLORS[status], fontWeight: 600 }}>
            {STATUS_LABELS[status]}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: `1px solid ${savedId ? '#134e4a' : '#1e2d40'}`, background: savedId ? '#14b8a611' : 'none', color: savedId ? '#14b8a6' : '#94a3b8', padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
          >
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : savedId ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {savedId ? 'บันทึกแล้ว' : 'บันทึก Draft'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              borderRadius: 8, border: 'none',
              background: canSubmit ? '#14b8a6' : '#1e2d40',
              color: canSubmit ? '#fff' : '#475569',
              padding: '5px 12px', fontSize: 12, fontWeight: 600,
              cursor: canSubmit && !saving ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s',
            }}
          >
            <Send size={13} />
            ส่งตรวจสอบ
          </button>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────── */}
      <div style={S.tabBar}>
        {TABS.map((tab, i) => (
          <TabButton key={tab} label={tab} active={activeTab === i} onClick={() => setActiveTab(i)} />
        ))}
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div style={S.body}>

        {/* Main content */}
        <div style={S.main}>
          {activeTab === 0 ? (
            <Tab0Main form={form} patch={patch} />
          ) : (
            <TabPlaceholder name={TABS[activeTab]} />
          )}
        </div>

        {/* AI Panel */}
        <aside style={S.aside}>
          <AiPanel
            form={form}
            autofilling={autofilling}
            aiResult={aiResult}
            aiError={aiError}
            aiUsage={aiUsage}
            checkingFields={checkingFields}
            missingFields={missingFields}
            onAutofill={handleAutofill}
            onCheckCompleteness={handleCheckCompleteness}
            onDismissResult={() => setAiResult(null)}
            onDismissError={() => setAiError(null)}
            onDismissMissing={() => setMissingFields(null)}
          />
        </aside>
      </div>

      {/* ── Status bar ───────────────────────────────────────── */}
      <div style={S.statusBar}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: barColor, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>ความสมบูรณ์</span>
        <div style={{ flex: 1, height: 6, background: '#1e2d40', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completeness}%`, background: barColor, borderRadius: 99, transition: 'width 0.3s ease, background 0.3s ease' }} />
        </div>
        <span style={{ fontSize: 12, color: barColor, fontWeight: 600, minWidth: 32, textAlign: 'right' as const }}>
          {completeness}%
        </span>
        {!canSubmit && (
          <span style={{ fontSize: 11, color: '#64748b' }}>ต้องการ 60%+ เพื่อส่งตรวจสอบ</span>
        )}
      </div>
    </div>
  )
}

// ── Tab 0 — ข้อมูลหลัก ───────────────────────────────────────

function Tab0Main({ form, patch }: { form: ConditionFormData; patch: (u: Partial<ConditionFormData>) => void }) {
  return (
    <div style={{ maxWidth: 720 }}>

      {/* Names */}
      <div style={{ ...S.section, ...S.grid2 }}>
        <div>
          <label style={S.label}>ชื่อภาษาไทย *</label>
          <input
            value={form.name_th}
            onChange={(e) => patch({ name_th: e.target.value })}
            placeholder="เช่น เบาหวานชนิดที่ 2"
            style={S.input}
          />
        </div>
        <div>
          <label style={S.label}>ชื่อภาษาอังกฤษ</label>
          <input
            value={form.name_en}
            onChange={(e) => patch({ name_en: e.target.value })}
            placeholder="e.g. Type 2 Diabetes Mellitus"
            style={S.input}
          />
        </div>
      </div>

      {/* ICD-11 + Specialty */}
      <div style={{ ...S.section, ...S.grid2 }}>
        <div>
          <label style={S.label}>รหัส ICD-11</label>
          <input
            value={form.icd11_code}
            onChange={(e) => patch({ icd11_code: e.target.value })}
            placeholder="เช่น 5A11"
            style={S.input}
          />
        </div>
        <div>
          <label style={S.label}>ความเชี่ยวชาญ</label>
          <select
            value={form.specialty}
            onChange={(e) => patch({ specialty: e.target.value })}
            style={S.select}
          >
            {SPECIALTIES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description TH */}
      <div style={S.section}>
        <label style={S.label}>คำอธิบายภาษาไทย *</label>
        <textarea
          value={form.description_th}
          onChange={(e) => patch({ description_th: e.target.value })}
          placeholder="อธิบายว่าโรคนี้คืออะไร สาเหตุหลัก และลักษณะทั่วไป..."
          rows={4}
          style={S.textarea}
        />
      </div>

      {/* Aliases */}
      <div style={S.section}>
        <label style={S.label}>ชื่อเรียกอื่น (Aliases)</label>
        <AliasManager
          aliases={form.aliases}
          onChange={(v) => patch({ aliases: v })}
        />
      </div>

      {/* Severity */}
      <div style={S.section}>
        <label style={S.label}>ระดับความรุนแรง *</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {SEVERITY_OPTIONS.map((s) => {
            const active = form.severity === s.value
            return (
              <button
                key={s.value}
                onClick={() => patch({ severity: s.value })}
                style={{
                  flex: 1, borderRadius: 8, padding: '7px 0', fontSize: 12, fontWeight: 600,
                  border: `1px solid ${active ? s.color : '#1e2d40'}`,
                  background: active ? `${s.color}22` : 'none',
                  color: active ? s.color : '#64748b',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Urgency */}
      <div style={S.section}>
        <label style={S.label}>ระดับความเร่งด่วน</label>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {URGENCY_OPTIONS.map((u) => {
            const active = form.urgency_level === u.value
            return (
              <button
                key={u.value}
                onClick={() => patch({ urgency_level: u.value })}
                style={{
                  borderRadius: 8, padding: '8px 12px', fontSize: 13, textAlign: 'left' as const,
                  border: `1px solid ${active ? '#14b8a6' : '#1e2d40'}`,
                  background: active ? '#14b8a622' : 'none',
                  color: active ? '#14b8a6' : '#94a3b8',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {u.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Age group + Sex */}
      <div style={{ ...S.section, ...S.grid2 }}>
        <div>
          <label style={S.label}>กลุ่มอายุ</label>
          <select
            value={form.age_group}
            onChange={(e) => patch({ age_group: e.target.value as ConditionFormData['age_group'] })}
            style={S.select}
          >
            <option value="">— เลือก —</option>
            {AGE_GROUP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={S.label}>เพศที่พบบ่อยกว่า</label>
          <select
            value={form.sex_predominant}
            onChange={(e) => patch({ sex_predominant: e.target.value as ConditionFormData['sex_predominant'] })}
            style={S.select}
          >
            <option value="">— เลือก —</option>
            {SEX_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Medical Governance */}
      <div style={{ ...S.card, border: '1px solid #134e4a', background: '#0d2b2b' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#14b8a6', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
          ⚕ Medical Governance
        </p>

        {/* Evidence level cards */}
        <div style={{ marginBottom: 12 }}>
          <label style={S.label}>ระดับหลักฐานทางการแพทย์ *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {EVIDENCE_CARDS.map((ec) => {
              const active = form.evidence_level === ec.value
              return (
                <button
                  key={ec.value}
                  onClick={() => patch({ evidence_level: ec.value })}
                  style={{
                    borderRadius: 8, padding: '8px 10px', textAlign: 'left' as const,
                    border: `1px solid ${active ? '#14b8a6' : '#1e3a3a'}`,
                    background: active ? '#14b8a622' : '#0a1f1f',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{ec.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#14b8a6' : '#94a3b8' }}>{ec.label}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{ec.sub}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Reviewer */}
        <div style={{ marginBottom: 10 }}>
          <label style={S.label}>ชื่อแพทย์ผู้ตรวจสอบ</label>
          <input
            value={form.reviewer_name}
            onChange={(e) => patch({ reviewer_name: e.target.value })}
            placeholder="เช่น พญ. สมใจ รักษ์สุขภาพ"
            style={{ ...S.input, background: '#0a1f1f', border: '1px solid #1e3a3a' }}
          />
        </div>

        {/* Disclaimer */}
        <div>
          <label style={S.label}>Disclaimer</label>
          <textarea
            value={form.disclaimer_th}
            onChange={(e) => patch({ disclaimer_th: e.target.value })}
            rows={2}
            style={{ ...S.textarea, background: '#0a1f1f', border: '1px solid #1e3a3a', minHeight: 60 }}
          />
        </div>
      </div>
    </div>
  )
}

// ── AI Panel ──────────────────────────────────────────────────

interface AiPanelProps {
  form: ConditionFormData
  autofilling: boolean
  aiResult: string | null
  aiError: string | null
  aiUsage: AIUsageStatus
  checkingFields: boolean
  missingFields: string[] | null
  onAutofill: () => void
  onCheckCompleteness: () => void
  onDismissResult: () => void
  onDismissError: () => void
  onDismissMissing: () => void
}

function AiPanel({
  form, autofilling, aiResult, aiError, aiUsage, checkingFields, missingFields,
  onAutofill, onCheckCompleteness, onDismissResult, onDismissError, onDismissMissing,
}: AiPanelProps) {
  const canAutofill = form.name_th.trim().length > 0 && !autofilling && aiUsage.remaining > 0

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} style={{ color: '#14b8a6' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>AI Assist</span>
        </div>
        <span style={{ fontSize: 11, color: aiUsage.remaining > 0 ? '#64748b' : '#ef4444' }}>
          {aiUsage.used}/{aiUsage.limit} ครั้ง
        </span>
      </div>

      {/* Autofill button */}
      <button
        onClick={onAutofill}
        disabled={!canAutofill}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          borderRadius: 8, border: 'none',
          background: canAutofill ? '#14b8a6' : '#1e2d40',
          color: canAutofill ? '#fff' : '#475569',
          padding: '9px 12px', fontSize: 12, fontWeight: 600,
          cursor: canAutofill ? 'pointer' : 'not-allowed',
          transition: 'background 0.15s',
          width: '100%',
        }}
      >
        {autofilling ? (
          <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <Sparkles size={13} />
        )}
        {autofilling ? 'กำลังเติมข้อมูล...' : '⚡ Autofill ทั้งหมด (1 call)'}
      </button>

      {!form.name_th.trim() && (
        <p style={{ fontSize: 11, color: '#475569', textAlign: 'center' as const }}>
          ใส่ชื่อภาษาไทยก่อนจึงจะใช้ AI ได้
        </p>
      )}

      {aiUsage.remaining === 0 && (
        <p style={{ fontSize: 11, color: '#ef4444', textAlign: 'center' as const }}>
          ครบ limit วันนี้แล้ว รีเซ็ตพรุ่งนี้
        </p>
      )}

      {/* Check completeness button */}
      <button
        onClick={onCheckCompleteness}
        disabled={checkingFields}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          borderRadius: 8, border: '1px solid #1e2d40', background: 'none',
          color: '#94a3b8', padding: '8px 12px', fontSize: 12, fontWeight: 500,
          cursor: 'pointer', width: '100%',
        }}
      >
        <CheckCircle2 size={13} />
        🔍 ตรวจสอบความสมบูรณ์
      </button>

      <div style={{ borderBottom: '1px solid #1e2d40' }} />

      {/* Tier note */}
      <div style={{ borderRadius: 8, background: '#0a1015', border: '1px solid #1e2d40', padding: '8px 10px' }}>
        <p style={{ fontSize: 11, color: '#64748b', marginBottom: 3, fontWeight: 600 }}>Tier 1 — ฟรี ไม่ใช้ API</p>
        <p style={{ fontSize: 10, color: '#475569' }}>ตรวจสอบความสมบูรณ์ทำงานแบบ local ไม่เรียก AI</p>
      </div>

      {/* Missing fields result */}
      {missingFields !== null && (
        <div style={{ borderRadius: 8, background: missingFields.length === 0 ? '#052e16' : '#1c0a00', border: `1px solid ${missingFields.length === 0 ? '#14532d' : '#451a03'}`, padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: missingFields.length === 0 ? '#22c55e' : '#f97316' }}>
              {missingFields.length === 0 ? '✅ ครบถ้วน!' : `⚠ ขาด ${missingFields.length} ฟิลด์`}
            </span>
            <button onClick={onDismissMissing} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
              <X size={12} />
            </button>
          </div>
          {missingFields.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {missingFields.map((f) => (
                <li key={f} style={{ fontSize: 11, color: '#f97316', padding: '1px 0' }}>• {f}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* AI result box */}
      {aiResult && (
        <div style={{ borderRadius: 8, background: '#0d2b2b', border: '1px solid #134e4a', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#14b8a6' }}>ผลลัพธ์ AI</span>
            <button onClick={onDismissResult} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
              <X size={12} />
            </button>
          </div>
          <pre style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'pre-wrap' as const, margin: 0, fontFamily: 'inherit' }}>
            {aiResult}
          </pre>
        </div>
      )}

      {/* AI error box */}
      {aiError && (
        <div style={{ borderRadius: 8, background: '#1c0a00', border: '1px solid #7c2d12', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>เกิดข้อผิดพลาด</span>
            <button onClick={onDismissError} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
              <X size={12} />
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#f87171', margin: 0 }}>{aiError}</p>
        </div>
      )}
    </div>
  )
}

// ── Page export ───────────────────────────────────────────────

export default function NewConditionPage() {
  return (
    <AdminLayout title="โรคและภาวะ — เพิ่มใหม่">
      <div style={{ height: 'calc(100vh - 3.5rem)', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
        <ConditionFormContent />
      </div>
    </AdminLayout>
  )
}
