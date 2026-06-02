'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronRight,
  ImageOff,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  BODY_MAP_ASSETS,
  BODY_MAP_SEARCH_SUGGESTIONS,
  BODY_MAP_VIEWBOX,
  getBodyMapRegion,
  getBodyMapRegions,
  searchBodyMapRegions,
  type BodyMapRegion,
  type BodyMapRegionId,
  type BodyMapView,
} from '@/data/body-map/webmd-regions'
import { cn } from '@/lib/utils'

function getZoom(region: BodyMapRegion | null) {
  if (!region) return { x: '0%', y: '0%', scale: 1 }
  const dx = ((BODY_MAP_VIEWBOX.width / 2 - region.zoom.cx) / BODY_MAP_VIEWBOX.width) * 100
  const dy = ((BODY_MAP_VIEWBOX.height / 2 - region.zoom.cy) / BODY_MAP_VIEWBOX.height) * 100

  return {
    x: `${dx}%`,
    y: `${dy}%`,
    scale: region.zoom.scale,
  }
}

function ViewToggle({ view, onChange }: { view: BodyMapView; onChange: (view: BodyMapView) => void }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
      {(['front', 'back'] as BodyMapView[]).map(item => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            'min-w-24 rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
            view === item ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'
          )}
        >
          {item === 'front' ? 'ด้านหน้า' : 'ด้านหลัง'}
        </button>
      ))}
    </div>
  )
}

function BodySearch({ onSelect }: { onSelect: (id: BodyMapRegionId) => void }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const results = query.trim() ? searchBodyMapRegions(query).slice(0, 7) : []
  const open = focused && (!query.trim() || results.length > 0)

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-teal-300" />
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 140)}
          placeholder="ค้นหาอวัยวะหรืออาการ เช่น ปวดเข่า, chest pain"
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="ล้างคำค้นหา"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur"
          >
            {!query.trim() ? (
              <div className="p-3">
                <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  ค้นหาด่วน
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {BODY_MAP_SEARCH_SUGGESTIONS.map(item => (
                    <button
                      key={item.query}
                      type="button"
                      onMouseDown={() => {
                        onSelect(item.regionId)
                        setQuery('')
                        setFocused(false)
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-teal-400/50 hover:bg-teal-400/10 hover:text-teal-200"
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-1.5">
                {results.map(region => (
                  <button
                    key={region.id}
                    type="button"
                    onMouseDown={() => {
                      onSelect(region.id)
                      setQuery('')
                      setFocused(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-teal-400/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                    <span className="text-sm font-medium text-slate-100">{region.thaiName}</span>
                    <span className="ml-auto text-xs text-slate-500">{region.englishName}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MissingAssetMessage({ assetPath }: { assetPath: string }) {
  return (
    <div className="flex aspect-[2/3] w-full max-w-[420px] items-center justify-center rounded-3xl border border-dashed border-amber-400/40 bg-amber-400/8 p-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15">
          <ImageOff className="h-6 w-6 text-amber-300" />
        </div>
        <h2 className="text-base font-bold text-white">Missing body map image asset</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-100/80">
          ไม่พบไฟล์รูปสำหรับ Body Map กรุณาเพิ่มไฟล์นี้:
        </p>
        <code className="mt-3 block rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-amber-200">
          public{assetPath}
        </code>
      </div>
    </div>
  )
}

function BodyImageMap({
  view,
  selectedRegion,
  hoveredRegionId,
  debug,
  onSelect,
  onHover,
}: {
  view: BodyMapView
  selectedRegion: BodyMapRegion | null
  hoveredRegionId: BodyMapRegionId | null
  debug: boolean
  onSelect: (id: BodyMapRegionId) => void
  onHover: (id: BodyMapRegionId | null) => void
}) {
  const [missing, setMissing] = useState<Record<BodyMapView, boolean>>({ front: false, back: false })
  const regions = useMemo(() => getBodyMapRegions(view), [view])
  const zoom = getZoom(selectedRegion)

  if (missing[view]) {
    return <MissingAssetMessage assetPath={BODY_MAP_ASSETS[view]} />
  }

  return (
    <div className="w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/35 shadow-2xl shadow-black/35">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ x: zoom.x, y: zoom.y, scale: zoom.scale }}
          transition={{ type: 'spring', stiffness: 115, damping: 22 }}
          style={{ transformOrigin: '50% 50%' }}
        >
          <Image
            src={BODY_MAP_ASSETS[view]}
            alt={view === 'front' ? 'Human body front view' : 'Human body back view'}
            fill
            priority={view === 'front'}
            sizes="(max-width: 768px) 92vw, 420px"
            className="select-none object-contain"
            draggable={false}
            onError={() => setMissing(prev => ({ ...prev, [view]: true }))}
          />

          <svg
            viewBox={BODY_MAP_VIEWBOX.value}
            className="absolute inset-0 h-full w-full"
            style={{ pointerEvents: 'none' }}
            aria-label="Clickable anatomical body regions"
          >
            {regions.map(region => {
              const selected = selectedRegion?.id === region.id
              const hovered = hoveredRegionId === region.id
              const visibleForDebug = debug && !selected && !hovered

              return (
                <path
                  key={region.id}
                  d={region.path}
                  role="button"
                  tabIndex={0}
                  aria-label={`${region.thaiName} ${region.englishName}`}
                  aria-pressed={selected}
                  onClick={() => onSelect(region.id)}
                  onMouseEnter={() => onHover(region.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(region.id)}
                  onBlur={() => onHover(null)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(region.id)
                    }
                  }}
                  vectorEffect="non-scaling-stroke"
                  className="cursor-pointer outline-none transition-colors duration-150"
                  style={{
                    pointerEvents: 'all',
                    fill: selected
                      ? 'rgba(45,212,191,0.30)'
                      : hovered
                        ? 'rgba(45,212,191,0.18)'
                        : visibleForDebug
                          ? 'rgba(45,212,191,0.10)'
                          : 'rgba(45,212,191,0)',
                    stroke: selected || hovered || visibleForDebug ? '#2dd4bf' : 'rgba(45,212,191,0)',
                    strokeWidth: selected || hovered || visibleForDebug ? 2 : 0,
                  }}
                />
              )
            })}
          </svg>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-4 py-4 pt-12">
          <p className="text-center text-xs font-medium text-slate-200">
            {selectedRegion ? (
              <>
                <span className="text-teal-300">{selectedRegion.thaiName}</span> · {selectedRegion.englishName}
              </>
            ) : (
              'คลิกบริเวณร่างกายเพื่อเลือกตำแหน่งอาการ'
            )}
          </p>
        </div>
      </div>

      {debug && (
        <div className="border-t border-teal-300/20 bg-slate-950 px-4 py-2">
          <p className="text-xs font-mono text-teal-200">
            debugBodyMap=1 · hover: {hoveredRegionId ?? 'none'}
          </p>
        </div>
      )}
    </div>
  )
}

function RegionPanel({
  region,
  selectedSymptoms,
  onToggleSymptom,
  onClose,
  onAssess,
}: {
  region: BodyMapRegion
  selectedSymptoms: string[]
  onToggleSymptom: (symptom: string) => void
  onClose: () => void
  onAssess: () => void
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex h-full flex-col bg-white"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-teal-600">ตำแหน่งที่เลือก</p>
          <h2 className="text-xl font-bold leading-tight text-slate-950">{region.thaiName}</h2>
          <p className="text-sm font-medium text-slate-500">{region.englishName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="ปิดแผงอาการ"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {region.emergencyNote && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-bold text-red-800">อาการที่ควรระวัง</p>
                <p className="mt-1 text-xs leading-relaxed text-red-700">{region.emergencyNote}</p>
              </div>
            </div>
            <a
              href="tel:1669"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500"
            >
              <Phone className="h-4 w-4" />
              โทร 1669
            </a>
          </div>
        )}

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Common symptoms</p>
          <div className="mt-3 space-y-2">
            {region.commonSymptoms.map(symptom => {
              const key = `${symptom.th}-${symptom.en}`
              const selected = selectedSymptoms.includes(key)

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onToggleSymptom(key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                    selected
                      ? symptom.emergency
                        ? 'border-red-300 bg-red-50'
                        : 'border-teal-300 bg-teal-50'
                      : 'border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/40'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2',
                      selected
                        ? symptom.emergency
                          ? 'border-red-500 bg-red-500'
                          : 'border-teal-500 bg-teal-500'
                        : 'border-slate-300'
                    )}
                  >
                    {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{symptom.th}</span>
                    <span className="block text-xs text-slate-500">{symptom.en}</span>
                  </span>
                  {symptom.emergency && (
                    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                      ฉุกเฉิน
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={onAssess}
          disabled={selectedSymptoms.length === 0}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors',
            selectedSymptoms.length > 0
              ? 'bg-teal-600 text-white hover:bg-teal-500'
              : 'cursor-not-allowed bg-slate-100 text-slate-400'
          )}
        >
          ประเมินอาการ
          {selectedSymptoms.length > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{selectedSymptoms.length}</span>
          )}
          <ChevronRight className="h-4 w-4" />
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] text-slate-400">
          <ShieldCheck className="h-3 w-3 text-teal-500" />
          เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัย
        </p>
      </div>
    </motion.aside>
  )
}

export function PremiumBodyMap() {
  const [view, setView] = useState<BodyMapView>('front')
  const [selectedRegionId, setSelectedRegionId] = useState<BodyMapRegionId | null>(null)
  const [hoveredRegionId, setHoveredRegionId] = useState<BodyMapRegionId | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [debug] = useState(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('debugBodyMap') === '1'
  })

  const selectedRegion = selectedRegionId ? getBodyMapRegion(selectedRegionId) ?? null : null

  const reset = useCallback(() => {
    setSelectedRegionId(null)
    setHoveredRegionId(null)
    setSelectedSymptoms([])
  }, [])

  const selectRegion = useCallback((id: BodyMapRegionId) => {
    const region = getBodyMapRegion(id)
    if (!region) return
    setView(region.view)
    setSelectedRegionId(id)
    setSelectedSymptoms([])
  }, [])

  const toggleSymptom = useCallback((symptom: string) => {
    setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(item => item !== symptom) : [...prev, symptom])
  }, [])

  const assess = useCallback(() => {
    if (!selectedRegionId || selectedSymptoms.length === 0) return
    const params = new URLSearchParams({
      bodyPart: selectedRegionId,
      symptom: selectedSymptoms.join(','),
    })
    window.location.href = `/symptom-assessment?${params}`
  }, [selectedRegionId, selectedSymptoms])

  return (
    <div className="min-h-[80vh] overflow-x-hidden bg-[#0a0f1e]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <section className="flex min-w-0 flex-col items-center gap-5">
          <BodySearch onSelect={selectRegion} />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ViewToggle
              view={view}
              onChange={nextView => {
                setView(nextView)
                reset()
              }}
            />
            {selectedRegion && (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                ดูทั้งตัว
              </button>
            )}
          </div>

          <BodyImageMap
            view={view}
            selectedRegion={selectedRegion}
            hoveredRegionId={hoveredRegionId}
            debug={debug}
            onSelect={selectRegion}
            onHover={setHoveredRegionId}
          />
        </section>

        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            {selectedRegion ? (
              <div
                key={selectedRegion.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                style={{ height: 'min(68vh, 700px)', minHeight: '520px' }}
              >
                <RegionPanel
                  region={selectedRegion}
                  selectedSymptoms={selectedSymptoms}
                  onToggleSymptom={toggleSymptom}
                  onClose={reset}
                  onAssess={assess}
                />
              </div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
                style={{ height: 'min(68vh, 700px)', minHeight: '520px' }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/10">
                  <ShieldCheck className="h-7 w-7 text-teal-300" />
                </div>
                <h2 className="text-lg font-bold text-white">เลือกตำแหน่งบนรูปภาพ</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                  เลือกบริเวณบนร่างกาย จากนั้นเลือกอาการที่ตรงกับสิ่งที่คุณรู้สึก
                </p>
                <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-500">
                  Developer calibration: เพิ่ม <span className="font-mono text-teal-300">?debugBodyMap=1</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedRegion && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
              onClick={reset}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl lg:hidden"
            >
              <div className="max-h-[82vh] overflow-y-auto">
                <RegionPanel
                  region={selectedRegion}
                  selectedSymptoms={selectedSymptoms}
                  onToggleSymptom={toggleSymptom}
                  onClose={reset}
                  onAssess={assess}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 pb-6 lg:px-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-red-400/20 bg-red-400/8 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            <p className="text-xs leading-relaxed text-red-100/80">
              อาการรุนแรง เช่น เจ็บหน้าอก หายใจไม่ออก แขนขาอ่อนแรงเฉียบพลัน หรือหมดสติ ควรโทร 1669 หรือไปโรงพยาบาลทันที
            </p>
          </div>
          <Link
            href="/symptoms"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10"
          >
            ตรวจอาการละเอียด
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
