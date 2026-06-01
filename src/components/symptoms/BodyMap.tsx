'use client'

import { cn } from '@/lib/utils'
import type { BodyRegion } from '@/types/symptom'

const REGION_LABELS: Record<BodyRegion, string> = {
  head: 'ศีรษะ',
  chest: 'หน้าอก',
  abdomen: 'ท้อง',
  back: 'หลัง',
  'left-arm': 'แขนซ้าย',
  'right-arm': 'แขนขวา',
  'left-leg': 'ขาซ้าย',
  'right-leg': 'ขาขวา',
  skin: 'ผิวหนัง',
  general: 'ทั่วไป',
}

interface RegionProps {
  id: BodyRegion
  selected: boolean
  onClick: (r: BodyRegion) => void
  children: React.ReactNode
}

function Zone({ id, selected, onClick, children }: RegionProps) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={REGION_LABELS[id]}
      aria-pressed={selected}
      onClick={() => onClick(id)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(id)}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      style={{ transition: 'opacity 0.15s, fill 0.15s' }}
    >
      <title>{REGION_LABELS[id]}</title>
      {children}
    </g>
  )
}

interface BodyMapProps {
  selectedRegion: BodyRegion | null
  onSelectRegion: (region: BodyRegion) => void
}

export function BodyMap({ selectedRegion, onSelectRegion }: BodyMapProps) {
  const fill = (r: BodyRegion) => selectedRegion === r ? '#0ea5e9' : '#e2e8f0'
  const stroke = (r: BodyRegion) => selectedRegion === r ? '#0284c7' : '#94a3b8'
  const opacity = (r: BodyRegion) => !selectedRegion || selectedRegion === r ? 1 : 0.45
  const textFill = (r: BodyRegion) => selectedRegion === r ? '#fff' : '#64748b'

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Front-view SVG — 200×400 canvas */}
      <svg
        viewBox="0 0 200 400"
        className="w-36 h-72 sm:w-44 sm:h-88 select-none"
        aria-label="แผนที่ร่างกาย — คลิกเพื่อเลือกบริเวณ"
        role="img"
      >
        {/* ── HEAD ──────────────────────────────────── */}
        <Zone id="head" selected={selectedRegion === 'head'} onClick={onSelectRegion}>
          {/* Head ellipse */}
          <ellipse
            cx="100" cy="38" rx="27" ry="30"
            fill={fill('head')} stroke={stroke('head')} strokeWidth="1.5"
            opacity={opacity('head')}
          />
          {/* Neck */}
          <rect
            x="89" y="66" width="22" height="14" rx="4"
            fill={fill('head')} stroke={stroke('head')} strokeWidth="1.5"
            opacity={opacity('head')}
          />
          <text x="100" y="41" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={textFill('head')}>ศีรษะ</text>
        </Zone>

        {/* ── LEFT ARM (user's right side visually) ─── */}
        <Zone id="left-arm" selected={selectedRegion === 'left-arm'} onClick={onSelectRegion}>
          <path
            d="M 152,80 L 176,84 L 182,196 L 152,196 Z"
            fill={fill('left-arm')} stroke={stroke('left-arm')} strokeWidth="1.5"
            strokeLinejoin="round" opacity={opacity('left-arm')}
          />
          <text x="164" y="144" textAnchor="middle" fontSize="7" fontWeight="600" fill={textFill('left-arm')}
            transform="rotate(3,164,144)">แขน</text>
          <text x="164" y="154" textAnchor="middle" fontSize="7" fontWeight="600" fill={textFill('left-arm')}
            transform="rotate(3,164,154)">ซ้าย</text>
        </Zone>

        {/* ── RIGHT ARM (user's left side visually) ─── */}
        <Zone id="right-arm" selected={selectedRegion === 'right-arm'} onClick={onSelectRegion}>
          <path
            d="M 48,80 L 24,84 L 18,196 L 48,196 Z"
            fill={fill('right-arm')} stroke={stroke('right-arm')} strokeWidth="1.5"
            strokeLinejoin="round" opacity={opacity('right-arm')}
          />
          <text x="36" y="144" textAnchor="middle" fontSize="7" fontWeight="600" fill={textFill('right-arm')}
            transform="rotate(-3,36,144)">แขน</text>
          <text x="36" y="154" textAnchor="middle" fontSize="7" fontWeight="600" fill={textFill('right-arm')}
            transform="rotate(-3,36,154)">ขวา</text>
        </Zone>

        {/* ── CHEST ────────────────────────────────── */}
        <Zone id="chest" selected={selectedRegion === 'chest'} onClick={onSelectRegion}>
          <rect
            x="50" y="79" width="100" height="68" rx="8"
            fill={fill('chest')} stroke={stroke('chest')} strokeWidth="1.5"
            opacity={opacity('chest')}
          />
          <text x="100" y="115" textAnchor="middle" fontSize="9" fontWeight="600" fill={textFill('chest')}>หน้าอก</text>
        </Zone>

        {/* ── ABDOMEN ──────────────────────────────── */}
        <Zone id="abdomen" selected={selectedRegion === 'abdomen'} onClick={onSelectRegion}>
          <rect
            x="52" y="146" width="96" height="62" rx="6"
            fill={fill('abdomen')} stroke={stroke('abdomen')} strokeWidth="1.5"
            opacity={opacity('abdomen')}
          />
          <text x="100" y="179" textAnchor="middle" fontSize="9" fontWeight="600" fill={textFill('abdomen')}>ท้อง</text>
        </Zone>

        {/* ── LEFT LEG ─────────────────────────────── */}
        <Zone id="left-leg" selected={selectedRegion === 'left-leg'} onClick={onSelectRegion}>
          <rect
            x="104" y="207" width="42" height="180" rx="14"
            fill={fill('left-leg')} stroke={stroke('left-leg')} strokeWidth="1.5"
            opacity={opacity('left-leg')}
          />
          <text x="125" y="298" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={textFill('left-leg')}>ขาซ้าย</text>
        </Zone>

        {/* ── RIGHT LEG ────────────────────────────── */}
        <Zone id="right-leg" selected={selectedRegion === 'right-leg'} onClick={onSelectRegion}>
          <rect
            x="54" y="207" width="42" height="180" rx="14"
            fill={fill('right-leg')} stroke={stroke('right-leg')} strokeWidth="1.5"
            opacity={opacity('right-leg')}
          />
          <text x="75" y="298" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={textFill('right-leg')}>ขาขวา</text>
        </Zone>
      </svg>

      {/* Extra zones (back, skin, general) — pill buttons below SVG */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
        {(['back', 'skin', 'general'] as BodyRegion[]).map(region => (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            aria-pressed={selectedRegion === region}
            className={cn(
              'rounded-xl border py-2.5 text-xs font-semibold text-center transition-all min-h-[44px]',
              selectedRegion === region
                ? 'bg-sky-500 border-sky-500 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700'
            )}
          >
            {REGION_LABELS[region]}
          </button>
        ))}
      </div>

      {/* Active region label */}
      {selectedRegion && (
        <div className="flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          <span className="text-xs font-semibold text-sky-700">
            บริเวณ: {REGION_LABELS[selectedRegion]}
          </span>
        </div>
      )}
    </div>
  )
}
