"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useLayout } from "@/context/useLayout";

type DeleteNoteButtonProps = {
  isLoading: boolean;
  onDelete: () => void;
};

function DeleteNoteButton({ isLoading, onDelete }: DeleteNoteButtonProps) {
  const { isGridLayout } = useLayout();
  return (
    <Button
      variant="outline"
      size={!isGridLayout ? "icon" : "sm"}
      className={`text-red-700 hover:text-red-800 hover:bg-red-50 disabled:opacity-50
              disabled:cursor-not-allowed ${
                !isGridLayout ? "w-10 h-10 p-0" : ""
              }`}
      onClick={onDelete}
      disabled={isLoading}
    >
      <Trash2Icon className={`h-4 w-4 ${!isGridLayout ? "m-0" : "mr-2"}`} />
      {isGridLayout && "Delete"}
    </Button>
  );
}

export default DeleteNoteButton;
