import { getTranslations } from 'next-intl/server'
import { Shield, BookOpen, RefreshCw, Link2, Users, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export async function TrustFramework() {
  const t = await getTranslations()

  const trustPillars = [
    { icon: BookOpen, titleKey: 'trust.pillars.evidence.title', detailKey: 'trust.pillars.evidence.detail', descKey: 'trust.pillars.evidence.desc' },
    { icon: Users, titleKey: 'trust.pillars.reviewed.title', detailKey: 'trust.pillars.reviewed.detail', descKey: 'trust.pillars.reviewed.desc' },
    { icon: RefreshCw, titleKey: 'trust.pillars.updated.title', detailKey: 'trust.pillars.updated.detail', descKey: 'trust.pillars.updated.desc' },
    { icon: Link2, titleKey: 'trust.pillars.cited.title', detailKey: 'trust.pillars.cited.detail', descKey: 'trust.pillars.cited.desc' },
    { icon: Shield, titleKey: 'trust.pillars.privacy.title', detailKey: 'trust.pillars.privacy.detail', descKey: 'trust.pillars.privacy.desc' },
    { icon: Award, titleKey: 'trust.pillars.noDiagnosis.title', detailKey: 'trust.pillars.noDiagnosis.detail', descKey: 'trust.pillars.noDiagnosis.desc' },
  ] as const

  const gradeItems = [
    { grade: 'A', labelKey: 'trust.grades.a.label', descKey: 'trust.grades.a.desc', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { grade: 'B', labelKey: 'trust.grades.b.label', descKey: 'trust.grades.b.desc', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { grade: 'C', labelKey: 'trust.grades.c.label', descKey: 'trust.grades.c.desc', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { grade: 'D', labelKey: 'trust.grades.d.label', descKey: 'trust.grades.d.desc', color: 'text-slate-400', bg: 'bg-slate-400/10' },
  ] as const

  const partnerKeys = [
    'trust.partners.moph',
    'trust.partners.nhso',
    'trust.partners.mahidol',
    'trust.partners.heartFoundation',
    'trust.partners.cancerInstitute',
    'trust.partners.who',
  ] as const

  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 to-teal-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 mb-6">
            <Shield className="h-4 w-4 text-teal-400" />
            <span className="text-sm text-teal-300 font-medium">{t('trust.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('trust.title')}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t('trust.subtitle')}
          </p>
        </div>

        {/* Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.titleKey}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                    <Icon className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t(pillar.titleKey)}</div>
                    <div className="text-xs text-teal-400">{t(pillar.detailKey)}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{t(pillar.descKey)}</p>
              </div>
            )
          })}
        </div>

        {/* Evidence Grading System */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-12">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">
            {t('trust.gradeTitle')}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {gradeItems.map(({ grade, labelKey, descKey, color, bg }) => (
              <div key={grade} className={`rounded-xl ${bg} p-4`}>
                <div className={`text-3xl font-bold ${color} mb-1`}>{grade}</div>
                <div className={`text-sm font-semibold ${color} mb-1`}>{t(labelKey)}</div>
                <div className="text-xs text-slate-400">{t(descKey)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-4">{t('trust.partnersLabel')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {partnerKeys.map((key) => (
              <span
                key={key}
                className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-xs text-slate-400"
              >
                {t(key)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
