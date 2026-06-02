import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HealthReportClient } from '@/components/reports/HealthReportClient'

export const metadata: Metadata = {
  title: 'รายงานสุขภาพ — Health Report | FirstScreen',
  description: 'รายงานสุขภาพส่วนบุคคล พร้อมผลการประเมิน แผนคัดกรอง และคำแนะนำถัดไป',
}

export default function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <FileText className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-teal-300 bg-teal-500/10 rounded-full px-3 py-0.5">
                Health Report
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">รายงานสุขภาพของฉัน</h1>
            <p className="text-slate-400 text-sm">บันทึก PDF · พิมพ์ · แชร์กับแพทย์</p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <HealthReportClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
