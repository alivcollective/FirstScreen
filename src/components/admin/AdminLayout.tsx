'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Activity, Stethoscope, MapPin,
  Users, BookOpen, CheckSquare, Settings, ChevronLeft,
  ChevronRight, Menu, X, Shield, Dumbbell, AlignLeft,
  LogOut, Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_SECTIONS = [
  {
    label: 'ภาพรวม',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/review-queue', icon: CheckSquare, label: 'คิวตรวจสอบ', badge: 'review' },
    ],
  },
  {
    label: 'ฐานความรู้',
    items: [
      { href: '/admin/articles', icon: FileText, label: 'บทความ' },
      { href: '/admin/conditions', icon: Activity, label: 'โรคและภาวะ' },
      { href: '/admin/symptoms', icon: Stethoscope, label: 'อาการ' },
      { href: '/admin/body-regions', icon: MapPin, label: 'ส่วนร่างกาย' },
      { href: '/admin/athlete-conditions', icon: Dumbbell, label: 'การบาดเจ็บนักกีฬา' },
    ],
  },
  {
    label: 'เนื้อหา',
    items: [
      { href: '/admin/references', icon: BookOpen, label: 'แหล่งอ้างอิง' },
      { href: '/admin/authors', icon: Users, label: 'ผู้เขียน / แพทย์' },
    ],
  },
  {
    label: 'ระบบ',
    items: [
      { href: '/admin/settings', icon: Settings, label: 'ตั้งค่า' },
    ],
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const sidebar = (
    <div className={cn(
      'flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-200',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-400" />
            <span className="text-sm font-bold text-white">FirstScreen</span>
            <span className="text-xs text-slate-500 border border-slate-700 rounded px-1">Admin</span>
          </div>
        )}
        {collapsed && <Shield className="h-5 w-5 text-teal-400 mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1 text-slate-500 hover:text-white rounded transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-1">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                      active
                        ? 'bg-teal-600/20 text-teal-300'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800',
                      collapsed && 'justify-center px-0'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-500 hover:text-white transition-colors',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'กลับเว็บ' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>กลับเว็บไซต์</span>}
        </Link>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        {sidebar}
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-60">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 h-14 px-4 bg-slate-900 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-semibold text-white truncate flex-1">
            {title ?? 'Admin'}
          </h1>
          <div className="flex items-center gap-1">
            <Link href="/admin/articles/new"
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <AlignLeft className="h-3.5 w-3.5" />
              บทความใหม่
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  )
}
