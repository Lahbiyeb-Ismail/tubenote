"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserVideos } from "@/actions/video.actions";
import { getStorageValue } from "@/utils/localStorage";

function useGetUserVideos() {
	const accessToken = getStorageValue<string>("accessToken");

	return useQuery({
		queryKey: ["videos"],
		queryFn: () => getUserVideos(),
		enabled: !!accessToken,
	});
}

export default useGetUserVideos;
