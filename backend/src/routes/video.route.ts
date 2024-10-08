import { Router } from 'express';
import { getVideoData } from '..//controllers/video.controller';

const router = Router();

router.route('/').get(getVideoData);

export default router;
