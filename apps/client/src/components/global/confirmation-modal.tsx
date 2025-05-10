"use client";

import { useModal } from "@/context";

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
  const { isOpen, closeModal } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
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
