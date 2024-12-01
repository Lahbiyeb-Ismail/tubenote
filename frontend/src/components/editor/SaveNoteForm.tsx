"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useNote } from "@/context/useNote";
import { useVideo } from "@/context/useVideo";
import { saveNoteFormSchema } from "@/lib/schemas";
import type { NoteTitle } from "@/types/note.types";
import { Button } from "../ui/button";

type SaveNoteFormProps = {
  noteId: string;
  noteTitle: string;
  noteContent: string;
  cancelText: string;
  action: "update" | "create";
  closeModal: () => void;
};

function SaveNoteForm({
  noteId,
  noteTitle: title,
  noteContent,
  action,
  cancelText,
  closeModal,
}: SaveNoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteTitle>({
    resolver: zodResolver(saveNoteFormSchema),
    defaultValues: {
      noteTitle: title || "",
    },
  });

  const {
    state: { video },
    videoCurrentTime,
  } = useVideo();

  const { createNote, isLoading, updateNote } = useNote();

  const handleNoteSave: SubmitHandler<NoteTitle> = (data: NoteTitle) => {
    if (action === "create") {
      createNote({
        title: data.noteTitle,
        content: noteContent,
        videoId: video?.id,
        thumbnail: video?.snippet.thumbnails.medium.url,
        videoTitle: video?.snippet.title,
        youtubeId: video?.youtubeId,
        timestamp: videoCurrentTime,
      });
    } else {
      updateNote({
        noteId,
        title: data.noteTitle,
        content: noteContent,
        timestamp: videoCurrentTime,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleNoteSave)}
      className="mb-1 flex flex-col items-center justify-center gap-4"
    >
      <input
        type="text"
        placeholder="Enter Note Title"
        className={`w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm font-medium ${errors.noteTitle ? "outline-red-600" : ""}`}
        {...register("noteTitle")}
      />

      <div className="flex items-center justify-between w-full">
        <Button variant="outline" onClick={closeModal}>
          {cancelText}
        </Button>
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md border-2 bg-[#282828] px-4 py-2 text-center text-sm font-medium text-white transition-all hover:border-[#282828] hover:bg-white hover:text-[#282828] focus:ring-[#282828] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-[#282828]"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default SaveNoteForm;
