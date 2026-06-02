// มะเร็งปอด (Lung Cancer) — Rich Disease Data
// SAFETY: ข้อมูลเพื่อการศึกษาเท่านั้น ต้องตรวจสอบโดยแพทย์ก่อนเผยแพร่

import type { RichDisease } from '@/types/disease'

const lungCancer: RichDisease = {
  slug: 'lung-cancer',
  nameTh: 'มะเร็งปอด (Lung Cancer)',
  nameTh_short: 'มะเร็งปอด',
  nameEn: 'Lung Cancer',
  category: 'cancer',
  categoryTh: 'มะเร็งวิทยา',
  icd10: 'C34',
  riskLevel: 'very_high',
  lastReviewed: '2026-06',
  reviewedBy: 'รอการรับรองจากแพทย์ผู้เชี่ยวชาญ',
  shortDescriptionTh: 'มะเร็งที่เสียชีวิตสูงที่สุดในโลกและในไทย — ป้องกันได้ถึง 80-90% โดยการเลิกสูบบุหรี่',

  stats: {
    prevalenceThailand: '~17,000-18,000 รายต่อปี',
    prevalenceThai: 'มะเร็งที่เสียชีวิตสูงสุดในประเทศไทย — อัตราการรอดชีวิต 5 ปีเฉลี่ยเพียง 15-20%',
    primaryRiskGroupTh: 'ผู้สูบบุหรี่อายุ 50+ ปี หรือผู้สัมผัสสารก่อมะเร็งในสิ่งแวดล้อม',
    survivalRate: 'ระยะที่ 1: ~60-90% · ระยะที่ 4: ~5-10% · เฉลี่ยทุกระยะ: ~15-20%',
    mortalityRankTh: 'สาเหตุการเสียชีวิตจากมะเร็งอันดับ 1 ในไทยและทั่วโลก',
    newCasesPerYearTh: 'ประมาณ 17,000-18,000 รายต่อปีในประเทศไทย',
  },

  overviewTh: `มะเร็งปอดเป็นมะเร็งที่คร่าชีวิตคนมากที่สุดในโลกและในประเทศไทย แบ่งออกเป็น 2 ชนิดหลัก คือ Non-Small Cell Lung Cancer (NSCLC) ที่พบ ~85% ของทั้งหมด และ Small Cell Lung Cancer (SCLC) ที่พบ ~15% แต่มีความรุนแรงกว่า NSCLC แบ่งย่อยอีกเป็น Adenocarcinoma (พบมากขึ้นในคนไม่สูบบุหรี่และผู้หญิง) Squamous Cell Carcinoma และ Large Cell Carcinoma

เหตุที่อัตราการรอดชีวิตต่ำมาก เพราะมะเร็งปอดส่วนใหญ่ถูกพบในระยะที่ 3-4 ซึ่งมีอาการชัดเจนแล้ว ในระยะแรกๆ มักไม่มีอาการหรืออาการคล้ายโรคทางเดินหายใจทั่วไป ทำให้ตรวจพบยาก ข้อมูลจากสถาบันมะเร็งแห่งชาติไทยชี้ว่า 70-80% ของผู้ป่วยถูกวินิจฉัยในระยะที่แพร่กระจายไปแล้ว

ข่าวดีในทศวรรษที่ผ่านมาคือการพัฒนา Targeted Therapy สำหรับมะเร็งปอดที่มีการกลายพันธุ์ EGFR (พบ 40-50% ในคนไทย) ALK และ ROS1 ทำให้ผู้ป่วยบางกลุ่มมีอายุยืนยาวขึ้นมาก รวมถึง Immunotherapy (PD-L1 inhibitors) ที่ช่วยให้ผู้ป่วยระยะ 4 บางรายมีอายุยืนยาวขึ้นอย่างน่าตื่นตาตื่นใจ`,

  symptoms: [
    {
      id: 'persistent_cough',
      nameTh: 'ไอเรื้อรัง / ไอเปลี่ยนลักษณะ',
      nameEn: 'Persistent or worsening cough',
      severity: 'red_flag',
      descriptionTh: 'ไอนานเกิน 3 สัปดาห์โดยไม่ดีขึ้น หรือไอที่เปลี่ยนจากเดิมอย่างชัดเจน เช่น ไอมากขึ้น ไอแห้งที่เคยมีน้อยกลายเป็นมีเสมหะ',
      frequencyNote: 'พบใน 50-75% ของผู้ป่วยมะเร็งปอด',
    },
    {
      id: 'hemoptysis',
      nameTh: 'ไอมีเลือดออก',
      nameEn: 'Hemoptysis (coughing up blood)',
      severity: 'red_flag',
      descriptionTh: 'ไอมีเลือดออกทางปาก แม้จะมีเพียงเล็กน้อย ต้องพบแพทย์ทันที เพราะอาจเป็นสัญญาณของมะเร็งหรือโรคร้ายแรงอื่น',
      frequencyNote: 'พบใน 7-10% ของผู้ป่วยมะเร็งปอด',
    },
    {
      id: 'dyspnea',
      nameTh: 'หายใจลำบาก / เหนื่อยง่ายผิดปกติ',
      nameEn: 'Shortness of breath',
      severity: 'severe',
      descriptionTh: 'หายใจไม่อิ่ม เหนื่อยง่ายกว่าปกติ แม้ทำกิจกรรมเบาๆ หรืออาจเกิดจากน้ำในเยื่อหุ้มปอด (Pleural Effusion)',
      frequencyNote: 'พบใน 25-40% ของผู้ป่วยในระยะแรก',
    },
    {
      id: 'chest_pain',
      nameTh: 'เจ็บหน้าอก',
      nameEn: 'Chest pain',
      severity: 'severe',
      descriptionTh: 'เจ็บหน้าอกที่ไม่เกี่ยวกับการออกกำลังกาย อาจเจ็บที่หน้าอก หลัง หรือไหล่ เกิดจากมะเร็งลุกลามไปยังเยื่อหุ้มปอดหรือผนังอก',
      frequencyNote: 'พบในมะเร็งระยะลุกลาม',
    },
    {
      id: 'hoarseness',
      nameTh: 'เสียงแหบหรือเสียงเปลี่ยน',
      nameEn: 'Hoarseness',
      severity: 'moderate',
      descriptionTh: 'เสียงแหบหรือเปลี่ยนแปลงอย่างชัดเจนโดยไม่มีหวัด อาจเกิดจากมะเร็งกดทับเส้นประสาทที่ควบคุมกล้ามเนื้อสายเสียง',
    },
    {
      id: 'weight_loss',
      nameTh: 'น้ำหนักลดผิดปกติ',
      nameEn: 'Unexplained weight loss',
      severity: 'severe',
      descriptionTh: 'น้ำหนักลดมากกว่า 5% ของน้ำหนักตัวในช่วง 6-12 เดือนโดยไม่ได้ตั้งใจ เบื่ออาหาร อ่อนเพลีย เป็นสัญญาณของมะเร็งที่มักพบในระยะลุกลาม',
      frequencyNote: 'พบใน 25-35% ของผู้ป่วย',
    },
    {
      id: 'shoulder_arm_pain',
      nameTh: 'ปวดไหล่หรือแขนส่วนบน (Pancoast Tumor)',
      nameEn: 'Shoulder or upper arm pain (Pancoast)',
      severity: 'moderate',
      descriptionTh: 'ปวดไหล่หรือแขนด้านใน อาจมีมือหรือแขนอ่อนแรง เกิดจากมะเร็งปอดยอดปอดกดทับเส้นประสาทที่ออกจากไขสันหลัง',
    },
  ],

  redFlagsTh: [
    'ไอมีเลือดออก แม้จะเพียงเล็กน้อย — พบแพทย์ทันที',
    'ไอเรื้อรังนานกว่า 3 สัปดาห์ไม่ดีขึ้น',
    'น้ำหนักลดมากกว่า 5% ในช่วง 6 เดือนโดยไม่ได้ตั้งใจ',
    'หายใจลำบากที่เพิ่มขึ้นเรื่อยๆ โดยไม่มีสาเหตุ',
    'เสียงแหบที่ไม่หายใน 3 สัปดาห์',
    'ปวดกระดูกหรือปวดศีรษะรุนแรงที่ไม่ตอบสนองต่อยาแก้ปวด (อาจเป็นสัญญาณการแพร่กระจาย)',
  ],

  causesTh: [
    'การสูบบุหรี่ — เป็นสาเหตุ 80-85% ของมะเร็งปอด ทั้งผู้ที่สูบเองและผู้รับควันบุหรี่มือสอง',
    'Radon Gas — แก๊สกัมมันตรังสีที่เกิดจากการสลายตัวของยูเรเนียมในดิน ซึมเข้าอาคาร เป็นสาเหตุอันดับ 2',
    'สารก่อมะเร็งในสภาพแวดล้อมและที่ทำงาน เช่น Asbestos, Arsenic, Chromium, Nickel',
    'มลพิษทางอากาศ (PM2.5) จากการจราจร การเผาไหม้ และโรงงานอุตสาหกรรม',
    'การกลายพันธุ์ทางพันธุกรรม เช่น EGFR mutation พบบ่อยในผู้ป่วยมะเร็งปอดในเอเชียที่ไม่สูบบุหรี่',
    'ประวัติโรคปอดเรื้อรัง (COPD, ปอดเป็นพังผืด) เพิ่มความเสี่ยงมะเร็งปอด',
  ],

  riskFactors: [
    {
      nameTh: 'การสูบบุหรี่',
      nameEn: 'Cigarette smoking',
      type: 'modifiable',
      descriptionTh: 'ปัจจัยเสี่ยงอันดับ 1 ผู้สูบบุหรี่มีความเสี่ยงมะเร็งปอดสูงกว่าคนไม่สูบ 15-25 เท่า ยิ่งสูบมากและนานยิ่งเสี่ยงสูง',
      relativeRisk: 'เพิ่มความเสี่ยง 15-25 เท่า',
    },
    {
      nameTh: 'ควันบุหรี่มือสอง (Passive Smoking)',
      nameEn: 'Secondhand smoke',
      type: 'modifiable',
      descriptionTh: 'ผู้ที่อาศัยหรือทำงานกับผู้สูบบุหรี่โดยไม่สูบเองมีความเสี่ยงมะเร็งปอดสูงขึ้น 20-30%',
      relativeRisk: 'เพิ่มความเสี่ยง 20-30%',
    },
    {
      nameTh: 'มลพิษ PM2.5 และอากาศเสีย',
      nameEn: 'Air pollution / PM2.5',
      type: 'partially_modifiable',
      descriptionTh: 'PM2.5 เป็นสารก่อมะเร็งกลุ่ม 1 (IARC) ปัญหาหมอกควันในภาคเหนือและมลพิษในกรุงเทพฯ เพิ่มความเสี่ยงในระยะยาว',
      relativeRisk: 'เพิ่มความเสี่ยง 10-20% ในพื้นที่มลพิษสูง',
    },
    {
      nameTh: 'อายุ (50 ปีขึ้นไป)',
      nameEn: 'Age (50+)',
      type: 'non_modifiable',
      descriptionTh: 'ความเสี่ยงมะเร็งปอดเพิ่มขึ้นตามอายุ ส่วนใหญ่วินิจฉัยในผู้ที่อายุ 65 ปีขึ้นไป',
    },
    {
      nameTh: 'โรคปอดเรื้อรัง (COPD, Emphysema)',
      nameEn: 'Chronic lung disease',
      type: 'partially_modifiable',
      descriptionTh: 'COPD เพิ่มความเสี่ยงมะเร็งปอด 2-5 เท่า แม้ไม่สูบบุหรี่ ซึ่งเชื่อมโยงกับการอักเสบเรื้อรังในปอด',
      relativeRisk: 'เพิ่มความเสี่ยง 2-5 เท่า',
    },
    {
      nameTh: 'ประวัติครอบครัวเป็นมะเร็งปอด',
      nameEn: 'Family history of lung cancer',
      type: 'non_modifiable',
      descriptionTh: 'พ่อแม่หรือพี่น้องเป็นมะเร็งปอดเพิ่มความเสี่ยงสูงขึ้น 1.5-2 เท่า แม้ไม่สูบบุหรี่',
      relativeRisk: 'เพิ่มความเสี่ยง 1.5-2 เท่า',
    },
  ],

  screening: [
    {
      id: 'ldct_screening',
      nameTh: 'CT Scan ปอดขนาดต่ำ (Low-Dose CT)',
      nameEn: 'Low-Dose CT (LDCT) Lung Cancer Screening',
      ageRange: '50-80 ปี (มีประวัติสูบบุหรี่)',
      sex: 'all',
      frequency: 'ทุกปี',
      descriptionTh: 'แนะนำสำหรับผู้สูบบุหรี่หรือเลิกสูบได้ไม่เกิน 15 ปี ที่มีประวัติสูบ ≥ 20 Pack-years LDCT ลดอัตราการเสียชีวิตจากมะเร็งปอดได้ 20-24% ในการทดลอง NLST ยังไม่อยู่ในสิทธิ์ NHSO พื้นฐาน',
      isNHSOCovered: false,
      guidelineSource: 'USPSTF 2021 / NCCN Lung Cancer Screening v2024',
    },
    {
      id: 'chest_xray',
      nameTh: 'เอกซเรย์ทรวงอก (Chest X-Ray)',
      nameEn: 'Chest X-Ray',
      ageRange: 'ทุกอายุ เมื่อมีอาการ',
      sex: 'all',
      frequency: 'เมื่อมีอาการหรือตามดุลยพินิจแพทย์',
      descriptionTh: 'ไม่แนะนำเป็น Routine Screening เพราะ Sensitivity ต่ำ (ตรวจพบมะเร็งระยะแรกได้น้อย) แต่ยังมีประโยชน์เมื่อมีอาการหรือเพื่อติดตาม',
      isNHSOCovered: true,
      guidelineSource: 'กรมการแพทย์ สธ.',
    },
    {
      id: 'biomarker_egfr',
      nameTh: 'ตรวจการกลายพันธุ์ EGFR/ALK/ROS1 (ผู้ป่วยที่วินิจฉัยแล้ว)',
      nameEn: 'Molecular Testing (EGFR/ALK/ROS1/PD-L1)',
      ageRange: 'ผู้ป่วยมะเร็งปอดที่ได้รับการวินิจฉัย',
      sex: 'all',
      frequency: 'ครั้งเดียวหลังวินิจฉัย',
      descriptionTh: 'จำเป็นสำหรับผู้ป่วย NSCLC ทุกราย เพื่อเลือก Targeted Therapy ที่เหมาะสม EGFR mutation พบ 40-50% ในคนไทย — ถ้าพบสามารถรักษาด้วยยากิน (EGFR-TKI) ได้ผลดีมาก',
      isNHSOCovered: true,
      guidelineSource: 'สมาคมอุรเวชช์แห่งประเทศไทย / NCCN NSCLC Guidelines',
    },
    {
      id: 'smoking_cessation',
      nameTh: 'คลินิกเลิกบุหรี่ (การป้องกัน)',
      nameEn: 'Smoking Cessation Program',
      ageRange: 'ผู้สูบบุหรี่ทุกอายุ',
      sex: 'all',
      frequency: 'สม่ำเสมอจนเลิกได้สำเร็จ',
      descriptionTh: 'การเลิกบุหรี่เป็นมาตรการป้องกันมะเร็งปอดที่ดีที่สุด สถานพยาบาลสังกัด สธ. ทุกแห่งมีคลินิกเลิกบุหรี่ ฟรีสำหรับผู้ใช้สิทธิ์ NHSO',
      isNHSOCovered: true,
      guidelineSource: 'กรมควบคุมโรค / NHSO',
    },
  ],

  treatments: [
    {
      categoryTh: 'การผ่าตัด',
      nameTh: 'การผ่าตัดปอด (Lobectomy/Pneumonectomy)',
      nameEn: 'Lung Resection Surgery',
      descriptionTh: 'เป็นทางเลือกหลักในระยะ I-II ที่ยังไม่แพร่กระจาย การผ่าตัดผ่านกล้อง (VATS) มีแผลเล็กและฟื้นตัวเร็วขึ้น',
      forStage: 'ระยะ I-II (และบางกรณีระยะ III)',
      sideEffectsTh: ['สมรรถภาพปอดลดลง', 'เจ็บแผล', 'โอกาสปอดบวมหลังผ่าตัด'],
    },
    {
      categoryTh: 'Targeted Therapy',
      nameTh: 'ยามุ่งเป้า EGFR-TKI (Osimertinib, Erlotinib)',
      nameEn: 'EGFR Tyrosine Kinase Inhibitors',
      descriptionTh: 'ยากินที่มุ่งเป้าที่ EGFR mutation — ผู้ป่วยไทยที่มี EGFR mutation (40-50%) ตอบสนองได้ดีมาก Osimertinib (รุ่นที่ 3) เป็นยามาตรฐานปัจจุบัน',
      forStage: 'NSCLC ระยะ III-IV ที่มี EGFR mutation',
      sideEffectsTh: ['ผื่นผิวหนัง', 'ท้องเสีย', 'ปอดอักเสบ (หายาก แต่รุนแรง)'],
    },
    {
      categoryTh: 'Immunotherapy',
      nameTh: 'ภูมิคุ้มกันบำบัด (PD-1/PD-L1 Inhibitors)',
      nameEn: 'Immune Checkpoint Inhibitors',
      descriptionTh: 'Pembrolizumab, Atezolizumab — ใช้สำหรับผู้ป่วยที่มี PD-L1 expression สูงหรือร่วมกับเคมีบำบัด ยืดชีวิตผู้ป่วยระยะ 4 ได้อย่างมีนัยสำคัญในบางราย',
      forStage: 'NSCLC ระยะ III-IV',
      sideEffectsTh: ['ภูมิคุ้มกันโจมตีอวัยวะตนเอง', 'ปอดอักเสบ', 'ต่อมไร้ท่ออักเสบ'],
    },
    {
      categoryTh: 'เคมีบำบัด',
      nameTh: 'เคมีบำบัด (Platinum-based Chemotherapy)',
      nameEn: 'Chemotherapy',
      descriptionTh: 'Cisplatin หรือ Carboplatin ร่วมกับยาตัวที่ 2 เช่น Pemetrexed หรือ Paclitaxel ใช้ทั้งเป็นการรักษาหลักและร่วมกับ Immunotherapy',
      forStage: 'ระยะ III-IV หรือ SCLC ทุกระยะ',
      sideEffectsTh: ['คลื่นไส้อาเจียน', 'ผมร่วง', 'ภูมิคุ้มกันต่ำ', 'ไตเสื่อม (Cisplatin)'],
    },
    {
      categoryTh: 'รังสีรักษา',
      nameTh: 'รังสีรักษา (SBRT/SABR สำหรับระยะต้น)',
      nameEn: 'Stereotactic Body Radiation Therapy',
      descriptionTh: 'รังสีรักษาขนาดสูงแม่นยำสำหรับผู้ป่วยระยะต้นที่ผ่าตัดไม่ได้ ผลการรักษาใกล้เคียงกับการผ่าตัดในบางกลุ่ม',
      forStage: 'ระยะ I-II ที่ผ่าตัดไม่ได้',
    },
  ],

  prevention: [
    {
      actionTh: 'เลิกสูบบุหรี่หรืองดสูบบุหรี่',
      descriptionTh: 'มาตรการป้องกันอันดับ 1 เลิกสูบบุหรี่ลดความเสี่ยงมะเร็งปอดลงอย่างต่อเนื่อง ความเสี่ยงลดลงครึ่งหนึ่งภายใน 10 ปีหลังเลิก',
      impact: 'high',
      evidence: 'IARC Monograph / WHO FCTC',
    },
    {
      actionTh: 'หลีกเลี่ยงควันบุหรี่มือสอง',
      descriptionTh: 'ออกจากสภาพแวดล้อมที่มีควันบุหรี่ ห้ามสูบบุหรี่ในบ้านและรถยนต์ เพื่อปกป้องสมาชิกในครอบครัว',
      impact: 'high',
      evidence: 'IARC Monograph on Second-hand Smoke',
    },
    {
      actionTh: 'ลดการสัมผัส PM2.5',
      descriptionTh: 'สวม N95 ในวันที่ค่า AQI สูง (> 150) หลีกเลี่ยงการออกกำลังกายกลางแจ้งในช่วงหมอกควัน ติดตั้งเครื่องฟอกอากาศในบ้าน',
      impact: 'medium',
      evidence: 'IARC Group 1 Carcinogen Classification for PM2.5',
    },
    {
      actionTh: 'ตรวจ LDCT ประจำปี (กลุ่มเสี่ยงสูง)',
      descriptionTh: 'ผู้สูบบุหรี่อายุ 50-80 ปี ≥ 20 Pack-years ควรทำ Low-Dose CT ทุกปี เพื่อตรวจพบมะเร็งในระยะต้นที่ผ่าตัดหายได้',
      impact: 'high',
      evidence: 'USPSTF Grade B Recommendation 2021 / NLST Trial',
    },
    {
      actionTh: 'หลีกเลี่ยงสารก่อมะเร็งในอาชีพ',
      descriptionTh: 'สวมใส่อุปกรณ์ป้องกันเมื่อทำงานกับ Asbestos, Radon, หรือสารเคมีก่อมะเร็ง ปฏิบัติตามมาตรฐานความปลอดภัยอาชีวอนามัย',
      impact: 'medium',
      evidence: 'NIOSH / OSHA Occupational Carcinogen Standards',
    },
  ],

  whenToSeeDoctorTh: [
    'ไอเรื้อรังนานกว่า 3 สัปดาห์ โดยเฉพาะถ้าสูบบุหรี่อยู่',
    'ไอมีเลือดออก แม้จะเพียงเล็กน้อย — พบแพทย์วันนั้นทันที',
    'หายใจลำบากที่เพิ่มขึ้นเรื่อยๆ โดยไม่มีสาเหตุ',
    'น้ำหนักลดมากกว่า 5% ในช่วง 6 เดือนโดยไม่ตั้งใจ',
    'เสียงแหบที่ไม่หายภายใน 3 สัปดาห์',
    'ปวดกระดูกหรือปวดศีรษะรุนแรงผิดปกติในผู้ที่มีประวัติมะเร็งปอด',
    'ผู้สูบบุหรี่อายุ 50+ ปี — ควรปรึกษาแพทย์เรื่องการทำ LDCT Screening',
  ],

  faqsTh: [
    {
      questionTh: 'ไม่สูบบุหรี่แต่เป็นมะเร็งปอดได้ไหม?',
      answerTh: 'ได้ครับ/ค่ะ ประมาณ 15-20% ของมะเร็งปอดเกิดในผู้ที่ไม่เคยสูบบุหรี่ สาเหตุได้แก่ การสัมผัส PM2.5 ควันบุหรี่มือสอง การกลายพันธุ์ทางพันธุกรรม (โดยเฉพาะ EGFR mutation ที่พบบ่อยในผู้หญิงเอเชีย) และสารก่อมะเร็งในอากาศ',
    },
    {
      questionTh: 'EGFR mutation คืออะไร ทำไมสำคัญ?',
      answerTh: 'EGFR (Epidermal Growth Factor Receptor) mutation คือการกลายพันธุ์ของยีนที่พบใน 40-50% ของผู้ป่วยมะเร็งปอดในไทยและเอเชีย ผู้ป่วยที่มี EGFR mutation สามารถรักษาด้วยยากิน (TKI เช่น Osimertinib) ที่ได้ผลดีกว่าเคมีบำบัดมาก ดังนั้นการตรวจ EGFR จึงสำคัญมากในผู้ป่วยมะเร็งปอดทุกราย',
    },
    {
      questionTh: 'บุหรี่ไฟฟ้า (IQOS/Vape) ทำให้เป็นมะเร็งปอดไหม?',
      answerTh: 'ยังไม่มีข้อมูลระยะยาวเพียงพอ แต่บุหรี่ไฟฟ้ามีสารเคมีที่อาจก่อมะเร็งหลายชนิด WHO และ IARC จัดบุหรี่ไฟฟ้าว่าไม่ปลอดภัย และไม่แนะนำเป็นวิธีเลิกบุหรี่ที่ได้ผล',
    },
    {
      questionTh: 'มะเร็งปอดระยะ 4 รักษาได้ไหม?',
      answerTh: 'รักษาหายขาดได้ยาก แต่ยาใหม่ทำให้คุณภาพชีวิตดีขึ้นและยืดชีวิตได้อย่างมีนัยสำคัญ ผู้ป่วยที่มี EGFR mutation หรือ ALK fusion ที่ตอบสนองต่อ Targeted Therapy บางรายมีชีวิตได้นาน 3-5 ปีในระยะ 4 Immunotherapy ก็ช่วยได้ในบางกลุ่ม',
    },
  ],

  references: [
    {
      id: 'nci_thailand_lung',
      titleEn: 'Cancer in Thailand Vol.XI, 2019-2021 — Lung Cancer Statistics',
      titleTh: 'มะเร็งในประเทศไทย — สถิติมะเร็งปอด',
      organization: 'สถาบันมะเร็งแห่งชาติ กระทรวงสาธารณสุข',
      year: 2023,
      type: 'cohort',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'uspstf_ldct_2021',
      titleEn: 'USPSTF Recommendation Statement: Lung Cancer Screening',
      organization: 'United States Preventive Services Task Force',
      year: 2021,
      url: 'https://www.uspreventiveservicestaskforce.org',
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'nccn_nsclc_2024',
      titleEn: 'NCCN Clinical Practice Guidelines in Oncology — Non-Small Cell Lung Cancer',
      organization: 'National Comprehensive Cancer Network',
      year: 2024,
      url: 'https://www.nccn.org',
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'thai_thoracic_guideline',
      titleEn: 'Clinical Practice Guidelines for Lung Cancer Management in Thailand',
      titleTh: 'แนวทางเวชปฏิบัติการดูแลผู้ป่วยมะเร็งปอดในประเทศไทย',
      organization: 'สมาคมอุรเวชช์แห่งประเทศไทย',
      year: 2022,
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
  ],

  relatedDiseases: ['breast-cancer', 'colorectal-cancer', 'hypertension'],
  keywords: ['มะเร็งปอด', 'Lung Cancer', 'EGFR', 'NSCLC', 'SCLC', 'บุหรี่', 'PM2.5', 'Low-Dose CT', 'LDCT', 'Immunotherapy', 'Targeted Therapy'],
}

export default lungCancer
