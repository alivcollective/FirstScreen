// Condition mapping — symptom combinations → possible conditions
// Supabase-ready structure. 25+ conditions covering Thai disease burden.
// SAFETY: Educational only. Never used to diagnose.

import type { Condition, ConditionMatch } from '@/types/symptom'

const LAB = {
  cbc:       { id: 'cbc',       name_th: 'ตรวจความสมบูรณ์ของเลือด (CBC)',          name_en: 'Complete Blood Count',     purpose: 'ตรวจโลหิตจาง การติดเชื้อ มะเร็งเม็ดเลือด',     priority: 'essential' as const },
  lipid:     { id: 'lipid',     name_th: 'ตรวจไขมันในเลือด (Lipid Profile)',        name_en: 'Lipid Panel',              purpose: 'ตรวจคอเลสเตอรอล ไตรกลีเซอไรด์',               priority: 'essential' as const },
  ecg:       { id: 'ecg',       name_th: 'คลื่นไฟฟ้าหัวใจ (ECG/EKG)',              name_en: 'Electrocardiogram',        purpose: 'ตรวจจังหวะหัวใจ กล้ามเนื้อหัวใจ',               priority: 'essential' as const },
  troponin:  { id: 'troponin',  name_th: 'ตรวจเอนไซม์หัวใจ (Troponin)',            name_en: 'Cardiac Troponin',         purpose: 'ยืนยันกล้ามเนื้อหัวใจถูกทำลาย',                  priority: 'essential' as const },
  cxr:       { id: 'cxr',       name_th: 'เอกซเรย์ทรวงอก (Chest X-ray)',            name_en: 'Chest X-ray',              purpose: 'ตรวจปอด หัวใจ มะเร็งปอด วัณโรค',                priority: 'essential' as const },
  hba1c:     { id: 'hba1c',     name_th: 'ตรวจน้ำตาลสะสม (HbA1c)',                 name_en: 'Hemoglobin A1c',           purpose: 'ประเมินการควบคุมเบาหวาน 3 เดือน',                priority: 'essential' as const },
  fpg:       { id: 'fpg',       name_th: 'ตรวจน้ำตาลขณะอดอาหาร (FPG)',             name_en: 'Fasting Plasma Glucose',   purpose: 'วินิจฉัยเบาหวาน ภาวะก่อนเบาหวาน',              priority: 'essential' as const },
  lft:       { id: 'lft',       name_th: 'ตรวจการทำงานตับ (LFT)',                  name_en: 'Liver Function Tests',     purpose: 'ประเมินสุขภาพตับ ตับอักเสบ',                     priority: 'essential' as const },
  rft:       { id: 'rft',       name_th: 'ตรวจการทำงานไต (RFT/BUN/Cr)',            name_en: 'Renal Function Tests',     purpose: 'ประเมินสุขภาพไต โรคไตเรื้อรัง',                  priority: 'essential' as const },
  urine:     { id: 'urine',     name_th: 'ตรวจปัสสาวะ (UA)',                       name_en: 'Urinalysis',               purpose: 'ตรวจการติดเชื้อ โรคไต เบาหวาน',                  priority: 'recommended' as const },
  dengue_ns1:{ id: 'dengue_ns1',name_th: 'ตรวจไข้เลือดออก (Dengue NS1/IgM/IgG)', name_en: 'Dengue Antigen/Antibody',  purpose: 'ยืนยันการติดเชื้อไข้เลือดออก',                    priority: 'essential' as const },
  uss_abd:   { id: 'uss_abd',   name_th: 'อัลตราซาวด์ช่องท้อง (USS Abdomen)',      name_en: 'Abdominal Ultrasound',     purpose: 'ตรวจตับ ถุงน้ำดี ไต นิ่ว',                       priority: 'recommended' as const },
  ct_head:   { id: 'ct_head',   name_th: 'CT สมอง (CT Brain)',                      name_en: 'CT Brain',                 purpose: 'ตรวจเลือดออกในสมอง หลอดเลือดสมอง',              priority: 'essential' as const },
  thyroid:   { id: 'thyroid',   name_th: 'ตรวจไทรอยด์ (TSH/T3/T4)',               name_en: 'Thyroid Function',         purpose: 'ตรวจการทำงานต่อมไทรอยด์',                       priority: 'recommended' as const },
  afb:       { id: 'afb',       name_th: 'ตรวจเสมหะวัณโรค (AFB Smear/Culture)',    name_en: 'AFB Sputum Test',          purpose: 'ยืนยันวัณโรค',                                   priority: 'essential' as const },
  fobt:      { id: 'fobt',      name_th: 'ตรวจเลือดในอุจจาระ (FOBT/FIT)',          name_en: 'Fecal Occult Blood Test',  purpose: 'คัดกรองมะเร็งลำไส้ใหญ่',                         priority: 'essential' as const },
  colonoscopy:{ id: 'colonoscopy', name_th: 'ส่องกล้องลำไส้ใหญ่ (Colonoscopy)',   name_en: 'Colonoscopy',              purpose: 'ตรวจมะเร็งลำไส้ใหญ่โดยตรง',                     priority: 'recommended' as const },
  ct_chest:  { id: 'ct_chest',  name_th: 'CT ทรวงอก (CT Chest)',                   name_en: 'CT Chest',                 purpose: 'ตรวจมะเร็งปอด วัณโรค',                          priority: 'recommended' as const },
  ultrasound_liver: { id: 'uss_liver', name_th: 'อัลตราซาวด์ตับ + AFP',           name_en: 'Liver Ultrasound + AFP',   purpose: 'คัดกรองมะเร็งตับ',                               priority: 'essential' as const },
  d_dimer:   { id: 'd_dimer',   name_th: 'ตรวจ D-dimer',                          name_en: 'D-dimer',                  purpose: 'ประเมินภาวะลิ่มเลือดอุดตัน',                     priority: 'essential' as const },
  bp_monitor:{ id: 'bp_monitor',name_th: 'วัดความดันโลหิต',                       name_en: 'Blood Pressure Measurement',purpose: 'ตรวจความดันโลหิต',                              priority: 'essential' as const },
}

export const CONDITIONS: Condition[] = [
  {
    id: 'heart-attack',
    name_th: 'กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน',
    name_en: 'Acute Myocardial Infarction (Heart Attack)',
    description_th: 'เลือดไปเลี้ยงหัวใจลดลงทันที — ฉุกเฉินสูงสุด โทร 1669',
    trigger_symptoms: ['chest_pain', 'chest_tightness', 'left_arm_pain', 'shortness_breath', 'palpitation', 'fatigue', 'nausea'],
    lab_tests: [LAB.ecg, LAB.troponin, LAB.cbc, LAB.lipid],
    recommended_specialty: 'อายุรแพทย์โรคหัวใจ (Cardiologist)',
    urgency_hint: 'emergency',
    encyclopedia_slug: 'cardiovascular-disease',
    icd10: 'I21',
  },
  {
    id: 'stroke',
    name_th: 'โรคหลอดเลือดสมอง (Stroke)',
    name_en: 'Stroke / CVA',
    description_th: 'เลือดไม่ไปเลี้ยงสมอง — ฉุกเฉิน ทุกนาทีมีความสำคัญ',
    trigger_symptoms: ['slurred_speech', 'facial_droop', 'arm_weakness', 'arm_weakness_r', 'leg_weakness_l', 'leg_weakness_r', 'sudden_severe_headache', 'confusion', 'vision_blur'],
    lab_tests: [LAB.ct_head, LAB.ecg, LAB.cbc, LAB.bp_monitor],
    recommended_specialty: 'อายุรแพทย์ประสาทวิทยา (Neurologist)',
    urgency_hint: 'emergency',
    encyclopedia_slug: 'cardiovascular-disease',
    icd10: 'I63',
  },
  {
    id: 'hypertension',
    name_th: 'ความดันโลหิตสูง',
    name_en: 'Hypertension',
    description_th: 'ความดันเลือดสูงเกินปกติ อาจไม่มีอาการจนรุนแรง',
    trigger_symptoms: ['headache', 'dizziness', 'vision_blur', 'palpitation', 'chest_pain'],
    lab_tests: [LAB.bp_monitor, LAB.rft, LAB.ecg, LAB.lipid],
    recommended_specialty: 'อายุรแพทย์ (Internal Medicine)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'hypertension',
    icd10: 'I10',
  },
  {
    id: 'angina',
    name_th: 'โรคหัวใจขาดเลือดเรื้อรัง (Angina)',
    name_en: 'Angina Pectoris',
    description_th: 'เจ็บหน้าอกจากหลอดเลือดหัวใจตีบ มักเกิดตอนออกแรง',
    trigger_symptoms: ['chest_pain', 'chest_tightness', 'shortness_breath', 'fatigue'],
    lab_tests: [LAB.ecg, LAB.troponin, LAB.lipid, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์โรคหัวใจ (Cardiologist)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'cardiovascular-disease',
    icd10: 'I20',
  },
  {
    id: 'dengue',
    name_th: 'ไข้เลือดออก (Dengue Fever)',
    name_en: 'Dengue Fever',
    description_th: 'โรคติดเชื้อไวรัสจากยุงลาย พบบ่อยในไทย',
    trigger_symptoms: ['high_fever', 'fever', 'rash', 'petechiae', 'fatigue', 'nausea', 'vomiting', 'stomach_pain', 'back_pain'],
    lab_tests: [LAB.dengue_ns1, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์ (Internal Medicine)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'dengue',
    icd10: 'A90',
  },
  {
    id: 'meningitis',
    name_th: 'เยื่อหุ้มสมองอักเสบ (Meningitis)',
    name_en: 'Meningitis',
    description_th: 'การอักเสบของเยื่อหุ้มสมอง — ฉุกเฉิน',
    trigger_symptoms: ['neck_stiff', 'sudden_severe_headache', 'high_fever', 'confusion', 'rash', 'petechiae'],
    lab_tests: [LAB.cbc, LAB.ct_head],
    recommended_specialty: 'อายุรแพทย์ประสาทวิทยา (Neurologist)',
    urgency_hint: 'emergency',
    encyclopedia_slug: 'meningitis',
    icd10: 'G03',
  },
  {
    id: 'diabetes',
    name_th: 'เบาหวาน (Diabetes Mellitus)',
    name_en: 'Diabetes Mellitus',
    description_th: 'น้ำตาลในเลือดสูงเรื้อรัง ส่งผลต่ออวัยวะทั่วร่างกาย',
    trigger_symptoms: ['fatigue', 'vision_blur', 'weight_loss', 'numbness_hand', 'skin_ulcer', 'frequent_urination'],
    lab_tests: [LAB.fpg, LAB.hba1c, LAB.urine, LAB.rft],
    recommended_specialty: 'อายุรแพทย์ต่อมไร้ท่อ (Endocrinologist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'type-2-diabetes',
    icd10: 'E11',
  },
  {
    id: 'tb',
    name_th: 'วัณโรค (Tuberculosis)',
    name_en: 'Pulmonary Tuberculosis',
    description_th: 'การติดเชื้อแบคทีเรียในปอด — ต้องรักษานาน 6 เดือน',
    trigger_symptoms: ['persistent_cough', 'cough_blood', 'night_sweat', 'weight_loss', 'fever', 'fatigue', 'loss_appetite'],
    lab_tests: [LAB.afb, LAB.cxr, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์โรคปอด (Pulmonologist)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'tuberculosis',
    icd10: 'A15',
  },
  {
    id: 'lung-cancer',
    name_th: 'มะเร็งปอด (Lung Cancer)',
    name_en: 'Lung Cancer',
    description_th: 'มะเร็งที่เกิดในเนื้อเยื่อปอด — ตรวจพบเร็วผลดีกว่า',
    trigger_symptoms: ['persistent_cough', 'cough_blood', 'shortness_breath', 'chest_pain', 'weight_loss', 'fatigue', 'night_sweat', 'loss_appetite'],
    lab_tests: [LAB.cxr, LAB.ct_chest, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์โรคปอด / ออนโคโลจิสต์',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'lung-cancer',
    icd10: 'C34',
  },
  {
    id: 'colorectal-cancer',
    name_th: 'มะเร็งลำไส้ใหญ่ (Colorectal Cancer)',
    name_en: 'Colorectal Cancer',
    description_th: 'มะเร็งที่เกิดในลำไส้ใหญ่หรือทวารหนัก',
    trigger_symptoms: ['blood_stool', 'constipation', 'diarrhea', 'stomach_pain', 'weight_loss', 'fatigue', 'bloating'],
    lab_tests: [LAB.fobt, LAB.colonoscopy, LAB.cbc],
    recommended_specialty: 'ศัลยแพทย์ระบบทางเดินอาหาร (GI Surgeon)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'colorectal-cancer',
    icd10: 'C18',
  },
  {
    id: 'liver-cancer',
    name_th: 'มะเร็งตับ (Hepatocellular Carcinoma)',
    name_en: 'Liver Cancer (HCC)',
    description_th: 'มะเร็งตับ พบบ่อยในผู้ติดเชื้อไวรัสตับอักเสบบี/ซี',
    trigger_symptoms: ['right_upper_pain', 'jaundice', 'jaundice_skin', 'weight_loss', 'fatigue', 'loss_appetite', 'bloating'],
    lab_tests: [LAB.ultrasound_liver, LAB.lft, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์โรคตับ (Hepatologist)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'liver-cancer',
    icd10: 'C22',
  },
  {
    id: 'hepatitis',
    name_th: 'ไวรัสตับอักเสบ (Viral Hepatitis)',
    name_en: 'Viral Hepatitis',
    description_th: 'การอักเสบของตับจากไวรัส เช่น ตับอักเสบบี/ซี',
    trigger_symptoms: ['jaundice', 'jaundice_skin', 'right_upper_pain', 'fatigue', 'nausea', 'loss_appetite', 'fever'],
    lab_tests: [LAB.lft, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์โรคตับ (Hepatologist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'liver-cancer',
    icd10: 'B19',
  },
  {
    id: 'gallstone',
    name_th: 'นิ่วในถุงน้ำดี (Gallstone)',
    name_en: 'Cholelithiasis / Gallstone',
    description_th: 'นิ่วสะสมในถุงน้ำดี อาจปวดรุนแรงหลังกินอาหารมัน',
    trigger_symptoms: ['right_upper_pain', 'nausea', 'vomiting', 'jaundice', 'bloating'],
    lab_tests: [LAB.uss_abd, LAB.lft, LAB.cbc],
    recommended_specialty: 'ศัลยแพทย์ทั่วไป (General Surgeon)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'gallstone',
    icd10: 'K80',
  },
  {
    id: 'appendicitis',
    name_th: 'ไส้ติ่งอักเสบ (Appendicitis)',
    name_en: 'Acute Appendicitis',
    description_th: 'ไส้ติ่งอักเสบเฉียบพลัน — ต้องผ่าตัดด่วน',
    trigger_symptoms: ['severe_stomach_pain', 'stomach_pain', 'fever', 'nausea', 'vomiting', 'loss_appetite'],
    lab_tests: [LAB.cbc, LAB.uss_abd],
    recommended_specialty: 'ศัลยแพทย์ (Surgeon)',
    urgency_hint: 'emergency',
    encyclopedia_slug: 'appendicitis',
    icd10: 'K37',
  },
  {
    id: 'kidney-stone',
    name_th: 'นิ่วในไต (Kidney Stone)',
    name_en: 'Nephrolithiasis / Kidney Stone',
    description_th: 'นิ่วก่อตัวในไต ปวดรุนแรงมากตามทางเดินปัสสาวะ',
    trigger_symptoms: ['flank_pain', 'lower_back_pain', 'back_pain', 'nausea', 'vomiting'],
    lab_tests: [LAB.urine, LAB.rft, LAB.uss_abd],
    recommended_specialty: 'ศัลยแพทย์ระบบปัสสาวะ (Urologist)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'kidney-stone',
    icd10: 'N20',
  },
  {
    id: 'dvt',
    name_th: 'ลิ่มเลือดอุดตันในหลอดเลือดดำ (DVT)',
    name_en: 'Deep Vein Thrombosis (DVT)',
    description_th: 'ลิ่มเลือดอุดตันในหลอดเลือดดำขา อันตรายถึงปอด',
    trigger_symptoms: ['leg_swelling_l', 'leg_swelling_r', 'calf_pain_l', 'calf_pain_r', 'leg_pain_l', 'leg_pain_r', 'shortness_breath'],
    lab_tests: [LAB.d_dimer, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์ระบบหลอดเลือด (Vascular Medicine)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'dvt',
    icd10: 'I82',
  },
  {
    id: 'asthma',
    name_th: 'โรคหอบหืด (Asthma)',
    name_en: 'Bronchial Asthma',
    description_th: 'ทางเดินหายใจอักเสบเรื้อรัง หายใจมีเสียงหวีด',
    trigger_symptoms: ['shortness_breath', 'wheeze', 'cough', 'chest_tightness'],
    lab_tests: [LAB.cxr],
    recommended_specialty: 'อายุรแพทย์โรคปอด (Pulmonologist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'asthma',
    icd10: 'J45',
  },
  {
    id: 'anemia',
    name_th: 'โรคโลหิตจาง (Anemia)',
    name_en: 'Anemia',
    description_th: 'ฮีโมโกลบินในเลือดต่ำ ทำให้อ่อนเพลีย วิงเวียน',
    trigger_symptoms: ['fatigue', 'dizziness', 'headache', 'shortness_breath', 'palpitation', 'face_swelling'],
    lab_tests: [LAB.cbc],
    recommended_specialty: 'อายุรแพทย์ (Internal Medicine)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'anemia',
    icd10: 'D64',
  },
  {
    id: 'depression',
    name_th: 'โรคซึมเศร้า (Major Depression)',
    name_en: 'Major Depressive Disorder',
    description_th: 'ความผิดปกติทางอารมณ์ ส่งผลต่อการใช้ชีวิตประจำวัน',
    trigger_symptoms: ['fatigue', 'loss_appetite', 'weight_loss', 'memory_loss', 'night_sweat', 'headache'],
    lab_tests: [LAB.cbc, LAB.thyroid],
    recommended_specialty: 'จิตแพทย์ (Psychiatrist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'depression',
    icd10: 'F32',
  },
  {
    id: 'hyperthyroid',
    name_th: 'ต่อมไทรอยด์เป็นพิษ (Hyperthyroidism)',
    name_en: 'Hyperthyroidism',
    description_th: 'ต่อมไทรอยด์ทำงานมากเกิน ใจสั่น น้ำหนักลด',
    trigger_symptoms: ['palpitation', 'weight_loss', 'fatigue', 'night_sweat', 'diarrhea', 'headache'],
    lab_tests: [LAB.thyroid, LAB.ecg, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์ต่อมไร้ท่อ (Endocrinologist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'thyroid',
    icd10: 'E05',
  },
  {
    id: 'lymphoma',
    name_th: 'มะเร็งต่อมน้ำเหลือง (Lymphoma)',
    name_en: 'Lymphoma',
    description_th: 'มะเร็งในระบบน้ำเหลือง ต่อมน้ำเหลืองโต โดยไม่เจ็บ',
    trigger_symptoms: ['swollen_lymph', 'night_sweat', 'weight_loss', 'fatigue', 'fever', 'loss_appetite', 'itching'],
    lab_tests: [LAB.cbc, LAB.lft],
    recommended_specialty: 'อายุรแพทย์โลหิตวิทยา (Hematologist)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'lymphoma',
    icd10: 'C85',
  },
  {
    id: 'allergy',
    name_th: 'ภูมิแพ้ / อาการแพ้รุนแรง',
    name_en: 'Allergy / Anaphylaxis',
    description_th: 'ปฏิกิริยาภูมิแพ้ — อาการรุนแรงอาจเป็นอันตราย',
    trigger_symptoms: ['rash', 'face_swelling', 'shortness_breath', 'wheeze', 'nausea', 'vomiting'],
    lab_tests: [LAB.cbc],
    recommended_specialty: 'อายุรแพทย์โรคภูมิแพ้ (Allergist)',
    urgency_hint: 'urgent',
    encyclopedia_slug: 'allergy',
    icd10: 'T78',
  },
  {
    id: 'gastritis',
    name_th: 'กระเพาะอักเสบ (Gastritis / GERD)',
    name_en: 'Gastritis / GERD',
    description_th: 'กระเพาะอักเสบหรือกรดไหลย้อน พบบ่อยมาก',
    trigger_symptoms: ['stomach_pain', 'nausea', 'vomiting', 'bloating', 'chest_tightness', 'loss_appetite'],
    lab_tests: [LAB.uss_abd],
    recommended_specialty: 'อายุรแพทย์ระบบทางเดินอาหาร (Gastroenterologist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'gastritis',
    icd10: 'K29',
  },
  {
    id: 'migraine',
    name_th: 'ไมเกรน (Migraine)',
    name_en: 'Migraine',
    description_th: 'ปวดหัวข้างเดียว รุนแรง คลื่นไส้ ไวต่อแสงเสียง',
    trigger_symptoms: ['headache', 'nausea', 'vomiting', 'vision_blur', 'dizziness'],
    lab_tests: [LAB.bp_monitor],
    recommended_specialty: 'อายุรแพทย์ประสาทวิทยา (Neurologist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'migraine',
    icd10: 'G43',
  },
  {
    id: 'kidney-disease',
    name_th: 'โรคไตเรื้อรัง (CKD)',
    name_en: 'Chronic Kidney Disease',
    description_th: 'ไตเสียหายสะสม ระยะแรกมักไม่มีอาการ',
    trigger_symptoms: ['leg_swelling_l', 'leg_swelling_r', 'face_swelling', 'fatigue', 'back_pain', 'dizziness'],
    lab_tests: [LAB.rft, LAB.urine, LAB.cbc],
    recommended_specialty: 'อายุรแพทย์โรคไต (Nephrologist)',
    urgency_hint: 'appointment',
    encyclopedia_slug: 'kidney-disease',
    icd10: 'N18',
  },
]

// ── Match calculation ─────────────────────────────────────────

export function getMatchingConditions(selectedSymptoms: string[]): ConditionMatch[] {
  if (selectedSymptoms.length === 0) return []

  const results: ConditionMatch[] = []

  for (const condition of CONDITIONS) {
    const matched = selectedSymptoms.filter(s =>
      condition.trigger_symptoms.includes(s)
    )
    if (matched.length === 0) continue

    // F1-measure: harmonic mean of precision and recall
    const precision = matched.length / selectedSymptoms.length
    const recall = matched.length / condition.trigger_symptoms.length
    const score = precision + recall > 0
      ? Math.round((2 * precision * recall) / (precision + recall) * 100)
      : 0

    if (score >= 10) {
      results.push({ condition, matched_symptoms: matched, score })
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
}

// ── Urgency calculation ──────────────────────────────────────

import { allSymptoms } from './symptoms'
import type { WizardState, UrgencyLevel } from '@/types/symptom'

export function calculateUrgency(state: WizardState): UrgencyLevel {
  const { selected_symptoms: ss, follow_up: fu } = state

  // ── Cardiac emergency ────────────────────────────────────────
  const hasChest = ss.includes('chest_pain') || ss.includes('chest_tightness')
  const hasLeftArm = ss.includes('left_arm_pain')
  if (hasChest && hasLeftArm && fu.sudden_onset === true && fu.cold_sweat === true) {
    return 'emergency'
  }

  // ── Critical severity symptoms ───────────────────────────────
  const hasCritical = ss.some(id => {
    const sym = allSymptoms.find(s => s.id === id)
    return sym?.severity === 'critical'
  })
  if (hasCritical) return 'emergency'

  // ── High slider ──────────────────────────────────────────────
  if (fu.severity >= 9) return 'emergency'

  // ── Worsening + long duration ────────────────────────────────
  const hasHigh = ss.some(id => allSymptoms.find(s => s.id === id)?.severity === 'high')
  if (fu.severity >= 7) return 'urgent'
  if (hasHigh && fu.progression === 'worsening') return 'urgent'
  if (fu.duration === 'more_1m' && fu.progression === 'worsening') return 'urgent'

  if (fu.severity >= 5 || hasHigh || fu.duration === '1_4w') return 'appointment'

  return 'selfcare'
}
