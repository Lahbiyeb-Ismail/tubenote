"use client";

import { Plus } from "lucide-react";

import { type BreadcrumbItemType, NavigationHeader } from "@/components/global";

type VideoPageHeaderProps = {
  videoId: string;
  videoTitle: string;
  onToggleVideo: () => void;
  isVideoVisible: boolean;
};

export function VideoPageHeader({
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
    href: `/notes/add/${videoId}`,
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
