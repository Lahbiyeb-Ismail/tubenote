import type { Prisma, PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import handleAsyncOperation from "@/utils/handle-async-operation";

import type { FindManyDto } from "@common/dtos/find-many.dto";

import type {
  CreateNoteDto,
  DeleteNoteDto,
  FindNoteDto,
  INoteRepository,
  Note,
  UpdateNoteDto,
} from "@modules/note";

export class NoteRepository implements INoteRepository {
  constructor(private readonly _db: PrismaClient) {}

  async transaction<T>(fn: (tx: INoteRepository) => Promise<T>): Promise<T> {
    // Use Prisma's transaction system
    return this._db.$transaction(async (prismaTx: Prisma.TransactionClient) => {
      // Create a new repository instance with the transactional client
      const txRepository = new NoteRepository(prismaTx as PrismaClient);
      return await fn(txRepository);
    });
  }

  async find(findNoteDto: FindNoteDto): Promise<Note | null> {
    return handleAsyncOperation(
      () =>
        this._db.note.findUnique({
          where: {
            ...findNoteDto,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    return handleAsyncOperation(
      () =>
        this._db.note.create({
          data: { ...createNoteDto },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_UPDATE }
    );
  }

  async delete(deleteNoteDto: DeleteNoteDto): Promise<Note> {
    return handleAsyncOperation(
      () =>
        this._db.note.delete({
          where: { ...deleteNoteDto },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_DELETE }
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
