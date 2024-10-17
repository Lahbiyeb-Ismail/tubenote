"use client";

import { updateNote } from "@/actions/note.actions";
import type { TypedError } from "@/types";
import type { NoteAction } from "@/types/note.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import toast from "react-hot-toast";

function useUpdateNote(dispatch: React.Dispatch<NoteAction>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateNote,
		onMutate: () => {
			toast.loading("Updating note...", { id: "loadingToast" });
		},
		onSuccess: (data) => {
			toast.dismiss("loadingToast");

			toast.success("Note updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["notes"] });

			dispatch({
				type: "UPDATE_NOTE_SUCCESS",
				payload: { note: data, success: true },
			});
		},
		onError: (error: TypedError) => {
			toast.dismiss("loadingToast");
			if (error.response) {
				toast.error(error.response.data.message);
				dispatch({
					type: "UPDATE_NOTE_FAIL",
					payload: {
						message: error.response.data.message,
						success: false,
					},
				});
			} else {
				toast.error("Note update failed. Please try again.");
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
