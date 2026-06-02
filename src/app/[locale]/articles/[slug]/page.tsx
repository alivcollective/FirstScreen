import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ChevronRight, AlertCircle, Tag, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ButtonLink } from '@/components/ui/button-link'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { getArticleBySlug, getRelatedArticles, ARTICLES } from '@/data/articles'
import { cn } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://firstscreen.health'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

// Try fetching from CMS first, fall back to hardcoded data
async function fetchArticle(slug: string) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
      const { data } = await sb
        .from('kms_articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()
      if (data) return { source: 'cms' as const, data }
    }
  } catch { /* fall through */ }
  const local = getArticleBySlug(slug)
  return local ? { source: 'local' as const, data: local } : null
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await fetchArticle(slug)
  if (!result) return { title: 'ไม่พบบทความ | FirstScreen' }

  const title = result.source === 'cms'
    ? (result.data as Record<string, string>).title_th
    : (result.data as { titleTh: string }).titleTh
  const desc = result.source === 'cms'
    ? ((result.data as Record<string, string>).excerpt_th ?? '').slice(0, 160)
    : ((result.data as { excerptTh: string }).excerptTh ?? '').slice(0, 160)
  const ogImg = result.source === 'cms'
    ? (result.data as Record<string, string>).og_image_url
    : undefined

  return {
    title: `${title} | FirstScreen`,
    description: desc || 'บทความสุขภาพจาก FirstScreen',
    openGraph: {
      title: `${title} | FirstScreen`,
      description: desc,
      type: 'article',
      url: `${BASE_URL}/articles/${slug}`,
      siteName: 'FirstScreen',
      ...(ogImg && { images: [{ url: ogImg, width: 1200, height: 630 }] }),
    },
    twitter: { card: 'summary_large_image', title, description: desc },
    alternates: { canonical: `${BASE_URL}/articles/${slug}` },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug, locale } = await params
  const result = await fetchArticle(slug)
  if (!result) return notFound()

  // Normalize to a unified shape
  const isCms = result.source === 'cms'
  const raw = result.data as Record<string, unknown>

  const titleTh  = isCms ? String(raw.title_th  ?? '') : (raw as { titleTh: string }).titleTh
  const excerptTh = isCms ? String(raw.excerpt_th ?? '') : (raw as { excerptTh: string }).excerptTh
  const author   = isCms ? String(raw.author_name ?? raw.reviewed_by ?? 'ทีม FirstScreen')
                         : String((raw as { author: string }).author)
  const category = isCms ? String(raw.category_id ?? '') : String((raw as { categoryTh: string }).categoryTh)
  const readTime = isCms ? Number(raw.read_time_minutes ?? 5) : Number((raw as { readTimeMinutes: number }).readTimeMinutes)
  const date     = isCms ? String(raw.updated_at ?? raw.published_at ?? '') : String((raw as { date: string }).date)
  const tags     = isCms ? (raw.tags as string[] ?? []) : (raw as { tags: string[] }).tags
  const isPending = isCms ? Boolean(raw.is_pending_review) : Boolean((raw as { isPendingMedicalReview: boolean }).isPendingMedicalReview)
  const reviewer = isCms ? String(raw.medical_reviewer ?? raw.reviewed_by ?? '') : ''
  const references = isCms ? String(raw.references ?? '') : ''

  // Content: CMS stores TipTap JSON, local stores string[]
  const contentBlocks: string[] = isCms
    ? extractTextFromTipTap(raw.content as Record<string, unknown>)
    : (raw as { contentTh: string[] }).contentTh

  const diseaseSlug = isCms ? undefined : (raw as { diseaseSlug?: string }).diseaseSlug

  // JSON-LD Article schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titleTh,
    description: excerptTh,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'FirstScreen', url: BASE_URL },
    datePublished: date,
    dateModified: date,
    url: `${BASE_URL}/articles/${slug}`,
    inLanguage: 'th',
    isAccessibleForFree: true,
    keywords: tags.join(', '),
  }

  // Related articles (local data only for now)
  const related = !isCms ? getRelatedArticles(slug) : []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1">

        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-teal-600">หน้าหลัก</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/articles" className="hover:text-teal-600">บทความสุขภาพ</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 font-medium line-clamp-1">{titleTh}</span>
          </div>
        </div>

        <article className="mx-auto max-w-2xl px-4 sm:px-6 py-10">

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {category && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-teal-200 bg-teal-50 text-teal-700">
                {category}
              </span>
            )}
            {date && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3" />
                {formatDate(date)}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {readTime} นาที
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-snug">{titleTh}</h1>

          {/* Lead */}
          {excerptTh && (
            <p className="text-base text-slate-600 leading-relaxed mb-6 font-medium border-l-4 border-teal-500 pl-4 bg-teal-50 py-3 rounded-r-lg">
              {excerptTh}
            </p>
          )}

          {/* Pending review notice */}
          {isPending && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-8 flex gap-3">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>หมายเหตุ:</strong> บทความนี้อยู่ระหว่างการตรวจสอบโดยทีมแพทย์ผู้เชี่ยวชาญ
                ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น
              </p>
            </div>
          )}

          {/* ── MEDICAL DISCLAIMER — always shown ────────────── */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-8">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">ข้อควรทราบ:</span>{' '}
                ข้อมูลนี้ใช้เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรคหรือคำแนะนำทางการแพทย์
                ควรปรึกษาแพทย์ผู้เชี่ยวชาญสำหรับข้อมูลเฉพาะเจาะจงของคุณ
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none space-y-5">
            {contentBlocks.map((para, i) => (
              <p key={i} className="text-base text-slate-700 leading-relaxed">{para}</p>
            ))}
          </div>

          {/* References */}
          {references && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-700 mb-3">แหล่งอ้างอิง</h2>
              <pre className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap font-sans">{references}</pre>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                {tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Author + reviewer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-0.5">
            {author && <p>เขียนโดย: <span className="text-slate-600">{author}</span></p>}
            {reviewer && <p>ตรวจสอบโดย: <span className="text-slate-600">{reviewer}</span></p>}
            {date && <p>อัปเดตล่าสุด: {formatDate(date)}</p>}
          </div>

          {/* MedicalDisclaimer banner */}
          <div className="mt-8">
            <MedicalDisclaimer variant="banner" locale={locale} />
          </div>

          {/* Disease CTA */}
          {diseaseSlug && (
            <div className="mt-8 rounded-2xl bg-teal-50 border border-teal-200 p-5">
              <p className="text-sm font-semibold text-teal-900 mb-2">อ่านข้อมูลเชิงลึกเพิ่มเติม</p>
              <p className="text-xs text-teal-700 mb-3">ดูข้อมูลโรคครบถ้วน อาการ ปัจจัยเสี่ยง การตรวจ และการป้องกัน</p>
              <ButtonLink href={`/diseases/${diseaseSlug}`}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl px-4 py-2.5">
                ดูข้อมูลโรค →
              </ButtonLink>
            </div>
          )}

          {/* CTAs */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ButtonLink href="/risk" className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl py-3 text-center block">
              ประเมินความเสี่ยงของคุณ
            </ButtonLink>
            <ButtonLink href="/symptoms" variant="outline"
              className="border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl py-3 text-center block hover:border-teal-300">
              ตรวจอาการเบื้องต้น
            </ButtonLink>
          </div>
        </article>

        {/* Related */}
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

// ── Helper: extract plain text blocks from TipTap JSON ────────
function extractTextFromTipTap(json: Record<string, unknown> | undefined): string[] {
  if (!json || typeof json !== 'object') return []
  const blocks: string[] = []
  function walk(node: unknown) {
    if (!node || typeof node !== 'object') return
    const n = node as Record<string, unknown>
    if (n.type === 'paragraph' || n.type === 'heading') {
      const text = extractText(n)
      if (text.trim()) blocks.push(text.trim())
    } else if (Array.isArray(n.content)) {
      (n.content as unknown[]).forEach(walk)
    }
  }
  function extractText(node: Record<string, unknown>): string {
    if (node.text) return String(node.text)
    if (!Array.isArray(node.content)) return ''
    return (node.content as Record<string, unknown>[]).map(extractText).join('')
  }
  if (Array.isArray(json.content)) (json.content as unknown[]).forEach(walk)
  return blocks
}
