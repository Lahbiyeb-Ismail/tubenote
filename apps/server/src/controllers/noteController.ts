import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "../types";
import type { NoteBody, NoteIdParam } from "../types/note.type";

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

  async updateNote(
    req: TypedRequest<NoteBody, NoteIdParam>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { noteId } = req.params;
    const noteData = req.body;

    const updatedNote = await noteService.updateNote({
      userId,
      noteId,
      data: noteData,
    });

    res
      .status(httpStatus.OK)
      .json({ message: "Note updated successfully.", note: updatedNote });
  }

  async deleteNote(
    req: TypedRequest<EmptyRecord, NoteIdParam>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { noteId } = req.params;

    await noteService.deleteNote({ userId, noteId });

    res.status(httpStatus.OK).json({ message: "Note deleted successfully." });
  }

  async getNoteById(
    req: TypedRequest<EmptyRecord, NoteIdParam>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { noteId } = req.params;

    const note = await noteService.findNote({ userId, noteId });

    res.status(httpStatus.OK).json({ note });
  }
}

export default new NoteController();
