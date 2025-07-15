import type { ToastPosition } from "react-hot-toast";

import { toast } from "react-hot-toast";

interface IProps {
  position?: ToastPosition;
  duration?: number;
}

/**
 * Custom hook for displaying toast notifications using react-hot-toast
 *
 * @param param - Configuration object for the toast
 * @param param.position - Position where the toast will appear (defaults to "top-center")
 * @param param.duration - Duration in milliseconds for how long the toast will be visible (defaults to 3000ms)
 *
 * @returns Object containing toast helper functions:
 * - showLoadingToast: Displays a loading toast that persists until dismissed
 * - dismissToast: Dismisses the toast with the specified toastId
 * - showErrorToast: Displays an error toast with the specified duration
 * - showSuccessToast: Displays a success toast with the specified duration
 *
 * @example
 * ```typescript
 * const { showLoadingToast, showSuccessToast, showErrorToast, dismissToast } = useAppToast({
 *   position: "top-right",
 *   duration: 5000
 * });
 *
 * // Show loading toast
 * showLoadingToast("Uploading file...", "upload-loading");
 *
 * // Later, show success and dismiss loading
 * showSuccessToast("File uploaded successfully!");
 * ```
 */
export function useAppToast({ position = "top-center", duration = 3000 }: IProps) {
  const showLoadingToast = ({ message, toastId }: { message: string; toastId: string }) => {
    toast.loading(message, {
      id: toastId,
      position,
    });
  };

  const dismissToast = ({ toastId }: { toastId: string }) => {
    toast.dismiss(toastId);
  };

  const showErrorToast = ({ message }: { message: string }) => {
    toast.error(message, {
      duration,
      position,
    });
  };

  const showSuccessToast = ({ message }: { message: string }) => {
    toast.success(message, {
      duration,
      position,
    });
  };

  return { showErrorToast, showSuccessToast, showLoadingToast, dismissToast };
}
