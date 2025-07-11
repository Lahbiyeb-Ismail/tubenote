import { NavigationHeader } from "@/shared/components";

import { CTA, FAQ, Features, Footer, Hero, HowItWorks, PricingPlans, UserLearningExperience } from "./sections";

export function LandingPage() {
  const homeNavItems = [
    {
      href: "#features",
      label: "Features",
    },
    {
      href: "#how-it-works",
      label: "How it Works",
    },
    {
      href: "#pricing",
      label: "Pricing",
    },
    {
      href: "#faq",
      label: "FAQ",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <NavigationHeader navItems={homeNavItems} />
      <Hero />
      <UserLearningExperience />
      <Features />
      <HowItWorks />
      <PricingPlans />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
