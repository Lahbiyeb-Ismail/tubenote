"use client";

import type { Video } from "@tubenote/types";

import { useLayout } from "@/context";
import { VideoCard } from "../cards";

type VideosListProps = {
  videos: Video[];
};

export function VideosList({ videos }: VideosListProps) {
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
