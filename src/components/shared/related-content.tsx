import Link from 'next/link'
import { Activity, BookOpen, Calendar, Stethoscope, ChevronRight, Heart, Brain, Ribbon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────

type ContentType = 'disease' | 'assessment' | 'article' | 'screening' | 'symptom'

interface RelatedItem {
  type: ContentType
  title: string
  subtitle?: string
  href: string
}

// ── Content type config ───────────────────────────────────────

const TYPE_CONFIG: Record<ContentType, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
}> = {
  disease: { label: 'โรค', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
  assessment: { label: 'ประเมินความเสี่ยง', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
  article: { label: 'บทความ', icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
  screening: { label: 'คัดกรอง', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  symptom: { label: 'อาการ', icon: Stethoscope, color: 'text-sky-600', bg: 'bg-sky-50' },
}

// ── Disease-to-related mapping ────────────────────────────────

const DISEASE_RELATED: Record<string, RelatedItem[]> = {
  'heart-disease': [
    { type: 'assessment', title: 'ประเมินความเสี่ยงหัวใจ', subtitle: 'Framingham CVD Risk', href: '/risk#cvd' },
    { type: 'screening', title: 'แผนตรวจคัดกรองหัวใจ', subtitle: 'ECG, Echo, Lipid panel', href: '/screening#heart' },
    { type: 'disease', title: 'ความดันโลหิตสูง', subtitle: 'ปัจจัยเสี่ยงสำคัญ', href: '/diseases/hypertension' },
    { type: 'disease', title: 'โรคหลอดเลือดสมอง', subtitle: 'Stroke — มักเกิดร่วม', href: '/diseases/stroke' },
  ],
  'stroke': [
    { type: 'assessment', title: 'ประเมินความเสี่ยงหัวใจ', subtitle: 'Framingham CVD Risk', href: '/risk#cvd' },
    { type: 'symptom', title: 'ตรวจอาการ FAST', subtitle: 'สัญญาณ Stroke ฉุกเฉิน', href: '/symptoms' },
    { type: 'disease', title: 'ความดันโลหิตสูง', subtitle: 'สาเหตุหลักของ Stroke', href: '/diseases/hypertension' },
    { type: 'disease', title: 'โรคหัวใจ', subtitle: 'หัวใจเต้นผิดจังหวะ → Stroke', href: '/diseases/heart-disease' },
  ],
  'hypertension': [
    { type: 'assessment', title: 'ประเมินความเสี่ยงหัวใจ', subtitle: 'Framingham CVD Risk', href: '/risk#cvd' },
    { type: 'screening', title: 'แผนตรวจคัดกรอง', subtitle: 'วัดความดันทุก 6 เดือน', href: '/screening' },
    { type: 'disease', title: 'โรคหัวใจ', subtitle: 'ภาวะแทรกซ้อน', href: '/diseases/heart-disease' },
    { type: 'assessment', title: 'ประเมินความเสี่ยงเบาหวาน', subtitle: 'FINDRISC', href: '/risk#diabetes' },
  ],
  'type-2-diabetes': [
    { type: 'assessment', title: 'ประเมินความเสี่ยงเบาหวาน', subtitle: 'FINDRISC — ปรับสำหรับเอเชีย', href: '/risk#diabetes' },
    { type: 'screening', title: 'ตรวจน้ำตาลในเลือด', subtitle: 'FBS, HbA1c', href: '/screening' },
    { type: 'disease', title: 'ความดันโลหิตสูง', subtitle: 'Metabolic syndrome', href: '/diseases/hypertension' },
    { type: 'assessment', title: 'ประเมินความเสี่ยงหัวใจ', subtitle: 'เบาหวาน เพิ่มความเสี่ยง CVD', href: '/risk#cvd' },
  ],
  'breast-cancer': [
    { type: 'assessment', title: 'ประเมินความเสี่ยงมะเร็ง', subtitle: '5 ชนิด รวม Breast', href: '/risk#cancer' },
    { type: 'screening', title: 'Mammogram คัดกรอง', subtitle: 'ผู้หญิง 40+ ปี', href: '/screening' },
    { type: 'disease', title: 'มะเร็งลำไส้ใหญ่', subtitle: 'มะเร็งที่พบบ่อยอีกชนิด', href: '/diseases/colorectal-cancer' },
    { type: 'symptom', title: 'ตรวจอาการ', subtitle: 'คลำพบก้อน ผิดปกติ', href: '/symptoms' },
  ],
  'lung-cancer': [
    { type: 'assessment', title: 'ประเมินความเสี่ยงมะเร็ง', subtitle: 'NLST criteria', href: '/risk#cancer' },
    { type: 'screening', title: 'Low-dose CT Scan', subtitle: 'ผู้สูบบุหรี่ 50+ ปี', href: '/screening' },
    { type: 'symptom', title: 'ตรวจอาการ', subtitle: 'ไอเรื้อรัง เสมหะมีเลือด', href: '/symptoms' },
    { type: 'disease', title: 'มะเร็งลำไส้ใหญ่', subtitle: 'มะเร็งที่พบบ่อยในไทย', href: '/diseases/colorectal-cancer' },
  ],
  'colorectal-cancer': [
    { type: 'assessment', title: 'ประเมินความเสี่ยงมะเร็ง', subtitle: 'Colorectal risk factors', href: '/risk#cancer' },
    { type: 'screening', title: 'Colonoscopy', subtitle: 'ทุกคน 45+ ปี', href: '/screening' },
    { type: 'disease', title: 'มะเร็งเต้านม', subtitle: 'มะเร็งที่พบบ่อยในไทย', href: '/diseases/breast-cancer' },
    { type: 'symptom', title: 'ตรวจอาการ', subtitle: 'เลือดปนมูก ถ่ายผิดปกติ', href: '/symptoms' },
  ],
}

// ── Default related for unknown diseases ─────────────────────

const DEFAULT_RELATED: RelatedItem[] = [
  { type: 'assessment', title: 'ประเมินความเสี่ยง', subtitle: 'Framingham, FINDRISC, Cancer Risk', href: '/risk' },
  { type: 'screening', title: 'แผนตรวจคัดกรอง', subtitle: 'ปรับตามอายุและเพศ', href: '/screening' },
  { type: 'symptom', title: 'ตรวจอาการ', subtitle: 'Symptom Checker 7 ขั้นตอน', href: '/symptoms' },
  { type: 'article', title: 'Health Library', subtitle: 'บทความสุขภาพอิงหลักฐาน', href: '/library' },
]

// ── Related Content Component ─────────────────────────────────

interface RelatedContentProps {
  diseaseSlug?: string
  items?: RelatedItem[]
  title?: string
  className?: string
}

export function RelatedContent({
  diseaseSlug,
  items,
  title = 'เนื้อหาที่เกี่ยวข้อง',
  className,
}: RelatedContentProps) {
  const resolvedItems = items ??
    (diseaseSlug ? DISEASE_RELATED[diseaseSlug] : null) ??
    DEFAULT_RELATED

  return (
    <div className={cn('', className)}>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {resolvedItems.map((item, i) => {
          const cfg = TYPE_CONFIG[item.type]
          const Icon = cfg.icon
          return (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 hover:border-teal-200 hover:bg-teal-50/30 transition-colors group"
            >
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', cfg.bg)}>
                <Icon className={cn('h-4 w-4', cfg.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={cn('hidden sm:block text-[10px] font-medium rounded-full px-2 py-0.5', cfg.bg, cfg.color)}>
                  {cfg.label}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
