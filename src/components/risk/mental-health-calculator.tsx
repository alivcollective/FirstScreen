'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Brain, Phone, ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

type Tool = 'phq9' | 'gad7'

const PHQ9_QUESTIONS = [
  'ท้อแท้ ไม่สนใจทำสิ่งต่างๆ หรือทำกิจกรรมที่เคยสนุกได้น้อยลง',
  'รู้สึกซึมเศร้า หดหู่ หมดหวัง หรือสิ้นหวัง',
  'นอนหลับยาก หลับๆ ตื่นๆ หรือนอนมากเกินไป',
  'รู้สึกเหนื่อยล้า ไม่มีแรงทำอะไร',
  'เบื่ออาหาร หรือกินมากเกินไป',
  'รู้สึกไม่ดีกับตัวเอง รู้สึกว่าตัวเองล้มเหลว หรือทำให้คนอื่นผิดหวัง',
  'ยากที่จะจดจ่อกับสิ่งต่างๆ เช่น การอ่านหนังสือหรือดูทีวี',
  'เคลื่อนไหวหรือพูดช้าจนคนอื่นสังเกตได้ หรือรู้สึกกระวนกระวายและอยู่นิ่งไม่ได้',
  'มีความคิดอยากทำร้ายตัวเอง หรือคิดว่าตัวเองตายไปจะดีกว่า', // CRITICAL RED FLAG
]

const GAD7_QUESTIONS = [
  'รู้สึกหงุดหงิด กังวล หรือวิตกกังวลอยู่เกือบตลอดเวลา',
  'ไม่สามารถหยุดหรือควบคุมความกังวลได้',
  'กังวลกับเรื่องต่างๆ มากเกินไป',
  'ไม่สามารถผ่อนคลายได้',
  'รู้สึกกระวนกระวายจนนั่งอยู่เฉยๆ ไม่ค่อยได้',
  'รู้สึกหงุดหงิดง่าย หรือโกรธง่ายขึ้น',
  'รู้สึกกลัวว่าจะมีเรื่องร้ายแกร่งเกิดขึ้น',
]

const FREQUENCY_OPTIONS = [
  { value: 0, label: 'ไม่เลย' },
  { value: 1, label: 'วันหรือสองวัน' },
  { value: 2, label: 'มากกว่าครึ่งของช่วงเวลา' },
  { value: 3, label: 'เกือบทุกวัน' },
]

function getPHQ9Result(score: number) {
  if (score <= 4) return { level: 'minimal', label: 'น้อยมาก/ไม่มี', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'ไม่พบอาการซึมเศร้าที่ชัดเจน รักษาสุขภาพจิตด้วยวิธีเชิงป้องกันต่อไป' }
  if (score <= 9) return { level: 'mild', label: 'เล็กน้อย', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'มีอาการซึมเศร้าระดับเล็กน้อย ควรติดตามอาการและพิจารณาขอรับคำปรึกษา' }
  if (score <= 14) return { level: 'moderate', label: 'ปานกลาง', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', desc: 'มีอาการซึมเศร้าระดับปานกลาง แนะนำให้พบจิตแพทย์หรือนักจิตวิทยาเพื่อรับการประเมิน' }
  if (score <= 19) return { level: 'moderately_severe', label: 'ค่อนข้างรุนแรง', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', desc: 'มีอาการค่อนข้างรุนแรง ควรพบจิตแพทย์หรือผู้เชี่ยวชาญโดยเร็ว' }
  return { level: 'severe', label: 'รุนแรง', color: 'text-red-900', bg: 'bg-red-100', border: 'border-red-400', desc: 'มีอาการรุนแรง ควรพบจิตแพทย์ทันที อย่าดูแลตัวเองคนเดียว' }
}

function getGAD7Result(score: number) {
  if (score <= 4) return { label: 'น้อยมาก', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'ไม่พบอาการวิตกกังวลที่ชัดเจน' }
  if (score <= 9) return { label: 'เล็กน้อย', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'มีอาการวิตกกังวลระดับเล็กน้อย ควรดูแลสุขภาพจิตและจัดการความเครียด' }
  if (score <= 14) return { label: 'ปานกลาง', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', desc: 'มีอาการวิตกกังวลปานกลาง แนะนำให้พบผู้เชี่ยวชาญด้านสุขภาพจิต' }
  return { label: 'รุนแรง', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', desc: 'มีอาการวิตกกังวลรุนแรง ควรพบจิตแพทย์โดยเร็ว' }
}

export function MentalHealthCalculator() {
  const locale = useLocale()
  const [activeTool, setActiveTool] = useState<Tool>('phq9')
  const [phq9Answers, setPHQ9Answers] = useState<Record<number, number>>({})
  const [gad7Answers, setGAD7Answers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const questions = activeTool === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS
  const answers = activeTool === 'phq9' ? phq9Answers : gad7Answers
  const setAnswers = activeTool === 'phq9' ? setPHQ9Answers : setGAD7Answers

  const allAnswered = questions.every((_, i) => answers[i] !== undefined)
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  const hasQ9RedFlag = activeTool === 'phq9' && (phq9Answers[8] ?? 0) > 0

  const phq9Result = getPHQ9Result(Object.values(phq9Answers).reduce((a, b) => a + b, 0))
  const gad7Result = getGAD7Result(Object.values(gad7Answers).reduce((a, b) => a + b, 0))

  const reset = () => {
    setPHQ9Answers({})
    setGAD7Answers({})
    setShowResults(false)
  }

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-5 bg-cyan-50 border-b border-cyan-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
            <Brain className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">ตรวจสุขภาพจิตเบื้องต้น</h3>
            <p className="text-xs text-slate-500">PHQ-9 (ซึมเศร้า) + GAD-7 (วิตกกังวล) · ~3 นาที</p>
          </div>
        </div>

        {/* Tool tabs */}
        <div className="flex gap-2">
          {([['phq9','PHQ-9 ซึมเศร้า'],['gad7','GAD-7 วิตกกังวล']] as [Tool, string][]).map(([tool, label]) => (
            <button key={tool} onClick={() => { setActiveTool(tool); setShowResults(false) }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${activeTool===tool?'bg-cyan-600 text-white':'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {!showResults ? (
        <div className="p-5 space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-800">
              <strong>คำชี้แจง:</strong> คำถามต่อไปนี้ถามเกี่ยวกับความรู้สึกของคุณ <strong>ในช่วง 2 สัปดาห์ที่ผ่านมา</strong> เครื่องมือนี้เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยโรค
            </p>
          </div>

          {hasQ9RedFlag && (
            <div className="rounded-xl bg-red-50 border-2 border-red-400 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-red-600" />
                <span className="text-sm font-bold text-red-800">หากคุณมีความคิดทำร้ายตัวเอง</span>
              </div>
              <p className="text-sm text-red-700 mb-3">โปรดโทรขอความช่วยเหลือทันที คุณไม่ต้องเผชิญสิ่งนี้คนเดียว</p>
              <div className="flex flex-wrap gap-2">
                <a href="tel:1323" className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                  <Phone className="h-4 w-4" /> โทร 1323 (สุขภาพจิต)
                </a>
                <a href="tel:02-713-6793" className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">
                  สายด่วนจิตเวช
                </a>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className={`rounded-xl border p-4 ${i===8&&activeTool==='phq9'?'border-amber-300 bg-amber-50/50':'border-slate-200 bg-white'}`}>
                <p className="text-sm font-medium text-slate-800 mb-3">
                  {i+1}. {q}
                  {i===8&&activeTool==='phq9'&&<span className="ml-2 text-xs font-bold text-amber-600">(คำถามสำคัญ)</span>}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FREQUENCY_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => setAnswers(prev => ({...prev, [i]: opt.value}))}
                      className={`rounded-lg border py-2 px-2 text-xs font-medium transition-all text-center ${answers[i]===opt.value?'border-cyan-500 bg-cyan-50 text-cyan-700':'border-slate-200 text-slate-600 hover:border-cyan-200'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button onClick={() => setShowResults(true)} disabled={!allAnswered}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50">
            ดูผลการประเมิน <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="p-5 space-y-5">
          {hasQ9RedFlag && (
            <div className="rounded-xl bg-red-50 border-2 border-red-400 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-bold text-red-800">ต้องการความช่วยเหลือด่วน</span>
              </div>
              <p className="text-sm text-red-700 mb-2">คุณตอบว่ามีความคิดทำร้ายตัวเอง กรุณาขอความช่วยเหลือทันที</p>
              <a href="tel:1323" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700">
                <Phone className="h-4 w-4" /> โทร 1323 สายด่วนสุขภาพจิต
              </a>
            </div>
          )}

          {/* PHQ-9 Result */}
          {activeTool === 'phq9' && (() => {
            const r = phq9Result
            const score = Object.values(phq9Answers).reduce((a,b)=>a+b,0)
            return (
              <div className={`rounded-xl ${r.bg} border ${r.border} p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">PHQ-9 ซึมเศร้า</div>
                    <div className={`text-xl font-bold ${r.color}`}>{r.label}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${r.color}`}>{score}</div>
                    <div className="text-xs text-slate-400">/ 27 คะแนน</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{r.desc}</p>
              </div>
            )
          })()}

          {/* GAD-7 Result */}
          {activeTool === 'gad7' && (() => {
            const r = gad7Result
            const score = Object.values(gad7Answers).reduce((a,b)=>a+b,0)
            return (
              <div className={`rounded-xl ${r.bg} border ${r.border} p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">GAD-7 วิตกกังวล</div>
                    <div className={`text-xl font-bold ${r.color}`}>{r.label}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${r.color}`}>{score}</div>
                    <div className="text-xs text-slate-400">/ 21 คะแนน</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{r.desc}</p>
              </div>
            )
          })()}

          {/* Important note */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <p className="text-xs font-semibold text-blue-800 mb-2">สิ่งสำคัญที่ต้องรู้</p>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• ผลนี้เป็นเครื่องมือคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัย</li>
              <li>• เฉพาะจิตแพทย์หรือผู้เชี่ยวชาญเท่านั้นที่สามารถวินิจฉัยได้</li>
              <li>• โรคซึมเศร้าและวิตกกังวลรักษาได้ผลดี — ขอความช่วยเหลือคืองานกล้าหาญ</li>
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
            <strong>PHQ-9:</strong> Kroenke K, Spitzer RL, Williams JB. J Gen Intern Med. 2001 &nbsp;|&nbsp;
            <strong>GAD-7:</strong> Spitzer RL, et al. Arch Intern Med. 2006
          </div>

          <MedicalDisclaimer variant="banner" locale={locale} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" className="text-sm" onClick={reset}>ทำใหม่</Button>
            <a href="tel:1323" className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 text-cyan-700 text-sm font-semibold py-2.5 hover:bg-cyan-100">
              <Phone className="h-4 w-4" /> สายด่วน 1323
            </a>
            <a href="/providers" className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white text-sm font-semibold py-2.5 hover:bg-teal-700">
              หาจิตแพทย์ <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
