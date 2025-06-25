/**
 * Formats a video duration from seconds into a human-readable time string.
 *
 * @param seconds - The duration in seconds to format
 * @returns A formatted time string in the format "H:MM:SS" if hours > 0, otherwise "M:SS"
 *
 * @example
 * ```typescript
 * formatVideoDuration(90);    // Returns "1:30"
 * formatVideoDuration(3661);  // Returns "1:01:01"
 * formatVideoDuration(45);    // Returns "0:45"
 * ```
 */
export function formatVideoDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  else {
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  }
}
