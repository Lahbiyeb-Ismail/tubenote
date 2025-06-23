"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useDialogStore } from "@/stores";

interface ConfirmationModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ConfirmationModal({
  title,
  description,
  children,
}: ConfirmationModalProps) {
  const { isOpen, closeDialog } = useDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
