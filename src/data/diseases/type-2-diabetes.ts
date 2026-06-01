// เบาหวานชนิดที่ 2 (Type 2 Diabetes) — Rich Disease Data
// SAFETY: ข้อมูลเพื่อการศึกษาเท่านั้น ต้องตรวจสอบโดยแพทย์ก่อนเผยแพร่

import type { RichDisease } from '@/types/disease'

const type2Diabetes: RichDisease = {
  slug: 'type-2-diabetes',
  nameTh: 'เบาหวานชนิดที่ 2 (Type 2 Diabetes)',
  nameTh_short: 'เบาหวานชนิดที่ 2',
  nameEn: 'Type 2 Diabetes Mellitus',
  category: 'diabetes',
  categoryTh: 'ต่อมไร้ท่อและเมตาบอลิซึม',
  icd10: 'E11',
  riskLevel: 'high',
  lastReviewed: '2026-06',
  reviewedBy: 'รอการรับรองจากอายุรแพทย์ต่อมไร้ท่อ',
  shortDescriptionTh: 'โรคเรื้อรังจากน้ำตาลในเลือดสูง ป้องกันและควบคุมได้ด้วยการเปลี่ยนวิถีชีวิต',

  stats: {
    prevalenceThailand: '~7.4 ล้านคน (11%)',
    prevalenceThai: '11% ของผู้ใหญ่ชาวไทย — อีก 40% ยังไม่รู้ตัว',
    primaryRiskGroupTh: 'ผู้ใหญ่อายุ 35 ปีขึ้นไป น้ำหนักเกิน',
    newCasesPerYearTh: 'ประมาณ 300,000 รายใหม่ต่อปี',
    mortalityRankTh: 'ติด Top 5 สาเหตุการเสียชีวิตในไทย',
  },

  overviewTh: `เบาหวานชนิดที่ 2 เป็นภาวะที่ร่างกายไม่สามารถใช้อินซูลิน (ฮอร์โมนควบคุมน้ำตาล) ได้อย่างมีประสิทธิภาพ หรือตับอ่อนผลิตอินซูลินไม่เพียงพอ ส่งผลให้ระดับน้ำตาลในเลือดสูงเรื้อรัง ทำลายหลอดเลือดและเส้นประสาทในระยะยาว

ปัจจุบันประเทศไทยมีผู้ป่วยเบาหวานกว่า 7.4 ล้านคน และมีอีกอย่างน้อย 3 ล้านคนที่ยังไม่รู้ว่าตัวเองเป็น ความน่ากลัวของเบาหวานคือในระยะแรกมักไม่มีอาการ ทำให้ผู้ป่วยหลายคนมาพบแพทย์เมื่อมีภาวะแทรกซ้อนแล้ว เช่น ไตวาย ตาบอด หรือต้องตัดขา

ข่าวดีคือ เบาหวานชนิดที่ 2 ป้องกันได้สูงถึง 58% ด้วยการปรับเปลี่ยนวิถีชีวิต — ลดน้ำหนัก 5-7% ออกกำลังกาย และควบคุมอาหาร นี่คือโรคที่คุณมีอำนาจในการป้องกันได้มากที่สุด`,

  symptoms: [
    {
      id: 'polyuria',
      nameTh: 'ปัสสาวะบ่อยและมาก',
      nameEn: 'Frequent urination (Polyuria)',
      severity: 'moderate',
      descriptionTh: 'น้ำตาลส่วนเกินถูกขับออกทางปัสสาวะ ทำให้ปัสสาวะบ่อยโดยเฉพาะกลางคืน',
      frequencyNote: 'พบใน 70-80% ของผู้ป่วยที่มีอาการ',
    },
    {
      id: 'polydipsia',
      nameTh: 'กระหายน้ำมากผิดปกติ',
      nameEn: 'Excessive thirst (Polydipsia)',
      severity: 'moderate',
      descriptionTh: 'ร่างกายสูญเสียน้ำมากจากการปัสสาวะบ่อย ทำให้รู้สึกกระหายตลอดเวลา',
    },
    {
      id: 'fatigue',
      nameTh: 'อ่อนเพลียมากผิดปกติ',
      nameEn: 'Fatigue',
      severity: 'moderate',
      descriptionTh: 'เซลล์ไม่ได้รับน้ำตาลกลูโคสเพียงพอทำให้รู้สึกเหนื่อยแม้พักผ่อนเต็มที่',
      frequencyNote: 'พบบ่อยมาก',
    },
    {
      id: 'vision_blur',
      nameTh: 'ตามัว',
      nameEn: 'Blurred vision',
      severity: 'moderate',
      descriptionTh: 'น้ำตาลสูงทำให้เลนส์ตาเปลี่ยนรูปชั่วคราว ถ้าเรื้อรังอาจทำให้หลอดเลือดจอประสาทตาเสียหาย',
    },
    {
      id: 'slow_healing',
      nameTh: 'แผลหายช้า',
      nameEn: 'Slow-healing wounds',
      severity: 'severe',
      descriptionTh: 'น้ำตาลสูงยับยั้งการทำงานของเม็ดเลือดขาวและการซ่อมแซมเนื้อเยื่อ บาดแผลเล็กน้อยอาจกลายเป็นแผลเรื้อรัง',
    },
    {
      id: 'neuropathy',
      nameTh: 'ชาหรือเจ็บปวดที่มือและเท้า',
      nameEn: 'Numbness or tingling (Peripheral neuropathy)',
      severity: 'severe',
      descriptionTh: 'น้ำตาลสูงทำลายเส้นประสาทส่วนปลาย ทำให้ชา เจ็บแปลบ หรือปวดแสบโดยเฉพาะที่เท้า',
    },
    {
      id: 'infections',
      nameTh: 'ติดเชื้อบ่อยผิดปกติ',
      nameEn: 'Frequent infections',
      severity: 'moderate',
      descriptionTh: 'ภูมิคุ้มกันต่ำ ติดเชื้อราในช่องปาก ช่องคลอด หรือผิวหนังบ่อย',
    },
    {
      id: 'dka',
      nameTh: 'เหนื่อยมาก คลื่นไส้ หายใจมีกลิ่น',
      nameEn: 'DKA symptoms',
      severity: 'red_flag',
      descriptionTh: 'อาการของ Diabetic Ketoacidosis (DKA) — น้ำตาลสูงวิกฤติ ต้องไปห้องฉุกเฉินทันที',
    },
  ],

  redFlagsTh: [
    'น้ำตาลในเลือดสูงกว่า 300 mg/dL ร่วมกับคลื่นไส้อาเจียน',
    'หายใจลึกและเร็ว มีกลิ่นผลไม้ในลมหายใจ (DKA)',
    'ชาหรืออ่อนแรงที่เท้าและขาเพิ่มขึ้นอย่างรวดเร็ว',
    'แผลที่เท้าไม่ยอมหายหรือมีหนอง',
    'ตามัวอย่างฉับพลัน',
    'ปัสสาวะน้อยมาก บวมขา (อาจเป็นสัญญาณไตวาย)',
  ],

  causesTh: [
    'ภาวะ Insulin Resistance — เซลล์กล้ามเนื้อและตับตอบสนองต่ออินซูลินได้น้อยลง น้ำตาลจึงค้างในเลือด',
    'ตับอ่อนทำงานหนักเพื่อชดเชย จนในที่สุดผลิตอินซูลินได้ไม่เพียงพอ',
    'น้ำหนักเกินและไขมันสะสมโดยเฉพาะในช่องท้องยับยั้งการทำงานของอินซูลิน',
    'การใช้ชีวิตที่ไม่ออกกำลังกายลดความไวต่ออินซูลิน',
    'ความผิดปกติของยีนบางตัวเพิ่มความเสี่ยง',
  ],

  riskFactors: [
    { nameTh: 'น้ำหนักเกินหรืออ้วน', type: 'modifiable', descriptionTh: 'BMI ≥23 (เกณฑ์เอเชีย) เพิ่มความเสี่ยงสูงมาก ไขมันในช่องท้องโดยเฉพาะ', relativeRisk: 'เพิ่ม 5-10 เท่า' },
    { nameTh: 'ไม่ออกกำลังกาย', type: 'modifiable', descriptionTh: 'กล้ามเนื้อที่ไม่ได้ออกกำลังกายใช้น้ำตาลได้น้อย ลดความไวต่ออินซูลิน', relativeRisk: 'เพิ่ม 2-3 เท่า' },
    { nameTh: 'กินอาหารแป้งขัดขาวและน้ำตาลสูง', type: 'modifiable', descriptionTh: 'อาหาร GI สูง เครื่องดื่มหวาน ข้าวขาว ทำให้น้ำตาลพุ่งสูงบ่อยๆ' },
    { nameTh: 'ประวัติครอบครัวเป็นเบาหวาน', type: 'non_modifiable', descriptionTh: 'ถ้าพ่อแม่หรือพี่น้องเป็น ความเสี่ยงเพิ่ม 2 เท่า', relativeRisk: 'เพิ่ม 2 เท่า' },
    { nameTh: 'อายุ 35 ปีขึ้นไป', type: 'non_modifiable', descriptionTh: 'ความไวต่ออินซูลินลดลงตามอายุ' },
    { nameTh: 'กลุ่มชาติพันธุ์เอเชีย', type: 'non_modifiable', descriptionTh: 'คนเอเชียเกิด Insulin Resistance ในระดับ BMI ที่ต่ำกว่าคนตะวันตก' },
    { nameTh: 'เคยเป็นเบาหวานขณะตั้งครรภ์', type: 'partially_modifiable', descriptionTh: 'เสี่ยงเป็นเบาหวานชนิดที่ 2 ภายใน 10 ปี 50-70%', relativeRisk: 'เสี่ยง 50-70% ใน 10 ปี' },
    { nameTh: 'โรคถุงน้ำรังไข่หลายใบ (PCOS)', type: 'partially_modifiable', descriptionTh: 'ผู้หญิงที่มี PCOS มีภาวะ Insulin Resistance สูง' },
    { nameTh: 'ภาวะก่อนเบาหวาน (Prediabetes)', type: 'partially_modifiable', descriptionTh: 'น้ำตาล 100-125 mg/dL ขณะอดอาหาร เสี่ยงเป็นเบาหวานภายใน 10 ปีถ้าไม่ปรับพฤติกรรม', relativeRisk: 'เสี่ยง 15-30%/ปี' },
    { nameTh: 'ความดันโลหิตสูง', type: 'modifiable', descriptionTh: 'มักเกิดร่วมกับ Insulin Resistance (Metabolic Syndrome)' },
  ],

  screening: [
    {
      id: 'fpg',
      nameTh: 'ตรวจน้ำตาลในเลือดขณะอดอาหาร (FPG)',
      nameEn: 'Fasting Plasma Glucose',
      ageRange: '35 ปีขึ้นไป หรือน้ำหนักเกินตั้งแต่ 25 ปี',
      sex: 'all',
      frequency: 'ทุก 3 ปีถ้าปกติ · ทุกปีถ้ามีปัจจัยเสี่ยง',
      descriptionTh: 'อดอาหาร 8 ชั่วโมง · ปกติ < 100 mg/dL · ก่อนเบาหวาน 100-125 · เบาหวาน ≥ 126',
      isNHSOCovered: true,
      guidelineSource: 'สมาคมโรคเบาหวานแห่งประเทศไทย (DMST) 2566',
    },
    {
      id: 'hba1c',
      nameTh: 'ตรวจ HbA1c (ค่าน้ำตาลสะสม 3 เดือน)',
      nameEn: 'Hemoglobin A1c',
      ageRange: '35 ปีขึ้นไป หรือกลุ่มเสี่ยง',
      sex: 'all',
      frequency: 'ทุก 3 ปีถ้าปกติ',
      descriptionTh: 'ปกติ < 5.7% · ก่อนเบาหวาน 5.7-6.4% · เบาหวาน ≥ 6.5% ไม่ต้องอดอาหาร',
      isNHSOCovered: true,
      guidelineSource: 'DMST / ADA Standards of Care',
    },
    {
      id: 'ogtt',
      nameTh: 'การทดสอบความทนต่อกลูโคส (OGTT)',
      nameEn: 'Oral Glucose Tolerance Test',
      ageRange: 'เมื่อแพทย์ส่งตรวจ',
      sex: 'all',
      frequency: 'ตามคำแนะนำของแพทย์',
      descriptionTh: 'ดื่มน้ำตาล 75 กรัม ตรวจหลัง 2 ชั่วโมง ค่า ≥ 200 mg/dL = เบาหวาน มาตรฐานสูง',
      isNHSOCovered: true,
      guidelineSource: 'WHO / DMST',
    },
  ],

  treatments: [
    {
      categoryTh: 'การปรับวิถีชีวิต (หัวใจสำคัญ)',
      nameTh: 'การปรับอาหารและออกกำลังกาย',
      descriptionTh: 'ลดน้ำหนัก 5-7% + ออกกำลังกาย 150 นาที/สัปดาห์ ลดความเสี่ยงได้ 58% ในกลุ่มก่อนเบาหวาน และในผู้ป่วยเบาหวาน อาจควบคุมได้โดยไม่ต้องใช้ยาในบางราย',
      forStage: 'ทุกระยะ',
    },
    {
      categoryTh: 'ยากลุ่มแรก',
      nameTh: 'Metformin',
      nameEn: 'Metformin',
      descriptionTh: 'ยาหลักสำหรับเบาหวานชนิดที่ 2 ราคาถูก ปลอดภัย ลดน้ำตาลโดยยับยั้งตับไม่ให้ผลิตน้ำตาลมากเกิน รับประทานพร้อมอาหาร',
      sideEffectsTh: ['คลื่นไส้', 'ท้องเสียเล็กน้อยช่วงแรก'],
    },
    {
      categoryTh: 'ยากลุ่ม SGLT-2 Inhibitors',
      nameTh: 'Dapagliflozin, Empagliflozin',
      nameEn: 'SGLT-2 Inhibitors',
      descriptionTh: 'ลดน้ำตาลโดยขับออกทางปัสสาวะ พิเศษคือยังปกป้องหัวใจและไตได้ด้วย แนะนำสำหรับผู้มีโรคหัวใจหรือไตร่วมด้วย',
      sideEffectsTh: ['ติดเชื้อราทางเดินปัสสาวะ', 'ปัสสาวะบ่อยขึ้นเล็กน้อย'],
    },
    {
      categoryTh: 'ยากลุ่ม GLP-1 Receptor Agonists',
      nameTh: 'Semaglutide, Liraglutide',
      nameEn: 'GLP-1 Agonists',
      descriptionTh: 'ยาฉีดหรือเม็ดที่กระตุ้นอินซูลินเมื่อน้ำตาลสูง ลดน้ำหนักได้ด้วย ปัจจุบัน Semaglutide เม็ดก็มีแล้ว',
      sideEffectsTh: ['คลื่นไส้', 'อาเจียนช่วงแรก'],
    },
    {
      categoryTh: 'อินซูลิน',
      nameTh: 'Insulin Therapy',
      nameEn: 'Insulin',
      descriptionTh: 'ใช้เมื่อยากลุ่มอื่นควบคุมได้ไม่เพียงพอ หรือในระยะที่ตับอ่อนผลิตอินซูลินน้อยมากแล้ว มีหลายชนิดตามระยะเวลาออกฤทธิ์',
      sideEffectsTh: ['น้ำตาลต่ำถ้าใช้ไม่ถูกต้อง', 'น้ำหนักขึ้น'],
    },
  ],

  prevention: [
    { actionTh: 'ลดน้ำหนัก 5-7%', descriptionTh: 'หลักฐานชัดเจนที่สุด — ลดน้ำหนัก 5-7% จากน้ำหนักเดิมลดความเสี่ยงได้ 58%', impact: 'high', evidence: 'Diabetes Prevention Program (DPP), NEJM 2002' },
    { actionTh: 'ออกกำลังกาย 150+ นาที/สัปดาห์', descriptionTh: 'เดินเร็ว ว่ายน้ำ หรือปั่นจักรยาน เพิ่มความไวต่ออินซูลินอย่างมีนัยสำคัญ', impact: 'high', evidence: 'WHO Physical Activity Guidelines' },
    { actionTh: 'เลือกอาหาร GI ต่ำ', descriptionTh: 'ข้าวกล้องแทนข้าวขาว ผักมากขึ้น ลดเครื่องดื่มหวานและน้ำผลไม้', impact: 'high', evidence: 'Dietary Patterns and Type 2 Diabetes Meta-analysis' },
    { actionTh: 'ตรวจน้ำตาลเป็นประจำ', descriptionTh: 'พบภาวะก่อนเบาหวานตั้งแต่เนิ่นๆ เพื่อเริ่มปรับพฤติกรรมก่อนเป็นเบาหวาน', impact: 'high', evidence: 'DMST Screening Guidelines' },
    { actionTh: 'นอนหลับพักผ่อนเพียงพอ 7-8 ชั่วโมง', descriptionTh: 'การอดนอนและนอนน้อยเพิ่ม Cortisol และลดความไวต่ออินซูลิน', impact: 'medium', evidence: 'Sleep and Metabolic Syndrome Research' },
    { actionTh: 'จัดการความเครียด', descriptionTh: 'ความเครียดเรื้อรังเพิ่ม Cortisol ทำให้น้ำตาลสูง ฝึก Mindfulness หรือออกกำลังกาย', impact: 'medium', evidence: 'Psychoneuroendocrinology' },
  ],

  whenToSeeDoctorTh: [
    'อายุ 35 ปีขึ้นไปและยังไม่เคยตรวจน้ำตาล',
    'น้ำหนักเกิน (BMI ≥23) ไม่ว่าอายุเท่าไหร่',
    'มีอาการปัสสาวะบ่อย กระหายน้ำมาก อ่อนเพลียผิดปกติ',
    'แผลหายช้า หรือมีชาที่เท้า',
    'มีประวัติครอบครัวเป็นเบาหวาน',
    'เคยเป็นเบาหวานขณะตั้งครรภ์',
    'ตรวจพบ Prediabetes และต้องการคำแนะนำ',
  ],

  faqsTh: [
    {
      questionTh: 'เบาหวานชนิดที่ 2 รักษาหายได้ไหม?',
      answerTh: 'ในทางการแพทย์เรียกว่า "Remission" ไม่ใช่หายขาด แต่บางคนที่ลดน้ำหนักได้มากและปรับวิถีชีวิตอย่างเคร่งครัดอาจควบคุมน้ำตาลได้โดยไม่ต้องใช้ยา อย่างไรก็ตามยังต้องติดตามสม่ำเสมอ เพราะอาจกลับมาได้',
    },
    {
      questionTh: 'ถ้าตรวจพบ Prediabetes ควรทำอย่างไร?',
      answerTh: 'ไม่ต้องตกใจ เพราะนี่คือโอกาสทอง ผู้ที่มี Prediabetes ลดน้ำหนัก 5-7% และออกกำลังกายสม่ำเสมอ ลดความเสี่ยงการพัฒนาเป็นเบาหวานได้ถึง 58% พบแพทย์เพื่อวางแผนการปรับพฤติกรรม',
    },
    {
      questionTh: 'กินข้าวกล้องแทนข้าวขาวช่วยได้จริงไหม?',
      answerTh: 'ช่วยได้จริง ข้าวกล้อง GI ต่ำกว่าข้าวขาวทำให้น้ำตาลขึ้นช้ากว่า แต่ปริมาณก็สำคัญ ไม่ว่าจะเป็นข้าวกล้องหรือข้าวขาวถ้ากินมากเกินไปก็ทำให้น้ำตาลสูงได้',
    },
  ],

  references: [
    { id: 'dmst_2023', titleEn: 'Clinical Practice Guidelines for Diabetes 2023', titleTh: 'แนวทางเวชปฏิบัติสำหรับโรคเบาหวาน 2566', organization: 'สมาคมโรคเบาหวานแห่งประเทศไทย (DMST)', year: 2023, type: 'guideline', isVerified: false, pendingNote: 'ต้องตรวจสอบก่อนเผยแพร่' },
    { id: 'dpp_trial', titleEn: 'Reduction in the Incidence of Type 2 Diabetes with Lifestyle Intervention', organization: 'Diabetes Prevention Program Research Group', year: 2002, doi: '10.1056/NEJMoa012512', type: 'rct', isVerified: false, pendingNote: 'ต้องตรวจสอบ DOI' },
    { id: 'ada_2024', titleEn: 'Standards of Care in Diabetes 2024', organization: 'American Diabetes Association', year: 2024, url: 'https://diabetesjournals.org', type: 'guideline', isVerified: false },
  ],

  relatedDiseases: ['hypertension', 'cardiovascular-disease', 'kidney-disease'],
  keywords: ['เบาหวาน', 'น้ำตาลในเลือด', 'อินซูลิน', 'Type 2 Diabetes', 'Prediabetes', 'HbA1c', 'น้ำตาลสะสม'],
}

export default type2Diabetes
