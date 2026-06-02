'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/admin/auth', { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }) })
    setLoading(false)
    if (res.ok) router.push('/admin')
    else setError('รหัสผ่านไม่ถูกต้อง')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <Shield className="h-7 w-7 text-teal-400" />
            <div>
              <p className="text-lg font-bold text-white">FirstScreen</p>
              <p className="text-xs text-slate-500">Admin Portal</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleLogin} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h1 className="text-base font-semibold text-white">เข้าสู่ระบบ</h1>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">รหัสผ่าน</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Admin password" required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  )
}
