export interface IPaginationMeta {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  paginationMeta?: IPaginationMeta;
}
