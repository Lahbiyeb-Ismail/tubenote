import { pricingPlans } from "../data";
import { PricingPlansCard } from "./pricing-plans-card";

export function PricingPlansGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {pricingPlans.map(plan => (
        <PricingPlansCard key={plan.name} pricingPlan={plan} />
      ))}
    </div>
  );
}
