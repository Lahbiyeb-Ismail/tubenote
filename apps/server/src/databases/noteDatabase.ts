import type { Note, Prisma } from "@prisma/client";

import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

interface IUserId {
  userId: string;
}
interface INoteId {
  noteId: string;
}

interface Pagination {
  limit: number;
  skip?: number;
}

export interface OrderByParam {
  orderBy?:
    | Prisma.NoteOrderByWithRelationInput
    | Prisma.NoteOrderByWithRelationInput[];
}
export interface IFindNote extends IUserId, INoteId {}

export interface IUpdateNote extends IUserId, INoteId {
  data: Prisma.NoteUpdateInput;
}

export interface IDeleteNote extends IUserId, INoteId {}

export interface IFindMany extends Pagination, OrderByParam {
  params: Prisma.NoteWhereInput;
}

class NoteDatabase {
  async find({ noteId, userId }: IFindNote): Promise<Note | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findFirst({
          where: {
            id: noteId,
            userId,
          },
        }),
      { errorMessage: "Failed to find note." }
    );
  }

  async create(noteData: Prisma.NoteCreateInput): Promise<Note> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.create({
          data: {
            ...noteData,
          },
        }),
      { errorMessage: "Failed to create note." }
    );
  }

  async update({ userId, noteId, data }: IUpdateNote): Promise<Note> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.update({
          where: {
            id: noteId,
            userId,
          },
          data,
        }),
      { errorMessage: "Failed to update note." }
    );
  }

  async delete({ userId, noteId }: IDeleteNote): Promise<void> {
    handleAsyncOperation(
      () =>
        prismaClient.note.delete({
          where: {
            id: noteId,
            userId,
          },
        }),
      { errorMessage: "Failed to delete note." }
    );
  }

  async findMany({
    params,
    limit,
    skip,
    orderBy = { createdAt: "desc" },
  }: IFindMany): Promise<Note[]> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findMany({
          where: {
            ...params,
          },
          take: limit,
          skip,
          orderBy,
        }),
      { errorMessage: "Failed to fetch user notes." }
    );
  }

  async count(param: Prisma.NoteWhereInput): Promise<number> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.count({
          where: {
            ...param,
          },
        }),
      { errorMessage: "Failed to count notes." }
    );
  }
}

export default new NoteDatabase();
