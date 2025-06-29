import Link from "next/link";

import type { VideoWithCount } from "@/features/video/types";

import { Card, CardContent } from "@/components/ui/card";

import { VideoCardActionsMenu } from "./video-card-actions-menu";
import { VideoCardChannelAvatar } from "./video-card-channel-avatar";
import { VideoCardInfo } from "./video-card-info";
import { VideoCardStatistics } from "./video-card-statistics";
import { VideoCardTags } from "./video-card-tags";
import { VideoCardThumbnail } from "./video-card-thumbnail";

interface IProps {
  video: VideoWithCount;
}

export function VideoCard({ video }: IProps) {
  return (
    <Card
      key={video.id}
      className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400"
    >
      <Link href={`/videos/${video.youtubeId}`} className="block">
        <VideoCardThumbnail video={video} />
      </Link>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <VideoCardChannelAvatar channelAvatar={video.channelInfo.thumbnails.default.url} channelName={video.channelInfo.title} />

            <VideoCardInfo videoTitle={video.title} channelTitle={video.channelInfo.title} ytVideoId={video.youtubeId} />

            <VideoCardActionsMenu notesCount={video._count.notes} ytVideoId={video.youtubeId} />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{video.description}</p>

          <VideoCardTags videoTags={video.tags} />

          <VideoCardStatistics viewsCount={video.videoStatistics.viewCount} notesCount={video._count.notes} />
        </div>
      </CardContent>
    </Card>
  );
}
