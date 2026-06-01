'use client'

import { useState, useMemo } from 'react'
import { Search, X, ArrowRight, Shield } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { CATEGORY_META } from '@/types/disease'
import type { DiseaseCard, DiseaseCategory } from '@/types/disease'

interface DiseaseCardWithRich extends DiseaseCard {
  isRich: boolean
}

interface Props {
  diseases: DiseaseCardWithRich[]
}

const CATEGORIES: { id: 'all' | DiseaseCategory; labelTh: string }[] = [
  { id: 'all', labelTh: 'ทั้งหมด' },
  { id: 'cancer', labelTh: 'มะเร็ง' },
  { id: 'heart', labelTh: 'หัวใจและหลอดเลือด' },
  { id: 'diabetes', labelTh: 'เบาหวาน' },
  { id: 'mental', labelTh: 'สุขภาพจิต' },
  { id: 'respiratory', labelTh: 'ระบบหายใจ' },
  { id: 'general', labelTh: 'อื่นๆ' },
]

const RISK_COLORS = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  very_high: 'bg-red-50 text-red-700 border-red-200',
}
const RISK_LABELS = { low: 'ต่ำ', moderate: 'ปานกลาง', high: 'สูง', very_high: 'สูงมาก' }

export function DiseaseSearch({ diseases }: Props) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | DiseaseCategory>('all')

  const filtered = useMemo(() => {
    let result = diseases
    if (activeCategory !== 'all') {
      result = result.filter(d => d.category === activeCategory)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(d =>
        d.nameTh.toLowerCase().includes(q) ||
        d.nameTh_short.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.icd10.toLowerCase().includes(q) ||
        d.shortDescriptionTh.toLowerCase().includes(q)
      )
    }
    return result
  }, [diseases, query, activeCategory])

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ค้นหาโรค เช่น มะเร็ง, เบาหวาน, hypertension, C50..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => {
          const count = cat.id === 'all' ? diseases.length : diseases.filter(d => d.category === cat.id).length
          if (count === 0 && cat.id !== 'all') return null
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700'
              )}>
              {cat.labelTh}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-5">
        {query || activeCategory !== 'all' ? (
          <>พบ <strong className="text-slate-800">{filtered.length}</strong> โรค{query && ` สำหรับ "${query}"`}</>
        ) : (
          <>แสดง <strong className="text-slate-800">{filtered.length}</strong> โรคทั้งหมด</>
        )}
      </p>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium mb-1">ไม่พบโรคที่ค้นหา</p>
          <p className="text-sm text-slate-400">ลองใช้คำค้นอื่น หรือเลือกหมวดหมู่</p>
          <button onClick={() => { setQuery(''); setActiveCategory('all') }}
            className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium underline">
            ล้างตัวกรอง
          </button>
        </div>
      )}

      {/* Disease Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(disease => {
          const catMeta = CATEGORY_META[disease.category]
          return (
            <Link key={disease.slug} href={`/diseases/${disease.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-md transition-all">

              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', catMeta.bg, catMeta.color, catMeta.border)}>
                    {catMeta.labelTh}
                  </span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', RISK_COLORS[disease.riskLevel])}>
                    ความเสี่ยง{RISK_LABELS[disease.riskLevel]}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">{disease.icd10}</span>
              </div>

              {/* Name */}
              <h3 className="text-base font-bold text-slate-900 mb-0.5 group-hover:text-teal-700 transition-colors leading-tight">
                {disease.nameTh_short}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{disease.nameEn}</p>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1 line-clamp-2">
                {disease.shortDescriptionTh}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 mb-0.5">ความชุก</p>
                  <p className="text-xs font-medium text-slate-700">{disease.stats.prevalenceThailand}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-0.5">กลุ่มเสี่ยง</p>
                  <p className="text-xs font-medium text-slate-700">{disease.stats.primaryRiskGroupTh}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Shield className="h-3 w-3" />
                  ล่าสุด: {disease.lastReviewed}
                  {disease.isRich && (
                    <span className="ml-2 bg-teal-50 text-teal-600 border border-teal-200 rounded-full px-1.5 py-0.5 font-semibold">
                      ครบถ้วน
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-teal-600 group-hover:gap-2 transition-all">
                  อ่านต่อ <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
