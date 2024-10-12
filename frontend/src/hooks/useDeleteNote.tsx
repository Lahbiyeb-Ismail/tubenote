"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TypedError } from "@/types";
import { deleteNote } from "@/actions/note.actions";

function useDeleteNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteNote,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });

			console.log(data);
		},
		onError: (error: TypedError) => {
			if (error.response) {
				console.log(error.response.data.message);
			} else {
				console.log("Delete note failed. Please try again.");
			}
		},
	});
}

export default useDeleteNote;
