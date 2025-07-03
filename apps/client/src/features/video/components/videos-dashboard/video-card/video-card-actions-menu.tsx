import {
  BookOpen,
  MoreVertical,
  Play,
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

interface IProps {
  /**
   * The number of notes associated with the video.
   */
  notesCount: number;
  ytVideoId: string;
}

export function VideoCardActionsMenu({ notesCount, ytVideoId }: IProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">
          <Play className="mr-2 h-4 w-4" />
          Watch
        </DropdownMenuItem>

        <Link href={`/videos/${ytVideoId}`}>
          <DropdownMenuItem className="cursor-pointer">
            <BookOpen className="mr-2 h-4 w-4" />
            View Notes (
            {notesCount}
            )
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
