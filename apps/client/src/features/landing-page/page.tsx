import { CTA, FAQ, Features, Footer, Header, Hero, HowItWorks, PricingPlans } from "./sections";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingPlans />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
