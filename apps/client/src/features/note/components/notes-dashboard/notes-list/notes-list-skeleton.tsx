import { NoteCardSkeleton } from "../../note-card";

export function NotesListSkeleton() {
  // Create an array of 6 skeleton items to simulate loading state
  const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {skeletonItems.map(index => (
        <NoteCardSkeleton key={index} />
      ))}
    </div>
  );
}
