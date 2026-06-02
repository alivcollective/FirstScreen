import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Shield, Calendar, ChevronRight, AlertTriangle, CheckCircle2,
  Microscope, Activity, BookOpen, Users, Heart, Phone, ExternalLink,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button-link'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

// Data sources
import { getRichDisease, getAllRichSlugs } from '@/data/diseases/index'
import { getDiseaseData, getAllDiseaseSlugs } from '@/lib/disease-data'
import { CATEGORY_META } from '@/types/disease'

// Section components (rich disease only)
import { SymptomsSection } from '@/components/disease/symptoms-section'
import { RiskFactorsSection } from '@/components/disease/risk-factors-section'
import { ScreeningSection } from '@/components/disease/screening-section'
import { TreatmentSection } from '@/components/disease/treatment-section'
import { PreventionSection } from '@/components/disease/prevention-section'
import { MedicalReview } from '@/components/shared/medical-review'
import { RelatedContent } from '@/components/shared/related-content'
import { Newsletter } from '@/components/shared/newsletter'

// SEO / JSON-LD
import {
  MedicalConditionSchema,
  FAQSchema,
  BreadcrumbSchema,
} from '@/components/seo/medical-schema'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://healthcompass.th'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

// All possible slugs = rich + legacy
export async function generateStaticParams() {
  const richSlugs = getAllRichSlugs().map(slug => ({ slug }))
  const legacySlugs = getAllDiseaseSlugs()
    .filter(s => !getAllRichSlugs().includes(s))
    .map(slug => ({ slug }))
  return [...richSlugs, ...legacySlugs]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const rich = getRichDisease(slug)
  if (rich) {
    const description = rich.shortDescriptionTh
    const keywords = [
      rich.nameTh_short, rich.nameEn, rich.icd10,
      ...(rich.keywords ?? []),
      'อาการ', 'สาเหตุ', 'การรักษา', 'การป้องกัน',
    ]
    return {
      title: `${rich.nameTh_short} — อาการ สาเหตุ การรักษา | Health Compass`,
      description,
      keywords,
      alternates: {
        canonical: `${BASE_URL}/diseases/${slug}`,
        languages: {
          'th': `${BASE_URL}/diseases/${slug}`,
          'en': `${BASE_URL}/en/diseases/${slug}`,
        },
      },
      openGraph: {
        title: `${rich.nameTh_short} | Health Compass`,
        description,
        type: 'article',
        url: `${BASE_URL}/diseases/${slug}`,
        siteName: 'Health Compass',
      },
      twitter: {
        card: 'summary',
        title: `${rich.nameTh_short} | Health Compass`,
        description,
      },
    }
  }
  const legacy = getDiseaseData(slug)
  if (legacy) {
    return {
      title: `${legacy.nameTh} | Health Compass`,
      description: legacy.overview.th.slice(0, 160),
      alternates: { canonical: `${BASE_URL}/diseases/${slug}` },
    }
  }
  return { title: 'ไม่พบข้อมูล | Health Compass' }
}

// ============================================================
// TABLE OF CONTENTS
// ============================================================

const TOC_SECTIONS = [
  { id: 'overview', labelTh: 'ภาพรวม' },
  { id: 'symptoms', labelTh: 'อาการ' },
  { id: 'causes', labelTh: 'สาเหตุ & ปัจจัยเสี่ยง' },
  { id: 'screening', labelTh: 'การตรวจวินิจฉัย' },
  { id: 'treatment', labelTh: 'การรักษา' },
  { id: 'prevention', labelTh: 'การป้องกัน' },
  { id: 'when-to-see', labelTh: 'เมื่อไหร่ควรพบแพทย์' },
  { id: 'faq', labelTh: 'คำถามที่พบบ่อย' },
  { id: 'references', labelTh: 'แหล่งอ้างอิง' },
]

function TableOfContents() {
  return (
    <nav className="space-y-0.5">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-3">สารบัญ</p>
      {TOC_SECTIONS.map(sec => (
        <a key={sec.id} href={`#${sec.id}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors group">
          <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          {sec.labelTh}
        </a>
      ))}
    </nav>
  )
}

function SidebarCTAs({ slug }: { slug: string }) {
  return (
    <div className="space-y-3 mt-6">
      <ButtonLink href="/risk" className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl py-3 block text-center">
        ประเมินความเสี่ยงของคุณ
      </ButtonLink>
      <ButtonLink href="/providers" variant="outline" className="w-full text-xs font-semibold rounded-xl py-3 block text-center border border-slate-300 text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">
        ค้นหาโรงพยาบาลที่รักษา
      </ButtonLink>
      <ButtonLink href="/screening" variant="outline" className="w-full text-xs font-semibold rounded-xl py-3 block text-center border border-slate-300 text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors">
        ดูแผนตรวจคัดกรอง
      </ButtonLink>
    </div>
  )
}

function SectionWrapper({ id, title, icon: Icon, children }: {
  id: string; title: string; icon: React.ElementType; children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
          <Icon className="h-4.5 w-4.5 text-teal-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// ============================================================
// RICH DISEASE PAGE
// ============================================================

async function RichDiseasePage({ params }: Props) {
  const { slug, locale } = await params
  const disease = getRichDisease(slug)
  if (!disease) return notFound()

  const catMeta = CATEGORY_META[disease.category]
  const riskColors = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    very_high: 'bg-red-50 text-red-700 border-red-200',
  }
  const riskLabels = { low: 'ความเสี่ยงต่ำ', moderate: 'ความเสี่ยงปานกลาง', high: 'ความเสี่ยงสูง', very_high: 'ความเสี่ยงสูงมาก' }

  return (
    <div className="min-h-screen flex flex-col">
      {/* JSON-LD Structured Data */}
      <MedicalConditionSchema disease={disease} baseUrl={BASE_URL} />
      {disease.faqsTh?.length > 0 && (
        <FAQSchema faqs={disease.faqsTh.map(f => ({ question: f.questionTh, answer: f.answerTh }))} />
      )}
      <BreadcrumbSchema
        baseUrl={BASE_URL}
        items={[
          { name: 'หน้าหลัก', url: '/' },
          { name: 'คลังข้อมูลโรค', url: '/diseases' },
          { name: disease.nameTh_short, url: `/diseases/${disease.slug}` },
        ]}
      />

      <Navbar />
      <main className="flex-1 bg-white">

        {/* HERO */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800">
          {/* Breadcrumb */}
          <div className="border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-teal-400">หน้าหลัก</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/diseases" className="hover:text-teal-400">คลังข้อมูลโรค</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-300 font-medium">{disease.nameTh_short}</span>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', catMeta.bg, catMeta.color, catMeta.border)}>
                {catMeta.labelTh}
              </span>
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', riskColors[disease.riskLevel])}>
                {riskLabels[disease.riskLevel]}
              </span>
              <span className="text-xs font-mono text-slate-400 border border-slate-600 rounded-full px-3 py-1">
                ICD-10: {disease.icd10}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
              {disease.nameTh}
            </h1>
            <p className="text-slate-400 text-sm mb-5">{disease.nameEn}</p>

            {/* Reviewed badge */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                <Shield className="h-3.5 w-3.5 text-teal-400" />
                <span className="text-xs text-slate-300">ตรวจสอบโดยทีมแพทย์</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">ล่าสุด: {disease.lastReviewed}</span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="border-t border-white/10 bg-teal-900/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-teal-300 uppercase tracking-wide mb-1">ความชุกในไทย</p>
                  <p className="text-sm font-bold text-white">{disease.stats.prevalenceThailand}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-teal-300 uppercase tracking-wide mb-1">กลุ่มเสี่ยงหลัก</p>
                  <p className="text-sm font-bold text-white">{disease.stats.primaryRiskGroupTh}</p>
                </div>
                {disease.stats.survivalRate && (
                  <div>
                    <p className="text-[10px] font-semibold text-teal-300 uppercase tracking-wide mb-1">อัตราการรอดชีวิต</p>
                    <p className="text-sm font-bold text-white">{disease.stats.survivalRate}</p>
                  </div>
                )}
                {disease.stats.newCasesPerYearTh && (
                  <div>
                    <p className="text-[10px] font-semibold text-teal-300 uppercase tracking-wide mb-1">รายใหม่ต่อปี</p>
                    <p className="text-sm font-bold text-white">{disease.stats.newCasesPerYearTh}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="lg:grid lg:grid-cols-4 lg:gap-10">

            {/* SIDEBAR — desktop sticky */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <TableOfContents />
                  <SidebarCTAs slug={slug} />
                </div>

                {/* Related content — smart internal linking */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <RelatedContent diseaseSlug={slug} />
                </div>

                {/* Trust badge */}
                <MedicalReview
                  reviewedBy={disease.reviewedBy}
                  reviewDate={disease.lastReviewed}
                  isPending={disease.reviewedBy?.includes('รอ')}
                  referenceCount={disease.references?.length}
                  compact
                />
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-3 space-y-14">

              {/* Mobile TOC accordion */}
              <details className="lg:hidden rounded-xl border border-slate-200 bg-slate-50">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-teal-600" /> สารบัญ
                </summary>
                <div className="px-4 pb-4">
                  <TableOfContents />
                </div>
              </details>

              {/* Overview */}
              <SectionWrapper id="overview" title="ภาพรวม" icon={BookOpen}>
                <div className="prose prose-slate max-w-none text-sm leading-relaxed">
                  {disease.overviewTh.split('\n\n').map((para, i) => (
                    <p key={i} className="text-slate-700 mb-4">{para}</p>
                  ))}
                </div>
                <MedicalDisclaimer variant="banner" locale={locale} />
              </SectionWrapper>

              {/* Symptoms */}
              <SectionWrapper id="symptoms" title="อาการ" icon={Activity}>
                <SymptomsSection symptoms={disease.symptoms} redFlags={disease.redFlagsTh} />
              </SectionWrapper>

              {/* Causes & Risk Factors */}
              <SectionWrapper id="causes" title="สาเหตุและปัจจัยเสี่ยง" icon={AlertTriangle}>
                <RiskFactorsSection riskFactors={disease.riskFactors} causes={disease.causesTh} />
              </SectionWrapper>

              {/* Screening */}
              <SectionWrapper id="screening" title="การตรวจวินิจฉัย / คัดกรอง" icon={Microscope}>
                <ScreeningSection screening={disease.screening} />
              </SectionWrapper>

              {/* Treatment */}
              <SectionWrapper id="treatment" title="การรักษา" icon={Heart}>
                <TreatmentSection treatments={disease.treatments} />
              </SectionWrapper>

              {/* Prevention */}
              <SectionWrapper id="prevention" title="การป้องกัน" icon={Shield}>
                <PreventionSection prevention={disease.prevention} />
              </SectionWrapper>

              {/* When to See Doctor */}
              <SectionWrapper id="when-to-see" title="เมื่อไหร่ควรพบแพทย์" icon={Calendar}>
                <div className="space-y-2 mb-4">
                  {disease.whenToSeeDoctorTh.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-red-50 border border-red-300 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-bold text-red-800">ฉุกเฉินทางการแพทย์</span>
                  </div>
                  <p className="text-sm text-red-700 mb-3">หากมีอาการฉุกเฉิน ไม่ต้องรอ — โทร 1669 หรือไปห้องฉุกเฉินที่ใกล้ที่สุดทันที</p>
                  <a href="tel:1669" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-red-700">
                    <Phone className="h-4 w-4" /> โทร 1669 (EMS)
                  </a>
                </div>
              </SectionWrapper>

              {/* FAQ */}
              {disease.faqsTh.length > 0 && (
                <SectionWrapper id="faq" title="คำถามที่พบบ่อย" icon={Users}>
                  <div className="space-y-4">
                    {disease.faqsTh.map((faq, i) => (
                      <div key={i} className="rounded-2xl border border-slate-200 p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Q: {faq.questionTh}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">A: {faq.answerTh}</p>
                      </div>
                    ))}
                  </div>
                </SectionWrapper>
              )}

              {/* References */}
              <SectionWrapper id="references" title="แหล่งอ้างอิง" icon={ExternalLink}>
                <div className="space-y-3 mb-5">
                  {disease.references.map((ref) => (
                    <div key={ref.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      {!ref.isVerified && (
                        <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 mb-2">
                          ต้องตรวจสอบก่อนเผยแพร่
                        </span>
                      )}
                      <p className="text-xs font-semibold text-slate-800">{ref.titleEn}</p>
                      {ref.titleTh && <p className="text-xs text-slate-600 mt-0.5">{ref.titleTh}</p>}
                      <p className="text-[11px] text-slate-400 mt-1">
                        {ref.organization && <span>{ref.organization} · </span>}
                        {ref.year}
                        {ref.doi && <span> · DOI: {ref.doi}</span>}
                      </p>
                    </div>
                  ))}
                </div>
                <MedicalDisclaimer variant="banner" locale={locale} />
                <p className="text-xs text-slate-400 mt-3">
                  ข้อมูลล่าสุด: {disease.lastReviewed} · {disease.reviewerPlaceholder}
                </p>
              </SectionWrapper>

              {/* Mobile CTAs */}
              <div className="lg:hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 mb-3">ขั้นตอนถัดไป</h3>
                <ButtonLink href="/risk" className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl py-3 block text-center">
                  ประเมินความเสี่ยงของคุณ
                </ButtonLink>
                <ButtonLink href="/providers" variant="outline" className="w-full text-sm font-semibold rounded-xl py-3 block text-center border border-slate-300 text-slate-700">
                  ค้นหาโรงพยาบาล
                </ButtonLink>
              </div>

              {/* Newsletter */}
              <Newsletter />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// ============================================================
// LEGACY DISEASE PAGE (fallback for disease-data.ts slugs)
// ============================================================

async function LegacyDiseasePage({ params }: Props) {
  const { slug, locale } = await params
  const disease = getDiseaseData(slug)
  if (!disease) return notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-5xl px-6 py-3 flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-teal-600">หน้าหลัก</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/diseases" className="hover:text-teal-600">คลังข้อมูลโรค</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-800 font-medium">{disease.nameTh_short}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-10">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-3xl font-bold text-white mb-2">{disease.nameTh}</h1>
            <p className="text-slate-400 text-sm mb-4">{disease.nameEn}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 border border-slate-600 rounded-full px-3 py-1">
                ICD-10: {disease.icd10}
              </span>
              <span className="text-xs text-slate-400 border border-slate-600 rounded-full px-3 py-1">
                ล่าสุด: {disease.lastReviewed}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-10">
          <MedicalDisclaimer variant="banner" locale={locale} />

          {/* Overview */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">ภาพรวม</h2>
            <p className="text-slate-700 leading-relaxed text-sm">{disease.overview.th}</p>
          </section>

          {/* Symptoms */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">อาการ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {disease.earlySymptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span className="text-sm text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Screening */}
          {disease.screeningInfo.recommended && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">การตรวจคัดกรอง</h2>
              <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
                <div className="text-sm text-slate-700 space-y-1.5">
                  {disease.screeningInfo.from_age && (
                    <p><strong>เริ่มตรวจ:</strong> อายุ {disease.screeningInfo.from_age} ปีขึ้นไป</p>
                  )}
                  {disease.screeningInfo.frequency && (
                    <p><strong>ความถี่:</strong> {disease.screeningInfo.frequency}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {disease.screeningInfo.tests.map(t => (
                      <span key={t} className="text-xs bg-white border border-teal-200 rounded-full px-3 py-0.5 text-teal-700 font-medium">{t}</span>
                    ))}
                  </div>
                  <p className="text-xs text-teal-700 mt-2 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> {disease.screeningInfo.guidelineTh}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Prevention */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">การป้องกัน</h2>
            <div className="space-y-2">
              {disease.prevention.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-700">{p}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Red flags */}
          {disease.redFlags.length > 0 && (
            <section className="rounded-2xl bg-red-50 border border-red-300 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-sm font-bold text-red-800">สัญญาณเตือนฉุกเฉิน</h3>
              </div>
              <ul className="space-y-1.5 mb-4">
                {disease.redFlags.map((f, i) => (
                  <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                    <span className="mt-1 shrink-0">•</span> {f}
                  </li>
                ))}
              </ul>
              <a href="tel:1669" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-red-700">
                <Phone className="h-4 w-4" /> โทร 1669 ฉุกเฉิน
              </a>
            </section>
          )}

          <div className="flex gap-3">
            <ButtonLink href="/risk" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl py-3 text-center block">
              ประเมินความเสี่ยง
            </ButtonLink>
            <ButtonLink href="/providers" variant="outline" className="flex-1 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl py-3 text-center block">
              ค้นหาโรงพยาบาล
            </ButtonLink>
          </div>

          <MedicalDisclaimer variant="banner" locale={locale} />
          <p className="text-xs text-slate-400">
            ข้อมูลล่าสุด: {disease.lastReviewed} · {disease.reviewerPlaceholder}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// ============================================================
// ROUTER — choose which page to render
// ============================================================

export default async function DiseasePage(props: Props) {
  const { slug } = await props.params
  const isRich = getAllRichSlugs().includes(slug)
  if (isRich) return <RichDiseasePage {...props} />
  const isLegacy = getAllDiseaseSlugs().includes(slug)
  if (isLegacy) return <LegacyDiseasePage {...props} />
  return notFound()
}
