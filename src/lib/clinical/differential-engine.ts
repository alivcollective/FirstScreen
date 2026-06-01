/**
 * Differential Diagnosis Engine
 * Queries Supabase differential_dx table and applies clinical modifiers.
 *
 * SAFETY: Educational navigation only. NOT a diagnostic tool.
 * All scores PENDING physician validation before production use.
 */

import type { ClinicalSession, DifferentialResult } from '@/types/clinical'
import { calculatePackYears, getSmokingRisk } from './calculators/pack-year'
import { calculateAUDITC } from './calculators/audit-c'

// ── Types ────────────────────────────────────────────────────

interface DiffDxRow {
  condition_id: string
  symptom_id: string
  base_score: number
  modifier_age_over_50: number
  modifier_age_over_60: number
  modifier_male: number
  modifier_female: number
  modifier_smoker: number
  modifier_ex_smoker_5y: number
  modifier_heavy_alcohol: number
  modifier_obese: number
  modifier_diabetes: number
  modifier_hypertension: number
  modifier_hbv: number
  modifier_family_hx: number
  modifier_duration_chronic: number
  modifier_duration_acute: number
  modifier_severity_high: number
  modifier_sudden_onset: number
  modifier_worsening: number
  modifier_night_predominant: number
  conditions: {
    id: string
    icd11_code: string
    name_th: string
    name_en: string
    category: string
    severity: string
    urgency_level: number
    specialty_required: string | null
    encyclopedia_slug: string | null
  }
  symptoms: {
    id: string
    code: string
    name_th: string
    is_emergency: boolean
    severity_weight: number
  }
}

interface ConditionAccumulator {
  conditionId: string
  icd11Code: string
  nameTh: string
  nameEn: string
  category: string
  severity: string
  urgencyLevel: number
  specialtyRequired: string | null
  encyclopediaSlug: string | null
  rawScore: number
  matchedSymptomIds: string[]
  matchedSymptomNames: string[]
  appliedModifiers: string[]
  hasEmergencySymptom: boolean
}

// ── Modifier Application ─────────────────────────────────────

function applySessionModifiers(
  row: DiffDxRow,
  session: ClinicalSession,
  packYears: number,
  quitYearsAgo: number | null,
  auditCScore: number
): { score: number; modifiersApplied: string[] } {
  let score = row.base_score
  const modifiersApplied: string[] = []
  const sh = session.social_history
  const age = session.age ?? 0
  const sex = session.sex ?? 'other'

  // ── Age modifiers ────────────────────────────────────────────
  if (age > 60 && row.modifier_age_over_60 !== 0) {
    score += row.modifier_age_over_60 * 1.5 // ≥65 multiplier
    modifiersApplied.push('อายุ > 60 ปี')
  } else if (age > 50 && row.modifier_age_over_50 !== 0) {
    score += row.modifier_age_over_50
    modifiersApplied.push('อายุ > 50 ปี')
  }

  // ── Sex modifiers ────────────────────────────────────────────
  if (sex === 'male' && row.modifier_male !== 0) {
    score += row.modifier_male
    if (row.modifier_male > 0) modifiersApplied.push('เพศชาย')
  } else if (sex === 'female' && row.modifier_female !== 0) {
    score += row.modifier_female
    if (row.modifier_female > 0) modifiersApplied.push('เพศหญิง')
  }

  // ── Smoking modifiers ────────────────────────────────────────
  const smokingStatus = sh?.smoking?.status
  if (smokingStatus === 'current' && row.modifier_smoker !== 0) {
    let smokeMod = row.modifier_smoker
    // Heavy smoker bonus (≥20 pack-years)
    if (packYears >= 20) smokeMod *= 1.2
    score += smokeMod
    modifiersApplied.push(`สูบบุหรี่ (${packYears.toFixed(1)} pack-years)`)
  } else if (smokingStatus === 'former' && quitYearsAgo !== null && quitYearsAgo < 5 && row.modifier_ex_smoker_5y !== 0) {
    let exSmokeMod = row.modifier_ex_smoker_5y
    // Reduce by 50% if quit > 15 years
    if (quitYearsAgo > 15) exSmokeMod *= 0.5
    score += exSmokeMod
    modifiersApplied.push('เคยสูบบุหรี่ (เลิกไม่นาน)')
  }

  // ── Alcohol modifiers ────────────────────────────────────────
  const isMaleAlcohol = sex !== 'female'
  const hazardousCutoff = isMaleAlcohol ? 4 : 3
  if (auditCScore >= hazardousCutoff && row.modifier_heavy_alcohol !== 0) {
    let alcMod = row.modifier_heavy_alcohol
    // Chronic heavy use bonus
    const yearsOfDrinking = sh?.alcohol?.years_drinking ?? 0
    if (yearsOfDrinking > 10) alcMod *= 1.3
    score += alcMod
    modifiersApplied.push('ดื่มแอลกอฮอล์เสี่ยง')
  }

  // ── BMI/Obesity modifier ─────────────────────────────────────
  const bmi = sh?.bmi ?? 0
  if (bmi >= 27.5 && row.modifier_obese !== 0) {
    score += row.modifier_obese
    modifiersApplied.push('น้ำหนักเกิน/อ้วน')
  }

  // ── Comorbidity modifiers ────────────────────────────────────
  const pmh = session.pmh_conditions ?? []
  if ((pmh.includes('diabetes') || pmh.includes('เบาหวาน')) && row.modifier_diabetes !== 0) {
    score += row.modifier_diabetes
    modifiersApplied.push('เบาหวาน')
  }
  if ((pmh.includes('hypertension') || pmh.includes('ความดันโลหิตสูง')) && row.modifier_hypertension !== 0) {
    score += row.modifier_hypertension
    modifiersApplied.push('ความดันโลหิตสูง')
  }
  if ((pmh.includes('hbv') || pmh.includes('ไวรัสตับอักเสบบี')) && row.modifier_hbv !== 0) {
    score += row.modifier_hbv
    modifiersApplied.push('ไวรัสตับอักเสบบี')
  }

  // ── Family history modifier ──────────────────────────────────
  // Simplified: if any relevant family history exists
  const fhx = session.family_hx
  if (fhx && row.modifier_family_hx !== 0) {
    const hasFHx = fhx.first_degree && Object.values(fhx.first_degree).some(v => v === true || (typeof v === 'string' && v.length > 0))
    if (hasFHx) {
      score += row.modifier_family_hx
      modifiersApplied.push('ประวัติครอบครัว')
    }
  }

  // ── Symptom characteristic modifiers ────────────────────────
  const duration = session.oldcarts?.duration_days ?? 0
  const severity = session.oldcarts?.severity_score ?? 5
  const onset = session.oldcarts?.onset_description ?? ''

  if (duration > 28 && row.modifier_duration_chronic !== 0) {
    score += row.modifier_duration_chronic
    modifiersApplied.push('อาการเรื้อรัง > 4 สัปดาห์')
  } else if (duration < 2 && duration > 0 && row.modifier_duration_acute !== 0) {
    score += row.modifier_duration_acute
    modifiersApplied.push('อาการเฉียบพลัน')
  }

  if (severity >= 7 && row.modifier_severity_high !== 0) {
    score += row.modifier_severity_high
    modifiersApplied.push(`ความรุนแรงสูง (${severity}/10)`)
  }

  if ((onset === 'ทันที' || onset.includes('ทันที')) && row.modifier_sudden_onset !== 0) {
    score += row.modifier_sudden_onset
    modifiersApplied.push('เกิดทันที')
  }

  // Check worsening from OLDCARTS aggravating factors presence
  const worsening = (session.oldcarts?.aggravating_factors?.length ?? 0) > 0
  if (worsening && row.modifier_worsening !== 0) {
    score += row.modifier_worsening
    modifiersApplied.push('อาการแย่ลง')
  }

  return { score: Math.max(0, Math.min(score, 1.5)), modifiersApplied }
}

// ── Main Engine ──────────────────────────────────────────────

export async function computeDifferentialDiagnosis(
  session: ClinicalSession
): Promise<DifferentialResult[]> {
  const symptomIds = session.symptom_ids ?? []
  if (symptomIds.length === 0) return []

  // ── Pre-compute social history values ────────────────────────
  const sh = session.social_history
  const smokingStatus = sh?.smoking?.status ?? 'never'
  const cpd = smokingStatus === 'current'
    ? (sh?.smoking?.cigarettes_per_day ?? 0)
    : ((sh?.smoking as { cigarettes_per_day_former?: number })?.cigarettes_per_day_former ?? 0)
  const yrs = sh?.smoking?.years_smoked ?? 0
  const quitYrs = smokingStatus === 'former' ? (sh?.smoking?.quit_years_ago ?? null) : null
  const packYears = calculatePackYears(cpd, yrs)

  // AUDIT-C score
  const alcH = sh?.alcohol
  const auditCScore = alcH?.audit_c_score ??
    (alcH?.audit_c_frequency && alcH?.audit_c_amount && alcH?.audit_c_binge
      ? calculateAUDITC({
          frequencyKey: alcH.audit_c_frequency,
          amountKey: alcH.audit_c_amount,
          bingeKey: alcH.audit_c_binge,
          sex: session.sex ?? 'other',
        }).score
      : 0)

  // ── Query Supabase ───────────────────────────────────────────
  let rows: DiffDxRow[] = []

  try {
    const { isSupabaseConfigured } = await import('@/lib/supabase/client')
    if (isSupabaseConfigured) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      if (supabase) {
        const { data, error } = await supabase
          .from('differential_dx')
          .select(`
            *,
            conditions (
              id, icd11_code, name_th, name_en, category, severity,
              urgency_level, specialty_required, encyclopedia_slug
            ),
            symptoms (
              id, code, name_th, is_emergency, severity_weight
            )
          `)
          .in('symptom_id', symptomIds)

        if (!error && data) {
          rows = data as DiffDxRow[]
        }
      }
    }
  } catch {
    // Supabase unavailable — fall back to empty (static mode)
    console.warn('[differential-engine] Supabase unavailable, returning empty results')
    return []
  }

  if (rows.length === 0) return []

  // ── Accumulate scores per condition ─────────────────────────
  const conditionMap = new Map<string, ConditionAccumulator>()

  for (const row of rows) {
    const cond = row.conditions
    const sym = row.symptoms
    if (!cond || !sym) continue

    const { score: modScore, modifiersApplied } = applySessionModifiers(
      row, session, packYears, quitYrs, auditCScore
    )

    const existing = conditionMap.get(cond.id)
    if (existing) {
      existing.rawScore += modScore
      existing.matchedSymptomIds.push(sym.id)
      existing.matchedSymptomNames.push(sym.name_th)
      existing.appliedModifiers.push(...modifiersApplied)
      if (sym.is_emergency) existing.hasEmergencySymptom = true
    } else {
      conditionMap.set(cond.id, {
        conditionId: cond.id,
        icd11Code: cond.icd11_code,
        nameTh: cond.name_th,
        nameEn: cond.name_en,
        category: cond.category,
        severity: cond.severity,
        urgencyLevel: cond.urgency_level,
        specialtyRequired: cond.specialty_required ?? null,
        encyclopediaSlug: cond.encyclopedia_slug ?? null,
        rawScore: modScore,
        matchedSymptomIds: [sym.id],
        matchedSymptomNames: [sym.name_th],
        appliedModifiers: [...modifiersApplied],
        hasEmergencySymptom: sym.is_emergency,
      })
    }
  }

  // ── Normalize & sort ─────────────────────────────────────────
  const accumulators = Array.from(conditionMap.values())
  const maxRaw = Math.max(...accumulators.map(a => a.rawScore), 0.01)

  const results: DifferentialResult[] = accumulators
    .map(acc => {
      const normalizedScore = Math.min(Math.round((acc.rawScore / maxRaw) * 100), 100)
      const confidence: DifferentialResult['confidence'] =
        normalizedScore >= 60 ? 'high' : normalizedScore >= 40 ? 'moderate' : 'low'

      // Deduplicate modifiers
      const uniqueModifiers = [...new Set(acc.appliedModifiers)]

      return {
        condition: {
          id: acc.conditionId,
          icd11_code: acc.icd11Code,
          name_th: acc.nameTh,
          name_en: acc.nameEn,
          category: acc.category as DifferentialResult['condition']['category'],
          severity: acc.severity as DifferentialResult['condition']['severity'],
          urgency_level: acc.urgencyLevel as 1 | 2 | 3 | 4,
          specialty_required: acc.specialtyRequired ?? undefined,
          encyclopedia_slug: acc.encyclopediaSlug ?? undefined,
          created_at: '',
        },
        score: normalizedScore,
        confidence,
        matched_symptoms: [...new Set(acc.matchedSymptomNames)],
        key_modifiers: uniqueModifiers,
      }
    })
    .filter(r => r.score > 15)
    .sort((a, b) => {
      // Emergency conditions always first
      const aEmerg = a.condition.urgency_level === 4 ? 1 : 0
      const bEmerg = b.condition.urgency_level === 4 ? 1 : 0
      if (aEmerg !== bEmerg) return bEmerg - aEmerg
      return b.score - a.score
    })
    .slice(0, 5)

  return results
}

/** Check if any selected symptom triggers immediate emergency */
export async function hasEmergencySymptom(symptomIds: string[]): Promise<boolean> {
  if (!symptomIds.length) return false
  try {
    const { isSupabaseConfigured } = await import('@/lib/supabase/client')
    if (!isSupabaseConfigured) return false
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    if (!supabase) return false
    const { data } = await supabase
      .from('symptoms')
      .select('is_emergency')
      .in('id', symptomIds)
      .eq('is_emergency', true)
      .limit(1)
    return (data?.length ?? 0) > 0
  } catch { return false }
}
