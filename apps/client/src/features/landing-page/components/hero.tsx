import { Play, Rocket, Sparkles } from "lucide-react";

import { Badge, Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="pb-16 px-4 min-h-screen flex items-center">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:space-y-8 lg:text-left">
            <div className="space-y-6">
              <Badge className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Smart Video Note-Taking
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Unlock the Power of
                {" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Video Learning
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg w-full mx-auto lg:mx-0">
                Unleash your inner note-taking powers with TubeNote - the ultimate sidekick for conquering knowledge from the video galaxies.
              </p>
            </div>

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
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-auto">
                  <div className="w-6 h-6 text-gray-400">✏️</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gradient-to-r from-purple-200 to-transparent rounded"></div>
                <div className="h-4 bg-gradient-to-r from-pink-200 to-transparent rounded w-4/5"></div>
                <div className="h-4 bg-gradient-to-r from-blue-200 to-transparent rounded w-3/5"></div>
                <div className="h-4 bg-gradient-to-r from-purple-200 to-transparent rounded w-4/5"></div>
                <div className="h-4 bg-gradient-to-r from-pink-200 to-transparent rounded w-2/3"></div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
