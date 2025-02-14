import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import {
  type CreateVideoDto,
  type Video,
  type YoutubeVideoData,
  videoController,
} from "@modules/video";

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

describe("Video routes tests", () => {
  const mockUserOneId = "user_id_001";
  const mockUserTwoId = "user_id_002";

  const mockVideos: Video[] = [
    {
      id: "video_001",
      youtubeId: "youtube_id_01",
      channelTitle: "Channel 1",
      description: "Video description",
      tags: ["tag1", "tag2"],
      thumbnails: {
        default: {
          url: "url",
          width: 120,
          height: 90,
        },
        medium: {
          url: "url",
          width: 320,
          height: 180,
        },
        high: {
          url: "url",
          width: 480,
          height: 360,
        },
        standard: {
          url: "url",
          width: 640,
          height: 480,
        },
        maxres: {
          url: "url",
          width: 1280,
          height: 720,
        },
      },
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
      thumbnails: {
        default: {
          url: "url",
          width: 120,
          height: 90,
        },
        medium: {
          url: "url",
          width: 320,
          height: 180,
        },
        high: {
          url: "url",
          width: 480,
          height: 360,
        },
        standard: {
          url: "url",
          width: 640,
          height: 480,
        },
        maxres: {
          url: "url",
          width: 1280,
          height: 720,
        },
      },
      title: "Video 2",
      embedHtmlPlayer: "embed_html",
      userIds: [mockUserTwoId],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockYoutubeVideoData: YoutubeVideoData = {
    title: "Video 3",
    description: "Video description",
    channelTitle: "Channel 1",
    thumbnails: {
      default: {
        url: "url",
        width: 120,
        height: 90,
      },
      medium: {
        url: "url",
        width: 320,
        height: 180,
      },
      high: {
        url: "url",
        width: 480,
        height: 360,
      },
      standard: {
        url: "url",
        width: 640,
        height: 480,
      },
      maxres: {
        url: "url",
        width: 1280,
        height: 720,
      },
    },
    tags: ["tag1", "tag2"],
    embedHtmlPlayer: "embed_html",
  };

  const createVideoDto: CreateVideoDto = {
    userId: mockUserOneId,
    youtubeVideoId: "youtube_id_03",
    videoData: mockYoutubeVideoData,
  };

  const _mockNewVideo: Video = {
    id: "video_003",
    youtubeId: "youtube_id_03",
    userIds: [mockUserOneId],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...createVideoDto.videoData,
  };

  const _mockVideosCount = mockVideos.length;
  beforeAll(() => {
    // Mock the videoController.getVideos method
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
            limit: 10,
            totalItems: videos.length,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
          },
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

      expect(res.body.data).toHaveLength(1);
    });
  });
});
