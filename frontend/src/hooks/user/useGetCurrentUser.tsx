"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/actions/user.actions";
import { useLocalStorage } from "../global/useLocalStorage";

function useGetCurrentUser() {
	const [accessToken] = useLocalStorage("accessToken", null);

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
