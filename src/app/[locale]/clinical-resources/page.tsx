import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Microscope, Scale, FlaskConical, BookOpen, Users,
  ChevronRight, Heart, Droplets, Ribbon, Activity,
  Filter, Calendar, User,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ScreeningKnowledgeEngine } from '@/components/screening/ScreeningKnowledgeEngine'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'ทรัพยากรทางคลินิก — แหล่งความรู้สำหรับบุคลากรสาธารณสุข | FirstScreen',
  description: 'แนวทางคัดกรอง อัลกอริทึมทางคลินิก และทรัพยากรสำหรับแพทย์ พยาบาล นักศึกษาแพทย์ และบุคลากรสาธารณสุข',
}

const AUDIENCES = [
  { label: 'แพทย์', en: 'Physicians', icon: User, color: 'text-teal-600 bg-teal-50' },
  { label: 'พยาบาล', en: 'Nurses', icon: Users, color: 'text-sky-600 bg-sky-50' },
  { label: 'นักศึกษาแพทย์', en: 'Medical Students', icon: BookOpen, color: 'text-violet-600 bg-violet-50' },
  { label: 'เภสัชกร', en: 'Pharmacists', icon: FlaskConical, color: 'text-amber-600 bg-amber-50' },
  { label: 'สาธารณสุข', en: 'Public Health', icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
]

const RESOURCES = [
  {
    title: 'ศูนย์แนวทางการแพทย์',
    desc: 'เปรียบเทียบแนวทางไทยกับ WHO USPSTF NICE ESC ADA NCCN สำหรับ 9 โรคหลัก',
    href: '/guidelines',
    icon: Scale,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    badge: 'ฟีเจอร์หลัก',
    diseases: ['โรคหัวใจ', 'เบาหวาน', 'มะเร็งเต้านม', '+6'],
  },
  {
    title: 'เครื่องมือประเมินความเสี่ยง',
    desc: 'Framingham CVD Risk, FINDRISC (ปรับสำหรับเอเชีย), ความเสี่ยงมะเร็ง, PHQ-9/GAD-7',
    href: '/risk',
    icon: Activity,
    color: 'text-red-600',
    bg: 'bg-red-50',
    badge: 'เครื่องมือทางคลินิก',
    diseases: ['Framingham', 'FINDRISC', 'NLST', 'PHQ-9'],
  },
  {
    title: 'ระบบตรวจอาการ',
    desc: '7 ขั้นตอน OLDCARTS สัมภาษณ์ทางคลินิก พร้อมระบบวิเคราะห์อาการ',
    href: '/symptoms',
    icon: Microscope,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    badge: 'OLDCARTS / ICD-11',
    diseases: ['OLDCARTS', 'AUDIT-C', 'วิเคราะห์อาการ', 'ความเร่งด่วน'],
  },
  {
    title: 'คลังข้อมูลโรค',
    desc: 'ข้อมูลทางคลินิกครบถ้วน: อาการ ปัจจัยเสี่ยง การคัดกรอง การรักษา การป้องกัน',
    href: '/diseases',
    icon: BookOpen,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    badge: 'รหัส ICD-10',
    diseases: ['หัวใจ', 'เบาหวาน', 'มะเร็ง', '+4'],
  },
]

export default function ClinicalResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <Microscope className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-teal-300 bg-teal-500/10 rounded-full px-3 py-0.5">
                ทรัพยากรทางคลินิก
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              ทรัพยากรทางคลินิก
            </h1>
            <p className="text-slate-400 text-base max-w-2xl leading-relaxed mb-6">
              สำหรับแพทย์ พยาบาล นักศึกษาแพทย์ และบุคลากรสาธารณสุข
            </p>

            {/* Audience chips */}
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map(a => (
                <span key={a.label} className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs text-white/80">
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

          {/* Resource cards */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">เครื่องมือทางคลินิก</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {RESOURCES.map(r => {
                const Icon = r.icon
                return (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 hover:border-teal-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', r.bg)}>
                        <Icon className={cn('h-5 w-5', r.color)} />
                      </div>
                      <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-1 text-[10px] font-semibold text-teal-700">
                        {r.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">
                      {r.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1">{r.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.diseases.map(d => (
                        <span key={d} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{d}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-teal-600 font-medium">
                      เปิดใช้งาน <ChevronRight className="h-3 w-3" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Screening Knowledge Engine */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                <Filter className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Screening Knowledge Engine</h2>
                <p className="text-sm text-slate-400">ค้นหาการตรวจคัดกรองตามอายุ เพศ และปัจจัยเสี่ยง</p>
              </div>
            </div>
            <ScreeningKnowledgeEngine />
          </section>

          {/* Quick reference cards */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">สรุปอ้างอิงด่วน</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'คำแนะนำระดับ A ของ USPSTF',
                  items: ['ตรวจความดัน (18+)', 'ตรวจเบาหวาน (35-70, BMI≥25)', 'มะเร็งลำไส้ใหญ่ (45-75)', 'มะเร็งปากมดลูก (21-65)', 'มะเร็งเต้านม (40-74)'],
                  color: 'border-emerald-200 bg-emerald-50',
                  headColor: 'text-emerald-800',
                },
                {
                  title: 'สปสช. สิทธิประโยชน์คัดกรอง',
                  items: ['วัดความดัน ฟรี', 'ตรวจน้ำตาล ทุก 3 ปี (35+)', 'Pap Smear ทุก 3 ปี (30-60)', 'Mammogram ทุกปี (40-70)', 'FIT test (50+) — เริ่มปี 66'],
                  color: 'border-teal-200 bg-teal-50',
                  headColor: 'text-teal-800',
                },
                {
                  title: 'การปรับตามเกณฑ์เอเชีย',
                  items: ['BMI ≥23 = น้ำหนักเกิน (ไม่ใช่ 25)', 'รอบเอว ชาย >90ซม. หญิง >80ซม.', 'เสี่ยงเบาหวานสูงกว่าที่ BMI ต่ำกว่า', 'เนื้อเต้านมหนาแน่นกว่า — อาจต้องอัลตร้าซาวด์เสริม', 'EGFR mutation ในผู้ไม่สูบบุหรี่สูงกว่าเฉลี่ย'],
                  color: 'border-sky-200 bg-sky-50',
                  headColor: 'text-sky-800',
                },
              ].map(ref => (
                <div key={ref.title} className={cn('rounded-2xl border p-5', ref.color)}>
                  <h3 className={cn('text-sm font-bold mb-3', ref.headColor)}>{ref.title}</h3>
                  <ul className="space-y-1.5">
                    {ref.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-50 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Methodology link */}
          <section className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white">
            <FlaskConical className="h-6 w-6 mb-3 text-teal-200" />
            <h3 className="text-base font-bold mb-2">วิธีการและแหล่งอ้างอิง</h3>
            <p className="text-sm text-teal-100 mb-4">
              ดูว่า FirstScreen ใช้กระบวนการอะไรในการสร้างเนื้อหา รวบรวมข้อมูล และระดับหลักฐาน
            </p>
            <Link href="/methodology" className="inline-flex items-center gap-2 rounded-xl bg-white text-teal-700 px-4 py-2.5 text-sm font-semibold hover:bg-teal-50 transition-colors">
              ดู Methodology <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
