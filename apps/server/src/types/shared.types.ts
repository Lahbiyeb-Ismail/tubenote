export interface UserId {
  userId: string;
}

export interface VideoId {
  videoId: string;
}

export interface NoteId {
  noteId: string;
}

export interface PaginationParams {
  limit: number;
  skip?: number;
}

export interface SortingOptions {
  sort: {
    by: "createdAt" | "updatedAt";
    order: "asc" | "desc";
  };
}

export interface FindManyParams
  extends UserId,
    PaginationParams,
    SortingOptions {}
