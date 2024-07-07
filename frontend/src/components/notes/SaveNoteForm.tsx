/* eslint-disable no-nested-ternary */

"use client";

import { noteTitleFormSchema } from "@/schemas";
import useVideoDataStore from "@/stores/videoDataStore";
import type { NoteTitleType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import useCreateNote from "@/hooks/useCreateNote";
import useUpdateNote from "@/hooks/useUpdateNote";
import { useUserSession } from "@/hooks/useUserSession";
import ErrorMessage from "../global/ErrorMessage";

type SaveNoteFormProps = {
  noteContent: string;
  noteId: string;
  noteTitle?: string;
  operation: "create" | "update";
};

function SaveNoteForm({
  noteContent,
  noteId,
  operation,
  noteTitle: title,
}: SaveNoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteTitleType>({
    resolver: zodResolver(noteTitleFormSchema),
    defaultValues: {
      noteTitle: title || "",
    },
  });

  const videoData = useVideoDataStore((state) => state.videoData);
  const { userData } = useUserSession();
  const { isPending: createNoteLoading, createNote } = useCreateNote();
  const { isPending: updateNoteLoading, update: updateNote } = useUpdateNote();

  const handleNoteSave: SubmitHandler<NoteTitleType> = (
    data: NoteTitleType
  ) => {
    const { noteTitle } = data;

    if (operation === "update") {
      updateNote({
        id: noteId,
        noteTitle: noteTitle || (title as string),
        noteContent,
      });
      return;
    }
    createNote({
      noteTitle,
      noteContent,
      videoId: videoData?.id as string,
      userId: userData?.userId as string,
      videoTitle: videoData?.title as string,
      videoThumbnail: videoData?.videoThumbnail as string,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNoteSave)}
        className="mb-1 flex items-center justify-center gap-4"
      >
        <input
          type="text"
          placeholder="Enter Note Title"
          className={`w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm font-medium ${errors.noteTitle ? "outline-red-600" : ""}`}
          {...register("noteTitle")}
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md border-2 bg-[#282828] px-4 py-2 text-center text-sm font-medium text-white transition-all hover:border-[#282828] hover:bg-white hover:text-[#282828] focus:ring-[#282828] focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-[#282828]"
        >
          {operation === "create"
            ? createNoteLoading
              ? "Saving..."
              : "Save"
            : updateNoteLoading
              ? "Updating..."
              : "Update"}
        </button>
      </form>
      <ErrorMessage message={errors.noteTitle?.message} />
    </>
  );
}

export default SaveNoteForm;
