import type { Metadata } from 'next'
import { MapPin, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BodyMapLayout } from '@/components/body-map/BodyMapLayout'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://firstscreen.health'

export const metadata: Metadata = {
  title: 'เลือกตำแหน่งอาการ | FirstScreen',
  description: 'เลือกบริเวณร่างกายที่มีอาการ เพื่อเริ่มการประเมินเบื้องต้นและรับคำแนะนำตามหลักฐานทางการแพทย์',
  openGraph: {
    title: 'เลือกตำแหน่งอาการ | FirstScreen',
    description: 'เลือกบริเวณร่างกายที่มีอาการ เพื่อเริ่มการประเมินเบื้องต้น',
    type: 'website',
    url: `${BASE_URL}/body-map`,
    siteName: 'FirstScreen',
  },
  alternates: {
    canonical: `${BASE_URL}/body-map`,
    languages: {
      'th': `${BASE_URL}/body-map`,
      'en': `${BASE_URL}/en/body-map`,
    },
  },
}

export default function BodyMapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">

        {/* Page header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-12">
          <div className="mx-auto max-w-2xl px-5 text-center">
            <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-5">
              <MapPin className="h-5 w-5 text-teal-400" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              เลือกตำแหน่งที่คุณมีอาการ
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              คลิกที่บริเวณร่างกายที่คุณรู้สึกผิดปกติ เพื่อเริ่มการประเมินเบื้องต้น
            </p>
          </div>
        </div>

        {/* Body Map */}
        <div className="py-8 sm:py-12">
          <BodyMapLayout />
        </div>

        {/* How it works */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: '1', title: 'เลือกตำแหน่ง', desc: 'คลิกที่บริเวณร่างกายที่มีอาการ' },
              { n: '2', title: 'เลือกอาการ', desc: 'เลือกอาการที่คุณรู้สึก' },
              { n: '3', title: 'รับคำแนะนำ', desc: 'เริ่มประเมินและรับข้อมูลเบื้องต้น' },
            ].map((step) => (
              <div key={step.n} className="flex gap-3 rounded-xl bg-white border border-slate-100 p-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white text-xs font-bold">
                  {step.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-xs text-slate-500 leading-relaxed">
                FirstScreen ให้ข้อมูลเพื่อการศึกษาและการคัดกรองสุขภาพเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยโรคหรือทดแทนคำแนะนำจากแพทย์
                หากมีอาการรุนแรงหรือฉุกเฉิน ควรโทร 1669 หรือไปโรงพยาบาลทันที
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
