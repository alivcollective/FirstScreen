'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Search, X, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAllDiseaseCardsForListing } from '@/data/diseases/index'
import type { DiseaseCard } from '@/types/disease'
import { CATEGORY_META } from '@/types/disease'

interface DiseaseCardExt extends DiseaseCard {
  isRich: boolean
}

// Lazily loaded once on first use
let cachedDiseases: DiseaseCardExt[] | null = null
function getDiseases(): DiseaseCardExt[] {
  if (!cachedDiseases) {
    cachedDiseases = getAllDiseaseCardsForListing()
  }
  return cachedDiseases
}

interface Props {
  placeholder?: string
  className?: string
  onClose?: () => void
}

export function DiseaseSearchBar({ placeholder, className, onClose }: Props) {
  const locale = useLocale()
  const isTh = locale !== 'en'
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const defaultPlaceholder = isTh
    ? 'ค้นหาโรค เช่น มะเร็ง, เบาหวาน...'
    : 'Search diseases, e.g. diabetes...'

  const diseases = getDiseases()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase().trim()
    return diseases
      .filter(d =>
        d.nameTh.toLowerCase().includes(q) ||
        d.nameTh_short.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.icd10.toLowerCase().includes(q) ||
        d.shortDescriptionTh.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [query, diseases])

  const showDropdown = open && (results.length > 0 || query.trim().length > 1)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navigateTo = (slug: string) => {
    router.push(`/diseases/${slug}`)
    setQuery('')
    setOpen(false)
    onClose?.()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      navigateTo(results[activeIdx].slug)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      navigateTo(results[0].slug)
    } else if (query.trim()) {
      router.push(`/diseases?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1) }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            placeholder={placeholder ?? defaultPlaceholder}
            aria-label={placeholder ?? defaultPlaceholder}
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
            style={{ fontSize: '16px' }} // prevent iOS zoom
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="ล้างการค้นหา"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden">
          {results.length > 0 ? (
            <>
              <ul ref={listRef} role="listbox" className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {results.map((disease, idx) => {
                  const cat = CATEGORY_META[disease.category]
                  return (
                    <li key={disease.slug} role="option" aria-selected={idx === activeIdx}>
                      <button
                        onClick={() => navigateTo(disease.slug)}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-teal-50 transition-colors',
                          idx === activeIdx && 'bg-teal-50'
                        )}
                      >
                        <div className={cn('shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border', cat.bg, cat.color, cat.border)}>
                          {cat.labelTh}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{disease.nameTh_short}</p>
                          <p className="text-xs text-slate-400 truncate">{disease.nameEn} · {disease.icd10}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="border-t border-slate-100 px-4 py-2.5">
                <button
                  onClick={() => router.push(`/diseases?q=${encodeURIComponent(query.trim())}`)}
                  className="flex items-center gap-2 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <Search className="h-3 w-3" />
                  ค้นหาทั้งหมด "{query}"
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-sm text-slate-500">ไม่พบโรคที่ตรงกับ "{query}"</p>
              <button
                onClick={() => router.push('/diseases')}
                className="mt-2 text-xs font-medium text-teal-600 hover:text-teal-700"
              >
                ดูโรคทั้งหมด →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
