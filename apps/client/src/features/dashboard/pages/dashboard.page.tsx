"use client";

import { DashboardHeader } from "@/components/dashboards";
import { useGetUserVideosCountQuery } from "@/features/video/queries";

import { Charts, DashboardSkeleton, KeyMetrics, LearningGoals, MonthlyProgress, QuickActions, RecentActivity, StudyStreak } from "../components";
import { DashboardEmptyState } from "../components/dashboard-empty-state";

export function DashboardPage() {
  const {
    data: videosCount,
    isLoading,
  } = useGetUserVideosCountQuery();

  if (isLoading)
    return <DashboardSkeleton />;

  if (videosCount === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <main className="container py-6">
      {/* Welcome Section */}
      <DashboardHeader title="Welcome back, John! 👋" description="Overview of your learning progress and activities." />

      {/* Key Metrics Cards */}
      <KeyMetrics />

      {/* Charts Section */}
      <Charts />

      {/* Study Streak & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Study Streak */}
        <StudyStreak />

        {/* Monthly Progress */}
        <MonthlyProgress />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <RecentActivity />

        {/* Quick Actions & Goals */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Learning Goals */}
          <LearningGoals />
        </div>
      </div>
    </main>
  );
}
