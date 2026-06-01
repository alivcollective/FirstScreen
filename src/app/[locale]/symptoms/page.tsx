// Server Component — no 'use client' here
import type { Metadata } from 'next'
import { Stethoscope, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SymptomWizardClient } from '@/components/symptoms/SymptomWizardClient'

export const metadata: Metadata = {
  title: 'ตรวจอาการเบื้องต้น — Symptom Checker | Health Compass',
  description: 'ระบบตรวจอาการเพื่อการนำทางสุขภาพ 4 ขั้นตอน — ไม่ใช่การวินิจฉัยโรค',
}

export default function SymptomsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                <Stethoscope className="h-5 w-5 text-sky-400" />
              </div>
              <span className="text-sm font-semibold text-sky-300 bg-sky-500/10 rounded-full px-3 py-0.5">
                ตรวจอาการเบื้องต้น
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">ตรวจอาการเบื้องต้น</h1>
            <p className="text-slate-400 text-sm max-w-xl">
              เลือกอาการ รับการวิเคราะห์ว่าควรพบแพทย์เมื่อไหร่
              <span className="font-medium text-amber-400"> ไม่ใช่การวินิจฉัยโรค</span>
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-300">
                อาการฉุกเฉิน เช่น เจ็บหน้าอกรุนแรง หายใจไม่ออก:{' '}
                <a href="tel:1669" className="font-bold text-amber-300">โทร 1669</a>{' '}
                ทันที อย่ารอกรอกแบบสอบถาม
              </p>
            </div>
          </div>
        </div>
        <SymptomWizardClient />
      </main>
      <Footer />
    </div>
  )
}
