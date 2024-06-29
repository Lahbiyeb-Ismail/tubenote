"use client";

import React from "react";
import getUserNotes from "@/actions/getUserNotes";
import { useQuery } from "@tanstack/react-query";

import { useUserSession } from "@/hooks/useUserSession";
import Header from "@/components/dashboard/Header";
import NoteCard from "@/components/NoteCard";
import AddNoteForm from "@/components/notes/AddNoteForm";
import NoNotes from "@/components/notes/NoNotes";

function NotesPage() {
  const { userData } = useUserSession();

  const { data } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getUserNotes(userData?.id as string),
  });

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      {!data?.notes || data.notes.length === 0 ? (
        <NoNotes />
      ) : (
        <>
          <Header title="Your Video Notes" />
          <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="flex justify-end">
              <AddNoteForm />
            </div>
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* {data?.map((note: any) => (
                  <NoteCard key={note.id} note={note} />
                ))} */}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default NotesPage;
