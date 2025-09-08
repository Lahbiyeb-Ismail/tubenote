import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import { DashboardService } from "./dashboard.service";

const dashboardService = new DashboardService();

/**
 * Controller class for handling dashboard-related HTTP requests.
 * Manages all dashboard analytics operations including metrics, charts, and activity data.
 * All methods require session data for user authentication and authorization.
 */
export class DashboardController {
  /**
   * Retrieves complete dashboard data in a single optimized request.
   * This endpoint aggregates all dashboard components for better performance.
   *
   * @param req - The typed request object containing session data
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with complete dashboard data
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getDashboardData(req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await dashboardService.getDashboardData(sessionData);
      res.status(data.statusCode).json(data);
    }
    catch (err: any) {
      res.status(err.status || 500).json(err);
    }
  }

  /**
   * Retrieves user key metrics for dashboard cards.
   * Returns totals for notes, videos, study time, and current streak with percentage changes.
   *
   * @param req - The typed request object containing session data
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with key metrics data
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getKeyMetrics(req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await dashboardService.getKeyMetrics(sessionData);
      res.status(data.statusCode).json(data);
    }
    catch (err: any) {
      res.status(err.status || 500).json(err);
    }
  }

  /**
   * Retrieves weekly activity data for dashboard charts.
   * Returns daily activity breakdown for the specified number of weeks.
   *
   * @param req - The typed request object containing session data and optional weeks query param
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with weekly activity data
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getWeeklyActivity(req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) {
    const sessionData = req.sessionData;
    const weeks = Number.parseInt(req.query.weeks as string) || 1;

    try {
      const data = await dashboardService.getWeeklyActivity(sessionData, weeks);
      res.status(data.statusCode).json(data);
    }
    catch (err: any) {
      res.status(err.status || 500).json(err);
    }
  }

  /**
   * Retrieves monthly progress data for dashboard charts.
   * Returns monthly progress breakdown for the specified number of months.
   *
   * @param req - The typed request object containing session data and optional months query param
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with monthly progress data
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getMonthlyProgress(req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) {
    const sessionData = req.sessionData;
    const months = Number.parseInt(req.query.months as string) || 6;

    try {
      const data = await dashboardService.getMonthlyProgress(sessionData, months);
      res.status(data.statusCode).json(data);
    }
    catch (err: any) {
      res.status(err.status || 500).json(err);
    }
  }

  /**
   * Retrieves recent user activities for dashboard display.
   * Returns the most recent user activities with specified limit.
   *
   * @param req - The typed request object containing session data and optional limit query param
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with recent activities data
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getRecentActivities(req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) {
    const sessionData = req.sessionData;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    try {
      const data = await dashboardService.getRecentActivities(sessionData, limit);
      res.status(data.statusCode).json(data);
    }
    catch (err: any) {
      res.status(err.status || 500).json(err);
    }
  }

  /**
   * Retrieves category distribution data for pie charts.
   * Returns how user notes are distributed across different categories.
   *
   * @param req - The typed request object containing session data
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with category distribution data
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getCategoryDistribution(req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await dashboardService.getCategoryDistribution(sessionData);
      res.status(data.statusCode).json(data);
    }
    catch (err: any) {
      res.status(err.status || 500).json(err);
    }
  }

  /**
   * Retrieves user study streak data for dashboard display.
   * Returns current streak, longest streak, and streak visualization data.
   *
   * @param req - The typed request object containing session data
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with study streak data
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getStudyStreak(req: TypedRequest<EmptyRecord, EmptyRecord>, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await dashboardService.getStudyStreak(sessionData);
      res.status(data.statusCode).json(data);
    }
    catch (err: any) {
      res.status(err.status || 500).json(err);
    }
  }
}
