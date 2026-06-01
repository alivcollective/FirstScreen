import type { Metadata } from 'next'
import { Heart, Target, Shield, Globe, Users, Lightbulb } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา — About Health Compass',
  description: 'Health Compass คือแพลตฟอร์มนำทางสุขภาพเชิงป้องกันที่สร้างขึ้นสำหรับประเทศไทยและโลก',
}

const PILLARS = [
  { icon: Shield, title: 'ความน่าเชื่อถือ', desc: 'ข้อมูลทุกชิ้นอิงหลักฐานทางการแพทย์ ตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ และอ้างอิงแหล่งที่มาชัดเจน' },
  { icon: Target, title: 'ป้องกันก่อนเจ็บป่วย', desc: 'เน้นการตรวจพบตั้งแต่เนิ่นๆ ประเมินความเสี่ยง และวางแผนการดูแลสุขภาพล่วงหน้า' },
  { icon: Globe, title: 'ไทยก่อน โลกต่อไป', desc: 'เริ่มจากประเทศไทย ออกแบบสำหรับขยายไปทั่วโลก รองรับ 100+ ภาษาในอนาคต' },
  { icon: Users, title: 'สำหรับทุกคน', desc: 'ไม่ใช่แค่คนรวยหรือคนมีเวลา แต่สำหรับทุกคนที่ต้องการดูแลสุขภาพตัวเองและครอบครัว' },
  { icon: Lightbulb, title: 'ให้ความรู้ ไม่วินิจฉัย', desc: 'เราให้ข้อมูลเพื่อนำทาง ไม่ใช่วินิจฉัยโรค แพทย์คือคนที่บอกว่าคุณเป็นอะไร เราบอกว่าคุณควรพบแพทย์คนไหน' },
  { icon: Shield, title: 'ความเป็นส่วนตัว', desc: 'ข้อมูลสุขภาพของคุณเป็นของคุณ ไม่ขาย ไม่แบ่งปัน ปฏิบัติตาม PDPA อย่างเคร่งครัด' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20">
                <Heart className="h-8 w-8 text-teal-400" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">เกี่ยวกับ Health Compass</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              แพลตฟอร์มนำทางสุขภาพเชิงป้องกัน สร้างขึ้นด้วยความเชื่อที่ว่า ทุกคนสมควรเข้าถึงข้อมูลสุขภาพที่ถูกต้อง น่าเชื่อถือ และเข้าใจง่าย
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">พันธกิจ</h2>
            <div className="rounded-2xl bg-teal-50 border border-teal-200 p-8">
              <p className="text-xl font-medium text-teal-900 leading-relaxed">
                ขจัดความทุกข์ทรมานที่ป้องกันได้ด้วยการนำทางสุขภาพที่ดีกว่า
              </p>
              <p className="text-slate-600 mt-3">
                70% ของการเสียชีวิตในไทยเกิดจากโรคที่ป้องกันได้หรือตรวจพบได้ตั้งแต่เนิ่นๆ Health Compass สร้างขึ้นเพื่อปิดช่องว่างนั้น
              </p>
            </div>
          </section>

          {/* What we are */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Compass คืออะไร</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-3">เราคือ "GPS สุขภาพ"</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  เหมือน Google Maps ที่แสดงเส้นทาง Health Compass แสดงให้คุณเห็นว่า ตอนนี้คุณอยู่ที่ไหนในเรื่องสุขภาพ ความเสี่ยงอะไรที่ต้องระวัง และเส้นทางที่ดีที่สุดสู่การดูแลที่เหมาะสมคืออะไร
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-3">เราไม่ใช่แอปวินิจฉัยโรค</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Health Compass ไม่บอกว่าคุณเป็นโรคอะไร แต่ช่วยให้คุณเข้าใจความเสี่ยง รู้ว่าควรพบแพทย์เมื่อไหร่ และเตรียมตัวก่อนพบแพทย์อย่างไรให้ได้ประโยชน์สูงสุด
                </p>
              </div>
            </div>
          </section>

          {/* Pillars */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">หลักการที่เรายึดมั่น</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PILLARS.map((p, i) => {
                const Icon = p.icon
                return (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 mb-3">
                      <Icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{p.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Vision */}
          <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">วิสัยทัศน์ 10 ปี</h2>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
              เป็นแพลตฟอร์มนำทางสุขภาพเชิงป้องกันที่น่าเชื่อถือที่สุดในโลก เริ่มจากประเทศไทย ขยายไปอาเซียน และสู่ 100+ ประเทศ ช่วยให้ผู้คน 1,000 ล้านคนเข้าถึงการนำทางสุขภาพที่มีคุณภาพ
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              {[['1B+','ผู้ใช้ (10 ปี)'],['100+','ประเทศ'],['2M+','ชีวิตที่ช่วยได้']].map(([v,l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-teal-400">{v}</div>
                  <div className="text-xs text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-3">ร่วมเป็นส่วนหนึ่งของภารกิจนี้</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-lg mx-auto">
              ไม่ว่าจะเป็นผู้ใช้ พาร์ตเนอร์โรงพยาบาล นักวิจัย หรือนักพัฒนา มีหลายวิธีที่คุณจะร่วมสร้างอนาคตของสุขภาพเชิงป้องกัน
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/risk" className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors">
                เริ่มใช้งาน
              </Link>
              <Link href="/trust" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-teal-300 px-6 py-2.5 text-sm font-semibold transition-colors">
                นโยบายความน่าเชื่อถือ
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
