import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

export async function HowItWorks() {
  const t = await getTranslations()

  const steps = [
    {
      num: '01',
      titleKey: 'howItWorks.step1Title',
      descKey: 'howItWorks.step1Desc',
    },
    {
      num: '02',
      titleKey: 'howItWorks.step2Title',
      descKey: 'howItWorks.step2Desc',
    },
    {
      num: '03',
      titleKey: 'howItWorks.step3Title',
      descKey: 'howItWorks.step3Desc',
    },
  ] as const

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-3">
            {t('howItWorks.badge')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {t('howItWorks.title')}
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 mb-12">
          {/* Connecting line — desktop only */}
          <div className="hidden sm:block absolute top-7 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-gradient-to-r from-teal-200 via-teal-300 to-teal-200 z-0" />

          {steps.map(({ num, titleKey, descKey }, i) => (
            <div key={num} className="relative z-10 flex flex-col items-center text-center sm:px-4">
              {/* Step number circle */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-200 mb-5 shadow-sm">
                <span className="text-xl font-bold text-teal-600">{i + 1}</span>
              </div>

              <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
                {t(titleKey)}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Single CTA */}
        <div className="flex justify-center">
          <ButtonLink
            href="/risk"
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-xl"
          >
            {t('howItWorks.startBtn')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
