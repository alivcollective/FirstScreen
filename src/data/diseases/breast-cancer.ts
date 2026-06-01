// มะเร็งเต้านม (Breast Cancer) — Rich Disease Data
// SAFETY: ข้อมูลเพื่อการศึกษาเท่านั้น ต้องตรวจสอบโดยแพทย์ก่อนเผยแพร่

import type { RichDisease } from '@/types/disease'

const breastCancer: RichDisease = {
  slug: 'breast-cancer',
  nameTh: 'มะเร็งเต้านม (Breast Cancer)',
  nameTh_short: 'มะเร็งเต้านม',
  nameEn: 'Breast Cancer',
  category: 'cancer',
  categoryTh: 'มะเร็งวิทยา',
  icd10: 'C50',
  riskLevel: 'high',
  lastReviewed: '2026-06',
  reviewedBy: 'รอการรับรองจากศัลยแพทย์มะเร็ง',
  shortDescriptionTh: 'มะเร็งที่พบบ่อยที่สุดในผู้หญิงไทย ตรวจพบตั้งแต่เนิ่นๆ อัตราการรอดชีวิต 5 ปีสูงถึง 98%',

  stats: {
    prevalenceThailand: '~26,000 ราย/ปี',
    prevalenceThai: 'มะเร็งอันดับ 1 ในผู้หญิงไทย',
    primaryRiskGroupTh: 'ผู้หญิงอายุ 40 ปีขึ้นไป',
    survivalRate: 'ระยะที่ 1: ~98% · ระยะที่ 4: ~28%',
    newCasesPerYearTh: 'ประมาณ 26,000 รายต่อปีในประเทศไทย',
    mortalityRankTh: 'สาเหตุการเสียชีวิตจากมะเร็งอันดับ 1 ในผู้หญิงไทย',
  },

  overviewTh: `มะเร็งเต้านมเป็นมะเร็งที่พบบ่อยที่สุดในผู้หญิงทั่วโลกและในประเทศไทย โดยเกิดจากการเจริญเติบโตผิดปกติของเซลล์ในเนื้อเต้านมหรือท่อน้ำนม มะเร็งเต้านมส่วนใหญ่เริ่มต้นในท่อน้ำนม (Ductal Carcinoma) หรือกลีบน้ำนม (Lobular Carcinoma) และอาจลุกลามไปยังต่อมน้ำเหลือง อวัยวะอื่น หรือกระดูก

หัวใจสำคัญของการต่อสู้กับมะเร็งเต้านมคือ "การตรวจพบตั้งแต่เนิ่นๆ" เมื่อพบในระยะที่ 1 อัตราการรอดชีวิต 5 ปีสูงถึง 98% เปรียบเทียบกับระยะที่ 4 ที่เหลือเพียง 28% ดังนั้นการตรวจ Mammogram และการตรวจเต้านมด้วยตนเองเป็นประจำจึงสำคัญมากสำหรับผู้หญิงทุกคน

ปัจจุบันมีความก้าวหน้าในการรักษามะเร็งเต้านมอย่างมาก ทั้ง Targeted Therapy, Immunotherapy, และ Hormone Therapy ทำให้ผู้ป่วยระยะที่ 2-3 จำนวนมากสามารถรักษาหายขาดได้ การเข้าถึงการรักษาตั้งแต่เนิ่นๆ จึงเป็นปัจจัยสำคัญที่สุด`,

  symptoms: [
    {
      id: 'lump_breast',
      nameTh: 'คลำพบก้อนที่เต้านม',
      nameEn: 'Breast lump',
      severity: 'red_flag',
      descriptionTh: 'ก้อนแข็งหรือแข็ง-นิ่มปนกัน มักไม่เจ็บ ขอบไม่เรียบ เป็นอาการที่พบบ่อยที่สุดและต้องพบแพทย์ทันที',
      frequencyNote: 'พบใน 60-80% ของผู้ป่วยในระยะแรก',
    },
    {
      id: 'lump_armpit',
      nameTh: 'ก้อนที่รักแร้',
      nameEn: 'Armpit lump',
      severity: 'red_flag',
      descriptionTh: 'ต่อมน้ำเหลืองที่รักแร้โต อาจหมายถึงมะเร็งลุกลามไปต่อมน้ำเหลืองแล้ว',
      frequencyNote: 'มักพบร่วมกับก้อนที่เต้านม',
    },
    {
      id: 'skin_change',
      nameTh: 'ผิวเต้านมเปลี่ยนแปลง',
      nameEn: 'Skin changes',
      severity: 'severe',
      descriptionTh: 'ผิวย่น หนาตัว แดง เหมือนเปลือกส้ม (Peau d\'orange) หรือมีแผล',
      frequencyNote: 'พบในมะเร็งระยะที่ลุกลาม',
    },
    {
      id: 'nipple_change',
      nameTh: 'หัวนมบุ๋มหรือเปลี่ยนแปลง',
      nameEn: 'Nipple inversion or discharge',
      severity: 'severe',
      descriptionTh: 'หัวนมบุ๋มเข้าใหม่ๆ มีของเหลวผิดปกติออกจากหัวนม (โดยเฉพาะถ้ามีเลือดปน)',
    },
    {
      id: 'breast_size',
      nameTh: 'ขนาดหรือรูปร่างเต้านมเปลี่ยน',
      nameEn: 'Change in breast size or shape',
      severity: 'moderate',
      descriptionTh: 'เต้านมสองข้างไม่สมมาตรอย่างชัดเจน หรือมีการเปลี่ยนแปลงอย่างเห็นได้ชัด',
    },
    {
      id: 'breast_pain',
      nameTh: 'ปวดเต้านม',
      nameEn: 'Breast pain',
      severity: 'mild',
      descriptionTh: 'ปวดต่อเนื่องหรือเจ็บเฉพาะจุด ส่วนใหญ่ปวดเต้านมไม่ใช่อาการของมะเร็ง แต่ควรตรวจสอบถ้าปวดผิดปกติ',
      frequencyNote: 'อาการปวดเต้านมส่วนใหญ่ไม่ใช่มะเร็ง',
    },
  ],

  redFlagsTh: [
    'คลำพบก้อนในเต้านมหรือรักแร้ ไม่ว่าจะเจ็บหรือไม่',
    'หัวนมบุ๋มเข้าอย่างฉับพลัน',
    'มีของเหลวสีเลือดออกจากหัวนม',
    'ผิวเต้านมแดง บวม ร้อน คล้ายกับผิวส้ม',
    'แผลที่ผิวเต้านมที่ไม่ยอมหาย',
  ],

  causesTh: [
    'การกลายพันธุ์ของ DNA ในเซลล์เต้านมทำให้เซลล์เติบโตและแบ่งตัวผิดปกติ',
    'การกลายพันธุ์ของยีน BRCA1 และ BRCA2 (สืบทอดทางพันธุกรรม) เพิ่มความเสี่ยงอย่างมีนัยสำคัญ',
    'ฮอร์โมนเอสโตรเจนส่งเสริมการเติบโตของเซลล์มะเร็งบางชนิด',
    'การสัมผัสรังสีในปริมาณสูง',
    'การดื่มแอลกอฮอล์มากเป็นเวลานานเพิ่มระดับฮอร์โมนในเลือด',
  ],

  riskFactors: [
    { nameTh: 'เพศหญิง', type: 'non_modifiable', descriptionTh: 'ผู้หญิงมีความเสี่ยงสูงกว่าผู้ชายประมาณ 100 เท่า แม้ผู้ชายก็เป็นได้' },
    { nameTh: 'อายุ (40 ปีขึ้นไป)', type: 'non_modifiable', descriptionTh: 'ความเสี่ยงเพิ่มขึ้นตามอายุ 2 ใน 3 ของผู้ป่วยอายุมากกว่า 55 ปี', relativeRisk: 'ความเสี่ยงเพิ่มตามอายุ' },
    { nameTh: 'ประวัติครอบครัว (แม่/พี่น้อง)', type: 'non_modifiable', descriptionTh: 'ถ้าแม่หรือพี่น้องเป็นมะเร็งเต้านม ความเสี่ยงเพิ่ม 2-3 เท่า', relativeRisk: 'เพิ่ม 2-3 เท่า' },
    { nameTh: 'ยีน BRCA1/BRCA2 ผิดปกติ', type: 'non_modifiable', descriptionTh: 'ความเสี่ยงตลอดชีวิต 45-72% เทียบกับประชากรทั่วไป 12%', relativeRisk: 'ความเสี่ยง 45-72%' },
    { nameTh: 'เต้านมหนาแน่น (Dense Breast)', type: 'non_modifiable', descriptionTh: 'เนื้อเต้านมที่หนาแน่นมากทั้งเพิ่มความเสี่ยงและทำให้ตรวจพบยากขึ้น' },
    { nameTh: 'ดื่มแอลกอฮอล์', type: 'modifiable', descriptionTh: 'แอลกอฮอล์ 1-2 แก้ว/วัน เพิ่มความเสี่ยง 7-10% แม้ดื่มน้อย', relativeRisk: 'เพิ่ม 7-10% ต่อ 1 drink/วัน' },
    { nameTh: 'น้ำหนักเกินหลังหมดประจำเดือน', type: 'modifiable', descriptionTh: 'ไขมันสะสมผลิตเอสโตรเจนซึ่งกระตุ้นเซลล์มะเร็ง', relativeRisk: 'เพิ่ม 20-40%' },
    { nameTh: 'ไม่ออกกำลังกาย', type: 'modifiable', descriptionTh: 'ออกกำลังกายสม่ำเสมอลดความเสี่ยงได้ 10-20%' },
    { nameTh: 'การบำบัดด้วยฮอร์โมนหลังหมดประจำเดือน', type: 'modifiable', descriptionTh: 'HRT ชนิด Combined (Estrogen + Progesterone) เพิ่มความเสี่ยงเล็กน้อย', relativeRisk: 'เพิ่ม ~24%' },
    { nameTh: 'ไม่เคยตั้งครรภ์หรือมีบุตรครั้งแรกหลัง 30 ปี', type: 'partially_modifiable', descriptionTh: 'การมีลูกช้าหรือไม่มีลูกเพิ่มการสัมผัสฮอร์โมนตลอดชีวิต' },
    { nameTh: 'ไม่เคยให้นมบุตร', type: 'partially_modifiable', descriptionTh: 'การให้นมบุตรลดความเสี่ยงได้ 4.3% ต่อ 12 เดือนที่ให้นม' },
  ],

  screening: [
    {
      id: 'mammogram',
      nameTh: 'Mammogram (เอกซเรย์เต้านม)',
      nameEn: 'Mammogram',
      ageRange: '40-74 ปี (หรือเร็วกว่าถ้ามีปัจจัยเสี่ยง)',
      sex: 'female',
      frequency: 'ทุก 1-2 ปี',
      descriptionTh: 'การตรวจมาตรฐานที่แนะนำ ใช้รังสีเอกซ์ปริมาณน้อยตรวจหาก้อนหรือความผิดปกติก่อนคลำได้',
      isNHSOCovered: false,
      guidelineSource: 'สมาคมโรคมะเร็งแห่งประเทศไทย / ACS Guidelines',
    },
    {
      id: 'breast_ultrasound',
      nameTh: 'อัลตราซาวด์เต้านม',
      nameEn: 'Breast Ultrasound',
      ageRange: 'ทุกอายุ เมื่อมีข้อบ่งชี้',
      sex: 'female',
      frequency: 'ตามการส่งตรวจของแพทย์',
      descriptionTh: 'เหมาะสำหรับผู้ที่มีเต้านมหนาแน่นหรือเป็นผู้ป่วยอายุน้อย ใช้ร่วมกับ Mammogram',
      isNHSOCovered: false,
      guidelineSource: 'NCCN Guidelines',
    },
    {
      id: 'bse',
      nameTh: 'ตรวจเต้านมด้วยตนเอง (BSE)',
      nameEn: 'Breast Self-Examination',
      ageRange: 'ตั้งแต่อายุ 20 ปี',
      sex: 'female',
      frequency: 'ทุกเดือน (7-10 วันหลังประจำเดือน)',
      descriptionTh: 'ตรวจสอบการเปลี่ยนแปลงของเต้านมด้วยตนเองทุกเดือน ไม่แทนที่ Mammogram แต่ช่วยให้รู้จักเต้านมปกติของตัวเอง',
      isNHSOCovered: true,
      guidelineSource: 'กรมการแพทย์ สธ.',
    },
    {
      id: 'mri',
      nameTh: 'MRI เต้านม',
      nameEn: 'Breast MRI',
      ageRange: '25-65 ปี สำหรับกลุ่มเสี่ยงสูงมาก',
      sex: 'female',
      frequency: 'ทุกปี (กลุ่มเสี่ยงสูงมาก)',
      descriptionTh: 'แนะนำสำหรับผู้ที่มียีน BRCA หรือประวัติครอบครัวที่รุนแรง MRI มีความไวสูงกว่า Mammogram',
      isNHSOCovered: false,
      guidelineSource: 'NCCN High-Risk Guidelines',
    },
  ],

  treatments: [
    {
      categoryTh: 'การผ่าตัด',
      nameTh: 'การผ่าตัดเต้านม',
      nameEn: 'Surgery',
      descriptionTh: 'ทั้งแบบตัดก้อน (Lumpectomy) และตัดเต้านมทั้งข้าง (Mastectomy) ขึ้นอยู่กับขนาดและตำแหน่งก้อน แนวโน้มปัจจุบันเน้นรักษาเต้านมไว้ถ้าเป็นไปได้',
      forStage: 'ระยะ I-III',
      sideEffectsTh: ['บวมที่แขน (Lymphedema)', 'เจ็บแผล', 'อาจต้องผ่าตัดเสริมแต่ง'],
    },
    {
      categoryTh: 'รังสีรักษา',
      nameTh: 'รังสีรักษา (Radiation Therapy)',
      nameEn: 'Radiation Therapy',
      descriptionTh: 'มักใช้หลังผ่าตัดเพื่อฆ่าเซลล์มะเร็งที่อาจเหลือ ลดโอกาสมะเร็งกลับ',
      forStage: 'ระยะ I-III หลังผ่าตัด',
      sideEffectsTh: ['ผิวแดง', 'เหนื่อยล้า', 'บวมเล็กน้อย'],
    },
    {
      categoryTh: 'เคมีบำบัด',
      nameTh: 'เคมีบำบัด (Chemotherapy)',
      nameEn: 'Chemotherapy',
      descriptionTh: 'ใช้ยาฆ่าเซลล์มะเร็ง อาจใช้ก่อนผ่าตัด (Neoadjuvant) เพื่อย่อขนาดก้อน หรือหลังผ่าตัด (Adjuvant) เพื่อป้องกันการกลับมา',
      sideEffectsTh: ['คลื่นไส้อาเจียน', 'ผมร่วง', 'ภูมิคุ้มกันต่ำ', 'เหนื่อยล้า'],
    },
    {
      categoryTh: 'ฮอร์โมนบำบัด',
      nameTh: 'ฮอร์โมนบำบัด (Hormone Therapy)',
      nameEn: 'Hormone Therapy',
      descriptionTh: 'สำหรับมะเร็งที่มี Hormone Receptor Positive (HR+) ซึ่งพบ ~70% ยาเช่น Tamoxifen หรือ Aromatase Inhibitors กิน 5-10 ปี',
      forStage: 'HR+ ทุกระยะ',
      sideEffectsTh: ['หมดประจำเดือนก่อนกำหนด', 'ร้อนวูบวาบ', 'ปวดข้อ'],
    },
    {
      categoryTh: 'Targeted Therapy',
      nameTh: 'ยามุ่งเป้า (Targeted Therapy)',
      nameEn: 'Targeted Therapy',
      descriptionTh: 'ยาสำหรับ HER2-Positive breast cancer เช่น Trastuzumab (Herceptin) และ Pertuzumab เพิ่มประสิทธิภาพการรักษาอย่างมีนัยสำคัญ',
      forStage: 'HER2+ ทุกระยะ',
    },
    {
      categoryTh: 'Immunotherapy',
      nameTh: 'ภูมิคุ้มกันบำบัด (Immunotherapy)',
      nameEn: 'Immunotherapy',
      descriptionTh: 'ใช้สำหรับ Triple Negative Breast Cancer (TNBC) ซึ่งรักษายากที่สุด Pembrolizumab ได้รับการอนุมัติในหลายประเทศ',
      forStage: 'TNBC ระยะ II-III',
    },
  ],

  prevention: [
    { actionTh: 'ตรวจ Mammogram สม่ำเสมอ', descriptionTh: 'ทุก 1-2 ปีสำหรับผู้หญิงอายุ 40+ ตรวจพบตั้งแต่เนิ่นๆ ช่วยชีวิตได้', impact: 'high', evidence: 'ACS/NCCN Guidelines Grade A' },
    { actionTh: 'ตรวจเต้านมด้วยตนเองทุกเดือน', descriptionTh: 'รู้จักเต้านมปกติของตัวเอง จะสังเกตความเปลี่ยนแปลงได้ง่ายขึ้น', impact: 'medium', evidence: 'กรมการแพทย์ สธ.' },
    { actionTh: 'ลดหรืองดแอลกอฮอล์', descriptionTh: 'ไม่ดื่มเลยดีที่สุด แต่ถ้าดื่มไม่เกิน 1 หน่วย/วัน', impact: 'high', evidence: 'WCRF/AICR Cancer Prevention Recommendations' },
    { actionTh: 'ออกกำลังกายสม่ำเสมอ', descriptionTh: 'ออกกำลังกายระดับปานกลาง 150-300 นาที/สัปดาห์ ลดความเสี่ยงได้ 10-20%', impact: 'high', evidence: 'WCRF/AICR Grade Convincing Evidence' },
    { actionTh: 'ควบคุมน้ำหนัก', descriptionTh: 'BMI ปกติ (< 23 เกณฑ์เอเชีย) ลดระดับเอสโตรเจนในร่างกาย', impact: 'high', evidence: 'WCRF/AICR Systematic Review' },
    { actionTh: 'ให้นมบุตรถ้าเป็นไปได้', descriptionTh: 'ให้นม 12 เดือนขึ้นไปลดความเสี่ยงได้อย่างมีนัยสำคัญ', impact: 'medium', evidence: 'Lancet Systematic Review 2002' },
    { actionTh: 'ปรึกษาแพทย์เรื่อง Genetic Testing', descriptionTh: 'ถ้ามีประวัติครอบครัวสูง ควรตรวจยีน BRCA เพื่อวางแผนการป้องกัน', impact: 'high', evidence: 'NCCN Genetic Testing Guidelines' },
  ],

  whenToSeeDoctorTh: [
    'คลำพบก้อนหรือความแข็งผิดปกติในเต้านมหรือรักแร้',
    'หัวนมบุ๋มเข้าอย่างฉับพลัน หรือมีของเหลวออกจากหัวนม (โดยเฉพาะถ้าเป็นเลือด)',
    'ผิวเต้านมเปลี่ยนแปลง เช่น แดง บวม ร้อน หรือเหมือนเปลือกส้ม',
    'เต้านมสองข้างไม่สมมาตรอย่างชัดเจนและเร็ว',
    'ปวดเต้านมที่ผิดปกติหรือต่อเนื่อง (แม้ปวดเต้านมส่วนใหญ่ไม่ใช่มะเร็ง)',
    'อายุ 40 ปีขึ้นไปและยังไม่เคยทำ Mammogram',
    'มีประวัติครอบครัวเป็นมะเร็งเต้านมหรือมะเร็งรังไข่',
  ],

  faqsTh: [
    {
      questionTh: 'ถ้าไม่มีก้อน แสดงว่าไม่เป็นมะเร็งเต้านมใช่ไหม?',
      answerTh: 'ไม่ใช่เสมอไป มะเร็งเต้านมบางชนิด เช่น Inflammatory Breast Cancer ไม่มีก้อนชัดเจน แต่ทำให้เต้านมแดง บวม ร้อน ดังนั้นแม้ไม่มีก้อนแต่มีความเปลี่ยนแปลงผิดปกติก็ต้องพบแพทย์',
    },
    {
      questionTh: 'Mammogram เจ็บไหม? อันตรายไหม?',
      answerTh: 'อาจรู้สึกไม่สบายขณะกดเต้านมเพื่อถ่ายภาพ แต่ส่วนใหญ่ทนได้ ปริมาณรังสีน้อยมาก ไม่เป็นอันตราย ประโยชน์ที่ได้รับสูงกว่าความเสี่ยงมาก',
    },
    {
      questionTh: 'ผ่าตัดเสร็จแล้วมะเร็งจะกลับมาอีกไหม?',
      answerTh: 'มะเร็งกลับซ้ำได้เสมอ แต่ยิ่งพบในระยะเนิ่นและรักษาครบถ้วน โอกาสกลับมายิ่งน้อย การติดตามผลหลังรักษา (ตรวจ Mammogram ทุกปี พบแพทย์สม่ำเสมอ) จึงสำคัญมาก',
    },
    {
      questionTh: 'ผู้ชายเป็นมะเร็งเต้านมได้ไหม?',
      answerTh: 'ได้ แต่พบน้อยมาก ประมาณ 1% ของมะเร็งเต้านมทั้งหมด อาการหลักคือก้อนที่บริเวณเต้านม ผู้ชายที่มีประวัติครอบครัวหรือยีน BRCA ควรแจ้งแพทย์',
    },
  ],

  references: [
    { id: 'nccn_breast', titleEn: 'NCCN Clinical Practice Guidelines in Oncology — Breast Cancer', organization: 'National Comprehensive Cancer Network', year: 2024, url: 'https://www.nccn.org', type: 'guideline', isVerified: false, pendingNote: 'ต้องตรวจสอบ version ล่าสุดก่อนเผยแพร่' },
    { id: 'acs_breast', titleEn: 'Breast Cancer Facts & Figures 2023-2024', organization: 'American Cancer Society', year: 2023, url: 'https://www.cancer.org', type: 'guideline', isVerified: false, pendingNote: 'ต้องตรวจสอบก่อนเผยแพร่' },
    { id: 'thai_cancer', titleEn: 'Cancer in Thailand Vol.XI, 2019-2021', titleTh: 'มะเร็งในประเทศไทย', organization: 'สถาบันมะเร็งแห่งชาติ กระทรวงสาธารณสุข', year: 2023, type: 'cohort', isVerified: false, pendingNote: 'ต้องตรวจสอบข้อมูลล่าสุด' },
  ],

  relatedDiseases: ['cervical-cancer', 'colorectal-cancer', 'lung-cancer'],
  keywords: ['มะเร็งเต้านม', 'Breast Cancer', 'Mammogram', 'BRCA', 'เนื้องอกเต้านม', 'ตรวจเต้านม'],
}

export default breastCancer
