import { FeaturesGrid } from "./components/features-grid";
import { FeaturesHeader } from "./components/features-header";

export function Features() {
  return (
    <section className="py-20 px-4 bg-white/50" id="features">
      <div className="container mx-auto">
        <FeaturesHeader />

        <FeaturesGrid />
      </div>
    </section>
  );
}
