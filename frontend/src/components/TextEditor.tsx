"use client";

import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import "@blocknote/mantine/style.css";
import "@/app/globals.css";

import createNewNote from "@/actions/createNewNote";
import useVideoDataStore from "@/stores/videoDataStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { Button } from "../ui/button";

function TextEditor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();
  const queryClient = useQueryClient();

  const { id } = useVideoDataStore((state) => state.videoData);

  const { isPending, mutate, data } = useMutation({
    mutationFn: createNewNote,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <div className="h-full overflow-auto">
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            mutate({
              videoId: id,
              noteContent: JSON.stringify(editor.document, null, 2),
            })
          }
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
