import type { IPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks";

import { searchNotes } from "../services";

export function useSearchNotesQuery(query: string, paginationQuery: IPaginationQueryDto) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["notes", "search", query, paginationQuery],
    queryFn: () => searchNotes(query, paginationQuery),
    select: data => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    enabled: isAuthenticated && !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
