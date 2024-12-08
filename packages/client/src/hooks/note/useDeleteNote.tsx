"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteNote } from "@/actions/note.actions";
import type { TypedError } from "@/types";
import toast from "react-hot-toast";

function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onMutate: () => {
      toast.loading("Deleting note...", { id: "loadingToast" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      toast.dismiss("loadingToast");
      toast.success(data.message);
    },
    onError: (error: TypedError) => {
      toast.dismiss("loadingToast");

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Delete note failed. Please try again.");
      }
    },
  });
}

export default useDeleteNote;
