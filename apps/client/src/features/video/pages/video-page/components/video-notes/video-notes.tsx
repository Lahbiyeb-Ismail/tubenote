import type { Note } from "@tubenote/db";

import { VideoNotesHeader } from "./video-notes-header";
import { VideoNotesList } from "./video-notes-list";

interface IProps {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function VideoNotes({ notes, searchQuery, setSearchQuery }: IProps) {
  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Notes Header */}
      <VideoNotesHeader notes={notes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Notes List */}
      <VideoNotesList
        notes={notes}
        searchQuery={searchQuery}
      />
    </div>
  );
}
