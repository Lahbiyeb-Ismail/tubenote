"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TypedError } from "@/types";
import { saveVideoData } from "@/actions/video.actions";
import type { VideoAction } from "@/types/video.types";

function useSaveVideoData(dispatch: React.Dispatch<VideoAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: saveVideoData,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["videoData"] });

			dispatch({
				type: "SAVE_VIDEO_SUCCESS",
				payload: {
					video: data,
					message: "Video saved successfully",
					success: true,
				},
			});

			router.push(`/editor/${data.youtubeId}`);
		},
		onError: (error: TypedError) => {
			console.log(error);
			if (error.response) {
				dispatch({
					type: "SAVE_VIDEO_FAIL",
					payload: { message: error.response.data.message, success: false },
				});
			} else {
				dispatch({
					type: "SAVE_VIDEO_FAIL",
					payload: {
						message: "Video Saving Failed. Please try again.",
						success: false,
					},
				});
			}
		},
	});
}

export default useSaveVideoData;
