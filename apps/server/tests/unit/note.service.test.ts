import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { NotFoundError } from "../../src/errors";
import NoteDB from "../../src/modules/note/note.db";
import NoteService from "../../src/modules/note/note.service";

import type { FindManyDto } from "../../src/common/dtos/find-many.dto";
import type { CreateNoteDto } from "../../src/modules/note/dtos/create-note.dto";
import type { DeleteNoteDto } from "../../src/modules/note/dtos/delete-note.dto";
import type { FindNoteDto } from "../../src/modules/note/dtos/find-note.dto";
import type { UpdateNoteDto } from "../../src/modules/note/dtos/update-note.dto";
import type { NoteEntry } from "../../src/modules/note/note.type";

jest.mock("../../src/modules/note/note.db");

describe("NoteService tests", () => {
  const mockUserId = "user123";
  const mockNoteId = "note123";

  const mockNote: NoteEntry = {
    id: mockNoteId,
    userId: mockUserId,
    title: "Sample Note",
    content: "This is a sample note.",
    videoId: "video123",
    thumbnail: "thumbnail123",
    videoTitle: "Sample Video",
    timestamp: 123,
    youtubeId: "youtube123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotes = [
    {
      id: "note1",
      userId: mockUserId,
      title: "Note 1",
      content: "Content 1",
      videoId: "video123",
      thumbnail: "thumbnail1",
      videoTitle: "Video 1",
      timestamp: 123,
      youtubeId: "youtube1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "note2",
      userId: mockUserId,
      title: "Note 2",
      content: "Content 2",
      videoId: "video123",
      thumbnail: "thumbnail1",
      videoTitle: "Video 1",
      timestamp: 456,
      youtubeId: "youtube1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const findNoteDto: FindNoteDto = {
    id: mockNoteId,
    userId: mockUserId,
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("findNote method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the note if found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(mockNote);

      const result = await NoteService.findNote(findNoteDto);

      expect(result).toBe(mockNote);
      expect(NoteDB.find).toHaveBeenCalledWith(findNoteDto);
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(NoteService.findNote(findNoteDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(NoteDB.find).toHaveBeenCalledWith(findNoteDto);
    });
  });

  describe("createNote method tests", () => {
    const createNoteDto: CreateNoteDto = {
      title: "New Note",
      content: "This is a new note.",
      videoId: "video123",
      thumbnail: "thumbnail123",
      videoTitle: "New Video",
      timestamp: 123,
      youtubeId: "youtube123",
    };

    const mockNewNote: NoteEntry = {
      ...createNoteDto,
      id: "newNote123",
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create and return the new note", async () => {
      (NoteDB.create as jest.Mock).mockResolvedValue(mockNewNote);

      const result = await NoteService.createNote(mockUserId, createNoteDto);

      expect(result).toBe(mockNewNote);
      expect(NoteDB.create).toHaveBeenCalledWith(mockUserId, createNoteDto);
    });
  });

  describe("updateNote method tests", () => {
    const updateNoteDto: UpdateNoteDto = {
      title: "Updated Note",
      content: "This is an updated note.",
    };

    const mockUpdatedNote: NoteEntry = {
      ...mockNote,
      ...updateNoteDto,
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should update and return the note if found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(mockNote);
      (NoteDB.update as jest.Mock).mockResolvedValue(mockUpdatedNote);

      const result = await NoteService.updateNote(findNoteDto, updateNoteDto);

      expect(result).toBe(mockUpdatedNote);
      expect(NoteDB.find).toHaveBeenCalledWith(findNoteDto);
      expect(NoteDB.update).toHaveBeenCalledWith(findNoteDto, updateNoteDto);
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(
        NoteService.updateNote(findNoteDto, updateNoteDto)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(NoteDB.find).toHaveBeenCalledWith(findNoteDto);
      expect(NoteDB.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteNote method tests", () => {
    const deleteNoteDto: DeleteNoteDto = {
      id: mockNoteId,
      userId: mockUserId,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should delete the note if found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(mockNote);
      (NoteDB.delete as jest.Mock).mockResolvedValue(undefined);

      await NoteService.deleteNote(deleteNoteDto);

      expect(NoteDB.find).toHaveBeenCalledWith(deleteNoteDto);
      expect(NoteDB.delete).toHaveBeenCalledWith(deleteNoteDto);
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(NoteService.deleteNote(deleteNoteDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(NoteDB.find).toHaveBeenCalledWith(deleteNoteDto);
      expect(NoteDB.delete).not.toHaveBeenCalled();
    });
  });

  describe("fetchUserNotes method tests", () => {
    const mockNotesCount = mockNotes.length;
    const findManyDto: FindManyDto = {
      userId: mockUserId,
      skip: 0,
      limit: 8,
      sort: { by: "createdAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return user notes, notes count and total pages", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);
      (NoteDB.count as jest.Mock).mockResolvedValue(mockNotesCount);

      const result = await NoteService.fetchUserNotes(findManyDto);

      expect(result.notes).toEqual(mockNotes);
      expect(result.notesCount).toBe(mockNotesCount);
      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / findManyDto.limit)
      );
      expect(NoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue([]);
      (NoteDB.count as jest.Mock).mockResolvedValue(0);

      const result = await NoteService.fetchUserNotes(findManyDto);

      expect(result.notes).toEqual([]);
      expect(result.notesCount).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(NoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("fetchRecentNotes method tests", () => {
    const findManyDto: FindManyDto = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "createdAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recent notes", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const result = await NoteService.fetchRecentNotes(findManyDto);

      expect(result).toEqual(mockNotes);
      expect(NoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(result.length).toBe(findManyDto.limit);
    });

    it("should return empty array when no recent notes are found", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue([]);

      const result = await NoteService.fetchRecentNotes(findManyDto);

      expect(result).toEqual([]);
      expect(NoteDB.findMany).toHaveBeenCalledWith(findManyDto);
    });
  });

  describe("fetchRecentlyUpdatedNotes method tests", () => {
    const findManyDto: FindManyDto = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "updatedAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recently updated notes", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const result = await NoteService.fetchRecentlyUpdatedNotes(findManyDto);

      expect(result).toEqual(mockNotes);
      expect(NoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(result.length).toBe(findManyDto.limit);
    });

    it("should return empty array when no recently updated notes are found", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue([]);

      const result = await NoteService.fetchRecentlyUpdatedNotes(findManyDto);

      expect(result).toEqual([]);
      expect(NoteDB.findMany).toHaveBeenCalledWith(findManyDto);
    });
  });

  describe("fetchNotesByVideoId method tests", () => {
    const mockNotesCount = mockNotes.length;
    const mockVideoId = "video123";

    const findManyDto: FindManyDto = {
      userId: mockUserId,
      skip: 0,
      limit: 8,
      sort: { by: "createdAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return notes by video ID, notes count and total pages", async () => {
      (NoteDB.findManyByVideoId as jest.Mock).mockResolvedValue(mockNotes);
      (NoteDB.count as jest.Mock).mockResolvedValue(mockNotesCount);

      const result = await NoteService.fetchNotesByVideoId(
        mockVideoId,
        findManyDto
      );

      expect(result.notes).toEqual(mockNotes);
      expect(result.notesCount).toBe(mockNotesCount);
      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / findManyDto.limit)
      );
      expect(NoteDB.findManyByVideoId).toHaveBeenCalledWith(
        mockVideoId,
        findManyDto
      );
      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (NoteDB.findManyByVideoId as jest.Mock).mockResolvedValue([]);
      (NoteDB.count as jest.Mock).mockResolvedValue(0);

      const result = await NoteService.fetchNotesByVideoId(
        mockVideoId,
        findManyDto
      );

      expect(result.notes).toEqual([]);
      expect(result.notesCount).toBe(0);
      expect(result.totalPages).toBe(0);

      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });
  });
});
