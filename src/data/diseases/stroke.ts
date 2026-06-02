// โรคหลอดเลือดสมอง (Stroke) — Rich Disease Data
// SAFETY: ข้อมูลเพื่อการศึกษาเท่านั้น ต้องตรวจสอบโดยแพทย์ก่อนเผยแพร่

import type { RichDisease } from '@/types/disease'

const stroke: RichDisease = {
  slug: 'stroke',
  nameTh: 'โรคหลอดเลือดสมอง (Stroke)',
  nameTh_short: 'โรคหลอดเลือดสมอง',
  nameEn: 'Stroke',
  category: 'heart',
  categoryTh: 'หัวใจและหลอดเลือด',
  icd10: 'I63',
  riskLevel: 'very_high',
  lastReviewed: '2026-06',
  reviewedBy: 'รอการรับรองจากแพทย์ผู้เชี่ยวชาญ',
  shortDescriptionTh: 'สาเหตุความพิการอันดับ 1 ในไทย — รักษาภายใน 4.5 ชั่วโมงช่วยลดความพิการได้อย่างมาก',

  stats: {
    prevalenceThailand: '~300,000 รายต่อปี',
    prevalenceThai: 'สาเหตุการเสียชีวิตและความพิการถาวรอันดับ 1 ของไทย — คนไทยเป็นโรคนี้ทุก 2 นาที',
    primaryRiskGroupTh: 'ผู้ใหญ่อายุ 55+ ที่มีความดันโลหิตสูง เบาหวาน หรือหัวใจเต้นผิดจังหวะ',
    survivalRate: 'รอดชีวิต ~75% แต่มีความพิการถาวรในผู้รอดชีวิต ~50%',
    mortalityRankTh: 'สาเหตุการเสียชีวิตอันดับ 2 และความพิการอันดับ 1 ของไทย',
    newCasesPerYearTh: 'ประมาณ 300,000 รายต่อปีในประเทศไทย',
  },

  overviewTh: `โรคหลอดเลือดสมอง (Stroke) เกิดขึ้นเมื่อเลือดไม่สามารถไหลเลี้ยงสมองได้ตามปกติ ทำให้เซลล์สมองขาดออกซิเจนและเริ่มตายภายในนาทีที่ไม่ได้รับเลือด Stroke แบ่งออกเป็น 2 ชนิดหลัก คือ Ischemic Stroke (80%) ที่เกิดจากหลอดเลือดอุดตัน และ Hemorrhagic Stroke (20%) ที่เกิดจากหลอดเลือดแตก

ในประเทศไทย โรคหลอดเลือดสมองเป็นสาเหตุความพิการถาวรอันดับ 1 และสาเหตุการเสียชีวิตอันดับ 2 ข้อมูลจากกรมการแพทย์ระบุว่ามีผู้ป่วยใหม่ราว 300,000 รายต่อปี หรือทุก 2 นาทีจะมีคนไทยเป็นโรคนี้ 1 คน ผู้รอดชีวิตจำนวนมากมีความพิการด้านการเคลื่อนไหว การพูด หรือความคิด ซึ่งต้องการการดูแลระยะยาว

หลักการสำคัญที่สุดในการรักษา Stroke คือ "เวลาคือสมอง" (Time is Brain) เซลล์สมองตายเพิ่มขึ้น 1.9 ล้านเซลล์ต่อนาทีระหว่างที่ขาดเลือด ยา tPA ที่ใช้ละลายลิ่มเลือดต้องให้ภายใน 4.5 ชั่วโมง การรู้จักอาการและโทรแจ้งฉุกเฉิน 1669 ทันทีจึงเป็นสิ่งที่อาจช่วยชีวิตและป้องกันความพิการได้`,

  symptoms: [
    {
      id: 'face_drooping',
      nameTh: 'ใบหน้าเบี้ยว / ปากเบี้ยว',
      nameEn: 'Facial drooping',
      severity: 'red_flag',
      descriptionTh: 'มุมปากตกข้างหนึ่ง ยิ้มแล้วปากเบี้ยว หรือใบหน้าชาครึ่งซีก เป็นอาการคลาสสิกของ Stroke — ตาม FAST test ตัว F (Face)',
      frequencyNote: 'พบใน 60-70% ของผู้ป่วย Ischemic Stroke',
    },
    {
      id: 'arm_weakness',
      nameTh: 'แขนหรือขาอ่อนแรงข้างเดียว',
      nameEn: 'Arm or leg weakness on one side',
      severity: 'red_flag',
      descriptionTh: 'แขนหรือขาข้างหนึ่งอ่อนแรงทันทีทันใด ยกแขนสองข้างขึ้นพร้อมกันแล้วข้างหนึ่งตกลงมา — ตาม FAST test ตัว A (Arms)',
      frequencyNote: 'พบใน 70-80% ของผู้ป่วย Stroke',
    },
    {
      id: 'speech_difficulty',
      nameTh: 'พูดไม่ชัด / พูดไม่ออก / พูดงงเวียน',
      nameEn: 'Speech difficulty',
      severity: 'red_flag',
      descriptionTh: 'พูดไม่ออก พูดสับสน พูดคำไม่ครบ หรือพูดแล้วคนอื่นไม่เข้าใจ บางรายเข้าใจที่คนอื่นพูดแต่ตอบไม่ได้ — ตาม FAST test ตัว S (Speech)',
      frequencyNote: 'พบใน 40-50% ของผู้ป่วย Stroke',
    },
    {
      id: 'sudden_severe_headache',
      nameTh: 'ปวดศีรษะรุนแรงเฉียบพลัน',
      nameEn: 'Sudden severe headache',
      severity: 'red_flag',
      descriptionTh: '"ปวดหัวรุนแรงที่สุดในชีวิต" ที่เกิดขึ้นทันที โดยไม่มีสาเหตุ — เป็นอาการเตือนสำคัญของ Hemorrhagic Stroke หรือ Subarachnoid Hemorrhage',
      frequencyNote: 'พบบ่อยในชนิด Hemorrhagic Stroke',
    },
    {
      id: 'vision_loss',
      nameTh: 'ตามัวหรือสูญเสียการมองเห็นทันที',
      nameEn: 'Sudden vision loss',
      severity: 'red_flag',
      descriptionTh: 'มองเห็นไม่ชัดทั้งสองตาหรือตาข้างหนึ่ง ลานสายตาแคบลง หรือเห็นภาพซ้อน เกิดขึ้นอย่างเฉียบพลัน',
      frequencyNote: 'พบใน 10-20% ของผู้ป่วย Stroke',
    },
    {
      id: 'loss_of_balance',
      nameTh: 'เสียการทรงตัว เดินเซ',
      nameEn: 'Loss of balance or coordination',
      severity: 'severe',
      descriptionTh: 'รู้สึกมึนงง เดินเซ เสียการทรงตัวทันที ไม่สามารถประสานการเคลื่อนไหวได้ปกติ มักเกี่ยวข้องกับ Stroke ที่ก้านสมองหรือซีรีเบลลัม',
      frequencyNote: 'พบบ่อยใน Posterior Circulation Stroke',
    },
    {
      id: 'confusion',
      nameTh: 'สับสน ไม่รู้เวลา-สถานที่ ทันทีทันใด',
      nameEn: 'Sudden confusion or disorientation',
      severity: 'severe',
      descriptionTh: 'สับสนทันที ไม่รู้ว่าอยู่ที่ไหน วันอะไร ไม่รู้จักคนใกล้ชิด หรือตอบสนองไม่ปกติ',
      frequencyNote: 'พบในผู้สูงอายุที่เป็น Stroke บ่อย',
    },
  ],

  redFlagsTh: [
    'F-A-S-T: ใบหน้าเบี้ยว แขนอ่อนแรง พูดไม่ชัด — โทร 1669 ทันที',
    'ปวดหัวรุนแรงที่สุดในชีวิต เกิดขึ้นทันที',
    'ตามัวหรือสูญเสียการมองเห็นอย่างเฉียบพลัน',
    'หมดสติหรือเป็นลมโดยไม่มีสาเหตุ',
    'เดินเซล้มหรือเสียการทรงตัวทันที',
    'ชาครึ่งซีกของร่างกายโดยเฉียบพลัน',
  ],

  causesTh: [
    'Ischemic Stroke (80%): ลิ่มเลือดอุดหลอดเลือดสมอง มักมาจากหัวใจ (Cardioembolic) หรือ Atherosclerosis ของหลอดเลือดใหญ่',
    'Hemorrhagic Stroke (20%): หลอดเลือดสมองแตก มักจากความดันโลหิตสูงรุนแรง หรือหลอดเลือดโป่ง (Aneurysm)',
    'Transient Ischemic Attack (TIA): สัญญาณเตือนที่หายเองใน 24 ชั่วโมง แต่มีความเสี่ยง Stroke จริงสูงใน 90 วันถัดมา',
    'ภาวะหัวใจเต้นผิดจังหวะ (Atrial Fibrillation) ทำให้เกิดลิ่มเลือดในหัวใจและหลุดไปอุดหลอดเลือดสมอง',
    'ความดันโลหิตสูงที่ไม่ได้รับการรักษา — เป็นสาเหตุหลักของทั้ง Ischemic และ Hemorrhagic Stroke',
  ],

  riskFactors: [
    {
      nameTh: 'ความดันโลหิตสูง',
      nameEn: 'Hypertension',
      type: 'modifiable',
      descriptionTh: 'ปัจจัยเสี่ยงสูงสุดของ Stroke ทุกชนิด ความดัน ≥ 140/90 mmHg เพิ่มความเสี่ยง Stroke 3-4 เท่า',
      relativeRisk: 'เพิ่มความเสี่ยง 3-4 เท่า',
    },
    {
      nameTh: 'หัวใจเต้นผิดจังหวะ (AF)',
      nameEn: 'Atrial Fibrillation',
      type: 'modifiable',
      descriptionTh: 'AF ทำให้ลิ่มเลือดก่อตัวในหัวใจและหลุดไปอุดหลอดเลือดสมอง ยาต้านการแข็งตัวของเลือดลดความเสี่ยงได้ 65%',
      relativeRisk: 'เพิ่มความเสี่ยง 5 เท่า',
    },
    {
      nameTh: 'เบาหวาน',
      nameEn: 'Diabetes Mellitus',
      type: 'modifiable',
      descriptionTh: 'เบาหวานทำลายหลอดเลือดขนาดเล็กและใหญ่ในสมอง เพิ่มความเสี่ยง Stroke และทำให้ฟื้นตัวช้าลง',
      relativeRisk: 'เพิ่มความเสี่ยง 2-3 เท่า',
    },
    {
      nameTh: 'สูบบุหรี่',
      nameEn: 'Smoking',
      type: 'modifiable',
      descriptionTh: 'บุหรี่ทำให้หลอดเลือดแข็ง เพิ่มการแข็งตัวของเลือด และเร่ง Atherosclerosis เลิกสูบลดความเสี่ยงลงอย่างมีนัยสำคัญใน 2 ปี',
      relativeRisk: 'เพิ่มความเสี่ยง 2 เท่า',
    },
    {
      nameTh: 'ไขมันในเลือดสูง',
      nameEn: 'Hyperlipidemia',
      type: 'modifiable',
      descriptionTh: 'LDL สูงสะสมเป็นคราบพลัคในหลอดเลือดสมอง ยา Statin ลดความเสี่ยง Stroke ได้ 20-30%',
      relativeRisk: 'เพิ่มความเสี่ยง 25-35%',
    },
    {
      nameTh: 'ดื่มแอลกอฮอล์มาก',
      nameEn: 'Heavy alcohol consumption',
      type: 'modifiable',
      descriptionTh: 'แอลกอฮอล์ปริมาณมาก (> 2 drinks/วัน) เพิ่มความเสี่ยง Hemorrhagic Stroke อย่างมีนัยสำคัญ',
      relativeRisk: 'เพิ่มความเสี่ยง 1.5-2 เท่า',
    },
    {
      nameTh: 'อายุมาก (55 ปีขึ้นไป)',
      nameEn: 'Age (55+)',
      type: 'non_modifiable',
      descriptionTh: 'ความเสี่ยง Stroke เพิ่มเป็นสองเท่าทุก 10 ปีหลังอายุ 55 ปี แต่ปัจจุบัน Stroke ในคนอายุน้อยก็พบมากขึ้น',
    },
    {
      nameTh: 'ประวัติ TIA หรือ Stroke มาก่อน',
      nameEn: 'Previous TIA or stroke',
      type: 'partially_modifiable',
      descriptionTh: 'ผู้ที่เคยเป็น TIA มีความเสี่ยง Stroke 10-15% ใน 3 เดือน โดยเฉพาะใน 48 ชั่วโมงแรก',
      relativeRisk: 'ความเสี่ยง 10-15% ใน 90 วัน',
    },
  ],

  screening: [
    {
      id: 'bp_monitoring',
      nameTh: 'วัดความดันโลหิตสม่ำเสมอ',
      nameEn: 'Regular Blood Pressure Monitoring',
      ageRange: '18 ปีขึ้นไป',
      sex: 'all',
      frequency: 'ทุกปี (ถ้าปกติ), ทุก 3-6 เดือน (ถ้าความดันสูง)',
      descriptionTh: 'ความดันโลหิตสูงคือปัจจัยเสี่ยงอันดับ 1 ของ Stroke — การวัดและควบคุมความดันเป็นมาตรการป้องกัน Stroke ที่ดีที่สุด',
      isNHSOCovered: true,
      guidelineSource: 'กรมการแพทย์ สธ. / Thai Stroke Society',
    },
    {
      id: 'ecg_af_screening',
      nameTh: 'ตรวจหัวใจเต้นผิดจังหวะ (ECG สำหรับ AF)',
      nameEn: 'ECG Screening for Atrial Fibrillation',
      ageRange: '65 ปีขึ้นไป',
      sex: 'all',
      frequency: 'ทุกปี',
      descriptionTh: 'AF มักไม่มีอาการแต่เพิ่มความเสี่ยง Stroke 5 เท่า การตรวจ ECG ช่วยวินิจฉัย AF และเริ่มยาต้านการแข็งตัวของเลือดเพื่อป้องกัน Stroke',
      isNHSOCovered: true,
      guidelineSource: 'ESC Guidelines for AF 2023 / Thai Stroke Society',
    },
    {
      id: 'carotid_ultrasound',
      nameTh: 'อัลตราซาวด์หลอดเลือดคาโรติด',
      nameEn: 'Carotid Artery Ultrasound',
      ageRange: '50 ปีขึ้นไป ที่มีปัจจัยเสี่ยงหลายอย่าง',
      sex: 'all',
      frequency: 'ตามดุลยพินิจแพทย์',
      descriptionTh: 'ตรวจหาการตีบของหลอดเลือดคาโรติดที่คอ ซึ่งเป็นแหล่งกำเนิดลิ่มเลือดอุดหลอดเลือดสมองที่พบบ่อย',
      isNHSOCovered: false,
      guidelineSource: 'USPSTF / แนวทางสมาคมประสาทวิทยาแห่งประเทศไทย',
    },
    {
      id: 'stroke_risk_score',
      nameTh: 'ประเมินคะแนนความเสี่ยง Stroke (SCORE2)',
      nameEn: 'Stroke / CVD Risk Score Assessment',
      ageRange: '40-75 ปี',
      sex: 'all',
      frequency: 'ทุก 1-3 ปี',
      descriptionTh: 'ประเมินความเสี่ยง Stroke ใน 10 ปี โดยรวมปัจจัย อายุ เพศ ความดัน ไขมัน เบาหวาน และการสูบบุหรี่ ใช้เพื่อตัดสินใจเริ่มยา Statin หรือ Antiplatelet',
      isNHSOCovered: true,
      guidelineSource: 'กรมการแพทย์ สธ. / ESC SCORE2 Guideline',
    },
  ],

  treatments: [
    {
      categoryTh: 'การรักษาเฉียบพลัน (ภายใน 4.5 ชั่วโมง)',
      nameTh: 'ยาละลายลิ่มเลือด IV tPA (Alteplase)',
      nameEn: 'Intravenous Thrombolysis (IV tPA)',
      descriptionTh: 'ยาที่ต้องให้ภายใน 4.5 ชั่วโมงหลังเริ่มอาการ ช่วยละลายลิ่มเลือดที่อุดหลอดเลือดสมอง ลดความพิการได้อย่างมีนัยสำคัญ',
      forStage: 'Ischemic Stroke ภายใน 4.5 ชั่วโมง',
      sideEffectsTh: ['เลือดออกในสมอง (2-6%)', 'แพ้ยา', 'ต้องติดตามในห้อง ICU'],
    },
    {
      categoryTh: 'การรักษาเฉียบพลัน (ภายใน 24 ชั่วโมง)',
      nameTh: 'การดึงลิ่มเลือดด้วยสายสวน (Mechanical Thrombectomy)',
      nameEn: 'Mechanical Thrombectomy',
      descriptionTh: 'สอดสายสวนเข้าหลอดเลือดสมองเพื่อดึงลิ่มเลือดออก เหมาะสำหรับหลอดเลือดสมองใหญ่อุดตัน สามารถทำได้ในบางกรณีถึง 24 ชั่วโมง',
      forStage: 'Large Vessel Occlusion ภายใน 24 ชั่วโมง',
      sideEffectsTh: ['ต้องอยู่ศูนย์โรคหลอดเลือดสมองเฉพาะทาง'],
    },
    {
      categoryTh: 'การฟื้นฟูสมรรถภาพ',
      nameTh: 'กายภาพบำบัดและการฟื้นฟูสมองหลัง Stroke',
      nameEn: 'Stroke Rehabilitation',
      descriptionTh: 'การฝึกกายภาพบำบัด กิจกรรมบำบัด และการฝึกพูด ควรเริ่มโดยเร็วที่สุดหลังอาการคงที่ สมองมีการเรียนรู้ซ่อมแซมได้ (Neuroplasticity)',
      forStage: 'หลังผ่านช่วงเฉียบพลัน',
    },
    {
      categoryTh: 'การป้องกันการกลับซ้ำ',
      nameTh: 'ยาต้านเกล็ดเลือดและต้านการแข็งตัว',
      nameEn: 'Antiplatelet & Anticoagulation Therapy',
      descriptionTh: 'Aspirin + Clopidogrel (ระยะสั้น) หรือ DOAC สำหรับผู้ป่วย AF ช่วยป้องกัน Stroke ซ้ำ — ต้องกินอย่างต่อเนื่องตามคำแนะนำแพทย์',
      forStage: 'ป้องกันการกลับซ้ำ',
      sideEffectsTh: ['เลือดออกง่าย', 'แผลหายช้า'],
    },
  ],

  prevention: [
    {
      actionTh: 'ควบคุมความดันโลหิตอย่างเคร่งครัด',
      descriptionTh: 'รักษาความดันให้ต่ำกว่า 130/80 mmHg ด้วยยาและการปรับพฤติกรรม ลด Stroke ได้ถึง 40%',
      impact: 'high',
      evidence: 'PROGRESS Trial / Thai Hypertension Society Guidelines',
    },
    {
      actionTh: 'รักษา AF ด้วยยาต้านการแข็งตัวของเลือด',
      descriptionTh: 'ผู้ป่วย AF ที่ได้รับยา Anticoagulant (DOAC หรือ Warfarin) ลดความเสี่ยง Stroke ได้ 65%',
      impact: 'high',
      evidence: 'ESC AF Guidelines 2023 / RE-LY Trial',
    },
    {
      actionTh: 'เลิกสูบบุหรี่',
      descriptionTh: 'เลิกสูบบุหรี่ลดความเสี่ยง Stroke ได้อย่างมีนัยสำคัญ ความเสี่ยงลดเกือบเทียบเท่าคนไม่สูบภายใน 5 ปี',
      impact: 'high',
      evidence: 'Cochrane Review on Smoking Cessation and Stroke',
    },
    {
      actionTh: 'ออกกำลังกายสม่ำเสมอ',
      descriptionTh: 'ออกกำลังกายระดับปานกลาง 150 นาที/สัปดาห์ ลดความเสี่ยง Stroke 25-30%',
      impact: 'high',
      evidence: 'AHA/ASA Primary Prevention Guidelines 2024',
    },
    {
      actionTh: 'รับประทานอาหารเพื่อสุขภาพสมอง',
      descriptionTh: 'อาหาร Mediterranean ที่มีผัก ผลไม้ ปลา น้ำมันมะกอก และธัญพืชไม่ขัดสี ลดความเสี่ยง Stroke 20-30%',
      impact: 'medium',
      evidence: 'PREDIMED-PLUS Trial',
    },
    {
      actionTh: 'เรียนรู้สัญญาณ FAST',
      descriptionTh: 'F=Face, A=Arms, S=Speech, T=Time — รู้จักอาการและโทร 1669 ทันที ลดระยะเวลาถึงโรงพยาบาลและเพิ่มโอกาสรักษาหายได้',
      impact: 'high',
      evidence: 'กรมการแพทย์ สธ. — แคมเปญ FAST',
    },
  ],

  whenToSeeDoctorTh: [
    'ใบหน้าเบี้ยว แขนอ่อนแรงข้างเดียว หรือพูดไม่ชัดทันที — โทร 1669 ทันที อย่ารอดูอาการ',
    'ปวดหัวรุนแรงที่สุดในชีวิต เกิดขึ้นเฉียบพลัน',
    'ตามัว มองเห็นภาพซ้อน หรือสูญเสียการมองเห็นข้างหนึ่งทันที',
    'หมดสติหรือเกือบหมดสติโดยไม่มีสาเหตุ',
    'มีอาการของ TIA ที่หายเองภายใน 24 ชั่วโมง — ต้องพบแพทย์ฉุกเฉินด้านเดียวกันวันนั้น',
    'ผู้ที่มีความดันสูง AF หรือเบาหวาน และยังไม่ได้รับการประเมินความเสี่ยง Stroke',
  ],

  faqsTh: [
    {
      questionTh: 'TIA (Mini Stroke) อันตรายไหม?',
      answerTh: 'อันตรายมากครับ/ค่ะ TIA คืออาการที่หายเองใน 24 ชั่วโมง แต่เป็นสัญญาณเตือนว่ามีความเสี่ยง Stroke จริงสูงมาก โดยเฉพาะใน 48-72 ชั่วโมงแรก ต้องพบแพทย์ฉุกเฉินทันที ไม่ใช่รอดูอาการ',
    },
    {
      questionTh: 'หลังเป็น Stroke ฟื้นตัวได้แค่ไหน?',
      answerTh: 'ขึ้นอยู่กับความรุนแรงและตำแหน่งที่สมองเสียหาย สมองมีความสามารถซ่อมแซมตัวเองได้ (Neuroplasticity) การฟื้นฟูที่เข้มข้นและเร็ว โดยเฉพาะใน 6 เดือนแรก ให้ผลดีที่สุด ผู้ป่วยบางรายฟื้นตัวได้เกือบสมบูรณ์',
    },
    {
      questionTh: 'คนหนุ่มสาวเป็น Stroke ได้ไหม?',
      answerTh: 'ได้ครับ/ค่ะ Stroke ในคนอายุน้อยกว่า 45 ปีพบมากขึ้น สาเหตุมักเป็น AF, ความผิดปกติของหัวใจแต่กำเนิด, การใช้ยาบางชนิด, หรือ Migraine with Aura ควรตรวจหาสาเหตุอย่างละเอียด',
    },
    {
      questionTh: 'ควรโทร 1669 หรือขับรถไปเองเร็วกว่า?',
      answerTh: 'โทร 1669 เสมอ รถพยาบาลสามารถเตรียมทีมรักษาล่วงหน้าและข้ามจราจรได้ ขับรถเองอาจเกิดอุบัติเหตุหากอาการเพิ่มขึ้น และโรงพยาบาลจะไม่ได้เตรียมตัวล่วงหน้า',
    },
    {
      questionTh: 'ยาละลายลิ่มเลือด tPA ปลอดภัยไหม?',
      answerTh: 'มีความเสี่ยงเลือดออกในสมองประมาณ 2-6% แต่ประโยชน์ที่ได้สูงกว่ามาก คนที่ได้รับ tPA ทันเวลามีโอกาสฟื้นตัวสมบูรณ์สูงขึ้น 30% แพทย์จะประเมินข้อบ่งชี้และข้อห้ามก่อนเสมอ',
    },
  ],

  references: [
    {
      id: 'thai_stroke_guideline',
      titleEn: 'Clinical Practice Guidelines for Stroke Management in Thailand',
      titleTh: 'แนวทางเวชปฏิบัติการดูแลผู้ป่วยโรคหลอดเลือดสมอง',
      organization: 'สมาคมประสาทวิทยาแห่งประเทศไทย',
      year: 2022,
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'moph_stroke_2022',
      titleEn: 'Stroke Burden and Prevention Report Thailand',
      titleTh: 'รายงานภาระโรคและการป้องกันโรคหลอดเลือดสมอง ประเทศไทย',
      organization: 'กรมการแพทย์ กระทรวงสาธารณสุข',
      year: 2022,
      type: 'cohort',
      isVerified: false,
      pendingNote: 'pending_review',
    },
    {
      id: 'aha_stroke_2021',
      titleEn: 'AHA/ASA Guideline for the Prevention of Stroke in Patients With Stroke and TIA',
      organization: 'American Heart Association / American Stroke Association',
      year: 2021,
      url: 'https://www.ahajournals.org',
      type: 'guideline',
      isVerified: false,
      pendingNote: 'pending_review',
    },
  ],

  relatedDiseases: ['hypertension', 'heart-disease', 'type-2-diabetes'],
  keywords: ['โรคหลอดเลือดสมอง', 'Stroke', 'อัมพาต', 'อัมพฤกษ์', 'TIA', 'หัวใจเต้นผิดจังหวะ', 'FAST', 'ยาละลายลิ่มเลือด', 'tPA', 'Ischemic Stroke'],
}

export default stroke
