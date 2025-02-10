import { NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type {
  CreateNoteDto,
  DeleteNoteDto,
  FindNoteDto,
  FindNotesByVideoIdDto,
  INoteRepository,
  INoteService,
  Note,
  UpdateNoteDto,
  UserNotes,
} from "@modules/note";

import type { FindManyDto } from "@common/dtos/find-many.dto";

/**
 * Service class for handling business logic related to Notes.
 *
 * Provides methods to create, read, update, delete, and fetch notes with various filtering and pagination
 * options. It utilizes the NoteRepository to interact with the underlying data source and encapsulates
 * additional logic such as error handling and transaction management.
 */
export class NoteService implements INoteService {
  /**
   * Creates an instance of NoteService.
   *
   * @param _noteRepository - An instance of the note repository to delegate data operations.
   */
  constructor(private readonly _noteRepository: INoteRepository) {}

  /**
   * Finds a note by the provided criteria or throws an error if not found.
   *
   * @private
   * @param {FindNoteDto} findNoteDto - Data transfer object containing note identification details.
   * @returns {Promise<Note>} A promise that resolves to the found note.
   * @throws {NotFoundError} If no note is found matching the criteria.
   */
  private async _findNoteOrFail(findNoteDto: FindNoteDto): Promise<Note> {
    const note = await this._noteRepository.find(findNoteDto);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  /**
   * Retrieves a note based on the given criteria.
   *
   * @param {FindNoteDto} findNoteDto - Data transfer object containing note identification details.
   * @returns {Promise<Note>} A promise that resolves to the found note.
   * @throws {NotFoundError} If no note is found matching the criteria.
   */
  async findNote(findNoteDto: FindNoteDto): Promise<Note> {
    return await this._findNoteOrFail(findNoteDto);
  }

  /**
   * Creates a new note.
   *
   * @param {CreateNoteDto} createNoteDto - Data transfer object containing the details of the note to create.
   * @returns {Promise<Note>} A promise that resolves to the newly created note.
   */
  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    return await this._noteRepository.create(createNoteDto);
  }

  /**
   * Updates an existing note.
   *
   * Executes the update within a transaction. It first ensures that the note exists; otherwise, it throws a
   * NotFoundError.
   *
   * @param {FindNoteDto} findNoteDto - Data transfer object containing note identification details.
   * @param {UpdateNoteDto} updateNoteDto - Data transfer object containing the updated note data.
   * @returns {Promise<Note>} A promise that resolves to the updated note.
   * @throws {NotFoundError} If the note is not found.
   */
  async updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<Note> {
    return await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail(findNoteDto);

      return tx.update(findNoteDto, updateNoteDto);
    });
  }

  /**
   * Deletes an existing note.
   *
   * Executes the delete operation within a transaction. It first verifies the note's existence and then proceeds
   * with the deletion.
   *
   * @param {DeleteNoteDto} deleteNoteDto - Data transfer object containing note identification details.
   * @returns {Promise<Note>} A promise that resolves to the deleted note.
   * @throws {NotFoundError} If the note is not found.
   */
  async deleteNote(deleteNoteDto: DeleteNoteDto): Promise<Note> {
    return await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail(deleteNoteDto);

      return tx.delete(deleteNoteDto);
    });
  }

  /**
   * Fetches a paginated list of notes for a user.
   *
   * Executes the operation within a transaction. It retrieves the notes, counts the total number, and calculates
   * the total number of pages based on the provided limit.
   *
   * @param {FindManyDto} findManyDto - Data transfer object containing user id, pagination, and sorting details.
   * @returns {Promise<UserNotes>} A promise that resolves to an object containing the notes, total count, and total pages.
   */
  async fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes> {
    return await this._noteRepository.transaction(async (tx) => {
      const notes = await tx.findMany(findManyDto);

      const notesCount = await tx.count(findManyDto.userId);

      const totalPages = Math.ceil(notesCount / findManyDto.limit);

      return { notes, notesCount, totalPages };
    });
  }

  /**
   * Retrieves recent notes for a user.
   *
   * @param {FindManyDto} findManyDto - Data transfer object containing user id, pagination, and sorting details.
   * @returns {Promise<Note[]>} A promise that resolves to an array of recent notes.
   */
  async fetchRecentNotes(findManyDto: FindManyDto): Promise<Note[]> {
    return await this._noteRepository.findMany(findManyDto);
  }

  /**
   * Retrieves recently updated notes for a user.
   *
   * Note: This method currently uses the same repository method as fetchRecentNotes.
   *
   * @param {FindManyDto} findManyDto - Data transfer object containing user id, pagination, and sorting details.
   * @returns {Promise<Note[]>} A promise that resolves to an array of recently updated notes.
   */
  async fetchRecentlyUpdatedNotes(findManyDto: FindManyDto): Promise<Note[]> {
    return await this._noteRepository.findMany(findManyDto);
  }

  /**
   * Fetches notes for a specific video for a user with pagination.
   *
   * Executes the operation within a transaction. It concurrently fetches the notes and counts them, then calculates
   * the total number of pages based on the provided limit.
   *
   * @param {FindNotesByVideoIdDto} dto - Data transfer object containing video id, user id, pagination, and sorting details.
   * @returns {Promise<UserNotes>} A promise that resolves to an object containing the notes, total count, and total pages.
   */
  async fetchNotesByVideoId(dto: FindNotesByVideoIdDto): Promise<UserNotes> {
    return await this._noteRepository.transaction(async (tx) => {
      const [notes, notesCount] = await Promise.all([
        tx.findManyByVideoId(dto),
        tx.count(dto.userId),
      ]);

      const totalPages = Math.ceil(notesCount / dto.limit);

      return { notes, notesCount, totalPages };
    });
  }
}
