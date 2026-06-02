import { getTranslations } from 'next-intl/server'
import { ArrowRight, Shield } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

export async function FinalCtaV2() {
  const t = await getTranslations('finalCta2')

  const TRUST_BADGES_KEYS = ['free', 'noReg', 'pdpa', 'noSell'] as const
  const TRUST_BADGES = t.raw('subtitle') as string

  return (
    <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 py-14 sm:py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-xl px-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-200 mb-3">
          {t('eyebrow')}
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
          {t('title')}
        </h2>

        {/* Trust badges — parse from subtitle string */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
          {TRUST_BADGES.split(' · ').map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white font-medium">
              <Shield className="h-3 w-3 text-teal-200" />
              {badge}
            </span>
          ))}
        </div>

        <ButtonLink
          href="/risk"
          size="lg"
          className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-10 py-4 text-base rounded-xl shadow-lg shadow-teal-900/30 hover:shadow-teal-900/40 transition-all"
        >
          {t('btn')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </ButtonLink>
      </div>
    </section>
  )
}
