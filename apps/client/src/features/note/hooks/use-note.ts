import { useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from "../queries";

export function useNote() {
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();

  return {
    // Create Note
    createNote: createNoteMutation.mutate,
    isCreatingNote: createNoteMutation.isPending,
    createNoteError: createNoteMutation.error,
    isCreateNoteSuccess: createNoteMutation.isSuccess,

    // Update Note
    updateNote: updateNoteMutation.mutate,
    isUpdatingNote: updateNoteMutation.isPending,
    updateNoteError: updateNoteMutation.error,
    isUpdateNoteSuccess: updateNoteMutation.isSuccess,

    // Delete Note
    deleteNote: deleteNoteMutation.mutate,
    isDeletingNote: deleteNoteMutation.isPending,
    deleteNoteError: deleteNoteMutation.error,
    isDeleteNoteSuccess: deleteNoteMutation.isSuccess,
  };
}
