async function getVideoData(videoId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/videos/${videoId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch video data. Video not found.");
    } else {
      const videoData = await res.json();
      return videoData;
    }
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch video data. Please try again."
    );
  }
}

export default getVideoData;
