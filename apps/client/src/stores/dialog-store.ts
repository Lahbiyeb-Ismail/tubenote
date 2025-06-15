import { create } from "zustand";

export type DialogType = "create-note" | "delete-note" | "edit-note" | "save-note" | "create-video";

interface DialogState {
  type: DialogType | null;
  isOpen: boolean;
}

interface DialogActions {
  openDialog: (type: DialogType) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState & DialogActions>(set => ({
  type: null,
  isOpen: false,
  data: {},

  openDialog: (type: DialogType) =>
    set({ type, isOpen: true }),

  closeDialog: () =>
    set({ type: null, isOpen: false }),
}));
