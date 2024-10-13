"use client";

import { createContext, useContext, useReducer } from "react";

import type { NoteContextType, NoteProviderProps } from "@/types/note.types";

import useCreateNote from "@/hooks/useCreateNote";
import noteReducer, { noteInitialState } from "@/reducers/note.reducer";
import useGetUserNotes from "@/hooks/useGetUserNotes";
import useDeleteNote from "@/hooks/useDeleteNote";
import useGetNoteById from "@/hooks/useGetNoteById";

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: NoteProviderProps) {
	const [state, dispatch] = useReducer(noteReducer, noteInitialState);

	const createNoteMutation = useCreateNote(dispatch);
	const { data, error, isLoading } = useGetUserNotes();
	const deleteNoteMutation = useDeleteNote();
	const getNoteMutation = useGetNoteById(dispatch);

	const value = {
		state,
		createNote: createNoteMutation.mutate,
		isLoading:
			createNoteMutation.isPending ||
			deleteNoteMutation.isPending ||
			getNoteMutation.isPending,
		notes: data,
		getNotesError: error,
		isNotesLoading: isLoading,
		deleteNote: deleteNoteMutation.mutate,
		getNote: getNoteMutation.mutate,
	};

	return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export function useNote() {
	const context = useContext(NoteContext);

	if (context === undefined) {
		throw new Error("useNote must be used within an NoteProvider");
	}

	return context;
}
