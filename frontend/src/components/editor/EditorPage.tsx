"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

import VideoPlayer from "@/components/video/VideoPlayer";

import ResizablePanels from "@/components/global/ResizablePanels";
import Sidebar from "@/components/dashboards/Sidebar";

import { useLayout } from "@/context/useLayout";

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
	const { isSidebarOpen } = useLayout();

	return (
		<div className="flex h-screen">
			<Sidebar />
			<div
				className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
			>
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
		</div>
	);
}

export default EditorPage;
