'use client'

import { useMemo } from 'react'
import type { BodyViewMode, BodyRegion } from '@/types/body-map'
import { getRegionsByView } from '@/data/body-regions/index'
import { cn } from '@/lib/utils'

interface BodyViewer2DProps {
  view: BodyViewMode
  selectedRegionId: string | null
  onRegionClick: (region: BodyRegion) => void
  className?: string
}

// ── SVG coordinate system: 200 × 500 ─────────────────────────
// Clean, minimal medical-style human body outline

// Front view body outline paths
const FRONT_OUTLINE = `
  M 100 14
  A 31 37 0 1 1 99.9 14
  M 88 89 L 88 108 L 112 108 L 112 89
  M 60 110 Q 46 116 42 145 L 38 235 Q 38 260 56 270 L 74 276 L 126 276 L 144 270 Q 162 260 162 235 L 158 145 Q 154 116 140 110
  M 60 110 L 40 118 L 22 210 L 20 256 L 22 294 L 28 326 L 48 326 L 52 294 L 50 256 L 54 210 L 68 120
  M 140 110 L 160 118 L 178 210 L 180 256 L 178 294 L 172 326 L 152 326 L 148 294 L 150 256 L 146 210 L 132 120
  M 74 276 L 64 276 L 58 350 L 56 380 L 58 440 L 60 462 L 82 462 L 84 440 L 86 380 L 88 350 L 90 276
  M 126 276 L 136 276 L 142 350 L 144 380 L 142 440 L 140 462 L 118 462 L 116 440 L 114 380 L 112 350 L 110 276
`

// Back view body outline paths (mirror)
const BACK_OUTLINE = `
  M 100 14
  A 31 37 0 1 1 99.9 14
  M 88 89 L 88 108 L 112 108 L 112 89
  M 60 110 Q 46 116 42 145 L 38 235 Q 38 260 56 270 L 74 276 L 126 276 L 144 270 Q 162 260 162 235 L 158 145 Q 154 116 140 110
  M 60 110 L 40 118 L 22 210 L 20 256 L 22 294 L 28 326 L 48 326 L 52 294 L 50 256 L 54 210 L 68 120
  M 140 110 L 160 118 L 178 210 L 180 256 L 178 294 L 172 326 L 152 326 L 148 294 L 150 256 L 146 210 L 132 120
  M 74 276 L 64 276 L 58 350 L 56 380 L 58 440 L 60 462 L 82 462 L 84 440 L 86 380 L 88 350 L 90 276
  M 126 276 L 136 276 L 142 350 L 144 380 L 142 440 L 140 462 L 118 462 L 116 440 L 114 380 L 112 350 L 110 276
`

// Parse SVG zone descriptor into React SVG element props
function parseZoneDescriptor(desc: string): React.SVGProps<SVGElement> & { type: 'ellipse' | 'rect' } | null {
  if (!desc) return null

  if (desc.startsWith('ellipse:')) {
    const [, params] = desc.split(':')
    const [cx, cy, rx, ry] = params.split(',').map(Number)
    return { type: 'ellipse', cx, cy, rx, ry } as React.SVGProps<SVGEllipseElement> & { type: 'ellipse' }
  }

  if (desc.startsWith('rect:')) {
    const [, params] = desc.split(':')
    const [x, y, w, h] = params.split(',').map(Number)
    return { type: 'rect', x, y, width: w, height: h, rx: 6 } as React.SVGProps<SVGRectElement> & { type: 'rect' }
  }

  return null
}

// Individual clickable region overlay
function RegionZone({
  region,
  view,
  isSelected,
  onClick,
}: {
  region: BodyRegion
  view: BodyViewMode
  isSelected: boolean
  onClick: () => void
}) {
  const zoneDesc = view === 'front' ? region.svgZone.front : region.svgZone.back
  if (!zoneDesc) return null

  const parsed = parseZoneDescriptor(zoneDesc)
  if (!parsed) return null

  const { type, ...svgProps } = parsed

  const baseStyle = {
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fill: isSelected ? 'rgba(20, 184, 166, 0.28)' : 'rgba(20, 184, 166, 0)',
    stroke: isSelected ? 'rgb(20, 184, 166)' : 'rgba(20, 184, 166, 0)',
    strokeWidth: isSelected ? 1.5 : 0,
  }

  const hoverClass = 'hover-zone'

  const commonProps = {
    ...svgProps,
    style: baseStyle,
    className: cn(hoverClass, isSelected && 'zone-selected'),
    onClick,
    role: 'button' as const,
    'aria-label': region.name_th,
    'aria-pressed': isSelected,
  }

  if (type === 'ellipse') {
    return <ellipse {...commonProps as React.SVGProps<SVGEllipseElement>} />
  }
  return <rect {...commonProps as React.SVGProps<SVGRectElement>} />
}

// ── Main Body Viewer ─────────────────────────────────────────

export function BodyViewer2D({ view, selectedRegionId, onRegionClick, className }: BodyViewer2DProps) {
  const regions = useMemo(() => getRegionsByView(view), [view])

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <style>{`
        .hover-zone:hover {
          fill: rgba(20, 184, 166, 0.14);
          stroke: rgba(20, 184, 166, 0.5);
          stroke-width: 1.5px;
        }
        .zone-selected {
          fill: rgba(20, 184, 166, 0.28) !important;
          stroke: rgb(20, 184, 166) !important;
          stroke-width: 1.5px !important;
        }
      `}</style>

      <svg
        viewBox="0 0 200 500"
        className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] drop-shadow-sm select-none"
        aria-label={`Human body ${view} view`}
        role="img"
      >
        {/* Body outline — decorative, not interactive */}
        <g className="body-outline">
          {/* Head */}
          <ellipse cx="100" cy="50" rx="31" ry="37"
            fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />

          {/* Neck */}
          <path d="M88 85 L88 108 Q88 111 91 111 L109 111 Q112 111 112 108 L112 85"
            fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />

          {/* Torso */}
          <path d="M62 110 Q48 116 44 146 L40 234 Q40 260 60 270 L76 276 L124 276 L140 270 Q160 260 160 234 L156 146 Q152 116 138 110 L114 108 L86 108 Z"
            fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />

          {/* Left Arm */}
          <path d="M62 110 L42 118 L24 208 L22 254 L24 292 L30 322 L44 326 L50 322 L52 292 L52 254 L60 210 L70 120 Z"
            fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />

          {/* Right Arm */}
          <path d="M138 110 L158 118 L176 208 L178 254 L176 292 L170 322 L156 326 L150 322 L148 292 L148 254 L140 210 L130 120 Z"
            fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />

          {/* Left Leg */}
          <path d="M76 276 L64 278 L58 350 L56 380 L58 440 L60 462 L80 464 L86 462 L86 440 L88 380 L90 350 L90 278 Z"
            fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />

          {/* Right Leg */}
          <path d="M124 276 L136 278 L142 350 L144 380 L142 440 L140 462 L120 464 L114 462 L114 440 L112 380 L110 350 L110 278 Z"
            fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />

          {/* Back-only: spine line */}
          {view === 'back' && (
            <line x1="100" y1="108" x2="100" y2="270"
              stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
          )}

          {/* Face details — front only */}
          {view === 'front' && (
            <g opacity="0.4">
              <circle cx="90" cy="48" r="3" fill="#94a3b8" />
              <circle cx="110" cy="48" r="3" fill="#94a3b8" />
              <path d="M93 62 Q100 67 107 62" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
            </g>
          )}
        </g>

        {/* Interactive region overlays */}
        <g className="region-zones">
          {regions.map((region) => (
            <RegionZone
              key={region.id}
              region={region}
              view={view}
              isSelected={selectedRegionId === region.id}
              onClick={() => onRegionClick(region)}
            />
          ))}
        </g>

        {/* Selected region label */}
        {selectedRegionId && regions.map((region) => {
          if (region.id !== selectedRegionId) return null
          const labelPos = view === 'front'
            ? region.svgLabel?.front
            : region.svgLabel?.back
          if (!labelPos) return null
          return (
            <g key={`label-${region.id}`}>
              <circle cx={labelPos.x} cy={labelPos.y} r="5"
                fill="rgb(20,184,166)" opacity="0.9" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
