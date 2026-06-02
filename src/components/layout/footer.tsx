import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { FooterAccordion } from './footer-accordion'

// Footer — compact version, accordion sections collapse by default (~60% shorter)
export async function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Disclaimer strip — minimal */}
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-3">
          <p className="text-[11px] text-slate-500 text-center">
            FirstScreen ให้ข้อมูลเพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค ·{' '}
            <Link href="/trust" className="underline hover:text-slate-300 transition-colors">
              ดูข้อมูลเพิ่มเติม
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {/* Brand row */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/firstscreen-icon.png"
              alt="FirstScreen"
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg object-cover"
            />
            <span className="text-base font-bold text-white">FirstScreen</span>
          </Link>
          <div className="flex gap-1.5 text-xs text-slate-500">
            <span>ฟรี · PDPA · ไม่ขายข้อมูล</span>
          </div>
        </div>

        {/* Accordion link groups */}
        <FooterAccordion />

        {/* Bottom */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-600">© 2026 FirstScreen · Thailand</p>
          <div className="flex gap-1">
            {['TH', 'EN', 'CN', 'JP', 'KR'].map((code) => (
              <span key={code} className="text-[10px] font-mono text-slate-600">{code}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
