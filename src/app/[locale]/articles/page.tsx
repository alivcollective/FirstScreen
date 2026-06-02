import type { Metadata } from 'next'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'
import { ARTICLES } from '@/data/articles'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'บทความสุขภาพ — Health Articles | FirstScreen',
  description: 'บทความสุขภาพที่อิงหลักฐานทางการแพทย์ เกี่ยวกับการป้องกันโรค ตรวจคัดกรอง และดูแลสุขภาพ',
}

export default function ArticlesPage() {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h1 className="text-3xl font-bold text-white mb-3">บทความสุขภาพ</h1>
            <p className="text-slate-400">
              ข้อมูลสุขภาพที่อิงหลักฐานทางการแพทย์ เพื่อช่วยให้คุณตัดสินใจเรื่องสุขภาพได้ดีขึ้น
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sorted.map(a => (
              <Link key={a.slug} href={`/articles/${a.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-300 hover:shadow-md transition-all">
                <div className={cn('h-1.5',
                  a.category === 'cancer' ? 'bg-gradient-to-r from-violet-400 to-purple-500' :
                  a.category === 'diabetes' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                  'bg-gradient-to-r from-red-400 to-rose-500'
                )} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', a.categoryColor)}>
                      {a.categoryTh}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {a.readTimeMinutes} นาที
                    </div>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                    {a.titleTh}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{a.excerptTh}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <span className="text-xs font-semibold text-teal-600 group-hover:gap-2 flex items-center gap-1 transition-all">
                      อ่านต่อ <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
