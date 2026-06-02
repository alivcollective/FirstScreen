import type { Metadata } from 'next'
import { ArrowLeft, Stethoscope, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getRegionBySlug } from '@/data/body-regions/index'

export const metadata: Metadata = {
  title: 'ประเมินอาการ | FirstScreen',
  description: 'ประเมินอาการเบื้องต้นจากตำแหน่งร่างกายที่เลือก',
  robots: { index: false }, // Don't index — dynamic params page
}

interface Props {
  searchParams: Promise<{ bodyPart?: string; symptom?: string }>
}

export default async function SymptomAssessmentPage({ searchParams }: Props) {
  const params = await searchParams
  const bodyPartSlug = params.bodyPart ?? ''
  const symptomIds = params.symptom ? params.symptom.split(',') : []

  const region = bodyPartSlug ? getRegionBySlug(bodyPartSlug) : null
  const selectedSymptoms = region?.symptoms.filter(s => symptomIds.includes(s.id)) ?? []

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 py-10">

          {/* Back */}
          <Link
            href="/body-map"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับไปเลือกตำแหน่ง
          </Link>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <Stethoscope className="h-5 w-5 text-teal-600" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs text-slate-400">การประเมินอาการเบื้องต้น</p>
              <h1 className="text-xl font-bold text-slate-900">
                {region ? region.name_th : 'ประเมินอาการ'}
              </h1>
            </div>
          </div>

          {/* Summary */}
          {region && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
                อาการที่คุณเลือก
              </p>
              {selectedSymptoms.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSymptoms.map(s => (
                    <span key={s.id} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-700">
                      {s.label_th}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 mb-4">ไม่ได้เลือกอาการ</p>
              )}

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                อาจเกี่ยวข้องกับ
              </p>
              <div className="flex flex-wrap gap-1.5">
                {region.possibleConditions.map(c => (
                  <span key={c} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                ข้อมูลเพื่อการศึกษา ไม่ใช่การวินิจฉัย
              </p>
            </div>
          )}

          {/* Next steps */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">ขั้นตอนถัดไปที่แนะนำ</h2>
            {[
              { label: 'ตรวจอาการ 7 ขั้นตอน', desc: 'การประเมินอาการแบบละเอียด OLDCARTS', href: '/symptoms', primary: true },
              { label: 'ประเมินความเสี่ยง', desc: 'Framingham, FINDRISC, Cancer Risk', href: '/risk', primary: false },
              { label: 'ค้นหาโรงพยาบาล', desc: 'หาสถานพยาบาลใกล้บ้าน', href: '/providers', primary: false },
            ].map(({ label, desc, href, primary }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-all group ${
                  primary
                    ? 'bg-teal-600 border-teal-600 text-white hover:bg-teal-500'
                    : 'bg-white border-slate-200 hover:border-teal-200 hover:bg-teal-50/30'
                }`}
              >
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${primary ? 'text-white' : 'text-slate-800'}`}>{label}</p>
                  <p className={`text-xs mt-0.5 ${primary ? 'text-teal-100' : 'text-slate-500'}`}>{desc}</p>
                </div>
                <ArrowRight className={`h-4 w-4 shrink-0 ${primary ? 'text-white' : 'text-slate-300 group-hover:text-teal-500'}`} />
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                FirstScreen ให้ข้อมูลเพื่อการศึกษาและการคัดกรองสุขภาพเบื้องต้นเท่านั้น
                ไม่ใช่การวินิจฉัยโรคหรือทดแทนคำแนะนำจากแพทย์
                หากมีอาการรุนแรงหรือฉุกเฉิน ควรโทร 1669 หรือไปโรงพยาบาลทันที
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
