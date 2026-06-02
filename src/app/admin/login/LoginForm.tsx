'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react'

export function AdminLoginForm() {
  const [email, setEmail] = useState('admin@firstscreen.health')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
              <Shield className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <p className="text-base font-bold text-white">FirstScreen</p>
              <p className="text-[11px] text-slate-500">Admin Portal</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h1 className="text-sm font-semibold text-white">เข้าสู่ระบบ Admin</h1>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">อีเมล</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@firstscreen.health" required autoComplete="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">รหัสผ่าน</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="รหัสผ่าน" required autoComplete="current-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition-colors">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-4">
          FirstScreen Admin · ใช้เฉพาะทีมงานภายใน
        </p>
      </div>
    </div>
  )
}
