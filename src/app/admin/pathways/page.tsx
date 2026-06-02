'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Search, MapPin, Activity, MessageSquare, Stethoscope, Calendar } from 'lucide-react'
import type { ClinicalPathway } from '@/types/medical'

// ── Constants ─────────────────────────────────────────────────

const STATUS_TABS = [
  { key: 'all',            label: 'ทั้งหมด' },
  { key: 'draft',          label: 'Draft' },
  { key: 'pending_review', label: 'รอตรวจสอบ' },
  { key: 'approved',       label: 'อนุมัติ' },
  { key: 'published',      label: 'เผยแพร่' },
]

const SPECIALTY_FILTERS = [
  { value: '', label: 'ทุกสาขา' },
  { value: 'general', label: 'เวชศาสตร์ทั่วไป' },
  { value: 'internal_medicine', label: 'อายุรศาสตร์' },
  { value: 'cardiology', label: 'อายุรศาสตร์โรคหัวใจ' },
  { value: 'orthopedics', label: 'ออร์โธปิดิกส์' },
  { value: 'sports_medicine', label: 'เวชศาสตร์การกีฬา' },
  { value: 'rehabilitation', label: 'เวชศาสตร์ฟื้นฟู' },
  { value: 'neurology', label: 'ประสาทวิทยา' },
  { value: 'emergency', label: 'เวชศาสตร์ฉุกเฉิน' },
]

const EVIDENCE_COLORS: Record<string, string> = {
  high: '#22c55e', moderate: '#d97706', low: '#64748b', expert_opinion: '#8b5cf6',
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'วันนี้'
  if (days < 30) return `${days} วันที่แล้ว`
  return `${Math.floor(days / 30)} เดือนที่แล้ว`
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, border: '1px solid #1e2d40', background: '#111827', padding: '1.25rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: 20, width: '70%', background: '#1e2d40', borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 13, width: '40%', background: '#1e2d40', borderRadius: 4, marginBottom: 12 }} />
      <div style={{ height: 12, width: '90%', background: '#1e2d40', borderRadius: 4, marginBottom: 4 }} />
      <div style={{ height: 12, width: '60%', background: '#1e2d40', borderRadius: 4 }} />
    </div>
  )
}

// ── Pathway Card ──────────────────────────────────────────────

function PathwayCard({ pathway }: { pathway: ClinicalPathway & { _region_count?: number; _symptom_count?: number; _condition_count?: number } }) {
  const evidenceColor = EVIDENCE_COLORS[pathway.evidence_level ?? ''] ?? '#64748b'

  return (
    <div style={{ borderRadius: 16, border: '1px solid #1e2d40', background: '#111827', padding: '1.25rem', display: 'flex', flexDirection: 'column' as const, gap: 10, transition: 'border-color 0.15s' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#2d4a6e'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#1e2d40'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
            {pathway.name_th}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {pathway.specialty && (
              <span style={{ fontSize: 11, color: '#64748b', background: '#1e2d40', borderRadius: 5, padding: '1px 7px' }}>
                {pathway.specialty}
              </span>
            )}
            {pathway.evidence_level && (
              <span style={{ fontSize: 10, color: evidenceColor, background: `${evidenceColor}18`, borderRadius: 5, padding: '1px 6px', fontWeight: 600 }}>
                {pathway.evidence_level}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={pathway.status} size="sm" />
      </div>

      {/* Description */}
      {pathway.description_th && (
        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {pathway.description_th}
        </p>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#64748b' }}>
        {(pathway._region_count ?? 0) > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} /> {pathway._region_count} บริเวณ
          </span>
        )}
        {(pathway._symptom_count ?? 0) > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Activity size={10} /> {pathway._symptom_count} อาการ
          </span>
        )}
        {(pathway._condition_count ?? 0) > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Stethoscope size={10} /> {pathway._condition_count} ภาวะ
          </span>
        )}
        {Array.isArray(pathway.screening_questions) && pathway.screening_questions.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MessageSquare size={10} /> {pathway.screening_questions.length} คำถาม
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #1e2d40' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569' }}>
          <Calendar size={10} /> {relativeTime(pathway.updated_at)}
        </span>
        <Link href={`/admin/pathways/${pathway.id}`} style={{ fontSize: 12, color: '#64748b', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, border: '1px solid #1e2d40', transition: 'all 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#14b8a6'; (e.currentTarget as HTMLAnchorElement).style.color = '#14b8a6' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1e2d40'; (e.currentTarget as HTMLAnchorElement).style.color = '#64748b' }}
        >
          แก้ไข
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function PathwaysListPage() {
  const [pathways, setPathways] = useState<(ClinicalPathway & { _region_count?: number; _symptom_count?: number; _condition_count?: number })[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [specialty, setSpecialty] = useState('')
  const [offset, setOffset] = useState(0)
  const LIMIT = 12

  useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(t) }, [search])
  useEffect(() => { setOffset(0) }, [debouncedSearch, activeTab, specialty])

  const fetchPathways = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) })
      if (activeTab !== 'all') p.set('status', activeTab)
      if (specialty) p.set('specialty', specialty)
      if (debouncedSearch) p.set('search', debouncedSearch)
      const res = await fetch(`/api/admin/pathways?${p}`)
      const json = res.ok ? await res.json() : { data: [], count: 0 }
      setPathways(json.data ?? [])
      setTotalCount(json.count ?? 0)
    } catch { setPathways([]); setTotalCount(0) }
    finally { setLoading(false) }
  }, [offset, activeTab, specialty, debouncedSearch])

  useEffect(() => { fetchPathways() }, [fetchPathways])

  useEffect(() => {
    async function fetchCounts() {
      try {
        const all = await fetch('/api/admin/pathways?limit=1').then(r => r.json())
        const counts: Record<string, number> = { all: all.count ?? 0 }
        await Promise.all(['draft', 'pending_review', 'approved', 'published'].map(async s => {
          const r = await fetch(`/api/admin/pathways?limit=1&status=${s}`).then(r => r.json())
          counts[s] = r.count ?? 0
        }))
        setTabCounts(counts)
      } catch {}
    }
    fetchCounts()
  }, [])

  const totalPages = Math.ceil(totalCount / LIMIT)
  const currentPage = Math.floor(offset / LIMIT) + 1

  return (
    <AdminLayout title="Clinical Pathways">
      <div style={{ background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} .tab-btn{background:none;border:none;cursor:pointer;transition:color 0.15s}`}</style>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>Clinical Pathways</h1>
          {totalCount > 0 && <span style={{ background: '#1e2d40', color: '#64748b', borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{totalCount}</span>}
          <Link href="/admin/pathways/new" style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, background: '#14b8a6', color: '#fff', padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <Plus size={14} /> สร้างเส้นทางใหม่
          </Link>
        </div>

        {/* Filter bar */}
        <div style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #1e2d40', background: '#0d1626' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา pathway..." style={{ borderRadius: 8, border: '1px solid #1e2d40', background: '#111827', padding: '6px 10px 6px 32px', fontSize: 13, color: '#e2e8f0', outline: 'none', width: 220 }} />
          </div>
          <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ borderRadius: 8, border: '1px solid #1e2d40', background: '#111827', padding: '6px 10px', fontSize: 13, color: '#e2e8f0', outline: 'none', cursor: 'pointer' }}>
            {SPECIALTY_FILTERS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Status tabs */}
        <div style={{ padding: '0 1.5rem', display: 'flex', gap: 2, background: '#0d1626' }}>
          {STATUS_TABS.map(tab => {
            const active = activeTab === tab.key
            const count = tabCounts[tab.key]
            return (
              <button key={tab.key} className="tab-btn" onClick={() => setActiveTab(tab.key)} style={{ padding: '8px 12px', fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#14b8a6' : '#64748b', borderBottom: active ? '2px solid #14b8a6' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 5 }}>
                {tab.label}
                {count !== undefined && <span style={{ fontSize: 10, background: active ? '#14b8a622' : '#1e2d40', color: active ? '#14b8a6' : '#475569', borderRadius: 99, padding: '1px 5px', fontWeight: 600 }}>{count}</span>}
              </button>
            )
          })}
        </div>

        {/* Cards grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : pathways.length === 0 ? (
            <div style={{ textAlign: 'center' as const, padding: '4rem', color: '#475569', fontSize: 14 }}>
              {debouncedSearch || activeTab !== 'all' ? 'ไม่พบ pathway ที่ตรงกัน' : 'ยังไม่มี Clinical Pathway — คลิก "+ สร้างเส้นทางใหม่"'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {pathways.map(p => <PathwayCard key={p.id} pathway={p} />)}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalCount > LIMIT && (
          <div style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e2d40', background: '#0d1626' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>แสดง {offset + 1}–{Math.min(offset + LIMIT, totalCount)} จาก {totalCount}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setOffset(o => Math.max(0, o - LIMIT))} disabled={offset === 0} style={{ borderRadius: 6, border: '1px solid #1e2d40', background: 'none', padding: '4px 12px', fontSize: 12, color: offset === 0 ? '#1e2d40' : '#94a3b8', cursor: offset === 0 ? 'not-allowed' : 'pointer' }}>← ก่อน</button>
              <span style={{ fontSize: 12, color: '#64748b', padding: '4px 8px' }}>{currentPage}/{totalPages}</span>
              <button onClick={() => setOffset(o => o + LIMIT)} disabled={offset + LIMIT >= totalCount} style={{ borderRadius: 6, border: '1px solid #1e2d40', background: 'none', padding: '4px 12px', fontSize: 12, color: offset + LIMIT >= totalCount ? '#1e2d40' : '#94a3b8', cursor: offset + LIMIT >= totalCount ? 'not-allowed' : 'pointer' }}>ถัดไป →</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
