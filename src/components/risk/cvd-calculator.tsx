'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocale } from 'next-intl'
import { Heart, AlertCircle, ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { RISK_COLORS } from '@/lib/constants'

const schema = z.object({
  age: z.number().min(20).max(79),
  sex: z.enum(['male', 'female']),
  systolicBP: z.number().min(90).max(200),
  totalCholesterol: z.number().min(100).max(400),
  hdlCholesterol: z.number().min(20).max(100),
  isSmoker: z.boolean(),
  onBPMeds: z.boolean(),
  hasDiabetes: z.boolean(),
})
type FormData = z.infer<typeof schema>

interface CVDResult {
  riskPercentage: number
  riskCategory: 'low' | 'moderate' | 'high' | 'very_high'
  riskLabel: string
  interpretation: string
  actions: Array<{ priority: string; title: string; desc: string }>
}

function calculateFramingham(data: FormData): CVDResult {
  const { age, sex, systolicBP, totalCholesterol, hdlCholesterol, isSmoker, onBPMeds, hasDiabetes } = data
  let points = 0
  const isMale = sex === 'male'

  if (isMale) {
    if (age < 35) points += 0; else if (age < 40) points += 2; else if (age < 45) points += 5
    else if (age < 50) points += 6; else if (age < 55) points += 8; else if (age < 60) points += 10
    else if (age < 65) points += 11; else if (age < 70) points += 12; else points += 13
  } else {
    if (age < 35) points += 0; else if (age < 40) points += 2; else if (age < 45) points += 4
    else if (age < 50) points += 5; else if (age < 55) points += 7; else if (age < 60) points += 8
    else if (age < 65) points += 9; else if (age < 70) points += 10; else points += 11
  }

  if (totalCholesterol < 160) points += 0
  else if (totalCholesterol < 200) points += isMale ? 3 : 1
  else if (totalCholesterol < 240) points += isMale ? 4 : 3
  else if (totalCholesterol < 280) points += isMale ? 5 : 4
  else points += isMale ? 6 : 5

  if (hdlCholesterol >= 60) points -= 1
  else if (hdlCholesterol >= 50) points += 0
  else if (hdlCholesterol >= 40) points += 1
  else points += 2

  if (onBPMeds) {
    if (systolicBP < 130) points += 1
    else if (systolicBP < 140) points += 2
    else if (systolicBP < 160) points += isMale ? 2 : 3
    else points += isMale ? 3 : 4
  } else {
    if (systolicBP < 120) points += 0
    else if (systolicBP < 130) points += 0
    else if (systolicBP < 140) points += isMale ? 1 : 1
    else if (systolicBP < 160) points += isMale ? 1 : 2
    else points += isMale ? 2 : 3
  }

  if (isSmoker) points += isMale ? 4 : 3
  if (hasDiabetes) points += isMale ? 3 : 4

  const riskTable: Record<number, number> = {
    0:1,1:1,2:1,3:2,4:2,5:2,6:3,7:4,8:5,9:6,
    10:8,11:10,12:12,13:16,14:20,15:25,16:30,
  }
  const riskPercentage = riskTable[Math.min(Math.max(points, 0), 16)] ?? 30

  let riskCategory: CVDResult['riskCategory']
  if (riskPercentage < 5) riskCategory = 'low'
  else if (riskPercentage < 10) riskCategory = 'moderate'
  else if (riskPercentage < 20) riskCategory = 'high'
  else riskCategory = 'very_high'

  const labels = { low: 'ความเสี่ยงต่ำ', moderate: 'ความเสี่ยงปานกลาง', high: 'ความเสี่ยงสูง', very_high: 'ความเสี่ยงสูงมาก' }

  const interpretations: Record<CVDResult['riskCategory'], string> = {
    low: `ความเสี่ยงในการเกิดโรคหัวใจหรือหลอดเลือดสมองใน 10 ปีข้างหน้าของคุณอยู่ที่ประมาณ ${riskPercentage}% ซึ่งถือว่าต่ำ รักษาสุขภาพปัจจุบันต่อไป`,
    moderate: `ความเสี่ยงของคุณอยู่ที่ประมาณ ${riskPercentage}% ใน 10 ปี ควรปรับวิถีชีวิตและนัดพบแพทย์เพื่อประเมินเพิ่มเติม`,
    high: `ความเสี่ยงของคุณสูงถึง ${riskPercentage}% ใน 10 ปี แนะนำให้พบแพทย์โรคหัวใจเพื่อประเมินอย่างละเอียดและพิจารณาการรักษา`,
    very_high: `ความเสี่ยงของคุณสูงมากที่ ${riskPercentage}% ใน 10 ปี ควรพบแพทย์โดยเร็วเพื่อประเมินและเริ่มการป้องกันอย่างจริงจัง`,
  }

  const actions: CVDResult['actions'] = []
  if (isSmoker) actions.push({ priority: 'immediate', title: 'เลิกสูบบุหรี่', desc: 'การเลิกสูบบุหรี่ลดความเสี่ยงหัวใจได้ถึง 50% ภายใน 1 ปี ขอรับการช่วยเหลือจากแพทย์หรือสายด่วน 1600' })
  if (systolicBP >= 130) actions.push({ priority: riskCategory === 'very_high' ? 'immediate' : 'soon', title: 'ควบคุมความดันโลหิต', desc: 'เป้าหมาย <130/80 mmHg ลดเกลือ ออกกำลังกาย และพบแพทย์เพื่อพิจารณายา' })
  if (totalCholesterol >= 200) actions.push({ priority: 'soon', title: 'ตรวจและควบคุมคอเลสเตอรอล', desc: 'นัดพบแพทย์เพื่อตรวจ Lipid Profile ครบถ้วนและพิจารณา Statin' })
  if (hasDiabetes) actions.push({ priority: 'soon', title: 'ควบคุมเบาหวานอย่างเคร่งครัด', desc: 'เป้าหมาย HbA1c <7% ลดความเสี่ยง CVD ได้อย่างมีนัยสำคัญ' })
  actions.push({ priority: 'ongoing', title: 'ออกกำลังกาย 150 นาที/สัปดาห์', desc: 'เดินเร็ว ว่ายน้ำ หรือปั่นจักรยาน ลดความเสี่ยง CVD ได้ 35%' })
  actions.push({ priority: 'ongoing', title: 'รับประทานอาหาร Heart-Healthy', desc: 'ลดไขมันอิ่มตัว เพิ่มผักผลไม้ ธัญพืช และปลา' })

  return { riskPercentage, riskCategory, riskLabel: labels[riskCategory], interpretation: interpretations[riskCategory], actions }
}

export function CVDCalculator() {
  const locale = useLocale()
  const [result, setResult] = useState<CVDResult | null>(null)
  const [step, setStep] = useState(1)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isSmoker: false, onBPMeds: false, hasDiabetes: false },
  })

  const onSubmit = (data: FormData) => {
    setResult(calculateFramingham(data))
    setStep(2)
  }

  const riskConfig = result ? RISK_COLORS[result.riskCategory] : null

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-5 bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
            <Heart className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">ประเมินความเสี่ยงโรคหัวใจและหลอดเลือด</h3>
            <p className="text-xs text-slate-500">Framingham Heart Study Risk Score · ~3 นาที</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-red-200">
          <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <MedicalDisclaimer variant="banner" locale={locale} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">อายุ (ปี)</Label>
              <input type="number" placeholder="เช่น 45" {...register('age', { valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
              {errors.age && <p className="text-xs text-red-500 mt-1">อายุ 20–79 ปี</p>}
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">เพศกำเนิด</Label>
              <div className="flex gap-2">
                {[{v:'male',th:'ชาย'},{v:'female',th:'หญิง'}].map(o => (
                  <label key={o.v} className="flex-1 flex items-center gap-2 rounded-xl border border-slate-200 p-2.5 cursor-pointer has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 text-sm text-slate-700">
                    <input type="radio" value={o.v} {...register('sex')} className="text-teal-600" />
                    {o.th}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">ความดัน Systolic (mmHg)</Label>
              <input type="number" placeholder="เช่น 130" {...register('systolicBP', { valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">Total Cholesterol (mg/dL)</Label>
              <input type="number" placeholder="เช่น 200" {...register('totalCholesterol', { valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">HDL Cholesterol (mg/dL)</Label>
              <input type="number" placeholder="เช่น 50" {...register('hdlCholesterol', { valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            </div>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Info className="h-3 w-3" />
            ค่าคอเลสเตอรอลหาได้จากผลตรวจเลือด Lipid Profile ล่าสุด
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'isSmoker', label: 'สูบบุหรี่?' },
              { id: 'onBPMeds', label: 'กินยาความดัน?' },
              { id: 'hasDiabetes', label: 'เป็นเบาหวาน?' },
            ].map(({ id, label }) => (
              <label key={id} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-3 cursor-pointer has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 text-center">
                <span className="text-xs font-medium text-slate-700">{label}</span>
                <input type="checkbox" {...register(id as keyof FormData)} className="text-teal-600 h-4 w-4" />
              </label>
            ))}
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-semibold">
            คำนวณความเสี่ยง <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      ) : result && riskConfig ? (
        <div className="p-6 space-y-5">
          <div className={`rounded-xl ${riskConfig.bg} border ${riskConfig.border} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">ความเสี่ยง CVD ใน 10 ปี</div>
                <div className={`text-2xl font-bold ${riskConfig.text}`}>{result.riskLabel}</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${riskConfig.text}`}>{result.riskPercentage}%</div>
                <div className="text-xs text-slate-400">ใน 10 ปี</div>
              </div>
            </div>
            <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500">
              <div className="relative h-full" style={{ width: `${Math.min(result.riskPercentage * 3, 100)}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-red-500 shadow" />
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{result.interpretation}</p>

          <div className="space-y-2.5">
            <p className="text-sm font-bold text-slate-900">การดำเนินการที่แนะนำ</p>
            {result.actions.map((a, i) => (
              <div key={i} className="flex gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <div className="shrink-0 mt-0.5">
                  {a.priority === 'immediate' ? (
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center"><span className="text-[10px] font-bold text-red-600">!</span></div>
                  ) : <CheckCircle2 className="h-5 w-5 text-teal-500" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
                  <Badge className={`mt-1 text-[10px] px-2 py-0 ${a.priority==='immediate'?'bg-red-50 text-red-600':a.priority==='soon'?'bg-amber-50 text-amber-600':'bg-teal-50 text-teal-600'}`}>
                    {a.priority==='immediate'?'เร่งด่วน':a.priority==='soon'?'เร็วๆ นี้':'ต่อเนื่อง'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
            <strong>เครื่องคำนวณ:</strong> Framingham Heart Study Risk Score (D&apos;Agostino et al, Circulation 2008)
          </div>
          <MedicalDisclaimer variant="banner" locale={locale} />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setResult(null); setStep(1) }}>ทำใหม่</Button>
            <a href="/screening" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2.5 transition-colors">
              ดูแผนตรวจ <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
