"use client";

import { useUIStore } from "@/stores/ui-store";
import { type ReactNode, useEffect } from "react";

export function LayoutProvider({ children }: { children: ReactNode }) {
  // Initialize the responsive behavior that was previously in the context
  const actions = useUIStore((state) => state.actions);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Access the Zustand store directly for this effect
        const isSidebarOpen = useUIStore.getState().layout.isSidebarOpen;
        if (isSidebarOpen) {
          actions.toggleSidebar();
        }
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [actions]);

  // This is now just a wrapper for compatibility
  // The actual state is managed by the Zustand store
  return children;
}

// We're exporting the hook from our hooks directory that now uses Zustand
export { useLayout } from "@/hooks/use-layout";
