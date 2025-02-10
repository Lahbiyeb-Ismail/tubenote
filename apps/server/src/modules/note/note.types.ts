import type { Response } from "express";

import type { Note } from "./note.model";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { FindManyDto } from "@common/dtos/find-many.dto";
import type { IdParamDto } from "@common/dtos/id-param.dto";
import type { QueryPaginationDto } from "@common/dtos/query-pagination.dto";

import type {
  CreateNoteDto,
  DeleteNoteDto,
  FindNoteDto,
  UpdateNoteDto,
} from "@modules/note";

export interface UserNotes {
  notes: Note[];
  notesCount: number;
  totalPages: number;
}

export interface INoteRepository {
  transaction<T>(fn: (tx: INoteRepository) => Promise<T>): Promise<T>;
  find(findNoteDto: FindNoteDto): Promise<Note | null>;
  create(createNoteDto: CreateNoteDto): Promise<Note>;
  update(findNoteDto: FindNoteDto, updateNoteDto: UpdateNoteDto): Promise<Note>;
  delete(deleteNoteDto: DeleteNoteDto): Promise<void>;
  findMany(findManyDto: FindManyDto): Promise<Note[]>;
  findManyByVideoId(id: string, findManyDto: FindManyDto): Promise<Note[]>;
  count(userId: string): Promise<number>;
}

export interface INoteService {
  findNote(findNoteDto: FindNoteDto): Promise<Note>;
  createNote(userId: string, createNoteDto: CreateNoteDto): Promise<Note>;
  updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<Note>;
  deleteNote(deleteNoteDto: DeleteNoteDto): Promise<void>;
  fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes>;
  fetchRecentNotes(findManyDto: FindManyDto): Promise<Note[]>;
  fetchRecentlyUpdatedNotes(findManyDto: FindManyDto): Promise<Note[]>;
  fetchNotesByVideoId(id: string, findManyDto: FindManyDto): Promise<UserNotes>;
}

export interface INoteController {
  createNote(req: TypedRequest<CreateNoteDto>, res: Response): Promise<void>;
  updateNote(
    req: TypedRequest<UpdateNoteDto, IdParamDto>,
    res: Response
  ): Promise<void>;
  deleteNote(
    req: TypedRequest<EmptyRecord, IdParamDto>,
    res: Response
  ): Promise<void>;
  getNoteById(
    req: TypedRequest<EmptyRecord, IdParamDto>,
    res: Response
  ): Promise<void>;
  getUserNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
    res: Response
  ): Promise<void>;
  getUserRecentNotes(req: TypedRequest, res: Response): Promise<void>;
  getRecentlyUpatedNotes(req: TypedRequest, res: Response): Promise<void>;
  getNotesByVideoId(
    req: TypedRequest<EmptyRecord, IdParamDto, QueryPaginationDto>,
    res: Response
  ): Promise<void>;
}
