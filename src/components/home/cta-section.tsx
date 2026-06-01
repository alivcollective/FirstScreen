import { getTranslations } from 'next-intl/server'
import { ArrowRight, Heart } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

export async function CTASection() {
  const t = await getTranslations()

  return (
    <section className="py-20 bg-gradient-to-br from-teal-600 to-cyan-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }} />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Heart className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-lg sm:text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink
            href="/risk"
            size="lg"
            className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-6 text-base font-semibold rounded-xl shadow-lg"
          >
            {t('cta.primary')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </ButtonLink>
          <ButtonLink
            href="/screening"
            variant="outline"
            size="lg"
            className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl"
          >
            {t('cta.secondary')}
          </ButtonLink>
        </div>

        <p className="mt-8 text-sm text-teal-200">
          {t('cta.footnote')}
        </p>
      </div>
    </section>
  )
}
