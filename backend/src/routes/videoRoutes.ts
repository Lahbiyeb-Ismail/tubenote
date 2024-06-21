import { Router } from "express";

const router = Router();

/**
 * GET /videos/:video_id
 * Retrieves a specific video by its ID.
 *
 * @route GET /videos/:video_id
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void}
 */
router
  .route("/videos/:video_id")
  .get((req, res) => res.send("GET /videos/:video_id"));

export default router;
