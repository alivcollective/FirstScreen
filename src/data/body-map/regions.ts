// Body Map Region Definitions
// SVG regions with symptoms, Thai labels, emergency flags
// SAFETY: Educational only. NOT diagnostic.

export type ViewMode = 'front' | 'back'
export type RegionId =
  // Front
  | 'head' | 'face' | 'eyes' | 'ears' | 'nose' | 'mouth'
  | 'neck'
  | 'chest' | 'left-chest' | 'right-chest'
  | 'upper-abdomen' | 'lower-abdomen'
  | 'left-shoulder' | 'right-shoulder'
  | 'left-upper-arm' | 'right-upper-arm'
  | 'left-elbow' | 'right-elbow'
  | 'left-forearm' | 'right-forearm'
  | 'left-hand' | 'right-hand'
  | 'left-hip' | 'right-hip'
  | 'left-thigh' | 'right-thigh'
  | 'left-knee' | 'right-knee'
  | 'left-lower-leg' | 'right-lower-leg'
  | 'left-foot' | 'right-foot'
  // Back only
  | 'upper-back' | 'scapular-area' | 'mid-back' | 'lower-back'
  | 'left-buttock' | 'right-buttock'
  | 'left-calf' | 'right-calf'

export interface BodyRegion {
  id: RegionId
  label_th: string
  label_en: string
  view: ViewMode | 'both'
  description_th: string
  symptoms: BodySymptom[]
  isEmergency?: boolean
  emergencyNote_th?: string
  hotline?: string
  // SVG zoom viewport: [x, y, width, height] in SVG coordinate space
  zoomViewport: [number, number, number, number]
  // Label position on SVG
  labelPos?: [number, number]
}

export interface BodySymptom {
  id: string
  label_th: string
  label_en: string
  isEmergency?: boolean
}

export const BODY_REGIONS: BodyRegion[] = [
  // ── HEAD GROUP ──────────────────────────────────────────────
  {
    id: 'head', label_th: 'ศีรษะ', label_en: 'Head', view: 'front',
    description_th: 'บริเวณศีรษะและหนังศีรษะทั้งหมด',
    zoomViewport: [70, 0, 160, 120],
    labelPos: [150, 52],
    symptoms: [
      { id: 'headache', label_th: 'ปวดศีรษะ', label_en: 'Headache' },
      { id: 'severe-headache', label_th: 'ปวดศีรษะรุนแรงมาก', label_en: 'Severe headache', isEmergency: true },
      { id: 'dizziness', label_th: 'เวียนหัว', label_en: 'Dizziness' },
      { id: 'head-pressure', label_th: 'แน่นศีรษะ', label_en: 'Head pressure' },
      { id: 'scalp-pain', label_th: 'หนังศีรษะเจ็บ', label_en: 'Scalp pain' },
    ]
  },
  {
    id: 'face', label_th: 'ใบหน้า', label_en: 'Face', view: 'front',
    description_th: 'ใบหน้า กราม และโครงหน้า',
    zoomViewport: [90, 5, 120, 100],
    labelPos: [150, 52],
    symptoms: [
      { id: 'face-pain', label_th: 'ปวดใบหน้า', label_en: 'Facial pain' },
      { id: 'face-numbness', label_th: 'ชาใบหน้า', label_en: 'Facial numbness', isEmergency: true },
      { id: 'face-droop', label_th: 'ใบหน้าตก/เบี้ยว', label_en: 'Face drooping', isEmergency: true },
      { id: 'jaw-pain', label_th: 'ปวดกราม', label_en: 'Jaw pain' },
      { id: 'swelling', label_th: 'บวม', label_en: 'Swelling' },
    ],
    isEmergency: true,
    emergencyNote_th: 'ใบหน้าตก ชาข้างเดียว หรือพูดไม่ชัด อาจเป็นสัญญาณ Stroke — โทร 1669',
    hotline: '1669',
  },
  {
    id: 'neck', label_th: 'คอ', label_en: 'Neck', view: 'both',
    description_th: 'ลำคอ ต่อมน้ำเหลือง และหลอดเลือดที่คอ',
    zoomViewport: [95, 88, 110, 75],
    labelPos: [150, 112],
    symptoms: [
      { id: 'neck-pain', label_th: 'ปวดคอ', label_en: 'Neck pain' },
      { id: 'neck-stiffness', label_th: 'คอแข็ง/ตึง', label_en: 'Neck stiffness' },
      { id: 'stiff-fever', label_th: 'คอแข็ง + ไข้', label_en: 'Stiff neck + fever', isEmergency: true },
      { id: 'throat-pain', label_th: 'เจ็บคอ', label_en: 'Sore throat' },
      { id: 'lymph-node', label_th: 'ต่อมน้ำเหลืองโต', label_en: 'Swollen lymph nodes' },
    ],
  },
  // ── CHEST ───────────────────────────────────────────────────
  {
    id: 'chest', label_th: 'หน้าอก', label_en: 'Chest', view: 'front',
    description_th: 'บริเวณหน้าอก หัวใจ และปอด',
    zoomViewport: [55, 115, 190, 135],
    labelPos: [150, 185],
    isEmergency: true,
    emergencyNote_th: 'เจ็บหน้าอกรุนแรง แน่น หายใจไม่ออก เหงื่อแตก ปวดร้าวแขน — โทร 1669 ทันที',
    hotline: '1669',
    symptoms: [
      { id: 'chest-pain', label_th: 'เจ็บหน้าอก', label_en: 'Chest pain', isEmergency: true },
      { id: 'chest-tight', label_th: 'แน่นหน้าอก', label_en: 'Chest tightness', isEmergency: true },
      { id: 'breathless', label_th: 'หายใจลำบาก', label_en: 'Shortness of breath', isEmergency: true },
      { id: 'palpitation', label_th: 'ใจสั่น', label_en: 'Palpitation' },
      { id: 'cough', label_th: 'ไอ', label_en: 'Cough' },
      { id: 'sweating', label_th: 'เหงื่อออกมาก', label_en: 'Excessive sweating', isEmergency: true },
    ],
  },
  {
    id: 'upper-abdomen', label_th: 'ท้องส่วนบน', label_en: 'Upper Abdomen', view: 'front',
    description_th: 'กระเพาะอาหาร ตับ ตับอ่อน และม้าม',
    zoomViewport: [65, 240, 170, 90],
    labelPos: [150, 270],
    symptoms: [
      { id: 'stomach-pain', label_th: 'ปวดท้องบน', label_en: 'Upper abdominal pain' },
      { id: 'nausea', label_th: 'คลื่นไส้', label_en: 'Nausea' },
      { id: 'vomiting', label_th: 'อาเจียน', label_en: 'Vomiting' },
      { id: 'bloating', label_th: 'ท้องอืด', label_en: 'Bloating' },
      { id: 'heartburn', label_th: 'แสบร้อนกลางอก', label_en: 'Heartburn' },
    ],
  },
  {
    id: 'lower-abdomen', label_th: 'ท้องส่วนล่าง', label_en: 'Lower Abdomen', view: 'front',
    description_th: 'ลำไส้ กระเพาะปัสสาวะ และอวัยวะสืบพันธุ์',
    zoomViewport: [65, 320, 170, 90],
    labelPos: [150, 345],
    symptoms: [
      { id: 'lower-pain', label_th: 'ปวดท้องน้อย', label_en: 'Lower abdominal pain' },
      { id: 'cramps', label_th: 'ปวดเกร็ง', label_en: 'Cramps' },
      { id: 'constipation', label_th: 'ท้องผูก', label_en: 'Constipation' },
      { id: 'diarrhea', label_th: 'ท้องเสีย', label_en: 'Diarrhea' },
      { id: 'blood-stool', label_th: 'ถ่ายเป็นเลือด', label_en: 'Blood in stool', isEmergency: true },
    ],
  },
  // ── SHOULDERS ───────────────────────────────────────────────
  {
    id: 'left-shoulder', label_th: 'ไหล่ซ้าย', label_en: 'Left Shoulder', view: 'front',
    description_th: 'ข้อไหล่ เอ็นและกล้ามเนื้อรอบไหล่ซ้าย',
    zoomViewport: [20, 110, 115, 90],
    labelPos: [62, 140],
    symptoms: [
      { id: 'shoulder-pain', label_th: 'ปวดไหล่', label_en: 'Shoulder pain' },
      { id: 'shoulder-stiff', label_th: 'ตึง/แข็ง', label_en: 'Stiffness' },
      { id: 'shoulder-weak', label_th: 'อ่อนแรง', label_en: 'Weakness' },
      { id: 'shoulder-lift', label_th: 'เจ็บเมื่อยกแขน', label_en: 'Pain when lifting' },
      { id: 'shoulder-click', label_th: 'มีเสียงดัง', label_en: 'Clicking sound' },
    ],
  },
  {
    id: 'right-shoulder', label_th: 'ไหล่ขวา', label_en: 'Right Shoulder', view: 'front',
    description_th: 'ข้อไหล่ เอ็นและกล้ามเนื้อรอบไหล่ขวา',
    zoomViewport: [165, 110, 115, 90],
    labelPos: [238, 140],
    symptoms: [
      { id: 'shoulder-pain', label_th: 'ปวดไหล่', label_en: 'Shoulder pain' },
      { id: 'shoulder-stiff', label_th: 'ตึง/แข็ง', label_en: 'Stiffness' },
      { id: 'shoulder-weak', label_th: 'อ่อนแรง', label_en: 'Weakness' },
      { id: 'shoulder-lift', label_th: 'เจ็บเมื่อยกแขน', label_en: 'Pain when lifting' },
      { id: 'shoulder-click', label_th: 'มีเสียงดัง', label_en: 'Clicking sound' },
    ],
  },
  // ── ARMS ─────────────────────────────────────────────────────
  {
    id: 'left-upper-arm', label_th: 'ต้นแขนซ้าย', label_en: 'Left Upper Arm', view: 'front',
    description_th: 'กล้ามเนื้อ Biceps Triceps ต้นแขนซ้าย',
    zoomViewport: [10, 192, 80, 120],
    labelPos: [38, 250],
    symptoms: [
      { id: 'arm-pain', label_th: 'ปวดแขน', label_en: 'Arm pain' },
      { id: 'arm-numb', label_th: 'ชาแขน', label_en: 'Arm numbness', isEmergency: true },
      { id: 'arm-weak', label_th: 'อ่อนแรง', label_en: 'Weakness' },
    ],
    isEmergency: true,
    emergencyNote_th: 'ชาหรืออ่อนแรงแขนซ้ายเฉียบพลัน ร่วมกับเจ็บหน้าอก อาจเป็นหัวใจวาย',
    hotline: '1669',
  },
  {
    id: 'right-upper-arm', label_th: 'ต้นแขนขวา', label_en: 'Right Upper Arm', view: 'front',
    description_th: 'กล้ามเนื้อ Biceps Triceps ต้นแขนขวา',
    zoomViewport: [210, 192, 80, 120],
    labelPos: [262, 250],
    symptoms: [
      { id: 'arm-pain', label_th: 'ปวดแขน', label_en: 'Arm pain' },
      { id: 'arm-numb', label_th: 'ชาแขน', label_en: 'Arm numbness' },
      { id: 'arm-weak', label_th: 'อ่อนแรง', label_en: 'Weakness' },
    ],
  },
  {
    id: 'left-elbow', label_th: 'ข้อศอกซ้าย', label_en: 'Left Elbow', view: 'front',
    description_th: 'ข้อศอก เอ็น Biceps และ Triceps ฝั่งซ้าย',
    zoomViewport: [5, 308, 70, 60],
    labelPos: [32, 338],
    symptoms: [
      { id: 'elbow-pain', label_th: 'ปวดข้อศอก', label_en: 'Elbow pain' },
      { id: 'elbow-stiff', label_th: 'ตึง', label_en: 'Stiffness' },
      { id: 'elbow-swelling', label_th: 'บวม', label_en: 'Swelling' },
    ],
  },
  {
    id: 'right-elbow', label_th: 'ข้อศอกขวา', label_en: 'Right Elbow', view: 'front',
    description_th: 'ข้อศอก เอ็น Biceps และ Triceps ฝั่งขวา',
    zoomViewport: [225, 308, 70, 60],
    labelPos: [268, 338],
    symptoms: [
      { id: 'elbow-pain', label_th: 'ปวดข้อศอก', label_en: 'Elbow pain' },
      { id: 'elbow-stiff', label_th: 'ตึง', label_en: 'Stiffness' },
      { id: 'elbow-swelling', label_th: 'บวม', label_en: 'Swelling' },
    ],
  },
  {
    id: 'left-forearm', label_th: 'แขนท่อนล่างซ้าย', label_en: 'Left Forearm', view: 'front',
    description_th: 'แขนท่อนล่างซ้าย ข้อมือและเส้นประสาท',
    zoomViewport: [8, 363, 60, 100],
    labelPos: [28, 408],
    symptoms: [
      { id: 'forearm-pain', label_th: 'ปวดแขนท่อนล่าง', label_en: 'Forearm pain' },
      { id: 'wrist-pain', label_th: 'ปวดข้อมือ', label_en: 'Wrist pain' },
      { id: 'numbness', label_th: 'ชา', label_en: 'Numbness' },
    ],
  },
  {
    id: 'right-forearm', label_th: 'แขนท่อนล่างขวา', label_en: 'Right Forearm', view: 'front',
    description_th: 'แขนท่อนล่างขวา ข้อมือและเส้นประสาท',
    zoomViewport: [232, 363, 60, 100],
    labelPos: [272, 408],
    symptoms: [
      { id: 'forearm-pain', label_th: 'ปวดแขนท่อนล่าง', label_en: 'Forearm pain' },
      { id: 'wrist-pain', label_th: 'ปวดข้อมือ', label_en: 'Wrist pain' },
      { id: 'numbness', label_th: 'ชา', label_en: 'Numbness' },
    ],
  },
  {
    id: 'left-hand', label_th: 'มือซ้าย', label_en: 'Left Hand', view: 'front',
    description_th: 'ฝ่ามือ นิ้วมือ และข้อต่อมือซ้าย',
    zoomViewport: [5, 458, 65, 70],
    labelPos: [28, 492],
    symptoms: [
      { id: 'hand-pain', label_th: 'ปวดมือ', label_en: 'Hand pain' },
      { id: 'finger-pain', label_th: 'ปวดนิ้ว', label_en: 'Finger pain' },
      { id: 'hand-numb', label_th: 'ชามือ', label_en: 'Hand numbness' },
    ],
  },
  {
    id: 'right-hand', label_th: 'มือขวา', label_en: 'Right Hand', view: 'front',
    description_th: 'ฝ่ามือ นิ้วมือ และข้อต่อมือขวา',
    zoomViewport: [230, 458, 65, 70],
    labelPos: [272, 492],
    symptoms: [
      { id: 'hand-pain', label_th: 'ปวดมือ', label_en: 'Hand pain' },
      { id: 'finger-pain', label_th: 'ปวดนิ้ว', label_en: 'Finger pain' },
      { id: 'hand-numb', label_th: 'ชามือ', label_en: 'Hand numbness' },
    ],
  },
  // ── HIPS ─────────────────────────────────────────────────────
  {
    id: 'left-hip', label_th: 'สะโพกซ้าย', label_en: 'Left Hip', view: 'front',
    description_th: 'ข้อสะโพกซ้าย กล้ามเนื้อและเอ็นโดยรอบ',
    zoomViewport: [55, 400, 95, 80],
    labelPos: [88, 435],
    symptoms: [
      { id: 'hip-pain', label_th: 'ปวดสะโพก', label_en: 'Hip pain' },
      { id: 'hip-click', label_th: 'มีเสียงดัง', label_en: 'Clicking' },
      { id: 'hip-stiff', label_th: 'ตึง', label_en: 'Stiffness' },
    ],
  },
  {
    id: 'right-hip', label_th: 'สะโพกขวา', label_en: 'Right Hip', view: 'front',
    description_th: 'ข้อสะโพกขวา กล้ามเนื้อและเอ็นโดยรอบ',
    zoomViewport: [150, 400, 95, 80],
    labelPos: [212, 435],
    symptoms: [
      { id: 'hip-pain', label_th: 'ปวดสะโพก', label_en: 'Hip pain' },
      { id: 'hip-click', label_th: 'มีเสียงดัง', label_en: 'Clicking' },
      { id: 'hip-stiff', label_th: 'ตึง', label_en: 'Stiffness' },
    ],
  },
  // ── LEGS ─────────────────────────────────────────────────────
  {
    id: 'left-thigh', label_th: 'ต้นขาซ้าย', label_en: 'Left Thigh', view: 'front',
    description_th: 'กล้ามเนื้อ Quadriceps และ Hamstring ต้นขาซ้าย',
    zoomViewport: [55, 472, 90, 115],
    labelPos: [88, 528],
    symptoms: [
      { id: 'thigh-pain', label_th: 'ปวดต้นขา', label_en: 'Thigh pain' },
      { id: 'thigh-tight', label_th: 'ตึง', label_en: 'Tightness' },
      { id: 'thigh-numb', label_th: 'ชา', label_en: 'Numbness' },
    ],
  },
  {
    id: 'right-thigh', label_th: 'ต้นขาขวา', label_en: 'Right Thigh', view: 'front',
    description_th: 'กล้ามเนื้อ Quadriceps และ Hamstring ต้นขาขวา',
    zoomViewport: [155, 472, 90, 115],
    labelPos: [212, 528],
    symptoms: [
      { id: 'thigh-pain', label_th: 'ปวดต้นขา', label_en: 'Thigh pain' },
      { id: 'thigh-tight', label_th: 'ตึง', label_en: 'Tightness' },
      { id: 'thigh-numb', label_th: 'ชา', label_en: 'Numbness' },
    ],
  },
  {
    id: 'left-knee', label_th: 'เข่าซ้าย', label_en: 'Left Knee', view: 'front',
    description_th: 'ข้อเข่า สะบ้า และเอ็นไขว้ซ้าย',
    zoomViewport: [52, 582, 90, 68],
    labelPos: [86, 618],
    symptoms: [
      { id: 'knee-pain', label_th: 'ปวดเข่า', label_en: 'Knee pain' },
      { id: 'knee-swelling', label_th: 'บวม', label_en: 'Swelling' },
      { id: 'knee-click', label_th: 'มีเสียงดัง', label_en: 'Clicking' },
      { id: 'knee-lock', label_th: 'ข้อล็อค', label_en: 'Locking' },
      { id: 'knee-weak', label_th: 'เข่าอ่อน', label_en: 'Giving way' },
    ],
  },
  {
    id: 'right-knee', label_th: 'เข่าขวา', label_en: 'Right Knee', view: 'front',
    description_th: 'ข้อเข่า สะบ้า และเอ็นไขว้ขวา',
    zoomViewport: [158, 582, 90, 68],
    labelPos: [214, 618],
    symptoms: [
      { id: 'knee-pain', label_th: 'ปวดเข่า', label_en: 'Knee pain' },
      { id: 'knee-swelling', label_th: 'บวม', label_en: 'Swelling' },
      { id: 'knee-click', label_th: 'มีเสียงดัง', label_en: 'Clicking' },
      { id: 'knee-lock', label_th: 'ข้อล็อค', label_en: 'Locking' },
    ],
  },
  {
    id: 'left-lower-leg', label_th: 'น่องซ้าย', label_en: 'Left Lower Leg', view: 'front',
    description_th: 'กล้ามเนื้อน่อง แข้ง และเส้นเลือด',
    zoomViewport: [52, 644, 88, 105],
    labelPos: [84, 695],
    symptoms: [
      { id: 'calf-pain', label_th: 'ปวดน่อง', label_en: 'Calf pain' },
      { id: 'calf-cramp', label_th: 'ตะคริว', label_en: 'Cramps' },
      { id: 'calf-swelling', label_th: 'บวมแดง', label_en: 'Swelling/redness', isEmergency: true },
    ],
  },
  {
    id: 'right-lower-leg', label_th: 'น่องขวา', label_en: 'Right Lower Leg', view: 'front',
    description_th: 'กล้ามเนื้อน่อง แข้ง และเส้นเลือด',
    zoomViewport: [160, 644, 88, 105],
    labelPos: [216, 695],
    symptoms: [
      { id: 'calf-pain', label_th: 'ปวดน่อง', label_en: 'Calf pain' },
      { id: 'calf-cramp', label_th: 'ตะคริว', label_en: 'Cramps' },
      { id: 'calf-swelling', label_th: 'บวมแดง', label_en: 'Swelling/redness', isEmergency: true },
    ],
  },
  {
    id: 'left-foot', label_th: 'เท้าซ้าย', label_en: 'Left Foot', view: 'front',
    description_th: 'เท้า ฝ่าเท้า ส้นเท้า และนิ้วเท้าซ้าย',
    zoomViewport: [45, 745, 100, 65],
    labelPos: [82, 778],
    symptoms: [
      { id: 'foot-pain', label_th: 'ปวดเท้า', label_en: 'Foot pain' },
      { id: 'heel-pain', label_th: 'ปวดส้นเท้า', label_en: 'Heel pain' },
      { id: 'arch-pain', label_th: 'ปวดฝ่าเท้า', label_en: 'Arch pain' },
    ],
  },
  {
    id: 'right-foot', label_th: 'เท้าขวา', label_en: 'Right Foot', view: 'front',
    description_th: 'เท้า ฝ่าเท้า ส้นเท้า และนิ้วเท้าขวา',
    zoomViewport: [155, 745, 100, 65],
    labelPos: [218, 778],
    symptoms: [
      { id: 'foot-pain', label_th: 'ปวดเท้า', label_en: 'Foot pain' },
      { id: 'heel-pain', label_th: 'ปวดส้นเท้า', label_en: 'Heel pain' },
      { id: 'arch-pain', label_th: 'ปวดฝ่าเท้า', label_en: 'Arch pain' },
    ],
  },
  // ── BACK REGIONS ────────────────────────────────────────────
  {
    id: 'upper-back', label_th: 'หลังส่วนบน', label_en: 'Upper Back', view: 'back',
    description_th: 'บริเวณหลังส่วนบน กระดูกสันหลังทรวงอก',
    zoomViewport: [65, 128, 170, 90],
    labelPos: [150, 173],
    symptoms: [
      { id: 'back-pain', label_th: 'ปวดหลังส่วนบน', label_en: 'Upper back pain' },
      { id: 'back-tight', label_th: 'ตึง', label_en: 'Tightness' },
      { id: 'back-burning', label_th: 'แสบร้อน', label_en: 'Burning' },
      { id: 'rib-pain', label_th: 'ปวดรอบซี่โครง', label_en: 'Rib pain' },
    ],
  },
  {
    id: 'scapular-area', label_th: 'สะบัก', label_en: 'Scapular Area', view: 'back',
    description_th: 'สะบักซ้ายและขวา เอ็นและกล้ามเนื้อรอบสะบัก',
    zoomViewport: [55, 118, 190, 110],
    labelPos: [150, 168],
    symptoms: [
      { id: 'scapula-pain', label_th: 'ปวดสะบัก', label_en: 'Scapula pain' },
      { id: 'scapula-tight', label_th: 'ตึงสะบัก', label_en: 'Scapula tightness' },
      { id: 'scapula-wing', label_th: 'สะบักยื่น', label_en: 'Winging scapula' },
      { id: 'shoulder-pain', label_th: 'ปวดไหล่', label_en: 'Shoulder pain' },
    ],
  },
  {
    id: 'mid-back', label_th: 'หลังส่วนกลาง', label_en: 'Mid Back', view: 'back',
    description_th: 'กระดูกสันหลังส่วนกลาง กล้ามเนื้อ Erector Spinae',
    zoomViewport: [70, 228, 160, 90],
    labelPos: [150, 273],
    symptoms: [
      { id: 'mid-back-pain', label_th: 'ปวดหลังส่วนกลาง', label_en: 'Mid back pain' },
      { id: 'stiffness', label_th: 'แข็ง/ตึง', label_en: 'Stiffness' },
    ],
  },
  {
    id: 'lower-back', label_th: 'หลังส่วนล่าง', label_en: 'Lower Back', view: 'back',
    description_th: 'กระดูกสันหลัง L1-L5 กล้ามเนื้อและหมอนรองกระดูก',
    zoomViewport: [65, 318, 170, 90],
    labelPos: [150, 363],
    symptoms: [
      { id: 'low-back-pain', label_th: 'ปวดหลังส่วนล่าง', label_en: 'Lower back pain' },
      { id: 'radiate-leg', label_th: 'ปวดร้าวลงขา', label_en: 'Pain radiating to leg', isEmergency: true },
      { id: 'low-back-stiff', label_th: 'ตึง', label_en: 'Stiffness' },
      { id: 'numbness-leg', label_th: 'ชาขา', label_en: 'Leg numbness' },
    ],
  },
  {
    id: 'left-buttock', label_th: 'ก้นซ้าย', label_en: 'Left Buttock', view: 'back',
    description_th: 'กล้ามเนื้อก้นซ้าย Gluteus Maximus และ Piriformis',
    zoomViewport: [55, 400, 95, 90],
    labelPos: [88, 445],
    symptoms: [
      { id: 'gluteal-pain', label_th: 'ปวดก้น', label_en: 'Gluteal pain' },
      { id: 'sciatica', label_th: 'ปวดร้าวลงขา (Sciatica)', label_en: 'Sciatica' },
      { id: 'si-pain', label_th: 'ปวด SI Joint', label_en: 'SI joint pain' },
    ],
  },
  {
    id: 'right-buttock', label_th: 'ก้นขวา', label_en: 'Right Buttock', view: 'back',
    description_th: 'กล้ามเนื้อก้นขวา Gluteus Maximus และ Piriformis',
    zoomViewport: [150, 400, 95, 90],
    labelPos: [212, 445],
    symptoms: [
      { id: 'gluteal-pain', label_th: 'ปวดก้น', label_en: 'Gluteal pain' },
      { id: 'sciatica', label_th: 'ปวดร้าวลงขา (Sciatica)', label_en: 'Sciatica' },
    ],
  },
]

// Lookup helpers
export function getRegion(id: RegionId): BodyRegion | undefined {
  return BODY_REGIONS.find(r => r.id === id)
}

export function getRegionsByView(view: ViewMode): BodyRegion[] {
  return BODY_REGIONS.filter(r => r.view === view || r.view === 'both')
}

// Search: find regions matching a Thai keyword
export function searchRegions(query: string): BodyRegion[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return BODY_REGIONS.filter(r =>
    r.label_th.includes(q) ||
    r.label_en.toLowerCase().includes(q) ||
    r.symptoms.some(s => s.label_th.includes(q) || s.label_en.toLowerCase().includes(q))
  )
}

// Quick search suggestions
export const SEARCH_SUGGESTIONS = [
  { query: 'ปวดสะบัก', regionId: 'scapular-area' as RegionId },
  { query: 'เจ็บหน้าอก', regionId: 'chest' as RegionId },
  { query: 'ปวดหลัง', regionId: 'lower-back' as RegionId },
  { query: 'ชาแขน', regionId: 'left-upper-arm' as RegionId },
  { query: 'ปวดเข่า', regionId: 'left-knee' as RegionId },
  { query: 'ปวดคอ', regionId: 'neck' as RegionId },
  { query: 'ปวดไหล่', regionId: 'left-shoulder' as RegionId },
  { query: 'ปวดเท้า', regionId: 'left-foot' as RegionId },
]
