import type { Metadata } from 'next'
import { Activity } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HealthDashboard } from '@/components/dashboard/HealthDashboard'

export const metadata: Metadata = {
  title: 'แดชบอร์ดสุขภาพ | FirstScreen',
  description: 'ดูผลการประเมินความเสี่ยง ประวัติการตรวจคัดกรอง และแผนสุขภาพส่วนบุคคลของคุณ',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <Activity className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-teal-300 bg-teal-500/10 rounded-full px-3 py-0.5">
                แดชบอร์ดสุขภาพ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">แดชบอร์ดสุขภาพ</h1>
            <p className="text-slate-400 text-sm max-w-xl">
              ผลการประเมิน · แผนคัดกรอง · ติดตามสุขภาพ
            </p>
          </div>
        </div>
        <HealthDashboard />
      </main>
      <Footer />
    </div>
  )
}
