import type { ICreateNoteDto, IPaginationQueryDto, IParamIdDto, ISearchAndPaginationQueryDto, IUpdateNoteDto } from "@tubenote/dtos";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import { NoteService } from "./note.service";

const noteService = new NoteService();

export class NoteController {
  async getNotesCountByYtVideoId(req: TypedRequest<EmptyRecord, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const ytVideoId = req.params.id;

    try {
      const data = await noteService.countByYtVideoId(sessionData, ytVideoId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getNotesByVideoId(req: TypedRequest<EmptyRecord, IParamIdDto, IPaginationQueryDto>, res: Response) {
    const sessionData = req.sessionData;
    const videoId = req.params.id;
    const queryOptions = req.query;

    try {
      const data = await noteService.findAllByVideoId(sessionData, videoId, queryOptions);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async createNote(req: TypedRequest<ICreateNoteDto, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const videoId = req.params.id;

    try {
      const data = await noteService.create(sessionData, req.body, videoId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async updateNote(req: TypedRequest<IUpdateNoteDto, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const noteId = req.params.id;

    try {
      const data = await noteService.update(sessionData, noteId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getNoteById(req: TypedRequest<EmptyRecord, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const noteId = req.params.id;

    try {
      const data = await noteService.findByNoteId(sessionData, noteId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async deleteNote(req: TypedRequest<EmptyRecord, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const noteId = req.params.id;

    try {
      const data = await noteService.delete(sessionData, noteId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  async getUserNotes(req: TypedRequest<EmptyRecord, EmptyRecord, ISearchAndPaginationQueryDto>, res: Response) {
    const sessionData = req.sessionData;
    const queryOptions = req.query;

    try {
      const data = await noteService.findAll(sessionData, queryOptions);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }
}
