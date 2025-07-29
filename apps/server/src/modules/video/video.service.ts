import type { Prisma, Video } from "@tubenote/db";
import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";
import type { IPaginatedData } from "@tubenote/types";
import type { YoutubeVideoData } from "@tubenote/youtube-api";

import { BadRequestError, ERROR_MESSAGES } from "@tubenote/api-errors";
import { youtubeApiService } from "@tubenote/youtube-api";
import { inject, injectable } from "inversify";

import type {
  ICacheService,
  ILoggerService,
  IPrismaService,
} from "@/modules/shared/services";

import { TYPES } from "@/config/inversify/types";

import type { IVideoRepository, IVideoService } from "./video.types";

@injectable()
export class VideoService implements IVideoService {
  constructor(
    @inject(TYPES.VideoRepository) private _videoRepository: IVideoRepository,
    @inject(TYPES.PrismaService) private _prismaService: IPrismaService,
    @inject(TYPES.CacheService) private _cacheService: ICacheService,
    @inject(TYPES.LoggerService) private _loggerService: ILoggerService,
  ) {}

  /**
   * Finds a video record by its YouTube ID.
   *
   * @param youtubeId - The unique YouTube video identifier
   * @param tx - Optional Prisma transaction client for database operations
   * @returns Promise that resolves to the Video object if found, null otherwise
   * @private
   */
  private async _findVideoByYoutubeId(
    youtubeId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Video | null> {
    return this._videoRepository.findByYoutubeId(youtubeId, tx);
  }

  /**
   * Creates a new video record in the database using YouTube video data.
   *
   * This method retrieves YouTube video metadata either from cache or directly from the YouTube API,
   * then creates a video record in the database. It implements caching for performance optimization
   * and handles cache invalidation for related user data.
   *
   * @param tx - Prisma transaction client for database operations
   * @param userId - The ID of the user creating the video
   * @param youtubeVideoId - The YouTube video ID to create a record for
   * @returns Promise that resolves to the created Video object
   *
   * @throws Will throw an error if YouTube API request fails or database operation fails
   *
   * @example
   * ```typescript
   * const video = await this._createVideo(tx, "user123", "dQw4w9WgXcQ");
   * ```
   *
   * @internal
   */
  private async _createVideo(
    tx: Prisma.TransactionClient,
    userId: string,
    youtubeVideoId: string,
  ): Promise<Video> {
    const youtubeCacheKey = `youtube:video:data:${youtubeVideoId}`;
    let videoData = await this._cacheService.get<YoutubeVideoData>(youtubeCacheKey);

    if (videoData) {
      this._loggerService.debug(
        `Cache HIT for youtube video data with id: ${youtubeVideoId}`,
      );
    }
    else {
      this._loggerService.debug(
        `Cache MISS for youtube video data with id: ${youtubeVideoId}`,
      );
      videoData = await youtubeApiService.getYoutubeVideoData(youtubeVideoId);
      // Cache for 24 hours
      await this._cacheService.set(youtubeCacheKey, videoData, 86400);
    }

    const video = await this._videoRepository.create(userId, videoData, tx);

    // Invalidate user's video count cache
    const userVideosCountCacheKey = `user:${userId}:videos:count`;
    await this._cacheService.del(userVideosCountCacheKey);
    this._loggerService.debug(
      `Cache invalidated for key: ${userVideosCountCacheKey}`,
    );

    return video;
  }

  /**
   * Links a video to a user by establishing a connection between them.
   * This method updates the video-user relationship and invalidates related cache entries
   * to ensure data consistency.
   *
   * @param tx - The Prisma transaction client to ensure atomic operations
   * @param video - The video object to be linked to the user
   * @param userId - The unique identifier of the user to link the video to
   * @returns A promise that resolves to the updated video object with user connection
   *
   * @private
   *
   * @example
   * ```typescript
   * const linkedVideo = await this._linkVideoToUser(tx, video, "user123");
   * ```
   */
  private async _linkVideoToUser(
    tx: Prisma.TransactionClient,
    video: Video,
    userId: string,
  ): Promise<Video> {
    const updatedVideo = await this._videoRepository.connectVideoToUser(
      video.id,
      userId,
      tx,
    );

    // Invalidate user's video count cache
    const userVideosCountCacheKey = `user:${userId}:videos:count`;
    await this._cacheService.del(userVideosCountCacheKey);
    this._loggerService.debug(
      `Cache invalidated for key: ${userVideosCountCacheKey}`,
    );

    // Invalidate video cache
    const videoCacheKey = `video:youtube:${updatedVideo.youtubeId}`;
    await this._cacheService.del(videoCacheKey);
    this._loggerService.debug(`Cache invalidated for key: ${videoCacheKey}`);

    return updatedVideo;
  }

  /**
   * Retrieves a paginated list of videos for a specific user.
   *
   * @param userId - The unique identifier of the user whose videos to retrieve
   * @param queryOptions - Search and pagination options including search query, limit, and offset
   * @returns A promise that resolves to paginated video data containing the videos array, total items count, and total pages
   *
   * @example
   * ```typescript
   * const userVideos = await videoService.getUserVideos('user123', {
   *   q: 'tutorial',
   *   limit: 10,
   *   offset: 0
   * });
   * ```
   */
  async getUserVideos(
    userId: string,
    queryOptions: ISearchAndPaginationQueryDto,
  ): Promise<IPaginatedData<Video>> {
    return this._prismaService.transaction(async (tx) => {
      const { q: searchQuery } = queryOptions;

      const data = await this._videoRepository.findMany(
        userId,
        queryOptions,
        tx,
      );

      const totalItems = await this._videoRepository.count(
        userId,
        searchQuery,
        tx,
      );

      const totalPages = Math.ceil(totalItems / +queryOptions.limit);
      return { data, totalItems, totalPages };
    });
  }

  /**
   * Retrieves the total count of videos for a specific user with caching support.
   *
   * This method first checks if the count is available in the cache. If found (cache hit),
   * it returns the cached value immediately. If not found (cache miss), it queries the
   * database through the video repository, caches the result for 1 hour, and returns the count.
   *
   * @param userId - The unique identifier of the user whose video count is being requested
   * @returns A promise that resolves to the total number of videos owned by the user
   *
   * @example
   * ```typescript
   * const videoCount = await videoService.getUserVideosCount('user123');
   * console.log(`User has ${videoCount} videos`);
   * ```
   */
  async getUserVideosCount(userId: string): Promise<number> {
    const cacheKey = `user:${userId}:videos:count`;
    const cachedCount = await this._cacheService.get<number>(cacheKey);

    if (cachedCount !== undefined) {
      this._loggerService.debug(
        `Cache HIT for user videos count for userId: ${userId}`,
      );
      return cachedCount;
    }

    this._loggerService.debug(
      `Cache MISS for user videos count for userId: ${userId}`,
    );
    const count = await this._videoRepository.count(userId);

    // Cache for 1 hour
    await this._cacheService.set(cacheKey, count, 3600);

    return count;
  }

  /**
   * Retrieves a video by its YouTube ID, linking it to the specified user if necessary.
   *
   * This method implements a multi-layered approach:
   * 1. First checks the cache for the video
   * 2. If cached and already linked to user, returns immediately
   * 3. If cached but not linked, links the video to the user
   * 4. If not cached, queries the database within a transaction
   * 5. Creates a new video if it doesn't exist, or links existing video to user
   * 6. Caches the video for future requests (1 hour TTL)
   *
   * @param userId - The unique identifier of the user requesting the video
   * @param videoYoutubeId - The YouTube video ID to retrieve
   * @returns A promise that resolves to the Video object linked to the user
   * @throws {BadRequestError} When userId or videoYoutubeId is missing or invalid
   */
  async getVideoByYoutubeId(
    userId: string,
    videoYoutubeId: string,
  ): Promise<Video> {
    if (!videoYoutubeId || !userId) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    const cacheKey = `video:youtube:${videoYoutubeId}`;
    const cachedVideo = await this._cacheService.get<Video>(cacheKey);

    if (cachedVideo) {
      this._loggerService.debug(
        `Cache HIT for video with youtubeId: ${videoYoutubeId}`,
      );
      // If video is already linked to the user, return it.
      if (cachedVideo.userIds.includes(userId)) {
        return cachedVideo;
      }

      // Otherwise, link the existing video to the user.
      return this._prismaService.transaction(async tx =>
        this._linkVideoToUser(tx, cachedVideo, userId),
      );
    }

    this._loggerService.debug(
      `Cache MISS for video with youtubeId: ${videoYoutubeId}`,
    );

    return this._prismaService.transaction(async (tx) => {
      const existingVideo = await this._findVideoByYoutubeId(
        videoYoutubeId,
        tx,
      );

      if (!existingVideo) {
        // If video doesn't exist, create it.
        return this._createVideo(tx, userId, videoYoutubeId);
      }

      // Cache the video for 1 hour
      await this._cacheService.set(cacheKey, existingVideo, 3600);

      if (existingVideo.userIds?.includes(userId)) {
        // If video is already linked to the user, return it.
        return existingVideo;
      }

      // Otherwise, link the existing video to the user.
      return this._linkVideoToUser(tx, existingVideo, userId);
    });
  }
}
