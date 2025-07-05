import type { Note } from "@tubenote/db";

import {
  Clock,
  Edit,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVideoNoteStore } from "@/features/video/store";
import { formatTimestamp, fromDistanceToNow } from "@/shared/utils";

interface IProps {
  note: Note;
  noteIndex: number;
}

export function VideoNoteCard({ note, noteIndex }: IProps) {
  const { setActiveNote, activeNote, setCurrentNoteIndex } = useVideoNoteStore();

  return (
    <Card
      className={`group hover:cursor-pointer transition-all duration-200 hover:shadow-md ${
        activeNote?.id === note.id
          ? "border-l-4 border-l-blue-500 bg-blue-50/50"
          : "hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
      onClick={() => {
        setActiveNote(note);
        setCurrentNoteIndex(noteIndex);
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
              {note.title}
            </h4>
            <div className="flex items-center gap-1 ml-2">
              {activeNote?.id === note.id && (
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{note.content}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(note.timestamp.start)}</span>
                <span className="text-slate-400"> - </span>
                <span>{formatTimestamp(note.timestamp.end)}</span>
              </Badge>

              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{fromDistanceToNow(note.updatedAt)}</span>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Edit note:", note.id);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 2).map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                +
                {note.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
