'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import {
  Menu, X, Globe, ChevronDown, Search,
  Heart, Activity, Stethoscope, Calendar, Building2,
  BookOpen, Shield, Brain, Ribbon, ArrowRight,
  Scale, Microscope, FlaskConical, FileText, HeartPulse, MapPin,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { SUPPORTED_LANGUAGES } from '@/lib/constants'
import { ButtonLink } from '@/components/ui/button-link'
import { SmartSearch, useSmartSearch } from '@/components/search/SmartSearch'

// ── 5 primary nav items — shorter labels, whitespace-nowrap ────
// "ความรู้" consolidates library + guidelines + screening

const MEGA_MENUS = {
  risk: {
    label: 'ประเมิน',
    href: '/risk',
    icon: Activity,
    sections: [
      {
        heading: 'เครื่องมือประเมิน',
        items: [
          { label: 'ความเสี่ยงหัวใจ', desc: 'Framingham CVD Risk', href: '/risk#cvd', icon: HeartPulse },
          { label: 'ความเสี่ยงเบาหวาน', desc: 'FINDRISC — เกณฑ์เอเชีย', href: '/risk#diabetes', icon: Activity },
          { label: 'ความเสี่ยงมะเร็ง', desc: '5 ชนิด · แนวทางไทย', href: '/risk#cancer', icon: Ribbon },
          { label: 'สุขภาพจิต', desc: 'PHQ-9 + GAD-7', href: '/risk#mental', icon: Brain },
        ],
      },
    ],
    featured: { label: 'เริ่มประเมินทันที', href: '/risk', cta: true },
  },
  symptoms: {
    label: 'ตรวจอาการ',
    href: '/symptoms',
    icon: Stethoscope,
    sections: [
      {
        heading: 'ตรวจอาการ',
        items: [
          { label: 'เลือกตำแหน่งอาการ', desc: 'Body Map — คลิกจุดที่มีอาการ', href: '/body-map', icon: MapPin },
          { label: 'ตรวจอาการ 7 ขั้นตอน', desc: 'OLDCARTS · Differential Diagnosis', href: '/symptoms', icon: Stethoscope },
          { label: 'อาการฉุกเฉิน', desc: 'สัญญาณที่ต้องโทร 1669', href: '/symptoms#emergency', icon: Shield },
        ],
      },
      {
        heading: 'โรคที่พบบ่อย',
        items: [
          { label: 'โรคหัวใจ', href: '/diseases/heart-disease', icon: HeartPulse },
          { label: 'เบาหวาน', href: '/diseases/type-2-diabetes', icon: Activity },
          { label: 'มะเร็งเต้านม', href: '/diseases/breast-cancer', icon: Ribbon },
          { label: 'หลอดเลือดสมอง', href: '/diseases/stroke', icon: Brain },
        ],
      },
    ],
  },
  diseases: {
    label: 'โรค',
    href: '/diseases',
    icon: BookOpen,
    sections: [
      {
        heading: 'หัวใจ & หลอดเลือด',
        items: [
          { label: 'โรคหัวใจขาดเลือด', href: '/diseases/heart-disease', icon: HeartPulse },
          { label: 'หลอดเลือดสมอง', href: '/diseases/stroke', icon: Brain },
          { label: 'ความดันโลหิตสูง', href: '/diseases/hypertension', icon: Activity },
        ],
      },
      {
        heading: 'มะเร็ง',
        items: [
          { label: 'มะเร็งเต้านม', href: '/diseases/breast-cancer', icon: Ribbon },
          { label: 'มะเร็งปอด', href: '/diseases/lung-cancer', icon: Shield },
          { label: 'มะเร็งลำไส้ใหญ่', href: '/diseases/colorectal-cancer', icon: Activity },
        ],
      },
      {
        heading: 'เมตาบอลิก',
        items: [
          { label: 'เบาหวานชนิดที่ 2', href: '/diseases/type-2-diabetes', icon: Activity },
        ],
      },
    ],
    featured: { label: 'ดูโรคทั้งหมด', href: '/diseases' },
  },
  knowledge: {
    label: 'ความรู้',
    href: '/library',
    icon: BookOpen,
    sections: [
      {
        heading: 'เนื้อหาสุขภาพ',
        items: [
          { label: 'คลังความรู้สุขภาพ', desc: '7 หมวดหมู่', href: '/library', icon: BookOpen },
          { label: 'บทความสุขภาพ', desc: 'โภชนาการ ออกกำลังกาย นอนหลับ', href: '/articles', icon: FileText },
          { label: 'แผนคัดกรองสุขภาพ', desc: 'เฉพาะบุคคล ตามอายุ/เพศ', href: '/screening', icon: Calendar },
          { label: 'แดชบอร์ดสุขภาพ', desc: 'ผลประเมินของฉัน', href: '/dashboard', icon: Activity },
        ],
      },
      {
        heading: 'แนวทางการแพทย์',
        items: [
          { label: 'เปรียบเทียบแนวทาง', desc: 'ไทย vs WHO vs USPSTF', href: '/guidelines', icon: Scale },
          { label: 'ทรัพยากรทางคลินิก', desc: 'สำหรับบุคลากรสาธารณสุข', href: '/clinical-resources', icon: Microscope },
          { label: 'วิธีการและมาตรฐาน', href: '/methodology', icon: FlaskConical },
          { label: 'ทีมแพทย์', href: '/medical-advisors', icon: Shield },
        ],
      },
    ],
    featured: { label: 'ดูคลังความรู้', href: '/library' },
  },
  hospitals: {
    label: 'โรงพยาบาล',
    href: '/providers',
    icon: Building2,
    sections: [
      {
        heading: 'ค้นหาสถานพยาบาล',
        items: [
          { label: 'ค้นหาโรงพยาบาล', desc: 'กรองตามจังหวัด ประกัน', href: '/providers', icon: Building2 },
          { label: 'โรงพยาบาลรัฐ', href: '/providers#public', icon: Building2 },
          { label: 'โรงพยาบาลเอกชน', href: '/providers#private', icon: Building2 },
          { label: 'ศูนย์ตรวจคัดกรอง', href: '/providers#screening', icon: Calendar },
        ],
      },
    ],
  },
} as const

type MenuKey = keyof typeof MEGA_MENUS

// ── Mega-menu Dropdown — fixed positioning, viewport-clamped ──
// Uses position:fixed + getBoundingClientRect so it never overflows viewport

interface MegaDropdownProps {
  menuKey: MenuKey
  onClose: () => void
}

function MegaDropdown({ menuKey, onClose }: MegaDropdownProps) {
  const menu = MEGA_MENUS[menuKey]
  const sections = 'sections' in menu ? menu.sections : []
  const featured = 'featured' in menu ? menu.featured : null
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    // Query the trigger element by its data-navkey attribute — avoids ref-during-render
    const trigger = document.querySelector(`[data-navkey="${menuKey}"]`) as HTMLElement | null
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const DROPDOWN_MAX = 620
    const MARGIN = 16
    const dropW = Math.min(DROPDOWN_MAX, window.innerWidth - MARGIN * 2)
    let left = rect.left + rect.width / 2 - dropW / 2
    left = Math.max(MARGIN, Math.min(left, window.innerWidth - dropW - MARGIN))
    const p = { top: rect.bottom + 6, left, width: dropW }; setTimeout(() => setPos(p), 0)
  }, [menuKey])

  if (!pos) return null

  return (
    <div
      style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 200 }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 overflow-hidden"
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
    >
      <div className={cn('grid gap-5', sections.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
        {sections.map((section) => (
          <div key={section.heading}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">
              {section.heading}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href as Parameters<typeof Link>[0]['href']}
                    onClick={onClose}
                    className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 group-hover:bg-teal-100 transition-colors">
                      <Icon className="h-3.5 w-3.5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 leading-tight whitespace-nowrap">{item.label}</p>
                      {'desc' in item && item.desc && (
                        <p className="text-xs text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {featured && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link
            href={featured.href as Parameters<typeof Link>[0]['href']}
            onClick={onClose}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
              'cta' in featured && featured.cta
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'text-teal-600 hover:bg-teal-50'
            )}
          >
            {featured.label}
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Mobile accordion menu item ────────────────────────────────

function MobileMenuItem({ menuKey, onClose }: { menuKey: MenuKey; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  const menu = MEGA_MENUS[menuKey]
  const Icon = menu.icon
  const sections = 'sections' in menu ? menu.sections : []

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={menu.href as Parameters<typeof Link>[0]['href']}
          className="flex flex-1 items-center gap-2 px-3 py-2.5 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
          onClick={onClose}
        >
          <Icon className="h-4 w-4 text-slate-400" />
          {menu.label}
        </Link>
        {sections.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label={`expand ${menu.label}`}
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          </button>
        )}
      </div>
      {open && sections.length > 0 && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-100 pl-3 pb-1">
          {sections.flatMap((s) =>
            s.items.map((item) => (
              <Link
                key={item.href}
                href={item.href as Parameters<typeof Link>[0]['href']}
                className="block py-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const { open: searchOpen, setOpen: setSearchOpen } = useSmartSearch()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const openMenu = useCallback((key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(key)
  }, [])

  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150)
  }, [])

  const keepOpen = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
    if (typeof window !== 'undefined') {
      localStorage.setItem('health-compass-locale', newLocale)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/97 backdrop-blur-md border-b border-slate-100">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="FirstScreen หน้าแรก">
            <Image
              src="/brand/firstscreen-icon.png"
              alt="FirstScreen"
              width={30}
              height={30}
              className="h-[30px] w-[30px] rounded-lg object-cover"
            />
            <span className="text-[15px] font-semibold text-slate-900 tracking-tight hidden sm:block">
              FirstScreen
            </span>
          </Link>

          {/* Desktop nav — 5 items, nowrap, font-normal */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0">
            {(Object.keys(MEGA_MENUS) as MenuKey[]).map((key) => {
              const menu = MEGA_MENUS[key]
              const isActive = activeMenu === key
              return (
                <div
                  key={key}
                  data-navkey={key}
                  onMouseEnter={() => openMenu(key)}
                  onMouseLeave={closeMenu}
                >
                  <Link
                    href={menu.href as Parameters<typeof Link>[0]['href']}
                    className={cn(
                      'flex items-center gap-0.5 px-2.5 py-2 text-[14px] font-normal rounded-lg transition-colors whitespace-nowrap',
                      isActive
                        ? 'text-teal-700 bg-teal-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    {menu.label}
                    <ChevronDown className={cn('h-3 w-3 opacity-40 transition-transform ml-0.5', isActive && 'rotate-180')} />
                  </Link>
                  {isActive && (
                    <MegaDropdown
                      menuKey={key}
                      onClose={() => setActiveMenu(null)}
                    />
                  )}
                </div>
              )
            })}
          </nav>

          {/* Search bar — max-w-[260px] */}
          <div className="hidden lg:flex items-center max-w-[260px] w-full">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-colors"
              aria-label="ค้นหา"
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">ค้นหาโรค อาการ...</span>
              <kbd className="ml-auto text-[10px] rounded bg-slate-200 px-1 py-0.5 text-slate-500 font-mono shrink-0">⌘K</kbd>
            </button>
          </div>

          <SmartSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

          {/* Right side */}
          <div className="flex items-center gap-1 shrink-0 ml-auto lg:ml-0">
            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="ค้นหา"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Language — clean text, no flag emoji */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label="เปลี่ยนภาษา"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="uppercase text-xs font-medium">{locale}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="gap-2 cursor-pointer text-sm"
                    onClick={() => switchLocale(lang.code)}
                  >
                    <span className="text-xs font-mono font-semibold text-slate-500 w-6">{lang.code.toUpperCase()}</span>
                    <span>{lang.name}</span>
                    {lang.code === locale && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ButtonLink
              href="/risk"
              size="sm"
              className="hidden sm:flex bg-teal-600 hover:bg-teal-700 text-white text-[13px] font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap"
            >
              เริ่มต้น
            </ButtonLink>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -mr-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="mx-auto max-w-lg px-4 py-3 space-y-0.5">
            {(Object.keys(MEGA_MENUS) as MenuKey[]).map((key) => (
              <MobileMenuItem key={key} menuKey={key} onClose={() => setMobileOpen(false)} />
            ))}

            {/* Language selection — text only */}
            <div className="pt-3 pb-1 flex flex-wrap gap-1.5 px-3 border-t border-slate-100 mt-2">
              {SUPPORTED_LANGUAGES.slice(0, 4).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { switchLocale(lang.code); setMobileOpen(false) }}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    lang.code === locale
                      ? 'border-teal-300 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-600'
                  )}
                >
                  <span className="font-mono font-semibold">{lang.code.toUpperCase()}</span>
                  <span>{lang.englishName}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 pb-1">
              <ButtonLink
                href="/risk"
                className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl py-3"
              >
                เริ่มประเมินสุขภาพ
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
