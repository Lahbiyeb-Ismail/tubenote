import { PricingPlansFooter, PricingPlansGrid, PricingPlansHeader } from "./components";

export function PricingPlans() {
  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto max-w-7xl">
        <PricingPlansHeader />

        <PricingPlansGrid />

        <PricingPlansFooter />
      </div>
    </section>
  );
}
