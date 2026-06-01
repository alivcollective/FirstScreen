import type { Metadata } from 'next'
import { ShieldCheck, BookOpen, RefreshCw, UserCheck, Lock, Brain, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

export const metadata: Metadata = {
  title: 'Trust Center — นโยบายหลักฐานและความโปร่งใส | Health Compass',
  description: 'รู้จัก Health Compass — นโยบายหลักฐาน กระบวนการตรวจสอบ ความเป็นส่วนตัว และสิ่งที่แพลตฟอร์มนี้ทำและไม่ทำได้',
}

const canDo = [
  'ให้ข้อมูลสุขภาพที่อ้างอิงจากหลักฐานทางการแพทย์',
  'แสดงความเสี่ยงสุขภาพเบื้องต้นโดยใช้เครื่องคำนวณที่ผ่านการรับรอง',
  'นำทางให้คุณรู้ว่าควรพบแพทย์สาขาใดและเร่งด่วนแค่ไหน',
  'แสดงแผนการตรวจคัดกรองที่อ้างอิงแนวทางสุขภาพแห่งชาติ',
  'ช่วยให้คุณเตรียมคำถามก่อนพบแพทย์',
  'ให้ข้อมูลโรคที่ครบถ้วน อ้างอิงแหล่งที่มาชัดเจน',
  'ช่วยค้นหาสถานพยาบาลและผู้เชี่ยวชาญในพื้นที่',
]

const cannotDo = [
  'วินิจฉัยโรคหรือระบุว่าคุณเป็นโรคใด',
  'สั่งยาหรือแนะนำยาโดยเฉพาะเจาะจง',
  'แทนที่การตรวจร่างกายหรือการประเมินโดยแพทย์',
  'ให้ผลการตรวจทางห้องปฏิบัติการ',
  'ให้คำแนะนำฉุกเฉินทางการแพทย์',
  'รับประกันความแม่นยำสำหรับทุกบุคคลและทุกสถานการณ์',
  'ใช้แทนการดูแลสุขภาพจิตโดยผู้เชี่ยวชาญ',
]

const trustPillars = [
  {
    icon: BookOpen,
    title: 'นโยบายหลักฐาน (Evidence Policy)',
    description: 'ข้อมูลทางการแพทย์ทุกชิ้นต้องมีแหล่งอ้างอิงที่ระบุได้ โดยใช้ระบบการจัดระดับหลักฐาน GRADE (A-D) ตามมาตรฐานสากล แหล่งอ้างอิงที่ยังไม่ผ่านการตรวจสอบจะถูกระบุอย่างชัดเจนว่า "ต้องตรวจสอบก่อนเผยแพร่"',
  },
  {
    icon: UserCheck,
    title: 'กระบวนการตรวจสอบทางการแพทย์',
    description: 'เนื้อหาที่เกี่ยวกับการแพทย์ทุกชิ้นถูกตรวจสอบโดยแพทย์ผู้เชี่ยวชาญก่อนเผยแพร่ และมีรอบการทบทวนทุก 90 วัน เพื่อให้สอดคล้องกับแนวทางการแพทย์ปัจจุบัน',
  },
  {
    icon: RefreshCw,
    title: 'นโยบายการอัปเดต',
    description: 'แนวทางทางคลินิกเปลี่ยนแปลงอยู่เสมอ เราตั้งเป้าอัปเดตเนื้อหาทุก 90 วัน หรือทันทีเมื่อมีการเปลี่ยนแปลงแนวทางสำคัญ วันที่ตรวจสอบล่าสุดแสดงไว้ทุกหน้า',
  },
  {
    icon: Lock,
    title: 'ความเป็นส่วนตัวมาก่อน (Privacy First)',
    description: 'ข้อมูลสุขภาพของคุณเป็นของคุณ Health Compass ไม่ขายข้อมูลส่วนตัว การประเมินความเสี่ยงเบื้องต้นทำบนอุปกรณ์ของคุณโดยไม่ส่งข้อมูลไปยังเซิร์ฟเวอร์ แพลตฟอร์มเป็นไปตาม PDPA และ GDPR',
  },
  {
    icon: Brain,
    title: 'นโยบาย AI อย่างปลอดภัย',
    description: 'หากมีการใช้ AI ในแพลตฟอร์ม จะมีการระบุอย่างชัดเจน AI ไม่วินิจฉัยโรค คำตอบ AI ทุกชิ้นมีคำชี้แจงที่ชัดเจน และมีการตรวจสอบโดยทีมแพทย์ก่อนนำมาใช้',
  },
  {
    icon: ShieldCheck,
    title: 'ขอบเขตของแพลตฟอร์ม',
    description: 'Health Compass เป็นแพลตฟอร์มการนำทางสุขภาพและการให้ความรู้ ไม่ใช่แพลตฟอร์มการแพทย์ เราเชื่อมโยงคุณกับการดูแลที่เหมาะสม แต่ไม่แทนที่การดูแลนั้น',
  },
]

export default function TrustPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <span className="text-sm font-medium text-teal-300">Trust Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ความโปร่งใสและความน่าเชื่อถือ
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Health Compass สร้างขึ้นบนความโปร่งใส ความน่าเชื่อถือทางการแพทย์ และความเป็นส่วนตัวของผู้ใช้ หน้านี้อธิบายว่าเราทำงานอย่างไร ทำอะไรได้ และทำอะไรไม่ได้
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-14 space-y-16">

          {/* What we can and cannot do */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Health Compass ทำอะไรได้และทำอะไรไม่ได้
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-emerald-800">ทำได้</h3>
                </div>
                <ul className="space-y-2.5">
                  {canDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-red-50 border border-red-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="text-base font-bold text-red-800">ทำไม่ได้</h3>
                </div>
                <ul className="space-y-2.5">
                  {cannotDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Trust Pillars */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              นโยบายและกระบวนการ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {trustPillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                        <Icon className="h-5 w-5 text-teal-600" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{pillar.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* GRADE System */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              ระบบจัดระดับหลักฐาน (GRADE)
            </h2>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              Health Compass ใช้ระบบ GRADE (Grading of Recommendations Assessment, Development and Evaluation) ซึ่งเป็นมาตรฐานสากลที่ใช้โดย WHO, Cochrane, และองค์กรการแพทย์ชั้นนำทั่วโลก
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { grade: 'A', label: 'แข็งแกร่ง', desc: 'การทดลองแบบสุ่มหลายชิ้นหรือการทบทวนอย่างเป็นระบบ', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
                { grade: 'B', label: 'ปานกลาง', desc: 'การทดลองที่ออกแบบดีและมีผลสอดคล้อง', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
                { grade: 'C', label: 'จำกัด', desc: 'ความเห็นเชี่ยวชาญหรือหลักฐานจำกัด', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
                { grade: 'D', label: 'ความเห็นผู้เชี่ยวชาญ', desc: 'ประสบการณ์ทางคลินิก', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
              ].map(({ grade, label, desc, color, bg }) => (
                <div key={grade} className={`rounded-xl border p-4 ${bg}`}>
                  <div className={`text-3xl font-black mb-1 ${color}`}>{grade}</div>
                  <div className={`text-sm font-semibold mb-1 ${color}`}>{label}</div>
                  <div className="text-xs text-slate-500">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              ข้อจำกัดในสถานการณ์ฉุกเฉิน
            </h2>
            <MedicalDisclaimer variant="emergency" locale="th" />
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Health Compass ไม่ใช่บริการฉุกเฉิน</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    แพลตฟอร์มนี้ไม่สามารถรับมือกับสถานการณ์ฉุกเฉินทางการแพทย์ได้ หากคุณหรือผู้อื่นมีอาการฉุกเฉิน:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li>• โทร <strong>1669</strong> (EMS ฉุกเฉิน ไทย)</li>
                    <li>• โทร <strong>1724</strong> (สายด่วนสุขภาพจิต)</li>
                    <li>• ไปห้องฉุกเฉินที่ใกล้ที่สุดทันที</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Full Disclaimer */}
          <section className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">ข้อจำกัดความรับผิดชอบฉบับเต็ม</h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Health Compass</strong> ให้ข้อมูลสุขภาพเพื่อการศึกษาและการนำทางเท่านั้น
                ข้อมูลที่ปรากฏในแพลตฟอร์มนี้ไม่ใช่และไม่ควรถูกตีความว่าเป็นคำแนะนำทางการแพทย์
                การวินิจฉัยโรค หรือการรักษา
              </p>
              <p>
                ผลการประเมินความเสี่ยงและการนำทางอาการในแพลตฟอร์มนี้อ้างอิงจากเครื่องมือทางระบาดวิทยาและหลักฐาน
                ทางการแพทย์ที่เผยแพร่แล้ว แต่ไม่สามารถแทนที่การตรวจร่างกายและการประเมินโดยแพทย์ผู้มีใบอนุญาต
              </p>
              <p>
                หากคุณมีข้อสงสัยเกี่ยวกับสุขภาพของคุณ ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญด้านสุขภาพที่มีคุณสมบัติเสมอ
                อย่าล่าช้าในการขอรับการดูแลทางการแพทย์เนื่องจากข้อมูลที่ได้รับจากแพลตฟอร์มนี้
              </p>
              <p className="font-medium text-slate-700 pt-2 border-t border-slate-200">
                สายด่วนฉุกเฉิน: <a href="tel:1669" className="text-teal-600 font-bold">1669</a> |
                สายด่วนสุขภาพจิต: <a href="tel:1323" className="text-teal-600 font-bold">1323</a> |
                สายด่วนสุขภาพ: <a href="tel:1422" className="text-teal-600 font-bold">1422</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
