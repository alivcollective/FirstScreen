'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Floating pill CTA — smaller, blur background, doesn't block content
export function MobileStickyAssessmentCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <a
        href="/risk"
        className="flex items-center gap-2 rounded-full bg-teal-500/95 backdrop-blur-md border border-teal-400/30 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-teal-900/30 hover:bg-teal-400 transition-colors"
      >
        เริ่มประเมินฟรี
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}
