"use client";

import { Edit } from "lucide-react";
import type { BreadcrumbItemType } from "../global/NavigationHeader";
import NavigationHeader from "../global/NavigationHeader";

type NotePageHeaderProps = {
	noteId: string;
	noteTitle: string;
	isVideoVisible: boolean;
	onToggleVideo: () => void;
};

function NotePageHeader({
	noteId,
	noteTitle,
	isVideoVisible,
	onToggleVideo,
}: NotePageHeaderProps) {
	const breadcrumbs: BreadcrumbItemType[] = [
		{ href: "/notes", label: "Notes" },
		{ href: `/notes/${noteId}`, label: noteTitle, isCurrent: true },
	];

	const actionButton = {
		href: `/editor/update/${noteId}`,
		label: "Edit Note",
		icon: <Edit className="h-4 w-4" />,
	};

	const toggleOption = {
		id: "video-toggle",
		label: isVideoVisible ? "Hide Video" : "Show Video",
		checked: isVideoVisible,
		onChange: onToggleVideo,
	};
	return (
		<NavigationHeader
			breadcrumbs={breadcrumbs}
			actionButton={actionButton}
			toggleOption={toggleOption}
		/>
	);
}

export default NotePageHeader;
