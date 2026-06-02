import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Search, Heart, Stethoscope, Activity,
  BookOpen, Calendar, ChevronRight, ArrowLeft, Scale,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { search, SUGGESTED_QUERIES, type SearchResult, type SearchCategory } from '@/lib/search-engine'
import { SearchInput } from '@/components/search/SearchInput'
import { cn } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ q?: string; cat?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" — ค้นหา | FirstScreen` : 'ค้นหา | FirstScreen',
    description: q ? `ผลการค้นหา "${q}" — โรค อาการ การประเมิน บทความ` : 'ค้นหาข้อมูลสุขภาพ',
  }
}

// ── Category filter config ────────────────────────────────────

const FILTERS: { key: SearchCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'all', label: 'ทั้งหมด', icon: Search },
  { key: 'disease', label: 'โรค', icon: Heart },
  { key: 'guideline', label: 'แนวทาง', icon: Scale },
  { key: 'symptom', label: 'อาการ', icon: Stethoscope },
  { key: 'assessment', label: 'ประเมิน', icon: Activity },
  { key: 'article', label: 'บทความ', icon: BookOpen },
  { key: 'screening', label: 'คัดกรอง', icon: Calendar },
]

const CATEGORY_CONFIG: Record<SearchCategory, { color: string; bg: string; border: string }> = {
  disease: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100' },
  guideline: { color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100' },
  symptom: { color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-100' },
  assessment: { color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100' },
  article: { color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100' },
  screening: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
}

const CATEGORY_LABELS: Record<SearchCategory, string> = {
  disease: 'โรค',
  guideline: 'แนวทาง',
  symptom: 'อาการ',
  assessment: 'ประเมิน',
  article: 'บทความ',
  screening: 'คัดกรอง',
}

// ── Result card ───────────────────────────────────────────────

function ResultCard({ result }: { result: SearchResult }) {
  const cfg = CATEGORY_CONFIG[result.category]
  const IconMap: Record<SearchCategory, React.ComponentType<{ className?: string }>> = {
    disease: Heart,
    guideline: Scale,
    symptom: Stethoscope,
    assessment: Activity,
    article: BookOpen,
    screening: Calendar,
  }
  const Icon = IconMap[result.category]

  return (
    <Link
      href={result.href}
      className={cn(
        'flex gap-4 rounded-2xl border p-4 hover:shadow-md transition-all group',
        cfg.border, cfg.bg
      )}
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 mt-0.5', cfg.color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
            {result.title}
          </p>
          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold border bg-white/80', cfg.color)}>
            {CATEGORY_LABELS[result.category]}
          </span>
        </div>
        {result.subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{result.subtitle}</p>
        )}
        {result.excerpt && (
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
            {result.excerpt}
          </p>
        )}
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {result.tags.slice(0, 4).map(tag => (
              <span key={tag} className="rounded-full bg-white/60 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 shrink-0 mt-1 transition-colors" />
    </Link>
  )
}

// ── Section heading ───────────────────────────────────────────

function SectionHeading({ category, count }: { category: SearchCategory; count: number }) {
  const cfg = CATEGORY_CONFIG[category]
  const IconMap: Record<SearchCategory, React.ComponentType<{ className?: string }>> = {
    disease: Heart, guideline: Scale, symptom: Stethoscope,
    assessment: Activity, article: BookOpen, screening: Calendar,
  }
  const Icon = IconMap[category]
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', cfg.bg)}>
        <Icon className={cn('h-3.5 w-3.5', cfg.color)} />
      </div>
      <h2 className={cn('text-sm font-bold uppercase tracking-wide', cfg.color)}>
        {CATEGORY_LABELS[category]}
      </h2>
      <span className="text-xs text-slate-400 ml-1">({count})</span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', cat = 'all' } = await searchParams
  const results = search(q, 10)
  const activeFilter = cat as SearchCategory | 'all'

  // Get filtered results for display
  const displayResults: SearchResult[] = activeFilter === 'all'
    ? results.all
    : results.all.filter(r => r.category === activeFilter)

  const hasResults = results.total > 0

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">

        {/* Search header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-lg font-semibold text-white">
                {q ? `ผลการค้นหา "${q}"` : 'ค้นหาข้อมูลสุขภาพ'}
              </h1>
              {hasResults && q && (
                <span className="ml-auto text-sm text-slate-400">
                  พบ {results.total} ผลลัพธ์
                </span>
              )}
            </div>

            {/* Search input */}
            <SearchInput initialValue={q} />
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">

          {/* Filter tabs */}
          {hasResults && (
            <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
              {FILTERS.map(f => {
                const count = f.key === 'all'
                  ? results.total
                  : results.all.filter(r => r.category === f.key).length
                if (count === 0 && f.key !== 'all') return null
                const FIcon = f.icon
                return (
                  <Link
                    key={f.key}
                    href={`/search?q=${encodeURIComponent(q)}&cat=${f.key}`}
                    className={cn(
                      'flex items-center gap-1.5 shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                      activeFilter === f.key
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700'
                    )}
                  >
                    <FIcon className="h-3 w-3" />
                    {f.label}
                    <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                      activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    )}>
                      {count}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Results */}
          {!q ? (
            /* No query yet */
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-base font-semibold text-slate-700 mb-2">ค้นหาข้อมูลสุขภาพ</h2>
              <p className="text-sm text-slate-400 mb-6">โรค · อาการ · การประเมิน · บทความ</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {SUGGESTED_QUERIES.map(sq => (
                  <Link
                    key={sq}
                    href={`/search?q=${encodeURIComponent(sq)}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    {sq}
                  </Link>
                ))}
              </div>
            </div>

          ) : !hasResults ? (
            /* No results */
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h2 className="text-base font-semibold text-slate-700 mb-2">
                ไม่พบผลลัพธ์สำหรับ &ldquo;{q}&rdquo;
              </h2>
              <p className="text-sm text-slate-400 mb-6">ลองเปลี่ยนคำค้นหา หรือ</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/symptoms" className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors">
                  <Stethoscope className="h-4 w-4" />
                  ตรวจอาการ 7 ขั้นตอน
                </Link>
                <Link href="/diseases" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  <Heart className="h-4 w-4" />
                  คลังข้อมูลโรค
                </Link>
              </div>
              <div className="mt-8">
                <p className="text-xs text-slate-400 mb-3">แนะนำค้นหา</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUERIES.slice(0, 6).map(sq => (
                    <Link
                      key={sq}
                      href={`/search?q=${encodeURIComponent(sq)}`}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-teal-300 hover:text-teal-700 transition-colors"
                    >
                      {sq}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          ) : activeFilter === 'all' ? (
            /* Grouped results */
            <div className="space-y-8">
              {results.diseases.length > 0 && (
                <section>
                  <SectionHeading category="disease" count={results.diseases.length} />
                  <div className="space-y-2">
                    {results.diseases.map(r => <ResultCard key={r.id} result={r} />)}
                  </div>
                </section>
              )}
              {results.guidelines?.length > 0 && (
                <section>
                  <SectionHeading category="guideline" count={results.guidelines.length} />
                  <div className="space-y-2">
                    {results.guidelines.map(r => <ResultCard key={r.id} result={r} />)}
                  </div>
                </section>
              )}
              {results.symptoms.length > 0 && (
                <section>
                  <SectionHeading category="symptom" count={results.symptoms.length} />
                  <div className="space-y-2">
                    {results.symptoms.map(r => <ResultCard key={r.id} result={r} />)}
                  </div>
                </section>
              )}
              {results.assessments.length > 0 && (
                <section>
                  <SectionHeading category="assessment" count={results.assessments.length} />
                  <div className="space-y-2">
                    {results.assessments.map(r => <ResultCard key={r.id} result={r} />)}
                  </div>
                </section>
              )}
              {results.articles.length > 0 && (
                <section>
                  <SectionHeading category="article" count={results.articles.length} />
                  <div className="space-y-2">
                    {results.articles.map(r => <ResultCard key={r.id} result={r} />)}
                  </div>
                </section>
              )}
              {results.screening.length > 0 && (
                <section>
                  <SectionHeading category="screening" count={results.screening.length} />
                  <div className="space-y-2">
                    {results.screening.map(r => <ResultCard key={r.id} result={r} />)}
                  </div>
                </section>
              )}
            </div>
          ) : (
            /* Filtered results */
            <div className="space-y-2">
              {displayResults.length > 0
                ? displayResults.map(r => <ResultCard key={r.id} result={r} />)
                : (
                  <div className="text-center py-12 text-sm text-slate-400">
                    ไม่พบผลลัพธ์ประเภทนี้สำหรับ &ldquo;{q}&rdquo;
                  </div>
                )
              }
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
