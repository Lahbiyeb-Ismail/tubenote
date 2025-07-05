import { HeroLeftSide } from "./hero-left-side";
import { HeroRightSide } from "./hero-right-side";

export function HeroGrid() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <HeroLeftSide />

      <HeroRightSide />
    </div>
  );
}
