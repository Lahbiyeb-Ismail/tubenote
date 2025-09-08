import type { Response } from "express";

import httpStatus from "http-status";
import { inject, injectable } from "inversify";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import { TYPES } from "@/config/inversify/types";

import type { IAnalyticsController, IAnalyticsService, IDashboardData } from "./analytics.types";

/**
 * Controller for handling analytics and dashboard-related operations.
 *
 * This controller provides endpoints for retrieving user analytics data,
 * including key metrics, activity charts, study streaks, and dashboard summaries.
 * All endpoints require user authentication.
 */
@injectable()
export class AnalyticsController implements IAnalyticsController {
  /**
   * Creates an instance of AnalyticsController.
   *
   * @param _analyticsService - An instance of the analytics service that handles business logic.
   * @param _responseFormatter - An instance of the response formatter service.
   */
  constructor(
    @inject(TYPES.AnalyticsService)
    private readonly _analyticsService: IAnalyticsService,
    @inject(TYPES.ResponseFormatter)
    private readonly _responseFormatter: IResponseFormatter,
  ) {}

  /**
   * Handles request to get user key metrics.
   *
   * @param req - The request object containing user information.
   * @param res - The response object used to send the HTTP status and result.
   *
   * @returns A promise that resolves to void.
   */
  async getUserKeyMetrics(
    req: TypedRequest<EmptyRecord, EmptyRecord>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this._responseFormatter.sendErrorResponse(
          res,
          httpStatus.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      const keyMetrics = await this._analyticsService.getUserKeyMetrics(userId);

      this._responseFormatter.sendSuccessResponse(
        res,
        httpStatus.OK,
        "User key metrics retrieved successfully",
        keyMetrics,
      );
    }
    catch (error) {
      this._responseFormatter.sendErrorResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve user key metrics",
        error,
      );
    }
  }

  /**
   * Handles request to get weekly activity data.
   *
   * @param req - The request object containing query parameters.
   * @param res - The response object used to send the HTTP status and result.
   *
   * @returns A promise that resolves to void.
   */
  async getUserWeeklyActivity(
    req: TypedRequest<EmptyRecord, EmptyRecord>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this._responseFormatter.sendErrorResponse(
          res,
          httpStatus.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      const weeks = Number.parseInt(req.query.weeks as string) || 1;
      const weeklyActivity = await this._analyticsService.getUserWeeklyActivity(userId, weeks);

      this._responseFormatter.sendSuccessResponse(
        res,
        httpStatus.OK,
        "Weekly activity data retrieved successfully",
        weeklyActivity,
      );
    }
    catch (error) {
      this._responseFormatter.sendErrorResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve weekly activity data",
        error,
      );
    }
  }

  /**
   * Handles request to get monthly progress data.
   *
   * @param req - The request object containing query parameters.
   * @param res - The response object used to send the HTTP status and result.
   *
   * @returns A promise that resolves to void.
   */
  async getUserMonthlyProgress(
    req: TypedRequest<EmptyRecord, EmptyRecord>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this._responseFormatter.sendErrorResponse(
          res,
          httpStatus.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      const months = Number.parseInt(req.query.months as string) || 6;
      const monthlyProgress = await this._analyticsService.getUserMonthlyProgress(userId, months);

      this._responseFormatter.sendSuccessResponse(
        res,
        httpStatus.OK,
        "Monthly progress data retrieved successfully",
        monthlyProgress,
      );
    }
    catch (error) {
      this._responseFormatter.sendErrorResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve monthly progress data",
        error,
      );
    }
  }

  /**
   * Handles request to get category distribution.
   *
   * @param req - The request object containing user information.
   * @param res - The response object used to send the HTTP status and result.
   *
   * @returns A promise that resolves to void.
   */
  async getCategoryDistribution(
    req: TypedRequest<EmptyRecord, EmptyRecord>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this._responseFormatter.sendErrorResponse(
          res,
          httpStatus.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      const categoryDistribution = await this._analyticsService.getCategoryDistribution(userId);

      this._responseFormatter.sendSuccessResponse(
        res,
        httpStatus.OK,
        "Category distribution retrieved successfully",
        categoryDistribution,
      );
    }
    catch (error) {
      this._responseFormatter.sendErrorResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve category distribution",
        error,
      );
    }
  }

  /**
   * Handles request to get recent activities.
   *
   * @param req - The request object containing query parameters.
   * @param res - The response object used to send the HTTP status and result.
   *
   * @returns A promise that resolves to void.
   */
  async getRecentActivities(
    req: TypedRequest<EmptyRecord, EmptyRecord>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this._responseFormatter.sendErrorResponse(
          res,
          httpStatus.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      const limit = Number.parseInt(req.query.limit as string) || 10;
      const recentActivities = await this._analyticsService.getRecentActivities(userId, limit);

      this._responseFormatter.sendSuccessResponse(
        res,
        httpStatus.OK,
        "Recent activities retrieved successfully",
        recentActivities,
      );
    }
    catch (error) {
      this._responseFormatter.sendErrorResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve recent activities",
        error,
      );
    }
  }

  /**
   * Handles request to get study streak data.
   *
   * @param req - The request object containing user information.
   * @param res - The response object used to send the HTTP status and result.
   *
   * @returns A promise that resolves to void.
   */
  async getStudyStreakData(
    req: TypedRequest<EmptyRecord, EmptyRecord>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this._responseFormatter.sendErrorResponse(
          res,
          httpStatus.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      const studyStreakData = await this._analyticsService.getStudyStreakData(userId);

      this._responseFormatter.sendSuccessResponse(
        res,
        httpStatus.OK,
        "Study streak data retrieved successfully",
        studyStreakData,
      );
    }
    catch (error) {
      this._responseFormatter.sendErrorResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve study streak data",
        error,
      );
    }
  }

  /**
   * Handles request to get complete dashboard data.
   * This endpoint aggregates all dashboard-related data in a single request
   * for better performance and reduced API calls.
   *
   * @param req - The request object containing user information.
   * @param res - The response object used to send the HTTP status and result.
   *
   * @returns A promise that resolves to void.
   */
  async getDashboardData(
    req: TypedRequest<EmptyRecord, EmptyRecord>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this._responseFormatter.sendErrorResponse(
          res,
          httpStatus.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      // Fetch all dashboard data in parallel for better performance
      const [
        keyMetrics,
        weeklyActivity,
        monthlyProgress,
        categoryDistribution,
        recentActivities,
        studyStreak,
      ] = await Promise.all([
        this._analyticsService.getUserKeyMetrics(userId),
        this._analyticsService.getUserWeeklyActivity(userId, 1),
        this._analyticsService.getUserMonthlyProgress(userId, 6),
        this._analyticsService.getCategoryDistribution(userId),
        this._analyticsService.getRecentActivities(userId, 10),
        this._analyticsService.getStudyStreakData(userId),
      ]);

      const dashboardData: IDashboardData = {
        keyMetrics,
        weeklyActivity,
        monthlyProgress,
        categoryDistribution,
        recentActivities,
        studyStreak,
      };

      this._responseFormatter.sendSuccessResponse(
        res,
        httpStatus.OK,
        "Dashboard data retrieved successfully",
        dashboardData,
      );
    }
    catch (error) {
      this._responseFormatter.sendErrorResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to retrieve dashboard data",
        error,
      );
    }
  }
}
