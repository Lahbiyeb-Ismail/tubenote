import { SectionContainer, SectionHeader } from "../../components";
import { FAQAccordion } from "./components";

export function FAQ() {
  return (
    <SectionContainer sectionId="faq" backgroundColorClass="bg-white/30" containerClass="max-w-4xl">
      <SectionHeader
        badgeText="FAQS"
        badgeClassName="bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400"
        description="Everything you need to know about TubeNote"
        title={
          {
            text: "Frequently Asked",
            highlight: "Questions",
            highlightClassName: "from-purple-600 to-pink-500",
          }
        }
      />

      <FAQAccordion />
    </SectionContainer>
  );
}
