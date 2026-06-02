// Universal Search Engine — FirstScreen
// Searches diseases, symptoms, assessments, articles, guidelines
// Ranked by relevance score (multi-field weighted scoring)

import { ARTICLES } from '@/data/articles'
import { RICH_DISEASES } from '@/data/diseases/index'
import { getAllGuidelines } from '@/data/guidelines'

export type SearchCategory = 'disease' | 'symptom' | 'assessment' | 'article' | 'screening' | 'guideline'

export interface SearchResult {
  id: string
  category: SearchCategory
  title: string
  titleEn?: string
  subtitle?: string
  excerpt?: string
  href: string
  score: number
  tags?: string[]
}

// ── Static symptom corpus ─────────────────────────────────────

const SYMPTOMS: SearchResult[] = [
  { id: 's-chest', category: 'symptom', title: 'เจ็บหน้าอก', titleEn: 'Chest pain', subtitle: 'อาจเกี่ยวข้องกับหัวใจ โรคกรดไหลย้อน หรือปอด', href: '/symptoms', score: 0, tags: ['chest', 'หน้าอก', 'เจ็บ', 'pain'] },
  { id: 's-headache', category: 'symptom', title: 'ปวดหัว', titleEn: 'Headache', subtitle: 'ปวดหัวตึง ปวดหัวข้าง ปวดหัวรุนแรง', href: '/symptoms', score: 0, tags: ['ปวดหัว', 'headache', 'migraine', 'ไมเกรน'] },
  { id: 's-dizzy', category: 'symptom', title: 'เวียนหัว มึนงง', titleEn: 'Dizziness', subtitle: 'รู้สึกบ้านหมุน ทรงตัวไม่ได้', href: '/symptoms', score: 0, tags: ['เวียน', 'มึน', 'dizziness', 'vertigo'] },
  { id: 's-cough', category: 'symptom', title: 'ไอ', titleEn: 'Cough', subtitle: 'ไอเรื้อรัง ไอมีเสมหะ ไอแห้ง', href: '/symptoms', score: 0, tags: ['ไอ', 'cough', 'เสมหะ'] },
  { id: 's-fatigue', category: 'symptom', title: 'อ่อนเพลีย เหนื่อยล้า', titleEn: 'Fatigue', subtitle: 'เหนื่อยง่ายผิดปกติ ไม่มีแรง', href: '/symptoms', score: 0, tags: ['อ่อนเพลีย', 'เหนื่อย', 'fatigue', 'weakness'] },
  { id: 's-breath', category: 'symptom', title: 'หายใจไม่สะดวก', titleEn: 'Shortness of breath', subtitle: 'หายใจลำบาก หายใจไม่อิ่ม', href: '/symptoms', score: 0, tags: ['หายใจ', 'breath', 'dyspnea', 'หอบ'] },
  { id: 's-palpitation', category: 'symptom', title: 'ใจสั่น', titleEn: 'Palpitation', subtitle: 'หัวใจเต้นเร็ว เต้นแรง ไม่สม่ำเสมอ', href: '/symptoms', score: 0, tags: ['ใจสั่น', 'palpitation', 'หัวใจ'] },
  { id: 's-abdo', category: 'symptom', title: 'ปวดท้อง', titleEn: 'Abdominal pain', subtitle: 'ปวดท้องด้านบน ด้านล่าง ปวดรอบสะดือ', href: '/symptoms', score: 0, tags: ['ปวดท้อง', 'abdominal', 'stomach'] },
  { id: 's-lump', category: 'symptom', title: 'คลำพบก้อน', titleEn: 'Lump / Mass', subtitle: 'ก้อนที่เต้านม คอ รักแร้ หรือที่ใดก็ตาม', href: '/symptoms', score: 0, tags: ['ก้อน', 'lump', 'mass', 'เนื้องอก'] },
  { id: 's-numb', category: 'symptom', title: 'ชาหรืออ่อนแรงครึ่งซีก', titleEn: 'Hemiparesis', subtitle: 'สัญญาณ Stroke — ต้องพบแพทย์ฉุกเฉิน', href: '/symptoms', score: 0, tags: ['ชา', 'อ่อนแรง', 'stroke', 'FAST'] },
  { id: 's-weight', category: 'symptom', title: 'น้ำหนักลดโดยไม่ตั้งใจ', titleEn: 'Unexplained weight loss', subtitle: 'น้ำหนักลด >5% ใน 6 เดือนโดยไม่ได้ตั้งใจ', href: '/symptoms', score: 0, tags: ['น้ำหนักลด', 'weight loss', 'มะเร็ง'] },
  { id: 's-bleed', category: 'symptom', title: 'เลือดออกผิดปกติ', titleEn: 'Abnormal bleeding', subtitle: 'เลือดออกทางทวารหนัก ปัสสาวะ หรือไอเป็นเลือด', href: '/symptoms', score: 0, tags: ['เลือด', 'blood', 'bleeding', 'เลือดออก'] },
  { id: 's-fever', category: 'symptom', title: 'ไข้', titleEn: 'Fever', subtitle: 'อุณหภูมิร่างกายสูงกว่า 37.5°C', href: '/symptoms', score: 0, tags: ['ไข้', 'fever', 'temperature'] },
  { id: 's-urinate', category: 'symptom', title: 'ปัสสาวะบ่อย กระหายน้ำมาก', titleEn: 'Polyuria / Polydipsia', subtitle: 'สัญญาณเบาหวาน — ปัสสาวะบ่อย กระหายน้ำผิดปกติ', href: '/symptoms', score: 0, tags: ['ปัสสาวะ', 'กระหาย', 'เบาหวาน', 'polyuria'] },
  { id: 's-vision', category: 'symptom', title: 'ตาพร่า มองภาพซ้อน', titleEn: 'Visual disturbance', subtitle: 'ตามัว ตาพร่า มองเห็นภาพซ้อน', href: '/symptoms', score: 0, tags: ['ตา', 'vision', 'มองเห็น', 'ตาพร่า'] },
]

const ASSESSMENTS: SearchResult[] = [
  { id: 'cvd-risk', category: 'assessment', title: 'ประเมินความเสี่ยงหัวใจและหลอดเลือด', titleEn: 'CVD Risk Assessment', subtitle: 'Framingham — ความเสี่ยงหัวใจ 10 ปี · อายุ 30-79 ปี', href: '/risk#cvd', score: 0, tags: ['หัวใจ', 'CVD', 'framingham', 'โรคหัวใจ'] },
  { id: 'diabetes-risk', category: 'assessment', title: 'ประเมินความเสี่ยงเบาหวาน', titleEn: 'Diabetes Risk', subtitle: 'FINDRISC — ปรับสำหรับประชากรเอเชีย', href: '/risk#diabetes', score: 0, tags: ['เบาหวาน', 'diabetes', 'FINDRISC', 'น้ำตาล'] },
  { id: 'cancer-risk', category: 'assessment', title: 'ประเมินความเสี่ยงมะเร็ง', titleEn: 'Cancer Risk', subtitle: '5 ชนิด: เต้านม ปากมดลูก ลำไส้ใหญ่ ตับ ปอด', href: '/risk#cancer', score: 0, tags: ['มะเร็ง', 'cancer', 'breast', 'lung', 'colorectal'] },
  { id: 'mental-health', category: 'assessment', title: 'ตรวจสุขภาพจิต', titleEn: 'Mental Health Screening', subtitle: 'PHQ-9 ซึมเศร้า + GAD-7 วิตกกังวล', href: '/risk#mental', score: 0, tags: ['สุขภาพจิต', 'ซึมเศร้า', 'depression', 'anxiety', 'PHQ'] },
  { id: 'symptom-checker', category: 'assessment', title: 'ตรวจอาการเบื้องต้น', titleEn: 'Clinical Symptom Checker', subtitle: '7 ขั้นตอน · OLDCARTS · วิเคราะห์อาการ', href: '/symptoms', score: 0, tags: ['อาการ', 'symptom', 'ตรวจอาการ', 'differential'] },
]

const SCREENING_ITEMS: SearchResult[] = [
  { id: 'mammogram', category: 'screening', title: 'Mammogram', subtitle: 'คัดกรองมะเร็งเต้านม · ผู้หญิง 40+ ปี · ทุก 1-2 ปี', href: '/screening', score: 0, tags: ['mammogram', 'มะเร็งเต้านม', 'breast', 'คัดกรอง'] },
  { id: 'colonoscopy', category: 'screening', title: 'Colonoscopy', subtitle: 'ส่องกล้องลำไส้ใหญ่ · ทุกคน 45+ ปี · ทุก 10 ปี', href: '/screening', score: 0, tags: ['colonoscopy', 'ลำไส้', 'มะเร็งลำไส้', 'colorectal'] },
  { id: 'pap-smear', category: 'screening', title: 'Pap Smear / HPV Test', subtitle: 'คัดกรองมะเร็งปากมดลูก · ผู้หญิง 25-65 ปี', href: '/screening', score: 0, tags: ['pap smear', 'HPV', 'มะเร็งปากมดลูก', 'cervical'] },
  { id: 'blood-sugar', category: 'screening', title: 'ตรวจน้ำตาลในเลือด (FBS/HbA1c)', subtitle: 'คัดกรองเบาหวาน · ทุกคน 35+ ปี · ทุกปี', href: '/screening', score: 0, tags: ['น้ำตาล', 'FBS', 'HbA1c', 'เบาหวาน', 'blood sugar'] },
  { id: 'blood-pressure', category: 'screening', title: 'วัดความดันโลหิต', subtitle: 'คัดกรองความดันสูง · ทุก 6-12 เดือน', href: '/screening', score: 0, tags: ['ความดัน', 'blood pressure', 'hypertension'] },
  { id: 'lipid-panel', category: 'screening', title: 'Lipid Panel (ไขมันในเลือด)', subtitle: 'คอเลสเตอรอล, Triglycerides · อายุ 35+ ปี', href: '/screening', score: 0, tags: ['คอเลสเตอรอล', 'ไขมัน', 'lipid', 'cholesterol'] },
]

// ── Build dynamic disease corpus from rich data ───────────────

function buildDiseaseCorpus(): SearchResult[] {
  return Object.values(RICH_DISEASES).map(d => ({
    id: d.slug,
    category: 'disease' as SearchCategory,
    title: d.nameTh_short,
    titleEn: d.nameEn,
    subtitle: `${d.icd10} · ${d.categoryTh} · ${d.stats.prevalenceThailand}`,
    excerpt: d.shortDescriptionTh,
    href: `/diseases/${d.slug}`,
    score: 0,
    tags: d.keywords ?? [],
  }))
}

// ── Build article corpus from static data ─────────────────────

function buildArticleCorpus(): SearchResult[] {
  return ARTICLES.map(a => ({
    id: a.slug,
    category: 'article' as SearchCategory,
    title: a.titleTh,
    subtitle: `${a.categoryTh} · ${a.readTimeMinutes} นาที`,
    excerpt: a.excerptTh,
    href: `/articles/${a.slug}`,
    score: 0,
    tags: a.tags,
  }))
}

// ── Build guideline corpus ────────────────────────────────────

function buildGuidelineCorpus(): SearchResult[] {
  return getAllGuidelines().map(g => ({
    id: `guideline-${g.diseaseSlug}`,
    category: 'guideline' as SearchCategory,
    title: `แนวทางคัดกรอง ${g.diseaseNameTh}`,
    titleEn: `${g.diseaseNameEn} Screening Guidelines`,
    subtitle: `${g.recommendations.length} แนวทาง · ไทย vs WHO vs USPSTF`,
    excerpt: g.thaiContext,
    href: `/guidelines/${g.diseaseSlug}`,
    score: 0,
    tags: [g.diseaseNameTh, g.diseaseNameEn, g.icd10, 'guideline', 'แนวทาง', 'คัดกรอง', 'screening'],
  }))
}

// ── Scoring engine ────────────────────────────────────────────

const CATEGORY_BOOST: Record<SearchCategory, number> = {
  disease: 1.3,
  guideline: 1.25,
  article: 1.2,
  assessment: 1.1,
  symptom: 1.0,
  screening: 0.9,
}

function scoreItem(item: SearchResult, query: string): number {
  const q = query.toLowerCase().trim()
  const terms = q.split(/\s+/).filter(t => t.length >= 2)
  const title = item.title.toLowerCase()
  const titleEn = (item.titleEn ?? '').toLowerCase()
  const sub = (item.subtitle ?? '').toLowerCase()
  const excerpt = (item.excerpt ?? '').toLowerCase()
  const tags = (item.tags ?? []).join(' ').toLowerCase()

  let score = 0

  // Exact full match → highest
  if (title === q || titleEn === q) score += 200

  // Starts with → very high
  if (title.startsWith(q) || titleEn.startsWith(q)) score += 120

  // Contains full query → high
  if (title.includes(q)) score += 80
  if (titleEn.includes(q)) score += 60
  if (excerpt.includes(q)) score += 30
  if (sub.includes(q)) score += 25
  if (tags.includes(q)) score += 40

  // Per-term scoring
  for (const term of terms) {
    if (title.includes(term)) score += 30
    if (titleEn.includes(term)) score += 20
    if (tags.includes(term)) score += 25
    if (sub.includes(term)) score += 10
    if (excerpt.includes(term)) score += 8
  }

  // Apply category boost
  score *= CATEGORY_BOOST[item.category]

  return score
}

// ── Main search function ──────────────────────────────────────

export interface SearchResultsGrouped {
  diseases: SearchResult[]
  symptoms: SearchResult[]
  assessments: SearchResult[]
  articles: SearchResult[]
  screening: SearchResult[]
  guidelines: SearchResult[]
  all: SearchResult[]
  total: number
  query: string
}

export function search(query: string, maxPerCategory = 5): SearchResultsGrouped {
  if (!query.trim()) {
    return { diseases: [], symptoms: [], assessments: [], articles: [], screening: [], guidelines: [], all: [], total: 0, query }
  }

  const corpus: SearchResult[] = [
    ...buildDiseaseCorpus(),
    ...SYMPTOMS,
    ...ASSESSMENTS,
    ...buildArticleCorpus(),
    ...SCREENING_ITEMS,
    ...buildGuidelineCorpus(),
  ]

  const scored = corpus
    .map(item => ({ ...item, score: scoreItem(item, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const diseases = scored.filter(r => r.category === 'disease').slice(0, maxPerCategory)
  const symptoms = scored.filter(r => r.category === 'symptom').slice(0, maxPerCategory)
  const assessments = scored.filter(r => r.category === 'assessment').slice(0, maxPerCategory)
  const articles = scored.filter(r => r.category === 'article').slice(0, maxPerCategory)
  const screening = scored.filter(r => r.category === 'screening').slice(0, maxPerCategory)
  const guidelines = scored.filter(r => r.category === 'guideline').slice(0, maxPerCategory)

  const all = scored.slice(0, 20)

  return {
    diseases, symptoms, assessments, articles, screening, guidelines,
    all,
    total: scored.length,
    query,
  }
}

// ── Suggestions for empty state / autocomplete ───────────────

export const SUGGESTED_QUERIES = [
  'เจ็บหน้าอก',
  'เวียนหัว',
  'เบาหวาน',
  'ความดันโลหิตสูง',
  'มะเร็งเต้านม',
  'ส่องกล้องลำไส้ใหญ่',
  'ซึมเศร้า',
  'น้ำหนักลด',
  'หายใจไม่สะดวก',
  'ตรวจหัวใจ',
]
