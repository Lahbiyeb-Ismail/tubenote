"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getVideoData } from "../services";
import type { VideoAction } from "../types";

export function useGetVideoData(dispatch: React.Dispatch<VideoAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: getVideoData,
    onMutate: () => {
      toast.loading("Getting Video Data...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;
      toast.dismiss("loadingToast");

      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["videoData"] });

      dispatch({
        type: "SAVE_VIDEO_SUCCESS",
        payload: {
          video: payload.data,
          message: payload.message,
          success: true,
        },
      });

      router.push(`/editor/create/${payload.data.youtubeId}`);
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);

      dispatch({
        type: "SAVE_VIDEO_FAIL",
        payload: { message: error.message, success: false },
      });
    },
  });
}
