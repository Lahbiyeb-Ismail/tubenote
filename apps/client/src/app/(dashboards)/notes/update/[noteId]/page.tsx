"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";

import { useGetNoteById } from "@/features/note/hooks";

import { VideoPlayer } from "@/features/video/components";

import { AppMDXEditor, SaveNoteForm } from "@/components/editor";
import {
  ConfirmationModal,
  Loader,
  ResizablePanels,
  SaveButton,
} from "@/components/global";
import { useModal } from "@/context";
import { useNote } from "@/features/note/contexts";
import { useVideo } from "@/features/video/contexts";

function UpdateNotePage({ params }: { params: { noteId: string } }) {
  const { noteId } = params;
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const { openModal, closeModal } = useModal();
  const { updateNote, isLoading: isUpdatingNote } = useNote();
  const { videoCurrentTime } = useVideo();

  const { data: note, isLoading, isError } = useGetNoteById(noteId);

  if (isLoading || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error...</div>;
  }

  const handleUpdateNote = (noteTitle: string) => {
    const noteContent = editorRef.current?.getMarkdown() || "";

    updateNote({
      noteId: note.id,
      updateData: {
        title: noteTitle,
        content: noteContent,
        timestamp: videoCurrentTime,
      },
    });
  };

  return (
    <>
      <div className="flex h-screen bg-white">
        <ResizablePanels
          leftSideContent={
            <AppMDXEditor editorRef={editorRef} noteContent={note.content} />
          }
          rightSideContent={<VideoPlayer videoId={note.youtubeId} />}
        />

        <SaveButton
          className="absolute bottom-3 right-[48%]"
          onClick={openModal}
        />
      </div>
      <ConfirmationModal
        title="Confirm Update Note"
        description="Are you sure you want to update this note?"
      >
        <SaveNoteForm
          isLoading={isUpdatingNote}
          closeModal={closeModal}
          handleSaveSubmit={handleUpdateNote}
        />
      </ConfirmationModal>
    </>
  );
}

export default UpdateNotePage;
