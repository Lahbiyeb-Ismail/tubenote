"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";

import { useModal } from "@/context";
import { useNote } from "@/features/note/contexts";
import { useVideo } from "@/features/video/contexts";

import { useGetVideoById } from "@/features/video/hooks";

import { VideoPlayer } from "@/features/video/components";

import { AppMDXEditor, SaveNoteForm } from "@/components/editor";
import {
  ConfirmationModal,
  Loader,
  ResizablePanels,
  SaveButton,
} from "@/components/global";

function CreateNotePage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const { openModal, closeModal } = useModal();
  const { createNote, isLoading: isSavingNote } = useNote();
  const { videoCurrentTime } = useVideo();

  const { data: videoData, isLoading } = useGetVideoById(videoId);

  if (isLoading || !videoData) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  const handleCreateNote = (noteTitle: string) => {
    const noteContent = editorRef.current?.getMarkdown() || "";

    createNote({
      videoId: videoData.id,
      createNoteData: {
        title: noteTitle,
        content: noteContent,
        thumbnail: videoData.thumbnails.medium.url,
        videoTitle: videoData.title,
        youtubeId: videoData.youtubeId,
        timestamp: videoCurrentTime,
      },
    });
  };

  return (
    <>
      <div className="flex h-screen bg-white">
        <ResizablePanels
          leftSideContent={<AppMDXEditor editorRef={editorRef} />}
          rightSideContent={<VideoPlayer videoId={videoId} />}
        />

        <SaveButton
          className="absolute bottom-3 right-[48%]"
          onClick={openModal}
        />
      </div>
      <ConfirmationModal
        title="Confirm Save Note"
        description="Are you sure you want to save this note?"
      >
        <SaveNoteForm
          isLoading={isSavingNote}
          closeModal={closeModal}
          handleSaveSubmit={handleCreateNote}
        />
      </ConfirmationModal>
    </>
  );
}

export default CreateNotePage;
