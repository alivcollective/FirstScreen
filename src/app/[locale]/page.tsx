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

// Homepage — new 8-section structure (was 7, now tighter and conversion-focused)
export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* S1: Hero — dark, single primary CTA */}
        <HeroV2 />
        {/* S2: Popular Screenings — horizontal scroll, quick-start cards */}
        <PopularScreenings />
        {/* S3: Trust Bar — compact single row metrics */}
        <TrustBar />
        {/* S4: Why FirstScreen — compact 3-step timeline */}
        <HowItWorks />
        {/* S5: Assessment Cards — conversion-oriented with benefit + time */}
        <RiskCategories />
        {/* S6: Why Trust Us — expandable WHO/USPSTF section */}
        <TrustCompact />
        {/* S7: Health Insights — 3 modern article cards */}
        <HealthNews />
        {/* S8: Final CTA — with trust badges */}
        <FinalCtaV2 />
      </main>
      <Footer />
      {/* Floating pill CTA — mobile only */}
      <MobileStickyAssessmentCTA />
    </div>
  )
}
