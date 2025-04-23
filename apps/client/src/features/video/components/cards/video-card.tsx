import { useLayout } from "@/context/useLayout";

import CardContent from "@/components/global/CardContent";
import CardFooterWrapper from "@/components/global/CardFooterWrapper";
import CardImage from "@/components/global/CardImage";
import CardWrapper from "@/components/global/CardWrapper";
import SeeAllButton from "@/components/global/SeeAllButton";
import type { Video } from "@tubenote/types";

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
