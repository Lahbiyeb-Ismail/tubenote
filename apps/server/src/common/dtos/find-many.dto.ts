export interface FindManyDto {
  userId: string;
  limit: number;
  skip?: number;
  sort: Sort;
}

export interface Sort {
  by: "createdAt" | "updatedAt";
  order: "asc" | "desc";
}
