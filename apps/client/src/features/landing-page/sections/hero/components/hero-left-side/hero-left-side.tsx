import { HeroBadge } from "./hero-badge";
import { HeroButtons } from "./hero-buttons";
import { HeroDescription } from "./hero-description";
import { HeroTitle } from "./hero-title";

export function HeroLeftSide() {
  return (
    <div className="space-y-6 text-center lg:space-y-8 lg:text-left">
      <div className="space-y-6">
        <HeroBadge />

        <HeroTitle />

        <HeroDescription />
      </div>

      <HeroButtons />
    </div>
  );
}
