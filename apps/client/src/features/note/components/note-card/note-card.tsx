import type { Note } from "@tubenote/db";

import { Card } from "@/components/ui/card";

import { NoteCardContent } from "./note-card-content";
import { NoteCardHeader } from "./note-card-header";

interface IProps {
  note: Note;
}

export function NoteCard({ note }: IProps) {
  const getRandomBorderColor = () => {
    const colors = [
      "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
      "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20",
      "border-l-green-500 bg-green-50/50 dark:bg-green-950/20",
      "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
      "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
      "border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${getRandomBorderColor()}`}
    >
      <NoteCardHeader note={note} />

      <NoteCardContent note={note} />
    </Card>
  );
}
