import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <Sparkles className="h-16 w-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Join thousands of learners who have already revolutionized their video note-taking experience with TubeNote.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-white/80 text-sm">Free to start • No credit card required</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full"></div>
    </section>
  );
}
