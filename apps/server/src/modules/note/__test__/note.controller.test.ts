import { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  ICreateBodyDto,
  ICreateDto,
  IDeleteDto,
  IFindAllDto,
  IFindUniqueDto,
  IPaginatedData,
  IParamIdDto,
  IQueryPaginationDto,
  IUpdateBodyDto,
  IUpdateDto,
} from "@/modules/shared/dtos";

import { NoteController } from "../note.controller";

import type {
  ApiResponse,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { Note } from "../note.model";
import type { INoteService } from "../note.types";

describe("NoteController Tests", () => {
  const noteService = mock<INoteService>();
  const responseFormatter = mock<IResponseFormatter>();

  const noteController = NoteController.getInstance({
    noteService,
    responseFormatter,
  });

  const req = mock<TypedRequest>();
  const res = mock<Response>();

  const createReq = mock<TypedRequest<ICreateBodyDto<Note>>>();

  const getReq = mock<TypedRequest<{}, IParamIdDto>>();

  const getNotesReq = mock<TypedRequest<{}, {}, IQueryPaginationDto>>();

  const updateReq = mock<TypedRequest<IUpdateBodyDto<Note>, IParamIdDto>>();

  const deleteReq = mock<TypedRequest<{}, IParamIdDto>>();

  const getByVideoIdReq =
    mock<TypedRequest<{}, IParamIdDto, IQueryPaginationDto>>();

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

  const updateNoteDto: IUpdateDto<Note> = {
    ...findNoteDto,
    data: {
      title: "Updated Note",
      content: "Updated Content",
    },
  };

  const deleteNoteDto: IDeleteDto = {
    id: mockNoteId,
    userId: mockUserId,
  };

  beforeEach(() => {
    mockReset(noteService);
    mockReset(responseFormatter);

    res.status.mockReturnThis();
    res.json.mockReturnThis();

    req.userId = mockUserId;

    createReq.userId = createNoteDto.userId;
    createReq.body = createNoteDto.data;

    getReq.userId = findNoteDto.userId;
    getReq.params = { id: findNoteDto.id };

    updateReq.userId = updateNoteDto.userId;
    updateReq.body = updateNoteDto.data;
    updateReq.params = { id: updateNoteDto.id };

    deleteReq.userId = deleteNoteDto.userId;
    deleteReq.params = { id: deleteNoteDto.id };

    getNotesReq.userId = mockUserId;
    getNotesReq.query = {
      page: 1,
      limit: 10,
      order: "desc",
      sortBy: "createdAt",
    };

    getByVideoIdReq.userId = mockUserId;
    getByVideoIdReq.query = {
      page: 1,
      limit: 8,
      order: "desc",
      sortBy: "createdAt",
    };

    getByVideoIdReq.params = {
      id: "video_id_001",
    };
  });

  describe("NoteController - createNote", () => {
    const formattedCreateRes: ApiResponse<Note> = {
      success: true,
      status: httpStatus.CREATED,
      data: mockNote,
      message: "Note created successfully.",
    };

    it("should add a new note successfully", async () => {
      (noteService.createNote as jest.Mock).mockResolvedValue(mockNote);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        formattedCreateRes
      );

      await noteController.createNote(createReq, res);

      expect(noteService.createNote).toHaveBeenCalledWith(createNoteDto);

      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);

      expect(res.json).toHaveBeenCalledWith(formattedCreateRes);
    });

    it("should handle errors when adding a new note", async () => {
      const error = new Error("Failed to add note");
      (noteService.createNote as jest.Mock).mockRejectedValue(error);

      await expect(noteController.createNote(createReq, res)).rejects.toThrow(
        error
      );
    });
  });

  describe("NoteController - getNoteById", () => {
    const formattedGetRes: ApiResponse<Note> = {
      success: true,
      data: mockNote,
      message: "Note retrieved successfully.",
      status: httpStatus.OK,
    };

    it("should get a note by id successfully", async () => {
      (noteService.findNote as jest.Mock).mockResolvedValue(mockNote);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        formattedGetRes
      );

      await noteController.getNoteById(getReq, res);

      expect(noteService.findNote).toHaveBeenCalledWith(findNoteDto);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedGetRes);
    });

    it("should handle errors when getting a note by id", async () => {
      const error = new Error("Failed to find note");
      (noteService.findNote as jest.Mock).mockRejectedValue(error);

      await expect(noteController.getNoteById(getReq, res)).rejects.toThrow(
        "Failed to find note"
      );
    });
  });

  describe("NoteController - updateNote", () => {
    const mockUpdatedNote: Note = {
      ...mockNote,
      ...updateNoteDto.data,
    };

    const formattedUpdateRes: ApiResponse<Note> = {
      success: true,
      data: mockUpdatedNote,
      message: "Note updated successfully.",
      status: httpStatus.OK,
    };

    it("should update a note successfully", async () => {
      (noteService.updateNote as jest.Mock).mockResolvedValue(mockUpdatedNote);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        formattedUpdateRes
      );

      await noteController.updateNote(updateReq, res);

      expect(noteService.updateNote).toHaveBeenCalledWith(updateNoteDto);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith(formattedUpdateRes);
    });

    it("should handle errors when updating a note", async () => {
      const error = new Error("Failed to update note");
      (noteService.updateNote as jest.Mock).mockRejectedValue(error);

      await expect(noteController.updateNote(updateReq, res)).rejects.toThrow(
        "Failed to update note"
      );
    });
  });

  describe("NoteController - deleteNote", () => {
    const formattedDeleteRes: ApiResponse<Note> = {
      success: true,
      message: "Note deleted successfully.",
      status: httpStatus.OK,
    };

    it("should delete a note successfully", async () => {
      (noteService.deleteNote as jest.Mock).mockResolvedValue(undefined);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        formattedDeleteRes
      );

      await noteController.deleteNote(deleteReq, res);

      expect(noteService.deleteNote).toHaveBeenCalledWith(deleteNoteDto);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith(formattedDeleteRes);
    });

    it("should handle errors when deleting a note", async () => {
      const error = new Error("Failed to delete note");
      (noteService.deleteNote as jest.Mock).mockRejectedValue(error);

      await expect(noteController.deleteNote(deleteReq, res)).rejects.toThrow(
        "Failed to delete note"
      );
    });
  });

  describe("NoteController - getUserNotes", () => {
    const mockResult: IPaginatedData<Note> = {
      data: mockNotes,
      totalItems: mockNotes.length,
      totalPages: 1,
    };

    const paginationQueries: Omit<IFindAllDto, "userId"> = {
      skip: 0,
      limit: 8,
      sort: { by: "createdAt", order: "desc" },
    };

    const formattedPaginateRes: ApiResponse<Note[]> = {
      success: true,
      data: mockNotes,
      message: "Notes retrieved successfully.",
      status: httpStatus.OK,
      pagination: {
        totalPages: 1,
        currentPage: 1,
        totalItems: 2,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    it("should get user notes successfully", async () => {
      (noteService.fetchUserNotes as jest.Mock).mockResolvedValue(mockResult);

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue(
        paginationQueries
      );

      (responseFormatter.formatPaginatedResponse as jest.Mock).mockReturnValue(
        formattedPaginateRes
      );

      await noteController.getUserNotes(getNotesReq, res);

      expect(noteService.fetchUserNotes).toHaveBeenCalledWith({
        userId: mockUserId,
        ...paginationQueries,
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedPaginateRes);
    });

    it("should get user notes successfully with default pagination values", async () => {
      getNotesReq.query = {}; // Empty query to use default values

      (noteService.fetchUserNotes as jest.Mock).mockResolvedValue(mockResult);

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue(
        paginationQueries
      );

      (responseFormatter.formatPaginatedResponse as jest.Mock).mockReturnValue(
        formattedPaginateRes
      );

      await noteController.getUserNotes(getNotesReq, res);

      expect(noteService.fetchUserNotes).toHaveBeenCalledWith({
        userId: mockUserId,
        ...paginationQueries,
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedPaginateRes);
    });

    it("should handle different page numbers correctly", async () => {
      getNotesReq.query = {
        page: 2,
        limit: 10,
        order: "desc",
        sortBy: "createdAt",
      };

      (noteService.fetchUserNotes as jest.Mock).mockResolvedValue(mockResult);

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue({
        ...paginationQueries,
        skip: 10,
        limit: 10,
      });

      (responseFormatter.formatPaginatedResponse as jest.Mock).mockReturnValue(
        formattedPaginateRes
      );

      await noteController.getUserNotes(getNotesReq, res);

      expect(noteService.fetchUserNotes).toHaveBeenCalledWith({
        ...paginationQueries,
        userId: mockUserId,
        skip: 10,
        limit: 10,
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedPaginateRes);
    });

    it("should handle errors when getting user notes", async () => {
      const error = new Error("Failed to fetch user notes");
      (noteService.fetchUserNotes as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getUserNotes(getNotesReq, res)
      ).rejects.toThrow("Failed to fetch user notes");
    });
  });

  describe("NoteController - getUserRecentNotes", () => {
    const paginationQueries: Omit<IFindAllDto, "userId"> = {
      skip: 0,
      limit: 2,
      sort: { by: "createdAt", order: "desc" },
    };

    const formattedRes: ApiResponse<Note[]> = {
      success: true,
      data: mockNotes,
      message: "Recent notes retrieved successfully.",
      status: httpStatus.OK,
    };

    beforeEach(() => {
      getNotesReq.query = {
        page: 1,
        limit: 2,
        order: "desc",
        sortBy: "createdAt",
      };
    });

    it("should get user recent notes successfully", async () => {
      (noteService.fetchRecentNotes as jest.Mock).mockResolvedValue(mockNotes);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        formattedRes
      );

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue(
        paginationQueries
      );

      await noteController.getUserRecentNotes(getNotesReq, res);

      expect(noteService.fetchRecentNotes).toHaveBeenCalledWith({
        userId: mockUserId,
        ...paginationQueries,
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedRes);
    });

    it("should get user recent notes successfully with default pagination values", async () => {
      getNotesReq.query = {}; // Empty query to use default values

      (noteService.fetchRecentNotes as jest.Mock).mockResolvedValue(mockNotes);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        formattedRes
      );

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue(
        paginationQueries
      );

      await noteController.getUserRecentNotes(getNotesReq, res);

      expect(noteService.fetchRecentNotes).toHaveBeenCalledWith({
        userId: mockUserId,
        ...paginationQueries,
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedRes);
    });

    it("should handle errors when getting user recent notes", async () => {
      const error = new Error("Failed to fetch recent notes");
      (noteService.fetchRecentNotes as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getUserRecentNotes(getNotesReq, res)
      ).rejects.toThrow("Failed to fetch recent notes");
    });
  });

  describe("NoteController - getRecentlyUpdatedNotes", () => {
    const paginationQueries: Omit<IFindAllDto, "userId"> = {
      skip: 0,
      limit: 2,
      sort: { by: "updatedAt", order: "desc" },
    };

    const formattedRes: ApiResponse<Note[]> = {
      success: true,
      data: mockNotes,
      message: "Recent updated notes retrieved successfully.",
      status: httpStatus.OK,
    };

    beforeEach(() => {
      getNotesReq.query = {
        page: 1,
        limit: 2,
        order: "desc",
        sortBy: "updatedAt",
      };
    });

    it("should get recently updated notes successfully", async () => {
      (noteService.fetchRecentNotes as jest.Mock).mockResolvedValue(mockNotes);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        formattedRes
      );

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue(
        paginationQueries
      );

      await noteController.getRecentlyUpdatedNotes(getNotesReq, res);

      expect(noteService.fetchRecentNotes).toHaveBeenCalledWith({
        userId: mockUserId,
        ...paginationQueries,
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedRes);
    });

    it("should handle errors when getting recently updated notes", async () => {
      const error = new Error("Failed to fetch recently updated notes");
      (noteService.fetchRecentNotes as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getRecentlyUpdatedNotes(getNotesReq, res)
      ).rejects.toThrow("Failed to fetch recently updated notes");
    });
  });

  describe("NoteController - getNotesByVideoId", () => {
    const mockResult: IPaginatedData<Note> = {
      data: mockNotes,
      totalItems: mockNotes.length,
      totalPages: 1,
    };

    const paginationQueries: Omit<IFindAllDto, "userId"> = {
      skip: 0,
      limit: 8,
      sort: { by: "createdAt", order: "desc" },
    };

    const formattedPaginateRes: ApiResponse<Note[]> = {
      success: true,
      data: mockNotes,
      message: "Notes retrieved successfully.",
      status: httpStatus.OK,
      pagination: {
        totalPages: 1,
        currentPage: 1,
        totalItems: 2,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    it("should get notes by video id successfully", async () => {
      (noteService.fetchNotesByVideoId as jest.Mock).mockResolvedValue(
        mockResult
      );

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue(
        paginationQueries
      );

      (responseFormatter.formatPaginatedResponse as jest.Mock).mockReturnValue(
        formattedPaginateRes
      );

      await noteController.getNotesByVideoId(getByVideoIdReq, res);

      expect(noteService.fetchNotesByVideoId).toHaveBeenCalledWith({
        userId: getByVideoIdReq.userId,
        videoId: getByVideoIdReq.params?.id,
        ...paginationQueries,
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedPaginateRes);
    });

    it("should get notes by video id successfully with default pagination", async () => {
      getByVideoIdReq.query = {};

      (noteService.fetchNotesByVideoId as jest.Mock).mockResolvedValue(
        mockResult
      );

      (responseFormatter.getPaginationQueries as jest.Mock).mockReturnValue(
        paginationQueries
      );

      (responseFormatter.formatPaginatedResponse as jest.Mock).mockReturnValue(
        formattedPaginateRes
      );

      await noteController.getNotesByVideoId(getByVideoIdReq, res);

      expect(noteService.fetchNotesByVideoId).toHaveBeenCalledWith({
        userId: getByVideoIdReq.userId,
        videoId: getByVideoIdReq.params?.id,
        ...paginationQueries,
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedPaginateRes);
    });

    it("should handle errors when getting notes by video id", async () => {
      const error = new Error("Failed to fetch notes by video id");
      (noteService.fetchNotesByVideoId as jest.Mock).mockRejectedValue(error);

      await expect(
        noteController.getNotesByVideoId(getByVideoIdReq, res)
      ).rejects.toThrow("Failed to fetch notes by video id");
    });
  });
});
