import type { Note } from "@prisma/client";

import prismaClient from "../lib/prisma";

import handleAsyncOperation from "../utils/handleAsyncOperation";

import type {
  ICreateNote,
  IFindNotes,
  INoteFilter,
  INoteFilterUnique,
  IUpdateNote,
} from "../types/note.type";

class NoteDatabase {
  async find({ where }: INoteFilterUnique): Promise<Note | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findUnique({
          where,
        }),
      { errorMessage: "Failed to find note." }
    );
  }

  async create({ data }: ICreateNote): Promise<Note> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.create({
          data,
        }),
      { errorMessage: "Failed to create note." }
    );
  }

  async update({ where, data }: IUpdateNote): Promise<Note> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.update({
          where,
          data,
        }),
      { errorMessage: "Failed to update note." }
    );
  }

  async delete({ where }: INoteFilterUnique): Promise<void> {
    handleAsyncOperation(
      () =>
        prismaClient.note.delete({
          where,
        }),
      { errorMessage: "Failed to delete note." }
    );
  }

  async findMany({
    where,
    limit,
    skip,
    orderBy = { createdAt: "desc" },
  }: IFindNotes): Promise<Note[]> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findMany({
          where,
          take: limit,
          skip,
          orderBy,
        }),
      { errorMessage: "Failed to fetch user notes." }
    );
  }

  async count({ where }: INoteFilter): Promise<number> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.count({
          where,
        }),
      { errorMessage: "Failed to count notes." }
    );
  }
}

export default new NoteDatabase();
