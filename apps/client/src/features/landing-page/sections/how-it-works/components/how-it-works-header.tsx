import { Badge } from "@/components/ui";

export function HowItWorksHeader() {
  return (
    <div className="text-center mb-16">
      <Badge className="mb-4 px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
        Simple Process
      </Badge>
      <h2 className="text-4xl lg:text-5xl font-bold mb-6">
        How It
        {" "}
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Works</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Take notes on YouTube videos in four simple steps
      </p>
    </div>
  );
}
