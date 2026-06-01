import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Activity, Heart, Droplets, Brain, AlertCircle, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { DiabetesCalculator } from '@/components/risk/diabetes-calculator'
import { CVDCalculator } from '@/components/risk/cvd-calculator'
import { MentalHealthCalculator } from '@/components/risk/mental-health-calculator'
import { CancerRiskAssessment } from '@/components/risk/cancer-risk-assessment'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'ประเมินความเสี่ยงสุขภาพ — Risk Assessment | Health Compass',
  description: 'ประเมินความเสี่ยงโรคหัวใจ เบาหวาน มะเร็ง และสุขภาพจิต ด้วยเครื่องคำนวณทางการแพทย์ที่ผ่านการรับรอง',
}

const riskModules = [
  {
    id: 'cardiovascular',
    icon: Heart,
    titleTh: 'ความเสี่ยงหัวใจและหลอดเลือด',
    subtitleTh: 'Framingham 10-Year CVD Risk',
    descTh: 'คำนวณความเสี่ยง 10 ปีของหัวใจวายหรือโรคหลอดเลือดสมอง',
    time: '3-4 นาที',
    color: 'text-red-600', bg: 'bg-red-50', anchor: '#cvd', available: true,
  },
  {
    id: 'diabetes',
    icon: Droplets,
    titleTh: 'ความเสี่ยงเบาหวาน',
    subtitleTh: 'FINDRISC — ปรับสำหรับคนเอเชีย',
    descTh: 'ประเมินความเสี่ยงเบาหวานชนิดที่ 2 ปรับสำหรับประชากรไทยและเอเชีย',
    time: '2 นาที',
    color: 'text-amber-600', bg: 'bg-amber-50', anchor: '#diabetes', available: true,
  },
  {
    id: 'mental',
    icon: Brain,
    titleTh: 'ตรวจสุขภาพจิต',
    subtitleTh: 'PHQ-9 ซึมเศร้า + GAD-7 วิตกกังวล',
    descTh: 'เครื่องมือคัดกรองที่ผ่านการรับรองระดับสากล พร้อมแนะนำทรัพยากรความช่วยเหลือ',
    time: '3 นาที',
    color: 'text-cyan-600', bg: 'bg-cyan-50', anchor: '#mental', available: true,
  },
  {
    id: 'cancer',
    icon: Activity,
    titleTh: 'ความเสี่ยงมะเร็ง',
    subtitleTh: 'เต้านม · ปากมดลูก · ลำไส้ใหญ่ · ตับ',
    descTh: 'ประเมินความเสี่ยงมะเร็ง 4 ชนิดที่พบบ่อยในไทย อ้างอิง NCCN, WHO, กรมการแพทย์',
    time: '5 นาที',
    color: 'text-violet-600', bg: 'bg-violet-50', anchor: '#cancer', available: true,
  },
]

export default async function RiskPage() {
  const t = await getTranslations()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-12">
          <div className="mx-auto max-w-5xl px-6">
            <Badge className="mb-4 bg-teal-500/10 text-teal-300 border-teal-500/20">
              แพลตฟอร์มประเมินความเสี่ยง
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              ทำความเข้าใจความเสี่ยงสุขภาพของคุณ
            </h1>
            <p className="text-slate-400 max-w-2xl">
              เครื่องคำนวณทางการแพทย์ที่ผ่านการรับรอง ให้ภาพความเสี่ยงเฉพาะบุคคล พร้อมขั้นตอนปฏิบัติที่ชัดเจน
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-16">

          {/* Disclaimer */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">ข้อมูลเพื่อการศึกษาเท่านั้น</p>
              <p className="text-sm text-amber-700 mt-0.5">
                การประเมินเหล่านี้อ้างอิงจากเครื่องคำนวณทางการแพทย์ที่ผ่านการรับรอง แต่ไม่ใช่การวินิจฉัยโรค ควรนำผลไปปรึกษาแพทย์เสมอ
              </p>
            </div>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {riskModules.map(m => {
              const Icon = m.icon
              return (
                <a key={m.id} href={m.available ? m.anchor : undefined}
                  className={`relative rounded-2xl border bg-white p-5 transition-all ${m.available?'hover:shadow-md hover:border-teal-300 cursor-pointer':'opacity-70 cursor-default'}`}>
                  {!m.available && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                      เร็วๆ นี้
                    </span>
                  )}
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${m.bg} mb-3`}>
                    <Icon className={`h-5 w-5 ${m.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5 leading-tight">{m.titleTh}</h3>
                  <p className="text-[11px] text-slate-400 mb-2">{m.subtitleTh} · {m.time}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.descTh}</p>
                  {m.available && (
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-600">
                      ทำแบบประเมิน <ChevronRight className="h-3 w-3" />
                    </div>
                  )}
                </a>
              )
            })}
          </div>

          {/* CVD Calculator */}
          <div id="cvd" className="scroll-mt-20">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">ประเมินความเสี่ยงหัวใจและหลอดเลือด</h2>
              <p className="text-slate-500 text-sm mt-1">Framingham Heart Study Risk Score — คำนวณความเสี่ยง 10 ปีของหัวใจวายหรือ Stroke</p>
            </div>
            <div className="max-w-2xl">
              <CVDCalculator />
            </div>
          </div>

          {/* Diabetes Calculator */}
          <div id="diabetes" className="scroll-mt-20">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">ประเมินความเสี่ยงเบาหวาน</h2>
              <p className="text-slate-500 text-sm mt-1">FINDRISC ปรับสำหรับประชากรเอเชีย — คะแนนเสี่ยงเบาหวานชนิดที่ 2</p>
            </div>
            <div className="max-w-2xl">
              <DiabetesCalculator />
            </div>
            <div className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">เกี่ยวกับเครื่องคำนวณ FINDRISC</h3>
              <div className="text-sm text-slate-600 space-y-2">
                <p><strong>FINDRISC</strong> เป็นเครื่องมือประเมินความเสี่ยงเบาหวานที่ได้รับการรับรองระดับสากล พัฒนาโดย Finnish Diabetes Association เวอร์ชันนี้ปรับตามเกณฑ์ BMI ของ WHO สำหรับประชากรเอเชีย</p>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">อ้างอิง (ต้องตรวจสอบก่อนเผยแพร่)</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Lindström J, Tuomilehto J. Diabetes Care. 2003</li>
                    <li>• WHO Expert Consultation on BMI cutoffs for Asian populations. 2004</li>
                    <li>• Aekplakorn W, et al. Diabetes Research Thailand. 2006</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Health Calculator */}
          <div id="mental" className="scroll-mt-20">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">ตรวจสุขภาพจิต</h2>
              <p className="text-slate-500 text-sm mt-1">PHQ-9 (ซึมเศร้า) และ GAD-7 (วิตกกังวล) — เครื่องมือที่ผ่านการรับรองระดับสากล</p>
            </div>
            <div className="max-w-2xl">
              <MentalHealthCalculator />
            </div>
          </div>

          {/* Cancer Risk Assessment */}
          <div id="cancer" className="scroll-mt-20">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">ประเมินความเสี่ยงมะเร็ง</h2>
              <p className="text-slate-500 text-sm mt-1">
                คัดกรองความเสี่ยง 4 ชนิดมะเร็งที่พบบ่อยในไทย — อ้างอิง NCCN, WHO, กรมการแพทย์ สธ.
              </p>
            </div>
            <div className="max-w-2xl">
              <CancerRiskAssessment />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
