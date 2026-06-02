import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

const SCREENINGS = [
  {
    emoji: '❤️',
    title: 'โรคหัวใจ',
    subtitle: 'ความเสี่ยง 10 ปี',
    time: '3 นาที',
    href: '/risk#cvd',
    color: 'border-red-200 hover:border-red-300',
    badge: 'bg-red-50 text-red-600',
  },
  {
    emoji: '🎗',
    title: 'มะเร็ง',
    subtitle: '5 ชนิดหลัก',
    time: '5 นาที',
    href: '/risk#cancer',
    color: 'border-violet-200 hover:border-violet-300',
    badge: 'bg-violet-50 text-violet-600',
  },
  {
    emoji: '🩸',
    title: 'เบาหวาน',
    subtitle: 'FINDRISC เอเชีย',
    time: '2 นาที',
    href: '/risk#diabetes',
    color: 'border-amber-200 hover:border-amber-300',
    badge: 'bg-amber-50 text-amber-600',
  },
  {
    emoji: '🫁',
    title: 'มะเร็งปอด',
    subtitle: 'เกณฑ์ NLST',
    time: '2 นาที',
    href: '/guidelines/lung-cancer',
    color: 'border-sky-200 hover:border-sky-300',
    badge: 'bg-sky-50 text-sky-600',
  },
  {
    emoji: '🧠',
    title: 'หลอดเลือดสมอง',
    subtitle: 'ปัจจัยเสี่ยง Stroke',
    time: '3 นาที',
    href: '/diseases/stroke',
    color: 'border-teal-200 hover:border-teal-300',
    badge: 'bg-teal-50 text-teal-600',
  },
] as const

export function PopularScreenings() {
  return (
    <section className="bg-slate-900 pb-5 pt-0">
      <div className="mx-auto max-w-5xl px-5">
        {/* Label */}
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-3 pt-5">
          ตรวจคัดกรองยอดนิยม
        </p>

        {/* Horizontal scroll cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
          {SCREENINGS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group flex-shrink-0 snap-start flex flex-col items-center gap-2 rounded-2xl border bg-white/5 backdrop-blur-sm p-4 w-[120px] sm:w-[130px] hover:bg-white/10 transition-all ${s.color}`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <div className="text-center">
                <p className="text-sm font-semibold text-white leading-tight">{s.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.subtitle}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.badge}`}>
                {s.time}
              </span>
            </Link>
          ))}

          {/* See all card */}
          <Link
            href="/risk"
            className="flex-shrink-0 snap-start flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-transparent p-4 w-[120px] sm:w-[130px] hover:border-teal-600 hover:bg-teal-500/5 transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 group-hover:bg-teal-500/20 transition-colors">
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-400" />
            </div>
            <p className="text-xs font-medium text-slate-400 group-hover:text-teal-400 text-center leading-tight transition-colors">
              ดูทั้งหมด
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
