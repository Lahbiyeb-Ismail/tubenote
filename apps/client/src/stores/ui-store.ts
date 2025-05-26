"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ModalType =
  | "login"
  | "signup"
  | "createNote"
  | "editNote"
  | "deleteNote"
  | "shareNote"
  | null;

interface ModalState {
  isOpen: boolean;
}

interface LayoutState {
  isGridLayout: boolean;
  isSidebarOpen: boolean;
}

interface UIState {
  modal: ModalState;
  layout: LayoutState;
  actions: {
    // Modal actions
    openModal: () => void;
    closeModal: () => void;

    // Layout actions
    toggleLayout: () => void;
    toggleSidebar: () => void;
  };
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    modal: {
      isOpen: false,
    },
    layout: {
      isGridLayout: true,
      isSidebarOpen: false,
    },
    actions: {
      openModal: () =>
        set((state) => {
          state.modal.isOpen = true;
        }),
      closeModal: () =>
        set((state) => {
          state.modal.isOpen = false;
        }),
      toggleLayout: () =>
        set((state) => {
          state.layout.isGridLayout = !state.layout.isGridLayout;
        }),
      toggleSidebar: () =>
        set((state) => {
          state.layout.isSidebarOpen = !state.layout.isSidebarOpen;
        }),
    },
  }))
);
