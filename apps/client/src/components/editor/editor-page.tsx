"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import type { Video } from "@tubenote/types";

import { ResizablePanels } from "@/components/global";
import { VideoPlayer } from "@/features/video/components";

const AppMDXEditor = dynamic(() => import("./app-mdxeditor"), { ssr: false });

type EditorPageProps = {
  video: Video;
  initialNoteContent?: string;
  noteTitle?: string;
  noteId?: string;
  action?: "create" | "update";
};

export function EditorPage({
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
