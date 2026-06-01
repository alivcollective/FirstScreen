/**
 * Cancer Risk Assessment — Thai-specific 5-cancer model
 * References:
 * - NCCN Guidelines (cancer.org)
 * - Thai MoPH National Cancer Control Program
 * - USPSTF Screening Recommendations
 * - IARC/WHO Cancer Screening Guidelines
 *
 * SAFETY: Educational use only. PENDING physician validation.
 * Risk stratification is relative — not absolute lifetime risk.
 */

import type { SocialHistory, FamilyHistory } from '@/types/clinical'
import { calculatePackYears, getSmokingRisk } from '../calculators/pack-year'
import { calculateAUDITC } from '../calculators/audit-c'

export interface CancerRiskInput {
  age: number
  sex: 'male' | 'female' | 'other'
  bmi: number
  smoking?: SocialHistory['smoking']
  alcohol?: SocialHistory['alcohol']
  diet?: SocialHistory['diet']
  exerciseMeetsWHO: boolean
  familyHx?: FamilyHistory
  pmh: string[]
  // Cancer-specific
  hpvVaccinated?: boolean
  papSmearRecent3y?: boolean    // Pap smear in last 3 years
  hbvStatus?: 'positive' | 'negative' | 'unknown'
  hcvStatus?: 'positive' | 'negative' | 'unknown'
  liverCirrhosis?: boolean
}

export interface ScreeningRecommendation {
  testTh: string
  frequencyTh: string
  guidelineTh: string
  urgent: boolean
}

export interface CancerRiskResult {
  cancerType: string
  icd11Code: string
  riskLevel: 'average' | 'elevated' | 'high' | 'very_high'
  riskScore: number           // 0–100 relative scale
  keyRiskFactorsTh: string[]
  screening: ScreeningRecommendation[]
  descriptionTh: string
  actionTh: string
}

// ── 1. Breast Cancer (มะเร็งเต้านม) ─────────────────────────
function assessBreastCancer(input: CancerRiskInput): CancerRiskResult {
  if (input.sex !== 'female') {
    return _noRisk('มะเร็งเต้านม', '2C61', 'ไม่ใช้ได้กับเพศชาย')
  }

  let score = 10 // baseline
  const factors: string[] = []

  if (input.age >= 40) { score += 15; factors.push('อายุ ≥ 40 ปี') }
  if (input.age >= 50) { score += 10; factors.push('อายุ ≥ 50 ปี') }
  if (input.bmi >= 27.5) { score += 8; factors.push('น้ำหนักเกิน/อ้วน (หลังหมดประจำเดือน)') }
  if (input.familyHx?.first_degree?.breast_cancer) { score += 20; factors.push('แม่หรือพี่น้องเป็นมะเร็งเต้านม') }
  if (input.pmh.includes('cancer') || input.pmh.includes('breast_cancer_hx')) { score += 30; factors.push('ประวัติมะเร็งเต้านม') }
  if (input.alcohol?.audit_c_score && input.alcohol.audit_c_score >= 4) { score += 5; factors.push('ดื่มแอลกอฮอล์เป็นประจำ') }
  if (!input.exerciseMeetsWHO) { score += 3; factors.push('ออกกำลังกายน้อย') }

  const riskLevel = score >= 50 ? 'very_high' : score >= 35 ? 'high' : score >= 20 ? 'elevated' : 'average'

  return {
    cancerType: 'มะเร็งเต้านม',
    icd11Code: '2C61',
    riskLevel,
    riskScore: Math.min(score, 100),
    keyRiskFactorsTh: factors,
    screening: [
      {
        testTh: 'การตรวจเต้านมด้วยตนเอง (BSE)',
        frequencyTh: 'ทุกเดือน ตั้งแต่อายุ 20 ปี',
        guidelineTh: 'กรมการแพทย์ สธ.',
        urgent: false,
      },
      {
        testTh: 'Mammogram',
        frequencyTh: 'ทุก 1–2 ปี สำหรับผู้หญิงอายุ 40–74 ปี',
        guidelineTh: 'ACS / NCCN',
        urgent: riskLevel === 'very_high',
      },
    ],
    descriptionTh: riskLevel === 'average'
      ? 'ความเสี่ยงเฉลี่ย ควรตรวจคัดกรองตามอายุ'
      : 'ความเสี่ยงสูงกว่าค่าเฉลี่ย ควรเริ่มคัดกรองเร็วขึ้น',
    actionTh: riskLevel === 'average'
      ? 'ตรวจ Mammogram ตามช่วงอายุ'
      : 'ปรึกษาแพทย์เพื่อวางแผนคัดกรองที่เข้มข้นขึ้น',
  }
}

// ── 2. Cervical Cancer (มะเร็งปากมดลูก) ───────────────────
function assessCervicalCancer(input: CancerRiskInput): CancerRiskResult {
  if (input.sex !== 'female') return _noRisk('มะเร็งปากมดลูก', 'GC00', 'ไม่ใช้ได้กับเพศชาย')

  let score = 10
  const factors: string[] = []

  if (!input.hpvVaccinated) { score += 15; factors.push('ไม่ได้รับวัคซีน HPV') }
  if (!input.papSmearRecent3y) { score += 20; factors.push('ไม่ได้ตรวจ Pap Smear ใน 3 ปีที่ผ่านมา') }
  if (input.smoking?.status === 'current') { score += 10; factors.push('สูบบุหรี่ (เพิ่มความเสี่ยง HPV ลุกลาม)') }
  if (input.age >= 25 && input.age <= 65) score += 5

  const riskLevel = score >= 40 ? 'high' : score >= 25 ? 'elevated' : 'average'

  return {
    cancerType: 'มะเร็งปากมดลูก',
    icd11Code: 'GC00',
    riskLevel,
    riskScore: Math.min(score, 100),
    keyRiskFactorsTh: factors,
    screening: [
      {
        testTh: 'Pap Smear / HPV Co-test',
        frequencyTh: 'ทุก 3 ปี (Pap Smear) หรือ 5 ปี (HPV Co-test) อายุ 25–65 ปี',
        guidelineTh: 'สถาบันมะเร็งแห่งชาติ / ASCCP',
        urgent: !input.papSmearRecent3y && input.age >= 25,
      },
      {
        testTh: 'วัคซีน HPV (9 สายพันธุ์)',
        frequencyTh: 'แนะนำก่อนมีเพศสัมพันธ์ อายุ 9–26 ปี',
        guidelineTh: 'กรมควบคุมโรค สธ.',
        urgent: !input.hpvVaccinated && input.age <= 26,
      },
    ],
    descriptionTh: factors.length === 0
      ? 'ความเสี่ยงเฉลี่ย'
      : `ปัจจัยเสี่ยง: ${factors.join(', ')}`,
    actionTh: !input.papSmearRecent3y
      ? 'นัดตรวจ Pap Smear โดยเร็ว'
      : 'ตรวจคัดกรองตามนัดต่อไป',
  }
}

// ── 3. Colorectal Cancer (มะเร็งลำไส้ใหญ่) ────────────────
function assessColorectalCancer(input: CancerRiskInput): CancerRiskResult {
  let score = 5
  const factors: string[] = []

  if (input.age >= 45) { score += 15; factors.push('อายุ ≥ 45 ปี') }
  if (input.age >= 60) { score += 10; factors.push('อายุ ≥ 60 ปี') }
  if (input.familyHx?.first_degree?.colorectal_cancer) { score += 25; factors.push('ครอบครัวสายตรงเป็นมะเร็งลำไส้') }
  if (input.pmh.includes('polyp') || input.pmh.includes('ibd')) { score += 15; factors.push('ประวัติติ่งเนื้อในลำไส้/IBD') }
  if (input.diet?.red_meat_frequency && ['3-5 ครั้ง/สัปดาห์','ทุกวัน'].includes(input.diet.red_meat_frequency)) {
    score += 8; factors.push('กินเนื้อแดงและเนื้อแปรรูปมาก')
  }
  if (!input.exerciseMeetsWHO) { score += 5; factors.push('ออกกำลังกายน้อย') }
  if (input.bmi >= 27.5) { score += 5; factors.push('น้ำหนักเกิน') }

  const riskLevel = score >= 50 ? 'very_high' : score >= 35 ? 'high' : score >= 20 ? 'elevated' : 'average'

  return {
    cancerType: 'มะเร็งลำไส้ใหญ่',
    icd11Code: '2C83',
    riskLevel,
    riskScore: Math.min(score, 100),
    keyRiskFactorsTh: factors,
    screening: [
      {
        testTh: 'FOBT / FIT (ตรวจเลือดในอุจจาระ)',
        frequencyTh: 'ทุกปี สำหรับ อายุ 45–75 ปี',
        guidelineTh: 'NCCN / USPSTF',
        urgent: false,
      },
      {
        testTh: 'Colonoscopy (ส่องกล้องลำไส้ใหญ่)',
        frequencyTh: 'ทุก 10 ปี หรือเร็วกว่าถ้ามีปัจจัยเสี่ยง',
        guidelineTh: 'NCCN',
        urgent: riskLevel === 'very_high',
      },
    ],
    descriptionTh: riskLevel === 'average' ? 'ความเสี่ยงเฉลี่ย' : `ความเสี่ยงสูงกว่าค่าเฉลี่ย: ${factors.slice(0,2).join(', ')}`,
    actionTh: input.age >= 45 ? 'เริ่มตรวจคัดกรองมะเร็งลำไส้' : 'เฝ้าระวังปัจจัยเสี่ยง',
  }
}

// ── 4. Liver Cancer (มะเร็งตับ) ────────────────────────────
function assessLiverCancer(input: CancerRiskInput): CancerRiskResult {
  let score = 5
  const factors: string[] = []

  if (input.hbvStatus === 'positive') { score += 35; factors.push('ติดเชื้อไวรัสตับอักเสบบี (HBV)') }
  if (input.hcvStatus === 'positive') { score += 30; factors.push('ติดเชื้อไวรัสตับอักเสบซี (HCV)') }
  if (input.liverCirrhosis) { score += 30; factors.push('มีตับแข็ง (Cirrhosis)') }
  if (input.pmh.includes('liver_disease')) { score += 15; factors.push('ประวัติโรคตับ') }

  // Alcohol
  if (input.alcohol?.audit_c_score && input.alcohol.audit_c_score >= 4) {
    const yrs = input.alcohol.years_drinking ?? 0
    if (yrs > 10) { score += 15; factors.push('ดื่มแอลกอฮอล์หนักนาน > 10 ปี') }
    else { score += 8; factors.push('ดื่มแอลกอฮอล์ในระดับเสี่ยง') }
  }

  if (input.sex === 'male') { score += 5; factors.push('เพศชาย (ความชุกสูงกว่า)') }
  if (input.age >= 40) score += 8

  const riskLevel = score >= 60 ? 'very_high' : score >= 40 ? 'high' : score >= 20 ? 'elevated' : 'average'

  return {
    cancerType: 'มะเร็งตับ',
    icd11Code: '2C71',
    riskLevel,
    riskScore: Math.min(score, 100),
    keyRiskFactorsTh: factors,
    screening: [
      {
        testTh: 'Ultrasound ตับ + AFP',
        frequencyTh: 'ทุก 6 เดือน สำหรับกลุ่มเสี่ยงสูง (HBV/HCV/ตับแข็ง)',
        guidelineTh: 'สมาคมโรคตับแห่งประเทศไทย / AASLD',
        urgent: score >= 40,
      },
    ],
    descriptionTh: factors.length > 0 ? `ความเสี่ยงสูงกว่าค่าเฉลี่ย — ปัจจัย: ${factors[0]}` : 'ความเสี่ยงเฉลี่ย',
    actionTh: score >= 40 ? 'ต้องตรวจคัดกรองมะเร็งตับทุก 6 เดือน' : 'ฉีดวัคซีน HBV ถ้ายังไม่ได้ฉีด',
  }
}

// ── 5. Lung Cancer (มะเร็งปอด) ─────────────────────────────
function assessLungCancer(input: CancerRiskInput): CancerRiskResult {
  const smokingStatus = input.smoking?.status ?? 'never'
  const cpd = smokingStatus === 'current'
    ? (input.smoking?.cigarettes_per_day ?? 0)
    : (input.smoking as { cigarettes_per_day_former?: number })?.cigarettes_per_day_former ?? 0
  const yrs = smokingStatus === 'current'
    ? (input.smoking?.years_smoked ?? 0)
    : (input.smoking?.years_smoked ?? 0)
  const quitYrs = smokingStatus === 'former' ? (input.smoking?.quit_years_ago ?? null) : null

  const packYears = calculatePackYears(cpd, yrs)
  const smokingRisk = getSmokingRisk(packYears, quitYrs)

  let score = 5
  const factors: string[] = []

  if (smokingStatus === 'current') {
    score += 30 + Math.min(packYears * 0.5, 30)
    factors.push(`สูบบุหรี่อยู่ปัจจุบัน (${packYears.toFixed(1)} pack-years)`)
  } else if (smokingStatus === 'former') {
    const reduction = quitYrs && quitYrs > 15 ? 0.5 : quitYrs && quitYrs > 5 ? 0.7 : 0.9
    score += (20 + packYears * 0.3) * reduction
    factors.push(`เคยสูบบุหรี่ ${packYears.toFixed(1)} pack-years`)
  }

  if (input.age >= 50) { score += 10; factors.push('อายุ ≥ 50 ปี') }
  if (input.familyHx?.first_degree?.cancer === 'lung') { score += 15; factors.push('ครอบครัวเป็นมะเร็งปอด') }

  const riskLevel = score >= 55 ? 'very_high' : score >= 40 ? 'high' : score >= 20 ? 'elevated' : 'average'

  const nlstEligible = smokingRisk.nlstEligible && input.age >= 50 && input.age <= 80

  return {
    cancerType: 'มะเร็งปอด',
    icd11Code: '2C12',
    riskLevel,
    riskScore: Math.min(Math.round(score), 100),
    keyRiskFactorsTh: factors,
    screening: nlstEligible ? [
      {
        testTh: 'Low-dose CT scan (LDCT)',
        frequencyTh: 'ทุกปี (NLST criteria: ≥20 pack-years, อายุ 50–80 ปี)',
        guidelineTh: 'NLST / USPSTF Grade B',
        urgent: true,
      },
    ] : [
      {
        testTh: 'เลิกสูบบุหรี่',
        frequencyTh: 'ทันที — วิธีป้องกันที่ดีที่สุด',
        guidelineTh: 'WHO FCTC',
        urgent: smokingStatus === 'current',
      },
    ],
    descriptionTh: factors.length > 0 ? `ความเสี่ยงสูงกว่าค่าเฉลี่ย — ${factors[0]}` : 'ความเสี่ยงต่ำ',
    actionTh: nlstEligible ? 'เข้าเกณฑ์ตรวจ LDCT ทุกปี' : smokingStatus === 'current' ? 'เลิกสูบบุหรี่ทันที' : 'ไม่จำเป็นต้องตรวจ LDCT',
  }
}

// ── Helper ───────────────────────────────────────────────────

function _noRisk(cancerType: string, icd11Code: string, note: string): CancerRiskResult {
  return {
    cancerType, icd11Code, riskLevel: 'average', riskScore: 0,
    keyRiskFactorsTh: [], screening: [],
    descriptionTh: note, actionTh: '',
  }
}

// ── Main export ──────────────────────────────────────────────

export function assessCancerRisks(input: CancerRiskInput): CancerRiskResult[] {
  const results: CancerRiskResult[] = []

  if (input.sex === 'female') {
    results.push(assessBreastCancer(input))
    results.push(assessCervicalCancer(input))
  }
  results.push(assessColorectalCancer(input))
  results.push(assessLiverCancer(input))
  results.push(assessLungCancer(input))

  return results.filter(r => r.riskScore > 0).sort((a, b) => b.riskScore - a.riskScore)
}
