import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Heart, Shield, BookOpen, AlertCircle } from 'lucide-react'

export async function Footer() {
  const t = await getTranslations()

  const footerLinks = {
    platform: [
      { id: 'p1', labelKey: 'footer.links.diseaseLibrary', href: '/diseases' },
      { id: 'p2', labelKey: 'footer.links.screeningPlanner', href: '/screening' },
      { id: 'p3', labelKey: 'footer.links.riskAssessment', href: '/risk' },
      { id: 'p4', labelKey: 'footer.links.symptomNavigator', href: '/symptoms' },
      { id: 'p5', labelKey: 'footer.links.findProviders', href: '/providers' },
      { id: 'p6', labelKey: 'footer.links.healthAcademy', href: '/academy' },
    ],
    company: [
      { id: 'c1', labelKey: 'footer.links.aboutUs', href: '/about' },
      { id: 'c2', labelKey: 'footer.links.advisoryBoard', href: '/trust' },
      { id: 'c3', labelKey: 'footer.links.medDisclaimer', href: '/trust' },
      { id: 'c4', labelKey: 'footer.links.partnerWithUs', href: '/providers' },
    ],
    legal: [
      { id: 'l1', labelKey: 'footer.links.privacyPolicy', href: '/trust' },
      { id: 'l2', labelKey: 'footer.links.terms', href: '/trust' },
      { id: 'l3', labelKey: 'footer.links.cookiePolicy', href: '/trust' },
      { id: 'l4', labelKey: 'footer.links.pdpaCompliance', href: '/trust' },
    ],
  }

  const trustBadges = [
    { icon: Shield, labelKey: 'footer.pdpa' as const },
    { icon: BookOpen, labelKey: 'footer.evidenceBased' as const },
    { icon: Heart, labelKey: 'footer.medReviewed' as const },
  ]

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Medical Disclaimer Banner */}
      <div className="bg-amber-950/50 border-b border-amber-800/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-200/80">
              <strong className="text-amber-300">{t('footer.disclaimerLabel')}</strong>{' '}
              {t('footer.disclaimerText')}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Image
                src="/brand/firstscreen-icon.png"
                alt="FirstScreen"
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl object-cover shadow-sm"
              />
              <span className="text-lg font-bold text-white">{t('site.name')}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {t('footer.mission')}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              {trustBadges.map(({ icon: Icon, labelKey }) => (
                <div key={labelKey} className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5">
                  <Icon className="h-3.5 w-3.5 text-teal-400" />
                  <span className="text-xs text-slate-300">{t(labelKey)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.sections.platform')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {t(link.labelKey as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.sections.company')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {t(link.labelKey as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.sections.legal')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {t(link.labelKey as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">{t('footer.availableIn')}</span>
            <div className="flex gap-1.5">
              {['🇹🇭', '🇬🇧', '🇨🇳', '🇯🇵', '🇰🇷', '🇲🇾', '🇻🇳', '🇮🇩'].map((flag, i) => (
                <span key={i} className="text-base">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
