import type { Video } from "@prisma/client";
import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

export interface IFindMany {
  userId: string;
  limit: number;
  skip: number;
}

export interface IVideo extends Omit<Video, "userIds"> {}

class VideoDatabase {
  async findMany({ userId, limit, skip }: IFindMany): Promise<IVideo[]> {
    return handleAsyncOperation(
      async () => {
        const videos = await prismaClient.video.findMany({
          where: { users: { some: { id: userId } } },
          omit: { userIds: true },
          take: limit,
          skip,
        });

        return videos;
      },
      { errorMessage: "Failed to find user videos" }
    );
  }

  async count(userId: string): Promise<number> {
    return handleAsyncOperation(
      () =>
        prismaClient.video.count({
          where: {
            userIds: { has: userId },
          },
        }),
      { errorMessage: "Failed to count user videos." }
    );
  }
}

export default new VideoDatabase();
