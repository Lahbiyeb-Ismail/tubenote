import axiosInstance from "@/lib/axios.lib";

import extractVideoId from "@/helpers/extractVideoId";
import type { Video } from "@/types/video.types";
import type { Pagination } from "@/types";
import type { Note } from "@/types/note.types";
import { setStorageValue } from "@/utils/localStorage";

type VideoIdParam = { videoId: string };
type LimitParam = { limit: number };
type PageParam = { page: number };

type GetVideoNotesProps = VideoIdParam & PageParam & LimitParam;

/**
 * Saves video data by extracting the video ID from the provided URL
 * and sending it to the server.
 *
 * @param {string} videoUrl - The URL of the video to be saved.
 * @returns {Promise<Video | null>} - A promise that resolves to the saved
 * video data or null if the video ID could not be extracted.
 */
export async function saveVideoData(videoUrl: string): Promise<Video> {
	const videoId = extractVideoId(videoUrl);

	const response = await axiosInstance.post("/videos", { videoId });

	return response.data;
}

/**
 * Fetches the list of videos for the user.
 *
 * @returns {Promise<Video[]>} A promise that resolves to an array of Video objects.
 */
export async function getUserVideos({
	page,
	limit,
}: { page: number; limit: number }): Promise<{
	videos: Video[];
	pagination: Pagination;
}> {
	const response = await axiosInstance.get<{
		videos: Video[];
		pagination: Pagination;
	}>(`/videos?page=${page}&limit=${limit}`);

	const { videos, pagination } = response.data;

	return { videos, pagination };
}

/**
 * Fetches a video by its ID.
 *
 * @param {string} videoId - The ID of the video to fetch.
 * @returns {Promise<Video>} A promise that resolves to the video data.
 */
export async function getVideoById(videoId: string): Promise<Video> {
	const response = await axiosInstance.get(`/videos/${videoId}`);

	setStorageValue("video", response.data.video);

	return response.data;
}

/**
 * Fetches the notes for a specific video.
 *
 * @param {Object} params - The parameters for fetching video notes.
 * @param {string} params.videoId - The ID of the video.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of notes per page.
 * @returns {Promise<Object>} A promise that resolves to an object containing the video, notes, and pagination information.
 * @returns {Promise<Video>} video - The video object.
 * @returns {Promise<Note[]>} notes - An array of notes.
 * @returns {Promise<Pagination>} pagination - The pagination information.
 */
export async function getVideoNotes({
	videoId,
	page,
	limit,
}: GetVideoNotesProps): Promise<{
	video: Video;
	notes: Note[];
	pagination: Pagination;
}> {
	const response = await axiosInstance.get<{
		video: Video;
		notes: Note[];
		pagination: Pagination;
	}>(`/videos/${videoId}/notes?page=${page}&limit=${limit}`);

	setStorageValue("video", response.data.video);

	return response.data;
}
