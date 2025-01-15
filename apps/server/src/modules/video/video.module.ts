import prismaClient from "../../lib/prisma";
import { VideoController } from "./video.controller";
import { VideoRepository } from "./video.repository";
import { VideoService } from "./video.service";

const videoRepository = new VideoRepository(prismaClient);
const videoService = new VideoService(videoRepository);
const videoController = new VideoController(videoService);

export { videoController, videoService };
