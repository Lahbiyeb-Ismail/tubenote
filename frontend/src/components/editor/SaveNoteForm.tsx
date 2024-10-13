"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { saveNoteFormSchema } from "@/lib/schemas";
import type { NoteTitle } from "@/types/note.types";
import useCreateNote from "@/hooks/useCreateNote";
import { useVideo } from "@/context/useVideo";
import { useNote } from "@/context/useNote";

type SaveNoteFormProps = {
	noteTitle?: string;
	noteContent: string;
};

function SaveNoteForm({ noteTitle: title, noteContent }: SaveNoteFormProps) {
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
	} = useVideo();

	const { createNote, isLoading } = useNote();

	const handleNoteSave: SubmitHandler<NoteTitle> = (data: NoteTitle) => {
		createNote({
			title: data.noteTitle,
			content: noteContent,
			videoId: video?.id,
			thumbnail: video?.snippet.thumbnails.medium.url,
			videoTitle: video?.snippet.title,
			youtubeId: video?.youtubeId,
		});
	};

	return (
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
				disabled={isLoading}
			>
				{isLoading ? "Saving..." : "Save"}
			</button>
		</form>
	);
}

export default SaveNoteForm;
