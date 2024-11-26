import {
  Globe,
  PlayCircle,
  BookOpen,
  FileCheck,
  Home,
  LayoutDashboard,
  FileText,
  Video,
  HelpCircle,
  Mail,
  Shield,
  Settings,
  User,
} from 'lucide-react';

export const howItWorksSteps = [
  {
    icon: Globe,
    title: 'Find a Video',
    description:
      'Search for or paste a YouTube video URL that you want to take notes on.',
    color: 'text-blue-500',
  },
  {
    icon: PlayCircle,
    title: 'Watch and Pause',
    description:
      'Play the video and pause whenever you want to take notes on a specific part.',
    color: 'text-green-500',
  },
  {
    icon: BookOpen,
    title: 'Take Notes',
    description:
      "Write your notes, which are automatically timestamped to the video's current time.",
    color: 'text-purple-500',
  },
  {
    icon: FileCheck,
    title: 'Review and Organize',
    description:
      'Access your notes anytime, organized by video and timestamp for easy review.',
    color: 'text-yellow-500',
  },
] as const;

export const footerQuickLinks = [
  { icon: Home, text: 'Home', link: '/' },
  { icon: LayoutDashboard, text: 'Dashboard', link: '/dashboard' },
  { icon: FileText, text: 'Notes', link: '/notes' },
  { icon: Video, text: 'Video', link: '/video' },
] as const;

export const footerSupportLinks = [
  { icon: HelpCircle, text: 'FAQ', link: '/faq' },
  { icon: Mail, text: 'Contact Us', link: '/contact' },
  { icon: HelpCircle, text: 'Help Center', link: '/help' },
  { icon: Shield, text: 'Privacy Policy', link: '/privacy' },
] as const;

export const sidebarMenuLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Notes', icon: FileText, href: '/notes' },
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Settings', icon: Settings, href: '/settings' },
] as const;

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Videos', href: '/videos', icon: Video },
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export const GOOGLE_REDIRECT_URI = `${API_URL}/auth/google`;

export const PAGE_LIMIT = 8;

export const DEFAULT_PAGE = 1;
