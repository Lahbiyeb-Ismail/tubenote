import type { Video } from "@tubenote/db";

import { VideoCard } from "./video-card";

interface IProps {
  viewMode: "grid" | "list";
  videos: Video[];
}

export function VideosList({ viewMode, videos }: IProps) {
  return (
    <div
      className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4" : "space-y-4 mb-4"}
    >
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}

      {/* <NoteDeletionDialog /> */}
    </div>
  );
}
