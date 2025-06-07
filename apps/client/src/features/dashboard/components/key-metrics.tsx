import { Clock, FileText, Video, Zap } from "lucide-react";

import { KeyMetricCard } from "./key-metric-card";

const keyMetricsData = [
  {
    title: "Total Notes",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "blue",
  },
  {
    title: "Videos Watched",
    value: "89",
    change: "+8%",
    trend: "up",
    icon: Video,
    color: "green",
  },
  {
    title: "Study Time",
    value: "42.5h",
    change: "+15%",
    trend: "up",
    icon: Clock,
    color: "purple",
  },
  {
    title: "Current Streak",
    value: "12 days",
    change: "0%",
    trend: "neutral",
    icon: Zap,
    color: "amber",
  },
];

export function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {keyMetricsData.map(metric => (
        <KeyMetricCard key={metric.title} metric={metric} />
      ))}
    </div>
  );
}
