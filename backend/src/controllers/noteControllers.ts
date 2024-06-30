import { Request, Response } from 'express';

import prisma from '../lib/prismaDB';
import type { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import type { Note } from '@prisma/client';

interface CustomRequest extends Request {
  payload?: JwtPayload;
  note?: Note;
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
  const {
    userId,
    videoId,
    noteTitle,
    noteContent,
    videoThumbnail,
    videoTitle,
  }: Note = req.body;

  try {
    const note = await prisma.note.create({
      data: {
        noteTitle,
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

export async function updateVideoNote(req: CustomRequest, res: Response) {
  const noteId = req.params['note_id'] as string;
  const existsNote = req.note;

  const { noteTitle, noteContent } = req.body;

  try {
    const note = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        noteTitle: noteTitle || existsNote?.noteTitle,
        noteContent: noteContent || existsNote?.noteContent,
      },
    });

    return res.json({ message: 'Note successfully updated.', note });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
}
