// มะเร็งลำไส้ใหญ่และทวารหนัก (Colorectal Cancer) — Rich Disease Data
// SAFETY: ข้อมูลเพื่อการศึกษาเท่านั้น ต้องตรวจสอบโดยแพทย์ก่อนเผยแพร่

import type { RichDisease } from '@/types/disease'

const colorectalCancer: RichDisease = {
  slug: 'colorectal-cancer',
  nameTh: 'มะเร็งลำไส้ใหญ่และทวารหนัก (Colorectal Cancer)',
  nameTh_short: 'มะเร็งลำไส้ใหญ่',
  nameEn: 'Colorectal Cancer',
  category: 'cancer',
  categoryTh: 'มะเร็งวิทยา',
  icd10: 'C18',
  riskLevel: 'high',
  lastReviewed: '2026-06',
  reviewedBy: 'รอการรับรองจากแพทย์ผู้เชี่ยวชาญ',
  shortDescriptionTh: 'มะเร็งที่พบบ่อยอันดับ 3 ในไทย — ตรวจพบตั้งแต่เนิ่นๆ อัตราการรอดชีวิต 90%+',

  stats: {
    prevalenceThailand: '~15,000 รายใหม่/ปี',
    prevalenceThai: 'มะเร็งอันดับ 3 ในชายไทย อันดับ 4 ในหญิงไทย',
    primaryRiskGroupTh: 'ทุกเพศอายุ 45 ปีขึ้นไป',
    survivalRate: 'ระยะที่ 1: >90% · ระยะที่ 4: ~14%',
    mortalityRankTh: 'สาเหตุการเสียชีวิตจากมะเร็งอันดับ 3-4 ในไทย',
    newCasesPerYearTh: 'ประมาณ 15,000 รายต่อปีในประเทศไทย',
  },

  overviewTh: `มะเร็งลำไส้ใหญ่และทวารหนัก (Colorectal Cancer) คือมะเร็งที่เกิดในลำไส้ใหญ่ (Colon) หรือทวารหนัก (Rectum) เป็นมะเร็งที่พบบ่อยเป็นอันดับ 3 ในผู้ชายไทยและอันดับ 4 ในผู้หญิงไทย ส่วนใหญ่เริ่มจากติ่งเนื้อ (Polyp) ที่ค่อยๆ กลายเป็นมะเร็งในระยะเวลา 10-15 ปี ทำให้มีโอกาสตรวจพบและตัดออกก่อนกลายเป็นมะเร็งได้

มะเร็งลำไส้ใหญ่ในระยะแรก (Stage I-II) แทบไม่มีอาการ นี่คือเหตุผลที่การตรวจคัดกรองด้วย Colonoscopy หรือ Fecal Occult Blood Test (FOBT) สำคัญมาก เมื่อพบในระยะที่ 1 อัตราการรอดชีวิต 5 ปีสูงกว่า 90% แต่เมื่อพบในระยะที่ 4 ที่ลุกลามไปตับหรือปอดแล้ว ตัวเลขลดเหลือเพียง 14%

ปัจจัยเสี่ยงหลักที่แก้ไขได้ ได้แก่ การกินอาหารที่มีเนื้อแดงและเนื้อแปรรูปสูง ขาดผักผลไม้ ไม่ออกกำลังกาย ดื่มแอลกอฮอล์ และสูบบุหรี่ ทั้งนี้ไทยยังมีอุบัติการณ์โรคอ้วนเพิ่มขึ้นอย่างรวดเร็ว ซึ่งเป็นปัจจัยเสี่ยงสำคัญของมะเร็งชนิดนี้`,

  symptoms: [
    {
      id: 'rectal_bleeding',
      nameTh: 'เลือดออกทางทวารหนัก',
      nameEn: 'Rectal bleeding / Blood in stool',
      severity: 'red_flag',
      descriptionTh: 'มีเลือดสดหรือเลือดสีดำปนในอุจจาระ หรือเลือดออกขณะถ่าย ต้องพบแพทย์ทุกกรณี แม้จะคิดว่าเป็นริดสีดวงทวาร',
      frequencyNote: 'พบในผู้ป่วยมะเร็งลำไส้ใหญ่ 40-50%',
    },
    {
      id: 'bowel_change',
      nameTh: 'การขับถ่ายเปลี่ยนแปลงผิดปกติ',
      nameEn: 'Change in bowel habits',
      severity: 'severe',
      descriptionTh: 'ท้องผูกหรือท้องเสียที่ผิดปกติเกิน 4 สัปดาห์ รู้สึกถ่ายไม่สุด อุจจาระมีลักษณะเปลี่ยนไป เช่น เล็กลง แบนลง',
      frequencyNote: 'อาการที่พบบ่อยที่สุด พบใน 50-60% ของผู้ป่วย',
    },
    {
      id: 'abdo_pain',
      nameTh: 'ปวดท้อง อืดแน่น',
      nameEn: 'Abdominal pain / cramping',
      severity: 'moderate',
      descriptionTh: 'ปวดหรืออึดอัดท้องโดยไม่ทราบสาเหตุ ท้องอืด แน่นท้องเรื้อรัง อาจมีเสียงดังในท้อง',
      frequencyNote: 'พบใน 30-40% ของผู้ป่วย',
    },
    {
      id: 'weight_loss',
      nameTh: 'น้ำหนักลดโดยไม่ตั้งใจ',
      nameEn: 'Unexplained weight loss',
      severity: 'severe',
      descriptionTh: 'น้ำหนักลดเกิน 5% ของน้ำหนักตัวภายใน 6 เดือนโดยไม่ได้ลดน้ำหนัก ร่วมกับอาการอื่น',
      frequencyNote: 'มักพบในมะเร็งระยะกลาง-ปลาย',
    },
    {
      id: 'anemia_fatigue',
      nameTh: 'ซีด อ่อนเพลียมาก',
      nameEn: 'Anemia / Fatigue',
      severity: 'moderate',
      descriptionTh: 'อ่อนเพลียผิดปกติ หน้าตาซีด เนื่องจากเลือดออกเรื้อรังจากมะเร็งทำให้ขาดธาตุเหล็ก',
      frequencyNote: 'พบบ่อยในมะเร็งลำไส้ใหญ่ด้านขวา',
    },
    {
      id: 'palpable_mass',
      nameTh: 'คลำพบก้อนในท้อง',
      nameEn: 'Abdominal mass',
      severity: 'red_flag',
      descriptionTh: 'คลำได้ก้อนในช่องท้อง โดยเฉพาะด้านขวาล่างหรือซ้ายล่าง ต้องพบแพทย์ทันที',
      frequencyNote: 'มักพบในมะเร็งระยะที่ 3-4',
    },
  ],

  redFlagsTh: [
    'เลือดออกทางทวารหนักโดยไม่ทราบสาเหตุ — ต้องพบแพทย์ภายใน 48 ชั่วโมง',
    'ถ่ายเป็นเลือดสีดำเหมือนน้ำมันดิน — อาจหมายถึงเลือดออกในลำไส้ส่วนบน',
    'ปวดท้องรุนแรงร่วมกับไข้และท้องแข็ง — อาจมีลำไส้ทะลุ',
    'อาการลำไส้อุดตัน: ปวดท้องรุนแรง อาเจียน ไม่ถ่ายเลย',
    'น้ำหนักลดเร็วมากร่วมกับอาการลำไส้ผิดปกติ',
  ],

  causesTh: [
    'การสะสมของ Somatic mutations ในเซลล์เยื่อบุลำไส้ใหญ่ตามอายุ',
    'ติ่งเนื้อ (Adenomatous Polyps) ที่ไม่ได้ตัดออก กลายเป็นมะเร็งใน 10-15 ปี',
    'กรรมพันธุ์: Lynch Syndrome (HNPCC) และ FAP ทำให้เสี่ยงสูงมาก',
    'อาหารที่มีเนื้อแดงและเนื้อแปรรูปสูง ขาดผักผลไม้และใยอาหาร',
    'Chronic inflammation: โรค IBD (Crohn’s, Ulcerative Colitis)',
  ],

  riskFactors: [
    {
      nameTh: 'อายุ 45 ปีขึ้นไป',
      nameEn: 'Age ≥45',
      type: 'non_modifiable',
      descriptionTh: 'ความเสี่ยงเพิ่มขึ้นอย่างมีนัยสำคัญหลังอายุ 45 ปี และสูงขึ้นเรื่อยๆ ตามอายุ',
      relativeRisk: 'เสี่ยงเพิ่มขึ้น 5 เท่า เมื่ออายุ 65 เทียบกับ 40',
    },
    {
      nameTh: 'ประวัติครอบครัว',
      nameEn: 'Family history of CRC',
      type: 'non_modifiable',
      descriptionTh: 'มีพ่อ แม่ หรือพี่น้องเป็นมะเร็งลำไส้ใหญ่ เพิ่มความเสี่ยง 2-3 เท่า ถ้าพบก่อนอายุ 50 ปี เสี่ยงสูงกว่ามาก',
      relativeRisk: 'เสี่ยงเพิ่ม 2-3 เท่า',
    },
    {
      nameTh: 'เนื้อแดงและเนื้อแปรรูป',
      nameEn: 'Red and processed meat',
      type: 'modifiable',
      descriptionTh: 'กินเนื้อแดง >3 ครั้ง/สัปดาห์ หรือเนื้อแปรรูป (ไส้กรอก เบคอน) เป็นประจำ WHO จัดว่าเพิ่มความเสี่ยง',
      relativeRisk: 'เสี่ยงเพิ่ม 15-20%',
    },
    {
      nameTh: 'ภาวะอ้วน',
      nameEn: 'Obesity (BMI ≥27.5)',
      type: 'modifiable',
      descriptionTh: 'น้ำหนักเกินเพิ่มความเสี่ยงทั้งการเกิดและการเสียชีวิตจากมะเร็งลำไส้ใหญ่',
      relativeRisk: 'เสี่ยงเพิ่ม 30-40%',
    },
    {
      nameTh: 'ไม่ออกกำลังกาย',
      nameEn: 'Physical inactivity',
      type: 'modifiable',
      descriptionTh: 'การออกกำลังกายสม่ำเสมอช่วยลดความเสี่ยงได้ 20-25% ผ่านหลายกลไก',
      relativeRisk: 'ออกกำลังกายลดเสี่ยง 20-25%',
    },
    {
      nameTh: 'เบาหวานชนิดที่ 2',
      nameEn: 'Type 2 Diabetes',
      type: 'partially_modifiable',
      descriptionTh: 'ภาวะดื้ออินซูลินและ Insulin-like Growth Factor เพิ่มการเจริญเติบโตของเซลล์มะเร็ง',
      relativeRisk: 'เสี่ยงเพิ่ม 30-40%',
    },
  ],

  screening: [
    {
      id: 'colonoscopy',
      nameTh: 'Colonoscopy (ส่องกล้องลำไส้ใหญ่)',
      nameEn: 'Colonoscopy',
      ageRange: '45-75 ปี',
      sex: 'all',
      frequency: 'ทุก 10 ปี (ถ้าไม่พบติ่งเนื้อ)',
      descriptionTh: 'มาตรฐานทองคำ สามารถดูและตัดติ่งเนื้อได้ในขั้นตอนเดียว ต้องเตรียมลำไส้ก่อนตรวจ',
      isNHSOCovered: false,
      guidelineSource: 'USPSTF 2021, แนวทางกรมการแพทย์',
    },
    {
      id: 'fobt',
      nameTh: 'Fecal Occult Blood Test (FOBT)',
      nameEn: 'Fecal Immunochemical Test (FIT)',
      ageRange: '45-75 ปี',
      sex: 'all',
      frequency: 'ทุกปี',
      descriptionTh: 'ตรวจเลือดซ่อนเร้นในอุจจาระ ไม่ต้องเตรียมลำไส้ ราคาถูก เหมาะสำหรับคัดกรองเบื้องต้น',
      isNHSOCovered: true,
      guidelineSource: 'NHSO ประเทศไทย',
    },
    {
      id: 'ct_colonography',
      nameTh: 'CT Colonography (Virtual Colonoscopy)',
      nameEn: 'CT Colonography',
      ageRange: '45-75 ปี',
      sex: 'all',
      frequency: 'ทุก 5 ปี',
      descriptionTh: 'ใช้ CT scan ตรวจโครงสร้างลำไส้ใหญ่ ไม่ต้องใส่กล้อง แต่ต้องเตรียมลำไส้และรังสี',
      isNHSOCovered: false,
      guidelineSource: 'USPSTF 2021',
    },
  ],

  treatments: [
    {
      categoryTh: 'การผ่าตัด',
      nameTh: 'Colectomy (การผ่าตัดลำไส้)',
      nameEn: 'Surgical resection',
      descriptionTh: 'การรักษาหลักสำหรับมะเร็งระยะที่ 1-3 ตัดส่วนลำไส้ที่เป็นมะเร็งออก อาจใช้การผ่าตัดผ่านกล้อง (Laparoscopy) ที่ฟื้นตัวเร็วกว่า',
      forStage: 'ระยะที่ 1-3',
    },
    {
      categoryTh: 'เคมีบำบัด',
      nameTh: 'Adjuvant Chemotherapy',
      nameEn: 'FOLFOX, CAPOX',
      descriptionTh: 'ให้หลังผ่าตัดในระยะที่ 3 เพื่อลดความเสี่ยงกลับมาเป็นซ้ำ FOLFOX (5-FU + Oxaliplatin) เป็นสูตรมาตรฐาน',
      forStage: 'ระยะที่ 3',
      sideEffectsTh: ['คลื่นไส้อาเจียน', 'ชาปลายมือปลายเท้า (Peripheral Neuropathy)', 'ภูมิคุ้มกันต่ำ'],
    },
    {
      categoryTh: 'Targeted Therapy',
      nameTh: 'Bevacizumab, Cetuximab',
      nameEn: 'Anti-VEGF / Anti-EGFR Therapy',
      descriptionTh: 'ใช้สำหรับมะเร็งระยะที่ 4 ร่วมกับเคมีบำบัด ประสิทธิภาพขึ้นอยู่กับ gene mutation (RAS, BRAF)',
      forStage: 'ระยะที่ 4',
    },
    {
      categoryTh: 'Immunotherapy',
      nameTh: 'Checkpoint Inhibitors',
      nameEn: 'Pembrolizumab (MSI-H CRC)',
      descriptionTh: 'ได้ผลดีในมะเร็งที่มี Microsatellite Instability High (MSI-H) ประมาณ 15% ของผู้ป่วย',
      forStage: 'ระยะที่ 4 MSI-H',
    },
  ],

  prevention: [
    {
      actionTh: 'ตรวจคัดกรองตามอายุ',
      descriptionTh: 'Colonoscopy หรือ FIT test เริ่มอายุ 45 ปี ช่วยตัดติ่งเนื้อก่อนกลายเป็นมะเร็งได้',
      impact: 'high',
      evidence: 'USPSTF Grade B, แนวทาง สธ.',
    },
    {
      actionTh: 'กินผักผลไม้ใยอาหารสูง',
      descriptionTh: 'เพิ่มผักผลไม้ ถั่ว ธัญพืชไม่ขัดสี ลดเนื้อแดงและเนื้อแปรรูป ใยอาหารช่วยลดเวลาสัมผัสระหว่างสารก่อมะเร็งกับเยื่อลำไส้',
      impact: 'high',
      evidence: 'WCRF/AICR 2018',
    },
    {
      actionTh: 'ออกกำลังกายสม่ำเสมอ',
      descriptionTh: 'ออกกำลังกายระดับปานกลางอย่างน้อย 150 นาที/สัปดาห์ ลดความเสี่ยงได้ 20-25%',
      impact: 'high',
      evidence: 'WHO Physical Activity Guidelines 2020',
    },
    {
      actionTh: 'ควบคุมน้ำหนัก',
      descriptionTh: 'รักษา BMI ให้อยู่ต่ำกว่า 23 (เกณฑ์เอเชีย) ลดโอกาสเกิดมะเร็งลำไส้ใหญ่และมะเร็งชนิดอื่น',
      impact: 'medium',
      evidence: 'WCRF/AICR 2018',
    },
    {
      actionTh: 'งดสูบบุหรี่และจำกัดแอลกอฮอล์',
      descriptionTh: 'การสูบบุหรี่เพิ่มความเสี่ยง CRC 20% แอลกอฮอล์ทุก 2 หน่วย/วัน เพิ่มความเสี่ยง 8%',
      impact: 'medium',
      evidence: 'IARC Monographs',
    },
  ],

  whenToSeeDoctorTh: [
    'เลือดออกทางทวารหนักหรืออุจจาระมีเลือดปน — พบแพทย์ทันที',
    'การขับถ่ายเปลี่ยนแปลงผิดปกตินานเกิน 4 สัปดาห์',
    'อุจจาระมีลักษณะผอมหรือแบนผิดปกติ',
    'ปวดท้องเรื้อรังโดยไม่ทราบสาเหตุ',
    'น้ำหนักลดมากโดยไม่ตั้งใจ ร่วมกับอาการลำไส้',
    'อายุ 45+ ปี ยังไม่เคยตรวจ Colonoscopy หรือ FIT test',
    'มีประวัติครอบครัวเป็นมะเร็งลำไส้ใหญ่ ควรเริ่มคัดกรองก่อนอายุ 45 ปี',
  ],

  faqsTh: [
    {
      questionTh: 'ต้องตรวจ Colonoscopy บ่อยแค่ไหน?',
      answerTh: 'ถ้าไม่พบความผิดปกติ ตรวจซ้ำทุก 10 ปี ถ้าพบติ่งเนื้อขนาดเล็ก (<10mm) ตรวจซ้ำใน 3-5 ปี ถ้าพบติ่งเนื้อขนาดใหญ่หรือหลายชิ้น ตรวจซ้ำใน 1-3 ปีตามคำแนะนำแพทย์',
    },
    {
      questionTh: 'FIT test เชื่อถือได้แค่ไหน?',
      answerTh: 'FIT test มีความไวประมาณ 70-80% สำหรับตรวจพบมะเร็ง และ 30-40% สำหรับติ่งเนื้อขนาดใหญ่ ข้อดีคือทำเองที่บ้านได้ ราคาถูก แต่ต้องตรวจทุกปีและต้องตรวจ Colonoscopy เพิ่มเติมถ้าผลเป็นบวก',
    },
    {
      questionTh: 'กินยา Aspirin ป้องกันมะเร็งได้จริงไหม?',
      answerTh: 'มีหลักฐานว่า Aspirin อาจช่วยลดความเสี่ยงได้ แต่ USPSTF แนะนำไม่ให้กิน Aspirin เพื่อป้องกันมะเร็งเป็นหลัก เพราะความเสี่ยงเลือดออกในกระเพาะมีมากกว่าประโยชน์สำหรับคนทั่วไป ยกเว้นผู้ที่มีความเสี่ยงหัวใจและหลอดเลือดสูงที่ได้รับคำแนะนำจากแพทย์',
    },
    {
      questionTh: 'มะเร็งลำไส้ใหญ่ถ่ายทอดทางพันธุกรรมได้ไหม?',
      answerTh: 'ประมาณ 5-10% ของมะเร็งลำไส้ใหญ่เกิดจากความผิดปกติทางพันธุกรรมที่ถ่ายทอดได้ เช่น Lynch Syndrome และ FAP ถ้าในครอบครัวมีคนเป็นมะเร็งลำไส้ใหญ่หลายคน หรือเป็นก่อนอายุ 50 ปี ควรปรึกษาแพทย์เรื่องการตรวจ Genetic testing',
    },
  ],

  references: [
    {
      id: 'ref1',
      titleEn: 'Colorectal Cancer Screening: USPSTF Recommendation Statement',
      organization: 'USPSTF',
      year: 2021,
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'ref2',
      titleEn: 'Thailand Cancer Registry Report 2022',
      organization: 'กรมการแพทย์ กระทรวงสาธารณสุข',
      year: 2022,
      type: 'cohort',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'ref3',
      titleEn: 'Diet, Nutrition, Physical Activity and Cancer: A Global Perspective',
      organization: 'WCRF/AICR',
      year: 2018,
      type: 'systematic_review',
      isVerified: false,
      pendingNote: 'pending_review',
    },
  ],

  relatedDiseases: ['breast-cancer', 'type-2-diabetes', 'lung-cancer'],
  keywords: [
    'มะเร็งลำไส้ใหญ่', 'colorectal cancer', 'colon cancer', 'rectal cancer',
    'colonoscopy', 'ส่องกล้องลำไส้', 'เลือดออกทางทวารหนัก', 'ติ่งเนื้อลำไส้',
    'FIT test', 'FOBT', 'ลำไส้ใหญ่', 'มะเร็งในไทย',
  ],
}

export default colorectalCancer
