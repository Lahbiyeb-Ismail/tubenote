import prismaClient from "@config/database.config";

import { responseFormatter } from "@modules/utils/response-formatter";
import { VideoController } from "./video.controller";
import { VideoRepository } from "./video.repository";
import { VideoService } from "./video.service";

const videoRepository = new VideoRepository(prismaClient);
const videoService = new VideoService(videoRepository);
const videoController = new VideoController(responseFormatter, videoService);

export { videoController, videoService };
