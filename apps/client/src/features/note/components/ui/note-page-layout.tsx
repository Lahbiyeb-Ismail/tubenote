"use client";

import dynamic from "next/dynamic";

import { AppMDXEditor } from "@/components/editor";
import {
  Loader,
  ResizablePanels,
  SaveButton,
} from "@/components/global";
import { useEditorContent } from "@/features/note/hooks";
import { VideoPlayer } from "@/features/video/components";
import { useDialogStore } from "@/stores";

const SaveNoteDialog = dynamic(
  () => import("../save-note-dialog").then(mod => mod.SaveNoteDialog),
  { ssr: false, loading: () => <div className="hidden">Loading...</div> },
);

interface IProps {
  videoId: string;
  isLoading: boolean;
  isSavingNote: boolean;
  handleSaveNote: (title: string, content: string, category: string, tags: string[]) => void;
  noteTitle?: string;
  noteContent?: string;
  noteTags?: string[];
  noteCategory?: string;
}

export function NotePageLayout({
  videoId,
  isLoading,
  isSavingNote,
  handleSaveNote,
  noteTitle,
  noteContent,
  noteTags,
  noteCategory,
}: IProps) {
  const { editorRef, getContent } = useEditorContent();
  const { openDialog } = useDialogStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  const handleSaveSubmit = (title: string, category: string, tags: string[]) => {
    const content = getContent();
    handleSaveNote(title, content, category, tags);
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
          onClick={() => openDialog("save-note")}
        />
      </div>

      <SaveNoteDialog noteTitle={noteTitle} noteTags={noteTags} noteCategory={noteCategory} isSaving={isSavingNote} onSaveNote={handleSaveSubmit} />
    </>
  );
}
