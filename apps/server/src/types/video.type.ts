import type {
  createVideoBodySchema,
  videoIdParamSchema,
} from "../schemas/video.schema";

export type CreateVideoBody = typeof createVideoBodySchema;

export type VideoIdParam = typeof videoIdParamSchema;
