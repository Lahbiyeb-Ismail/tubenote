"use client";

import type React from "react";

import { useEffect } from "react";

import { useAuthStore } from "../store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
