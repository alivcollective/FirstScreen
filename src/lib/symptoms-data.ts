// Symptom Navigator Data
// SAFETY: This data is educational ONLY. Never implies diagnosis.
// All "condition groups" are navigation guides to appropriate care, NOT diagnoses.
// ข้อมูลเพื่อการนำทางสุขภาพเท่านั้น ไม่ใช่การวินิจฉัยโรค

import { makeEvidence, pendingEvidence, type EvidenceMetadata } from './evidence-types'

export type UrgencyLevel = 'emergency' | 'urgent' | 'soon' | 'routine'

export type QuestionType = 'boolean' | 'select' | 'duration' | 'severity'

export interface Symptom {
  id: string
  nameTh: string
  nameEn: string
  bodySystem: BodySystem
  keywords: string[]
  baseUrgency: UrgencyLevel
}

export type BodySystem =
  | 'cardiovascular'
  | 'respiratory'
  | 'gastrointestinal'
  | 'neurological'
  | 'musculoskeletal'
  | 'general'
  | 'urological'
  | 'mental_health'
  | 'dermatological'
  | 'endocrine'

export interface FollowUpQuestion {
  id: string
  symptomId: string
  questionTh: string
  questionEn: string
  type: QuestionType
  options?: Array<{ value: string; labelTh: string; labelEn: string }>
  redFlagValues?: string[]
  urgencyIfRedFlag?: UrgencyLevel
  order: number
}

export interface ConditionGroup {
  id: string
  nameTh: string
  nameEn: string
  descriptionTh: string
  urgencyLevel: UrgencyLevel
  specialtyTh: string
  specialtyEn: string
  suggestedTestsTh: string[]
  redFlagsTh: string[]
  relevantSymptomIds: string[]
  // Conditions that must be present for this group to appear
  requiredAnswers?: Array<{ questionId: string; values: string[] }>
  // Answers that exclude this group
  excludingAnswers?: Array<{ questionId: string; values: string[] }>
  evidence: EvidenceMetadata
}

export interface RedFlagRule {
  id: string
  symptomIds: string[]
  questionAnswers: Array<{ questionId: string; values: string[] }>
  urgencyLevel: UrgencyLevel
  messageTh: string
  actionTh: string
}

// ============================================================
// SYMPTOMS
// ============================================================

export const SYMPTOMS: Symptom[] = [
  {
    id: 'chest_pain',
    nameTh: 'เจ็บหน้าอก',
    nameEn: 'Chest pain',
    bodySystem: 'cardiovascular',
    keywords: ['เจ็บหน้าอก', 'แน่นหน้าอก', 'เจ็บ', 'chest pain', 'chest tightness'],
    baseUrgency: 'urgent',
  },
  {
    id: 'chronic_cough',
    nameTh: 'ไอเรื้อรัง',
    nameEn: 'Chronic cough',
    bodySystem: 'respiratory',
    keywords: ['ไอ', 'ไอเรื้อรัง', 'ไออาทิตย์', 'cough', 'chronic cough'],
    baseUrgency: 'soon',
  },
  {
    id: 'weight_loss',
    nameTh: 'น้ำหนักลดโดยไม่ทราบสาเหตุ',
    nameEn: 'Unexplained weight loss',
    bodySystem: 'general',
    keywords: ['น้ำหนักลด', 'ผอมลง', 'weight loss', 'losing weight'],
    baseUrgency: 'soon',
  },
  {
    id: 'rectal_bleeding',
    nameTh: 'ถ่ายอุจจาระปนเลือด',
    nameEn: 'Rectal bleeding / Blood in stool',
    bodySystem: 'gastrointestinal',
    keywords: ['ถ่ายเป็นเลือด', 'อุจจาระมีเลือด', 'rectal bleeding', 'blood in stool'],
    baseUrgency: 'urgent',
  },
  {
    id: 'dyspnea',
    nameTh: 'หายใจลำบาก / หอบเหนื่อย',
    nameEn: 'Difficulty breathing / Shortness of breath',
    bodySystem: 'respiratory',
    keywords: ['หายใจลำบาก', 'หอบ', 'เหนื่อย', 'breathless', 'shortness of breath', 'difficulty breathing'],
    baseUrgency: 'urgent',
  },
  {
    id: 'headache',
    nameTh: 'ปวดหัว',
    nameEn: 'Headache',
    bodySystem: 'neurological',
    keywords: ['ปวดหัว', 'ปวดศีรษะ', 'headache'],
    baseUrgency: 'routine',
  },
  {
    id: 'shoulder_pain',
    nameTh: 'ปวดไหล่ / ปวดสะบัก',
    nameEn: 'Shoulder / Scapular pain',
    bodySystem: 'musculoskeletal',
    keywords: ['ปวดไหล่', 'ปวดสะบัก', 'ปวดบ่า', 'shoulder pain', 'scapular pain'],
    baseUrgency: 'routine',
  },
  {
    id: 'fatigue',
    nameTh: 'อ่อนเพลียเรื้อรัง',
    nameEn: 'Chronic fatigue',
    bodySystem: 'general',
    keywords: ['อ่อนเพลีย', 'เหนื่อยล้า', 'fatigue', 'tired', 'exhaustion'],
    baseUrgency: 'routine',
  },
  {
    id: 'jaundice',
    nameTh: 'ตาเหลือง / ผิวเหลือง (ดีซ่าน)',
    nameEn: 'Jaundice (Yellow skin/eyes)',
    bodySystem: 'gastrointestinal',
    keywords: ['ตาเหลือง', 'ผิวเหลือง', 'ดีซ่าน', 'jaundice', 'yellow skin'],
    baseUrgency: 'urgent',
  },
  {
    id: 'abdominal_pain',
    nameTh: 'ปวดท้อง',
    nameEn: 'Abdominal pain',
    bodySystem: 'gastrointestinal',
    keywords: ['ปวดท้อง', 'abdominal pain', 'stomach pain', 'belly pain'],
    baseUrgency: 'soon',
  },
  {
    id: 'palpitations',
    nameTh: 'ใจสั่น / หัวใจเต้นผิดปกติ',
    nameEn: 'Palpitations',
    bodySystem: 'cardiovascular',
    keywords: ['ใจสั่น', 'หัวใจเต้นแรง', 'palpitations', 'heart racing'],
    baseUrgency: 'soon',
  },
  {
    id: 'urinary_changes',
    nameTh: 'ปัสสาวะผิดปกติ',
    nameEn: 'Urinary changes',
    bodySystem: 'urological',
    keywords: ['ปัสสาวะบ่อย', 'ปัสสาวะแสบ', 'ปัสสาวะมีเลือด', 'urinary', 'frequent urination'],
    baseUrgency: 'soon',
  },
  {
    id: 'persistent_fever',
    nameTh: 'มีไข้ต่อเนื่อง',
    nameEn: 'Persistent fever',
    bodySystem: 'general',
    keywords: ['มีไข้', 'ไข้ต่อเนื่อง', 'fever', 'persistent fever'],
    baseUrgency: 'soon',
  },
  {
    id: 'night_sweats',
    nameTh: 'เหงื่อออกกลางคืน',
    nameEn: 'Night sweats',
    bodySystem: 'general',
    keywords: ['เหงื่อออกกลางคืน', 'night sweats'],
    baseUrgency: 'soon',
  },
  {
    id: 'depression_anxiety',
    nameTh: 'ซึมเศร้า / วิตกกังวล',
    nameEn: 'Depression / Anxiety',
    bodySystem: 'mental_health',
    keywords: ['ซึมเศร้า', 'วิตกกังวล', 'depression', 'anxiety', 'mood'],
    baseUrgency: 'routine',
  },
  {
    id: 'swelling',
    nameTh: 'บวม (ขา, ข้อเท้า, ใบหน้า)',
    nameEn: 'Swelling (legs, ankles, face)',
    bodySystem: 'cardiovascular',
    keywords: ['บวม', 'ขาบวม', 'swelling', 'edema'],
    baseUrgency: 'soon',
  },
  {
    id: 'chronic_diarrhea',
    nameTh: 'ท้องเสียเรื้อรัง / ลักษณะอุจจาระเปลี่ยน',
    nameEn: 'Chronic diarrhea / Change in bowel habits',
    bodySystem: 'gastrointestinal',
    keywords: ['ท้องเสีย', 'ถ่ายเหลว', 'diarrhea', 'bowel changes'],
    baseUrgency: 'soon',
  },
  {
    id: 'nausea_vomiting',
    nameTh: 'คลื่นไส้ / อาเจียน',
    nameEn: 'Nausea / Vomiting',
    bodySystem: 'gastrointestinal',
    keywords: ['คลื่นไส้', 'อาเจียน', 'nausea', 'vomiting'],
    baseUrgency: 'routine',
  },
  {
    id: 'dizziness',
    nameTh: 'เวียนหัว / บ้านหมุน',
    nameEn: 'Dizziness / Vertigo',
    bodySystem: 'neurological',
    keywords: ['เวียนหัว', 'บ้านหมุน', 'dizziness', 'vertigo'],
    baseUrgency: 'soon',
  },
  {
    id: 'skin_changes',
    nameTh: 'รอยโรคผิวหนังผิดปกติ / ไฝเปลี่ยนแปลง',
    nameEn: 'Unusual skin lesion / Mole change',
    bodySystem: 'dermatological',
    keywords: ['ไฝ', 'รอยผิวหนัง', 'skin lesion', 'mole change'],
    baseUrgency: 'soon',
  },
]

// ============================================================
// FOLLOW-UP QUESTIONS
// ============================================================

export const FOLLOW_UP_QUESTIONS: FollowUpQuestion[] = [
  // CHEST PAIN questions
  {
    id: 'cp_quality',
    symptomId: 'chest_pain',
    questionTh: 'ลักษณะความเจ็บเป็นแบบใด?',
    questionEn: 'How would you describe the chest pain?',
    type: 'select',
    options: [
      { value: 'tight_pressing', labelTh: 'แน่นหน้าอก เหมือนถูกกดทับหรือบีบ', labelEn: 'Tight, pressing, squeezing' },
      { value: 'sharp_stabbing', labelTh: 'เจ็บแปลบ คม เหมือนโดนแทง', labelEn: 'Sharp, stabbing' },
      { value: 'burning', labelTh: 'แสบร้อน เหมือนกรดไหล', labelEn: 'Burning sensation' },
      { value: 'aching', labelTh: 'เจ็บตื้อๆ หรือเจ็บกล้ามเนื้อ', labelEn: 'Dull aching / Muscle soreness' },
    ],
    redFlagValues: ['tight_pressing'],
    urgencyIfRedFlag: 'urgent',
    order: 1,
  },
  {
    id: 'cp_radiation',
    symptomId: 'chest_pain',
    questionTh: 'ความเจ็บร้าวไปที่อื่นหรือไม่?',
    questionEn: 'Does the pain radiate anywhere?',
    type: 'select',
    options: [
      { value: 'left_arm_jaw', labelTh: 'ร้าวไปแขนซ้าย กราม หรือคอ', labelEn: 'Radiates to left arm, jaw, or neck' },
      { value: 'back', labelTh: 'ร้าวไปหลัง', labelEn: 'Radiates to back' },
      { value: 'none', labelTh: 'ไม่ร้าว', labelEn: 'No radiation' },
    ],
    redFlagValues: ['left_arm_jaw'],
    urgencyIfRedFlag: 'emergency',
    order: 2,
  },
  {
    id: 'cp_associated',
    symptomId: 'chest_pain',
    questionTh: 'มีอาการร่วมหรือไม่?',
    questionEn: 'Do you have any of these associated symptoms?',
    type: 'select',
    options: [
      { value: 'sweat_breathless', labelTh: 'มีเหงื่อแตก หายใจลำบาก หรืออาเจียน', labelEn: 'Sweating, difficulty breathing, or vomiting' },
      { value: 'breathless_only', labelTh: 'หายใจลำบากเล็กน้อย', labelEn: 'Mild shortness of breath only' },
      { value: 'worse_on_exertion', labelTh: 'เจ็บมากขึ้นเวลาออกแรง', labelEn: 'Worse with exertion' },
      { value: 'none', labelTh: 'ไม่มีอาการร่วม', labelEn: 'None of the above' },
    ],
    redFlagValues: ['sweat_breathless'],
    urgencyIfRedFlag: 'emergency',
    order: 3,
  },
  {
    id: 'cp_duration',
    symptomId: 'chest_pain',
    questionTh: 'เจ็บมานานเท่าไหร่แล้ว?',
    questionEn: 'How long have you had this pain?',
    type: 'select',
    options: [
      { value: 'now', labelTh: 'เพิ่งเกิดขึ้น / กำลังเป็นอยู่ตอนนี้', labelEn: 'Just started / Currently happening' },
      { value: 'hours', labelTh: 'หลายชั่วโมงที่ผ่านมา', labelEn: 'Past few hours' },
      { value: 'days', labelTh: 'หลายวัน', labelEn: 'Several days' },
      { value: 'weeks', labelTh: 'หลายสัปดาห์ขึ้นไป', labelEn: 'Weeks or more' },
    ],
    redFlagValues: ['now'],
    urgencyIfRedFlag: 'emergency',
    order: 4,
  },

  // CHRONIC COUGH questions
  {
    id: 'cc_duration',
    symptomId: 'chronic_cough',
    questionTh: 'ไอมานานเท่าไหร่แล้ว?',
    questionEn: 'How long have you had the cough?',
    type: 'select',
    options: [
      { value: 'less2w', labelTh: 'น้อยกว่า 2 สัปดาห์', labelEn: 'Less than 2 weeks' },
      { value: '2to8w', labelTh: '2–8 สัปดาห์', labelEn: '2–8 weeks' },
      { value: 'more8w', labelTh: 'มากกว่า 8 สัปดาห์ (เรื้อรัง)', labelEn: 'More than 8 weeks (chronic)' },
    ],
    order: 1,
  },
  {
    id: 'cc_hemoptysis',
    symptomId: 'chronic_cough',
    questionTh: 'มีเสมหะหรือน้ำลายปนเลือดหรือไม่?',
    questionEn: 'Is there any blood in phlegm or sputum?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่ มีเลือดปน', labelEn: 'Yes, blood present' },
      { value: 'no', labelTh: 'ไม่มี', labelEn: 'No' },
    ],
    redFlagValues: ['yes'],
    urgencyIfRedFlag: 'urgent',
    order: 2,
  },
  {
    id: 'cc_smoking',
    symptomId: 'chronic_cough',
    questionTh: 'คุณสูบบุหรี่หรือเคยสูบบุหรี่หรือไม่?',
    questionEn: 'Do you smoke or have you ever smoked?',
    type: 'select',
    options: [
      { value: 'current', labelTh: 'สูบบุหรี่อยู่ในปัจจุบัน', labelEn: 'Currently smoking' },
      { value: 'former', labelTh: 'เคยสูบแต่เลิกแล้ว', labelEn: 'Former smoker' },
      { value: 'never', labelTh: 'ไม่เคยสูบ', labelEn: 'Never smoked' },
    ],
    order: 3,
  },
  {
    id: 'cc_weight_loss',
    symptomId: 'chronic_cough',
    questionTh: 'มีน้ำหนักลดลงโดยไม่ตั้งใจหรือไม่?',
    questionEn: 'Have you had unintentional weight loss?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่', labelEn: 'Yes' },
      { value: 'no', labelTh: 'ไม่', labelEn: 'No' },
    ],
    redFlagValues: ['yes'],
    urgencyIfRedFlag: 'urgent',
    order: 4,
  },
  {
    id: 'cc_fever_night_sweats',
    symptomId: 'chronic_cough',
    questionTh: 'มีไข้ต่ำๆ หรือเหงื่อออกกลางคืนหรือไม่?',
    questionEn: 'Do you have low-grade fever or night sweats?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่', labelEn: 'Yes' },
      { value: 'no', labelTh: 'ไม่', labelEn: 'No' },
    ],
    order: 5,
  },

  // WEIGHT LOSS questions
  {
    id: 'wl_amount',
    symptomId: 'weight_loss',
    questionTh: 'น้ำหนักลดลงมากแค่ไหนใน 6 เดือนที่ผ่านมา?',
    questionEn: 'How much weight have you lost in the past 6 months?',
    type: 'select',
    options: [
      { value: 'less5pct', labelTh: 'น้อยกว่า 5% ของน้ำหนักตัว', labelEn: 'Less than 5% of body weight' },
      { value: 'more5pct', labelTh: '5% ขึ้นไปของน้ำหนักตัว (เช่น 3.5 กก. ถ้าหนัก 70 กก.)', labelEn: '5% or more of body weight' },
    ],
    redFlagValues: ['more5pct'],
    urgencyIfRedFlag: 'urgent',
    order: 1,
  },
  {
    id: 'wl_intentional',
    symptomId: 'weight_loss',
    questionTh: 'น้ำหนักที่ลดลงเป็นผลมาจากการควบคุมอาหารหรือออกกำลังกายหรือไม่?',
    questionEn: 'Is the weight loss intentional (diet/exercise)?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่ ตั้งใจลด', labelEn: 'Yes, intentional' },
      { value: 'no', labelTh: 'ไม่ใช่ ลดโดยไม่ตั้งใจ', labelEn: 'No, unintentional' },
    ],
    order: 2,
  },
  {
    id: 'wl_appetite',
    symptomId: 'weight_loss',
    questionTh: 'ความอยากอาหารเป็นอย่างไร?',
    questionEn: 'How is your appetite?',
    type: 'select',
    options: [
      { value: 'decreased', labelTh: 'กินได้น้อยลงมาก', labelEn: 'Significantly decreased' },
      { value: 'normal', labelTh: 'ปกติ แต่น้ำหนักยังลด', labelEn: 'Normal, but still losing weight' },
      { value: 'increased', labelTh: 'กินเยอะขึ้นแต่น้ำหนักยังลด', labelEn: 'Increased, but still losing weight' },
    ],
    redFlagValues: ['normal', 'increased'],
    urgencyIfRedFlag: 'urgent',
    order: 3,
  },

  // RECTAL BLEEDING questions
  {
    id: 'rb_color',
    symptomId: 'rectal_bleeding',
    questionTh: 'สีของเลือดเป็นอย่างไร?',
    questionEn: 'What color is the blood?',
    type: 'select',
    options: [
      { value: 'bright_red', labelTh: 'แดงสด (เลือดใหม่)', labelEn: 'Bright red (fresh blood)' },
      { value: 'dark_tarry', labelTh: 'ดำหรือคล้ำ เหมือนยางมะตอย', labelEn: 'Dark/black tarry (melena)' },
      { value: 'mixed_stool', labelTh: 'ปนกับอุจจาระทั่วทั้งก้อน', labelEn: 'Mixed throughout stool' },
    ],
    redFlagValues: ['dark_tarry', 'mixed_stool'],
    urgencyIfRedFlag: 'urgent',
    order: 1,
  },
  {
    id: 'rb_duration',
    symptomId: 'rectal_bleeding',
    questionTh: 'มีเลือดออกมานานเท่าไหร่แล้ว?',
    questionEn: 'How long has this been happening?',
    type: 'select',
    options: [
      { value: 'once', labelTh: 'ครั้งเดียว', labelEn: 'Just once' },
      { value: 'days', labelTh: 'หลายวัน', labelEn: 'Several days' },
      { value: 'weeks_plus', labelTh: 'หลายสัปดาห์ขึ้นไป', labelEn: 'Weeks or more' },
    ],
    redFlagValues: ['weeks_plus'],
    urgencyIfRedFlag: 'urgent',
    order: 2,
  },
  {
    id: 'rb_bowel_change',
    symptomId: 'rectal_bleeding',
    questionTh: 'มีการเปลี่ยนแปลงในพฤติกรรมการถ่ายหรือไม่?',
    questionEn: 'Have your bowel habits changed recently?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่ เช่น ท้องผูกและถ่ายเหลวสลับกัน', labelEn: 'Yes (constipation/diarrhea alternating)' },
      { value: 'no', labelTh: 'ไม่', labelEn: 'No' },
    ],
    redFlagValues: ['yes'],
    urgencyIfRedFlag: 'urgent',
    order: 3,
  },

  // HEADACHE questions
  {
    id: 'ha_onset',
    symptomId: 'headache',
    questionTh: 'ลักษณะการเกิดปวดหัวเป็นแบบใด?',
    questionEn: 'How did the headache start?',
    type: 'select',
    options: [
      { value: 'thunderclap', labelTh: 'ปวดรุนแรงมากทันที "เหมือนฟ้าผ่า"', labelEn: 'Sudden severe "thunderclap" onset' },
      { value: 'gradual_severe', labelTh: 'ค่อยๆ ปวดมากขึ้นเรื่อยๆ', labelEn: 'Gradually worsening' },
      { value: 'episodic', labelTh: 'เป็นๆ หายๆ', labelEn: 'Comes and goes' },
      { value: 'tension', labelTh: 'ปวดตึงรอบศีรษะ', labelEn: 'Tension-type, band-like' },
    ],
    redFlagValues: ['thunderclap'],
    urgencyIfRedFlag: 'emergency',
    order: 1,
  },
  {
    id: 'ha_associated',
    symptomId: 'headache',
    questionTh: 'มีอาการร่วมหรือไม่?',
    questionEn: 'Any associated symptoms?',
    type: 'select',
    options: [
      { value: 'neck_stiff_fever', labelTh: 'คอแข็ง มีไข้ ไม่ทนแสง', labelEn: 'Stiff neck, fever, light sensitivity' },
      { value: 'vision_speech', labelTh: 'ตามองเห็นผิดปกติหรือพูดไม่ออก', labelEn: 'Vision changes or speech difficulty' },
      { value: 'nausea_only', labelTh: 'คลื่นไส้เล็กน้อย', labelEn: 'Mild nausea only' },
      { value: 'none', labelTh: 'ไม่มีอาการร่วม', labelEn: 'None' },
    ],
    redFlagValues: ['neck_stiff_fever', 'vision_speech'],
    urgencyIfRedFlag: 'emergency',
    order: 2,
  },

  // SHOULDER / SCAPULAR PAIN questions
  {
    id: 'sp_movement',
    symptomId: 'shoulder_pain',
    questionTh: 'ปวดมากขึ้นเมื่อยกแขนหรือขยับไหล่หรือไม่?',
    questionEn: 'Does pain worsen when lifting arm or moving shoulder?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่', labelEn: 'Yes' },
      { value: 'no', labelTh: 'ไม่', labelEn: 'No' },
    ],
    order: 1,
  },
  {
    id: 'sp_numbness',
    symptomId: 'shoulder_pain',
    questionTh: 'มีอาการชาหรืออ่อนแรงลงแขนหรือมือหรือไม่?',
    questionEn: 'Any numbness or weakness in arm or hand?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่', labelEn: 'Yes' },
      { value: 'no', labelTh: 'ไม่', labelEn: 'No' },
    ],
    redFlagValues: ['yes'],
    urgencyIfRedFlag: 'soon',
    order: 2,
  },
  {
    id: 'sp_night',
    symptomId: 'shoulder_pain',
    questionTh: 'ปวดกลางคืนหรือขณะพักหรือไม่?',
    questionEn: 'Pain at night or at rest?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่ ปวดตอนกลางคืนด้วย', labelEn: 'Yes, night pain' },
      { value: 'no', labelTh: 'ปวดเฉพาะตอนขยับ', labelEn: 'Only when moving' },
    ],
    order: 3,
  },
  {
    id: 'sp_systemic',
    symptomId: 'shoulder_pain',
    questionTh: 'มีน้ำหนักลด มีไข้ หรืออ่อนเพลียมากร่วมด้วยหรือไม่?',
    questionEn: 'Any weight loss, fever, or significant fatigue along with shoulder pain?',
    type: 'boolean',
    options: [
      { value: 'yes', labelTh: 'ใช่', labelEn: 'Yes' },
      { value: 'no', labelTh: 'ไม่', labelEn: 'No' },
    ],
    redFlagValues: ['yes'],
    urgencyIfRedFlag: 'urgent',
    order: 4,
  },

  // SHORTNESS OF BREATH questions
  {
    id: 'sob_severity',
    symptomId: 'dyspnea',
    questionTh: 'ระดับความรุนแรงของการหายใจลำบาก?',
    questionEn: 'How severe is the breathing difficulty?',
    type: 'select',
    options: [
      { value: 'rest', labelTh: 'หายใจลำบากแม้ขณะนั่งพัก', labelEn: 'Difficulty at rest / cannot speak' },
      { value: 'minimal', labelTh: 'หายใจลำบากเมื่อเดินระยะสั้น', labelEn: 'Difficulty with minimal exertion' },
      { value: 'exertion', labelTh: 'เฉพาะเมื่อออกแรงหนัก', labelEn: 'Only with heavy exertion' },
    ],
    redFlagValues: ['rest'],
    urgencyIfRedFlag: 'emergency',
    order: 1,
  },
  {
    id: 'sob_onset',
    symptomId: 'dyspnea',
    questionTh: 'เกิดขึ้นฉับพลันหรือค่อยๆ เป็น?',
    questionEn: 'Sudden onset or gradual?',
    type: 'select',
    options: [
      { value: 'sudden', labelTh: 'ฉับพลัน (ภายในนาที)', labelEn: 'Sudden (within minutes)' },
      { value: 'hours', labelTh: 'เป็นชั่วโมงที่ผ่านมา', labelEn: 'Past few hours' },
      { value: 'days_weeks', labelTh: 'ค่อยๆ แย่ลงในช่วงวันหรือสัปดาห์', labelEn: 'Gradually over days/weeks' },
    ],
    redFlagValues: ['sudden'],
    urgencyIfRedFlag: 'emergency',
    order: 2,
  },

  // FATIGUE questions
  {
    id: 'fat_duration',
    symptomId: 'fatigue',
    questionTh: 'อ่อนเพลียมานานเท่าไหร่?',
    questionEn: 'How long have you been feeling fatigued?',
    type: 'select',
    options: [
      { value: 'less2w', labelTh: 'น้อยกว่า 2 สัปดาห์', labelEn: 'Less than 2 weeks' },
      { value: '2to4w', labelTh: '2–4 สัปดาห์', labelEn: '2–4 weeks' },
      { value: 'more1m', labelTh: 'มากกว่า 1 เดือน', labelEn: 'More than 1 month' },
    ],
    order: 1,
  },
  {
    id: 'fat_associated',
    symptomId: 'fatigue',
    questionTh: 'มีอาการอื่นร่วมด้วยหรือไม่?',
    questionEn: 'Are there associated symptoms?',
    type: 'select',
    options: [
      { value: 'weight_fever_sweat', labelTh: 'น้ำหนักลด มีไข้ เหงื่อออกกลางคืน', labelEn: 'Weight loss, fever, night sweats' },
      { value: 'mood_sleep', labelTh: 'อารมณ์ตก นอนไม่หลับ เบื่ออาหาร', labelEn: 'Low mood, sleep issues, loss of appetite' },
      { value: 'none', labelTh: 'ไม่มีอาการอื่นชัดเจน', labelEn: 'None specific' },
    ],
    redFlagValues: ['weight_fever_sweat'],
    urgencyIfRedFlag: 'urgent',
    order: 2,
  },
]

// ============================================================
// CONDITION GROUPS (Educational Navigation Groups — NOT Diagnoses)
// ============================================================

export const CONDITION_GROUPS: ConditionGroup[] = [
  {
    id: 'cardiac_group',
    nameTh: 'ภาวะที่เกี่ยวกับหัวใจและหลอดเลือด',
    nameEn: 'Cardiovascular conditions group',
    descriptionTh: 'อาการของคุณบางส่วนอาจสัมพันธ์กับภาวะหัวใจและหลอดเลือด ซึ่งต้องได้รับการประเมินโดยแพทย์เพื่อยืนยัน',
    urgencyLevel: 'urgent',
    specialtyTh: 'อายุรแพทย์โรคหัวใจ (Cardiologist)',
    specialtyEn: 'Cardiologist / Internal Medicine',
    suggestedTestsTh: ['คลื่นไฟฟ้าหัวใจ (EKG)', 'เอนไซม์หัวใจ (Troponin)', 'ตรวจเลือด CBC', 'เอกซเรย์ทรวงอก'],
    redFlagsTh: ['เจ็บร้าวไปแขนซ้ายหรือกราม', 'มีเหงื่อแตกและหายใจลำบาก', 'เจ็บรุนแรงและเกิดขึ้นทันที'],
    relevantSymptomIds: ['chest_pain', 'dyspnea', 'palpitations', 'swelling', 'fatigue'],
    evidence: makeEvidence('American Heart Association Clinical Guidelines', 'B', 2023, 'AHA/ACC Chest Pain Guidelines'),
  },
  {
    id: 'respiratory_group',
    nameTh: 'ภาวะที่เกี่ยวกับปอดและระบบทางเดินหายใจ',
    nameEn: 'Respiratory / Pulmonary conditions group',
    descriptionTh: 'อาการที่คุณบอกอาจเกี่ยวข้องกับระบบทางเดินหายใจ ควรได้รับการตรวจวินิจฉัยโดยแพทย์',
    urgencyLevel: 'soon',
    specialtyTh: 'อายุรแพทย์ระบบทางเดินหายใจ (Pulmonologist)',
    specialtyEn: 'Pulmonologist / Internal Medicine',
    suggestedTestsTh: ['เอกซเรย์ทรวงอก', 'ตรวจสมรรถภาพปอด (Spirometry)', 'ตรวจเสมหะ', 'CT ทรวงอก (ถ้าแพทย์เห็นสมควร)'],
    redFlagsTh: ['มีเลือดปนเสมหะ', 'น้ำหนักลดร่วมกับไอเรื้อรัง', 'สูบบุหรี่มานาน'],
    relevantSymptomIds: ['chronic_cough', 'dyspnea', 'chest_pain', 'fatigue'],
    evidence: makeEvidence('NCCN Clinical Practice Guidelines — Lung Cancer Screening', 'B', 2024),
  },
  {
    id: 'colorectal_group',
    nameTh: 'ภาวะที่เกี่ยวกับลำไส้ใหญ่และทางเดินอาหาร',
    nameEn: 'Colorectal / GI conditions group',
    descriptionTh: 'อาการที่คุณบอกอาจเกี่ยวข้องกับลำไส้ใหญ่หรือทางเดินอาหาร ควรได้รับการตรวจวินิจฉัยโดยแพทย์ ไม่ควรละเลย',
    urgencyLevel: 'urgent',
    specialtyTh: 'อายุรแพทย์ระบบทางเดินอาหาร (Gastroenterologist)',
    specialtyEn: 'Gastroenterologist',
    suggestedTestsTh: ['ตรวจเลือดในอุจจาระ (FOBT/FIT)', 'ตรวจเลือด CBC', 'ส่องกล้องลำไส้ใหญ่ (ถ้าแพทย์เห็นสมควร)'],
    redFlagsTh: ['ถ่ายเป็นเลือดสีดำ (melena)', 'ลักษณะอุจจาระเปลี่ยนอย่างชัดเจน', 'น้ำหนักลดร่วมกับถ่ายเป็นเลือด'],
    relevantSymptomIds: ['rectal_bleeding', 'chronic_diarrhea', 'abdominal_pain', 'weight_loss'],
    evidence: makeEvidence('NCCN Guidelines — Colorectal Cancer Screening', 'A', 2024),
  },
  {
    id: 'general_malignancy_group',
    nameTh: 'ภาวะที่ควรได้รับการตรวจเพิ่มเติมอย่างจริงจัง',
    nameEn: 'Conditions requiring thorough evaluation',
    descriptionTh: 'การมีน้ำหนักลดโดยไม่ทราบสาเหตุ ร่วมกับอาการอื่น อาจบ่งบอกถึงหลายภาวะ รวมถึงภาวะที่ต้องตรวจสอบอย่างละเอียด ควรพบแพทย์เพื่อตรวจเพิ่มเติม',
    urgencyLevel: 'urgent',
    specialtyTh: 'อายุรแพทย์ทั่วไป (Internal Medicine)',
    specialtyEn: 'Internal Medicine Physician',
    suggestedTestsTh: ['ตรวจเลือด CBC + Comprehensive panel', 'LFT, RFT', 'Chest X-ray', 'อัลตราซาวด์ช่องท้อง'],
    redFlagsTh: ['น้ำหนักลดมากกว่า 5% ใน 6 เดือน', 'มีไข้ต่ำๆ ต่อเนื่อง', 'เหงื่อออกกลางคืน'],
    relevantSymptomIds: ['weight_loss', 'fatigue', 'night_sweats', 'persistent_fever'],
    evidence: pendingEvidence('Unexplained weight loss differential'),
  },
  {
    id: 'neurological_group',
    nameTh: 'ภาวะที่เกี่ยวกับระบบประสาทและสมอง',
    nameEn: 'Neurological conditions group',
    descriptionTh: 'อาการของคุณอาจเกี่ยวข้องกับระบบประสาท ซึ่งมีหลายภาวะที่เป็นไปได้ ควรได้รับการประเมินโดยแพทย์',
    urgencyLevel: 'soon',
    specialtyTh: 'อายุรแพทย์ระบบประสาท (Neurologist)',
    specialtyEn: 'Neurologist',
    suggestedTestsTh: ['ตรวจความดันโลหิต', 'ตรวจเลือด', 'CT หรือ MRI สมอง (ถ้าแพทย์เห็นสมควร)'],
    redFlagsTh: ['ปวดหัวรุนแรงทันทีทันใด', 'มีไข้ร่วมกับคอแข็ง', 'มีอาการอ่อนแรงครึ่งซีก'],
    relevantSymptomIds: ['headache', 'dizziness', 'fatigue'],
    evidence: pendingEvidence('Headache differential diagnosis'),
  },
  {
    id: 'musculoskeletal_group',
    nameTh: 'ภาวะที่เกี่ยวกับกล้ามเนื้อและโครงกระดูก',
    nameEn: 'Musculoskeletal conditions group',
    descriptionTh: 'อาการปวดของคุณอาจเกี่ยวข้องกับกล้ามเนื้อ เส้นเอ็น หรือกระดูกสันหลัง ซึ่งมีหลายสาเหตุที่รักษาได้',
    urgencyLevel: 'routine',
    specialtyTh: 'ศัลยแพทย์กระดูกหรืออายุรแพทย์ (Orthopedic / Physical Medicine)',
    specialtyEn: 'Orthopedic or Physical Medicine',
    suggestedTestsTh: ['เอกซเรย์ไหล่หรือกระดูกสันหลัง', 'ตรวจร่างกายโดยแพทย์'],
    redFlagsTh: ['อ่อนแรงหรือชาลงแขน', 'ปวดมากขึ้นเรื่อยๆ ในเวลากลางคืน', 'มีน้ำหนักลดร่วมด้วย'],
    relevantSymptomIds: ['shoulder_pain'],
    evidence: pendingEvidence('Shoulder pain differential'),
  },
  {
    id: 'liver_group',
    nameTh: 'ภาวะที่เกี่ยวกับตับและระบบน้ำดี',
    nameEn: 'Hepatic / Biliary conditions group',
    descriptionTh: 'อาการตาเหลืองหรือผิวเหลืองต้องได้รับการประเมินโดยแพทย์อย่างเร่งด่วน มีหลายภาวะที่เป็นไปได้',
    urgencyLevel: 'urgent',
    specialtyTh: 'อายุรแพทย์ระบบทางเดินอาหาร / โรคตับ',
    specialtyEn: 'Gastroenterologist / Hepatologist',
    suggestedTestsTh: ['ตรวจการทำงานตับ (LFT)', 'ตรวจไวรัสตับอักเสบ B และ C', 'อัลตราซาวด์ช่องท้อง', 'ตรวจ AFP (tumor marker)'],
    redFlagsTh: ['ตาเหลืองเกิดขึ้นอย่างรวดเร็ว', 'ปวดท้องรุนแรงร่วมด้วย', 'มีไข้สูง'],
    relevantSymptomIds: ['jaundice', 'abdominal_pain', 'fatigue', 'weight_loss'],
    evidence: makeEvidence('AASLD Practice Guidelines — Liver Disease', 'B', 2023),
  },
  {
    id: 'mental_health_group',
    nameTh: 'ภาวะที่เกี่ยวกับสุขภาพจิตและอารมณ์',
    nameEn: 'Mental health conditions group',
    descriptionTh: 'อาการที่คุณบอกอาจเกี่ยวข้องกับสุขภาพจิต ซึ่งรักษาได้ดีหากได้รับการช่วยเหลือที่ถูกต้อง',
    urgencyLevel: 'routine',
    specialtyTh: 'จิตแพทย์หรือนักจิตวิทยาคลินิก',
    specialtyEn: 'Psychiatrist / Clinical Psychologist',
    suggestedTestsTh: ['แบบประเมิน PHQ-9 (ซึมเศร้า)', 'แบบประเมิน GAD-7 (วิตกกังวล)', 'ตรวจเลือดเพื่อแยกสาเหตุทางกาย'],
    redFlagsTh: ['มีความคิดทำร้ายตัวเอง — โปรดโทร 1323 ทันที'],
    relevantSymptomIds: ['depression_anxiety', 'fatigue', 'persistent_fever'],
    evidence: makeEvidence('PHQ-9 / GAD-7 Validated Instruments', 'A', 2021),
  },
]

// ============================================================
// RED FLAG RULES — Emergency detection
// ============================================================

export const RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: 'cardiac_emergency',
    symptomIds: ['chest_pain'],
    questionAnswers: [
      { questionId: 'cp_radiation', values: ['left_arm_jaw'] },
    ],
    urgencyLevel: 'emergency',
    messageTh: 'อาการที่คุณบอกอาจบ่งชี้ถึงภาวะฉุกเฉินของหัวใจ',
    actionTh: 'โทร 1669 ทันที หรือไปห้องฉุกเฉินที่ใกล้ที่สุดโดยไม่ต้องรอ',
  },
  {
    id: 'cardiac_emergency_2',
    symptomIds: ['chest_pain'],
    questionAnswers: [
      { questionId: 'cp_associated', values: ['sweat_breathless'] },
    ],
    urgencyLevel: 'emergency',
    messageTh: 'อาการเจ็บหน้าอกร่วมกับเหงื่อแตกและหายใจลำบากต้องได้รับการประเมินฉุกเฉิน',
    actionTh: 'โทร 1669 ทันที อย่ารอดูอาการ',
  },
  {
    id: 'severe_breathing',
    symptomIds: ['dyspnea'],
    questionAnswers: [
      { questionId: 'sob_severity', values: ['rest'] },
    ],
    urgencyLevel: 'emergency',
    messageTh: 'การหายใจลำบากขณะพักเป็นภาวะฉุกเฉิน',
    actionTh: 'โทร 1669 ทันที',
  },
  {
    id: 'meningitis_suspect',
    symptomIds: ['headache'],
    questionAnswers: [
      { questionId: 'ha_associated', values: ['neck_stiff_fever'] },
    ],
    urgencyLevel: 'emergency',
    messageTh: 'อาการปวดหัวร่วมกับคอแข็งและมีไข้ต้องได้รับการประเมินฉุกเฉิน',
    actionTh: 'ไปห้องฉุกเฉินทันที',
  },
  {
    id: 'thunderclap_headache',
    symptomIds: ['headache'],
    questionAnswers: [
      { questionId: 'ha_onset', values: ['thunderclap'] },
    ],
    urgencyLevel: 'emergency',
    messageTh: 'ปวดหัวรุนแรงทันทีทันใดเป็นสัญญาณเตือนสำคัญ',
    actionTh: 'ไปห้องฉุกเฉินทันที',
  },
]

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getQuestionsForSymptoms(symptomIds: string[]): FollowUpQuestion[] {
  return FOLLOW_UP_QUESTIONS
    .filter(q => symptomIds.includes(q.symptomId))
    .sort((a, b) => a.order - b.order)
}

export function detectRedFlags(
  symptomIds: string[],
  answers: Record<string, string>
): RedFlagRule[] {
  return RED_FLAG_RULES.filter(rule => {
    const hasRelevantSymptom = rule.symptomIds.some(id => symptomIds.includes(id))
    if (!hasRelevantSymptom) return false

    return rule.questionAnswers.every(qa => {
      const userAnswer = answers[qa.questionId]
      return userAnswer !== undefined && qa.values.includes(userAnswer)
    })
  })
}

export function scoreConditionGroups(
  symptomIds: string[],
  answers: Record<string, string>,
  profile: { age: number | null; isSmoker: boolean; sex: string }
): ConditionGroup[] {
  const scored = CONDITION_GROUPS.map(group => {
    let score = 0

    // Score based on relevant symptoms
    const matchingSymptoms = group.relevantSymptomIds.filter(id => symptomIds.includes(id))
    score += matchingSymptoms.length * 3

    // Extra scoring for specific answer combinations
    if (group.id === 'respiratory_group') {
      if (answers['cc_hemoptysis'] === 'yes') score += 5
      if (answers['cc_smoking'] === 'current') score += 3
      if (profile.isSmoker) score += 2
    }

    if (group.id === 'colorectal_group') {
      if (answers['rb_color'] === 'dark_tarry' || answers['rb_color'] === 'mixed_stool') score += 5
      if (answers['rb_bowel_change'] === 'yes') score += 3
      if (profile.age && profile.age > 50) score += 2
    }

    if (group.id === 'cardiac_group') {
      if (answers['cp_quality'] === 'tight_pressing') score += 4
      if (answers['cp_radiation'] === 'left_arm_jaw') score += 8
      if (answers['cp_associated'] === 'worse_on_exertion') score += 3
    }

    if (group.id === 'general_malignancy_group') {
      if (answers['wl_intentional'] === 'no') score += 4
      if (answers['wl_amount'] === 'more5pct') score += 5
    }

    if (group.id === 'mental_health_group') {
      if (answers['fat_associated'] === 'mood_sleep') score += 5
    }

    return { group, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.group)
}

export function determineUrgency(
  symptomIds: string[],
  answers: Record<string, string>,
  redFlags: RedFlagRule[]
): UrgencyLevel {
  if (redFlags.some(r => r.urgencyLevel === 'emergency')) return 'emergency'

  // Check follow-up question red flag values
  for (const question of FOLLOW_UP_QUESTIONS) {
    if (!symptomIds.includes(question.symptomId)) continue
    const answer = answers[question.id]
    if (answer && question.redFlagValues?.includes(answer) && question.urgencyIfRedFlag) {
      if (question.urgencyIfRedFlag === 'emergency') return 'emergency'
      if (question.urgencyIfRedFlag === 'urgent') return 'urgent'
    }
  }

  // Base urgency from symptoms
  const symptomUrgencies = symptomIds.map(id =>
    SYMPTOMS.find(s => s.id === id)?.baseUrgency ?? 'routine'
  )
  if (symptomUrgencies.includes('urgent')) return 'urgent'
  if (symptomUrgencies.includes('soon')) return 'soon'
  return 'routine'
}

export const BODY_SYSTEM_LABELS: Record<BodySystem, { th: string }> = {
  cardiovascular: { th: 'หัวใจและหลอดเลือด' },
  respiratory: { th: 'ระบบทางเดินหายใจ' },
  gastrointestinal: { th: 'ระบบทางเดินอาหาร' },
  neurological: { th: 'ระบบประสาท' },
  musculoskeletal: { th: 'กล้ามเนื้อและกระดูก' },
  general: { th: 'ทั่วร่างกาย' },
  urological: { th: 'ระบบปัสสาวะ' },
  mental_health: { th: 'สุขภาพจิต' },
  dermatological: { th: 'ผิวหนัง' },
  endocrine: { th: 'ต่อมไร้ท่อ' },
}

export const EXISTING_CONDITIONS_OPTIONS = [
  { value: 'diabetes', labelTh: 'เบาหวาน', labelEn: 'Diabetes' },
  { value: 'hypertension', labelTh: 'ความดันโลหิตสูง', labelEn: 'Hypertension' },
  { value: 'heart_disease', labelTh: 'โรคหัวใจ', labelEn: 'Heart disease' },
  { value: 'copd', labelTh: 'โรคปอดอุดกั้นเรื้อรัง (COPD)', labelEn: 'COPD' },
  { value: 'cancer_history', labelTh: 'ประวัติมะเร็ง', labelEn: 'Cancer history' },
  { value: 'kidney_disease', labelTh: 'โรคไต', labelEn: 'Kidney disease' },
  { value: 'liver_disease', labelTh: 'โรคตับ', labelEn: 'Liver disease' },
  { value: 'thyroid', labelTh: 'โรคต่อมไทรอยด์', labelEn: 'Thyroid disease' },
  { value: 'none', labelTh: 'ไม่มีโรคประจำตัว', labelEn: 'None' },
]
