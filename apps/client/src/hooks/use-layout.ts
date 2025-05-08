"use client";

import { useUIStore } from "@/stores/ui-store";
import { useCallback } from "react";

export const useLayout = () => {
  const { layout, actions } = useUIStore();

  const toggleLayout = useCallback(() => {
    actions.toggleLayout();
  }, [actions]);

  const toggleSidebar = useCallback(() => {
    actions.toggleSidebar();
  }, [actions]);

  return {
    isGridLayout: layout.isGridLayout,
    isSidebarOpen: layout.isSidebarOpen,
    toggleLayout,
    toggleSidebar,
  };
};
