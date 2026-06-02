import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAnalyticsSummary } from '@/lib/kms/client'
import Link from 'next/link'
import {
  FileText, Activity, Stethoscope, Dumbbell, Users, CheckSquare,
  TrendingUp, Eye, MapPin, BookOpen, Plus, Scale, ChevronRight,
} from 'lucide-react'

const CMS_CARDS = [
  { label: 'บทความ', sub: 'จัดการบทความทั้งหมด', href: '/admin/articles', icon: FileText, color: 'text-teal-400 bg-teal-400/10', primary: false },
  { label: 'เพิ่มบทความ', sub: 'สร้างบทความใหม่', href: '/admin/articles/new', icon: Plus, color: 'text-white bg-teal-600', primary: true },
  { label: 'โรคและภาวะ', sub: 'Conditions database', href: '/admin/conditions', icon: Activity, color: 'text-amber-400 bg-amber-400/10', primary: false },
  { label: 'อาการ', sub: 'Symptoms database', href: '/admin/symptoms', icon: Stethoscope, color: 'text-sky-400 bg-sky-400/10', primary: false },
  { label: 'ส่วนร่างกาย', sub: 'Body regions', href: '/admin/body-regions', icon: MapPin, color: 'text-violet-400 bg-violet-400/10', primary: false },
  { label: 'การบาดเจ็บนักกีฬา', sub: 'Athlete conditions', href: '/admin/athlete-conditions', icon: Dumbbell, color: 'text-orange-400 bg-orange-400/10', primary: false },
  { label: 'Clinical Pathways', sub: 'Pathway builder', href: '/admin/clinical-pathways', icon: Scale, color: 'text-emerald-400 bg-emerald-400/10', primary: false },
  { label: 'แหล่งอ้างอิง', sub: 'References', href: '/admin/references', icon: BookOpen, color: 'text-pink-400 bg-pink-400/10', primary: false },
  { label: 'ผู้เขียน', sub: 'Authors & reviewers', href: '/admin/authors', icon: Users, color: 'text-slate-300 bg-slate-700', primary: false },
]

export default async function AdminDashboard() {
  const stats = await getAnalyticsSummary()
  const articles = stats?.articles ?? { total: 0, byStatus: {} as Record<string, number>, totalViews: 0 }
  const conditions = stats?.conditions ?? { total: 0 }
  const events = stats?.events ?? {}

  const STAT_CARDS = [
    { label: 'บทความทั้งหมด', value: articles.total, icon: FileText, color: 'text-teal-400', sub: `${articles.byStatus?.published ?? 0} เผยแพร่` },
    { label: 'ยอดชม (รวม)', value: Number(articles.totalViews).toLocaleString(), icon: Eye, color: 'text-violet-400', sub: '30 วันที่ผ่านมา' },
    { label: 'โรค / ภาวะ', value: conditions.total, icon: Activity, color: 'text-amber-400', sub: 'ในระบบ' },
    { label: 'รอตรวจสอบ', value: articles.byStatus?.review ?? 0, icon: CheckSquare, color: 'text-red-400', sub: 'บทความ' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <Icon className={`h-4 w-4 ${s.color}`} strokeWidth={1.75} />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
              </div>
            )
          })}
        </div>

        {/* CMS Quick Access */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">จัดการเนื้อหา</h2>
            <Link href="/admin/articles" className="text-xs text-slate-500 hover:text-teal-400 transition-colors flex items-center gap-1">
              ดูทั้งหมด <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {CMS_CARDS.map(card => {
              const Icon = card.icon
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`group flex flex-col gap-3 rounded-2xl border p-4 transition-all hover:scale-[1.02] ${
                    card.primary
                      ? 'border-teal-500 bg-teal-600 hover:bg-teal-500'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${card.primary ? 'text-white' : 'text-slate-200'}`}>
                      {card.label}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${card.primary ? 'text-teal-100' : 'text-slate-500'}`}>
                      {card.sub}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Analytics + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-400" /> กิจกรรม 30 วัน
            </h3>
            <div className="space-y-2">
              {Object.entries(events).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{k.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-white">{String(v)}</span>
                </div>
              ))}
              {Object.keys(events).length === 0 && (
                <p className="text-sm text-slate-500">ยังไม่มีข้อมูล analytics</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-400" /> สถานะบทความ
            </h3>
            {[
              { label: 'ร่าง', key: 'draft', color: 'bg-slate-600' },
              { label: 'รอตรวจสอบ', key: 'review', color: 'bg-amber-600' },
              { label: 'อนุมัติ', key: 'approved', color: 'bg-blue-600' },
              { label: 'เผยแพร่', key: 'published', color: 'bg-emerald-600' },
              { label: 'เก็บถาวร', key: 'archived', color: 'bg-slate-700' },
            ].map(s => {
              const count = articles.byStatus?.[s.key] ?? 0
              const total = articles.total || 1
              return (
                <div key={s.key} className="flex items-center gap-3 mb-2.5">
                  <span className="text-xs text-slate-400 w-20 shrink-0">{s.label}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all`}
                      style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-white w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
