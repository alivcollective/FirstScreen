export const SUPPORTED_LANGUAGES = [
  { code: 'th', name: 'ภาษาไทย', englishName: 'Thai', flag: '🇹🇭' },
  { code: 'en', name: 'English', englishName: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', englishName: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', englishName: 'Korean', flag: '🇰🇷' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay', flag: '🇲🇾' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', flag: '🇮🇩' },
] as const

export const RISK_COLORS = {
  low: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', hex: '#10b981' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hex: '#f59e0b' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', hex: '#f97316' },
  very_high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', hex: '#ef4444' },
} as const

export const URGENCY_COLORS = {
  routine: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Routine' },
  soon: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'See a Doctor Soon' },
  urgent: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Seek Care Urgently' },
  emergency: { bg: 'bg-red-50', text: 'text-red-700', label: 'Emergency — Call Now' },
} as const

export const EVIDENCE_GRADES = {
  A: { label: 'Strong', description: 'Multiple high-quality RCTs or systematic reviews', color: 'text-emerald-600' },
  B: { label: 'Moderate', description: 'Well-designed trials or consistent observational studies', color: 'text-blue-600' },
  C: { label: 'Limited', description: 'Expert consensus or limited evidence', color: 'text-amber-600' },
  D: { label: 'Expert Opinion', description: 'Based on clinical experience and expert judgment', color: 'text-gray-600' },
} as const

export const BODY_SYSTEMS = [
  'cardiovascular',
  'respiratory',
  'neurological',
  'gastrointestinal',
  'musculoskeletal',
  'endocrine',
  'reproductive',
  'urinary',
  'dermatological',
  'ophthalmological',
  'mental_health',
  'immunological',
  'oncological',
] as const

export const SCREENING_CATEGORIES = [
  { id: 'cancer', label: 'Cancer Screening', icon: 'ribbon' },
  { id: 'cardiovascular', label: 'Heart Health', icon: 'heart' },
  { id: 'diabetes', label: 'Diabetes', icon: 'droplet' },
  { id: 'mental_health', label: 'Mental Health', icon: 'brain' },
  { id: 'womens_health', label: "Women's Health", icon: 'user' },
  { id: 'mens_health', label: "Men's Health", icon: 'user' },
  { id: 'bone_health', label: 'Bone Health', icon: 'activity' },
  { id: 'vision_hearing', label: 'Vision & Hearing', icon: 'eye' },
] as const

export const MEDICAL_DISCLAIMER = {
  en: 'Health Compass provides health education and navigation information only. This is not medical advice and should not replace consultation with a qualified healthcare professional. Always seek the advice of your physician for any medical conditions.',
  th: 'Health Compass ให้ข้อมูลด้านสุขภาพเพื่อการศึกษาและการนำทางเท่านั้น ข้อมูลนี้ไม่ใช่คำแนะนำทางการแพทย์ และไม่ควรนำมาแทนที่การปรึกษากับผู้เชี่ยวชาญด้านการแพทย์ที่ผ่านการรับรอง',
} as const

export const EMERGENCY_NUMBERS = {
  TH: { general: '1669', police: '191', label: 'Thailand Emergency' },
  SG: { general: '995', police: '999', label: 'Singapore Emergency' },
  MY: { general: '999', police: '999', label: 'Malaysia Emergency' },
} as const
