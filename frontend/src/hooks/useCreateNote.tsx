"use client";

import createNewNote from "@/actions/createNewNote";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function useCreateNote() {
	const queryClient = useQueryClient();

	const { isPending, mutate: createNote } = useMutation({
		mutationFn: createNewNote,
		onMutate: () => {
			// Show a loading toast
			toast.loading("Saving note...", { id: "loadingToast" });
		},
		onSuccess: () => {
			// Dismiss loading toast
			toast.dismiss("loadingToast");
			// Show success toast
			toast.success("Note created successfully!");
			// Invalidate and refetch notes
			queryClient.invalidateQueries({ queryKey: ["notes"] });
		},
		onError: (error: any) => {
			// Dismiss loading toast
			toast.dismiss("loadingToast");
			// Show error toast
			toast.error(error.message || "Failed to create note. Please try again.");
		},
	});
	return { isPending, createNote };
}

export default useCreateNote;
