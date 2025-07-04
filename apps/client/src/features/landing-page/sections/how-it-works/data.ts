import { FileText, FolderOpen, Globe, Play } from "lucide-react";

export const howItWorksSteps = [
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

export type HowItWorksStep = typeof howItWorksSteps[number];
