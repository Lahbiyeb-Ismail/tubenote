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
		<section className="height_viewport">
			<ResizablePanelGroup direction={direction} className="flex w-full border">
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
		</section>
	);
}

export default EditorPage;
