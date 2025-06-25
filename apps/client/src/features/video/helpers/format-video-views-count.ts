/**
 * Formats a video views count string into a human-readable format with appropriate suffixes.
 *
 * @param views - The raw views count as a string
 * @returns A formatted string with 'M' suffix for millions, 'K' suffix for thousands, or the original number for values under 1000
 *
 * @example
 * ```typescript
 * formatVideoViewsCount("1500000") // Returns "1.5M"
 * formatVideoViewsCount("2500") // Returns "2.5K"
 * formatVideoViewsCount("500") // Returns "500"
 * ```
 */
export function formatVideoViewsCount(views: string): string {
  const viewsNumber = Number.parseInt(views, 10);

  if (viewsNumber >= 1_000_000) {
    return `${(viewsNumber / 1_000_000).toFixed(1)}M`;
  }
  else if (viewsNumber >= 1_000) {
    return `${(viewsNumber / 1_000).toFixed(1)}K`;
  }
  else {
    return viewsNumber.toString();
  }
}
