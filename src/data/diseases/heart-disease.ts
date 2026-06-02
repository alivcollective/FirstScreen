// โรคหัวใจขาดเลือด (Coronary Heart Disease) — Rich Disease Data
// SAFETY: ข้อมูลเพื่อการศึกษาเท่านั้น ต้องตรวจสอบโดยแพทย์ก่อนเผยแพร่

import type { RichDisease } from '@/types/disease'

const heartDisease: RichDisease = {
  slug: 'heart-disease',
  nameTh: 'โรคหัวใจขาดเลือด (Coronary Heart Disease)',
  nameTh_short: 'โรคหัวใจขาดเลือด',
  nameEn: 'Coronary Heart Disease',
  category: 'heart',
  categoryTh: 'หัวใจและหลอดเลือด',
  icd10: 'I25',
  riskLevel: 'very_high',
  lastReviewed: '2026-06',
  reviewedBy: 'รอการรับรองจากแพทย์ผู้เชี่ยวชาญ',
  shortDescriptionTh: 'สาเหตุการเสียชีวิตอันดับ 1 ในไทย — 80% ป้องกันได้ด้วยการควบคุมปัจจัยเสี่ยง',

  stats: {
    prevalenceThailand: '~1.3 ล้านคน (ผู้ป่วยที่ได้รับการวินิจฉัย)',
    prevalenceThai: 'สาเหตุการเสียชีวิตอันดับ 1 ในประเทศไทย คิดเป็น ~27% ของการเสียชีวิตทั้งหมด',
    primaryRiskGroupTh: 'ผู้ชายอายุ 45+ และผู้หญิงอายุ 55+ ที่มีปัจจัยเสี่ยง',
    survivalRate: 'หัวใจวายเฉียบพลัน: รอดชีวิต ~85% ถ้าถึงโรงพยาบาลใน 90 นาที',
    mortalityRankTh: 'สาเหตุการเสียชีวิตอันดับ 1 ในไทยและทั่วโลก',
    newCasesPerYearTh: 'ประมาณ 60,000-70,000 รายต่อปีในประเทศไทย',
  },

  overviewTh: `โรคหัวใจขาดเลือด (Coronary Heart Disease หรือ Ischemic Heart Disease) เกิดจากการที่หลอดเลือดแดงโคโรนารีที่เลี้ยงกล้ามเนื้อหัวใจเกิดการตีบตันหรืออุดตัน เนื่องจากการสะสมของไขมัน คอเลสเตอรอล และสารอื่นๆ ที่เรียกว่า "คราบพลัค" (Atherosclerotic Plaque) เมื่อเลือดไม่สามารถไหลผ่านไปเลี้ยงกล้ามเนื้อหัวใจได้เพียงพอ ก็จะเกิดอาการเจ็บหน้าอก (Angina) หรือหัวใจวายเฉียบพลัน (Myocardial Infarction) ในที่สุด

ในประเทศไทย โรคหัวใจขาดเลือดเป็นสาเหตุการเสียชีวิตอันดับ 1 มาหลายปีต่อเนื่อง ข้อมูลจากกรมการแพทย์ระบุว่ามีผู้เสียชีวิตจากโรคนี้มากกว่า 60,000 รายต่อปี คิดเป็นสัดส่วนประมาณ 1 ใน 4 ของการเสียชีวิตทั้งหมด สาเหตุสำคัญที่ทำให้ตัวเลขสูงขึ้นคือพฤติกรรมการกิน วิถีชีวิต และการที่ผู้ป่วยส่วนใหญ่ไม่รู้ตัวว่าป่วยจนกว่าจะเกิดหัวใจวาย

ข่าวดีคือโรคหัวใจขาดเลือดป้องกันได้ถึง 80% ด้วยการควบคุมปัจจัยเสี่ยงที่แก้ไขได้ เช่น ความดันโลหิตสูง เบาหวาน ไขมันในเลือดสูง การสูบบุหรี่ และภาวะอ้วน และหากเกิดอาการหัวใจวายเฉียบพลัน การรักษาอย่างรวดเร็วภายใน "Golden Hour" สามารถช่วยชีวิตและลดความเสียหายของกล้ามเนื้อหัวใจได้อย่างมาก`,

  symptoms: [
    {
      id: 'chest_pain',
      nameTh: 'เจ็บแน่นหน้าอก',
      nameEn: 'Chest pain / Angina',
      severity: 'red_flag',
      descriptionTh: 'รู้สึกแน่น บีบ กด หรือเจ็บที่กลางหน้าอกหรือใต้กระดูกหน้าอก อาจร้าวไปที่แขนซ้าย คอ กราม หรือหลัง มักเกิดขณะออกแรงหรือตื่นเต้น',
      frequencyNote: 'พบใน 70-80% ของผู้ป่วยโรคหัวใจขาดเลือด',
    },
    {
      id: 'dyspnea',
      nameTh: 'หายใจลำบาก / เหนื่อยง่ายผิดปกติ',
      nameEn: 'Shortness of breath',
      severity: 'severe',
      descriptionTh: 'หายใจไม่อิ่ม เหนื่อยง่ายกว่าปกติ แม้ทำกิจกรรมเบาๆ หรือนอนราบแล้วรู้สึกหายใจลำบาก อาจเกิดร่วมกับหรือไม่มีอาการเจ็บหน้าอก',
      frequencyNote: 'พบมากในผู้หญิง ผู้สูงอายุ และผู้ป่วยเบาหวาน',
    },
    {
      id: 'radiating_pain',
      nameTh: 'ปวดร้าวที่แขน คอ กราม หรือหลัง',
      nameEn: 'Radiating pain to arm, neck, jaw or back',
      severity: 'red_flag',
      descriptionTh: 'อาการปวดที่ร้าวออกไปจากหน้าอก โดยเฉพาะแขนซ้าย คอ กราม หรือหลัง เป็นสัญญาณเตือนสำคัญของหัวใจวายเฉียบพลัน',
      frequencyNote: 'พบใน 25-40% ของผู้ป่วยหัวใจวายเฉียบพลัน',
    },
    {
      id: 'cold_sweat',
      nameTh: 'เหงื่อออกเย็น คลื่นไส้ อาเจียน',
      nameEn: 'Cold sweat, nausea, vomiting',
      severity: 'red_flag',
      descriptionTh: 'เหงื่อออกมากผิดปกติโดยไม่เกี่ยวกับความร้อน คลื่นไส้หรืออาเจียนร่วมกับอาการเจ็บหน้าอก เป็นสัญญาณของหัวใจวายเฉียบพลัน',
      frequencyNote: 'พบในช่วงหัวใจวายเฉียบพลัน',
    },
    {
      id: 'dizziness',
      nameTh: 'วิงเวียน หน้ามืด หรือเป็นลม',
      nameEn: 'Dizziness, lightheadedness or fainting',
      severity: 'severe',
      descriptionTh: 'รู้สึกวิงเวียนศีรษะ บ้านหมุน หรือเป็นลมกลางอากาศ โดยเฉพาะขณะออกกำลังกายหรือลุกขึ้นเร็ว',
      frequencyNote: 'พบในภาวะหัวใจล้มเหลวหรือหัวใจเต้นผิดจังหวะ',
    },
    {
      id: 'palpitation',
      nameTh: 'หัวใจเต้นผิดจังหวะ / ใจสั่น',
      nameEn: 'Palpitations / irregular heartbeat',
      severity: 'moderate',
      descriptionTh: 'รู้สึกหัวใจเต้นเร็ว ไม่สม่ำเสมอ หรือ "กระตุก" ในอก อาจเกิดจากกล้ามเนื้อหัวใจขาดเลือดทำให้สัญญาณไฟฟ้าผิดปกติ',
      frequencyNote: 'พบในผู้ป่วยที่มีภาวะหัวใจขาดเลือดเรื้อรัง',
    },
    {
      id: 'fatigue',
      nameTh: 'อ่อนเพลียเรื้อรังโดยไม่ทราบสาเหตุ',
      nameEn: 'Unexplained chronic fatigue',
      severity: 'mild',
      descriptionTh: 'รู้สึกเหนื่อยล้า อ่อนแรง โดยไม่มีสาเหตุชัดเจน อาจเป็นสัญญาณเตือนล่วงหน้าของโรคหัวใจ โดยเฉพาะในผู้หญิง',
      frequencyNote: 'พบบ่อยในผู้หญิงที่เป็นโรคหัวใจ',
    },
  ],

  redFlagsTh: [
    'เจ็บแน่นหน้าอกรุนแรงนานกว่า 15 นาที ร่วมกับเหงื่อออกและคลื่นไส้ — โทร 1669 ทันที',
    'เจ็บหน้าอกร้าวไปที่แขนซ้าย คอ หรือกราม',
    'หายใจลำบากอย่างเฉียบพลันร่วมกับเจ็บหน้าอก',
    'หมดสติหรือเกือบหมดสติโดยไม่มีสาเหตุ',
    'ชีพจรเต้นเร็วหรือช้าผิดปกติร่วมกับวิงเวียน',
  ],

  causesTh: [
    'การสะสมของคราบไขมัน (Atherosclerosis) ในผนังหลอดเลือดโคโรนารีทำให้หลอดเลือดตีบแคบลงเรื่อยๆ',
    'ลิ่มเลือด (Thrombus) ก่อตัวบนคราบพลัคที่แตก ทำให้เกิดการอุดตันเฉียบพลัน',
    'ความดันโลหิตสูงเรื้อรังทำลายผนังหลอดเลือดและเร่งกระบวนการ Atherosclerosis',
    'เบาหวานทำให้หลอดเลือดเสื่อมสภาพเร็วขึ้นและการอักเสบในหลอดเลือดสูงขึ้น',
    'การสูบบุหรี่ทำให้เกิดการอักเสบ หลอดเลือดหดเกร็ง และเพิ่มการแข็งตัวของเลือด',
    'พันธุกรรม — ประวัติครอบครัวเป็นโรคหัวใจเพิ่มความเสี่ยงอย่างมีนัยสำคัญ',
  ],

  riskFactors: [
    {
      nameTh: 'ความดันโลหิตสูง',
      nameEn: 'Hypertension',
      type: 'modifiable',
      descriptionTh: 'ความดัน ≥ 140/90 mmHg ทำลายผนังหลอดเลือดและเร่งกระบวนการ Atherosclerosis อย่างมีนัยสำคัญ',
      relativeRisk: 'เพิ่มความเสี่ยง 2-4 เท่า',
    },
    {
      nameTh: 'ไขมันในเลือดสูง (Hyperlipidemia)',
      nameEn: 'High cholesterol',
      type: 'modifiable',
      descriptionTh: 'LDL สูงและ HDL ต่ำเป็นปัจจัยเสี่ยงหลักในการสะสมคราบพลัคในหลอดเลือด ควรตรวจวัดเป็นประจำ',
      relativeRisk: 'LDL ทุก 1 mmol/L ที่ลดได้ ลดความเสี่ยง 20-25%',
    },
    {
      nameTh: 'เบาหวานชนิดที่ 2',
      nameEn: 'Type 2 Diabetes',
      type: 'modifiable',
      descriptionTh: 'ผู้ป่วยเบาหวานมีความเสี่ยงโรคหัวใจสูงกว่าคนปกติ 2-4 เท่า น้ำตาลสูงทำลายผนังหลอดเลือดโดยตรง',
      relativeRisk: 'เพิ่มความเสี่ยง 2-4 เท่า',
    },
    {
      nameTh: 'การสูบบุหรี่',
      nameEn: 'Smoking',
      type: 'modifiable',
      descriptionTh: 'สารนิโคตินและคาร์บอนมอนออกไซด์ทำให้หลอดเลือดหดเกร็ง อักเสบ และเพิ่มความหนืดของเลือด',
      relativeRisk: 'เพิ่มความเสี่ยง 2-3 เท่า (เลิกสูบลดความเสี่ยงลงครึ่งหนึ่งใน 1 ปี)',
    },
    {
      nameTh: 'โรคอ้วน / น้ำหนักเกิน',
      nameEn: 'Obesity',
      type: 'modifiable',
      descriptionTh: 'BMI ≥ 25 (เกณฑ์เอเชีย) เพิ่มภาระหัวใจและมักมาพร้อมกับความดันสูง เบาหวาน และไขมันสูง',
      relativeRisk: 'เพิ่มความเสี่ยง 50-200% ขึ้นกับระดับความอ้วน',
    },
    {
      nameTh: 'ไม่ออกกำลังกาย',
      nameEn: 'Physical inactivity',
      type: 'modifiable',
      descriptionTh: 'คนที่ไม่ออกกำลังกายมีความเสี่ยงโรคหัวใจสูงขึ้น 35% เมื่อเทียบกับคนที่ออกกำลังกายสม่ำเสมอ',
      relativeRisk: 'เพิ่มความเสี่ยง 35%',
    },
    {
      nameTh: 'ความเครียดเรื้อรัง',
      nameEn: 'Chronic stress',
      type: 'modifiable',
      descriptionTh: 'ความเครียดกระตุ้นการหลั่ง Cortisol และ Adrenaline ทำให้ความดันสูง หัวใจทำงานหนัก และเพิ่มการแข็งตัวของเลือด',
    },
    {
      nameTh: 'เพศชาย (อายุ < 55 ปี)',
      nameEn: 'Male sex (under 55)',
      type: 'non_modifiable',
      descriptionTh: 'ผู้ชายมีความเสี่ยงโรคหัวใจสูงกว่าผู้หญิงก่อนวัยหมดประจำเดือน เพราะฮอร์โมนเอสโตรเจนปกป้องหลอดเลือด',
    },
    {
      nameTh: 'ประวัติครอบครัวเป็นโรคหัวใจ',
      nameEn: 'Family history',
      type: 'non_modifiable',
      descriptionTh: 'พ่อหรือพี่น้องชายเป็นโรคหัวใจก่อนอายุ 55 ปี หรือแม่/พี่น้องหญิงก่อนอายุ 65 ปี',
      relativeRisk: 'เพิ่มความเสี่ยง 2-3 เท่า',
    },
  ],

  screening: [
    {
      id: 'bp_check',
      nameTh: 'วัดความดันโลหิต',
      nameEn: 'Blood Pressure Measurement',
      ageRange: '18 ปีขึ้นไป',
      sex: 'all',
      frequency: 'ทุกปี (ถ้าปกติ) หรือบ่อยกว่าถ้าเสี่ยง',
      descriptionTh: 'วิธีคัดกรองง่ายที่สุดและประหยัดที่สุด ควรวัดทั้งสองแขนและวัดซ้ำ ค่าที่ดี: < 120/80 mmHg',
      isNHSOCovered: true,
      guidelineSource: 'กรมการแพทย์ สธ. / Thai Hypertension Society',
    },
    {
      id: 'lipid_panel',
      nameTh: 'ตรวจไขมันในเลือด (Lipid Panel)',
      nameEn: 'Fasting Lipid Panel',
      ageRange: '20-35 ปีถ้ามีปัจจัยเสี่ยง, 35 ปีขึ้นไปทุกคน',
      sex: 'all',
      frequency: 'ทุก 4-5 ปี (ถ้าปกติ)',
      descriptionTh: 'ตรวจ Total Cholesterol, LDL, HDL, Triglyceride หลังงดอาหาร 9-12 ชั่วโมง เป้าหมาย LDL < 100 mg/dL สำหรับกลุ่มเสี่ยง',
      isNHSOCovered: true,
      guidelineSource: 'กรมการแพทย์ สธ. — สิทธิ์การตรวจ 30 บาท',
    },
    {
      id: 'fasting_glucose',
      nameTh: 'ตรวจน้ำตาลในเลือด (FPG)',
      nameEn: 'Fasting Plasma Glucose',
      ageRange: '35 ปีขึ้นไป',
      sex: 'all',
      frequency: 'ทุก 3 ปี (ถ้าปกติ)',
      descriptionTh: 'ตรวจเบาหวานซึ่งเป็นปัจจัยเสี่ยงหลักของโรคหัวใจ ค่าปกติ < 100 mg/dL',
      isNHSOCovered: true,
      guidelineSource: 'สปสช. / กรมการแพทย์ สธ.',
    },
    {
      id: 'ecg',
      nameTh: 'คลื่นไฟฟ้าหัวใจ (ECG/EKG)',
      nameEn: 'Electrocardiogram',
      ageRange: '45 ปีขึ้นไป หรือมีอาการ',
      sex: 'all',
      frequency: 'ตามดุลยพินิจแพทย์',
      descriptionTh: 'ตรวจจับความผิดปกติของจังหวะหัวใจและหาหลักฐานของกล้ามเนื้อหัวใจขาดเลือด ทำร่วมกับ Stress Test ถ้ามีข้อบ่งชี้',
      isNHSOCovered: true,
      guidelineSource: 'แนวทางเวชปฏิบัติโรคหัวใจ สมาคมแพทย์โรคหัวใจแห่งประเทศไทย',
    },
    {
      id: 'cvd_risk_score',
      nameTh: 'ประเมินคะแนนความเสี่ยงโรคหัวใจ (CVD Risk Score)',
      nameEn: 'Cardiovascular Risk Score (Thai CV Risk)',
      ageRange: '40-75 ปี',
      sex: 'all',
      frequency: 'ทุก 1-3 ปี',
      descriptionTh: 'คำนวณความเสี่ยงโรคหัวใจใน 10 ปีข้างหน้าโดยใช้ข้อมูลอายุ เพศ ความดัน ไขมัน เบาหวาน และการสูบบุหรี่ ใช้ Thai CV Risk Score ที่พัฒนาโดย สสส.',
      isNHSOCovered: true,
      guidelineSource: 'สมาคมแพทย์โรคหัวใจแห่งประเทศไทย / กรมการแพทย์',
    },
  ],

  treatments: [
    {
      categoryTh: 'ยาป้องกันและควบคุม',
      nameTh: 'ยาสลายลิ่มเลือดและลดไขมัน',
      nameEn: 'Antiplatelet & Statin Therapy',
      descriptionTh: 'Aspirin หรือ Clopidogrel ป้องกันการเกิดลิ่มเลือด ร่วมกับ Statin เพื่อลด LDL — เป็นยามาตรฐานสำหรับทุกผู้ป่วยโรคหัวใจขาดเลือด',
      forStage: 'ทุกระยะ',
      sideEffectsTh: ['ระคายเคืองกระเพาะ (Aspirin)', 'ปวดกล้ามเนื้อ (Statin)', 'เลือดออกง่ายขึ้น'],
    },
    {
      categoryTh: 'หัตถการขยายหลอดเลือด',
      nameTh: 'การขยายหลอดเลือดหัวใจ (PCI / Angioplasty + Stent)',
      nameEn: 'Percutaneous Coronary Intervention (PCI)',
      descriptionTh: 'สอดสายสวนเข้าทางข้อมือหรือขาหนีบ แล้วใช้บอลลูนขยายหลอดเลือดและใส่ขดลวด (Stent) ค้ำยันไว้ เป็นการรักษามาตรฐานในหัวใจวายเฉียบพลัน',
      forStage: 'หัวใจวายเฉียบพลัน (STEMI/NSTEMI)',
      sideEffectsTh: ['หลอดเลือดตีบซ้ำ', 'เลือดออก', 'แพ้สีฉีดหลอดเลือด'],
    },
    {
      categoryTh: 'การผ่าตัด',
      nameTh: 'การผ่าตัดบายพาสหัวใจ (CABG)',
      nameEn: 'Coronary Artery Bypass Graft Surgery',
      descriptionTh: 'ผ่าตัดนำหลอดเลือดจากขาหรืออก มาต่อเป็นทางเบี่ยงให้เลือดไหลผ่านบริเวณที่ตีบ เหมาะสำหรับหลอดเลือดตีบหลายเส้นหรือตีบตำแหน่งสำคัญ',
      forStage: 'หลอดเลือดตีบหลายเส้น หรือ Left Main Stenosis',
      sideEffectsTh: ['แผลผ่าตัดใหญ่', 'ฟื้นตัวนาน 6-8 สัปดาห์', 'ภาวะแทรกซ้อนจากการดมยาสลบ'],
    },
    {
      categoryTh: 'การฟื้นฟูสมรรถภาพหัวใจ',
      nameTh: 'โปรแกรมฟื้นฟูสมรรถภาพหัวใจ (Cardiac Rehabilitation)',
      nameEn: 'Cardiac Rehabilitation',
      descriptionTh: 'โปรแกรมออกกำลังกายและปรับพฤติกรรมที่มีการดูแลจากแพทย์ พิสูจน์แล้วว่าลดการเสียชีวิตและการกลับเข้าโรงพยาบาลได้ 25-30%',
      forStage: 'หลังหัวใจวายหรือ PCI/CABG',
    },
  ],

  prevention: [
    {
      actionTh: 'ควบคุมความดันโลหิต',
      descriptionTh: 'รักษาความดันให้ต่ำกว่า 130/80 mmHg ด้วยยาและการปรับพฤติกรรม ลดเกลือ < 5 กรัม/วัน',
      impact: 'high',
      evidence: 'Thai Hypertension Society / WHO 2023 Guidelines',
    },
    {
      actionTh: 'เลิกบุหรี่',
      descriptionTh: 'เลิกสูบบุหรี่ลดความเสี่ยงโรคหัวใจลงครึ่งหนึ่งภายใน 1 ปี และเกือบเทียบเท่าคนไม่สูบบุหรี่ภายใน 5 ปี',
      impact: 'high',
      evidence: 'WHO FCTC / Cochrane Systematic Review',
    },
    {
      actionTh: 'ออกกำลังกายสม่ำเสมอ',
      descriptionTh: 'ออกกำลังกายแบบแอโรบิคระดับปานกลาง 150 นาที/สัปดาห์ เดิน ว่ายน้ำ ขี่จักรยาน ลดความเสี่ยงโรคหัวใจได้ 35%',
      impact: 'high',
      evidence: 'AHA/ACC 2023 Physical Activity Guidelines',
    },
    {
      actionTh: 'รับประทานอาหารเพื่อสุขภาพหัวใจ',
      descriptionTh: 'อาหาร Mediterranean หรือ DASH — เพิ่มผัก ผลไม้ ธัญพืชไม่ขัดสี ปลา ลดเนื้อแดง ไขมันอิ่มตัว และน้ำตาล',
      impact: 'high',
      evidence: 'PREDIMED Trial / AHA Dietary Guidelines',
    },
    {
      actionTh: 'ควบคุมน้ำหนักและ BMI',
      descriptionTh: 'ลด BMI ให้อยู่ในเกณฑ์ปกติ (< 23 เกณฑ์เอเชีย) ลดไขมันหน้าท้อง รอบเอวชาย < 90 ซม. หญิง < 80 ซม.',
      impact: 'high',
      evidence: 'WHO/IASO Asian BMI Guidelines',
    },
    {
      actionTh: 'ตรวจสุขภาพประจำปี',
      descriptionTh: 'ตรวจความดัน ไขมัน น้ำตาล และประเมินความเสี่ยงโรคหัวใจทุกปีสำหรับผู้ที่มีปัจจัยเสี่ยง',
      impact: 'medium',
      evidence: 'กรมการแพทย์ สธ. — สิทธิ์ตรวจสุขภาพประจำปี',
    },
  ],

  whenToSeeDoctorTh: [
    'เจ็บแน่นหน้าอกรุนแรงนานกว่า 15-20 นาที ต้องโทร 1669 ทันที',
    'เจ็บหน้าอกร้าวไปแขนซ้าย คอ กราม หรือหลัง',
    'หายใจลำบากอย่างเฉียบพลันหรือรุนแรงขึ้น',
    'หมดสติ หรือรู้สึกจะหมดสติ โดยไม่มีสาเหตุ',
    'เจ็บหน้าอกขณะออกกำลังกายและหายเองเมื่อพัก (ต้องพบแพทย์ในวันนั้น)',
    'มีปัจจัยเสี่ยงสูงหลายอย่าง (เบาหวาน + ความดัน + สูบบุหรี่) และยังไม่เคยตรวจหัวใจ',
    'อายุ 45+ (ชาย) หรือ 55+ (หญิง) ที่ยังไม่เคยประเมินความเสี่ยงโรคหัวใจ',
  ],

  faqsTh: [
    {
      questionTh: 'ต่างกับโรคหัวใจล้มเหลว (Heart Failure) อย่างไร?',
      answerTh: 'โรคหัวใจขาดเลือด (Coronary Heart Disease) คือหลอดเลือดตีบทำให้กล้ามเนื้อหัวใจขาดเลือด ส่วนโรคหัวใจล้มเหลว (Heart Failure) คือหัวใจสูบฉีดเลือดได้ไม่เพียงพอ ซึ่งมักเป็นผลจากโรคหัวใจขาดเลือดที่รักษาไม่ทันหรือเรื้อรัง',
    },
    {
      questionTh: 'หากเจ็บหน้าอกควรทำอย่างไร?',
      answerTh: 'ถ้าเจ็บรุนแรงนานกว่า 15 นาทีหรือร้าวไปแขน/คอ/กราม ให้โทร 1669 ทันที อย่าขับรถเอง ถ้ามี Aspirin อยู่ (และไม่แพ้) ให้เคี้ยว 300 mg ขณะรอรถพยาบาล',
    },
    {
      questionTh: 'ทำ Stent แล้วหายขาดไหม?',
      answerTh: 'Stent ช่วยเปิดหลอดเลือดที่ตีบ แต่ไม่ได้รักษาสาเหตุของ Atherosclerosis ผู้ป่วยยังต้องกินยาต่อเนื่อง ปรับพฤติกรรม และตรวจติดตามเป็นประจำ เพื่อป้องกันการตีบซ้ำ',
    },
    {
      questionTh: 'อายุเท่าไหร่ถึงควรตรวจหัวใจ?',
      answerTh: 'แนะนำให้ผู้ชายอายุ 35+ และผู้หญิงอายุ 45+ ตรวจประเมินความเสี่ยงโรคหัวใจทุกปี ถ้ามีปัจจัยเสี่ยงอื่นๆ เช่น เบาหวาน ความดันสูง หรือประวัติครอบครัว ควรเริ่มตรวจตั้งแต่อายุน้อยกว่านั้น',
    },
    {
      questionTh: 'โรคหัวใจป้องกันได้จริงไหม?',
      answerTh: 'ได้ครับ/ค่ะ งานวิจัยแสดงว่า 80% ของโรคหัวใจขาดเลือดป้องกันได้ด้วยการควบคุมปัจจัยเสี่ยงที่แก้ไขได้ เช่น ความดัน ไขมัน น้ำตาล เลิกบุหรี่ ออกกำลังกาย และควบคุมน้ำหนัก',
    },
  ],

  references: [
    {
      id: 'thai_heart_guideline',
      titleEn: 'Clinical Practice Guidelines for Management of Ischemic Heart Disease in Thailand',
      titleTh: 'แนวทางเวชปฏิบัติการดูแลผู้ป่วยโรคหัวใจขาดเลือด',
      organization: 'สมาคมแพทย์โรคหัวใจแห่งประเทศไทย',
      year: 2023,
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'moph_ncd_thailand',
      titleEn: 'Non-Communicable Diseases Report Thailand',
      titleTh: 'รายงานสถานการณ์โรคไม่ติดต่อเรื้อรัง ประเทศไทย',
      organization: 'กรมการแพทย์ กระทรวงสาธารณสุข',
      year: 2022,
      type: 'cohort',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'acc_aha_2023',
      titleEn: 'AHA/ACC/ACCP/ASPC/NLA/PCNA Guideline for the Management of Patients With Chronic Coronary Disease',
      organization: 'American College of Cardiology / American Heart Association',
      year: 2023,
      url: 'https://www.ahajournals.org',
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
  ],

  relatedDiseases: ['hypertension', 'type-2-diabetes', 'stroke'],
  keywords: ['โรคหัวใจ', 'หัวใจวาย', 'Coronary Heart Disease', 'IHD', 'กล้ามเนื้อหัวใจขาดเลือด', 'Myocardial Infarction', 'Angina', 'Stent', 'บายพาส', 'เจ็บหน้าอก'],
}

export default heartDisease
