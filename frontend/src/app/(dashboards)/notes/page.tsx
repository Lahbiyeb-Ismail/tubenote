"use client";

import React from "react";
import getUserNotes from "@/actions/getUserNotes";
import useAuthStore from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";

import NoteCard from "@/components/NoteCard";

function NotesPage() {
  const { userData } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getUserNotes(userData?.userId as string),
  });

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      {!data?.notes || data?.notes.length === 0 ? (
        <div className="flex h-screen flex-col items-center justify-center">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            You don't have any notes yet
          </h2>
          <p className="mb-6 text-gray-600">
            Start by adding a YouTube video to take notes on.
          </p>
          <form className="w-full max-w-md">
            <div className="flex items-center border-b border-[#171215] py-2">
              <input
                className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                type="url"
                placeholder="Enter YouTube video URL"
                aria-label="YouTube video URL"
                // value={videoUrl}
                // onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
              <button
                className="flex-shrink-0 rounded border-4 border-[#171215] bg-[#171215] px-2 py-1 text-sm text-white hover:border-[#2c2326] hover:bg-[#2c2326]"
                type="submit"
              >
                Take Note
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between bg-white px-4 py-6 shadow sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Your Video Notes
            </h1>
          </header>
          <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-full border-2 border-transparent bg-[#171215] px-6 py-3 text-sm font-medium leading-4 text-white transition-all hover:border-[#171215] hover:bg-white hover:text-[#171215] focus:outline-none focus:ring-2 focus:ring-[#171215]/30 focus:ring-offset-2"
              >
                Take Note
              </button>
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
