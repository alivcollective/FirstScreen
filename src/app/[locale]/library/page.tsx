import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ChevronRight, Clock, Search } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Newsletter } from '@/components/shared/newsletter'
import { MedicalReview } from '@/components/shared/medical-review'
import { ARTICLES, getRecentArticles } from '@/data/articles'
import { LIBRARY_CATEGORIES } from '@/data/library-categories'

export const metadata: Metadata = {
  title: 'Health Library — คลังความรู้สุขภาพ | FirstScreen',
  description: 'บทความสุขภาพที่อิงหลักฐาน 7 หมวดหมู่ คู่มือโรค แนวทางตรวจคัดกรอง โดยทีมแพทย์ผู้เชี่ยวชาญ',
}

export default function LibraryPage() {
  const recent = getRecentArticles(6)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <BookOpen className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-teal-300 bg-teal-500/10 rounded-full px-3 py-0.5">
                คลังความรู้สุขภาพ
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">คลังความรู้สุขภาพ</h1>
            <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
              7 หมวดหมู่ · บทความ · คู่มือโรค · แนวทางตรวจคัดกรอง อิงหลักฐานทางการแพทย์
            </p>
            <Link
              href="/search"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white/80 hover:bg-white/20 transition-colors"
            >
              <Search className="h-4 w-4" />
              ค้นหาในคลังความรู้...
              <kbd className="ml-2 text-[10px] rounded bg-white/20 px-1.5 py-0.5 font-mono">⌘K</kbd>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

          {/* Category cards — 7 categories with real links */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">7 หมวดหมู่</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {LIBRARY_CATEGORIES.map(cat => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.slug}
                    href={`/library/${cat.slug}`}
                    className={`group flex items-center gap-3 rounded-2xl border p-4 hover:shadow-sm transition-all ${cat.bg} ${cat.border}`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60`}>
                      <Icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${cat.color} group-hover:underline leading-tight`}>{cat.nameTh}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.descriptionTh.slice(0, 40)}...</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Recent Articles */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">บทความล่าสุด</h2>
              <Link href="/articles" className="text-sm text-teal-600 hover:underline flex items-center gap-1">
                ดูทั้งหมด <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map(article => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 hover:border-teal-200 hover:shadow-sm transition-all"
                >
                  <span className={`self-start rounded-full border text-xs font-medium px-2.5 py-1 mb-3 ${article.categoryColor}`}>
                    {article.categoryTh}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-teal-700 transition-colors mb-2">
                    {article.titleTh}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-2">
                    {article.excerptTh}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {article.readTimeMinutes} นาที
                    <span className="ml-auto text-teal-600 font-medium group-hover:underline">อ่านต่อ →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Trust info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <MedicalReview
              isPending
              evidenceLevel="pending"
              reviewedBy="ทีมแพทย์ FirstScreen"
              reviewDate="2026-06"
            />
          </section>

          {/* Newsletter */}
          <Newsletter />
        </div>
      </main>
      <Footer />
    </div>
  )
}
