import { AdminLayout } from '@/components/admin/AdminLayout'
import { Shield, Key, Database, Bell } from 'lucide-react'

export default function AdminSettings() {
  const sections = [
    { icon: Shield, title: 'ความปลอดภัย', items: ['เปลี่ยนรหัสผ่าน Admin', 'Session timeout', 'Two-factor auth (เร็วๆ นี้)'] },
    { icon: Database, title: 'ฐานข้อมูล', items: ['Supabase connection status', 'KMS migration status', 'Analytics retention'] },
    { icon: Bell, title: 'การแจ้งเตือน', items: ['Email เมื่อมีบทความรอตรวจสอบ', 'แจ้งเตือน review queue > 5'] },
  ]

  return (
    <AdminLayout title="ตั้งค่า">
      <div className="p-6 max-w-2xl space-y-5">
        {sections.map(s => {
          const Icon = s.icon
          return (
            <div key={s.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-4 w-4 text-teal-400" />
                <h3 className="text-sm font-semibold text-white">{s.title}</h3>
              </div>
              <ul className="space-y-2">
                {s.items.map(item => (
                  <li key={item} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-slate-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        {/* Env info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-white">Environment</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-500">
            <p>Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured'}</p>
            <p>Admin Password: {process.env.ADMIN_PASSWORD ? 'Configured' : 'Using default (change in production!)'}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
