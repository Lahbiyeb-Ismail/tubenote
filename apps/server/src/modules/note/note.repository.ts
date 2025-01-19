import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "@/utils/handle-async-operation";

import type { Note } from "./note.model";
import type { INoteRepository } from "./note.types";

import type { FindManyDto } from "@common/dtos/find-many.dto";

import type { CreateNoteDto } from "./dtos/create-note.dto";
import type { DeleteNoteDto } from "./dtos/delete-note.dto";
import type { FindNoteDto } from "./dtos/find-note.dto";
import type { UpdateNoteDto } from "./dtos/update-note.dto";

export class NoteRepository implements INoteRepository {
  constructor(private readonly _db: PrismaClient) {}

  async find(findNoteDto: FindNoteDto): Promise<Note | null> {
    return handleAsyncOperation(
      () =>
        this._db.note.findUnique({
          where: {
            ...findNoteDto,
          },
        }),
      { errorMessage: "Failed to find note." }
    );
  }

  async create(userId: string, createNoteDto: CreateNoteDto): Promise<Note> {
    return handleAsyncOperation(
      () =>
        this._db.note.create({
          data: { userId, ...createNoteDto },
        }),
      { errorMessage: "Failed to create note." }
    );
  }

  async update(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<Note> {
    return handleAsyncOperation(
      () =>
        this._db.note.update({
          where: {
            ...findNoteDto,
          },
          data: { ...updateNoteDto },
        }),
      { errorMessage: "Failed to update note." }
    );
  }

  async delete(deleteNoteDto: DeleteNoteDto): Promise<void> {
    handleAsyncOperation(
      () =>
        this._db.note.delete({
          where: { ...deleteNoteDto },
        }),
      { errorMessage: "Failed to delete note." }
    );
  }

  async findMany(findManyDto: FindManyDto): Promise<Note[]> {
    const { userId, limit, sort, skip = 0 } = findManyDto;

    return handleAsyncOperation(
      () =>
        this._db.note.findMany({
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

  async findManyByVideoId(
    id: string,
    findManyDto: FindManyDto
  ): Promise<Note[]> {
    const { userId, limit, sort, skip = 0 } = findManyDto;

    return handleAsyncOperation(
      () =>
        this._db.note.findMany({
          where: {
            userId,
            youtubeId: id,
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
        this._db.note.count({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to count notes." }
    );
  }
}
