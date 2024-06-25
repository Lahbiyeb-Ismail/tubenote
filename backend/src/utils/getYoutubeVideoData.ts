import type {
  VideoPart,
  YouTubeAPIResponse,
  YouTubeVideoItem,
} from '../types/video';

const URL = process.env['YOUTUBE_API_URL'];

async function getYoutubeVideoData(
  video_id: string | undefined,
  part: VideoPart,
): Promise<YouTubeVideoItem[] | undefined> {
  if (!video_id) {
    console.error('Video ID is undefined');
    return undefined;
  }

  try {
    const response = await fetch(
      `${URL}${video_id}&key=${process.env['YOUTUBE_API_KEY']}&part=${part}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: YouTubeAPIResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching video description:', error);
    return undefined;
  }
}

export default getYoutubeVideoData;
