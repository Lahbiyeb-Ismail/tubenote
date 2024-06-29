import React from "react";

import TextEditor from "@/components/TextEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import YoutubeVideoPlayer from "@/components/YoutubeVideoPlayer";

function VideoNotePage() {
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
          <YoutubeVideoPlayer />
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}

export default VideoNotePage;
