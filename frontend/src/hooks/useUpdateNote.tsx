"use client";

import updateNote from "@/actions/updateNote";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function useUpdateNote() {
  const queryClient = useQueryClient();

  const { isPending, mutate: update } = useMutation({
    mutationFn: updateNote,
    onMutate: () => {
      // Show a loading toast
      toast.loading("Updating note...", { id: "loadingToast" });
    },
    onSuccess: () => {
      // Dismiss loading toast
      toast.dismiss("loadingToast");
      // Show success toast
      toast.success("Note updated successfully!");
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: any) => {
      // Dismiss loading toast
      toast.dismiss("loadingToast");
      // Show error toast
      toast.error(error.message || "Failed to update note. Please try again.");
    },
  });
  return { isPending, update };
}

export default useUpdateNote;
