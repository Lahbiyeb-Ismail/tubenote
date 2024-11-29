import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type NotePageHeaderProps = {
	noteId: string;
	noteTitle: string;
};

function NotePageHeader({ noteId, noteTitle }: NotePageHeaderProps) {
	return (
		<header className="border-b bg-muted/40">
			<div className="container max-w-4xl mx-auto px-4 py-8">
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/notes">Notes</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={`/notes/${noteId}`}>
								{noteTitle}
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
	);
}

export default NotePageHeader;
