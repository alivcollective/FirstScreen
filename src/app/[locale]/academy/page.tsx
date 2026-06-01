import type { Metadata } from 'next'
import { BookOpen, Clock, Award, ChevronRight, Play, Star } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'สถาบันสุขภาพ — Health Academy | Health Compass',
  description: 'หลักสูตรสุขภาพที่อิงหลักฐานทางการแพทย์ เรียนรู้เรื่องโรคหัวใจ เบาหวาน มะเร็ง และการดูแลสุขภาพเชิงป้องกัน',
}

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', count: 12 },
  { id: 'cardiovascular', label: 'หัวใจและหลอดเลือด', count: 3 },
  { id: 'diabetes', label: 'เบาหวาน', count: 3 },
  { id: 'cancer', label: 'มะเร็ง', count: 3 },
  { id: 'mental', label: 'สุขภาพจิต', count: 3 },
]

const COURSES = [
  {
    id: 'c1',
    category: 'cardiovascular',
    titleTh: 'ทำความเข้าใจโรคหัวใจและหลอดเลือด',
    descTh: 'เรียนรู้ปัจจัยเสี่ยง อาการเตือน และวิธีป้องกันโรคหัวใจที่เป็นสาเหตุการเสียชีวิตอันดับ 1 ของประเทศไทย',
    duration: 25,
    lessons: 5,
    level: 'beginner',
    status: 'available',
    rating: 4.8,
    enrolled: 2400,
    topics: ['ปัจจัยเสี่ยง CVD', 'Framingham Score คืออะไร', 'อาการที่ต้องระวัง', 'การป้องกันด้วยอาหาร', 'ออกกำลังกายสำหรับหัวใจ'],
  },
  {
    id: 'c2',
    category: 'cardiovascular',
    titleTh: 'ความดันโลหิตสูง: ฆาตกรเงียบ',
    descTh: 'ความดันโลหิตสูงทำไมถึงอันตราย? เรียนรู้วิธีวัดความดันเอง เป้าหมายที่ถูกต้อง และวิธีควบคุมโดยไม่ต้องพึ่งยาเสมอไป',
    duration: 20,
    lessons: 4,
    level: 'beginner',
    status: 'available',
    rating: 4.7,
    enrolled: 3100,
    topics: ['ความดันเท่าไหร่ถึงผิดปกติ', 'วิธีวัดความดันที่ถูกต้อง', 'อาหารลดความดัน (DASH Diet)', 'เมื่อไหร่ต้องกินยา'],
  },
  {
    id: 'c3',
    category: 'cardiovascular',
    titleTh: 'คอเลสเตอรอล: เข้าใจให้ถูกต้อง',
    descTh: 'คอเลสเตอรอล HDL vs LDL ต่างกันอย่างไร ค่าไหนดี ค่าไหนต้องระวัง และจัดการด้วยวิถีชีวิตได้อย่างไร',
    duration: 15,
    lessons: 3,
    level: 'beginner',
    status: 'coming_soon',
    rating: null,
    enrolled: 0,
    topics: ['LDL vs HDL', 'Lipid Profile คืออะไร', 'อาหารและคอเลสเตอรอล', 'Statin ยาลดไขมัน'],
  },
  {
    id: 'c4',
    category: 'diabetes',
    titleTh: 'เบาหวาน: รู้จักก่อนโรครู้จักเรา',
    descTh: 'ภาพรวมโรคเบาหวานชนิดที่ 2 เหตุใดไทยจึงมีผู้ป่วยเบาหวานมาก และทำไมการตรวจพบตั้งแต่เนิ่นๆ จึงสำคัญที่สุด',
    duration: 30,
    lessons: 6,
    level: 'beginner',
    status: 'available',
    rating: 4.9,
    enrolled: 5200,
    topics: ['เบาหวานคืออะไร', 'อินซูลินและน้ำตาล', 'ระยะก่อนเบาหวาน (Prediabetes)', 'อาการที่ต้องรู้', 'ตรวจเลือดอย่างไร', 'ภาวะแทรกซ้อน'],
  },
  {
    id: 'c5',
    category: 'diabetes',
    titleTh: 'ป้องกันเบาหวานด้วยวิถีชีวิต',
    descTh: 'หลักฐานพิสูจน์แล้วว่าการเปลี่ยนแปลงวิถีชีวิตลดความเสี่ยงเบาหวานได้ 58% เรียนรู้วิธีที่ใช้ได้จริงในชีวิตประจำวันไทย',
    duration: 35,
    lessons: 7,
    level: 'intermediate',
    status: 'available',
    rating: 4.8,
    enrolled: 3800,
    topics: ['อาหาร Glycemic Index', 'ข้าวกล้อง vs ข้าวขาว', 'ออกกำลังกายลดน้ำตาล', 'ลดน้ำหนัก 5-7%', 'นอนหลับและน้ำตาล', 'ติดตามผล'],
  },
  {
    id: 'c6',
    category: 'diabetes',
    titleTh: 'อยู่กับเบาหวานอย่างมีคุณภาพ',
    descTh: 'สำหรับผู้ป่วยเบาหวานที่ต้องการจัดการชีวิตประจำวัน เรียนรู้การกิน ออกกำลังกาย และติดตามระดับน้ำตาลอย่างมีระบบ',
    duration: 40,
    lessons: 8,
    level: 'intermediate',
    status: 'coming_soon',
    rating: null,
    enrolled: 0,
    topics: ['เป้าหมาย HbA1c', 'วางแผนมื้ออาหาร', 'ยาเบาหวาน overview', 'ป้องกันภาวะแทรกซ้อน'],
  },
  {
    id: 'c7',
    category: 'cancer',
    titleTh: 'การป้องกันมะเร็ง: สิ่งที่คุณทำได้',
    descTh: 'มะเร็ง 40% ป้องกันได้ด้วยการเปลี่ยนแปลงวิถีชีวิต เรียนรู้ปัจจัยเสี่ยงที่ควบคุมได้และการป้องกันอย่างมีหลักฐาน',
    duration: 25,
    lessons: 5,
    level: 'beginner',
    status: 'available',
    rating: 4.7,
    enrolled: 1900,
    topics: ['ปัจจัยเสี่ยงที่ควบคุมได้', 'อาหาร anti-cancer', 'บุหรี่และมะเร็ง', 'แอลกอฮอล์และมะเร็ง', 'HPV vaccine'],
  },
  {
    id: 'c8',
    category: 'cancer',
    titleTh: 'ตรวจมะเร็งตั้งแต่เนิ่นๆ',
    descTh: 'คู่มือการตรวจคัดกรองมะเร็ง 5 ชนิดที่พบบ่อยในไทย ใครควรตรวจ เมื่อไหร่ และตรวจด้วยวิธีใด',
    duration: 30,
    lessons: 6,
    level: 'beginner',
    status: 'available',
    rating: 4.9,
    enrolled: 4100,
    topics: ['มะเร็งเต้านม Mammogram', 'Pap Smear มะเร็งปากมดลูก', 'ส่องกล้องลำไส้ใหญ่', 'CT ปอดสำหรับผู้สูบบุหรี่', 'AFP มะเร็งตับ'],
  },
  {
    id: 'c9',
    category: 'cancer',
    titleTh: 'อยู่อย่างไรหลังวินิจฉัยมะเร็ง',
    descTh: 'สำหรับผู้ป่วยและครอบครัว เรียนรู้การรับมือกับการวินิจฉัย ทำความเข้าใจทางเลือกการรักษา และดูแลคุณภาพชีวิต',
    duration: 45,
    lessons: 9,
    level: 'intermediate',
    status: 'coming_soon',
    rating: null,
    enrolled: 0,
    topics: ['ทำความเข้าใจระยะมะเร็ง', 'เคมีบำบัดและผลข้างเคียง', 'โภชนาการระหว่างรักษา', 'สุขภาพจิตผู้ป่วยมะเร็ง'],
  },
  {
    id: 'c10',
    category: 'mental',
    titleTh: 'ทำความเข้าใจโรคซึมเศร้า',
    descTh: '1 ใน 7 คนไทยมีภาวะซึมเศร้า แต่หลายคนยังไม่รู้ว่าตัวเองเป็น เรียนรู้อาการ สาเหตุ และวิธีขอความช่วยเหลือ',
    duration: 20,
    lessons: 4,
    level: 'beginner',
    status: 'available',
    rating: 4.8,
    enrolled: 2700,
    topics: ['ซึมเศร้าคืออะไร', 'อาการและสัญญาณเตือน', 'ขอความช่วยเหลือได้ที่ไหน', 'สนับสนุนคนที่รัก'],
  },
  {
    id: 'c11',
    category: 'mental',
    titleTh: 'จัดการความเครียดอย่างมีวิทยาศาสตร์',
    descTh: 'เรียนรู้เทคนิคการจัดการความเครียดที่มีหลักฐานทางวิทยาศาสตร์รองรับ จาก Mindfulness ถึง Cognitive Behavioral Techniques',
    duration: 25,
    lessons: 5,
    level: 'beginner',
    status: 'available',
    rating: 4.6,
    enrolled: 3300,
    topics: ['ความเครียดทางสรีรวิทยา', 'Mindfulness เบื้องต้น', 'การหายใจเพื่อลดเครียด', 'CBT techniques', 'วางแผนพักผ่อน'],
  },
  {
    id: 'c12',
    category: 'mental',
    titleTh: 'สุขภาพจิตในที่ทำงาน',
    descTh: 'Burnout, โรควิตกกังวล และภาวะเครียดสะสมในชีวิตการทำงาน รู้จักสัญญาณและวิธีดูแลตัวเองในระยะยาว',
    duration: 30,
    lessons: 6,
    level: 'intermediate',
    status: 'coming_soon',
    rating: null,
    enrolled: 0,
    topics: ['Burnout vs เครียดปกติ', 'การตั้งขอบเขต', 'พักเพื่อประสิทธิภาพ', 'ขอความช่วยเหลือในที่ทำงาน'],
  },
]

const LEVEL_LABELS = {
  beginner: { th: 'เริ่มต้น', color: 'text-emerald-600 bg-emerald-50' },
  intermediate: { th: 'ปานกลาง', color: 'text-blue-600 bg-blue-50' },
}

export default function AcademyPage() {
  const availableCourses = COURSES.filter(c => c.status === 'available')
  const comingSoonCourses = COURSES.filter(c => c.status === 'coming_soon')

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                <BookOpen className="h-5 w-5 text-teal-400" />
              </div>
              <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20">สถาบันสุขภาพ</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Health Academy</h1>
            <p className="text-slate-400 max-w-xl">
              หลักสูตรสุขภาพที่อิงหลักฐานทางการแพทย์ ตรวจสอบโดยทีมแพทย์ผู้เชี่ยวชาญ เรียนฟรีทุกหลักสูตร
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { value: '12', label: 'หลักสูตร' },
                { value: '9', label: 'พร้อมเรียน' },
                { value: '24,800+', label: 'ผู้เรียน' },
                { value: 'ฟรี', label: 'ทุกหลักสูตร' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-teal-400">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${cat.id==='all'?'bg-teal-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'}`}>
                {cat.label}
                <span className="ml-1.5 text-[11px] opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Available Courses */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">หลักสูตรที่พร้อมเรียน</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableCourses.map(course => {
                const levelInfo = LEVEL_LABELS[course.level as keyof typeof LEVEL_LABELS]
                return (
                  <div key={course.id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
                    {/* Color header */}
                    <div className={`h-2 w-full ${
                      course.category==='cardiovascular'?'bg-gradient-to-r from-red-400 to-rose-500':
                      course.category==='diabetes'?'bg-gradient-to-r from-amber-400 to-orange-500':
                      course.category==='cancer'?'bg-gradient-to-r from-violet-500 to-purple-600':
                      'bg-gradient-to-r from-cyan-400 to-blue-500'
                    }`} />

                    <div className="p-5">
                      {/* Category + Level */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelInfo.color}`}>
                          {levelInfo.th}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {CATEGORIES.find(c=>c.id===course.category)?.label}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-teal-700 transition-colors">
                        {course.titleTh}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{course.descTh}</p>

                      {/* Topics preview */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {course.topics.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">+{course.topics.length-3}</span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration} นาที</span>
                          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessons} บทเรียน</span>
                        </div>
                        {course.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-slate-600">{course.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Enrolled */}
                      {course.enrolled > 0 && (
                        <p className="text-[10px] text-slate-400 mb-3">{course.enrolled.toLocaleString()} คนกำลังเรียน</p>
                      )}

                      <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 transition-colors">
                        <Play className="h-3.5 w-3.5" /> เริ่มเรียน
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">กำลังพัฒนา</h2>
            <p className="text-sm text-slate-500 mb-6">หลักสูตรเหล่านี้อยู่ระหว่างการพัฒนาและรอการรับรองจากทีมแพทย์</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {comingSoonCourses.map(course => (
                <div key={course.id} className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-5 opacity-75">
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 mb-3">
                    เร็วๆ นี้
                  </span>
                  <h3 className="text-sm font-bold text-slate-700 mb-2 leading-snug">{course.titleTh}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{course.descTh}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center">
            <Award className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">ใบรับรองการเรียน</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-5">
              เมื่อเรียนจบทุกบทเรียนและผ่านแบบทดสอบ คุณจะได้รับใบรับรองดิจิทัลที่แชร์บน LinkedIn และโซเชียลได้
            </p>
            <span className="inline-block rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-2.5 text-sm font-semibold text-amber-300">
              ฟีเจอร์ใบรับรองกำลังพัฒนา
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
