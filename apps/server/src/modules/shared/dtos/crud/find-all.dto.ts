/**
 * Data Transfer Object for finding all entities.
 */
export interface IFindAllDto {
  /**
   * The ID of the user making the request.
   */
  userId: string;

  /**
   * The maximum number of entities to return.
   */
  limit: number;

  /**
   * The sorting criteria for the entities.
   */
  sort: ISort;

  /**
   * The number of entities to skip (optional).
   */
  skip?: number;
}

/**
 * Interface representing sorting options.
 */
export interface ISort {
  /**
   * The field by which to sort.
   */
  by: string;

  /**
   * The order in which to sort (e.g., 'asc' for ascending, 'desc' for descending).
   */
  order: string;
}
