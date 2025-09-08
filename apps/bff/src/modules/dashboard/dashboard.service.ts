import type { IApiSuccessResponse } from "@tubenote/types";

import type { ISessionData } from "@/types";

import { axiosInstance } from "@/lib/axios";

/**
 * Dashboard-specific interfaces for typed responses
 */
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
 * Service class for managing dashboard analytics operations through API calls.
 * Handles all dashboard-related data fetching including metrics, charts, and activity data.
 * All methods require session data for authentication and authorization.
 */
export class DashboardService {
  /**
   * Retrieves complete dashboard data in a single optimized API call.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @returns Promise resolving to an API response containing complete dashboard data
   */
  async getDashboardData(sessionData: ISessionData): Promise<IApiSuccessResponse<IDashboardCompleteData>> {
    const response = await axiosInstance.get<IApiSuccessResponse<IDashboardCompleteData>>("/analytics/dashboard", {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return response.data;
  }

  /**
   * Retrieves user key metrics for dashboard cards.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @returns Promise resolving to an API response containing key metrics
   */
  async getKeyMetrics(sessionData: ISessionData): Promise<IApiSuccessResponse<IDashboardKeyMetrics>> {
    const response = await axiosInstance.get<IApiSuccessResponse<IDashboardKeyMetrics>>("/analytics/key-metrics", {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return response.data;
  }

  /**
   * Retrieves weekly activity data for charts.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param weeks - Number of weeks to fetch (default: 1)
   * @returns Promise resolving to an API response containing weekly activity data
   */
  async getWeeklyActivity(sessionData: ISessionData, weeks: number = 1): Promise<IApiSuccessResponse<IDashboardWeeklyActivity[]>> {
    const response = await axiosInstance.get<IApiSuccessResponse<IDashboardWeeklyActivity[]>>("/analytics/activity/weekly", {
      params: { weeks },
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return response.data;
  }

  /**
   * Retrieves monthly progress data for charts.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param months - Number of months to fetch (default: 6)
   * @returns Promise resolving to an API response containing monthly progress data
   */
  async getMonthlyProgress(sessionData: ISessionData, months: number = 6): Promise<IApiSuccessResponse<IDashboardMonthlyProgress[]>> {
    const response = await axiosInstance.get<IApiSuccessResponse<IDashboardMonthlyProgress[]>>("/analytics/activity/monthly", {
      params: { months },
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return response.data;
  }

  /**
   * Retrieves recent user activities.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param limit - Maximum number of activities to return (default: 10)
   * @returns Promise resolving to an API response containing recent activities
   */
  async getRecentActivities(sessionData: ISessionData, limit: number = 10): Promise<IApiSuccessResponse<IDashboardRecentActivity[]>> {
    const response = await axiosInstance.get<IApiSuccessResponse<IDashboardRecentActivity[]>>("/analytics/activity/recent", {
      params: { limit },
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return response.data;
  }

  /**
   * Retrieves category distribution data for pie charts.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @returns Promise resolving to an API response containing category distribution
   */
  async getCategoryDistribution(sessionData: ISessionData): Promise<IApiSuccessResponse<IDashboardCategoryData[]>> {
    const response = await axiosInstance.get<IApiSuccessResponse<IDashboardCategoryData[]>>("/analytics/category-distribution", {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return response.data;
  }

  /**
   * Retrieves user study streak data.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @returns Promise resolving to an API response containing study streak data
   */
  async getStudyStreak(sessionData: ISessionData): Promise<IApiSuccessResponse<IDashboardStudyStreak>> {
    const response = await axiosInstance.get<IApiSuccessResponse<IDashboardStudyStreak>>("/analytics/study-streak", {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return response.data;
  }
}
