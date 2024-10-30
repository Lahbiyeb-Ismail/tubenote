"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarIcon, ClockIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { INote } from "@/types/note.types";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useNote } from "@/context/useNote";
import { useLayout } from "@/context/useLayout";
import ConfirmationModal from "../global/ConfirmationModal";

type NoteCardProps = {
	note: INote;
};

function NoteCard({ note }: NoteCardProps) {
	const { deleteNote, isLoading, getNote } = useNote();
	const { isGridLayout } = useLayout();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleDeleteClick = () => {
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		deleteNote(note.id);
		setIsDeleteModalOpen(false);
	};

	return (
		<>
			<Card
				className={`overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg ${
					isGridLayout ? "hover:scale-105" : ""
				}`}
			>
				<div className={`${isGridLayout ? "" : "flex"}`}>
					<div
						className={`relative ${
							isGridLayout ? "h-48 w-full" : "w-40 flex-shrink-0"
						}`}
					>
						<Image
							src={note.thumbnail || "/images/placeholder.jpg"}
							alt={note.title}
							fill
							className="object-cover"
						/>
					</div>
					<div
						className={` flex-grow ${
							isGridLayout ? "" : "flex flex-row justify-between"
						}`}
					>
						<CardHeader
							className={`${isGridLayout ? "space-y-2" : "space-y-0"}`}
						>
							<div className="flex justify-between items-start">
								<CardTitle
									className={`font-bold ${
										isGridLayout
											? "text-xl line-clamp-2"
											: "text-lg line-clamp-1"
									}`}
								>
									{note.videoTitle}
								</CardTitle>
							</div>
							<CardDescription className="text-sm text-muted-foreground line-clamp-1">
								Note Title: {note.title}
							</CardDescription>
						</CardHeader>
						<CardFooter
							className={`flex justify-between ${
								isGridLayout ? "flex-row p-4 pt-0" : "flex-col p-4 space-y-1"
							}`}
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
								onClick={handleDeleteClick}
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

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleConfirmDelete}
				title="Confirm Deletion"
				message="Are you sure you want to delete this note? This action cannot be undone."
				action="delete"
				confirmText="Delete"
				cancelText="Cancel"
			/>
		</>
	);
}

export default NoteCard;
