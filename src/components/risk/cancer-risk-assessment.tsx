'use client'

import { useReducer } from 'react'
import { useLocale } from 'next-intl'
import { Ribbon, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, Info, ChevronRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { cn } from '@/lib/utils'

// ============================================================
// TYPES & STATE
// ============================================================

type CancerType = 'breast' | 'cervical' | 'colorectal' | 'liver'
type RiskLevel = 'low' | 'moderate' | 'high'

interface Answers {
  // Breast
  bc_family: boolean | null
  bc_early_menarche: boolean | null
  bc_never_pregnant: boolean | null
  bc_never_breastfed: boolean | null
  bc_no_mammogram: boolean | null
  bc_noticed_lump: boolean | null
  // Cervical
  cc_no_hpv: boolean | null
  cc_no_pap: boolean | null
  cc_multiple_partners: boolean | null
  cc_smoker: boolean | null
  // Colorectal
  cr_age45: boolean | null
  cr_family: boolean | null
  cr_symptoms: boolean | null
  cr_unhealthy_diet: boolean | null
  cr_no_screening: boolean | null
  // Liver
  lc_hbv: boolean | null
  lc_alcohol: boolean | null
  lc_cirrhosis: boolean | null
  lc_family: boolean | null
}

interface State {
  step: 1 | 2 | 3
  age: string
  sex: 'male' | 'female' | ''
  answers: Answers
}

type Action =
  | { type: 'SET_BASIC'; field: 'age' | 'sex'; value: string }
  | { type: 'SET_ANSWER'; field: keyof Answers; value: boolean }
  | { type: 'SET_STEP'; step: State['step'] }
  | { type: 'RESET' }

const INITIAL_ANSWERS: Answers = {
  bc_family: null, bc_early_menarche: null, bc_never_pregnant: null,
  bc_never_breastfed: null, bc_no_mammogram: null, bc_noticed_lump: null,
  cc_no_hpv: null, cc_no_pap: null, cc_multiple_partners: null, cc_smoker: null,
  cr_age45: null, cr_family: null, cr_symptoms: null, cr_unhealthy_diet: null, cr_no_screening: null,
  lc_hbv: null, lc_alcohol: null, lc_cirrhosis: null, lc_family: null,
}

const INITIAL: State = { step: 1, age: '', sex: '', answers: INITIAL_ANSWERS }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_BASIC': return { ...state, [action.field]: action.value }
    case 'SET_ANSWER': return { ...state, answers: { ...state.answers, [action.field]: action.value } }
    case 'SET_STEP': return { ...state, step: action.step }
    case 'RESET': return INITIAL
    default: return state
  }
}

// ============================================================
// SCORING
// ============================================================

function scoreCancer(type: CancerType, answers: Answers, age: number, sex: string): RiskLevel {
  let score = 0

  if (type === 'breast') {
    if (answers.bc_noticed_lump) return 'high' // immediate high
    if (answers.bc_family) score += 3
    if (answers.bc_early_menarche) score += 1
    if (answers.bc_never_pregnant) score += 1
    if (answers.bc_never_breastfed) score += 1
    if (answers.bc_no_mammogram) score += 2
    if (age >= 40) score += 1
  }

  if (type === 'cervical') {
    if (answers.cc_no_hpv) score += 2
    if (answers.cc_no_pap) score += 3
    if (answers.cc_multiple_partners) score += 2
    if (answers.cc_smoker) score += 2
  }

  if (type === 'colorectal') {
    if (answers.cr_symptoms) return 'high' // immediate high
    if (answers.cr_family) score += 3
    if (answers.cr_age45) score += 2
    if (answers.cr_unhealthy_diet) score += 1
    if (answers.cr_no_screening) score += 1
  }

  if (type === 'liver') {
    if (answers.lc_cirrhosis) return 'high' // immediate high
    if (answers.lc_hbv) score += 4
    if (answers.lc_alcohol) score += 2
    if (answers.lc_family) score += 2
    if (age >= 40) score += 1
  }

  if (score <= 2) return 'low'
  if (score <= 5) return 'moderate'
  return 'high'
}

// ============================================================
// CANCER INFO
// ============================================================

const CANCER_INFO: Record<CancerType, {
  nameTh: string; nameEn: string; icon: string; slug: string
  screening: { test: string; frequency: string; forWho: string }
  source: string
}> = {
  breast: {
    nameTh: 'มะเร็งเต้านม', nameEn: 'Breast Cancer', icon: '🎗️', slug: 'breast-cancer',
    screening: { test: 'Mammogram', frequency: 'ทุก 1–2 ปี', forWho: 'ผู้หญิงอายุ 40 ปีขึ้นไป' },
    source: 'NCCN Breast Cancer Screening Guidelines',
  },
  cervical: {
    nameTh: 'มะเร็งปากมดลูก', nameEn: 'Cervical Cancer', icon: '🔬', slug: 'cervical-cancer',
    screening: { test: 'Pap Smear / HPV Co-test', frequency: 'ทุก 3–5 ปี', forWho: 'ผู้หญิงอายุ 25–65 ปี' },
    source: 'กรมการแพทย์ สธ. / WHO Cervical Cancer Screening',
  },
  colorectal: {
    nameTh: 'มะเร็งลำไส้ใหญ่', nameEn: 'Colorectal Cancer', icon: '🔭', slug: 'colorectal-cancer',
    screening: { test: 'Colonoscopy หรือ FOBT', frequency: 'Colonoscopy ทุก 10 ปี / FOBT ทุกปี', forWho: 'ทุกเพศอายุ 45 ปีขึ้นไป' },
    source: 'NCCN Colorectal Cancer Screening / ACS Guidelines',
  },
  liver: {
    nameTh: 'มะเร็งตับ', nameEn: 'Liver Cancer', icon: '🫁', slug: 'liver-cancer',
    screening: { test: 'Ultrasound + AFP', frequency: 'ทุก 6 เดือน (กลุ่มเสี่ยงสูง)', forWho: 'ผู้ป่วย HBV/HCV ตับแข็ง อายุ 40+ ปี' },
    source: 'AASLD / สมาคมโรคตับแห่งประเทศไทย',
  },
}

// ============================================================
// QUESTION COMPONENT
// ============================================================

function YesNoQuestion({
  question, fieldKey, answers, dispatch, highlight,
}: {
  question: string
  fieldKey: keyof Answers
  answers: Answers
  dispatch: React.Dispatch<Action>
  highlight?: 'warning' | 'normal'
}) {
  const val = answers[fieldKey]
  const isWarning = highlight === 'warning'

  return (
    <div className={cn('rounded-xl border p-4', isWarning ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white')}>
      <p className={cn('text-sm font-medium mb-3 leading-relaxed', isWarning ? 'text-amber-900' : 'text-slate-800')}>
        {question}
      </p>
      <div className="flex gap-2">
        {[{ v: true, l: 'ใช่' }, { v: false, l: 'ไม่ใช่' }].map(({ v, l }) => (
          <button key={String(v)} onClick={() => dispatch({ type: 'SET_ANSWER', field: fieldKey, value: v })}
            className={cn('flex-1 rounded-lg border py-2 text-sm font-semibold transition-all',
              val === v
                ? v ? 'border-amber-400 bg-amber-100 text-amber-800' : 'border-teal-400 bg-teal-50 text-teal-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300')}>
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// SECTIONS
// ============================================================

function BreastSection({ answers, dispatch }: { answers: Answers; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎗️</span>
        <h3 className="text-base font-bold text-slate-900">มะเร็งเต้านม (Breast Cancer)</h3>
      </div>
      <YesNoQuestion question="มีประวัติครอบครัว (แม่หรือพี่น้อง) เป็นมะเร็งเต้านมหรือไม่?" fieldKey="bc_family" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="มีประจำเดือนครั้งแรกก่อนอายุ 12 ปีหรือไม่?" fieldKey="bc_early_menarche" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="ไม่เคยตั้งครรภ์ หรือมีบุตรครั้งแรกหลังอายุ 30 ปีหรือไม่?" fieldKey="bc_never_pregnant" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="ไม่เคยให้นมบุตรหรือไม่?" fieldKey="bc_never_breastfed" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="ไม่ได้ตรวจ Mammogram ในช่วง 2 ปีที่ผ่านมาหรือไม่?" fieldKey="bc_no_mammogram" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="⚠ สังเกตเห็นก้อน การเปลี่ยนแปลงของเต้านม หรือของเหลวไหลจากหัวนมผิดปกติหรือไม่?" fieldKey="bc_noticed_lump" answers={answers} dispatch={dispatch} highlight="warning" />
    </div>
  )
}

function CervicalSection({ answers, dispatch }: { answers: Answers; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔬</span>
        <h3 className="text-base font-bold text-slate-900">มะเร็งปากมดลูก (Cervical Cancer)</h3>
      </div>
      <YesNoQuestion question="ไม่เคยฉีดวัคซีน HPV หรือไม่?" fieldKey="cc_no_hpv" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="ไม่ได้ตรวจ Pap Smear ในช่วง 3 ปีที่ผ่านมาหรือไม่?" fieldKey="cc_no_pap" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="มีคู่นอนหลายคนหรือไม่?" fieldKey="cc_multiple_partners" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="สูบบุหรี่หรือไม่?" fieldKey="cc_smoker" answers={answers} dispatch={dispatch} />
    </div>
  )
}

function ColorectalSection({ answers, dispatch, age }: { answers: Answers; dispatch: React.Dispatch<Action>; age: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔭</span>
        <h3 className="text-base font-bold text-slate-900">มะเร็งลำไส้ใหญ่ (Colorectal Cancer)</h3>
      </div>
      {age >= 45 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800">อายุ 45 ปีขึ้นไปควรเริ่มตรวจคัดกรองมะเร็งลำไส้ใหญ่ตามคำแนะนำ</p>
        </div>
      )}
      <YesNoQuestion question="มีประวัติครอบครัวเป็นมะเร็งลำไส้ใหญ่หรือ polyp ในลำไส้หรือไม่?" fieldKey="cr_family" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="⚠ มีอาการ เลือดในอุจจาระ, พฤติกรรมถ่ายเปลี่ยนแปลง, หรือปวดท้องเรื้อรังหรือไม่?" fieldKey="cr_symptoms" answers={answers} dispatch={dispatch} highlight="warning" />
      <YesNoQuestion question="รับประทานเนื้อแดงและเนื้อแปรรูปมาก ผักน้อยหรือไม่?" fieldKey="cr_unhealthy_diet" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="ไม่เคยตรวจ Colonoscopy หรือ FOBT (ตรวจเลือดในอุจจาระ) หรือไม่?" fieldKey="cr_no_screening" answers={answers} dispatch={dispatch} />
    </div>
  )
}

function LiverSection({ answers, dispatch }: { answers: Answers; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🫁</span>
        <h3 className="text-base font-bold text-slate-900">มะเร็งตับ (Liver Cancer)</h3>
      </div>
      <YesNoQuestion question="เคยติดเชื้อไวรัสตับอักเสบบี (HBV) หรือซี (HCV) หรือไม่?" fieldKey="lc_hbv" answers={answers} dispatch={dispatch} highlight="warning" />
      <YesNoQuestion question="ดื่มแอลกอฮอล์เป็นประจำ (> 2 drinks/วัน) หรือไม่?" fieldKey="lc_alcohol" answers={answers} dispatch={dispatch} />
      <YesNoQuestion question="มีประวัติตับแข็ง (Liver Cirrhosis) หรือไม่?" fieldKey="lc_cirrhosis" answers={answers} dispatch={dispatch} highlight="warning" />
      <YesNoQuestion question="มีประวัติครอบครัวเป็นมะเร็งตับหรือไม่?" fieldKey="lc_family" answers={answers} dispatch={dispatch} />
    </div>
  )
}

// ============================================================
// RESULT CARD
// ============================================================

const RISK_CONFIG = {
  low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-500', icon: '🟢', label: 'ความเสี่ยงต่ำ', action: 'รักษาพฤติกรรมสุขภาพที่ดีต่อไป' },
  moderate: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-500', icon: '🟡', label: 'ความเสี่ยงปานกลาง', action: 'แนะนำให้นัดตรวจคัดกรอง' },
  high: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-600', icon: '🔴', label: 'ความเสี่ยงสูง', action: 'ควรพบแพทย์เพื่อตรวจเพิ่มเติม' },
}

function ResultCard({ type, level }: { type: CancerType; level: RiskLevel }) {
  const info = CANCER_INFO[type]
  const cfg = RISK_CONFIG[level]

  return (
    <div className={cn('rounded-2xl border p-5', cfg.bg, cfg.border)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{info.icon}</span>
          <div>
            <h3 className="text-base font-bold text-slate-900">{info.nameTh}</h3>
            <p className="text-xs text-slate-500">{info.nameEn}</p>
          </div>
        </div>
        <div className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shrink-0', cfg.badge)}>
          {cfg.icon} {cfg.label}
        </div>
      </div>

      <p className={cn('text-sm font-semibold mb-3', cfg.text)}>{cfg.action}</p>

      {/* Recommended screening */}
      <div className="rounded-xl bg-white/70 border border-white p-3 mb-3 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">การตรวจคัดกรองที่แนะนำ</span>
        </div>
        <div className="text-xs text-slate-600 pl-5 space-y-0.5">
          <p><strong>การตรวจ:</strong> {info.screening.test}</p>
          <p><strong>ความถี่:</strong> {info.screening.frequency}</p>
          <p><strong>สำหรับ:</strong> {info.screening.forWho}</p>
        </div>
      </div>

      {/* Source + link */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <Shield className="h-3 w-3" />
          {info.source}
        </div>
        <a href={`/diseases/${info.slug}`} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700">
          อ่านเพิ่มเติม <ChevronRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function CancerRiskAssessment() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const locale = useLocale()
  const age = parseInt(state.age) || 0
  const isFemale = state.sex === 'female'

  // Which cancers to show (filtered by sex)
  const cancerTypes: CancerType[] = isFemale
    ? ['breast', 'cervical', 'colorectal', 'liver']
    : ['colorectal', 'liver']

  // Check if all relevant questions answered
  const isStep2Complete = (() => {
    const { answers } = state
    if (isFemale) {
      const breastDone = [answers.bc_family, answers.bc_early_menarche, answers.bc_never_pregnant, answers.bc_never_breastfed, answers.bc_no_mammogram, answers.bc_noticed_lump].every(v => v !== null)
      const cervicalDone = [answers.cc_no_hpv, answers.cc_no_pap, answers.cc_multiple_partners, answers.cc_smoker].every(v => v !== null)
      const crDone = [answers.cr_family, answers.cr_symptoms, answers.cr_unhealthy_diet, answers.cr_no_screening].every(v => v !== null)
      const lcDone = [answers.lc_hbv, answers.lc_alcohol, answers.lc_cirrhosis, answers.lc_family].every(v => v !== null)
      return breastDone && cervicalDone && crDone && lcDone
    } else {
      const crDone = [answers.cr_family, answers.cr_symptoms, answers.cr_unhealthy_diet, answers.cr_no_screening].every(v => v !== null)
      const lcDone = [answers.lc_hbv, answers.lc_alcohol, answers.lc_cirrhosis, answers.lc_family].every(v => v !== null)
      return crDone && lcDone
    }
  })()

  return (
    <div className="rounded-2xl border border-violet-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">
            <Ribbon className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">ประเมินความเสี่ยงมะเร็ง</h3>
            <p className="text-xs text-slate-500">Multi-Cancer Risk Screening · อ้างอิง NCCN, WHO, กรมการแพทย์ · ~5 นาที</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn('h-1.5 flex-1 rounded-full transition-colors', s <= state.step ? 'bg-violet-500' : 'bg-violet-200')} />
          ))}
        </div>
      </div>

      {/* STEP 1 — Basic info */}
      {state.step === 1 && (
        <div className="p-6 space-y-5">
          <MedicalDisclaimer variant="banner" locale={locale} />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">อายุ *</label>
              <input type="number" min="18" max="100" placeholder="เช่น 45"
                value={state.age}
                onChange={e => dispatch({ type: 'SET_BASIC', field: 'age', value: e.target.value })}
                className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">เพศกำเนิด *</label>
              <div className="flex gap-3 max-w-xs">
                {[{ v: 'male', l: 'ชาย' }, { v: 'female', l: 'หญิง' }].map(({ v, l }) => (
                  <button key={v} onClick={() => dispatch({ type: 'SET_BASIC', field: 'sex', value: v })}
                    className={cn('flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                      state.sex === v ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-violet-200')}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {state.sex === 'male' && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 flex gap-2">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">สำหรับเพศชาย จะประเมินความเสี่ยงมะเร็งลำไส้ใหญ่และมะเร็งตับ ซึ่งพบบ่อยในไทย</p>
            </div>
          )}
          {state.sex === 'female' && (
            <div className="rounded-xl bg-pink-50 border border-pink-200 p-3 flex gap-2">
              <Info className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
              <p className="text-xs text-pink-700">สำหรับเพศหญิง จะประเมินมะเร็ง 4 ชนิด: เต้านม ปากมดลูก ลำไส้ใหญ่ และตับ</p>
            </div>
          )}

          <Button
            onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
            disabled={state.age === '' || state.sex === ''}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
          >
            เริ่มประเมิน <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* STEP 2 — Questions */}
      {state.step === 2 && (
        <div className="p-6 space-y-8">
          <MedicalDisclaimer variant="banner" locale={locale} />

          {isFemale && (
            <>
              <BreastSection answers={state.answers} dispatch={dispatch} />
              <div className="border-t border-slate-200" />
              <CervicalSection answers={state.answers} dispatch={dispatch} />
              <div className="border-t border-slate-200" />
            </>
          )}
          <ColorectalSection answers={state.answers} dispatch={dispatch} age={age} />
          <div className="border-t border-slate-200" />
          <LiverSection answers={state.answers} dispatch={dispatch} />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 1 })} className="flex-1 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> ย้อนกลับ
            </Button>
            <Button
              onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
              disabled={!isStep2Complete}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50"
            >
              ดูผลการประเมิน <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 — Results */}
      {state.step === 3 && (
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">ผลการประเมินความเสี่ยงมะเร็ง</h3>
            <p className="text-xs text-slate-500">ผลนี้เป็นการประเมินเบื้องต้นเพื่อการศึกษา ไม่ใช่การวินิจฉัย</p>
          </div>

          {/* Results grid */}
          <div className="space-y-4">
            {cancerTypes.map(type => (
              <ResultCard
                key={type}
                type={type}
                level={scoreCancer(type, state.answers, age, state.sex)}
              />
            ))}
          </div>

          {/* Source note */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">แหล่งอ้างอิง (ต้องตรวจสอบก่อนเผยแพร่)</p>
            <ul className="text-xs text-slate-500 space-y-0.5">
              <li>• NCCN Clinical Practice Guidelines in Oncology — Breast/Cervical/Colorectal Cancer Screening</li>
              <li>• WHO Cancer Screening Guidelines</li>
              <li>• กรมการแพทย์ กระทรวงสาธารณสุข — แนวทางการตรวจคัดกรองมะเร็ง</li>
              <li>• AASLD / สมาคมโรคตับแห่งประเทศไทย — แนวทางคัดกรองมะเร็งตับ</li>
            </ul>
          </div>

          <MedicalDisclaimer variant="banner" locale={locale} />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 text-sm" onClick={() => dispatch({ type: 'RESET' })}>
              ทำใหม่
            </Button>
            <a href="/screening" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2.5 transition-colors">
              ดูแผนตรวจคัดกรอง <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
