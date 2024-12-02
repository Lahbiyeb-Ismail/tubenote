import type { Video } from "@/types/video.types";
import CardImage from "../global/CardImage";
import CardWrapper from "../global/CardWrapper";
import { useLayout } from "@/context/useLayout";
import { CardTitle } from "../ui/card";
import CardContent from "../global/CardContent";
import CardFooterWrapper from "../global/CardFooterWrapper";
import SeeAllButton from "../global/SeeAllButton";

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
					href={`/videos/${video.id}`}
					isGridLayout={isGridLayout}
				/>
				<CardFooterWrapper className="items-center justify-center">
					<SeeAllButton href={`/videos/${video.id}`} />
				</CardFooterWrapper>
			</div>
		</CardWrapper>
	);
}

export default VideoCard;
