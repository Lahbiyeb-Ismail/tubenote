"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TypedError } from "@/types";
import { saveVideoData } from "@/actions/video.actions";

function useSaveVideoData() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: saveVideoData,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["videoData"] });

			console.log(data);
		},
		onError: (error: TypedError) => {
			console.log(error);
		},
	});
}

export default useSaveVideoData;
