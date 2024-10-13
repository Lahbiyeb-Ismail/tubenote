"use client";

import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import "@/app/globals.css";
import "@blocknote/mantine/style.css";

import type { BlockNoteEditor } from "@blocknote/core";
import SaveNoteForm from "./SaveNoteForm";
import { useState } from "react";

type TextEditorProps = {
	initialNoteContent?: string;
	noteTitle?: string;
};

function TextEditor({ initialNoteContent, noteTitle }: TextEditorProps) {
	// Creates a new editor instance.
	const editor: BlockNoteEditor = useCreateBlockNote({
		initialContent: initialNoteContent
			? JSON.parse(initialNoteContent)
			: undefined,
	});

	const [noteContent, setNoteContent] = useState<string>(
		initialNoteContent || "",
	);

	return (
		<div className="h-full overflow-auto">
			<SaveNoteForm noteContent={noteContent} noteTitle={noteTitle} />
			<BlockNoteView
				editor={editor}
				theme="light"
				className="h-[90%] overflow-auto border-2 border-gray-300"
				onChange={() => setNoteContent(JSON.stringify(editor.document))}
			/>
		</div>
	);
}

export default TextEditor;
