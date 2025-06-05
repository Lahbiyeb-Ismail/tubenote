import { Bookmark, Clock, Search, Sparkles, Youtube, Zap } from "lucide-react";

import { Badge, Card, CardContent } from "@/components/ui";

export function Features() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Take notes instantly without interrupting your learning flow.",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Clock,
      title: "Automatic Timestamps",
      description: "Every note is automatically linked to the video timestamp.",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find any note across all your videos with powerful search.",
      gradient: "from-green-400 to-blue-500",
    },
    {
      icon: Bookmark,
      title: "Save Favorites",
      description: "Bookmark important videos and notes for quick access during your study sessions.",
      gradient: "from-pink-400 to-red-500",
    },
    {
      icon: Youtube,
      title: "YouTube Integration",
      description: "Works seamlessly with YouTube videos - just paste the URL and start taking notes.",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Generate concise summaries of your notes and video content with our AI assistant.",
      gradient: "from-teal-400 to-cyan-500",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white/50" id="features">
      <div className="container mx-auto">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => (
            <Card key={feature.title} className="group cursor-pointer hover:scale-105 transition-transform duration-300">
              <CardContent className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:bg-white/80">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
