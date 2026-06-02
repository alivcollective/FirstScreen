'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  SEARCH_SUGGESTIONS,
  getRegion,
  searchRegions,
  type BodyRegion,
  type RegionId,
  type ViewMode,
} from '@/data/body-map/regions'
import { cn } from '@/lib/utils'

// ── IMAGE SPECS ───────────────────────────────────────────────
// human-front.png / human-back.png: 1024 × 1536 px  →  ratio 2 : 3
// ViewBox must match: 0 0 300 450  (300 × 450 = same 2:3 ratio)
// Container uses aspect-[2/3] so image fills without letterboxing.
// The SVG overlay is absolutely inset, same size as the image.
// Both scroll/zoom together inside a single motion.div wrapper.

const VB_W = 300
const VB_H = 450
const VIEW_BOX = `0 0 ${VB_W} ${VB_H}`

const ASSET_PATHS: Record<ViewMode, string> = {
  front: '/body-map/human-front.png',
  back: '/body-map/human-back.png',
}

// ── REGION SHAPES ─────────────────────────────────────────────
// Coordinates are in the SVG coordinate space (0 0 300 450).
// The body image fills this entire space.
//
// HOW TO ADJUST:
//   Open the page in browser, open DevTools, inspect the SVG.
//   Temporarily set fill="rgba(255,0,0,0.4)" on a path to see it.
//   Adjust x/y/cx/cy/d values until the highlight aligns with the body part.
//
// COORDINATE GUIDE (approximate for a standard medical body illustration):
//   Head top:  y≈10   Head center: y≈52   Chin: y≈88
//   Shoulders: y≈108  Armpit: y≈145       Waist: y≈225
//   Hips:      y≈265  Crotch: y≈295       Knees: y≈360
//   Ankles:    y≈415  Toes:   y≈440
//   Body width at chest: x ≈ 68–232  at waist: x ≈ 80–220

type Shape =
  | { type: 'ellipse'; id: RegionId; cx: number; cy: number; rx: number; ry: number }
  | { type: 'rect';    id: RegionId; x: number;  y: number;  w: number;  h: number; r?: number }
  | { type: 'poly';    id: RegionId; points: string }

const SHAPES: Record<ViewMode, Shape[]> = {
  front: [
    // ── HEAD & FACE ──────────────────────────────────────────
    { type: 'ellipse', id: 'head',  cx: 150, cy: 52,  rx: 38, ry: 44 },
    { type: 'ellipse', id: 'face',  cx: 150, cy: 58,  rx: 30, ry: 34 },
    // ── NECK ─────────────────────────────────────────────────
    { type: 'rect',    id: 'neck',  x: 128,  y: 94,   w: 44,  h: 24, r: 10 },
    // ── CHEST (col-span, both sides) ─────────────────────────
    { type: 'poly', id: 'chest',
      points: '70,114 230,114 242,190 58,190' },
    // ── LEFT/RIGHT CHEST (sub-regions) ───────────────────────
    { type: 'poly', id: 'left-chest',
      points: '70,114 150,114 150,190 58,190' },
    { type: 'poly', id: 'right-chest',
      points: '150,114 230,114 242,190 150,190' },
    // ── ABDOMEN ──────────────────────────────────────────────
    { type: 'poly', id: 'upper-abdomen',
      points: '58,190 242,190 238,240 62,240' },
    { type: 'poly', id: 'lower-abdomen',
      points: '62,240 238,240 234,285 66,285' },
    // ── PELVIS / GROIN ────────────────────────────────────────
    { type: 'poly', id: 'left-hip',
      points: '66,285 150,285 148,318 62,316' },
    { type: 'poly', id: 'right-hip',
      points: '150,285 234,285 238,316 152,318' },
    // ── SHOULDERS ────────────────────────────────────────────
    { type: 'poly', id: 'left-shoulder',
      points: '40,108 80,108 74,160 20,156' },
    { type: 'poly', id: 'right-shoulder',
      points: '260,108 220,108 226,160 280,156' },
    // ── UPPER ARMS ───────────────────────────────────────────
    { type: 'poly', id: 'left-upper-arm',
      points: '14,158 56,154 52,248 12,244' },
    { type: 'poly', id: 'right-upper-arm',
      points: '286,158 244,154 248,248 288,244' },
    // ── ELBOWS ───────────────────────────────────────────────
    { type: 'ellipse', id: 'left-elbow',  cx: 26,  cy: 252, rx: 18, ry: 14 },
    { type: 'ellipse', id: 'right-elbow', cx: 274, cy: 252, rx: 18, ry: 14 },
    // ── FOREARMS ─────────────────────────────────────────────
    { type: 'poly', id: 'left-forearm',
      points: '10,262 46,260 46,330 12,328' },
    { type: 'poly', id: 'right-forearm',
      points: '290,262 254,260 254,330 288,328' },
    // ── HANDS ────────────────────────────────────────────────
    { type: 'poly', id: 'left-hand',
      points: '10,330 46,328 48,355 8,355' },
    { type: 'poly', id: 'right-hand',
      points: '290,330 254,328 252,355 292,355' },
    // ── THIGHS ───────────────────────────────────────────────
    { type: 'poly', id: 'left-thigh',
      points: '62,318 136,316 130,364 60,364' },
    { type: 'poly', id: 'right-thigh',
      points: '238,318 164,316 170,364 240,364' },
    // ── KNEES ────────────────────────────────────────────────
    { type: 'ellipse', id: 'left-knee',  cx: 88,  cy: 374, rx: 28, ry: 22 },
    { type: 'ellipse', id: 'right-knee', cx: 212, cy: 374, rx: 28, ry: 22 },
    // ── LOWER LEGS ───────────────────────────────────────────
    { type: 'poly', id: 'left-lower-leg',
      points: '62,394 116,392 114,420 60,420' },
    { type: 'poly', id: 'right-lower-leg',
      points: '238,394 184,392 186,420 240,420' },
    // ── FEET ─────────────────────────────────────────────────
    { type: 'poly', id: 'left-foot',
      points: '60,420 114,420 116,440 54,440' },
    { type: 'poly', id: 'right-foot',
      points: '240,420 186,420 184,440 246,440' },
  ],

  back: [
    // ── HEAD ─────────────────────────────────────────────────
    { type: 'ellipse', id: 'head',  cx: 150, cy: 52,  rx: 38, ry: 44 },
    // ── NECK ─────────────────────────────────────────────────
    { type: 'rect',    id: 'neck',  x: 128,  y: 94,   w: 44,  h: 24, r: 10 },
    // ── BACK REGIONS ─────────────────────────────────────────
    { type: 'poly', id: 'upper-back',
      points: '68,116 232,116 240,190 60,190' },
    { type: 'poly', id: 'scapular-area',
      points: '68,116 232,116 238,196 62,196' },
    { type: 'poly', id: 'mid-back',
      points: '60,196 240,196 240,252 60,252' },
    { type: 'poly', id: 'lower-back',
      points: '60,252 240,252 238,290 62,290' },
    // ── SHOULDERS (BACK) ─────────────────────────────────────
    { type: 'poly', id: 'left-shoulder',
      points: '40,108 80,108 74,160 20,156' },
    { type: 'poly', id: 'right-shoulder',
      points: '260,108 220,108 226,160 280,156' },
    // ── UPPER ARMS (BACK) ────────────────────────────────────
    { type: 'poly', id: 'left-upper-arm',
      points: '14,158 56,154 52,248 12,244' },
    { type: 'poly', id: 'right-upper-arm',
      points: '286,158 244,154 248,248 288,244' },
    // ── ELBOWS (BACK) ────────────────────────────────────────
    { type: 'ellipse', id: 'left-elbow',  cx: 26,  cy: 252, rx: 18, ry: 14 },
    { type: 'ellipse', id: 'right-elbow', cx: 274, cy: 252, rx: 18, ry: 14 },
    // ── FOREARMS (BACK) ──────────────────────────────────────
    { type: 'poly', id: 'left-forearm',
      points: '10,262 46,260 46,330 12,328' },
    { type: 'poly', id: 'right-forearm',
      points: '290,262 254,260 254,330 288,328' },
    // ── HANDS (BACK) ─────────────────────────────────────────
    { type: 'poly', id: 'left-hand',
      points: '10,330 46,328 48,355 8,355' },
    { type: 'poly', id: 'right-hand',
      points: '290,330 254,328 252,355 292,355' },
    // ── BUTTOCKS ─────────────────────────────────────────────
    { type: 'poly', id: 'left-buttock',
      points: '62,290 150,290 148,330 60,330' },
    { type: 'poly', id: 'right-buttock',
      points: '150,290 238,290 240,330 152,330' },
    // ── THIGHS (BACK) ────────────────────────────────────────
    { type: 'poly', id: 'left-thigh',
      points: '60,330 136,328 130,368 58,368' },
    { type: 'poly', id: 'right-thigh',
      points: '240,330 164,328 170,368 242,368' },
    // ── KNEES (BACK) ─────────────────────────────────────────
    { type: 'ellipse', id: 'left-knee',  cx: 88,  cy: 378, rx: 28, ry: 22 },
    { type: 'ellipse', id: 'right-knee', cx: 212, cy: 378, rx: 28, ry: 22 },
    // ── CALVES / LOWER LEGS (BACK) ───────────────────────────
    { type: 'poly', id: 'left-lower-leg',
      points: '62,398 116,396 114,422 60,422' },
    { type: 'poly', id: 'right-lower-leg',
      points: '238,398 184,396 186,422 240,422' },
    // ── FEET (BACK) ──────────────────────────────────────────
    { type: 'poly', id: 'left-foot',
      points: '60,422 114,422 116,442 54,442' },
    { type: 'poly', id: 'right-foot',
      points: '240,422 186,422 184,442 246,442' },
  ],
}

// ── ZOOM CONFIG ───────────────────────────────────────────────
// [cx, cy, scale] — center of zoom region in viewBox coords, scale factor
// cx/cy = the point that will be centered in view after zoom
const ZOOM_CONFIG: Partial<Record<RegionId, { cx: number; cy: number; scale: number }>> = {
  head:             { cx: 150, cy: 52,  scale: 2.4 },
  face:             { cx: 150, cy: 58,  scale: 2.6 },
  neck:             { cx: 150, cy: 106, scale: 2.2 },
  chest:            { cx: 150, cy: 152, scale: 1.9 },
  'left-chest':     { cx: 104, cy: 152, scale: 2.0 },
  'right-chest':    { cx: 196, cy: 152, scale: 2.0 },
  'upper-abdomen':  { cx: 150, cy: 215, scale: 1.9 },
  'lower-abdomen':  { cx: 150, cy: 262, scale: 1.9 },
  'left-shoulder':  { cx: 47,  cy: 134, scale: 2.3 },
  'right-shoulder': { cx: 253, cy: 134, scale: 2.3 },
  'left-upper-arm': { cx: 33,  cy: 200, scale: 2.2 },
  'right-upper-arm':{ cx: 267, cy: 200, scale: 2.2 },
  'left-elbow':     { cx: 26,  cy: 252, scale: 2.5 },
  'right-elbow':    { cx: 274, cy: 252, scale: 2.5 },
  'left-forearm':   { cx: 28,  cy: 295, scale: 2.2 },
  'right-forearm':  { cx: 272, cy: 295, scale: 2.2 },
  'left-hand':      { cx: 29,  cy: 342, scale: 2.6 },
  'right-hand':     { cx: 271, cy: 342, scale: 2.6 },
  'left-hip':       { cx: 104, cy: 301, scale: 2.1 },
  'right-hip':      { cx: 196, cy: 301, scale: 2.1 },
  'left-thigh':     { cx: 96,  cy: 340, scale: 2.0 },
  'right-thigh':    { cx: 204, cy: 340, scale: 2.0 },
  'left-knee':      { cx: 88,  cy: 374, scale: 2.4 },
  'right-knee':     { cx: 212, cy: 374, scale: 2.4 },
  'left-lower-leg': { cx: 88,  cy: 407, scale: 2.2 },
  'right-lower-leg':{ cx: 212, cy: 407, scale: 2.2 },
  'left-foot':      { cx: 87,  cy: 430, scale: 2.5 },
  'right-foot':     { cx: 213, cy: 430, scale: 2.5 },
  'upper-back':     { cx: 150, cy: 153, scale: 1.9 },
  'scapular-area':  { cx: 150, cy: 156, scale: 2.2 },
  'mid-back':       { cx: 150, cy: 224, scale: 1.9 },
  'lower-back':     { cx: 150, cy: 271, scale: 2.0 },
  'left-buttock':   { cx: 100, cy: 310, scale: 2.2 },
  'right-buttock':  { cx: 200, cy: 310, scale: 2.2 },
}

function getZoomTransform(regionId: RegionId | null) {
  if (!regionId) return { x: '0%', y: '0%', scale: 1 }
  const cfg = ZOOM_CONFIG[regionId]
  if (!cfg) return { x: '0%', y: '0%', scale: 1 }
  // Translate so the region center moves to the container center (50% 50%)
  // In viewBox space: container center = (VB_W/2, VB_H/2) = (150, 225)
  // We want cfg.cx, cfg.cy to land at center after scale
  // translateX = (150 - cfg.cx) / VB_W * 100 * scale
  const dx = (VB_W / 2 - cfg.cx) / VB_W * 100
  const dy = (VB_H / 2 - cfg.cy) / VB_H * 100
  return {
    x: `${dx}%`,
    y: `${dy}%`,
    scale: cfg.scale,
  }
}

// ── Shape element ─────────────────────────────────────────────
function ShapeEl({
  shape, active, hovered, onClick, onHover, region,
}: {
  shape: Shape
  region: BodyRegion
  active: boolean
  hovered: boolean
  onClick: () => void
  onHover: (id: RegionId | null) => void
}) {
  const handlers = {
    onClick,
    onMouseEnter: () => onHover(region.id),
    onMouseLeave: () => onHover(null),
    onFocus:      () => onHover(region.id),
    onBlur:       () => onHover(null),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } },
    tabIndex: 0,
    role: 'button' as const,
    'aria-label': `${region.label_th} — ${region.label_en}`,
    'aria-pressed': active,
    className: cn(
      'cursor-pointer outline-none transition-all duration-150',
      active  ? 'fill-teal-400/32 stroke-[#2dd4bf]'
      : hovered ? 'fill-teal-300/18 stroke-[#2dd4bf]/80'
      : 'fill-transparent stroke-transparent hover:fill-teal-300/15 hover:stroke-[#2dd4bf]/60'
    ),
    strokeWidth: active ? 2.5 : 1.8,
  }

  if (shape.type === 'ellipse') {
    return <ellipse {...handlers} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />
  }
  if (shape.type === 'rect') {
    return <rect {...handlers} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.r ?? 8} />
  }
  // poly
  return <polygon {...handlers} points={shape.points} />
}

// ── View Toggle ───────────────────────────────────────────────
function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
      {(['front', 'back'] as ViewMode[]).map(v => (
        <button key={v} type="button" onClick={() => onChange(v)}
          className={cn(
            'min-w-[6rem] rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors',
            view === v ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'
          )}>
          {v === 'front' ? 'ด้านหน้า' : 'ด้านหลัง'}
        </button>
      ))}
    </div>
  )
}

// ── Search ────────────────────────────────────────────────────
function BodySearch({ onSelect }: { onSelect: (id: RegionId) => void }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const results = query.trim().length > 0 ? searchRegions(query).slice(0, 6) : []
  const showPanel = focused && (query.length === 0 || results.length > 0)

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-teal-300" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 140)}
          placeholder="ค้นหาอวัยวะหรืออาการ เช่น ปวดเข่า, chest"
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
        {query && (
          <button type="button" onClick={() => setQuery('')}
            className="rounded p-1 text-slate-500 hover:bg-white/10 hover:text-white" aria-label="ล้าง">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur">
            {query.length === 0 ? (
              <div className="p-3">
                <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">ค้นหาด่วน</p>
                <div className="flex flex-wrap gap-1.5">
                  {SEARCH_SUGGESTIONS.map(s => (
                    <button key={s.query} type="button"
                      onMouseDown={() => { onSelect(s.regionId); setQuery(''); setFocused(false) }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-teal-400/50 hover:bg-teal-400/10 hover:text-teal-200">
                      {s.query}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-1.5">
                {results.map(r => (
                  <button key={r.id} type="button"
                    onMouseDown={() => { onSelect(r.id); setQuery(''); setFocused(false) }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-teal-400/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                    <span className="text-sm font-medium text-slate-100">{r.label_th}</span>
                    <span className="ml-auto text-xs text-slate-500">{r.label_en}</span>
                  </button>
                ))}
                {results.length === 0 && <p className="px-4 py-3 text-sm text-slate-500">ไม่พบ</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Body Image Map ─────────────────────────────────────────────
// Architecture:
//   <div relative aspect-[2/3]>          ← fixed 2:3 container
//     <motion.div absolute inset-0>       ← zoom wrapper (image + SVG move together)
//       <Image fill object-contain />     ← PNG fills container exactly
//       <svg viewBox="0 0 300 450">       ← same 2:3 ratio, aligns pixel-perfect
//         <polygon regions />
//       </svg>
//     </motion.div>
//     <label bar absolute bottom-0 />
//   </div>

function BodyImageMap({
  view, activeRegion, hoveredRegion, onSelectRegion, onHoverRegion,
}: {
  view: ViewMode
  activeRegion: RegionId | null
  hoveredRegion: RegionId | null
  onSelectRegion: (id: RegionId) => void
  onHoverRegion: (id: RegionId | null) => void
}) {
  const zoom = getZoomTransform(activeRegion)
  const activeLabel = activeRegion ? getRegion(activeRegion) : undefined

  const visibleShapes = useMemo(() =>
    SHAPES[view]
      .map(s => ({ shape: s, region: getRegion(s.id) }))
      .filter((item): item is { shape: Shape; region: BodyRegion } => Boolean(item.region)),
    [view]
  )

  return (
    // Outer container: sets physical size + clips overflow during zoom
    <div className="relative mx-auto overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40
                    w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px]"
         style={{ aspectRatio: '2/3' }}>

      {/* Zoom wrapper — both image and SVG move as one */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: zoom.x, y: zoom.y, scale: zoom.scale }}
        transition={{ type: 'spring', stiffness: 110, damping: 20 }}
        style={{ transformOrigin: '50% 50%' }}
      >
        {/* PNG image */}
        <Image
          src={ASSET_PATHS[view]}
          alt={view === 'front' ? 'Human body front view' : 'Human body back view'}
          fill
          priority={view === 'front'}
          sizes="(max-width: 640px) 80vw, 360px"
          className="select-none object-contain"
          draggable={false}
        />

        {/* SVG hotspot overlay — viewBox matches image ratio exactly */}
        <svg
          viewBox={VIEW_BOX}
          className="absolute inset-0 h-full w-full"
          style={{ pointerEvents: 'none' }}
          aria-label="Clickable body regions"
        >
          {/* Enable pointer events only on the region shapes */}
          <g style={{ pointerEvents: 'all' }}>
            {visibleShapes.map(({ shape, region }) => (
              <ShapeEl
                key={`${view}-${shape.id}`}
                shape={shape}
                region={region}
                active={activeRegion === region.id}
                hovered={hoveredRegion === region.id}
                onClick={() => onSelectRegion(region.id)}
                onHover={onHoverRegion}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Status bar — stays outside the zoom wrapper so it doesn't move */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-3xl
                      bg-gradient-to-t from-slate-950/90 to-transparent px-4 py-4 pt-8">
        <p className="text-center text-xs font-medium text-slate-200">
          {activeLabel
            ? <><span className="text-teal-300">{activeLabel.label_th}</span> · {activeLabel.label_en}</>
            : 'คลิกบริเวณร่างกายเพื่อเลือกตำแหน่งอาการ'}
        </p>
      </div>
    </div>
  )
}

// ── Region Panel ──────────────────────────────────────────────
function RegionPanel({ regionId, selectedSymptoms, onToggleSymptom, onClose, onAssess }: {
  regionId: RegionId; selectedSymptoms: string[]
  onToggleSymptom: (id: string) => void; onClose: () => void; onAssess: () => void
}) {
  const region = getRegion(regionId)
  if (!region) return null

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex h-full flex-col bg-white"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-teal-600">ตำแหน่งที่เลือก</p>
          <h2 className="text-xl font-bold leading-tight text-slate-950">{region.label_th}</h2>
          <p className="text-sm font-medium text-slate-400">{region.label_en}</p>
        </div>
        <button type="button" onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {region.isEmergency && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-bold text-red-800">อาการฉุกเฉิน</p>
                <p className="mt-1 text-xs leading-relaxed text-red-700">{region.emergencyNote_th}</p>
              </div>
            </div>
            {region.hotline && (
              <a href={`tel:${region.hotline}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors">
                <Phone className="h-4 w-4" /> โทร {region.hotline} ทันที
              </a>
            )}
          </div>
        )}

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">คำอธิบาย</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{region.description_th}</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">อาการที่พบบ่อย</p>
          <div className="mt-3 space-y-2">
            {region.symptoms.map(sym => {
              const sel = selectedSymptoms.includes(sym.id)
              return (
                <button key={sym.id} type="button" onClick={() => onToggleSymptom(sym.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                    sel ? (sym.isEmergency ? 'border-red-300 bg-red-50' : 'border-teal-300 bg-teal-50')
                        : 'border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/40'
                  )}>
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2',
                    sel ? (sym.isEmergency ? 'border-red-500 bg-red-500' : 'border-teal-500 bg-teal-500') : 'border-slate-300')}>
                    {sel && <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{sym.label_th}</span>
                    <span className="block text-xs text-slate-500">{sym.label_en}</span>
                  </span>
                  {sym.isEmergency && (
                    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">ฉุกเฉิน</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        <button type="button" onClick={onAssess} disabled={selectedSymptoms.length === 0}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors',
            selectedSymptoms.length > 0 ? 'bg-teal-600 text-white hover:bg-teal-500' : 'cursor-not-allowed bg-slate-100 text-slate-400'
          )}>
          ประเมินอาการ
          {selectedSymptoms.length > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{selectedSymptoms.length}</span>
          )}
          <ChevronRight className="h-4 w-4" />
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] text-slate-400">
          <ShieldCheck className="h-3 w-3 text-teal-500" /> เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัย
        </p>
      </div>
    </motion.aside>
  )
}

// ── Main Export ───────────────────────────────────────────────
export function PremiumBodyMap() {
  const [view, setView] = useState<ViewMode>('front')
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const active = activeRegion ? getRegion(activeRegion) : undefined

  const selectRegion = useCallback((id: RegionId) => {
    const r = getRegion(id)
    if (!r) return
    if (r.view === 'front' || r.view === 'back') setView(r.view)
    setActiveRegion(id)
    setSelectedSymptoms([])
  }, [])

  const reset = useCallback(() => {
    setActiveRegion(null)
    setHoveredRegion(null)
    setSelectedSymptoms([])
  }, [])

  const assess = useCallback(() => {
    if (!activeRegion || selectedSymptoms.length === 0) return
    const p = new URLSearchParams({ bodyPart: activeRegion, symptom: selectedSymptoms.join(',') })
    window.location.href = `/symptom-assessment?${p}`
  }, [activeRegion, selectedSymptoms])

  return (
    <div className="min-h-[80vh] bg-[#0a0f1e]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">

        {/* Left: body viewer */}
        <section className="flex min-w-0 flex-col items-center gap-5">
          <BodySearch onSelect={selectRegion} />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ViewToggle view={view} onChange={v => { setView(v); reset() }} />
            {activeRegion && (
              <button type="button" onClick={reset}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                <RotateCcw className="h-3.5 w-3.5" /> ดูทั้งตัว
              </button>
            )}
          </div>

          <BodyImageMap
            view={view}
            activeRegion={activeRegion}
            hoveredRegion={hoveredRegion}
            onSelectRegion={selectRegion}
            onHoverRegion={setHoveredRegion}
          />
        </section>

        {/* Right: panel (desktop) */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            {activeRegion ? (
              <div key="panel" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                   style={{ height: 'min(68vh, 700px)', minHeight: '520px' }}>
                <RegionPanel regionId={activeRegion} selectedSymptoms={selectedSymptoms}
                  onToggleSymptom={id => setSelectedSymptoms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
                  onClose={reset} onAssess={assess} />
              </div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
                style={{ height: 'min(68vh, 700px)', minHeight: '520px' }}>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/10">
                  <ShieldCheck className="h-7 w-7 text-teal-300" />
                </div>
                <h2 className="text-lg font-bold text-white">เลือกตำแหน่งบนรูปภาพ</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                  คลิกที่บริเวณร่างกายที่มีอาการ จากนั้นเลือกอาการที่ตรงกัน
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {activeRegion && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
              onClick={reset} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl lg:hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div>
                  <p className="text-xs font-bold text-teal-600">เลือกแล้ว</p>
                  <p className="text-sm font-bold text-slate-950">{active?.label_th} · {active?.label_en}</p>
                </div>
                <button type="button" onClick={reset}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[calc(82vh-58px)] overflow-y-auto">
                <RegionPanel regionId={activeRegion} selectedSymptoms={selectedSymptoms}
                  onToggleSymptom={id => setSelectedSymptoms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
                  onClose={reset} onAssess={assess} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Emergency bar */}
      <div className="mx-auto max-w-7xl px-4 pb-6 lg:px-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-red-400/20 bg-red-400/8 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            <p className="text-xs leading-relaxed text-red-100/80">
              อาการรุนแรง เจ็บหน้าอก หายใจไม่ออก แขนขาอ่อนแรงเฉียบพลัน:{' '}
              <a href="tel:1669" className="font-bold underline">โทร 1669</a> ทันที
            </p>
          </div>
          <Link href="/symptoms"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10 whitespace-nowrap">
            ตรวจอาการละเอียด <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
