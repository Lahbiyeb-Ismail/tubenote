import type { Note } from "@tubenote/db";

import { ScrollArea } from "@/components/ui/scroll-area";

import { NoNotesFound } from "./no-notes-found";
import { VideoNoteCard } from "./video-note-card";

interface IProps {
  notes: Note[];
  searchQuery: string;
}

export function VideoNotesList({ notes, searchQuery }: IProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-3 pr-4">
        {notes.length === 0
          ? (
              <NoNotesFound searchQuery={searchQuery} />
            )
          : (
              notes.map((note, index) => (
                <VideoNoteCard key={note.id} note={note} noteIndex={index} />
              ))
            )}
      </div>
    </ScrollArea>
  );
}
