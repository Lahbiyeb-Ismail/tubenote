"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

type CardFooterProps = {
  noteId: string;
  onDelete: () => void;
  isLoading: boolean;
  isGridLayout: boolean;
};

function CardFooterComponent({
  noteId,
  onDelete,
  isLoading,
  isGridLayout,
}: CardFooterProps) {
  return (
    <CardFooter
      className={`flex justify-between ${
        isGridLayout ? "flex-row p-4 pt-4" : "flex-col p-4 space-y-1"
      }`}
    >
      <Link href={`/editor/update/${noteId}`}>
        <Button
          variant="outline"
          size={!isGridLayout ? "icon" : "sm"}
          className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed ${
            !isGridLayout ? "w-10 h-10 p-0" : ""
          }`}
          disabled={isLoading}
        >
          <PencilIcon className={`h-4 w-4 ${!isGridLayout ? "m-0" : "mr-2"}`} />
          {isGridLayout && "Edit"}
        </Button>
      </Link>
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
    </CardFooter>
  );
}

export default CardFooterComponent;
