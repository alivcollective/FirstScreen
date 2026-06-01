'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { Users, Activity, BookOpen, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatItem {
  icon: React.ElementType
  valueTh: string
  valueEn: string
  numericTarget: number // for counter animation
  labelTh: string
  labelEn: string
  suffix: string
  color: string
  iconBg: string
}

const STATS: StatItem[] = [
  {
    icon: Users,
    valueTh: '15,000+',
    valueEn: '15,000+',
    numericTarget: 15000,
    labelTh: 'คน ใช้งานแล้ว',
    labelEn: 'Users and growing',
    suffix: '+',
    color: 'text-teal-400',
    iconBg: 'bg-teal-400/10',
  },
  {
    icon: Activity,
    valueTh: '4',
    valueEn: '4',
    numericTarget: 4,
    labelTh: 'เครื่องมือประเมินความเสี่ยง',
    labelEn: 'Risk Assessment Tools',
    suffix: '',
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-400/10',
  },
  {
    icon: BookOpen,
    valueTh: '12',
    valueEn: '12',
    numericTarget: 12,
    labelTh: 'แหล่งข้อมูลทางการแพทย์',
    labelEn: 'Medical Evidence Sources',
    suffix: '+',
    color: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
  },
  {
    icon: ShieldCheck,
    valueTh: '100%',
    valueEn: '100%',
    numericTarget: 100,
    labelTh: 'ตรวจสอบโดยผู้เชี่ยวชาญ',
    labelEn: 'Expert-reviewed content',
    suffix: '%',
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
  },
]

function useCountUp(target: number, duration = 1200, enabled: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let startTime: number | null = null
    let animFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [target, duration, enabled])

  return count
}

function StatCounter({ stat, animate }: { stat: StatItem; animate: boolean }) {
  const locale = useLocale()
  const isTh = locale !== 'en'
  const count = useCountUp(stat.numericTarget, 1200, animate)
  const Icon = stat.icon

  const displayValue = animate
    ? stat.suffix === '%'
      ? `${count}%`
      : stat.suffix === '+'
      ? count >= 1000
        ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K+`
        : `${count}+`
      : `${count}${stat.suffix}`
    : isTh ? stat.valueTh : stat.valueEn

  return (
    <div className="flex flex-col items-center text-center gap-2 px-2">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', stat.iconBg)}>
        <Icon className={cn('h-5 w-5', stat.color)} />
      </div>
      <div className={cn('text-2xl sm:text-3xl font-bold tabular-nums', stat.color)}>
        {displayValue}
      </div>
      <div className="text-xs sm:text-sm text-slate-400 font-medium leading-tight">
        {isTh ? stat.labelTh : stat.labelEn}
      </div>
    </div>
  )
}

export function TrustStats() {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animated])

  return (
    <div className="border-t border-b border-white/8 bg-slate-900/60 backdrop-blur-sm">
      <div
        ref={ref}
        className="mx-auto max-w-5xl px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
      >
        {STATS.map(stat => (
          <StatCounter key={stat.labelEn} stat={stat} animate={animated} />
        ))}
      </div>
    </div>
  )
}
