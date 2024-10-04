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
