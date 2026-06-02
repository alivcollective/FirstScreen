import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, ShieldCheck, FlaskConical, Scale, AlertCircle, ChevronRight, Heart, Activity, Ribbon, Brain } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'ทีมแพทย์ที่ปรึกษา — Medical Advisors | FirstScreen',
  description: 'รู้จักทีมแพทย์ผู้เชี่ยวชาญที่ตรวจสอบเนื้อหาของ FirstScreen — คำมั่นสัญญาด้านความน่าเชื่อถือทางการแพทย์',
}

const ADVISOR_SLOTS = [
  {
    specialty: 'อายุรศาสตร์โรคหัวใจ',
    specialtyEn: 'Cardiology',
    role: 'ที่ปรึกษาด้านความเสี่ยง CVD และแนวทาง Framingham / ESC',
    icon: Heart,
    color: 'text-red-600',
    bg: 'bg-red-50',
    status: 'pending',
  },
  {
    specialty: 'อายุรศาสตร์ต่อมไร้ท่อ',
    specialtyEn: 'Endocrinology / Diabetes',
    role: 'ที่ปรึกษาด้าน FINDRISC และแนวทางเบาหวาน ADA/DAT',
    icon: Activity,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    status: 'pending',
  },
  {
    specialty: 'ศัลยศาสตร์มะเร็ง',
    specialtyEn: 'Oncology / Cancer Surgery',
    role: 'ที่ปรึกษาด้านการคัดกรองมะเร็งและแนวทาง NCCN/ACS',
    icon: Ribbon,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    status: 'pending',
  },
  {
    specialty: 'จิตเวชศาสตร์',
    specialtyEn: 'Psychiatry / Mental Health',
    role: 'ที่ปรึกษาด้าน PHQ-9 GAD-7 และแนวทางสุขภาพจิต',
    icon: Brain,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    status: 'pending',
  },
]

const COMMITMENTS = [
  { title: 'ชื่อจริง ตำแหน่งจริง', desc: 'แพทย์ที่ตรวจสอบเนื้อหาจะถูกระบุชื่อและสังกัดชัดเจน ไม่ใช่นามแฝง' },
  { title: 'วันที่ตรวจสอบ', desc: 'เนื้อหาทุกชิ้นแสดงวันที่ตรวจสอบล่าสุด เพื่อให้รู้ว่าข้อมูลยังทันสมัยหรือไม่' },
  { title: 'ระดับความเชี่ยวชาญ', desc: 'แพทย์ผู้ตรวจสอบต้องตรงกับเนื้อหา — โรคหัวใจตรวจสอบโดยแพทย์โรคหัวใจ' },
  { title: 'ความโปร่งใส 100%', desc: 'เนื้อหาที่ยังไม่ผ่านการตรวจสอบจะระบุชัดเจนว่า "รอการตรวจสอบ"' },
]

export default function MedicalAdvisorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <Users className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-teal-300 bg-teal-500/10 rounded-full px-3 py-0.5">
                ทีมแพทย์ที่ปรึกษา
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">ทีมแพทย์ที่ปรึกษา</h1>
            <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
              ความน่าเชื่อถือทางการแพทย์คือรากฐานของ FirstScreen
              เนื้อหาทุกชิ้นต้องผ่านการตรวจสอบโดยแพทย์ผู้เชี่ยวชาญก่อนเผยแพร่
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-12">

          {/* Status notice */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-amber-800 mb-2">สถานะปัจจุบัน</h2>
                <p className="text-sm text-amber-700 leading-relaxed">
                  FirstScreen อยู่ระหว่างการสร้างทีมแพทย์ที่ปรึกษา เนื้อหาปัจจุบันทั้งหมดระบุว่า
                  <strong> "รอการตรวจสอบ"</strong> และไม่ควรถูกใช้เป็นคำแนะนำทางคลินิก
                  เราจะประกาศชื่อแพทย์ที่ปรึกษาเมื่อได้รับการยืนยัน
                </p>
              </div>
            </div>
          </section>

          {/* Advisor slots */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">ตำแหน่งที่ปรึกษา</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ADVISOR_SLOTS.map(slot => {
                const Icon = slot.icon
                return (
                  <div key={slot.specialty} className={cn('rounded-2xl border p-5', slot.bg, 'border-slate-200')}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-white/80')}>
                        <Icon className={cn('h-5 w-5', slot.color)} />
                      </div>
                      <span className="rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        กำลังสรรหา
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">{slot.specialty}</h3>
                    <p className="text-[10px] text-slate-400 mb-2">{slot.specialtyEn}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{slot.role}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Commitments */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">คำมั่นสัญญาด้านความน่าเชื่อถือ</h2>
            <div className="space-y-3">
              {COMMITMENTS.map(c => (
                <div key={c.title} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4">
                  <ShieldCheck className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-col sm:flex-row gap-4">
            <Link href="/methodology" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 text-sm font-semibold text-white hover:bg-teal-700 transition-colors">
              <FlaskConical className="h-4 w-4" />
              ดูวิธีการและมาตรฐาน
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/trust" className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Scale className="h-4 w-4" />
              ศูนย์ความน่าเชื่อถือ
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
