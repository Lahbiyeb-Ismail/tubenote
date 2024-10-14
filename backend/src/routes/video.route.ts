import { Router } from 'express';
import { getUserVideos, getVideoData } from '../controllers/video.controller';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = Router();

router.route('/').post(isAuthenticated, getVideoData);

router.route('/').get(isAuthenticated, getUserVideos);

export default router;
