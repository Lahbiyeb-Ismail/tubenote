import { Router } from 'express';

import { getVideoData } from '../controllers/videoControllers';

const router = Router();

/**
 * GET /videos/:video_id
 * Retrieves a specific video data by its ID.
 *
 * @route GET /videos/:video_id
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void}
 */
router.route('/videos/:video_id').get(getVideoData);

export default router;
