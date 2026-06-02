'use server'

import { computeDifferentialDiagnosis, classifyUrgency } from '@/lib/clinical'
import type { UrgencyOutput } from '@/lib/clinical/urgency-classifier'
import type { ClinicalSession, DifferentialResult } from '@/types/clinical'

export interface AssessmentResult {
  differential: DifferentialResult[]
  urgency: UrgencyOutput
  error?: string
}

export async function runClinicalAssessment(
  session: ClinicalSession
): Promise<AssessmentResult> {
  try {
    const differential = await computeDifferentialDiagnosis(session)

    // Collect symptom codes for urgency pattern matching
    const symptomCodes: string[] = []
    if (session.symptom_ids?.length) {
      // We need codes, not IDs — the engine returns matched symptoms with codes
      for (const result of differential) {
        for (const code of result.matched_symptoms ?? []) {
          if (!symptomCodes.includes(code)) symptomCodes.push(code)
        }
      }
    }

    const urgency = classifyUrgency(session, differential, symptomCodes)
    return { differential, urgency }
  } catch (err) {
    console.error('[runClinicalAssessment]', err)
    return {
      differential: [],
      urgency: {
        level: 1,
        labelTh: 'นัดพบแพทย์',
        color: 'green',
        actionTh: 'ควรนัดพบแพทย์ภายใน 1-2 สัปดาห์',
        timeframeTh: '1-2 สัปดาห์',
        show1669: false,
        triggerReason: 'fallback',
      },
      error: err instanceof Error ? err.message : 'Assessment failed',
    }
  }
}
