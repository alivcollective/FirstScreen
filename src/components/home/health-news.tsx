import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { getRecentArticles } from '@/data/articles'
import { cn } from '@/lib/utils'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function HealthNews() {
  const articles = getRecentArticles(3)

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-2">
              สุขภาพน่ารู้
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              ข่าวสุขภาพล่าสุด
            </h2>
          </div>
          <Link
            href="/articles"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-300 hover:shadow-md transition-all"
            >
              {/* Color accent bar */}
              <div className={cn(
                'h-1.5 w-full',
                article.category === 'cancer' ? 'bg-gradient-to-r from-violet-400 to-purple-500' :
                article.category === 'diabetes' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                'bg-gradient-to-r from-red-400 to-rose-500'
              )} />

              <div className="p-5 flex flex-col flex-1">
                {/* Category badge + date */}
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    'text-[11px] font-semibold px-2.5 py-1 rounded-full border',
                    article.categoryColor
                  )}>
                    {article.categoryTh}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.date)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                  {article.titleTh}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                  {article.excerptTh}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {article.readTimeMinutes} นาที
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
                    อ่านต่อ <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600">
            ดูบทความทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          ข้อมูลในบทความเพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค · รอการรับรองจากแพทย์ผู้เชี่ยวชาญก่อนเผยแพร่จริง
        </p>
      </div>
    </section>
  )
}
