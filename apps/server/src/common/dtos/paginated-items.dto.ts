export interface PaginatedItems<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}
