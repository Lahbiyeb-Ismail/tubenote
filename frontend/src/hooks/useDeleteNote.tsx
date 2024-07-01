"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { deleteNote } from "../actions/noteActions";

function useDeleteNote() {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: deleteNote,
    onMutate: () => {
      // Show a loading toast
      toast.loading("Deleting note...", { id: "loadingToast" });
    },
    onSuccess: () => {
      // Dismiss loading toast
      toast.dismiss("loadingToast");
      // Show success toast
      toast.success("Note deleted successfully!");
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: any) => {
      // Dismiss loading toast
      toast.dismiss("loadingToast");
      // Show error toast
      toast.error(error.message || "Failed to delete note. Please try again.");
    },
  });
  return { isPending, mutate };
}

export default useDeleteNote;
