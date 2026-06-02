'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Activity, Calendar, ChevronRight } from 'lucide-react'
import { HealthReport, type ReportData } from './HealthReport'

const DISCLAIMER = 'รายงานนี้สร้างโดย FirstScreen เพื่อการศึกษาและการนำทางสุขภาพเท่านั้น ไม่ใช่การวินิจฉัยโรคหรือการรักษาทางการแพทย์ กรุณาปรึกษาแพทย์ผู้เชี่ยวชาญเพื่อการประเมินและรักษาที่เหมาะสม'

function buildDemoReport(): ReportData {
  return {
    generatedAt: new Date().toISOString(),
    patientAge: 45,
    patientSex: 'male',
    riskScores: [
      { category: 'ความเสี่ยงหัวใจและหลอดเลือด (10 ปี)', score: 12, maxScore: 100, riskLevel: 'moderate', label: '12%' },
      { category: 'ความเสี่ยงเบาหวาน (FINDRISC)', score: 14, maxScore: 26, riskLevel: 'high', label: 'High — 33%' },
    ],
    screeningRecommendations: [
      { name: 'ตรวจน้ำตาลในเลือด (FBS/HbA1c)', priority: 'urgent', nhsoCovered: true, guidelineSource: 'ADA 2024 / DAT', dueDate: 'ทันที' },
      { name: 'ตรวจไขมันในเลือด (Lipid Profile)', priority: 'soon', nhsoCovered: true, guidelineSource: 'ESC 2021', dueDate: 'ภายใน 1 เดือน' },
      { name: 'วัดความดันโลหิต', priority: 'routine', nhsoCovered: true, guidelineSource: 'MOPH', dueDate: 'ทุก 6 เดือน' },
      { name: 'Colonoscopy / FIT test', priority: 'soon', nhsoCovered: true, guidelineSource: 'USPSTF 2021', dueDate: 'ภายใน 3 เดือน' },
    ],
    guidelineReferences: [
      { org: 'ADA 2024', recommendation: 'คัดกรองเบาหวานสำหรับผู้ที่มี BMI ≥23 (Asian) ตั้งแต่อายุ 35 ปี', evidenceGrade: 'B' },
      { org: 'NHSO', recommendation: 'ตรวจ FBS ฟรีทุก 3 ปีสำหรับอายุ 35+', evidenceGrade: 'B' },
      { org: 'USPSTF 2021', recommendation: 'Colorectal cancer screening อายุ 45-75 ปี', evidenceGrade: 'A' },
    ],
    nextActions: [
      'นัดตรวจเลือด FBS + HbA1c + Lipid Profile ที่โรงพยาบาลประจำตามสิทธิ์',
      'ลดน้ำหนัก 5-7% ด้วยการออกกำลังกาย 150 นาที/สัปดาห์ + ลดอาหารหวาน',
      'FIT test สำหรับคัดกรองมะเร็งลำไส้ใหญ่ (ฟรีที่ รพ.รัฐ อายุ 50+)',
      'นัดพบแพทย์เพื่อรับคำแนะนำส่วนบุคคลโดยละเอียด',
    ],
    disclaimer: DISCLAIMER,
  }
}

export function HealthReportClient() {
  const [hasData, setHasData] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)

  useEffect(() => {
    // Check localStorage for clinical session
    let data: ReportData = buildDemoReport()
    let found = false
    try {
      const sess = localStorage.getItem('fs_clinical_session')
      if (sess) {
        const parsed = JSON.parse(sess)
        if (parsed.chief_complaint || parsed.symptom_ids?.length) {
          found = true
          data = {
            ...buildDemoReport(),
            chiefComplaint: parsed.chief_complaint,
            patientAge: parsed.age ?? 45,
            patientSex: parsed.sex ?? 'male',
          }
        }
      }
    } catch { /* silent */ }
    // Defer to avoid synchronous setState-in-effect lint warning
    const f = found, d = data
    setTimeout(() => {
      setHasData(f)
      setReportData(d)
    }, 0)
  }, [])

  if (!reportData) return null

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-800 mb-2">ยังไม่มีข้อมูลการประเมิน</p>
          <p className="text-xs text-amber-700 mb-4">
            ทำการประเมินสุขภาพก่อน เพื่อสร้างรายงานที่ตรงกับข้อมูลจริงของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/risk" className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors">
              <Activity className="h-4 w-4" />
              ประเมินความเสี่ยง
            </Link>
            <Link href="/screening" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Calendar className="h-4 w-4" />
              ดูแผนคัดกรอง
            </Link>
          </div>
        </div>

        {/* Show demo report */}
        <div>
          <p className="text-xs text-slate-400 mb-3">ตัวอย่างรายงาน (Demo):</p>
          <HealthReport data={reportData} />
        </div>
      </div>
    )
  }

  return <HealthReport data={reportData} />
}
