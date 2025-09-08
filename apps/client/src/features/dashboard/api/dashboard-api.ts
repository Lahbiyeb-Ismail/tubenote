import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/shared/lib";

// Dashboard API Types matching BFF service interfaces
export interface IDashboardKeyMetrics {
  totalNotes: number;
  totalVideos: number;
  totalStudyTime: number;
  currentStreak: number;
  notesChange: string;
  videosChange: string;
  studyTimeChange: string;
  streakChange: string;
}

export interface IDashboardWeeklyActivity {
  day: string;
  notes: number;
  videos: number;
  time: number;
  date: string;
}

export interface IDashboardMonthlyProgress {
  month: string;
  notes: number;
  videos: number;
  studyTime: number;
}

export interface IDashboardCategoryData {
  name: string;
  value: number;
  color: string;
}

export interface IDashboardRecentActivity {
  id: string;
  type: string;
  title: string;
  time: string;
  icon: string;
  color: string;
  metadata?: any;
}

export interface IDashboardStudyStreak {
  currentStreak: number;
  longestStreak: number;
  streakData: Array<{
    day: number;
    active: boolean;
    date: string;
  }>;
  lastActivityDate: string | null;
}

export interface IDashboardCompleteData {
  keyMetrics: IDashboardKeyMetrics;
  weeklyActivity: IDashboardWeeklyActivity[];
  monthlyProgress: IDashboardMonthlyProgress[];
  categoryDistribution: IDashboardCategoryData[];
  recentActivities: IDashboardRecentActivity[];
  studyStreak: IDashboardStudyStreak;
}

/**
 * Fetches complete dashboard data in a single optimized API call.
 * This reduces the number of requests and improves performance.
 *
 * @returns {Promise<IApiSuccessResponse<IDashboardCompleteData>>} A promise that resolves to the API success response containing all dashboard data.
 * @throws {Error} Throws an error if the request fails.
 */
export async function getDashboardData(): Promise<IApiSuccessResponse<IDashboardCompleteData>> {
  const response = await axiosInstance.get<IApiSuccessResponse<IDashboardCompleteData>>("/dashboard");

  return response.data;
}

/**
 * Fetches user key metrics for dashboard cards.
 * Returns totals for notes, videos, study time, and current streak with percentage changes.
 *
 * @returns {Promise<IApiSuccessResponse<IDashboardKeyMetrics>>} A promise that resolves to the API success response containing key metrics.
 * @throws {Error} Throws an error if the request fails.
 */
export async function getDashboardKeyMetrics(): Promise<IApiSuccessResponse<IDashboardKeyMetrics>> {
  const response = await axiosInstance.get<IApiSuccessResponse<IDashboardKeyMetrics>>("/dashboard/key-metrics");

  return response.data;
}

/**
 * Fetches weekly activity data for dashboard charts.
 * Returns daily activity breakdown for the specified number of weeks.
 *
 * @param {number} weeks - Number of weeks to fetch (default: 1)
 * @returns {Promise<IApiSuccessResponse<IDashboardWeeklyActivity[]>>} A promise that resolves to the API success response containing weekly activity data.
 * @throws {Error} Throws an error if the request fails.
 */
export async function getDashboardWeeklyActivity(weeks: number = 1): Promise<IApiSuccessResponse<IDashboardWeeklyActivity[]>> {
  const response = await axiosInstance.get<IApiSuccessResponse<IDashboardWeeklyActivity[]>>("/dashboard/activity/weekly", {
    params: { weeks },
  });

  return response.data;
}

/**
 * Fetches monthly progress data for dashboard charts.
 * Returns monthly progress breakdown for the specified number of months.
 *
 * @param {number} months - Number of months to fetch (default: 6)
 * @returns {Promise<IApiSuccessResponse<IDashboardMonthlyProgress[]>>} A promise that resolves to the API success response containing monthly progress data.
 * @throws {Error} Throws an error if the request fails.
 */
export async function getDashboardMonthlyProgress(months: number = 6): Promise<IApiSuccessResponse<IDashboardMonthlyProgress[]>> {
  const response = await axiosInstance.get<IApiSuccessResponse<IDashboardMonthlyProgress[]>>("/dashboard/activity/monthly", {
    params: { months },
  });

  return response.data;
}

/**
 * Fetches recent user activities for dashboard display.
 * Returns the most recent user activities with specified limit.
 *
 * @param {number} limit - Maximum number of activities to return (default: 10)
 * @returns {Promise<IApiSuccessResponse<IDashboardRecentActivity[]>>} A promise that resolves to the API success response containing recent activities.
 * @throws {Error} Throws an error if the request fails.
 */
export async function getDashboardRecentActivities(limit: number = 10): Promise<IApiSuccessResponse<IDashboardRecentActivity[]>> {
  const response = await axiosInstance.get<IApiSuccessResponse<IDashboardRecentActivity[]>>("/dashboard/activity/recent", {
    params: { limit },
  });

  return response.data;
}

/**
 * Fetches category distribution data for pie charts.
 * Returns how user notes are distributed across different categories.
 *
 * @returns {Promise<IApiSuccessResponse<IDashboardCategoryData[]>>} A promise that resolves to the API success response containing category distribution.
 * @throws {Error} Throws an error if the request fails.
 */
export async function getDashboardCategoryDistribution(): Promise<IApiSuccessResponse<IDashboardCategoryData[]>> {
  const response = await axiosInstance.get<IApiSuccessResponse<IDashboardCategoryData[]>>("/dashboard/category-distribution");

  return response.data;
}

/**
 * Fetches user study streak data for dashboard display.
 * Returns current streak, longest streak, and streak visualization data.
 *
 * @returns {Promise<IApiSuccessResponse<IDashboardStudyStreak>>} A promise that resolves to the API success response containing study streak data.
 * @throws {Error} Throws an error if the request fails.
 */
export async function getDashboardStudyStreak(): Promise<IApiSuccessResponse<IDashboardStudyStreak>> {
  const response = await axiosInstance.get<IApiSuccessResponse<IDashboardStudyStreak>>("/dashboard/study-streak");

  return response.data;
}
