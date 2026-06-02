'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatusBadge, SeverityBadge } from '@/components/admin/StatusBadge'
import { Plus, Search, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import type { Condition, ContentStatus } from '@/types/medical'

// ── Constants ─────────────────────────────────────────────────

const STATUS_TABS: Array<{ key: ContentStatus | 'all'; label: string }> = [
  { key: 'all',           label: 'ทั้งหมด' },
  { key: 'draft',         label: 'Draft' },
  { key: 'pending_review',label: 'รอตรวจสอบ' },
  { key: 'approved',      label: 'อนุมัติ' },
  { key: 'published',     label: 'เผยแพร่' },
  { key: 'archived',      label: 'เก็บถาวร' },
]

const SPECIALTIES = [
  { value: '', label: 'ทุกสาขา' },
  { value: 'general', label: 'เวชกรรมทั่วไป' },
  { value: 'internal_medicine', label: 'อายุรกรรม' },
  { value: 'cardiology', label: 'โรคหัวใจ' },
  { value: 'neurology', label: 'ประสาทวิทยา' },
  { value: 'orthopedics', label: 'ออร์โธปิดิกส์' },
  { value: 'gastroenterology', label: 'โรคทางเดินอาหาร' },
  { value: 'pulmonology', label: 'ระบบหายใจ' },
  { value: 'endocrinology', label: 'ต่อมไร้ท่อ' },
  { value: 'psychiatry', label: 'จิตเวช' },
  { value: 'oncology', label: 'มะเร็งวิทยา' },
  { value: 'surgery', label: 'ศัลยกรรม' },
  { value: 'emergency', label: 'เวชศาสตร์ฉุกเฉิน' },
  { value: 'pediatrics', label: 'กุมารเวช' },
]

const COMPLETENESS_WEIGHTS: Array<[keyof Condition, number]> = [
  ['name_th', 25], ['name_en', 10], ['icd11_code', 10],
  ['description_th', 20], ['severity', 10], ['urgency_level', 5],
  ['age_group', 5], ['evidence_level', 10], ['reviewer_name', 5],
]

function calcCompleteness(c: Condition): number {
  let score = 0
  for (const [field, weight] of COMPLETENESS_WEIGHTS) {
    const val = c[field]
    if (!val || val === '') continue
    if (Array.isArray(val) && val.length === 0) continue
    score += weight
  }
  return Math.min(100, score)
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'เมื่อกี้'
  if (mins < 60) return `${mins} นาทีที่แล้ว`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} วันที่แล้ว`
  const months = Math.floor(days / 30)
  return `${months} เดือนที่แล้ว`
}

// ── Inline styles ─────────────────────────────────────────────

const S = {
  page: { background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const },
  header: { padding: '1.25rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  filterBar: { padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, borderBottom: '1px solid #1e2d40', background: '#0d1626' },
  tabBar: { padding: '0 1.5rem', display: 'flex', gap: 2, background: '#0d1626', flexShrink: 0 },
  tableWrap: { flex: 1, overflowX: 'auto' as const, overflowY: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  th: { padding: '10px 12px', textAlign: 'left' as const, color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #1e2d40', whiteSpace: 'nowrap' as const, background: '#0d1626' },
  td: { padding: '12px 12px', borderBottom: '1px solid #111827', verticalAlign: 'middle' as const },
  pagination: { padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e2d40', background: '#0d1626', flexShrink: 0 },
  input: { borderRadius: 8, border: '1px solid #1e2d40', background: '#111827', padding: '6px 10px 6px 32px', fontSize: 13, color: '#e2e8f0', outline: 'none', width: 220 },
  select: { borderRadius: 8, border: '1px solid #1e2d40', background: '#111827', padding: '6px 10px', fontSize: 13, color: '#e2e8f0', outline: 'none', cursor: 'pointer' },
}

// ── Skeleton row ──────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {[200, 80, 100, 80, 80, 60, 80, 60].map((w, i) => (
        <td key={i} style={S.td}>
          <div style={{ height: 14, width: w, borderRadius: 4, background: '#1e2d40', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </td>
      ))}
    </tr>
  )
}

// ── Status dropdown ───────────────────────────────────────────

function StatusDropdown({
  condition,
  onStatusChange,
}: {
  condition: Condition
  onStatusChange: (id: string, status: ContentStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const statuses: ContentStatus[] = ['draft', 'pending_review', 'approved', 'published', 'archived']
  const completeness = calcCompleteness(condition)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 6, padding: '3px 7px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '110%', zIndex: 50, background: '#111827', border: '1px solid #1e2d40', borderRadius: 10, padding: 4, minWidth: 160, boxShadow: '0 8px 32px #00000060' }}>
          <p style={{ fontSize: 10, color: '#475569', padding: '4px 8px 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>เปลี่ยนสถานะ</p>
          {statuses.map(s => {
            const isPublish = s === 'published'
            const warn = isPublish && (completeness < 80 || !condition.reviewer_name)
            return (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange(condition.id, s)
                  setOpen(false)
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '6px 8px', borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 8 }}
              >
                <StatusBadge status={s} size="sm" />
                {warn && <span style={{ fontSize: 10, color: '#f59e0b' }}>⚠</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function ConditionsListPage() {
  const router = useRouter()
  const [conditions, setConditions] = useState<Condition[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTab] = useState<ContentStatus | 'all'>('all')
  const [specialty, setSpecialty] = useState('')
  const [offset, setOffset] = useState(0)
  const LIMIT = 20

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Reset offset on filter change
  useEffect(() => { setOffset(0) }, [debouncedSearch, activeTab, specialty])

  // Fetch data
  const fetchConditions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(LIMIT),
        offset: String(offset),
      })
      if (activeTab !== 'all') params.set('status', activeTab)
      if (specialty) params.set('specialty', specialty)
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/admin/conditions?${params}`)
      const json = res.ok ? await res.json() : { data: [], count: 0 }
      setConditions(json.data ?? [])
      setTotalCount(json.count ?? 0)
    } catch {
      setConditions([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [offset, activeTab, specialty, debouncedSearch])

  useEffect(() => { fetchConditions() }, [fetchConditions])

  // Fetch tab counts (all statuses at once, without status filter)
  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch('/api/admin/conditions?limit=1&offset=0')
        if (!res.ok) return
        const all = await res.json()
        const counts: Record<string, number> = { all: all.count ?? 0 }

        await Promise.all(
          (['draft', 'pending_review', 'approved', 'published', 'archived'] as ContentStatus[]).map(
            async (s) => {
              const r = await fetch(`/api/admin/conditions?limit=1&offset=0&status=${s}`)
              if (r.ok) {
                const d = await r.json()
                counts[s] = d.count ?? 0
              }
            }
          )
        )
        setTabCounts(counts)
      } catch {}
    }
    fetchCounts()
  }, [])

  async function handleStatusChange(id: string, status: ContentStatus) {
    try {
      const res = await fetch(`/api/admin/conditions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) fetchConditions()
    } catch {}
  }

  const totalPages = Math.ceil(totalCount / LIMIT)
  const currentPage = Math.floor(offset / LIMIT) + 1

  return (
    <AdminLayout title="โรคและภาวะ">
      <div style={S.page}>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1 }
            50% { opacity: 0.4 }
          }
          .condition-row:hover td { background: #111827 !important; cursor: pointer; }
          .tab-btn { background: none; border: none; cursor: pointer; transition: color 0.15s; }
          .tab-btn:hover { color: #e2e8f0 !important; }
        `}</style>

        {/* Header */}
        <div style={S.header}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>โรคและภาวะ</h1>
          {totalCount > 0 && (
            <span style={{ background: '#1e2d40', color: '#64748b', borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
              {totalCount.toLocaleString()}
            </span>
          )}
          <Link
            href="/admin/conditions/new"
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, background: '#14b8a6', color: '#fff', padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            <Plus size={14} /> เพิ่มใหม่
          </Link>
        </div>

        {/* Filter bar */}
        <div style={S.filterBar}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, ICD-11..."
              style={S.input}
            />
          </div>
          <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={S.select}>
            {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Status tabs */}
        <div style={S.tabBar}>
          {STATUS_TABS.map(tab => {
            const active = activeTab === tab.key
            const count = tabCounts[tab.key]
            return (
              <button
                key={tab.key}
                className="tab-btn"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 12px', fontSize: 12, fontWeight: active ? 600 : 400,
                  color: active ? '#14b8a6' : '#64748b',
                  borderBottom: active ? '2px solid #14b8a6' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {tab.label}
                {count !== undefined && (
                  <span style={{ fontSize: 10, background: active ? '#14b8a622' : '#1e2d40', color: active ? '#14b8a6' : '#475569', borderRadius: 99, padding: '1px 5px', fontWeight: 600 }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>ชื่อ</th>
                <th style={S.th}>ICD-11</th>
                <th style={S.th}>สาขา</th>
                <th style={S.th}>ความรุนแรง</th>
                <th style={S.th}>สถานะ</th>
                <th style={{ ...S.th, minWidth: 90 }}>ความสมบูรณ์</th>
                <th style={S.th}>แก้ไขล่าสุด</th>
                <th style={{ ...S.th, textAlign: 'right' as const }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : conditions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...S.td, textAlign: 'center', padding: '3rem', color: '#475569' }}>
                    {debouncedSearch || activeTab !== 'all' ? 'ไม่พบผลลัพธ์' : 'ยังไม่มีข้อมูล — คลิก "+ เพิ่มใหม่" เพื่อเริ่มต้น'}
                  </td>
                </tr>
              ) : (
                conditions.map(c => {
                  const pct = calcCompleteness(c)
                  const barColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#14b8a6' : '#eab308'
                  return (
                    <tr
                      key={c.id}
                      className="condition-row"
                      onClick={() => router.push(`/admin/conditions/${c.id}`)}
                    >
                      {/* Name */}
                      <td style={S.td}>
                        <p style={{ color: '#f1f5f9', fontWeight: 500, marginBottom: 2 }}>{c.name_th}</p>
                        <p style={{ color: '#475569', fontSize: 11 }}>{c.name_en}</p>
                      </td>
                      {/* ICD-11 */}
                      <td style={S.td}>
                        <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>
                          {c.icd11_code || '—'}
                        </span>
                      </td>
                      {/* Specialty */}
                      <td style={S.td}>
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>
                          {c.specialty_required || '—'}
                        </span>
                      </td>
                      {/* Severity */}
                      <td style={S.td}>
                        {c.severity ? <SeverityBadge severity={c.severity} size="sm" /> : <span style={{ color: '#475569' }}>—</span>}
                      </td>
                      {/* Status */}
                      <td style={S.td}>
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      {/* Completeness bar */}
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 48, height: 5, background: '#1e2d40', borderRadius: 99 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 11, color: barColor, fontWeight: 600, minWidth: 26 }}>{pct}%</span>
                        </div>
                      </td>
                      {/* Updated at */}
                      <td style={S.td}>
                        <span style={{ color: '#475569', fontSize: 12 }}>{relativeTime(c.updated_at)}</span>
                      </td>
                      {/* Actions */}
                      <td style={{ ...S.td, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          <Link
                            href={`/admin/conditions/${c.id}`}
                            style={{ fontSize: 11, color: '#64748b', textDecoration: 'none', padding: '3px 8px', borderRadius: 5, border: '1px solid #1e2d40' }}
                            onClick={e => e.stopPropagation()}
                          >
                            แก้ไข
                          </Link>
                          <StatusDropdown condition={c} onStatusChange={handleStatusChange} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > LIMIT && (
          <div style={S.pagination}>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              แสดง {offset + 1}–{Math.min(offset + LIMIT, totalCount)} จาก {totalCount.toLocaleString()} รายการ
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setOffset(o => Math.max(0, o - LIMIT))}
                disabled={offset === 0}
                style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 6, padding: '4px 8px', color: offset === 0 ? '#1e2d40' : '#94a3b8', cursor: offset === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setOffset(o => o + LIMIT)}
                disabled={offset + LIMIT >= totalCount}
                style={{ background: 'none', border: '1px solid #1e2d40', borderRadius: 6, padding: '4px 8px', color: offset + LIMIT >= totalCount ? '#1e2d40' : '#94a3b8', cursor: offset + LIMIT >= totalCount ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
