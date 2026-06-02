'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  total: number
  page: number
  pageSize: number
  loading?: boolean
  onPageChange: (page: number) => void
  onSearch?: (q: string) => void
  searchPlaceholder?: string
  actions?: React.ReactNode
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns, data, total, page, pageSize, loading, onPageChange, onSearch,
  searchPlaceholder = 'ค้นหา...', actions, emptyMessage = 'ไม่พบข้อมูล',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const totalPages = Math.ceil(total / pageSize)

  const handleSearch = (q: string) => {
    setSearch(q)
    onSearch?.(q)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-800">
        {onSearch && (
          <div className="flex items-center gap-2 flex-1 max-w-xs rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-slate-500 text-sm">{emptyMessage}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {columns.map(col => (
                  <th key={col.key} className={cn('px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500', col.width)}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-slate-300">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} จาก {total} รายการ
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : i + page - 2
              if (p > totalPages) return null
              return (
                <button key={p} onClick={() => onPageChange(p)}
                  className={cn('w-7 h-7 rounded text-xs font-medium transition-colors',
                    p === page ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
