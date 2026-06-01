import { getTranslations } from 'next-intl/server'
import { ShieldCheck } from 'lucide-react'

const standards = [
  { orgKey: 'trustCompact.who', descKey: 'trustCompact.whoDesc', abbr: 'WHO' },
  { orgKey: 'trustCompact.uspstf', descKey: 'trustCompact.uspstfDesc', abbr: 'USPSTF' },
  { orgKey: 'trustCompact.nccn', descKey: 'trustCompact.nccnDesc', abbr: 'NCCN' },
  { orgKey: 'trustCompact.grade', descKey: 'trustCompact.gradeDesc', abbr: 'GRADE' },
] as const

export async function TrustCompact() {
  const t = await getTranslations()

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-slate-100">
      <div className="mx-auto max-w-5xl px-6">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <ShieldCheck className="h-4 w-4 text-teal-500" />
          <p className="text-sm font-medium text-slate-500 text-center">
            {t('trustCompact.label')}
          </p>
        </div>

        {/* 4 standards — horizontal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {standards.map(({ orgKey, descKey, abbr }) => (
            <div
              key={abbr}
              className="flex flex-col items-center text-center rounded-xl border border-slate-100 bg-slate-50/60 px-5 py-5 hover:border-teal-100 transition-colors"
            >
              {/* Abbr as visual mark */}
              <span className="inline-flex items-center justify-center h-10 w-auto px-3 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 tracking-wide mb-3 shadow-sm">
                {t(orgKey)}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">{t(descKey)}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto leading-relaxed">
          {t('trustCompact.disclaimer')}
        </p>
      </div>
    </section>
  )
}
