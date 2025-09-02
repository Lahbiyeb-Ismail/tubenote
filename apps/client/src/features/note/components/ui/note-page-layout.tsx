"use client";

import dynamic from "next/dynamic";

import { useEditorContent } from "@/features/note/hooks";
import { VideoPlayer, VideoTranscript } from "@/features/video/components";
import {
  AppMDXEditor,
  Loader,
  ResizablePanels,
} from "@/shared/components";

import { NoteActionHeader } from "../note-action-header";

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

  const handleSaveSubmit = (title: string, category: string, tags: string[]) => {
    const content = getContent();
    handleSaveNote(title, content, category, tags);
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  // const renderEditor = () => (
  //   <ResizablePanel defaultSize={50} minSize={30} maxSize={70} className="px-2 relative">
  //     <AppMDXEditor editorRef={editorRef} noteContent={noteContent} />
  //   </ResizablePanel>
  // );
  // ;

  // const renderVideoPlayer = () => (
  //   <ResizablePanel defaultSize={50} minSize={30} maxSize={70} className="px-2 relative">
  //     <VideoPlayer videoId={videoId} />
  //   </ResizablePanel>
  // );

  return (
    <div className="h-screen bg-white">
      <NoteActionHeader />

      <div className="h-[calc(100vh-60px)] p-2">
        <ResizablePanels
          leftSideContent={<AppMDXEditor editorRef={editorRef} noteContent={noteContent} />}
          rightSideContent={<VideoPlayer videoId={videoId} />}
        />

        {/* <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
          {editorPosition === "left"
            ? (
                <>
                  {renderEditor()}
                  <ResizableHandle withHandle />
                  {renderVideoPlayer()}
                </>
              )
            : (
                <>
                  {renderVideoPlayer()}
                  <ResizableHandle withHandle />
                  {renderEditor()}
                </>
              )}
        </ResizablePanelGroup> */}
      </div>

      <VideoTranscript videoId={videoId} />

      <SaveNoteDialog noteTitle={noteTitle} noteTags={noteTags} noteCategory={noteCategory} isSaving={isSavingNote} onSaveNote={handleSaveSubmit} />
    </div>
  );
}
