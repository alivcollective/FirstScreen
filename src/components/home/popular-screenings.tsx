import { Link } from '@/i18n/navigation'
import {
  HeartPulse, Ribbon, Droplets, Wind,
  Brain, ChevronRight, ArrowRight,
} from 'lucide-react'

// Icon mapping — no emojis, vector icons only
const SCREENINGS = [
  {
    title: 'โรคหัวใจ',
    subtitle: 'CVD Risk',
    time: '3 นาที',
    href: '/risk#cvd',
    icon: HeartPulse,
    accent: 'text-rose-400',
    glow: 'group-hover:shadow-rose-500/10',
  },
  {
    title: 'มะเร็ง',
    subtitle: '5 ชนิดหลัก',
    time: '5 นาที',
    href: '/risk#cancer',
    icon: Ribbon,
    accent: 'text-violet-400',
    glow: 'group-hover:shadow-violet-500/10',
  },
  {
    title: 'เบาหวาน',
    subtitle: 'FINDRISC',
    time: '2 นาที',
    href: '/risk#diabetes',
    icon: Droplets,
    accent: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/10',
  },
  {
    title: 'มะเร็งปอด',
    subtitle: 'NLST',
    time: '2 นาที',
    href: '/guidelines/lung-cancer',
    icon: Wind,
    accent: 'text-sky-400',
    glow: 'group-hover:shadow-sky-500/10',
  },
  {
    title: 'หลอดเลือดสมอง',
    subtitle: 'Stroke Risk',
    time: '3 นาที',
    href: '/diseases/stroke',
    icon: Brain,
    accent: 'text-teal-400',
    glow: 'group-hover:shadow-teal-500/10',
  },
] as const

export function PopularScreenings() {
  return (
    <section className="bg-slate-900 pb-6 pt-0">
      <div className="mx-auto max-w-4xl px-5">
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-3 pt-5">
          คัดกรองยอดนิยม
        </p>

        {/* Horizontal scroll — snap, no emojis */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
          {SCREENINGS.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`group flex-shrink-0 snap-start flex flex-col items-center gap-2.5 rounded-[18px] border border-white/[0.07] bg-white/[0.035] backdrop-blur-sm p-4 w-[116px] sm:w-[126px] hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg transition-all ${s.glow}`}
                aria-label={`ตรวจคัดกรอง${s.title}`}
              >
                {/* Icon container */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] group-hover:bg-white/10 transition-colors`}>
                  <Icon className={`h-5 w-5 ${s.accent}`} strokeWidth={1.75} />
                </div>

                <div className="text-center">
                  <p className="text-[13px] font-semibold text-white leading-tight">{s.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.subtitle}</p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] text-slate-400">
                  {s.time}
                </span>
              </Link>
            )
          })}

          {/* See all */}
          <Link
            href="/risk"
            className="flex-shrink-0 snap-start flex flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-white/10 bg-transparent p-4 w-[116px] sm:w-[126px] hover:border-teal-500/30 hover:bg-teal-500/[0.04] transition-all group"
            aria-label="ดูการประเมินทั้งหมด"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] group-hover:bg-teal-500/10 transition-colors">
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 group-hover:text-teal-400 text-center transition-colors">
              ดูทั้งหมด
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
