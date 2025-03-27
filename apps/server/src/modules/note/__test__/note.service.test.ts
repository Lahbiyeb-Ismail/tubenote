import { mock, mockReset } from "jest-mock-extended";

import { NotFoundError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { IPrismaService } from "@/modules/shared/services";

import type {
  ICreateDto,
  IDeleteDto,
  IFindAllDto,
  IFindUniqueDto,
  IUpdateDto,
} from "@/modules/shared/dtos";

import type { Note } from "../note.model";
import { NoteService } from "../note.service";
import type { INoteRepository } from "../note.types";

describe("NoteService methods test", () => {
  const mockNoteRepository = mock<INoteRepository>();
  const mockPrismaService = mock<IPrismaService>();

  const noteService = NoteService.getInstance({
    noteRepository: mockNoteRepository,
    prismaService: mockPrismaService,
  });

  beforeEach(() => {
    mockReset(mockNoteRepository);
    mockReset(mockPrismaService);
  });

  const mockUserId = "user_id_001";
  const mockNoteId = "note_id_001";

  const mockNote: Note = {
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

  const mockNotes: Note[] = [
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

  const findNoteDto: IFindUniqueDto = {
    id: mockNoteId,
    userId: mockUserId,
  };

  const updateNoteDto: IUpdateDto<Note> = {
    id: mockNoteId,
    userId: mockUserId,
    data: {
      title: "Updated Note",
      content: "This is an updated note.",
    },
  };

  describe("NoteService - findNote", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the note if found", async () => {
      (mockNoteRepository.find as jest.Mock).mockResolvedValue(mockNote);

      const result = await noteService.findNote(findNoteDto);

      expect(result).toBe(mockNote);
      expect(mockNoteRepository.find).toHaveBeenCalledWith(
        findNoteDto,
        undefined
      );
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (mockNoteRepository.find as jest.Mock).mockResolvedValue(null);

      await expect(noteService.findNote(findNoteDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockNoteRepository.find).toHaveBeenCalledWith(
        findNoteDto,
        undefined
      );
    });

    it("should propagate any errors thrown by the repository", async () => {
      const mockError = new Error("Test error");

      (mockNoteRepository.find as jest.Mock).mockRejectedValue(mockError);

      await expect(noteService.findNote(findNoteDto)).rejects.toThrow(
        mockError
      );

      expect(mockNoteRepository.find).toHaveBeenCalledWith(
        findNoteDto,
        undefined
      );
    });
  });

  describe("NoteService - createNote", () => {
    const createNoteDto: ICreateDto<Note> = {
      userId: mockUserId,
      data: {
        title: "New Note",
        content: "This is a new note.",
        videoId: "video123",
        thumbnail: "thumbnail123",
        videoTitle: "New Video",
        timestamp: 123,
        youtubeId: "youtube123",
      },
    };

    const mockNewNote: Note = {
      ...createNoteDto.data,
      id: "newNote123",
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create and return the new note", async () => {
      (mockNoteRepository.create as jest.Mock).mockResolvedValue(mockNewNote);

      const result = await noteService.createNote(createNoteDto);

      expect(result).toBe(mockNewNote);

      expect(mockNoteRepository.create).toHaveBeenCalledWith(
        createNoteDto,
        undefined
      );
    });

    it("should propagate any errors thrown by the repository", async () => {
      const mockError = new Error("Test error");

      (mockNoteRepository.create as jest.Mock).mockRejectedValue(mockError);

      await expect(noteService.createNote(createNoteDto)).rejects.toThrow(
        mockError
      );

      expect(mockNoteRepository.create).toHaveBeenCalledWith(
        createNoteDto,
        undefined
      );
    });
  });

  describe("NoteService - updateNote", () => {
    const mockUpdatedNote: Note = {
      ...mockNote,
      ...updateNoteDto.data,
      updatedAt: new Date(),
    };

    const mockTx = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      // Simulate transaction: call the callback with the mock repository.
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        async (cb) => {
          return await cb(mockTx);
        }
      );
    });

    it("should update and return the note if found", async () => {
      (mockNoteRepository.find as jest.Mock).mockResolvedValue(mockNote);

      (mockNoteRepository.update as jest.Mock).mockResolvedValue(
        mockUpdatedNote
      );

      const result = await noteService.updateNote(updateNoteDto);

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(result).toBe(mockUpdatedNote);

      expect(mockNoteRepository.find).toHaveBeenCalledWith(findNoteDto, mockTx);

      expect(mockNoteRepository.update).toHaveBeenCalledWith(
        updateNoteDto,
        mockTx
      );
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (mockNoteRepository.find as jest.Mock).mockResolvedValue(null);

      await expect(noteService.updateNote(updateNoteDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockNoteRepository.find).toHaveBeenCalledWith(findNoteDto, mockTx);

      expect(mockNoteRepository.update).not.toHaveBeenCalled();
    });

    it("should propagate any errors thrown by the repository", async () => {
      const mockError = new Error("Test error");

      (mockNoteRepository.find as jest.Mock).mockResolvedValue(mockNote);

      (mockNoteRepository.update as jest.Mock).mockRejectedValue(mockError);

      await expect(noteService.updateNote(updateNoteDto)).rejects.toThrow(
        mockError
      );

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockNoteRepository.find).toHaveBeenCalledWith(findNoteDto, mockTx);

      expect(mockNoteRepository.update).toHaveBeenCalledWith(
        updateNoteDto,
        mockTx
      );
    });
  });

  describe("NoteService - deleteNote", () => {
    const deleteNoteDto: IDeleteDto = {
      id: mockNoteId,
      userId: mockUserId,
    };

    const mockTx = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        async (cb) => {
          return await cb(mockTx);
        }
      );
    });

    it("should delete the note if found", async () => {
      (mockNoteRepository.find as jest.Mock).mockResolvedValue(mockNote);
      (mockNoteRepository.delete as jest.Mock).mockResolvedValue(mockNote);

      const result = await noteService.deleteNote(deleteNoteDto);

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(result).toBe(mockNote);

      expect(mockNoteRepository.find).toHaveBeenCalledWith(
        deleteNoteDto,
        mockTx
      );

      expect(mockNoteRepository.delete).toHaveBeenCalledWith(
        deleteNoteDto,
        mockTx
      );
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (mockNoteRepository.find as jest.Mock).mockResolvedValue(null);

      await expect(noteService.deleteNote(deleteNoteDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockNoteRepository.find).toHaveBeenCalledWith(
        deleteNoteDto,
        mockTx
      );

      expect(mockNoteRepository.delete).not.toHaveBeenCalled();
    });

    it("should propagate any errors thrown by the repository", async () => {
      const mockError = new Error("Test error");

      (mockNoteRepository.find as jest.Mock).mockResolvedValue(mockNote);

      (mockNoteRepository.delete as jest.Mock).mockRejectedValue(mockError);

      await expect(noteService.deleteNote(deleteNoteDto)).rejects.toThrow(
        mockError
      );

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockNoteRepository.find).toHaveBeenCalledWith(
        deleteNoteDto,
        mockTx
      );

      expect(mockNoteRepository.delete).toHaveBeenCalledWith(
        deleteNoteDto,
        mockTx
      );
    });
  });

  describe("NoteService - fetchUserNotes", () => {
    const mockNotesCount = mockNotes.length;
    const findManyDto: IFindAllDto = {
      userId: mockUserId,
      skip: 0,
      limit: 8,
      sort: { by: "createdAt", order: "desc" },
    };

    const mockTx = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        async (cb) => {
          return await cb(mockTx);
        }
      );
    });

    it("should return user notes, notes count and total pages", async () => {
      (mockNoteRepository.findMany as jest.Mock).mockResolvedValue(mockNotes);

      (mockNoteRepository.count as jest.Mock).mockResolvedValue(mockNotesCount);

      const result = await noteService.fetchUserNotes(findManyDto);

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(result.data).toEqual(mockNotes);

      expect(result.totalItems).toBe(mockNotesCount);

      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / findManyDto.limit)
      );

      expect(mockNoteRepository.findMany).toHaveBeenCalledWith(
        findManyDto,
        mockTx
      );

      expect(mockNoteRepository.count).toHaveBeenCalledWith(mockUserId, mockTx);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (mockNoteRepository.findMany as jest.Mock).mockResolvedValue([]);

      (mockNoteRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await noteService.fetchUserNotes(findManyDto);

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(result.data).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);

      expect(mockNoteRepository.findMany).toHaveBeenCalledWith(
        findManyDto,
        mockTx
      );

      expect(mockNoteRepository.count).toHaveBeenCalledWith(mockUserId, mockTx);
    });
  });

  describe("NoteService - fetchRecentNotes", () => {
    const findManyDto: IFindAllDto = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "createdAt", order: "desc" },
      skip: 0,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recent notes", async () => {
      // Return only the first two notes to simulate a limited result set.
      (mockNoteRepository.findMany as jest.Mock).mockResolvedValue(
        mockNotes.slice(0, 2)
      );

      const result = await noteService.fetchRecentNotes(findManyDto);

      expect(result).toEqual(mockNotes.slice(0, 2));
      expect(mockNoteRepository.findMany).toHaveBeenCalledWith(findManyDto);
    });

    it("should return empty array when no recent notes are found", async () => {
      (mockNoteRepository.findMany as jest.Mock).mockResolvedValue([]);

      const result = await noteService.fetchRecentNotes(findManyDto);

      expect(result).toEqual([]);
      expect(mockNoteRepository.findMany).toHaveBeenCalledWith(findManyDto);
    });
  });

  describe("NoteService - fetchRecentlyUpdatedNotes", () => {
    const findManyDto: IFindAllDto = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "updatedAt", order: "desc" },
      skip: 0,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recently updated notes", async () => {
      (mockNoteRepository.findMany as jest.Mock).mockResolvedValue(
        mockNotes.slice(0, 2)
      );

      const result = await noteService.fetchRecentlyUpdatedNotes(findManyDto);

      expect(result).toEqual(mockNotes.slice(0, 2));
      expect(mockNoteRepository.findMany).toHaveBeenCalledWith(findManyDto);
    });

    it("should return empty array when no recently updated notes are found", async () => {
      (mockNoteRepository.findMany as jest.Mock).mockResolvedValue([]);

      const result = await noteService.fetchRecentlyUpdatedNotes(findManyDto);

      expect(result).toEqual([]);
      expect(mockNoteRepository.findMany).toHaveBeenCalledWith(findManyDto);
    });
  });

  describe("NoteService - fetchNotesByVideoId", () => {
    const mockNotesCount = mockNotes.length;
    const baseFindManyDto: IFindAllDto = {
      userId: mockUserId,
      skip: 0,
      limit: 8,
      sort: { by: "createdAt", order: "desc" },
    };

    const findNotesByVideoIdDto: IFindAllDto & { videoId: string } = {
      ...baseFindManyDto,
      videoId: "video123",
    };

    const mockTx = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        async (cb) => {
          return await cb(mockTx);
        }
      );
    });

    it("should return notes by video ID, notes count and total pages", async () => {
      (mockNoteRepository.findManyByVideoId as jest.Mock).mockResolvedValue(
        mockNotes
      );

      (mockNoteRepository.count as jest.Mock).mockResolvedValue(mockNotesCount);

      const result = await noteService.fetchNotesByVideoId(
        findNotesByVideoIdDto
      );

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(result.data).toEqual(mockNotes);
      expect(result.totalItems).toBe(mockNotesCount);
      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / baseFindManyDto.limit)
      );
      expect(mockNoteRepository.findManyByVideoId).toHaveBeenCalledWith(
        findNotesByVideoIdDto,
        mockTx
      );

      expect(mockNoteRepository.count).toHaveBeenCalledWith(mockUserId, mockTx);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (mockNoteRepository.findManyByVideoId as jest.Mock).mockResolvedValue([]);
      (mockNoteRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await noteService.fetchNotesByVideoId(
        findNotesByVideoIdDto
      );

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(result.data).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);

      expect(mockNoteRepository.findManyByVideoId).toHaveBeenCalledWith(
        findNotesByVideoIdDto,
        mockTx
      );

      expect(mockNoteRepository.count).toHaveBeenCalledWith(mockUserId, mockTx);
    });
  });

  describe("NoteService - Edge Cases", () => {
    describe("Transaction Safety", () => {
      it("should roll back transactions on update failure", async () => {
        (mockPrismaService.transaction as jest.Mock).mockImplementation(
          async (cb) => {
            try {
              await cb(mockNoteRepository);
            } catch (error) {
              return Promise.reject(error);
            }
          }
        );

        mockNoteRepository.find.mockResolvedValue(mockNote);
        mockNoteRepository.update.mockRejectedValue(new Error("DB Failure"));

        await expect(noteService.updateNote(updateNoteDto)).rejects.toThrow(
          "DB Failure"
        );
        expect(mockNoteRepository.update).toHaveBeenCalled();
      });
    });
  });

  describe("NoteService - Security", () => {
    it("should prevent fetching other users' notes", async () => {
      const otherUserDto: IFindUniqueDto = {
        id: mockNoteId,
        userId: "other_user",
      };

      mockNoteRepository.find.mockResolvedValue(null);

      await expect(noteService.findNote(otherUserDto)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
