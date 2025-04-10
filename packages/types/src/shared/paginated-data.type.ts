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
