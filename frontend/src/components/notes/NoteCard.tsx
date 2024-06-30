import Image from "next/image";
import Link from "next/link";
import formatDate from "@/helpers/formatDate";
import type { Note } from "@/types";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-4">
        <Image
          className="mb-2 w-full rounded object-cover"
          src={note.videoThumbnail}
          alt={note.videoTitle}
          width={640}
          height={420}
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {note.videoTitle}
          </h2>
          <h4 className="mt-1 text-gray-500">Note Title: {note.noteTitle}</h4>
        </div>
        {/* <div className="mt-4">
          <p className="line-clamp-3 text-sm text-gray-600">
            {note.noteContent}
          </p>
        </div> */}
        <div className="mt-4 flex items-center justify-between">
          {/* <div className="flex space-x-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div> */}
          <p className="text-xs text-gray-500">
            Creation Date: {formatDate(note.createdAt)}
          </p>
        </div>
      </div>
      <div className="px-4 py-3 sm:px-6">
        <div className="flex justify-end space-x-3">
          <Link
            href={`/notes/${note.id}/edit`}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium leading-4 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </Link>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-green-100 px-3 py-1 text-sm font-medium leading-4 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            View Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
