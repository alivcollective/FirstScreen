import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FlaskConical, ShieldCheck, Search, FileCheck, RefreshCw,
  AlertCircle, ChevronRight, Scale, BookOpen, Users,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'วิธีการและมาตรฐาน — Methodology | FirstScreen',
  description: 'FirstScreen ใช้กระบวนการอะไรในการสร้างเนื้อหาและเครื่องมือประเมิน — แหล่งข้อมูล ระดับหลักฐาน และกระบวนการตรวจสอบ',
}

const STEPS = [
  {
    n: '01',
    icon: Search,
    title: 'รวบรวมแหล่งข้อมูลปฐมภูมิ',
    desc: 'ทีมแพทย์ของเรารวบรวมแนวทางปฏิบัติจากองค์กรสากลและไทย — WHO, USPSTF, NICE, ESC, ADA, NCCN, กรมการแพทย์ สธ., สปสช., ราชวิทยาลัยต่างๆ',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    n: '02',
    icon: Scale,
    title: 'ประเมินระดับหลักฐาน',
    desc: 'แต่ละคำแนะนำถูกจัดระดับหลักฐานตาม GRADE framework: A (RCT/Systematic Review), B (Cohort Studies), C (Expert Consensus)',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    n: '03',
    icon: Users,
    title: 'ปรับสำหรับบริบทไทย',
    desc: 'เราไม่แค่แปลแนวทางต่างชาติ แต่ระบุว่าอะไรใช้ได้จริงในประเทศไทย — เช่น Asian BMI cutoffs, สิทธิ NHSO, ระบบ 30 บาท',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    n: '04',
    icon: FileCheck,
    title: 'ตรวจสอบโดยแพทย์',
    desc: 'เนื้อหาทุกชิ้นถูกทบทวนโดยแพทย์ผู้เชี่ยวชาญก่อนเผยแพร่ — ใส่ชื่อผู้ตรวจสอบและวันที่ไว้ชัดเจน',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    n: '05',
    icon: RefreshCw,
    title: 'อัปเดตต่อเนื่อง',
    desc: 'แนวทางปฏิบัติเปลี่ยนแปลงตลอดเวลา ทีมเราติดตามการปรับปรุงจากทุกองค์กรและอัปเดตเนื้อหาทันที',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
]

const EVIDENCE_SYSTEM = [
  { grade: 'A', label: 'หลักฐานแข็งแกร่ง', desc: 'Systematic Reviews, RCTs, Meta-analyses', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { grade: 'B', label: 'หลักฐานปานกลาง', desc: 'Cohort Studies, Observational Studies', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { grade: 'C', label: 'ฉันทามติผู้เชี่ยวชาญ', desc: 'Expert Consensus, Clinical Practice Guidelines', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { grade: 'I', label: 'หลักฐานไม่เพียงพอ', desc: 'Insufficient evidence — รอข้อมูลเพิ่มเติม', color: 'bg-slate-100 text-slate-700 border-slate-300' },
]

const LIMITATIONS = [
  'เนื้อหาทั้งหมดอยู่ระหว่างการตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ — ยังไม่ถือเป็น "certified" content',
  'แนวทางปฏิบัติอาจแตกต่างกันตามบริบทของผู้ป่วยแต่ละราย',
  'เนื้อหาบางส่วนอ้างอิงจากแนวทางต่างประเทศที่อาจไม่ได้รับการ validate สำหรับประชากรไทย',
  'เครื่องมือประเมินความเสี่ยงใช้เพื่อการนำทางเท่านั้น — ไม่ใช่การวินิจฉัย',
  'ข้อมูลสถานพยาบาลอาจมีการเปลี่ยนแปลง — ตรวจสอบกับสถานพยาบาลโดยตรง',
]

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <FlaskConical className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-teal-300 bg-teal-500/10 rounded-full px-3 py-0.5">
                วิธีการและมาตรฐาน
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">วิธีการและมาตรฐาน</h1>
            <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
              FirstScreen ใช้กระบวนการอะไรในการสร้างเนื้อหา ประเมินหลักฐาน และให้คำแนะนำ
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-12">

          {/* Core principle */}
          <section className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
            <ShieldCheck className="h-8 w-8 text-teal-600 mb-3" />
            <h2 className="text-lg font-bold text-teal-800 mb-2">หลักการสำคัญ</h2>
            <p className="text-sm text-teal-700 leading-relaxed">
              FirstScreen ไม่ใช่ AI chatbot และไม่ใช่เว็บไซต์สุขภาพทั่วไป เราคือ{' '}
              <strong>แพลตฟอร์มนำทางสุขภาพเชิงป้องกัน</strong> ที่ใช้แนวทางปฏิบัติทางการแพทย์จริงๆ
              เป็นพื้นฐาน ไม่ใช่ algorithm สร้างเนื้อหาอัตโนมัติ
            </p>
          </section>

          {/* Process steps */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">กระบวนการสร้างเนื้อหา</h2>
            <div className="space-y-4">
              {STEPS.map(step => {
                const Icon = step.icon
                return (
                  <div key={step.n} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5">
                    <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', step.bg)}>
                      <Icon className={cn('h-5 w-5', step.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400">{step.n}</span>
                        <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Evidence system */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">ระบบจัดระดับหลักฐาน</h2>
            <p className="text-sm text-slate-600 mb-5">
              FirstScreen ใช้ระบบระดับหลักฐานที่ปรับมาจาก GRADE (Grading of Recommendations Assessment, Development and Evaluation)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EVIDENCE_SYSTEM.map(ev => (
                <div key={ev.grade} className={cn('rounded-xl border p-4', ev.color)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-black">{ev.grade}</span>
                    <span className="text-sm font-semibold">{ev.label}</span>
                  </div>
                  <p className="text-xs opacity-80">{ev.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sources */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">แหล่งข้อมูลหลัก</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'กระทรวงสาธารณสุข (สธ.)', type: 'ไทย' },
                { name: 'สปสช. (NHSO)', type: 'ไทย' },
                { name: 'สมาคมวิชาชีพแพทย์ไทย', type: 'ไทย' },
                { name: 'WHO', type: 'สากล' },
                { name: 'USPSTF', type: 'USA' },
                { name: 'NICE', type: 'UK' },
                { name: 'ESC/ESH', type: 'EU' },
                { name: 'ADA', type: 'USA' },
                { name: 'NCCN', type: 'USA' },
                { name: 'AHA/ACC', type: 'USA' },
                { name: 'AASLD/EASL', type: 'Hepatology' },
                { name: 'KDIGO', type: 'Nephrology' },
              ].map(src => (
                <div key={src.name} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                  <p className="text-xs font-medium text-slate-800">{src.name}</p>
                  <p className="text-[10px] text-slate-400">{src.type}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Limitations */}
          <section>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-bold text-amber-800">ข้อจำกัดที่ควรรู้</h2>
              </div>
              <ul className="space-y-2">
                {LIMITATIONS.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-col sm:flex-row gap-4">
            <Link href="/guidelines" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 text-sm font-semibold text-white hover:bg-teal-700 transition-colors">
              <Scale className="h-4 w-4" />
              ศูนย์แนวทางการแพทย์
            </Link>
            <Link href="/medical-advisors" className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Users className="h-4 w-4" />
              ทีมแพทย์ของเรา
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
