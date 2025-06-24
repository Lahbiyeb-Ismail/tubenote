import type { ChannelInfo, IYoutubeApiService, VideoChapter, YoutubeVideoData } from "../types";

import { envConfig } from "../env.config";

/**
 * Service for interacting with the YouTube API to retrieve video data.
 * This service provides methods to fetch video details, including chapters,
 * descriptions, and other metadata.
 */
export class YoutubeApiService implements IYoutubeApiService {
  private readonly YOUTUBE_API_URL = envConfig.api.url;
  private readonly YOUTUBE_API_KEY = envConfig.api.key;

  /**
   * Formats a timestamp in seconds into a human-readable string format.
   *
   * @param seconds - The timestamp in seconds to format
   * @returns A formatted string in the format "MM:SS" for timestamps less than an hour,
   *          or "HH:MM:SS" for timestamps of an hour or more.
   *          All components are zero-padded to ensure consistent width.
   * @example
   * formatTimestamp(83);
   * Returns "01:23"
   *
   * formatTimestamp(3600);
   * Returns "01:00:00"
   */
  private formatTimestamp(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return [
        String(hrs).padStart(2, "0"),
        String(mins).padStart(2, "0"),
        String(secs).padStart(2, "0"),
      ].join(":");
    }
    else {
      return [String(mins).padStart(2, "0"), String(secs).padStart(2, "0")].join(":");
    }
  }

  /**
   * Converts an ISO 8601 duration string to total seconds.
   *
   * ISO 8601 duration format example: "PT1H30M15S" represents 1 hour, 30 minutes, and 15 seconds.
   *
   * @param duration - The ISO 8601 duration string in format PT[nH][nM][nS] where:
   *   - PT is a required prefix
   *   - nH represents n hours (optional)
   *   - nM represents n minutes (optional)
   *   - nS represents n seconds (optional)
   * @returns The duration converted to total seconds as a number.
   *          Returns 0 if the input string doesn't match the expected format.
   */
  private parseISO8601Duration(duration: string): number {
    // Regex to capture hours, minutes, seconds
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    if (!matches)
      return 0;

    const hours = Number.parseInt(matches[1] || "0", 10);
    const minutes = Number.parseInt(matches[2] || "0", 10);
    const seconds = Number.parseInt(matches[3] || "0", 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Helper: sanitize a chapter label by removing any character
   * that's not a letter, digit, or space, then trimming.
   */
  private sanitizeLabel(raw: string): string {
  // Remove everything except A–Z, a–z, 0–9, and space:
    return raw.replace(/[^a-z0-9 ]+/gi, "").trim();
  }

  /**
   * Extracts video chapters from a YouTube video description by parsing timestamp lines.
   *
   * This method identifies chapters by looking for timestamps followed by text in the video description.
   * It supports two timestamp formats:
   * - HH:MM:SS (hours, minutes, seconds)
   * - MM:SS (minutes, seconds)
   *
   * Chapters are sorted chronologically and each chapter ends when the next one begins (or at the
   * end of the video for the last chapter).
   *
   * @param description - The YouTube video description text to parse
   * @param videoLengthSec - The total length of the video in seconds
   * @returns An array of VideoChapter objects with start time, end time, labels, and formatted timestamps
   *
   */
  private extractVideoChapters(
    description: string,
    videoLengthSec: number,
  ): VideoChapter[] {
    // Parse lines for timestamps
    const lines = description.split(/\r?\n/);
    const rawChapters: { start: number; label: string; rawStartTimestamp: string }[] = [];

    const combinedRegex = /^\s*(?:(\d{1,2}):(\d{2}):(\d{2})|(\d{1,2}):(\d{2}))\s+$/;

    for (const line of lines) {
      const m = combinedRegex.exec(line);
      if (!m)
        continue;

      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      let rawStart = "";

      if (m[1] !== undefined && m[2] !== undefined && m[3] !== undefined) {
        // Matched HH:MM:SS
        hours = Number.parseInt(m[1], 10);
        minutes = Number.parseInt(m[2], 10);
        seconds = Number.parseInt(m[3], 10);
        rawStart = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }
      else if (m[4] !== undefined && m[5] !== undefined) {
        // Matched MM:SS
        minutes = Number.parseInt(m[4], 10);
        seconds = Number.parseInt(m[5], 10);
        rawStart = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }
      else {
        continue; // No valid timestamp
      }

      const totalSec = hours * 3600 + minutes * 60 + seconds;

      // Sanitize the raw label to strip out special chars
      const rawLabel = m[6].trim();
      const cleanLabel = this.sanitizeLabel(rawLabel);

      rawChapters.push({ start: totalSec, label: cleanLabel, rawStartTimestamp: rawStart });
    }

    // Sort by start time (in case creator's lines were out of order)
    rawChapters.sort((a, b) => a.start - b.start);

    // Build full Chapter objects including `end` and formatted end timestamp
    const chapters: VideoChapter[] = rawChapters.map((ch, idx) => {
      // The “end” of this chapter is either the start of the next one, or the video’s total length
      const nextStart = idx + 1 < rawChapters.length ? rawChapters[idx + 1].start : videoLengthSec;
      const rawEnd = this.formatTimestamp(nextStart);

      return {
        startTime: ch.start,
        endTime: nextStart,
        chapterLabel: ch.label,
        rawStartTimestamp: ch.rawStartTimestamp,
        rawEndTimestamp: rawEnd,
      };
    });

    return chapters;
  }

  private async getVideoChannelInfo(channelId: string): Promise<ChannelInfo> {
    const res = await fetch(
      `${this.YOUTUBE_API_URL}/channels?id=${channelId}&key=${this.YOUTUBE_API_KEY}&part=snippet`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch channel: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.items?.length) {
      throw new Error(`No channel found for ID "${channelId}"`);
    }

    return {
      id: data.items[0].id,
      title: data.items[0].snippet.title,
      customUrl: data.items[0].snippet.customUrl,
      description: data.items[0].snippet.description,
      thumbnails: data.items[0].snippet.thumbnails,
    };
  }

  /**
   * Retrieves detailed information about a YouTube video using the YouTube API.
   *
   * @param ytVideoId - The YouTube video ID to fetch data for
   * @returns A Promise that resolves to a YoutubeVideoData object containing:
   *   - youtubeId: The ID of the video
   *   - title: The title of the video
   *   - videoChapters: Extracted chapters from the video description
   *   - description: Full description of the video
   *   - channelTitle: Name of the channel that uploaded the video
   *   - embedHtmlPlayer: HTML for embedding the video player
   *   - tags: Array of tags associated with the video
   *   - thumbnails: Object containing various thumbnail sizes and URLs
   *
   * @throws Error if the HTTP request fails or if the video cannot be found
   */
  async getYoutubeVideoData(ytVideoId: string): Promise<YoutubeVideoData> {
    const response = await fetch(
      `${this.YOUTUBE_API_URL}/videos?id=${ytVideoId}&key=${this.YOUTUBE_API_KEY}&part=snippet,player,contentDetails,statistics`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.items?.length) {
      throw new Error("Video not found or no data available");
    }

    const { title, description, channelTitle, channelId, thumbnails, tags }
      = data.items[0].snippet;

    const { embedHtml: embedHtmlPlayer } = data.items[0].player;

    const isoDuration = data.items[0].contentDetails?.duration || "PT0S";
    const videoDuration = this.parseISO8601Duration(isoDuration);

    const videoChapters = this.extractVideoChapters(description, videoDuration);
    const channelInfo = await this.getVideoChannelInfo(channelId);

    return {
      youtubeId: data.items[0].id,
      title,
      videoChapters,
      description,
      channelTitle,
      embedHtmlPlayer,
      tags,
      videoDuration,
      thumbnails,
      channelInfo,
      videoStatistics: data.items[0].statistics,
    };
  }
}
