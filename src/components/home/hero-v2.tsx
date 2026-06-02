import { ArrowRight, MapPin } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Link } from '@/i18n/navigation'

// Hero — "ไม่มีใครควรรู้ตัวเมื่อสายเกินไป" as primary headline
export async function HeroV2() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0a1628]">
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: '52px 52px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[260px] bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-5 pt-14 pb-12 sm:pt-20 sm:pb-16 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/8 px-4 py-1.5 mb-7">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-medium text-teal-300">
            อิงหลักฐานทางการแพทย์ · ฟรี
          </span>
        </div>

        {/* Primary headline — the mission */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.1] mb-5">
          ไม่มีใครควรรู้ตัว
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-300">
            เมื่อสายเกินไป
          </span>
        </h1>

        {/* Subheadline — platform description */}
        <p className="text-base sm:text-lg text-slate-300 leading-[1.75] mb-3 max-w-xl mx-auto">
          FirstScreen ช่วยให้คุณประเมินความเสี่ยงสุขภาพ
          ค้นหาอาการเบื้องต้น และวางแผนตรวจคัดกรอง
          ด้วยข้อมูลที่อิงหลักฐานทางการแพทย์
        </p>

        {/* Supporting line */}
        <p className="text-sm text-slate-500 mb-8">
          หลายโรคสามารถรักษาได้ หากตรวจพบตั้งแต่ระยะเริ่มต้น
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
          {/* Primary */}
          <ButtonLink
            href="/risk"
            size="lg"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3.5 text-base rounded-xl shadow-lg shadow-teal-900/40 hover:shadow-teal-800/50 transition-all"
          >
            เริ่มประเมินฟรี
            <ArrowRight className="ml-2 h-5 w-5" />
          </ButtonLink>
          {/* Secondary — Body Map */}
          <Link
            href="/body-map"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white px-8 py-3.5 text-base font-medium transition-all"
          >
            <MapPin className="h-4 w-4" />
            เลือกตำแหน่งอาการ
          </Link>
        </div>

        {/* Trust sources */}
        <p className="text-slate-600 text-xs">
          อ้างอิงจาก{' '}
          <span className="text-slate-400 font-medium">WHO · สธ. ไทย · USPSTF · GRADE</span>
        </p>
      </div>
    </section>
  )
}
