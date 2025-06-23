/**
 * Converts a date string to a human-readable relative time format.
 *
 * @param dateString - The date string to convert.
 * @returns A string representing the time difference from the given date to now,
 *          such as "just now", "5 minutes ago", "2 hours ago", or "3 days ago".
 */
export function fromDistanceToNow(dateString: string | Date) {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }
  else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  else {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
}
