"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserVideos } from "@/actions/video.actions";
import { useLocalStorage } from "../global/useLocalStorage";

function useGetUserVideos() {
	const [accessToken] = useLocalStorage("accessToken", null);

	return useQuery({
		queryKey: ["videos"],
		queryFn: () => getUserVideos(),
		enabled: !!accessToken,
	});
}

export default useGetUserVideos;
