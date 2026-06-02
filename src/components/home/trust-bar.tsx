import { getTranslations } from 'next-intl/server'

// Compact single-row trust metrics — max ~80px mobile
export async function TrustBar() {
  const t = await getTranslations('trustBar')

  const METRICS = [
    { value: t('users'), label: t('usersLabel'), sep: true },
    { value: t('guidelines'), label: t('guidelinesLabel'), sep: true },
    { value: t('verified'), label: t('verifiedLabel'), sep: false },
  ]

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-4">
        <div className="flex items-center justify-center gap-0">
          {METRICS.map((m) => (
            <div key={m.label} className="flex items-center">
              <div className="flex flex-col items-center px-4 sm:px-8 py-1 text-center">
                <span className="text-lg sm:text-xl font-bold text-slate-900 leading-none">{m.value}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">{m.label}</span>
              </div>
              {m.sep && <div className="h-7 w-px bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
