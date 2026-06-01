// Disease Library Data
// SAFETY: All content is educational. Marked pending_review until verified by medical team.
// Do NOT invent citations. Use pendingEvidence() for unverified content.

import { makeEvidence, pendingEvidence, type EvidenceMetadata } from './evidence-types'
import type { UrgencyLevel } from './symptoms-data'

export interface DiseasePageData {
  slug: string
  icd10: string
  nameTh: string
  nameEn: string
  nameTh_short: string
  category: string
  categoryTh: string
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high'
  prevalence: string
  prevalenceTh: string

  // Content sections
  overview: { th: string; en: string }
  earlySymptoms: string[]
  riskFactors: string[]
  screeningInfo: {
    recommended: boolean
    from_age?: number
    frequency?: string
    tests: string[]
    guidelineTh: string
  }
  whenToSeeDoctor: string[]
  treatmentOverview: string
  prevention: string[]
  faqs: Array<{ questionTh: string; answerTh: string }>
  redFlags: string[]
  evidence: EvidenceMetadata
  lastReviewed: string
  reviewerPlaceholder: string
}

export const DISEASE_DATA: Record<string, DiseasePageData> = {
  'type-2-diabetes': {
    slug: 'type-2-diabetes',
    icd10: 'E11',
    nameTh: 'เบาหวานชนิดที่ 2 (Type 2 Diabetes)',
    nameEn: 'Type 2 Diabetes Mellitus',
    nameTh_short: 'เบาหวานชนิดที่ 2',
    category: 'Endocrine',
    categoryTh: 'ต่อมไร้ท่อและเมตาบอลิซึม',
    riskLevel: 'high',
    prevalence: '~11% of Thai adults',
    prevalenceTh: 'ประมาณ 11% ของผู้ใหญ่ชาวไทย',
    overview: {
      th: 'เบาหวานชนิดที่ 2 เป็นโรคเรื้อรังที่ร่างกายไม่สามารถใช้อินซูลินได้อย่างมีประสิทธิภาพ ทำให้ระดับน้ำตาลในเลือดสูง หากไม่ได้รับการรักษา อาจนำไปสู่ภาวะแทรกซ้อนรุนแรง เช่น โรคหัวใจ โรคไต ตาบอด และปัญหาเส้นประสาท ประเทศไทยมีผู้ป่วยเบาหวานประมาณ 7.4 ล้านคน และอีกประมาณ 40% ยังไม่ได้รับการวินิจฉัย',
      en: 'Type 2 Diabetes is a chronic condition where the body cannot effectively use insulin, leading to high blood sugar. If untreated, it can cause serious complications including heart disease, kidney disease, blindness, and nerve damage.',
    },
    earlySymptoms: [
      'กระหายน้ำมากกว่าปกติ',
      'ปัสสาวะบ่อย โดยเฉพาะตอนกลางคืน',
      'อ่อนเพลีย เหนื่อยง่าย',
      'ตามองเห็นพร่ามัว',
      'บาดแผลหายช้า',
      'ชาหรือเจ็บปวดที่มือและเท้า',
      'ติดเชื้อบ่อยโดยเฉพาะบริเวณผิวหนังและทางเดินปัสสาวะ',
      'น้ำหนักลดโดยไม่ทราบสาเหตุ (บางราย)',
    ],
    riskFactors: [
      'อายุ 35 ปีขึ้นไป',
      'น้ำหนักเกินหรืออ้วน (BMI ≥23 ตามเกณฑ์เอเชีย)',
      'มีประวัติครอบครัวเป็นเบาหวาน',
      'ไม่ค่อยออกกำลังกาย',
      'ความดันโลหิตสูง',
      'ไขมันในเลือดผิดปกติ',
      'เคยเป็นเบาหวานขณะตั้งครรภ์',
      'กลุ่มชาติพันธุ์เอเชีย',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 35,
      frequency: 'ทุก 3 ปี หากปกติ; ทุกปี หากอยู่ในกลุ่มก่อนเบาหวาน',
      tests: ['ตรวจน้ำตาลในเลือดขณะอดอาหาร (FPG)', 'HbA1c', 'OGTT (ถ้าแพทย์เห็นสมควร)'],
      guidelineTh: 'สมาคมโรคเบาหวานแห่งประเทศไทย (DMST) ปี 2566',
    },
    whenToSeeDoctor: [
      'กระหายน้ำและปัสสาวะบ่อยมากผิดปกติ',
      'อ่อนเพลียมากโดยไม่มีสาเหตุ',
      'มีประวัติครอบครัวเป็นเบาหวาน',
      'น้ำหนักเกินและอายุ 35 ปีขึ้นไป',
      'บาดแผลหายช้าผิดปกติ',
    ],
    treatmentOverview: 'การรักษาประกอบด้วยการปรับเปลี่ยนวิถีชีวิต (อาหาร การออกกำลังกาย) ร่วมกับยาถ้าจำเป็น เป้าหมายคือควบคุมระดับน้ำตาลให้อยู่ในเกณฑ์ปกติเพื่อป้องกันภาวะแทรกซ้อน',
    prevention: [
      'ควบคุมน้ำหนักให้อยู่ในเกณฑ์ปกติ (BMI <23)',
      'ออกกำลังกายอย่างน้อย 150 นาทีต่อสัปดาห์',
      'รับประทานอาหารที่มีเส้นใยสูง ลดแป้งขัดขาวและน้ำตาล',
      'ตรวจน้ำตาลในเลือดสม่ำเสมอตามแนะนำ',
      'งดสูบบุหรี่และลดเครื่องดื่มแอลกอฮอล์',
    ],
    faqs: [
      {
        questionTh: 'เบาหวานชนิดที่ 2 รักษาหายได้หรือไม่?',
        answerTh: 'เบาหวานชนิดที่ 2 ไม่สามารถรักษาให้หายขาดได้ แต่สามารถควบคุมได้ดีจนอาจไม่ต้องใช้ยา บางคนที่ลดน้ำหนักและปรับวิถีชีวิตได้มากพอสามารถควบคุมระดับน้ำตาลได้โดยไม่ต้องใช้ยา',
      },
      {
        questionTh: 'ถ้าไม่มีอาการ จำเป็นต้องตรวจหรือไม่?',
        answerTh: 'จำเป็นมาก เบาหวานในระยะแรกมักไม่มีอาการ กว่าจะมีอาการชัดเจนอาจผ่านไปหลายปี การตรวจพบตั้งแต่เนิ่นๆ ป้องกันภาวะแทรกซ้อนที่รุนแรงได้มาก',
      },
      {
        questionTh: 'อาหารที่ควรหลีกเลี่ยงคืออะไร?',
        answerTh: 'อาหารที่ควรลด ได้แก่ ข้าวขาว ขนมหวาน น้ำผลไม้ เครื่องดื่มหวาน อาหารแปรรูป ควรเพิ่มผัก โปรตีน และเส้นใยอาหาร ปรึกษานักโภชนาการเพื่อแผนที่เหมาะกับคุณ',
      },
    ],
    redFlags: [
      'ระดับน้ำตาลในเลือดสูงมาก (>300 mg/dL) ร่วมกับคลื่นไส้อาเจียน',
      'หายใจมีกลิ่นผลไม้ (อาจเป็น DKA)',
      'ชาหรืออ่อนแรงที่ขาหรือเท้ามากขึ้นเรื่อยๆ',
      'แผลที่เท้าไม่ยอมหาย',
      'ตามองเห็นพร่ามัวอย่างฉับพลัน',
    ],
    evidence: makeEvidence('Diabetes Association of Thailand (DMST) Clinical Practice Guidelines', 'A', 2023, 'DMST CPG 2023'),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากอายุรแพทย์ต่อมไร้ท่อ',
  },

  'hypertension': {
    slug: 'hypertension',
    icd10: 'I10',
    nameTh: 'ความดันโลหิตสูง (Hypertension)',
    nameEn: 'Hypertension',
    nameTh_short: 'ความดันโลหิตสูง',
    category: 'Cardiovascular',
    categoryTh: 'หัวใจและหลอดเลือด',
    riskLevel: 'high',
    prevalence: '~24% of Thai adults',
    prevalenceTh: 'ประมาณ 24% ของผู้ใหญ่ชาวไทย',
    overview: {
      th: 'ความดันโลหิตสูงคือภาวะที่แรงดันของเลือดในหลอดเลือดแดงสูงกว่าปกติอย่างต่อเนื่อง (≥130/80 mmHg) เรียกว่า "ฆาตกรเงียบ" เพราะส่วนใหญ่ไม่มีอาการ แต่เพิ่มความเสี่ยงโรคหัวใจ โรคหลอดเลือดสมอง และโรคไตอย่างมีนัยสำคัญ',
      en: 'Hypertension is a condition where blood pressure in arteries is persistently elevated (≥130/80 mmHg). Often called the "silent killer" as it typically has no symptoms but significantly raises risk of heart attack, stroke, and kidney disease.',
    },
    earlySymptoms: [
      'มักไม่มีอาการในระยะแรก',
      'ปวดหัวตอนเช้า (บางราย)',
      'วิงเวียน (บางราย)',
      'มองเห็นพร่า (บางราย)',
      'ใจสั่น',
      'เลือดกำเดาไหล (ระดับสูงมาก)',
    ],
    riskFactors: [
      'อายุมากกว่า 40 ปี',
      'น้ำหนักเกินหรืออ้วน',
      'รับประทานเกลือมาก',
      'ไม่ออกกำลังกาย',
      'ดื่มแอลกอฮอล์มาก',
      'สูบบุหรี่',
      'ความเครียดสูง',
      'ประวัติครอบครัวเป็นความดันโลหิตสูง',
      'เบาหวาน',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 18,
      frequency: 'ทุก 2 ปี หากปกติ; ทุกปีหรือบ่อยกว่า หากสูงหรือมีปัจจัยเสี่ยง',
      tests: ['วัดความดันโลหิต (สถานพยาบาล)', 'ตรวจ 24-hr BP (ถ้าต้องการ)'],
      guidelineTh: 'สมาคมความดันโลหิตสูงแห่งประเทศไทย ปี 2566',
    },
    whenToSeeDoctor: [
      'ไม่เคยตรวจความดันและอายุ 18 ปีขึ้นไป',
      'ปวดหัวมากหรือบ่อย',
      'มีประวัติครอบครัวเป็นความดันสูง',
      'เป็นเบาหวาน โรคไต หรือโรคหัวใจ',
      'ตรวจวัดเองแล้วสูงกว่า 130/80 mmHg',
    ],
    treatmentOverview: 'ประกอบด้วยการปรับวิถีชีวิต (ลดเกลือ ออกกำลังกาย ลดน้ำหนัก งดบุหรี่) และยาลดความดัน หากจำเป็น เป้าหมายคือความดันต่ำกว่า 130/80 mmHg',
    prevention: [
      'ลดการบริโภคเกลือ (ไม่เกิน 5 กรัมต่อวัน)',
      'ออกกำลังกายสม่ำเสมอ 30 นาทีต่อวัน อย่างน้อย 5 วันต่อสัปดาห์',
      'ควบคุมน้ำหนัก',
      'ลดหรืองดแอลกอฮอล์',
      'งดสูบบุหรี่',
      'จัดการความเครียด',
      'รับประทานผักและผลไม้มาก',
    ],
    faqs: [
      {
        questionTh: 'ต้องกินยาตลอดชีวิตหรือไม่?',
        answerTh: 'หลายคนต้องกินยาต่อเนื่อง แต่บางคนที่ปรับวิถีชีวิตได้ดีอาจลดยาหรือหยุดยาได้ภายใต้การดูแลของแพทย์ อย่าหยุดยาเองโดยไม่ปรึกษาแพทย์',
      },
      {
        questionTh: 'ความดันโลหิตสูงแค่ไหนจึงอันตราย?',
        answerTh: 'ความดันสูงกว่า 180/120 mmHg ถือว่าวิกฤติและต้องพบแพทย์ทันที ความดัน 130-139/80-89 เป็น Stage 1 ควรปรึกษาแพทย์',
      },
    ],
    redFlags: [
      'ความดันสูงกว่า 180/120 mmHg',
      'ปวดหัวรุนแรงทันที',
      'มองเห็นพร่าอย่างฉับพลัน',
      'เจ็บหน้าอกร่วมกับความดันสูง',
      'พูดไม่ออก แขนขาอ่อนแรงครึ่งซีก',
    ],
    evidence: makeEvidence('Thai Hypertension Society Guidelines', 'A', 2023),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากอายุรแพทย์โรคหัวใจ',
  },

  'cervical-cancer': {
    slug: 'cervical-cancer',
    icd10: 'C53',
    nameTh: 'มะเร็งปากมดลูก (Cervical Cancer)',
    nameEn: 'Cervical Cancer',
    nameTh_short: 'มะเร็งปากมดลูก',
    category: 'Oncology',
    categoryTh: 'มะเร็งวิทยา',
    riskLevel: 'high',
    prevalence: '#2 cancer in Thai women',
    prevalenceTh: 'มะเร็งอันดับ 2 ในผู้หญิงไทย',
    overview: {
      th: 'มะเร็งปากมดลูกเป็นมะเร็งที่เกิดขึ้นที่ปากมดลูก ส่วนใหญ่เกิดจากการติดเชื้อ Human Papillomavirus (HPV) ซึ่งสามารถป้องกันได้ด้วยวัคซีน และตรวจพบได้ตั้งแต่ระยะเริ่มต้นด้วย Pap Smear เมื่อตรวจพบในระยะแรก อัตราการรอดชีวิต 5 ปีมากกว่า 90%',
      en: 'Cervical cancer develops in the cells of the cervix, primarily caused by Human Papillomavirus (HPV). It is highly preventable through vaccination and early detection through Pap smear screening.',
    },
    earlySymptoms: [
      'มักไม่มีอาการในระยะแรก (จึงต้องตรวจคัดกรองสม่ำเสมอ)',
      'มีเลือดออกผิดปกติทางช่องคลอด เช่น หลังมีเพศสัมพันธ์',
      'มีตกขาวผิดปกติ กลิ่นเหม็น หรือมีเลือดปน',
      'เจ็บขณะมีเพศสัมพันธ์',
      'ปวดบริเวณกระดูกเชิงกราน (ระยะลุกลาม)',
    ],
    riskFactors: [
      'ติดเชื้อ HPV (Human Papillomavirus)',
      'มีเพศสัมพันธ์ตั้งแต่อายุน้อย',
      'มีคู่นอนหลายคน',
      'สูบบุหรี่',
      'ภูมิคุ้มกันต่ำ เช่น HIV',
      'ไม่เคยตรวจ Pap Smear',
      'ไม่ได้รับวัคซีน HPV',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 25,
      frequency: 'ทุก 3-5 ปี ในผู้หญิงที่มีหรือเคยมีเพศสัมพันธ์',
      tests: ['Pap Smear', 'HPV DNA test', 'Liquid-based cytology (LBC)'],
      guidelineTh: 'สถาบันมะเร็งแห่งชาติ ร่วมกับ สธ. ปี 2567',
    },
    whenToSeeDoctor: [
      'อายุ 25 ปีขึ้นไปและมีหรือเคยมีเพศสัมพันธ์ แต่ยังไม่เคยตรวจ',
      'มีเลือดออกผิดปกติทางช่องคลอด',
      'ตกขาวผิดปกติ',
      'เจ็บขณะมีเพศสัมพันธ์',
    ],
    treatmentOverview: 'ขึ้นอยู่กับระยะ ได้แก่ การผ่าตัด รังสีรักษา และเคมีบำบัด หรือร่วมกัน เมื่อตรวจพบในระยะแรก มีโอกาสรักษาหายขาดสูง',
    prevention: [
      'ฉีดวัคซีน HPV ก่อนมีเพศสัมพันธ์ (อายุ 9-26 ปี)',
      'ตรวจ Pap Smear สม่ำเสมอทุก 3-5 ปี',
      'ป้องกันการติดเชื้อ STI',
      'งดสูบบุหรี่',
    ],
    faqs: [
      {
        questionTh: 'วัคซีน HPV ป้องกันมะเร็งปากมดลูกได้กี่เปอร์เซ็นต์?',
        answerTh: 'วัคซีน HPV ชนิด 9 สายพันธุ์ป้องกันมะเร็งปากมดลูกที่เกิดจาก HPV ได้ประมาณ 90% แต่ยังต้องตรวจ Pap Smear ต่อไปเพราะวัคซีนไม่ป้องกันได้ 100%',
      },
      {
        questionTh: 'ถ้าฉีดวัคซีนแล้วยังต้องตรวจ Pap Smear หรือไม่?',
        answerTh: 'ใช่ ยังต้องตรวจ Pap Smear ต่อไปแม้จะฉีดวัคซีนแล้ว เพราะวัคซีนไม่ป้องกัน HPV ทุกสายพันธุ์',
      },
    ],
    redFlags: [
      'เลือดออกผิดปกติทางช่องคลอดโดยเฉพาะหลังหมดประจำเดือน',
      'มีตกขาวที่มีกลิ่นเหม็นหรือมีเลือดปน',
      'ปวดกระดูกเชิงกรานรุนแรงต่อเนื่อง',
    ],
    evidence: makeEvidence('National Cancer Institute Thailand / MOPH Cervical Cancer Screening Guidelines', 'A', 2024),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากสูตินรีแพทย์',
  },

  'colorectal-cancer': {
    slug: 'colorectal-cancer',
    icd10: 'C18',
    nameTh: 'มะเร็งลำไส้ใหญ่และทวารหนัก (Colorectal Cancer)',
    nameEn: 'Colorectal Cancer',
    nameTh_short: 'มะเร็งลำไส้ใหญ่',
    category: 'Oncology',
    categoryTh: 'มะเร็งวิทยา',
    riskLevel: 'moderate',
    prevalence: 'Rising incidence in Thailand',
    prevalenceTh: 'อัตราป่วยเพิ่มขึ้นในประเทศไทย',
    overview: {
      th: 'มะเร็งลำไส้ใหญ่เกิดในเซลล์บุผนังลำไส้ใหญ่หรือทวารหนัก มักเริ่มจากติ่งเนื้อ (polyp) ที่ไม่ร้ายแรง หากตรวจพบและตัดออกตั้งแต่ก่อนกลายเป็นมะเร็ง จะป้องกันโรคได้ อัตราการรอดชีวิต 5 ปีสูงถึง 90% หากพบในระยะแรก',
      en: 'Colorectal cancer begins in the colon or rectum, often starting as polyps. Early detection and removal prevents cancer. Five-year survival rate exceeds 90% when caught early.',
    },
    earlySymptoms: [
      'มักไม่มีอาการในระยะแรก',
      'เลือดในอุจจาระหรืออุจจาระสีดำ',
      'ท้องผูกและถ่ายเหลวสลับกัน',
      'รู้สึกถ่ายไม่สุด',
      'ปวดท้องหรือตะคริวที่ท้อง',
      'น้ำหนักลดโดยไม่ทราบสาเหตุ',
      'อ่อนเพลีย (จากโลหิตจาง)',
    ],
    riskFactors: [
      'อายุ 50 ปีขึ้นไป',
      'ประวัติครอบครัวเป็นมะเร็งลำไส้ใหญ่',
      'เคยมีติ่งเนื้อในลำไส้',
      'อาหารแดงและเนื้อแปรรูปมาก',
      'ดื่มแอลกอฮอล์และสูบบุหรี่',
      'ไม่ออกกำลังกาย',
      'โรคลำไส้อักเสบเรื้อรัง (IBD)',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 50,
      frequency: 'ส่องกล้องทุก 10 ปี หรือตรวจเลือดในอุจจาระ (FIT) ทุกปี',
      tests: ['FIT (Fecal Immunochemical Test)', 'การส่องกล้องลำไส้ใหญ่ (Colonoscopy)', 'Sigmoidoscopy'],
      guidelineTh: 'NCCN Colorectal Cancer Screening / แนวทาง สธ. ไทย',
    },
    whenToSeeDoctor: [
      'อายุ 50 ปีขึ้นไปและยังไม่เคยตรวจ',
      'มีประวัติครอบครัวเป็นมะเร็งลำไส้ใหญ่ (ควรเริ่มตรวจก่อน 50 ปี)',
      'ถ่ายเป็นเลือดหรืออุจจาระสีดำ',
      'ลักษณะอุจจาระเปลี่ยนอย่างชัดเจน',
    ],
    treatmentOverview: 'ขึ้นอยู่กับระยะ ได้แก่ การผ่าตัด เคมีบำบัด และรังสีรักษา หรือร่วมกัน',
    prevention: [
      'รับประทานอาหารที่มีเส้นใยสูง',
      'ลดเนื้อแดงและเนื้อแปรรูป',
      'ออกกำลังกายสม่ำเสมอ',
      'ควบคุมน้ำหนัก',
      'งดสูบบุหรี่และลดแอลกอฮอล์',
      'ตรวจคัดกรองตามแนะนำ',
    ],
    faqs: [
      {
        questionTh: 'การส่องกล้องลำไส้ใหญ่น่ากลัวหรือไม่?',
        answerTh: 'การส่องกล้องลำไส้ใหญ่ทำภายใต้ยาระงับความรู้สึก ส่วนใหญ่ไม่เจ็บและรู้สึกสบาย อาจมีความรู้สึกไม่สบายเล็กน้อยหลังทำ แต่โดยทั่วไปกลับบ้านได้ในวันเดียวกัน',
      },
    ],
    redFlags: [
      'เลือดออกทางทวารหนักโดยไม่มีสาเหตุ',
      'น้ำหนักลดรวมกับลักษณะอุจจาระเปลี่ยน',
      'ปวดท้องรุนแรงและต่อเนื่อง',
    ],
    evidence: makeEvidence('NCCN Guidelines — Colorectal Cancer Screening Version 2024', 'A', 2024),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากอายุรแพทย์ระบบทางเดินอาหาร',
  },

  'liver-cancer': {
    slug: 'liver-cancer',
    icd10: 'C22',
    nameTh: 'มะเร็งตับ (Liver Cancer)',
    nameEn: 'Hepatocellular Carcinoma / Liver Cancer',
    nameTh_short: 'มะเร็งตับ',
    category: 'Oncology',
    categoryTh: 'มะเร็งวิทยา',
    riskLevel: 'very_high',
    prevalence: '#1 cancer in Thai men',
    prevalenceTh: 'มะเร็งอันดับ 1 ในชายไทย',
    overview: {
      th: 'มะเร็งตับเป็นมะเร็งที่พบบ่อยที่สุดในชายไทย ส่วนใหญ่เกิดจากการติดเชื้อไวรัสตับอักเสบ B (HBV) และ C (HCV) รวมถึงพยาธิใบไม้ตับ (Opisthorchis viverrini) จากการบริโภคปลาน้ำจืดดิบ ซึ่งพบมากในภาคอีสานของไทย มะเร็งตับมักตรวจพบในระยะลุกลาม เนื่องจากระยะแรกแทบไม่มีอาการ',
      en: 'Liver cancer is the most common cancer in Thai men. Most cases arise from Hepatitis B or C infection or liver flukes from raw freshwater fish. It is often detected late due to few early symptoms.',
    },
    earlySymptoms: [
      'มักไม่มีอาการในระยะแรก',
      'ปวดหรืออึดอัดที่ชายโครงขวา',
      'ท้องอืด น้ำในช่องท้อง',
      'น้ำหนักลด อ่อนเพลีย',
      'ตาเหลือง ผิวเหลือง (ดีซ่าน)',
      'คลื่นไส้ อาเจียน',
      'คลำพบก้อนที่ท้อง',
    ],
    riskFactors: [
      'ติดเชื้อไวรัสตับอักเสบ B (HBV) — ความเสี่ยงสูงสุด',
      'ติดเชื้อไวรัสตับอักเสบ C (HCV)',
      'ตับแข็ง (Liver Cirrhosis)',
      'รับประทานปลาน้ำจืดดิบ (เสี่ยงพยาธิใบไม้ตับ)',
      'ดื่มแอลกอฮอล์มากเป็นเวลานาน',
      'ตับแข็งจากไขมัน (NAFLD/NASH)',
      'ประวัติครอบครัวเป็นมะเร็งตับ',
      'เพศชาย อายุมากกว่า 40 ปี',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 40,
      frequency: 'อัลตราซาวด์ตับทุก 6 เดือน สำหรับกลุ่มเสี่ยงสูง',
      tests: ['อัลตราซาวด์ตับ (Liver Ultrasound)', 'AFP (Alpha-fetoprotein) ในเลือด', 'ตรวจ HBV/HCV'],
      guidelineTh: 'สมาคมโรคตับแห่งประเทศไทย / AASLD Guidelines',
    },
    whenToSeeDoctor: [
      'ติดเชื้อ HBV หรือ HCV และยังไม่ได้รับการรักษา',
      'มีตับแข็ง ไม่ว่าจากสาเหตุใด',
      'รับประทานปลาน้ำจืดดิบสม่ำเสมอ',
      'ตาเหลือง ผิวเหลือง อย่างฉับพลัน',
      'ปวดชายโครงขวาต่อเนื่อง',
    ],
    treatmentOverview: 'ขึ้นอยู่กับระยะ ได้แก่ การผ่าตัด การจี้ด้วยคลื่นวิทยุ (RFA) เคมีบำบัด หรือการปลูกถ่ายตับ โอกาสรักษาหายขาดสูงสุดเมื่อพบในระยะแรก',
    prevention: [
      'ฉีดวัคซีนไวรัสตับอักเสบ B (ป้องกันได้เกือบ 100%)',
      'ตรวจและรักษาการติดเชื้อ HCV ซึ่งปัจจุบันรักษาหายขาดได้',
      'หลีกเลี่ยงการรับประทานปลาน้ำจืดดิบ',
      'ลดหรืองดแอลกอฮอล์',
      'ตรวจอัลตราซาวด์ตับสม่ำเสมอหากอยู่ในกลุ่มเสี่ยง',
    ],
    faqs: [
      {
        questionTh: 'ฉีดวัคซีน HBV แล้วยังเสี่ยงมะเร็งตับได้ไหม?',
        answerTh: 'วัคซีน HBV ป้องกันการติดเชื้อ HBV ได้มากกว่า 95% แต่ยังมีความเสี่ยงจาก HCV, พยาธิใบไม้ตับ, แอลกอฮอล์, และไขมันสะสมในตับ ดังนั้นควรดูแลสุขภาพตับรอบด้าน',
      },
      {
        questionTh: 'พยาธิใบไม้ตับอันตรายแค่ไหน?',
        answerTh: 'พยาธิใบไม้ตับ (Opisthorchis viverrini) เพิ่มความเสี่ยงมะเร็งท่อน้ำดี (Cholangiocarcinoma) อย่างมาก พบมากในภาคอีสาน การหลีกเลี่ยงปลาน้ำจืดดิบเป็นวิธีป้องกันที่ดีที่สุด',
      },
    ],
    redFlags: [
      'ตาเหลือง ผิวเหลืองอย่างฉับพลัน',
      'ปวดท้องรุนแรงบริเวณชายโครงขวา',
      'ท้องโตขึ้นมากอย่างรวดเร็ว',
      'อาเจียนเป็นเลือดหรือถ่ายดำ (ภาวะตับแข็งแทรกซ้อน)',
    ],
    evidence: makeEvidence('Thai Association for the Study of the Liver (THASL) / AASLD HCC Guidelines', 'B', 2023),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากอายุรแพทย์โรคตับ',
  },

  'depression': {
    slug: 'depression',
    icd10: 'F32',
    nameTh: 'โรคซึมเศร้า (Depression)',
    nameEn: 'Major Depressive Disorder',
    nameTh_short: 'โรคซึมเศร้า',
    category: 'Mental Health',
    categoryTh: 'สุขภาพจิต',
    riskLevel: 'moderate',
    prevalence: '1 in 7 Thais affected',
    prevalenceTh: '1 ใน 7 คนไทยมีอาการซึมเศร้า',
    overview: {
      th: 'โรคซึมเศร้าเป็นความผิดปกติทางอารมณ์ที่พบบ่อยและรุนแรง ส่งผลกระทบต่อความรู้สึก ความคิด และการใช้ชีวิตประจำวัน ในไทยมีผู้ได้รับการวินิจฉัยเพิ่มขึ้นเรื่อยๆ แต่ส่วนใหญ่ยังไม่ได้รับการรักษาที่เหมาะสม โรคซึมเศร้ารักษาได้ผลดีหากได้รับความช่วยเหลือที่ถูกต้อง',
      en: 'Depression is a common but serious mood disorder that affects how you feel, think, and handle daily activities. Highly treatable when properly diagnosed and managed.',
    },
    earlySymptoms: [
      'รู้สึกเศร้า ว่างเปล่า หรือสิ้นหวังเกือบทุกวัน',
      'สูญเสียความสนใจในกิจกรรมที่เคยชอบ',
      'นอนหลับมากเกินไปหรือนอนไม่หลับ',
      'เบื่ออาหาร หรือกินมากเกินไป น้ำหนักเปลี่ยน',
      'รู้สึกไร้คุณค่า หรือรู้สึกผิดมากเกินเหตุ',
      'ไม่มีสมาธิ ตัดสินใจยาก',
      'อ่อนเพลีย ไม่มีแรง',
      'คิดถึงความตาย หรืออยากทำร้ายตัวเอง',
    ],
    riskFactors: [
      'ประวัติครอบครัวเป็นโรคซึมเศร้า',
      'เคยเป็นโรคซึมเศร้ามาก่อน',
      'ประสบเหตุการณ์เครียดหรือสูญเสีย',
      'โรคเรื้อรัง เช่น มะเร็ง เบาหวาน โรคหัวใจ',
      'ความผิดปกติของฮอร์โมน (ไทรอยด์)',
      'การใช้แอลกอฮอล์หรือสารเสพติด',
      'โดดเดี่ยวทางสังคม ขาดแรงสนับสนุน',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 12,
      frequency: 'ตรวจเมื่อมีอาการหรือปัจจัยเสี่ยง',
      tests: ['PHQ-9 (Patient Health Questionnaire)', 'PHQ-2 (การคัดกรองเบื้องต้น)', 'การประเมินโดยจิตแพทย์'],
      guidelineTh: 'กรมสุขภาพจิต กระทรวงสาธารณสุข / USPSTF',
    },
    whenToSeeDoctor: [
      'มีอาการซึมเศร้าติดต่อกันมากกว่า 2 สัปดาห์',
      'อาการส่งผลต่อการทำงานหรือการใช้ชีวิต',
      'มีความคิดทำร้ายตัวเอง — โทร 1323 ทันที',
      'เคยเป็นโรคซึมเศร้าและมีอาการกลับมา',
    ],
    treatmentOverview: 'การรักษาประกอบด้วยจิตบำบัด (Cognitive Behavioral Therapy) ยากลุ่ม SSRI/SNRI และการเปลี่ยนแปลงวิถีชีวิต ส่วนใหญ่ตอบสนองต่อการรักษาได้ดีภายใน 6-8 สัปดาห์',
    prevention: [
      'ดูแลสุขภาพกาย ออกกำลังกายสม่ำเสมอ',
      'รักษาความสัมพันธ์ทางสังคมที่ดี',
      'จัดการความเครียดอย่างสร้างสรรค์',
      'นอนหลับพักผ่อนให้เพียงพอ',
      'หลีกเลี่ยงแอลกอฮอล์และสารเสพติด',
      'ขอความช่วยเหลือเมื่อรู้สึกไม่ไหว',
    ],
    faqs: [
      {
        questionTh: 'โรคซึมเศร้าต่างจาก "เศร้าตามธรรมชาติ" อย่างไร?',
        answerTh: 'ความเศร้าตามธรรมชาติมักมีสาเหตุชัดเจนและหายไปเองใน 1-2 สัปดาห์ แต่โรคซึมเศร้าเกิดขึ้นนานกว่า 2 สัปดาห์ ส่งผลต่อการทำงาน ความสัมพันธ์ และสุขภาพ และมักต้องการการรักษาจากผู้เชี่ยวชาญ',
      },
      {
        questionTh: 'การกินยาต้านซึมเศร้าจะทำให้ติดยาไหม?',
        answerTh: 'ยาต้านซึมเศร้าไม่ทำให้เสพติดในแบบที่ยาเสพติดทำ แต่อาจมีอาการถอนยาหากหยุดยาอย่างฉับพลัน ควรหยุดยาภายใต้การดูแลของแพทย์เสมอ',
      },
    ],
    redFlags: [
      'ความคิดฆ่าตัวตายหรืออยากทำร้ายตัวเอง — โทร 1323 ทันที',
      'อาการรุนแรงจนไม่สามารถดูแลตัวเองได้',
      'มีอาการประสาทหลอนร่วมด้วย',
    ],
    evidence: makeEvidence('PHQ-9 Validation Study / Kroenke K et al.', 'A', 2001, 'PHQ-9 Patient Health Questionnaire'),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากจิตแพทย์',
  },

  'cardiovascular-disease': {
    slug: 'cardiovascular-disease',
    icd10: 'I25',
    nameTh: 'โรคหัวใจและหลอดเลือด (Cardiovascular Disease)',
    nameEn: 'Cardiovascular Disease',
    nameTh_short: 'โรคหัวใจและหลอดเลือด',
    category: 'Cardiovascular',
    categoryTh: 'หัวใจและหลอดเลือด',
    riskLevel: 'high',
    prevalence: 'Leading cause of death in Thailand',
    prevalenceTh: 'สาเหตุการเสียชีวิตอันดับ 1 ในประเทศไทย',
    overview: {
      th: 'โรคหัวใจและหลอดเลือด (CVD) ครอบคลุมภาวะต่างๆ เช่น หัวใจวาย (Heart Attack) โรคหลอดเลือดสมอง (Stroke) และหัวใจล้มเหลว (Heart Failure) เป็นสาเหตุการเสียชีวิตอันดับ 1 ในไทย แต่ 80% ของกรณีสามารถป้องกันได้ด้วยการควบคุมปัจจัยเสี่ยง',
      en: 'Cardiovascular disease encompasses heart attacks, strokes, and heart failure. It is the leading cause of death in Thailand, yet 80% of cases are preventable through risk factor management.',
    },
    earlySymptoms: [
      'เจ็บหน้าอกหรือแน่นหน้าอก โดยเฉพาะเวลาออกแรง',
      'หายใจลำบาก',
      'ใจสั่น หัวใจเต้นผิดปกติ',
      'บวมที่ขา ข้อเท้า หรือเท้า',
      'เวียนหัว หน้ามืด',
      'อ่อนเพลียง่ายผิดปกติ',
      'ปวดหรืออ่อนแรงที่แขนขา',
    ],
    riskFactors: [
      'ความดันโลหิตสูง (เสี่ยงสูงสุด)',
      'คอเลสเตอรอลสูง',
      'สูบบุหรี่',
      'เบาหวาน',
      'น้ำหนักเกิน/อ้วน',
      'ไม่ออกกำลังกาย',
      'ประวัติครอบครัวเป็น CVD',
      'อายุ (ชาย >45 ปี, หญิง >55 ปี)',
      'ความเครียดเรื้อรัง',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 40,
      frequency: 'ประเมินความเสี่ยง CVD ทุก 5 ปี หรือตามแพทย์แนะนำ',
      tests: ['Lipid Profile (คอเลสเตอรอล)', 'ความดันโลหิต', 'น้ำตาลในเลือด (HbA1c)', 'EKG', 'ดัชนี Framingham Risk Score'],
      guidelineTh: 'สมาคมแพทย์โรคหัวใจแห่งประเทศไทย / AHA/ACC Guidelines',
    },
    whenToSeeDoctor: [
      'อายุ 40 ปีขึ้นไปและยังไม่เคยประเมินความเสี่ยง CVD',
      'ความดันสูง เบาหวาน หรือคอเลสเตอรอลสูง',
      'สูบบุหรี่หรือเคยสูบ',
      'ประวัติครอบครัวเป็นโรคหัวใจตั้งแต่อายุน้อย',
      'เจ็บหน้าอกขณะออกแรง',
    ],
    treatmentOverview: 'การรักษาขึ้นอยู่กับชนิดและความรุนแรง ประกอบด้วยยา (Statin, Anti-hypertensives, Antiplatelet), การเปลี่ยนวิถีชีวิต, หรือการผ่าตัด (CABG, PCI/Stent)',
    prevention: [
      'ควบคุมความดันโลหิตให้ต่ำกว่า 130/80 mmHg',
      'ควบคุม LDL คอเลสเตอรอล',
      'งดสูบบุหรี่',
      'ออกกำลังกาย 150 นาทีต่อสัปดาห์',
      'รับประทานอาหาร Mediterranean style',
      'ควบคุมน้ำหนัก',
      'จัดการเบาหวานให้ได้ HbA1c <7%',
    ],
    faqs: [
      {
        questionTh: 'หัวใจวายกับหัวใจล้มเหลวต่างกันอย่างไร?',
        answerTh: 'หัวใจวาย (Heart Attack) คือหลอดเลือดอุดตันทำให้เนื้อเยื่อหัวใจตาย เป็นเหตุการณ์เฉียบพลัน ส่วนหัวใจล้มเหลว (Heart Failure) คือหัวใจสูบฉีดเลือดได้ไม่เพียงพอ มักเป็นภาวะเรื้อรังที่เกิดหลังจากหัวใจถูกทำลายสะสม',
      },
      {
        questionTh: 'Statin กินแล้วต้องกินตลอดชีวิตไหม?',
        answerTh: 'โดยทั่วไปใช่ เพราะ CVD เป็นโรคเรื้อรัง แต่ขึ้นอยู่กับระดับความเสี่ยงและการตอบสนองต่อยา บางคนที่ปรับวิถีชีวิตได้ดีมากอาจลดยาได้ภายใต้การดูแลของแพทย์',
      },
    ],
    redFlags: [
      'เจ็บหน้าอกรุนแรง ร้าวแขนซ้าย กราม — โทร 1669 ทันที',
      'หน้าเบี้ยว แขนอ่อนแรงครึ่งซีก พูดไม่ออก — สัญญาณ Stroke โทร 1669',
      'หายใจไม่ออกอย่างฉับพลัน',
      'หัวใจเต้นผิดปกติรุนแรง เป็นลม',
    ],
    evidence: makeEvidence('AHA/ACC Cardiovascular Risk Guidelines / Thai Cardiac Society Guidelines', 'A', 2023),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากอายุรแพทย์โรคหัวใจ',
  },

  'breast-cancer': {
    slug: 'breast-cancer',
    icd10: 'C50',
    nameTh: 'มะเร็งเต้านม (Breast Cancer)',
    nameEn: 'Breast Cancer',
    nameTh_short: 'มะเร็งเต้านม',
    category: 'Oncology',
    categoryTh: 'มะเร็งวิทยา',
    riskLevel: 'high',
    prevalence: '#1 cancer in Thai women',
    prevalenceTh: 'มะเร็งอันดับ 1 ในผู้หญิงไทย',
    overview: {
      th: 'มะเร็งเต้านมเป็นมะเร็งที่พบบ่อยที่สุดในผู้หญิงไทย อัตราการรอดชีวิต 5 ปีเมื่อพบในระยะ 1 สูงถึง 98% แต่ลดลงเหลือ 28% หากพบในระยะ 4 การตรวจเต้านมด้วยตนเองและ Mammogram จึงสำคัญมาก',
      en: 'Breast cancer is the most common cancer in Thai women. Five-year survival rate exceeds 98% when caught in stage 1 but drops to 28% at stage 4, making early detection critical.',
    },
    earlySymptoms: [
      'คลำพบก้อนที่เต้านมหรือรักแร้',
      'เต้านมเปลี่ยนขนาด รูปร่าง หรือแนว',
      'ผิวเต้านมเปลี่ยน เช่น หนาขึ้น ย่น หรือเหมือนเปลือกส้ม',
      'หัวนมบุ๋มเข้า หรือมีของเหลวผิดปกติออกจากหัวนม',
      'เจ็บที่เต้านม (ไม่ใช่อาการทั่วไปแต่ต้องระวัง)',
      'ผิวหนังบริเวณเต้านมแดงหรืออักเสบ',
    ],
    riskFactors: [
      'เพศหญิง (ความเสี่ยงสูงกว่าชายมาก)',
      'อายุมากกว่า 40 ปี',
      'ประวัติครอบครัวเป็นมะเร็งเต้านม',
      'มีประจำเดือนตั้งแต่อายุน้อย หรือหมดประจำเดือนช้า',
      'ไม่เคยตั้งครรภ์ หรือตั้งครรภ์ครั้งแรกหลังอายุ 30',
      'น้ำหนักเกินหลังหมดประจำเดือน',
      'ดื่มแอลกอฮอล์',
      'ยีน BRCA1/BRCA2 ผิดปกติ (ความเสี่ยงสูงมาก)',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 40,
      frequency: 'Mammogram ทุก 1-2 ปี ตั้งแต่อายุ 40-74 ปี / ตรวจเต้านมด้วยตนเองทุกเดือน',
      tests: ['Mammogram', 'อัลตราซาวด์เต้านม', 'MRI เต้านม (กลุ่มเสี่ยงสูงมาก)', 'การตรวจเต้านมด้วยตนเอง (BSE)'],
      guidelineTh: 'สมาคมโรคมะเร็งแห่งประเทศไทย / NCCN / ACS Guidelines',
    },
    whenToSeeDoctor: [
      'คลำพบก้อนที่เต้านมหรือรักแร้',
      'เต้านมหรือหัวนมเปลี่ยนแปลงรูปร่างอย่างชัดเจน',
      'มีประวัติครอบครัวเป็นมะเร็งเต้านมหรือรังไข่',
      'อายุ 40 ปีขึ้นไปและยังไม่เคยทำ Mammogram',
    ],
    treatmentOverview: 'ขึ้นอยู่กับระยะและชนิด ได้แก่ การผ่าตัด (lumpectomy/mastectomy) รังสีรักษา เคมีบำบัด ฮอร์โมนบำบัด และยาชีวภาพ (Targeted Therapy)',
    prevention: [
      'ตรวจเต้านมด้วยตนเองทุกเดือน',
      'รับการตรวจ Mammogram ตามวัย',
      'ควบคุมน้ำหนัก',
      'ออกกำลังกายสม่ำเสมอ',
      'ลดการดื่มแอลกอฮอล์',
      'ให้นมบุตร (ลดความเสี่ยงได้บ้าง)',
    ],
    faqs: [
      {
        questionTh: 'ผู้ชายเป็นมะเร็งเต้านมได้ไหม?',
        answerTh: 'ได้ แต่พบน้อยมาก ประมาณ 1% ของมะเร็งเต้านมทั้งหมด ผู้ชายที่พบก้อนที่บริเวณเต้านมควรพบแพทย์เพื่อตรวจสอบ',
      },
      {
        questionTh: 'ถ้าไม่มีประวัติครอบครัว ยังต้องตรวจ Mammogram ไหม?',
        answerTh: 'ใช่ มากกว่า 75% ของมะเร็งเต้านมเกิดในผู้หญิงที่ไม่มีประวัติครอบครัว อายุเป็นปัจจัยเสี่ยงหลัก ผู้หญิงอายุ 40 ปีขึ้นไปควรทำ Mammogram ตามแนะนำ',
      },
    ],
    redFlags: [
      'ก้อนที่เต้านมขยายใหญ่ขึ้นอย่างรวดเร็ว',
      'ผิวเต้านมแดง บวม ร้อน (อาจเป็น Inflammatory Breast Cancer)',
      'น้ำออกจากหัวนมโดยเฉพาะมีเลือดปน',
    ],
    evidence: makeEvidence('NCCN Breast Cancer Screening Guidelines / ACS Breast Cancer Guidelines', 'A', 2024),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากศัลยแพทย์มะเร็ง',
  },

  'lung-cancer': {
    slug: 'lung-cancer',
    icd10: 'C34',
    nameTh: 'มะเร็งปอด (Lung Cancer)',
    nameEn: 'Lung Cancer',
    nameTh_short: 'มะเร็งปอด',
    category: 'Oncology',
    categoryTh: 'มะเร็งวิทยา',
    riskLevel: 'very_high',
    prevalence: 'Top 5 cancer deaths in Thailand',
    prevalenceTh: 'อยู่ใน 5 อันดับแรกของมะเร็งที่ทำให้เสียชีวิตในไทย',
    overview: {
      th: 'มะเร็งปอดเป็นหนึ่งในมะเร็งที่อันตรายที่สุด เนื่องจากมักตรวจพบในระยะลุกลาม ปัจจัยเสี่ยงหลักคือการสูบบุหรี่ แต่มะเร็งปอดในผู้ไม่สูบบุหรี่ก็พบได้ โดยเฉพาะในผู้หญิงเอเชีย การตรวจคัดกรองด้วย Low-dose CT (LDCT) แนะนำสำหรับกลุ่มเสี่ยงสูง',
      en: 'Lung cancer is one of the deadliest cancers, often diagnosed late. Smoking is the primary risk factor but lung cancer in non-smokers is increasing, particularly among Asian women. LDCT screening is recommended for high-risk groups.',
    },
    earlySymptoms: [
      'มักไม่มีอาการในระยะแรก',
      'ไอเรื้อรัง หรือไอเปลี่ยนลักษณะ',
      'เสมหะปนเลือด',
      'หายใจลำบาก หอบเหนื่อย',
      'เสียงแหบ',
      'เจ็บหน้าอกต่อเนื่อง',
      'น้ำหนักลด อ่อนเพลีย',
      'ปอดบวมซ้ำๆ หรือหายช้า',
    ],
    riskFactors: [
      'สูบบุหรี่ (ความเสี่ยงสูงสุด)',
      'สัมผัสควันบุหรี่มือสอง',
      'สัมผัสก๊าซเรดอน',
      'สัมผัสแร่ใยหิน (Asbestos)',
      'มลพิษทางอากาศ ฝุ่น PM2.5',
      'ประวัติครอบครัวเป็นมะเร็งปอด',
      'เคยเป็นมะเร็งปอดหรือได้รับรังสีรักษาบริเวณทรวงอก',
    ],
    screeningInfo: {
      recommended: true,
      from_age: 50,
      frequency: 'Low-dose CT (LDCT) ทุกปี สำหรับกลุ่มเสี่ยงสูง',
      tests: ['Low-dose CT scan (LDCT)', 'Chest X-ray (ความไวต่ำกว่า LDCT)'],
      guidelineTh: 'NCCN Lung Cancer Screening / USPSTF Guidelines — กลุ่มเสี่ยงสูง: อายุ 50-80, สูบบุหรี่ ≥20 pack-years',
    },
    whenToSeeDoctor: [
      'ไอเรื้อรังมากกว่า 3 สัปดาห์ไม่หาย',
      'มีเสมหะปนเลือด',
      'สูบบุหรี่มากกว่า 20 ปีและอายุ 50 ปีขึ้นไป',
      'หายใจลำบากและน้ำหนักลด',
    ],
    treatmentOverview: 'ขึ้นอยู่กับระยะและชนิด (NSCLC vs SCLC) ได้แก่ การผ่าตัด รังสีรักษา เคมีบำบัด Immunotherapy และ Targeted Therapy (EGFR, ALK)',
    prevention: [
      'งดสูบบุหรี่ — วิธีป้องกันที่ดีที่สุด (ลดความเสี่ยง 80-90%)',
      'หลีกเลี่ยงสัมผัสควันบุหรี่มือสอง',
      'ลดการสัมผัสมลพิษ PM2.5',
      'ตรวจคัดกรอง LDCT หากอยู่ในกลุ่มเสี่ยงสูง',
    ],
    faqs: [
      {
        questionTh: 'ไม่สูบบุหรี่ก็เป็นมะเร็งปอดได้ไหม?',
        answerTh: 'ได้ ประมาณ 15-20% ของมะเร็งปอดเกิดในผู้ที่ไม่เคยสูบบุหรี่ พบมากในผู้หญิงเอเชีย อาจสัมพันธ์กับมลพิษ การปรุงอาหาร และพันธุกรรม มะเร็งปอดในกลุ่มนี้มักมี EGFR mutation ซึ่งตอบสนองต่อยาแบบ Targeted Therapy ได้ดี',
      },
    ],
    redFlags: [
      'เสมหะปนเลือดหรือไอเป็นเลือด',
      'ไอเรื้อรังร่วมกับน้ำหนักลดอย่างมาก',
      'เจ็บหน้าอกต่อเนื่องและหายใจลำบากมากขึ้น',
    ],
    evidence: makeEvidence('NCCN Lung Cancer Screening Guidelines v2024 / USPSTF Lung Cancer Screening', 'A', 2024),
    lastReviewed: '2026-06',
    reviewerPlaceholder: 'รอการรับรองจากอายุรแพทย์ระบบทางเดินหายใจ',
  },
}

export function getDiseaseData(slug: string): DiseasePageData | null {
  return DISEASE_DATA[slug] ?? null
}

export function getAllDiseaseSlugs(): string[] {
  return Object.keys(DISEASE_DATA)
}
