import { FileText, FolderOpen, Globe, Play } from "lucide-react";

import { Badge, Card, CardContent } from "@/components/ui";

export function HowItWorks() {
  const steps = [
    {
      icon: Globe,
      title: "Find a Video",
      description: "Search for or paste a YouTube video URL that you want to take notes on.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Play,
      title: "Watch and Pause",
      description: "Play the video and pause whenever you want to take notes on a specific part.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FileText,
      title: "Take Notes",
      description: "Write your notes, which are automatically timestamped to the video's current time.",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: FolderOpen,
      title: "Review and Organize",
      description: "Access your notes anytime, organized by video and timestamp for easy review.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <Card key={step.title} className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="absolute z-[100] -top-4 left-6 h-8 w-8 rounded-full bg-gradient-to-r from-red-600 to-purple-600 flex items-center justify-center text-white font-medium">
                {i + 1}
              </div>
              <CardContent className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:bg-white/80">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
