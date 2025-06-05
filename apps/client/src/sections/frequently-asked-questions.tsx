import { Badge } from "@/components/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How does TubeNote work with YouTube videos?",
      answer: "Simply paste any YouTube video URL into TubeNote, and you can start taking notes while watching. Your notes are automatically timestamped to specific moments in the video, making it easy to review and reference later.",
    },
    {
      question: "Can I share my notes with others?",
      answer: "Yes! TubeNote allows you to easily share your notes with classmates, colleagues, or study groups. You can export notes or share them directly through the platform with customizable privacy settings.",
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. All your notes are encrypted and stored securely in the cloud. We follow industry-standard security practices and never share your personal data or notes with third parties.",
    },
    {
      question: "Can I use TubeNote offline?",
      answer: "While you need an internet connection to load YouTube videos, you can access and edit your previously saved notes offline. Any changes will sync automatically when you're back online.",
    },
    {
      question: "Is there a limit to how many notes I can take?",
      answer: "Our free plan includes generous limits for personal use. For heavy users or teams, we offer premium plans with unlimited notes, advanced search features, and collaboration tools.",
    },
    {
      question: "What video formats does TubeNote support?",
      answer: "Currently, TubeNote works with YouTube videos. We're actively working on supporting other video platforms and direct video file uploads in future updates.",
    },
    {
      question: "Can I organize my notes into different categories?",
      answer: "Yes! TubeNote includes powerful organization features including folders, tags, and search functionality to help you keep your notes organized by subject, project, or any system that works for you.",
    },
    {
      question: "How accurate are the automatic timestamps?",
      answer: "Timestamps are precise to the second and automatically sync with the video's current playback time when you create a note. You can also manually adjust timestamps if needed.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-white/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-sm bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 rounded-full">
            FAQS
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked
            {" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about TubeNote
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
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
      </div>
    </section>
  );
}
