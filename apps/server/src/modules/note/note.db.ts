import prismaClient from "../../lib/prisma";

import handleAsyncOperation from "../../utils/handleAsyncOperation";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { CreateNoteDto } from "./dtos/create-note.dto";
import type { DeleteNoteDto } from "./dtos/delete-note.dto";
import type { FindNoteDto } from "./dtos/find-note.dto";
import type { UpdateNoteDto } from "./dtos/update-note.dto";
import type { NoteEntry } from "./note.type";

class NoteDatabase {
  async find(findNoteDto: FindNoteDto): Promise<NoteEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findUnique({
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
        prismaClient.note.create({
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
        prismaClient.note.update({
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
        prismaClient.note.delete({
          where: { ...deleteNoteDto },
        }),
      { errorMessage: "Failed to delete note." }
    );
  }

  async findMany(findManyDto: FindManyDto): Promise<NoteEntry[]> {
    const { userId, limit, sort, skip = 0 } = findManyDto;

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

  async findManyByVideoId(
    id: string,
    findManyDto: FindManyDto
  ): Promise<NoteEntry[]> {
    const { userId, limit, sort, skip = 0 } = findManyDto;

    return handleAsyncOperation(
      () =>
        prismaClient.note.findMany({
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
