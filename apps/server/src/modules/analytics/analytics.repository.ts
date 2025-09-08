import type { ActivityType, Prisma, StudyStreak, UserActivity, UserStats } from "@tubenote/db";

import { inject, injectable } from "inversify";

import type { IPrismaService } from "@/modules/shared/services";

import { TYPES } from "@/config/inversify/types";

import type { IAnalyticsRepository } from "./analytics.types";

/**
 * Repository class for handling analytics data operations.
 *
 * Provides methods to interact with UserActivity, UserStats, and StudyStreak models
 * in the database. Encapsulates all database queries related to analytics and dashboard data.
 */
@injectable()
export class AnalyticsRepository implements IAnalyticsRepository {
  /**
   * Creates an instance of AnalyticsRepository.
   *
   * @param _db - Prisma service for database operations.
   */
  constructor(
    @inject(TYPES.PrismaService)
    private readonly _db: IPrismaService,
  ) {}

  /**
   * Gets aggregated user statistics.
   *
   * @param userId - The unique identifier of the user.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to user statistics or null.
   */
  async getUserStats(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserStats | null> {
    const client = tx ?? this._db;

    return client.userStats.findUnique({
      where: { userId },
    });
  }

  /**
   * Creates or updates user statistics.
   *
   * @param userId - The unique identifier of the user.
   * @param data - Partial user stats data to update.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the updated user statistics.
   */
  async upsertUserStats(
    userId: string,
    data: Partial<Omit<UserStats, "id" | "userId" | "createdAt" | "updatedAt">>,
    tx?: Prisma.TransactionClient,
  ): Promise<UserStats> {
    const client = tx ?? this._db;

    return client.userStats.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });
  }

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
  async createActivity(
    userId: string,
    type: ActivityType,
    metadata?: any,
    duration?: number,
    tx?: Prisma.TransactionClient,
  ): Promise<UserActivity> {
    const client = tx ?? this._db;

    return client.userActivity.create({
      data: {
        userId,
        type,
        metadata,
        duration,
      },
    });
  }

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
  async getUserActivities(
    userId: string,
    startDate: Date,
    endDate: Date,
    types?: ActivityType[],
    tx?: Prisma.TransactionClient,
  ): Promise<UserActivity[]> {
    const client = tx ?? this._db;

    const whereClause: Prisma.UserActivityWhereInput = {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (types && types.length > 0) {
      whereClause.type = {
        in: types,
      };
    }

    return client.userActivity.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Gets or creates user study streak.
   *
   * @param userId - The unique identifier of the user.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the user's study streak.
   */
  async getOrCreateStudyStreak(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<StudyStreak> {
    const client = tx ?? this._db;

    let studyStreak = await client.studyStreak.findUnique({
      where: { userId },
    });

    if (!studyStreak) {
      studyStreak = await client.studyStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          streakData: [],
        },
      });
    }

    return studyStreak;
  }

  /**
   * Updates user study streak.
   *
   * @param userId - The unique identifier of the user.
   * @param data - Partial study streak data to update.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the updated study streak.
   */
  async updateStudyStreak(
    userId: string,
    data: Partial<Omit<StudyStreak, "id" | "userId" | "createdAt" | "updatedAt">>,
    tx?: Prisma.TransactionClient,
  ): Promise<StudyStreak> {
    const client = tx ?? this._db;

    return client.studyStreak.update({
      where: { userId },
      data,
    });
  }

  /**
   * Gets recent user activities with limit.
   *
   * @param userId - The unique identifier of the user.
   * @param limit - Maximum number of activities to return.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to an array of recent user activities.
   */
  async getRecentActivities(
    userId: string,
    limit: number = 10,
    tx?: Prisma.TransactionClient,
  ): Promise<UserActivity[]> {
    const client = tx ?? this._db;

    return client.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Gets activity count by type for a user within a date range.
   *
   * @param userId - The unique identifier of the user.
   * @param startDate - Start date for the query.
   * @param endDate - End date for the query.
   * @param type - Activity type to count.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the count of activities.
   */
  async getActivityCountByType(
    userId: string,
    startDate: Date,
    endDate: Date,
    type: ActivityType,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this._db;

    return client.userActivity.count({
      where: {
        userId,
        type,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  /**
   * Gets total study time for a user within a date range.
   *
   * @param userId - The unique identifier of the user.
   * @param startDate - Start date for the query.
   * @param endDate - End date for the query.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the total study time in minutes.
   */
  async getTotalStudyTime(
    userId: string,
    startDate: Date,
    endDate: Date,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this._db;

    const result = await client.userActivity.aggregate({
      where: {
        userId,
        type: {
          in: ["STUDY_SESSION_STARTED", "STUDY_SESSION_ENDED"],
        },
        duration: {
          not: null,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        duration: true,
      },
    });

    return result._sum.duration ?? 0;
  }
}
