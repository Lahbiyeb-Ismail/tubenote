import { Badge } from "@/components/ui";

export function PricingPlansHeader() {
  return (
    <div className="text-center mb-16">
      <Badge className="mb-4 px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-full">
        Plans & Pricing
      </Badge>
      <h2 className="text-4xl lg:text-5xl font-bold mb-6">
        Choose Your
        {" "}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Perfect Plan
        </span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Start free and upgrade as you grow. All plans include our core features.
      </p>
    </div>
  );
}
