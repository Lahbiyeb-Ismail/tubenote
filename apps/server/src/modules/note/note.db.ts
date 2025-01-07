import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "../../utils/handleAsyncOperation";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { CreateNoteDto } from "./dtos/create-note.dto";
import type { DeleteNoteDto } from "./dtos/delete-note.dto";
import type { FindNoteDto } from "./dtos/find-note.dto";
import type { UpdateNoteDto } from "./dtos/update-note.dto";
import type { NoteEntry } from "./note.type";

export interface INoteDatabase {
  find(findNoteDto: FindNoteDto): Promise<NoteEntry | null>;
  create(userId: string, createNoteDto: CreateNoteDto): Promise<NoteEntry>;
  update(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<NoteEntry>;
  delete(deleteNoteDto: DeleteNoteDto): Promise<void>;
  findMany(findManyDto: FindManyDto): Promise<NoteEntry[]>;
  findManyByVideoId(id: string, findManyDto: FindManyDto): Promise<NoteEntry[]>;
  count(userId: string): Promise<number>;
}

export class NoteDatabase implements INoteDatabase {
  private database: PrismaClient;

  constructor(database: PrismaClient) {
    this.database = database;
  }

  async find(findNoteDto: FindNoteDto): Promise<NoteEntry | null> {
    return handleAsyncOperation(
      () =>
        this.database.note.findUnique({
          where: {
            ...findNoteDto,
          },
        }),
      { errorMessage: "Failed to find note." }
    );
  }

  async create(
    userId: string,
    createNoteDto: CreateNoteDto
  ): Promise<NoteEntry> {
    return handleAsyncOperation(
      () =>
        this.database.note.create({
          data: { userId, ...createNoteDto },
        }),
      { errorMessage: "Failed to create note." }
    );
  }

  async update(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<NoteEntry> {
    return handleAsyncOperation(
      () =>
        this.database.note.update({
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
        this.database.note.delete({
          where: { ...deleteNoteDto },
        }),
      { errorMessage: "Failed to delete note." }
    );
  }

  async findMany(findManyDto: FindManyDto): Promise<NoteEntry[]> {
    const { userId, limit, sort, skip = 0 } = findManyDto;

    return handleAsyncOperation(
      () =>
        this.database.note.findMany({
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
  ): Promise<NoteEntry[]> {
    const { userId, limit, sort, skip = 0 } = findManyDto;

    return handleAsyncOperation(
      () =>
        this.database.note.findMany({
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
        this.database.note.count({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to count notes." }
    );
  }
}
