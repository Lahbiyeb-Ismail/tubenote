import { Request, Response } from 'express';

import prisma from '../lib/prismaDB';
import type { Note } from '../types/video';

export async function getVideoNotes(req: Request, res: Response) {
  const video_id = req.params['video_id'] as string;

  try {
    const notes = await prisma.note.findMany({
      where: {
        videoId: video_id,
      },
    });

    if (!notes || notes.length === 0)
      return res.status(404).json({ message: 'No notes found' });

    return res.json({ notes });
  } catch (error) {
    return res.json({ error });
  }
}

export async function createVideoNote(req: Request, res: Response) {
  try {
    const { title, content, videoId } = req.body as Note;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        videoId,
      },
    });

    return res.json({ message: 'Note successfully Created.', note });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
