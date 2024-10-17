"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserVideos } from "@/actions/video.actions";
import { useAuth } from "@/context/useAuth";

function useGetUserVideos() {
	const {
		state: { accessToken },
	} = useAuth();

	return useQuery({
		queryKey: ["videos"],
		queryFn: () => getUserVideos(),
		enabled: !!accessToken,
	});
}

export default useGetUserVideos;
