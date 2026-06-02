'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error, reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[FirstScreen] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">เกิดข้อผิดพลาด</h2>
      <p className="text-slate-400 text-sm mb-2 max-w-md">
        ระบบเกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง หากปัญหายังคงอยู่ โปรดติดต่อทีมงาน
      </p>
      {error.digest && (
        <p className="text-slate-600 text-xs mb-8 font-mono">Error ID: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 text-sm transition-colors">
          <RefreshCw className="h-4 w-4" />
          ลองใหม่
        </button>
        <Link href="/"
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-semibold px-5 py-3 text-sm transition-colors">
          <Home className="h-4 w-4" />
          หน้าหลัก
        </Link>
      </div>
    </div>
  )
}
