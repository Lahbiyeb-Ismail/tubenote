/**
 * Interface representing a paginated collection of items.
 *
 * @template T - The type of items in the paginated collection.
 */
export interface IPaginatedItems<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}
