"use client";

import {
  Download,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Charts, KeyMetrics, MonthlyProgress, QuickActions, RecentActivity, StudyStreak } from "../components";
import { LearningGoals } from "../components/learning-goals";

export function DashboardPage() {
  return (
    <main className="container py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, John! 👋</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Here's what's happening with your learning journey today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700">
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

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
