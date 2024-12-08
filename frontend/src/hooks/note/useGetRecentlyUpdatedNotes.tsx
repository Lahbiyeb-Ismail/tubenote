"use client";

import { useQuery } from "@tanstack/react-query";

import { getRecentlyUpdatedNotes } from "@/actions/note.actions";
import { getStorageValue } from "@/utils/localStorage";

function useGetRecentlyUpdatedNotes() {
  const accessToken = getStorageValue<string>("accessToken");

  return useQuery({
    queryKey: ["notes", "recentlyUpdatedNotes"],
    queryFn: () => getRecentlyUpdatedNotes(),
    enabled: !!accessToken,
  });
}

export default useGetRecentlyUpdatedNotes;
