import type { Metadata } from 'next'
import { MapPin, Phone, Globe, Star, Shield, ChevronRight, Search, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'ค้นหาสถานพยาบาล — Hospital & Clinic Finder | Health Compass',
  description: 'ค้นหาโรงพยาบาล คลินิก และศูนย์ตรวจคัดกรองในประเทศไทย พร้อมข้อมูลการรับรอง ประกัน และบริการ',
}

const MOCK_PROVIDERS = [
  {
    id: 'bumrungrad',
    name: 'Bumrungrad International Hospital',
    nameTh: 'โรงพยาบาลบำรุงราษฎร์ อินเตอร์เนชั่นแนล',
    type: 'private',
    city: 'กรุงเทพฯ',
    district: 'วัฒนา',
    address: '33 สุขุมวิท 3 วัฒนา กรุงเทพฯ 10110',
    phone: '02-066-8888',
    website: 'bumrungrad.com',
    specialties: ['หัวใจและหลอดเลือด', 'มะเร็งวิทยา', 'ระบบทางเดินอาหาร', 'ศัลยกรรม', 'เวชศาสตร์ป้องกัน'],
    accreditations: ['JCI', 'HA Thailand'],
    insurance: ['ประกันเอกชนทุกราย', 'CSMBS', 'SSS'],
    languages: ['ไทย', 'อังกฤษ', 'จีน', 'ญี่ปุ่น', 'อาหรับ'],
    rating: 4.8,
    ratingCount: 12400,
    isVerified: true,
    note: 'โรงพยาบาลนานาชาติระดับ World Class',
  },
  {
    id: 'bangkok-hospital',
    name: 'Bangkok Hospital',
    nameTh: 'โรงพยาบาลกรุงเทพ (สำนักงานใหญ่)',
    type: 'private',
    city: 'กรุงเทพฯ',
    district: 'บางกอกน้อย',
    address: '2 ซอยสมเด็จพระเจ้าตากสิน 7 กรุงเทพฯ 10600',
    phone: '02-310-3000',
    website: 'bangkokhospital.com',
    specialties: ['หัวใจและหลอดเลือด', 'มะเร็งวิทยา', 'สมองและระบบประสาท', 'กระดูกและข้อ'],
    accreditations: ['JCI', 'HA Thailand', 'ISO'],
    insurance: ['ประกันเอกชนทุกราย', 'SSS'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.6,
    ratingCount: 8900,
    isVerified: true,
    note: 'เครือโรงพยาบาลกรุงเทพ 49 สาขาทั่วประเทศ',
  },
  {
    id: 'samitivej',
    name: 'Samitivej Hospital Sukhumvit',
    nameTh: 'โรงพยาบาลสมิติเวช สุขุมวิท',
    type: 'private',
    city: 'กรุงเทพฯ',
    district: 'วัฒนา',
    address: '133 สุขุมวิท 49 วัฒนา กรุงเทพฯ 10110',
    phone: '02-022-2222',
    website: 'samitivej.co.th',
    specialties: ['กุมารเวชกรรม', 'สูตินรีเวช', 'หัวใจและหลอดเลือด', 'ออร์โธปิดิกส์'],
    accreditations: ['JCI', 'HA Thailand'],
    insurance: ['ประกันเอกชนทุกราย'],
    languages: ['ไทย', 'อังกฤษ', 'ญี่ปุ่น'],
    rating: 4.7,
    ratingCount: 7200,
    isVerified: true,
    note: 'เชี่ยวชาญด้านกุมารเวชและครอบครัว',
  },
  {
    id: 'rajavithi',
    name: 'Rajavithi Hospital',
    nameTh: 'โรงพยาบาลราชวิถี',
    type: 'public',
    city: 'กรุงเทพฯ',
    district: 'ราชเทวี',
    address: '2 ถนนพญาไท ราชเทวี กรุงเทพฯ 10400',
    phone: '02-354-8108',
    website: 'rajavithi.go.th',
    specialties: ['อายุรกรรมทั่วไป', 'ศัลยกรรม', 'มะเร็งวิทยา', 'หัวใจและหลอดเลือด'],
    accreditations: ['HA Thailand'],
    insurance: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    languages: ['ไทย'],
    rating: 4.1,
    ratingCount: 3400,
    isVerified: true,
    note: 'โรงพยาบาลรัฐ รับสิทธิ 30 บาท CSMBS และประกันสังคม',
  },
  {
    id: 'siriraj',
    name: 'Siriraj Hospital',
    nameTh: 'โรงพยาบาลศิริราช',
    type: 'public',
    city: 'กรุงเทพฯ',
    district: 'บางกอกน้อย',
    address: '2 ถนนพรานนก บางกอกน้อย กรุงเทพฯ 10700',
    phone: '02-419-7000',
    website: 'si.mahidol.ac.th',
    specialties: ['ทุกสาขา', 'Medical Excellence Center', 'Clinical Research'],
    accreditations: ['HA Thailand', 'JCI (บางศูนย์)'],
    insurance: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.3,
    ratingCount: 9800,
    isVerified: true,
    note: 'โรงพยาบาลมหาวิทยาลัย ชั้นนำที่สุดในประเทศไทย',
  },
  {
    id: 'vejthani',
    name: 'Vejthani Hospital',
    nameTh: 'โรงพยาบาลเวชธานี',
    type: 'private',
    city: 'กรุงเทพฯ',
    district: 'ลาดกระบัง',
    address: '1 คลองกุ่ม ลาดกระบัง กรุงเทพฯ 10520',
    phone: '02-734-0000',
    website: 'vejthani.com',
    specialties: ['กระดูกและข้อ', 'หัวใจและหลอดเลือด', 'ระบบประสาท', 'มะเร็งวิทยา'],
    accreditations: ['JCI', 'HA Thailand'],
    insurance: ['ประกันเอกชนทุกราย'],
    languages: ['ไทย', 'อังกฤษ', 'อาหรับ'],
    rating: 4.5,
    ratingCount: 4100,
    isVerified: true,
    note: 'เชี่ยวชาญกระดูกและข้อระดับนานาชาติ',
  },
  {
    id: 'chulalongkorn',
    name: 'King Chulalongkorn Memorial Hospital',
    nameTh: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
    type: 'public',
    city: 'กรุงเทพฯ',
    district: 'ปทุมวัน',
    address: '1873 ถนนพระราม 4 ปทุมวัน กรุงเทพฯ 10330',
    phone: '02-256-4000',
    website: 'chulalongkornhospital.go.th',
    specialties: ['อายุรกรรม', 'ศัลยกรรม', 'มะเร็งวิทยา', 'ต่อมไร้ท่อ'],
    accreditations: ['HA Thailand'],
    insurance: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.4,
    ratingCount: 7600,
    isVerified: true,
    note: 'โรงพยาบาลสภากาชาดไทย เชี่ยวชาญด้านมะเร็งและโรคซับซ้อน',
  },
  {
    id: 'phyathai2',
    name: 'Phyathai 2 Hospital',
    nameTh: 'โรงพยาบาลพญาไท 2',
    type: 'private',
    city: 'กรุงเทพฯ',
    district: 'ราชเทวี',
    address: '943 ถนนพหลโยธิน ราชเทวี กรุงเทพฯ 10400',
    phone: '02-617-2444',
    website: 'phyathai.com',
    specialties: ['หัวใจและหลอดเลือด', 'ระบบทางเดินอาหาร', 'กระดูกและข้อ', 'สูตินรีเวช'],
    accreditations: ['HA Thailand', 'JCI'],
    insurance: ['ประกันเอกชนทุกราย', 'SSS'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.4,
    ratingCount: 3800,
    isVerified: true,
    note: 'ตั้งอยู่ใจกลางกรุงเทพฯ ติดรถไฟฟ้า BTS',
  },
]

const SPECIALTIES = ['ทั้งหมด', 'หัวใจและหลอดเลือด', 'มะเร็งวิทยา', 'ระบบทางเดินอาหาร', 'กระดูกและข้อ', 'สุขภาพจิต', 'สูตินรีเวช', 'กุมารเวชกรรม']
const INSURANCE = ['ทั้งหมด', 'UCS (30 บาท)', 'CSMBS', 'SSS', 'ประกันเอกชน']
const TYPES = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'public', label: 'รัฐบาล' },
  { value: 'private', label: 'เอกชน' },
]

export default function ProvidersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-12">
          <div className="mx-auto max-w-5xl px-6">
            <Badge className="mb-4 bg-teal-500/10 text-teal-300 border-teal-500/20">
              ค้นหาสถานพยาบาล
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              ค้นหาโรงพยาบาลและคลินิก
            </h1>
            <p className="text-slate-400 max-w-xl">
              สถานพยาบาลชั้นนำในประเทศไทย พร้อมข้อมูลความเชี่ยวชาญ การรับรอง และสิทธิการรักษา
            </p>

            {/* Search bar */}
            <div className="mt-6 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="search"
                placeholder="ค้นหาโรงพยาบาล ความเชี่ยวชาญ หรือพื้นที่..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3.5 pl-12 pr-4 text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">

          {/* Demo notice */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-8 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">ข้อมูลตัวอย่างเพื่อการสาธิต</p>
              <p className="text-sm text-blue-700">
                ข้อมูลสถานพยาบาลในหน้านี้เป็นข้อมูลสาธารณะที่รวบรวมเพื่อการสาธิต กรุณาตรวจสอบข้อมูลล่าสุดโดยตรงกับสถานพยาบาลก่อนนัดหมาย
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">ประเภท:</span>
              {TYPES.map(t => (
                <button key={t.value} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${t.value==='all'?'bg-teal-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">ความเชี่ยวชาญ:</span>
              {SPECIALTIES.slice(0, 5).map(s => (
                <button key={s} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${s==='ทั้งหมด'?'bg-teal-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">สิทธิประกัน:</span>
              {INSURANCE.map(ins => (
                <button key={ins} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${ins==='ทั้งหมด'?'bg-teal-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                  {ins}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-500 mb-5">
            แสดง <strong className="text-slate-800">{MOCK_PROVIDERS.length}</strong> สถานพยาบาล
          </p>

          {/* Provider Cards */}
          <div className="grid grid-cols-1 gap-5">
            {MOCK_PROVIDERS.map(p => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-teal-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{p.nameTh}</h3>
                      {p.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5">
                          <Shield className="h-2.5 w-2.5" /> ยืนยันแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{p.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.type==='private'?'bg-blue-50 text-blue-700':'bg-emerald-50 text-emerald-700'}`}>
                      {p.type==='private'?'เอกชน':'รัฐบาล'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-slate-700">{p.rating}</span>
                      <span className="text-[10px] text-slate-400">({p.ratingCount.toLocaleString()})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{p.address}</span>
                </div>

                {/* Note */}
                {p.note && (
                  <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2 mb-3">{p.note}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {/* Specialties */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">ความเชี่ยวชาญ</p>
                    <div className="flex flex-wrap gap-1">
                      {p.specialties.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{s}</span>
                      ))}
                      {p.specialties.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">+{p.specialties.length-3} อื่นๆ</span>
                      )}
                    </div>
                  </div>

                  {/* Insurance */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">สิทธิการรักษา</p>
                    <div className="flex flex-wrap gap-1">
                      {p.insurance.map(ins => (
                        <span key={ins} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{ins}</span>
                      ))}
                    </div>
                  </div>

                  {/* Accreditations */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">การรับรอง</p>
                    <div className="flex flex-wrap gap-1">
                      {p.accreditations.map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                  <a href={`tel:${p.phone}`} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">
                    <Phone className="h-3.5 w-3.5" /> {p.phone}
                  </a>
                  <a href={`https://${p.website}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">
                    <Globe className="h-3.5 w-3.5" /> เว็บไซต์
                  </a>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(p.address)}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">
                    <MapPin className="h-3.5 w-3.5" /> แผนที่
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* CTA for partner hospitals */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">เป็นสถานพยาบาลพาร์ตเนอร์</h3>
            <p className="text-teal-100 text-sm mb-5">
              ร่วมเป็นพาร์ตเนอร์กับ Health Compass เพื่อเชื่อมต่อกับผู้ป่วยที่ใช้บริการตรวจสุขภาพเชิงป้องกัน
            </p>
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
