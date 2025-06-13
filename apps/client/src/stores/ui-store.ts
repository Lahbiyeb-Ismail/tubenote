"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface LayoutState {
  isGridLayout: boolean;
  isSidebarOpen: boolean;
}

interface UIState {
  layout: LayoutState;
  actions: {
    // Layout actions
    toggleLayout: () => void;
    toggleSidebar: () => void;
  };
}

export const useUIStore = create<UIState>()(
  immer(set => ({
    layout: {
      isGridLayout: true,
      isSidebarOpen: false,
    },
    actions: {
      toggleLayout: () =>
        set((state) => {
          state.layout.isGridLayout = !state.layout.isGridLayout;
        }),
      toggleSidebar: () =>
        set((state) => {
          state.layout.isSidebarOpen = !state.layout.isSidebarOpen;
        }),
    },
  })),
);
