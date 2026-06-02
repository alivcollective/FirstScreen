'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Pencil } from 'lucide-react'
import type { KmsArticle } from '@/types/kms'

export default function AdminArticlesPage() {
  const [data, setData] = useState<KmsArticle[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const qs = new URLSearchParams({ page: String(page), search })
    fetch('/api/kms/articles?' + qs.toString())
      .then(r => r.json())
      .then(d => { setData(d.data ?? []); setTotal(d.total ?? 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, search])

  const columns = [
    {
      key: 'title', header: 'หัวข้อ', width: 'w-[40%]',
      render: (row: Record<string, unknown>) => {
        const a = row as unknown as KmsArticle
        return (
          <div>
            <Link href={'/admin/articles/' + a.id} className="font-medium text-white hover:text-teal-300 line-clamp-1">
              {a.title_th}
            </Link>
            <p className="text-xs text-slate-500">{a.slug}</p>
          </div>
        )
      },
    },
    {
      key: 'status', header: 'สถานะ', width: 'w-24',
      render: (row: Record<string, unknown>) => <StatusBadge status={(row as unknown as KmsArticle).status} />,
    },
    {
      key: 'views', header: 'ยอดชม', width: 'w-20',
      render: (row: Record<string, unknown>) => <span className="text-xs text-slate-400">{String((row as unknown as KmsArticle).view_count ?? 0)}</span>,
    },
    {
      key: 'updated', header: 'อัปเดต', width: 'w-28',
      render: (row: Record<string, unknown>) => {
        const a = row as unknown as KmsArticle
        return <span className="text-xs text-slate-500">{new Date(a.updated_at).toLocaleDateString('th-TH')}</span>
      },
    },
    {
      key: 'actions', header: '', width: 'w-16',
      render: (row: Record<string, unknown>) => {
        const a = row as unknown as KmsArticle
        return (
          <Link href={'/admin/articles/' + a.id} className="p-1.5 rounded text-slate-500 hover:text-teal-400 hover:bg-slate-800 transition-colors inline-flex">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        )
      },
    },
  ]

  return (
    <AdminLayout title="บทความ">
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Top action bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white">บทความทั้งหมด</h2>
            <p className="text-xs text-slate-500 mt-0.5">จัดการและเผยแพร่บทความสุขภาพ</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm shadow-teal-900/40"
          >
            <Plus className="h-4 w-4" />
            เพิ่มบทความ
          </Link>
        </div>
        <DataTable
          columns={columns} data={data as unknown as Record<string, unknown>[]}
          total={total} page={page} pageSize={20} loading={loading}
          onPageChange={setPage} onSearch={setSearch}
          searchPlaceholder="ค้นหาบทความ..."
          actions={
            <Link href="/admin/articles/new" className="flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Plus className="h-3.5 w-3.5" /> บทความใหม่
            </Link>
          }
          emptyMessage="ยังไม่มีบทความ"
        />
      </div>
    </AdminLayout>
  )
}
