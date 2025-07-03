import type { Video } from "@tubenote/db";

/**
 * Represents a video entity with an additional count of associated notes.
 *
 * @interface VideoWithCount
 * @extends Video
 *
 * @example
 * ```typescript
 * const videoWithCount: VideoWithCount = {
 *   // ...video properties
 *   _count: {
 *     notes: 5
 *   }
 * };
 * ```
 */
export interface VideoWithCount extends Video {
  _count: {
    notes: number;
  };
};
