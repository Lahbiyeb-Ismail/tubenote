import type { Prisma, Video } from "@prisma/client";

import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";
import { fetchYoutubeVideoDetails } from "../helpers/video.helper";

type UserId = {
	userId: string;
};

type FetchUserVideos = UserId & {
	limit: number;
	skip: number;
};

/**
 * Finds the first video that matches the given parameters.
 *
 * @param params - The parameters to filter the videos.
 * @returns A promise that resolves to the found video or null if no video matches the parameters.
 * @throws Will throw an error if the operation fails.
 */
export async function findVideo(
	params: Prisma.VideoWhereInput,
): Promise<Video | null> {
	return handleAsyncOperation(
		() =>
			prismaClient.video.findFirst({
				where: { ...params },
			}),
		{ errorMessage: "Faild to find video" },
	);
}

/**
 * Creates a new video entry in the database.
 *
 * @param videoId - The ID of the YouTube video.
 * @param userId - The ID of the user creating the video entry.
 * @returns A promise that resolves to the created Video object.
 * @throws Will throw an error if no video data is found.
 *
 * This function fetches video details from YouTube using the provided video ID,
 * and then creates a new video entry in the database with the fetched details.
 * If the video data is not found, it throws an error.
 */
export async function createVideoEntry(
	videoId: string,
	userId: string,
): Promise<Video> {
	const videoData = await fetchYoutubeVideoDetails(videoId);

	if (!videoData.length) {
		throw new Error("No video data found");
	}

	const { snippet, statistics, player } = videoData[0];

	return handleAsyncOperation(
		() =>
			prismaClient.video.create({
				data: {
					userId,
					youtubeId: videoId,
					snippet: {
						title: snippet.title,
						categoryId: snippet.categoryId,
						channelId: snippet.channelId,
						channelTitle: snippet.channelTitle,
						description: snippet.description,
						liveBroadcastContent: snippet.liveBroadcastContent,
						publishedAt: snippet.publishedAt,
						tags: snippet.tags,
						thumbnails: snippet.thumbnails,
					},
					statistics,
					player,
				},
			}),
		{ errorMessage: "Failed to create video entry" },
	);
}

/**
 * Fetches a list of videos for a specific user.
 *
 * @param {Object} params - The parameters for fetching user videos.
 * @param {string} params.userId - The ID of the user whose videos are to be fetched.
 * @param {number} params.limit - The maximum number of videos to fetch.
 * @param {number} params.skip - The number of videos to skip before starting to fetch.
 * @returns {Promise<Video[]>} A promise that resolves to an array of videos.
 * @throws Will throw an error if the operation fails.
 */
export async function fetchUserVideos({
	userId,
	limit,
	skip,
}: FetchUserVideos): Promise<Video[]> {
	return handleAsyncOperation(
		() =>
			prismaClient.video.findMany({
				where: { userId },
				take: limit,
				skip,
			}),
		{ errorMessage: "Failed to find user videos" },
	);
}

/**
 * Retrieves the count of videos associated with a specific user.
 *
 * @param {UserId} param0 - An object containing the user ID.
 * @returns {Promise<number>} - A promise that resolves to the count of videos.
 * @throws Will throw an error if the operation fails.
 */
export async function getUserVideosCount({ userId }: UserId): Promise<number> {
	return handleAsyncOperation(
		() =>
			prismaClient.video.count({
				where: {
					userId,
				},
			}),
		{ errorMessage: "Failed to count user videos." },
	);
}
