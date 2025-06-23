import { create } from "zustand";

export type DialogType = "create-note" | "delete-note" | "edit-note" | "save-note" | "add-video";

interface DialogState {
  type: DialogType | null;
  isOpen: boolean;
  noteId: string;
}

interface DialogActions {
  openDialog: (type: DialogType) => void;
  openNoteDeletionDialog: (noteId: string) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState & DialogActions>(set => ({
  type: null,
  isOpen: false,
  noteId: "",

  openDialog: (type: DialogType) =>
    set({ type, isOpen: true }),

  closeDialog: () =>
    set({ type: null, isOpen: false }),

  openNoteDeletionDialog: (noteId: string) => {
    set({ type: "delete-note", isOpen: true, noteId });
  },
}));
