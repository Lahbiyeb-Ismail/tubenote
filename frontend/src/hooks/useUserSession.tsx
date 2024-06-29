/* eslint-disable @typescript-eslint/naming-convention */

"use client";

import { useEffect } from "react";
import getUserSession from "@/actions/getUserSession";
import useAuthStore from "@/stores/authStore";
import type { UserDataType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUserSession() {
  const { setAuthData, userData } = useAuthStore();

  const { data: session, isLoading } = useQuery({
    queryKey: ["userSession"],
    queryFn: getUserSession,
  });

  useEffect(() => {
    if (session) {
      const { id, email, picture, family_name, given_name } = session.user;
      const { userId } = session;
      const username = `${given_name} ${family_name}`;

      const user: UserDataType = { id, email, picture, username, userId };

      setAuthData(user);
    }
  }, [session, setAuthData]);

  return { session, isLoading, userData };
}
