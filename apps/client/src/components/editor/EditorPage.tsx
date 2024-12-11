"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import VideoPlayer from "@/components/video/VideoPlayer";

import ResizablePanels from "@/components/global/ResizablePanels";
import type { Video } from "@/types/video.types";

const AppMDXEditor = dynamic(() => import("./AppMDXEditor"), { ssr: false });

type EditorPageProps = {
  video: Video;
  initialNoteContent?: string;
  noteTitle?: string;
  noteId?: string;
  action?: "create" | "update";
};

function EditorPage({
  noteId,
  video,
  initialNoteContent,
  noteTitle,
  action = "create",
}: EditorPageProps) {
  return (
    <div className="flex h-screen bg-white">
      <ResizablePanels
        leftSideContent={
          <Suspense fallback={null}>
            <AppMDXEditor
              action={action}
              initialNoteContent={initialNoteContent}
              noteTitle={noteTitle}
              noteId={noteId}
              video={video}
            />
          </Suspense>
        }
        rightSideContent={<VideoPlayer videoId={video.youtubeId} />}
      />
    </div>
  );
}

export default EditorPage;
