import { Request, Response } from "express";

import prisma from "../libs/prismaDB";

export async function getVideoNotes(req: Request, res: Response) {
  const video_id = req.params["video_id"] as string;

  try {
    const notes = await prisma.note.findMany({
      where: {
        videoId: video_id,
      },
    });

    if (!notes || notes.length === 0)
      return res.status(404).json({ message: "No notes found" });

    return res.json({ notes });
  } catch (error) {
    return res.json({ error });
  }
}
