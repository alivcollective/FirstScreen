import type { Metadata } from 'next'
import { Calendar, Shield, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ScreeningPlannerClient } from '@/components/screening/ScreeningPlannerClient'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'แผนตรวจคัดกรองสุขภาพ — Preventive Screening Planner | FirstScreen',
  description: 'รับแผนตรวจคัดกรองสุขภาพเฉพาะบุคคล อ้างอิงแนวทาง สธ. NHSO และ Royal Colleges ครอบคลุมมะเร็ง หัวใจ เบาหวาน วัคซีน และอีกมาก',
}

export default function ScreeningPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <Calendar className="h-5 w-5 text-teal-400" />
              </div>
              <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20">
                แผนตรวจคัดกรองสุขภาพ
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              แผนตรวจคัดกรองเฉพาะบุคคล
            </h1>
            <p className="text-slate-400 max-w-2xl">
              กรอกอายุและเพศ รับรายการตรวจที่เหมาะกับคุณตามแนวทางสุขภาพแห่งชาติ
            </p>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                'กรมการแพทย์ สธ.',
                'NHSO / สปสช.',
                'Royal Colleges Thailand',
                'WHO / USPSTF',
              ].map(src => (
                <div key={src} className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                  <Shield className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">{src}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Planner */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <ScreeningPlannerClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
