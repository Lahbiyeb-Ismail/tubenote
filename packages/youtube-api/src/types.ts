/**
 * Represents the collection of thumbnail images for YouTube resources.
 *
 * Each property corresponds to a different thumbnail size:
 * - `default`: The smallest size (typically 120x90)
 * - `medium`: Medium size (typically 320x180)
 * - `high`: High definition size (typically 480x360)
 * - `standard`: Standard definition size (typically 640x480)
 * - `maxres`: Maximum resolution size (typically 1280x720)
 *
 * Not all sizes may be available for every resource.
 */
interface VideoThumbnails {
  default: ThumbnailSize;
  medium: ThumbnailSize;
  high: ThumbnailSize;
  standard: ThumbnailSize;
  maxres: ThumbnailSize;
}

/**
 * Represents a YouTube video thumbnail with its URL and dimensions.
 *
 * @interface ThumbnailSize
 * @property {string} url - The URL of the thumbnail image
 * @property {number} width - The width of the thumbnail image in pixels
 * @property {number} height - The height of the thumbnail image in pixels
 */
interface ThumbnailSize {
  url: string;
  width: number;
  height: number;
}

/**
 * Represents a chapter within a YouTube video.
 *
 * @interface VideoChapter
 * @property {number} startTime - The start time of the chapter in seconds from the beginning of the video
 * @property {number} endTime - The end time of the chapter in seconds from the beginning of the video
 * @property {string} chapterLabel - The title or description of the chapter (e.g., "Introduction")
 * @property {string} rawStartTimestamp - The formatted start time as shown in YouTube (e.g., "00:00" or "01:23:45")
 * @property {string} rawEndTimestamp - The formatted end time as shown in YouTube (e.g., "01:45" or "02:30:10")
 */
export interface VideoChapter {
  startTime: number; // seconds from 0
  endTime: number; // seconds from 0
  chapterLabel: string; // e.g. "Introduction"
  rawStartTimestamp: string; // e.g. "00:00" or "01:23:45"
  rawEndTimestamp: string; // e.g. "01:45" or "02:30:10"
}

/**
 * Statistics for a YouTube video including engagement metrics.
 *
 * @remarks
 * All count values are returned as strings from the YouTube API to handle
 * large numbers that may exceed JavaScript's safe integer limit.
 *
 */
export interface VideoStatistics {
  viewCount: string; // Total views of the video
  likeCount: string; // Total likes on the video
  commentCount: string; // Total comments on the video
}

interface ChannelThumbnails {
  default: ThumbnailSize;
  medium: ThumbnailSize;
  high: ThumbnailSize;
}

/**
 * Represents information about a YouTube channel.
 *
 * @interface ChannelInfo
 */
export interface ChannelInfo {
  channelId: string; // The unique identifier of the channel
  title: string; // The name of the channel
  customUrl: string; // The custom URL of the channel
  description: string; // Description of the channel
  thumbnails: ChannelThumbnails; // Thumbnails for the channel
}

/**
 * Represents structured data from a YouTube video.
 *
 * @interface YoutubeVideoData
 * @property {string} youtubeId - The unique identifier of the YouTube video
 * @property {string} title - The title of the YouTube video
 * @property {string} description - The description of the YouTube video
 * @property {string} channelTitle - The title of the channel that uploaded the video
 * @property {string[]} tags - The list of tags associated with the video
 * @property {string} embedHtmlPlayer - HTML code for embedding the video player
 * @property {number} videoDuration - The duration of the video in seconds
 * @property {Thumbnails} thumbnails - Object containing different thumbnail sizes for the video
 * @property {VideoStatistics} videoStatistics - Statistics about the video (views, likes, comments)
 */
export interface YoutubeVideoData {
  youtubeId: string;
  title: string;
  description: string;
  tags: string[];
  embedHtmlPlayer: string;
  videoDuration: number;
  thumbnails: VideoThumbnails;
  videoStatistics: VideoStatistics;
  channelInfo: ChannelInfo;
}

/**
 * Interface for accessing and interacting with the YouTube API.
 * Provides methods to retrieve data from YouTube videos.
 */
export interface IYoutubeApiService {
  /**
   * Retrieves detailed data for a specific YouTube video.
   *
   * @param youtubeId - The unique identifier of the YouTube video
   * @returns A promise that resolves to the YouTube video data
   */
  getYoutubeVideoData: (youtubeId: string) => Promise<YoutubeVideoData>;
}

export interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptRequest {
  ytVideoId: string;
  language?: string;
  format?: "text" | "json";
  timestamps?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface TranscriptResponse {
  success: boolean;
  data?: {
    ytVideoId: string;
    transcript: string;
    format: string;
    language?: string;
    timestamps: boolean;
    entryCount: number;
    timeRange?: {
      start?: string;
      end?: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface ApiError extends Error {
  statusCode: number;
  code: string;
}

export interface PythonScriptResult {
  success: boolean;
  output?: string;
  error?: string;
  code?: number;
}
