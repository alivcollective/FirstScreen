import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroV2 } from '@/components/home/hero-v2'
import { PopularScreenings } from '@/components/home/popular-screenings'
import { TrustBar } from '@/components/home/trust-bar'
import { HowItWorks } from '@/components/home/how-it-works'
import { RiskCategories } from '@/components/home/risk-categories'
import { TrustCompact } from '@/components/home/trust-compact'
import { HealthNews } from '@/components/home/health-news'
import { FinalCtaV2 } from '@/components/home/final-cta-v2'
import { MobileStickyAssessmentCTA } from '@/components/shared/mobile-sticky-cta'

// 7-section homepage — Hero merged with mission quote (no separate quote section)
export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">
        {/* S1: Hero — headline + mission line + CTA (merged) */}
        <HeroV2 />
        {/* S2: Popular Screenings — horizontal scroll */}
        <PopularScreenings />
        {/* S3: Trust Bar — compact metrics row */}
        <TrustBar />
        {/* S4: Why FirstScreen — 3-step compact timeline */}
        <HowItWorks />
        {/* S5: Assessment Cards — benefit + time */}
        <RiskCategories />
        {/* S6: Why Trust Us — expandable WHO/USPSTF */}
        <TrustCompact />
        {/* S7: Health Insights */}
        <HealthNews />
        {/* S8: Final CTA */}
        <FinalCtaV2 />
      </main>
      <Footer />
      {/* Floating pill — mobile only, above safe area */}
      <MobileStickyAssessmentCTA />
    </div>
  )
}
