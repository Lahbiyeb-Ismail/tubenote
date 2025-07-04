/**
 * Validates if a URL is a valid YouTube URL.
 *
 * This function checks if the provided string matches the format of a standard YouTube URL.
 * Supported formats include:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 *
 * The VIDEO_ID must be 11 characters long and can contain alphanumeric characters, dashes, and underscores.
 *
 * @param url - The URL string to validate
 * @returns `true` if the URL is a valid YouTube URL, `false` otherwise
 */
export function validateYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{11}/;

  return youtubeRegex.test(url);
};
