import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, ChevronRight, ArrowLeft, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { MedicalReview } from '@/components/shared/medical-review'
import { RelatedContent } from '@/components/shared/related-content'
import { Newsletter } from '@/components/shared/newsletter'
import { LIBRARY_CATEGORIES, getAllCategorySlugs, getCategoryBySlug } from '@/data/library-categories'
import { getArticlesByCategory, ARTICLES } from '@/data/articles'
import { RICH_DISEASES } from '@/data/diseases/index'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ category: string; locale: string }>
}

export function generateStaticParams() {
  return getAllCategorySlugs().map(category => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return { title: 'ไม่พบหมวดหมู่ | FirstScreen' }
  return {
    title: `${cat.nameTh} — ${cat.nameEn} | คลังความรู้สุขภาพ | FirstScreen`,
    description: cat.descriptionTh,
    keywords: [cat.nameTh, cat.nameEn, 'สุขภาพ', 'ป้องกันโรค', 'FirstScreen'],
  }
}

// ── Article card ──────────────────────────────────────────────

function ArticleCard({ article, variant = 'default' }: {
  article: ReturnType<typeof getArticlesByCategory>[0]
  variant?: 'featured' | 'default'
}) {
  const isFeatured = variant === 'featured'
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-slate-100 bg-white hover:border-teal-200 hover:shadow-sm transition-all',
        isFeatured ? 'p-6' : 'p-4'
      )}
    >
      <span className={cn('self-start rounded-full border text-xs font-medium px-2.5 py-1 mb-3', article.categoryColor)}>
        {article.categoryTh}
      </span>
      <h3 className={cn(
        'font-semibold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors mb-2',
        isFeatured ? 'text-base' : 'text-sm'
      )}>
        {article.titleTh}
      </h3>
      <p className={cn('text-slate-500 leading-relaxed flex-1', isFeatured ? 'text-sm' : 'text-xs line-clamp-2')}>
        {article.excerptTh}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Clock className="h-3 w-3" />
        {article.readTimeMinutes} นาที
        {article.isPendingMedicalReview && (
          <span className="ml-auto text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            รอตรวจสอบ
          </span>
        )}
      </div>
    </Link>
  )
}

// ── Disease hub card ──────────────────────────────────────────

function DiseaseHubCard({ slug }: { slug: string }) {
  const disease = RICH_DISEASES[slug]
  if (!disease) return null
  return (
    <Link
      href={`/diseases/${slug}`}
      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 hover:border-teal-200 hover:bg-teal-50/30 transition-all"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
          {disease.nameTh_short}
        </p>
        <p className="text-xs text-slate-400 truncate">{disease.shortDescriptionTh}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
    </Link>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default async function LibraryCategoryPage({ params }: Props) {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return notFound()

  const articles = getArticlesByCategory(cat.articleCategory)
  const allCategories = LIBRARY_CATEGORIES

  const Icon = cat.icon
  const [featuredArticle, ...restArticles] = articles

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">

        {/* Category Hero */}
        <div className={cn('bg-gradient-to-br py-14', `${cat.gradientFrom} to-slate-900`)}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
              <Link href="/" className="hover:text-teal-400 transition-colors">หน้าหลัก</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/library" className="hover:text-teal-400 transition-colors">Health Library</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-300">{cat.nameTh}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">{cat.nameEn}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{cat.nameTh}</h1>
              </div>
            </div>

            <p className="text-slate-300 text-base max-w-2xl leading-relaxed mb-8">
              {cat.descriptionTh}
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-4">
              {cat.keyStats.map(stat => (
                <div key={stat.label} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="lg:grid lg:grid-cols-3 lg:gap-10">

            {/* Main column */}
            <div className="lg:col-span-2 space-y-10">

              {/* Health tips */}
              <section className={cn('rounded-2xl p-6', cat.bg, `border ${cat.border}`)}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className={cn('h-5 w-5', cat.color)} />
                  <h2 className={cn('text-sm font-bold uppercase tracking-wide', cat.color)}>
                    เคล็ดลับสำคัญ
                  </h2>
                </div>
                <ul className="space-y-2">
                  {cat.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', cat.color.replace('text-', 'bg-'))}>
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
                {cat.relatedAssessmentHref && (
                  <Link
                    href={cat.relatedAssessmentHref}
                    className={cn(
                      'mt-5 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
                      'bg-teal-600 text-white hover:bg-teal-700'
                    )}
                  >
                    <TrendingUp className="h-4 w-4" />
                    ประเมินความเสี่ยงของคุณ
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                )}
              </section>

              {/* Featured article */}
              {featuredArticle && (
                <section>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">บทความแนะนำ</h2>
                  <ArticleCard article={featuredArticle} variant="featured" />
                </section>
              )}

              {/* More articles */}
              {restArticles.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">บทความทั้งหมด</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {restArticles.map(article => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </section>
              )}

              {/* No articles placeholder */}
              {articles.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <p className="text-slate-400 text-sm mb-2">บทความกำลังจัดทำ</p>
                  <p className="text-slate-300 text-xs">เร็วๆ นี้จะมีเนื้อหาเพิ่มเติม</p>
                </div>
              )}

              {/* All articles CTA */}
              {articles.length > 0 && (
                <div className="text-center">
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
                  >
                    ดูบทความทั้งหมด
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* Newsletter */}
              <Newsletter />
            </div>

            {/* Sidebar */}
            <aside className="mt-10 lg:mt-0 space-y-6">

              {/* Disease hubs for this category */}
              {cat.relatedDiseases.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">โรคที่เกี่ยวข้อง</h3>
                  <div className="space-y-2">
                    {cat.relatedDiseases.map(slug => (
                      <DiseaseHubCard key={slug} slug={slug} />
                    ))}
                  </div>
                </section>
              )}

              {/* Related content */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <RelatedContent
                  items={[
                    { type: 'assessment', title: 'ประเมินความเสี่ยง', subtitle: 'เครื่องมือ 4 ชนิด', href: '/risk' },
                    { type: 'screening', title: 'แผนตรวจคัดกรอง', subtitle: 'ปรับตามอายุ เพศ', href: '/screening' },
                    { type: 'symptom', title: 'ตรวจอาการ', subtitle: '7 ขั้นตอน', href: '/symptoms' },
                  ]}
                />
              </div>

              {/* Trust */}
              <MedicalReview
                reviewedBy="ทีมแพทย์ FirstScreen"
                reviewDate="2026-06"
                isPending
                compact
              />

              {/* Browse other categories */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 mb-3">หมวดหมู่อื่น</h3>
                <div className="space-y-1.5">
                  {allCategories.filter(c => c.slug !== category).map(c => {
                    const CIcon = c.icon
                    return (
                      <Link
                        key={c.slug}
                        href={`/library/${c.slug}`}
                        className={cn(
                          'flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors',
                          'border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/30 text-slate-600 hover:text-teal-700'
                        )}
                      >
                        <CIcon className={cn('h-3.5 w-3.5', c.color)} />
                        {c.nameTh}
                      </Link>
                    )
                  })}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
