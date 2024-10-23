"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getCurrentUser } from "@/actions/user.actions";

function useGetCurrentUser() {
	const accessToken = useMemo(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("accessToken");
		}
		return null;
	}, []);

	return useQuery({
		queryKey: ["current-user", accessToken],
		queryFn: getCurrentUser,
		// Enable the query only if the access token is available.
		enabled: !!accessToken,
		// The data is considered fresh for 5 minutes, after which it will be refetched.
		staleTime: 5 * 60 * 1000,
	});
}

export default useGetCurrentUser;
