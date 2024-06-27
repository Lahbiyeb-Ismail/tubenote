import React from "react";

import NoteCard from "@/components/NoteCard";

function NotesPage() {
  const notes = [
    {
      id: 1,
      videoTitle: "Introduction to React Hooks",
      videoThumbnail: "https://img.youtube.com/vi/dpw9EHDh2bM/default.jpg",
      noteContent: "useState and useEffect are fundamental hooks...",
      timestamp: "2:35",
      dateCreated: "2023-06-15",
      tags: ["react", "hooks", "frontend"],
    },
    {
      id: 2,
      videoTitle: "Advanced CSS Techniques",
      videoThumbnail: "https://img.youtube.com/vi/F4kJXbaunUg/default.jpg",
      noteContent: "CSS Grid can be used for complex layouts...",
      timestamp: "5:42",
      dateCreated: "2023-06-18",
      tags: ["css", "web design", "frontend"],
    },
    {
      id: 2,
      videoTitle: "Advanced CSS Techniques",
      videoThumbnail: "https://img.youtube.com/vi/F4kJXbaunUg/default.jpg",
      noteContent: "CSS Grid can be used for complex layouts...",
      timestamp: "5:42",
      dateCreated: "2023-06-18",
      tags: ["css", "web design", "frontend"],
    },
    {
      id: 2,
      videoTitle: "Advanced CSS Techniques",
      videoThumbnail: "https://img.youtube.com/vi/F4kJXbaunUg/default.jpg",
      noteContent: "CSS Grid can be used for complex layouts...",
      timestamp: "5:42",
      dateCreated: "2023-06-18",
      tags: ["css", "web design", "frontend"],
    },
    {
      id: 2,
      videoTitle: "Advanced CSS Techniques",
      videoThumbnail: "https://img.youtube.com/vi/F4kJXbaunUg/default.jpg",
      noteContent: "CSS Grid can be used for complex layouts...",
      timestamp: "5:42",
      dateCreated: "2023-06-18",
      tags: ["css", "web design", "frontend"],
    },
    // Add more note objects as needed
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white px-4 py-6 shadow sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Video Notes</h1>
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
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotesPage;
