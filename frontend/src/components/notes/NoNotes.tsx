import React from "react";

import AddNoteForm from "./AddNoteForm";

function NoNotes() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        You don't have any notes yet
      </h2>
      <p className="mb-6 text-gray-600">
        Start by adding a YouTube video to take notes on.
      </p>
      <AddNoteForm />
    </div>
  );
}

export default NoNotes;
