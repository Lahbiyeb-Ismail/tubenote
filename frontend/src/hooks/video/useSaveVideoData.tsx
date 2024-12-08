"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { saveVideoData } from "@/actions/video.actions";
import type { TypedError } from "@/types";
import type { VideoAction } from "@/types/video.types";
import toast from "react-hot-toast";

function useSaveVideoData(dispatch: React.Dispatch<VideoAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: saveVideoData,
    onMutate: () => {
      toast.loading("Saving video...", { id: "loadingToast" });
    },
    onSuccess: (data) => {
      toast.dismiss("loadingToast");

      toast.success("Video saved successfully.");

      queryClient.invalidateQueries({ queryKey: ["videoData"] });

      dispatch({
        type: "SAVE_VIDEO_SUCCESS",
        payload: {
          video: data,
          message: "Video saved successfully",
          success: true,
        },
      });

      router.push(`/editor/create/${data.youtubeId}`);
    },
    onError: (error: TypedError) => {
      toast.dismiss("loadingToast");
      if (error.response) {
        toast.error(error.response.data.message);
        dispatch({
          type: "SAVE_VIDEO_FAIL",
          payload: { message: error.response.data.message, success: false },
        });
      } else {
        toast.error("Video Saving Failed. Please try again.");
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
