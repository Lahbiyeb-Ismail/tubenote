function extractVideoId(url: string) {
  const urlObject = new URL(url);
  const videoId = urlObject.searchParams.get("v");

  return videoId;
}

export default extractVideoId;
