"use client";

import React from "react";
import NoteCard from "./NoteCard";
import type { INote } from "@/types/note.types";
import { useLayout } from "@/context/useLayout";

type NotesListProps = {
	notes?: INote[];
};

function NotesList({ notes }: NotesListProps) {
	const { isGridLayout } = useLayout();

	return (
		<div className="px-4 py-6 sm:px-0">
			<div
				className={`${isGridLayout ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}`}
			>
				{notes?.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	);
}

export default NotesList;
