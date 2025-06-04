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
interface Thumbnails {
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
 * Represents structured data from a YouTube video.
 *
 * @interface YoutubeVideoData
 * @property {string} youtubeId - The unique identifier of the YouTube video
 * @property {string} title - The title of the YouTube video
 * @property {string} description - The description of the YouTube video
 * @property {string} channelTitle - The title of the channel that uploaded the video
 * @property {string[]} tags - The list of tags associated with the video
 * @property {string} embedHtmlPlayer - HTML code for embedding the video player
 * @property {Thumbnails} thumbnails - Object containing different thumbnail sizes for the video
 * @property {VideoChapter[]} videoChapters - Array of chapters/segments in the video
 */
export interface YoutubeVideoData {
  youtubeId: string;
  title: string;
  description: string;
  channelTitle: string;
  tags: string[];
  embedHtmlPlayer: string;
  thumbnails: Thumbnails;
  videoChapters: VideoChapter[];
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
