"use client";

import { type ReactNode } from "react";
// No need for useState or useContext anymore since we're using Zustand store

export function ModalProvider({ children }: { children: ReactNode }) {
  // This is now just a wrapper for compatibility
  // The actual state is managed by the Zustand store
  return children;
}

// We're exporting the hook from our hooks directory that now uses Zustand
export { useModal } from "@/hooks/use-modal";
