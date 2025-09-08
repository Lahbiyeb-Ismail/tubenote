import { Router } from "express";

import { isAuthenticated } from "@/middlewares";

import { analyticsController } from "./analytics.module";

const analyticsRoutes: Router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any analytics routes.
analyticsRoutes.use(isAuthenticated);

/**
 * Analytics routes module that defines all HTTP endpoints for analytics and dashboard operations.
 * All routes require authentication middleware.
 *
 * @module AnalyticsRoutes
 *
 * Routes:
 * - GET /dashboard - Get complete dashboard data (aggregated endpoint for better performance)
 * - GET /key-metrics - Get user's key dashboard metrics (total notes, videos, study time, streak)
 * - GET /activity/weekly - Get weekly activity data for charts
 * - GET /activity/monthly - Get monthly progress data for charts
 * - GET /activity/recent - Get recent user activities
 * - GET /category-distribution - Get notes distribution by category
 * - GET /study-streak - Get user's study streak data
 *
 * @requires isAuthenticated - Applied to all routes for user authentication
 * @uses AnalyticsController - Controller instance handling business logic
 */

// - GET /dashboard: Get complete dashboard data in a single optimized request
// This endpoint aggregates all dashboard-related data for better performance
analyticsRoutes
  .route("/dashboard")
  .get((req, res) => analyticsController.getDashboardData(req as any, res));

// - GET /key-metrics: Get user's key dashboard metrics
// Returns: total notes, videos, study time, current streak with percentage changes
analyticsRoutes
  .route("/key-metrics")
  .get((req, res) => analyticsController.getUserKeyMetrics(req as any, res));

// - GET /activity/weekly: Get weekly activity data for charts
// Query params: ?weeks=1 (number of weeks to fetch, default: 1)
analyticsRoutes
  .route("/activity/weekly")
  .get((req, res) => analyticsController.getUserWeeklyActivity(req as any, res));

// - GET /activity/monthly: Get monthly progress data for charts
// Query params: ?months=6 (number of months to fetch, default: 6)
analyticsRoutes
  .route("/activity/monthly")
  .get((req, res) => analyticsController.getUserMonthlyProgress(req as any, res));

// - GET /activity/recent: Get recent user activities
// Query params: ?limit=10 (maximum number of activities, default: 10)
analyticsRoutes
  .route("/activity/recent")
  .get((req, res) => analyticsController.getRecentActivities(req as any, res));

// - GET /category-distribution: Get notes distribution by category
// Returns: pie chart data showing how notes are distributed across categories
analyticsRoutes
  .route("/category-distribution")
  .get((req, res) => analyticsController.getCategoryDistribution(req as any, res));

// - GET /study-streak: Get user's study streak data
// Returns: current streak, longest streak, streak visualization data
analyticsRoutes
  .route("/study-streak")
  .get((req, res) => analyticsController.getStudyStreakData(req as any, res));

export { analyticsRoutes };
