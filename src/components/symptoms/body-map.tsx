'use client'

import { cn } from '@/lib/utils'
import type { BodyRegion } from '@/data/symptom-conditions'

const REGION_LABELS: Record<BodyRegion, string> = {
  head:    'ศีรษะ / คอ',
  chest:   'หน้าอก',
  abdomen: 'ท้อง',
  back:    'หลัง',
  arms:    'แขน / มือ',
  legs:    'ขา / เท้า',
  skin:    'ผิวหนัง',
  general: 'อาการทั่วไป',
}

interface RegionPathProps {
  region: BodyRegion
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}

function RegionGroup({ region, selected, onClick, children, title }: RegionPathProps) {
  return (
    <g
      role="button"
      aria-label={REGION_LABELS[region]}
      aria-pressed={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className="cursor-pointer focus:outline-none"
      style={{ transition: 'all 0.15s ease' }}
      // Touch: invisible hit-area expanded by padding around each region
      // Actual min touch target ensured by SVG element sizes (see each rect/ellipse)
    >
      <title>{title ?? REGION_LABELS[region]}</title>
      {children}
    </g>
  )
}

interface BodyMapProps {
  selectedRegion: BodyRegion | null
  onSelectRegion: (region: BodyRegion) => void
}

export function BodyMap({ selectedRegion, onSelectRegion }: BodyMapProps) {
  const getFill = (region: BodyRegion) =>
    selectedRegion === region ? '#0d9488' : '#e2e8f0'

  const getStroke = (region: BodyRegion) =>
    selectedRegion === region ? '#0f766e' : '#94a3b8'

  const getOpacity = (region: BodyRegion) =>
    selectedRegion && selectedRegion !== region ? 0.5 : 1

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Body — larger on mobile for bigger touch targets */}
      <div className="relative">
        <svg
          viewBox="0 0 170 360"
          className="w-44 h-[352px] sm:w-52 sm:h-[416px]"
          aria-label="แผนที่ร่างกาย คลิกหรือแตะส่วนของร่างกายเพื่อเลือกอาการ"
          role="img"
        >
          {/* ── HEAD ── */}
          <RegionGroup region="head" selected={selectedRegion === 'head'} onClick={() => onSelectRegion('head')}>
            {/* Head circle */}
            <ellipse
              cx="85" cy="36" rx="28" ry="32"
              fill={getFill('head')} stroke={getStroke('head')} strokeWidth="2"
              opacity={getOpacity('head')}
            />
            {/* Neck */}
            <rect
              x="76" y="65" width="18" height="14" rx="4"
              fill={getFill('head')} stroke={getStroke('head')} strokeWidth="2"
              opacity={getOpacity('head')}
            />
            {/* Label dot */}
            <text x="85" y="38" textAnchor="middle" fontSize="9" fill={selectedRegion === 'head' ? 'white' : '#475569'} fontWeight="600">ศีรษะ</text>
          </RegionGroup>

          {/* ── LEFT ARM ── */}
          <RegionGroup region="arms" selected={selectedRegion === 'arms'} onClick={() => onSelectRegion('arms')}>
            <rect
              x="12" y="79" width="26" height="110" rx="13"
              fill={getFill('arms')} stroke={getStroke('arms')} strokeWidth="2"
              opacity={getOpacity('arms')}
            />
          </RegionGroup>

          {/* ── RIGHT ARM ── */}
          <RegionGroup region="arms" selected={selectedRegion === 'arms'} onClick={() => onSelectRegion('arms')}>
            <rect
              x="132" y="79" width="26" height="110" rx="13"
              fill={getFill('arms')} stroke={getStroke('arms')} strokeWidth="2"
              opacity={getOpacity('arms')}
            />
          </RegionGroup>

          {/* ── CHEST ── */}
          <RegionGroup region="chest" selected={selectedRegion === 'chest'} onClick={() => onSelectRegion('chest')}>
            <rect
              x="40" y="78" width="90" height="72" rx="8"
              fill={getFill('chest')} stroke={getStroke('chest')} strokeWidth="2"
              opacity={getOpacity('chest')}
            />
            <text x="85" y="117" textAnchor="middle" fontSize="9" fill={selectedRegion === 'chest' ? 'white' : '#475569'} fontWeight="600">หน้าอก</text>
          </RegionGroup>

          {/* ── ABDOMEN ── */}
          <RegionGroup region="abdomen" selected={selectedRegion === 'abdomen'} onClick={() => onSelectRegion('abdomen')}>
            <rect
              x="42" y="148" width="86" height="72" rx="6"
              fill={getFill('abdomen')} stroke={getStroke('abdomen')} strokeWidth="2"
              opacity={getOpacity('abdomen')}
            />
            <text x="85" y="187" textAnchor="middle" fontSize="9" fill={selectedRegion === 'abdomen' ? 'white' : '#475569'} fontWeight="600">ท้อง</text>
          </RegionGroup>

          {/* ── LEFT LEG ── */}
          <RegionGroup region="legs" selected={selectedRegion === 'legs'} onClick={() => onSelectRegion('legs')}>
            <rect
              x="42" y="218" width="40" height="132" rx="18"
              fill={getFill('legs')} stroke={getStroke('legs')} strokeWidth="2"
              opacity={getOpacity('legs')}
            />
          </RegionGroup>

          {/* ── RIGHT LEG ── */}
          <RegionGroup region="legs" selected={selectedRegion === 'legs'} onClick={() => onSelectRegion('legs')}>
            <rect
              x="88" y="218" width="40" height="132" rx="18"
              fill={getFill('legs')} stroke={getStroke('legs')} strokeWidth="2"
              opacity={getOpacity('legs')}
            />
          </RegionGroup>

          {/* Arm labels */}
          {(selectedRegion === 'arms' || selectedRegion === null) && (
            <>
              <text x="25" y="135" textAnchor="middle" fontSize="7.5" fill={selectedRegion === 'arms' ? 'white' : '#475569'} fontWeight="600">แขน</text>
              <text x="145" y="135" textAnchor="middle" fontSize="7.5" fill={selectedRegion === 'arms' ? 'white' : '#475569'} fontWeight="600">แขน</text>
            </>
          )}

          {/* Leg labels */}
          {(selectedRegion === 'legs' || selectedRegion === null) && (
            <>
              <text x="62" y="280" textAnchor="middle" fontSize="7.5" fill={selectedRegion === 'legs' ? 'white' : '#475569'} fontWeight="600">ขา</text>
              <text x="108" y="280" textAnchor="middle" fontSize="7.5" fill={selectedRegion === 'legs' ? 'white' : '#475569'} fontWeight="600">ขา</text>
            </>
          )}
        </svg>
      </div>

      {/* Extra region buttons — min 44px height for WCAG touch targets */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {(['back', 'skin', 'general'] as BodyRegion[]).map(region => (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            aria-pressed={selectedRegion === region}
            className={cn(
              'rounded-xl border px-2 text-xs font-semibold text-center transition-all',
              'min-h-[44px] flex items-center justify-center', // WCAG touch target
              selectedRegion === region
                ? 'border-teal-500 bg-teal-500 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700 active:bg-slate-50'
            )}
          >
            {REGION_LABELS[region]}
          </button>
        ))}
      </div>

      {/* Selected region indicator */}
      {selectedRegion && (
        <div className="flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="text-sm font-medium text-teal-700">
            เลือก: {REGION_LABELS[selectedRegion]}
          </span>
        </div>
      )}
    </div>
  )
}
