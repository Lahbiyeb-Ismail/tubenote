/**
 * Formats a timestamp in seconds to a readable format.
 * For timestamps less than 1 hour: "mm:ss"
 * For timestamps 1 hour or more: "hh:mm:ss"
 *
 * @param seconds - The timestamp in seconds
 * @returns A formatted string representation of the timestamp
 */
export function formatTimestamp(seconds: number): string {
  if (Number.isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds with leading zeros
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  // Include hours only if the timestamp is at least 1 hour
  if (hours > 0) {
    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
}
