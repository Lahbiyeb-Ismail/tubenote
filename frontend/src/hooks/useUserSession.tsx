/* eslint-disable @typescript-eslint/naming-convention */

"use client";

import { useEffect } from "react";
import getUserSession from "@/actions/getUserSession";
import useAuthStore from "@/stores/authStore";
import type { UserDataType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUserSession() {
  const userData = useAuthStore((state) => state.userData);
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const { data: session, isLoading } = useQuery({
    queryKey: ["userSession"],
    queryFn: getUserSession,
    enabled: userData === null,
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
