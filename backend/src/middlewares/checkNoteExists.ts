import type { NextFunction, Request, Response } from 'express';

import prisma from '../lib/prismaDB';
import httpStatus from 'http-status';
import type { Note } from '@prisma/client';

interface CustomRequest extends Request {
  note?: Note;
}

async function checkNoteExists(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const noteId = req.params['note_id'] as string;

  const noteExists = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });

  if (!noteExists) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: 'No note found with the provided ID.',
    });
  } else {
    req.note = noteExists;

    next();
  }
}

export default checkNoteExists;
