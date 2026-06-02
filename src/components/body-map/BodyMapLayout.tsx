'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, Phone } from 'lucide-react'
import type { BodyRegion } from '@/types/body-map'
import type { BodyViewMode } from '@/types/body-map'
import { BodyViewer2D } from './BodyViewer2D'
import { BodyViewToggle } from './BodyViewToggle'
import { SymptomPanel } from './SymptomPanel'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'

export function BodyMapLayout() {
  const [view, setView] = useState<BodyViewMode>('front')
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null)
  const isMobile = useIsMobile()

  const handleRegionClick = useCallback((region: BodyRegion) => {
    setSelectedRegion(prev => prev?.id === region.id ? null : region)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedRegion(null)
  }, [])

  return (
    <div className="w-full">
      {/* Emergency safety banner — always visible */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-xs text-red-700 leading-relaxed">
              หากมีอาการรุนแรง เช่น เจ็บหน้าอก หายใจไม่ออก แขนขาอ่อนแรงเฉียบพลัน หรือหมดสติ ควร{' '}
              <a href="tel:1669" className="font-bold underline">โทร 1669</a>{' '}
              หรือไปโรงพยาบาลทันที
            </p>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <BodyViewToggle view={view} onChange={v => { setView(v); setSelectedRegion(null) }} />
      </div>

      {/* Main layout: body + panel */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className={`flex gap-6 ${selectedRegion && !isMobile ? 'items-start' : 'justify-center'}`}>

          {/* Body viewer */}
          <div className={`flex flex-col items-center transition-all duration-300 ${
            selectedRegion && !isMobile ? 'flex-1 max-w-xs' : 'flex-1 max-w-xs'
          }`}>
            <BodyViewer2D
              view={view}
              selectedRegionId={selectedRegion?.id ?? null}
              onRegionClick={handleRegionClick}
              className="w-full"
            />

            {/* Helper text */}
            <p className="mt-4 text-xs text-slate-400 text-center">
              {selectedRegion
                ? `เลือกแล้ว: ${selectedRegion.name_th}`
                : 'คลิกที่ตำแหน่งที่มีอาการ'
              }
            </p>
          </div>

          {/* Desktop side panel */}
          {selectedRegion && !isMobile && (
            <div className="w-[320px] shrink-0 rounded-2xl border border-slate-100 overflow-hidden shadow-sm" style={{ minHeight: '460px' }}>
              <SymptomPanel
                region={selectedRegion}
                onClose={handleClose}
                variant="panel"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {selectedRegion && isMobile && (
        <SymptomPanel
          region={selectedRegion}
          onClose={handleClose}
          variant="sheet"
        />
      )}
    </div>
  )
}
