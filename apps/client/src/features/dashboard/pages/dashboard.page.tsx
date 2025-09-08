"use client";

import { useGetUserVideosCountQuery } from "@/features/video/queries";
import { DashboardHeader } from "@/shared/components";

import { Charts, DashboardSkeleton, KeyMetrics, LearningGoals, MonthlyProgress, QuickActions, RecentActivity, StudyStreak } from "../components";
import { DashboardEmptyState } from "../components/dashboard-empty-state";
import { useDashboardKeyMetricsQuery } from "../queries";

export function DashboardPage() {
  const {
    data: videosCount,
    isLoading: isVideosLoading,
  } = useGetUserVideosCountQuery();

  const {
    isLoading: isMetricsLoading,
    error: metricsError,
  } = useDashboardKeyMetricsQuery();

  // Show skeleton while initial data is loading
  if (isVideosLoading || isMetricsLoading)
    return <DashboardSkeleton />;

  // Show error state if key metrics failed to load
  if (metricsError) {
    return (
      <main className="container py-6">
        <DashboardHeader title="Welcome back! 👋" description="Overview of your learning progress and activities." />
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Unable to load dashboard data. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </main>
    );
  }

  // Show empty state if user has no videos
  if (videosCount === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <main className="container py-6">
      {/* Welcome Section */}
      <DashboardHeader
        title="Welcome back! 👋"
        description="Overview of your learning progress and activities."
      />

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
