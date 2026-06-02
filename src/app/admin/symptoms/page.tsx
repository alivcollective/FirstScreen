'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { Plus, Pencil } from 'lucide-react'

export default function Admin_Symptoms() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), search })
    fetch(`/api/kms/symptoms?${params}`)
      .then(r => r.ok ? r.json() : { data: [], total: 0 })
      .then(d => { setData(d.data ?? []); setTotal(d.total ?? 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, search])

  const columns = [
    { key: 'name', header: 'ชื่อ', render: (row: any) => (
      <div>
        <p className="font-medium text-white">{row.name_th ?? row.name ?? row.title ?? row.source_org ?? '—'}</p>
        <p className="text-xs text-slate-500">{row.name_en ?? row.slug ?? ''}</p>
      </div>
    ) },
    { key: 'extra', header: 'รายละเอียด', render: (row: any) => (
      <span className="text-xs text-slate-400 line-clamp-1">
        {row.description_th ?? row.specialty ?? row.source_org ?? row.evidence_level ?? '—'}
      </span>
    ) },
    { key: 'date', header: 'วันที่', render: (row: any) => (
      <span className="text-xs text-slate-500">
        {row.created_at ? new Date(row.created_at).toLocaleDateString('th-TH') : '—'}
      </span>
    ) },
  ]

  return (
    <AdminLayout title="อาการ">
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <DataTable
          columns={columns} data={data} total={total}
          page={page} pageSize={50} loading={loading}
          onPageChange={setPage} onSearch={setSearch}
          searchPlaceholder="ค้นหา..."
          actions={
            <button className="flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Plus className="h-3.5 w-3.5" /> เพิ่มใหม่
            </button>
          }
          emptyMessage="ยังไม่มีข้อมูล"
        />
      </div>
    </AdminLayout>
  )
}
