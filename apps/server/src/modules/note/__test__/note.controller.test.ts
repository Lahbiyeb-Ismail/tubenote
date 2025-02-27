import { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@modules/shared";

import {
  INoteController,
  INoteService,
  Note,
  NoteController,
} from "@modules/note";

import type {
  ICreateBodyDto,
  ICreateDto,
  IDeleteDto,
  IFindUniqueDto,
  IPaginatedItems,
  IParamIdDto,
  IQueryPaginationDto,
  IUpdateBodyDto,
  IUpdateDto,
} from "@/modules/shared";

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
    let mockCreateReq: Partial<TypedRequest<ICreateBodyDto<Note>>>;

    const createNoteDto: ICreateDto<Note> = {
      userId: mockUserId,
      data: {
        title: "Test Note",
        content: "Test Content",
        videoId: "video_id_001",
        thumbnail: "thumbnail_url",
        timestamp: 12,
        videoTitle: "Video Title",
        youtubeId: "youtube_id_001",
      },
    };

    beforeEach(() => {
      mockCreateReq = {
        userId: mockUserId,
        body: createNoteDto.data,
      };
    });

    it("should add a new note successfully", async () => {
      (mockNoteService.createNote as jest.Mock).mockResolvedValue(mockNote);

      await noteController.createNote(
        mockCreateReq as TypedRequest<ICreateBodyDto<Note>>,
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
          mockCreateReq as TypedRequest<ICreateBodyDto<Note>>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  describe("NoteController - getNoteById", () => {
    let mockGetReq: Partial<TypedRequest<{}, IParamIdDto>>;

    beforeEach(() => {
      mockGetReq = {
        userId: mockUserId,
        params: { id: mockNoteId },
      };
    });

    it("should get a note by id successfully", async () => {
      (mockNoteService.findNote as jest.Mock).mockResolvedValue(mockNote);

      await noteController.getNoteById(
        mockGetReq as TypedRequest<{}, IParamIdDto>,
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
          mockGetReq as TypedRequest<{}, IParamIdDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to find note");
    });
  });

  describe("NoteController - updateNote", () => {
    let mockUpdateReq: Partial<TypedRequest<IUpdateBodyDto<Note>, IParamIdDto>>;

    const mockUserId = "user_id_001";
    const mockNoteId = "note_id_001";

    const updateNoteDto: IUpdateDto<Note> = {
      ...findNoteDto,
      data: {
        title: "Updated Note",
        content: "Updated Content",
      },
    };

    beforeEach(() => {
      mockUpdateReq = {
        userId: mockUserId,
        body: updateNoteDto.data,
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
        mockUpdateReq as TypedRequest<IUpdateBodyDto<Note>, IParamIdDto>,
        mockResponse as Response
      );

      expect(mockNoteService.updateNote).toHaveBeenCalledWith(updateNoteDto);
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
          mockUpdateReq as TypedRequest<IUpdateBodyDto<Note>, IParamIdDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to update note");
    });
  });

  describe("NoteController - deleteNote", () => {
    let mockDeleteReq: Partial<TypedRequest<{}, IParamIdDto>>;

    const mockUserId = "user_id_001";
    const mockNoteId = "note_id_001";

    const deleteNoteDto: IDeleteDto = {
      id: mockNoteId,
      userId: mockUserId,
    };

    beforeEach(() => {
      mockDeleteReq = {
        userId: mockUserId,
        params: { id: mockNoteId },
      };
    });

    it("should delete a note successfully", async () => {
      (mockNoteService.deleteNote as jest.Mock).mockResolvedValue(undefined);

      await noteController.deleteNote(
        mockDeleteReq as TypedRequest<{}, IParamIdDto>,
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
          mockDeleteReq as TypedRequest<{}, IParamIdDto>,
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

    const mockResult: IPaginatedItems<Note> = {
      items: mockNotes,
      totalItems: mockNotes.length,
      totalPages: 1,
    };

    it("should get user notes successfully", async () => {
      (mockNoteService.fetchUserNotes as jest.Mock).mockResolvedValue(
        mockResult
      );

      await noteController.getUserNotes(
        mockRequest as TypedRequest<{}, {}, IQueryPaginationDto>,
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

    it("should get user notes successfully with default pagination values", async () => {
      mockRequest = {
        userId: "mockUserId",
        query: {}, // Empty query to use default values
      };

      (mockNoteService.fetchUserNotes as jest.Mock).mockResolvedValue(
        mockResult
      );

      await noteController.getUserNotes(
        mockRequest as TypedRequest<{}, {}, IQueryPaginationDto>,
        mockResponse as Response
      );

      expect(mockNoteService.fetchUserNotes).toHaveBeenCalledWith({
        userId: "mockUserId",
        skip: 0,
        limit: 8, // Default limit
        sort: { by: "createdAt", order: "desc" }, // Default sort
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

    it("should handle different page numbers correctly", async () => {
      mockRequest = {
        userId: "mockUserId",
        query: {
          page: "2",
          limit: "10",
          order: "desc",
          sortBy: "createdAt",
        },
      };

      (mockNoteService.fetchUserNotes as jest.Mock).mockResolvedValue(
        mockResult
      );

      await noteController.getUserNotes(
        mockRequest as TypedRequest<{}, {}, IQueryPaginationDto>,
        mockResponse as Response
      );

      expect(mockNoteService.fetchUserNotes).toHaveBeenCalledWith({
        userId: "mockUserId",
        skip: 10, // Skip should be (page - 1) * limit = (2 - 1) * 10 = 10
        limit: 10,
        sort: { by: "createdAt", order: "desc" },
      });

      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockNotes,
        pagination: {
          totalPages: 1,
          currentPage: 2,
          totalItems: 2,
          hasNextPage: false,
          hasPrevPage: true,
        },
      });
    });

    it("should handle errors when getting user notes", async () => {
      const error = new Error("Failed to fetch user notes");
      (mockNoteService.fetchUserNotes as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getUserNotes(
          mockRequest as TypedRequest<{}, {}, IQueryPaginationDto>,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to fetch user notes");
    });
  });

  describe("NoteController - getUserRecentNotes", () => {
    const mockRecentNotes = [
      { _id: "noteId1", title: "Recent Note 1" },
      { _id: "noteId2", title: "Recent Note 2" },
    ];

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
      (mockNoteService.fetchRecentNotes as jest.Mock).mockResolvedValue(
        mockRecentNotes
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
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockRecentNotes,
      });
    });

    it("should get user recent notes successfully with default pagination values", async () => {
      mockRequest = {
        userId: "mockUserId",
        query: {}, // Empty query to use default values
      };

      (mockNoteService.fetchRecentNotes as jest.Mock).mockResolvedValue(
        mockRecentNotes
      );

      await noteController.getUserRecentNotes(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockNoteService.fetchRecentNotes).toHaveBeenCalledWith({
        userId: "mockUserId",
        limit: 2, // Default limit for recent notes
        skip: 0,
        sort: { by: "createdAt", order: "desc" }, // Default sort
      });
      expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockRecentNotes,
      });
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
    const mockRecentlyUpdatedNotes = [
      { _id: "noteId1", title: "Updated Note 1" },
      { _id: "noteId2", title: "Updated Note 2" },
    ];

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
      (mockNoteService.fetchRecentNotes as jest.Mock).mockResolvedValue(
        mockRecentlyUpdatedNotes
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
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockRecentlyUpdatedNotes,
      });
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
    let mockGetNotesByVideoIdReq: Partial<
      TypedRequest<{}, IParamIdDto, IQueryPaginationDto>
    >;

    beforeEach(() => {
      mockGetNotesByVideoIdReq = {
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

    const mockResult: IPaginatedItems<Note> = {
      items: mockNotes,
      totalItems: mockNotes.length,
      totalPages: 1,
    };

    it("should get notes by video id successfully", async () => {
      (mockNoteService.fetchNotesByVideoId as jest.Mock).mockResolvedValue(
        mockResult
      );

      await noteController.getNotesByVideoId(
        mockGetNotesByVideoIdReq as TypedRequest<
          {},
          IParamIdDto,
          IQueryPaginationDto
        >,
        mockResponse as Response
      );

      expect(mockNoteService.fetchNotesByVideoId).toHaveBeenCalledWith({
        userId: mockGetNotesByVideoIdReq.userId,
        videoId: mockGetNotesByVideoIdReq.params?.id,
        limit: Number(mockGetNotesByVideoIdReq.query?.limit),
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

    it("should get notes by video id successfully with default pagination", async () => {
      mockGetNotesByVideoIdReq = {
        userId: "mockUserId",
        query: {}, // Empty query to use default values
        params: {
          id: "mockVideoId",
        },
      };

      (mockNoteService.fetchNotesByVideoId as jest.Mock).mockResolvedValue(
        mockResult
      );

      await noteController.getNotesByVideoId(
        mockGetNotesByVideoIdReq as TypedRequest<
          {},
          IParamIdDto,
          IQueryPaginationDto
        >,
        mockResponse as Response
      );

      expect(mockNoteService.fetchNotesByVideoId).toHaveBeenCalledWith({
        userId: mockGetNotesByVideoIdReq.userId,
        videoId: mockGetNotesByVideoIdReq.params?.id,
        limit: 8, // Default limit
        skip: 0,
        sort: { by: "createdAt", order: "desc" }, // Default sort
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
          mockGetNotesByVideoIdReq as TypedRequest<
            {},
            IParamIdDto,
            IQueryPaginationDto
          >,
          mockResponse as Response
        )
      ).rejects.toThrow("Failed to fetch notes by video id");
    });
  });
});
