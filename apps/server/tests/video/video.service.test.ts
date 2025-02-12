import {
  CreateVideoDto,
  FindVideoDto,
  IVideoRepository,
  IVideoService,
  Video,
  VideoService,
  YoutubeVideoData,
} from "../../src/modules/video";

import type { FindManyDto } from "../../src/common/dtos/find-many.dto";

describe("VideoService methods tests cases", () => {
  let videoService: IVideoService;
  let mockVideoRepository: IVideoRepository;

  beforeEach(() => {
    mockVideoRepository = {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findByYoutubeId: jest.fn(),
      connectVideoToUser: jest.fn(),
    };

    videoService = new VideoService(mockVideoRepository);
  });

  const mockUserId = "user_id_001";
  const mockVideosCount = 2;

  const mockVideos: Video[] = [
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
      userIds: [mockUserId],
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
      userIds: [mockUserId],
    },
  ];

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("videoService - getUserVideos", () => {
    const findManyDto: FindManyDto = {
      userId: "user_123",
      limit: 2,
      skip: 0,
      sort: { by: "createdAt", order: "desc" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return videos for a specific user", async () => {
      (mockVideoRepository.findMany as jest.Mock).mockResolvedValue(mockVideos);
      (mockVideoRepository.count as jest.Mock).mockResolvedValue(
        mockVideosCount
      );

      const result = await videoService.getUserVideos(findManyDto);

      const totalPages = Math.ceil(mockVideosCount / findManyDto.limit);

      expect(mockVideoRepository.findMany).toHaveBeenCalledWith(findManyDto);

      expect(result.videos).toEqual(mockVideos);
      expect(result.videosCount).toBe(mockVideosCount);
      expect(result.totalPages).toBe(totalPages);
    });

    it("should return empty videos list and total pages as 0 when no videos found", async () => {
      (mockVideoRepository.findMany as jest.Mock).mockResolvedValue([]);
      (mockVideoRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await videoService.getUserVideos(findManyDto);

      expect(mockVideoRepository.findMany).toHaveBeenCalledWith(findManyDto);

      expect(result.videos).toEqual([]);
      expect(result.videosCount).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe("VideoService - findVideoByYoutubeId", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return video if found in the database", async () => {
      const videoId = "video_001";
      const mockVideo = mockVideos[0];

      (mockVideoRepository.findByYoutubeId as jest.Mock).mockResolvedValue(
        mockVideo
      );

      const result = await videoService.findVideoByYoutubeId(videoId);

      expect(mockVideoRepository.findByYoutubeId).toHaveBeenCalledWith(videoId);

      expect(result).toEqual(mockVideo);
    });

    it("should return null if no video found", async () => {
      const videoId = "video_004";

      (mockVideoRepository.findByYoutubeId as jest.Mock).mockResolvedValue(
        null
      );

      const result = await videoService.findVideoByYoutubeId(videoId);

      expect(mockVideoRepository.findByYoutubeId).toHaveBeenCalledWith(videoId);

      expect(result).toBeNull();
    });
  });

  describe("VideoService - createVideo", () => {
    const youtubeVideoId = "youtube_id_01";
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

    const createVideoDto: CreateVideoDto = {
      userId: mockUserId,
      youtubeVideoId: youtubeVideoId,
      videoData: mockYoutubeVideoData,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create a new video entry", async () => {
      jest
        .spyOn(videoService, "fetchYoutubeVideoData")
        .mockResolvedValue(mockYoutubeVideoData);

      (mockVideoRepository.create as jest.Mock).mockResolvedValue(
        mockVideos[0]
      );

      const result = await videoService.createVideo(mockUserId, youtubeVideoId);

      expect(mockVideoRepository.create).toHaveBeenCalledWith(createVideoDto);

      expect(result).toEqual(mockVideos[0]);
    });
  });

  describe("VideoService - linkVideoToUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should link a video to a new user", async () => {
      const video = mockVideos[0];

      const newUserId = "user_id_100";

      const updatedVideo = {
        ...mockVideos[0],
        userIds: [...(mockVideos[0].userIds || []), newUserId],
      };

      (mockVideoRepository.connectVideoToUser as jest.Mock).mockResolvedValue(
        updatedVideo
      );

      const result = await videoService.linkVideoToUser(video, newUserId);

      expect(mockVideoRepository.connectVideoToUser).toHaveBeenCalledWith(
        video.id,
        newUserId
      );

      expect(result).toEqual(updatedVideo);
      expect(result.userIds).toContain(newUserId);
    });
  });

  describe("VideoService - findVideoOrCreate", () => {
    const mockUserId = "user_id_001";
    const mockYoutubeId = "youtube_id_01";

    const findVideoDto: FindVideoDto = {
      youtubeVideoId: mockYoutubeId,
      userId: mockUserId,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    // it("should throw a BadRequestError if video ID is not provided", async () => {
    //   jest.spyOn(videoService, "findVideoByYoutubeId").mockResolvedValue(null);

    //   await expect(videoService.findVideo(findVideoDto)).rejects.toThrow(
    //     new BadRequestError(ERROR_MESSAGES.BAD_REQUEST)
    //   );

    //   expect(videoService.findVideoByYoutubeId).not.toHaveBeenCalled();
    // });

    it("should return video data if found in the database and the user is already linked to this video", async () => {
      jest
        .spyOn(videoService, "findVideoByYoutubeId")
        .mockResolvedValue(mockVideos[0]);

      const result = await videoService.findVideoOrCreate(findVideoDto);

      expect(result).toEqual(mockVideos[0]);

      expect(videoService.findVideoByYoutubeId).toHaveBeenCalledWith(
        mockYoutubeId
      );
    });

    // it("should return video data if found in the database and link the user to the video", async () => {
    //   const mockNewUserId = "user_124";
    //   const mockUpdatedVideo: Video = {
    //     ...mockVideos[0],
    //     userIds: [...(mockVideos[0].userIds || []), mockNewUserId],
    //   };

    //   jest
    //     .spyOn(videoService, "findVideoByYoutubeId")
    //     .mockResolvedValue(mockVideos[0]);

    //   jest
    //     .spyOn(videoService, "linkVideoToUser")
    //     .mockResolvedValue(mockUpdatedVideo);

    //   const result = await videoService.findVideo(findVideoDto);

    //   expect(result).toEqual(mockUpdatedVideo);

    //   expect(videoService.findVideoByYoutubeId).toHaveBeenCalledWith(
    //     mockYoutubeId
    //   );

    //   expect(videoService.linkVideoToUser).toHaveBeenCalledWith(
    //     mockVideos[0],
    //     mockNewUserId
    //   );
    // });

    // it("should create a new video entry and link the user to it if no video found in the database", async () => {
    //   const mockNewYoutubeId = "youtube_id_002";
    //   const mockNewUserId = "user_124";

    //   const mockNewVideo: Video = {
    //     ...mockVideos[1],
    //     id: "video_003",
    //     youtubeVideoId: mockNewYoutubeId,
    //   };

    //   const mockLinkedVideo: Video = {
    //     ...mockNewVideo,
    //     userIds: [...(mockNewVideo.userIds || []), mockNewUserId],
    //   };

    //   jest.spyOn(videoService, "findVideoByYoutubeId").mockResolvedValue(null);

    //   jest.spyOn(videoService, "createVideo").mockResolvedValue(mockNewVideo);

    //   jest
    //     .spyOn(videoService, "linkVideoToUser")
    //     .mockResolvedValue(mockLinkedVideo);

    //   const result = await videoService.findVideo(findVideoDto);

    //   expect(videoService.findVideoByYoutubeId).toHaveBeenCalledWith(
    //     mockNewYoutubeId
    //   );

    //   expect(videoService.createVideo).toHaveBeenCalledWith({
    //     userId: mockNewUserId,
    //     youtubeVideoId: mockNewYoutubeId,
    //   });

    //   expect(videoService.linkVideoToUser).toHaveBeenCalledWith(
    //     mockNewVideo,
    //     mockNewUserId
    //   );

    //   expect(result).toEqual(mockLinkedVideo);

    //   expect(result.userIds).toContain(mockNewUserId);
    // });
  });
});
