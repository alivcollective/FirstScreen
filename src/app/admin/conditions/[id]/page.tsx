'use client'

import { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatusBadge, SeverityBadge } from '@/components/admin/StatusBadge'
import {
  ChevronRight, Save, Send, Loader2, Sparkles, CheckCircle2,
  X, Plus, AlertCircle, Search, ArrowRight, Trash2,
} from 'lucide-react'
import type {
  Condition, ConditionFormData, ContentStatus, AIUsageStatus,
  Symptom, ConditionSymptom, MedicalEvidenceLevel, AgeGroup, SexPredominant,
} from '@/types/medical'

// ── Constants (shared with new/page.tsx) ─────────────────────

const TABS = ['ข้อมูลหลัก', 'อาการที่เกี่ยวข้อง', 'ส่วนร่างกาย', 'Pathways', 'Red Flags', 'References']

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
  { value: 1, label: '1 — ตรวจตามนัด' },
  { value: 2, label: '2 — พบแพทย์ภายในไม่กี่สัปดาห์' },
  { value: 3, label: '3 — ด่วน 24–48 ชั่วโมง' },
  { value: 4, label: '4 — ฉุกเฉิน ไปห้องฉุกเฉินเดี๋ยวนี้' },
] as const

const EVIDENCE_CARDS = [
  { value: 'high', label: 'ระดับสูง', sub: 'Systematic Review / RCT', icon: '★★★' },
  { value: 'moderate', label: 'ระดับปานกลาง', sub: 'Cohort / Case-Control', icon: '★★' },
  { value: 'low', label: 'ระดับต่ำ', sub: 'Case Series / Observational', icon: '★' },
  { value: 'expert_opinion', label: 'ความเห็นผู้เชี่ยวชาญ', sub: 'Expert Consensus', icon: '⚕' },
] as const

const FREQUENCY_OPTIONS = [
  { value: 'very_common', label: 'พบบ่อยมาก (>50%)' },
  { value: 'common', label: 'พบบ่อย (20–50%)' },
  { value: 'uncommon', label: 'พบได้บ้าง (5–20%)' },
  { value: 'rare', label: 'พบน้อย (<5%)' },
]

const STATUS_WORKFLOW: Array<{ status: ContentStatus; label: string }> = [
  { status: 'draft', label: 'Draft' },
  { status: 'pending_review', label: 'รอตรวจสอบ' },
  { status: 'approved', label: 'อนุมัติ' },
  { status: 'published', label: 'เผยแพร่' },
]

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: '#64748b', pending_review: '#f59e0b', needs_revision: '#ef4444',
  approved: '#22c55e', published: '#14b8a6', archived: '#6b7280',
}

// ── Local completeness ────────────────────────────────────────

function calcCompleteness(form: ConditionFormData): number {
  const checks: Array<[() => boolean, number]> = [
    [() => !!form.name_th.trim(), 25],
    [() => !!form.name_en.trim(), 10],
    [() => !!form.icd11_code.trim(), 10],
    [() => !!form.description_th.trim(), 20],
    [() => !!form.severity, 10],
    [() => form.urgency_level !== null, 5],
    [() => !!form.age_group, 5],
    [() => !!form.evidence_level, 10],
    [() => !!form.reviewer_name.trim(), 5],
  ]
  return checks.reduce((s, [fn, w]) => s + (fn() ? w : 0), 0)
}

function getMissingFields(form: ConditionFormData): string[] {
  const missing: string[] = []
  if (!form.name_th.trim()) missing.push('ชื่อภาษาไทย')
  if (!form.name_en.trim()) missing.push('ชื่อภาษาอังกฤษ')
  if (!form.icd11_code.trim()) missing.push('รหัส ICD-11')
  if (!form.description_th.trim()) missing.push('คำอธิบาย')
  if (!form.severity) missing.push('ระดับความรุนแรง')
  if (form.urgency_level === null) missing.push('ระดับความเร่งด่วน')
  if (!form.age_group) missing.push('กลุ่มอายุ')
  if (!form.evidence_level) missing.push('ระดับหลักฐาน')
  if (!form.reviewer_name.trim()) missing.push('ชื่อผู้ตรวจสอบ')
  return missing
}

function relativeTime(iso: string | null): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'เมื่อกี้'
  if (mins < 60) return `${mins} นาทีที่แล้ว`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`
  return `${Math.floor(hrs / 24)} วันที่แล้ว`
}

// ── Style tokens ──────────────────────────────────────────────

const S = {
  page: { background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const },
  topBar: { background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0 1.25rem', height: 52, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  tabBar: { background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0 1.25rem', display: 'flex', gap: 4, flexShrink: 0 },
  body: { flex: 1, display: 'flex', overflow: 'hidden' as const, minHeight: 0 },
  main: { flex: 1, overflowY: 'auto' as const, padding: '1.5rem' },
  aside: { width: 270, flexShrink: 0, borderLeft: '1px solid #1e2d40', display: 'flex', flexDirection: 'column' as const, background: '#0d1626', overflowY: 'auto' as const },
  statusBar: { background: '#0d1626', borderTop: '1px solid #1e2d40', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, minHeight: 44 },
  input: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const },
  textarea: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', resize: 'vertical' as const, minHeight: 100, boxSizing: 'border-box' as const },
  select: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', cursor: 'pointer' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  section: { marginBottom: '1.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#1e2d40', color: '#94a3b8', borderRadius: 6, padding: '2px 8px', fontSize: 12 },
}

// ── Alias manager ─────────────────────────────────────────────

function AliasManager({ aliases, onChange }: { aliases: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  function add() {
    const val = input.trim()
    if (val && !aliases.includes(val)) onChange([...aliases, val])
    setInput('')
  }
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 8 }}>
        {aliases.map(a => (
          <span key={a} style={S.chip}>
            {a}
            <button onClick={() => onChange(aliases.filter(x => x !== a))} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={10} /></button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="เพิ่มชื่อเรียกอื่น... (กด Enter)" style={{ ...S.input, flex: 1 }} />
        <button onClick={add} style={{ borderRadius: 8, background: '#1e2d40', border: 'none', color: '#94a3b8', padding: '0 10px', cursor: 'pointer' }}><Plus size={14} /></button>
      </div>
    </div>
  )
}

// ── Tab placeholder ───────────────────────────────────────────

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

// ── Tab 0: ข้อมูลหลัก ────────────────────────────────────────

function Tab0Main({ form, patch }: { form: ConditionFormData; patch: (u: Partial<ConditionFormData>) => void }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ ...S.section, ...S.grid2 }}>
        <div>
          <label style={S.label}>ชื่อภาษาไทย *</label>
          <input value={form.name_th} onChange={e => patch({ name_th: e.target.value })} placeholder="เช่น เบาหวานชนิดที่ 2" style={S.input} />
        </div>
        <div>
          <label style={S.label}>ชื่อภาษาอังกฤษ</label>
          <input value={form.name_en} onChange={e => patch({ name_en: e.target.value })} placeholder="e.g. Type 2 Diabetes" style={S.input} />
        </div>
      </div>
      <div style={{ ...S.section, ...S.grid2 }}>
        <div>
          <label style={S.label}>รหัส ICD-11</label>
          <input value={form.icd11_code} onChange={e => patch({ icd11_code: e.target.value })} placeholder="เช่น 5A11" style={S.input} />
        </div>
        <div>
          <label style={S.label}>ความเชี่ยวชาญ</label>
          <select value={form.specialty} onChange={e => patch({ specialty: e.target.value })} style={S.select}>
            {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div style={S.section}>
        <label style={S.label}>คำอธิบายภาษาไทย *</label>
        <textarea value={form.description_th} onChange={e => patch({ description_th: e.target.value })} rows={4} style={S.textarea} />
      </div>
      <div style={S.section}>
        <label style={S.label}>ชื่อเรียกอื่น (Aliases)</label>
        <AliasManager aliases={form.aliases} onChange={v => patch({ aliases: v })} />
      </div>
      <div style={S.section}>
        <label style={S.label}>ระดับความรุนแรง *</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {SEVERITY_OPTIONS.map(s => {
            const active = form.severity === s.value
            return (
              <button key={s.value} onClick={() => patch({ severity: s.value })} style={{ flex: 1, borderRadius: 8, padding: '7px 0', fontSize: 12, fontWeight: 600, border: `1px solid ${active ? s.color : '#1e2d40'}`, background: active ? `${s.color}22` : 'none', color: active ? s.color : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}>
                {s.label}
              </button>
            )
          })}
        </div>
      </div>
      <div style={S.section}>
        <label style={S.label}>ระดับความเร่งด่วน</label>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {URGENCY_OPTIONS.map(u => {
            const active = form.urgency_level === u.value
            return (
              <button key={u.value} onClick={() => patch({ urgency_level: u.value })} style={{ borderRadius: 8, padding: '8px 12px', fontSize: 13, textAlign: 'left' as const, border: `1px solid ${active ? '#14b8a6' : '#1e2d40'}`, background: active ? '#14b8a622' : 'none', color: active ? '#14b8a6' : '#94a3b8', cursor: 'pointer', transition: 'all 0.15s' }}>
                {u.label}
              </button>
            )
          })}
        </div>
      </div>
      <div style={{ ...S.section, ...S.grid2 }}>
        <div>
          <label style={S.label}>กลุ่มอายุ</label>
          <select value={form.age_group} onChange={e => patch({ age_group: e.target.value as AgeGroup | '' })} style={S.select}>
            <option value="">— เลือก —</option>
            {[['all','ทุกวัย'],['child','เด็ก'],['teen','วัยรุ่น'],['adult','ผู้ใหญ่'],['elderly','ผู้สูงอายุ']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>เพศที่พบบ่อยกว่า</label>
          <select value={form.sex_predominant} onChange={e => patch({ sex_predominant: e.target.value as SexPredominant | '' })} style={S.select}>
            <option value="">— เลือก —</option>
            {[['all','ทุกเพศ'],['male','ชายมากกว่า'],['female','หญิงมากกว่า']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      {/* Medical Governance */}
      <div style={{ borderRadius: 12, border: '1px solid #134e4a', background: '#0d2b2b', padding: '1rem' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#14b8a6', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>⚕ Medical Governance</p>
        <div style={{ marginBottom: 12 }}>
          <label style={S.label}>ระดับหลักฐาน *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {EVIDENCE_CARDS.map(ec => {
              const active = form.evidence_level === ec.value
              return (
                <button key={ec.value} onClick={() => patch({ evidence_level: ec.value as MedicalEvidenceLevel })} style={{ borderRadius: 8, padding: '8px 10px', textAlign: 'left' as const, border: `1px solid ${active ? '#14b8a6' : '#1e3a3a'}`, background: active ? '#14b8a622' : '#0a1f1f', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{ec.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#14b8a6' : '#94a3b8' }}>{ec.label}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{ec.sub}</div>
                </button>
              )
            })}
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={S.label}>ชื่อแพทย์ผู้ตรวจสอบ</label>
          <input value={form.reviewer_name} onChange={e => patch({ reviewer_name: e.target.value })} placeholder="เช่น พญ. สมใจ รักษ์สุขภาพ" style={{ ...S.input, background: '#0a1f1f', border: '1px solid #1e3a3a' }} />
        </div>
        <div>
          <label style={S.label}>Disclaimer</label>
          <textarea value={form.disclaimer_th} onChange={e => patch({ disclaimer_th: e.target.value })} rows={2} style={{ ...S.textarea, background: '#0a1f1f', border: '1px solid #1e3a3a', minHeight: 60 }} />
        </div>
      </div>
    </div>
  )
}

// ── Tab 1: อาการที่เกี่ยวข้อง ────────────────────────────────

interface LinkedSymptom {
  symptom_id: string
  is_primary: boolean
  frequency: string
  symptom: Symptom
}

function Tab1Symptoms({ conditionId }: { conditionId: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [searchResults, setSearchResults] = useState<Symptom[]>([])
  const [searching, setSearching] = useState(false)
  const [linked, setLinked] = useState<LinkedSymptom[]>([])
  const [loadingLinked, setLoadingLinked] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  // Load already-linked symptoms
  useEffect(() => {
    setLoadingLinked(true)
    fetch(`/api/admin/conditions/${conditionId}/symptoms`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => {
        const rows = (d.data ?? []).map((row: Record<string, unknown>) => ({
          symptom_id: row.symptom_id as string,
          is_primary: Boolean(row.is_primary),
          frequency: (row.frequency as string) || 'common',
          symptom: row.symptom as Symptom,
        }))
        setLinked(rows)
      })
      .finally(() => setLoadingLinked(false))
  }, [conditionId])

  // Search symptoms
  useEffect(() => {
    if (!debouncedQ.trim()) { setSearchResults([]); return }
    setSearching(true)
    fetch(`/api/admin/symptoms?search=${encodeURIComponent(debouncedQ)}&limit=10`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => setSearchResults(d.data ?? []))
      .finally(() => setSearching(false))
  }, [debouncedQ])

  function addSymptom(symptom: Symptom) {
    if (linked.some(l => l.symptom_id === symptom.id)) return
    setLinked(prev => [...prev, { symptom_id: symptom.id, is_primary: false, frequency: 'common', symptom }])
    setSearchQuery('')
    setSearchResults([])
    setSaved(false)
  }

  function removeSymptom(id: string) {
    setLinked(prev => prev.filter(l => l.symptom_id !== id))
    setSaved(false)
  }

  function updateLinked(symptom_id: string, updates: Partial<LinkedSymptom>) {
    setLinked(prev => prev.map(l => l.symptom_id === symptom_id ? { ...l, ...updates } : l))
    setSaved(false)
  }

  async function saveSymptoms() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/conditions/${conditionId}/symptoms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: linked.map(l => ({
            symptom_id: l.symptom_id,
            is_primary: l.is_primary,
            frequency: l.frequency,
          })),
        }),
      })
      if (res.ok) setSaved(true)
    } catch {}
    finally { setSaving(false) }
  }

  const BODY_REGION_COLORS: Record<string, string> = {
    head: '#8b5cf6', chest: '#0ea5e9', abdomen: '#f97316',
    back: '#22c55e', limbs: '#ec4899', skin: '#a78bfa',
    general: '#64748b',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, height: '100%' }}>
      {/* Left: Search */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>ค้นหาอาการเพื่อเพิ่ม</p>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่ออาการ..."
            style={{ ...S.input, paddingLeft: 30 }}
          />
        </div>
        {searching && <p style={{ fontSize: 12, color: '#475569' }}>กำลังค้นหา...</p>}
        {searchResults.length > 0 && (
          <div style={{ borderRadius: 10, border: '1px solid #1e2d40', overflow: 'hidden' }}>
            {searchResults.map(s => (
              <div
                key={s.id}
                onClick={() => addSymptom(s)}
                style={{ padding: '10px 12px', borderBottom: '1px solid #111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: linked.some(l => l.symptom_id === s.id) ? '#111827' : 'transparent', transition: 'background 0.1s' }}
                onMouseEnter={e => { if (!linked.some(l => l.symptom_id === s.id)) (e.currentTarget as HTMLDivElement).style.background = '#111827' }}
                onMouseLeave={e => { if (!linked.some(l => l.symptom_id === s.id)) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <div>
                  <p style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 2 }}>{s.name_th}</p>
                  <p style={{ fontSize: 11, color: '#64748b' }}>{s.name_en}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, background: `${BODY_REGION_COLORS[s.body_region] ?? '#64748b'}22`, color: BODY_REGION_COLORS[s.body_region] ?? '#64748b', borderRadius: 5, padding: '1px 6px' }}>
                    {s.body_region}
                  </span>
                  {linked.some(l => l.symptom_id === s.id)
                    ? <CheckCircle2 size={14} style={{ color: '#14b8a6' }} />
                    : <Plus size={14} style={{ color: '#64748b' }} />
                  }
                </div>
              </div>
            ))}
          </div>
        )}
        {debouncedQ && !searching && searchResults.length === 0 && (
          <p style={{ fontSize: 12, color: '#475569', textAlign: 'center' as const, padding: '1rem' }}>ไม่พบอาการที่ค้นหา</p>
        )}
      </div>

      {/* Right: Linked symptoms */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
            อาการที่เชื่อมแล้ว
            {linked.length > 0 && <span style={{ marginLeft: 6, fontSize: 11, background: '#1e2d40', color: '#64748b', borderRadius: 99, padding: '1px 6px' }}>{linked.length}</span>}
          </p>
          <button
            onClick={saveSymptoms}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: 'none', background: saved ? '#14b8a622' : '#14b8a6', color: saved ? '#14b8a6' : '#fff', padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
            {saved ? 'บันทึกแล้ว' : 'บันทึก'}
          </button>
        </div>

        {loadingLinked ? (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 64, borderRadius: 10, background: '#111827', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
          </div>
        ) : linked.length === 0 ? (
          <div style={{ textAlign: 'center' as const, padding: '2rem', color: '#475569', fontSize: 13 }}>
            ยังไม่มีอาการ — ค้นหาและคลิกเพื่อเพิ่ม
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
            {linked.map(l => (
              <div key={l.symptom_id} style={{ borderRadius: 10, border: `1px solid ${l.is_primary ? '#134e4a' : '#1e2d40'}`, background: l.is_primary ? '#0d2b2b' : '#111827', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{l.symptom?.name_th ?? '—'}</p>
                    <p style={{ fontSize: 11, color: '#64748b' }}>{l.symptom?.name_en}</p>
                  </div>
                  <button onClick={() => removeSymptom(l.symptom_id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 2 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={l.is_primary}
                      onChange={e => updateLinked(l.symptom_id, { is_primary: e.target.checked })}
                      style={{ accentColor: '#14b8a6' }}
                    />
                    อาการหลัก
                  </label>
                  <select
                    value={l.frequency}
                    onChange={e => updateLinked(l.symptom_id, { frequency: e.target.value })}
                    style={{ ...S.select, fontSize: 11, padding: '3px 6px', flex: 1 }}
                  >
                    {FREQUENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Status Workflow Stepper ───────────────────────────────────

function StatusStepper({
  currentStatus,
  onAdvance,
  advancing,
}: {
  currentStatus: ContentStatus
  onAdvance: (next: ContentStatus) => void
  advancing: boolean
}) {
  const stepIndex = STATUS_WORKFLOW.findIndex(s => s.status === currentStatus)
  const nextStep = stepIndex >= 0 && stepIndex < STATUS_WORKFLOW.length - 1
    ? STATUS_WORKFLOW[stepIndex + 1]
    : null

  return (
    <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #1e2d40', background: '#0a1015', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, overflowX: 'auto' as const }}>
      <span style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>สถานะ:</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {STATUS_WORKFLOW.map((step, i) => {
          const idx = STATUS_WORKFLOW.findIndex(s => s.status === currentStatus)
          const done = i < idx
          const active = i === idx
          const color = active ? STATUS_COLORS[step.status] : done ? '#134e4a' : '#1e2d40'
          const textColor = active ? STATUS_COLORS[step.status] : done ? '#2dd4bf' : '#475569'
          return (
            <div key={step.status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 99, border: `1px solid ${color}`, padding: '3px 10px', background: active ? `${color}18` : 'transparent' }}>
                {done && <CheckCircle2 size={11} style={{ color: '#2dd4bf' }} />}
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: textColor, whiteSpace: 'nowrap' as const }}>{step.label}</span>
              </div>
              {i < STATUS_WORKFLOW.length - 1 && (
                <ArrowRight size={11} style={{ color: '#1e2d40', flexShrink: 0 }} />
              )}
            </div>
          )
        })}
      </div>
      {nextStep && (
        <button
          onClick={() => onAdvance(nextStep.status)}
          disabled={advancing}
          style={{ marginLeft: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff', padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: advancing ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' as const }}
        >
          {advancing ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={12} />}
          ขั้นต่อไป: {nextStep.label}
        </button>
      )}
    </div>
  )
}

// ── AI Panel ──────────────────────────────────────────────────

function AiPanel({
  form, conditionId, autofilling, aiResult, aiError, aiUsage,
  checkingFields, missingFields, suggestingSymptoms, symptomSuggestions,
  onAutofill, onSuggestSymptoms, onAddSuggestedSymptom,
  onCheckCompleteness, onDismissResult, onDismissError, onDismissMissing, onDismissSuggestions,
}: {
  form: ConditionFormData
  conditionId: string
  autofilling: boolean
  aiResult: string | null
  aiError: string | null
  aiUsage: AIUsageStatus
  checkingFields: boolean
  missingFields: string[] | null
  suggestingSymptoms: boolean
  symptomSuggestions: string[]
  onAutofill: () => void
  onSuggestSymptoms: () => void
  onAddSuggestedSymptom: (name: string) => void
  onCheckCompleteness: () => void
  onDismissResult: () => void
  onDismissError: () => void
  onDismissMissing: () => void
  onDismissSuggestions: () => void
}) {
  const canAutofill = !!form.name_th.trim() && !autofilling && aiUsage.remaining > 0

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} style={{ color: '#14b8a6' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>AI Assist</span>
        </div>
        <span style={{ fontSize: 11, color: aiUsage.remaining > 0 ? '#64748b' : '#ef4444' }}>
          {aiUsage.used}/{aiUsage.limit} ครั้ง
        </span>
      </div>

      {/* Autofill */}
      <button
        onClick={onAutofill}
        disabled={!canAutofill}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 8, border: 'none', background: canAutofill ? '#14b8a6' : '#1e2d40', color: canAutofill ? '#fff' : '#475569', padding: '9px 12px', fontSize: 12, fontWeight: 600, cursor: canAutofill ? 'pointer' : 'not-allowed', width: '100%' }}
      >
        {autofilling ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} />}
        {autofilling ? 'กำลังเติมข้อมูล...' : '⚡ Autofill ทั้งหมด (1 call)'}
      </button>

      {/* Suggest missing symptoms */}
      <button
        onClick={onSuggestSymptoms}
        disabled={!form.name_th.trim() || suggestingSymptoms || aiUsage.remaining <= 0}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 8, border: '1px solid #1e2d40', background: 'none', color: '#94a3b8', padding: '8px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', width: '100%' }}
      >
        {suggestingSymptoms ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : '🔄'}
        แนะนำอาการที่ขาด (1 call)
      </button>

      {/* Check completeness */}
      <button
        onClick={onCheckCompleteness}
        disabled={checkingFields}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 8, border: '1px solid #1e2d40', background: 'none', color: '#94a3b8', padding: '8px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', width: '100%' }}
      >
        <CheckCircle2 size={13} /> 🔍 ตรวจสอบความสมบูรณ์
      </button>

      <div style={{ borderBottom: '1px solid #1e2d40' }} />
      <div style={{ borderRadius: 8, background: '#0a1015', border: '1px solid #1e2d40', padding: '8px 10px' }}>
        <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>Tier 1 — ฟรี ไม่ใช้ API</p>
        <p style={{ fontSize: 10, color: '#475569' }}>ตรวจสอบความสมบูรณ์ทำงานแบบ local</p>
      </div>

      {/* Missing fields */}
      {missingFields !== null && (
        <div style={{ borderRadius: 8, background: missingFields.length === 0 ? '#052e16' : '#1c0a00', border: `1px solid ${missingFields.length === 0 ? '#14532d' : '#451a03'}`, padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: missingFields.length === 0 ? '#22c55e' : '#f97316' }}>
              {missingFields.length === 0 ? '✅ ครบถ้วน!' : `⚠ ขาด ${missingFields.length} ฟิลด์`}
            </span>
            <button onClick={onDismissMissing} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
          </div>
          {missingFields.map(f => <p key={f} style={{ fontSize: 11, color: '#f97316', margin: '1px 0' }}>• {f}</p>)}
        </div>
      )}

      {/* Symptom suggestions */}
      {symptomSuggestions.length > 0 && (
        <div style={{ borderRadius: 8, background: '#0d1626', border: '1px solid #1e2d40', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#14b8a6' }}>อาการแนะนำ</span>
            <button onClick={onDismissSuggestions} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
            {symptomSuggestions.map(s => (
              <button key={s} onClick={() => onAddSuggestedSymptom(s)} style={{ borderRadius: 6, border: '1px solid #1e2d40', background: '#111827', color: '#94a3b8', fontSize: 11, padding: '3px 8px', cursor: 'pointer' }}>
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI result */}
      {aiResult && (
        <div style={{ borderRadius: 8, background: '#0d2b2b', border: '1px solid #134e4a', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#14b8a6' }}>ผลลัพธ์ AI</span>
            <button onClick={onDismissResult} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
          </div>
          <pre style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'pre-wrap' as const, margin: 0, fontFamily: 'inherit' }}>{aiResult}</pre>
        </div>
      )}

      {/* AI error */}
      {aiError && (
        <div style={{ borderRadius: 8, background: '#1c0a00', border: '1px solid #7c2d12', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>เกิดข้อผิดพลาด</span>
            <button onClick={onDismissError} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
          </div>
          <p style={{ fontSize: 11, color: '#f87171', margin: 0 }}>{aiError}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Edit Form ────────────────────────────────────────────

function EditConditionContent({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [condition, setCondition] = useState<Condition | null>(null)
  const [form, setForm] = useState<ConditionFormData | null>(null)
  const [status, setStatus] = useState<ContentStatus>('draft')
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [autofilling, setAutofilling] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiUsage, setAiUsage] = useState<AIUsageStatus>({ used: 0, limit: 10, remaining: 10, resets_at: '' })
  const [checkingFields, setCheckingFields] = useState(false)
  const [missingFields, setMissingFields] = useState<string[] | null>(null)
  const [suggestingSymptoms, setSuggestingSymptoms] = useState(false)
  const [symptomSuggestions, setSymptomSuggestions] = useState<string[]>([])

  // Load condition
  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/conditions/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        setCondition(data)
        setStatus(data.status ?? 'draft')
        setForm({
          name_th: data.name_th ?? '',
          name_en: data.name_en ?? '',
          icd11_code: data.icd11_code ?? '',
          specialty: data.specialty_required ?? 'general',
          category: data.category ?? 'other',
          severity: data.severity ?? '',
          urgency_level: data.urgency_level ?? null,
          description_th: data.description_th ?? '',
          aliases: data.aliases ?? [],
          tags: data.tags ?? [],
          age_group: data.age_group ?? '',
          sex_predominant: data.sex_predominant ?? '',
          evidence_level: data.evidence_level ?? '',
          reviewer_name: data.reviewer_name ?? '',
          disclaimer_th: data.disclaimer_th ?? 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น',
        })
      })
      .finally(() => setLoading(false))

    // Load AI usage
    fetch('/api/admin/ai/autofill-condition')
      .then(r => r.json()).then(d => { if (d.usage) setAiUsage(d.usage) }).catch(() => {})
  }, [id])

  function patch(updates: Partial<ConditionFormData>) {
    setForm(prev => prev ? { ...prev, ...updates } : prev)
    setSaved(false)
  }

  const completeness = form ? form.name_th.trim().length > 0 ? Math.max(1, Math.round(
    (!!form.name_th.trim() ? 25 : 0) +
    (!!form.name_en.trim() ? 10 : 0) +
    (!!form.icd11_code.trim() ? 10 : 0) +
    (!!form.description_th.trim() ? 20 : 0) +
    (!!form.severity ? 10 : 0) +
    (form.urgency_level !== null ? 5 : 0) +
    (!!form.age_group ? 5 : 0) +
    (!!form.evidence_level ? 10 : 0) +
    (!!form.reviewer_name.trim() ? 5 : 0)
  )) : 0 : 0
  const canSubmit = completeness >= 60
  const barColor = completeness >= 80 ? '#22c55e' : completeness >= 50 ? '#14b8a6' : '#eab308'

  async function handleSave() {
    if (!form || saving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/conditions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      })
      if (res.ok) setSaved(true)
    } catch {} finally { setSaving(false) }
  }

  async function handleSubmit() {
    if (!form || !canSubmit || saving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/conditions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'pending_review' }),
      })
      if (res.ok) { setStatus('pending_review'); setSaved(true) }
    } catch {} finally { setSaving(false) }
  }

  async function handleAdvanceStatus(next: ContentStatus) {
    if (advancing) return
    setAdvancing(true)
    try {
      const res = await fetch(`/api/admin/conditions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) {
        setStatus(next)
      } else {
        const data = await res.json()
        setAiError(data.error ?? 'ไม่สามารถเปลี่ยนสถานะได้')
      }
    } catch {} finally { setAdvancing(false) }
  }

  async function handleAutofill() {
    if (!form || autofilling) return
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
      if (!res.ok) { setAiError(data.error ?? `Error ${res.status}`); return }
      if (data.usage) setAiUsage(data.usage)
      const result = data.result
      patch({
        name_en: result.name_en || form.name_en,
        description_th: result.description_th || form.description_th,
        icd11_code: result.icd11_suggestion || form.icd11_code,
        aliases: result.aliases?.length ? result.aliases : form.aliases,
        age_group: (result.age_group as ConditionFormData['age_group']) || form.age_group,
        sex_predominant: (result.sex_predominant as ConditionFormData['sex_predominant']) || form.sex_predominant,
        evidence_level: (result.evidence_level as ConditionFormData['evidence_level']) || form.evidence_level,
      })
      setAiResult(`✅ เติมข้อมูลสำเร็จ\n• EN: ${result.name_en}\n• ICD-11: ${result.icd11_suggestion ?? '—'}\n• อาการ: ${result.symptoms?.slice(0, 3).join(', ')}`)
    } catch { setAiError('ไม่สามารถเชื่อมต่อ AI ได้') }
    finally { setAutofilling(false) }
  }

  async function handleSuggestSymptoms() {
    if (!form) return
    setSuggestingSymptoms(true)
    try {
      const res = await fetch('/api/admin/ai/autofill-condition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name_th: form.name_th }),
      })
      const data = await res.json()
      if (data.usage) setAiUsage(data.usage)
      if (data.result?.symptoms?.length) {
        setSymptomSuggestions(data.result.symptoms)
      }
    } catch {} finally { setSuggestingSymptoms(false) }
  }

  function handleCheckCompleteness() {
    if (!form) return
    setCheckingFields(true)
    setMissingFields(getMissingFields(form))
    setTimeout(() => setCheckingFields(false), 500)
  }

  if (loading || !form) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 3.5rem)', background: '#0a0f1a' }}>
        <Loader2 size={24} style={{ color: '#14b8a6', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (!condition) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 3.5rem)', background: '#0a0f1a', gap: 12 }}>
        <AlertCircle size={36} style={{ color: '#475569' }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>ไม่พบข้อมูลโรคนี้</p>
        <Link href="/admin/conditions" style={{ color: '#14b8a6', fontSize: 13 }}>← กลับรายการ</Link>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Top bar */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
          <Link href="/admin/conditions" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>โรคและภาวะ</Link>
          <ChevronRight size={13} style={{ color: '#475569' }} />
          <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
            {condition.name_th}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[status], display: 'inline-block', flexShrink: 0 }} />
          <StatusBadge status={status} size="sm" />
          {condition.updated_at && (
            <span style={{ fontSize: 11, color: '#475569' }}>แก้ไข {relativeTime(condition.updated_at)}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: `1px solid ${saved ? '#134e4a' : '#1e2d40'}`, background: saved ? '#14b8a611' : 'none', color: saved ? '#14b8a6' : '#94a3b8', padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {saved ? 'บันทึกแล้ว' : 'บันทึก'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: 'none', background: canSubmit ? '#14b8a6' : '#1e2d40', color: canSubmit ? '#fff' : '#475569', padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
          >
            <Send size={13} />
            ส่งตรวจสอบ
          </button>
        </div>
      </div>

      {/* Status workflow stepper */}
      <StatusStepper currentStatus={status} onAdvance={handleAdvanceStatus} advancing={advancing} />

      {/* Tab bar */}
      <div style={S.tabBar}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{ padding: '0.625rem 0.875rem', fontSize: 13, fontWeight: activeTab === i ? 600 : 400, color: activeTab === i ? '#14b8a6' : '#64748b', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: activeTab === i ? '2px solid #14b8a6' : '2px solid transparent', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap' as const }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={S.body}>
        <div style={S.main}>
          {activeTab === 0 && <Tab0Main form={form} patch={patch} />}
          {activeTab === 1 && <Tab1Symptoms conditionId={id} />}
          {activeTab > 1 && <TabPlaceholder name={TABS[activeTab]} />}
        </div>

        <aside style={S.aside}>
          <AiPanel
            form={form}
            conditionId={id}
            autofilling={autofilling}
            aiResult={aiResult}
            aiError={aiError}
            aiUsage={aiUsage}
            checkingFields={checkingFields}
            missingFields={missingFields}
            suggestingSymptoms={suggestingSymptoms}
            symptomSuggestions={symptomSuggestions}
            onAutofill={handleAutofill}
            onSuggestSymptoms={handleSuggestSymptoms}
            onAddSuggestedSymptom={name => { setSymptomSuggestions(prev => prev.filter(s => s !== name)) }}
            onCheckCompleteness={handleCheckCompleteness}
            onDismissResult={() => setAiResult(null)}
            onDismissError={() => setAiError(null)}
            onDismissMissing={() => setMissingFields(null)}
            onDismissSuggestions={() => setSymptomSuggestions([])}
          />
        </aside>
      </div>

      {/* Status bar */}
      <div style={S.statusBar}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: barColor, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>ความสมบูรณ์</span>
        <div style={{ flex: 1, height: 6, background: '#1e2d40', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completeness}%`, background: barColor, borderRadius: 99, transition: 'width 0.3s ease, background 0.3s ease' }} />
        </div>
        <span style={{ fontSize: 12, color: barColor, fontWeight: 600, minWidth: 32, textAlign: 'right' as const }}>{completeness}%</span>
        {!canSubmit && <span style={{ fontSize: 11, color: '#64748b' }}>ต้องการ 60%+ เพื่อส่งตรวจสอบ</span>}
      </div>
    </div>
  )
}

// ── Page export ───────────────────────────────────────────────

export default function EditConditionPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <AdminLayout title="แก้ไขโรค/ภาวะ">
      <div style={{ height: 'calc(100vh - 3.5rem)', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
        <EditConditionContent id={id} />
      </div>
    </AdminLayout>
  )
}
