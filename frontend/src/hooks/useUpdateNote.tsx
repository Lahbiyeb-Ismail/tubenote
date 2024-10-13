"use client";

import { updateNote } from "@/actions/note.actions";
import type { TypedError } from "@/types";
import type { NoteAction } from "@/types/note.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";

function useUpdateNote(dispatch: React.Dispatch<NoteAction>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateNote,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });

			dispatch({
				type: "UPDATE_NOTE_SUCCESS",
				payload: { note: data, success: true },
			});
		},
		onError: (error: TypedError) => {
			if (error.response) {
				dispatch({
					type: "UPDATE_NOTE_FAIL",
					payload: {
						message: error.response.data.message,
						success: false,
					},
				});
			} else {
				dispatch({
					type: "UPDATE_NOTE_FAIL",
					payload: {
						message: "Note update failed.",
						success: false,
					},
				});
			}
		},
	});
}

export default useUpdateNote;
