import {
  CardContent,
  CardFooterWrapper,
  CardImage,
  CardWrapper,
  SeeAllButton,
} from "@/components/global";
import { useUIStore } from "@/stores";
import type { Video } from "@tubenote/types";

export function VideoCard({ video }: { video: Video }) {
  // Using Zustand store directly instead of context
  const isGridLayout = useUIStore((state) => state.layout.isGridLayout);

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
