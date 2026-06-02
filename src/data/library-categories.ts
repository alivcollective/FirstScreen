// Health Library Category Config
// 7 categories with articles, disease links, assessments

import {
  Heart, Droplets, Ribbon, Activity, Utensils,
  Dumbbell, Moon, type LucideIcon,
} from 'lucide-react'

export interface LibraryCategory {
  slug: string
  nameTh: string
  nameEn: string
  descriptionTh: string
  icon: LucideIcon
  color: string           // text color
  bg: string              // bg color
  border: string          // border color
  gradientFrom: string    // tailwind gradient class
  articleCategory: string // matches Article.category
  relatedDiseases: string[]
  relatedAssessmentHref?: string
  keyStats: { value: string; label: string }[]
  tips: string[]
}

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  {
    slug: 'heart',
    nameTh: 'สุขภาพหัวใจ',
    nameEn: 'Heart Health',
    descriptionTh: 'โรคหัวใจเป็นสาเหตุการเสียชีวิตอันดับ 1 ในไทย 80% ป้องกันได้ด้วยความรู้ที่ถูกต้อง',
    icon: Heart,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    gradientFrom: 'from-red-900',
    articleCategory: 'heart',
    relatedDiseases: ['heart-disease', 'stroke', 'hypertension'],
    relatedAssessmentHref: '/risk#cvd',
    keyStats: [
      { value: '27%', label: 'ของการเสียชีวิตในไทย' },
      { value: '80%', label: 'ป้องกันได้' },
      { value: '60,000+', label: 'รายใหม่/ปี' },
    ],
    tips: [
      'ออกกำลังกาย 150 นาที/สัปดาห์',
      'ตรวจความดันและคอเลสเตอรอลทุกปี',
      'งดสูบบุหรี่',
      'ควบคุมน้ำหนัก BMI <23',
    ],
  },
  {
    slug: 'diabetes',
    nameTh: 'เบาหวาน',
    nameEn: 'Diabetes',
    descriptionTh: 'เบาหวานชนิดที่ 2 ป้องกันได้ถึง 58% ด้วยการปรับวิถีชีวิต ก่อนที่จะต้องพึ่งยา',
    icon: Droplets,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    gradientFrom: 'from-amber-900',
    articleCategory: 'diabetes',
    relatedDiseases: ['type-2-diabetes', 'hypertension'],
    relatedAssessmentHref: '/risk#diabetes',
    keyStats: [
      { value: '5M+', label: 'คนไทยเป็นเบาหวาน' },
      { value: '1/3', label: 'ไม่รู้ว่าตนเองป่วย' },
      { value: '58%', label: 'ป้องกันได้ด้วย lifestyle' },
    ],
    tips: [
      'ตรวจน้ำตาลทุกปีถ้าอายุ 35+',
      'ลดน้ำหนัก 5-7% ถ้าอ้วน',
      'ลดอาหารหวาน/แป้งขัดสี',
      'ออกกำลังกายสม่ำเสมอ',
    ],
  },
  {
    slug: 'cancer',
    nameTh: 'มะเร็ง',
    nameEn: 'Cancer',
    descriptionTh: 'มะเร็งระยะที่ 1 อัตราการรอดชีวิต 90%+ การตรวจคัดกรองคือการลงทุนที่คุ้มค่าที่สุด',
    icon: Ribbon,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    gradientFrom: 'from-violet-900',
    articleCategory: 'cancer',
    relatedDiseases: ['breast-cancer', 'lung-cancer', 'colorectal-cancer'],
    relatedAssessmentHref: '/risk#cancer',
    keyStats: [
      { value: '140,000', label: 'รายใหม่/ปีในไทย' },
      { value: '90%+', label: 'รอดชีวิตถ้าพบระยะ 1' },
      { value: '30-50%', label: 'ป้องกันได้ด้วยวิถีชีวิต' },
    ],
    tips: [
      'Mammogram สำหรับผู้หญิง 40+',
      'Colonoscopy สำหรับทุกคน 45+',
      'เลิกสูบบุหรี่ลดเสี่ยงมะเร็งปอด 80-90%',
      'ฉีดวัคซีน HPV ป้องกันมะเร็งปากมดลูก',
    ],
  },
  {
    slug: 'hypertension',
    nameTh: 'ความดันโลหิต',
    nameEn: 'Hypertension',
    descriptionTh: '1 ใน 3 ของผู้ใหญ่ไทยมีความดันสูง ส่วนใหญ่ไม่รู้ตัวเพราะไม่มีอาการ จนกว่าจะสายเกินไป',
    icon: Activity,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    gradientFrom: 'from-orange-900',
    articleCategory: 'hypertension',
    relatedDiseases: ['hypertension', 'heart-disease', 'stroke'],
    relatedAssessmentHref: '/risk#cvd',
    keyStats: [
      { value: '13M', label: 'คนไทยมีความดันสูง' },
      { value: '1/3', label: 'ไม่ทราบว่าป่วย' },
      { value: '120/80', label: 'ค่าปกติ (mmHg)' },
    ],
    tips: [
      'วัดความดันทุก 6 เดือน',
      'ลดเกลือ <2300 มก./วัน',
      'ออกกำลังกายแอโรบิก',
      'ลดน้ำหนัก (ทุก 1 กก. ≈ ลดความดัน 1 mmHg)',
    ],
  },
  {
    slug: 'nutrition',
    nameTh: 'โภชนาการ',
    nameEn: 'Nutrition',
    descriptionTh: 'อาหารที่ถูกต้องลดความเสี่ยงโรคร้ายแรงได้ 30-50% ไม่ใช่แค่เรื่องน้ำหนัก แต่คือสุขภาพระยะยาว',
    icon: Utensils,
    color: 'text-lime-600',
    bg: 'bg-lime-50',
    border: 'border-lime-200',
    gradientFrom: 'from-lime-900',
    articleCategory: 'nutrition',
    relatedDiseases: ['heart-disease', 'type-2-diabetes', 'colorectal-cancer'],
    keyStats: [
      { value: '30%', label: 'ลดเสี่ยงหัวใจด้วย Med Diet' },
      { value: '5+', label: 'มื้อผักผลไม้ต่อวัน' },
      { value: '50%', label: 'โรคเรื้อรังป้องกันได้ด้วยอาหาร' },
    ],
    tips: [
      'ผัก 3 มื้อ ผลไม้ 2 มื้อต่อวัน',
      'เลือกธัญพืชไม่ขัดสี',
      'ปลาทะเล 2-3 ครั้ง/สัปดาห์',
      'ลดน้ำตาลและแป้งขัดสี',
    ],
  },
  {
    slug: 'exercise',
    nameTh: 'การออกกำลังกาย',
    nameEn: 'Exercise',
    descriptionTh: 'WHO แนะนำ 150 นาที/สัปดาห์ ลดความเสี่ยงโรคหัวใจ 35% เบาหวาน 50% และยืดอายุได้จริง',
    icon: Dumbbell,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    gradientFrom: 'from-green-900',
    articleCategory: 'exercise',
    relatedDiseases: ['heart-disease', 'type-2-diabetes'],
    relatedAssessmentHref: '/screening',
    keyStats: [
      { value: '35%', label: 'ลดเสี่ยงหัวใจ' },
      { value: '50%', label: 'ลดเสี่ยงเบาหวาน' },
      { value: '3-7 ปี', label: 'ยืดอายุเฉลี่ย' },
    ],
    tips: [
      '150 นาที/สัปดาห์ระดับปานกลาง',
      'Strength training 2 ครั้ง/สัปดาห์',
      'ลุกยืนทุกชั่วโมงเมื่อนั่งนาน',
      'แม้แค่เดิน 30 นาที/วัน ก็มีประโยชน์',
    ],
  },
  {
    slug: 'sleep',
    nameTh: 'การนอนหลับ',
    nameEn: 'Sleep',
    descriptionTh: 'นอน <6 ชั่วโมงเพิ่มความเสี่ยงโรคหัวใจ 45% เบาหวาน 37% การนอนหลับไม่ใช่ความสุรุ่ยสุร่าย',
    icon: Moon,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    gradientFrom: 'from-indigo-900',
    articleCategory: 'sleep',
    relatedDiseases: ['heart-disease', 'type-2-diabetes'],
    keyStats: [
      { value: '45%', label: 'เพิ่มเสี่ยงหัวใจถ้านอน <6 ชม.' },
      { value: '7-9 ชม.', label: 'ที่แนะนำสำหรับผู้ใหญ่' },
      { value: '1 ใน 3', label: 'ชาวไทยนอนไม่เพียงพอ' },
    ],
    tips: [
      'เข้านอน-ตื่นเวลาเดิมทุกวัน',
      'งดหน้าจอ 1 ชม. ก่อนนอน',
      'ห้องนอนเย็น มืด เงียบ',
      'งดคาเฟอีนหลังบ่าย 2',
    ],
  },
]

export function getCategoryBySlug(slug: string): LibraryCategory | null {
  return LIBRARY_CATEGORIES.find(c => c.slug === slug) ?? null
}

export function getAllCategorySlugs(): string[] {
  return LIBRARY_CATEGORIES.map(c => c.slug)
}
