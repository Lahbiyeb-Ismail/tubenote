"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UIState {
  isGridLayout: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleLayout: () => void;
  toggleSidebar: () => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  immer(set => ({
    isGridLayout: true,
    isSidebarOpen: false,
    isMobileMenuOpen: false,

    toggleLayout: () =>
      set((state) => {
        state.isGridLayout = !state.isGridLayout;
      }),

    toggleSidebar: () =>
      set((state) => {
        state.isSidebarOpen = !state.isSidebarOpen;
      }),

    setIsMobileMenuOpen: (open: boolean) =>
      set((state) => {
        state.isMobileMenuOpen = open;
      }),
  })),
);
