"use client";

import type { Note } from "@tubenote/types";

import { useLayout } from "@/context/useLayout";

import { NoteCard } from "../cards";

type NotesListProps = {
  notes?: Note[];
};

export function NotesList({ notes }: NotesListProps) {
  const { isGridLayout } = useLayout();

  return (
    <div className="md:px-4 py-6">
      <div
        className={`${isGridLayout ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" : "space-y-4"}`}
      >
        {notes?.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
