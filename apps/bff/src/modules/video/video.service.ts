import type { Video } from "@tubenote/db";
import type { ISearchAndPaginationQueryDto, IVideoTranscriptQueryDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import type { ISessionData } from "@/types";

import { axiosInstance } from "@/lib/axios";

/**
 * Service class for handling video-related operations.
 * Provides methods to interact with video data through API calls.
 */
export class VideoService {
  /**
   * Retrieves the total count of videos for the authenticated user.
   * @param sessionData - The session data containing authentication information
   * @returns Promise resolving to API response containing the video count
   */
  async getVideosCount(sessionData: ISessionData): Promise<IApiSuccessResponse<number>> {
    const res = await axiosInstance.get<IApiSuccessResponse<number>>(`/videos/count`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return res.data;
  }

  /**
   * Retrieves a paginated list of videos with optional search and sorting.
   * @param sessionData - The session data containing authentication information
   * @param queryOptions - Query parameters for search, pagination, and sorting
   * @returns Promise resolving to API response containing an array of videos
   */
  async findAll(sessionData: ISessionData, queryOptions: ISearchAndPaginationQueryDto): Promise<IApiSuccessResponse<Video[]>> {
    const res = await axiosInstance.get<IApiSuccessResponse<Video[]>>(`/videos`, {
      params: queryOptions,
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return res.data;
  }

  /**
   * Retrieves a specific video by its YouTube video ID.
   * @param sessionData - The session data containing authentication information
   * @param ytVideoId - The YouTube video ID to search for
   * @returns Promise resolving to API response containing the video data
   */
  async findVideoByYtVideoId(sessionData: ISessionData, ytVideoId: string): Promise<IApiSuccessResponse<Video>> {
    const res = await axiosInstance.get<IApiSuccessResponse<Video>>(`/videos/${ytVideoId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return res.data;
  }

  async getVideoTranscript(sessionData: ISessionData, transcriptQueries: IVideoTranscriptQueryDto): Promise<IApiSuccessResponse<string>> {
    const res = await axiosInstance.get<IApiSuccessResponse<string>>("/videos/transcript", {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
      params: transcriptQueries,
    });

    return res.data;
  }
}
