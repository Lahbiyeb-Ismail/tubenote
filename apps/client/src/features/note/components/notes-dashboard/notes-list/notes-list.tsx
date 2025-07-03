import type { Note } from "@tubenote/db";

import dynamic from "next/dynamic";

import { NoteCard } from "../../note-card";

const NoteDeletionDialog = dynamic(
  () => import("../../note-deletion-dialog").then(mod => mod.NoteDeletionDialog),
  { ssr: false, loading: () => <div className="hidden">Loading...</div> },
);

interface IProps {
  viewMode: "grid" | "list";
  notes: Note[];
}

export function NotesList({ viewMode, notes }: IProps) {
  return (
    <div
      className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
    >
      {notes.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}

      <NoteDeletionDialog />
    </div>
  );
}
