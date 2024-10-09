import { Router } from 'express';
import { getVideoData } from '../controllers/video.controller';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = Router();

router.route('/').post(isAuthenticated, getVideoData);

export default router;
