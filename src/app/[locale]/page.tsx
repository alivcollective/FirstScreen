import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroV2 } from '@/components/home/hero-v2'
import { TrustStats } from '@/components/home/trust-stats'
import { HowItWorks } from '@/components/home/how-it-works'
import { RiskCategories } from '@/components/home/risk-categories'
import { TrustCompact } from '@/components/home/trust-compact'
import { HealthNews } from '@/components/home/health-news'
import { FinalCtaV2 } from '@/components/home/final-cta-v2'
import { MobileStickyAssessmentCTA } from '@/components/shared/mobile-sticky-cta'

export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero */}
        <HeroV2 />
        {/* 2. Trust stats bar — animated counters, sits inside dark hero */}
        <TrustStats />
        {/* 3. How it works — 3 steps */}
        <HowItWorks />
        {/* 4. Risk categories — 4 assessment cards */}
        <RiskCategories />
        {/* 5. Trust compact — WHO/USPSTF/NCCN/GRADE */}
        <TrustCompact />
        {/* 6. Latest health news */}
        <HealthNews />
        {/* 7. Final CTA */}
        <FinalCtaV2 />
      </main>
      <Footer />
      <MobileStickyAssessmentCTA />
    </div>
  )
}
