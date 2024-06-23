import extractVideoId from "@/helpers/extractVideoId";
import type { SearchFormType } from "@/types";
import type { SubmitHandler } from "react-hook-form";

import getVideoData from "./getVideoData";

const searchYoutubeVideo: SubmitHandler<SearchFormType> = async (
  data: SearchFormType
) => {
  const { videoUrl } = data;

  try {
    // Extract the video ID from the URL
    const videoId = extractVideoId(videoUrl) as string;

    // Fetch the video data
    const videoData = await getVideoData(videoId);

    return videoData;
  } catch (error) {
    throw new Error("Failed to fetch video data. Please try again.");
  }
};

export default searchYoutubeVideo;
