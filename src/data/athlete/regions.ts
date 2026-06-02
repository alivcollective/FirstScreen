// Athlete body regions with activities and red flags
// SAFETY: Educational only — NOT diagnostic

export interface RedFlag {
  symptomId: string
  warning_th: string
}

export interface AthleteRegion {
  id: string
  name_th: string
  name_en: string
  activities: string[]
  redFlags?: RedFlag[]
}

export const ATHLETE_REGIONS: AthleteRegion[] = [
  { id: 'scapula', name_th: 'สะบัก', name_en: 'Scapula',
    activities: ['Pull-up', 'Lat Pulldown', 'Row', 'Bench Press', 'Overhead Press', 'Push Up', 'ว่ายน้ำ', 'โยคะ', 'อื่นๆ'] },
  { id: 'rotator_cuff', name_th: 'เอ็นหมุนไหล่', name_en: 'Rotator Cuff',
    activities: ['Overhead Press', 'Side Raise', 'External Rotation', 'Throw', 'ว่ายน้ำ', 'เทนนิส', 'แบดมินตัน'] },
  { id: 'shoulder', name_th: 'ไหล่', name_en: 'Shoulder',
    activities: ['Bench Press', 'Overhead Press', 'Dip', 'Push Up', 'Throw', 'ว่ายน้ำ', 'เทนนิส', 'ออกกำลังกายทั่วไป'] },
  { id: 'pec', name_th: 'อกใหญ่ (Pec)', name_en: 'Pectoral',
    activities: ['Bench Press', 'Cable Fly', 'Dip', 'Push Up', 'อื่นๆ'] },
  { id: 'lat', name_th: 'หลังกว้าง (Lat)', name_en: 'Latissimus',
    activities: ['Pull-up', 'Lat Pulldown', 'Row', 'Deadlift', 'อื่นๆ'] },
  { id: 'biceps_tendon', name_th: 'เอ็น Biceps', name_en: 'Biceps Tendon',
    activities: ['Curl', 'Pull-up', 'Row', 'Supinated Grip', 'อื่นๆ'] },
  { id: 'elbow', name_th: 'ข้อศอก', name_en: 'Elbow',
    activities: ['Curl', 'Tricep Extension', 'Push-up', 'เทนนิส', 'แบดมินตัน', 'กอล์ฟ', 'อื่นๆ'] },
  { id: 'lower_back', name_th: 'หลังส่วนล่าง', name_en: 'Lower Back',
    activities: ['Deadlift', 'Squat', 'วิ่ง', 'ปั่นจักรยาน', 'โยคะ', 'ยกของหนัก', 'อื่นๆ'],
    redFlags: [
      { symptomId: 'numbness', warning_th: 'ชาหรืออ่อนแรงขาข้างใดข้างหนึ่งเฉียบพลัน ควรพบแพทย์โดยด่วน' },
    ] },
  { id: 'hip_flexor', name_th: 'Hip Flexor', name_en: 'Hip Flexor',
    activities: ['วิ่ง', 'Sprint', 'Squat', 'Lunge', 'ฟุตบอล', 'อื่นๆ'] },
  { id: 'glute', name_th: 'กล้ามเนื้อก้น', name_en: 'Glute',
    activities: ['Deadlift', 'Hip Thrust', 'Squat', 'วิ่ง', 'ปั่นจักรยาน', 'อื่นๆ'] },
  { id: 'hamstring', name_th: 'หน้าต้นขา (Hamstring)', name_en: 'Hamstring',
    activities: ['Sprint', 'วิ่ง', 'Deadlift', 'ฟุตบอล', 'บาสเกตบอล', 'อื่นๆ'] },
  { id: 'quadriceps', name_th: 'Quadriceps', name_en: 'Quadriceps',
    activities: ['Squat', 'Lunge', 'วิ่ง', 'ปั่นจักรยาน', 'ฟุตบอล', 'อื่นๆ'] },
  { id: 'it_band', name_th: 'IT Band', name_en: 'IT Band',
    activities: ['วิ่ง', 'Trail Running', 'ปั่นจักรยาน', 'อื่นๆ'] },
  { id: 'patella', name_th: 'สะบ้าเข่า', name_en: 'Patella / Knee',
    activities: ['วิ่ง', 'Squat', 'Jump', 'ปั่นจักรยาน', 'บาสเกตบอล', 'ฟุตบอล', 'อื่นๆ'] },
  { id: 'achilles', name_th: 'เอ็นร้อยหวาย', name_en: 'Achilles',
    activities: ['วิ่ง', 'Sprint', 'Jump', 'ฟุตบอล', 'บาสเกตบอล', 'อื่นๆ'] },
  { id: 'calf', name_th: 'น่อง', name_en: 'Calf',
    activities: ['วิ่ง', 'Sprint', 'Jump', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'อื่นๆ'] },
  { id: 'plantar_fascia', name_th: 'ฝ่าเท้า (Plantar)', name_en: 'Plantar Fascia',
    activities: ['วิ่ง', 'Trail Running', 'ยืนนาน', 'ฟุตบอล', 'อื่นๆ'] },
]

export const ATHLETE_SPORTS = [
  { id: 'general', label_th: 'ทั่วไป', label_en: 'General' },
  { id: 'running', label_th: 'วิ่ง', label_en: 'Running' },
  { id: 'trail_running', label_th: 'Trail Running', label_en: 'Trail Running' },
  { id: 'cycling', label_th: 'ปั่นจักรยาน', label_en: 'Cycling' },
  { id: 'strength', label_th: 'เวทเทรนนิ่ง', label_en: 'Weight Training' },
  { id: 'powerlifting', label_th: 'Powerlifting', label_en: 'Powerlifting' },
  { id: 'crossfit', label_th: 'CrossFit', label_en: 'CrossFit' },
  { id: 'yoga', label_th: 'โยคะ', label_en: 'Yoga' },
  { id: 'swimming', label_th: 'ว่ายน้ำ', label_en: 'Swimming' },
  { id: 'tennis', label_th: 'เทนนิส', label_en: 'Tennis' },
  { id: 'badminton', label_th: 'แบดมินตัน', label_en: 'Badminton' },
  { id: 'football', label_th: 'ฟุตบอล', label_en: 'Football' },
  { id: 'basketball', label_th: 'บาสเกตบอล', label_en: 'Basketball' },
] as const
