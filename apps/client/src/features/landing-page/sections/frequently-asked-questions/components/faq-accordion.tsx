import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { frequentlyAskedQuestions } from "../data";

export function FAQAccordion() {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <Accordion type="single" collapsible className="space-y-4">
        {frequentlyAskedQuestions.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={`item-${index}`}
            className="border border-gray-200 rounded-lg px-6 bg-white/50"
          >
            <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed pt-2">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
