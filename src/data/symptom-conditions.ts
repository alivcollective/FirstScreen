// Symptom-Conditions Mapping Data
// SAFETY: Educational navigation only — NOT diagnosis
// ข้อมูลเพื่อการนำทางสุขภาพเท่านั้น ไม่ใช่การวินิจฉัยโรค

export type BodyRegion = 'head' | 'chest' | 'abdomen' | 'back' | 'arms' | 'legs' | 'skin' | 'general'
export type SymptomSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface SymptomItem {
  id: string
  label: string
  severity: SymptomSeverity
}

export const SYMPTOM_DATA: Record<BodyRegion, SymptomItem[]> = {
  head: [
    { id: 'headache', label: 'ปวดหัว', severity: 'medium' },
    { id: 'dizziness', label: 'วิงเวียนศีรษะ', severity: 'medium' },
    { id: 'vision_blur', label: 'ตามัว', severity: 'high' },
    { id: 'ear_pain', label: 'ปวดหู', severity: 'low' },
    { id: 'sore_throat', label: 'เจ็บคอ', severity: 'low' },
    { id: 'neck_stiff', label: 'คอแข็ง', severity: 'high' },
    { id: 'memory_loss', label: 'ความจำแย่ลง', severity: 'medium' },
    { id: 'face_droop', label: 'ปากเบี้ยว / ใบหน้าตก', severity: 'critical' },
    { id: 'speech_slur', label: 'พูดไม่ชัด / พูดไม่ออก', severity: 'critical' },
  ],
  chest: [
    { id: 'chest_pain', label: 'เจ็บหน้าอก', severity: 'critical' },
    { id: 'shortness_breath', label: 'หายใจลำบาก', severity: 'critical' },
    { id: 'palpitation', label: 'ใจสั่น', severity: 'high' },
    { id: 'cough', label: 'ไอ', severity: 'low' },
    { id: 'cough_blood', label: 'ไอเป็นเลือด', severity: 'critical' },
    { id: 'chest_tightness', label: 'แน่นหน้าอก', severity: 'high' },
    { id: 'wheezing', label: 'หายใจมีเสียงหวีด', severity: 'high' },
  ],
  abdomen: [
    { id: 'stomach_pain', label: 'ปวดท้อง', severity: 'medium' },
    { id: 'nausea', label: 'คลื่นไส้', severity: 'low' },
    { id: 'vomiting', label: 'อาเจียน', severity: 'medium' },
    { id: 'diarrhea', label: 'ท้องเสีย', severity: 'medium' },
    { id: 'blood_stool', label: 'ถ่ายเป็นเลือด', severity: 'critical' },
    { id: 'jaundice', label: 'ตัวเหลือง ตาเหลือง', severity: 'high' },
    { id: 'bloating', label: 'ท้องอืด', severity: 'low' },
    { id: 'constipation', label: 'ท้องผูกเรื้อรัง', severity: 'medium' },
    { id: 'bowel_change', label: 'พฤติกรรมถ่ายเปลี่ยนแปลง', severity: 'high' },
  ],
  back: [
    { id: 'back_pain', label: 'ปวดหลัง', severity: 'medium' },
    { id: 'lower_back', label: 'ปวดหลังส่วนล่าง', severity: 'medium' },
    { id: 'scapular_pain', label: 'ปวดสะบัก', severity: 'medium' },
    { id: 'back_radiating', label: 'ปวดร้าวจากหลังลงขา', severity: 'high' },
  ],
  arms: [
    { id: 'arm_weakness', label: 'แขนอ่อนแรง', severity: 'high' },
    { id: 'arm_pain', label: 'ปวดแขน', severity: 'medium' },
    { id: 'numbness', label: 'ชาปลายมือ', severity: 'medium' },
    { id: 'arm_swelling', label: 'แขนบวม', severity: 'high' },
    { id: 'joint_pain_arm', label: 'ปวดข้อมือ / ข้อนิ้ว', severity: 'medium' },
  ],
  legs: [
    { id: 'leg_swelling', label: 'ขาบวม', severity: 'high' },
    { id: 'leg_pain', label: 'ปวดขา', severity: 'medium' },
    { id: 'leg_weakness', label: 'ขาอ่อนแรง', severity: 'high' },
    { id: 'calf_pain', label: 'ปวดน่อง', severity: 'high' },
    { id: 'foot_numbness', label: 'ชาเท้า', severity: 'medium' },
  ],
  skin: [
    { id: 'rash', label: 'ผื่น', severity: 'low' },
    { id: 'mole_change', label: 'ไฝเปลี่ยนแปลง', severity: 'high' },
    { id: 'lump', label: 'มีก้อน / ตุ่ม', severity: 'high' },
    { id: 'yellowing', label: 'ผิวเหลือง', severity: 'high' },
    { id: 'skin_ulcer', label: 'แผลหายช้า', severity: 'medium' },
    { id: 'bruising', label: '멍ง่าย / มีจ้ำ', severity: 'medium' },
    { id: 'petechiae', label: 'จุดเลือดออกใต้ผิวหนัง', severity: 'high' },
  ],
  general: [
    { id: 'fever', label: 'มีไข้', severity: 'medium' },
    { id: 'high_fever', label: 'ไข้สูง > 38.5°C', severity: 'high' },
    { id: 'fatigue', label: 'เหนื่อยล้าผิดปกติ', severity: 'medium' },
    { id: 'weight_loss', label: 'น้ำหนักลดโดยไม่ทราบสาเหตุ', severity: 'high' },
    { id: 'night_sweat', label: 'เหงื่อออกตอนกลางคืน', severity: 'medium' },
    { id: 'loss_appetite', label: 'เบื่ออาหาร', severity: 'medium' },
    { id: 'frequent_urination', label: 'ปัสสาวะบ่อย', severity: 'medium' },
    { id: 'thirst', label: 'กระหายน้ำมาก', severity: 'medium' },
    { id: 'chills', label: 'หนาวสั่น', severity: 'medium' },
    { id: 'swollen_glands', label: 'ต่อมน้ำเหลืองโต', severity: 'high' },
  ],
}

export interface ConditionInfo {
  id: string
  slug: string | null // null = no internal page yet
  nameTh: string
  nameEn: string
  descriptionTh: string
  relatedSymptoms: string[] // symptom IDs
  weights: Record<string, number> // symptom ID → score contribution
  minScore: number
  isEmergency?: boolean
}

export const CONDITIONS: ConditionInfo[] = [
  {
    id: 'heart_attack',
    slug: 'cardiovascular-disease',
    nameTh: 'โรคหัวใจขาดเลือดเฉียบพลัน',
    nameEn: 'Acute Coronary Syndrome',
    descriptionTh: 'ภาวะฉุกเฉินที่เกิดจากหลอดเลือดหัวใจตีบหรืออุดตัน ต้องรักษาทันที',
    relatedSymptoms: ['chest_pain', 'shortness_breath', 'palpitation', 'arm_pain', 'chest_tightness', 'nausea', 'fatigue'],
    weights: { chest_pain: 8, shortness_breath: 5, arm_pain: 4, palpitation: 3, chest_tightness: 5, nausea: 2, fatigue: 1 },
    minScore: 5,
    isEmergency: true,
  },
  {
    id: 'stroke',
    slug: 'cardiovascular-disease',
    nameTh: 'โรคหลอดเลือดสมอง (Stroke)',
    nameEn: 'Stroke',
    descriptionTh: 'ภาวะฉุกเฉินจากหลอดเลือดสมองแตกหรืออุดตัน — จำ FAST: Face, Arm, Speech, Time',
    relatedSymptoms: ['face_droop', 'speech_slur', 'arm_weakness', 'leg_weakness', 'vision_blur', 'headache', 'dizziness'],
    weights: { face_droop: 8, speech_slur: 8, arm_weakness: 5, leg_weakness: 4, vision_blur: 3, headache: 1, dizziness: 1 },
    minScore: 5,
    isEmergency: true,
  },
  {
    id: 'hypertension',
    slug: 'hypertension',
    nameTh: 'ความดันโลหิตสูง (Hypertension)',
    nameEn: 'Hypertension',
    descriptionTh: 'ภาวะความดันเลือดสูงเรื้อรัง มักไม่มีอาการจนกว่าจะรุนแรง — ควรตรวจวัดสม่ำเสมอ',
    relatedSymptoms: ['headache', 'dizziness', 'vision_blur', 'palpitation', 'fatigue', 'neck_stiff'],
    weights: { headache: 3, dizziness: 3, vision_blur: 3, palpitation: 2, fatigue: 1 },
    minScore: 4,
  },
  {
    id: 'diabetes',
    slug: 'type-2-diabetes',
    nameTh: 'เบาหวาน (Diabetes)',
    nameEn: 'Type 2 Diabetes',
    descriptionTh: 'ภาวะน้ำตาลในเลือดสูงเรื้อรัง ตรวจพบได้ด้วยการตรวจเลือดอย่างง่าย',
    relatedSymptoms: ['frequent_urination', 'thirst', 'fatigue', 'weight_loss', 'vision_blur', 'skin_ulcer', 'foot_numbness'],
    weights: { frequent_urination: 5, thirst: 5, fatigue: 2, weight_loss: 3, vision_blur: 2, skin_ulcer: 3, foot_numbness: 3 },
    minScore: 5,
  },
  {
    id: 'dengue',
    slug: null,
    nameTh: 'ไข้เลือดออก (Dengue Fever)',
    nameEn: 'Dengue Fever',
    descriptionTh: 'โรคติดเชื้อไวรัสเดงกีจากยุงลาย พบบ่อยในประเทศไทย ต้องพบแพทย์เพื่อตรวจ CBC',
    relatedSymptoms: ['high_fever', 'fever', 'headache', 'petechiae', 'rash', 'fatigue', 'nausea', 'leg_pain', 'back_pain'],
    weights: { high_fever: 5, fever: 3, headache: 2, petechiae: 6, rash: 3, fatigue: 2, nausea: 1 },
    minScore: 5,
  },
  {
    id: 'lung_cancer',
    slug: 'lung-cancer',
    nameTh: 'มะเร็งปอด (Lung Cancer)',
    nameEn: 'Lung Cancer',
    descriptionTh: 'มะเร็งที่เกี่ยวข้องกับการสูบบุหรี่เป็นหลัก ตรวจพบตั้งแต่เนิ่นๆ ด้วย Low-dose CT',
    relatedSymptoms: ['cough', 'cough_blood', 'shortness_breath', 'chest_pain', 'weight_loss', 'fatigue', 'night_sweat'],
    weights: { cough_blood: 7, cough: 3, weight_loss: 5, shortness_breath: 3, chest_pain: 2, fatigue: 2, night_sweat: 3 },
    minScore: 5,
  },
  {
    id: 'colorectal_cancer',
    slug: 'colorectal-cancer',
    nameTh: 'มะเร็งลำไส้ใหญ่ (Colorectal Cancer)',
    nameEn: 'Colorectal Cancer',
    descriptionTh: 'ตรวจพบตั้งแต่เนิ่นๆ อัตราการรอดชีวิตสูงถึง 90% ด้วยการส่องกล้อง',
    relatedSymptoms: ['blood_stool', 'bowel_change', 'stomach_pain', 'weight_loss', 'fatigue', 'constipation'],
    weights: { blood_stool: 7, bowel_change: 5, stomach_pain: 2, weight_loss: 4, fatigue: 2, constipation: 3 },
    minScore: 5,
  },
  {
    id: 'liver_cancer',
    slug: 'liver-cancer',
    nameTh: 'มะเร็งตับ (Liver Cancer)',
    nameEn: 'Hepatocellular Carcinoma',
    descriptionTh: 'มะเร็งที่พบบ่อยในชายไทย เกี่ยวข้องกับ HBV/HCV และพยาธิใบไม้ตับ',
    relatedSymptoms: ['jaundice', 'yellowing', 'stomach_pain', 'weight_loss', 'fatigue', 'loss_appetite', 'nausea'],
    weights: { jaundice: 6, yellowing: 6, stomach_pain: 3, weight_loss: 4, fatigue: 2, loss_appetite: 2 },
    minScore: 5,
  },
  {
    id: 'breast_cancer',
    slug: 'breast-cancer',
    nameTh: 'มะเร็งเต้านม (Breast Cancer)',
    nameEn: 'Breast Cancer',
    descriptionTh: 'มะเร็งอันดับ 1 ในผู้หญิงไทย ตรวจพบตั้งแต่เนิ่นๆ ด้วย Mammogram',
    relatedSymptoms: ['lump', 'mole_change'],
    weights: { lump: 6, mole_change: 2 },
    minScore: 3,
  },
  {
    id: 'tuberculosis',
    slug: null,
    nameTh: 'วัณโรค (Tuberculosis)',
    nameEn: 'Tuberculosis (TB)',
    descriptionTh: 'การติดเชื้อแบคทีเรียที่ปอด รักษาได้หากตรวจพบและรับยาครบ',
    relatedSymptoms: ['cough', 'cough_blood', 'night_sweat', 'weight_loss', 'fatigue', 'fever'],
    weights: { cough: 3, cough_blood: 5, night_sweat: 5, weight_loss: 4, fatigue: 2, fever: 2 },
    minScore: 6,
  },
  {
    id: 'depression',
    slug: 'depression',
    nameTh: 'โรคซึมเศร้า (Depression)',
    nameEn: 'Major Depressive Disorder',
    descriptionTh: 'ความผิดปกติทางอารมณ์รักษาได้ผลดี — ไม่ใช่ความอ่อนแอ ควรขอความช่วยเหลือ',
    relatedSymptoms: ['fatigue', 'loss_appetite', 'weight_loss', 'night_sweat', 'memory_loss', 'headache'],
    weights: { fatigue: 3, loss_appetite: 3, weight_loss: 2, memory_loss: 3, night_sweat: 1, headache: 1 },
    minScore: 4,
  },
  {
    id: 'kidney_disease',
    slug: null,
    nameTh: 'โรคไตเรื้อรัง (Chronic Kidney Disease)',
    nameEn: 'Chronic Kidney Disease',
    descriptionTh: 'ภาวะไตเสื่อมอย่างช้าๆ มักไม่มีอาการระยะแรก ตรวจพบด้วยการตรวจเลือดและปัสสาวะ',
    relatedSymptoms: ['leg_swelling', 'fatigue', 'nausea', 'frequent_urination', 'loss_appetite', 'high_fever'],
    weights: { leg_swelling: 5, fatigue: 3, nausea: 2, frequent_urination: 4, loss_appetite: 2 },
    minScore: 5,
  },
  {
    id: 'dvt',
    slug: null,
    nameTh: 'หลอดเลือดดำอุดตัน (DVT)',
    nameEn: 'Deep Vein Thrombosis',
    descriptionTh: 'ลิ่มเลือดในหลอดเลือดดำขา — อาจเป็นอันตรายหากลิ่มเลือดหลุดไปปอด',
    relatedSymptoms: ['leg_swelling', 'calf_pain', 'leg_pain', 'leg_weakness'],
    weights: { leg_swelling: 5, calf_pain: 6, leg_pain: 3 },
    minScore: 6,
  },
  {
    id: 'pneumonia',
    slug: null,
    nameTh: 'ปอดอักเสบ (Pneumonia)',
    nameEn: 'Pneumonia',
    descriptionTh: 'การติดเชื้อในปอด ต้องรักษาด้วยยาปฏิชีวนะหรือยาต้านไวรัสตามสาเหตุ',
    relatedSymptoms: ['cough', 'shortness_breath', 'fever', 'high_fever', 'chest_pain', 'fatigue', 'chills'],
    weights: { cough: 3, shortness_breath: 4, fever: 4, high_fever: 5, chest_pain: 2, fatigue: 2, chills: 3 },
    minScore: 6,
  },
  {
    id: 'hepatitis',
    slug: null,
    nameTh: 'ไวรัสตับอักเสบ (Viral Hepatitis)',
    nameEn: 'Viral Hepatitis (B/C)',
    descriptionTh: 'การติดเชื้อไวรัสที่ตับ พบบ่อยในไทย — ตรวจและรักษาก่อนพัฒนาเป็นตับแข็งหรือมะเร็งตับ',
    relatedSymptoms: ['jaundice', 'yellowing', 'fatigue', 'nausea', 'loss_appetite', 'stomach_pain'],
    weights: { jaundice: 7, yellowing: 6, fatigue: 2, nausea: 2, loss_appetite: 2, stomach_pain: 2 },
    minScore: 5,
  },
]

// ============================================================
// SCORING FUNCTION
// ============================================================

export interface ConditionResult {
  condition: ConditionInfo
  score: number
  matchedSymptoms: string[]
}

export function getConditionsForSymptoms(symptomIds: string[]): ConditionResult[] {
  if (symptomIds.length === 0) return []

  const results: ConditionResult[] = []

  for (const condition of CONDITIONS) {
    let score = 0
    const matched: string[] = []

    for (const sid of symptomIds) {
      const weight = condition.weights[sid]
      if (weight) {
        score += weight
        matched.push(sid)
      }
    }

    if (score >= condition.minScore) {
      results.push({ condition, score, matchedSymptoms: matched })
    }
  }

  // Sort by score descending, emergency conditions first
  return results
    .sort((a, b) => {
      if (a.condition.isEmergency && !b.condition.isEmergency) return -1
      if (!a.condition.isEmergency && b.condition.isEmergency) return 1
      return b.score - a.score
    })
    .slice(0, 4)
}

// Determine urgency level from selected symptoms + follow-up data
export function determineUrgencyLevel(
  symptomIds: string[],
  severity: number, // 1-10
  duration: string,
  onsetType: string
): 'emergency' | 'urgent' | 'appointment' | 'selfcare' {
  const allSymptoms = Object.values(SYMPTOM_DATA).flat()

  // Check for critical symptoms
  const hasCritical = symptomIds.some(id => {
    const sym = allSymptoms.find(s => s.id === id)
    return sym?.severity === 'critical'
  })

  if (hasCritical) return 'emergency'
  if (severity >= 8) return 'emergency'
  if (onsetType === 'sudden' && (symptomIds.includes('chest_pain') || symptomIds.includes('shortness_breath'))) {
    return 'emergency'
  }

  // High symptoms
  const hasHigh = symptomIds.some(id => {
    const sym = allSymptoms.find(s => s.id === id)
    return sym?.severity === 'high'
  })

  if (hasHigh && severity >= 6) return 'urgent'
  if (duration === 'more_1_month') return 'urgent'
  if (hasHigh) return 'appointment'
  if (duration === '1_4_weeks' && severity >= 5) return 'appointment'
  if (severity >= 5) return 'appointment'

  return 'selfcare'
}
