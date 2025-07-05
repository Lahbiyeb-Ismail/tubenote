import type { Note } from "@tubenote/db";

import {
  Tag,
  Video,
  Youtube,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { fromDistanceToNow } from "@/shared/utils";

interface IProps {
  note: Note;
}

export function NoteCardContent({ note }: IProps) {
  return (
    <CardContent>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4 truncate">
        {note.content.split("\n")[0]}
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <Youtube className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium truncate">{note.videoTitle}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="mr-1 h-2 w-2" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Created
            {" "}
            {fromDistanceToNow(note.createdAt)}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Video className="mr-1 h-3 w-3" />
              Jump to
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
