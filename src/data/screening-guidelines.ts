// Thai Preventive Screening Guidelines
// Sources: MOPH Thailand, NHSO Preventive Care Package, Royal College recommendations
// SAFETY: Educational only — pending medical team review before publication

export type ScreeningCategory =
  | 'cardiovascular' | 'diabetes' | 'cancer' | 'infection'
  | 'mental_health' | 'bone' | 'vision' | 'dental' | 'vaccine'

export type Sex = 'male' | 'female' | 'all'
export type RiskLevel = 'universal' | 'high_risk' | 'optional'

export interface ScreeningTest {
  id: string
  nameTh: string
  nameEn: string
  category: ScreeningCategory
  sex: Sex
  minAge: number
  maxAge: number | null
  intervalMonths: number         // how often (months)
  riskFactors?: string[]         // show even earlier if these present
  descriptionTh: string
  preparationTh?: string
  costRange: string              // e.g. "฿0–150"
  nhsoCovered: boolean
  guidelineTh: string
  urgency: 'routine' | 'important' | 'critical'
  riskLevel: RiskLevel
  diseaseSlug?: string
}

export const SCREENING_TESTS: ScreeningTest[] = [
  // ── CARDIOVASCULAR ──────────────────────────────────────────
  {
    id: 'blood_pressure',
    nameTh: 'วัดความดันโลหิต',
    nameEn: 'Blood Pressure Measurement',
    category: 'cardiovascular',
    sex: 'all',
    minAge: 18,
    maxAge: null,
    intervalMonths: 24,
    descriptionTh: 'ตรวจวัดความดันโลหิต เป้าหมาย < 130/80 mmHg สำหรับผู้ใหญ่ทั่วไป',
    costRange: '฿0 (ฟรีที่ รพ.รัฐ)',
    nhsoCovered: true,
    guidelineTh: 'กรมควบคุมโรค / THSA 2566',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'hypertension',
  },
  {
    id: 'lipid_profile',
    nameTh: 'ตรวจไขมันในเลือด (Lipid Profile)',
    nameEn: 'Lipid Profile',
    category: 'cardiovascular',
    sex: 'all',
    minAge: 35,
    maxAge: null,
    intervalMonths: 60,
    riskFactors: ['hypertension', 'diabetes', 'obesity', 'smoking', 'family_cvd'],
    descriptionTh: 'ตรวจ Total Cholesterol, LDL, HDL, Triglyceride เพื่อประเมินความเสี่ยงหัวใจ',
    preparationTh: 'งดอาหาร 9–12 ชั่วโมงก่อนตรวจ',
    costRange: '฿200–600',
    nhsoCovered: true,
    guidelineTh: 'สมาคมแพทย์โรคหัวใจแห่งประเทศไทย 2566',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'cardiovascular-disease',
  },
  {
    id: 'ecg_baseline',
    nameTh: 'คลื่นไฟฟ้าหัวใจ (ECG)',
    nameEn: 'Resting Electrocardiogram',
    category: 'cardiovascular',
    sex: 'all',
    minAge: 40,
    maxAge: null,
    intervalMonths: 60,
    riskFactors: ['hypertension', 'diabetes', 'family_cvd', 'obesity'],
    descriptionTh: 'ตรวจจังหวะหัวใจและโครงสร้างไฟฟ้าหัวใจ ค้นหาความผิดปกติก่อนอาการ',
    costRange: '฿150–500',
    nhsoCovered: false,
    guidelineTh: 'Thai Cardiac Society',
    urgency: 'routine',
    riskLevel: 'high_risk',
    diseaseSlug: 'cardiovascular-disease',
  },

  // ── DIABETES ────────────────────────────────────────────────
  {
    id: 'fasting_glucose',
    nameTh: 'ตรวจน้ำตาลในเลือดขณะอดอาหาร (FPG)',
    nameEn: 'Fasting Plasma Glucose',
    category: 'diabetes',
    sex: 'all',
    minAge: 35,
    maxAge: null,
    intervalMonths: 36,
    riskFactors: ['obesity', 'family_diabetes', 'hypertension', 'gestational_dm'],
    descriptionTh: 'ค่าปกติ < 100 mg/dL · Prediabetes 100–125 · เบาหวาน ≥ 126 mg/dL อดอาหาร 8 ชั่วโมง',
    preparationTh: 'งดอาหารและเครื่องดื่มอื่นนอกจากน้ำเปล่า 8 ชั่วโมงก่อนตรวจ',
    costRange: '฿50–150',
    nhsoCovered: true,
    guidelineTh: 'สมาคมโรคเบาหวานแห่งประเทศไทย (DMST) 2566',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'type-2-diabetes',
  },
  {
    id: 'hba1c',
    nameTh: 'ตรวจน้ำตาลสะสม (HbA1c)',
    nameEn: 'Hemoglobin A1c',
    category: 'diabetes',
    sex: 'all',
    minAge: 40,
    maxAge: null,
    intervalMonths: 36,
    riskFactors: ['obesity', 'family_diabetes', 'prediabetes'],
    descriptionTh: 'สะท้อนระดับน้ำตาลเฉลี่ย 3 เดือน ไม่ต้องอดอาหาร ค่าปกติ < 5.7%',
    costRange: '฿200–400',
    nhsoCovered: true,
    guidelineTh: 'DMST / ADA Standards of Care',
    urgency: 'important',
    riskLevel: 'high_risk',
    diseaseSlug: 'type-2-diabetes',
  },

  // ── CANCER — Women ───────────────────────────────────────────
  {
    id: 'pap_smear',
    nameTh: 'ตรวจมะเร็งปากมดลูก (Pap Smear)',
    nameEn: 'Cervical Cancer Screening (Pap Smear)',
    category: 'cancer',
    sex: 'female',
    minAge: 25,
    maxAge: 65,
    intervalMonths: 36,
    descriptionTh: 'ป้องกันมะเร็งปากมดลูกได้สูงสุด ตรวจเซลล์ผิดปกติก่อนกลายเป็นมะเร็ง แนะนำทุก 3 ปี หรือ HPV co-test ทุก 5 ปี',
    preparationTh: 'หลีกเลี่ยงการมีเพศสัมพันธ์ การสวนล้างช่องคลอด และการใช้ครีมช่องคลอด 48 ชั่วโมงก่อน',
    costRange: '฿200–800',
    nhsoCovered: true,
    guidelineTh: 'สถาบันมะเร็งแห่งชาติ / กรมการแพทย์ 2567',
    urgency: 'critical',
    riskLevel: 'universal',
    diseaseSlug: 'cervical-cancer',
  },
  {
    id: 'mammogram',
    nameTh: 'Mammogram (เอกซเรย์เต้านม)',
    nameEn: 'Mammography',
    category: 'cancer',
    sex: 'female',
    minAge: 40,
    maxAge: 74,
    intervalMonths: 24,
    riskFactors: ['family_breast_cancer', 'brca_mutation', 'dense_breast'],
    descriptionTh: 'ตรวจหาก้อนหรือความผิดปกติในเต้านมก่อนคลำได้ ค้นพบระยะแรก อัตราการรอดชีวิตสูงถึง 98%',
    costRange: '฿500–1,500',
    nhsoCovered: false,
    guidelineTh: 'สมาคมโรคมะเร็งแห่งประเทศไทย / ACS',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'breast-cancer',
  },

  // ── CANCER — All ─────────────────────────────────────────────
  {
    id: 'fobt_colorectal',
    nameTh: 'ตรวจเลือดในอุจจาระ (FOBT/FIT)',
    nameEn: 'Fecal Occult Blood Test',
    category: 'cancer',
    sex: 'all',
    minAge: 45,
    maxAge: 75,
    intervalMonths: 12,
    riskFactors: ['family_colorectal', 'previous_polyp', 'ibd'],
    descriptionTh: 'คัดกรองมะเร็งลำไส้ใหญ่เบื้องต้น หากพบเลือดในอุจจาระจะส่งส่องกล้องต่อ',
    preparationTh: 'หลีกเลี่ยงเนื้อแดงและบางผลไม้ 3 วันก่อนเก็บตัวอย่าง',
    costRange: '฿150–400',
    nhsoCovered: true,
    guidelineTh: 'NCCN / กรมการแพทย์ สธ.',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'colorectal-cancer',
  },
  {
    id: 'liver_ultrasound',
    nameTh: 'อัลตราซาวด์ตับ + ตรวจ AFP',
    nameEn: 'Liver Ultrasound + Alpha-Fetoprotein',
    category: 'cancer',
    sex: 'all',
    minAge: 40,
    maxAge: null,
    intervalMonths: 6,
    riskFactors: ['hbv_infection', 'hcv_infection', 'cirrhosis', 'family_liver_cancer'],
    descriptionTh: 'คัดกรองมะเร็งตับสำหรับกลุ่มเสี่ยงสูง ผู้ที่ติดเชื้อ HBV/HCV หรือมีตับแข็ง ควรตรวจทุก 6 เดือน',
    costRange: '฿400–1,200',
    nhsoCovered: false,
    guidelineTh: 'สมาคมโรคตับแห่งประเทศไทย / AASLD',
    urgency: 'critical',
    riskLevel: 'high_risk',
    diseaseSlug: 'liver-cancer',
  },
  {
    id: 'lung_ldct',
    nameTh: 'Low-dose CT ปอด (LDCT)',
    nameEn: 'Low-Dose CT Lung Cancer Screening',
    category: 'cancer',
    sex: 'all',
    minAge: 50,
    maxAge: 80,
    intervalMonths: 12,
    riskFactors: ['current_smoker', 'ex_smoker_20py'],
    descriptionTh: 'แนะนำสำหรับผู้สูบบุหรี่ ≥ 20 pack-years ตรวจพบมะเร็งปอดระยะแรกได้ดีที่สุด',
    costRange: '฿2,000–5,000',
    nhsoCovered: false,
    guidelineTh: 'NCCN Lung Cancer Screening / USPSTF',
    urgency: 'important',
    riskLevel: 'high_risk',
    diseaseSlug: 'lung-cancer',
  },

  // ── INFECTION ────────────────────────────────────────────────
  {
    id: 'hbv_test',
    nameTh: 'ตรวจไวรัสตับอักเสบบี (HBsAg)',
    nameEn: 'Hepatitis B Surface Antigen',
    category: 'infection',
    sex: 'all',
    minAge: 18,
    maxAge: null,
    intervalMonths: 0,          // once in lifetime if negative
    descriptionTh: 'ตรวจหาการติดเชื้อ HBV ถ้าผลลบและไม่เคยฉีดวัคซีน ควรฉีดวัคซีนป้องกัน',
    costRange: '฿150–350',
    nhsoCovered: true,
    guidelineTh: 'สมาคมโรคตับแห่งประเทศไทย',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'liver-cancer',
  },
  {
    id: 'hiv_test',
    nameTh: 'ตรวจ HIV',
    nameEn: 'HIV Test',
    category: 'infection',
    sex: 'all',
    minAge: 15,
    maxAge: 65,
    intervalMonths: 12,
    descriptionTh: 'WHO แนะนำให้ตรวจ HIV อย่างน้อยครั้งหนึ่ง ในประเทศไทยตรวจฟรีที่รพ.รัฐ',
    costRange: '฿0 (ฟรีที่ รพ.รัฐ)',
    nhsoCovered: true,
    guidelineTh: 'WHO / กรมควบคุมโรค',
    urgency: 'routine',
    riskLevel: 'universal',
  },

  // ── MENTAL HEALTH ────────────────────────────────────────────
  {
    id: 'depression_screen',
    nameTh: 'ตรวจคัดกรองซึมเศร้า (PHQ-9)',
    nameEn: 'Depression Screening (PHQ-9)',
    category: 'mental_health',
    sex: 'all',
    minAge: 18,
    maxAge: null,
    intervalMonths: 12,
    riskFactors: ['chronic_illness', 'family_depression', 'bereavement', 'postpartum'],
    descriptionTh: 'แบบประเมิน PHQ-9 ที่ผ่านการรับรองสากล ใช้เวลา 3 นาที ตรวจหาภาวะซึมเศร้าที่รักษาได้',
    costRange: '฿0',
    nhsoCovered: true,
    guidelineTh: 'กรมสุขภาพจิต / USPSTF',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'depression',
  },

  // ── BONE ────────────────────────────────────────────────────
  {
    id: 'dexa_bone',
    nameTh: 'ตรวจความหนาแน่นกระดูก (DEXA)',
    nameEn: 'Bone Mineral Density (DEXA Scan)',
    category: 'bone',
    sex: 'female',
    minAge: 65,
    maxAge: null,
    intervalMonths: 24,
    riskFactors: ['early_menopause', 'steroid_use', 'low_bmi', 'family_osteoporosis'],
    descriptionTh: 'ตรวจโรคกระดูกพรุนก่อนกระดูกหัก ผู้หญิงหมดประจำเดือนก่อนวัยควรตรวจเร็วขึ้น',
    costRange: '฿1,000–2,500',
    nhsoCovered: false,
    guidelineTh: 'USPSTF / NOF Guidelines',
    urgency: 'routine',
    riskLevel: 'universal',
  },

  // ── VISION ──────────────────────────────────────────────────
  {
    id: 'eye_exam',
    nameTh: 'ตรวจตาและสายตา',
    nameEn: 'Comprehensive Eye Exam',
    category: 'vision',
    sex: 'all',
    minAge: 40,
    maxAge: null,
    intervalMonths: 24,
    riskFactors: ['diabetes', 'hypertension', 'family_glaucoma'],
    descriptionTh: 'ตรวจต้อหิน ต้อกระจก และจอประสาทตาผิดปกติ ผู้เป็นเบาหวานควรตรวจทุกปี',
    costRange: '฿300–800',
    nhsoCovered: false,
    guidelineTh: 'ราชวิทยาลัยจักษุแพทย์แห่งประเทศไทย',
    urgency: 'routine',
    riskLevel: 'universal',
  },

  // ── DENTAL ──────────────────────────────────────────────────
  {
    id: 'dental_checkup',
    nameTh: 'ตรวจสุขภาพช่องปากและฟัน',
    nameEn: 'Dental Checkup',
    category: 'dental',
    sex: 'all',
    minAge: 18,
    maxAge: null,
    intervalMonths: 12,
    descriptionTh: 'ตรวจฟัน ขูดหินปูน และค้นหามะเร็งช่องปากระยะแรก แนะนำปีละ 1–2 ครั้ง',
    costRange: '฿0–500',
    nhsoCovered: true,
    guidelineTh: 'กรมอนามัย สธ.',
    urgency: 'routine',
    riskLevel: 'universal',
  },

  // ── VACCINES ────────────────────────────────────────────────
  {
    id: 'flu_vaccine',
    nameTh: 'ฉีดวัคซีนไข้หวัดใหญ่',
    nameEn: 'Annual Influenza Vaccine',
    category: 'vaccine',
    sex: 'all',
    minAge: 18,
    maxAge: null,
    intervalMonths: 12,
    descriptionTh: 'แนะนำฉีดทุกปีช่วง ก.ย.–ต.ค. ก่อนฤดูหวัด กลุ่มเสี่ยง (ผู้สูงอายุ ผู้มีโรคเรื้อรัง) ควรฉีดทุกปีโดยไม่ขาด',
    costRange: '฿0–500',
    nhsoCovered: true,
    guidelineTh: 'กรมควบคุมโรค สธ.',
    urgency: 'important',
    riskLevel: 'universal',
  },
  {
    id: 'hpv_vaccine',
    nameTh: 'วัคซีน HPV (9 สายพันธุ์)',
    nameEn: 'HPV Vaccine',
    category: 'vaccine',
    sex: 'female',
    minAge: 9,
    maxAge: 26,
    intervalMonths: 0,           // 2-3 dose series, not recurring
    descriptionTh: 'ป้องกันมะเร็งปากมดลูกได้สูงสุด 90% แนะนำก่อนมีเพศสัมพันธ์ครั้งแรก แต่ยังมีประโยชน์ถึงอายุ 26 ปี',
    costRange: '฿1,500–4,500 (ต่อโดส)',
    nhsoCovered: false,
    guidelineTh: 'กรมควบคุมโรค / ACIP',
    urgency: 'critical',
    riskLevel: 'universal',
    diseaseSlug: 'cervical-cancer',
  },
  {
    id: 'hbv_vaccine',
    nameTh: 'วัคซีนตับอักเสบบี (HBV)',
    nameEn: 'Hepatitis B Vaccine',
    category: 'vaccine',
    sex: 'all',
    minAge: 18,
    maxAge: null,
    intervalMonths: 0,
    descriptionTh: 'ป้องกันการติดเชื้อ HBV ซึ่งเป็นสาเหตุหลักของมะเร็งตับ ถ้าไม่เคยฉีดและผลตรวจ HBsAg ลบ ควรฉีด 3 เข็ม',
    costRange: '฿300–600 (ต่อโดส)',
    nhsoCovered: true,
    guidelineTh: 'กรมควบคุมโรค สธ.',
    urgency: 'important',
    riskLevel: 'universal',
    diseaseSlug: 'liver-cancer',
  },
]

// ── Helpers ──────────────────────────────────────────────────

export interface ScreeningRecommendation {
  test: ScreeningTest
  dueDate: Date | null         // null = do now / first time
  status: 'overdue' | 'due_soon' | 'on_track' | 'not_applicable'
  reason: string               // why included
  priority: 1 | 2 | 3         // 1=critical, 2=important, 3=routine
}

export interface UserProfile {
  age: number
  sex: 'male' | 'female'
  riskFactors: string[]
  lastScreenings?: Record<string, string> // testId → ISO date string
}

export function getRecommendations(profile: UserProfile): ScreeningRecommendation[] {
  const now = new Date()
  const results: ScreeningRecommendation[] = []

  for (const test of SCREENING_TESTS) {
    // Sex filter
    if (test.sex !== 'all' && test.sex !== profile.sex) continue

    // Age filter
    if (profile.age < test.minAge) continue
    if (test.maxAge !== null && profile.age > test.maxAge) continue

    // High-risk tests: only include if user has risk factors
    if (test.riskLevel === 'high_risk' && test.riskFactors) {
      const hasRisk = test.riskFactors.some(rf => profile.riskFactors.includes(rf))
      if (!hasRisk) continue
    }

    // Calculate due date
    const lastDoneStr = profile.lastScreenings?.[test.id]
    let dueDate: Date | null = null
    let status: ScreeningRecommendation['status'] = 'on_track'

    if (test.intervalMonths === 0) {
      // One-time — only show if not done
      if (lastDoneStr) continue
      dueDate = null
      status = 'due_soon'
    } else if (lastDoneStr) {
      const lastDone = new Date(lastDoneStr)
      dueDate = new Date(lastDone)
      dueDate.setMonth(dueDate.getMonth() + test.intervalMonths)

      const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntilDue < 0) status = 'overdue'
      else if (daysUntilDue < 90) status = 'due_soon'
      else status = 'on_track'
    } else {
      // Never done — due now
      dueDate = null
      status = 'due_soon'
    }

    const priority: 1 | 2 | 3 =
      test.urgency === 'critical' ? 1 :
      test.urgency === 'important' ? 2 : 3

    const reason = lastDoneStr
      ? `ครบกำหนดตรวจอีกครั้ง`
      : test.riskFactors && profile.riskFactors.some(rf => test.riskFactors!.includes(rf))
        ? `แนะนำเนื่องจากมีปัจจัยเสี่ยง`
        : `แนะนำตามช่วงอายุ`

    results.push({ test, dueDate, status, reason, priority })
  }

  return results.sort((a, b) => {
    // Sort: overdue first, then due_soon, then priority, then on_track
    const statusOrder = { overdue: 0, due_soon: 1, on_track: 3, not_applicable: 4 }
    const sDiff = statusOrder[a.status] - statusOrder[b.status]
    if (sDiff !== 0) return sDiff
    return a.priority - b.priority
  })
}

export const RISK_FACTOR_OPTIONS = [
  { value: 'obesity', labelTh: 'น้ำหนักเกิน / อ้วน (BMI ≥25)' },
  { value: 'hypertension', labelTh: 'ความดันโลหิตสูง' },
  { value: 'diabetes', labelTh: 'เบาหวาน' },
  { value: 'smoking', labelTh: 'สูบบุหรี่' },
  { value: 'current_smoker', labelTh: 'สูบบุหรี่อยู่ปัจจุบัน' },
  { value: 'ex_smoker_20py', labelTh: 'เคยสูบบุหรี่ ≥ 20 ปี-ซอง' },
  { value: 'family_cvd', labelTh: 'ประวัติครอบครัวเป็นโรคหัวใจ' },
  { value: 'family_diabetes', labelTh: 'ประวัติครอบครัวเป็นเบาหวาน' },
  { value: 'family_breast_cancer', labelTh: 'ประวัติครอบครัวเป็นมะเร็งเต้านม' },
  { value: 'family_colorectal', labelTh: 'ประวัติครอบครัวเป็นมะเร็งลำไส้ใหญ่' },
  { value: 'hbv_infection', labelTh: 'ติดเชื้อไวรัสตับอักเสบบี (HBV)' },
  { value: 'hcv_infection', labelTh: 'ติดเชื้อไวรัสตับอักเสบซี (HCV)' },
  { value: 'cirrhosis', labelTh: 'มีตับแข็ง' },
  { value: 'chronic_illness', labelTh: 'มีโรคเรื้อรัง' },
  { value: 'prediabetes', labelTh: 'ภาวะก่อนเบาหวาน' },
  { value: 'none', labelTh: 'ไม่มีปัจจัยเสี่ยงพิเศษ' },
]

export const CATEGORY_LABELS: Record<ScreeningCategory, { th: string; icon: string; color: string }> = {
  cardiovascular: { th: 'หัวใจและหลอดเลือด', icon: '❤️', color: 'text-red-600 bg-red-50 border-red-200' },
  diabetes: { th: 'เบาหวาน', icon: '💧', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  cancer: { th: 'มะเร็ง', icon: '🎗️', color: 'text-violet-600 bg-violet-50 border-violet-200' },
  infection: { th: 'โรคติดเชื้อ', icon: '🦠', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  mental_health: { th: 'สุขภาพจิต', icon: '🧠', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  bone: { th: 'กระดูกและข้อ', icon: '🦴', color: 'text-slate-600 bg-slate-50 border-slate-200' },
  vision: { th: 'สายตาและดวงตา', icon: '👁️', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  dental: { th: 'สุขภาพช่องปาก', icon: '🦷', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  vaccine: { th: 'วัคซีน', icon: '💉', color: 'text-teal-600 bg-teal-50 border-teal-200' },
}
