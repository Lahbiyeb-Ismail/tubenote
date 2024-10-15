"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import TextEditor from "@/components/editor/TextEditor";
import VideoPlayer from "@/components/video/VideoPlayer";
import { useVideo } from "@/context/useVideo";
import { useEffect, useState } from "react";

function EditorPage() {
	const {
		state: { video },
	} = useVideo();

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
				<ResizablePanel defaultSize={35} className="p-2">
					<TextEditor />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={65} className="p-2">
					<VideoPlayer videoId={video?.youtubeId} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</section>
	);
}

export default EditorPage;
