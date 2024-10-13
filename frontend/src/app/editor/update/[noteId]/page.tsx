"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import TextEditor from "@/components/editor/TextEditor";
import VideoPlayer from "@/components/video/VideoPlayer";
import { useNote } from "@/context/useNote";

function EditorPage() {
	const {
		state: { note },
	} = useNote();

	return (
		<section className="height_viewport">
			<ResizablePanelGroup
				direction="horizontal"
				className="flex w-full border"
			>
				<ResizablePanel defaultSize={35} className="p-2">
					<TextEditor
						initialNoteContent={note?.content}
						noteTitle={note?.title}
						action="update"
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={65} className="p-2">
					<VideoPlayer videoId={note?.youtubeId} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</section>
	);
}

export default EditorPage;
