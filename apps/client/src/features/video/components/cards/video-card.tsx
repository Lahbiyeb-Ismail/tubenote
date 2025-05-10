import type { Video } from "@tubenote/types";

import { useLayout } from "@/context";

import {
  CardContent,
  CardFooterWrapper,
  CardImage,
  CardWrapper,
  SeeAllButton,
} from "@/components/global";

export function VideoCard({ video }: { video: Video }) {
  const { isGridLayout } = useLayout();
  return (
    <CardWrapper>
      <CardImage
        src={video.thumbnails.medium.url}
        alt={video.title}
        isGridLayout={isGridLayout}
      />

      <div
        className={`flex-grow p-2 ${
          isGridLayout ? "" : "flex flex-col justify-between"
        }`}
      >
        <CardContent
          cardTitle={video.title}
          href={`/videos/${video.youtubeId}`}
          isGridLayout={isGridLayout}
        />
        <CardFooterWrapper className="items-center justify-center">
          <SeeAllButton href={`/videos/${video.youtubeId}`} />
        </CardFooterWrapper>
      </div>
    </CardWrapper>
  );
}
