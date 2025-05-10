import type { Video, YoutubeVideoData } from "@tubenote/types";

import type { IPrismaService } from "@/modules/shared/services";

import { VideoService } from "../video.service";

import type { IVideoRepository, IVideoService } from "../video.types";

describe("VideoService methods tests cases", () => {
  let videoService: IVideoService;
  let mockVideoRepository: IVideoRepository;

  let mockPrismaService: Partial<IPrismaService>;

  const mockUserId = "user_id_001";
  // const mockNewUserId = "user_id_124";

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

  const mockYoutubeVideoData: YoutubeVideoData = {
    youtubeId: "youtube_id_03",
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

  const mockNewVideo: Video = {
    id: "video_003",
    userIds: [mockUserId],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...mockYoutubeVideoData,
  };

  const mockVideosCount = mockVideos.length;

  beforeEach(() => {
    mockVideoRepository = {
      create: jest.fn().mockResolvedValue(mockNewVideo),
      findMany: jest.fn().mockResolvedValue(mockVideos),
      count: jest.fn().mockResolvedValue(mockVideosCount),
      findByYoutubeId: jest.fn().mockResolvedValue(mockVideos[0]),
      connectVideoToUser: jest.fn(),
    };

    mockPrismaService = {
      transaction: jest.fn(),
    };

    videoService = VideoService.getInstance({
      videoRepository: mockVideoRepository,
      prismaService: mockPrismaService as IPrismaService,
    });
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("VideoService - getYoutubeVideoData", () => {
    it("should throw proper error for network failures", async () => {
      jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      await expect(
        videoService.getYoutubeVideoData("valid_id")
      ).rejects.toThrow("Network error");
    });

    it("should handle malformed YouTube API response", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [{}] }), // Missing required fields
      } as Response);

      await expect(
        videoService.getYoutubeVideoData("valid_id")
      ).rejects.toThrow(Error);
    });
  });

  // describe("videoService - getUserVideos", () => {
  //   const findManyDto: IFindAllDto = {
  //     userId: mockUserId,
  //     limit: 2,
  //     skip: 0,
  //     sort: { by: "createdAt", order: "desc" },
  //   };

  //   const mockTx = jest.fn();

  //   beforeEach(() => {
  //     jest.clearAllMocks();

  //     (mockPrismaService.transaction as jest.Mock).mockImplementation(
  //       async (cb) => {
  //         await cb(mockTx);
  //       }
  //     );
  //   });

  //   it("should return videos for a specific user", async () => {
  //     // (mockVideoRepository.findMany as jest.Mock).mockResolvedValue(mockVideos);

  //     // (mockVideoRepository.count as jest.Mock).mockResolvedValue(
  //     //   mockVideosCount
  //     // );

  //     const result = await videoService.getUserVideos(findManyDto);

  //     // const totalPages = Math.ceil(mockVideosCount / findManyDto.limit);

  //     console.log(result);

  //     expect(mockPrismaService.transaction).toHaveBeenCalled();

  //     expect(mockVideoRepository.findMany).toHaveBeenCalledWith(
  //       findManyDto,
  //       mockTx
  //     );

  //     expect(mockVideoRepository.count).toHaveBeenCalledWith(
  //       findManyDto.userId,
  //       mockTx
  //     );

  //     expect(result).toBeDefined();
  //     // expect(result.totalItems).toBe(mockVideosCount);
  //     // expect(result.totalPages).toBe(totalPages);
  //   });

  //   it("should return empty videos list and total pages as 0 when no videos found", async () => {
  //     (mockVideoRepository.findMany as jest.Mock).mockResolvedValue([]);
  //     (mockVideoRepository.count as jest.Mock).mockResolvedValue(0);

  //     const result = await videoService.getUserVideos(findManyDto);

  //     expect(result.items).toEqual([]);
  //     expect(result.totalItems).toBe(0);
  //     expect(result.totalPages).toBe(0);

  //     expect(mockPrismaService.transaction).toHaveBeenCalled();

  //     expect(mockVideoRepository.findMany).toHaveBeenCalledWith(
  //       findManyDto,
  //       mockTx
  //     );

  //     expect(mockVideoRepository.count).toHaveBeenCalledWith(
  //       findManyDto.userId,
  //       mockTx
  //     );
  //   });

  //   // it("should handle invalid limit values by defaulting to positive numbers", async () => {
  //   //   const invalidDto = { ...findManyDto, limit: -5 };

  //   //   await videoService.getUserVideos(invalidDto);

  //   //   expect(mockVideoRepository.findMany).toHaveBeenCalledWith(
  //   //     expect.objectContaining({ limit: 0 })
  //   //   );
  //   // });

  //   it("should handle database errors during findMany", async () => {
  //     (mockVideoRepository.findMany as jest.Mock).mockRejectedValue(
  //       new Error("Database error")
  //     );

  //     await expect(videoService.getUserVideos(findManyDto)).rejects.toThrow(
  //       "Database error"
  //     );
  //   });

  //   it("should handle database errors during count", async () => {
  //     (mockVideoRepository.count as jest.Mock).mockRejectedValue(
  //       new Error("Count error")
  //     );
  //     await expect(videoService.getUserVideos(findManyDto)).rejects.toThrow(
  //       "Count error"
  //     );
  //   });

  //   it("should handle pagination edge case (exact division)", async () => {
  //     const exactLimitDto = { ...findManyDto, limit: 2, skip: 2 };
  //     (mockVideoRepository.count as jest.Mock).mockResolvedValue(4);

  //     const result = await videoService.getUserVideos(exactLimitDto);
  //     expect(result.totalPages).toBe(2);
  //   });
  // });

  // describe("VideoService - findVideoOrCreate", () => {
  //   const mockUserId = "user_id_001";
  //   const mockYoutubeId = "youtube_id_01";

  //   const findVideoDto: IFindUniqueDto = {
  //     id: mockYoutubeId,
  //     userId: mockUserId,
  //   };

  //   const mockTx = jest.fn();

  //   beforeEach(() => {
  //     jest.clearAllMocks();

  //     (mockPrismaService.transaction as jest.Mock).mockImplementation(
  //       async (cb) => {
  //         await cb(mockTx);
  //       }
  //     );
  //   });

  //   it("should create a video if it does not exist", async () => {
  //     // Simulate that no existing video is found.
  //     (mockVideoRepository.findByYoutubeId as jest.Mock).mockResolvedValue(
  //       null
  //     );

  //     jest
  //       .spyOn(videoService, "getYoutubeVideoData")
  //       .mockResolvedValue(mockYoutubeVideoData);

  //     const result = await videoService.findVideoOrCreate({
  //       ...findVideoDto,
  //       id: "youtube_id_03",
  //     });

  //     expect(result).toEqual(mockNewVideo);

  //     expect(mockPrismaService.transaction).toHaveBeenCalled();

  //     expect(mockVideoRepository.findByYoutubeId).toHaveBeenCalledWith(
  //       mockTx,
  //       "youtube_id_03"
  //     );

  //     expect(videoService.getYoutubeVideoData).toHaveBeenCalledWith(
  //       "youtube_id_03"
  //     );

  //     expect(mockVideoRepository.create).toHaveBeenCalledWith(
  //       createVideoDto,
  //       mockTx
  //     );
  //   });

  //   it("should return existing video if already linked to the user", async () => {
  //     const result = await videoService.findVideoOrCreate(findVideoDto);

  //     expect(result).toEqual(mockVideos[0]);

  //     expect(mockPrismaService.transaction).toHaveBeenCalled();

  //     expect(mockVideoRepository.findByYoutubeId).toHaveBeenCalledWith(
  //       mockTx,
  //       mockYoutubeId
  //     );
  //   });

  //   it("should link video to user if video exists but is not yet linked", async () => {
  //     (mockVideoRepository.findByYoutubeId as jest.Mock).mockResolvedValue(
  //       mockVideos[0]
  //     );

  //     (mockVideoRepository.connectVideoToUser as jest.Mock).mockResolvedValue({
  //       ...mockVideos[0],
  //       userIds: mockVideos[0].userIds?.push(mockNewUserId),
  //     });

  //     const result = await videoService.findVideoOrCreate({
  //       userId: mockNewUserId,
  //       id: mockVideos[0].youtubeId,
  //     });

  //     expect(result.userIds).toHaveLength(2);
  //     expect(result.userIds).toContain(mockNewUserId);

  //     expect(mockPrismaService.transaction).toHaveBeenCalled();

  //     expect(mockVideoRepository.findByYoutubeId).toHaveBeenCalledWith(
  //       mockTx,
  //       mockVideos[0].youtubeId
  //     );

  //     expect(mockVideoRepository.connectVideoToUser).toHaveBeenCalledWith(
  //       mockVideos[0].youtubeId,
  //       mockNewUserId,
  //       mockTx
  //     );

  //     expect(mockVideoRepository.create).not.toHaveBeenCalled();
  //   });

  //   it("should throw BadRequestError for missing userId or youtubeVideoId", async () => {
  //     await expect(
  //       videoService.findVideoOrCreate({
  //         userId: "",
  //         id: "test",
  //       })
  //     ).rejects.toThrow(BadRequestError);

  //     await expect(
  //       videoService.findVideoOrCreate({
  //         userId: "123",
  //         id: "",
  //       })
  //     ).rejects.toThrow(BadRequestError);
  //   });

  //   it("should handle YouTube API errors gracefully", async () => {
  //     jest.spyOn(global, "fetch").mockResolvedValue({
  //       ok: false,
  //       status: 403,
  //     } as Response);

  //     await expect(
  //       videoService.getYoutubeVideoData("invalid_id")
  //     ).rejects.toThrow(BadRequestError);
  //   });

  //   it("should handle empty YouTube API response", async () => {
  //     jest.spyOn(global, "fetch").mockResolvedValue({
  //       ok: true,
  //       json: () => Promise.resolve({ items: [] }),
  //     } as Response);

  //     await expect(
  //       videoService.getYoutubeVideoData("valid_id")
  //     ).rejects.toThrow(NotFoundError);
  //   });

  //   it("should handle transaction rollback on creation failure", async () => {
  //     (mockVideoRepository.findByYoutubeId as jest.Mock).mockResolvedValue(
  //       null
  //     );

  //     jest
  //       .spyOn(videoService, "getYoutubeVideoData")
  //       .mockResolvedValue(mockYoutubeVideoData);

  //     (mockVideoRepository.create as jest.Mock).mockRejectedValue(
  //       new Error("Create failed")
  //     );

  //     await expect(
  //       videoService.findVideoOrCreate(findVideoDto)
  //     ).rejects.toThrow("Create failed");
  //   });

  //   it("should handle invalid YouTube API response structure", async () => {
  //     jest.spyOn(global, "fetch").mockResolvedValue({
  //       ok: true,
  //       json: () => Promise.resolve({ invalid: "response" }),
  //     } as Response);

  //     await expect(
  //       videoService.getYoutubeVideoData("valid_id")
  //     ).rejects.toThrow(NotFoundError);
  //   });

  //   it("should handle video linking failures", async () => {
  //     (mockVideoRepository.connectVideoToUser as jest.Mock).mockRejectedValue(
  //       new Error("Linking failed")
  //     );

  //     await expect(
  //       videoService.findVideoOrCreate({
  //         userId: "new_user",
  //         id: mockVideos[0].youtubeId,
  //       })
  //     ).rejects.toThrow("Linking failed");
  //   });

  //   it("should handle concurrent requests for same video", async () => {
  //     const userOneReqDto: IFindUniqueDto = {
  //       userId: "user_id_001",
  //       id: "video_id_1",
  //     };

  //     const userTwoReqDto: IFindUniqueDto = {
  //       userId: "user_id_002",
  //       id: "video_id_1",
  //     };

  //     // Simulate race condition where two users try to create the same video
  //     (mockVideoRepository.findByYoutubeId as jest.Mock)
  //       .mockResolvedValueOnce(null)
  //       .mockResolvedValueOnce(mockNewVideo);

  //     jest
  //       .spyOn(videoService, "getYoutubeVideoData")
  //       .mockResolvedValue(mockYoutubeVideoData);

  //     (mockVideoRepository.connectVideoToUser as jest.Mock).mockResolvedValue({
  //       ...mockNewVideo,
  //       userIds: [userOneReqDto.userId, userTwoReqDto.userId],
  //     });

  //     const [result1, result2] = await Promise.all([
  //       videoService.findVideoOrCreate(userOneReqDto),
  //       videoService.findVideoOrCreate(userTwoReqDto),
  //     ]);

  //     expect(result1.userIds).toHaveLength(1);
  //     expect(result2.userIds).toHaveLength(2);

  //     expect(result1.id).toBe(result2.id);

  //     expect(mockVideoRepository.create).toHaveBeenCalledTimes(1);

  //     expect(mockVideoRepository.connectVideoToUser).toHaveBeenCalledTimes(1);

  //     expect(result1.userIds).toEqual(
  //       expect.arrayContaining([userOneReqDto.userId])
  //     );

  //     expect(result2.userIds).toEqual(
  //       expect.arrayContaining([userOneReqDto.userId, userTwoReqDto.userId])
  //     );

  //     expect(result1.userIds).not.toEqual(result2.userIds);
  //   });
  // });

  // describe("VideoService - transaction handling", () => {
  //   const findVideoDto: IFindUniqueDto = {
  //     userId: "user_id_001",
  //     id: "video_id_1",
  //   };
  //   it("should rollback transaction on any error", async () => {
  //     mockVideoRepository.transaction = jest
  //       .fn()
  //       .mockImplementation(async (cb) => {
  //         try {
  //           await cb(mockVideoRepository);
  //         } catch (error) {
  //           return Promise.reject(error);
  //         }
  //       });

  //     (mockVideoRepository.findByYoutubeId as jest.Mock).mockResolvedValue(
  //       null
  //     );

  //     jest
  //       .spyOn(videoService, "getYoutubeVideoData")
  //       .mockResolvedValue(mockYoutubeVideoData);

  //     (mockVideoRepository.create as jest.Mock).mockRejectedValue(
  //       new Error("DB failure")
  //     );

  //     await expect(
  //       videoService.findVideoOrCreate(findVideoDto)
  //     ).rejects.toThrow("DB failure");

  //     expect(mockVideoRepository.transaction).toHaveBeenCalled();

  //     expect(mockVideoRepository.create).toHaveBeenCalled();
  //   });
  // });
});
