import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { type Video, videoController } from "@modules/video";

// **********************************************
// MOCK THE JSONWEBTOKEN MODULE TO SIMULATE TOKEN VERIFICATION
// **********************************************
jest.mock("jsonwebtoken", () => {
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
          callback(null, { userId: "user_id_001" });
        } else {
          callback(new Error("Invalid token"), null);
        }
      }
    ),
  };
});

describe("Video routes tests", () => {
  const mockUserOneId = "user_id_001";
  const mockUserTwoId = "user_id_002";
  const thumbnails = {
    default: { url: "url", width: 120, height: 90 },
    medium: { url: "url", width: 320, height: 180 },
    high: { url: "url", width: 480, height: 360 },
    standard: { url: "url", width: 640, height: 480 },
    maxres: { url: "url", width: 1280, height: 720 },
  };

  const mockVideos: Video[] = [
    {
      id: "video_001",
      youtubeId: "youtube_id_01",
      channelTitle: "Channel 1",
      description: "Video description",
      tags: ["tag1", "tag2"],
      thumbnails,
      title: "Video 1",
      embedHtmlPlayer: "embed_html",
      userIds: [mockUserOneId],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "video_002",
      youtubeId: "youtube_id_01",
      channelTitle: "Channel 2",
      description: "Video description",
      tags: ["tag1", "tag2"],
      thumbnails,
      title: "Video 2",
      embedHtmlPlayer: "embed_html",
      userIds: [mockUserTwoId],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeAll(() => {
    // Mock GET /videos for the authenticated user.
    (videoController.getUserVideos as jest.Mock) = jest
      .fn()
      .mockImplementation((req, res) => {
        const videos = mockVideos.filter((video) =>
          video.userIds?.includes(req.userId)
        );
        const currentPage = Number(req.query.page) || 1;
        const totalPages = Math.ceil(videos.length / 10);
        return res.status(httpStatus.OK).json({
          success: true,
          data: videos,
          pagination: {
            currentPage,
            totalItems: videos.length,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
          },
        });
      });

    // Mock GET /videos/:id for the authenticated user.
    (videoController.getVideoByIdOrCreate as jest.Mock) = jest
      .fn()
      .mockImplementation((req, res) => {
        // Only return the video if it belongs to the authenticated user.
        const video = mockVideos.find(
          (v) => v.id === req.params.id && v.userIds?.includes(req.userId)
        );
        if (!video) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            error: { message: "Video not found." },
          });
        }
        return res.status(httpStatus.OK).json({
          success: true,
          data: video,
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
      const res = await request(app).get("/api/v1/videos");

      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED);

      expect(res.body.error.message).toMatch(/authenticated/);

      expect(videoController.getUserVideos).not.toHaveBeenCalled();
    });

    it("should return 401 if the Authorization header does not start with 'Bearer '", async () => {
      const res = await request(app)
        .get("/api/v1/videos")
        .set("Authorization", "Token valid-token");

      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED);

      expect(res.body.error.message).toMatch(/authenticated/);

      expect(videoController.getUserVideos).not.toHaveBeenCalled();
    });

    it("should return 401 if the token is invalid", async () => {
      const res = await request(app)
        .get("/api/v1/videos")
        .set("Authorization", "Bearer invalid-token");

      expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED);

      expect(res.body.error.message).toMatch(/Unauthorized/);

      expect(videoController.getUserVideos).not.toHaveBeenCalled();
    });

    it("should authenticate successfully with a valid token", async () => {
      const res = await request(app)
        .get("/api/v1/videos")
        .set("Authorization", "Bearer valid-token")
        .expect(httpStatus.OK);

      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("pagination");

      // Only videos for user_id_001 should be returned.
      expect(res.body.data).toHaveLength(1);
    });
  });

  // **********************************************
  // GET /api/v1/videos
  // **********************************************
  describe("GET /api/v1/videos", () => {
    it("should get all videos for the authenticated user", async () => {
      const res = await request(app)
        .get("/api/v1/videos")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");

      // Only video_001 belongs to user_id_001.
      expect(res.body.data).toHaveLength(1);
      expect(res.body).toHaveProperty("pagination");

      expect(videoController.getUserVideos).toHaveBeenCalled();
    });

    it("should handle pagination query parameters", async () => {
      const res = await request(app)
        .get("/api/v1/videos?page=1")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.pagination).toHaveProperty("currentPage", 1);
      expect(videoController.getUserVideos).toHaveBeenCalled();
    });

    it("should return 400 for invalid pagination parameters", async () => {
      const res = await request(app)
        .get("/api/v1/videos?page=invalid&limit=invalid")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should return 400 for invalid query parameters", async () => {
      const res = await request(app)
        .get("/api/v1/videos?invalidParam=true")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should propagate errors from the controller", async () => {
      (videoController.getUserVideos as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
      });

      const res = await request(app)
        .get("/api/v1/videos")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // **********************************************
  // GET /api/v1/videos/:id
  // **********************************************
  describe("GET /api/v1/videos/:id", () => {
    it("should get a video by ID for the authenticated user", async () => {
      const res = await request(app)
        .get("/api/v1/videos/video_001")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.OK);
      expect(res.body.success).toEqual(true);
      expect(res.body.data).toHaveProperty("id", "video_001");
      expect(videoController.getVideoByIdOrCreate).toHaveBeenCalled();
    });

    it("should return 404 if the video is not found for the authenticated user", async () => {
      // video_002 does not belong to user_id_001.
      const res = await request(app)
        .get("/api/v1/videos/video_002")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
      expect(res.body.success).toEqual(false);
      expect(videoController.getVideoByIdOrCreate).toHaveBeenCalled();
    });

    it("should propagate errors from the controller", async () => {
      (videoController.getVideoByIdOrCreate as jest.Mock).mockImplementation(
        () => {
          throw new Error("Test error");
        }
      );

      const res = await request(app)
        .get("/api/v1/videos/video_001")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
