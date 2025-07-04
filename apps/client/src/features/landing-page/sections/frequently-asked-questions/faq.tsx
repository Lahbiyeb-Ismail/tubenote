import { FAQAccordion, FAQHeader } from "./components";

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4 bg-white/30">
      <div className="container mx-auto max-w-4xl">
        <FAQHeader />

        <FAQAccordion />
      </div>
    </section>
  );
}
