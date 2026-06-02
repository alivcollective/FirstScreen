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

// Parse zone descriptor: "ellipse:cx,cy,rx,ry" | "rect:x,y,w,h"
function parseZone(desc: string) {
  if (desc.startsWith('ellipse:')) {
    const [cx, cy, rx, ry] = desc.slice(8).split(',').map(Number)
    return { type: 'ellipse' as const, cx, cy, rx, ry }
  }
  if (desc.startsWith('rect:')) {
    const [x, y, w, h] = desc.slice(5).split(',').map(Number)
    return { type: 'rect' as const, x, y, width: w, height: h, rx: 8 }
  }
  return null
}

function RegionZone({ region, view, isSelected, onClick }: {
  region: BodyRegion
  view: BodyViewMode
  isSelected: boolean
  onClick: () => void
}) {
  const desc = view === 'front' ? region.svgZone.front : region.svgZone.back
  if (!desc) return null
  const z = parseZone(desc)
  if (!z) return null

  const fill = isSelected ? 'rgba(20,184,166,0.28)' : 'transparent'
  const stroke = isSelected ? 'rgb(20,184,166)' : 'transparent'
  const props = { onClick, role: 'button' as const, 'aria-label': region.name_th, 'aria-pressed': isSelected,
    style: { cursor: 'pointer', fill, stroke, strokeWidth: 1.5, transition: 'all 0.15s' } }

  return z.type === 'ellipse'
    ? <ellipse className="hover:fill-teal-400/15 hover:stroke-teal-400/50" cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} {...props} />
    : <rect className="hover:fill-teal-400/15 hover:stroke-teal-400/50" x={z.x} y={z.y} width={z.width} height={z.height} rx={z.rx} {...props} />
}

// ── Professional Medical Body SVG ─────────────────────────────
// Clean anatomical illustration — Ada Health / Apple Health style
// ViewBox 0 0 200 500, centered at x=100

const BODY_FILL = '#f8fafc'         // slate-50
const BODY_STROKE = '#cbd5e1'       // slate-300
const STROKE_W = '1.2'
const INTERNAL_STROKE = '#e2e8f0'  // slate-200

function MedicalBodyFront() {
  return (
    <g>
      {/* ── Head ─────────────────────────────────────────────── */}
      <ellipse cx="100" cy="45" rx="26" ry="31"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Neck ─────────────────────────────────────────────── */}
      <path d="M 91 73 C 91 78 90 88 90 94 L 110 94 C 110 88 109 78 109 73 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Torso (chest + abdomen + pelvis) ─────────────────── */}
      <path d="
        M 90 94
        C 84 96 68 100 52 110
        C 44 116 38 126 36 140
        C 38 148 50 154 60 162
        C 64 178 66 198 66 218
        C 66 238 62 256 60 270
        C 60 280 60 288 64 296
        L 80 300
        L 120 300
        L 136 296
        C 140 288 140 280 140 270
        C 138 256 134 238 134 218
        C 134 198 136 178 140 162
        C 150 154 162 148 164 140
        C 162 126 156 116 148 110
        C 132 100 116 96 110 94
        Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Left Arm (screen-left = anatomical right) ─────────── */}
      <path d="
        M 38 132
        C 30 138 22 158 18 180
        C 16 196 18 216 20 236
        C 22 252 24 268 24 282
        C 24 294 22 306 22 314
        C 24 322 28 326 34 326
        C 40 326 44 322 46 314
        C 46 306 44 292 44 278
        C 46 264 48 248 50 234
        C 54 214 56 196 54 178
        C 52 158 50 140 50 132
        C 46 126 42 128 38 132 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* Left Hand */}
      <ellipse cx="34" cy="334" rx="10" ry="14"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Right Arm ─────────────────────────────────────────── */}
      <path d="
        M 162 132
        C 170 138 178 158 182 180
        C 184 196 182 216 180 236
        C 178 252 176 268 176 282
        C 176 294 178 306 178 314
        C 176 322 172 326 166 326
        C 160 326 156 322 154 314
        C 154 306 156 292 156 278
        C 154 264 152 248 150 234
        C 146 214 144 196 146 178
        C 148 158 150 140 150 132
        C 154 126 158 128 162 132 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* Right Hand */}
      <ellipse cx="166" cy="334" rx="10" ry="14"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Left Leg ─────────────────────────────────────────── */}
      <path d="
        M 64 296
        C 56 296 50 302 48 316
        C 46 332 48 352 50 370
        C 52 382 56 390 58 400
        C 58 412 54 428 52 444
        C 50 456 50 466 52 474
        L 68 476
        C 76 476 82 472 84 466
        C 86 458 84 446 82 434
        C 80 422 78 412 78 400
        C 80 390 82 380 82 368
        C 82 354 80 338 78 322
        C 76 308 76 298 78 296
        L 64 296 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* Left Foot */}
      <path d="M 52 472 C 46 474 40 478 38 484 C 38 490 46 494 62 494 C 72 494 80 490 84 486 C 82 480 74 474 68 474 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Right Leg ─────────────────────────────────────────── */}
      <path d="
        M 136 296
        C 144 296 150 302 152 316
        C 154 332 152 352 150 370
        C 148 382 144 390 142 400
        C 142 412 146 428 148 444
        C 150 456 150 466 148 474
        L 132 476
        C 124 476 118 472 116 466
        C 114 458 116 446 118 434
        C 120 422 122 412 122 400
        C 120 390 118 380 118 368
        C 118 354 120 338 122 322
        C 124 308 124 298 122 296
        L 136 296 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* Right Foot */}
      <path d="M 148 472 C 154 474 160 478 162 484 C 162 490 154 494 138 494 C 128 494 120 490 116 486 C 118 480 126 474 132 474 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Internal reference lines (very subtle) ────────────── */}
      {/* Clavicle hints */}
      <path d="M 90 100 Q 70 104 52 110" stroke={INTERNAL_STROKE} strokeWidth="0.8" fill="none" />
      <path d="M 110 100 Q 130 104 148 110" stroke={INTERNAL_STROKE} strokeWidth="0.8" fill="none" />
      {/* Waist hint */}
      <path d="M 67 220 Q 100 224 133 220" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
      {/* Groin crease */}
      <path d="M 80 298 Q 100 302 120 298" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
      {/* Knee lines */}
      <path d="M 50 384 Q 63 388 76 384" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
      <path d="M 124 384 Q 137 388 150 384" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
      {/* Elbow hints */}
      <path d="M 18 226 Q 24 230 30 226" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
      <path d="M 170 226 Q 176 230 182 226" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />

      {/* ── Subtle face features ─────────────────────────────── */}
      <ellipse cx="91" cy="45" rx="3.5" ry="4" fill="#dde4ef" opacity="0.6" />
      <ellipse cx="109" cy="45" rx="3.5" ry="4" fill="#dde4ef" opacity="0.6" />
      <path d="M 93 60 Q 100 65 107 60" stroke={BODY_STROKE} strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  )
}

function MedicalBodyBack() {
  return (
    <g>
      {/* ── Head (back) ───────────────────────────────────────── */}
      <ellipse cx="100" cy="45" rx="26" ry="31"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Neck (back) ───────────────────────────────────────── */}
      <path d="M 91 73 C 91 78 90 88 90 94 L 110 94 C 110 88 109 78 109 73 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Torso back ────────────────────────────────────────── */}
      <path d="
        M 90 94
        C 84 96 68 100 52 110
        C 44 116 38 126 36 140
        C 38 148 50 154 60 162
        C 64 178 66 198 66 218
        C 66 238 62 256 60 270
        C 60 280 60 288 64 296
        L 80 300
        L 120 300
        L 136 296
        C 140 288 140 280 140 270
        C 138 256 134 238 134 218
        C 134 198 136 178 140 162
        C 150 154 162 148 164 140
        C 162 126 156 116 148 110
        C 132 100 116 96 110 94
        Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Back anatomy lines ────────────────────────────────── */}
      {/* Spine line */}
      <line x1="100" y1="94" x2="100" y2="295" stroke={INTERNAL_STROKE} strokeWidth="1" strokeDasharray="3,3" />
      {/* Scapula outlines */}
      <path d="M 65 110 Q 70 134 72 156 Q 78 162 88 158 Q 94 148 92 128 Q 88 112 80 108 Z"
        fill="none" stroke={INTERNAL_STROKE} strokeWidth="0.8" />
      <path d="M 135 110 Q 130 134 128 156 Q 122 162 112 158 Q 106 148 108 128 Q 112 112 120 108 Z"
        fill="none" stroke={INTERNAL_STROKE} strokeWidth="0.8" />
      {/* Waist hint */}
      <path d="M 67 220 Q 100 216 133 220" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
      {/* Glute line */}
      <path d="M 66 270 Q 100 278 134 270" stroke={INTERNAL_STROKE} strokeWidth="0.8" fill="none" />

      {/* ── Arms (back view same as front) ────────────────────── */}
      <path d="
        M 38 132 C 30 138 22 158 18 180 C 16 196 18 216 20 236
        C 22 252 24 268 24 282 C 24 294 22 306 22 314
        C 24 322 28 326 34 326 C 40 326 44 322 46 314
        C 46 306 44 292 44 278 C 46 264 48 248 50 234
        C 54 214 56 196 54 178 C 52 158 50 140 50 132
        C 46 126 42 128 38 132 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />
      <ellipse cx="34" cy="334" rx="10" ry="14"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      <path d="
        M 162 132 C 170 138 178 158 182 180 C 184 196 182 216 180 236
        C 178 252 176 268 176 282 C 176 294 178 306 178 314
        C 176 322 172 326 166 326 C 160 326 156 322 154 314
        C 154 306 156 292 156 278 C 154 264 152 248 150 234
        C 146 214 144 196 146 178 C 148 158 150 140 150 132
        C 154 126 158 128 162 132 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />
      <ellipse cx="166" cy="334" rx="10" ry="14"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* ── Legs (back) ───────────────────────────────────────── */}
      <path d="
        M 64 296 C 56 296 50 302 48 316 C 46 332 48 352 50 370
        C 52 382 56 390 58 400 C 58 412 54 428 52 444
        C 50 456 50 466 52 474 L 68 476
        C 76 476 82 472 84 466 C 86 458 84 446 82 434
        C 80 422 78 412 78 400 C 80 390 82 380 82 368
        C 82 354 80 338 78 322 C 76 308 76 298 78 296
        L 64 296 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />
      <path d="M 52 472 C 46 474 40 478 38 484 C 38 490 46 494 62 494 C 72 494 80 490 84 486 C 82 480 74 474 68 474 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      <path d="
        M 136 296 C 144 296 150 302 152 316 C 154 332 152 352 150 370
        C 148 382 144 390 142 400 C 142 412 146 428 148 444
        C 150 456 150 466 148 474 L 132 476
        C 124 476 118 472 116 466 C 114 458 116 446 118 434
        C 120 422 122 412 122 400 C 120 390 118 380 118 368
        C 118 354 120 338 122 322 C 124 308 124 298 122 296
        L 136 296 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />
      <path d="M 148 472 C 154 474 160 478 162 484 C 162 490 154 494 138 494 C 128 494 120 490 116 486 C 118 480 126 474 132 474 Z"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={STROKE_W} />

      {/* Calf line (back) */}
      <path d="M 52 416 Q 63 422 74 416" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
      <path d="M 126 416 Q 137 422 148 416" stroke={INTERNAL_STROKE} strokeWidth="0.7" fill="none" />
    </g>
  )
}

export function BodyViewer2D({ view, selectedRegionId, onRegionClick, className }: BodyViewer2DProps) {
  const regions = useMemo(() => getRegionsByView(view), [view])

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <style>{`
        .body-zone { transition: fill 0.14s, stroke 0.14s; }
        .body-zone:hover { fill: rgba(20,184,166,0.14); stroke: rgba(20,184,166,0.5); stroke-width: 1.5px; }
        .body-zone.selected { fill: rgba(20,184,166,0.26) !important; stroke: rgb(20,184,166) !important; stroke-width: 1.8px !important; }
      `}</style>

      <svg
        viewBox="0 0 200 510"
        className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] drop-shadow-sm select-none"
        aria-label={view === 'front' ? 'ร่างกายด้านหน้า' : 'ร่างกายด้านหลัง'}
        role="img"
      >
        {/* Medical body illustration */}
        {view === 'front' ? <MedicalBodyFront /> : <MedicalBodyBack />}

        {/* Interactive region overlays */}
        {regions.map((region) => {
          const desc = view === 'front' ? region.svgZone.front : region.svgZone.back
          if (!desc) return null
          const z = parseZone(desc)
          if (!z) return null
          const isSelected = selectedRegionId === region.id
          const baseProps = {
            className: cn('body-zone', isSelected && 'selected'),
            onClick: () => onRegionClick(region),
            role: 'button' as const,
            'aria-label': region.name_th,
            'aria-pressed': isSelected,
            style: { cursor: 'pointer', fill: isSelected ? 'rgba(20,184,166,0.26)' : 'transparent', stroke: isSelected ? 'rgb(20,184,166)' : 'transparent', strokeWidth: 1.5 },
          }
          return z.type === 'ellipse'
            ? <ellipse key={region.id} {...baseProps} cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} />
            : <rect key={region.id} {...baseProps} x={z.x} y={z.y} width={z.width} height={z.height} rx={z.rx ?? 6} />
        })}

        {/* Selected region dot indicator */}
        {selectedRegionId && regions.map((r) => {
          if (r.id !== selectedRegionId) return null
          const labelPos = view === 'front' ? r.svgLabel?.front : r.svgLabel?.back
          if (!labelPos) return null
          return <circle key={`dot-${r.id}`} cx={labelPos.x} cy={labelPos.y} r="4" fill="rgb(20,184,166)" opacity="0.9" />
        })}
      </svg>
    </div>
  )
}
