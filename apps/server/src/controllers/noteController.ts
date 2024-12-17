import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "../types";
import type { NoteBody } from "../types/note.type";

import noteService from "../services/noteService";

class NoteController {
  async addNewNote(req: TypedRequest<NoteBody>, res: Response): Promise<void> {
    const userId = req.userId;

    const noteData = {
      ...req.body,
      userId,
    };

    const note = await noteService.addNewNote(noteData);

    res
      .status(httpStatus.CREATED)
      .json({ message: "Note created successfully.", note });
  }
}

export default new NoteController();
