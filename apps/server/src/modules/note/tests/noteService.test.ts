import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { NotFoundError } from "../../../errors";
import type { FindManyParams } from "../../../types/shared.types";
import type {
  CreateNoteParams,
  DeleteNoteParams,
  NoteEntry,
  UpdateNoteParams,
} from "../note.type";
import NoteDB from "../noteDB";
import NoteService from "../noteService";

jest.mock("../noteDB");
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

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("findNote method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the note if found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(mockNote);

      const result = await NoteService.findNote({
        userId: mockUserId,
        noteId: mockNoteId,
      });

      expect(result).toBe(mockNote);
      expect(NoteDB.find).toHaveBeenCalledWith({
        userId: mockUserId,
        noteId: mockNoteId,
      });
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(
        NoteService.findNote({ userId: mockUserId, noteId: mockNoteId })
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(NoteDB.find).toHaveBeenCalledWith({
        userId: mockUserId,
        noteId: mockNoteId,
      });
    });
  });

  describe("addNewNote method tests", () => {
    const mockCreateNoteParams: CreateNoteParams = {
      data: {
        userId: mockUserId,
        title: "New Note",
        content: "This is a new note.",
        videoId: "video123",
        thumbnail: "thumbnail123",
        videoTitle: "New Video",
        timestamp: 123,
        youtubeId: "youtube123",
      },
    };

    const mockNewNote: NoteEntry = {
      ...mockCreateNoteParams.data,
      id: "newNote123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create and return the new note", async () => {
      (NoteDB.create as jest.Mock).mockResolvedValue(mockNewNote);

      const result = await NoteService.addNewNote(mockCreateNoteParams);

      expect(result).toBe(mockNewNote);
      expect(NoteDB.create).toHaveBeenCalledWith(mockCreateNoteParams);
    });
  });

  describe("updateNote method tests", () => {
    const mockUpdateNoteParams: UpdateNoteParams = {
      userId: mockUserId,
      noteId: mockNoteId,
      data: {
        title: "Updated Note",
        content: "This is an updated note.",
      },
    };

    const mockUpdatedNote: NoteEntry = {
      ...mockNote,
      ...mockUpdateNoteParams.data,
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should update and return the note if found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(mockNote);
      (NoteDB.update as jest.Mock).mockResolvedValue(mockUpdatedNote);

      const result = await NoteService.updateNote(mockUpdateNoteParams);

      expect(result).toBe(mockUpdatedNote);
      expect(NoteDB.find).toHaveBeenCalledWith({
        userId: mockUserId,
        noteId: mockNoteId,
      });
      expect(NoteDB.update).toHaveBeenCalledWith({
        noteId: mockNoteId,
        userId: mockUserId,
        data: mockUpdateNoteParams.data,
      });
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(
        NoteService.updateNote(mockUpdateNoteParams)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(NoteDB.find).toHaveBeenCalledWith({
        userId: mockUserId,
        noteId: mockNoteId,
      });
      expect(NoteDB.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteNote method tests", () => {
    const mockDeleteNoteParams: DeleteNoteParams = {
      userId: mockUserId,
      noteId: mockNoteId,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should delete the note if found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(mockNote);
      (NoteDB.delete as jest.Mock).mockResolvedValue(undefined);

      await NoteService.deleteNote(mockDeleteNoteParams);

      expect(NoteDB.find).toHaveBeenCalledWith({
        userId: mockUserId,
        noteId: mockNoteId,
      });
      expect(NoteDB.delete).toHaveBeenCalledWith({
        userId: mockUserId,
        noteId: mockNoteId,
      });
    });

    it("should throw NotFoundError if the note is not found", async () => {
      (NoteDB.find as jest.Mock).mockResolvedValue(null);

      await expect(
        NoteService.deleteNote(mockDeleteNoteParams)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(NoteDB.find).toHaveBeenCalledWith({
        userId: mockUserId,
        noteId: mockNoteId,
      });
      expect(NoteDB.delete).not.toHaveBeenCalled();
    });
  });

  describe("fetchUserNotes method tests", () => {
    const mockNotesCount = mockNotes.length;
    const mockParams: FindManyParams = {
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

      const result = await NoteService.fetchUserNotes(mockParams);

      expect(result.notes).toEqual(mockNotes);
      expect(result.notesCount).toBe(mockNotesCount);
      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / mockParams.limit)
      );
      expect(NoteDB.findMany).toHaveBeenCalledWith(mockParams);
      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue([]);
      (NoteDB.count as jest.Mock).mockResolvedValue(0);

      const result = await NoteService.fetchUserNotes(mockParams);

      expect(result.notes).toEqual([]);
      expect(result.notesCount).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(NoteDB.findMany).toHaveBeenCalledWith(mockParams);
      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("fetchRecentNotes method tests", () => {
    const mockParams: FindManyParams = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "createdAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recent notes", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const result = await NoteService.fetchRecentNotes(mockParams);

      expect(result).toEqual(mockNotes);
      expect(NoteDB.findMany).toHaveBeenCalledWith(mockParams);
      expect(result.length).toBe(mockParams.limit);
    });

    it("should return empty array when no recent notes are found", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue([]);

      const result = await NoteService.fetchRecentNotes(mockParams);

      expect(result).toEqual([]);
      expect(NoteDB.findMany).toHaveBeenCalledWith(mockParams);
    });
  });

  describe("fetchRecentlyUpdatedNotes method tests", () => {
    const mockParams: FindManyParams = {
      userId: mockUserId,
      limit: 2,
      sort: { by: "updatedAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return recently updated notes", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const result = await NoteService.fetchRecentlyUpdatedNotes(mockParams);

      expect(result).toEqual(mockNotes);
      expect(NoteDB.findMany).toHaveBeenCalledWith(mockParams);
      expect(result.length).toBe(mockParams.limit);
    });

    it("should return empty array when no recently updated notes are found", async () => {
      (NoteDB.findMany as jest.Mock).mockResolvedValue([]);

      const result = await NoteService.fetchRecentlyUpdatedNotes(mockParams);

      expect(result).toEqual([]);
      expect(NoteDB.findMany).toHaveBeenCalledWith(mockParams);
    });
  });

  describe("fetchNotesByVideoId method tests", () => {
    const mockVideoId = "video123";
    const mockNotesCount = mockNotes.length;
    const mockParams: FindManyParams & { videoId: string } = {
      userId: mockUserId,
      videoId: mockVideoId,
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

      const result = await NoteService.fetchNotesByVideoId(mockParams);

      expect(result.notes).toEqual(mockNotes);
      expect(result.notesCount).toBe(mockNotesCount);
      expect(result.totalPages).toBe(
        Math.ceil(mockNotesCount / mockParams.limit)
      );
      expect(NoteDB.findManyByVideoId).toHaveBeenCalledWith(mockParams);
      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty notes and total pages as 0 when no notes are found", async () => {
      (NoteDB.findManyByVideoId as jest.Mock).mockResolvedValue([]);
      (NoteDB.count as jest.Mock).mockResolvedValue(0);

      const result = await NoteService.fetchNotesByVideoId(mockParams);

      expect(result.notes).toEqual([]);
      expect(result.notesCount).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(NoteDB.findManyByVideoId).toHaveBeenCalledWith(mockParams);
      expect(NoteDB.count).toHaveBeenCalledWith(mockUserId);
    });
  });
});
