import { AdminLayout } from '@/components/admin/AdminLayout'
import { getAnalyticsSummary } from '@/lib/kms/client'
import { FileText, Activity, Stethoscope, Dumbbell, Users, CheckSquare, TrendingUp, Eye } from 'lucide-react'

export default async function AdminDashboard() {
  const stats = await getAnalyticsSummary()
  const articles = stats?.articles ?? { total: 0, byStatus: {}, totalViews: 0 }
  const conditions = stats?.conditions ?? { total: 0 }
  const events = stats?.events ?? {}

  const STAT_CARDS = [
    { label: 'บทความทั้งหมด', value: articles.total, icon: FileText, color: 'text-teal-400', sub: `${articles.byStatus?.published ?? 0} เผยแพร่` },
    { label: 'ยอดชม (รวม)', value: articles.totalViews.toLocaleString(), icon: Eye, color: 'text-violet-400', sub: '30 วันที่ผ่านมา' },
    { label: 'โรค / ภาวะ', value: conditions.total, icon: Activity, color: 'text-amber-400', sub: 'ในระบบ' },
    { label: 'รอตรวจสอบ', value: articles.byStatus?.review ?? 0, icon: CheckSquare, color: 'text-red-400', sub: 'บทความ' },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 space-y-6">
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
              { label: 'ร่าง', key: 'draft' },
              { label: 'รอตรวจสอบ', key: 'review' },
              { label: 'อนุมัติ', key: 'approved' },
              { label: 'เผยแพร่', key: 'published' },
              { label: 'เก็บถาวร', key: 'archived' },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">{s.label}</span>
                <span className="font-semibold text-white">{articles.byStatus?.[s.key] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
