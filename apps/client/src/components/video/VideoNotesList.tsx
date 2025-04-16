import type { Note } from "@/features/note/types/note.types";
import VideoNote from "./VideoNote";

type VideoNotesListProps = {
  notes: Note[];
  setOpenMarkdownViewer: () => void;
  setNote: (note: Note) => void;
};

function VideoNotesList({
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

export default VideoNotesList;
