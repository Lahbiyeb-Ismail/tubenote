import { features } from "../data";
import { FeatureCard } from "./feature-card";

export function FeaturesGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map(feature => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  );
}
