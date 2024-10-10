import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import TextEditor from "@/components/editor/TextEditor";
import VideoPlayer from "@/components/video/VideoPlayer";

function EditorPage() {
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
					<VideoPlayer />
				</ResizablePanel>
			</ResizablePanelGroup>
		</section>
	);
}

export default EditorPage;
