/**
 * Extracts the video ID from a given YouTube video URL.
 *
 * @param videoUrl - The URL of the YouTube video.
 * @returns The video ID if present, otherwise `null`.
 */
export function extractVideoId(videoUrl: string) {
  const urlObject = new URL(videoUrl);
  const videoId = urlObject.searchParams.get("v");

  return videoId;
}
