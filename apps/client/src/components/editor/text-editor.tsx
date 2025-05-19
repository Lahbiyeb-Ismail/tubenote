"use client";

import type { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

import "@/app/globals.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useUIStore } from "@/stores";
import { SaveNoteForm } from "./";

type TextEditorProps = {
  initialNoteContent?: string;
  noteTitle?: string;
  action?: "update" | "create";
};

export function TextEditor({
  initialNoteContent,
  noteTitle,
  action = "create",
}: TextEditorProps) {
  // Creates a new editor instance.
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialNoteContent
      ? JSON.parse(initialNoteContent)
      : undefined,
  });

  const [noteContent, setNoteContent] = useState<string>(
    initialNoteContent || ""
  );

  const { actions } = useUIStore();

  return (
    <div className="h-full overflow-auto">
      <SaveNoteForm
        noteContent={noteContent}
        noteTitle={noteTitle}
        action={action}
        cancelText="Cancel"
        closeModal={actions.closeModal}
      />
      <BlockNoteView
        editor={editor}
        theme="light"
        className="h-[90%] overflow-auto border-2 border-gray-300"
        onChange={() => setNoteContent(JSON.stringify(editor.document))}
      />
    </div>
  );
}

export default TextEditor;
