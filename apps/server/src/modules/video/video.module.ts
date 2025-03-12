import { prismaService, responseFormatter } from "@/modules/shared/services";

import { VideoController } from "./video.controller";
import { VideoRepository } from "./video.repository";
import { VideoService } from "./video.service";

const videoRepository = new VideoRepository(prismaService);

const videoService = new VideoService(videoRepository, prismaService);

const videoController = new VideoController(responseFormatter, videoService);

export { videoController, videoService };
