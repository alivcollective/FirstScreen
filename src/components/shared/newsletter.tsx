'use client'

import { useState } from 'react'
import { Mail, CheckCircle, Loader2, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

type Topic = 'weekly' | 'cancer' | 'heart' | 'diabetes' | 'screening'

const TOPICS: { key: Topic; label: string; desc: string }[] = [
  { key: 'weekly', label: 'สุขภาพประจำสัปดาห์', desc: 'เคล็ดลับและข้อมูลใหม่ทุกวันจันทร์' },
  { key: 'cancer', label: 'ข้อมูลมะเร็ง', desc: 'การป้องกันและตรวจพบตั้งแต่เนิ่นๆ' },
  { key: 'heart', label: 'สุขภาพหัวใจ', desc: 'CVD risk และการดูแลหัวใจ' },
  { key: 'diabetes', label: 'เบาหวาน', desc: 'ป้องกันและจัดการเบาหวาน' },
  { key: 'screening', label: 'แจ้งเตือนตรวจคัดกรอง', desc: 'ครบกำหนดตรวจตามอายุ' },
]

export function Newsletter({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<Topic[]>(['weekly'])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const toggleTopic = (t: Topic) =>
    setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || selected.length === 0) return
    setStatus('loading')
    // Simulated — wire to email service (Resend/Mailchimp) later
    await new Promise(r => setTimeout(r, 800))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className={cn('rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center', className)}>
        <CheckCircle className="h-10 w-10 text-teal-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-teal-800 mb-1">สมัครสำเร็จแล้ว!</h3>
        <p className="text-sm text-teal-600">
          คุณจะได้รับข้อมูลสุขภาพที่เลือกไว้ทางอีเมล
          <br />
          <span className="font-medium">{email}</span>
        </p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-7 text-white', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20">
          <Bell className="h-5 w-5 text-teal-400" />
        </div>
        <div>
          <h3 className="text-base font-bold">รับข้อมูลสุขภาพ</h3>
          <p className="text-slate-400 text-sm">อิงหลักฐานทางการแพทย์ ส่งตรงถึงคุณ</p>
        </div>
      </div>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TOPICS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => toggleTopic(t.key)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              selected.includes(t.key)
                ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                : 'border-slate-600 text-slate-400 hover:border-teal-500/50'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'สมัคร'
          )}
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-500">
        ยกเลิกได้ตลอดเวลา · ไม่มีสแปม · ข้อมูลของคุณปลอดภัย
      </p>
    </div>
  )
}
