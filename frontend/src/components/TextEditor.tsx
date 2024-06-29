"use client";

import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Toaster } from "react-hot-toast";

import "@/app/globals.css";
import "@blocknote/mantine/style.css";

import useVideoDataStore from "@/stores/videoDataStore";

import useCreateNote from "@/hooks/useCreateNote";
import { useUserSession } from "@/hooks/useUserSession";

function TextEditor() {
  // const [noteTitle, setNoteTitle] = useState("");
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  const { videoData } = useVideoDataStore();
  const { userData } = useUserSession();
  const { isPending, createNote } = useCreateNote();

  function handleNoteSave() {
    createNote({
      videoId: videoData?.id as string,
      noteContent: JSON.stringify(editor.document, null, 2),
      userId: userData?.userId as string,
      videoThumbnail: videoData?.videoThumbnail as string,
      videoTitle: videoData?.title as string,
    });
  }

  return (
    <div className="h-full overflow-auto">
      <Toaster />
      <div className="mb-4 flex items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Enter Note Title"
          className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm font-medium"
        />
        <button
          type="button"
          onClick={handleNoteSave}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md border-2 bg-[#282828] px-4 py-2 text-center text-sm font-medium text-white transition-all hover:border-[#282828] hover:bg-white hover:text-[#282828] focus:ring-[#282828] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-[#282828]"
        >
          {isPending ? "Saving..." : "Save"}
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
