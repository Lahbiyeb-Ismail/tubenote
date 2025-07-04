import { Bookmark, Clock, Search, Sparkles, Youtube, Zap } from "lucide-react";

export const features = [
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

export type Feature = typeof features[number];
