import { Request, Response } from 'express';

import prisma from '../lib/prismaDB';
import type { Note } from '../types/video';
import type { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  payload?: JwtPayload;
}

export async function getVideoNotes(req: CustomRequest, res: Response) {
  const videoId = req.params['video_id'] as string;
  const userId = req.payload && req.payload['id'];

  try {
    const notes = await prisma.note.findMany({
      where: {
        videoId,
        userId,
      },
    });

    if (!notes || notes.length === 0)
      return res.status(404).json({ message: 'No notes found' });

    return res.json({ notes });
  } catch (error) {
    return res.json({ error });
  }
}

export async function createVideoNote(req: CustomRequest, res: Response) {
  const videoId = req.params['video_id'] as string;
  const userId = req.payload && req.payload['id'];

  const { title, content } = req.body as Note;
  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        videoId,
        userId,
      },
    });

    return res.json({ message: 'Note successfully Created.', note });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
