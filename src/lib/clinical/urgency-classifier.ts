/**
 * Clinical Urgency Classifier
 * Determines urgency level from session data + differential results.
 *
 * SAFETY: This does NOT replace clinical judgment.
 * ALWAYS err on the side of higher urgency when uncertain.
 */

import type { ClinicalSession, DifferentialResult, UrgencyLevel } from '@/types/clinical'

export interface UrgencyOutput {
  level: UrgencyLevel
  labelTh: string
  color: 'green' | 'yellow' | 'orange' | 'red'
  actionTh: string
  timeframeTh: string
  show1669: boolean
  triggerReason?: string  // why this level was chosen
}

// ── Emergency trigger patterns ────────────────────────────────

/**
 * Symptom code combinations that require immediate emergency.
 * ANY ONE combination being true = LEVEL 4
 */
const EMERGENCY_COMBINATIONS = [
  // Cardiac: chest pain + left arm + cold sweat
  { required: ['MA80', 'MB48'], description: 'เจ็บหน้าอก + อาการทางระบบประสาท (FAST stroke)' },
  { required: ['MA80'], softMatch: ['MC80', 'MB48'], description: 'เจ็บหน้าอก + อาการ stroke' },
  // Meningitis: neck stiffness + fever
  { required: ['MG44', 'MG29.0'], description: 'คอแข็ง + ไข้ (สงสัยเยื่อหุ้มสมองอักเสบ)' },
  // Thunderclap headache
  { required: ['MG30.1'], description: 'ปวดหัวรุนแรงที่สุดในชีวิต' },
  // Stroke FAST
  { required: ['MC80'], description: 'พูดไม่ออก/ไม่ชัด (สงสัย Stroke)' },
  { required: ['MB48'], description: 'ชาหรืออ่อนแรงครึ่งซีก (สงสัย Stroke)' },
  // Hemoptysis critical
  { required: ['CA23'], description: 'ไอเป็นเลือด' },
  // Petechiae (dengue/leukemia)
  { required: ['ED10'], description: 'จุดเลือดออกใต้ผิวหนัง' },
]

const EMERGENCY_SINGLE_SYMPTOM_CODES = new Set([
  'MG30.1',  // thunderclap headache
  'MB48',    // hemiweakness
  'MC80',    // aphasia
  'MG44',    // neck stiffness (with fever flag)
  'CA23',    // hemoptysis
  'ED10',    // petechiae
])

export function classifyUrgency(
  session: ClinicalSession,
  differential: DifferentialResult[],
  selectedSymptomCodes: string[] = []
): UrgencyOutput {
  const severity = session.oldcarts?.severity_score ?? 5
  const duration = session.oldcarts?.duration_days ?? 0
  const onset = session.oldcarts?.onset_description ?? ''
  const topCondition = differential[0]?.condition

  // ════════════════════════════════════════════════
  // LEVEL 4 — EMERGENCY
  // ════════════════════════════════════════════════

  // 1. Single emergency symptom codes
  for (const code of selectedSymptomCodes) {
    if (EMERGENCY_SINGLE_SYMPTOM_CODES.has(code)) {
      return _emergency(`อาการ ${code} ต้องประเมินฉุกเฉินทันที`)
    }
  }

  // 2. Sudden severe chest pain (MA80 + sudden onset)
  if (
    selectedSymptomCodes.includes('MA80') &&
    (onset.includes('ทันที') || onset.includes('sudden')) &&
    severity >= 7
  ) {
    return _emergency('เจ็บหน้าอกรุนแรงเฉียบพลัน — สงสัย Acute Coronary Syndrome')
  }

  // 3. Severe breathing difficulty sudden onset
  if (
    selectedSymptomCodes.includes('MB23.4') &&
    onset.includes('ทันที') &&
    severity >= 8
  ) {
    return _emergency('หายใจลำบากเฉียบพลันรุนแรง')
  }

  // 4. Top differential is emergency urgency
  if (topCondition?.urgency_level === 4 && differential[0].score >= 40) {
    return _emergency(`ภาวะที่ต้องพิจารณา: ${topCondition.name_th}`)
  }

  // 5. Severity ≥ 9
  if (severity >= 9) {
    return _emergency(`ความรุนแรงอาการระดับ ${severity}/10`)
  }

  // 6. Sudden loss of consciousness
  if (selectedSymptomCodes.includes('MC00') && onset.includes('ทันที')) {
    return _emergency('หมดสติเฉียบพลัน')
  }

  // ════════════════════════════════════════════════
  // LEVEL 3 — URGENT (24–48 hours)
  // ════════════════════════════════════════════════

  if (severity >= 7) {
    return _urgent(`ความรุนแรงอาการ ${severity}/10`)
  }

  if (topCondition?.urgency_level === 3 && differential[0].score >= 30) {
    return _urgent(`ภาวะที่อาจต้องการการดูแลเร่งด่วน: ${topCondition.name_th}`)
  }

  // Worsening + duration > 1 week
  const hasWorsening = (session.oldcarts?.aggravating_factors?.length ?? 0) > 0
  if (hasWorsening && duration > 7) {
    return _urgent('อาการแย่ลงเรื่อยๆ และเป็นมานาน > 1 สัปดาห์')
  }

  // Cancer differential in top position
  if (topCondition?.category === 'cancer' && differential[0].score >= 35) {
    return _urgent(`ควรตรวจเพิ่มเติมเพื่อแยกโรค: ${topCondition.name_th}`)
  }

  // High severity symptoms in differential
  if (differential.some(d => d.condition.severity === 'critical' && d.score >= 30)) {
    return _urgent('มีภาวะวิกฤติในรายการที่เป็นไปได้')
  }

  // ════════════════════════════════════════════════
  // LEVEL 2 — SOON (1–2 weeks)
  // ════════════════════════════════════════════════

  if (severity >= 4 && severity < 7) {
    return _soon(`ความรุนแรงอาการ ${severity}/10 — ควรนัดพบแพทย์`)
  }

  if (topCondition?.urgency_level === 2) {
    return _soon(`แนะนำพบแพทย์เพื่อประเมิน: ${topCondition.name_th}`)
  }

  if (duration > 14) {
    return _soon('อาการเป็นมานาน > 2 สัปดาห์')
  }

  // ════════════════════════════════════════════════
  // LEVEL 1 — ROUTINE (self-care + monitor)
  // ════════════════════════════════════════════════

  return {
    level: 1,
    labelTh: 'ดูแลตัวเองได้เบื้องต้น',
    color: 'green',
    actionTh: 'พักผ่อน ดูแลตัวเอง และเฝ้าระวังอาการ',
    timeframeTh: 'ถ้าอาการไม่ดีขึ้นใน 3–5 วัน หรือแย่ลง ควรพบแพทย์',
    show1669: false,
  }
}

// ── Helpers ──────────────────────────────────────────────────

function _emergency(reason: string): UrgencyOutput {
  return {
    level: 4,
    labelTh: 'ฉุกเฉิน — ต้องการการดูแลทันที',
    color: 'red',
    actionTh: 'โทร 1669 หรือไปห้องฉุกเฉินทันที อย่ารอดูอาการ',
    timeframeTh: 'ทันที — ทุกนาทีมีความสำคัญ',
    show1669: true,
    triggerReason: reason,
  }
}

function _urgent(reason: string): UrgencyOutput {
  return {
    level: 3,
    labelTh: 'ควรพบแพทย์โดยเร็ว',
    color: 'orange',
    actionTh: 'พบแพทย์ที่คลินิกหรือโรงพยาบาลภายใน 24–48 ชั่วโมง',
    timeframeTh: '24–48 ชั่วโมง',
    show1669: false,
    triggerReason: reason,
  }
}

function _soon(reason: string): UrgencyOutput {
  return {
    level: 2,
    labelTh: 'นัดพบแพทย์',
    color: 'yellow',
    actionTh: 'นัดพบแพทย์ภายใน 1–2 สัปดาห์',
    timeframeTh: '1–2 สัปดาห์',
    show1669: false,
    triggerReason: reason,
  }
}
