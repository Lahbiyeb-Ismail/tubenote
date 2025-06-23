import type { Note } from "@tubenote/db";

import {
  Archive,
  Clock,
  Heart,
  Pin,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";
import { formatTimestamp } from "@/helpers";

import { NoteCardActionsMenu } from "./note-card-actions-menu";

interface IProps {
  note: Note;
}

export function NoteCardHeader({ note }: IProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* <Checkbox
                  checked={selectedNotes.includes(note.id)}
                  onCheckedChange={() => handleSelectNote(note.id)}
                  className="mt-1"
                /> */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {note.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
              {note.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
              {note.isArchived && <Archive className="h-4 w-4 text-slate-500" />}
            </div>

            <Link href={`/notes/${note.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {note.title}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mt-2">
              {note.category
                ? (
                    <Badge variant="outline" className="text-xs">
                      {note.category}
                    </Badge>
                  )
                : null}
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatTimestamp(note.timestamp.start)}
                {" "}
                -
                {" "}
                {formatTimestamp(note.timestamp.end)}
              </div>
            </div>
          </div>
        </div>

        <NoteCardActionsMenu note={note} />
      </div>
    </CardHeader>
  );
}
