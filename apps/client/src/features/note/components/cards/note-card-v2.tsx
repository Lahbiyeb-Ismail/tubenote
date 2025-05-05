import { CalendarIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";

import type { Note } from "@tubenote/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NoteCardProps = {
  note: Note;
};

export function NoteCardV2({ note }: NoteCardProps) {
  return (
    <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-40 sm:h-48">
        <Image
          src={note.thumbnail || "/images/placeholder.jpg"}
          alt={note.videoTitle || "Video thumbnail"}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {note.videoTitle}
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            Note: {note.title}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          {new Date(note.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
        >
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800"
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
