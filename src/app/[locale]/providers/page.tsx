import type { Metadata } from 'next'
import { MapPin, Phone, Globe, Star, Shield, ChevronRight, AlertCircle, Building2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import { HOSPITALS, PROVINCES } from '@/data/hospitals'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'ค้นหาสถานพยาบาล — Hospital & Clinic Finder | FirstScreen',
  description: 'ค้นหาโรงพยาบาล คลินิก และศูนย์ตรวจคัดกรองในประเทศไทย พร้อมข้อมูลการรับรอง ประกัน และบริการ',
}

export default function ProvidersPage() {
  const publicCount = HOSPITALS.filter(h => h.type === 'public').length
  const privateCount = HOSPITALS.filter(h => h.type === 'private').length
  const jciCount = HOSPITALS.filter(h => h.accreditations.includes('JCI')).length

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <Building2 className="h-5 w-5 text-teal-400" />
              </div>
              <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20">ค้นหาสถานพยาบาล</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">โรงพยาบาลและสถานพยาบาล</h1>
            <p className="text-slate-400 max-w-xl">
              สถานพยาบาลชั้นนำในประเทศไทย พร้อมข้อมูลการรับรอง สิทธิการรักษา และความเชี่ยวชาญ
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              {[
                { value: HOSPITALS.length, label: 'สถานพยาบาล' },
                { value: privateCount, label: 'เอกชน' },
                { value: publicCount, label: 'รัฐบาล' },
                { value: jciCount, label: 'JCI Accredited' },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5">
                  <span className="text-xl font-bold text-teal-400">{s.value}</span>
                  <span className="text-slate-400 text-sm ml-2">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
          {/* Demo notice */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-8 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">ข้อมูลสาธารณะเพื่อการสาธิต</p>
              <p className="text-sm text-blue-700">
                ข้อมูลที่แสดงรวบรวมจากแหล่งสาธารณะ กรุณาตรวจสอบกับสถานพยาบาลโดยตรงก่อนนัดหมาย
              </p>
            </div>
          </div>

          {/* Province tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {['ทั้งหมด', ...PROVINCES].map(prov => (
              <span key={prov} className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium cursor-pointer transition-colors',
                prov === 'ทั้งหมด'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'
              )}>
                {prov}
                <span className="ml-1.5 text-xs opacity-70">
                  ({prov === 'ทั้งหมด'
                    ? HOSPITALS.length
                    : HOSPITALS.filter(h => h.province === prov).length})
                </span>
              </span>
            ))}
          </div>

          {/* Hospital Cards */}
          <div className="grid grid-cols-1 gap-5">
            {HOSPITALS.map(h => (
              <div key={h.id} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-teal-200 hover:shadow-sm transition-all">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{h.nameTh}</h3>
                      {h.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5">
                          <Shield className="h-2.5 w-2.5" /> ยืนยันแล้ว
                        </span>
                      )}
                      {h.emergencyAvailable && (
                        <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                          🚨 ฉุกเฉิน 24 ชม.
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{h.nameEn}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      'text-xs font-semibold px-2.5 py-1 rounded-full',
                      h.type === 'private' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                    )}>
                      {h.type === 'private' ? 'เอกชน' : 'รัฐบาล'}
                    </span>
                    {h.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-slate-700">{h.rating}</span>
                        <span className="text-[10px] text-slate-400">({h.ratingCount?.toLocaleString()})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{h.address}</span>
                </div>

                {/* Note */}
                {h.note && (
                  <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2 mb-3">{h.note}</p>
                )}

                {/* Grid: specialties / insurance / accreditations */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">ความเชี่ยวชาญ</p>
                    <div className="flex flex-wrap gap-1">
                      {h.specialties.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{s}</span>
                      ))}
                      {h.specialties.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">+{h.specialties.length - 3}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">สิทธิการรักษา</p>
                    <div className="flex flex-wrap gap-1">
                      {h.insuranceAccepted.slice(0, 3).map(ins => (
                        <span key={ins} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{ins}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">การรับรอง</p>
                    <div className="flex flex-wrap gap-1">
                      {h.accreditations.map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                  <a href={`tel:${h.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors min-h-[36px]">
                    <Phone className="h-3.5 w-3.5" /> {h.phone}
                  </a>
                  {h.website && (
                    <a href={`https://${h.website}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors min-h-[36px]">
                      <Globe className="h-3.5 w-3.5" /> เว็บไซต์
                    </a>
                  )}
                  {h.lat && h.lng && (
                    <a href={`https://maps.google.com/?q=${h.lat},${h.lng}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors min-h-[36px]">
                      <MapPin className="h-3.5 w-3.5" /> แผนที่
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Partner CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">เป็นสถานพยาบาลพาร์ตเนอร์</h3>
            <p className="text-teal-100 text-sm mb-5">เชื่อมต่อกับผู้ใช้ที่ใช้บริการตรวจสุขภาพเชิงป้องกัน</p>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-xl bg-white text-teal-700 font-semibold px-6 py-2.5 text-sm hover:bg-teal-50 transition-colors">
              สนใจร่วมงานกับเรา <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
