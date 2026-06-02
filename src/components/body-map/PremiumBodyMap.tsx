'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, AlertTriangle, Phone, ChevronRight,
  ArrowLeft, CheckCircle2, ShieldCheck, RotateCcw,
} from 'lucide-react'
import { HumanBodyFront } from './HumanBodyFront'
import { HumanBodyBack } from './HumanBodyBack'
import {
  BODY_REGIONS, SEARCH_SUGGESTIONS, getRegion,
  getRegionsByView, searchRegions,
  type ViewMode, type RegionId,
} from '@/data/body-map/regions'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ── View Toggle ───────────────────────────────────────────────
function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
      {(['front', 'back'] as ViewMode[]).map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all',
            view === v
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-400 hover:text-white'
          )}
        >
          {v === 'front' ? 'ด้านหน้า' : 'ด้านหลัง'}
        </button>
      ))}
    </div>
  )
}

// ── Search Bar ────────────────────────────────────────────────
function BodySearch({ onSelect }: { onSelect: (id: RegionId) => void }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const results = query.length >= 1 ? searchRegions(query).slice(0, 5) : []
  const showSuggestions = focused && (results.length > 0 || query.length === 0)

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 backdrop-blur-sm px-3.5 py-2.5">
        <Search className="h-4 w-4 text-teal-400 shrink-0" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="ค้นหาตำแหน่งอาการ... เช่น ปวดสะบัก"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-slate-800/95 backdrop-blur-md shadow-2xl overflow-hidden z-50"
          >
            {query.length === 0 ? (
              <div className="p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2 px-1">
                  ค้นหาด่วน
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SEARCH_SUGGESTIONS.map(s => (
                    <button
                      key={s.query}
                      onMouseDown={() => { onSelect(s.regionId); setQuery(''); setFocused(false) }}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-teal-500/20 hover:border-teal-500/50 hover:text-teal-300 transition-all"
                    >
                      {s.query}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-1.5">
                {results.map(r => (
                  <button
                    key={r.id}
                    onMouseDown={() => { onSelect(r.id as RegionId); setQuery(''); setFocused(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-teal-500/10 transition-colors text-left group"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    <span className="text-sm text-slate-200 group-hover:text-teal-300">{r.label_th}</span>
                    <span className="text-xs text-slate-500 ml-auto">{r.label_en}</span>
                  </button>
                ))}
                {results.length === 0 && (
                  <p className="px-4 py-3 text-sm text-slate-500">ไม่พบตำแหน่งที่ตรงกัน</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Region Panel ──────────────────────────────────────────────
function RegionPanel({
  regionId, selectedSymptoms, onToggleSymptom, onClose, onAssess,
}: {
  regionId: RegionId
  selectedSymptoms: string[]
  onToggleSymptom: (id: string) => void
  onClose: () => void
  onAssess: () => void
}) {
  const region = getRegion(regionId)
  if (!region) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="h-2 w-2 rounded-full bg-teal-500" />
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">ตำแหน่งที่เลือก</p>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{region.label_th}</h3>
          <p className="text-xs text-slate-400 font-medium">{region.label_en}</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Emergency alert — only for emergency regions */}
        {region.isEmergency && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 mb-1">อาการฉุกเฉิน</p>
                <p className="text-xs text-red-700 leading-relaxed">{region.emergencyNote_th}</p>
              </div>
            </div>
            {region.hotline && (
              <a
                href={`tel:${region.hotline}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors"
              >
                <Phone className="h-4 w-4" />
                โทร {region.hotline} ทันที
              </a>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">คำอธิบาย</p>
          <p className="text-sm text-slate-600 leading-relaxed">{region.description_th}</p>
        </div>

        {/* Symptoms checklist */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">อาการที่พบบ่อย</p>
          <div className="space-y-2">
            {region.symptoms.map(symptom => {
              const checked = selectedSymptoms.includes(symptom.id)
              return (
                <button
                  key={symptom.id}
                  onClick={() => onToggleSymptom(symptom.id)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                    checked
                      ? symptom.isEmergency
                        ? 'bg-red-50 border-red-300'
                        : 'bg-teal-50 border-teal-300'
                      : 'border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/30'
                  )}
                >
                  <div className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
                    checked
                      ? symptom.isEmergency
                        ? 'bg-red-500 border-red-500'
                        : 'bg-teal-500 border-teal-500'
                      : 'border-slate-300'
                  )}>
                    {checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <div>
                    <p className={cn('text-sm font-medium', checked ? 'text-slate-900' : 'text-slate-700')}>
                      {symptom.label_th}
                    </p>
                    <p className="text-xs text-slate-400">{symptom.label_en}</p>
                  </div>
                  {symptom.isEmergency && (
                    <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                      ฉุกเฉิน
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={onAssess}
          disabled={selectedSymptoms.length === 0}
          className={cn(
            'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all',
            selectedSymptoms.length > 0
              ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-sm shadow-teal-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          ประเมินอาการ
          {selectedSymptoms.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-black">
              {selectedSymptoms.length}
            </span>
          )}
          <ChevronRight className="h-4 w-4" />
        </button>
        <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3 text-teal-500" />
          เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัย
        </p>
      </div>
    </motion.div>
  )
}

// ── Hover Tooltip ─────────────────────────────────────────────
function HoverTooltip({ regionId, position }: { regionId: string; position: { x: number; y: number } }) {
  const region = getRegion(regionId as RegionId)
  if (!region) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.1 }}
      className="fixed pointer-events-none z-[300] -translate-x-1/2 -translate-y-full -mt-2"
      style={{ left: position.x, top: position.y }}
    >
      <div className="rounded-xl border border-teal-400/30 bg-slate-900/95 backdrop-blur-sm px-3 py-2 shadow-xl">
        <p className="text-xs font-bold text-teal-300">{region.label_th}</p>
        <p className="text-[10px] text-slate-400">{region.label_en}</p>
        {region.isEmergency && (
          <p className="text-[9px] text-red-400 font-semibold mt-0.5">⚠ มีอาการฉุกเฉิน</p>
        )}
      </div>
      <div className="h-2 w-2 bg-slate-900 border-b border-r border-teal-400/30 rotate-45 mx-auto -mt-1" />
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────
export function PremiumBodyMap() {
  const [view, setView] = useState<ViewMode>('front')
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const bodyRef = useRef<HTMLDivElement>(null)

  const handleRegionClick = useCallback((id: string) => {
    const regionId = id as RegionId
    const region = getRegion(regionId)
    if (!region) return
    // Auto-switch view if needed
    if (region.view === 'back' && view === 'front') setView('back')
    if (region.view === 'front' && view === 'back') setView('front')
    setActiveRegion(regionId)
    setSelectedSymptoms([])
  }, [view])

  const handleRegionHover = useCallback((id: string | null) => {
    setHoveredRegion(id)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }, [])

  const toggleSymptom = useCallback((id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }, [])

  const handleAssess = useCallback(() => {
    if (!activeRegion || selectedSymptoms.length === 0) return
    const params = new URLSearchParams({
      bodyPart: activeRegion,
      symptom: selectedSymptoms.join(','),
    })
    window.location.href = `/symptom-assessment?${params}`
  }, [activeRegion, selectedSymptoms])

  const handleSearchSelect = useCallback((id: RegionId) => {
    const region = getRegion(id)
    if (!region) return
    if (region.view === 'back') setView('back')
    else setView('front')
    setActiveRegion(id)
    setSelectedSymptoms([])
  }, [])

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[80vh] bg-[#0a0f1e]">
      {/* ── Body Viewer Panel ─────────────────────── */}
      <div className="flex-1 flex flex-col items-center">

        {/* Top controls */}
        <div className="w-full max-w-xl flex flex-col items-center gap-4 px-4 pt-6 pb-4">
          <BodySearch onSelect={handleSearchSelect} />
          <div className="flex items-center gap-3">
            <ViewToggle view={view} onChange={v => { setView(v); setActiveRegion(null) }} />
            {activeRegion && (
              <button
                onClick={() => { setActiveRegion(null); setSelectedSymptoms([]) }}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> รีเซ็ต
              </button>
            )}
          </div>
        </div>

        {/* Body SVG */}
        <div
          ref={bodyRef}
          className="relative flex-1 flex items-center justify-center w-full max-w-xs sm:max-w-sm px-4 pb-6"
          onMouseMove={handleMouseMove}
        >
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}
          >
            {view === 'front' ? (
              <HumanBodyFront
                activeRegion={activeRegion}
                hoveredRegion={hoveredRegion}
                onRegionHover={handleRegionHover}
                onRegionClick={handleRegionClick}
              />
            ) : (
              <HumanBodyBack
                activeRegion={activeRegion}
                hoveredRegion={hoveredRegion}
                onRegionHover={handleRegionHover}
                onRegionClick={handleRegionClick}
              />
            )}
          </motion.div>

          {/* Instruction */}
          {!activeRegion && !hoveredRegion && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-2 left-0 right-0 text-center"
            >
              <p className="text-xs text-slate-500">คลิกที่ตำแหน่งบนร่างกายที่มีอาการ</p>
            </motion.div>
          )}
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredRegion && (
            <HoverTooltip regionId={hoveredRegion} position={tooltipPos} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Side Panel (desktop) / Bottom Sheet (mobile) ── */}
      <AnimatePresence mode="wait">
        {activeRegion ? (
          <>
            {/* Desktop side panel */}
            <motion.div
              key="panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="hidden lg:block shrink-0 border-l border-slate-800 overflow-hidden"
            >
              <RegionPanel
                regionId={activeRegion}
                selectedSymptoms={selectedSymptoms}
                onToggleSymptom={toggleSymptom}
                onClose={() => { setActiveRegion(null); setSelectedSymptoms([]) }}
                onAssess={handleAssess}
              />
            </motion.div>

            {/* Mobile bottom sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-x-0 bottom-0 z-50 lg:hidden rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col shadow-2xl"
            >
              {/* Pull handle */}
              <div
                className="flex justify-center pt-3 pb-1 bg-white cursor-pointer"
                onClick={() => { setActiveRegion(null); setSelectedSymptoms([]) }}
              >
                <div className="h-1 w-10 rounded-full bg-slate-200" />
              </div>
              <RegionPanel
                regionId={activeRegion}
                selectedSymptoms={selectedSymptoms}
                onToggleSymptom={toggleSymptom}
                onClose={() => { setActiveRegion(null); setSelectedSymptoms([]) }}
                onAssess={handleAssess}
              />
            </motion.div>

            {/* Mobile backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => { setActiveRegion(null); setSelectedSymptoms([]) }}
            />
          </>
        ) : (
          /* Empty state */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden lg:flex w-[300px] shrink-0 items-center justify-center border-l border-slate-800/60 px-6"
          >
            <div className="text-center space-y-3">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20">
                <ShieldCheck className="h-6 w-6 text-teal-400" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-slate-300">คลิกตำแหน่งบนร่างกาย</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                เลือกบริเวณที่มีอาการ แล้วเลือกอาการที่ตรงกับที่คุณรู้สึก
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
