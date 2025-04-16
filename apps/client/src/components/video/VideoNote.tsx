import { Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";

import type { Note } from "@/features/note/types/note.types";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type VideoNoteProps = {
  note: Note;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  setOpenMarkdownViewer: () => void;
  setNote: (note: Note) => void;
};

function VideoNote({ note, setOpenMarkdownViewer, setNote }: VideoNoteProps) {
  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
      onClick={() => {
        setOpenMarkdownViewer();
        setNote(note);
      }}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">
              {note.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
          <Clock className="h-4 w-4" />
          <span>{note.timestamp}</span>
        </div>
      </CardHeader>
    </Card>
  );
}

export default VideoNote;
