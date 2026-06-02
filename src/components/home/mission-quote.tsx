import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

// Mission Quote Section — placed between Hero and Popular Screenings
// Emotional, minimal, premium HealthTech aesthetic
// No emoji. No stock photos. Dark navy/teal gradient.

export function MissionQuote() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1628] to-teal-950">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/6 rounded-full blur-[80px]" />
      </div>

      {/* Decorative quote mark — pure CSS, no emoji */}
      <div
        className="absolute top-6 left-6 sm:left-10 text-[120px] sm:text-[160px] leading-none text-teal-500/8 font-serif select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-16 sm:py-20 text-center">

        {/* Main quote */}
        <blockquote>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
            ไม่มีใครควรรู้ตัว
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              เมื่อสายเกินไป
            </span>
          </p>
        </blockquote>

        {/* Supporting copy */}
        <p className="text-base sm:text-lg text-slate-400 leading-[1.8] max-w-lg mx-auto mb-3">
          FirstScreen ถูกสร้างขึ้นเพื่อให้ทุกคน
          เข้าถึงการประเมินความเสี่ยงและการคัดกรอง
          ที่อิงหลักฐานทางการแพทย์
        </p>

        {/* Smaller supporting line */}
        <p className="text-sm text-slate-500 mb-10">
          เพราะหลายโรคมีโอกาสรักษาได้ดีขึ้น หากตรวจพบตั้งแต่ระยะเริ่มต้น
        </p>

        {/* CTA */}
        <ButtonLink
          href="/risk"
          size="lg"
          className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3.5 text-sm rounded-xl shadow-lg shadow-teal-900/40 hover:shadow-teal-800/50 transition-all"
        >
          เริ่มประเมินฟรี
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonLink>
      </div>
    </section>
  )
}
