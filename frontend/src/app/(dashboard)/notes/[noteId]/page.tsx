"use client";

// import { format } from "date-fns";
import {
	CalendarDays,
	Clock,
	PrinterIcon,
	ShareIcon,
	User,
} from "lucide-react";
import useGetNoteById from "@/hooks/note/useGetNoteById";
import MarkdownViewer from "@/components/global/MarkdownViewer";
import NoteError from "@/components/note/NoteError";
import { Button } from "@/components/ui/button";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loader from "@/components/global/Loader";

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
			<header className="border-b bg-muted/40">
				<div className="container max-w-4xl mx-auto px-4 py-8">
					<Breadcrumb className="mb-6">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/notes">Notes</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href={`/notes/${data.id}`}>
									{data.title}
								</BreadcrumbLink>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					{/* <div className="space-y-4">
						<h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>

						<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<User className="h-4 w-4" />
								<span>{data.author}</span>
							</div>
							<div className="flex items-center gap-1">
								<CalendarDays className="h-4 w-4" />
								<time dateTime={data.createdAt}>
									{format(new Date(data.createdAt), "MMMM d, yyyy")}
								</time>
							</div>
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								<time dateTime={data.updatedAt}>
									Updated {format(new Date(data.updatedAt), "MMMM d, yyyy")}
								</time>
							</div>
						</div>

						{data.tags && data.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{data.tags.map((tag) => (
									<Button
										key={tag}
										variant="secondary"
										size="sm"
										className="rounded-full"
										asChild
									>
										<a href={`/notes/tags/${tag}`}>#{tag}</a>
									</Button>
								))}
							</div>
						)}
					</div> */}
				</div>
			</header>

			{/* Content */}
			<main className="container max-w-4xl mx-auto px-4 py-8">
				<div className="prose dark:prose-invert max-w-none">
					<MarkdownViewer content={data.content} />
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t bg-muted/40">
				<div className="container max-w-4xl mx-auto px-4 py-6">
					<div className="flex justify-between items-center">
						<Button variant="outline" asChild>
							<a href="/notes">← Back to Notes</a>
						</Button>
						<div className="flex gap-2">
							<Button variant="outline" size="icon">
								<span className="sr-only">Share note</span>
								<ShareIcon className="h-5 w-5" />
							</Button>
							<Button variant="outline" size="icon">
								<span className="sr-only">Print note</span>
								<PrinterIcon className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>
			</footer>
		</article>
	);
}

export default NotePage;
