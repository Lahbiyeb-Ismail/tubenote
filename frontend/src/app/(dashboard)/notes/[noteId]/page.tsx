"use client";

import useGetNoteById from "@/hooks/note/useGetNoteById";

import MarkdownViewer from "@/components/global/MarkdownViewer";
import Loader from "@/components/global/Loader";
import NoteError from "@/components/note/NoteError";

import NotePageHeader from "@/components/note/NotePageHeader";
import NotePageFooter from "@/components/note/NotePageFooter";

type NotePageParams = {
	noteId: string;
};

function NotePage({ params }: { params: NotePageParams }) {
	const { noteId } = params;
	const { data, isLoading, isError, refetch } = useGetNoteById(noteId);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
				<Loader />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
				<NoteError onRetry={() => refetch()} />
			</div>
		);
	}

	if (!data) return null;

	return (
		<article className="min-h-screen bg-white">
			{/* Header */}
			<NotePageHeader noteId={data.id} noteTitle={data.title} />

			{/* Content */}
			<main className="container max-w-4xl mx-auto px-4 py-8">
				<div className="prose dark:prose-invert max-w-none">
					<MarkdownViewer content={data.content} />
				</div>
			</main>

			{/* Footer */}
			<NotePageFooter />
		</article>
	);
}

export default NotePage;
