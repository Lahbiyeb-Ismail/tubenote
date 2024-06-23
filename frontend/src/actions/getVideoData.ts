import type { VideoDataResponseType } from "@/types";

async function getVideoData(videoId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/videos/${videoId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch video data. Video not found.");
    } else {
      const { videoInfo } = await res.json();

      return videoInfo as VideoDataResponseType;
    }
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch video data. Please try again."
    );
  }
}

export default getVideoData;
