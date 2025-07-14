import { AlertCircle, Brain, Check, CheckCircle, Clock, Frown, ScatterChart, Search, Smile, X } from "lucide-react";

export const userPainPoints = [
  {
    icon: Clock,
    title: "Lost Information",
    description: "Important details disappear in 2-hour lectures with no way to quickly find them again",
  },
  {
    icon: Search,
    title: "No Reference Points",
    description: "Unable to jump back to specific moments when you need to review key concepts",
  },
  {
    icon: ScatterChart,
    title: "Scattered Notes",
    description: "Notes spread across multiple apps, notebooks, and devices with no organization",
  },
  {
    icon: Brain,
    title: "Poor Retention",
    description: "Passive watching leads to forgetting 90% of content within a week",
  },
];

export const learningScenarios = [
  {
    title: "The Struggling Student",
    description: `Sarah watches a 3-hour calculus lecture on YouTube. She takes notes in a separate notebook, but when studying for her exam, she can't remember which part of the video explained derivatives. She ends up rewatching the entire lecture, wasting precious study time.`,
    image: "/images/the_struggling_student.jpeg",
  },
  {
    title: "The Overwhelmed Professional",
    description: `Mark attends multiple training webinars for his certification. His notes are scattered across different apps and sticky notes. When he needs to reference a specific technique months later, he can't find it and has to start from scratch.`,
    image: "/images/the_overwhelmed_professional.jpeg",
  },
  {
    title: "The Frustrated Learner",
    description: `Lisa follows online courses on multiple platforms. She has notes everywhere but no system to organize them. When working on projects, she wastes hours trying to find that one crucial explanation she remembered taking notes on.`,
    image: "/images/the_frustrated_learner.jpg",
  },
];

export const traditionalUserExperience = {
  title: "Chaotic & Frustrating",
  viewIcon: X,
  bgImage: "bg-error-50",
  bgColor: "bg-error",
  textColor: "text-error",
  checkListIcon: AlertCircle,
  checkListIconColor: "#EF4444",
  checkList: [
    "Notes scattered across multiple apps and notebooks",
    "No connection between notes and video timestamps",
    "Hours wasted rewatching entire videos",
    "Important information gets lost forever",
  ],
  feedbackSection: {
    icon: Frown,
    iconColor: "#ef4444",
    text: "Messy, Unorganized, Inefficient",
    bgColor: "bg-error-100",
  },
};

export const organizedUserExperience = {
  title: "Organized & Efficient",
  description: "Organized, Efficient, Effective",
  viewIcon: Check,
  bgImage: "bg-success-50",
  bgColor: "bg-success",
  textColor: "text-success",
  checkListIcon: CheckCircle,
  checkListIconColor: "#10B981",
  checkList: [
    "All notes automatically synced with video timestamps",
    "Click any note to instantly jump to that moment",
    "AI-powered organization and categorization",
    "Never lose important information again",
  ],
  feedbackSection: {
    icon: Smile,
    iconColor: "#10B981",
    text: "Organized, Efficient, Effective",
    bgColor: "bg-success-100",
  },
};
