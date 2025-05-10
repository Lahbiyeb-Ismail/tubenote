import type { Note } from "@tubenote/types";

import { VideoNote } from "./";

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
    <div className="md:px-4 py-6 space-y-4">
      {notes.map((note) => (
        <VideoNote
          key={note.id}
          note={note}
          setOpenMarkdownViewer={setOpenMarkdownViewer}
          setNote={setNote}
        />
      ))}
    </div>
  );
}
