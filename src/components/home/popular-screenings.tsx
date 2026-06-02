import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  HeartPulse, Ribbon, Droplets, Wind,
  Brain, ArrowRight,
} from 'lucide-react'

const SCREENING_ICONS = [HeartPulse, Ribbon, Droplets, Wind, Brain] as const
const SCREENING_KEYS = ['heart', 'cancer', 'diabetes', 'lungCancer', 'stroke'] as const
const SCREENING_HREFS = ['/risk#cvd', '/risk#cancer', '/risk#diabetes', '/guidelines/lung-cancer', '/diseases/stroke'] as const
const SCREENING_ACCENTS = ['text-rose-400', 'text-violet-400', 'text-amber-400', 'text-sky-400', 'text-teal-400'] as const
const SCREENING_GLOWS = [
  'group-hover:shadow-rose-500/10',
  'group-hover:shadow-violet-500/10',
  'group-hover:shadow-amber-500/10',
  'group-hover:shadow-sky-500/10',
  'group-hover:shadow-teal-500/10',
] as const

export async function PopularScreenings() {
  const t = await getTranslations('screenings')

  return (
    <section className="bg-slate-900 pb-6 pt-0">
      <div className="mx-auto max-w-4xl px-5">
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-3 pt-5">
          {t('label')}
        </p>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
          {SCREENING_KEYS.map((key, i) => {
            const Icon = SCREENING_ICONS[i]
            return (
              <Link
                key={key}
                href={SCREENING_HREFS[i]}
                aria-label={`${t(key)}`}
                className={`group flex-shrink-0 snap-start flex flex-col items-center gap-2.5 rounded-[18px] border border-white/[0.07] bg-white/[0.035] backdrop-blur-sm p-4 w-[116px] sm:w-[126px] hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg transition-all ${SCREENING_GLOWS[i]}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] group-hover:bg-white/10 transition-colors">
                  <Icon className={`h-5 w-5 ${SCREENING_ACCENTS[i]}`} strokeWidth={1.75} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-white leading-tight">
                    {t(key)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {t(`${key}Sub` as Parameters<typeof t>[0])}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] text-slate-400">
                  {t('viewAll')}
                </span>
              </Link>
            )
          })}

          <Link
            href="/risk"
            aria-label={t('viewAllLabel')}
            className="flex-shrink-0 snap-start flex flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-white/10 bg-transparent p-4 w-[116px] sm:w-[126px] hover:border-teal-500/30 hover:bg-teal-500/[0.04] transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] group-hover:bg-teal-500/10 transition-colors">
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 group-hover:text-teal-400 text-center transition-colors">
              {t('viewAll')}
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
