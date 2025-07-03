import type { YoutubeVideoData } from "@tubenote/youtube-api";

/**
 * Data Transfer Object for creating a new video.
 *
 * This interface extends the YoutubeVideoData interface to provide
 * the structure for video creation requests. It inherits all properties
 * from YoutubeVideoData, making it suitable for handling video data
 * received from YouTube API or similar sources.
 *
 * @extends YoutubeVideoData
 * @example
 * ```typescript
 * const createVideoData: ICreateVideoDto = {
 *   // Properties inherited from YoutubeVideoData
 *   title: "Sample Video",
 *   description: "A sample video description",
 *   // ... other YouTube video properties
 * };
 * ```
 */
export interface ICreateVideoDto extends YoutubeVideoData {}
