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
import { useLayout } from "@/context/useLayout";
import useModal from "@/context/useModal";

type NoteCardProps = {
	note: INote;
};

function NoteCard({ note }: NoteCardProps) {
	const { deleteNote, isLoading, getNote } = useNote();
	const { isGridLayout } = useLayout();
	const { isModalOpen, setIsModalOpen } = useModal();

	// const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDelete = () => {
		setIsModalOpen(true);
	};

	const confirmDelete = () => {
		deleteNote(note.id);
		setIsModalOpen(false);
	};

	return (
		<>
			<Card
				className={`overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg ${isGridLayout ? "hover:scale-105" : ""}`}
			>
				<div className={`${isGridLayout ? "" : "flex"}`}>
					<div
						className={`relative ${isGridLayout ? "h-48 w-full" : "w-40 flex-shrink-0"}`}
					>
						<Image
							src={note.thumbnail || "/images/placeholder.jpg"}
							alt={note.title}
							fill
							className="object-cover"
						/>
					</div>
					<div
						className={` flex-grow ${isGridLayout ? "" : "flex flex-row justify-between"}`}
					>
						<CardHeader
							className={`${isGridLayout ? "space-y-2" : "space-y-0"}`}
						>
							<div className="flex justify-between items-start">
								<CardTitle
									className={`font-bold ${isGridLayout ? "text-xl line-clamp-2" : "text-lg line-clamp-1"}`}
								>
									{note.videoTitle}
								</CardTitle>
							</div>
							<CardDescription className="text-sm text-muted-foreground line-clamp-1">
								Note Title: {note.title}
							</CardDescription>
						</CardHeader>
						{isGridLayout && (
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
						)}
						<CardFooter
							className={`flex justify-between ${isGridLayout ? "flex-row p-4 pt-0" : "flex-col p-4 space-y-1"}`}
						>
							<Button
								variant="outline"
								size={!isGridLayout ? "icon" : "sm"}
								className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed ${
									!isGridLayout ? "w-10 h-10 p-0" : ""
								}`}
								onClick={() => getNote(note.id)}
								disabled={isLoading}
							>
								<PencilIcon
									className={`h-4 w-4 ${!isGridLayout ? "m-0" : "mr-2"}`}
								/>
								{isGridLayout && "Edit"}
							</Button>
							<Button
								variant="outline"
								size={!isGridLayout ? "icon" : "sm"}
								className={`text-red-700 hover:text-red-800 hover:bg-red-50 disabled:opacity-50
									disabled:cursor-not-allowed ${
										!isGridLayout ? "w-10 h-10 p-0" : ""
									}`}
								onClick={handleDelete}
								disabled={isLoading}
							>
								<Trash2Icon
									className={`h-4 w-4 ${!isGridLayout ? "m-0" : "mr-2"}`}
								/>
								{isGridLayout && "Delete"}
							</Button>
						</CardFooter>
					</div>
				</div>
			</Card>
			<Modal
				onConfirm={confirmDelete}
				title="Confirm Delete"
				message={`Are you sure you want to delete the note titled "${note.title}"? This action cannot be undone.`}
			/>
		</>
	);
}

export default NoteCard;
