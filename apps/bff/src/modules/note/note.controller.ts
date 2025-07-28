import type { Request, Response } from "express";

import { NoteService } from "./note.service";

const noteService = new NoteService();

export class NoteController {
  async getNotesCountByYtVideoId(req: Request, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await noteService.countByYtVideoId(sessionData, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getNotesByVideoId(req: Request, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await noteService.findAllByVideoId(sessionData, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async createNote(req: Request, res: Response) {
    const sessionData = req.sessionData;
    const videoId = req.params.id;

    try {
      const data = await noteService.create(sessionData, req.body, videoId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async updateNote(req: Request, res: Response) {
    const sessionData = req.sessionData;
    const noteId = req.params.id;

    try {
      const data = await noteService.update(sessionData, noteId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getNoteById(req: Request, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await noteService.findByNoteId(sessionData, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async deleteNote(req: Request, res: Response) {
    const sessionData = req.sessionData;

    try {
      const data = await noteService.delete(sessionData, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getUserNotes(req: Request, res: Response) {
    const sessionData = req.sessionData;
    const queryOptions = req.query as any;

    try {
      const data = await noteService.findAll(sessionData, queryOptions);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }
}
