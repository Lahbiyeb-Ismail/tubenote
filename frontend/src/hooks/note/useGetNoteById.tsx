import type React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getNoteById } from "@/actions/note.actions";
import type { TypedError } from "@/types";
import type { NoteAction } from "@/types/note.types";
import { useRouter } from "next/navigation";

function useGetNoteById(dispatch: React.Dispatch<NoteAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

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

			router.push(`/editor/update/${data.id}`);
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
