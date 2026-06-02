import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PremiumBodyMap } from '@/components/body-map/PremiumBodyMap'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://firstscreen.health'

export const metadata: Metadata = {
  title: 'เลือกตำแหน่งอาการ | FirstScreen',
  description: 'เลือกบริเวณร่างกายที่มีอาการด้วย Body Map แบบ interactive เพื่อเริ่มการประเมินเบื้องต้นตามหลักฐานทางการแพทย์',
  openGraph: {
    title: 'Body Map — เลือกตำแหน่งอาการ | FirstScreen',
    description: 'Interactive medical body map สำหรับค้นหาและประเมินอาการ',
    type: 'website',
    url: `${BASE_URL}/body-map`,
    siteName: 'FirstScreen',
  },
}

export default function BodyMapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e]">
      <Navbar />
      <main className="flex-1 flex flex-col">

        {/* Page header */}
        <div className="border-b border-white/5 bg-[#0a0f1e] px-5 py-4">
          <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-bold text-white">เลือกตำแหน่งที่คุณมีอาการ</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                คลิกที่บริเวณร่างกาย · เลือกอาการ · รับคำแนะนำเบื้องต้น
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/8 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] text-amber-300/80">ข้อมูลเพื่อการศึกษา ไม่ใช่การวินิจฉัย</span>
            </div>
          </div>
        </div>

        {/* Body Map — flex-1 fills remaining viewport */}
        <div className="flex-1">
          <PremiumBodyMap />
        </div>

        {/* Emergency strip */}
        <div className="border-t border-white/5 bg-[#0a0f1e] px-5 py-3">
          <div className="mx-auto max-w-5xl">
            <p className="text-[11px] text-slate-600 text-center">
              อาการฉุกเฉิน เจ็บหน้าอก หายใจไม่ออก แขนขาอ่อนแรงเฉียบพลัน:{' '}
              <a href="tel:1669" className="font-bold text-red-400 hover:text-red-300">โทร 1669</a>
              {' '}ทันที — ไม่ต้องรอกรอก
            </p>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
