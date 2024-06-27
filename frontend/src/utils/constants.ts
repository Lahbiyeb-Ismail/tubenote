// import Category from "@/components/icons/category";
// import Logs from "@/components/icons/clipboard";
// import Templates from "@/components/icons/cloud-download";
// import Home from "@/components/icons/home";
// import Payment from "@/components/icons/payment";
// import Settings from "@/components/icons/settings";
// import Workflows from "@/components/icons/workflows";
import {
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
