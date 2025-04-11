/**
 * Interface representing a paginated collection of items.
 *
 * @template T - The type of items in the paginated collection.
 */
export interface IPaginatedData<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

/**
 * Represents metadata for paginated API responses.
 */
export interface IPaginationMeta {
  /**
   * The total number of pages available.
   */
  totalPages: number;

  /**
   * The current page number.
   */
  currentPage: number;

  /**
   * The total number of items across all pages.
   */
  totalItems: number;

  /**
   * Indicates whether there is a next page available.
   */
  hasNextPage: boolean;

  /**
   * Indicates whether there is a previous page available.
   */
  hasPrevPage: boolean;
}
