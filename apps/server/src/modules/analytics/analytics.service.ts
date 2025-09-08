// import type { ActivityType, UserActivity } from "@tubenote/db";

// import { inject, injectable } from "inversify";

// import type { ICacheService, IPrismaService } from "@/modules/shared/services";

// import { TYPES } from "@/config/inversify/types";

// import type {
//   IAnalyticsRepository,
//   IAnalyticsService,
//   ICategoryData,
//   IMonthlyProgressData,
//   IRecentActivity,
//   IStudyStreakData,
//   IUserKeyMetrics,
//   IWeeklyActivityData,
// } from "./analytics.types";

// /**
//  * Service class for handling analytics business logic.
//  *
//  * Provides methods to calculate user statistics, activity data, and dashboard metrics.
//  * Encapsulates complex calculations and data transformations for analytics features.
//  */
// @injectable()
// export class AnalyticsService implements IAnalyticsService {
//   /**
//    * Creates an instance of AnalyticsService.
//    *
//    * @param _analyticsRepository - Repository for analytics data operations.
//    * @param _prismaService - Prisma service for database operations.
//    * @param _cacheService - Cache service for performance optimization.
//    */
//   constructor(
//     @inject(TYPES.AnalyticsRepository)
//     private readonly _analyticsRepository: IAnalyticsRepository,
//     @inject(TYPES.PrismaService)
//     private readonly _prismaService: IPrismaService,
//     @inject(TYPES.CacheService)
//     private readonly _cacheService: ICacheService,
//   ) {}

//   /**
//    * Gets key metrics for the user dashboard.
//    *
//    * @param userId - The unique identifier of the user.
//    *
//    * @returns A promise that resolves to user key metrics.
//    */
//   async getUserKeyMetrics(userId: string): Promise<IUserKeyMetrics> {
//     const cacheKey = `user-key-metrics:${userId}`;

//     // Try to get from cache first
//     const cached = await this._cacheService.get<IUserKeyMetrics>(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     // Get current period (this month)
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

//     // Get previous period (last month) for comparison
//     const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

//     // Get user stats and calculate metrics
//     const [
//       userStats,
//       currentNotesCount,
//       currentVideosCount,
//       currentStudyTime,
//       previousNotesCount,
//       previousVideosCount,
//       previousStudyTime,
//       studyStreak,
//     ] = await Promise.all([
//       this._analyticsRepository.getUserStats(userId),
//       this._getNotesCount(userId, currentMonthStart, currentMonthEnd),
//       this._getVideosCount(userId, currentMonthStart, currentMonthEnd),
//       this._analyticsRepository.getTotalStudyTime(userId, currentMonthStart, currentMonthEnd),
//       this._getNotesCount(userId, previousMonthStart, previousMonthEnd),
//       this._getVideosCount(userId, previousMonthStart, previousMonthEnd),
//       this._analyticsRepository.getTotalStudyTime(userId, previousMonthStart, previousMonthEnd),
//       this._analyticsRepository.getOrCreateStudyStreak(userId),
//     ]);

//     // Calculate percentage changes
//     const notesChange = this._calculatePercentageChange(previousNotesCount, currentNotesCount);
//     const videosChange = this._calculatePercentageChange(previousVideosCount, currentVideosCount);
//     const studyTimeChange = this._calculatePercentageChange(previousStudyTime, currentStudyTime);
//     const streakChange = this._calculateStreakChange(studyStreak.currentStreak);

//     const metrics: IUserKeyMetrics = {
//       totalNotes: userStats?.totalNotes ?? 0,
//       totalVideos: userStats?.totalVideos ?? 0,
//       totalStudyTime: userStats?.totalStudyTime ?? 0,
//       currentStreak: studyStreak.currentStreak,
//       notesChange,
//       videosChange,
//       studyTimeChange,
//       streakChange,
//     };

//     // Cache for 5 minutes
//     await this._cacheService.set(cacheKey, metrics, 300);

//     return metrics;
//   }

//   /**
//    * Gets weekly activity data for charts.
//    *
//    * @param userId - The unique identifier of the user.
//    * @param weeks - Number of weeks to fetch (default: 1).
//    *
//    * @returns A promise that resolves to weekly activity data.
//    */
//   async getUserWeeklyActivity(userId: string, weeks: number = 1): Promise<IWeeklyActivityData[]> {
//     const cacheKey = `user-weekly-activity:${userId}:${weeks}`;

//     const cached = await this._cacheService.get<IWeeklyActivityData[]>(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(endDate.getDate() - (7 * weeks));

//     const activities = await this._analyticsRepository.getUserActivities(
//       userId,
//       startDate,
//       endDate,
//     );

//     const weeklyData = this._groupActivitiesByDay(activities, weeks);

//     // Cache for 10 minutes
//     await this._cacheService.set(cacheKey, weeklyData, 600);

//     return weeklyData;
//   }

//   /**
//    * Gets monthly progress data for charts.
//    *
//    * @param userId - The unique identifier of the user.
//    * @param months - Number of months to fetch (default: 6).
//    *
//    * @returns A promise that resolves to monthly progress data.
//    */
//   async getUserMonthlyProgress(userId: string, months: number = 6): Promise<IMonthlyProgressData[]> {
//     const cacheKey = `user-monthly-progress:${userId}:${months}`;

//     const cached = await this._cacheService.get<IMonthlyProgressData[]>(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setMonth(endDate.getMonth() - months);
//     startDate.setDate(1);

//     const activities = await this._analyticsRepository.getUserActivities(
//       userId,
//       startDate,
//       endDate,
//     );

//     const monthlyData = this._groupActivitiesByMonth(activities, months);

//     // Cache for 30 minutes
//     await this._cacheService.set(cacheKey, monthlyData, 1800);

//     return monthlyData;
//   }

//   /**
//    * Gets category distribution of user notes.
//    *
//    * @param userId - The unique identifier of the user.
//    *
//    * @returns A promise that resolves to category distribution data.
//    */
//   async getCategoryDistribution(userId: string): Promise<ICategoryData[]> {
//     const cacheKey = `user-category-distribution:${userId}`;

//     const cached = await this._cacheService.get<ICategoryData[]>(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     // Get notes grouped by category
//     const notes = await this._prismaService.client.note.findMany({
//       where: { userId },
//       select: { category: true },
//     });

//     const categoryData = this._processCategoryData(notes);

//     // Cache for 20 minutes
//     await this._cacheService.set(cacheKey, categoryData, 1200);

//     return categoryData;
//   }

//   /**
//    * Tracks a user activity and updates related statistics.
//    *
//    * @param userId - The unique identifier of the user.
//    * @param type - Type of activity performed.
//    * @param metadata - Additional data related to the activity.
//    * @param duration - Duration of the activity in minutes (optional).
//    *
//    * @returns A promise that resolves to the created activity.
//    */
//   async trackUserActivity(
//     userId: string,
//     type: ActivityType,
//     metadata?: any,
//     duration?: number,
//   ): Promise<UserActivity> {
//     return this._prismaService.client.$transaction(async (tx) => {
//       // Create the activity
//       const activity = await this._analyticsRepository.createActivity(
//         userId,
//         type,
//         metadata,
//         duration,
//         tx,
//       );

//       // Update user statistics
//       await this._updateUserStats(userId, type, duration, tx);

//       // Update study streak if it's a study-related activity
//       if (this._isStudyActivity(type)) {
//         await this.updateStudyStreak(userId);
//       }

//       // Clear related caches
//       await this._clearUserCaches(userId);

//       return activity;
//     });
//   }

//   /**
//    * Gets recent activities for the user.
//    *
//    * @param userId - The unique identifier of the user.
//    * @param limit - Maximum number of activities to return (default: 10).
//    *
//    * @returns A promise that resolves to recent activities data.
//    */
//   async getRecentActivities(userId: string, limit: number = 10): Promise<IRecentActivity[]> {
//     const cacheKey = `user-recent-activities:${userId}:${limit}`;

//     const cached = await this._cacheService.get<IRecentActivity[]>(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     const activities = await this._analyticsRepository.getRecentActivities(userId, limit);
//     const recentActivities = activities.map(this._formatRecentActivity);

//     // Cache for 2 minutes
//     await this._cacheService.set(cacheKey, recentActivities, 120);

//     return recentActivities;
//   }

//   /**
//    * Gets and updates user study streak.
//    *
//    * @param userId - The unique identifier of the user.
//    *
//    * @returns A promise that resolves to study streak data.
//    */
//   async getStudyStreakData(userId: string): Promise<IStudyStreakData> {
//     const cacheKey = `user-study-streak:${userId}`;

//     const cached = await this._cacheService.get<IStudyStreakData>(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     const studyStreak = await this._analyticsRepository.getOrCreateStudyStreak(userId);
//     const streakData = this._formatStudyStreakData(studyStreak);

//     // Cache for 10 minutes
//     await this._cacheService.set(cacheKey, streakData, 600);

//     return streakData;
//   }

//   /**
//    * Updates user study streak based on daily activity.
//    *
//    * @param userId - The unique identifier of the user.
//    *
//    * @returns A promise that resolves to the updated study streak.
//    */
//   async updateStudyStreak(userId: string) {
//     const today = new Date();
//     const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

//     // Check if user had any study activity today
//     const studyActivities = await this._analyticsRepository.getUserActivities(
//       userId,
//       todayStart,
//       todayEnd,
//       ["NOTE_CREATED", "NOTE_UPDATED", "VIDEO_WATCHED", "STUDY_SESSION_STARTED"],
//     );

//     const studyStreak = await this._analyticsRepository.getOrCreateStudyStreak(userId);
//     const hasStudiedToday = studyActivities.length > 0;

//     const updatedStreakData = this._calculateStreakData(studyStreak, hasStudiedToday);

//     return this._analyticsRepository.updateStudyStreak(userId, updatedStreakData);
//   }

//   // Private helper methods will be implemented in the next part...

//   private async _getNotesCount(userId: string, startDate: Date, endDate: Date): Promise<number> {
//     return this._prismaService.client.note.count({
//       where: {
//         userId,
//         createdAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//     });
//   }

//   private async _getVideosCount(userId: string, startDate: Date, endDate: Date): Promise<number> {
//     const activities = await this._analyticsRepository.getActivityCountByType(
//       userId,
//       startDate,
//       endDate,
//       "VIDEO_WATCHED",
//     );
//     return activities;
//   }

//   private _calculatePercentageChange(oldValue: number, newValue: number): string {
//     if (oldValue === 0) {
//       return newValue > 0 ? "+100%" : "0%";
//     }

//     const change = ((newValue - oldValue) / oldValue) * 100;
//     const sign = change >= 0 ? "+" : "";
//     return `${sign}${Math.round(change)}%`;
//   }

//   private _calculateStreakChange(currentStreak: number): string {
//     // For streak, we show if it's maintained (0%) or growing
//     return currentStreak > 0 ? "0%" : "0%";
//   }

//   private _isStudyActivity(type: ActivityType): boolean {
//     const studyTypes: ActivityType[] = [
//       "NOTE_CREATED",
//       "NOTE_UPDATED",
//       "VIDEO_WATCHED",
//       "STUDY_SESSION_STARTED",
//     ];
//     return studyTypes.includes(type);
//   }

//   private async _clearUserCaches(userId: string): Promise<void> {
//     const cacheKeys = [
//       `user-key-metrics:${userId}`,
//       `user-weekly-activity:${userId}:1`,
//       `user-monthly-progress:${userId}:6`,
//       `user-category-distribution:${userId}`,
//       `user-recent-activities:${userId}:10`,
//       `user-study-streak:${userId}`,
//     ];

//     await Promise.all(cacheKeys.map(key => this._cacheService.delete(key)));
//   }

//   // Additional helper methods to be implemented...
//   private _groupActivitiesByDay(activities: UserActivity[], weeks: number): IWeeklyActivityData[] {
//     // Implementation for grouping activities by day
//     const days: IWeeklyActivityData[] = [];
//     const endDate = new Date();

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(endDate.getDate() - i);

//       const dayActivities = activities.filter(activity =>
//         new Date(activity.createdAt).toDateString() === date.toDateString(),
//       );

//       days.push({
//         day: date.toLocaleDateString("en-US", { weekday: "short" }),
//         date: date.toISOString().split("T")[0],
//         notes: dayActivities.filter(a => a.type === "NOTE_CREATED").length,
//         videos: dayActivities.filter(a => a.type === "VIDEO_WATCHED").length,
//         time: dayActivities.reduce((sum, a) => sum + (a.duration || 0), 0),
//       });
//     }

//     return days;
//   }

//   private _groupActivitiesByMonth(activities: UserActivity[], months: number): IMonthlyProgressData[] {
//     // Implementation for grouping activities by month
//     const monthlyData: IMonthlyProgressData[] = [];
//     const endDate = new Date();

//     for (let i = months - 1; i >= 0; i--) {
//       const date = new Date();
//       date.setMonth(endDate.getMonth() - i);

//       const monthActivities = activities.filter((activity) => {
//         const activityDate = new Date(activity.createdAt);
//         return activityDate.getMonth() === date.getMonth()
//           && activityDate.getFullYear() === date.getFullYear();
//       });

//       monthlyData.push({
//         month: date.toLocaleDateString("en-US", { month: "short" }),
//         notes: monthActivities.filter(a => a.type === "NOTE_CREATED").length,
//         videos: monthActivities.filter(a => a.type === "VIDEO_WATCHED").length,
//         studyTime: monthActivities.reduce((sum, a) => sum + (a.duration || 0), 0),
//       });
//     }

//     return monthlyData;
//   }

//   private _processCategoryData(notes: { category: string | null }[]): ICategoryData[] {
//     const categoryCount: { [key: string]: number } = {};
//     const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316", "#EC4899"];

//     notes.forEach((note) => {
//       const category = note.category || "Uncategorized";
//       categoryCount[category] = (categoryCount[category] || 0) + 1;
//     });

//     return Object.entries(categoryCount).map(([name, value], index) => ({
//       name,
//       value,
//       color: colors[index % colors.length],
//     }));
//   }

//   private _formatRecentActivity(activity: UserActivity): IRecentActivity {
//     const activityFormatters = {
//       NOTE_CREATED: (metadata: any) => ({
//         title: `Added note to '${metadata?.videoTitle || "Unknown Video"}'`,
//         icon: "FileText",
//         color: "blue",
//       }),
//       NOTE_UPDATED: (metadata: any) => ({
//         title: `Updated note in '${metadata?.videoTitle || "Unknown Video"}'`,
//         icon: "FileText",
//         color: "blue",
//       }),
//       VIDEO_WATCHED: (metadata: any) => ({
//         title: `Watched '${metadata?.videoTitle || "Unknown Video"}'`,
//         icon: "Video",
//         color: "green",
//       }),
//       VIDEO_BOOKMARKED: (metadata: any) => ({
//         title: `Bookmarked '${metadata?.videoTitle || "Unknown Video"}'`,
//         icon: "Bookmark",
//         color: "purple",
//       }),
//       STUDY_SESSION_STARTED: () => ({
//         title: "Started a study session",
//         icon: "Play",
//         color: "green",
//       }),
//       STUDY_SESSION_ENDED: () => ({
//         title: "Completed a study session",
//         icon: "Square",
//         color: "red",
//       }),
//     };

//     const formatter = activityFormatters[activity.type];
//     const formatted = formatter
//       ? formatter(activity.metadata)
//       : {
//           title: `Performed ${activity.type.toLowerCase()}`,
//           icon: "Activity",
//           color: "gray",
//         };

//     return {
//       id: activity.id,
//       type: activity.type,
//       ...formatted,
//       time: this._formatTimeAgo(activity.createdAt),
//       metadata: activity.metadata,
//     };
//   }

//   private _formatTimeAgo(date: Date): string {
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (diffInSeconds < 60)
//       return "Just now";
//     if (diffInSeconds < 3600)
//       return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//     if (diffInSeconds < 86400)
//       return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     return `${Math.floor(diffInSeconds / 86400)} days ago`;
//   }

//   private _formatStudyStreakData(studyStreak: any): IStudyStreakData {
//     const streakData = Array.isArray(studyStreak.streakData)
//       ? studyStreak.streakData
//       : [];

//     return {
//       currentStreak: studyStreak.currentStreak,
//       longestStreak: studyStreak.longestStreak,
//       streakData: streakData.map((item: any, index: number) => ({
//         day: index + 1,
//         active: item.active || false,
//         date: item.date || new Date().toISOString().split("T")[0],
//       })),
//       lastActivityDate: studyStreak.lastActivityDate
//         ? studyStreak.lastActivityDate.toISOString()
//         : null,
//     };
//   }

//   private _calculateStreakData(studyStreak: any, hasStudiedToday: boolean): any {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     let currentStreak = studyStreak.currentStreak;

//     // If user studied today and last activity was not today, increment streak
//     if (hasStudiedToday) {
//       const lastActivity = studyStreak.lastActivityDate;
//       const isConsecutive = !lastActivity
//         || new Date(lastActivity).toDateString() === yesterday.toDateString();

//       if (isConsecutive) {
//         currentStreak += 1;
//       }
//     }

//     // Update longest streak if current exceeds it
//     const longestStreak = Math.max(studyStreak.longestStreak, currentStreak);

//     // Generate streak visualization data for last 14 days
//     const streakData = [];
//     for (let i = 13; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(today.getDate() - i);

//       streakData.push({
//         day: 14 - i,
//         active: i === 0 ? hasStudiedToday : Math.random() > 0.3, // Mock data for now
//         date: date.toISOString().split("T")[0],
//       });
//     }

//     return {
//       currentStreak,
//       longestStreak,
//       lastActivityDate: hasStudiedToday ? today : studyStreak.lastActivityDate,
//       streakData,
//     };
//   }

//   private async _updateUserStats(
//     userId: string,
//     type: ActivityType,
//     duration?: number,
//     tx?: any,
//   ): Promise<void> {
//     const updates: any = {};

//     switch (type) {
//       case "NOTE_CREATED":
//         updates.totalNotes = { increment: 1 };
//         break;
//       case "VIDEO_WATCHED":
//         updates.totalVideos = { increment: 1 };
//         break;
//       case "STUDY_SESSION_ENDED":
//         if (duration) {
//           updates.totalStudyTime = { increment: duration };
//         }
//         break;
//     }

//     if (Object.keys(updates).length > 0) {
//       await this._analyticsRepository.upsertUserStats(userId, updates, tx);
//     }
//   }
// }
