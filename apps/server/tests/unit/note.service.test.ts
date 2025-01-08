import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { NotFoundError } from "../../src/errors";

import { INoteDatabase } from "../../src/modules/note/note.db";
import { INoteService, NoteService } from "../../src/modules/note/note.service";

import type { FindManyDto } from "../../src/common/dtos/find-many.dto";
import type { CreateNoteDto } from "../../src/modules/note/dtos/create-note.dto";
import type { DeleteNoteDto } from "../../src/modules/note/dtos/delete-note.dto";
import type { FindNoteDto } from "../../src/modules/note/dtos/find-note.dto";
import type { NoteDto } from "../../src/modules/note/dtos/note.dto";
import type { UpdateNoteDto } from "../../src/modules/note/dtos/update-note.dto";

describe("NoteService methods test", () => {
  let noteService: INoteService;
  let mockNoteDB: INoteDatabase;

  beforeEach(() => {
    mockNoteDB = {
      find: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findManyByVideoId: jest.fn(),
      count: jest.fn(),
    };

    noteService = new NoteService(mockNoteDB);
  });

  const mockUserId = "user_id_001";
  const mockNoteId = "note_id_001";

  const mockNote: NoteDto = {
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

  describe("NoteService - findNote", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the note if found", async () => {
      (mockNoteDB.find as jest.Mock).mockResolvedValue(mockNote);

      const result = await noteService.findNote(findNoteDto);

      expect(result).toBe(mockNote);
      expect(mockNoteDB.find).toHaveBeenCalledWith(findNoteDto);
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (mockNoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(noteService.findNote(findNoteDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockNoteDB.find).toHaveBeenCalledWith(findNoteDto);
    });
  });

  describe("NoyeService - createNote", () => {
    const createNoteDto: CreateNoteDto = {
      title: "New Note",
      content: "This is a new note.",
      videoId: "video123",
      thumbnail: "thumbnail123",
      videoTitle: "New Video",
      timestamp: 123,
      youtubeId: "youtube123",
    };

    const mockNewNote: NoteDto = {
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
      (mockNoteDB.create as jest.Mock).mockResolvedValue(mockNewNote);

      const result = await noteService.createNote(mockUserId, createNoteDto);

      expect(result).toBe(mockNewNote);
      expect(mockNoteDB.create).toHaveBeenCalledWith(mockUserId, createNoteDto);
    });
  });

  describe("NoyeService - updateNote", () => {
    const updateNoteDto: UpdateNoteDto = {
      title: "Updated Note",
      content: "This is an updated note.",
    };

    const mockUpdatedNote: NoteDto = {
      ...mockNote,
      ...updateNoteDto,
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should update and return the note if found", async () => {
      (mockNoteDB.find as jest.Mock).mockResolvedValue(mockNote);
      (mockNoteDB.update as jest.Mock).mockResolvedValue(mockUpdatedNote);

      const result = await noteService.updateNote(findNoteDto, updateNoteDto);

      expect(result).toBe(mockUpdatedNote);
      expect(mockNoteDB.find).toHaveBeenCalledWith(findNoteDto);
      expect(mockNoteDB.update).toHaveBeenCalledWith(
        findNoteDto,
        updateNoteDto
      );
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (mockNoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(
        noteService.updateNote(findNoteDto, updateNoteDto)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(mockNoteDB.find).toHaveBeenCalledWith(findNoteDto);
      expect(mockNoteDB.update).not.toHaveBeenCalled();
    });
  });

  describe("NoyeService - deleteNote", () => {
    const deleteNoteDto: DeleteNoteDto = {
      id: mockNoteId,
      userId: mockUserId,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should delete the note if found", async () => {
      (mockNoteDB.find as jest.Mock).mockResolvedValue(mockNote);
      (mockNoteDB.delete as jest.Mock).mockResolvedValue(undefined);

      await noteService.deleteNote(deleteNoteDto);

      expect(mockNoteDB.find).toHaveBeenCalledWith(deleteNoteDto);
      expect(mockNoteDB.delete).toHaveBeenCalledWith(deleteNoteDto);
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (mockNoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(noteService.deleteNote(deleteNoteDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockNoteDB.find).toHaveBeenCalledWith(deleteNoteDto);
      expect(mockNoteDB.delete).not.toHaveBeenCalled();
    });
  });

  describe("NoyeService - fetchUserNotes", () => {
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
      (mockNoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);
      (mockNoteDB.count as jest.Mock).mockResolvedValue(mockNotesCount);

      const result = await noteService.fetchUserNotes(findManyDto);

      expect(result.notes).toEqual(mockNotes);
      expect(result.notesCount).toBe(mockNotesCount);
      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / findManyDto.limit)
      );
      expect(mockNoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(mockNoteDB.count).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (mockNoteDB.findMany as jest.Mock).mockResolvedValue([]);
      (mockNoteDB.count as jest.Mock).mockResolvedValue(0);

      const result = await noteService.fetchUserNotes(findManyDto);

      expect(result.notes).toEqual([]);
      expect(result.notesCount).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(mockNoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(mockNoteDB.count).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("NoyeService - fetchRecentNotes", () => {
    const findManyDto: FindManyDto = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "createdAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recent notes", async () => {
      (mockNoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const result = await noteService.fetchRecentNotes(findManyDto);

      expect(result).toEqual(mockNotes);
      expect(mockNoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(result.length).toBe(findManyDto.limit);
    });

    it("should return empty array when no recent notes are found", async () => {
      (mockNoteDB.findMany as jest.Mock).mockResolvedValue([]);

      const result = await noteService.fetchRecentNotes(findManyDto);

      expect(result).toEqual([]);
      expect(mockNoteDB.findMany).toHaveBeenCalledWith(findManyDto);
    });
  });

  describe("NoyeService - fetchRecentlyUpdatedNotes", () => {
    const findManyDto: FindManyDto = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "updatedAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recently updated notes", async () => {
      (mockNoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const result = await noteService.fetchRecentlyUpdatedNotes(findManyDto);

      expect(result).toEqual(mockNotes);
      expect(mockNoteDB.findMany).toHaveBeenCalledWith(findManyDto);
      expect(result.length).toBe(findManyDto.limit);
    });

    it("should return empty array when no recently updated notes are found", async () => {
      (mockNoteDB.findMany as jest.Mock).mockResolvedValue([]);

      const result = await noteService.fetchRecentlyUpdatedNotes(findManyDto);

      expect(result).toEqual([]);
      expect(mockNoteDB.findMany).toHaveBeenCalledWith(findManyDto);
    });
  });

  describe("NoyeService - fetchNotesByVideoId", () => {
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
      (mockNoteDB.findManyByVideoId as jest.Mock).mockResolvedValue(mockNotes);
      (mockNoteDB.count as jest.Mock).mockResolvedValue(mockNotesCount);

      const result = await noteService.fetchNotesByVideoId(
        mockVideoId,
        findManyDto
      );

      expect(result.notes).toEqual(mockNotes);
      expect(result.notesCount).toBe(mockNotesCount);
      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / findManyDto.limit)
      );
      expect(mockNoteDB.findManyByVideoId).toHaveBeenCalledWith(
        mockVideoId,
        findManyDto
      );
      expect(mockNoteDB.count).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (mockNoteDB.findManyByVideoId as jest.Mock).mockResolvedValue([]);
      (mockNoteDB.count as jest.Mock).mockResolvedValue(0);

      const result = await noteService.fetchNotesByVideoId(
        mockVideoId,
        findManyDto
      );

      expect(result.notes).toEqual([]);
      expect(result.notesCount).toBe(0);
      expect(result.totalPages).toBe(0);

      expect(mockNoteDB.count).toHaveBeenCalledWith(mockUserId);
    });
  });
});
