// ความดันโลหิตสูง (Hypertension) — Rich Disease Data
// SAFETY: ข้อมูลเพื่อการศึกษาเท่านั้น ต้องตรวจสอบโดยแพทย์ก่อนเผยแพร่

import type { RichDisease } from '@/types/disease'

const hypertension: RichDisease = {
  slug: 'hypertension',
  nameTh: 'ความดันโลหิตสูง (Hypertension)',
  nameTh_short: 'ความดันโลหิตสูง',
  nameEn: 'Hypertension',
  category: 'heart',
  categoryTh: 'หัวใจและหลอดเลือด',
  icd10: 'I10',
  riskLevel: 'high',
  lastReviewed: '2026-06',
  reviewedBy: 'รอการรับรองจากอายุรแพทย์โรคหัวใจ',
  shortDescriptionTh: '"ฆาตกรเงียบ" ที่มักไม่มีอาการ แต่เพิ่มความเสี่ยงโรคหัวใจและหลอดเลือดสมองอย่างมีนัยสำคัญ',

  stats: {
    prevalenceThailand: '~13 ล้านคน (24%)',
    prevalenceThai: '1 ใน 4 ของผู้ใหญ่ชาวไทย — 50% ยังไม่ควบคุมได้',
    primaryRiskGroupTh: 'ผู้ใหญ่อายุ 40 ปีขึ้นไป',
    mortalityRankTh: 'ปัจจัยเสี่ยงหลักของโรคหลอดเลือดสมองและหัวใจวาย',
  },

  overviewTh: `ความดันโลหิตสูง (Hypertension) คือภาวะที่แรงดันของเลือดในหลอดเลือดแดงสูงกว่าปกติอย่างต่อเนื่อง โดยทั่วไปนิยามว่าความดัน ≥ 130/80 mmHg ตามแนวทางใหม่ หรือ ≥ 140/90 mmHg ตามแนวทางเก่า แรงดันสูงนี้บังคับให้หัวใจทำงานหนักขึ้นและทำลายหลอดเลือดทั่วร่างกายอย่างช้าๆ

จุดที่น่าเป็นห่วงที่สุดคือ ความดันโลหิตสูงส่วนใหญ่ "ไม่มีอาการ" จนกว่าจะเกิดภาวะแทรกซ้อนร้ายแรง เช่น โรคหลอดเลือดสมอง (Stroke) หรือหัวใจวาย ดังนั้นจึงได้ชื่อว่า "ฆาตกรเงียบ" การวัดความดันเป็นประจำจึงเป็นการตรวจสุขภาพที่ง่ายที่สุดและสำคัญที่สุดที่ทุกคนควรทำ

ข้อดีคือความดันโลหิตสูงสามารถควบคุมได้ดีด้วยการปรับวิถีชีวิตและยา การลดเกลือ ออกกำลังกาย ลดน้ำหนัก และงดแอลกอฮอล์สามารถลดความดันได้อย่างมีนัยสำคัญ และในบางรายควบคุมได้โดยไม่ต้องใช้ยาตลอดชีวิต`,

  symptoms: [
    {
      id: 'usually_none',
      nameTh: 'มักไม่มีอาการ (สำคัญมาก)',
      nameEn: 'Usually asymptomatic',
      severity: 'mild',
      descriptionTh: '90-95% ของความดันสูงไม่มีอาการ นี่คือเหตุผลที่ต้องวัดความดันสม่ำเสมอ แม้รู้สึกปกติ',
      frequencyNote: '90-95% ของผู้ป่วยไม่มีอาการ',
    },
    {
      id: 'headache',
      nameTh: 'ปวดหัวตอนเช้า',
      nameEn: 'Morning headache',
      severity: 'moderate',
      descriptionTh: 'บางคนมีอาการปวดหัวท้ายทอยตอนเช้า แต่นี่ไม่ใช่อาการจำเพาะของความดันสูง',
      frequencyNote: 'พบในส่วนน้อยของผู้ป่วย',
    },
    {
      id: 'dizziness',
      nameTh: 'วิงเวียนศีรษะ',
      nameEn: 'Dizziness',
      severity: 'moderate',
      descriptionTh: 'อาจพบได้ แต่มักเกิดจากสาเหตุอื่น การวิงเวียนรุนแรงอาจบ่งบอกถึงภาวะฉุกเฉิน',
    },
    {
      id: 'vision_issues',
      nameTh: 'ตาพร่ามัวหรือเห็นภาพซ้อน',
      nameEn: 'Vision changes',
      severity: 'severe',
      descriptionTh: 'ความดันสูงมากอาจทำลายหลอดเลือดจอประสาทตา อาการนี้ต้องพบแพทย์ด่วน',
    },
    {
      id: 'hypertensive_crisis',
      nameTh: 'ความดันวิกฤติ ≥ 180/120 mmHg',
      nameEn: 'Hypertensive crisis',
      severity: 'red_flag',
      descriptionTh: 'อาการ: ปวดหัวรุนแรง ตาพร่า เจ็บหน้าอก หายใจลำบาก — ต้องไปห้องฉุกเฉินทันที',
    },
    {
      id: 'nosebleed',
      nameTh: 'เลือดกำเดาไหล',
      nameEn: 'Nosebleed',
      severity: 'moderate',
      descriptionTh: 'เลือดกำเดาไหลบ่อยอาจเกี่ยวข้องกับความดันสูงมาก แต่ไม่จำเพาะเจาะจง',
    },
  ],

  redFlagsTh: [
    'ความดัน ≥ 180/120 mmHg ร่วมกับอาการใดๆ → ไปห้องฉุกเฉินทันที',
    'ปวดหัวรุนแรงทันทีทันใด ("ปวดหัวรุนแรงที่สุดในชีวิต") อาจเป็น Hemorrhagic Stroke',
    'ปากเบี้ยว แขนขาอ่อนแรงครึ่งซีก พูดไม่ออก — สัญญาณ Stroke โทร 1669',
    'เจ็บหน้าอกรุนแรงร่วมกับความดันสูงมาก — อาจเป็น Aortic Dissection',
    'ตามัวอย่างฉับพลัน',
  ],

  causesTh: [
    'ความดันโลหิตสูงปฐมภูมิ (Essential Hypertension) — 90-95% ของผู้ป่วย ไม่ทราบสาเหตุแน่ชัด เกิดจากหลายปัจจัยร่วมกัน',
    'ความดันโลหิตสูงทุติยภูมิ (Secondary Hypertension) — 5-10% เกิดจากโรคไต ต่อมหมวกไตผิดปกติ หยุดหายใจขณะหลับ หรือยาบางชนิด',
    'หลอดเลือดแข็งตัวและยืดหยุ่นลดลงตามอายุ',
    'การกิน Na (เกลือ) มากทำให้ร่างกายดึงน้ำไว้ เพิ่มปริมาณเลือด',
    'น้ำหนักเกิน ทำให้หัวใจต้องสูบฉีดเลือดมากขึ้น',
  ],

  riskFactors: [
    { nameTh: 'อายุ (≥ 40 ปี)', type: 'non_modifiable', descriptionTh: 'หลอดเลือดแข็งและยืดหยุ่นน้อยลงตามอายุ ทำให้ความดันสูงขึ้น' },
    { nameTh: 'ประวัติครอบครัว', type: 'non_modifiable', descriptionTh: 'ถ้าพ่อแม่เป็นความดันสูง ความเสี่ยงเพิ่มขึ้น 2 เท่า', relativeRisk: 'เพิ่ม 2 เท่า' },
    { nameTh: 'กิน Na/เกลือมาก', type: 'modifiable', descriptionTh: 'ลดเกลือจาก 9-12 กรัม/วัน เป็น < 5 กรัม/วัน ลดความดันได้ 5-6 mmHg', relativeRisk: 'ลดได้ 5-6 mmHg เมื่อลดเกลือ' },
    { nameTh: 'น้ำหนักเกินหรืออ้วน', type: 'modifiable', descriptionTh: 'ลดน้ำหนัก 10 กก. ลดความดัน 5-10 mmHg', relativeRisk: 'ลดได้ 5-10 mmHg เมื่อลดน้ำหนัก 10 กก.' },
    { nameTh: 'ไม่ออกกำลังกาย', type: 'modifiable', descriptionTh: 'ออกกำลังกายแบบ Aerobic 30 นาที/วัน 5 วัน/สัปดาห์ ลดความดัน 4-9 mmHg' },
    { nameTh: 'ดื่มแอลกอฮอล์มาก', type: 'modifiable', descriptionTh: 'ลดหรืองดแอลกอฮอล์ลดความดันได้ 2-4 mmHg', relativeRisk: 'เพิ่มความเสี่ยงถ้าดื่ม >2 drinks/วัน' },
    { nameTh: 'สูบบุหรี่', type: 'modifiable', descriptionTh: 'นิโคตินทำให้หลอดเลือดหดตัวชั่วคราว แต่ผลระยะยาวทำลายหลอดเลือดทั้งหมด' },
    { nameTh: 'ความเครียดเรื้อรัง', type: 'modifiable', descriptionTh: 'เครียดมากทำให้ฮอร์โมน Adrenaline พุ่งสูง ความดันขึ้นชั่วคราวและถาวรในที่สุด' },
    { nameTh: 'เบาหวาน', type: 'partially_modifiable', descriptionTh: 'เบาหวานและความดันสูงมักเกิดร่วมกัน (Metabolic Syndrome) เพิ่มความเสี่ยงทั้งคู่' },
    { nameTh: 'โรคไตเรื้อรัง', type: 'partially_modifiable', descriptionTh: 'ไตผิดปกติทำให้ระบบควบคุมความดันเสียหาย และความดันสูงก็ทำลายไตกลับ' },
  ],

  screening: [
    {
      id: 'bp_measurement',
      nameTh: 'วัดความดันโลหิต',
      nameEn: 'Blood Pressure Measurement',
      ageRange: 'ทุกอายุ — เริ่มตั้งแต่ 18 ปี',
      sex: 'all',
      frequency: 'ทุก 2 ปีถ้าปกติ · ทุกปีถ้า 120-129/<80 · บ่อยกว่าถ้าสูง',
      descriptionTh: 'การวัดความดันเป็นการตรวจที่ง่ายที่สุดและสำคัญที่สุด วัดทั้งสองแขน นั่งพักก่อน 5 นาที อย่าดื่มกาแฟหรือออกกำลังกายก่อน 30 นาที',
      isNHSOCovered: true,
      guidelineSource: 'สมาคมความดันโลหิตสูงแห่งประเทศไทย (THSA) 2566',
    },
    {
      id: 'home_bp',
      nameTh: 'วัดความดันที่บ้าน (HBPM)',
      nameEn: 'Home Blood Pressure Monitoring',
      ageRange: 'สำหรับผู้ที่มีความดันสูงหรือเสี่ยงสูง',
      sex: 'all',
      frequency: 'เช้าและเย็น นาน 7 วัน',
      descriptionTh: 'วัดความดันที่บ้านเองทุกเช้า-เย็น 7 วัน เพื่อหา "White Coat Hypertension" (ความดันสูงเฉพาะในโรงพยาบาล) ค่าปกติที่บ้านคือ < 135/85 mmHg',
      isNHSOCovered: false,
      guidelineSource: 'ESH/ESC Guidelines',
    },
  ],

  treatments: [
    {
      categoryTh: 'ปรับวิถีชีวิต (Lifestyle Modification)',
      nameTh: 'DASH Diet + ลดเกลือ + ออกกำลังกาย',
      descriptionTh: 'ลดเกลือ < 5 กรัม/วัน + DASH Diet (ผักผลไม้มาก นมไขมันต่ำ ลดเนื้อแดง) + ออกกำลังกาย 30 นาที/วัน 5 วัน/สัปดาห์ สามารถลดความดันได้ 10-15 mmHg',
      forStage: 'ทุกระยะ — เป็นพื้นฐานที่จำเป็น',
    },
    {
      categoryTh: 'ยากลุ่ม ACE Inhibitors / ARBs',
      nameTh: 'ACE Inhibitors เช่น Enalapril, Ramipril',
      nameEn: 'ACE Inhibitors / ARBs',
      descriptionTh: 'ยาหลักที่แนะนำโดยเฉพาะถ้ามีโรคไตร่วมด้วย ปกป้องไตและหัวใจได้เพิ่มเติม ARBs มีผลข้างเคียงน้อยกว่า ACE',
      sideEffectsTh: ['ไอแห้ง (ACE Inhibitors)', 'โพแทสเซียมสูง'],
    },
    {
      categoryTh: 'Calcium Channel Blockers (CCBs)',
      nameTh: 'Amlodipine, Nifedipine',
      nameEn: 'Calcium Channel Blockers',
      descriptionTh: 'ยาลดความดันที่นิยมใช้ในไทย ออกฤทธิ์ขยายหลอดเลือด ใช้เป็นยาเดี่ยวหรือร่วมกับยาอื่น',
      sideEffectsTh: ['ข้อเท้าบวม', 'ใบหน้าแดง'],
    },
    {
      categoryTh: 'Thiazide Diuretics',
      nameTh: 'Hydrochlorothiazide',
      nameEn: 'Thiazide Diuretics',
      descriptionTh: 'ยาขับปัสสาวะที่ลดปริมาณเลือดในหลอดเลือด มักใช้ร่วมกับยาอื่นในรายที่ควบคุมยาก',
      sideEffectsTh: ['โพแทสเซียมต่ำ', 'น้ำตาลสูงเล็กน้อย'],
    },
    {
      categoryTh: 'Beta-Blockers',
      nameTh: 'Atenolol, Carvedilol',
      nameEn: 'Beta-Blockers',
      descriptionTh: 'เหมาะสำหรับผู้ที่มีโรคหัวใจ หัวใจเต้นเร็ว หรือเคยเป็นหัวใจวาย ลดอัตราการเต้นของหัวใจและลดความดัน',
      sideEffectsTh: ['เหนื่อยง่าย', 'มือเท้าเย็น', 'นอนไม่หลับในบางราย'],
    },
  ],

  prevention: [
    { actionTh: 'ลดเกลือและโซเดียม', descriptionTh: 'ไม่เกิน 5 กรัม NaCl/วัน (~2,000 mg Na) ลดซีอิ้ว น้ำปลา และอาหารแปรรูป ลดความดันได้ 5-6 mmHg', impact: 'high', evidence: 'WHO Salt Reduction Guidelines' },
    { actionTh: 'DASH Diet', descriptionTh: 'ผักผลไม้วันละ 8-10 เสิร์ฟ นมไขมันต่ำ ธัญพืชไม่ขัดสี ลดเนื้อแดง DASH Diet ลดความดันได้ 8-14 mmHg', impact: 'high', evidence: 'NEJM DASH Diet Trial' },
    { actionTh: 'ออกกำลังกายแบบ Aerobic', descriptionTh: 'เดินเร็ว ว่ายน้ำ หรือปั่นจักรยาน 30 นาที อย่างน้อย 5 วัน/สัปดาห์ ลดความดัน 4-9 mmHg', impact: 'high', evidence: 'Cochrane Review Aerobic Exercise and BP' },
    { actionTh: 'ลดน้ำหนัก', descriptionTh: 'ลดน้ำหนัก 10 กิโลกรัม ลดความดันได้ 5-10 mmHg', impact: 'high', evidence: 'Systematic Review Weight Loss and Hypertension' },
    { actionTh: 'งดหรือลดแอลกอฮอล์', descriptionTh: 'ไม่เกิน 1 drink/วัน สำหรับผู้หญิง ไม่เกิน 2 drink/วัน สำหรับผู้ชาย', impact: 'high', evidence: 'INTERSALT Study' },
    { actionTh: 'วัดความดันที่บ้านเป็นประจำ', descriptionTh: 'รู้ค่าความดันของตัวเอง ตรวจสอบว่าการรักษาได้ผล และพบแพทย์ทันทีถ้าสูงผิดปกติ', impact: 'high', evidence: 'ESH/ESC Guidelines' },
  ],

  whenToSeeDoctorTh: [
    'ไม่เคยวัดความดันเลยและอายุ 18 ปีขึ้นไป',
    'วัดความดันเองแล้วได้ค่า ≥ 130/80 mmHg สม่ำเสมอ',
    'มีปัจจัยเสี่ยงหลายอย่างเช่น อ้วน เบาหวาน สูบบุหรี่',
    'มีอาการปวดหัวบ่อยหรือวิงเวียนผิดปกติ',
    'ความดัน ≥ 180/120 mmHg — ไปห้องฉุกเฉินทันที',
    'มีอาการเตือน Stroke: ปากเบี้ยว แขนอ่อนแรง พูดไม่ชัด — โทร 1669 ทันที',
  ],

  faqsTh: [
    {
      questionTh: 'ต้องกินยาความดันตลอดชีวิตไหม?',
      answerTh: 'ขึ้นอยู่กับระดับความดันและการตอบสนองต่อการปรับวิถีชีวิต บางคนที่ปรับพฤติกรรมได้ดีอาจลดยาหรือหยุดยาได้ภายใต้การดูแลของแพทย์ แต่ห้ามหยุดยาเองเด็ดขาด ความดันที่หยุดยาเองอาจพุ่งสูงอย่างอันตราย',
    },
    {
      questionTh: 'ความดัน 130/85 ต้องกินยาแล้วหรือไม่?',
      answerTh: 'ขึ้นอยู่กับปัจจัยเสี่ยงรวม ถ้าความดัน Stage 1 (130-139/80-89) และไม่มีโรคร่วม แพทย์มักแนะนำให้ปรับวิถีชีวิตก่อน 3-6 เดือนโดยไม่ต้องใช้ยา แต่ถ้ามีโรคหัวใจ เบาหวาน หรือไต อาจต้องเริ่มยาเร็วขึ้น',
    },
    {
      questionTh: 'กินยาความดันแล้วรู้สึกตัวเลขต่ำลงมาก เป็นอันตรายไหม?',
      answerTh: 'ความดันต่ำจากยา (Hypotension) อาจทำให้วิงเวียน หน้ามืด โดยเฉพาะเมื่อลุกขึ้นเร็ว ถ้าเกิดอาการเหล่านี้ควรนั่งหรือนอนทันทีและโทรหาแพทย์ ห้ามหยุดยาเองโดยไม่ปรึกษาแพทย์',
    },
  ],

  references: [
    { id: 'thsa_2023', titleEn: 'Thai Hypertension Guidelines 2023', titleTh: 'แนวทางการรักษาโรคความดันโลหิตสูงในเวชปฏิบัติทั่วไป พ.ศ. 2566', organization: 'สมาคมความดันโลหิตสูงแห่งประเทศไทย (THSA)', year: 2023, type: 'guideline', isVerified: false, pendingNote: 'ต้องตรวจสอบก่อนเผยแพร่' },
    { id: 'esh_2023', titleEn: 'ESH/ESC Guidelines for the Management of Arterial Hypertension 2023', organization: 'European Society of Hypertension', year: 2023, type: 'guideline', isVerified: false },
    { id: 'dash_trial', titleEn: 'A Clinical Trial of the Effects of Dietary Patterns on Blood Pressure', organization: 'NEJM DASH Collaborative Research Group', year: 1997, doi: '10.1056/NEJM199704173361601', type: 'rct', isVerified: false },
  ],

  relatedDiseases: ['cardiovascular-disease', 'type-2-diabetes', 'kidney-disease'],
  keywords: ['ความดันโลหิตสูง', 'Hypertension', 'ความดันเลือด', 'โรคหลอดเลือดสมอง', 'Stroke', 'DASH Diet'],
}

export default hypertension
