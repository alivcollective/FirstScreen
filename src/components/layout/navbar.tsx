'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import { Menu, X, Globe, ChevronDown, Heart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { SUPPORTED_LANGUAGES } from '@/lib/constants'
import { ButtonLink } from '@/components/ui/button-link'
import { DiseaseSearchBar } from '@/components/shared/disease-search-bar'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const navLinks = [
    { labelKey: 'nav.risk',      href: '/risk' },
    { labelKey: 'nav.screening', href: '/screening' },
    { labelKey: 'nav.diseases',  href: '/diseases' },
    { labelKey: 'nav.providers', href: '/providers' },
    { labelKey: 'nav.academy',   href: '/academy', badge: true },
  ] as const

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
    if (typeof window !== 'undefined') {
      localStorage.setItem('health-compass-locale', newLocale)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/96 backdrop-blur-md border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm">
              <Heart className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Health Compass
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {t(link.labelKey)}
                {'badge' in link && link.badge && (
                  <Badge className="text-[9px] px-1 py-0 h-4 bg-teal-100 text-teal-700 border-0 hover:bg-teal-100">
                    {t('common.new')}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop search — expands on click */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            {searchOpen ? (
              <DiseaseSearchBar
                className="w-full"
                onClose={() => setSearchOpen(false)}
              />
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="ค้นหาโรค"
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">ค้นหาโรค...</span>
                <kbd className="ml-auto text-[10px] rounded bg-slate-200 px-1.5 py-0.5 text-slate-500">⌘K</kbd>
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Mobile search icon */}
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(s => !s) }}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="ค้นหา"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Language Selector */}
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

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-slate-600 text-sm font-medium"
            >
              {t('common.signIn')}
            </Button>

            <ButtonLink
              href="/risk"
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 rounded-lg"
            >
              {t('common.getStarted')}
            </ButtonLink>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 -mr-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar — slides down */}
      {searchOpen && !mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3">
          <DiseaseSearchBar onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.labelKey)}
                {'badge' in link && link.badge && (
                  <Badge className="text-[9px] px-1 h-4 bg-teal-100 text-teal-700 border-0">
                    {t('common.new')}
                  </Badge>
                )}
              </Link>
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

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-sm">
                {t('common.signIn')}
              </Button>
              <ButtonLink
                href="/risk"
                size="sm"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg text-center"
              >
                {t('common.getStarted')}
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
