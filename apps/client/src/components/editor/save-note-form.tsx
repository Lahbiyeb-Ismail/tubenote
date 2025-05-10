"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { NoteTitle } from "@/features/note/types";

import { FormInput } from "@/components/global";
import { Button, Form } from "@/components/ui";
import { saveNoteFormSchema } from "@/lib";

type SaveNoteFormProps = {
  isLoading: boolean;
  closeModal: () => void;
  handleSaveSubmit: (noteTitle: string) => void;
  noteTitle?: string;
};

export function SaveNoteForm({
  isLoading,
  closeModal,
  handleSaveSubmit,
  noteTitle = "",
}: SaveNoteFormProps) {
  const form = useForm<NoteTitle>({
    resolver: zodResolver(saveNoteFormSchema),
    defaultValues: {
      noteTitle,
    },
  });

  const { handleSubmit, control, formState } = form;

  function handleOnSubmit(data: NoteTitle) {
    handleSaveSubmit(data.noteTitle);
    closeModal();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="mb-1 flex flex-col items-center justify-center gap-4"
      >
        <FormInput
          name="noteTitle"
          placeholder="Enter Note Title"
          label="Note Title"
          inputStyle={`rounded-md border-2 border-gray-300 px-4 py-2 text-sm font-medium ${formState.errors.noteTitle ? "outline-red-600" : ""}`}
          control={control}
        />

        <div className="flex items-center justify-between w-full">
          <Button variant="outline" onClick={closeModal}>
            Cancel
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
    </Form>
  );
}
