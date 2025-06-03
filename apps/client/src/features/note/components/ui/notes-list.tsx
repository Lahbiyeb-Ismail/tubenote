import type { Note } from "@tubenote/db";

import { NotesListContainer } from "@/components/dashboards";
import { useUIStore } from "@/stores";
import { NoteCard } from "../cards";

type NotesListProps = {
  notes: Note[];
};

export function NotesList({ notes }: NotesListProps) {
  const { layout } = useUIStore();

  const containerClasses = layout.isGridLayout
    ? "md:px-4 py-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
    : "md:px-4 py-6 space-y-4";

  return (
    <NotesListContainer notes={notes} containerClassName={containerClasses}>
      {(note, onDeleteClick) => (
        <NoteCard
          key={note.id}
          note={note}
          onDeleteClick={() => onDeleteClick(note.id)}
        />
      )}
    </NotesListContainer>
  );
}
