import type { Request, Response } from "express";

import { NoteService } from "./note.service";

const noteService = new NoteService();

export class NoteController {
  async getNotesCountByYtVideoId(req: Request, res: Response) {
    const sessionId = req.sessionId;

    try {
      const data = await noteService.countByYtVideoId(sessionId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getNotesByVideoId(req: Request, res: Response) {
    const sessionId = req.sessionId;

    try {
      const data = await noteService.findAllByVideoId(sessionId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async createNote(req: Request, res: Response) {
    const sessionId = req.sessionId;
    const videoId = req.params.id;

    try {
      const data = await noteService.create(sessionId, req.body, videoId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async updateNote(req: Request, res: Response) {
    const sessionId = req.sessionId;
    const noteId = req.params.id;

    try {
      const data = await noteService.update(sessionId, noteId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getNoteById(req: Request, res: Response) {
    const sessionId = req.sessionId;

    try {
      const data = await noteService.findByNoteId(sessionId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async deleteNote(req: Request, res: Response) {
    const sessionId = req.sessionId;

    try {
      const data = await noteService.delete(sessionId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getUserNotes(req: Request, res: Response) {
    const sessionId = req.sessionId;
    const queryOptions = req.query as any;

    try {
      const data = await noteService.findAll(sessionId, queryOptions);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }
}
