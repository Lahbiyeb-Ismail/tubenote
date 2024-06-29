"use client";

import { useEffect, useState } from "react";
import getUserNotes from "@/actions/getUserNotes";
import { useQuery } from "@tanstack/react-query";

import { useUserSession } from "@/hooks/useUserSession";

function useUserNotes() {
  const { userData, isLoading: isUserLoading } = useUserSession();
  const [shouldFetchNotes, setShouldFetchNotes] = useState(false);

  const { data, isLoading: isNotesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getUserNotes(userData?.userId as string),
    enabled: shouldFetchNotes,
  });

  useEffect(() => {
    if (userData && !isUserLoading) {
      setShouldFetchNotes(true);
    }
  }, [userData, isUserLoading]);

  return { data, isNotesLoading, isUserLoading };
}

export default useUserNotes;
