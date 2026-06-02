import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock } from 'lucide-react'
import { getRecentArticles } from '@/data/articles'
import { cn } from '@/lib/utils'

// Health Insights — 3 modern minimal cards, tight spacing
export async function HealthNews() {
  const articles = getRecentArticles(3)

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-5">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
              ข้อมูลสุขภาพ
            </p>
            <h2 className="text-2xl font-bold text-slate-900">บทความล่าสุด</h2>
          </div>
          <Link href="/articles" className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
            ดูบทความทั้งหมด <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-slate-50 hover:border-teal-200 hover:bg-white hover:shadow-sm transition-all p-4"
            >
              <span className={cn(
                'self-start text-[11px] font-semibold px-2 py-0.5 rounded-full border mb-3',
                article.categoryColor
              )}>
                {article.categoryTh}
              </span>

              <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2 flex-1 mb-3">
                {article.titleTh}
              </h3>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {article.readTimeMinutes} นาที
                </span>
                <span className="text-xs font-semibold text-teal-600 flex items-center gap-0.5">
                  อ่านต่อ <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 text-center sm:hidden">
          <Link href="/articles" className="text-sm font-medium text-teal-600">
            ดูบทความทั้งหมด →
          </Link>
        </div>
      </div>
    </section>
  )
}
