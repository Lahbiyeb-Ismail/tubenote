import { SectionContainer, SectionHeader } from "../../components";
import { HowItWorksGrid } from "./components";

export function HowItWorks() {
  return (
    <SectionContainer sectionId="how-it-works">
      <SectionHeader
        badgeText="Simple Process"
        badgeClassName="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
        description="Take notes on YouTube videos in four simple steps"
        title={
          {
            text: "How It",
            highlight: "Works",
            highlightClassName: "from-purple-600 to-pink-500",
          }
        }
      />

      <HowItWorksGrid />
    </SectionContainer>
  );
}
