"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TypedError } from "@/types";
import { deleteNote } from "@/actions/note.actions";
import toast from "react-hot-toast";

function useDeleteNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteNote,
		onMutate: () => {
			toast.loading("Deleting note...", { id: "loadingToast" });
		},
		onSuccess: (data) => {
			toast.dismiss("loadingToast");

			toast.success(data.message);

			queryClient.invalidateQueries({ queryKey: ["notes"] });
		},
		onError: (error: TypedError) => {
			toast.dismiss("loadingToast");

			if (error.response) {
				console.log(error.response.data.message);
				toast.error(error.response.data.message);
			} else {
				toast.error("Delete note failed. Please try again.");
			}
		},
	});
}

export default useDeleteNote;
