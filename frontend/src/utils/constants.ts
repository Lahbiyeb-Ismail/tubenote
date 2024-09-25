import {
  Edit,
  GlobeIcon,
  LayoutDashboard,
  NotebookIcon,
  SettingsIcon,
  VideoIcon,
} from "lucide-react";

export const sidebarNavOptions = [
  { name: "Dashboard", Component: LayoutDashboard, href: "/dashboard" },
  { name: "Notes", Component: NotebookIcon, href: "/notes" },
  { name: "Videos", Component: VideoIcon, href: "/videos" },
  { name: "Settings", Component: SettingsIcon, href: "/settings" },
] as const;

export const howItWorksSteps = [
  {
    icon: GlobeIcon,
    title: "Find a Video",
    description:
      "Search for or paste a YouTube video URL that you want to take notes on.",
    color: "text-blue-500",
  },
  {
    icon: VideoIcon,
    title: "Watch and Pause",
    description:
      "Play the video and pause whenever you want to take notes on a specific part.",
    color: "text-green-500",
  },
  {
    icon: NotebookIcon,
    title: "Take Notes",
    description:
      "Write your notes, which are automatically timestamped to the video's current time.",
    color: "text-purple-500",
  },
  {
    icon: Edit,
    title: "Review and Organize",
    description:
      "Access your notes anytime, organized by video and timestamp for easy review.",
    color: "text-yellow-500",
  },
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
