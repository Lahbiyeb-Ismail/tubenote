"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";
import { formatDate } from "@/helpers";
import { useVideoNoteSelector } from "@/hooks";

interface VideoNotesListProps {
  videoId?: string;
}

export function VideoNotesList({ videoId }: VideoNotesListProps) {
  // Use our optimized selector hook that only re-renders when necessary
  const { notes, selectedNoteId, isLoading, selectNote } =
    useVideoNoteSelector(videoId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-gray-500">No notes found for this video.</p>
        <p className="text-sm text-gray-400 mt-2">
          Create your first note to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Notes for this video</h2>
      {notes.map((note) => (
        <Card
          key={note.id}
          className={`cursor-pointer transition-colors ${
            selectedNoteId === note.id ? "border-blue-500 bg-blue-50" : ""
          }`}
          onClick={() => selectNote(note.id)}
        >
          <CardHeader className="p-4 pb-2">
            <CardTitle className="flex justify-between items-center text-base">
              <span className="truncate flex-1">
                {note.title || "Untitled Note"}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {formatDate(note.updatedAt || note.createdAt)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
            {note.timestamp && (
              <span className="text-xs text-blue-600 mt-2 inline-block">
                Timestamp: {formatTimestamp(note.timestamp)}
              </span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper function to format timestamp in MM:SS format
function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
