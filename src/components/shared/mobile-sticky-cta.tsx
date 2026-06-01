'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

interface MobileStickyCTAProps {
  href?: string
  className?: string
}

export function MobileStickyAssessmentCTA({ href = '/risk', className }: MobileStickyCTAProps) {
  const [visible, setVisible] = useState(false)
  const locale = useLocale()
  const isTh = locale !== 'en'

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 md:hidden',
      'bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 safe-area-pb',
      'border-t border-teal-500/30 shadow-2xl shadow-teal-900/30',
      'transform transition-transform duration-300',
      visible ? 'translate-y-0' : 'translate-y-full',
      className
    )}>
      <a
        href={href}
        className="flex items-center justify-center gap-2 text-white font-semibold text-sm"
      >
        {isTh ? 'เริ่มประเมินความเสี่ยงฟรี' : 'Start Free Risk Assessment'}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}
