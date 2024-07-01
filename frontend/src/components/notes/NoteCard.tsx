import Image from "next/image";
import Link from "next/link";
import formatDate from "@/helpers/formatDate";
import type { Note } from "@/types";
import { Trash } from "lucide-react";

import useDeleteNote from "@/hooks/useDeleteNote";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note }: NoteCardProps) {
  const { isPending, mutate } = useDeleteNote();

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div className="p-4">
        <Image
          className="mb-4 w-full rounded object-cover"
          src={note.videoThumbnail}
          alt={note.videoTitle}
          width={640}
          height={420}
        />
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {note.videoTitle}
          </h2>
          <h4 className="mt-1 text-gray-500">Note Title: {note.noteTitle}</h4>
        </div>
        {/* <p className="mt-2 line-clamp-3 text-sm text-gray-600">
          {note.noteContent}
        </p> */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {/* {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {tag}
              </span>
            ))} */}
          </div>
          <label htmlFor="creationDate" className="text-xs text-gray-500">
            Creation Date:
          </label>
          <p id="creationDate" className="text-xs text-gray-500">
            {formatDate(note.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex space-x-3">
          <Link
            href={`/editor/${note.id}/update`}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium leading-4 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </Link>
        </div>
        <button
          type="button"
          className="text-red-600 hover:text-red-800 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-400"
          aria-label="delete note"
          disabled={isPending}
          onClick={() => mutate(note.id)}
        >
          <Trash className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
