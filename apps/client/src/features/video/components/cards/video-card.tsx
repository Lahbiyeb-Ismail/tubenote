import type { Video } from "@tubenote/types";

import { useUIStore } from "@/stores";

import {
  CardContent,
  CardFooterWrapper,
  CardImage,
  CardWrapper,
  SeeAllButton,
} from "@/components/global";

export function VideoCard({ video }: { video: Video }) {
  const { layout } = useUIStore();

  return (
    <CardWrapper>
      <CardImage
        src={video.thumbnails.medium.url}
        alt={video.title}
        isGridLayout={layout.isGridLayout}
      />

      <div
        className={`flex-grow p-2 ${
          layout.isGridLayout ? "" : "flex flex-col justify-between"
        }`}
      >
        <CardContent
          cardTitle={video.title}
          href={`/videos/${video.youtubeId}`}
          isGridLayout={layout.isGridLayout}
        />
        <CardFooterWrapper className="items-center justify-center">
          <SeeAllButton href={`/videos/${video.youtubeId}`} />
        </CardFooterWrapper>
      </div>
    </CardWrapper>
  );
}
