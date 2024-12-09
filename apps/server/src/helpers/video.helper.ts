import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "../constants";

/**
 * Fetches data for a YouTube video using the YouTube Data API.
 *
 * @param videoId - The ID of the YouTube video to fetch data for.
 * @returns A promise that resolves to the video data, or undefined if an error occurs.
 * @throws Will throw an error if the HTTP request fails.
 */
export async function fetchYoutubeVideoDetails(videoId: string) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}${videoId}&key=${YOUTUBE_API_KEY}&part=snippet, statistics, player`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching video data:", error);
    throw new Error("Error fetching video data");
  }
}
