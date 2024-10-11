"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TypedError } from "@/types";
import { createNote } from "@/actions/note.actions";

function useCreateNote() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: createNote,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
			console.log(data);
		},
		onError: (error: TypedError) => {
			if (error.response) {
				console.log(error.response.data.message);
			} else {
				console.log("Note Creating Failed. Please try again.");
			}
		},
	});
}

export default useCreateNote;
