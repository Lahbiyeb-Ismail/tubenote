import prismaClient from "../../lib/prisma";

import handleAsyncOperation from "../../utils/handleAsyncOperation";

import type { FindManyParams } from "../../types/shared.types";
import type {
  CreateNoteData,
  DeleteNoteParams,
  FindNoteParams,
  NoteEntry,
  UpdateNoteParams,
} from "./note.type";

class NoteDatabase {
  async find({ userId, noteId }: FindNoteParams): Promise<NoteEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findUnique({
          where: {
            id: noteId,
            userId,
          },
        }),
      { errorMessage: "Failed to find note." }
    );
  }

  async create(data: CreateNoteData): Promise<NoteEntry> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.create({
          data,
        }),
      { errorMessage: "Failed to create note." }
    );
  }

  async update({ userId, noteId, data }: UpdateNoteParams): Promise<NoteEntry> {
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

  async delete({ userId, noteId }: DeleteNoteParams): Promise<void> {
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
    userId,
    limit,
    skip,
    sort,
  }: FindManyParams): Promise<NoteEntry[]> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findMany({
          where: {
            userId,
          },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
        }),
      { errorMessage: "Failed to fetch user notes." }
    );
  }

  async findManyByVideoId({
    userId,
    videoId,
    limit,
    skip,
    sort,
  }: FindManyParams & { videoId: string }): Promise<NoteEntry[]> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findMany({
          where: {
            userId,
            youtubeId: videoId,
          },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
        }),
      { errorMessage: "Failed to fetch user notes." }
    );
  }

  async count(userId: string): Promise<number> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.count({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to count notes." }
    );
  }
}

export default new NoteDatabase();
