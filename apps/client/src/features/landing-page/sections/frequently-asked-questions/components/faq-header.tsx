import { Badge } from "@/components/ui";

export function FAQHeader() {
  return (
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
  );
}
