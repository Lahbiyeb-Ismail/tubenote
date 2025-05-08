"use client";

import { useUIStore } from "@/stores/ui-store";
import { useCallback } from "react";

export const useModal = () => {
  const { modal, actions } = useUIStore();

  const onOpen = useCallback(
    (type, data) => {
      actions.openModal(type, data);
    },
    [actions]
  );

  const onClose = useCallback(() => {
    actions.closeModal();
  }, [actions]);

  // For backward compatibility with the old context API
  const openModal = useCallback(() => {
    actions.openModal("login"); // Default type for backward compatibility
  }, [actions]);

  const closeModal = useCallback(() => {
    actions.closeModal();
  }, [actions]);

  return {
    isOpen: modal.isOpen,
    type: modal.type,
    data: modal.data,
    onOpen,
    onClose,
    // Include old API methods for backward compatibility
    openModal,
    closeModal,
  };
};
