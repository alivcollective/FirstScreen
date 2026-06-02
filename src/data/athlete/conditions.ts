// Athlete conditions knowledge base
// SAFETY: "อาจเกี่ยวข้องกับ" — NOT diagnostic. Educational only.

export type Urgency = 'urgent' | 'monitor' | 'self_care'

export interface AthleteCondition {
  id: string
  name_th: string
  name_en: string
  relatedRegions: string[]       // AthleteRegion ids
  relevantSports: string[]       // ATHLETE_SPORTS ids
  symptoms: string[]             // symptom ids from SYMPTOM_OPTIONS
  description_th: string
  disclaimer_th: string
  whenToSeekHelp_th: string
  urgency: Urgency
}

export const ATHLETE_CONDITIONS: AthleteCondition[] = [
  {
    id: 'scapular_dyskinesis',
    name_th: 'Scapular Dyskinesis',
    name_en: 'Scapular Dyskinesis',
    relatedRegions: ['scapula', 'rotator_cuff', 'shoulder'],
    relevantSports: ['general', 'strength', 'powerlifting', 'crossfit', 'swimming', 'tennis'],
    symptoms: ['pain', 'tightness', 'weakness', 'reduced_rom'],
    description_th: 'สะบักเคลื่อนไหวผิดจังหวะ มักพบในนักกีฬาที่ใช้แขนยกเหนือศีรษะบ่อยครั้ง',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Scapular Dyskinesis — ควรประเมินเพิ่มเติมโดยผู้เชี่ยวชาญ',
    whenToSeekHelp_th: 'หากอาการไม่ดีขึ้นใน 2-3 สัปดาห์ หรืออ่อนแรงมากขึ้น ควรพบนักกายภาพ',
    urgency: 'monitor',
  },
  {
    id: 'shoulder_impingement',
    name_th: 'Shoulder Impingement',
    name_en: 'Shoulder Impingement Syndrome',
    relatedRegions: ['shoulder', 'rotator_cuff'],
    relevantSports: ['general', 'strength', 'swimming', 'tennis', 'badminton'],
    symptoms: ['pain', 'tightness', 'reduced_rom'],
    description_th: 'เส้นเอ็นไหล่ถูกบีบระหว่างกระดูก มักเจ็บเมื่อยกแขนเหนือระดับไหล่',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Shoulder Impingement — ควรประเมินโดยผู้เชี่ยวชาญ',
    whenToSeekHelp_th: 'หากเจ็บมากหรือไม่สามารถยกแขนได้ ควรพบแพทย์กีฬาหรือนักกายภาพ',
    urgency: 'monitor',
  },
  {
    id: 'rotator_cuff_tendinopathy',
    name_th: 'Rotator Cuff Tendinopathy',
    name_en: 'Rotator Cuff Tendinopathy',
    relatedRegions: ['rotator_cuff', 'shoulder'],
    relevantSports: ['general', 'strength', 'powerlifting', 'crossfit', 'swimming'],
    symptoms: ['pain', 'weakness', 'tightness'],
    description_th: 'การบาดเจ็บของเอ็นกลุ่ม Rotator Cuff มักเกิดจากการใช้งานซ้ำๆ',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Rotator Cuff Tendinopathy — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากเจ็บมากหรืออ่อนแรงรุนแรง ควรพบแพทย์กีฬาหรือนักกายภาพ',
    urgency: 'monitor',
  },
  {
    id: 'runners_knee',
    name_th: "Runner's Knee (Patellofemoral Pain)",
    name_en: "Runner's Knee",
    relatedRegions: ['patella', 'quadriceps', 'it_band'],
    relevantSports: ['running', 'trail_running', 'crossfit', 'football', 'basketball'],
    symptoms: ['pain', 'tightness', 'clicking'],
    description_th: 'ปวดบริเวณสะบ้า มักเจ็บเมื่อลงบันได นั่งนาน หรือวิ่งลงเขา',
    disclaimer_th: "อาจเกี่ยวข้องกับ Runner's Knee — ควรประเมินเพิ่มเติม",
    whenToSeekHelp_th: 'หากวิ่งไม่ได้หรือปวดรุนแรง ควรพบผู้เชี่ยวชาญ',
    urgency: 'monitor',
  },
  {
    id: 'it_band_syndrome',
    name_th: 'IT Band Syndrome',
    name_en: 'Iliotibial Band Syndrome',
    relatedRegions: ['it_band', 'patella'],
    relevantSports: ['running', 'trail_running', 'cycling'],
    symptoms: ['pain', 'burning', 'tightness'],
    description_th: 'การอักเสบของเอ็น IT Band ด้านนอกต้นขา พบบ่อยในนักวิ่ง',
    disclaimer_th: 'อาจเกี่ยวข้องกับ IT Band Syndrome — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากวิ่งไม่ได้หรือปวดขณะเดิน ควรพบผู้เชี่ยวชาญ',
    urgency: 'monitor',
  },
  {
    id: 'patellar_tendinopathy',
    name_th: 'Patellar Tendinopathy',
    name_en: 'Patellar Tendinopathy',
    relatedRegions: ['patella'],
    relevantSports: ['running', 'crossfit', 'basketball', 'football'],
    symptoms: ['pain', 'tightness'],
    description_th: 'การบาดเจ็บของเอ็นสะบ้า มักพบในนักกีฬาที่กระโดดบ่อย',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Patellar Tendinopathy — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากเจ็บมากขณะ squat หรือกระโดด ควรพบนักกายภาพ',
    urgency: 'monitor',
  },
  {
    id: 'achilles_tendinopathy',
    name_th: 'Achilles Tendinopathy',
    name_en: 'Achilles Tendinopathy',
    relatedRegions: ['achilles', 'calf'],
    relevantSports: ['running', 'trail_running', 'football', 'basketball'],
    symptoms: ['pain', 'tightness', 'burning'],
    description_th: 'การบาดเจ็บของเอ็นร้อยหวาย มักเจ็บตอนเช้าหรือหลังออกกำลัง',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Achilles Tendinopathy — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากรู้สึกเสียงดังหรือปวดรุนแรงเฉียบพลัน ควรพบแพทย์ทันที',
    urgency: 'urgent',
  },
  {
    id: 'plantar_fasciitis',
    name_th: 'Plantar Fasciitis',
    name_en: 'Plantar Fasciitis',
    relatedRegions: ['plantar_fascia'],
    relevantSports: ['running', 'trail_running', 'general'],
    symptoms: ['pain', 'tightness'],
    description_th: 'การอักเสบของพังผืดฝ่าเท้า มักเจ็บมากตอนก้าวแรกในตอนเช้า',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Plantar Fasciitis — ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากอาการไม่ดีขึ้นใน 4-6 สัปดาห์ ควรพบนักกายภาพ',
    urgency: 'monitor',
  },
  {
    id: 'hamstring_strain',
    name_th: 'Hamstring Strain',
    name_en: 'Hamstring Strain',
    relatedRegions: ['hamstring'],
    relevantSports: ['running', 'trail_running', 'football', 'basketball'],
    symptoms: ['pain', 'tightness', 'weakness'],
    description_th: 'การฉีกขาดของกล้ามเนื้อ Hamstring มักเกิดขณะ Sprint หรือเตะ',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Hamstring Strain — ระดับรุนแรงต่างกัน ควรประเมินเพิ่มเติม',
    whenToSeekHelp_th: 'หากเจ็บรุนแรงทันทีขณะออกกำลัง ควรหยุดและพบแพทย์',
    urgency: 'urgent',
  },
  {
    id: 'low_back_pain',
    name_th: 'ปวดหลังส่วนล่าง',
    name_en: 'Low Back Pain',
    relatedRegions: ['lower_back'],
    relevantSports: ['general', 'strength', 'powerlifting', 'running', 'cycling'],
    symptoms: ['pain', 'tightness', 'weakness', 'pins', 'numbness'],
    description_th: 'ปวดหลังส่วนล่าง อาจมีสาเหตุหลายอย่าง ตั้งแต่กล้ามเนื้อตึงถึงหมอนรองกระดูก',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Low Back Pain — ควรประเมินเพิ่มเติมโดยผู้เชี่ยวชาญ',
    whenToSeekHelp_th: 'หากปวดร้าวลงขา ชา หรืออ่อนแรงขา ควรพบแพทย์โดยเร็ว',
    urgency: 'monitor',
  },
  {
    id: 'shin_splints',
    name_th: 'Shin Splints',
    name_en: 'Medial Tibial Stress Syndrome',
    relatedRegions: ['calf'],
    relevantSports: ['running', 'trail_running', 'football', 'basketball'],
    symptoms: ['pain', 'tightness', 'burning'],
    description_th: 'ปวดแข้งด้านใน มักพบในนักวิ่งหรือผู้ที่เพิ่มระยะทางวิ่งเร็วเกินไป',
    disclaimer_th: 'อาจเกี่ยวข้องกับ Shin Splints — ควรลดระยะทางและพักผ่อน',
    whenToSeekHelp_th: 'หากปวดรุนแรงขึ้นหรือบวม ควรพบแพทย์เพื่อตัดกระดูกร้าว',
    urgency: 'monitor',
  },
]
