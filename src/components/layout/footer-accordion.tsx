'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const SECTIONS = [
  {
    title: 'แพลตฟอร์ม',
    links: [
      { label: 'ประเมินความเสี่ยง', href: '/risk' },
      { label: 'ตรวจอาการ', href: '/symptoms' },
      { label: 'คลังข้อมูลโรค', href: '/diseases' },
      { label: 'แผนคัดกรอง', href: '/screening' },
      { label: 'ค้นหาโรงพยาบาล', href: '/providers' },
      { label: 'แนวทางการแพทย์', href: '/guidelines' },
    ],
  },
  {
    title: 'บริษัท',
    links: [
      { label: 'เกี่ยวกับเรา', href: '/about' },
      { label: 'ทีมแพทย์', href: '/medical-advisors' },
      { label: 'วิธีการ', href: '/methodology' },
      { label: 'ความน่าเชื่อถือ', href: '/trust' },
    ],
  },
  {
    title: 'กฎหมาย',
    links: [
      { label: 'นโยบายความเป็นส่วนตัว', href: '/trust' },
      { label: 'ข้อกำหนดการใช้งาน', href: '/trust' },
      { label: 'PDPA', href: '/trust' },
      { label: 'ข้อจำกัดทางการแพทย์', href: '/trust' },
    ],
  },
] as const

function AccordionSection({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 text-slate-500 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="pb-3 flex flex-col gap-2 pl-1">
          {links.map(l => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function FooterAccordion() {
  return (
    <div>
      {SECTIONS.map(s => (
        <AccordionSection key={s.title} title={s.title} links={s.links} />
      ))}
    </div>
  )
}
