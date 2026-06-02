'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Plus } from 'lucide-react'
import type { BodyRegion } from '@/types/medical'

function SkeletonRow() {
  return (
    <tr>
      {[160, 100, 90, 50, 60].map((w, i) => (
        <td key={i} style={{ padding: '12px 14px', borderBottom: '1px solid #111827' }}>
          <div style={{ height: 13, width: w, borderRadius: 4, background: '#1e2d40', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </td>
      ))}
    </tr>
  )
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  published: { bg: '#042f2e', color: '#2dd4bf', label: 'เผยแพร่' },
  draft:     { bg: '#1e293b', color: '#94a3b8', label: 'Draft' },
  archived:  { bg: '#1e2535', color: '#64748b', label: 'เก็บถาวร' },
}

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_COLORS[status] ?? { bg: '#1e293b', color: '#94a3b8', label: status }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 99, border: `1px solid ${cfg.color}44`, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, padding: '2px 9px', whiteSpace: 'nowrap' as const }}>
      {cfg.label}
    </span>
  )
}

export default function BodyRegionsListPage() {
  const router = useRouter()
  const [regions, setRegions] = useState<BodyRegion[]>([])
  const [loading, setLoading] = useState(true)
  const [parentMap, setParentMap] = useState<Record<string, string>>({})

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/body-regions')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => {
        const data: BodyRegion[] = d.data ?? []
        setRegions(data)
        // Build id → name_th map for parent column
        const map: Record<string, string> = {}
        data.forEach(r => { map[r.id] = r.name_th })
        setParentMap(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const S = {
    page: { background: '#0a0f1a', minHeight: '100%', display: 'flex', flexDirection: 'column' as const },
    header: { padding: '1.25rem 1.5rem 1rem', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
    tableWrap: { flex: 1, overflowX: 'auto' as const },
    th: { padding: '10px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #1e2d40', background: '#0d1626', whiteSpace: 'nowrap' as const },
    td: { padding: '12px 14px', borderBottom: '1px solid #111827', verticalAlign: 'middle' as const, fontSize: 13 },
  }

  return (
    <AdminLayout title="ส่วนร่างกาย">
      <div style={S.page}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} .br-row:hover td{background:#111827!important;cursor:pointer}`}</style>

        <div style={S.header}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>ส่วนร่างกาย</h1>
          {!loading && regions.length > 0 && (
            <span style={{ background: '#1e2d40', color: '#64748b', borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
              {regions.length}
            </span>
          )}
          <Link href="/admin/body-regions/new" style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, background: '#14b8a6', color: '#fff', padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            <Plus size={14} /> เพิ่มใหม่
          </Link>
        </div>

        <div style={S.tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
            <thead>
              <tr>
                <th style={S.th}>ชื่อ</th>
                <th style={S.th}>Slug</th>
                <th style={S.th}>หมวดหมู่หลัก</th>
                <th style={{ ...S.th, textAlign: 'center' as const }}>ลำดับ</th>
                <th style={S.th}>สถานะ</th>
                <th style={{ ...S.th, textAlign: 'right' as const }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : regions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...S.td, textAlign: 'center' as const, padding: '3rem', color: '#475569' }}>
                    ยังไม่มีข้อมูล — คลิก &quot;+ เพิ่มใหม่&quot; เพื่อเพิ่มบริเวณร่างกาย
                  </td>
                </tr>
              ) : (
                regions.map(r => (
                  <tr key={r.id} className="br-row" onClick={() => router.push(`/admin/body-regions/${r.id}`)}>
                    <td style={S.td}>
                      <p style={{ color: '#f1f5f9', fontWeight: 500, marginBottom: 2 }}>{r.name_th}</p>
                      <p style={{ color: '#475569', fontSize: 11 }}>{r.name_en}</p>
                    </td>
                    <td style={S.td}>
                      <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{r.slug}</span>
                    </td>
                    <td style={S.td}>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>
                        {r.parent_id ? (parentMap[r.parent_id] ?? r.parent_id) : '—'}
                      </span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'center' as const }}>
                      <span style={{ color: '#64748b', fontSize: 12 }}>{r.display_order}</span>
                    </td>
                    <td style={S.td}>
                      <StatusPill status={r.status} />
                    </td>
                    <td style={{ ...S.td, textAlign: 'right' as const }} onClick={e => e.stopPropagation()}>
                      <Link href={`/admin/body-regions/${r.id}`} style={{ fontSize: 11, color: '#64748b', textDecoration: 'none', padding: '3px 8px', borderRadius: 5, border: '1px solid #1e2d40' }} onClick={e => e.stopPropagation()}>
                        แก้ไข
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
