import { MoreVertical, Pencil, Trash2, Clock } from "lucide-react";

import type { Note } from "@/types/note.types";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type VideoNoteProps = {
	note: Note;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
};

function VideoNote({ note, onEdit, onDelete }: VideoNoteProps) {
	return (
		<Link href={`/notes/${note.id}`}>
			<Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
				<CardHeader className="p-4 pb-2">
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-2">
							<CardTitle className="text-lg font-semibold">
								{note.title}
							</CardTitle>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 opacity-100"
								>
									<MoreVertical className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onSelect={() => {}}>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onSelect={() => {}}
									className="text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
						<Clock className="h-4 w-4" />
						<span>{note.timestamp}</span>
					</div>
				</CardHeader>
			</Card>
		</Link>
	);
}

export default VideoNote;
