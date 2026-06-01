import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

export async function FinalCtaV2() {
  const t = await getTranslations()

  return (
    <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 py-20 sm:py-24 relative overflow-hidden">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        {/* Eyebrow */}
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-200 mb-4">
          {t('finalCta2.eyebrow')}
        </p>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
          {t('finalCta2.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-teal-100/80 text-sm mb-10">
          {t('finalCta2.subtitle')}
        </p>

        {/* Button */}
        <ButtonLink
          href="/risk"
          size="lg"
          className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-10 py-5 text-base rounded-xl shadow-xl shadow-teal-900/30 hover:shadow-teal-900/40 transition-all"
        >
          {t('finalCta2.btn')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </ButtonLink>
      </div>
    </section>
  )
}
