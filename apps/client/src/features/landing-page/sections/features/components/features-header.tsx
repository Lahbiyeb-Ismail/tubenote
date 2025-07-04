import { Badge } from "@/components/ui";

export function FeaturesHeader() {
  return (
    <div className="text-center mb-16">
      <Badge className="mb-4 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400">
        Features
      </Badge>
      <h2 className="text-4xl lg:text-5xl font-bold mb-6">
        Powerful
        {" "}
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Features</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Everything you need to supercharge your video learning experience
      </p>
    </div>
  );
}
