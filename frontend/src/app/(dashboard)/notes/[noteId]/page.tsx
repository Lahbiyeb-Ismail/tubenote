"use client";

import useGetNoteById from "@/hooks/note/useGetNoteById";

import MarkdownViewer from "@/components/global/MarkdownViewer";
import Loader from "@/components/global/Loader";
import NoteError from "@/components/note/NoteError";

import NotePageHeader from "@/components/note/NotePageHeader";
import NotePageFooter from "@/components/note/NotePageFooter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import VideoPlayer from "@/components/video/VideoPlayer";
import ResizablePanels from "@/components/global/ResizablePanels";

type NotePageParams = {
	noteId: string;
};

function NotePage({ params }: { params: NotePageParams }) {
	const { noteId } = params;
	const { data, isLoading, isError, refetch } = useGetNoteById(noteId);

	const [showVideoPlayer, setShowVideoPlayer] = useState(false);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
				<Loader />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
				<NoteError onRetry={() => refetch()} />
			</div>
		);
	}

	if (!data) return null;

	return (
		<article className="min-h-screen bg-white">
			{/* Header */}
			<NotePageHeader noteId={data.id} noteTitle={data.title} />

			{/* Content */}
			<main className="container h-screen mx-auto px-2 py-6 overflow-auto">
				{/* <div className="flex justify-end mb-4">
					<Button
						onClick={() => setShowVideoPlayer(!showVideoPlayer)}
						variant="outline"
						className="flex items-center"
					>
						<Youtube className="mr-2 h-4 w-4" />
						{showVideoPlayer ? "Hide Video" : "Show Video"}
					</Button>
				</div> */}
				<ResizablePanels
					leftSideContent={<MarkdownViewer content={data.content} />}
					rightSideContent={<VideoPlayer videoId={data.youtubeId} />}
				/>
				{/* <div
					className={`w-full flex ${showVideoPlayer ? "flex-row space-x-4" : "flex-col"}`}
				>
					<div
						className={`prose dark:prose-invert  max-h-[100vh] overflow-auto ${showVideoPlayer ? "w-1/2" : "min-w-full"}`}
					>
						<MarkdownViewer content={data.content} />
					</div>
					{showVideoPlayer && (
						<div className="w-1/2"> */}
				{/* <div className="aspect-w-16 aspect-h-9">
								<iframe
									title="youtube video"
									src={`https://www.youtube.com/embed/${data.videoId}`}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="w-full h-full"
								/>
							</div> */}
				{/* <VideoPlayer videoId={data.videoId} />
						</div>
					)}
				</div> */}
			</main>

			{/* Footer */}
			<NotePageFooter />
		</article>
	);
}

export default NotePage;
