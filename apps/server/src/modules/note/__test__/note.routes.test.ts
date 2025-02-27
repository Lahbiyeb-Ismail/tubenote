import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { type Note, noteController } from "@modules/note";

import type { ICreateBodyDto, IUpdateBodyDto } from "@/modules/shared";

// **********************************************
// MOCK THE JSONWEBTOKEN MODULE TO SIMULATE TOKEN VERIFICATION
// **********************************************
jest.mock("jsonwebtoken", () => {
  // Get the actual module to spread the rest of its exports.
  const actualJwt = jest.requireActual("jsonwebtoken");
  return {
    ...actualJwt,
    verify: jest.fn(
      (
        token: string,
        _secret: string,
        callback: (err: Error | null, payload?: any) => void
      ) => {
        if (token === "valid-token") {
          // Simulate a successful verification with a payload.
          callback(null, { userId: "user_id_001" });
        } else {
          // Simulate an error during verification.
          callback(new Error("Invalid token"), null);
        }
      }
    ),
  };
});

describe("Note Routes Tests", () => {
  const mockUserId = "user_id_001";

  const mockNotes: Note[] = [
    {
      id: "note_id_001",
      title: "Note 1",
      content: "Note Content 001",
      videoId: "video_id_001",
      userId: mockUserId,
      thumbnail: "thumbnail_url",
      timestamp: 12,
      videoTitle: "Video Title",
      youtubeId: "youtube_id_001",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "note_id_002",
      title: "Note 2",
      content: "Note Content 002",
      videoId: "video_id_002",
      userId: mockUserId,
      thumbnail: "thumbnail_url",
      timestamp: 10,
      videoTitle: "Another Video Title",
      youtubeId: "another_youtube_id_002",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeAll(() => {
    (noteController.getUserNotes as jest.Mock) = jest.fn();
    (noteController.getUserNotes as jest.Mock).mockImplementation(
      (req, res) => {
        const notes = mockNotes.filter((note) => note.userId === req.userId);

        const currentPage = Number(req.query.page) || 1;
        const totalPages = Math.ceil(notes.length / 10);

        return res.status(httpStatus.OK).json({
          success: true,
          data: notes,
          pagination: {
            currentPage,
            limit: 10,
            totalItems: notes.length,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
          },
        });
      }
    );

    (noteController.createNote as jest.Mock) = jest.fn();
    (noteController.createNote as jest.Mock).mockImplementation((_req, res) => {
      return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Note created successfully.",
        data: mockNotes[0],
      });
    });

    (noteController.getUserRecentNotes as jest.Mock) = jest.fn();
    (noteController.getUserRecentNotes as jest.Mock).mockImplementation(
      (req, res) => {
        const notes = mockNotes.filter((note) => note.userId === req.userId);

        return res.status(httpStatus.OK).json({
          success: true,
          data: notes,
        });
      }
    );

    (noteController.getRecentlyUpdatedNotes as jest.Mock) = jest.fn();
    (noteController.getRecentlyUpdatedNotes as jest.Mock).mockImplementation(
      (req, res) => {
        const notes = mockNotes.filter((note) => note.userId === req.userId);
        return res.status(httpStatus.OK).json({
          success: true,
          data: notes,
        });
      }
    );

    (noteController.getNotesByVideoId as jest.Mock) = jest.fn();
    (noteController.getNotesByVideoId as jest.Mock).mockImplementation(
      (req, res) => {
        const notes = mockNotes
          .filter((note) => note.userId === req.userId)
          .filter((note) => note.videoId === req.params.id);

        const totalPages = Math.ceil(notes.length / 10);
        const currentPage = Number(req.query.page) || 1;

        return res.status(httpStatus.OK).json({
          success: true,
          data: notes,
          pagination: {
            totalPages,
            currentPage,
            totalItems: notes.length,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
          },
        });
      }
    );

    (noteController.getNoteById as jest.Mock) = jest.fn();
    (noteController.getNoteById as jest.Mock).mockImplementation((req, res) => {
      const note = mockNotes.find((n) => n.id === req.params.id);

      if (!note) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          error: {
            message: "Note not found.",
          },
        });
      }

      return res.status(httpStatus.OK).json({
        success: true,
        data: note,
      });
    });

    (noteController.updateNote as jest.Mock) = jest.fn();
    (noteController.updateNote as jest.Mock).mockImplementation((req, res) => {
      const foundNote = mockNotes.find((n) => n.id === req.params.id);

      if (!foundNote) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          error: {
            message: "Note not found.",
          },
        });
      }

      const updatedNote = { ...foundNote, ...req.body };

      return res.status(httpStatus.OK).json({
        success: true,
        data: updatedNote,
        message: "Note updated successfully.",
      });
    });

    (noteController.deleteNote as jest.Mock) = jest.fn();
    (noteController.deleteNote as jest.Mock).mockImplementation((req, res) => {
      const note = mockNotes.find((n) => n.id === req.params.id);

      if (!note) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          error: {
            message: "Note not found.",
          },
        });
      }

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Note deleted successfully.",
      });
    });

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // **********************************************
  // Authentication Middleware Tests
  // **********************************************
  describe("Authentication Middleware", () => {
    it("should return 401 if the Authorization header is missing", async () => {
      const res = await request(app).get("/api/v1/notes");

      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED);

      expect(res.body.error.message).toMatch(/authenticated/);

      expect(noteController.getUserNotes).not.toHaveBeenCalled();
    });

    it("should return 401 if the Authorization header does not start with 'Bearer '", async () => {
      const res = await request(app)
        .get("/api/v1/notes")
        .set("Authorization", "Token valid-token");

      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED);

      expect(res.body.error.message).toMatch(/authenticated/);

      expect(noteController.getUserNotes).not.toHaveBeenCalled();
    });

    it("should return 401 if the token is invalid", async () => {
      const res = await request(app)
        .get("/api/v1/notes")
        .set("Authorization", "Bearer invalid-token");

      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED);

      expect(res.body.error.message).toMatch(/Unauthorized/);

      expect(noteController.getUserNotes).not.toHaveBeenCalled();
    });

    it("should authenticate successfully with a valid token", async () => {
      const res = await request(app)
        .get("/api/v1/notes")
        .set("Authorization", "Bearer valid-token")
        .expect(httpStatus.OK);

      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveLength(mockNotes.length);
    });
  });

  // **********************************************
  // GET /api/v1/notes
  // **********************************************
  describe("GET /api/v1/notes", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("should get all notes for the authenticated user", async () => {
      const res = await request(app)
        .get("/api/v1/notes")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);

      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveLength(mockNotes.length);

      expect(res.body).toHaveProperty("pagination");

      expect(noteController.getUserNotes).toHaveBeenCalled();
    });

    it("should handle pagination", async () => {
      const res = await request(app)
        .get("/api/v1/notes?page=1&limit=10")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);

      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveLength(Math.min(mockNotes.length, 10));

      expect(res.body).toHaveProperty("pagination");

      expect(noteController.getUserNotes).toHaveBeenCalled();
    });

    it("should return 400 for invalid pagination parameters value", async () => {
      const res = await request(app)
        .get("/api/v1/notes?page=invalid&limit=invalid")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should return 400 for invalid query parameters", async () => {
      const res = await request(app)
        .get("/api/v1/notes?invalidParam=true")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should propagate errors from the controller", async () => {
      (noteController.getUserNotes as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
      });

      const res = await request(app)
        .get("/api/v1/notes")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // **********************************************
  // POST /api/v1/notes
  // **********************************************
  describe("POST /api/v1/notes", () => {
    const newNoteBody: ICreateBodyDto<Note> = {
      title: "Note 1",
      content: "Note Content 001",
      videoTitle: "Video Title",
      thumbnail: "thumbnail_url",
      videoId: "video_id_001",
      youtubeId: "youtube_id_001",
      timestamp: 12,
    };

    it("should create a new note", async () => {
      const res = await request(app)
        .post("/api/v1/notes")
        .set("Authorization", "Bearer valid-token")
        .send(newNoteBody);

      expect(res.statusCode).toEqual(httpStatus.CREATED);
      expect(res.body.success).toEqual(true);

      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("userId", mockUserId);
    });

    it("should return 400 for invalid data body", async () => {
      const invalidNoteBody = { title: "" };

      const res = await request(app)
        .post("/api/v1/notes")
        .set("Authorization", "Bearer valid-token")
        .send(invalidNoteBody);

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should return 400 for a missing data body", async () => {
      const res = await request(app)
        .post("/api/v1/notes")
        .set("Authorization", "Bearer valid-token")
        .send();

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should propagate errors from the controller", async () => {
      (noteController.createNote as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
      });

      const res = await request(app)
        .post("/api/v1/notes")
        .set("Authorization", "Bearer valid-token")
        .send(newNoteBody);

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // **********************************************
  // GET /api/v1/notes/recent
  // **********************************************
  describe("GET /api/v1/api/v1/notes/recent", () => {
    it("should get recent notes", async () => {
      const res = await request(app)
        .get("/api/v1/notes/recent")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);

      expect(res.body.data).toHaveLength(2);
    });

    it("should propagate errors from the controller", async () => {
      (noteController.getUserRecentNotes as jest.Mock).mockImplementation(
        () => {
          throw new Error("Test error");
        }
      );

      const res = await request(app)
        .get("/api/v1/notes/recent")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // **********************************************
  // GET /api/v1/notes/recently-updated
  // **********************************************
  describe("GET /api/v1/notes/recently-updated", () => {
    it("should get recently updated notes", async () => {
      const res = await request(app)
        .get("/api/v1/notes/recently-updated")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);

      expect(res.body).toHaveProperty("data");
    });

    it("should propagate errors from the controller", async () => {
      (noteController.getRecentlyUpdatedNotes as jest.Mock).mockImplementation(
        () => {
          throw new Error("Test error");
        }
      );

      const res = await request(app)
        .get("/api/v1/notes/recently-updated")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // **********************************************
  // GET /api/v1/notes/video/:id
  // **********************************************
  describe("GET /api/v1/notes/video/:id", () => {
    const mockVideoId = "video_id_002";

    it("should get notes for a given video ID with valid query", async () => {
      const res = await request(app)
        .get(
          `/api/v1/notes/video/${mockVideoId}?page=1&limit=8&sortBy=createdAt&order=desc`
        )
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");

      res.body.data.forEach((note: Note) => {
        expect(note).toHaveProperty("videoId", mockVideoId);
      });
    });

    it("should return 400 for invalid query parameters", async () => {
      const res = await request(app)
        .get(`/api/v1/notes/video/${mockVideoId}?invalidParam=true`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should propagate errors from the controller", async () => {
      (noteController.getNotesByVideoId as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
      });

      const res = await request(app)
        .get(`/api/v1/notes/video/${mockVideoId}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // **********************************************
  // GET /api/v1/notes/:id
  // **********************************************
  describe("GET /api/v1/notes:id", () => {
    const noteId = "note_id_001";

    it("should get a specific note by ID", async () => {
      const res = await request(app)
        .get(`/api/v1/notes/${noteId}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);
      expect(res.body.data).toHaveProperty("id", noteId);
    });

    it("should return 404 if note not found", async () => {
      const res = await request(app)
        .get(`/api/v1/notes/nonexistentId`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
    });

    it("should propagate errors from the controller", async () => {
      (noteController.getNoteById as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
      });

      const res = await request(app)
        .get(`/api/v1/notes/${noteId}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // **********************************************
  // PATCH /api/v1/notes/:id
  // **********************************************
  describe("PATCH /api/v1/notes/:id", () => {
    const noteId = "note_id_001";

    it("should update a note with a valid id and request body", async () => {
      const updatedNoteBody: IUpdateBodyDto<Note> = {
        title: "Updated Title",
        content: "Updated Content",
      };

      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}`)
        .set("Authorization", "Bearer valid-token")
        .send(updatedNoteBody);

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);

      expect(res.body.data).toHaveProperty("id", noteId);

      expect(res.body.data).toHaveProperty("title", updatedNoteBody.title);

      expect(res.body.data).toHaveProperty("content", updatedNoteBody.content);
    });

    it("should return 404 if note not found", async () => {
      const res = await request(app)
        .patch(`/api/v1/notes/nonexistentId`)
        .set("Authorization", "Bearer valid-token")
        .send({ title: "Updated Title" });

      expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
    });

    it("should return 400 for an invalid request body", async () => {
      const invalidNote = { title: "" };

      const res = await request(app)
        .patch(`/api/v1/notes/${noteId}`)
        .set("Authorization", "Bearer valid-token")
        .send(invalidNote);

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });
  });

  // **********************************************
  // DELETE /api/v1/notes/:id
  // **********************************************
  describe("DELETE /api/v1/notes:id", () => {
    const noteId = "note_id_002";
    it("should delete a note", async () => {
      const res = await request(app)
        .delete(`/api/v1/notes/${noteId}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);
    });

    it("should return 404 if note not found", async () => {
      const res = await request(app)
        .delete(`/api/v1/notes/nonexistentId`)
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
    });
  });
});
