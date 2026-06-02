// Why FirstScreen — compact timeline, ~220px max height
// Replaces the verbose 3-column grid

const STEPS = [
  { n: 1, label: 'ตอบคำถาม 3 นาที' },
  { n: 2, label: 'รับผลประเมินความเสี่ยง' },
  { n: 3, label: 'รับแผนตรวจสุขภาพเฉพาะบุคคล' },
] as const

export function HowItWorks() {
  return (
    <section className="bg-white border-b border-slate-100 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl px-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-4">
              ทำงานอย่างไร
            </p>
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white text-xs font-bold">
                    {s.n}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px h-5 bg-teal-200 my-0.5" />
                  )}
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-800 pt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="sm:max-w-xs">
            <p className="text-sm text-slate-500 leading-relaxed">
              ใช้แนวทางเดียวกับระบบคัดกรองสุขภาพสมัยใหม่
              อิงมาตรฐาน WHO, USPSTF และ สธ. ไทย
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
