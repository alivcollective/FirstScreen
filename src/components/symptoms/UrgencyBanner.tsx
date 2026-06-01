import { Phone, Clock, Calendar, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UrgencyLevel } from '@/types/symptom'

const CONFIG: Record<UrgencyLevel, {
  bg: string; border: string; icon: React.ElementType
  title: string; subtitle: string; pulse?: boolean
}> = {
  emergency: {
    bg: 'bg-red-600', border: 'border-red-700', icon: Phone,
    title: '🔴 ฉุกเฉิน — โทร 1669 หรือไปห้องฉุกเฉินทันที',
    subtitle: 'อาการของคุณอาจต้องการการดูแลฉุกเฉิน อย่ารอช้า',
    pulse: true,
  },
  urgent: {
    bg: 'bg-orange-500', border: 'border-orange-600', icon: Clock,
    title: '🟠 ควรพบแพทย์ภายใน 24–48 ชั่วโมง',
    subtitle: 'อาการค่อนข้างรุนแรง ควรรีบพบแพทย์โดยเร็ว',
  },
  appointment: {
    bg: 'bg-amber-400', border: 'border-amber-500', icon: Calendar,
    title: '🟡 นัดพบแพทย์ภายใน 1–2 สัปดาห์',
    subtitle: 'อาการควรได้รับการประเมินโดยแพทย์',
  },
  selfcare: {
    bg: 'bg-emerald-500', border: 'border-emerald-600', icon: Heart,
    title: '🟢 ดูแลตัวเองได้เบื้องต้น',
    subtitle: 'อาการเบา — พักผ่อน ดูแลตัวเอง และเฝ้าระวัง',
  },
}

interface UrgencyBannerProps {
  level: UrgencyLevel
  className?: string
}

export function UrgencyBanner({ level, className }: UrgencyBannerProps) {
  const cfg = CONFIG[level]
  const Icon = cfg.icon

  return (
    <div className={cn(
      'rounded-2xl border-2 text-white p-5',
      cfg.bg, cfg.border,
      cfg.pulse && 'animate-pulse',
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 shrink-0">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className={cn(
            'font-bold mb-1 leading-snug',
            level === 'emergency' ? 'text-lg' : 'text-base'
          )}>
            {cfg.title}
          </h2>
          <p className="text-sm text-white/90">{cfg.subtitle}</p>

          {level === 'emergency' && (
            <a
              href="tel:1669"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white text-red-700 font-bold px-5 py-2.5 text-sm hover:bg-red-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              โทร 1669 — ฉุกเฉิน
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
