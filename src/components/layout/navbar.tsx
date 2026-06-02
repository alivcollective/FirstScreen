'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import {
  Menu, X, Globe, ChevronDown, Search,
  Heart, Activity, Stethoscope, Calendar, Building2,
  BookOpen, Shield, Brain, Ribbon, ArrowRight,
  Scale, Microscope, FlaskConical, FileText,
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

// ── Mega-menu definitions ─────────────────────────────────────

const MEGA_MENUS = {
  risk: {
    label: 'ประเมินความเสี่ยง',
    href: '/risk',
    icon: Activity,
    sections: [
      {
        heading: 'เครื่องมือประเมิน',
        items: [
          { label: 'ความเสี่ยงหัวใจ & หลอดเลือด', desc: 'Framingham 10-Year CVD Risk', href: '/risk#cvd', icon: Heart },
          { label: 'ความเสี่ยงเบาหวาน', desc: 'FINDRISC — ปรับสำหรับเอเชีย', href: '/risk#diabetes', icon: Activity },
          { label: 'ความเสี่ยงมะเร็ง', desc: '5 ชนิด · ตามแนวทางไทย', href: '/risk#cancer', icon: Ribbon },
          { label: 'สุขภาพจิต', desc: 'PHQ-9 ซึมเศร้า + GAD-7 วิตกกังวล', href: '/risk#mental', icon: Brain },
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
        heading: 'เครื่องมือตรวจอาการ',
        items: [
          { label: 'Symptom Checker', desc: '7 ขั้นตอน · Differential Diagnosis', href: '/symptoms', icon: Stethoscope },
          { label: 'อาการฉุกเฉิน', desc: 'สัญญาณที่ต้องโทร 1669 ทันที', href: '/symptoms#emergency', icon: Shield },
        ],
      },
      {
        heading: 'โรคที่พบบ่อย',
        items: [
          { label: 'อาการปวดหัวใจ', href: '/diseases/heart-disease', icon: Heart },
          { label: 'อาการเบาหวาน', href: '/diseases/type-2-diabetes', icon: Activity },
          { label: 'อาการมะเร็ง', href: '/diseases/breast-cancer', icon: Ribbon },
          { label: 'อาการโรคสมอง', href: '/diseases/stroke', icon: Brain },
        ],
      },
    ],
  },
  diseases: {
    label: 'โรคต่างๆ',
    href: '/diseases',
    icon: BookOpen,
    sections: [
      {
        heading: 'หัวใจ & หลอดเลือด',
        items: [
          { label: 'โรคหัวใจขาดเลือด', href: '/diseases/heart-disease', icon: Heart },
          { label: 'โรคหลอดเลือดสมอง', href: '/diseases/stroke', icon: Brain },
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
  screening: {
    label: 'แผนคัดกรอง',
    href: '/screening',
    icon: Calendar,
    sections: [
      {
        heading: 'แผนส่วนบุคคล',
        items: [
          { label: 'แผนตรวจคัดกรองของฉัน', desc: 'ปรับตามอายุ เพศ และปัจจัยเสี่ยง', href: '/screening', icon: Calendar },
        ],
      },
      {
        heading: 'ตามกลุ่มอายุ',
        items: [
          { label: 'อายุ 20-30 ปี', href: '/screening#age20', icon: Shield },
          { label: 'อายุ 40-50 ปี', href: '/screening#age40', icon: Shield },
          { label: 'อายุ 60+ ปี', href: '/screening#age60', icon: Shield },
        ],
      },
    ],
  },
  hospitals: {
    label: 'โรงพยาบาล',
    href: '/providers',
    icon: Building2,
    sections: [
      {
        heading: 'ค้นหาสถานพยาบาล',
        items: [
          { label: 'ค้นหาโรงพยาบาล', desc: 'กรองตามจังหวัด ประกัน ความเชี่ยวชาญ', href: '/providers', icon: Building2 },
          { label: 'โรงพยาบาลรัฐ', href: '/providers#public', icon: Building2 },
          { label: 'โรงพยาบาลเอกชน', href: '/providers#private', icon: Building2 },
          { label: 'ศูนย์ตรวจคัดกรอง', href: '/providers#screening', icon: Calendar },
        ],
      },
    ],
  },
  library: {
    label: 'คลังความรู้สุขภาพ',
    href: '/library',
    icon: BookOpen,
    sections: [
      {
        heading: 'เนื้อหาสุขภาพ',
        items: [
          { label: 'คลังความรู้สุขภาพ', desc: '7 หมวดหมู่ · อิงหลักฐาน', href: '/library', icon: BookOpen },
          { label: 'บทความสุขภาพ', desc: 'โภชนาการ ออกกำลังกาย นอนหลับ', href: '/articles', icon: BookOpen },
          { label: 'แดชบอร์ดสุขภาพ', desc: 'ผลประเมินและประวัติของฉัน', href: '/dashboard', icon: Activity },
          { label: 'รายงานสุขภาพ', desc: 'PDF · พิมพ์ · แชร์กับแพทย์', href: '/dashboard/report', icon: FileText },
        ],
      },
    ],
  },
  guidelines: {
    label: 'ศูนย์แนวทางการแพทย์',
    href: '/guidelines',
    icon: Scale,
    sections: [
      {
        heading: 'แนวทางคัดกรอง',
        items: [
          { label: 'เปรียบเทียบแนวทางการแพทย์', desc: 'ไทย vs WHO vs USPSTF vs NICE', href: '/guidelines', icon: Scale },
          { label: 'ทรัพยากรทางคลินิก', desc: 'สำหรับบุคลากรสาธารณสุข', href: '/clinical-resources', icon: Microscope },
          { label: 'วิธีการและมาตรฐาน', desc: 'อิงหลักฐานทางการแพทย์', href: '/methodology', icon: FlaskConical },
          { label: 'ทีมแพทย์', desc: 'ทีมที่ปรึกษาและกระบวนการตรวจสอบ', href: '/medical-advisors', icon: Shield },
        ],
      },
      {
        heading: 'แนวทางตามโรค',
        items: [
          { label: 'โรคหัวใจ', href: '/guidelines/heart-disease', icon: Heart },
          { label: 'เบาหวาน', href: '/guidelines/type-2-diabetes', icon: Activity },
          { label: 'มะเร็งเต้านม', href: '/guidelines/breast-cancer', icon: Ribbon },
          { label: 'มะเร็งลำไส้ใหญ่', href: '/guidelines/colorectal-cancer', icon: Shield },
        ],
      },
    ],
    featured: { label: 'ดูศูนย์แนวทางการแพทย์', href: '/guidelines' },
  },
} as const

type MenuKey = keyof typeof MEGA_MENUS

// ── Mega-menu Dropdown ────────────────────────────────────────

function MegaDropdown({ menuKey, onClose }: { menuKey: MenuKey; onClose: () => void }) {
  const menu = MEGA_MENUS[menuKey]
  const sections = 'sections' in menu ? menu.sections : []
  const featured = 'featured' in menu ? menu.featured : null

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-screen max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50">
      <div className={cn('grid gap-4', sections.length > 1 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
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
                      <p className="text-sm font-medium text-slate-900 leading-tight">{item.label}</p>
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

function MobileMenuItem({
  menuKey,
  onClose,
}: {
  menuKey: MenuKey
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const menu = MEGA_MENUS[menuKey]
  const Icon = menu.icon
  const sections = 'sections' in menu ? menu.sections : []

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={menu.href as Parameters<typeof Link>[0]['href']}
          className="flex flex-1 items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          onClick={onClose}
        >
          <Icon className="h-4 w-4 text-slate-400" />
          {menu.label}
        </Link>
        {sections.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          </button>
        )}
      </div>
      {open && sections.length > 0 && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-100 pl-3">
          {sections.flatMap((s) =>
            s.items.map((item) => (
              <Link
                key={item.href}
                href={item.href as Parameters<typeof Link>[0]['href']}
                className="block py-1.5 text-sm text-slate-600 hover:text-teal-600 transition-colors"
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
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
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
    <header className="sticky top-0 z-50 w-full bg-white/96 backdrop-blur-md border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/brand/firstscreen-icon.png"
              alt="FirstScreen"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-cover shadow-sm"
            />
            <span className="text-base font-bold text-slate-900 tracking-tight hidden sm:block">
              FirstScreen
            </span>
          </Link>

          {/* Desktop Mega-menu Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {(Object.keys(MEGA_MENUS) as MenuKey[]).map((key) => {
              const menu = MEGA_MENUS[key]
              const isActive = activeMenu === key
              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => openMenu(key)}
                  onMouseLeave={closeMenu}
                >
                  <Link
                    href={menu.href as Parameters<typeof Link>[0]['href']}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'text-teal-700 bg-teal-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    {menu.label}
                    <ChevronDown className={cn('h-3 w-3 opacity-50 transition-transform', isActive && 'rotate-180')} />
                  </Link>
                  {isActive && (
                    <div onMouseEnter={keepOpen} onMouseLeave={closeMenu}>
                      <MegaDropdown menuKey={key} onClose={() => setActiveMenu(null)} />
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">ค้นหาโรค อาการ...</span>
              <kbd className="ml-auto text-[10px] rounded-md bg-slate-200 px-1.5 py-0.5 text-slate-500 font-mono">⌘K</kbd>
            </button>
          </div>

          <SmartSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

          {/* Right side */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile search */}
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(s => !s) }}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:block uppercase text-xs font-semibold">{locale}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="gap-2 cursor-pointer text-sm"
                    onClick={() => switchLocale(lang.code)}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {lang.code === locale && (
                      <span className="ml-auto text-[10px] font-semibold text-teal-600">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ButtonLink
              href="/risk"
              size="sm"
              className="hidden sm:flex bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 rounded-lg"
            >
              เริ่มต้น
            </ButtonLink>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 -mr-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {/* Mobile search opens the global SmartSearch */}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-0.5">
            {(Object.keys(MEGA_MENUS) as MenuKey[]).map((key) => (
              <MobileMenuItem
                key={key}
                menuKey={key}
                onClose={() => setMobileOpen(false)}
              />
            ))}

            {/* Language pills */}
            <div className="pt-3 pb-1 flex flex-wrap gap-1.5 px-3">
              {SUPPORTED_LANGUAGES.slice(0, 4).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { switchLocale(lang.code); setMobileOpen(false) }}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                    lang.code === locale
                      ? 'border-teal-300 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-600'
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.englishName}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <ButtonLink
                href="/risk"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg text-center"
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
