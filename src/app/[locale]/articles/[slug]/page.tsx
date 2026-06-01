import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ChevronRight, AlertCircle, Tag } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ButtonLink } from '@/components/ui/button-link'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { getArticleBySlug, getRelatedArticles, ARTICLES } from '@/data/articles'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'ไม่พบบทความ | Health Compass' }

  return {
    title: `${article.titleTh} | Health Compass`,
    description: article.excerptTh.slice(0, 160),
    keywords: article.tags,
    openGraph: {
      title: article.titleTh,
      description: article.excerptTh.slice(0, 160),
      type: 'article',
      publishedTime: article.date,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug, locale } = await params
  const article = getArticleBySlug(slug)
  if (!article) return notFound()

  const related = getRelatedArticles(slug)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-teal-600">หน้าหลัก</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/articles" className="hover:text-teal-600">บทความสุขภาพ</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 font-medium line-clamp-1">{article.titleTh}</span>
          </div>
        </div>

        {/* Article Content */}
        <article className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
          {/* Category + date */}
          <div className="flex items-center gap-3 mb-5">
            <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', article.categoryColor)}>
              {article.categoryTh}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3" />
              {formatDate(article.date)}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {article.readTimeMinutes} นาที
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-snug">
            {article.titleTh}
          </h1>

          {/* Excerpt / lead */}
          <p className="text-base text-slate-600 leading-relaxed mb-6 font-medium border-l-4 border-teal-500 pl-4 bg-teal-50 py-3 rounded-r-lg">
            {article.excerptTh}
          </p>

          {/* Pending review notice */}
          {article.isPendingMedicalReview && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-8 flex gap-3">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>หมายเหตุ:</strong> บทความนี้อยู่ระหว่างการตรวจสอบโดยทีมแพทย์ผู้เชี่ยวชาญก่อนการเผยแพร่อย่างเป็นทางการ ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น
              </p>
            </div>
          )}

          {/* Content paragraphs */}
          <div className="prose prose-slate max-w-none space-y-5">
            {article.contentTh.map((para, i) => (
              <p key={i} className="text-base text-slate-700 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                {article.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8">
            <MedicalDisclaimer variant="banner" locale={locale} />
          </div>

          {/* Author */}
          <div className="mt-5 text-xs text-slate-400">
            เขียนโดย: {article.author} · อัปเดตล่าสุด: {formatDate(article.date)}
          </div>

          {/* Disease link CTA */}
          {article.diseaseSlug && (
            <div className="mt-8 rounded-2xl bg-teal-50 border border-teal-200 p-5">
              <p className="text-sm font-semibold text-teal-900 mb-2">
                อ่านข้อมูลเชิงลึกเพิ่มเติม
              </p>
              <p className="text-xs text-teal-700 mb-3">
                ดูข้อมูลโรคครบถ้วน อาการ ปัจจัยเสี่ยง การตรวจ และการป้องกัน
              </p>
              <ButtonLink
                href={`/diseases/${article.diseaseSlug}`}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl px-4 py-2.5"
              >
                ดูข้อมูลโรค →
              </ButtonLink>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ButtonLink href="/risk" className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl py-3 text-center block">
              ประเมินความเสี่ยงของคุณ
            </ButtonLink>
            <ButtonLink href="/symptoms" variant="outline" className="border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl py-3 text-center block">
              ตรวจอาการเบื้องต้น
            </ButtonLink>
          </div>
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">บทความที่เกี่ยวข้อง</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(r => (
                  <Link key={r.slug} href={`/articles/${r.slug}`}
                    className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                    <div className="flex-1 min-w-0">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', r.categoryColor)}>
                        {r.categoryTh}
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {r.titleTh}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">{r.readTimeMinutes} นาที · {formatDate(r.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
