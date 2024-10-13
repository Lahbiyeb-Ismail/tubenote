import type React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getNoteById } from "@/actions/note.actions";
import type { TypedError } from "@/types";
import type { NoteAction } from "@/types/note.types";

function useGetNoteById(dispatch: React.Dispatch<NoteAction>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: getNoteById,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });

			dispatch({
				type: "GET_NOTE_SUCCESS",
				payload: {
					note: data,
					success: true,
				},
			});

			console.log(data);
		},
		onError: (error: TypedError) => {
			if (error.response) {
				dispatch({
					type: "GET_NOTE_FAIL",
					payload: { message: error.response.data.message, success: false },
				});
			} else {
				dispatch({
					type: "GET_NOTE_FAIL",
					payload: {
						message: "Geting Note Failed. Please try again.",
						success: false,
					},
				});
			}
		},
	});
}

export default useGetNoteById;
