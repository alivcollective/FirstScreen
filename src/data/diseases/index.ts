// Disease Data Registry
// Aggregates rich disease data + maps to existing disease-data.ts slugs

import type { RichDisease, DiseaseCard } from '@/types/disease'
import { toCard } from '@/types/disease'
import breastCancer from './breast-cancer'
import type2Diabetes from './type-2-diabetes'
import hypertension from './hypertension'

// All rich diseases indexed by slug
export const RICH_DISEASES: Record<string, RichDisease> = {
  'breast-cancer': breastCancer,
  'type-2-diabetes': type2Diabetes,
  'hypertension': hypertension,
}

export function getRichDisease(slug: string): RichDisease | null {
  return RICH_DISEASES[slug] ?? null
}

export function getAllRichSlugs(): string[] {
  return Object.keys(RICH_DISEASES)
}

export function getAllDiseaseCards(): DiseaseCard[] {
  return Object.values(RICH_DISEASES).map(toCard)
}

// Supplementary cards for diseases that exist in disease-data.ts
// but don't have rich data yet — used for index page listing
import { RISK_COLORS } from '@/lib/constants'
import type { DiseaseCategory } from '@/types/disease'

interface LegacyDiseaseCard {
  slug: string
  nameTh: string
  nameTh_short: string
  nameEn: string
  category: DiseaseCategory
  categoryTh: string
  icd10: string
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high'
  shortDescriptionTh: string
  stats: { prevalenceThailand: string; primaryRiskGroupTh: string }
  lastReviewed: string
  isRich: boolean
}

export const LEGACY_DISEASE_CARDS: LegacyDiseaseCard[] = [
  {
    slug: 'cervical-cancer',
    nameTh: 'มะเร็งปากมดลูก (Cervical Cancer)',
    nameTh_short: 'มะเร็งปากมดลูก',
    nameEn: 'Cervical Cancer',
    category: 'cancer',
    categoryTh: 'มะเร็งวิทยา',
    icd10: 'C53',
    riskLevel: 'high',
    shortDescriptionTh: 'ป้องกันได้เกือบ 100% ด้วยวัคซีน HPV และ Pap Smear — มะเร็งอันดับ 2 ในผู้หญิงไทย',
    stats: { prevalenceThailand: 'มะเร็งอันดับ 2 ในผู้หญิงไทย', primaryRiskGroupTh: 'ผู้หญิงอายุ 25-65 ปี' },
    lastReviewed: '2026-06',
    isRich: false,
  },
  {
    slug: 'colorectal-cancer',
    nameTh: 'มะเร็งลำไส้ใหญ่ (Colorectal Cancer)',
    nameTh_short: 'มะเร็งลำไส้ใหญ่',
    nameEn: 'Colorectal Cancer',
    category: 'cancer',
    categoryTh: 'มะเร็งวิทยา',
    icd10: 'C18',
    riskLevel: 'moderate',
    shortDescriptionTh: 'ตรวจพบระยะแรก อัตราการรอดชีวิต 5 ปีสูง 90% — ตรวจได้ด้วยการส่องกล้องลำไส้',
    stats: { prevalenceThailand: 'อัตราสูงขึ้นเรื่อยๆ', primaryRiskGroupTh: 'ผู้ใหญ่อายุ 45 ปีขึ้นไป' },
    lastReviewed: '2026-06',
    isRich: false,
  },
  {
    slug: 'liver-cancer',
    nameTh: 'มะเร็งตับ (Liver Cancer)',
    nameTh_short: 'มะเร็งตับ',
    nameEn: 'Liver Cancer',
    category: 'cancer',
    categoryTh: 'มะเร็งวิทยา',
    icd10: 'C22',
    riskLevel: 'very_high',
    shortDescriptionTh: 'มะเร็งอันดับ 1 ในชายไทย — เกี่ยวข้องกับ HBV/HCV ป้องกันได้ด้วยวัคซีน',
    stats: { prevalenceThailand: 'มะเร็งอันดับ 1 ในชายไทย', primaryRiskGroupTh: 'ผู้ชายอายุ 40+ ที่ติดเชื้อ HBV/HCV' },
    lastReviewed: '2026-06',
    isRich: false,
  },
  {
    slug: 'lung-cancer',
    nameTh: 'มะเร็งปอด (Lung Cancer)',
    nameTh_short: 'มะเร็งปอด',
    nameEn: 'Lung Cancer',
    category: 'cancer',
    categoryTh: 'มะเร็งวิทยา',
    icd10: 'C34',
    riskLevel: 'very_high',
    shortDescriptionTh: 'มะเร็งที่เสียชีวิตสูงที่สุด — ป้องกันได้ถึง 80-90% โดยการเลิกสูบบุหรี่',
    stats: { prevalenceThailand: 'Top 5 มะเร็งในไทย', primaryRiskGroupTh: 'ผู้สูบบุหรี่อายุ 50+ ปี' },
    lastReviewed: '2026-06',
    isRich: false,
  },
  {
    slug: 'cardiovascular-disease',
    nameTh: 'โรคหัวใจและหลอดเลือด (Cardiovascular Disease)',
    nameTh_short: 'โรคหัวใจและหลอดเลือด',
    nameEn: 'Cardiovascular Disease',
    category: 'heart',
    categoryTh: 'หัวใจและหลอดเลือด',
    icd10: 'I25',
    riskLevel: 'high',
    shortDescriptionTh: 'สาเหตุการเสียชีวิตอันดับ 1 ในไทย — 80% ป้องกันได้ด้วยการควบคุมปัจจัยเสี่ยง',
    stats: { prevalenceThailand: 'สาเหตุเสียชีวิตอันดับ 1', primaryRiskGroupTh: 'ผู้ใหญ่อายุ 40+ ที่มีปัจจัยเสี่ยง' },
    lastReviewed: '2026-06',
    isRich: false,
  },
  {
    slug: 'depression',
    nameTh: 'โรคซึมเศร้า (Depression)',
    nameTh_short: 'โรคซึมเศร้า',
    nameEn: 'Major Depressive Disorder',
    category: 'mental',
    categoryTh: 'สุขภาพจิต',
    icd10: 'F32',
    riskLevel: 'moderate',
    shortDescriptionTh: '1 ใน 7 คนไทยมีอาการซึมเศร้า รักษาได้ผลดีหากได้รับความช่วยเหลือที่เหมาะสม',
    stats: { prevalenceThailand: '1 ใน 7 คนไทย', primaryRiskGroupTh: 'ทุกช่วงอายุ โดยเฉพาะหญิงวัย 25-45 ปี' },
    lastReviewed: '2026-06',
    isRich: false,
  },
]

// Combined list for index page (rich diseases first, then legacy)
export function getAllDiseaseCardsForListing(): Array<DiseaseCard & { isRich: boolean }> {
  const rich = getAllDiseaseCards().map(c => ({ ...c, isRich: true }))
  const legacy = LEGACY_DISEASE_CARDS.filter(
    l => !getAllRichSlugs().includes(l.slug) // exclude overlap
  ).map(l => ({ ...l } as DiseaseCard & { isRich: boolean }))
  return [...rich, ...legacy]
}
