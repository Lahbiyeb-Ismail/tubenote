import type { Note } from "@tubenote/db";

import {
  Archive,
  Edit,
  Eye,
  MoreVertical,
  Pin,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/stores";

interface IProps {
  note: Note;
}

export function NoteCardActionsMenu({ note }: IProps) {
  const { openNoteDeletionDialog } = useDialogStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <Link href={`/notes/${note.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </Link>

        <Link href={`/notes/update/${note.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem>
          <Pin className="mr-2 h-4 w-4" />
          {note.isPinned ? "Unpin" : "Pin"}
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Star className="mr-2 h-4 w-4" />
          {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Archive className="mr-2 h-4 w-4" />
          {note.isArchived ? "Unarchive" : "Archive"}
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => openNoteDeletionDialog(note.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
