import { AlertCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MedicalDisclaimerProps {
  variant?: 'inline' | 'banner' | 'emergency'
  className?: string
  showEmergencyNumber?: boolean
  locale?: string
}

export function MedicalDisclaimer({
  variant = 'inline',
  className,
  showEmergencyNumber = false,
  locale = 'th',
}: MedicalDisclaimerProps) {
  const isEmergency = variant === 'emergency'

  if (isEmergency) {
    return (
      <div className={cn('rounded-2xl bg-red-50 border-2 border-red-400 p-5', className)}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 shrink-0">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-900 mb-1">
              {locale === 'th' ? 'ภาวะฉุกเฉิน — โทรขอความช่วยเหลือทันที' : 'Emergency — Seek Help Immediately'}
            </h3>
            <p className="text-sm text-red-800 mb-3">
              {locale === 'th'
                ? 'อาการที่คุณบอกอาจบ่งชี้ถึงภาวะฉุกเฉินทางการแพทย์ ซึ่งต้องได้รับการประเมินโดยแพทย์ทันที อย่ารอดูอาการ'
                : 'Your symptoms may indicate a medical emergency requiring immediate evaluation. Do not wait.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:1669"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                โทร 1669 (EMS ฉุกเฉิน)
              </a>
              <span className="inline-flex items-center text-xs text-red-700 font-medium">
                หรือไปห้องฉุกเฉินที่ใกล้ที่สุดทันที
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className={cn('rounded-xl bg-amber-50 border border-amber-200 p-4', className)}>
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-0.5">
              {locale === 'th' ? 'ข้อมูลเพื่อการศึกษาเท่านั้น' : 'Educational Information Only'}
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              {locale === 'th'
                ? 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาและการนำทางสุขภาพเท่านั้น ไม่ใช่การวินิจฉัยโรคหรือทดแทนคำแนะนำจากแพทย์ หากมีอาการรุนแรงหรือฉุกเฉิน ควรโทรสายด่วนฉุกเฉินหรือไปโรงพยาบาลทันที'
                : 'This information is for educational and health navigation purposes only. It is not a diagnosis and does not replace medical advice. For severe or emergency symptoms, call emergency services or go to hospital immediately.'}
            </p>
            {showEmergencyNumber && (
              <p className="text-xs font-semibold text-amber-900 mt-1.5">
                {locale === 'th' ? 'สายด่วนฉุกเฉิน (EMS): ' : 'Emergency: '}
                <a href="tel:1669" className="underline">1669</a>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <p className={cn('text-xs text-slate-400 leading-relaxed', className)}>
      {locale === 'th'
        ? 'ข้อมูลนี้เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค ควรปรึกษาแพทย์'
        : 'Educational information only. Not a diagnosis. Consult a doctor.'}
    </p>
  )
}
