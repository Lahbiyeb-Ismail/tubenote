"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

import VideoPlayer from "@/components/video/VideoPlayer";

import ResizablePanels from "@/components/global/ResizablePanels";

const AppMDXEditor = dynamic(() => import("./AppMDXEditor"), { ssr: false });

type EditorPageProps = {
	videoId: string;
	initialNoteContent?: string;
	noteTitle?: string;
	noteId?: string;
	action?: "create" | "update";
};

function EditorPage({
	noteId,
	initialNoteContent,
	noteTitle,
	videoId,
	action = "create",
}: EditorPageProps) {
	return (
		<div className="flex h-screen bg-white">
			<ResizablePanels
				leftSideContent={
					<Suspense fallback={null}>
						<AppMDXEditor
							action={action}
							initialNoteContent={initialNoteContent}
							noteTitle={noteTitle}
							noteId={noteId}
						/>
					</Suspense>
				}
				rightSideContent={<VideoPlayer videoId={videoId} />}
			/>
		</div>
	);
}

export default EditorPage;
