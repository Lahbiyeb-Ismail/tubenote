import { Clock, FileText, Video, Zap } from "lucide-react";

import { useDashboardKeyMetricsQuery } from "../queries";
import { KeyMetricCard } from "./key-metric-card";

export function KeyMetrics() {
  const {
    data: keyMetrics,
    isLoading,
    error,
  } = useDashboardKeyMetricsQuery();

  // Helper function to format study time from minutes to hours
  const formatStudyTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }
    else if (minutes === 0) {
      return `${hours}h`;
    }
    else {
      return `${hours}.${Math.round((minutes / 60) * 10)}h`;
    }
  };

  // Helper function to determine trend from percentage change
  const getTrend = (change: string): "up" | "down" | "neutral" => {
    if (change.startsWith("+"))
      return "up";
    if (change.startsWith("-"))
      return "down";
    return "neutral";
  };

  // Loading state
  if (isLoading) {
    const loadingCards = ["total-notes", "videos-watched", "study-time", "current-streak"];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loadingCards.map(cardId => (
          <div key={cardId} className="animate-pulse">
            <div className="bg-slate-200 dark:bg-slate-700 h-32 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full text-center py-8 text-slate-600 dark:text-slate-400">
          Failed to load metrics data. Please try refreshing the page.
        </div>
      </div>
    );
  }

  // No data state
  if (!keyMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full text-center py-8 text-slate-600 dark:text-slate-400">
          No metrics data available.
        </div>
      </div>
    );
  }

  // Transform API data into the format expected by KeyMetricCard
  const keyMetricsData = [
    {
      title: "Total Notes",
      value: keyMetrics.totalNotes.toLocaleString(),
      change: keyMetrics.notesChange,
      trend: getTrend(keyMetrics.notesChange),
      icon: FileText,
      color: "blue" as const,
    },
    {
      title: "Videos Watched",
      value: keyMetrics.totalVideos.toLocaleString(),
      change: keyMetrics.videosChange,
      trend: getTrend(keyMetrics.videosChange),
      icon: Video,
      color: "green" as const,
    },
    {
      title: "Study Time",
      value: formatStudyTime(keyMetrics.totalStudyTime),
      change: keyMetrics.studyTimeChange,
      trend: getTrend(keyMetrics.studyTimeChange),
      icon: Clock,
      color: "purple" as const,
    },
    {
      title: "Current Streak",
      value: `${keyMetrics.currentStreak} days`,
      change: keyMetrics.streakChange,
      trend: getTrend(keyMetrics.streakChange),
      icon: Zap,
      color: "amber" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {keyMetricsData.map(metric => (
        <KeyMetricCard key={metric.title} metric={metric} />
      ))}
    </div>
  );
}
