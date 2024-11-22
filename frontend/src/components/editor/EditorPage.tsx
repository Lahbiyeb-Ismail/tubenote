"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import VideoPlayer from "@/components/video/VideoPlayer";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import Sidebar from "../dashboards/Sidebar";
import { useLayout } from "@/context/useLayout";

const AppMDXEditor = dynamic(() => import("./AppMDXEditor"), { ssr: false });

type EditorPageProps = {
	videoId?: string;
	initialNoteContent?: string;
	noteTitle?: string;
	action?: "create" | "update";
};

function EditorPage({
	initialNoteContent,
	noteTitle,
	videoId,
	action = "create",
}: EditorPageProps) {
	const [direction, setDirection] = useState<"horizontal" | "vertical">(
		"horizontal",
	);
	const { isSidebarOpen } = useLayout();

	useEffect(() => {
		function changeDirection() {
			if (window.innerWidth < 768) {
				setDirection("vertical");
			} else {
				setDirection("horizontal");
			}
		}

		changeDirection();

		window.addEventListener("resize", changeDirection);
		return () => window.removeEventListener("resize", changeDirection);
	}, []);

	return (
		<div className="flex h-screen">
			<Sidebar />
			<div
				className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
			>
				<ResizablePanelGroup
					direction={direction}
					className="flex w-full h-full"
				>
					<ResizablePanel defaultSize={50} className="p-2 relative">
						<Suspense fallback={null}>
							<AppMDXEditor
								action={action}
								initialNoteContent={initialNoteContent}
								noteTitle={noteTitle}
							/>
						</Suspense>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={50} className="p-2">
						<VideoPlayer videoId={videoId} />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}

export default EditorPage;
