import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Scale, Heart, Activity, Ribbon,
  Shield, ChevronRight, ShieldCheck, Globe,
  Microscope, TrendingUp,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getAllGuidelines, getOrgMeta } from '@/data/guidelines'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Guideline Intelligence — แนวทางคัดกรองสุขภาพเปรียบเทียบ | FirstScreen',
  description: 'เปรียบเทียบแนวทางคัดกรองสุขภาพไทยกับ WHO USPSTF NICE ESC ADA NCCN — 9 โรคหลัก พร้อมระดับหลักฐาน',
}

const DISEASE_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  'heart-disease':          { icon: Heart,       color: 'text-red-600',    bg: 'bg-red-50' },
  'type-2-diabetes':        { icon: Activity,     color: 'text-amber-600',  bg: 'bg-amber-50' },
  'hypertension':           { icon: Activity,     color: 'text-orange-600', bg: 'bg-orange-50' },
  'colorectal-cancer':      { icon: Shield,       color: 'text-emerald-600',bg: 'bg-emerald-50' },
  'breast-cancer':          { icon: Ribbon,       color: 'text-pink-600',   bg: 'bg-pink-50' },
  'cervical-cancer':        { icon: Shield,       color: 'text-violet-600', bg: 'bg-violet-50' },
  'lung-cancer':            { icon: Shield,       color: 'text-slate-600',  bg: 'bg-slate-100' },
  'liver-cancer':           { icon: Shield,       color: 'text-orange-700', bg: 'bg-orange-50' },
  'chronic-kidney-disease': { icon: Activity,     color: 'text-blue-600',   bg: 'bg-blue-50' },
}

const ORG_LOGOS = [
  { name: 'Thai MoPH', label: 'สธ. ไทย', color: 'bg-teal-100 text-teal-800' },
  { name: 'WHO', label: 'WHO', color: 'bg-blue-100 text-blue-800' },
  { name: 'USPSTF', label: 'USPSTF', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'NICE', label: 'NICE', color: 'bg-violet-100 text-violet-800' },
  { name: 'ESC', label: 'ESC', color: 'bg-sky-100 text-sky-800' },
  { name: 'ADA', label: 'ADA', color: 'bg-amber-100 text-amber-800' },
  { name: 'NCCN', label: 'NCCN', color: 'bg-purple-100 text-purple-800' },
  { name: 'AHA', label: 'AHA', color: 'bg-red-100 text-red-800' },
]

export default function GuidelinesPage() {
  const guidelines = getAllGuidelines()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 border border-teal-500/30">
                <Scale className="h-6 w-6 text-teal-400" />
              </div>
              <span className="text-sm font-semibold text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                ศูนย์แนวทางการแพทย์
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              แนวทางคัดกรองสุขภาพ<br className="sm:hidden" />เปรียบเทียบ
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              เปรียบเทียบแนวทางของไทยกับมาตรฐานสากล — WHO · USPSTF · NICE · ESC · ADA · NCCN
              <span className="block mt-1 text-slate-400 text-sm">
                ฟีเจอร์เฉพาะที่ไม่มีในแพลตฟอร์มอื่น
              </span>
            </p>

            {/* Org badges */}
            <div className="flex flex-wrap gap-2">
              {ORG_LOGOS.map(org => (
                <span key={org.name} className={cn('rounded-full px-3 py-1.5 text-xs font-bold', org.color)}>
                  {org.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

          {/* Why this matters */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: 'แนวทางไทยก่อน',
                  desc: 'เราแสดงแนวทาง สธ. และ สปสช. เป็นลำดับแรก เพราะนี่คือสิ่งที่คุณเข้าถึงได้จริงในระบบสาธารณสุขไทย',
                  color: 'text-teal-600',
                  bg: 'bg-teal-50',
                },
                {
                  icon: ShieldCheck,
                  title: 'ระดับหลักฐาน',
                  desc: 'ทุกคำแนะนำระบุระดับหลักฐาน (Grade A-C) ช่วยให้คุณประเมินความน่าเชื่อถือได้',
                  color: 'text-violet-600',
                  bg: 'bg-violet-50',
                },
                {
                  icon: TrendingUp,
                  title: 'ความแตกต่างสำคัญ',
                  desc: 'เราไฮไลต์จุดที่แนวทางต่างองค์กรไม่ตรงกัน เพื่อให้คุณตัดสินใจอย่างมีข้อมูล',
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl mb-3', bg)}>
                    <Icon className={cn('h-5 w-5', color)} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Guidelines grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                9 โรคหลัก — แนวทางเปรียบเทียบ
              </h2>
              <span className="text-sm text-slate-400">{guidelines.length} โรค · {guidelines.reduce((a, g) => a + g.recommendations.length, 0)} แนวทาง</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guidelines.map(g => {
                const iconConfig = DISEASE_ICONS[g.diseaseSlug] ?? { icon: Shield, color: 'text-slate-600', bg: 'bg-slate-100' }
                const Icon = iconConfig.icon
                const orgCount = g.recommendations.length
                const thaiOrg = g.recommendations.find(r => ['MOPH', 'NHSO'].includes(r.org))

                return (
                  <Link
                    key={g.diseaseSlug}
                    href={`/guidelines/${g.diseaseSlug}`}
                    className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 hover:border-teal-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconConfig.bg)}>
                        <Icon className={cn('h-5.5 w-5.5', iconConfig.color)} />
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5">
                        {orgCount} แนวทาง
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1">
                      {g.diseaseNameTh}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">{g.diseaseNameEn} · {g.icd10}</p>
                    <p className="text-xs text-slate-600 leading-relaxed flex-1 line-clamp-2">
                      {g.prevalenceTh}
                    </p>

                    {/* Thai guideline preview */}
                    {thaiOrg && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[10px] font-semibold text-teal-600 mb-1">แนวทางไทย:</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{thaiOrg.recommendation}</p>
                      </div>
                    )}

                    {/* Org chips */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {g.primaryOrgs.slice(0, 4).map(org => {
                        const meta = getOrgMeta(org)
                        return (
                          <span key={org} className={cn('rounded-full border px-1.5 py-0.5 text-[9px] font-bold', meta.color)}>
                            {meta.badge}
                          </span>
                        )
                      })}
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-xs text-teal-600 font-medium">
                      ดูเปรียบเทียบ <ChevronRight className="h-3 w-3" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mt-10">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <Microscope className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">สถานะเนื้อหา</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    ข้อมูลแนวทางปฏิบัตินี้อยู่ระหว่างการตรวจสอบโดยแพทย์ผู้เชี่ยวชาญ ก่อนเผยแพร่อย่างเป็นทางการ
                    เนื้อหาเป็นเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ส่วนบุคคล
                    แนวทางอาจมีการปรับปรุงตามบริบทและข้อมูลใหม่
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
