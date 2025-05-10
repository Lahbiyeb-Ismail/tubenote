"use client";

import { useUIStore } from "@/stores";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

type ConfirmationModalProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function ConfirmationModal({
  title,
  description,
  children,
}: ConfirmationModalProps) {
  const { modal, actions } = useUIStore();

  return (
    <Dialog open={modal.isOpen} onOpenChange={actions.closeModal}>
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
