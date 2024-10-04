import { Globe, PlayCircle, BookOpen, FileCheck } from 'lucide-react';

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
