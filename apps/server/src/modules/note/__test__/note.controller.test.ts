import { Response } from "express";
import httpStatus from "http-status";

import {
  CreateNoteDto,
  DeleteNoteDto,
  FindNoteDto,
  INoteController,
  INoteService,
  Note,
  NoteController,
  UpdateNoteDto,
} from "@modules/note";

import type { QueryPaginationDto } from "@/common/dtos/query-pagination.dto";
import type { TypedRequest } from "@/types";
import type { IdParamDto } from "@common/dtos/id-param.dto";

describe("NoteController Tests", () => {
  let noteController: INoteController;
  let mockNoteService: INoteService;
  let mockRequest: Partial<TypedRequest>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  const mockUserId = "user_id_001";
  const mockNoteId = "note_id_001";

  const mockNote: Note = {
    id: mockNoteId,
    userId: mockUserId,
    title: "Test Note",
    content: "Test Content",
    videoId: "video_id_001",
    thumbnail: "thumbnail_url",
    timestamp: 12,
    videoTitle: "Video Title",
    youtubeId: "youtube_id_001",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockNoteService = {
      createNote: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn(),
      findNote: jest.fn(),
      fetchUserNotes: jest.fn(),
      fetchRecentNotes: jest.fn(),
      fetchNotesByVideoId: jest.fn(),
      fetchRecentlyUpdatedNotes: jest.fn(),
    };

    noteController = new NoteController(mockNoteService);

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("NoteController - createNote", () => {
    const createNoteDto: CreateNoteDto = {
      userId: mockUserId,
      title: "Test Note",
      content: "Test Content",
      videoId: "video_id_001",
      thumbnail: "thumbnail_url",
      timestamp: 12,
      videoTitle: "Video Title",
      youtubeId: "youtube_id_001",
    };

    beforeEach(() => {
      mockRequest = {
        userId: mockUserId,
        body: createNoteDto,
      };
    });

    it("should add a new note successfully", async () => {
      (mockNoteService.createNote as jest.Mock).mockResolvedValue(mockNote);

      await noteController.createNote(
        mockRequest as TypedRequest<CreateNoteDto>,
        mockResponse as Response
      );

      expect(mockNoteService.createNote).toHaveBeenCalledWith(createNoteDto);
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockNote,
        message: "Note created successfully.",
      });
    });

    it("should handle errors when adding a new note", async () => {
      const error = new Error("Failed to add note");
      (mockNoteService.createNote as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.createNote(
          mockRequest as TypedRequest<CreateNoteDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  describe("NoteController - getNoteById", () => {
    let getNoteByIdRequest: Partial<TypedRequest<{}, IdParamDto>>;

    const findNoteDto: FindNoteDto = {
      noteId: mockNoteId,
      userId: mockUserId,
    };

    beforeEach(() => {
      getNoteByIdRequest = {
        userId: mockUserId,
        params: { id: mockNoteId },
      };
    });

    it("should get a note by id successfully", async () => {
      (mockNoteService.findNote as jest.Mock).mockResolvedValue(mockNote);

      await noteController.getNoteById(
        getNoteByIdRequest as TypedRequest<{}, IdParamDto>,
        mockResponse as Response
      );

      expect(mockNoteService.findNote).toHaveBeenCalledWith(findNoteDto);
      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({ success: true, data: mockNote });
    });

    it("should handle errors when getting a note by id", async () => {
      const error = new Error("Failed to find note");
      (mockNoteService.findNote as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getNoteById(
          getNoteByIdRequest as TypedRequest<{}, IdParamDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to find note");
    });
  });

  describe("NoteController - updateNote", () => {
    let updateNoteRequest: Partial<TypedRequest<UpdateNoteDto, IdParamDto>>;

    const mockUserId = "user_id_001";
    const mockNoteId = "note_id_001";
    const findNoteDto: FindNoteDto = {
      noteId: mockNoteId,
      userId: mockUserId,
    };
    const updateNoteDto: UpdateNoteDto = {
      title: "Updated Note",
      content: "Updated Content",
    };

    beforeEach(() => {
      updateNoteRequest = {
        userId: mockUserId,
        body: updateNoteDto,
        params: { id: mockNoteId },
      };
    });

    it("should update a note successfully", async () => {
      const mockUpdatedNote = {
        _id: "noteId",
        title: "Updated Note",
        content: "Updated Content",
      };
      (mockNoteService.updateNote as jest.Mock).mockResolvedValue(
        mockUpdatedNote
      );

      await noteController.updateNote(
        updateNoteRequest as TypedRequest<UpdateNoteDto, IdParamDto>,
        mockResponse as Response
      );

      expect(mockNoteService.updateNote).toHaveBeenCalledWith(
        findNoteDto,
        updateNoteDto
      );
      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Note updated successfully.",
        data: mockUpdatedNote,
      });
    });

    it("should handle errors when updating a note", async () => {
      const error = new Error("Failed to update note");
      (mockNoteService.updateNote as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.updateNote(
          updateNoteRequest as TypedRequest<UpdateNoteDto, IdParamDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to update note");
    });
  });

  describe("NoteController - deleteNote", () => {
    let deleteNoteRequest: Partial<TypedRequest<{}, IdParamDto>>;

    const mockUserId = "user_id_001";
    const mockNoteId = "note_id_001";
    const deleteNoteDto: DeleteNoteDto = {
      noteId: mockNoteId,
      userId: mockUserId,
    };

    beforeEach(() => {
      deleteNoteRequest = {
        userId: mockUserId,
        params: { id: mockNoteId },
      };
    });

    it("should delete a note successfully", async () => {
      (mockNoteService.deleteNote as jest.Mock).mockResolvedValue(undefined);

      await noteController.deleteNote(
        deleteNoteRequest as TypedRequest<{}, IdParamDto>,
        mockResponse as Response
      );

      expect(mockNoteService.deleteNote).toHaveBeenCalledWith(deleteNoteDto);
      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Note deleted successfully.",
      });
    });

    it("should handle errors when deleting a note", async () => {
      const error = new Error("Failed to delete note");
      (mockNoteService.deleteNote as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.deleteNote(
          deleteNoteRequest as TypedRequest<{}, IdParamDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to delete note");
    });
  });

  describe("NoteController - getUserNotes", () => {
    beforeEach(() => {
      mockRequest = {
        userId: "mockUserId",
        query: {
          page: "1",
          limit: "10",
          order: "desc",
          sortBy: "createdAt",
        },
      };
    });

    it("should get user notes successfully", async () => {
      const mockNotes = [
        { _id: "noteId1", title: "Note 1" },
        { _id: "noteId2", title: "Note 2" },
      ];
      const mockResult = { notes: mockNotes, notesCount: 2, totalPages: 1 };
      (mockNoteService.fetchUserNotes as jest.Mock).mockResolvedValue(
        mockResult
      );

      await noteController.getUserNotes(
        mockRequest as TypedRequest<{}, {}, QueryPaginationDto>,
        mockResponse as Response
      );

      expect(mockNoteService.fetchUserNotes).toHaveBeenCalledWith({
        userId: "mockUserId",
        skip: 0,
        limit: 10,
        sort: { by: "createdAt", order: "desc" },
      });

      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockNotes,
        pagination: {
          totalPages: 1,
          currentPage: 1,
          totalItems: 2,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    });

    it("should handle errors when getting user notes", async () => {
      const error = new Error("Failed to fetch user notes");
      (mockNoteService.fetchUserNotes as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getUserNotes(
          mockRequest as TypedRequest<{}, {}, QueryPaginationDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to fetch user notes");
    });
  });

  describe("NoteController - getUserRecentNotes", () => {
    beforeEach(() => {
      mockRequest = {
        userId: "mockUserId",
        query: {
          page: "1",
          limit: "2",
          order: "desc",
          sortBy: "createdAt",
        },
      };
    });

    it("should get user recent notes successfully", async () => {
      const mockNotes = [
        { _id: "noteId1", title: "Recent Note 1" },
        { _id: "noteId2", title: "Recent Note 2" },
      ];
      (mockNoteService.fetchRecentNotes as jest.Mock).mockResolvedValue(
        mockNotes
      );

      await noteController.getUserRecentNotes(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockNoteService.fetchRecentNotes).toHaveBeenCalledWith({
        userId: "mockUserId",
        limit: 2,
        skip: 0,
        sort: { by: "createdAt", order: "desc" },
      });
      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({ success: true, data: mockNotes });
    });

    it("should handle errors when getting user recent notes", async () => {
      const error = new Error("Failed to fetch recent notes");
      (mockNoteService.fetchRecentNotes as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getUserRecentNotes(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to fetch recent notes");
    });
  });

  describe("NoteController - getRecentlyUpdatedNotes", () => {
    beforeEach(() => {
      mockRequest = {
        userId: "mockUserId",
        query: {
          page: "1",
          limit: "2",
          order: "desc",
          sortBy: "updatedAt",
        },
      };
    });

    it("should get recently updated notes successfully", async () => {
      const mockNotes = [
        { _id: "noteId1", title: "Updated Note 1" },
        { _id: "noteId2", title: "Updated Note 2" },
      ];

      (mockNoteService.fetchRecentNotes as jest.Mock).mockResolvedValue(
        mockNotes
      );

      await noteController.getRecentlyUpdatedNotes(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockNoteService.fetchRecentNotes).toHaveBeenCalledWith({
        userId: "mockUserId",
        limit: 2,
        skip: 0,
        sort: { by: "updatedAt", order: "desc" },
      });
      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({ success: true, data: mockNotes });
    });

    it("should handle errors when getting recently updated notes", async () => {
      const error = new Error("Failed to fetch recently updated notes");
      (mockNoteService.fetchRecentNotes as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getRecentlyUpdatedNotes(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to fetch recently updated notes");
    });
  });

  describe("NoteController - getNotesByVideoId", () => {
    let getNotesByVideoIdRequest: Partial<
      TypedRequest<{}, IdParamDto, QueryPaginationDto>
    >;

    beforeEach(() => {
      getNotesByVideoIdRequest = {
        userId: "mockUserId",
        query: {
          page: "1",
          limit: "8",
          order: "desc",
          sortBy: "createdAt",
        },
        params: {
          id: "mockVideoId",
        },
      };
    });

    it("should get notes by video id successfully", async () => {
      const mockNotes = [
        { _id: "noteId1", title: "Video Note 1" },
        { _id: "noteId2", title: "Video Note 2" },
      ];
      const mockResult = { notes: mockNotes, notesCount: 2, totalPages: 1 };

      (mockNoteService.fetchNotesByVideoId as jest.Mock).mockResolvedValue(
        mockResult
      );

      await noteController.getNotesByVideoId(
        getNotesByVideoIdRequest as TypedRequest<
          {},
          IdParamDto,
          QueryPaginationDto
        >,
        mockResponse as Response
      );

      expect(mockNoteService.fetchNotesByVideoId).toHaveBeenCalledWith({
        userId: getNotesByVideoIdRequest.userId,
        videoId: getNotesByVideoIdRequest.params?.id,
        limit: Number(getNotesByVideoIdRequest.query?.limit),
        skip: 0,
        sort: { by: "createdAt", order: "desc" },
      });
      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockNotes,
        pagination: {
          totalPages: 1,
          currentPage: 1,
          totalItems: 2,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    });

    it("should handle errors when getting notes by video id", async () => {
      const error = new Error("Failed to fetch notes by video id");
      (mockNoteService.fetchNotesByVideoId as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        noteController.getNotesByVideoId(
          getNotesByVideoIdRequest as TypedRequest<
            {},
            IdParamDto,
            QueryPaginationDto
          >,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to fetch notes by video id");
    });
  });
});
