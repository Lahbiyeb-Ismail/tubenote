"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNote } from "@/actions/note.actions";
import { useModal } from "@/context/useModal";

import type { NoteAction } from "@/types/note.types";
import type { TypedError } from "@/types";

function useUpdateNote(dispatch: React.Dispatch<NoteAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { closeModal } = useModal();

	return useMutation({
		mutationFn: updateNote,
		onMutate: () => {
			toast.loading("Updating note...", { id: "loadingToast" });
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
			toast.dismiss("loadingToast");

			toast.success("Note updated successfully.");

			dispatch({
				type: "UPDATE_NOTE_SUCCESS",
				payload: { note: data, success: true },
			});

			closeModal();

			router.push("/notes");
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
