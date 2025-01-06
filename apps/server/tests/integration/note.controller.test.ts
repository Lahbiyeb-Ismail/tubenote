import { Response } from "express";
import httpStatus from "http-status";
import type { CreateNoteDto } from "../../src/modules/note/dtos/create-note.dto";
import NoteController from "../../src/modules/note/note.controller";
import NoteService from "../../src/modules/note/note.service";
import { type NoteEntry } from "../../src/modules/note/note.type";
import { TypedRequest } from "../../src/types";

jest.mock("../../src/modules/note/note.service");

describe("NoteController integration tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("NoteController - createNote", () => {
    let mockRequest: Partial<TypedRequest<CreateNoteDto>>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    const mockUserId = "user_id_001";

    const createNoteDto: CreateNoteDto = {
      title: "Test Note",
      content: "Test Content",
      videoId: "video_id_001",
      thumbnail: "thumbnail_url",
      timestamp: 12,
      videoTitle: "Video Title",
      youtubeId: "youtube_id_001",
    };

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockResponse = {
        status: mockStatus,
        json: mockJson,
      };
      mockRequest = {
        userId: mockUserId,
        body: createNoteDto,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should add a new note successfully", async () => {
      const mockCreatedNote: NoteEntry = {
        id: "note_id_001",
        title: "Test Note",
        content: "Test Content",
        userId: mockUserId,
        videoId: "video_id_001",
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnail: "thumbnail_url",
        timestamp: 12,
        videoTitle: "Video Title",
        youtubeId: "youtube_id_001",
      };

      (NoteService.createNote as jest.Mock).mockResolvedValue(mockCreatedNote);

      await NoteController.createNote(
        mockRequest as TypedRequest<CreateNoteDto>,
        mockResponse as Response
      );

      expect(NoteService.createNote).toHaveBeenCalledWith(
        mockUserId,
        createNoteDto
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.CREATED);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Note created successfully.",
        note: mockCreatedNote,
      });
    });

    it("should handle errors when adding a new note", async () => {
      const error = new Error("Failed to add note");

      (NoteService.createNote as jest.Mock).mockRejectedValue(error);

      await expect(
        NoteController.createNote(
          mockRequest as TypedRequest<CreateNoteDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  // describe("updateNote", () => {
  //   let mockRequest: Partial<TypedRequest<NoteBody, NoteIdParam>>;
  //   let mockResponse: Partial<Response>;
  //   let mockJson: jest.Mock;
  //   let mockStatus: jest.Mock;

  //   const mockUserId = "user_id_001";
  //   const mockNoteId = "note_id_001";

  //   const mockNoteData = {
  //     title: "Test Note",
  //     content: "Test Content",
  //     videoId: "video_id_001",
  //     thumbnail: "thumbnail_url",
  //     timestamp: 12,
  //     videoTitle: "Video Title",
  //     youtubeId: "youtube_id_001",
  //   };

  //   beforeEach(() => {
  //     mockJson = jest.fn();
  //     mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  //     mockResponse = {
  //       status: mockStatus,
  //       json: mockJson,
  //     };
  //     mockRequest = {
  //       userId: mockUserId,
  //       body: mockNoteData,
  //       params: { noteId: mockNoteId },
  //     };
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });
  //   it("should update a note successfully", async () => {
  //     const mockUpdatedNote = {
  //       _id: "noteId",
  //       title: "Updated Note",
  //       content: "Updated Content",
  //     };
  //     (NoteService.updateNote as jest.Mock).mockResolvedValue(mockUpdatedNote);

  //     const noteBody: NoteBody = {
  //       title: "Updated Note",
  //       content: "Updated Content",
  //     };
  //     const params: NoteIdParam = { noteId: "noteId" };
  //     await NoteController.updateNote(
  //       { ...mockRequest, body: noteBody, params } as TypedRequest<
  //         NoteBody,
  //         NoteIdParam
  //       >,
  //       mockResponse as Response
  //     );

  //     expect(NoteService.updateNote).toHaveBeenCalledWith({
  //       userId: "mockUserId",
  //       noteId: "noteId",
  //       data: noteBody,
  //     });
  //     expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: "Note updated successfully.",
  //       note: mockUpdatedNote,
  //     });
  //   });

  //   it("should handle errors when updating a note", async () => {
  //     const error = new Error("Failed to update note");
  //     (NoteService.updateNote as jest.Mock).mockRejectedValue(error);

  //     const noteBody: NoteBody = {
  //       title: "Updated Note",
  //       content: "Updated Content",
  //     };
  //     const params: NoteIdParam = { noteId: "noteId" };
  //     await expect(
  //       NoteController.updateNote(
  //         { ...mockRequest, body: noteBody, params } as TypedRequest<
  //           NoteBody,
  //           NoteIdParam
  //         >,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow("Failed to update note");
  //   });
  // });

  // describe("deleteNote", () => {
  //   it("should delete a note successfully", async () => {
  //     (NoteService.deleteNote as jest.Mock).mockResolvedValue(undefined);

  //     const params: NoteIdParam = { noteId: "noteId" };
  //     await NoteController.deleteNote(
  //       { ...mockRequest, params } as TypedRequest<{}, NoteIdParam>,
  //       mockResponse as Response
  //     );

  //     expect(NoteService.deleteNote).toHaveBeenCalledWith({
  //       userId: "mockUserId",
  //       noteId: "noteId",
  //     });
  //     expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: "Note deleted successfully.",
  //     });
  //   });

  //   it("should handle errors when deleting a note", async () => {
  //     const error = new Error("Failed to delete note");
  //     (NoteService.deleteNote as jest.Mock).mockRejectedValue(error);

  //     const params: NoteIdParam = { noteId: "noteId" };
  //     await expect(
  //       NoteController.deleteNote(
  //         { ...mockRequest, params } as TypedRequest<{}, NoteIdParam>,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow("Failed to delete note");
  //   });
  // });

  // describe("getNoteById", () => {
  //   it("should get a note by id successfully", async () => {
  //     const mockNote = {
  //       _id: "noteId",
  //       title: "Test Note",
  //       content: "Test Content",
  //     };
  //     (NoteService.findNote as jest.Mock).mockResolvedValue(mockNote);

  //     const params: NoteIdParam = { noteId: "noteId" };
  //     await NoteController.getNoteById(
  //       { ...mockRequest, params } as TypedRequest<{}, NoteIdParam>,
  //       mockResponse as Response
  //     );

  //     expect(NoteService.findNote).toHaveBeenCalledWith({
  //       userId: "mockUserId",
  //       noteId: "noteId",
  //     });
  //     expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockJson).toHaveBeenCalledWith({ note: mockNote });
  //   });

  //   it("should handle errors when getting a note by id", async () => {
  //     const error = new Error("Failed to find note");
  //     (NoteService.findNote as jest.Mock).mockRejectedValue(error);

  //     const params: NoteIdParam = { noteId: "noteId" };
  //     await expect(
  //       NoteController.getNoteById(
  //         { ...mockRequest, params } as TypedRequest<{}, NoteIdParam>,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow("Failed to find note");
  //   });
  // });

  // describe("getUserNotes", () => {
  //   it("should get user notes successfully", async () => {
  //     const mockNotes = [
  //       { _id: "noteId1", title: "Note 1" },
  //       { _id: "noteId2", title: "Note 2" },
  //     ];
  //     const mockResult = { notes: mockNotes, notesCount: 2, totalPages: 1 };
  //     (NoteService.fetchUserNotes as jest.Mock).mockResolvedValue(mockResult);

  //     const query = { page: "1", limit: "10" };
  //     await NoteController.getUserNotes(
  //       { ...mockRequest, query } as TypedRequest<
  //         {},
  //         {},
  //         { page: string; limit: string }
  //       >,
  //       mockResponse as Response
  //     );

  //     expect(NoteService.fetchUserNotes).toHaveBeenCalledWith({
  //       userId: "mockUserId",
  //       skip: 0,
  //       limit: 10,
  //       sort: { by: "createdAt", order: "desc" },
  //     });
  //     expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       notes: mockNotes,
  //       pagination: {
  //         totalPages: 1,
  //         currentPage: 1,
  //         totalNotes: 2,
  //         hasNextPage: false,
  //         hasPrevPage: false,
  //       },
  //     });
  //   });

  //   it("should handle errors when getting user notes", async () => {
  //     const error = new Error("Failed to fetch user notes");
  //     (NoteService.fetchUserNotes as jest.Mock).mockRejectedValue(error);

  //     const query = { page: "1", limit: "10" };
  //     await expect(
  //       NoteController.getUserNotes(
  //         { ...mockRequest, query } as TypedRequest<
  //           {},
  //           {},
  //           { page: string; limit: string }
  //         >,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow("Failed to fetch user notes");
  //   });
  // });

  // describe("getUserRecentNotes", () => {
  //   it("should get user recent notes successfully", async () => {
  //     const mockNotes = [
  //       { _id: "noteId1", title: "Recent Note 1" },
  //       { _id: "noteId2", title: "Recent Note 2" },
  //     ];
  //     (NoteService.fetchRecentNotes as jest.Mock).mockResolvedValue(mockNotes);

  //     await NoteController.getUserRecentNotes(
  //       mockRequest as TypedRequest,
  //       mockResponse as Response
  //     );

  //     expect(NoteService.fetchRecentNotes).toHaveBeenCalledWith({
  //       userId: "mockUserId",
  //       limit: 2,
  //       sort: { by: "createdAt", order: "desc" },
  //     });
  //     expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockJson).toHaveBeenCalledWith({ notes: mockNotes });
  //   });

  //   it("should handle errors when getting user recent notes", async () => {
  //     const error = new Error("Failed to fetch recent notes");
  //     (NoteService.fetchRecentNotes as jest.Mock).mockRejectedValue(error);

  //     await expect(
  //       NoteController.getUserRecentNotes(
  //         mockRequest as TypedRequest,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow("Failed to fetch recent notes");
  //   });
  // });

  // describe("getRecentlyUpdatedNotes", () => {
  //   it("should get recently updated notes successfully", async () => {
  //     const mockNotes = [
  //       { _id: "noteId1", title: "Updated Note 1" },
  //       { _id: "noteId2", title: "Updated Note 2" },
  //     ];
  //     (NoteService.fetchRecentNotes as jest.Mock).mockResolvedValue(mockNotes);

  //     await NoteController.getRecentlyUpatedNotes(
  //       mockRequest as TypedRequest,
  //       mockResponse as Response
  //     );

  //     expect(NoteService.fetchRecentNotes).toHaveBeenCalledWith({
  //       userId: "mockUserId",
  //       limit: 2,
  //       sort: { by: "updatedAt", order: "desc" },
  //     });
  //     expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockJson).toHaveBeenCalledWith({ notes: mockNotes });
  //   });

  //   it("should handle errors when getting recently updated notes", async () => {
  //     const error = new Error("Failed to fetch recently updated notes");
  //     (NoteService.fetchRecentNotes as jest.Mock).mockRejectedValue(error);

  //     await expect(
  //       NoteController.getRecentlyUpatedNotes(
  //         mockRequest as TypedRequest,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow("Failed to fetch recently updated notes");
  //   });
  // });

  // describe("getNotesByVideoId", () => {
  //   it("should get notes by video id successfully", async () => {
  //     const mockNotes = [
  //       { _id: "noteId1", title: "Video Note 1" },
  //       { _id: "noteId2", title: "Video Note 2" },
  //     ];
  //     const mockResult = { notes: mockNotes, notesCount: 2, totalPages: 1 };
  //     (NoteService.fetchNotesByVideoId as jest.Mock).mockResolvedValue(
  //       mockResult
  //     );

  //     const params: VideoIdParam = { youtubeId: "videoId" };
  //     const query = { page: "1", limit: "10" };
  //     await NoteController.getNotesByVideoId(
  //       { ...mockRequest, params, query } as TypedRequest<
  //         {},
  //         VideoIdParam,
  //         { page: string; limit: string }
  //       >,
  //       mockResponse as Response
  //     );

  //     expect(NoteService.fetchNotesByVideoId).toHaveBeenCalledWith({
  //       userId: "mockUserId",
  //       videoId: "videoId",
  //       skip: 0,
  //       limit: 10,
  //       sort: { by: "createdAt", order: "desc" },
  //     });
  //     expect(mockStatus).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       notes: mockNotes,
  //       pagination: {
  //         totalPages: 1,
  //         currentPage: 1,
  //         totalNotes: 2,
  //         hasNextPage: false,
  //         hasPrevPage: false,
  //       },
  //     });
  //   });

  //   it("should handle errors when getting notes by video id", async () => {
  //     const error = new Error("Failed to fetch notes by video id");
  //     (NoteService.fetchNotesByVideoId as jest.Mock).mockRejectedValue(error);

  //     const params: VideoIdParam = { youtubeId: "videoId" };
  //     const query = { page: "1", limit: "10" };
  //     await expect(
  //       NoteController.getNotesByVideoId(
  //         { ...mockRequest, params, query } as TypedRequest<
  //           {},
  //           VideoIdParam,
  //           { page: string; limit: string }
  //         >,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow("Failed to fetch notes by video id");
  //   });
  // });
});
