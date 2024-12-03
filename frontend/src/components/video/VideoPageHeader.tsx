"use client";

import { Edit } from "lucide-react";
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
	return (
		<NavigationHeader breadcrumbs={breadcrumbs} toggleOption={toggleOption} />
	);
}

export default VideoPageHeader;
