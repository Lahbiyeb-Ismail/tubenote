import {
  CreateVideoDto,
  FindVideoDto,
  IVideoRepository,
  IVideoService,
  Video,
  VideoService,
} from "@modules/video";

import type { FindManyDto } from "@common/dtos/find-many.dto";

describe("VideoService methods tests cases", () => {
  let videoService: IVideoService;
  let mockVideoRepository: IVideoRepository;

  const mockUserId = "user_id_001";
  const mockNewUserId = "user_id_124";

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
      userIds: [mockUserId],
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
      userIds: [mockUserId],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const createVideoDto: CreateVideoDto = {
    userId: mockUserId,
    youtubeVideoId: "youtube_id_03",
    videoData: {
      description: "Video description",
      tags: ["tag1", "tag2"],
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
      title: "Video 3",
      embedHtmlPlayer: "embed_html",
    },
  };

  const mockNewVideo: Video = {
    id: "video_003",
    youtubeId: "youtube_id_03",
    userIds: [mockUserId],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...createVideoDto.videoData,
  };

  const mockVideosCount = mockVideos.length;

  beforeEach(() => {
    mockVideoRepository = {
      transaction: jest.fn().mockImplementation(async (cb) => {
        return await cb(mockVideoRepository);
      }),
      create: jest.fn().mockResolvedValue(mockNewVideo),
      findMany: jest.fn().mockResolvedValue(mockVideos),
      count: jest.fn().mockResolvedValue(mockVideosCount),
      findByYoutubeId: jest.fn().mockResolvedValue(mockVideos[0]),
      connectVideoToUser: jest.fn(),
    };

    videoService = new VideoService(mockVideoRepository);
  });

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

      expect(result.items).toEqual(mockVideos);
      expect(result.totalItems).toBe(mockVideosCount);
      expect(result.totalPages).toBe(totalPages);
    });

    it("should return empty videos list and total pages as 0 when no videos found", async () => {
      (mockVideoRepository.findMany as jest.Mock).mockResolvedValue([]);
      (mockVideoRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await videoService.getUserVideos(findManyDto);

      expect(mockVideoRepository.findMany).toHaveBeenCalledWith(findManyDto);

      expect(result.items).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
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

    // it("should create a video if it does not exist", async () => {
    //   // Simulate that no existing video is found.
    //   (mockVideoRepository.findByYoutubeId as jest.Mock).mockResolvedValue(
    //     null
    //   );

    //   const result = await videoService.findVideoOrCreate(createVideoDto);

    //   expect(mockVideoRepository.findByYoutubeId).toHaveBeenCalledWith(
    //     createVideoDto.youtubeVideoId
    //   );

    //   expect(mockVideoRepository.create).toHaveBeenCalledWith(createVideoDto);

    //   expect(result).toEqual(mockNewVideo);
    // });

    it("should return existing video if already linked to the user", async () => {
      const result = await videoService.findVideoOrCreate(findVideoDto);

      expect(result).toEqual(mockVideos[0]);

      expect(mockVideoRepository.findByYoutubeId).toHaveBeenCalledWith(
        mockYoutubeId
      );
    });

    it("should link video to user if video exists but is not yet linked", async () => {
      (mockVideoRepository.connectVideoToUser as jest.Mock).mockResolvedValue({
        ...mockVideos[0],
        userIds: mockVideos[0].userIds?.push(mockNewUserId),
      });

      const result = await videoService.findVideoOrCreate({
        userId: mockNewUserId,
        youtubeVideoId: mockVideos[0].youtubeId,
      });

      expect(result.userIds).toHaveLength(2);
      expect(result.userIds).toContain(mockNewUserId);

      expect(mockVideoRepository.create).not.toHaveBeenCalled();
    });
  });
});
