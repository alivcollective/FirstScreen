'use client'

import type { BodyViewMode } from '@/types/body-map'
import { cn } from '@/lib/utils'

interface BodyViewToggleProps {
  view: BodyViewMode
  onChange: (v: BodyViewMode) => void
  className?: string
}

const VIEWS: { value: BodyViewMode; label_th: string; label_en: string }[] = [
  { value: 'front', label_th: 'ด้านหน้า', label_en: 'Front' },
  { value: 'back', label_th: 'ด้านหลัง', label_en: 'Back' },
  // Phase 4: { value: '3d', label_th: '3D', label_en: '3D' },
]

export function BodyViewToggle({ view, onChange, className }: BodyViewToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1',
        className
      )}
      role="radiogroup"
      aria-label="ทิศทางการมองร่างกาย"
    >
      {VIEWS.map((v) => (
        <button
          key={v.value}
          role="radio"
          aria-checked={view === v.value}
          onClick={() => onChange(v.value)}
          className={cn(
            'rounded-lg px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap',
            view === v.value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          {v.label_th}
        </button>
      ))}
    </div>
  )
}
