import type { ActivityType, Prisma, StudyStreak, UserActivity, UserStats } from "@tubenote/db";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

/**
 * Interface defining the repository methods for interacting with analytics data.
 */
export interface IAnalyticsRepository {
  /**
   * Gets aggregated key metrics for a user.
   *
   * @param userId - The unique identifier of the user.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to user statistics or null.
   */
  getUserStats: (
    userId: string,
    tx?: Prisma.TransactionClient
  ) => Promise<UserStats | null>;

  /**
   * Creates or updates user statistics.
   *
   * @param userId - The unique identifier of the user.
   * @param data - Partial user stats data to update.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the updated user statistics.
   */
  upsertUserStats: (
    userId: string,
    data: Partial<Omit<UserStats, "id" | "userId" | "createdAt" | "updatedAt">>,
    tx?: Prisma.TransactionClient
  ) => Promise<UserStats>;

  /**
   * Creates a new user activity record.
   *
   * @param userId - The unique identifier of the user.
   * @param type - Type of activity performed.
   * @param metadata - Additional data related to the activity.
   * @param duration - Duration of the activity in minutes (optional).
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the created user activity.
   */
  createActivity: (
    userId: string,
    type: ActivityType,
    metadata?: any,
    duration?: number,
    tx?: Prisma.TransactionClient
  ) => Promise<UserActivity>;

  /**
   * Gets user activities within a date range.
   *
   * @param userId - The unique identifier of the user.
   * @param startDate - Start date for the query.
   * @param endDate - End date for the query.
   * @param types - Optional activity types to filter by.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to an array of user activities.
   */
  getUserActivities: (
    userId: string,
    startDate: Date,
    endDate: Date,
    types?: ActivityType[],
    tx?: Prisma.TransactionClient
  ) => Promise<UserActivity[]>;

  /**
   * Gets or creates user study streak.
   *
   * @param userId - The unique identifier of the user.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the user's study streak.
   */
  getOrCreateStudyStreak: (
    userId: string,
    tx?: Prisma.TransactionClient
  ) => Promise<StudyStreak>;

  /**
   * Updates user study streak.
   *
   * @param userId - The unique identifier of the user.
   * @param data - Partial study streak data to update.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the updated study streak.
   */
  updateStudyStreak: (
    userId: string,
    data: Partial<Omit<StudyStreak, "id" | "userId" | "createdAt" | "updatedAt">>,
    tx?: Prisma.TransactionClient
  ) => Promise<StudyStreak>;
}

/**
 * Interface defining the service methods for analytics business logic.
 */
export interface IAnalyticsService {
  /**
   * Gets key metrics for the user dashboard.
   *
   * @param userId - The unique identifier of the user.
   *
   * @returns A promise that resolves to user key metrics.
   */
  getUserKeyMetrics: (userId: string) => Promise<IUserKeyMetrics>;

  /**
   * Gets weekly activity data for charts.
   *
   * @param userId - The unique identifier of the user.
   * @param weeks - Number of weeks to fetch (default: 1).
   *
   * @returns A promise that resolves to weekly activity data.
   */
  getUserWeeklyActivity: (userId: string, weeks?: number) => Promise<IWeeklyActivityData[]>;

  /**
   * Gets monthly progress data for charts.
   *
   * @param userId - The unique identifier of the user.
   * @param months - Number of months to fetch (default: 6).
   *
   * @returns A promise that resolves to monthly progress data.
   */
  getUserMonthlyProgress: (userId: string, months?: number) => Promise<IMonthlyProgressData[]>;

  /**
   * Gets category distribution of user notes.
   *
   * @param userId - The unique identifier of the user.
   *
   * @returns A promise that resolves to category distribution data.
   */
  getCategoryDistribution: (userId: string) => Promise<ICategoryData[]>;

  /**
   * Tracks a user activity and updates related statistics.
   *
   * @param userId - The unique identifier of the user.
   * @param type - Type of activity performed.
   * @param metadata - Additional data related to the activity.
   * @param duration - Duration of the activity in minutes (optional).
   *
   * @returns A promise that resolves to the created activity.
   */
  trackUserActivity: (
    userId: string,
    type: ActivityType,
    metadata?: any,
    duration?: number
  ) => Promise<UserActivity>;

  /**
   * Gets recent activities for the user.
   *
   * @param userId - The unique identifier of the user.
   * @param limit - Maximum number of activities to return (default: 10).
   *
   * @returns A promise that resolves to recent activities data.
   */
  getRecentActivities: (userId: string, limit?: number) => Promise<IRecentActivity[]>;

  /**
   * Gets and updates user study streak.
   *
   * @param userId - The unique identifier of the user.
   *
   * @returns A promise that resolves to study streak data.
   */
  getStudyStreakData: (userId: string) => Promise<IStudyStreakData>;

  /**
   * Updates user study streak based on daily activity.
   *
   * @param userId - The unique identifier of the user.
   *
   * @returns A promise that resolves to the updated study streak.
   */
  updateStudyStreak: (userId: string) => Promise<StudyStreak>;
}

/**
 * Interface defining the controller methods for handling HTTP requests.
 */
export interface IAnalyticsController {
  /**
   * Handles request to get user key metrics.
   */
  getUserKeyMetrics: (req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) => Promise<void>;

  /**
   * Handles request to get weekly activity data.
   */
  getUserWeeklyActivity: (req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) => Promise<void>;

  /**
   * Handles request to get monthly progress data.
   */
  getUserMonthlyProgress: (req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) => Promise<void>;

  /**
   * Handles request to get category distribution.
   */
  getCategoryDistribution: (req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) => Promise<void>;

  /**
   * Handles request to get recent activities.
   */
  getRecentActivities: (req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) => Promise<void>;

  /**
   * Handles request to get study streak data.
   */
  getStudyStreakData: (req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) => Promise<void>;

  /**
   * Handles request to get complete dashboard data.
   */
  getDashboardData: (req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) => Promise<void>;
}

// Data Transfer Objects
export interface IUserKeyMetrics {
  totalNotes: number;
  totalVideos: number;
  totalStudyTime: number; // in minutes
  currentStreak: number;
  notesChange: string; // percentage change
  videosChange: string;
  studyTimeChange: string;
  streakChange: string;
}

export interface IWeeklyActivityData {
  day: string;
  notes: number;
  videos: number;
  time: number; // in minutes
  date: string;
}

export interface IMonthlyProgressData {
  month: string;
  notes: number;
  videos: number;
  studyTime: number;
}

export interface ICategoryData {
  name: string;
  value: number;
  color: string;
}

export interface IRecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  time: string; // formatted time ago
  icon: string;
  color: string;
  metadata?: any;
}

export interface IStudyStreakData {
  currentStreak: number;
  longestStreak: number;
  streakData: Array<{
    day: number;
    active: boolean;
    date: string;
  }>;
  lastActivityDate: string | null;
}

export interface IDashboardData {
  keyMetrics: IUserKeyMetrics;
  weeklyActivity: IWeeklyActivityData[];
  monthlyProgress: IMonthlyProgressData[];
  categoryDistribution: ICategoryData[];
  recentActivities: IRecentActivity[];
  studyStreak: IStudyStreakData;
}
