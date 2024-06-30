"use client";

import React from "react";
import { useRouter } from "next/navigation";
import getVideoData from "@/actions/getVideoData";
import extractVideoId from "@/helpers/extractVideoId";
import { searchFormSchema } from "@/schemas";
import useVideoDataStore from "@/stores/videoDataStore";
import type { SearchFormType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

function AddNoteForm() {
  const { setVideoData } = useVideoDataStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<SearchFormType>({
    resolver: zodResolver(searchFormSchema),
  });

  const searchYoutubeVideo: SubmitHandler<SearchFormType> = async (
    data: SearchFormType
  ) => {
    const { videoUrl } = data;

    try {
      // Extract the video ID from the URL
      const videoId = extractVideoId(videoUrl) as string;

      // Fetch the video data
      const videoData = await getVideoData(videoId);

      setVideoData(videoData);
      router.push(`/editor/${videoId}/create`);
    } catch (error: any) {
      setError("videoUrl", {
        type: "manual",
        message:
          error.message || "Failed to fetch video data. Please try again.",
      });
    }
  };

  return (
    <form
      className="w-full max-w-md"
      onSubmit={handleSubmit(searchYoutubeVideo)}
    >
      <div className="flex items-center border-b border-[#171215] py-2">
        <input
          className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
          type="url"
          placeholder="Enter YouTube video URL"
          aria-label="YouTube video URL"
          required
          {...register("videoUrl")}
        />
        <button
          className="flex-shrink-0 rounded border-4 border-[#171215] bg-[#171215] px-2 py-1 text-sm text-white hover:border-[#2c2326] hover:bg-[#2c2326]"
          type="submit"
        >
          {isSubmitting ? "Loading..." : "Take Note"}
        </button>
      </div>
      {errors.videoUrl && (
        <p className="mt-4 text-sm text-red-600">{errors.videoUrl.message}</p>
      )}
    </form>
  );
}

export default AddNoteForm;
