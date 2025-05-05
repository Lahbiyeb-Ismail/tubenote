"use client";

import { useQuery } from "@tanstack/react-query";

import { getNoteById } from "../services";

export function useGetNoteById(noteId: string) {
  return useQuery({
    queryKey: [noteId],
    queryFn: () => getNoteById(noteId),
    select: (data) => data.payload.data,
    enabled: !!noteId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
