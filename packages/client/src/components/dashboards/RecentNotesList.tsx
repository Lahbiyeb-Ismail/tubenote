import Link from "next/link";

import type { INote } from "@/types/note.types";

import { useLayout } from "@/context/useLayout";
import NoteCard from "../note/NoteCard";
import { Button } from "../ui/button";

interface RecentNoteListProps {
  title: string;
  notes: INote[] | undefined;
  emptyMessage: string;
}

function RecentNoteList({ title, notes, emptyMessage }: RecentNoteListProps) {
  const hasNotes = notes && notes?.length > 0;

  const { isGridLayout } = useLayout();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {hasNotes ? (
        <div
          className={`${isGridLayout ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : "space-y-4"}`}
        >
          {notes?.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      )}
      <div className="mt-6 text-center">
        <Link href="/notes">
          <Button variant="outline">View All Notes</Button>
        </Link>
      </div>
    </div>
  );
}

export default RecentNoteList;
