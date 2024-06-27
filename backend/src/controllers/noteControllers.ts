import { Request, Response } from 'express';

import prisma from '../lib/prismaDB';
import type { Note } from '../types/video';
import type { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  payload?: JwtPayload;
}

export async function getUserNotes(req: CustomRequest, res: Response) {
  const userId = req.params['user_id'] as string;

  try {
    const notes = await prisma.note.findMany({
      where: {
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
  const { userId, videoId, noteContent, videoThumbnail, videoTitle } =
    req.body as Note;

  try {
    const note = await prisma.note.create({
      data: {
        noteContent,
        videoThumbnail,
        videoTitle,
        videoId,
        userId,
      },
    });

    return res.json({ message: 'Note successfully Created.', note });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
