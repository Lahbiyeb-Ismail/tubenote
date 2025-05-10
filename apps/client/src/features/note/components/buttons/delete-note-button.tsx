"use client";

import { Trash2Icon } from "lucide-react";

import { useUIStore } from "@/stores";

import { Button } from "@/components/ui";

type DeleteNoteButtonProps = {
  isLoading: boolean;
  onDelete: () => void;
};

export function DeleteNoteButton({
  isLoading,
  onDelete,
}: DeleteNoteButtonProps) {
  const { layout } = useUIStore();

  return (
    <Button
      variant="outline"
      size={!layout.isGridLayout ? "icon" : "sm"}
      className={`text-red-700 hover:text-red-800 hover:bg-red-50 disabled:opacity-50
              disabled:cursor-not-allowed ${
                !layout.isGridLayout ? "w-10 h-10 p-0" : ""
              }`}
      onClick={onDelete}
      disabled={isLoading}
    >
      <Trash2Icon
        className={`h-4 w-4 ${!layout.isGridLayout ? "m-0" : "mr-2"}`}
      />
      {layout.isGridLayout && "Delete"}
    </Button>
  );
}
