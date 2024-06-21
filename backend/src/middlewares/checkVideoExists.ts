import type { NextFunction, Request, Response } from "express";

import prisma from "../lib/prismaDB";

async function checkVideoExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const video_id = req.params["video_id"] as string;

  const videoExists = await prisma.video.findUnique({
    where: {
      videoUrlId: video_id,
    },
  });

  if (!videoExists) {
    return res.status(404).json({
      message: `Video with ${video_id} id not found.`,
    });
  }

  next();
}

export default checkVideoExists;
