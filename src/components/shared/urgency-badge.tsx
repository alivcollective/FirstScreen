import { cn } from '@/lib/utils'
import type { UrgencyLevel } from '@/lib/symptoms-data'
import { AlertTriangle, Clock, CheckCircle, Phone } from 'lucide-react'

interface UrgencyBadgeProps {
  level: UrgencyLevel
  locale?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const URGENCY_CONFIG = {
  emergency: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
    icon: Phone,
    labelTh: 'ฉุกเฉิน — โทร 1669',
    labelEn: 'Emergency — Call 1669',
    dot: 'bg-red-500',
  },
  urgent: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: AlertTriangle,
    labelTh: 'ควรพบแพทย์เร็วๆ นี้',
    labelEn: 'See a doctor soon',
    dot: 'bg-orange-500',
  },
  soon: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: Clock,
    labelTh: 'ควรนัดพบแพทย์',
    labelEn: 'Schedule a doctor visit',
    dot: 'bg-amber-400',
  },
  routine: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    icon: CheckCircle,
    labelTh: 'ตรวจสุขภาพตามนัด',
    labelEn: 'Routine health check',
    dot: 'bg-teal-500',
  },
}

export function UrgencyBadge({
  level,
  locale = 'th',
  size = 'md',
  showLabel = true,
  className,
}: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[level]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium',
        config.bg,
        config.border,
        config.text,
        size === 'sm' && 'px-2.5 py-1 text-xs',
        size === 'md' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-4 py-2 text-base',
        className
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {showLabel && (
        <span>{locale === 'th' ? config.labelTh : config.labelEn}</span>
      )}
    </div>
  )
}
