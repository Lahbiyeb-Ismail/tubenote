"use client";

import "@blocknote/core/fonts/inter.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import "@/app/globals.css";
import "@blocknote/mantine/style.css";

import type { BlockNoteEditor } from "@blocknote/core";

type TextEditorProps = {
	initialNoteContent?: string;
};

function TextEditor({ initialNoteContent }: TextEditorProps) {
	// Creates a new editor instance.
	const editor: BlockNoteEditor = useCreateBlockNote({
		initialContent: initialNoteContent
			? JSON.parse(initialNoteContent)
			: undefined,
	});

	return (
		<div className="h-full overflow-auto">
			<BlockNoteView
				editor={editor}
				theme="light"
				className="h-[90%] overflow-auto border-2 border-gray-300"
			/>
		</div>
	);
}

export default TextEditor;
