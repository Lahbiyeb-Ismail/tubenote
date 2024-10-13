"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import TextEditor from "@/components/editor/TextEditor";
import VideoPlayer from "@/components/video/VideoPlayer";
import { useVideo } from "@/context/useVideo";

function EditorPage() {
	const {
		state: { video },
	} = useVideo();

	return (
		<section className="height_viewport">
			<ResizablePanelGroup
				direction="horizontal"
				className="flex w-full border"
			>
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
