"use client";

import React from "react";
import { useParams } from "next/navigation";
import getNoteById from "@/actions/getNoteById";
import { useQuery } from "@tanstack/react-query";

import Loader from "@/components/global/Loader";
import TextEditor from "@/components/TextEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import YoutubeVideoPlayer from "@/components/YoutubeVideoPlayer";

function VideoNotePage() {
  const { noteId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId as string),
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
