'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import {
  Search, X, Heart, Activity, Stethoscope,
  Calendar, BookOpen, ChevronRight, Loader2, Scale,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { search, SUGGESTED_QUERIES, type SearchResult, type SearchCategory } from '@/lib/search-engine'

// ── Category display config ───────────────────────────────────

const CATEGORY_CONFIG: Record<SearchCategory, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
}> = {
  disease: { label: 'โรค', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
  guideline: { label: 'แนวทาง', icon: Scale, color: 'text-teal-600', bg: 'bg-teal-50' },
  symptom: { label: 'อาการ', icon: Stethoscope, color: 'text-sky-600', bg: 'bg-sky-50' },
  assessment: { label: 'ประเมิน', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
  article: { label: 'บทความ', icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
  screening: { label: 'คัดกรอง', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
}

// ── Highlight matched text ────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ── Single result row ─────────────────────────────────────────

function ResultRow({ result, query, active, onSelect, onHover }: {
  result: SearchResult
  query: string
  active: boolean
  onSelect: () => void
  onHover: () => void
}) {
  const cfg = CATEGORY_CONFIG[result.category]
  const Icon = cfg.icon
  return (
    <Link
      href={result.href as Parameters<typeof Link>[0]['href']}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer',
        active ? 'bg-teal-50' : 'hover:bg-slate-50'
      )}
    >
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', cfg.bg)}>
        <Icon className={cn('h-4 w-4', cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          <Highlight text={result.title} query={query} />
        </p>
        {result.subtitle && (
          <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
        )}
      </div>
      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium hidden sm:block', cfg.bg, cfg.color)}>
        {cfg.label}
      </span>
    </Link>
  )
}

// ── Main SmartSearch Modal ────────────────────────────────────

interface SmartSearchProps {
  open: boolean
  onClose: () => void
}

export function SmartSearch({ open, onClose }: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Search on query change (debounced)
  useEffect(() => {
    if (!query.trim()) { setResults([]); setIsSearching(false); return }
    setIsSearching(true)
    const t = setTimeout(() => {
      const r = search(query, 4)
      setResults(r.all.slice(0, 8))
      setActiveIdx(0)
      setIsSearching(false)
    }, 150)
    return () => clearTimeout(t)
  }, [query])

  // ⌘K global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
        else document.dispatchEvent(new CustomEvent('smart-search-open'))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter') {
      if (results[activeIdx]) {
        router.push(results[activeIdx].href as Parameters<typeof router.push>[0])
        onClose()
      } else if (query.trim()) {
        router.push({ pathname: '/search', query: { q: query } } as Parameters<typeof router.push>[0])
        onClose()
      }
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] sm:pt-[12vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          {isSearching
            ? <Loader2 className="h-4 w-4 text-slate-400 shrink-0 animate-spin" />
            : <Search className="h-4 w-4 text-slate-400 shrink-0" />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ค้นหาโรค อาการ การประเมิน บทความ..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
          <button onClick={onClose} className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
            <span className="font-mono">Esc</span>
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            /* Empty state — show suggestions */
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">ค้นหายอดนิยม</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map(q => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link
                  href={'/search' as Parameters<typeof Link>[0]['href']}
                  onClick={onClose}
                  className="flex items-center gap-2 text-xs text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <Search className="h-3 w-3" />
                  ค้นหาขั้นสูง — ดูผลลัพธ์แบบละเอียด
                  <ChevronRight className="h-3 w-3 ml-auto" />
                </Link>
              </div>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-slate-500 mb-2">ไม่พบผลลัพธ์สำหรับ <span className="font-medium text-slate-700">&ldquo;{query}&rdquo;</span></p>
              <p className="text-xs text-slate-400 mb-4">ลองคำค้นหาอื่น หรือ...</p>
              <Link
                href={'/symptoms' as Parameters<typeof Link>[0]['href']}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                <Stethoscope className="h-3.5 w-3.5" />
                ตรวจอาการ 7 ขั้นตอน
              </Link>
            </div>
          ) : (
            <ul className="py-1.5">
              {results.map((r, i) => (
                <li key={`${r.category}-${r.id}`}>
                  <ResultRow
                    result={r}
                    query={query}
                    active={i === activeIdx}
                    onSelect={onClose}
                    onHover={() => setActiveIdx(i)}
                  />
                </li>
              ))}
              {/* See all results */}
              {results.length >= 5 && (
                <li className="border-t border-slate-100 mt-1 pt-1">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}` as Parameters<typeof Link>[0]['href']}
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    ดูผลลัพธ์ทั้งหมดสำหรับ &ldquo;{query}&rdquo;
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-slate-100 px-4 py-2 flex items-center gap-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><kbd className="font-mono rounded bg-slate-100 px-1.5 py-0.5">↑↓</kbd> เลื่อน</span>
          <span className="flex items-center gap-1"><kbd className="font-mono rounded bg-slate-100 px-1.5 py-0.5">Enter</kbd> เลือก</span>
          <span className="flex items-center gap-1 ml-auto"><kbd className="font-mono rounded bg-slate-100 px-1.5 py-0.5">⌘K</kbd> เปิด/ปิด</span>
        </div>
      </div>
    </div>
  )
}

// ── Global open hook ──────────────────────────────────────────

export function useSmartSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    document.addEventListener('smart-search-open', onOpen)
    return () => document.removeEventListener('smart-search-open', onOpen)
  }, [])

  return { open, setOpen }
}
