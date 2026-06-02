import { AlertTriangle, Phone } from 'lucide-react'
import type { RedFlag } from '@/types/body-map'

interface RedFlagAlertProps {
  flags: RedFlag[]
  className?: string
}

export function RedFlagAlert({ flags, className }: RedFlagAlertProps) {
  if (!flags.length) return null

  return (
    <div className={className}>
      {flags.map((flag, i) => (
        <div
          key={i}
          className="rounded-xl border border-red-200 bg-red-50 p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">
                {flag.condition_th}
              </p>
              <p className="text-xs text-red-700 leading-relaxed">
                {flag.warning_th}
              </p>
              {flag.hotline && (
                <a
                  href={`tel:${flag.hotline}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  โทร {flag.hotline}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
