import { NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { INoteRepository, INoteService, Note } from "@modules/note";

import type {
  ICreateDto,
  IDeleteDto,
  IFindAllDto,
  IFindUniqueDto,
  IPaginatedItems,
  IUpdateDto,
} from "@modules/shared";

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
  private async _findNoteOrFail(findNoteDto: IFindUniqueDto): Promise<Note> {
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
  async findNote(findNoteDto: IFindUniqueDto): Promise<Note> {
    return await this._findNoteOrFail(findNoteDto);
  }

  /**
   * Creates a new note.
   *
   * @param {CreateNoteDto} createNoteDto - Data transfer object containing the details of the note to create.
   * @returns {Promise<Note>} A promise that resolves to the newly created note.
   */
  async createNote(createNoteDto: ICreateDto<Note>): Promise<Note> {
    return await this._noteRepository.create(createNoteDto);
  }

  /**
   * Updates a note with the provided data.
   *
   * @param {IUpdateDto<Note>} updateNoteDto - The data transfer object containing the note update information.
   * @returns {Promise<Note>} - A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the note is not found.
   */
  async updateNote(updateNoteDto: IUpdateDto<Note>): Promise<Note> {
    return await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail({
        id: updateNoteDto.id,
        userId: updateNoteDto.userId,
      });

      return tx.update(updateNoteDto);
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
  async deleteNote(deleteNoteDto: IDeleteDto): Promise<Note> {
    return await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail(deleteNoteDto);

      return tx.delete(deleteNoteDto);
    });
  }

  /**
   * Fetches the notes for a user based on the provided criteria.
   *
   * @param {IFindAllDto} findManyDto - The data transfer object containing the criteria for finding notes.
   * @returns {Promise<IPaginatedItems<Note>>} A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   */
  async fetchUserNotes(
    findManyDto: IFindAllDto
  ): Promise<IPaginatedItems<Note>> {
    return await this._noteRepository.transaction(async (tx) => {
      const [items, totalItems] = await Promise.all([
        tx.findMany(findManyDto),
        tx.count(findManyDto.userId),
      ]);

      const totalPages = Math.ceil(totalItems / findManyDto.limit);

      return { items, totalItems, totalPages };
    });
  }

  /**
   * Retrieves recent notes for a user.
   *
   * @param {FindManyDto} findManyDto - Data transfer object containing user id, pagination, and sorting details.
   * @returns {Promise<Note[]>} A promise that resolves to an array of recent notes.
   */
  async fetchRecentNotes(findManyDto: IFindAllDto): Promise<Note[]> {
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
  async fetchRecentlyUpdatedNotes(findManyDto: IFindAllDto): Promise<Note[]> {
    return await this._noteRepository.findMany(findManyDto);
  }

  /**
   * Fetches notes associated with a specific video ID.
   *
   * @param dto - Data transfer object containing the video ID and pagination information.
   * @returns A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   *
   * @template IFindAllDto - Interface for the data transfer object that includes pagination and user information.
   * @template IPaginatedItems - Interface for the paginated items response.
   * @template Note - Type representing a note.
   */
  async fetchNotesByVideoId(
    dto: IFindAllDto & { videoId: string }
  ): Promise<IPaginatedItems<Note>> {
    return await this._noteRepository.transaction(async (tx) => {
      const [items, totalItems] = await Promise.all([
        tx.findManyByVideoId(dto),
        tx.count(dto.userId),
      ]);

      const totalPages = Math.ceil(totalItems / dto.limit);

      return { items, totalItems, totalPages };
    });
  }
}
