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
  type: ModalType;
  data?: Record<string, any>;
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
    openModal: (type: ModalType, data?: Record<string, any>) => void;
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
      type: null,
      data: {},
    },
    layout: {
      isGridLayout: true,
      isSidebarOpen: false,
    },
    actions: {
      openModal: (type, data) =>
        set((state) => {
          state.modal.isOpen = true;
          state.modal.type = type;
          state.modal.data = data || {};
        }),
      closeModal: () =>
        set((state) => {
          state.modal.isOpen = false;
          state.modal.type = null;
          state.modal.data = {};
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
