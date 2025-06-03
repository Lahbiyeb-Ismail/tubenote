import type { Note } from "@tubenote/db";

import { NotesListContainer } from "@/components/dashboards";
import { VideoNoteCard } from "./";

type VideoNotesListProps = {
  notes: Note[];
  setOpenMarkdownViewer: () => void;
  setNote: (note: Note) => void;
};

export function VideoNotesList({
  notes,
  setOpenMarkdownViewer,
  setNote,
}: VideoNotesListProps) {
  return (
    <NotesListContainer notes={notes}>
      {(note, onDeleteClick) => (
        <VideoNoteCard
          key={note.id}
          note={note}
          onDeleteClick={() => onDeleteClick(note.id)}
          setOpenMarkdownViewer={setOpenMarkdownViewer}
          setNote={setNote}
        />
      )}
    </NotesListContainer>
  );
}
