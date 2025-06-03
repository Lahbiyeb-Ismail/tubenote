"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNoteStore } from "@/features/note/store";
import { useUIStore } from "@/stores";
import type { Note } from "@tubenote/db";
import { Clock, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoNoteCardProps {
  note: Note;
  onDeleteClick: () => void;
  setNote: (note: Note) => void;
  setOpenMarkdownViewer: () => void;
}

export function VideoNoteCard({
  note,
  onDeleteClick,
  setNote,
  setOpenMarkdownViewer,
}: VideoNoteCardProps) {
  const router = useRouter();

  const { actions } = useUIStore();
  const { isDeleting } = useNoteStore();

  const handleDelete = () => {
    onDeleteClick();
    actions.openModal();
  };

  return (
    <Card
      className="group hover:cursor-pointer hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
      onClick={(e) => {
        e.stopPropagation();
        setNote(note);
        setOpenMarkdownViewer();
      }}
    >
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {note.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Clock className="h-3 w-3" />
                <span>Start: {note.timestamp.start.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Clock className="h-3 w-3" />
                <span>End: {note.timestamp.end.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/notes/update/${note.id}`);
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
