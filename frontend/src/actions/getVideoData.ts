async function getVideoData(videoId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/videos/${videoId}`);

    if (res.status === 404) {
      throw new Error("Failed to fetch video data. Video not found.");
    } else {
      const videoData = await res.json();
      return videoData;
    }
  } catch (error) {
    console.error("Error fetching video data:", error);
    return undefined;
  }
}

export default getVideoData;
