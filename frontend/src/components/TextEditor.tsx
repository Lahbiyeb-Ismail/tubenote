"use client";

import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import "@blocknote/mantine/style.css";
import "@/app/globals.css";

import useVideoDataStore from "@/stores/videoDataStore";

// import { Button } from "../ui/button";

type Note = {
  title: string;
  videoId: string;
  content?: string;
};

function TextEditor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  const { id } = useVideoDataStore((state) => state.videoData);

  const createNewNote = async (videoId: string, noteContent?: string) => {
    try {
      const note: Note = {
        title: "Note",
        videoId,
        content: noteContent,
      };
      const apiUrl = `http://localhost:5500/api/v1/videos/${videoId}/notes`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-full overflow-auto">
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          // onClick={() =>
          //   createNewNote(id, JSON.stringify(editor.document, null, 2))
          // }
          className="focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md border-2 bg-[#282828] px-4 py-2 text-center text-sm font-medium text-white transition-all hover:border-[#282828] hover:bg-white hover:text-[#282828] focus:ring-[#282828] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-[#282828]"
        >
          Save
        </button>
      </div>
      <BlockNoteView
        editor={editor}
        theme="light"
        className="h-[90%] overflow-auto border-2 border-gray-300"
      />
    </div>
  );
}

export default TextEditor;
