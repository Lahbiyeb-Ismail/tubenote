"use client";

import { Download, MoreVertical, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

type CardSettingsButtonProps = {
  noteId: string;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
};

function CardSettingsButton({
  noteId,
  onDelete,
  onEdit,
  onExport,
}: CardSettingsButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="flex flex-col space-y-1">
          <Link href={`/editor/update/${noteId}`}>
            <Button variant="ghost" size="sm" className="justify-start">
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={onExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CardSettingsButton;
