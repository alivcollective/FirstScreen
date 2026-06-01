// Symptom data by body region
// All labels in Thai — Supabase-ready structure

import type { Symptom, BodyRegion } from '@/types/symptom'

export const symptomsByRegion: Record<BodyRegion, Symptom[]> = {
  head: [
    { id: 'headache', label: 'ปวดหัว', severity: 'medium', region: 'head', relatedConditions: ['hypertension', 'migraine', 'meningitis'] },
    { id: 'dizziness', label: 'วิงเวียนศีรษะ', severity: 'medium', region: 'head', relatedConditions: ['anemia', 'hypertension', 'vertigo'] },
    { id: 'vision_blur', label: 'ตามัว', severity: 'high', region: 'head', relatedConditions: ['diabetes', 'hypertension', 'glaucoma'] },
    { id: 'neck_stiff', label: 'คอแข็ง', severity: 'critical', region: 'head', relatedConditions: ['meningitis'] },
    { id: 'memory_loss', label: 'ความจำแย่ลง', severity: 'high', region: 'head', relatedConditions: ['dementia', 'depression'] },
    { id: 'sore_throat', label: 'เจ็บคอ', severity: 'low', region: 'head', relatedConditions: ['pharyngitis', 'flu'] },
    { id: 'ear_pain', label: 'ปวดหู', severity: 'low', region: 'head', relatedConditions: ['otitis'] },
    { id: 'face_swelling', label: 'หน้าบวม', severity: 'high', region: 'head', relatedConditions: ['allergy', 'kidney-disease'] },
    { id: 'sudden_severe_headache', label: 'ปวดหัวรุนแรงทันทีทันใด', severity: 'critical', region: 'head', relatedConditions: ['meningitis', 'hemorrhagic-stroke'] },
    { id: 'slurred_speech', label: 'พูดไม่ชัด ลิ้นแข็ง', severity: 'critical', region: 'head', relatedConditions: ['stroke'] },
    { id: 'facial_droop', label: 'หน้าเบี้ยว มุมปากตก', severity: 'critical', region: 'head', relatedConditions: ['stroke'] },
  ],
  chest: [
    { id: 'chest_pain', label: 'เจ็บหน้าอก', severity: 'critical', region: 'chest', relatedConditions: ['heart-attack', 'angina', 'pneumonia'] },
    { id: 'shortness_breath', label: 'หายใจลำบาก', severity: 'critical', region: 'chest', relatedConditions: ['heart-failure', 'asthma', 'pneumonia'] },
    { id: 'palpitation', label: 'ใจสั่น หัวใจเต้นเร็ว', severity: 'high', region: 'chest', relatedConditions: ['arrhythmia', 'hyperthyroid', 'anxiety'] },
    { id: 'cough', label: 'ไอ', severity: 'low', region: 'chest', relatedConditions: ['flu', 'bronchitis', 'tb'] },
    { id: 'cough_blood', label: 'ไอเป็นเลือด', severity: 'critical', region: 'chest', relatedConditions: ['tb', 'lung-cancer'] },
    { id: 'chest_tightness', label: 'แน่นหน้าอก', severity: 'high', region: 'chest', relatedConditions: ['heart-attack', 'angina', 'gerd'] },
    { id: 'wheeze', label: 'หายใจมีเสียงหวีด', severity: 'high', region: 'chest', relatedConditions: ['asthma', 'copd'] },
    { id: 'persistent_cough', label: 'ไอเรื้อรัง > 3 สัปดาห์', severity: 'medium', region: 'chest', relatedConditions: ['tb', 'lung-cancer', 'copd'] },
  ],
  abdomen: [
    { id: 'stomach_pain', label: 'ปวดท้อง', severity: 'medium', region: 'abdomen', relatedConditions: ['gastritis', 'appendicitis', 'ibs'] },
    { id: 'nausea', label: 'คลื่นไส้', severity: 'low', region: 'abdomen', relatedConditions: ['gastritis', 'hepatitis'] },
    { id: 'vomiting', label: 'อาเจียน', severity: 'medium', region: 'abdomen', relatedConditions: ['gastritis', 'food-poisoning'] },
    { id: 'diarrhea', label: 'ท้องเสีย', severity: 'medium', region: 'abdomen', relatedConditions: ['food-poisoning', 'ibs', 'infection'] },
    { id: 'blood_stool', label: 'ถ่ายเป็นเลือด', severity: 'critical', region: 'abdomen', relatedConditions: ['colorectal-cancer', 'hemorrhoids', 'ulcer'] },
    { id: 'jaundice', label: 'ตัวเหลือง ตาเหลือง', severity: 'high', region: 'abdomen', relatedConditions: ['hepatitis', 'liver-cancer', 'gallstone'] },
    { id: 'bloating', label: 'ท้องอืด แน่นท้อง', severity: 'low', region: 'abdomen', relatedConditions: ['ibs', 'gastritis'] },
    { id: 'right_upper_pain', label: 'ปวดชายโครงขวา', severity: 'high', region: 'abdomen', relatedConditions: ['gallstone', 'hepatitis', 'liver-cancer'] },
    { id: 'severe_stomach_pain', label: 'ปวดท้องรุนแรงมาก', severity: 'critical', region: 'abdomen', relatedConditions: ['appendicitis', 'pancreatitis'] },
    { id: 'constipation', label: 'ท้องผูกเรื้อรัง', severity: 'medium', region: 'abdomen', relatedConditions: ['colorectal-cancer', 'ibs', 'hypothyroid'] },
  ],
  back: [
    { id: 'back_pain', label: 'ปวดหลัง', severity: 'medium', region: 'back', relatedConditions: ['herniated-disc', 'kidney-stone', 'muscle-strain'] },
    { id: 'lower_back_pain', label: 'ปวดหลังส่วนล่าง', severity: 'medium', region: 'back', relatedConditions: ['herniated-disc', 'kidney-stone'] },
    { id: 'flank_pain', label: 'ปวดบั้นเอว', severity: 'high', region: 'back', relatedConditions: ['kidney-stone', 'kidney-infection'] },
  ],
  'left-arm': [
    { id: 'left_arm_pain', label: 'ปวดแขนซ้าย', severity: 'critical', region: 'left-arm', relatedConditions: ['heart-attack'] },
    { id: 'arm_weakness', label: 'แขนอ่อนแรง', severity: 'high', region: 'left-arm', relatedConditions: ['stroke', 'nerve-compression'] },
    { id: 'numbness_hand', label: 'ชาปลายมือ', severity: 'medium', region: 'left-arm', relatedConditions: ['carpal-tunnel', 'diabetes', 'stroke'] },
  ],
  'right-arm': [
    { id: 'right_arm_pain', label: 'ปวดแขนขวา', severity: 'medium', region: 'right-arm', relatedConditions: ['muscle-strain', 'nerve-compression'] },
    { id: 'arm_weakness_r', label: 'แขนขวาอ่อนแรง', severity: 'high', region: 'right-arm', relatedConditions: ['stroke'] },
    { id: 'numbness_hand_r', label: 'ชาปลายมือขวา', severity: 'medium', region: 'right-arm', relatedConditions: ['carpal-tunnel', 'diabetes'] },
  ],
  'left-leg': [
    { id: 'leg_swelling_l', label: 'ขาซ้ายบวม', severity: 'high', region: 'left-leg', relatedConditions: ['dvt', 'heart-failure', 'kidney-disease'] },
    { id: 'leg_pain_l', label: 'ปวดขาซ้าย', severity: 'medium', region: 'left-leg', relatedConditions: ['dvt', 'varicose', 'muscle-cramp'] },
    { id: 'leg_weakness_l', label: 'ขาซ้ายอ่อนแรง', severity: 'high', region: 'left-leg', relatedConditions: ['stroke', 'herniated-disc'] },
    { id: 'calf_pain_l', label: 'ปวดน่องซ้ายรุนแรง', severity: 'high', region: 'left-leg', relatedConditions: ['dvt'] },
  ],
  'right-leg': [
    { id: 'leg_swelling_r', label: 'ขาขวาบวม', severity: 'high', region: 'right-leg', relatedConditions: ['dvt', 'heart-failure'] },
    { id: 'leg_pain_r', label: 'ปวดขาขวา', severity: 'medium', region: 'right-leg', relatedConditions: ['dvt', 'varicose'] },
    { id: 'leg_weakness_r', label: 'ขาขวาอ่อนแรง', severity: 'high', region: 'right-leg', relatedConditions: ['stroke', 'herniated-disc'] },
    { id: 'calf_pain_r', label: 'ปวดน่องขวารุนแรง', severity: 'high', region: 'right-leg', relatedConditions: ['dvt'] },
  ],
  skin: [
    { id: 'rash', label: 'ผื่น', severity: 'low', region: 'skin', relatedConditions: ['allergy', 'dengue', 'eczema'] },
    { id: 'mole_change', label: 'ไฝเปลี่ยนสี/ขนาด', severity: 'high', region: 'skin', relatedConditions: ['melanoma', 'skin-cancer'] },
    { id: 'lump', label: 'มีก้อนผิดปกติ', severity: 'high', region: 'skin', relatedConditions: ['cancer', 'lipoma', 'lymphoma'] },
    { id: 'petechiae', label: 'จุดเลือดออกใต้ผิวหนัง', severity: 'critical', region: 'skin', relatedConditions: ['dengue', 'leukemia'] },
    { id: 'jaundice_skin', label: 'ผิวเหลือง', severity: 'high', region: 'skin', relatedConditions: ['hepatitis', 'liver-cancer'] },
    { id: 'skin_ulcer', label: 'แผลเรื้อรัง หายช้า', severity: 'medium', region: 'skin', relatedConditions: ['diabetes', 'skin-cancer'] },
  ],
  general: [
    { id: 'fever', label: 'มีไข้ > 38°C', severity: 'medium', region: 'general', relatedConditions: ['flu', 'infection', 'dengue'] },
    { id: 'high_fever', label: 'ไข้สูง > 39°C', severity: 'high', region: 'general', relatedConditions: ['dengue', 'meningitis', 'sepsis'] },
    { id: 'fatigue', label: 'เหนื่อยล้าผิดปกติ', severity: 'medium', region: 'general', relatedConditions: ['anemia', 'cancer', 'depression', 'diabetes'] },
    { id: 'weight_loss', label: 'น้ำหนักลดโดยไม่ทราบสาเหตุ', severity: 'high', region: 'general', relatedConditions: ['cancer', 'tb', 'hyperthyroid', 'diabetes'] },
    { id: 'night_sweat', label: 'เหงื่อออกตอนกลางคืน', severity: 'medium', region: 'general', relatedConditions: ['tb', 'lymphoma', 'menopause'] },
    { id: 'loss_appetite', label: 'เบื่ออาหาร', severity: 'medium', region: 'general', relatedConditions: ['cancer', 'hepatitis', 'depression'] },
    { id: 'swollen_lymph', label: 'ต่อมน้ำเหลืองโต', severity: 'high', region: 'general', relatedConditions: ['lymphoma', 'infection', 'leukemia'] },
    { id: 'fainting', label: 'เป็นลม หมดสติ', severity: 'critical', region: 'general', relatedConditions: ['heart-attack', 'stroke', 'hypoglycemia'] },
    { id: 'confusion', label: 'สับสน มึนงง', severity: 'critical', region: 'general', relatedConditions: ['stroke', 'meningitis', 'sepsis'] },
    { id: 'frequent_urination', label: 'ปัสสาวะบ่อยผิดปกติ', severity: 'medium', region: 'general', relatedConditions: ['diabetes', 'kidney-disease', 'uti'] },
    { id: 'excessive_thirst', label: 'กระหายน้ำมากผิดปกติ', severity: 'medium', region: 'general', relatedConditions: ['diabetes', 'kidney-disease'] },
    { id: 'hair_loss', label: 'ผมร่วงผิดปกติ', severity: 'low', region: 'general', relatedConditions: ['thyroid', 'anemia', 'stress'] },
    { id: 'itching_all_over', label: 'คันตามร่างกายโดยไม่มีผื่น', severity: 'medium', region: 'general', relatedConditions: ['liver-disease', 'kidney-disease', 'lymphoma'] },
    { id: 'cold_intolerance', label: 'หนาวง่ายผิดปกติ', severity: 'low', region: 'general', relatedConditions: ['hypothyroid', 'anemia'] },
    { id: 'heat_intolerance', label: 'ร้อนง่าย เหงื่อออกมาก', severity: 'medium', region: 'general', relatedConditions: ['hyperthyroid', 'menopause'] },
    { id: 'tremor', label: 'มือสั่น ตัวสั่น', severity: 'medium', region: 'general', relatedConditions: ['hyperthyroid', 'parkinson', 'anxiety'] },
    { id: 'bruising_easy', label: '멍ง่าย ห้ามเลือดยาก', severity: 'high', region: 'general', relatedConditions: ['leukemia', 'liver-disease', 'bleeding-disorder'] },
  ],
}

// ── Extended symptoms — added after initial object definition ────
function _extendSymptoms(): void {
  const head = symptomsByRegion.head
  head.push(
    { id: 'runny_nose', label: 'น้ำมูก คัดจมูก', severity: 'low', region: 'head', relatedConditions: ['flu', 'allergy', 'cold'] },
    { id: 'toothache', label: 'ปวดฟัน ปวดกราม', severity: 'low', region: 'head', relatedConditions: ['dental', 'tmj'] },
    { id: 'tongue_change', label: 'ลิ้นเปลี่ยนสี/มีแผล', severity: 'medium', region: 'head', relatedConditions: ['oral-cancer', 'vitamin-deficiency'] },
    { id: 'difficulty_swallowing', label: 'กลืนลำบาก ติดขัด', severity: 'high', region: 'head', relatedConditions: ['esophageal-cancer', 'stroke', 'myasthenia'] },
    { id: 'hoarse_voice', label: 'เสียงแหบผิดปกติ', severity: 'medium', region: 'head', relatedConditions: ['laryngeal-cancer', 'thyroid', 'gerd'] },
  )

  const chest = symptomsByRegion.chest
  chest.push(
    { id: 'breast_lump', label: 'คลำพบก้อนที่เต้านม', severity: 'high', region: 'chest', relatedConditions: ['breast-cancer'] },
    { id: 'nipple_discharge', label: 'มีของเหลวออกจากหัวนม', severity: 'high', region: 'chest', relatedConditions: ['breast-cancer', 'prolactinoma'] },
    { id: 'night_cough', label: 'ไอตอนกลางคืนมาก', severity: 'medium', region: 'chest', relatedConditions: ['asthma', 'gerd', 'heart-failure'] },
    { id: 'hemoptysis_small', label: 'มีเลือดปนเสมหะ (เล็กน้อย)', severity: 'high', region: 'chest', relatedConditions: ['tb', 'lung-cancer', 'bronchiectasis'] },
  )

  const abdomen = symptomsByRegion.abdomen
  abdomen.push(
    { id: 'rectal_pain', label: 'ปวดทวารหนัก', severity: 'medium', region: 'abdomen', relatedConditions: ['hemorrhoids', 'anal-fissure', 'colorectal-cancer'] },
    { id: 'change_stool', label: 'ลักษณะอุจจาระเปลี่ยน (บางลง/สีดำ)', severity: 'high', region: 'abdomen', relatedConditions: ['colorectal-cancer', 'upper-gi-bleed'] },
    { id: 'mucus_stool', label: 'อุจจาระมีมูก', severity: 'medium', region: 'abdomen', relatedConditions: ['ibs', 'ibd', 'infection'] },
    { id: 'upper_abdominal_pain', label: 'ปวดท้องส่วนบน หลังกินอาหาร', severity: 'medium', region: 'abdomen', relatedConditions: ['gastritis', 'gerd', 'peptic-ulcer'] },
    { id: 'groin_lump', label: 'มีก้อนที่ขาหนีบ', severity: 'high', region: 'abdomen', relatedConditions: ['hernia', 'lymphoma', 'ovarian-cancer'] },
  )

  const leftLeg = symptomsByRegion['left-leg']
  leftLeg.push(
    { id: 'foot_ulcer_l', label: 'แผลที่เท้าซ้ายหายช้า', severity: 'high', region: 'left-leg', relatedConditions: ['diabetes', 'peripheral-artery'] },
    { id: 'varicose_l', label: 'เส้นเลือดขอดขาซ้าย', severity: 'low', region: 'left-leg', relatedConditions: ['varicose', 'dvt'] },
  )
  const rightLeg = symptomsByRegion['right-leg']
  rightLeg.push(
    { id: 'foot_ulcer_r', label: 'แผลที่เท้าขวาหายช้า', severity: 'high', region: 'right-leg', relatedConditions: ['diabetes', 'peripheral-artery'] },
    { id: 'varicose_r', label: 'เส้นเลือดขอดขาขวา', severity: 'low', region: 'right-leg', relatedConditions: ['varicose', 'dvt'] },
    { id: 'cold_feet', label: 'เท้าเย็นผิดปกติ', severity: 'medium', region: 'right-leg', relatedConditions: ['peripheral-artery', 'diabetes', 'hypothyroid'] },
  )

  const skin = symptomsByRegion.skin
  skin.push(
    { id: 'acanthosis', label: 'ผิวคล้ำที่คอ รักแร้ (Acanthosis)', severity: 'medium', region: 'skin', relatedConditions: ['diabetes', 'insulin-resistance'] },
    { id: 'spider_angioma', label: 'เส้นเลือดแมงมุมใต้ผิวหนัง', severity: 'medium', region: 'skin', relatedConditions: ['liver-disease', 'pregnancy'] },
    { id: 'hair_loss_patch', label: 'ผมร่วงเป็นหย่อม', severity: 'medium', region: 'skin', relatedConditions: ['alopecia', 'thyroid', 'stress'] },
    { id: 'nail_change', label: 'เล็บเปลี่ยนสี/รูปร่าง', severity: 'medium', region: 'skin', relatedConditions: ['fungal', 'psoriasis', 'anemia'] },
    { id: 'chronic_wound', label: 'แผลเรื้อรังหายช้ากว่า 3 สัปดาห์', severity: 'high', region: 'skin', relatedConditions: ['skin-cancer', 'diabetes', 'vasculitis'] },
  )
}
_extendSymptoms()

// ── Helpers ──────────────────────────────────────────────────

export const allSymptoms: Symptom[] = Object.values(symptomsByRegion).flat()

export function findSymptomById(id: string): Symptom | undefined {
  return allSymptoms.find(s => s.id === id)
}

export function getSymptomsByRegion(region: BodyRegion): Symptom[] {
  return symptomsByRegion[region] ?? []
}

export const REGION_LABELS: Record<string, string> = {
  head: 'ศีรษะ / คอ',
  chest: 'หน้าอก',
  abdomen: 'ท้อง',
  back: 'หลัง',
  'left-arm': 'แขนซ้าย',
  'right-arm': 'แขนขวา',
  'left-leg': 'ขาซ้าย',
  'right-leg': 'ขาขวา',
  skin: 'ผิวหนัง',
  general: 'ทั่วไป',
}

export const SEVERITY_COLORS = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
} as const
