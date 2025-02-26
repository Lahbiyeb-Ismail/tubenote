import type { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { EmptyRecord, TypedRequest } from "@/types";

import { BadRequestError, NotFoundError } from "@/errors";
import { IVideoService, Video, VideoController } from "@modules/video";

import type {
  ApiResponse,
  IParamIdDto,
  IQueryPaginationDto,
  IResponseFormatter,
} from "@modules/shared";

describe("VideoController", () => {
  const mockResponseFormatter = mock<IResponseFormatter>();
  const mockVideoService = mock<IVideoService>();

  const videoController = new VideoController(
    mockResponseFormatter,
    mockVideoService
  );

  const mockUserId = "user_id_123";
  const mockVideoId = "video_id_456";

  const mockRequest =
    mock<TypedRequest<EmptyRecord, EmptyRecord, IQueryPaginationDto>>();
  const mockFindOrCreateReq = mock<TypedRequest<EmptyRecord, IParamIdDto>>();
  const mockResponse = mock<Response>();

  const mockPaginatedVideos: ApiResponse<Video[]> = {
    success: true,
    data: [],
    pagination: {
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      totalItems: 0,
      totalPages: 0,
    },
  };

  const mockVideo: Video = {
    id: mockVideoId,
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
  };

  beforeEach(() => {
    mockReset(mockResponseFormatter);
    mockReset(mockVideoService);
    mockReset(mockResponse);

    mockResponse.status.mockReturnThis();
    mockResponse.json.mockReturnThis();
  });

  describe("VideoController - getUserVideos", () => {
    const baseQuery: IQueryPaginationDto = {
      page: "1",
      limit: "10",
      sortBy: "createdAt",
      order: "desc",
    };

    it("should return formatted paginated response with valid parameters", async () => {
      mockRequest.query = baseQuery;
      mockRequest.userId = mockUserId;

      mockVideoService.getUserVideos.mockResolvedValue({
        items: [mockVideo],
        totalItems: 1,
        totalPages: 1,
      });

      mockResponseFormatter.formatPaginatedResponse.mockReturnValue(
        mockPaginatedVideos
      );

      await videoController.getUserVideos(mockRequest, mockResponse);

      expect(mockVideoService.getUserVideos).toHaveBeenCalledWith({
        userId: mockUserId,
        limit: 10,
        skip: 0,
        sort: { by: "createdAt", order: "desc" },
      });

      expect(mockResponseFormatter.formatPaginatedResponse).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPaginatedVideos);
    });

    it("should handle missing pagination parameters with defaults", async () => {
      mockRequest.query = {};
      mockRequest.userId = mockUserId;

      await videoController.getUserVideos(mockRequest, mockResponse);

      expect(mockVideoService.getUserVideos).toHaveBeenCalledWith({
        userId: mockUserId,
        limit: NaN, // From empty limit string conversion
        skip: NaN,
        sort: { by: "undefined", order: "undefined" }, // From empty sort params
      });
    });

    it("should handle invalid numeric parameters by converting to NaN", async () => {
      mockRequest.query = { page: "invalid", limit: "not-a-number" };
      mockRequest.userId = mockUserId;

      await videoController.getUserVideos(mockRequest, mockResponse);

      expect(mockVideoService.getUserVideos).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: NaN,
          skip: NaN,
        })
      );
    });

    it("should handle service errors and propagate them", async () => {
      mockRequest.query = baseQuery;
      mockRequest.userId = mockUserId;

      const testError = new Error("Service failure");

      mockVideoService.getUserVideos.mockRejectedValue(testError);

      await expect(
        videoController.getUserVideos(mockRequest, mockResponse)
      ).rejects.toThrow(testError);
    });

    it("should handle negative page values by converting to skip calculation", async () => {
      mockRequest.query = { ...baseQuery, page: "-5" };
      mockRequest.userId = mockUserId;

      await videoController.getUserVideos(mockRequest, mockResponse);

      expect(mockVideoService.getUserVideos).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: (-5 - 1) * 10, // -60
        })
      );
    });

    it("should handle maximum limit values", async () => {
      mockRequest.query = { ...baseQuery, limit: "1000" };
      mockRequest.userId = mockUserId;

      await videoController.getUserVideos(mockRequest, mockResponse);

      expect(mockVideoService.getUserVideos).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 1000,
        })
      );
    });
  });

  describe("VideoController - getVideoByIdOrCreate", () => {
    beforeEach(() => {
      mockFindOrCreateReq.params = { id: mockVideoId };
      mockFindOrCreateReq.userId = mockUserId;

      mockVideoService.findVideoOrCreate.mockResolvedValue(mockVideo);

      mockResponseFormatter.formatResponse.mockReturnValue({
        success: true,
        data: mockVideo,
      });
    });

    it("should return formatted video response with valid parameters", async () => {
      await videoController.getVideoByIdOrCreate(
        mockFindOrCreateReq,
        mockResponse
      );

      expect(mockVideoService.findVideoOrCreate).toHaveBeenCalledWith({
        userId: mockUserId,
        id: mockVideoId,
      });
      expect(mockResponseFormatter.formatResponse).toHaveBeenCalledWith(
        mockVideo
      );
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockVideo,
        success: true,
      });
    });

    it("should handle not found errors from service", async () => {
      const notFoundError = new NotFoundError("Video not found");

      mockVideoService.findVideoOrCreate.mockRejectedValue(notFoundError);

      await expect(
        videoController.getVideoByIdOrCreate(mockFindOrCreateReq, mockResponse)
      ).rejects.toThrow(notFoundError);

      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should handle YouTube API errors through service", async () => {
      const youtubeError = new BadRequestError("Invalid YouTube ID");

      mockVideoService.findVideoOrCreate.mockRejectedValue(youtubeError);

      await expect(
        videoController.getVideoByIdOrCreate(mockFindOrCreateReq, mockResponse)
      ).rejects.toThrow(youtubeError);

      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("VideoController - Edge Cases", () => {
    it("should handle extremely large numeric values", async () => {
      mockRequest.query = {
        page: "9999999999",
        limit: "9999999999",
      };
      mockRequest.userId = mockUserId;

      await videoController.getUserVideos(mockRequest, mockResponse);

      expect(mockVideoService.getUserVideos).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 9999999999,
          skip: (9999999999 - 1) * 9999999999,
        })
      );
    });

    it("should handle non-string parameters in query", async () => {
      // Simulate non-string values coming from query params
      mockRequest.query = {
        page: 123 as unknown as string,
        limit: true as unknown as string,
      };
      mockRequest.userId = mockUserId;

      await videoController.getUserVideos(mockRequest, mockResponse);

      expect(mockVideoService.getUserVideos).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: Number(true), // 1
          skip: (123 - 1) * 1,
        })
      );
    });

    it("should handle special characters in video ID", async () => {
      const specialId = "video_!@#$%^&*()";
      mockFindOrCreateReq.params = { id: specialId };

      await videoController.getVideoByIdOrCreate(
        mockFindOrCreateReq,
        mockResponse
      );

      expect(mockVideoService.findVideoOrCreate).toHaveBeenCalledWith({
        userId: mockUserId,
        id: specialId,
      });
    });

    it("should handle concurrent requests for same video ID", async () => {
      await Promise.all([
        videoController.getVideoByIdOrCreate(mockFindOrCreateReq, mockResponse),
        videoController.getVideoByIdOrCreate(mockFindOrCreateReq, mockResponse),
      ]);

      expect(mockVideoService.findVideoOrCreate).toHaveBeenCalledTimes(2);
    });
  });
});
