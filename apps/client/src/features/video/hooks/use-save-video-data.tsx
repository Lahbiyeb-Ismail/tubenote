"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { saveVideoData } from "../services";

export function useSaveVideoData() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: saveVideoData,
    onMutate: () => {
      toast.loading("Getting Video Data...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;
      toast.dismiss("loadingToast");

      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["videoData"] });

      router.push(`/notes/create/${payload.data.youtubeId}`);
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);
    },
  });
}
