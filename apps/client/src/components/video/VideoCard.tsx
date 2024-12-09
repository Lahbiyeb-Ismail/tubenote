import { useLayout } from "@/context/useLayout";
import type { Video } from "@/types/video.types";
import CardContent from "../global/CardContent";
import CardFooterWrapper from "../global/CardFooterWrapper";
import CardImage from "../global/CardImage";
import CardWrapper from "../global/CardWrapper";
import SeeAllButton from "../global/SeeAllButton";
import { CardTitle } from "../ui/card";

type VideoCardProps = {
  video: Video;
};

function VideoCard({ video }: VideoCardProps) {
  const { isGridLayout } = useLayout();
  return (
    <CardWrapper>
      <CardImage
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
        isGridLayout={isGridLayout}
      />

      <div
        className={`flex-grow p-2 ${
          isGridLayout ? "" : "flex flex-col justify-between"
        }`}
      >
        <CardContent
          cardTitle={video.snippet.title}
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

export default VideoCard;
