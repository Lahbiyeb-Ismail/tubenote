import React from "react";
import type { Note } from "@/types";

import NoteCard from "../NoteCard";

type NoteListsProps = {
  notes: Note[];
};

function NoteLists({ notes }: NoteListsProps) {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default NoteLists;
