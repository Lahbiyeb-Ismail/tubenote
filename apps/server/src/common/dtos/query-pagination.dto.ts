export interface QueryPaginationDto {
  page?: string;
  limit?: string;
  sortBy?: "createdAt" | "updatedAt";
  order?: "desc" | "asc";
}
