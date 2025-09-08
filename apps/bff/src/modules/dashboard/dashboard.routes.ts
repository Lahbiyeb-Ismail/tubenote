import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";

import { DashboardController } from "./dashboard.controller";

/**
 * Dashboard routes module that defines all HTTP endpoints for dashboard analytics operations.
 * All routes require session validation middleware for authentication.
 *
 * @module DashboardRoutes
 *
 * Routes:
 * - GET / - Get complete dashboard data (aggregated endpoint for better performance)
 * - GET /key-metrics - Get user's key dashboard metrics
 * - GET /activity/weekly - Get weekly activity data for charts
 * - GET /activity/monthly - Get monthly progress data for charts
 * - GET /activity/recent - Get recent user activities
 * - GET /category-distribution - Get notes distribution by category
 * - GET /study-streak - Get user's study streak data
 *
 * @requires validateSessionMiddleware - Applied to all routes for authentication
 * @uses DashboardController - Controller instance handling business logic
 */
const dashboardRoutes: Router = Router();

const dashboardController = new DashboardController();

// Apply session validation middleware to all dashboard routes
dashboardRoutes.use(validateSessionMiddleware);

/**
 * GET / - Complete dashboard data endpoint
 * Returns all dashboard components in a single optimized API call.
 * This reduces the number of requests from the frontend and improves performance.
 */
dashboardRoutes
  .route("/")
  .get(dashboardController.getDashboardData);

/**
 * GET /key-metrics - User key metrics endpoint
 * Returns total notes, videos, study time, current streak with percentage changes.
 * Used for the key metrics cards on the dashboard.
 */
dashboardRoutes
  .route("/key-metrics")
  .get(dashboardController.getKeyMetrics);

/**
 * GET /activity/weekly - Weekly activity data endpoint
 * Returns daily activity breakdown for charts.
 * Query params: ?weeks=1 (number of weeks to fetch, default: 1)
 */
dashboardRoutes
  .route("/activity/weekly")
  .get(dashboardController.getWeeklyActivity);

/**
 * GET /activity/monthly - Monthly progress data endpoint
 * Returns monthly progress breakdown for area charts.
 * Query params: ?months=6 (number of months to fetch, default: 6)
 */
dashboardRoutes
  .route("/activity/monthly")
  .get(dashboardController.getMonthlyProgress);

/**
 * GET /activity/recent - Recent activities endpoint
 * Returns the most recent user activities for the activity feed.
 * Query params: ?limit=10 (maximum number of activities, default: 10)
 */
dashboardRoutes
  .route("/activity/recent")
  .get(dashboardController.getRecentActivities);

/**
 * GET /category-distribution - Category distribution endpoint
 * Returns pie chart data showing how notes are distributed across categories.
 * Used for the category breakdown chart on the dashboard.
 */
dashboardRoutes
  .route("/category-distribution")
  .get(dashboardController.getCategoryDistribution);

/**
 * GET /study-streak - Study streak data endpoint
 * Returns current streak, longest streak, and streak visualization data.
 * Used for the study streak component and streak calendar visualization.
 */
dashboardRoutes
  .route("/study-streak")
  .get(dashboardController.getStudyStreak);

export { dashboardRoutes };
