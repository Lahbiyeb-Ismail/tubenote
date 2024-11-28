"use client";

import type { INote } from "@/types/note.types";

import { useNote } from "@/context/useNote";
import { useLayout } from "@/context/useLayout";
import { useModal } from "@/context/useModal";

import { Card } from "@/components/ui/card";

import CardSettingsButton from "@/components/global/CardSettingsButton";
import CardImage from "@/components/global/CardImage";
import CardContent from "@/components/global/CardContent";
import CardFooterComponent from "@/components/global/CardFooterComponent";
import { exportNoteAsPDF } from "@/actions/note.actions";
import axiosInstance from "@/lib/axios.lib";

type NoteCardProps = {
	note: INote;
};

function NoteCard({ note }: NoteCardProps) {
	const { deleteNote, isLoading, getNote } = useNote();
	const { isGridLayout } = useLayout();
	const { openModal } = useModal();

	const handleDeleteClick = () => {
		openModal({
			title: "Confirm Deletion",
			description:
				"Are you sure you want to delete this note? This action cannot be undone.",
			confirmText: "Delete",
			cancelText: "Cancel",
			action: "delete",
			onConfirm: () => deleteNote(note.id),
		});
	};

	const handleExportClick = async () => {
		const response = await axiosInstance.post(
			`/notes/export-pdf/${note.id}`,
			{},
			{
				responseType: "blob",
			},
		);
		console.log("data ->", response.data);

		const blob = new Blob([response.data], { type: "application/pdf" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `note-${note.id}.pdf`);
		document.body.appendChild(link);
		link.click();
		link.parentNode?.removeChild(link);
	};

	return (
		<Card
			className={`overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg ${
				isGridLayout ? "hover:scale-105" : ""
			}`}
		>
			<div className={`${isGridLayout ? "" : "flex"}`}>
				<CardImage
					src={note.thumbnail ?? "/images/placeholder.jpg"}
					alt={note.title}
					isGridLayout={isGridLayout}
				/>
				<div
					className={`flex-grow ${
						isGridLayout ? "" : "flex flex-col justify-between"
					}`}
				>
					<div className="flex justify-end p-2">
						<CardSettingsButton
							onEdit={() => getNote(note.id)}
							onDelete={handleDeleteClick}
							onExport={handleExportClick}
						/>
					</div>
					<CardContent
						cardTitle={note.videoTitle ?? ""}
						cardDescription={`Note Title: ${note.title}`}
						isGridLayout={isGridLayout}
					/>
					<CardFooterComponent
						onEdit={() => getNote(note.id)}
						onDelete={handleDeleteClick}
						isGridLayout={isGridLayout}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</Card>
	);
}

export default NoteCard;
