"use client";

import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { exportNoteAsPDF } from "@/actions/note.actions";

import type { TypedError } from "@/types";

function useExportNoteAsPdf() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: exportNoteAsPDF,
		onMutate: () => {
			// Show a loading toast
			toast.loading("Exporting note...", { id: "loadingToast" });
		},
		onSuccess: (data) => {
			// Dismiss loading toast
			toast.dismiss("loadingToast");
			// Show success toast
			toast.success(data.message);
			// Invalidate notes query to refetch notes
			queryClient.invalidateQueries({ queryKey: ["notes"] });
		},
		onError: (error: TypedError) => {
			// Dismiss loading toast
			toast.dismiss("loadingToast");

			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Exporting Note Failed. Please try again.");
			}
		},
	});
}

export default useExportNoteAsPdf;
