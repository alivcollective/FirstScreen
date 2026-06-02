import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import {
  Heart, Shield, BookOpen, Users, Lock,
  Target, ArrowRight, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about')
  return {
    title: `${t('title')} | FirstScreen`,
    description: t('subtitle'),
  }
}

const PRINCIPLE_ICONS = [BookOpen, Target, Users, Heart, Lock, Shield]

export default async function AboutPage() {
  const t = await getTranslations('about')

  const missionPoints = [
    t('missionPoint1'),
    t('missionPoint2'),
    t('missionPoint3'),
    t('missionPoint4'),
  ]

  const principles = [
    { titleKey: 'p1Title', descKey: 'p1Desc' },
    { titleKey: 'p2Title', descKey: 'p2Desc' },
    { titleKey: 'p3Title', descKey: 'p3Desc' },
    { titleKey: 'p4Title', descKey: 'p4Desc' },
    { titleKey: 'p5Title', descKey: 'p5Desc' },
    { titleKey: 'p6Title', descKey: 'p6Desc' },
  ] as const

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ─────────────────────────────── */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
              <Heart className="h-6 w-6 text-teal-400" strokeWidth={1.75} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              {t('title')}
            </h1>
            <p className="text-base text-slate-400 leading-[1.8] max-w-lg mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-6 py-16 space-y-20">

          {/* ── Why we exist ─────────────────── */}
          <section>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-8 sm:p-10">
              <p className="text-base text-slate-700 leading-[1.85] mb-5">{t('why1')}</p>
              <p className="text-base text-slate-700 leading-[1.85] mb-5">{t('why2')}</p>
              <p className="text-sm font-semibold text-teal-700 leading-relaxed">{t('why3')}</p>
            </div>
          </section>

          {/* ── Mission ──────────────────────── */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">
              {t('missionBadge')}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {t('missionTitle')}
            </h2>
            <p className="text-base text-slate-600 leading-[1.85] mb-7">{t('missionIntro')}</p>
            <ul className="space-y-3 mb-8">
              {missionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="text-base text-slate-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-teal-200 pl-4 italic">
              {t('missionClose')}
            </p>
          </section>

          {/* ── What is FirstScreen ───────────── */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">
              {t('whatBadge')}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('whatTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 mb-4">
                  <BookOpen className="h-4 w-4 text-teal-600" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{t('card1Title')}</h3>
                <p className="text-sm text-slate-500 leading-[1.75]">{t('card1Desc')}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 mb-4">
                  <AlertCircle className="h-4 w-4 text-amber-600" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{t('card2Title')}</h3>
                <p className="text-sm text-slate-500 leading-[1.75]">{t('card2Desc')}</p>
              </div>
            </div>
          </section>

          {/* ── Principles ────────────────────── */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">
              {t('principlesBadge')}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('principlesTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map(({ titleKey, descKey }, i) => {
                const Icon = PRINCIPLE_ICONS[i]
                return (
                  <div key={titleKey} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 hover:border-slate-200 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                      <Icon className="h-4 w-4 text-teal-600" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">{t(titleKey)}</h3>
                      <p className="text-xs text-slate-500 leading-[1.7]">{t(descKey)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Future ────────────────────────── */}
          <section>
            <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-4">
                {t('futureBadge')}
              </p>
              <p className="text-base text-teal-800 leading-[1.85] mb-4">{t('future1')}</p>
              <p className="text-sm text-teal-700 leading-relaxed font-medium">{t('future2')}</p>
            </div>
          </section>

          {/* ── Disclaimer ────────────────────── */}
          <section>
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.75} />
                <p className="text-xs text-amber-800 leading-[1.7]">{t('disclaimerText')}</p>
              </div>
            </div>
          </section>

          {/* ── CTA ───────────────────────────── */}
          <section className="text-center pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{t('ctaTitle')}</h2>
            <p className="text-sm text-slate-500 mb-7 max-w-sm mx-auto leading-relaxed">
              {t('ctaSubtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/risk"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                {t('ctaBtn')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/trust"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700 px-6 py-2.5 text-sm font-medium transition-colors"
              >
                {t('ctaTrust')}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
