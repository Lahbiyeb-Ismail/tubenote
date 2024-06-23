import dotenv from "dotenv";
import { Request, Response } from "express";

import prisma from "../lib/prismaDB";
import type {
  VideoPart,
  YouTubeAPIResponse,
  YouTubeVideoItem,
} from "../types/video";

dotenv.config();

const URL = "https://www.googleapis.com/youtube/v3/videos?id=";

async function getVideoData(
  video_id: string | undefined,
  part: VideoPart
): Promise<YouTubeVideoItem[] | undefined> {
  if (!video_id) {
    console.error("Video ID is undefined");
    return undefined;
  }

  try {
    const response = await fetch(
      `${URL}${video_id}&key=${process.env["YOUTUBE_API_KEY"]}&part=${part}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: YouTubeAPIResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching video description:", error);
    return undefined;
  }
}

async function createVideo(video_id: string, res: Response) {
  try {
    const items = await getVideoData(video_id, "snippet, statistics, player");

    if (!items || items.length === 0) {
      return res.status(404);
    }

    const videoExsit = await prisma.video.findUnique({
      where: {
        videoUrlId: video_id,
      },
    });

    if (!videoExsit) {
      const { title, description, publishedAt, channelTitle } =
        items[0]?.snippet || {};

      const {
        viewCount,
        likeCount,
        dislikeCount,
        commentCount,
        favoriteCount,
      } = items[0]?.statistics || {};

      const videoPlayer = items[0]?.player?.embedHtml;

      await prisma.video.create({
        data: {
          videoUrlId: video_id,
          title: title ?? "",
          description: description ?? "",
          publishedAt: publishedAt ?? "",
          channelTitle: channelTitle ?? "",
          viewCount: viewCount ?? "",
          likeCount: likeCount ?? "",
          dislikeCount: dislikeCount ?? "",
          commentCount: commentCount ?? "",
          favoriteCount: favoriteCount ?? "",
          videoPlayer: videoPlayer ?? "",
        },
      });
    }
  } catch (error) {
    return res.json({ error });
  }
}

export async function getVideoInfo(req: Request, res: Response) {
  const video_id = req.params["video_id"] as string;
  try {
    const data = await createVideo(video_id, res);

    if (data?.statusCode === 404) {
      return res.status(404).json({ message: "Video not found" });
    } else {
      const videoInfo = await prisma.video.findUnique({
        where: {
          videoUrlId: video_id,
        },
      });

      return res.json({
        videoInfo,
      });
    }
  } catch (error) {
    return res.json({ error });
  }
}
