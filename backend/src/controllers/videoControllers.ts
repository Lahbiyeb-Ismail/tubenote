import { Request, Response } from 'express';
import prisma from '../lib/prismaDB';
import httpStatus from 'http-status';

import getYoutubeVideoData from '../utils/getYoutubeVideoData';

async function createVideo(videoId: string, res: Response) {
  try {
    const items = await getYoutubeVideoData(
      videoId,
      'snippet, statistics, player',
    );

    if (!items || items.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'No video found with the provided id.' });
    }

    const videoExsit = await prisma.video.findUnique({
      where: {
        videoUrlId: videoId,
      },
    });

    if (!videoExsit) {
      const { title, description, publishedAt, channelTitle, thumbnails } =
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
          videoUrlId: videoId,
          title: title ?? '',
          description: description ?? '',
          publishedAt: publishedAt ?? '',
          channelTitle: channelTitle ?? '',
          viewCount: viewCount ?? '',
          likeCount: likeCount ?? '',
          dislikeCount: dislikeCount ?? '',
          commentCount: commentCount ?? '',
          favoriteCount: favoriteCount ?? '',
          videoPlayer: videoPlayer ?? '',
          videoThumbnail: thumbnails?.high?.url ?? '',
        },
      });
    }
  } catch (error) {
    return res.json({ error });
  }
}

export async function getVideoData(req: Request, res: Response) {
  const videoId = req.params['video_id'] as string;
  try {
    const data = await createVideo(videoId, res);

    if (data?.statusCode === httpStatus.NOT_FOUND) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Video not found' });
    } else {
      const videoData = await prisma.video.findUnique({
        where: {
          videoUrlId: videoId,
        },
      });

      return res.json({
        videoData,
      });
    }
  } catch (error) {
    return res.json({ error });
  }
}
