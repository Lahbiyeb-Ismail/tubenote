"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { useUIStore } from "@/stores";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * A reusable modal component that uses our Zustand UI store
 * This demonstrates how components can directly interact with our store
 */
export function StoreModal({
  title,
  description,
  children,
  footer,
}: ModalProps) {
  // Get modal state and actions directly from the store
  const isOpen = useUIStore((state) => state.modal.isOpen);
  const _modalType = useUIStore((state) => state.modal.type);
  const modalData = useUIStore((state) => state.modal.data);
  const closeModal = useUIStore((state) => state.actions.closeModal);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <Button
            onClick={closeModal}
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="py-4">
          {/* If modalData is provided, we can pass it to children */}
          {typeof children === "function" ? children(modalData) : children}
        </div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
