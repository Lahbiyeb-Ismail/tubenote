import { Play, Rocket } from "lucide-react";

import { Button } from "@/components/ui";

export function HeroButtons() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:items-start lg:justify-start">
      <Button
        size="lg"
        className="w-[45%] lg:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        <Rocket className="mr-2 h-5 w-5" />
        Get Started
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-[45%] lg:w-auto border-2 border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-300"
      >
        <Play className="mr-2 h-5 w-5" />
        Watch Demo
      </Button>
    </div>
  );
}
