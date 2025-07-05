import { SectionContainer, SectionHeader } from "../../components";
import { PricingPlansFooter, PricingPlansGrid } from "./components";

export function PricingPlans() {
  return (
    <SectionContainer sectionId="pricing" backgroundColorClass="bg-gradient-to-br from-blue-50 to-purple-50" containerClass="max-w-7xl">
      <SectionHeader
        badgeText="Plans & Pricing"
        badgeClassName="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
        description="Start free and upgrade as you grow. All plans include our core features."
        title={
          {
            text: "Choose Your",
            highlight: "Perfect Plan",
            highlightClassName: "from-blue-600 to-purple-600",
          }
        }
      />

      <PricingPlansGrid />

      <PricingPlansFooter />
    </SectionContainer>
  );
}
