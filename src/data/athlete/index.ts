// Athlete Pain Map Data — FirstScreen Phase 3
// NOT yet exposed in production UI.
// Architecture ready for future activation.
// SAFETY: Educational only. "อาจเกี่ยวข้องกับ" — NOT diagnostic.

import type { AthleteCondition, AthleteBodyRegion } from '@/types/athlete'

export const ATHLETE_CONDITIONS: AthleteCondition[] = [
  {
    id: 'scapular_dyskinesis',
    name_th: 'Scapular Dyskinesis (สะบักเคลื่อนผิดปกติ)',
    name_en: 'Scapular Dyskinesis',
    relatedRegions: ['SCAPULA', 'ROTATOR_CUFF', 'SHOULDER'],
    relevantModes: ['strength_training', 'crossfit', 'yoga'],
    symptoms_th: ['สะบักยื่น', 'ปวดไหล่ขณะยกแขน', 'อ่อนแรงไหล่'],
    description_th: 'ภาวะที่สะบักเคลื่อนไหวผิดจังหวะ มักพบในนักกีฬาที่ใช้แขนยกเหนือศีรษะบ่อย',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Scapular Dyskinesis — ควรประเมินเพิ่มเติมโดยนักกายภาพบำบัด',
    whenToSeekHelp_th: 'หากอาการไม่ดีขึ้นใน 2-3 สัปดาห์ หรือเจ็บมากขึ้น ควรพบผู้เชี่ยวชาญ',
    screeningQuestions: [
      { id: 'sq_activity', question_th: 'อาการเกิดจากกิจกรรมใด?', question_en: 'What activity triggered this?', type: 'select',
        options: [
          { value: 'strength', label_th: 'เวทเทรนนิ่ง', label_en: 'Weight training' },
          { value: 'overhead', label_th: 'ยกของเหนือศีรษะ', label_en: 'Overhead lifting' },
          { value: 'swimming', label_th: 'ว่ายน้ำ', label_en: 'Swimming' },
        ]
      },
    ],
  },
  {
    id: 'rotator_cuff_tendinopathy',
    name_th: 'Rotator Cuff Tendinopathy',
    name_en: 'Rotator Cuff Tendinopathy',
    relatedRegions: ['ROTATOR_CUFF', 'SHOULDER'],
    relevantModes: ['strength_training', 'crossfit', 'general'],
    symptoms_th: ['เจ็บไหล่ขณะยกแขน', 'ปวดตอนกลางคืน', 'อ่อนแรงไหล่'],
    description_th: 'การบาดเจ็บของเอ็นกลุ่ม Rotator Cuff มักเกิดจากการใช้งานซ้ำๆ',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Rotator Cuff Tendinopathy — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากเจ็บมากหรืออ่อนแรงรุนแรง ควรพบแพทย์กีฬาหรือนักกายภาพ',
    screeningQuestions: [],
  },
  {
    id: 'runners_knee',
    name_th: 'Runner\'s Knee (Patellofemoral Pain)',
    name_en: "Runner's Knee",
    relatedRegions: ['PATELLA', 'QUAD'],
    relevantModes: ['runner', 'trail_runner', 'crossfit'],
    symptoms_th: ['ปวดรอบกระดูกสะบ้า', 'เจ็บเมื่อลงบันได', 'เจ็บหลังนั่งนาน'],
    description_th: 'อาการปวดบริเวณสะบ้า มักพบในนักวิ่งหรือผู้ที่ขึ้น-ลงบันไดบ่อย',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Patellofemoral Pain Syndrome — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากวิ่งไม่ได้หรืออาการเป็นมานาน ควรพบผู้เชี่ยวชาญ',
    screeningQuestions: [],
  },
  {
    id: 'it_band_syndrome',
    name_th: 'IT Band Syndrome',
    name_en: 'Iliotibial Band Syndrome',
    relatedRegions: ['IT_BAND', 'PATELLA'],
    relevantModes: ['runner', 'trail_runner', 'cyclist'],
    symptoms_th: ['ปวดด้านนอกเข่า', 'เจ็บเมื่อวิ่งระยะไกล', 'เสียดสีด้านข้างเข่า'],
    description_th: 'การอักเสบของเอ็น IT Band ด้านนอกต้นขา พบบ่อยในนักวิ่ง',
    disclaimer_th: 'อาจเกี่ยวข้องกับ IT Band Syndrome — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากวิ่งไม่ได้หรือปวดมากขึ้น ควรพบผู้เชี่ยวชาญ',
    screeningQuestions: [],
  },
  {
    id: 'achilles_tendinopathy',
    name_th: 'Achilles Tendinopathy',
    name_en: 'Achilles Tendinopathy',
    relatedRegions: ['ACHILLES', 'CALF'],
    relevantModes: ['runner', 'trail_runner', 'general'],
    symptoms_th: ['ปวดเอ็นร้อยหวาย', 'แข็งตึงตอนเช้า', 'บวมเล็กน้อยบริเวณเอ็น'],
    description_th: 'การบาดเจ็บของเอ็นร้อยหวาย มักเกิดจากการวิ่งมากเกินหรืออุ่นเครื่องน้อยไป',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Achilles Tendinopathy — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากปวดมากหรือรู้สึกขาดเฉียบพลัน ควรพบแพทย์ทันที',
    screeningQuestions: [],
  },
  {
    id: 'plantar_fasciitis',
    name_th: 'Plantar Fasciitis (เอ็นฝ่าเท้าอักเสบ)',
    name_en: 'Plantar Fasciitis',
    relatedRegions: ['PLANTAR_FASCIA'],
    relevantModes: ['runner', 'general'],
    symptoms_th: ['ปวดส้นเท้าตอนเช้า', 'เจ็บเมื่อก้าวแรก', 'ปวดฝ่าเท้า'],
    description_th: 'การอักเสบของพังผืดฝ่าเท้า พบบ่อยในนักวิ่งและผู้ที่ยืนนาน',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Plantar Fasciitis — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากอาการไม่ดีขึ้นใน 4-6 สัปดาห์ ควรพบผู้เชี่ยวชาญ',
    screeningQuestions: [],
  },
]

export const ATHLETE_BODY_REGIONS: AthleteBodyRegion[] = [
  {
    id: 'SCAPULA',
    name_th: 'สะบัก',
    name_en: 'Scapula',
    relatedConditions: ['scapular_dyskinesis', 'rotator_cuff_tendinopathy'],
    relevantModes: ['strength_training', 'crossfit', 'yoga'],
    causingActivities_th: ['เวทเทรนนิ่ง', 'ว่ายน้ำ', 'โยคะ'],
    causingMovements_th: ['Bench Press', 'Overhead Press', 'Row', 'Pull-up'],
  },
  {
    id: 'PATELLA',
    name_th: 'กระดูกสะบ้า',
    name_en: 'Patella',
    relatedConditions: ['runners_knee'],
    relevantModes: ['runner', 'trail_runner', 'crossfit'],
    causingActivities_th: ['วิ่ง', 'Squat', 'ลงบันได'],
    causingMovements_th: ['Squat', 'Lunge', 'Box Jump', 'วิ่งลงเขา'],
  },
  {
    id: 'IT_BAND',
    name_th: 'IT Band (ด้านข้างต้นขา)',
    name_en: 'Iliotibial Band',
    relatedConditions: ['it_band_syndrome'],
    relevantModes: ['runner', 'cyclist'] as AthleteBodyRegion['relevantModes'],
    causingActivities_th: ['วิ่งระยะไกล', 'ปั่นจักรยาน'],
    causingMovements_th: ['วิ่งลงเขา', 'วิ่งระยะ 10km+'],
  },
  {
    id: 'ACHILLES',
    name_th: 'เอ็นร้อยหวาย',
    name_en: 'Achilles Tendon',
    relatedConditions: ['achilles_tendinopathy'],
    relevantModes: ['runner', 'trail_runner'],
    causingActivities_th: ['วิ่ง', 'กระโดด'],
    causingMovements_th: ['วิ่ง Sprint', 'กระโดดตบ', 'Calf Raise'],
  },
  {
    id: 'PLANTAR_FASCIA',
    name_th: 'พังผืดฝ่าเท้า',
    name_en: 'Plantar Fascia',
    relatedConditions: ['plantar_fasciitis'],
    relevantModes: ['runner', 'general'],
    causingActivities_th: ['วิ่ง', 'ยืนนาน'],
    causingMovements_th: ['วิ่งบนพื้นแข็ง', 'ยืนทำงาน'],
  },
]

// Future: AthleteModeSelector component will query this
export const ATHLETE_MODE_LABELS = {
  general: { th: 'ทั่วไป', en: 'General' },
  runner: { th: 'นักวิ่ง', en: 'Runner' },
  trail_runner: { th: 'Trail Runner', en: 'Trail Runner' },
  cyclist: { th: 'นักปั่น', en: 'Cyclist' },
  strength_training: { th: 'เวทเทรนนิ่ง', en: 'Strength Training' },
  crossfit: { th: 'CrossFit', en: 'CrossFit' },
  yoga: { th: 'โยคะ', en: 'Yoga' },
} as const
