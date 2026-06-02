'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Symptom } from '@/types/medical'

const STATUS_TABS = [
  { key: 'all',            label: 'ทั้งหมด' },
  { key: 'draft',          label: 'Draft' },
  { key: 'pending_review', label: 'รอตรวจสอบ' },
  { key: 'published',      label: 'เผยแพร่' },
]

const BODY_REGION_OPTIONS = [
  { value: '', label: 'ทุกบริเวณ' },
  { value: 'head', label: 'ศีรษะ' }, { value: 'chest', label: 'หน้าอก' },
  { value: 'abdomen', label: 'ท้อง' }, { value: 'back', label: 'หลัง' },
  { value: 'limbs', label: 'แขนขา' }, { value: 'skin', label: 'ผิวหนัง' },
  { value: 'general', label: 'ทั่วไป' },
]

const REGION_COLORS: Record<string, string> = {
  head: '#8b5cf6', face: '#8b5cf6',
  chest: '#ef4444', cardiovascular: '#ef4444',
  abdomen: '#f59e0b', GI: '#f59e0b',
  back: '#14b8a6', 'upper-back': '#14b8a6', 'lower-back': '#14b8a6',
  limbs: '#3b82f6', shoulder: '#3b82f6', knee: '#3b82f6',
  skin: '#22c55e', dermatological: '#22c55e',
  general: '#64748b', neurological: '#64748b',
}

function getRegionColor(region: string): string {
  return REGION_COLORS[region] ?? '#64748b'
}

function SeverityDots({ weight }: { weight: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4].map(i => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i <= weight ? (weight === 4 ? '#ef4444' : weight === 3 ? '#f97316' : weight === 2 ? '#eab308' : '#22c55e') : '#1e2d40' }} />
      ))}
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[180, 80, 90, 90, 60, 50, 70].map((w, i) => (
        <td key={i} style={{ padding: '12px', borderBottom: '1px solid #111827' }}>
          <div style={{ height: 13, width: w, borderRadius: 4, background: '#1e2d40', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </td>
      ))}
    </tr>
  )
}

const S = {
  page: { background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const },
  header: { padding: '1.25rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  filterBar: { padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, borderBottom: '1px solid #1e2d40', background: '#0d1626' },
  tabBar: { padding: '0 1.5rem', display: 'flex', gap: 2, background: '#0d1626', flexShrink: 0 },
  tableWrap: { flex: 1, overflowX: 'auto' as const, overflowY: 'auto' as const },
  th: { padding: '10px 12px', textAlign: 'left' as const, color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #1e2d40', whiteSpace: 'nowrap' as const, background: '#0d1626' },
  td: { padding: '12px', borderBottom: '1px solid #111827', verticalAlign: 'middle' as const, fontSize: 13 },
  pagination: { padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e2d40', background: '#0d1626', flexShrink: 0 },
  input: { borderRadius: 8, border: '1px solid #1e2d40', background: '#111827', padding: '6px 10px 6px 32px', fontSize: 13, color: '#e2e8f0', outline: 'none', width: 220 },
  select: { borderRadius: 8, border: '1px solid #1e2d40', background: '#111827', padding: '6px 10px', fontSize: 13, color: '#e2e8f0', outline: 'none', cursor: 'pointer' },
}

export default function SymptomsListPage() {
  const router = useRouter()
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [bodyRegion, setBodyRegion] = useState('')
  const [offset, setOffset] = useState(0)
  const LIMIT = 20

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => { setOffset(0) }, [debouncedSearch, activeTab, bodyRegion])

  const fetchSymptoms = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) })
      if (activeTab !== 'all') p.set('status', activeTab)
      if (bodyRegion) p.set('body_region', bodyRegion)
      if (debouncedSearch) p.set('search', debouncedSearch)
      const res = await fetch(`/api/admin/symptoms?${p}`)
      const json = res.ok ? await res.json() : { data: [], count: 0 }
      setSymptoms(json.data ?? [])
      setTotalCount(json.count ?? 0)
    } catch {
      setSymptoms([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [offset, activeTab, bodyRegion, debouncedSearch])

  useEffect(() => { fetchSymptoms() }, [fetchSymptoms])

  useEffect(() => {
    async function fetchCounts() {
      try {
        const all = await fetch('/api/admin/symptoms?limit=1').then(r => r.json())
        const counts: Record<string, number> = { all: all.count ?? 0 }
        await Promise.all(['draft', 'pending_review', 'published'].map(async s => {
          const r = await fetch(`/api/admin/symptoms?limit=1&status=${s}`).then(r => r.json())
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
    <AdminLayout title="อาการ">
      <div style={S.page}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} .sym-row:hover td{background:#111827!important;cursor:pointer} .tab-btn{background:none;border:none;cursor:pointer}`}</style>

        <div style={S.header}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>อาการ</h1>
          {totalCount > 0 && <span style={{ background: '#1e2d40', color: '#64748b', borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{totalCount.toLocaleString()}</span>}
          <Link href="/admin/symptoms/new" style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, background: '#14b8a6', color: '#fff', padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            <Plus size={14} /> เพิ่มใหม่
          </Link>
        </div>

        <div style={S.filterBar}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาชื่อ, รหัส..." style={S.input} />
          </div>
          <select value={bodyRegion} onChange={e => setBodyRegion(e.target.value)} style={S.select}>
            {BODY_REGION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div style={S.tabBar}>
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

        <div style={S.tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={S.th}>ชื่อ</th>
                <th style={S.th}>รหัส ICD-11</th>
                <th style={S.th}>บริเวณร่างกาย</th>
                <th style={S.th}>ระบบร่างกาย</th>
                <th style={S.th}>ความรุนแรง</th>
                <th style={{ ...S.th, textAlign: 'center' as const }}>🚨</th>
                <th style={S.th}>สถานะ</th>
                <th style={{ ...S.th, textAlign: 'right' as const }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : symptoms.length === 0 ? (
                <tr><td colSpan={8} style={{ ...S.td, textAlign: 'center', padding: '3rem', color: '#475569' }}>
                  {debouncedSearch || activeTab !== 'all' ? 'ไม่พบผลลัพธ์' : 'ยังไม่มีอาการ — คลิก "+ เพิ่มใหม่"'}
                </td></tr>
              ) : symptoms.map(s => (
                <tr key={s.id} className="sym-row" onClick={() => router.push(`/admin/symptoms/${s.id}`)}>
                  <td style={S.td}>
                    <p style={{ color: '#f1f5f9', fontWeight: 500, marginBottom: 2 }}>{s.name_th}</p>
                    <p style={{ color: '#475569', fontSize: 11 }}>{s.name_en}</p>
                  </td>
                  <td style={S.td}><span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{s.code || '—'}</span></td>
                  <td style={S.td}>
                    {s.body_region ? (
                      <span style={{ background: `${getRegionColor(s.body_region)}22`, color: getRegionColor(s.body_region), borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                        {s.body_region}
                      </span>
                    ) : <span style={{ color: '#475569' }}>—</span>}
                  </td>
                  <td style={S.td}>
                    {s.system ? (
                      <span style={{ background: '#1e2d40', color: '#94a3b8', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{s.system}</span>
                    ) : <span style={{ color: '#475569' }}>—</span>}
                  </td>
                  <td style={S.td}><SeverityDots weight={s.severity_weight ?? 1} /></td>
                  <td style={{ ...S.td, textAlign: 'center' as const }}>
                    {s.is_emergency && (
                      <span style={{ background: '#450a0a', color: '#f87171', borderRadius: 6, padding: '2px 6px', fontSize: 10, fontWeight: 700 }}>🚨 ฉุกเฉิน</span>
                    )}
                  </td>
                  <td style={S.td}><StatusBadge status={s.status} size="sm" /></td>
                  <td style={{ ...S.td, textAlign: 'right' as const }} onClick={e => e.stopPropagation()}>
                    <Link href={`/admin/symptoms/${s.id}`} style={{ fontSize: 11, color: '#64748b', textDecoration: 'none', padding: '3px 8px', borderRadius: 5, border: '1px solid #1e2d40' }} onClick={e => e.stopPropagation()}>
                      แก้ไข
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalCount > LIMIT && (
          <div style={S.pagination}>
            <span style={{ fontSize: 12, color: '#64748b' }}>แสดง {offset + 1}–{Math.min(offset + LIMIT, totalCount)} จาก {totalCount.toLocaleString()}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setOffset(o => Math.max(0, o - LIMIT))} disabled={offset === 0} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 6, padding: '4px 8px', color: offset === 0 ? '#1e2d40' : '#94a3b8', cursor: offset === 0 ? 'not-allowed' : 'pointer' }}><ChevronLeft size={14} /></button>
              <span style={{ fontSize: 12, color: '#64748b' }}>{currentPage} / {totalPages}</span>
              <button onClick={() => setOffset(o => o + LIMIT)} disabled={offset + LIMIT >= totalCount} style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 6, padding: '4px 8px', color: offset + LIMIT >= totalCount ? '#1e2d40' : '#94a3b8', cursor: offset + LIMIT >= totalCount ? 'not-allowed' : 'pointer' }}><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
