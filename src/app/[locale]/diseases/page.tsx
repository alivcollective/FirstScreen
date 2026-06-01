import type { Metadata } from 'next'
import { BookOpen, Shield, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { DiseaseSearch } from '@/components/disease/disease-search'
import { getAllDiseaseCardsForListing } from '@/data/diseases/index'

export const metadata: Metadata = {
  title: 'คลังข้อมูลโรค — Disease Library | Health Compass',
  description: 'ข้อมูลโรคครบถ้วนสำหรับประชาชนไทย อ้างอิงหลักฐานทางการแพทย์ ตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ',
}

export default function DiseasesPage() {
  const diseases = getAllDiseaseCardsForListing()

  const totalRich = diseases.filter(d => d.isRich).length
  const totalCount = diseases.length

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <BookOpen className="h-5 w-5 text-teal-400" />
              </div>
              <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20">
                Disease Intelligence Network
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              คลังข้อมูลโรค
            </h1>
            <p className="text-slate-400 text-base max-w-2xl leading-relaxed mb-8">
              ข้อมูลสุขภาพที่จัดระดับหลักฐาน (GRADE A-D) ตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ อัปเดตสม่ำเสมอ
              เพื่อช่วยให้คุณเข้าใจโรค รู้วิธีป้องกัน และรู้ว่าเมื่อไหร่ควรพบแพทย์
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5">
                <BookOpen className="h-4 w-4 text-teal-400" />
                <span className="text-sm text-white font-medium">{totalCount} โรคในฐานข้อมูล</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5">
                <Shield className="h-4 w-4 text-teal-400" />
                <span className="text-sm text-white font-medium">{totalRich} หน้าข้อมูลครบถ้วน</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5">
                <TrendingUp className="h-4 w-4 text-teal-400" />
                <span className="text-sm text-white font-medium">อิงหลักฐาน GRADE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disease Library */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <DiseaseSearch diseases={diseases} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
