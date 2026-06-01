// Evidence metadata — used across all clinical recommendations
// Do NOT invent citations. Mark unverified sources clearly.

export type EvidenceLevel = 'A' | 'B' | 'C' | 'D' | 'expert_opinion'
export type ReviewStatus = 'reviewed' | 'pending_review' | 'needs_verification'

export interface EvidenceSource {
  name: string
  guidelineName?: string
  organization?: string
  year?: number
  url?: string
  doi?: string
  evidenceLevel: EvidenceLevel
  reviewStatus: ReviewStatus
  lastReviewedDate?: string
  reviewerPlaceholder?: string // e.g. "MD, Internal Medicine"
}

export interface EvidenceMetadata {
  sources: EvidenceSource[]
  overallEvidenceLevel: EvidenceLevel
  lastUpdated: string
  disclaimer: string
  isPendingVerification?: boolean
}

export function pendingEvidence(topic: string): EvidenceMetadata {
  return {
    sources: [{
      name: `${topic} — อยู่ระหว่างการตรวจสอบแหล่งอ้างอิง`,
      evidenceLevel: 'expert_opinion',
      reviewStatus: 'pending_review',
    }],
    overallEvidenceLevel: 'expert_opinion',
    lastUpdated: '2026-06',
    disclaimer: 'ต้องตรวจสอบแหล่งอ้างอิงก่อนเผยแพร่จริง',
    isPendingVerification: true,
  }
}

export function makeEvidence(
  sourceName: string,
  level: EvidenceLevel,
  year?: number,
  guidelineName?: string
): EvidenceMetadata {
  return {
    sources: [{
      name: sourceName,
      guidelineName,
      evidenceLevel: level,
      reviewStatus: 'pending_review',
      year,
    }],
    overallEvidenceLevel: level,
    lastUpdated: '2026-06',
    disclaimer: 'ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ต้องตรวจสอบและรับรองโดยแพทย์ผู้เชี่ยวชาญก่อนนำไปใช้ทางคลินิก',
    isPendingVerification: true,
  }
}

export const EVIDENCE_LEVEL_LABELS: Record<EvidenceLevel, { th: string; en: string; color: string }> = {
  A: { th: 'หลักฐานแข็งแกร่ง', en: 'Strong Evidence', color: 'text-emerald-700' },
  B: { th: 'หลักฐานปานกลาง', en: 'Moderate Evidence', color: 'text-blue-700' },
  C: { th: 'หลักฐานจำกัด', en: 'Limited Evidence', color: 'text-amber-700' },
  D: { th: 'ความเห็นผู้เชี่ยวชาญ', en: 'Expert Opinion', color: 'text-slate-600' },
  expert_opinion: { th: 'ความเห็นผู้เชี่ยวชาญ', en: 'Expert Opinion', color: 'text-slate-600' },
}
