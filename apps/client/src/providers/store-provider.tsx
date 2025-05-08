"use client";

import {
  useAuthStore,
  useNoteStore,
  useUIStore,
  useUserStore,
  useVideoStore,
} from "@/stores";
import { ReactNode } from "react";
import { useEffect } from "react";

type StoreInitializerProps = {
  children: ReactNode;
};

/**
 * StoreProvider initializes all Zustand stores and handles any global state setup
 * This makes it easier to manage initialization across different stores
 */
export function StoreProvider({ children }: StoreInitializerProps) {
  // Get all store actions for initialization
  const uiActions = useUIStore((state) => state.actions);
  const _authActions = useAuthStore((state) => state.actions);
  const _noteActions = useNoteStore((state) => state.actions);
  const _videoActions = useVideoStore((state) => state.actions);
  const _userActions = useUserStore((state) => state.actions);

  // Handle any initialization logic here
  useEffect(() => {
    // Initialize responsive behavior for UI
    const handleResize = () => {
      if (window.innerWidth < 768) {
        const isSidebarOpen = useUIStore.getState().layout.isSidebarOpen;
        if (isSidebarOpen) {
          uiActions.toggleSidebar();
        }
      }
    };

    // Set initial state on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [uiActions]);

  // Return the children without wrapping in any providers
  // The Zustand stores are globally available
  return children;
}
