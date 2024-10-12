"use client";

import Image from "next/image";
import { CalendarIcon, ClockIcon, PencilIcon, Trash2Icon } from "lucide-react";

import type { INote } from "@/types/note.types";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import formatDate from "@/helpers/formatDate";
import { useNote } from "@/context/useNote";
import Modal from "../global/Modal";
import { useState } from "react";

type NoteCardProps = {
	note: INote;
};

function NoteCard({ note }: NoteCardProps) {
	const { deleteNote, isLoading } = useNote();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDelete = () => {
		setIsModalOpen(true);
	};

	const confirmDelete = () => {
		deleteNote(note.id);
		setIsModalOpen(false);
	};

	return (
		<>
			<Card className="overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
				<div className="relative h-48 w-full">
					<Image
						src={note.thumbnail || "/images/placeholder.jpg"}
						alt={note.title}
						fill
						className="object-cover"
					/>
				</div>
				<CardHeader className="space-y-2">
					<div className="flex justify-between items-start">
						<CardTitle className="text-xl font-bold line-clamp-2">
							{note.videoTitle}
						</CardTitle>
					</div>
					<CardDescription className="text-sm text-muted-foreground line-clamp-1">
						Note Title: {note.title}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex items-center text-sm text-muted-foreground">
						<CalendarIcon className="mr-1 h-4 w-4" />
						Created: {formatDate(note.createdAt)}
					</div>
					<div className="flex items-center text-sm text-muted-foreground">
						<ClockIcon className="mr-1 h-4 w-4" />
						Updated: {formatDate(note.createdAt)}
					</div>
				</CardContent>
				<CardFooter className="p-4 pt-0 flex justify-between">
					<Button
						variant="outline"
						size="sm"
						className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
					>
						<PencilIcon className="mr-2 h-4 w-4" />
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="text-red-700 hover:text-red-800 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handleDelete}
						disabled={isLoading}
					>
						<Trash2Icon className="mr-2 h-4 w-4" />
						Delete
					</Button>
				</CardFooter>
			</Card>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={confirmDelete}
				title="Confirm Delete"
				message={`Are you sure you want to delete the note titled "${note.title}"? This action cannot be undone.`}
			/>
		</>
	);
}

export default NoteCard;
