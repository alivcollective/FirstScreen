// Hospital data for Thailand — structured for Supabase migration
// Note: Demo data for development. Verify all details before production use.

export interface Hospital {
  id: string
  nameTh: string
  nameEn: string
  province: string
  district: string
  address: string
  lat?: number
  lng?: number
  phone: string
  website?: string
  type: 'public' | 'private' | 'clinic'
  accreditations: string[]
  insuranceAccepted: string[]
  specialties: string[]
  languages: string[]
  rating?: number
  ratingCount?: number
  isVerified: boolean
  note?: string
  emergencyAvailable: boolean
}

export const HOSPITALS: Hospital[] = [
  // ── Bangkok Private ─────────────────────────────────────────
  {
    id: 'bumrungrad',
    nameTh: 'โรงพยาบาลบำรุงราษฎร์ อินเตอร์เนชั่นแนล',
    nameEn: 'Bumrungrad International Hospital',
    province: 'กรุงเทพฯ',
    district: 'วัฒนา',
    address: '33 Sukhumvit Soi 3, Wattana, Bangkok 10110',
    lat: 13.7434, lng: 100.5500,
    phone: '02-066-8888',
    website: 'bumrungrad.com',
    type: 'private',
    accreditations: ['JCI', 'HA Thailand'],
    insuranceAccepted: ['AIA', 'FWD', 'AXA', 'Allianz', 'BUPA', 'Cigna', 'เอกชนทุกราย'],
    specialties: ['หัวใจและหลอดเลือด', 'มะเร็งวิทยา', 'ระบบทางเดินอาหาร', 'ออร์โธปิดิกส์', 'เวชศาสตร์ป้องกัน', 'นรีเวช'],
    languages: ['ไทย', 'อังกฤษ', 'จีน', 'ญี่ปุ่น', 'อาหรับ'],
    rating: 4.8, ratingCount: 12400,
    isVerified: true,
    note: 'โรงพยาบาลนานาชาติระดับ World Class ผู้ป่วยต่างชาติมากที่สุดในเอเชีย',
    emergencyAvailable: true,
  },
  {
    id: 'bangkok-hospital-main',
    nameTh: 'โรงพยาบาลกรุงเทพ (สำนักงานใหญ่)',
    nameEn: 'Bangkok Hospital (Main)',
    province: 'กรุงเทพฯ',
    district: 'บางกอกน้อย',
    address: '2 Soi Somprasong 7, Bangkok Noi, Bangkok 10600',
    lat: 13.7568, lng: 100.4900,
    phone: '02-310-3000',
    website: 'bangkokhospital.com',
    type: 'private',
    accreditations: ['JCI', 'HA Thailand', 'ISO'],
    insuranceAccepted: ['AIA', 'FWD', 'Muang Thai', 'เอกชนทุกราย'],
    specialties: ['หัวใจและหลอดเลือด', 'มะเร็งวิทยา', 'สมองและระบบประสาท', 'กระดูกและข้อ'],
    languages: ['ไทย', 'อังกฤษ', 'จีน'],
    rating: 4.6, ratingCount: 8900,
    isVerified: true,
    note: 'เครือ BDMS — 49 โรงพยาบาลทั่วประเทศ',
    emergencyAvailable: true,
  },
  {
    id: 'samitivej-sukhumvit',
    nameTh: 'โรงพยาบาลสมิติเวช สุขุมวิท',
    nameEn: 'Samitivej Sukhumvit Hospital',
    province: 'กรุงเทพฯ',
    district: 'วัฒนา',
    address: '133 Sukhumvit 49, Khlongtan Nuea, Wattana, Bangkok 10110',
    lat: 13.7308, lng: 100.5720,
    phone: '02-022-2222',
    website: 'samitivej.co.th',
    type: 'private',
    accreditations: ['JCI', 'HA Thailand'],
    insuranceAccepted: ['AIA', 'FWD', 'AXA', 'Cigna', 'เอกชนทุกราย'],
    specialties: ['กุมารเวชกรรม', 'สูตินรีเวช', 'หัวใจและหลอดเลือด', 'ออร์โธปิดิกส์'],
    languages: ['ไทย', 'อังกฤษ', 'ญี่ปุ่น'],
    rating: 4.7, ratingCount: 7200,
    isVerified: true,
    note: 'เชี่ยวชาญด้านกุมารเวชและครอบครัว',
    emergencyAvailable: true,
  },
  {
    id: 'vejthani',
    nameTh: 'โรงพยาบาลเวชธานี',
    nameEn: 'Vejthani Hospital',
    province: 'กรุงเทพฯ',
    district: 'ลาดกระบัง',
    address: '1 Ladprao 111, Wang Thonglang, Bangkok 10310',
    lat: 13.7652, lng: 100.6432,
    phone: '02-734-0000',
    website: 'vejthani.com',
    type: 'private',
    accreditations: ['JCI', 'HA Thailand'],
    insuranceAccepted: ['AIA', 'AXA', 'เอกชนทุกราย', 'อาหรับ'],
    specialties: ['กระดูกและข้อ', 'หัวใจและหลอดเลือด', 'ระบบประสาท', 'มะเร็งวิทยา'],
    languages: ['ไทย', 'อังกฤษ', 'อาหรับ'],
    rating: 4.5, ratingCount: 4100,
    isVerified: true,
    note: 'เชี่ยวชาญออร์โธปิดิกส์ระดับนานาชาติ',
    emergencyAvailable: true,
  },
  {
    id: 'praram9',
    nameTh: 'โรงพยาบาลพระรามเก้า',
    nameEn: 'Praram 9 Hospital',
    province: 'กรุงเทพฯ',
    district: 'ห้วยขวาง',
    address: '99 Praram 9 Rd, Huai Khwang, Bangkok 10320',
    lat: 13.7439, lng: 100.5648,
    phone: '02-202-9999',
    website: 'praram9.com',
    type: 'private',
    accreditations: ['HA Thailand'],
    insuranceAccepted: ['AIA', 'Muang Thai', 'SSS', 'เอกชนทุกราย'],
    specialties: ['หัวใจและหลอดเลือด', 'มะเร็งวิทยา', 'อายุรกรรม', 'ฉุกเฉิน'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.3, ratingCount: 3200,
    isVerified: true,
    emergencyAvailable: true,
  },
  // ── Bangkok Public ──────────────────────────────────────────
  {
    id: 'rajavithi',
    nameTh: 'โรงพยาบาลราชวิถี',
    nameEn: 'Rajavithi Hospital',
    province: 'กรุงเทพฯ',
    district: 'ราชเทวี',
    address: '2 Phayathai Rd, Ratchathewi, Bangkok 10400',
    lat: 13.7617, lng: 100.5370,
    phone: '02-354-8108',
    website: 'rajavithi.go.th',
    type: 'public',
    accreditations: ['HA Thailand'],
    insuranceAccepted: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    specialties: ['อายุรกรรม', 'ศัลยกรรม', 'มะเร็งวิทยา', 'หัวใจและหลอดเลือด'],
    languages: ['ไทย'],
    rating: 4.1, ratingCount: 3400,
    isVerified: true,
    note: 'รับสิทธิ 30 บาท CSMBS ประกันสังคม',
    emergencyAvailable: true,
  },
  {
    id: 'siriraj',
    nameTh: 'โรงพยาบาลศิริราช',
    nameEn: 'Siriraj Hospital',
    province: 'กรุงเทพฯ',
    district: 'บางกอกน้อย',
    address: '2 Wanglang Rd, Bangkok Noi, Bangkok 10700',
    lat: 13.7611, lng: 100.4893,
    phone: '02-419-7000',
    website: 'si.mahidol.ac.th',
    type: 'public',
    accreditations: ['HA Thailand'],
    insuranceAccepted: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    specialties: ['ทุกสาขา', 'Medical Excellence Center', 'Clinical Research', 'ปลูกถ่ายอวัยวะ'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.3, ratingCount: 9800,
    isVerified: true,
    note: 'โรงพยาบาลมหาวิทยาลัยชั้นนำ มีทุกสาขาเฉพาะทาง',
    emergencyAvailable: true,
  },
  {
    id: 'chulalongkorn',
    nameTh: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
    nameEn: 'King Chulalongkorn Memorial Hospital',
    province: 'กรุงเทพฯ',
    district: 'ปทุมวัน',
    address: '1873 Rama 4 Rd, Pathumwan, Bangkok 10330',
    lat: 13.7341, lng: 100.5302,
    phone: '02-256-4000',
    website: 'chulalongkornhospital.go.th',
    type: 'public',
    accreditations: ['HA Thailand'],
    insuranceAccepted: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    specialties: ['อายุรกรรม', 'ศัลยกรรม', 'มะเร็งวิทยา', 'ต่อมไร้ท่อ'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.4, ratingCount: 7600,
    isVerified: true,
    note: 'สภากาชาดไทย เชี่ยวชาญมะเร็งและโรคซับซ้อน',
    emergencyAvailable: true,
  },
  // ── Chiang Mai ──────────────────────────────────────────────
  {
    id: 'maharaj-cmu',
    nameTh: 'โรงพยาบาลมหาราชนครเชียงใหม่',
    nameEn: 'Maharaj Nakorn Chiang Mai Hospital',
    province: 'เชียงใหม่',
    district: 'เมือง',
    address: '110 Intawarorot Rd, Sri Phum, Mueang, Chiang Mai 50200',
    lat: 18.7944, lng: 98.9706,
    phone: '053-935-000',
    website: 'med.cmu.ac.th',
    type: 'public',
    accreditations: ['HA Thailand'],
    insuranceAccepted: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    specialties: ['ทุกสาขา', 'มะเร็งวิทยา', 'ประสาทวิทยา'],
    languages: ['ไทย', 'อังกฤษ'],
    rating: 4.2, ratingCount: 4100,
    isVerified: true,
    note: 'โรงพยาบาลมหาวิทยาลัยชั้นนำภาคเหนือ',
    emergencyAvailable: true,
  },
  {
    id: 'bangkok-chiang-mai',
    nameTh: 'โรงพยาบาลกรุงเทพเชียงใหม่',
    nameEn: 'Bangkok Hospital Chiang Mai',
    province: 'เชียงใหม่',
    district: 'เมือง',
    address: '88 Boonruangrit Rd, Chang Klan, Mueang, Chiang Mai 50100',
    lat: 18.7815, lng: 98.9971,
    phone: '052-089-888',
    website: 'bangkokhospital.com',
    type: 'private',
    accreditations: ['JCI', 'HA Thailand'],
    insuranceAccepted: ['AIA', 'FWD', 'เอกชนทุกราย'],
    specialties: ['หัวใจและหลอดเลือด', 'มะเร็งวิทยา', 'ออร์โธปิดิกส์'],
    languages: ['ไทย', 'อังกฤษ', 'จีน'],
    rating: 4.5, ratingCount: 2800,
    isVerified: true,
    emergencyAvailable: true,
  },
  // ── Khon Kaen ────────────────────────────────────────────────
  {
    id: 'srinagarind',
    nameTh: 'โรงพยาบาลศรีนครินทร์ ขอนแก่น',
    nameEn: 'Srinagarind Hospital, Khon Kaen',
    province: 'ขอนแก่น',
    district: 'เมือง',
    address: '123 Mittraphap Rd, Nai Mueang, Mueang, Khon Kaen 40002',
    lat: 16.4699, lng: 102.8359,
    phone: '043-363-000',
    type: 'public',
    accreditations: ['HA Thailand'],
    insuranceAccepted: ['UCS (30 บาท)', 'CSMBS', 'SSS'],
    specialties: ['ทุกสาขา', 'มะเร็งวิทยา', 'โรคตับ (พยาธิใบไม้ตับ)'],
    languages: ['ไทย'],
    rating: 4.1, ratingCount: 2200,
    isVerified: true,
    note: 'โรงพยาบาลอ้างอิงภาคอีสาน เชี่ยวชาญโรคตับและพยาธิใบไม้ตับ',
    emergencyAvailable: true,
  },
  // ── Phuket ──────────────────────────────────────────────────
  {
    id: 'bangkok-phuket',
    nameTh: 'โรงพยาบาลกรุงเทพภูเก็ต',
    nameEn: 'Bangkok Hospital Phuket',
    province: 'ภูเก็ต',
    district: 'เมือง',
    address: '2/1 Hongyok Utis Rd, Taladyai, Mueang, Phuket 83000',
    lat: 7.9072, lng: 98.3922,
    phone: '076-254-425',
    website: 'bangkokhospitalphuket.com',
    type: 'private',
    accreditations: ['JCI', 'HA Thailand'],
    insuranceAccepted: ['เอกชนทุกราย', 'Travel Insurance', 'International'],
    specialties: ['หัวใจและหลอดเลือด', 'ออร์โธปิดิกส์', 'เวชศาสตร์ฉุกเฉิน'],
    languages: ['ไทย', 'อังกฤษ', 'เยอรมัน', 'สแกนดิเนเวีย'],
    rating: 4.5, ratingCount: 3100,
    isVerified: true,
    note: 'รองรับนักท่องเที่ยวต่างชาติและผู้อยู่อาศัยในภูเก็ต',
    emergencyAvailable: true,
  },
]

export function getHospitalsByProvince(province: string): Hospital[] {
  if (!province || province === 'all') return HOSPITALS
  return HOSPITALS.filter(h =>
    h.province === province ||
    h.nameTh.includes(province) ||
    h.nameEn.toLowerCase().includes(province.toLowerCase())
  )
}

export function getHospitalById(id: string): Hospital | undefined {
  return HOSPITALS.find(h => h.id === id)
}

export const PROVINCES = [...new Set(HOSPITALS.map(h => h.province))]
