"use client";

import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Toaster } from "react-hot-toast";

import "@/app/globals.css";
import "@blocknote/mantine/style.css";

import { useState } from "react";
import type { BlockNoteEditor } from "@blocknote/core";

import SaveNoteForm from "./notes/SaveNoteForm";

type TextEditorProps = {
  initialNoteContent?: string;
  noteTitle?: string;
  noteId: string;
  operation: "create" | "update";
};

function TextEditor({
  initialNoteContent,
  noteTitle,
  noteId,
  operation,
}: TextEditorProps) {
  // Creates a new editor instance.
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialNoteContent
      ? JSON.parse(initialNoteContent)
      : undefined,
  });
  const [noteContent, setNoteContent] = useState("");

  return (
    <div className="h-full overflow-auto">
      <Toaster />
      <SaveNoteForm
        noteContent={noteContent}
        noteTitle={noteTitle}
        noteId={noteId}
        operation={operation}
      />
      <BlockNoteView
        editor={editor}
        onChange={() => {
          setNoteContent(JSON.stringify(editor.document, null, 2));
        }}
        theme="light"
        className="h-[90%] overflow-auto border-2 border-gray-300"
      />
    </div>
  );
}

export default TextEditor;
