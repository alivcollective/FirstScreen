'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ChevronRight, Save, Loader2, ChevronDown, ChevronUp, X, Plus } from 'lucide-react'
import type { BodyRegion } from '@/types/medical'

// ── Style tokens ──────────────────────────────────────────────

const S = {
  page:    { background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const },
  topBar:  { background: '#0d1626', borderBottom: '1px solid #1e2d40', padding: '0 1.25rem', height: 52, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  body:    { flex: 1, overflowY: 'auto' as const, padding: '1.75rem 1.5rem' },
  statBar: { background: '#0d1626', borderTop: '1px solid #1e2d40', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, minHeight: 40 },
  input:   { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' as const },
  select:  { width: '100%', borderRadius: 10, border: '1px solid #1e2d40', background: '#111827', padding: '0.625rem 0.875rem', fontSize: 14, color: '#e2e8f0', outline: 'none', cursor: 'pointer' },
  label:   { display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  section: { marginBottom: '1.5rem' },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  error:   { fontSize: 11, color: '#f87171', marginTop: 5 },
  hint:    { fontSize: 11, color: '#475569', marginTop: 5 },
  card:    { borderRadius: 12, border: '1px solid #1e2d40', background: '#111827', padding: '1.25rem', marginBottom: '1.5rem' },
  chip:    { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#1e2d40', color: '#94a3b8', borderRadius: 6, padding: '3px 9px', fontSize: 12 },
}

// ── Tag manager ───────────────────────────────────────────────

function TagManager({ tags, onChange }: { tags: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  function add() {
    const v = input.trim().toLowerCase()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 8 }}>
        {tags.map(t => (
          <span key={t} style={S.chip}>{t}
            <button onClick={() => onChange(tags.filter(x => x !== t))} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, lineHeight: 1 }}><X size={10} /></button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
          placeholder="เพิ่ม tag... (กด Enter)"
          style={{ ...S.input, flex: 1 }}
        />
        <button onClick={add} style={{ borderRadius: 8, background: '#1e2d40', border: 'none', color: '#94a3b8', padding: '0 10px', cursor: 'pointer' }}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

function NewBodyRegionContent() {
  const router = useRouter()

  // Form state
  const [nameTh, setNameTh]             = useState('')
  const [nameEn, setNameEn]             = useState('')
  const [slug, setSlug]                 = useState('')
  const [slugManual, setSlugManual]     = useState(false)
  const [parentId, setParentId]         = useState<string>('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [tags, setTags]                 = useState<string[]>([])
  const [coordFX, setCoordFX]           = useState<string>('')
  const [coordFY, setCoordFY]           = useState<string>('')
  const [coordBX, setCoordBX]           = useState<string>('')
  const [coordBY, setCoordBY]           = useState<string>('')
  const [coordsOpen, setCoordsOpen]     = useState(false)

  // UI state
  const [regions, setRegions]           = useState<BodyRegion[]>([])
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)
  const [dirty, setDirty]               = useState(false)
  const [errors, setErrors]             = useState<Record<string, string>>({})
  const [apiError, setApiError]         = useState('')

  // Load existing regions for parent dropdown
  useEffect(() => {
    fetch('/api/admin/body-regions')
      .then(r => r.json())
      .then(d => setRegions(d.data ?? []))
      .catch(() => {})
  }, [])

  // Auto-generate slug from name_en unless manually edited
  useEffect(() => {
    if (slugManual) return
    const generated = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setSlug(generated)
  }, [nameEn, slugManual])

  function markDirty() { setDirty(true); setSaved(false) }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!nameTh.trim()) errs.name_th = 'กรุณาใส่ชื่อภาษาไทย'
    if (!nameEn.trim()) errs.name_en = 'กรุณาใส่ชื่อภาษาอังกฤษ'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function save(redirect: boolean) {
    if (!validate() || saving) return
    setSaving(true)
    setApiError('')
    try {
      const res = await fetch('/api/admin/body-regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_th: nameTh.trim(),
          name_en: nameEn.trim(),
          slug: slug || undefined,
          parent_id: parentId || null,
          display_order: displayOrder,
          tags,
          status: 'published',
          coord_front_x: coordFX !== '' ? Number(coordFX) : null,
          coord_front_y: coordFY !== '' ? Number(coordFY) : null,
          coord_back_x:  coordBX !== '' ? Number(coordBX) : null,
          coord_back_y:  coordBY !== '' ? Number(coordBY) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error ?? `Error ${res.status}`)
        return
      }
      setDirty(false)
      if (redirect) {
        router.push('/admin/body-regions')
      } else {
        setSaved(true)
      }
    } catch {
      setApiError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Top bar */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
          <Link href="/admin/body-regions" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>ส่วนร่างกาย</Link>
          <ChevronRight size={13} style={{ color: '#475569' }} />
          <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>เพิ่มใหม่</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => save(false)}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: `1px solid ${saved ? '#134e4a' : '#1e2d40'}`, background: saved ? '#14b8a611' : 'none', color: saved ? '#14b8a6' : '#94a3b8', padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
          >
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
            {saved ? 'บันทึกแล้ว' : 'บันทึก Draft'}
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff', padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
            บันทึก
          </button>
        </div>
      </div>

      {/* Form body */}
      <div style={S.body}>
        <div style={{ maxWidth: 640 }}>

          {apiError && (
            <div style={{ borderRadius: 10, border: '1px solid #7c2d12', background: '#1c0a00', padding: '10px 14px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 13, color: '#f87171' }}>{apiError}</p>
            </div>
          )}

          {/* ── Section 1: ข้อมูลหลัก ─────────────────────── */}
          <div style={S.card}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 14, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>ข้อมูลหลัก</p>

            {/* Name row */}
            <div style={{ ...S.section, ...S.grid2 }}>
              <div>
                <label style={S.label}>ชื่อภาษาไทย *</label>
                <input value={nameTh} onChange={e => { setNameTh(e.target.value); markDirty() }} placeholder="เช่น ไหล่" style={{ ...S.input, borderColor: errors.name_th ? '#7c2d12' : '#1e2d40' }} />
                {errors.name_th && <p style={S.error}>{errors.name_th}</p>}
              </div>
              <div>
                <label style={S.label}>ชื่อภาษาอังกฤษ *</label>
                <input value={nameEn} onChange={e => { setNameEn(e.target.value); markDirty() }} placeholder="e.g. Shoulder" style={{ ...S.input, borderColor: errors.name_en ? '#7c2d12' : '#1e2d40' }} />
                {errors.name_en && <p style={S.error}>{errors.name_en}</p>}
              </div>
            </div>

            {/* Slug */}
            <div style={S.section}>
              <label style={S.label}>Slug (URL)</label>
              <input
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugManual(true); markDirty() }}
                placeholder="auto-generated"
                style={{ ...S.input, fontFamily: 'monospace', fontSize: 13 }}
              />
              {slug && (
                <p style={S.hint}>
                  Preview: <span style={{ color: '#14b8a6' }}>/body-regions/{slug}</span>
                  {slugManual && (
                    <button onClick={() => { setSlugManual(false) }} style={{ marginLeft: 8, fontSize: 10, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      รีเซ็ตเป็น auto
                    </button>
                  )}
                </p>
              )}
            </div>

            {/* Parent + display order */}
            <div style={{ ...S.section, ...S.grid2 }}>
              <div>
                <label style={S.label}>หมวดหมู่หลัก (Parent)</label>
                <select value={parentId} onChange={e => { setParentId(e.target.value); markDirty() }} style={S.select}>
                  <option value="">ไม่มี (ระดับบนสุด)</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.name_th} ({r.name_en})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={S.label}>ลำดับการแสดง</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={e => { setDisplayOrder(Number(e.target.value)); markDirty() }}
                  min={0}
                  style={S.input}
                />
                <p style={S.hint}>ตัวเลขน้อย = แสดงก่อน</p>
              </div>
            </div>
          </div>

          {/* ── Section 2: พิกัด (collapsible) ─────────────── */}
          <div style={{ borderRadius: 12, border: '1px solid #1e2d40', background: '#111827', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <button
              onClick={() => setCoordsOpen(v => !v)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em', textAlign: 'left' as const }}>พิกัดบนแผนที่ร่างกาย</p>
                <p style={{ fontSize: 11, color: '#475569', marginTop: 2, textAlign: 'left' as const }}>ใช้สำหรับ interactive body map ในอนาคต (ไม่บังคับ)</p>
              </div>
              {coordsOpen ? <ChevronUp size={16} style={{ color: '#64748b', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: '#64748b', flexShrink: 0 }} />}
            </button>

            {coordsOpen && (
              <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <div style={{ ...S.section, ...S.grid2 }}>
                  <div>
                    <label style={S.label}>ด้านหน้า — X</label>
                    <input type="number" value={coordFX} onChange={e => { setCoordFX(e.target.value); markDirty() }} placeholder="0–100" min={0} max={100} step={0.1} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>ด้านหน้า — Y</label>
                    <input type="number" value={coordFY} onChange={e => { setCoordFY(e.target.value); markDirty() }} placeholder="0–100" min={0} max={100} step={0.1} style={S.input} />
                  </div>
                </div>
                <div style={S.grid2}>
                  <div>
                    <label style={S.label}>ด้านหลัง — X</label>
                    <input type="number" value={coordBX} onChange={e => { setCoordBX(e.target.value); markDirty() }} placeholder="0–100" min={0} max={100} step={0.1} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>ด้านหลัง — Y</label>
                    <input type="number" value={coordBY} onChange={e => { setCoordBY(e.target.value); markDirty() }} placeholder="0–100" min={0} max={100} step={0.1} style={S.input} />
                  </div>
                </div>
                <p style={{ ...S.hint, marginTop: 10 }}>0–100 คือ % ของ SVG viewBox</p>
              </div>
            )}
          </div>

          {/* ── Section 3: Tags ──────────────────────────────── */}
          <div style={S.card}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 14, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Tags</p>
            <TagManager tags={tags} onChange={v => { setTags(v); markDirty() }} />
          </div>

        </div>
      </div>

      {/* Status bar */}
      <div style={S.statBar}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: dirty ? '#eab308' : '#22c55e', flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: dirty ? '#ca8a04' : '#64748b' }}>
          {dirty ? '• ยังไม่ได้บันทึก' : saved ? '✓ บันทึกแล้ว' : 'ยังไม่มีการเปลี่ยนแปลง'}
        </span>
      </div>
    </div>
  )
}

export default function NewBodyRegionPage() {
  return (
    <AdminLayout title="เพิ่มส่วนร่างกาย">
      <div style={{ height: 'calc(100vh - 3.5rem)', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
        <NewBodyRegionContent />
      </div>
    </AdminLayout>
  )
}
