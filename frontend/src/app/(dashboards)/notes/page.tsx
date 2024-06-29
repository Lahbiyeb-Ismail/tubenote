"use client";

import useUserNotes from "@/hooks/useUserNotes";
import Header from "@/components/dashboard/Header";
import AddNoteForm from "@/components/notes/AddNoteForm";
import NoNotes from "@/components/notes/NoNotes";
import NoteLists from "@/components/notes/NoteLists";

function NotesPage() {
  const { data, isNotesLoading, isUserLoading } = useUserNotes();

  if (isNotesLoading || isUserLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      {!data || data.notes.length === 0 ? (
        <NoNotes />
      ) : (
        <>
          <Header title="Your Video Notes" />

          <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="flex justify-end">
              <AddNoteForm />
            </div>
            <NoteLists notes={data.notes} />
          </main>
        </>
      )}
    </div>
  );
}

export default NotesPage;
