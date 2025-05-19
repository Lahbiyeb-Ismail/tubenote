"use client";

import { useEditorContent } from "@/features/note/hooks";
import { useUIStore } from "@/stores";

import { AppMDXEditor, SaveNoteForm } from "@/components/editor";
import {
  ConfirmationModal,
  Loader,
  ResizablePanels,
  SaveButton,
} from "@/components/global";
import { VideoPlayer } from "@/features/video/components";

export interface NotePageLayoutProps {
  videoId: string;
  noteContent?: string;
  noteTitle?: string;
  isLoading: boolean;
  isSavingNote: boolean;
  modalTitle: string;
  modalDescription: string;
  handleSaveNote: (noteTitle: string, content: string) => void;
}

export function NotePageLayout({
  videoId,
  noteContent,
  noteTitle,
  isLoading,
  isSavingNote,
  modalTitle,
  modalDescription,
  handleSaveNote,
}: NotePageLayoutProps) {
  const { editorRef, getContent } = useEditorContent();
  const { actions } = useUIStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  const handleSaveSubmit = (noteTitle: string) => {
    const content = getContent();
    handleSaveNote(noteTitle, content);
  };

  return (
    <>
      <div className="flex h-screen bg-white">
        <ResizablePanels
          leftSideContent={
            <AppMDXEditor editorRef={editorRef} noteContent={noteContent} />
          }
          rightSideContent={<VideoPlayer videoId={videoId} />}
        />

        <SaveButton
          className="absolute bottom-3 right-[48%]"
          onClick={actions.openModal}
        />
      </div>
      <ConfirmationModal title={modalTitle} description={modalDescription}>
        <SaveNoteForm
          noteTitle={noteTitle}
          isLoading={isSavingNote}
          handleSaveSubmit={handleSaveSubmit}
        />
      </ConfirmationModal>
    </>
  );
}
