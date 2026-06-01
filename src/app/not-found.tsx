import Link from 'next/link'
import { Heart, ArrowLeft, Search, Activity } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 mx-auto mb-4">
          <Heart className="h-8 w-8 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-slate-500 text-sm font-medium">Health Compass</span>
      </div>

      <h1 className="text-6xl font-black text-white mb-3">404</h1>
      <h2 className="text-xl font-semibold text-slate-300 mb-3">ไม่พบหน้าที่คุณกำลังมองหา</h2>
      <p className="text-slate-500 text-sm max-w-md mb-10">
        หน้านี้อาจถูกย้าย ลบ หรือ URL ไม่ถูกต้อง ลองค้นหาสิ่งที่คุณต้องการด้านล่าง
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-8">
        {[
          { href: '/risk', icon: Activity, label: 'ประเมินความเสี่ยง' },
          { href: '/symptoms', icon: Search, label: 'ตรวจอาการ' },
          { href: '/diseases', icon: Heart, label: 'คลังข้อมูลโรค' },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className="flex items-center gap-2 justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-300 hover:border-teal-500 hover:text-teal-400 transition-colors">
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        กลับหน้าหลัก
      </Link>
    </div>
  )
}
