import { howItWorksSteps } from "../data";
import { HowItWorksCard } from "./how-it-works-card";

export function HowItWorksGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {howItWorksSteps.map((step, i) => (
        <HowItWorksCard
          key={step.title}
          step={step}
          index={i}
        />
      ))}
    </div>
  );
}
