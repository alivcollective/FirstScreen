import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Scale, ChevronRight, ArrowLeft, Activity,
  BookOpen, ShieldCheck, Microscope,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { GuidelineTable, KeyDifferences, GuidelineDisclaimer } from '@/components/guidelines/GuidelineTable'
import { RelatedContent } from '@/components/shared/related-content'
import { Newsletter } from '@/components/shared/newsletter'
import { getGuideline, getAllGuidelines, GUIDELINE_SLUGS, getOrgMeta } from '@/data/guidelines'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/medical-schema'
import { cn } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://firstscreen.health'

interface Props {
  params: Promise<{ disease: string; locale: string }>
}

export function generateStaticParams() {
  return GUIDELINE_SLUGS.map(disease => ({ disease }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { disease } = await params
  const g = getGuideline(disease)
  if (!g) return { title: 'ไม่พบแนวทาง | FirstScreen' }
  return {
    title: `แนวทางคัดกรอง ${g.diseaseNameTh} — ไทย vs WHO vs USPSTF | FirstScreen`,
    description: `เปรียบเทียบแนวทาง ${g.diseaseNameTh} (${g.diseaseNameEn}) จาก ${g.recommendations.length} องค์กรสากล พร้อมระดับหลักฐาน`,
    keywords: [g.diseaseNameTh, g.diseaseNameEn, 'แนวทางคัดกรอง', 'screening guideline', g.icd10],
    openGraph: {
      title: `แนวทางคัดกรอง ${g.diseaseNameTh} | FirstScreen`,
      description: `ไทย vs WHO vs USPSTF vs NICE — ${g.recommendations.length} แนวทาง`,
      type: 'article',
    },
  }
}

// ── Org summary row ───────────────────────────────────────────

function OrgSummaryRow({ org, label, summary }: { org: string; label: string; summary: string }) {
  const meta = getOrgMeta(org as Parameters<typeof getOrgMeta>[0])
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
      <span className={cn('shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold mt-0.5', meta.color)}>
        {meta.badge}
      </span>
      <div>
        <p className="text-xs font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{summary}</p>
      </div>
    </div>
  )
}

export default async function GuidelineDiseasePage({ params }: Props) {
  const { disease, locale } = await params
  const g = getGuideline(disease)
  if (!g) return notFound()

  const allGuidelines = getAllGuidelines()

  const faqSchema = g.faqsTh.map(f => ({
    question: f.q,
    answer: f.a,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Structured data */}
      {faqSchema.length > 0 && <FAQSchema faqs={faqSchema} />}
      <BreadcrumbSchema
        baseUrl={BASE_URL}
        items={[
          { name: 'หน้าหลัก', url: '/' },
          { name: 'ศูนย์แนวทางการแพทย์', url: '/guidelines' },
          { name: g.diseaseNameTh, url: `/guidelines/${disease}` },
        ]}
      />

      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 pb-0">
          {/* Breadcrumb */}
          <div className="border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 text-xs text-slate-400">
              <Link href="/guidelines" className="hover:text-teal-400 flex items-center gap-1 transition-colors">
                <Scale className="h-3 w-3" /> ศูนย์แนวทางการแพทย์
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-300">{g.diseaseNameTh}</span>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/30">
                <Scale className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-teal-300">เปรียบเทียบแนวทาง</span>
                <p className="text-[10px] text-slate-500">{g.recommendations.length} องค์กร · ICD-10: {g.icd10}</p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              แนวทางคัดกรอง{g.diseaseNameTh}
            </h1>
            <p className="text-slate-400 text-sm mb-4">
              {g.diseaseNameEn} — เปรียบเทียบ {g.recommendations.length} แนวทางจากองค์กรชั้นนำ
            </p>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {g.thaiContext}
            </p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-2.5">
                <p className="text-lg font-bold text-white">{g.recommendations.length}</p>
                <p className="text-xs text-white/60">แนวทางเปรียบเทียบ</p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-2.5">
                <p className="text-sm font-bold text-teal-300">{g.prevalenceTh}</p>
                <p className="text-xs text-white/60">ความชุกในไทย</p>
              </div>
            </div>
          </div>

          {/* Org strip */}
          <div className="border-t border-white/10 bg-slate-800/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2">
              {g.recommendations.map(rec => {
                const meta = getOrgMeta(rec.org)
                const isThai = ['MOPH', 'NHSO', 'RCPT'].includes(rec.org)
                return (
                  <span key={rec.org} className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-bold',
                    isThai ? 'bg-teal-900/50 border-teal-500/50 text-teal-300' : meta.color
                  )}>
                    {meta.badge}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="lg:grid lg:grid-cols-4 lg:gap-10">

            {/* Main */}
            <div className="lg:col-span-3 space-y-10">

              {/* Quick summary */}
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  สรุปแนวทางแต่ละองค์กร
                </h2>
                <div className="space-y-2 mb-6">
                  {g.recommendations.map(rec => (
                    <OrgSummaryRow
                      key={rec.org}
                      org={rec.org}
                      label={`${rec.startingAge} · ${rec.frequency}`}
                      summary={rec.recommendation.length > 100 ? rec.recommendation.slice(0, 100) + '...' : rec.recommendation}
                    />
                  ))}
                </div>
              </section>

              {/* Key differences */}
              <section>
                <KeyDifferences differences={g.keyDifferences} />
              </section>

              {/* Full comparison table */}
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-teal-600" />
                  ตารางเปรียบเทียบแนวทางฉบับสมบูรณ์
                </h2>
                <GuidelineTable guideline={g} showThaiFirst />
              </section>

              {/* Screening tests */}
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-teal-600" />
                  การตรวจที่ใช้
                </h2>
                <div className="flex flex-wrap gap-2">
                  {g.screeningTests.map(test => (
                    <span key={test} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      {test}
                    </span>
                  ))}
                </div>
              </section>

              {/* FAQs */}
              {g.faqsTh.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-teal-600" />
                    คำถามที่พบบ่อย
                  </h2>
                  <div className="space-y-3">
                    {g.faqsTh.map((faq, i) => (
                      <details
                        key={i}
                        className="rounded-2xl border border-slate-200 bg-white group"
                        open={i === 0}
                      >
                        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-800 flex items-center justify-between list-none">
                          {faq.q}
                          <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                        </summary>
                        <div className="px-5 pb-4">
                          <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Disclaimer */}
              <GuidelineDisclaimer />

              {/* Newsletter */}
              <Newsletter />
            </div>

            {/* Sidebar */}
            <aside className="mt-10 lg:mt-0 space-y-6">

              {/* CTA */}
              <div className="rounded-2xl bg-teal-600 p-5 text-white">
                <Activity className="h-6 w-6 mb-3 text-teal-200" />
                <h3 className="text-sm font-bold mb-2">ประเมินความเสี่ยงของคุณ</h3>
                <p className="text-xs text-teal-100 mb-4">ใช้เครื่องมือประเมินที่อิงแนวทางเหล่านี้</p>
                <Link href="/risk" className="flex items-center justify-center gap-1.5 rounded-xl bg-white text-teal-700 px-4 py-2.5 text-sm font-semibold hover:bg-teal-50 transition-colors">
                  เริ่มประเมิน <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Screening planner */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">แผนคัดกรองส่วนตัว</h3>
                <p className="text-xs text-slate-500 mb-3">รับแผนคัดกรองที่ปรับตามอายุ เพศ และปัจจัยเสี่ยงของคุณ</p>
                <Link href="/screening" className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-200 text-teal-700 px-4 py-2.5 text-sm font-medium hover:bg-teal-50 transition-colors">
                  ดูแผนของฉัน <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Related content */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <RelatedContent diseaseSlug={disease} />
              </div>

              {/* Browse other guidelines */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 mb-3">แนวทางโรคอื่น</h3>
                <div className="space-y-1.5">
                  {allGuidelines.filter(gl => gl.diseaseSlug !== disease).slice(0, 6).map(gl => (
                    <Link
                      key={gl.diseaseSlug}
                      href={`/guidelines/${gl.diseaseSlug}`}
                      className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-teal-200 hover:text-teal-700 transition-colors"
                    >
                      <Scale className="h-3 w-3 text-teal-500" />
                      {gl.diseaseNameTh}
                      <ChevronRight className="h-3 w-3 ml-auto text-slate-300" />
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
