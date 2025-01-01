import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { BadRequestError, NotFoundError } from "../../src/errors";
import type {
  FindUserVideosParams,
  VideoEntry,
  YoutubeVideoData,
} from "../../src/modules/video/video.type";
import VideoDB from "../../src/modules/video/videoDB";
import VideoService from "../../src/modules/video/videoService";

jest.mock("../../src/modules/video/videoDB");

describe("VideoService methods tests cases", () => {
  const mockVideos: VideoEntry[] = [
    {
      id: "video_001",
      youtubeId: "youtube_id_01",
      snippet: {
        categoryId: "1",
        channelId: "channel_id_01",
        channelTitle: "Channel 1",
        description: "Video description",
        liveBroadcastContent: "none",
        publishedAt: "2021-01-01T00:00:00Z",
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
      },
      statistics: {
        commentCount: "0",
        favoriteCount: "0",
        likeCount: "0",
        viewCount: "0",
      },
      player: {
        embedHtml: "embed_html",
      },
      userIds: ["user_123"],
    },
    {
      id: "video_002",
      youtubeId: "youtube_id_01",
      snippet: {
        categoryId: "1",
        channelId: "channel_id_02",
        channelTitle: "Channel 2",
        description: "Video description",
        liveBroadcastContent: "none",
        publishedAt: "2021-01-01T00:00:00Z",
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
      },
      statistics: {
        commentCount: "0",
        favoriteCount: "0",
        likeCount: "0",
        viewCount: "0",
      },
      player: {
        embedHtml: "embed_html",
      },
      userIds: ["user_123"],
    },
  ];

  const mockVideosCount = 2;

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("findUserVideos method test cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return videos for a specific user", async () => {
      const findUserVideosParams: FindUserVideosParams = {
        userId: "user_123",
        limit: 2,
        skip: 0,
      };

      (VideoDB.findMany as jest.Mock).mockResolvedValue(mockVideos);
      (VideoDB.count as jest.Mock).mockResolvedValue(mockVideosCount);

      const result = await VideoService.findUserVideos({
        ...findUserVideosParams,
      });

      const totalPages = Math.ceil(
        mockVideosCount / findUserVideosParams.limit
      );

      expect(VideoDB.findMany).toHaveBeenCalledWith({
        ...findUserVideosParams,
      });

      expect(result.videos).toEqual(mockVideos);
      expect(result.videosCount).toBe(mockVideosCount);
      expect(result.totalPages).toBe(totalPages);
    });

    it("should return empty videos list and total pages as 0 when no videos found", async () => {
      const findUserVideosParams: FindUserVideosParams = {
        userId: "user_001",
        limit: 2,
        skip: 0,
      };

      (VideoDB.findMany as jest.Mock).mockResolvedValue([]);
      (VideoDB.count as jest.Mock).mockResolvedValue(0);

      const result = await VideoService.findUserVideos({
        ...findUserVideosParams,
      });

      expect(VideoDB.findMany).toHaveBeenCalledWith({
        ...findUserVideosParams,
      });

      expect(result.videos).toEqual([]);
      expect(result.videosCount).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe("findVideoByYoutubeId method test cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return video if found in the database", async () => {
      const videoId = "video_001";
      const mockVideo = mockVideos[0];

      (VideoDB.findByYoutubeId as jest.Mock).mockResolvedValue(mockVideo);

      const result = await VideoService.findVideoByYoutubeId(videoId);

      expect(VideoDB.findByYoutubeId).toHaveBeenCalledWith(videoId);

      expect(result).toEqual(mockVideo);
    });

    it("should return null if no video found", async () => {
      const videoId = "video_004";

      (VideoDB.findByYoutubeId as jest.Mock).mockResolvedValue(null);

      const result = await VideoService.findVideoByYoutubeId(videoId);

      expect(VideoDB.findByYoutubeId).toHaveBeenCalledWith(videoId);

      expect(result).toBeNull();
    });
  });

  describe("createVideo method test cases", () => {
    const youtubeId = "youtube_id_01";
    const userId = "user_123";
    const mockYoutubeVideoData: YoutubeVideoData = {
      snippet: {
        categoryId: "1",
        channelId: "channel_id_01",
        channelTitle: "Channel 1",
        description: "Video description",
        liveBroadcastContent: "none",
        publishedAt: "2021-01-01T00:00:00Z",
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
      },
      statistics: {
        commentCount: "0",
        favoriteCount: "0",
        likeCount: "0",
        viewCount: "0",
      },
      player: {
        embedHtml: "embed_html",
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create a new video entry", async () => {
      jest
        .spyOn(VideoService, "fetchYoutubeVideoData")
        .mockResolvedValue(mockYoutubeVideoData);

      (VideoDB.create as jest.Mock).mockResolvedValue(mockVideos[0]);

      const result = await VideoService.createVideo({ userId, youtubeId });

      expect(VideoService.fetchYoutubeVideoData).toHaveBeenCalledWith(
        youtubeId
      );

      expect(VideoDB.create).toHaveBeenCalledWith({
        userId,
        youtubeId,
        videoData: mockYoutubeVideoData,
      });

      expect(result).toEqual(mockVideos[0]);
    });

    it("should throw a NotFoundError if no video found for the provided YouTube ID", async () => {
      const nonExistingYoutubeId = "non_existing_youtube_id";
      jest
        .spyOn(VideoService, "fetchYoutubeVideoData")
        .mockRejectedValue(
          new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
        );

      await expect(
        VideoService.createVideo({ userId, youtubeId: nonExistingYoutubeId })
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(VideoService.fetchYoutubeVideoData).toHaveBeenCalledWith(
        nonExistingYoutubeId
      );

      expect(VideoDB.create).not.toHaveBeenCalled();
    });
  });

  describe("linkVideoToUser method test cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should link a video to a new user", async () => {
      const video = mockVideos[0];

      const newUserId = "user_124";

      const updatedVideo = {
        ...mockVideos[0],
        userIds: [...(mockVideos[0].userIds || []), newUserId],
      };

      (VideoDB.connectVideoToUser as jest.Mock).mockResolvedValue(updatedVideo);

      const result = await VideoService.linkVideoToUser(video, newUserId);

      expect(VideoDB.connectVideoToUser).toHaveBeenCalledWith(
        video.id,
        newUserId
      );

      expect(result).toEqual(updatedVideo);
      expect(result.userIds).toContain(newUserId);
    });
  });

  describe("getVideoData method test cases", () => {
    const mockUserId = "user_123";
    const mockYoutubeId = "youtube_id_01";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw a BadRequestError if video ID is not provided", async () => {
      jest.spyOn(VideoService, "findVideoByYoutubeId").mockResolvedValue(null);

      await expect(
        VideoService.getVideoData({ userId: mockUserId, youtubeId: "" })
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.BAD_REQUEST));

      expect(VideoService.findVideoByYoutubeId).not.toHaveBeenCalled();
    });

    it("should return video data if found in the database and the user is already linked to this video", async () => {
      jest
        .spyOn(VideoService, "findVideoByYoutubeId")
        .mockResolvedValue(mockVideos[0]);

      const result = await VideoService.getVideoData({
        youtubeId: mockYoutubeId,
        userId: mockUserId,
      });

      expect(result).toEqual(mockVideos[0]);

      expect(VideoService.findVideoByYoutubeId).toHaveBeenCalledWith(
        mockYoutubeId
      );
    });

    it("should return video data if found in the database and link the user to the video", async () => {
      const mockNewUserId = "user_124";
      const mockUpdatedVideo: VideoEntry = {
        ...mockVideos[0],
        userIds: [...(mockVideos[0].userIds || []), mockNewUserId],
      };

      jest
        .spyOn(VideoService, "findVideoByYoutubeId")
        .mockResolvedValue(mockVideos[0]);

      jest
        .spyOn(VideoService, "linkVideoToUser")
        .mockResolvedValue(mockUpdatedVideo);

      const result = await VideoService.getVideoData({
        youtubeId: mockYoutubeId,
        userId: mockNewUserId,
      });

      expect(result).toEqual(mockUpdatedVideo);

      expect(VideoService.findVideoByYoutubeId).toHaveBeenCalledWith(
        mockYoutubeId
      );

      expect(VideoService.linkVideoToUser).toHaveBeenCalledWith(
        mockVideos[0],
        mockNewUserId
      );
    });

    it("should create a new video entry and link the user to it if no video found in the database", async () => {
      const mockNewYoutubeId = "youtube_id_002";
      const mockNewUserId = "user_124";

      const mockNewVideo: VideoEntry = {
        ...mockVideos[1],
        id: "video_003",
        youtubeId: mockNewYoutubeId,
      };

      const mockLinkedVideo: VideoEntry = {
        ...mockNewVideo,
        userIds: [...(mockNewVideo.userIds || []), mockNewUserId],
      };

      jest.spyOn(VideoService, "findVideoByYoutubeId").mockResolvedValue(null);

      jest.spyOn(VideoService, "createVideo").mockResolvedValue(mockNewVideo);

      jest
        .spyOn(VideoService, "linkVideoToUser")
        .mockResolvedValue(mockLinkedVideo);

      const result = await VideoService.getVideoData({
        userId: mockNewUserId,
        youtubeId: mockNewYoutubeId,
      });

      expect(VideoService.findVideoByYoutubeId).toHaveBeenCalledWith(
        mockNewYoutubeId
      );

      expect(VideoService.createVideo).toHaveBeenCalledWith({
        userId: mockNewUserId,
        youtubeId: mockNewYoutubeId,
      });

      expect(VideoService.linkVideoToUser).toHaveBeenCalledWith(
        mockNewVideo,
        mockNewUserId
      );

      expect(result).toEqual(mockLinkedVideo);

      expect(result.userIds).toContain(mockNewUserId);
    });
  });
});
