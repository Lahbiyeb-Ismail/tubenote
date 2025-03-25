import { prismaService, responseFormatter } from "@/modules/shared/services";

import { VideoController } from "./video.controller";
import { VideoRepository } from "./video.repository";
import { VideoService } from "./video.service";

const videoRepository = VideoRepository.getInstance({ db: prismaService });

const videoService = VideoService.getInstance({
  videoRepository,
  prismaService,
});

const videoController = VideoController.getInstance({
  responseFormatter,
  videoService,
});

export { videoController, videoService };
