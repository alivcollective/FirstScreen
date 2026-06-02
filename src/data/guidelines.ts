// Guideline Intelligence Database — FirstScreen
// The core differentiator: compare Thai MoPH vs international guidelines
// SAFETY: All content pending medical review. Educational only.
// Sources are cited but must be verified by medical team before publication.

export type EvidenceGrade = 'A' | 'B' | 'C' | 'I' | 'pending'
// A = strong evidence (RCTs/systematic reviews)
// B = moderate evidence (cohort/observational)
// C = expert consensus
// I = insufficient evidence

export type Organization =
  | 'MOPH'   // Thai Ministry of Public Health
  | 'NHSO'   // สปสช. National Health Security Office
  | 'RCPT'   // Royal College of Physicians of Thailand
  | 'WHO'
  | 'USPSTF' // US Preventive Services Task Force
  | 'NICE'   // UK National Institute for Health and Care Excellence
  | 'ESC'    // European Society of Cardiology
  | 'ADA'    // American Diabetes Association
  | 'AHA'    // American Heart Association
  | 'NCCN'   // National Comprehensive Cancer Network
  | 'IARC'   // International Agency for Research on Cancer
  | 'ACS'    // American Cancer Society
  | 'ESMO'   // European Society for Medical Oncology
  | 'AASLD'  // American Association for the Study of Liver Diseases
  | 'EASL'   // European Association for the Study of the Liver
  | 'KDIGO'  // Kidney Disease: Improving Global Outcomes

export interface GuidelineRec {
  org: Organization
  orgFullTh: string
  orgFullEn: string
  country: string
  recommendation: string       // What to do
  startingAge: string          // e.g. "45 ปี" or "40 ปีสำหรับความเสี่ยงสูง"
  frequency: string            // e.g. "ทุก 10 ปี"
  riskGroups: string[]         // special groups
  evidenceGrade: EvidenceGrade
  recommendation_en?: string
  lastUpdated: string          // "2023" or "2023-09"
  sourceUrl?: string
  keyNote?: string             // important Thai-specific note
}

export interface DiseaseGuideline {
  diseaseSlug: string
  diseaseNameTh: string
  diseaseNameEn: string
  icd10: string
  prevalenceTh: string
  primaryOrgs: Organization[]
  recommendations: GuidelineRec[]
  thaiContext: string          // Thai epidemiology context
  keyDifferences: string[]     // Notable diffs between Thai & international
  screeningTests: string[]     // Tests discussed
  faqsTh: { q: string; a: string }[]
}

// ── Helper ────────────────────────────────────────────────────

const ORG_META: Record<Organization, { country: string; color: string; badge: string }> = {
  MOPH:   { country: 'ไทย',  color: 'text-teal-700 bg-teal-50 border-teal-200',     badge: 'สธ. ไทย' },
  NHSO:   { country: 'ไทย',  color: 'text-teal-700 bg-teal-50 border-teal-200',     badge: 'สปสช.' },
  RCPT:   { country: 'ไทย',  color: 'text-teal-700 bg-teal-50 border-teal-200',     badge: 'ราชวิทยาลัย' },
  WHO:    { country: 'สากล', color: 'text-blue-700 bg-blue-50 border-blue-200',     badge: 'WHO' },
  USPSTF: { country: 'USA',  color: 'text-indigo-700 bg-indigo-50 border-indigo-200', badge: 'USPSTF' },
  NICE:   { country: 'UK',   color: 'text-violet-700 bg-violet-50 border-violet-200', badge: 'NICE' },
  ESC:    { country: 'EU',   color: 'text-sky-700 bg-sky-50 border-sky-200',         badge: 'ESC' },
  ADA:    { country: 'USA',  color: 'text-amber-700 bg-amber-50 border-amber-200',   badge: 'ADA' },
  AHA:    { country: 'USA',  color: 'text-red-700 bg-red-50 border-red-200',         badge: 'AHA' },
  NCCN:   { country: 'USA',  color: 'text-purple-700 bg-purple-50 border-purple-200', badge: 'NCCN' },
  IARC:   { country: 'สากล', color: 'text-blue-700 bg-blue-50 border-blue-200',     badge: 'IARC' },
  ACS:    { country: 'USA',  color: 'text-rose-700 bg-rose-50 border-rose-200',      badge: 'ACS' },
  ESMO:   { country: 'EU',   color: 'text-sky-700 bg-sky-50 border-sky-200',         badge: 'ESMO' },
  AASLD:  { country: 'USA',  color: 'text-orange-700 bg-orange-50 border-orange-200', badge: 'AASLD' },
  EASL:   { country: 'EU',   color: 'text-orange-700 bg-orange-50 border-orange-200', badge: 'EASL' },
  KDIGO:  { country: 'สากล', color: 'text-blue-700 bg-blue-50 border-blue-200',     badge: 'KDIGO' },
}

export function getOrgMeta(org: Organization) {
  return ORG_META[org]
}

// ════════════════════════════════════════════════════════════════
// 1. CARDIOVASCULAR / HEART DISEASE
// ════════════════════════════════════════════════════════════════

const heartGuideline: DiseaseGuideline = {
  diseaseSlug: 'heart-disease',
  diseaseNameTh: 'โรคหัวใจและหลอดเลือด',
  diseaseNameEn: 'Cardiovascular Disease',
  icd10: 'I25',
  prevalenceTh: 'สาเหตุการเสียชีวิตอันดับ 1 ของไทย ~27% ของการเสียชีวิตทั้งหมด',
  primaryOrgs: ['MOPH', 'NHSO', 'ESC', 'AHA'],
  thaiContext: 'ประเทศไทยมีอัตราโรคหัวใจสูงขึ้นอย่างรวดเร็วเนื่องจากการเปลี่ยนแปลงวิถีชีวิต อาหารตะวันตก และอัตราการสูบบุหรี่ที่ยังสูง แนวทางไทยปรับ Framingham Risk เพื่อให้เหมาะกับประชากรเอเชีย',
  keyDifferences: [
    'แนวทางไทยกำหนดเป้าหมาย LDL ต่ำกว่า USPSTF สำหรับผู้ป่วยเบาหวาน',
    'NHSO ครอบคลุมการตรวจคอเลสเตอรอลฟรีสำหรับผู้ใหญ่อายุ 35+ ปี',
    'ESC แนะนำ Total Cardiovascular Risk Assessment แทนการดู LDL อย่างเดียว',
    'AHA/ACC 2023 ปรับ Pooled Cohort Equations ใหม่ แต่ยังไม่ได้รับรองสำหรับประชากรไทย',
  ],
  screeningTests: ['Blood Pressure', 'Lipid Profile', 'Fasting Blood Sugar', 'BMI/Waist', 'ECG (high risk)', 'Coronary CT (selected)'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'กรมควบคุมโรค กระทรวงสาธารณสุข',
      orgFullEn: 'Department of Disease Control, Thai MOPH',
      country: 'ไทย',
      recommendation: 'ตรวจความดันโลหิตและไขมันในเลือดสำหรับผู้ใหญ่ ประเมิน CVD Risk 10 ปีด้วย Thai CVD Risk Score',
      startingAge: '35 ปีขึ้นไป (เร็วกว่าถ้ามีปัจจัยเสี่ยง)',
      frequency: 'ทุก 1-3 ปีตามระดับความเสี่ยง',
      riskGroups: ['ผู้สูบบุหรี่', 'เบาหวาน', 'ความดันสูง', 'ประวัติครอบครัว CVD', 'อ้วน'],
      evidenceGrade: 'B',
      lastUpdated: '2565',
      keyNote: 'สปสช. ครอบคลุมการตรวจ BP + Lipid ฟรีในชุดสิทธิประโยชน์',
    },
    {
      org: 'NHSO',
      orgFullTh: 'สำนักงานหลักประกันสุขภาพแห่งชาติ',
      orgFullEn: 'National Health Security Office',
      country: 'ไทย',
      recommendation: 'ตรวจ Blood Pressure, Lipid Profile, Fasting Blood Sugar ฟรีในชุดสิทธิประโยชน์',
      startingAge: '35 ปี',
      frequency: 'ทุก 5 ปี (ทุกปีถ้าเสี่ยงสูง)',
      riskGroups: ['ทุกคนอายุ 35+', 'เสี่ยงสูงเริ่มเร็วกว่า'],
      evidenceGrade: 'B',
      lastUpdated: '2566',
    },
    {
      org: 'ESC',
      orgFullTh: 'European Society of Cardiology',
      orgFullEn: 'European Society of Cardiology',
      country: 'EU',
      recommendation: 'ประเมิน Total Cardiovascular Risk ด้วย SCORE2 ตรวจ Lipid Profile, BP, Blood Sugar, BMI',
      startingAge: '40 ปี (หรือเร็วกว่าถ้ามีปัจจัยเสี่ยง)',
      frequency: 'ทุก 5 ปีถ้าความเสี่ยงต่ำ ทุก 1-2 ปีถ้าเสี่ยงสูง',
      riskGroups: ['สูบบุหรี่', 'Diabetes', 'Hypertension', 'Dyslipidemia', 'FH', 'Obesity'],
      evidenceGrade: 'A',
      lastUpdated: '2021',
      keyNote: 'SCORE2 ปรับสำหรับ European populations ยังไม่ validated สำหรับไทย',
    },
    {
      org: 'AHA',
      orgFullTh: 'American Heart Association / American College of Cardiology',
      orgFullEn: 'AHA/ACC',
      country: 'USA',
      recommendation: 'ประเมิน 10-year ASCVD Risk ด้วย Pooled Cohort Equations ตรวจ Lipid, BP, Blood Sugar, BMI',
      startingAge: '40 ปี (อาจเริ่ม 20 ปีถ้าปัจจัยเสี่ยงสูง)',
      frequency: 'ทุก 4-6 ปีถ้า low risk / พิจารณายาถ้า 7.5%+ risk',
      riskGroups: ['สูบบุหรี่', 'Diabetes', 'Hypertension', 'CKD', 'ประวัติครอบครัว'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
      keyNote: 'Pooled Cohort Equations อาจ overestimate สำหรับชาวเอเชีย',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'US Preventive Services Task Force',
      country: 'USA',
      recommendation: 'Statin preventive therapy สำหรับผู้ที่มี CVD risk ≥10% ในคน 40-75 ปี ที่มีปัจจัยเสี่ยง',
      startingAge: '40 ปี',
      frequency: 'ประเมินทุก 5 ปี',
      riskGroups: ['Dyslipidemia', 'Diabetes', 'Hypertension', 'สูบบุหรี่'],
      evidenceGrade: 'B',
      lastUpdated: '2022',
    },
  ],
  faqsTh: [
    { q: 'ควรเริ่มตรวจหัวใจอายุเท่าไหร่?', a: 'แนวทางไทยแนะนำเริ่มตรวจ Blood Pressure และ Lipid Profile ตั้งแต่อายุ 35 ปี ถ้ามีปัจจัยเสี่ยง (สูบบุหรี่ เบาหวาน ความดัน) ควรเริ่มก่อน แนวทาง ESC และ AHA แนะนำ 40 ปี แต่ก็สามารถเริ่มก่อนหากมีความเสี่ยง' },
    { q: 'Framingham Risk Score กับ Thai CVD Risk Score ต่างกันอย่างไร?', a: 'Framingham พัฒนาจากประชากรอเมริกัน ซึ่งอาจ overestimate ความเสี่ยงในชาวเอเชีย Thai CVD Risk Score พัฒนาจากข้อมูลประชากรไทยโดยตรง ให้ผลแม่นยำกว่าสำหรับคนไทย' },
    { q: 'สปสช. ครอบคลุมการตรวจหัวใจอะไรบ้าง?', a: 'สปสช. ครอบคลุม Blood Pressure วัดฟรี, Lipid Profile ทุก 5 ปีสำหรับอายุ 35+, Fasting Blood Sugar ทุก 3 ปี รายละเอียดขึ้นกับสิทธิ์ของแต่ละคน' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 2. DIABETES
// ════════════════════════════════════════════════════════════════

const diabetesGuideline: DiseaseGuideline = {
  diseaseSlug: 'type-2-diabetes',
  diseaseNameTh: 'เบาหวานชนิดที่ 2',
  diseaseNameEn: 'Type 2 Diabetes',
  icd10: 'E11',
  prevalenceTh: '5+ ล้านคนไทยเป็นเบาหวาน ~1/3 ไม่รู้ตัว',
  primaryOrgs: ['MOPH', 'NHSO', 'ADA', 'WHO'],
  thaiContext: 'ไทยใช้ Asian BMI cutoffs (23/27.5) สำหรับการคัดกรองเบาหวาน เนื่องจากชาวเอเชียมีความเสี่ยงสูงกว่าที่ BMI ต่ำกว่าเมื่อเทียบกับ Caucasian',
  keyDifferences: [
    'ไทยและ ADA ใช้ BMI ≥23 สำหรับเอเชียเพื่อเริ่มคัดกรอง (WHO ยังแนะนำ 25)',
    'NHSO คัดกรองเบาหวานฟรีในโปรแกรม check up ตั้งแต่อายุ 35 ปี',
    'ADA 2024 แนะนำเริ่มคัดกรองที่ 35 ปี หรือเร็วกว่าถ้า BMI ≥23 (Asian)',
    'Prediabetes management ยังไม่มีในชุดสิทธิประโยชน์ NHSO อย่างชัดเจน',
  ],
  screeningTests: ['Fasting Blood Sugar (FBS)', 'HbA1c', 'Oral Glucose Tolerance Test (OGTT)', 'Random Blood Sugar'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'กรมควบคุมโรค / สมาคมโรคเบาหวานแห่งประเทศไทย',
      orgFullEn: 'DDC / Diabetes Association of Thailand',
      country: 'ไทย',
      recommendation: 'ตรวจ FBS หรือ HbA1c สำหรับทุกคนอายุ 35+ หรือ BMI ≥23 ในอายุน้อยกว่าที่มีปัจจัยเสี่ยง',
      startingAge: '35 ปี (เร็วกว่าถ้า BMI ≥23 + ปัจจัยเสี่ยง)',
      frequency: 'ทุก 3 ปีถ้าปกติ ทุกปีถ้า Prediabetes หรือเสี่ยงสูง',
      riskGroups: ['BMI ≥23', 'ประวัติครอบครัว', 'ความดันสูง', 'ไขมันผิดปกติ', 'เคยเป็นเบาหวานขณะตั้งครรภ์'],
      evidenceGrade: 'A',
      lastUpdated: '2565',
      keyNote: 'แนวทาง DAT 2565 ปรับ Asian BMI cutoff เป็น 23 แล้ว',
    },
    {
      org: 'NHSO',
      orgFullTh: 'สปสช.',
      orgFullEn: 'NHSO',
      country: 'ไทย',
      recommendation: 'ตรวจ Fasting Blood Sugar ฟรีทุก 3 ปีในชุดสิทธิประโยชน์',
      startingAge: '35 ปี',
      frequency: 'ทุก 3 ปี (ทุกปีถ้าเสี่ยงสูง)',
      riskGroups: ['ทุกคนอายุ 35+'],
      evidenceGrade: 'B',
      lastUpdated: '2566',
      keyNote: 'บริการฟรีที่ รพ.รัฐ ภายใต้ชุดสิทธิประโยชน์ป้องกันโรค',
    },
    {
      org: 'ADA',
      orgFullTh: 'American Diabetes Association',
      orgFullEn: 'American Diabetes Association',
      country: 'USA',
      recommendation: 'ตรวจ FBS หรือ HbA1c หรือ OGTT — เริ่ม 35 ปี หรือเร็วกว่าถ้า BMI ≥23 (Asian) + ≥1 ปัจจัยเสี่ยง',
      startingAge: '35 ปี (Asian: BMI ≥23 ในอายุใดก็ได้ถ้ามีปัจจัยเสี่ยง)',
      frequency: 'ทุก 3 ปีถ้าปกติ ทุกปีถ้า Prediabetes',
      riskGroups: ['BMI ≥23 (Asian)', 'ครอบครัวเป็นเบาหวาน', 'ความดันสูง', 'GDM', 'PCOS', 'Pre-diabetes'],
      evidenceGrade: 'B',
      lastUpdated: '2024',
      keyNote: 'ADA 2024 ยืนยัน BMI ≥23 สำหรับ Asian Americans เป็นเกณฑ์คัดกรอง',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'USPSTF',
      country: 'USA',
      recommendation: 'คัดกรอง Prediabetes/T2D ในผู้ใหญ่ 35-70 ปีที่มีน้ำหนักเกินหรืออ้วน',
      startingAge: '35 ปี (BMI ≥25 สำหรับ non-Asian)',
      frequency: 'ทุก 3 ปี',
      riskGroups: ['BMI ≥25 (หรือ ≥23 สำหรับ Asian)'],
      evidenceGrade: 'B',
      lastUpdated: '2021',
    },
    {
      org: 'WHO',
      orgFullTh: 'องค์การอนามัยโลก',
      orgFullEn: 'World Health Organization',
      country: 'สากล',
      recommendation: 'คัดกรองในประชากรที่มีความชุกสูงและมีระบบสุขภาพรองรับการรักษา Prediabetes',
      startingAge: 'ขึ้นกับความชุกในแต่ละประเทศ',
      frequency: 'ไม่ได้ระบุชัดเจน — ขึ้นกับบริบท',
      riskGroups: ['ประชากรที่มีความเสี่ยงสูง', 'คนอ้วน', 'ประวัติครอบครัว'],
      evidenceGrade: 'B',
      lastUpdated: '2023',
    },
    {
      org: 'NICE',
      orgFullTh: 'NICE (UK)',
      orgFullEn: 'National Institute for Health and Care Excellence',
      country: 'UK',
      recommendation: 'ใช้ Leicester Practice Risk Score หรือ QDiabetes tool ในการคัดกรอง ตรวจ HbA1c ถ้าเสี่ยงสูง',
      startingAge: '25 ปีสำหรับกลุ่มเสี่ยง (South Asian, African, Caribbean)',
      frequency: 'ทุกปีถ้า Prediabetes',
      riskGroups: ['ชาติพันธุ์เสี่ยงสูง', 'BMI สูง', 'ความดัน', 'ครอบครัว'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
      keyNote: 'NICE แนะนำ lower threshold สำหรับกลุ่มชาติพันธุ์เอเชีย รวมถึงคนไทย',
    },
  ],
  faqsTh: [
    { q: 'BMI เท่าไหร่ถึงควรตรวจเบาหวาน?', a: 'สำหรับคนไทยและเอเชีย ADA และแนวทางไทยแนะนำ BMI ≥23 เป็นเกณฑ์เริ่มคัดกรอง ซึ่งต่ำกว่าเกณฑ์ทั่วไปที่ ≥25 เนื่องจากชาวเอเชียมีความเสี่ยงเบาหวานสูงกว่าที่ BMI ต่ำกว่า' },
    { q: 'FBS กับ HbA1c ต่างกันอย่างไร?', a: 'FBS (Fasting Blood Sugar) วัดน้ำตาลหลังอดอาหาร 8 ชั่วโมง ปกติ <100 mg/dL HbA1c วัดค่าเฉลี่ยน้ำตาล 3 เดือน ปกติ <5.7% HbA1c สะดวกกว่าเพราะไม่ต้องอดอาหาร แต่อาจคลาดเคลื่อนในบางภาวะ' },
    { q: 'Prediabetes รักษาหายได้ไหม?', a: 'Prediabetes สามารถกลับสู่ปกติได้ถ้าปรับวิถีชีวิต งานวิจัย DPP แสดงว่าการลดน้ำหนัก 5-7% + ออกกำลังกาย 150 นาที/สัปดาห์ ลดความเสี่ยงกลายเป็นเบาหวานได้ 58%' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 3. HYPERTENSION
// ════════════════════════════════════════════════════════════════

const hypertensionGuideline: DiseaseGuideline = {
  diseaseSlug: 'hypertension',
  diseaseNameTh: 'ความดันโลหิตสูง',
  diseaseNameEn: 'Hypertension',
  icd10: 'I10',
  prevalenceTh: '13+ ล้านคน อายุ 15+ ปีในไทย มีความดันสูง — 1 ใน 3 ไม่รู้ตัว',
  primaryOrgs: ['MOPH', 'NHSO', 'ESC', 'AHA'],
  thaiContext: 'Thai Hypertension Society แนะนำ threshold เดียวกับ AHA (≥130/80) แต่ NHSO กำหนดสิทธิ์รักษาที่ ≥140/90',
  keyDifferences: [
    'AHA 2017 ปรับ threshold จาก 140/90 เป็น 130/80 แต่ไทยยังใช้ 140/90 เป็นเกณฑ์เริ่มยา',
    'ESC 2018 คงที่ 140/90 เป็น threshold รักษา',
    'NHSO ครอบคลุมยาลดความดันตามบัญชียาหลัก',
    'Salt reduction goal: ไทย <2300 mg/day ตาม WHO / AHA แนะนำ <1500 mg/day สำหรับเสี่ยงสูง',
  ],
  screeningTests: ['Blood Pressure Measurement', 'Ambulatory BP Monitoring (ABPM)', 'Home BP Monitoring'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'สมาคมความดันโลหิตสูงแห่งประเทศไทย / กรมควบคุมโรค',
      orgFullEn: 'Thai Hypertension Society',
      country: 'ไทย',
      recommendation: 'วัดความดันโลหิตสำหรับทุกคนอายุ 18+ ปี เป้าหมาย BP <130/80 สำหรับคนทั่วไป',
      startingAge: '18 ปี',
      frequency: 'ทุก 2 ปีถ้าปกติ ทุกปีถ้า 120-129/<80 ทุก 3-6 เดือนถ้า Stage 1+',
      riskGroups: ['ทุกคนอายุ 18+', 'เสี่ยงสูง: อ้วน เบาหวาน ประวัติครอบครัว สูบบุหรี่'],
      evidenceGrade: 'A',
      lastUpdated: '2565',
      keyNote: 'เริ่มยาเมื่อ BP ≥140/90 ตาม NHSO / เริ่มที่ ≥130/80 ถ้า High CVD risk',
    },
    {
      org: 'AHA',
      orgFullTh: 'American Heart Association',
      orgFullEn: 'AHA/ACC 2017 Hypertension Guideline',
      country: 'USA',
      recommendation: 'คัดกรองทุกคนอายุ ≥18 ปี กำหนด Stage 1 HTN ที่ 130-139/80-89 mmHg',
      startingAge: '18 ปี',
      frequency: 'ทุกปีถ้า normal / ทุก 3-6 เดือนถ้า Elevated',
      riskGroups: ['ทุกคน', 'African Americans เสี่ยงสูงเป็นพิเศษ'],
      evidenceGrade: 'A',
      lastUpdated: '2017',
      keyNote: 'Lowered threshold to 130/80 — ยังเป็น controversial guideline',
    },
    {
      org: 'ESC',
      orgFullTh: 'European Society of Cardiology / ESH',
      orgFullEn: 'ESC/ESH Hypertension Guidelines',
      country: 'EU',
      recommendation: 'คัดกรองทุกคนอายุ ≥18 ปี กำหนด threshold รักษาที่ ≥140/90 mmHg',
      startingAge: '18 ปี',
      frequency: 'ทุก 2-5 ปีถ้าปกติ',
      riskGroups: ['ทุกคน', 'เสี่ยงสูง: เบาหวาน โรคไต CKD'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'USPSTF',
      country: 'USA',
      recommendation: 'คัดกรอง Hypertension ในผู้ใหญ่ ≥18 ปี ด้วยการวัดความดันในคลินิก',
      startingAge: '18 ปี',
      frequency: 'ทุกปีถ้า Elevated BP / ทุก 2 ปีถ้าปกติ',
      riskGroups: ['ทุกคน'],
      evidenceGrade: 'A',
      lastUpdated: '2021',
    },
    {
      org: 'NICE',
      orgFullTh: 'NICE (UK)',
      orgFullEn: 'NICE Hypertension Guidelines',
      country: 'UK',
      recommendation: 'วัด BP ทุกคนอายุ ≥40 ปี ทุก 5 ปี ยืนยันด้วย ABPM ก่อนวินิจฉัย',
      startingAge: '40 ปีสำหรับ routine / เร็วกว่าถ้าเสี่ยง',
      frequency: 'ทุก 5 ปีสำหรับอายุ 40+',
      riskGroups: ['ทุกคนอายุ 40+', 'ครอบครัวเป็น HTN'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
      keyNote: 'NICE แนะนำ ABPM/HBPM ยืนยันก่อน diagnosis เพื่อหลีกเลี่ยง White Coat HTN',
    },
  ],
  faqsTh: [
    { q: 'ความดัน 130/80 ถือว่าสูงไหม?', a: 'ขึ้นกับแนวทางที่ใช้ AHA 2017 จัดว่า Stage 1 Hypertension ESC และแนวทางไทยส่วนใหญ่ยังจัดเป็น Elevated BP แนะนำปรับวิถีชีวิตก่อน เริ่มยาเมื่อ ≥140/90 ยกเว้นมี CVD risk สูงมาก' },
    { q: 'วัดความดันที่บ้านน่าเชื่อถือไหม?', a: 'เครื่องวัดความดันที่บ้านที่ผ่านมาตรฐาน (validated devices) น่าเชื่อถือดี NICE แนะนำให้ใช้ยืนยันการวินิจฉัยด้วยซ้ำ ควรวัด 2 ครั้ง ห่างกัน 1-2 นาที ในตอนเช้า และตอนเย็น ต่อเนื่อง 7 วัน' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 4. COLORECTAL CANCER
// ════════════════════════════════════════════════════════════════

const colorectalGuideline: DiseaseGuideline = {
  diseaseSlug: 'colorectal-cancer',
  diseaseNameTh: 'มะเร็งลำไส้ใหญ่และทวารหนัก',
  diseaseNameEn: 'Colorectal Cancer',
  icd10: 'C18',
  prevalenceTh: '~15,000 รายใหม่/ปี อันดับ 3 ในชายไทย อันดับ 4 ในหญิงไทย',
  primaryOrgs: ['MOPH', 'USPSTF', 'ACS', 'NCCN'],
  thaiContext: 'NHSO เพิ่งเริ่มโครงการคัดกรองมะเร็งลำไส้ใหญ่ด้วย FIT test ฟรีในปีงบประมาณ 2566 สำหรับอายุ 50+ ปี ซึ่งช้ากว่า USPSTF ที่แนะนำ 45 ปี',
  keyDifferences: [
    'NHSO เริ่ม FIT screening ที่ 50 ปี แต่ ACS/USPSTF แนะนำ 45 ปีแล้ว',
    'NCCN/ACS แนะนำ Colonoscopy ทุก 10 ปีเป็นมาตรฐาน ไทยส่วนใหญ่ใช้ FIT ทุกปี',
    'ประชากรไทยยังเข้าถึง Colonoscopy น้อยเนื่องจากต้นทุนสูง',
    'FIT test ราคา 200-300 บาท Colonoscopy 3,000-10,000+ บาท (เอกชน)',
  ],
  screeningTests: ['FIT (Fecal Immunochemical Test)', 'Colonoscopy', 'CT Colonography', 'Flexible Sigmoidoscopy', 'FOBT'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'กรมการแพทย์ / กรมควบคุมโรค',
      orgFullEn: 'Department of Medical Services, Thai MOPH',
      country: 'ไทย',
      recommendation: 'FIT test (Fecal Immunochemical Test) สำหรับทุกคนอายุ 50+ ปี',
      startingAge: '50 ปี (เร็วกว่าถ้ามีประวัติครอบครัวหรือ Lynch syndrome)',
      frequency: 'FIT ทุกปี / Colonoscopy ถ้า FIT positive หรือทุก 5-10 ปีถ้าปกติ',
      riskGroups: ['ประวัติครอบครัวมะเร็งลำไส้', 'Lynch Syndrome', 'FAP', 'IBD เรื้อรัง'],
      evidenceGrade: 'B',
      lastUpdated: '2566',
      keyNote: 'สปสช. เริ่มโครงการ FIT ฟรีในปี 2566 สำหรับอายุ 50-70 ปี',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'USPSTF',
      country: 'USA',
      recommendation: 'คัดกรองมะเร็งลำไส้ใหญ่ในทุกคนอายุ 45-75 ปี ด้วย FIT, Colonoscopy, CT Colonography',
      startingAge: '45 ปี (ปรับลงจาก 50 ในปี 2021)',
      frequency: 'FIT ทุกปี หรือ Colonoscopy ทุก 10 ปี หรือ CT Colonography ทุก 5 ปี',
      riskGroups: ['ทุกคนอายุ 45-75', 'เสี่ยงสูง: เริ่มเร็วกว่า'],
      evidenceGrade: 'A',
      lastUpdated: '2021',
      keyNote: 'USPSTF ปรับลดอายุจาก 50 เป็น 45 ปีในปี 2021 — อ้างอิงอัตราการเกิดในคนอายุน้อยเพิ่มขึ้น',
    },
    {
      org: 'ACS',
      orgFullTh: 'American Cancer Society',
      orgFullEn: 'American Cancer Society',
      country: 'USA',
      recommendation: 'เริ่มคัดกรองที่ 45 ปี สำหรับผู้ที่มีความเสี่ยงปกติ ด้วยวิธีต่างๆ',
      startingAge: '45 ปี',
      frequency: 'ขึ้นกับวิธี: FIT ทุกปี / Colonoscopy ทุก 10 ปี',
      riskGroups: ['ทุกคนอายุ 45-75', 'เสี่ยงสูงเริ่มที่ 40 หรือ 10 ปีก่อนญาติที่ป่วยอายุน้อยที่สุด'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
    },
    {
      org: 'NCCN',
      orgFullTh: 'National Comprehensive Cancer Network',
      orgFullEn: 'NCCN',
      country: 'USA',
      recommendation: 'Colonoscopy ทุก 10 ปีสำหรับ average risk / Colonoscopy ทุก 1-5 ปีสำหรับ high risk',
      startingAge: '45 ปี (average risk)',
      frequency: 'Colonoscopy ทุก 10 ปี (ถ้าไม่พบ polyp)',
      riskGroups: ['High risk: Lynch Syndrome เริ่ม 20-25 ปี', 'FAP: เริ่ม 10-15 ปี', 'IBD: 8-10 ปีหลัง diagnosis'],
      evidenceGrade: 'A',
      lastUpdated: '2024',
    },
    {
      org: 'NICE',
      orgFullTh: 'NICE (UK)',
      orgFullEn: 'NICE',
      country: 'UK',
      recommendation: 'NHS Bowel Cancer Screening: FIT ทุก 2 ปี อายุ 50-74 ปี',
      startingAge: '50 ปี',
      frequency: 'FIT ทุก 2 ปี',
      riskGroups: ['ทุกคนอายุ 50-74', 'เสี่ยงสูง: colonoscopy surveillance'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
    },
  ],
  faqsTh: [
    { q: 'FIT test กับ Colonoscopy ต่างกันอย่างไร?', a: 'FIT (Fecal Immunochemical Test) เป็นการตรวจเลือดในอุจจาระ ราคาถูก (~200-300 บาท) ทำเองที่บ้านได้ ต้องทำทุกปี ถ้าผลบวกต้องตาม Colonoscopy ต่อ Colonoscopy เป็นมาตรฐานทองคำ ดูได้ตรงๆ และตัดติ่งเนื้อได้ในครั้งเดียว ราคา 3,000-15,000 บาท ทำทุก 10 ปีถ้าปกติ' },
    { q: 'NHSO ครอบคลุม FIT test ไหม?', a: 'สปสช. เริ่มโครงการ FIT test ฟรีสำหรับอายุ 50-70 ปี ในปีงบประมาณ 2566 ขึ้นอยู่กับโควตาของแต่ละโรงพยาบาล แนะนำติดต่อโรงพยาบาลใกล้บ้านเพื่อสอบถาม' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 5. BREAST CANCER
// ════════════════════════════════════════════════════════════════

const breastCancerGuideline: DiseaseGuideline = {
  diseaseSlug: 'breast-cancer',
  diseaseNameTh: 'มะเร็งเต้านม',
  diseaseNameEn: 'Breast Cancer',
  icd10: 'C50',
  prevalenceTh: '~26,000 รายใหม่/ปี มะเร็งอันดับ 1 ในผู้หญิงไทย',
  primaryOrgs: ['MOPH', 'NHSO', 'USPSTF', 'ACS'],
  thaiContext: 'ผู้หญิงไทยมักตรวจพบมะเร็งเต้านมในระยะที่ 2-3 เนื่องจากขาดการคัดกรอง Mammogram NHSO ครอบคลุม Mammogram ฟรีสำหรับอายุ 40-70 ปี 1 ครั้ง/ปี',
  keyDifferences: [
    'USPSTF 2024 ลดอายุเริ่ม Mammogram จาก 50 เป็น 40 ปี',
    'NHSO ครอบคลุม Mammogram ฟรี แต่คิวยาวในโรงพยาบาลรัฐ',
    'ACS แนะนำ annual Mammogram ตั้งแต่ 40 ปี',
    'ผู้หญิงไทยมี Breast density สูงกว่าเฉลี่ย อาจลด Mammogram sensitivity',
  ],
  screeningTests: ['Mammogram (2D/3D Tomosynthesis)', 'Breast Ultrasound', 'MRI (high risk)', 'Clinical Breast Exam'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'กรมการแพทย์ / สมาคมโรคมะเร็งแห่งประเทศไทย',
      orgFullEn: 'DMS / Thai Cancer Society',
      country: 'ไทย',
      recommendation: 'Mammogram ทุก 1-2 ปีสำหรับผู้หญิงอายุ 40-70 ปี และตรวจเต้านมด้วยตนเองทุกเดือน',
      startingAge: '40 ปี (เร็วกว่าถ้ามีปัจจัยเสี่ยงสูง)',
      frequency: 'ทุกปี หรือทุก 2 ปี',
      riskGroups: ['ทุกผู้หญิงอายุ 40+', 'เสี่ยงสูง: ครอบครัว BRCA mutation Dense breast'],
      evidenceGrade: 'B',
      lastUpdated: '2566',
      keyNote: 'สปสช. ครอบคลุม Mammogram ฟรีปีละ 1 ครั้งสำหรับอายุ 40-70',
    },
    {
      org: 'NHSO',
      orgFullTh: 'สปสช.',
      orgFullEn: 'NHSO',
      country: 'ไทย',
      recommendation: 'Mammogram ฟรี 1 ครั้ง/ปีในชุดสิทธิประโยชน์',
      startingAge: '40 ปี',
      frequency: 'ทุกปี',
      riskGroups: ['ผู้หญิงอายุ 40-70 ปี'],
      evidenceGrade: 'B',
      lastUpdated: '2566',
      keyNote: 'ติดต่อโรงพยาบาลประจำตามสิทธิ์เพื่อนัด Mammogram ฟรี',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'USPSTF',
      country: 'USA',
      recommendation: 'Mammogram ทุก 2 ปีสำหรับผู้หญิงทุกคนอายุ 40-74 ปี',
      startingAge: '40 ปี (ปรับลงจาก 50 ในปี 2024)',
      frequency: 'ทุก 2 ปี (50-74 ปี)',
      riskGroups: ['ทุกผู้หญิงอายุ 40-74', 'BRCA+: MRI เพิ่มเติม'],
      evidenceGrade: 'B',
      lastUpdated: '2024',
      keyNote: 'USPSTF 2024 ปรับลดอายุจาก 50 เป็น 40 — major policy change',
    },
    {
      org: 'ACS',
      orgFullTh: 'American Cancer Society',
      orgFullEn: 'ACS',
      country: 'USA',
      recommendation: 'Annual Mammogram ตั้งแต่ 40 ปี ต่อเนื่องตลอดชีวิตถ้าสุขภาพดี',
      startingAge: '40 ปี',
      frequency: 'ทุกปี',
      riskGroups: ['ทุกผู้หญิง 40+', 'BRCA / High-risk: MRI + Mammogram'],
      evidenceGrade: 'B',
      lastUpdated: '2023',
    },
    {
      org: 'NICE',
      orgFullTh: 'NICE (UK) / NHS Breast Screening Programme',
      orgFullEn: 'NICE/NHS',
      country: 'UK',
      recommendation: 'NHS Breast Screening: Mammogram ทุก 3 ปี อายุ 50-70 ปี',
      startingAge: '50 ปี',
      frequency: 'ทุก 3 ปี',
      riskGroups: ['ผู้หญิงอายุ 50-70', 'เสี่ยงสูง: กรรมพันธุ์ — เริ่ม 40 ปี'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
    },
  ],
  faqsTh: [
    { q: '2D vs 3D Mammogram ต่างกันอย่างไร?', a: '3D Mammogram (Tomosynthesis) แม่นยำกว่า โดยเฉพาะในผู้หญิงที่มี Dense Breast พบ Cancer เพิ่มขึ้น 15-20% ลด False Positive แต่ราคาสูงกว่าประมาณ 500-1,500 บาท' },
    { q: 'ตรวจเต้านมด้วยตนเองยังจำเป็นอยู่ไหม?', a: 'แนวทางใหม่ส่วนใหญ่ไม่แนะนำ BSE (Breast Self-Exam) อย่างเป็นทางการแล้ว เพราะไม่ช่วยลดการเสียชีวิต แต่การ Breast Awareness — รู้จักลักษณะปกติของตัวเอง แล้วไปพบแพทย์เมื่อพบความผิดปกติ — ยังสำคัญมาก' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 6. CERVICAL CANCER
// ════════════════════════════════════════════════════════════════

const cervicalGuideline: DiseaseGuideline = {
  diseaseSlug: 'cervical-cancer',
  diseaseNameTh: 'มะเร็งปากมดลูก',
  diseaseNameEn: 'Cervical Cancer',
  icd10: 'C53',
  prevalenceTh: '~8,000 รายใหม่/ปี อันดับ 2 ในผู้หญิงไทย',
  primaryOrgs: ['MOPH', 'NHSO', 'USPSTF', 'WHO'],
  thaiContext: 'ไทยมีความชุก HPV สูง ประมาณ 10-15% ของผู้หญิงวัยเจริญพันธุ์ โครงการฉีดวัคซีน HPV ฟรีสำหรับนักเรียนหญิงชั้น ป.5-6 เริ่มปี 2560',
  keyDifferences: [
    'NHSO ครอบคลุม Pap Smear ฟรีทุก 3 ปีสำหรับผู้หญิง 30-60 ปี',
    'WHO แนะนำ HPV DNA testing เป็น primary screen แทน Pap Smear',
    'USPSTF แนะนำ Pap + HPV co-test ทุก 5 ปีสำหรับอายุ 30-65',
    'วัคซีน HPV ฟรีในโปรแกรม EPI สำหรับเด็กหญิง ป.5-6',
  ],
  screeningTests: ['Pap Smear (Cervical Cytology)', 'HPV DNA Test', 'Co-testing (Pap + HPV)', 'VIA (Visual Inspection with Acetic Acid)'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'กรมการแพทย์ / กรมควบคุมโรค',
      orgFullEn: 'DMS, Thai MOPH',
      country: 'ไทย',
      recommendation: 'Pap Smear ทุก 3-5 ปีสำหรับผู้หญิงที่มีเพศสัมพันธ์แล้ว อายุ 25-65 ปี',
      startingAge: '25 ปี หรือ 3 ปีหลังมีเพศสัมพันธ์ครั้งแรก',
      frequency: 'ทุก 3 ปี (Pap alone) หรือ ทุก 5 ปี (HPV test)',
      riskGroups: ['ผู้หญิงที่มีเพศสัมพันธ์', 'HIV positive', 'Immunocompromised'],
      evidenceGrade: 'A',
      lastUpdated: '2565',
      keyNote: 'สปสช. ครอบคลุม Pap Smear ฟรีทุก 3 ปีสำหรับอายุ 30-60 ปี',
    },
    {
      org: 'WHO',
      orgFullTh: 'องค์การอนามัยโลก',
      orgFullEn: 'WHO',
      country: 'สากล',
      recommendation: 'HPV DNA test เป็น primary screen แทน Pap Smear (90/70 strategy)',
      startingAge: '30 ปี (25 ปีสำหรับ HIV positive)',
      frequency: 'ทุก 5-10 ปี (HPV test)',
      riskGroups: ['ทุกผู้หญิงอายุ 30-65', 'HIV: เริ่ม 25 ปี ถี่ขึ้น'],
      evidenceGrade: 'A',
      lastUpdated: '2022',
      keyNote: 'WHO 2022 แนะนำ HPV DNA test ทุก 5-10 ปี เป็น preferred method แทน Pap',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'USPSTF',
      country: 'USA',
      recommendation: 'Pap ทุก 3 ปี (อายุ 21-65) หรือ Pap+HPV co-test ทุก 5 ปี (อายุ 30-65)',
      startingAge: '21 ปี (Pap) / 30 ปี (Co-test)',
      frequency: 'ทุก 3 ปี หรือ 5 ปี (co-test)',
      riskGroups: ['ทุกผู้หญิง 21-65'],
      evidenceGrade: 'A',
      lastUpdated: '2018',
    },
    {
      org: 'NICE',
      orgFullTh: 'NHS Cervical Screening Programme',
      orgFullEn: 'NHS/NICE',
      country: 'UK',
      recommendation: 'HPV primary screening ทุก 3 ปี (อายุ 25-49) ทุก 5 ปี (50-64)',
      startingAge: '25 ปี',
      frequency: 'ทุก 3 ปี (25-49) / ทุก 5 ปี (50-64)',
      riskGroups: ['ทุกผู้หญิง 25-64'],
      evidenceGrade: 'A',
      lastUpdated: '2023',
      keyNote: 'UK เปลี่ยนมาใช้ HPV primary screen แล้ว ทดแทน Pap',
    },
  ],
  faqsTh: [
    { q: 'วัคซีน HPV ฉีดแล้วยังต้องทำ Pap Smear ไหม?', a: 'ต้องตรวจต่อค่ะ วัคซีน HPV ป้องกัน HPV สายพันธุ์หลัก (16,18) แต่ยังมีสายพันธุ์อื่นอีก การฉีดวัคซีนลดความเสี่ยงได้ 70-90% แต่ไม่ 100% จึงยังต้องตรวจ Pap Smear หรือ HPV test ตามปกติ' },
    { q: 'HPV test กับ Pap Smear ต่างกันอย่างไร?', a: 'Pap Smear ตรวจดูเซลล์ผิดปกติบริเวณปากมดลูก HPV test ตรวจหาเชื้อไวรัส HPV โดยตรง HPV test sensitive กว่า Pap Smear และสามารถทำทุก 5 ปีแทนที่จะ 3 ปี แนวทางใหม่ทั่วโลกมุ่งไปใช้ HPV test เป็น primary screen' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 7. LUNG CANCER
// ════════════════════════════════════════════════════════════════

const lungCancerGuideline: DiseaseGuideline = {
  diseaseSlug: 'lung-cancer',
  diseaseNameTh: 'มะเร็งปอด',
  diseaseNameEn: 'Lung Cancer',
  icd10: 'C34',
  prevalenceTh: 'Top 5 มะเร็งในไทย — อัตราการเสียชีวิตสูงที่สุดในบรรดามะเร็งทั้งหมด',
  primaryOrgs: ['MOPH', 'USPSTF', 'NCCN', 'ESMO'],
  thaiContext: 'บุหรี่ยังเป็นสาเหตุหลัก แต่ไทยมีปัจจัยพิเศษคือมะเร็งปอดในผู้ไม่สูบบุหรี่สูงกว่าเฉลี่ย (EGFR mutation ในผู้หญิงไม่สูบบุหรี่) LDCT screening ยังไม่รวมในสิทธิ NHSO',
  keyDifferences: [
    'USPSTF 2021 ปรับ LDCT criteria: อายุ 50+ (ลดจาก 55) pack-years 20+ (ลดจาก 30)',
    'ไทยยังไม่มีโปรแกรม LDCT screening ใน NHSO',
    'EGFR mutation พบสูงมากในประชากรเอเชีย ทำให้ผู้ป่วยไม่สูบบุหรี่มีโอกาสเป็นมะเร็งปอดได้',
    'ค่าใช้จ่าย LDCT ไทย ~3,000-5,000 บาท ยังเป็นอุปสรรค',
  ],
  screeningTests: ['Low-Dose CT Scan (LDCT)', 'Chest X-Ray (ไม่แนะนำสำหรับ screening)', 'Sputum Cytology (ไม่แนะนำ)'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'กรมการแพทย์',
      orgFullEn: 'Department of Medical Services',
      country: 'ไทย',
      recommendation: 'LDCT screening พิจารณาสำหรับผู้สูบบุหรี่ 20+ pack-years อายุ 50-74 ปี แต่ยังไม่อยู่ในสิทธิ NHSO',
      startingAge: '50 ปี (ผู้สูบบุหรี่หนัก)',
      frequency: 'ทุกปี (ตาม NLST criteria)',
      riskGroups: ['สูบบุหรี่ ≥20 pack-years', 'อายุ 50-74', 'เลิกสูบมาไม่เกิน 15 ปี'],
      evidenceGrade: 'B',
      lastUpdated: '2565',
      keyNote: 'LDCT ยังไม่รวมในชุดสิทธิประโยชน์ NHSO — ต้องชำระเอง',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'USPSTF',
      country: 'USA',
      recommendation: 'Annual LDCT สำหรับผู้สูบบุหรี่ 20+ pack-years อายุ 50-80 ปี ที่สูบอยู่หรือเลิกไม่เกิน 15 ปี',
      startingAge: '50 ปี',
      frequency: 'ทุกปี',
      riskGroups: ['อายุ 50-80', '≥20 pack-years', 'สูบอยู่หรือเลิก <15 ปี'],
      evidenceGrade: 'B',
      lastUpdated: '2021',
      keyNote: '2021: ลดเกณฑ์อายุจาก 55 เป็น 50 / pack-years จาก 30 เป็น 20',
    },
    {
      org: 'NCCN',
      orgFullTh: 'NCCN Lung Cancer Screening',
      orgFullEn: 'NCCN',
      country: 'USA',
      recommendation: 'LDCT สำหรับ Group 1: อายุ ≥50 + ≥20 pack-years (active หรือเลิก <15 ปี) Group 2: อายุ ≥50 + ≥20 PY + ปัจจัยเสี่ยงเพิ่มอีก 1',
      startingAge: '50 ปี',
      frequency: 'ทุกปี',
      riskGroups: ['Group 1: อายุ 50+ / 20PY+', 'Group 2: เพิ่มปัจจัยเสี่ยงอื่น: COPD, Radon, Cancer Hx'],
      evidenceGrade: 'A',
      lastUpdated: '2024',
    },
  ],
  faqsTh: [
    { q: 'ไม่สูบบุหรี่ก็เป็นมะเร็งปอดได้ไหม?', a: 'ได้ค่ะ ในเอเชียโดยเฉพาะผู้หญิงไทย พบมะเร็งปอดในผู้ไม่สูบบุหรี่ได้สูง โดยเฉพาะชนิด Adenocarcinoma ที่มี EGFR Mutation ปัจจัยเสี่ยงอื่น ได้แก่ ควันบุหรี่มือสอง มลภาวะทางอากาศ ควันน้ำมันประกอบอาหาร Radon และกรรมพันธุ์' },
    { q: 'LDCT ปลอดภัยไหม?', a: 'LDCT ปลอดภัย ใช้รังสีน้อยมาก (~1.5 mSv เทียบกับ CXR 0.02 mSv) ข้อเสียคืออาจพบ Pulmonary Nodules ขนาดเล็กจำนวนมากที่ไม่ใช่มะเร็ง ต้องติดตามและบางครั้งทำหัตถการเพิ่ม' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 8. LIVER CANCER
// ════════════════════════════════════════════════════════════════

const liverCancerGuideline: DiseaseGuideline = {
  diseaseSlug: 'liver-cancer',
  diseaseNameTh: 'มะเร็งตับ',
  diseaseNameEn: 'Hepatocellular Carcinoma (HCC)',
  icd10: 'C22',
  prevalenceTh: 'มะเร็งอันดับ 1 ในชายไทย เชื่อมโยงกับ HBV/HCV endemic',
  primaryOrgs: ['MOPH', 'NHSO', 'AASLD', 'EASL'],
  thaiContext: 'ไทยมี HBV carrier สูง ~4-8% ของประชากร และมีการแพร่ระบาด Liver Fluke (Opisthorchis viverrini) ในภาคอีสาน ทำให้ Cholangiocarcinoma สูงกว่าชาติอื่น',
  keyDifferences: [
    'Liver Fluke (ปอดดิบ) เป็นปัจจัยเสี่ยงเฉพาะประเทศไทย ทำให้เกิด Cholangiocarcinoma',
    'NHSO ครอบคลุมวัคซีน HBV ฟรีในเด็กแรกเกิด',
    'Surveillance ด้วย Ultrasound + AFP ทุก 6 เดือนสำหรับ HBV/HCV cirrhosis',
    'ไทยไม่ได้แนะนำ population-wide HCC screening — เน้นเฉพาะกลุ่มเสี่ยงสูง',
  ],
  screeningTests: ['Liver Ultrasound', 'AFP (Alpha-fetoprotein)', 'PIVKA-II / DCP', 'MRI Liver (high-risk)'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'สมาคมโรคตับแห่งประเทศไทย',
      orgFullEn: 'Thai Association for the Study of the Liver',
      country: 'ไทย',
      recommendation: 'Ultrasound ตับ + AFP ทุก 6 เดือนสำหรับผู้ที่เป็น HBV/HCV Cirrhosis หรือ HBV Carrier ที่มีความเสี่ยงสูง',
      startingAge: 'ทุกอายุถ้ามีปัจจัยเสี่ยง (HBV carrier ชายอายุ 40+)',
      frequency: 'ทุก 6 เดือน',
      riskGroups: ['HBV Cirrhosis', 'HCV Cirrhosis', 'HBV carrier ชาย 40+', 'Alcoholic cirrhosis', 'NAFLD Cirrhosis'],
      evidenceGrade: 'B',
      lastUpdated: '2565',
      keyNote: 'ไม่แนะนำ screening ในประชากรทั่วไป — เฉพาะกลุ่มเสี่ยงสูง',
    },
    {
      org: 'NHSO',
      orgFullTh: 'สปสช.',
      orgFullEn: 'NHSO',
      country: 'ไทย',
      recommendation: 'วัคซีน HBV ฟรีสำหรับเด็กแรกเกิดทุกคน HBsAg + Anti-HBs สำหรับ Screening',
      startingAge: 'แรกเกิด (วัคซีน)',
      frequency: '3 เข็มตามโปรแกรม EPI',
      riskGroups: ['เด็กแรกเกิดทุกคน', 'กลุ่มเสี่ยง HBV'],
      evidenceGrade: 'A',
      lastUpdated: '2566',
    },
    {
      org: 'AASLD',
      orgFullTh: 'American Association for the Study of Liver Diseases',
      orgFullEn: 'AASLD',
      country: 'USA',
      recommendation: 'Ultrasound ตับ ± AFP ทุก 6 เดือนสำหรับ Cirrhosis ทุกสาเหตุ และ High-risk HBV carrier',
      startingAge: 'ชาย HBV ≥40 ปี / หญิง ≥50 ปี / Cirrhosis ทุกอายุ',
      frequency: 'ทุก 6 เดือน',
      riskGroups: ['Cirrhosis', 'HBV carrier with risk factors', 'Family hx HCC'],
      evidenceGrade: 'B',
      lastUpdated: '2023',
    },
  ],
  faqsTh: [
    { q: 'HBV carrier ต้องตรวจตับบ่อยแค่ไหน?', a: 'ถ้าเป็น Inactive HBV Carrier (HBeAg-, HBV DNA ต่ำ, enzyme ตับปกติ) ตรวจทุก 6-12 เดือน ถ้ามี Active Hepatitis หรือ Cirrhosis ตรวจทุก 6 เดือนด้วย Ultrasound + AFP เพื่อคัดกรอง HCC' },
    { q: 'กินปลาดิบหรือปูดอง เสี่ยงมะเร็งตับไหม?', a: 'ปลาดิบน้ำจืดจากแม่น้ำ (เช่น ปลาตะเพียน ปลาสร้อย) อาจมีพยาธิใบไม้ตับ (Liver Fluke) ซึ่งเป็นปัจจัยเสี่ยงหลักของมะเร็งท่อน้ำดี (Cholangiocarcinoma) โดยเฉพาะในภาคอีสาน แนะนำปรุงสุกก่อนบริโภค' },
  ],
}

// ════════════════════════════════════════════════════════════════
// 9. CHRONIC KIDNEY DISEASE
// ════════════════════════════════════════════════════════════════

const ckdGuideline: DiseaseGuideline = {
  diseaseSlug: 'chronic-kidney-disease',
  diseaseNameTh: 'โรคไตเรื้อรัง',
  diseaseNameEn: 'Chronic Kidney Disease (CKD)',
  icd10: 'N18',
  prevalenceTh: '~8-17% ของผู้ใหญ่ไทย มีโรคไตเรื้อรัง — ส่วนใหญ่ไม่รู้ตัว',
  primaryOrgs: ['MOPH', 'NHSO', 'KDIGO', 'USPSTF'],
  thaiContext: 'ไทยมีโรคไตเรื้อรังสูงมากเนื่องจากเบาหวานและความดัน + การใช้ยาแก้ปวด NSAID มาก + ยาสมุนไพรที่อาจมีโลหะหนัก โรคไตจากหินปูนยูเรต (Uric Acid nephropathy) ก็พบสูงในภาคอีสาน',
  keyDifferences: [
    'NHSO ครอบคลุมการตรวจไตใน Check-up สิทธิประโยชน์ (Creatinine + UA)',
    'KDIGO แนะนำ eGFR + Urine ACR เป็น dual criteria การ staging',
    'USPSTF ยังไม่มี recommendation ชัดเจนสำหรับ CKD screening ในประชากรทั่วไป',
    'การตรวจ Urine ACR ยังไม่รวมในสิทธิ NHSO อย่างชัดเจน',
  ],
  screeningTests: ['Serum Creatinine/eGFR', 'Urine Albumin-to-Creatinine Ratio (ACR)', 'Urine Analysis', 'Blood Pressure'],
  recommendations: [
    {
      org: 'MOPH',
      orgFullTh: 'สมาคมโรคไตแห่งประเทศไทย / กรมการแพทย์',
      orgFullEn: 'Nephrology Society of Thailand',
      country: 'ไทย',
      recommendation: 'ตรวจ Creatinine, eGFR, Urine ACR ในผู้ป่วยเบาหวาน ความดันสูง และกลุ่มเสี่ยง ทุกปี',
      startingAge: 'ทุกอายุที่มีปัจจัยเสี่ยง / อายุ 35+ ทั่วไป',
      frequency: 'ทุกปีในกลุ่มเสี่ยงสูง',
      riskGroups: ['เบาหวาน', 'ความดันสูง', 'ประวัติครอบครัว', 'อ้วน', 'อายุมาก', 'ใช้ยา NSAID เรื้อรัง'],
      evidenceGrade: 'B',
      lastUpdated: '2565',
      keyNote: 'ผู้ป่วยเบาหวานควรตรวจไตทุกปีตามแนวทาง ADA/DAT',
    },
    {
      org: 'NHSO',
      orgFullTh: 'สปสช.',
      orgFullEn: 'NHSO',
      country: 'ไทย',
      recommendation: 'ตรวจ Creatinine ฟรีในชุด Check-up อายุ 35+ ปี',
      startingAge: '35 ปี',
      frequency: 'ทุก 3-5 ปี',
      riskGroups: ['ทุกคนอายุ 35+'],
      evidenceGrade: 'B',
      lastUpdated: '2566',
    },
    {
      org: 'KDIGO',
      orgFullTh: 'Kidney Disease: Improving Global Outcomes',
      orgFullEn: 'KDIGO',
      country: 'สากล',
      recommendation: 'ตรวจ eGFR + Urine ACR ในผู้ที่มีปัจจัยเสี่ยง CKD ทุกปี — ใช้ทั้งคู่ในการ staging',
      startingAge: 'ตามปัจจัยเสี่ยง',
      frequency: 'ทุกปีในกลุ่มเสี่ยง',
      riskGroups: ['เบาหวาน', 'ความดันสูง', 'CVD', 'ประวัติครอบครัว', 'AKI history'],
      evidenceGrade: 'B',
      lastUpdated: '2024',
      keyNote: 'KDIGO 2024 เน้น ACR เพิ่มขึ้น — Proteinuria เป็น independent risk factor',
    },
    {
      org: 'USPSTF',
      orgFullTh: 'US Preventive Services Task Force',
      orgFullEn: 'USPSTF',
      country: 'USA',
      recommendation: 'ไม่มี recommendation ชัดเจนสำหรับ CKD screening ในประชากรทั่วไปที่ไม่มีปัจจัยเสี่ยง',
      startingAge: 'N/A (เฉพาะกลุ่มเสี่ยง)',
      frequency: 'ตามปัจจัยเสี่ยง',
      riskGroups: ['เบาหวาน', 'ความดันสูง'],
      evidenceGrade: 'I',
      lastUpdated: '2020',
      keyNote: 'USPSTF: "Insufficient evidence" สำหรับ general population screening',
    },
  ],
  faqsTh: [
    { q: 'eGFR เท่าไหร่ถือว่าเป็น CKD?', a: 'eGFR <60 mL/min/1.73m² เป็นเวลา >3 เดือน หรือ Urine ACR ≥30 mg/g เป็นเวลา >3 เดือน ถือว่าเป็น CKD CKD มี 5 ระยะตาม eGFR ตั้งแต่ G1 (≥90) จนถึง G5 (<15) ที่ต้องฟอกไต' },
    { q: 'กินยาแก้ปวดบ่อยๆ เสี่ยงไตวายไหม?', a: 'ใช่ NSAID (Ibuprofen, Naproxen, Diclofenac) ใช้เรื้อรัง โดยเฉพาะในคนอายุมาก ความดัน เบาหวาน หรือขาดน้ำ เสี่ยง AKI และ CKD สูง ควรใช้ Paracetamol เป็น first choice และใช้ NSAID เฉพาะเมื่อจำเป็น ระยะสั้น' },
  ],
}

// ════════════════════════════════════════════════════════════════
// REGISTRY
// ════════════════════════════════════════════════════════════════

export const DISEASE_GUIDELINES: Record<string, DiseaseGuideline> = {
  'heart-disease': heartGuideline,
  'type-2-diabetes': diabetesGuideline,
  'hypertension': hypertensionGuideline,
  'colorectal-cancer': colorectalGuideline,
  'breast-cancer': breastCancerGuideline,
  'cervical-cancer': cervicalGuideline,
  'lung-cancer': lungCancerGuideline,
  'liver-cancer': liverCancerGuideline,
  'chronic-kidney-disease': ckdGuideline,
}

export const GUIDELINE_SLUGS = Object.keys(DISEASE_GUIDELINES)

export function getGuideline(slug: string): DiseaseGuideline | null {
  return DISEASE_GUIDELINES[slug] ?? null
}

export function getAllGuidelines(): DiseaseGuideline[] {
  return Object.values(DISEASE_GUIDELINES)
}
