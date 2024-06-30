"use client";

import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Toaster } from "react-hot-toast";

import "@/app/globals.css";
import "@blocknote/mantine/style.css";

import SaveNoteForm from "./notes/SaveNoteForm";

function TextEditor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  return (
    <div className="h-full overflow-auto">
      <Toaster />
      <SaveNoteForm noteContent={JSON.stringify(editor.document)} />
      <BlockNoteView
        editor={editor}
        theme="light"
        className="h-[90%] overflow-auto border-2 border-gray-300"
      />
    </div>
  );
}

export default TextEditor;
