"use client";
import { useGetCurrentUserQuery } from "@/features/user/queries";

/**
 * A component that initializes authentication state by eagerly fetching user data.
 *
 * This component should be mounted early in the application lifecycle to ensure
 * that user authentication state is loaded and cached before other components
 * that depend on it are rendered.
 *
 * @returns null - This component does not render any UI elements
 */
export function AuthInitializer() {
  // Eagerly fetch and cache the user data on initial load
  useGetCurrentUserQuery();
  return null; // This component does not render anything
}
