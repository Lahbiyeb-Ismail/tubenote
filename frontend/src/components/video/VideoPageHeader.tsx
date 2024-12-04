"use client";

import { Edit, Plus } from "lucide-react";
import type { BreadcrumbItemType } from "../global/NavigationHeader";
import NavigationHeader from "../global/NavigationHeader";

type VideoPageHeaderProps = {
	videoId: string;
	videoTitle: string;
	onToggleVideo: () => void;
	isVideoVisible: boolean;
};

function VideoPageHeader({
	videoId,
	videoTitle,
	onToggleVideo,
	isVideoVisible,
}: VideoPageHeaderProps) {
	const breadcrumbs: BreadcrumbItemType[] = [
		{ href: "/videos", label: "Videos" },
		{ href: `/videos/${videoId}`, label: videoTitle, isCurrent: true },
	];

	const toggleOption = {
		id: "video-toggle",
		label: isVideoVisible ? "Hide Video" : "Show Video",
		checked: isVideoVisible,
		onChange: onToggleVideo,
	};

	const actionButton = {
		href: `/editor/create/${videoId}`,
		label: "Add Note",
		icon: <Plus />,
	};
	return (
		<NavigationHeader
			breadcrumbs={breadcrumbs}
			toggleOption={toggleOption}
			actionButton={actionButton}
		/>
	);
}

export default VideoPageHeader;
