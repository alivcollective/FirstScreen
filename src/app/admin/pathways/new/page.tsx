'use client'

import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Save, ChevronLeft, ChevronRight, Check, Loader2, Sparkles, X, Plus, ArrowUp, ArrowDown, Trash2, Eye, AlertCircle } from 'lucide-react'
import type { AIUsageStatus, BodyRegion, Condition } from '@/types/medical'

// ── Wizard types ──────────────────────────────────────────────

type QType = 'yes_no' | 'multiple_choice' | 'scale_1_10' | 'text'
type Urgency = 'emergency' | 'urgent' | 'routine'
type ConfidenceLevel = 'strongly_suggests' | 'supports' | 'possibly_related' | 'less_likely'
type RecommendationType = 'education' | 'self_care' | 'lifestyle' | 'exercise' | 'physiotherapy' | 'see_doctor' | 'urgent_care' | 'emergency'

interface WizardQuestion {
  id: string; question_th: string; question_en: string
  type: QType; options: string[]; red_flag_trigger: boolean; confidence_modifier: number
}
interface WizardRedFlag {
  title_th: string; description_th: string; urgency: Urgency
  action: 'call_ems' | 'go_er' | 'see_doctor_today' | 'monitor'
}
interface WizardCondition {
  id: string; name_th: string; name_en: string; confidence_level: ConfidenceLevel; display_order: number
}
interface WizardSymptom {
  id: string; name_th: string; name_en: string; is_primary: boolean
}
interface WizardRegion {
  id: string; slug: string; name_th: string; name_en: string
}
interface WizardRecommendation {
  type: RecommendationType; title_th: string; description_th: string; evidence_level: string
}
interface WizardReference {
  source_org: string; title_en: string; url: string; year: string
}

interface WizardState {
  name_th: string; name_en: string; specialty: string; description_th: string
  regions: WizardRegion[]
  symptoms: WizardSymptom[]
  questions: WizardQuestion[]
  red_flags: WizardRedFlag[]
  conditions: WizardCondition[]
  recommendations: WizardRecommendation[]
  references: WizardReference[]
  evidence_level: string; reviewer_name: string; reviewer_specialty: string; disclaimer_th: string
  id?: string; slug?: string; status: string
}

const EMPTY_STATE: WizardState = {
  name_th: '', name_en: '', specialty: 'general', description_th: '',
  regions: [], symptoms: [], questions: [], red_flags: [], conditions: [],
  recommendations: [], references: [],
  evidence_level: '', reviewer_name: '', reviewer_specialty: '',
  disclaimer_th: 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์',
  status: 'draft',
}

const LS_KEY = 'firstscreen_pathway_wizard_draft'

// ── Constants ─────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'ข้อมูลหลัก' }, { n: 2, label: 'ตำแหน่งร่างกาย' },
  { n: 3, label: 'อาการ' }, { n: 4, label: 'คำถามคัดกรอง' },
  { n: 5, label: 'สัญญาณอันตราย' }, { n: 6, label: 'สาเหตุที่เป็นไปได้' },
  { n: 7, label: 'คำแนะนำ' }, { n: 8, label: 'แหล่งอ้างอิง' },
  { n: 9, label: 'ตรวจสอบ' }, { n: 10, label: 'เผยแพร่' },
]

const SPECIALTIES = [
  { value: 'general', label: 'เวชกรรมทั่วไป' }, { value: 'internal_medicine', label: 'อายุรกรรม' },
  { value: 'cardiology', label: 'โรคหัวใจ' }, { value: 'orthopedics', label: 'ออร์โธปิดิกส์' },
  { value: 'sports_medicine', label: 'เวชศาสตร์การกีฬา' }, { value: 'rehabilitation', label: 'เวชศาสตร์ฟื้นฟู' },
  { value: 'neurology', label: 'ประสาทวิทยา' }, { value: 'emergency', label: 'เวชศาสตร์ฉุกเฉิน' },
  { value: 'psychiatry', label: 'จิตเวช' },
]

const CONFIDENCE_OPTIONS: Array<{ value: ConfidenceLevel; label: string; color: string }> = [
  { value: 'strongly_suggests', label: 'บ่งชี้อย่างชัดเจน', color: '#14b8a6' },
  { value: 'supports', label: 'สนับสนุน', color: '#22c55e' },
  { value: 'possibly_related', label: 'อาจเกี่ยวข้อง', color: '#eab308' },
  { value: 'less_likely', label: 'โอกาสน้อย', color: '#64748b' },
]

const RECOMMENDATION_TYPES: Array<{ value: RecommendationType; label: string; color: string }> = [
  { value: 'education', label: 'ให้ความรู้', color: '#8b5cf6' },
  { value: 'self_care', label: 'ดูแลตัวเอง', color: '#22c55e' },
  { value: 'lifestyle', label: 'ปรับวิถีชีวิต', color: '#14b8a6' },
  { value: 'exercise', label: 'โปรแกรมออกกำลังกาย', color: '#3b82f6' },
  { value: 'physiotherapy', label: 'กายภาพบำบัด', color: '#06b6d4' },
  { value: 'see_doctor', label: 'พบแพทย์', color: '#f59e0b' },
  { value: 'urgent_care', label: 'พบแพทย์โดยด่วน', color: '#f97316' },
  { value: 'emergency', label: 'ฉุกเฉิน', color: '#ef4444' },
]

const ACTION_LABELS: Record<WizardRedFlag['action'], string> = {
  call_ems: 'โทร 1669',
  go_er: 'ไปห้องฉุกเฉิน',
  see_doctor_today: 'พบแพทย์ภายในวันนี้',
  monitor: 'เฝ้าระวัง',
}

const SOURCE_CHIPS = ['WHO', 'USPSTF', 'NCCN', 'GRADE', 'PubMed', 'กรมการแพทย์', 'ราชวิทยาลัย']

// ── Style tokens ──────────────────────────────────────────────

const S = {
  input: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const },
  textarea: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', resize: 'vertical' as const, minHeight: 80, boxSizing: 'border-box' as const },
  select: { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', cursor: 'pointer' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  section: { marginBottom: '1.25rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#1e2d40', color: '#94a3b8', borderRadius: 6, padding: '3px 9px', fontSize: 12 },
  card: { borderRadius: 12, border: '1px solid #1e2d40', background: '#111827', padding: '1rem', marginBottom: 8 },
}

// ── Small helpers ─────────────────────────────────────────────

function calcCompleteness(s: WizardState): number {
  return (
    (s.name_th.trim() ? 10 : 0) + (s.specialty ? 10 : 0) + (s.description_th.trim() ? 10 : 0) +
    (s.questions.length > 0 ? 15 : 0) + (s.red_flags.length > 0 ? 15 : 0) +
    (s.recommendations.length > 0 ? 15 : 0) + (s.conditions.length > 0 ? 10 : 0) +
    (s.evidence_level ? 10 : 0) + (s.reviewer_name.trim() ? 5 : 0)
  )
}

function uid(): string { return `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }

// ── Step components ───────────────────────────────────────────

function Step1({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ ...S.section, ...S.grid2 }}>
        <div><label style={S.label}>ชื่อ Pathway (ไทย) *</label><input value={state.name_th} onChange={e => patch({ name_th: e.target.value })} placeholder="เช่น ประเมินอาการปวดไหล่" style={S.input} /></div>
        <div><label style={S.label}>ชื่อ Pathway (EN)</label><input value={state.name_en} onChange={e => patch({ name_en: e.target.value })} placeholder="e.g. Shoulder Pain Assessment" style={S.input} /></div>
      </div>
      <div style={S.section}>
        <label style={S.label}>ความเชี่ยวชาญ *</label>
        <select value={state.specialty} onChange={e => patch({ specialty: e.target.value })} style={S.select}>
          {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div style={S.section}>
        <label style={S.label}>คำอธิบาย</label>
        <textarea value={state.description_th} onChange={e => patch({ description_th: e.target.value })} placeholder="อธิบายว่า Pathway นี้ใช้สำหรับอะไร กลุ่มผู้ป่วยใด" rows={3} style={S.textarea} />
      </div>
      <div style={{ borderRadius: 10, border: '1px solid #134e4a', background: '#0d2b2b', padding: '12px 14px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#14b8a6', marginBottom: 6 }}>💡 แนวทางการตั้งชื่อ</p>
        <ul style={{ fontSize: 12, color: '#64748b', paddingLeft: 16 }}>
          <li>ใช้ชื่ออาการ ไม่ใช่ชื่อโรค: "ปวดไหล่" ไม่ใช่ "Shoulder Impingement"</li>
          <li>ระบุกลุ่มเป้าหมายถ้าจำเป็น: "ปวดเข่าในนักวิ่ง"</li>
        </ul>
      </div>
    </div>
  )
}

function Step2({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  const [allRegions, setAllRegions] = useState<BodyRegion[]>([])
  const [customInput, setCustomInput] = useState('')

  useEffect(() => {
    fetch('/api/kms/body-regions').then(r => r.json()).then(d => setAllRegions(d.data ?? d ?? [])).catch(() => {})
  }, [])

  function toggle(region: BodyRegion) {
    const exists = state.regions.some(r => r.id === region.id)
    if (exists) {
      patch({ regions: state.regions.filter(r => r.id !== region.id) })
    } else {
      patch({ regions: [...state.regions, { id: region.id, slug: region.slug, name_th: region.name_th, name_en: region.name_en }] })
    }
  }

  function addCustom() {
    const v = customInput.trim()
    if (!v) return
    const id = uid()
    patch({ regions: [...state.regions, { id, slug: id, name_th: v, name_en: v }] })
    setCustomInput('')
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14 }}>เลือกบริเวณร่างกายที่ Pathway นี้เกี่ยวข้อง</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 7, marginBottom: 16 }}>
        {allRegions.map(r => {
          const sel = state.regions.some(sr => sr.id === r.id)
          return (
            <button key={r.id} onClick={() => toggle(r)} style={{ borderRadius: 8, border: `1px solid ${sel ? '#14b8a6' : '#1e2d40'}`, background: sel ? '#14b8a622' : 'none', color: sel ? '#14b8a6' : '#94a3b8', padding: '5px 12px', fontSize: 13, cursor: 'pointer', fontWeight: sel ? 600 : 400, transition: 'all 0.15s' }}>
              {r.name_th}
            </button>
          )
        })}
      </div>
      {state.regions.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>เลือกแล้ว:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
            {state.regions.map(r => (
              <span key={r.id} style={S.chip}>{r.name_th}
                <button onClick={() => patch({ regions: state.regions.filter(sr => sr.id !== r.id) })} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={10} /></button>
              </span>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={customInput} onChange={e => setCustomInput(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }} placeholder="เพิ่มบริเวณเพิ่มเติม... (Enter)" style={{ ...S.input, flex: 1 }} />
        <button onClick={addCustom} style={{ borderRadius: 8, background: '#1e2d40', border: 'none', color: '#94a3b8', padding: '0 12px', cursor: 'pointer' }}><Plus size={14} /></button>
      </div>
    </div>
  )
}

function Step3({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ id: string; name_th: string; name_en: string; body_region: string }>>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setSearching(true)
    const t = setTimeout(() => {
      fetch(`/api/admin/symptoms?search=${encodeURIComponent(query)}&limit=8`)
        .then(r => r.json()).then(d => setResults(d.data ?? [])).finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  function addSymptom(s: { id: string; name_th: string; name_en: string }) {
    if (state.symptoms.some(ss => ss.id === s.id)) return
    patch({ symptoms: [...state.symptoms, { id: s.id, name_th: s.name_th, name_en: s.name_en, is_primary: state.symptoms.length === 0 }] })
    setQuery(''); setResults([])
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ ...S.section, position: 'relative' }}>
        <label style={S.label}>ค้นหาอาการ</label>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชื่ออาการ..." style={S.input} />
        {searching && <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>กำลังค้นหา...</p>}
        {results.length > 0 && (
          <div style={{ position: 'absolute', zIndex: 20, top: '100%', left: 0, right: 0, borderRadius: 10, border: '1px solid #1e2d40', background: '#0d1626', boxShadow: '0 8px 24px #00000060', overflow: 'hidden' }}>
            {results.map(r => (
              <div key={r.id} onClick={() => addSymptom(r)} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #111827', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#111827'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div><p style={{ fontSize: 13, color: '#e2e8f0' }}>{r.name_th}</p><p style={{ fontSize: 11, color: '#64748b' }}>{r.name_en}</p></div>
                {state.symptoms.some(s => s.id === r.id) ? <Check size={14} style={{ color: '#14b8a6' }} /> : <Plus size={14} style={{ color: '#64748b' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
      {state.symptoms.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>อาการที่เลือก:</p>
          {state.symptoms.map(s => (
            <div key={s.id} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
              <div><p style={{ fontSize: 13, color: '#e2e8f0' }}>{s.name_th}</p><p style={{ fontSize: 11, color: '#64748b' }}>{s.name_en}</p></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', cursor: 'pointer' }}>
                  <input type="checkbox" checked={s.is_primary} onChange={e => patch({ symptoms: state.symptoms.map(ss => ss.id === s.id ? { ...ss, is_primary: e.target.checked } : ss) })} style={{ accentColor: '#14b8a6' }} />
                  อาการหลัก
                </label>
                <button onClick={() => patch({ symptoms: state.symptoms.filter(ss => ss.id !== s.id) })} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 2 }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Step4({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  const [optInput, setOptInput] = useState<Record<string, string>>({})

  function addQ() {
    patch({ questions: [...state.questions, { id: uid(), question_th: '', question_en: '', type: 'yes_no', options: [], red_flag_trigger: false, confidence_modifier: 0 }] })
  }

  function upd(id: string, u: Partial<WizardQuestion>) {
    patch({ questions: state.questions.map(q => q.id === id ? { ...q, ...u } : q) })
  }

  function moveQ(id: string, dir: -1 | 1) {
    const i = state.questions.findIndex(q => q.id === id)
    if (i + dir < 0 || i + dir >= state.questions.length) return
    const next = [...state.questions]
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    patch({ questions: next })
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div><p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>คำถามคัดกรอง</p><p style={{ fontSize: 12, color: '#475569' }}>ถามเพื่อประเมินอาการเพิ่มเติมและหา Red Flags</p></div>
        <button onClick={addQ} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, background: '#14b8a6', border: 'none', color: '#fff', padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Plus size={13} /> เพิ่มคำถาม</button>
      </div>
      {state.questions.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '2.5rem', border: '1px dashed #1e2d40', borderRadius: 12, color: '#475569' }}>
          <p>คลิก "+ เพิ่มคำถาม" เพื่อสร้างคำถามคัดกรอง</p>
        </div>
      ) : state.questions.map((q, i) => (
        <div key={q.id} style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>คำถาม {i + 1}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => moveQ(q.id, -1)} disabled={i === 0} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 5, padding: '2px 5px', color: i === 0 ? '#1e2d40' : '#64748b', cursor: i === 0 ? 'not-allowed' : 'pointer' }}><ArrowUp size={11} /></button>
              <button onClick={() => moveQ(q.id, 1)} disabled={i === state.questions.length - 1} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 5, padding: '2px 5px', color: i === state.questions.length - 1 ? '#1e2d40' : '#64748b', cursor: i === state.questions.length - 1 ? 'not-allowed' : 'pointer' }}><ArrowDown size={11} /></button>
              <button onClick={() => patch({ questions: state.questions.filter(x => x.id !== q.id) })} style={{ background: 'none', border: '1px solid #450a0a', borderRadius: 5, padding: '2px 5px', color: '#f87171', cursor: 'pointer' }}><Trash2 size={11} /></button>
            </div>
          </div>
          <div style={{ ...S.section, ...S.grid2 }}>
            <div><label style={S.label}>คำถาม (ไทย)</label><input value={q.question_th} onChange={e => upd(q.id, { question_th: e.target.value })} style={S.input} /></div>
            <div><label style={S.label}>คำถาม (EN)</label><input value={q.question_en} onChange={e => upd(q.id, { question_en: e.target.value })} style={S.input} /></div>
          </div>
          <div style={{ ...S.section, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const }}>
            <div style={{ flex: '0 0 160px' }}>
              <label style={S.label}>ประเภท</label>
              <select value={q.type} onChange={e => upd(q.id, { type: e.target.value as QType })} style={{ ...S.select, fontSize: 12, padding: '5px 8px' }}>
                {[{ value: 'yes_no', label: 'ใช่/ไม่ใช่' }, { value: 'multiple_choice', label: 'หลายตัวเลือก' }, { value: 'scale_1_10', label: 'ระดับ 1-10' }, { value: 'text', label: 'ข้อความ' }].map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: q.red_flag_trigger ? '#f87171' : '#94a3b8', cursor: 'pointer', marginTop: 16 }}>
              <input type="checkbox" checked={q.red_flag_trigger} onChange={e => upd(q.id, { red_flag_trigger: e.target.checked })} style={{ accentColor: '#ef4444' }} />
              🚨 Red Flag Trigger
            </label>
          </div>
          {q.type === 'multiple_choice' && (
            <div>
              <label style={S.label}>ตัวเลือก</label>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 6 }}>
                {q.options.map(o => <span key={o} style={S.chip}>{o}<button onClick={() => upd(q.id, { options: q.options.filter(x => x !== o) })} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={10} /></button></span>)}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={optInput[q.id] ?? ''} onChange={e => setOptInput(p => ({ ...p, [q.id]: e.target.value }))} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { const v = (optInput[q.id] ?? '').trim(); if (v) { upd(q.id, { options: [...q.options, v] }); setOptInput(p => ({ ...p, [q.id]: '' })) }; e.preventDefault() } }} placeholder="เพิ่มตัวเลือก..." style={{ ...S.input, flex: 1, fontSize: 12 }} />
                <button onClick={() => { const v = (optInput[q.id] ?? '').trim(); if (v) { upd(q.id, { options: [...q.options, v] }); setOptInput(p => ({ ...p, [q.id]: '' })) } }} style={{ borderRadius: 8, background: '#1e2d40', border: 'none', color: '#94a3b8', padding: '0 8px', cursor: 'pointer' }}><Plus size={13} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Step5({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  const [form, setForm] = useState<Partial<WizardRedFlag>>({ urgency: 'emergency', action: 'go_er' })

  function addFlag() {
    if (!form.title_th?.trim()) return
    patch({ red_flags: [...state.red_flags, { title_th: form.title_th!, description_th: form.description_th ?? '', urgency: form.urgency ?? 'emergency', action: form.action ?? 'go_er' }] })
    setForm({ urgency: 'emergency', action: 'go_er' })
  }

  const PRESETS = [
    { title_th: 'ปวดหน้าอกรุนแรง', description_th: 'อาจบ่งชี้กล้ามเนื้อหัวใจขาดเลือด', urgency: 'emergency' as Urgency, action: 'call_ems' as const },
    { title_th: 'หมดสติ', description_th: 'ผู้ป่วยหมดสติโดยไม่ทราบสาเหตุ', urgency: 'emergency' as Urgency, action: 'call_ems' as const },
    { title_th: 'อ่อนแรงครึ่งซีก', description_th: 'อาจบ่งชี้ stroke', urgency: 'emergency' as Urgency, action: 'go_er' as const },
    { title_th: 'หายใจลำบาก', description_th: 'หายใจเร็วหรือลำบากอย่างรุนแรง', urgency: 'urgent' as Urgency, action: 'go_er' as const },
  ]

  const URGENCY_LABELS: Record<Urgency, string> = { emergency: '🚨 ฉุกเฉิน', urgent: '⚠ ด่วน', routine: '📋 ปกติ' }

  return (
    <div style={{ maxWidth: 640 }}>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Preset Red Flags:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 16 }}>
        {PRESETS.map(p => (
          <button key={p.title_th} onClick={() => { if (!state.red_flags.some(f => f.title_th === p.title_th)) patch({ red_flags: [...state.red_flags, p] }) }} style={{ borderRadius: 7, border: '1px solid #1e2d40', background: state.red_flags.some(f => f.title_th === p.title_th) ? '#14b8a622' : 'none', color: state.red_flags.some(f => f.title_th === p.title_th) ? '#14b8a6' : '#94a3b8', padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
            {p.title_th}
          </button>
        ))}
      </div>

      {/* Existing flags */}
      {state.red_flags.map((f, i) => (
        <div key={i} style={{ ...S.card, border: '1px solid #450a0a', background: '#1c0a00' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>{f.title_th}</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{f.description_th}</p>
              <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                <span style={{ fontSize: 10, background: '#450a0a', color: '#f87171', borderRadius: 5, padding: '1px 7px', fontWeight: 600 }}>{URGENCY_LABELS[f.urgency]}</span>
                <span style={{ fontSize: 10, background: '#1e2d40', color: '#94a3b8', borderRadius: 5, padding: '1px 7px' }}>{ACTION_LABELS[f.action]}</span>
              </div>
            </div>
            <button onClick={() => patch({ red_flags: state.red_flags.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2, flexShrink: 0 }}><Trash2 size={13} /></button>
          </div>
        </div>
      ))}

      {/* Add custom */}
      <div style={{ ...S.card, border: '1px dashed #1e2d40', background: 'transparent' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 10 }}>เพิ่มสัญญาณอันตรายเอง</p>
        <div style={{ ...S.section, ...S.grid2 }}>
          <div><label style={S.label}>ชื่อสัญญาณ *</label><input value={form.title_th ?? ''} onChange={e => setForm(p => ({ ...p, title_th: e.target.value }))} placeholder="เช่น ปวดศีรษะรุนแรงทันที" style={S.input} /></div>
          <div><label style={S.label}>ระดับความเร่งด่วน</label>
            <select value={form.urgency ?? 'emergency'} onChange={e => setForm(p => ({ ...p, urgency: e.target.value as Urgency }))} style={S.select}>
              <option value="emergency">ฉุกเฉิน</option><option value="urgent">ด่วน</option><option value="routine">ปกติ</option>
            </select>
          </div>
        </div>
        <div style={{ ...S.section, ...S.grid2 }}>
          <div><label style={S.label}>คำอธิบาย</label><input value={form.description_th ?? ''} onChange={e => setForm(p => ({ ...p, description_th: e.target.value }))} style={S.input} /></div>
          <div><label style={S.label}>การดำเนินการ</label>
            <select value={form.action ?? 'go_er'} onChange={e => setForm(p => ({ ...p, action: e.target.value as WizardRedFlag['action'] }))} style={S.select}>
              {Object.entries(ACTION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <button onClick={addFlag} disabled={!form.title_th?.trim()} style={{ borderRadius: 8, background: form.title_th?.trim() ? '#14b8a6' : '#1e2d40', border: 'none', color: form.title_th?.trim() ? '#fff' : '#475569', padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: form.title_th?.trim() ? 'pointer' : 'not-allowed' }}>
          + เพิ่ม Red Flag
        </button>
      </div>
    </div>
  )
}

function Step6({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Condition[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setSearching(true)
    const t = setTimeout(() => {
      fetch(`/api/admin/conditions?search=${encodeURIComponent(query)}&limit=8`)
        .then(r => r.json()).then(d => setResults(d.data ?? [])).finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  function addCondition(c: Condition) {
    if (state.conditions.some(sc => sc.id === c.id)) return
    patch({ conditions: [...state.conditions, { id: c.id, name_th: c.name_th, name_en: c.name_en, confidence_level: 'supports', display_order: state.conditions.length }] })
    setQuery(''); setResults([])
  }

  function updConf(id: string, confidence_level: ConfidenceLevel) {
    patch({ conditions: state.conditions.map(c => c.id === id ? { ...c, confidence_level } : c) })
  }

  function moveC(id: string, dir: -1 | 1) {
    const i = state.conditions.findIndex(c => c.id === id)
    if (i + dir < 0 || i + dir >= state.conditions.length) return
    const next = [...state.conditions]
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    patch({ conditions: next.map((c, j) => ({ ...c, display_order: j })) })
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ ...S.section, position: 'relative' }}>
        <label style={S.label}>ค้นหาโรค/ภาวะ</label>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชื่อโรค หรือ ICD-11..." style={S.input} />
        {searching && <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>กำลังค้นหา...</p>}
        {results.length > 0 && (
          <div style={{ position: 'absolute', zIndex: 20, top: '100%', left: 0, right: 0, borderRadius: 10, border: '1px solid #1e2d40', background: '#0d1626', boxShadow: '0 8px 24px #00000060', overflow: 'hidden' }}>
            {results.map(c => (
              <div key={c.id} onClick={() => addCondition(c)} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #111827', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#111827'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div><p style={{ fontSize: 13, color: '#e2e8f0' }}>{c.name_th}</p><p style={{ fontSize: 11, color: '#64748b' }}>{c.icd11_code} · {c.name_en}</p></div>
                {state.conditions.some(sc => sc.id === c.id) ? <Check size={14} style={{ color: '#14b8a6' }} /> : <Plus size={14} style={{ color: '#64748b' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
      {state.conditions.length > 0 && (
        <div>
          {state.conditions.map((c, i) => {
            const cfg = CONFIDENCE_OPTIONS.find(o => o.value === c.confidence_level)
            return (
              <div key={c.id} style={{ ...S.card }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>{c.name_th}</p>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                      {CONFIDENCE_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => updConf(c.id, opt.value)} style={{ borderRadius: 6, border: `1px solid ${c.confidence_level === opt.value ? opt.color : '#1e2d40'}`, background: c.confidence_level === opt.value ? `${opt.color}22` : 'none', color: c.confidence_level === opt.value ? opt.color : '#64748b', fontSize: 11, padding: '2px 8px', cursor: 'pointer', fontWeight: c.confidence_level === opt.value ? 600 : 400 }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3 }}>
                    <button onClick={() => moveC(c.id, -1)} disabled={i === 0} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 4, padding: '2px 4px', color: i === 0 ? '#1e2d40' : '#64748b', cursor: i === 0 ? 'not-allowed' : 'pointer' }}><ArrowUp size={10} /></button>
                    <button onClick={() => moveC(c.id, 1)} disabled={i === state.conditions.length - 1} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 4, padding: '2px 4px', color: i === state.conditions.length - 1 ? '#1e2d40' : '#64748b', cursor: i === state.conditions.length - 1 ? 'not-allowed' : 'pointer' }}><ArrowDown size={10} /></button>
                    <button onClick={() => patch({ conditions: state.conditions.filter(x => x.id !== c.id) })} style={{ background: 'none', border: '1px solid #450a0a', borderRadius: 4, padding: '2px 4px', color: '#f87171', cursor: 'pointer' }}><Trash2 size={10} /></button>
                  </div>
                </div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, background: `${cfg?.color ?? '#64748b'}18`, color: cfg?.color ?? '#64748b', borderRadius: 5, padding: '1px 7px', fontWeight: 600 }}>{cfg?.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Step7({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  function addRec(type: RecommendationType) {
    patch({ recommendations: [...state.recommendations, { type, title_th: '', description_th: '', evidence_level: 'moderate' }] })
  }

  function updRec(i: number, u: Partial<WizardRecommendation>) {
    patch({ recommendations: state.recommendations.map((r, j) => j === i ? { ...r, ...u } : r) })
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>คลิกเพื่อเพิ่มประเภทคำแนะนำ:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 7 }}>
          {RECOMMENDATION_TYPES.map(rt => (
            <button key={rt.value} onClick={() => addRec(rt.value)} style={{ borderRadius: 7, border: `1px solid ${rt.color}44`, background: `${rt.color}11`, color: rt.color, fontSize: 12, padding: '4px 12px', cursor: 'pointer', fontWeight: 500 }}>
              + {rt.label}
            </button>
          ))}
        </div>
      </div>
      {state.recommendations.map((r, i) => {
        const rtCfg = RECOMMENDATION_TYPES.find(x => x.value === r.type)
        return (
          <div key={i} style={{ ...S.card, border: `1px solid ${rtCfg?.color ?? '#1e2d40'}44` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: rtCfg?.color ?? '#64748b', background: `${rtCfg?.color ?? '#64748b'}18`, borderRadius: 5, padding: '2px 8px' }}>{rtCfg?.label ?? r.type}</span>
              <button onClick={() => patch({ recommendations: state.recommendations.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0 }}><Trash2 size={13} /></button>
            </div>
            <div style={S.section}><label style={S.label}>ชื่อคำแนะนำ</label><input value={r.title_th} onChange={e => updRec(i, { title_th: e.target.value })} style={S.input} /></div>
            <div style={S.section}><label style={S.label}>รายละเอียด</label><textarea value={r.description_th} onChange={e => updRec(i, { description_th: e.target.value })} rows={2} style={S.textarea} /></div>
            <div><label style={S.label}>ระดับหลักฐาน</label>
              <select value={r.evidence_level} onChange={e => updRec(i, { evidence_level: e.target.value })} style={{ ...S.select, width: 'auto', fontSize: 12, padding: '4px 8px' }}>
                <option value="high">สูง</option><option value="moderate">ปานกลาง</option><option value="low">ต่ำ</option><option value="expert_opinion">ความเห็นผู้เชี่ยวชาญ</option>
              </select>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Step8({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  const [form, setForm] = useState<WizardReference>({ source_org: '', title_en: '', url: '', year: '' })

  function addRef() {
    if (!form.source_org.trim() && !form.title_en.trim()) return
    patch({ references: [...state.references, { ...form }] })
    setForm({ source_org: '', title_en: '', url: '', year: '' })
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>เลือก Source ด่วน:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 16 }}>
        {SOURCE_CHIPS.map(s => (
          <button key={s} onClick={() => setForm(p => ({ ...p, source_org: s }))} style={{ borderRadius: 6, border: `1px solid ${form.source_org === s ? '#14b8a6' : '#1e2d40'}`, background: form.source_org === s ? '#14b8a622' : 'none', color: form.source_org === s ? '#14b8a6' : '#94a3b8', fontSize: 12, padding: '3px 10px', cursor: 'pointer' }}>
            {s}
          </button>
        ))}
      </div>
      {state.references.map((r, i) => (
        <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
          <div><p style={{ fontSize: 13, color: '#e2e8f0' }}>{r.title_en || r.source_org}</p><p style={{ fontSize: 11, color: '#64748b' }}>{r.source_org}{r.year ? ` · ${r.year}` : ''}</p></div>
          <button onClick={() => patch({ references: state.references.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 2 }}><Trash2 size={13} /></button>
        </div>
      ))}
      <div style={{ ...S.card, border: '1px dashed #1e2d40', background: 'transparent' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 10 }}>+ เพิ่มแหล่งอ้างอิง</p>
        <div style={{ ...S.section, ...S.grid2 }}>
          <div><label style={S.label}>Source</label><input value={form.source_org} onChange={e => setForm(p => ({ ...p, source_org: e.target.value }))} style={S.input} /></div>
          <div><label style={S.label}>ปีที่พิมพ์</label><input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="เช่น 2023" style={S.input} /></div>
        </div>
        <div style={S.section}><label style={S.label}>ชื่อเอกสาร / Guideline</label><input value={form.title_en} onChange={e => setForm(p => ({ ...p, title_en: e.target.value }))} style={S.input} /></div>
        <div style={S.section}><label style={S.label}>URL / DOI</label><input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." style={S.input} /></div>
        <button onClick={addRef} style={{ borderRadius: 8, background: '#14b8a6', border: 'none', color: '#fff', padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ เพิ่มแหล่งอ้างอิง</button>
      </div>
    </div>
  )
}

function Step9({ state, patch }: { state: WizardState; patch: (u: Partial<WizardState>) => void }) {
  const pct = calcCompleteness(state)
  const checks = [
    { label: 'ชื่อ Pathway', ok: !!state.name_th.trim() },
    { label: 'ความเชี่ยวชาญ', ok: !!state.specialty },
    { label: 'คำอธิบาย', ok: !!state.description_th.trim() },
    { label: 'คำถามคัดกรอง', ok: state.questions.length > 0 },
    { label: 'สัญญาณอันตราย', ok: state.red_flags.length > 0 },
    { label: 'ภาวะที่เป็นไปได้', ok: state.conditions.length > 0 },
    { label: 'คำแนะนำ', ok: state.recommendations.length > 0 },
    { label: 'ระดับหลักฐาน', ok: !!state.evidence_level },
    { label: 'ชื่อผู้ตรวจสอบ', ok: !!state.reviewer_name.trim() },
  ]

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ ...S.section, ...S.grid2 }}>
        <div><label style={S.label}>ชื่อแพทย์ผู้ตรวจสอบ</label><input value={state.reviewer_name} onChange={e => patch({ reviewer_name: e.target.value })} placeholder="เช่น พญ. สมใจ ..." style={S.input} /></div>
        <div><label style={S.label}>ความเชี่ยวชาญ</label><input value={state.reviewer_specialty} onChange={e => patch({ reviewer_specialty: e.target.value })} placeholder="เช่น ออร์โธปิดิกส์" style={S.input} /></div>
      </div>
      <div style={S.section}>
        <label style={S.label}>ระดับหลักฐาน</label>
        <select value={state.evidence_level} onChange={e => patch({ evidence_level: e.target.value })} style={S.select}>
          <option value="">— เลือก —</option>
          <option value="high">สูง (Systematic Review / RCT)</option>
          <option value="moderate">ปานกลาง (Cohort)</option>
          <option value="low">ต่ำ (Case Series)</option>
          <option value="expert_opinion">ความเห็นผู้เชี่ยวชาญ</option>
        </select>
      </div>
      <div style={S.section}>
        <label style={S.label}>Disclaimer</label>
        <textarea value={state.disclaimer_th} onChange={e => patch({ disclaimer_th: e.target.value })} rows={2} style={S.textarea} />
      </div>
      <div style={{ borderRadius: 12, border: '1px solid #1e2d40', background: '#111827', padding: '1rem', marginTop: 4 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Completeness Checklist</p>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid #0a0f1a' }}>
            <span style={{ fontSize: 14 }}>{c.ok ? '✅' : '❌'}</span>
            <span style={{ fontSize: 12, color: c.ok ? '#94a3b8' : '#64748b' }}>{c.label}</span>
          </div>
        ))}
        {pct >= 90 && (
          <div style={{ marginTop: 12, borderRadius: 8, border: '1px solid #14532d', background: '#052e16', padding: '10px 12px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>✅ พร้อมเผยแพร่ ({pct}%)</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Step10({ state, onPublish, onDraft, publishing }: { state: WizardState; onPublish: () => void; onDraft: () => void; publishing: boolean }) {
  const pct = calcCompleteness(state)
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ borderRadius: 16, border: '1px solid #1e2d40', background: '#111827', padding: '1.5rem', marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>สรุป Pathway</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{state.name_th || '(ยังไม่มีชื่อ)'}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#94a3b8' }}>
          <span>สาขา: {state.specialty}</span>
          <span>คำถาม: {state.questions.length} ข้อ</span>
          <span>Red Flags: {state.red_flags.length}</span>
          <span>ภาวะ: {state.conditions.length}</span>
          <span>คำแนะนำ: {state.recommendations.length}</span>
          <span>ความสมบูรณ์: {pct}%</span>
        </div>
        {state.disclaimer_th && (
          <div style={{ marginTop: 12, borderRadius: 8, border: '1px solid #1e2d40', background: '#0a1015', padding: '8px 12px' }}>
            <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 3 }}>DISCLAIMER</p>
            <p style={{ fontSize: 11, color: '#475569' }}>{state.disclaimer_th}</p>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onDraft} style={{ flex: 1, borderRadius: 10, border: '1px solid #1e2d40', background: 'none', color: '#94a3b8', padding: '10px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          💾 บันทึกร่าง
        </button>
        <button onClick={onPublish} disabled={pct < 60 || publishing} style={{ flex: 2, borderRadius: 10, border: 'none', background: pct >= 60 ? '#14b8a6' : '#1e2d40', color: pct >= 60 ? '#fff' : '#475569', padding: '10px', fontSize: 14, fontWeight: 700, cursor: pct >= 60 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {publishing ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          {pct < 60 ? `ต้องการ 60%+ (ปัจจุบัน ${pct}%)` : '🚀 เผยแพร่ Pathway'}
        </button>
      </div>
    </div>
  )
}

// ── AI Panel ──────────────────────────────────────────────────

function AiPanel({ state, step, aiUsage, autofilling, aiResult, aiError, onAutofill, onDismissResult, onDismissError }: {
  state: WizardState; step: number; aiUsage: AIUsageStatus
  autofilling: boolean; aiResult: string | null; aiError: string | null
  onAutofill: () => void; onDismissResult: () => void; onDismissError: () => void
}) {
  const canAutofill = !!state.name_th.trim() && !autofilling && aiUsage.remaining > 0
  const stepHints: Record<number, string> = {
    1: '⚡ Autofill ทั้งหมด (1 call)',
    4: '💡 แนะนำคำถามคัดกรอง',
    5: '🚨 แนะนำ Red Flags',
    6: '🔍 แนะนำ Differential Dx',
  }

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={14} style={{ color: '#14b8a6' }} /><span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>AI Assist</span></div>
        <span style={{ fontSize: 11, color: aiUsage.remaining > 0 ? '#64748b' : '#ef4444' }}>{aiUsage.used}/{aiUsage.limit}</span>
      </div>
      <button onClick={onAutofill} disabled={!canAutofill} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 8, border: 'none', background: canAutofill ? '#14b8a6' : '#1e2d40', color: canAutofill ? '#fff' : '#475569', padding: '9px 12px', fontSize: 12, fontWeight: 600, cursor: canAutofill ? 'pointer' : 'not-allowed', width: '100%' }}>
        {autofilling ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} />}
        {autofilling ? 'กำลัง...' : (stepHints[step] ?? '⚡ Autofill (1 call)')}
      </button>
      <div style={{ borderBottom: '1px solid #1e2d40' }} />
      <div style={{ borderRadius: 8, background: '#0a1015', border: '1px solid #1e2d40', padding: '8px 10px' }}>
        <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 1 }}>ขั้นตอน {step}/10</p>
        <div style={{ height: 4, background: '#1e2d40', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${step * 10}%`, background: '#14b8a6', borderRadius: 99 }} />
        </div>
      </div>
      {aiResult && (
        <div style={{ borderRadius: 8, background: '#0d2b2b', border: '1px solid #134e4a', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#14b8a6' }}>ผล AI</span>
            <button onClick={onDismissResult} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
          </div>
          <pre style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'pre-wrap' as const, margin: 0 }}>{aiResult}</pre>
        </div>
      )}
      {aiError && (
        <div style={{ borderRadius: 8, background: '#1c0a00', border: '1px solid #7c2d12', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>ข้อผิดพลาด</span>
            <button onClick={onDismissError} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
          </div>
          <p style={{ fontSize: 11, color: '#f87171', margin: 0 }}>{aiError}</p>
        </div>
      )}
    </div>
  )
}

// ── Main wizard ───────────────────────────────────────────────

function PathwayWizardContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>(EMPTY_STATE)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [aiUsage, setAiUsage] = useState<AIUsageStatus>({ used: 0, limit: 10, remaining: 10, resets_at: '' })
  const [autofilling, setAutofilling] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) setState(prev => ({ ...prev, ...JSON.parse(saved) }))
    } catch {}
    fetch('/api/admin/ai/autofill-pathway').then(r => r.json()).then(d => { if (d.usage) setAiUsage(d.usage) }).catch(() => {})
  }, [])

  // Auto-save to localStorage on state change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  function patch(updates: Partial<WizardState>) {
    setState(prev => ({ ...prev, ...updates }))
  }

  const pct = calcCompleteness(state)
  const barColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#14b8a6' : '#eab308'

  async function saveDraft() {
    setSaving(true)
    try {
      const body = {
        name_th: state.name_th, name_en: state.name_en, specialty: state.specialty,
        description_th: state.description_th, evidence_level: state.evidence_level,
        reviewer_name: state.reviewer_name, disclaimer_th: state.disclaimer_th,
        screening_questions: state.questions.map(q => ({
          id: q.id, question_th: q.question_th, question_en: q.question_en,
          type: q.type, options: q.options, red_flag_trigger: q.red_flag_trigger,
          confidence_modifier: q.confidence_modifier,
        })),
        red_flags: state.red_flags,
        recommendations: state.recommendations.map(r => ({ ...r, evidence_level: r.evidence_level as 'high' | 'moderate' | 'low' | 'expert_opinion' })),
      }

      if (state.id) {
        await fetch(`/api/admin/pathways/${state.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      } else {
        const res = await fetch('/api/admin/pathways', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) {
          const d = await res.json()
          patch({ id: d.id, slug: d.slug })
        }
      }
    } catch {}
    finally { setSaving(false) }
  }

  async function handlePublish() {
    setPublishing(true)
    try {
      await saveDraft()
      if (!state.id) return
      const res = await fetch(`/api/admin/pathways/${state.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'published', evidence_level: state.evidence_level, reviewer_name: state.reviewer_name }) })
      if (res.ok) { localStorage.removeItem(LS_KEY); router.push('/admin/pathways') }
    } catch {} finally { setPublishing(false) }
  }

  async function handleAutofill() {
    if (!state.name_th.trim() || autofilling) return
    setAutofilling(true); setAiError(null); setAiResult(null)
    try {
      const res = await fetch('/api/admin/ai/autofill-pathway', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name_th: state.name_th, specialty: state.specialty }),
      })
      const data = await res.json()
      if (!res.ok) { setAiError(data.error ?? 'Error'); return }
      if (data.usage) setAiUsage(data.usage)
      const r = data.result
      const updates: Partial<WizardState> = {
        name_en: r.name_en || state.name_en,
        description_th: r.description_th || state.description_th,
        evidence_level: r.evidence_level || state.evidence_level,
      }
      if (r.screening_questions?.length && step >= 4) {
        updates.questions = r.screening_questions.map((q: Record<string, unknown>) => ({ id: uid(), question_th: q.question_th as string, question_en: q.question_en as string, type: (q.type as QType) ?? 'yes_no', options: (q.options as string[]) ?? [], red_flag_trigger: Boolean(q.red_flag_trigger), confidence_modifier: 0 }))
      }
      if (r.red_flags?.length && step >= 5) {
        updates.red_flags = r.red_flags.map((f: Record<string, unknown>) => ({ title_th: f.title_th as string, description_th: f.description_th as string, urgency: (f.urgency as Urgency) ?? 'urgent', action: (f.action as WizardRedFlag['action']) ?? 'see_doctor_today' }))
      }
      if (r.recommendations?.length && step >= 7) {
        updates.recommendations = r.recommendations.map((rc: Record<string, unknown>) => ({ type: (rc.type as RecommendationType) ?? 'self_care', title_th: rc.title_th as string, description_th: rc.description_th as string, evidence_level: (rc.evidence_level as string) ?? 'moderate' }))
      }
      patch(updates)
      setAiResult(`✅ เติมข้อมูลสำเร็จ\n• EN: ${r.name_en}\n• คำถาม: ${r.screening_questions?.length ?? 0}\n• Red Flags: ${r.red_flags?.length ?? 0}\n• คำแนะนำ: ${r.recommendations?.length ?? 0}`)
    } catch { setAiError('ไม่สามารถเชื่อมต่อ AI ได้') }
    finally { setAutofilling(false) }
  }

  const stepComponents: Record<number, React.ReactElement> = {
    1: <Step1 state={state} patch={patch} />,
    2: <Step2 state={state} patch={patch} />,
    3: <Step3 state={state} patch={patch} />,
    4: <Step4 state={state} patch={patch} />,
    5: <Step5 state={state} patch={patch} />,
    6: <Step6 state={state} patch={patch} />,
    7: <Step7 state={state} patch={patch} />,
    8: <Step8 state={state} patch={patch} />,
    9: <Step9 state={state} patch={patch} />,
    10: <Step10 state={state} onPublish={handlePublish} onDraft={saveDraft} publishing={publishing} />,
  }

  return (
    <div style={{ background: '#0a0f1a', height: '100%', display: 'flex', flexDirection: 'column' as const }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* Step progress */}
      <div style={{ background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0.75rem 1.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto' as const }}>
          {STEPS.map((s, i) => {
            const done = step > s.n; const active = step === s.n
            return (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => { if (s.n <= step) setStep(s.n) }} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: s.n <= step ? 'pointer' : 'default', padding: '2px 4px' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: active ? '#14b8a6' : done ? '#134e4a' : '#1e2d40', color: active ? '#fff' : done ? '#2dd4bf' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                    {done ? <Check size={11} /> : s.n}
                  </div>
                  <span style={{ fontSize: 9, color: active ? '#14b8a6' : done ? '#64748b' : '#475569', whiteSpace: 'nowrap' as const }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: step > s.n ? '#134e4a' : '#1e2d40', margin: '0 1px', marginBottom: 12 }} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' as const, minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '1.5rem' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{STEPS[step - 1]?.label}</p>
          <p style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>ขั้นตอน {step} จาก {STEPS.length}</p>
          {stepComponents[step]}
        </div>
        <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid #1e2d40', background: '#0d1626', overflowY: 'auto' as const }}>
          <AiPanel state={state} step={step} aiUsage={aiUsage} autofilling={autofilling} aiResult={aiResult} aiError={aiError} onAutofill={handleAutofill} onDismissResult={() => setAiResult(null)} onDismissError={() => setAiError(null)} />
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ background: '#0d1626', borderTop: '1px solid #1e2d40', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: '1px solid #1e2d40', background: 'none', color: step === 1 ? '#1e2d40' : '#94a3b8', padding: '7px 14px', fontSize: 13, cursor: step === 1 ? 'not-allowed' : 'pointer' }}>
          <ChevronLeft size={14} /> ย้อนกลับ
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={saveDraft} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: '1px solid #1e2d40', background: 'none', color: '#94a3b8', padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />} บันทึกร่าง
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: barColor }}>
            <div style={{ width: 50, height: 5, background: '#1e2d40', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 99 }} />
            </div>
            {pct}%
          </div>
        </div>

        {step < 10 ? (
          <button onClick={() => setStep(s => Math.min(10, s + 1))} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff', padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ถัดไป <ChevronRight size={14} />
          </button>
        ) : (
          <button onClick={handlePublish} disabled={pct < 60 || publishing} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: 'none', background: pct >= 60 ? '#14b8a6' : '#1e2d40', color: pct >= 60 ? '#fff' : '#475569', padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: pct >= 60 ? 'pointer' : 'not-allowed' }}>
            {publishing ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null} เผยแพร่
          </button>
        )}
      </div>
    </div>
  )
}

export default function NewPathwayPage() {
  return (
    <AdminLayout title="สร้าง Clinical Pathway">
      <div style={{ height: 'calc(100vh - 3.5rem)', overflow: 'hidden' }}>
        <PathwayWizardContent />
      </div>
    </AdminLayout>
  )
}
