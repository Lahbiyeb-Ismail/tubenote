"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TypedError } from "@/types";
import { createNote } from "@/actions/note.actions";
import type { NoteAction } from "@/types/note.types";

function useCreateNote(dispatch: React.Dispatch<NoteAction>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createNote,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
			dispatch({
				type: "CREATE_NOTE_SUCCESS",
				payload: { message: data.message, note: data.note, success: true },
			});
		},
		onError: (error: TypedError) => {
			if (error.response) {
				dispatch({
					type: "CREATE_NOTE_FAIL",
					payload: { message: error.response.data.message, success: false },
				});
			} else {
				dispatch({
					type: "CREATE_NOTE_FAIL",
					payload: {
						message: "Note Creating Failed. Please try again.",
						success: false,
					},
				});
			}
		},
	});
}

export default useCreateNote;
