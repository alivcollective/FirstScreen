import { getTranslations } from 'next-intl/server'

// Why FirstScreen — compact 3-step timeline with i18n
export async function HowItWorks() {
  const t = await getTranslations('howItWorks')

  const steps = [
    { n: 1, label: t('step1Title') },
    { n: 2, label: t('step2Title') },
    { n: 3, label: t('step3Title') },
  ]

  return (
    <section className="bg-white border-b border-slate-100 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl px-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-4">
              {t('badge')}
            </p>
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white text-xs font-bold">
                    {s.n}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-5 bg-teal-200 my-0.5" />
                  )}
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-800 pt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="sm:max-w-xs">
            <p className="text-sm text-slate-500 leading-relaxed">
              {t('note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
