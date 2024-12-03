"use client";

import type { Video } from "@/types/video.types";

import { useLayout } from "@/context/useLayout";
import VideoCard from "./VideoCard";

type VideosListProps = {
	videos: Video[];
};

function VideosList({ videos }: VideosListProps) {
	const { isGridLayout } = useLayout();

	return (
		<div className="md:px-4 py-6">
			<div
				className={`${isGridLayout ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" : "space-y-4"}`}
			>
				{videos.map((video) => (
					<VideoCard key={video.id} video={video} />
				))}
			</div>
		</div>
	);
}

export default VideosList;
