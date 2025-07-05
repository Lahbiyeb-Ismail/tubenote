import { SectionContainer, SectionHeader } from "../../components";
import { FeaturesGrid } from "./components";

export function Features() {
  return (
    <SectionContainer backgroundColorClass="bg-white/50" sectionId="features">
      <SectionHeader
        badgeText="Features"
        badgeClassName="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
        description="Everything you need to supercharge your video learning experience"
        title={
          {
            text: "Powerful",
            highlight: "Features",
            highlightClassName: "from-purple-600 to-pink-500",
          }
        }
      />

      <FeaturesGrid />
    </SectionContainer>
  );
}
