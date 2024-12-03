import type { Response, Request } from "express";
import httpStatus from "http-status";

import {
	createVideoEntry,
	fetchUserVideos,
	findVideo,
	getUserVideosCount,
} from "../services/video.services";

import {
	fetchNotesByVideoId,
	getVideoNotesCount,
} from "../services/note.services";

/**
 * Retrieves video data from YouTube and stores it in the database.
 *
 * @param req - The request object containing the videoId in the body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @remarks
 * - If the videoId is not provided in the request body, a 400 Bad Request status is returned.
 * - If no video data is found for the provided videoId, a 404 Not Found status is returned.
 * - If an error occurs while creating the video in the database, a 500 Internal Server Error
 * status is returned.
 *
 * @returns A JSON response containing the created video data or an error message.
 */

export async function handleCreateVideo(
	req: Request,
	res: Response,
): Promise<void> {
	const userId = req.userId;
	const { videoId } = req.body;

	if (!videoId) {
		res.status(httpStatus.BAD_REQUEST).json({ message: "VideoId is required" });
		return;
	}

	const videoExists = await findVideo({ youtubeId: videoId, userId });

	if (videoExists) {
		res.status(httpStatus.OK).json(videoExists);
		return;
	}

	const video = await createVideoEntry(videoId, userId);

	res.status(httpStatus.OK).json(video);
}

/**
 * Retrieves the videos associated with a specific user.
 *
 * @param req - The request object, which contains the userId.
 * @param res - The response object used to send back the videos.
 * @returns A JSON response containing the user's videos.
 */
export async function getUserVideos(req: Request, res: Response) {
	const userId = req.userId;
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const page = req.query["page"] ? Number(req.query["page"]) : 1;
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const limit = req.query["limit"] ? Number(req.query["limit"]) : 8;

	const skip = (page - 1) * limit;

	const [videosCount, videos] = await Promise.all([
		getUserVideosCount({ userId }),
		fetchUserVideos({ userId, skip, limit }),
	]);

	const totalPages = Math.ceil(videosCount / limit);

	res.status(httpStatus.OK).json({
		videos,
		pagination: {
			totalPages,
			currentPage: page,
			totalVideos: videosCount,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	});
}

/**
 * Handles the request to get a video by its ID.
 *
 * This function retrieves a video based on the provided video ID and user ID.
 * If the video is found, it returns the video data. If the video is not found,
 * it creates a new video entry and returns the newly created video data.
 *
 * @param req - The request object containing the video ID in the parameters and user ID.
 * @param res - The response object used to send the response back to the client.
 *
 * @returns A JSON response with the video data or an error message if the video ID is not provided.
 */
export async function handleGetVideoById(req: Request, res: Response) {
	const { videoId } = req.params;
	const userId = req.userId;

	if (!videoId) {
		res.status(httpStatus.BAD_REQUEST).json({ message: "VideoId is required" });
		return;
	}

	const video = await findVideo({ youtubeId: videoId, userId });

	if (video) {
		res.status(httpStatus.OK).json(video);
		return;
	}

	const newVideo = await createVideoEntry(videoId, userId);

	res.status(httpStatus.OK).json(newVideo);
}

/**
 * Handles the request to get notes by video ID.
 *
 * @param req - The request object containing user ID and video ID.
 * @param res - The response object to send the result.
 *
 * @remarks
 * This function retrieves notes associated with a specific video ID for a user.
 * It supports pagination through query parameters `page` and `limit`.
 *
 * @returns A JSON response containing the video details, notes, and pagination information.
 *
 * @throws If the video ID is not provided, it returns a 400 Bad Request status with an error message.
 */
export async function handleGetNotesByVideoId(req: Request, res: Response) {
	const userId = req.userId;
	const { videoId } = req.params;

	if (!videoId) {
		res
			.status(httpStatus.BAD_REQUEST)
			.json({ message: "Please provide the video ID." });
		return;
	}

	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const page = req.query["page"] ? Number(req.query["page"]) : 1;
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	const limit = req.query["limit"] ? Number(req.query["limit"]) : 1;

	const skip = (page - 1) * limit;

	const [notesCount, notes] = await Promise.all([
		getVideoNotesCount({ userId, videoId }),
		fetchNotesByVideoId({ userId, videoId, limit, skip }),
	]);

	const totalPages = Math.ceil(notesCount / limit);

	res.status(httpStatus.OK).json({
		notes,
		pagination: {
			totalPages,
			currentPage: page,
			totalNotes: notesCount,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	});
}
