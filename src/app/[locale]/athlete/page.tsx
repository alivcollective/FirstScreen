import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Activity, ChevronRight, AlertTriangle, ShieldCheck,
  ArrowRight, Zap,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AthleteMap } from '@/components/athlete/AthleteMap'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://firstscreen.health'

export const metadata: Metadata = {
  title: 'Athlete Pain Map — ค้นหาอาการบาดเจ็บนักกีฬา | FirstScreen',
  description: 'เลือกส่วนร่างกายที่เจ็บ กีฬาที่คุณเล่น และอาการที่รู้สึก เพื่อรับข้อมูลเบื้องต้นเกี่ยวกับการบาดเจ็บที่อาจเกิดขึ้น',
  openGraph: {
    title: 'Athlete Pain Map | FirstScreen',
    description: 'ค้นหาอาการบาดเจ็บสำหรับนักกีฬาทุกประเภท',
    url: `${BASE_URL}/athlete`,
    type: 'website',
    siteName: 'FirstScreen',
  },
}

export default function AthletePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">

        {/* Header */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 py-12">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-5">
              <Activity className="h-5 w-5 text-teal-400" strokeWidth={1.75} />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/8 px-3 py-1 mb-4">
              <Zap className="h-3 w-3 text-teal-400" />
              <span className="text-xs font-medium text-teal-300">Athlete Pain Map</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              ค้นหาอาการบาดเจ็บของคุณ
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              เลือกส่วนร่างกายที่เจ็บ กีฬาที่คุณเล่น และอาการที่รู้สึก
              เพื่อรับข้อมูลเบื้องต้นเกี่ยวกับการบาดเจ็บที่อาจเกิดขึ้น
            </p>
          </div>
        </div>

        {/* Emergency banner */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-6 mb-2">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs text-red-700 leading-relaxed">
                หากมีอาการเจ็บหน้าอก หายใจลำบาก แขนขาอ่อนแรงเฉียบพลัน หรือหมดสติ ควร{' '}
                <a href="tel:1669" className="font-bold underline">โทร 1669</a> ทันที
              </p>
            </div>
          </div>
        </div>

        {/* Main athlete map UI */}
        <AthleteMap />

        {/* Quick links */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'ตรวจอาการทั่วไป', desc: 'Body Map สำหรับทุกคน', href: '/body-map', icon: Activity },
              { label: 'ประเมินความเสี่ยง', desc: 'CVD, เบาหวาน, มะเร็ง', href: '/risk', icon: ShieldCheck },
              { label: 'ค้นหาโรงพยาบาล', desc: 'เวชศาสตร์การกีฬา', href: '/providers', icon: ChevronRight },
            ].map(({ label, desc, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-200 hover:bg-teal-50/30 transition-all group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                  <Icon className="h-4 w-4 text-teal-600" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                FirstScreen ให้ข้อมูลเพื่อการศึกษาและการคัดกรองเบื้องต้นเท่านั้น
                ไม่ใช่การวินิจฉัยโรคหรือทดแทนคำแนะนำจากนักกายภาพบำบัดหรือแพทย์
                หากอาการไม่ดีขึ้นหรือรุนแรงขึ้น ควรพบผู้เชี่ยวชาญ
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
