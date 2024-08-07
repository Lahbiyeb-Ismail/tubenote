"use client";

import getNoteById from "@/actions/getNoteById";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

import TextEditor from "@/components/TextEditor";
import YoutubeVideoPlayer from "@/components/YoutubeVideoPlayer";
import Loader from "@/components/global/Loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

function VideoNotePage() {
  const { videoId: noteId, createUpdate } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId as string),
    enabled: createUpdate[0] === "update",
  });

  return (
    <section className="height_viewport">
      {isLoading && !data ? (
        <Loader />
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex w-full border"
        >
          <ResizablePanel defaultSize={35} className="p-2">
            <TextEditor
              initialNoteContent={data?.noteContent}
              noteTitle={data?.noteTitle}
              operation={createUpdate[0] as "create" | "update"}
              noteId={noteId as string}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} className="p-2">
            <YoutubeVideoPlayer />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </section>
  );
}

export default VideoNotePage;
