import type { Video } from "@tubenote/db";

import { Card, CardContent } from "@/components/ui/card";
import { useGetNotesCountByVideoIdQuery } from "@/features/note/queries";

import { VideoCardActionsMenu } from "./video-card-actions-menu";
import { VideoCardChannelAvatar } from "./video-card-channel-avatar";
import { VideoCardInfo } from "./video-card-info";
import { VideoCardStatistics } from "./video-card-statistics";
import { VideoCardTags } from "./video-card-tags";
import { VideoCardThumbnail } from "./video-card-thumbnail";

interface IProps {
  video: Video;
}

export function VideoCard({ video }: IProps) {
  const { data: notesCount } = useGetNotesCountByVideoIdQuery(video.youtubeId);

  return (
    <Card
      key={video.id}
      className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400"
    >
      <VideoCardThumbnail video={video} />

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <VideoCardChannelAvatar channelAvatar={video.channelInfo.thumbnails.default.url} channelName={video.channelInfo.title} />

            <VideoCardInfo videoTitle={video.title} channelTitle={video.channelInfo.title} />

            <VideoCardActionsMenu notesCount={notesCount?.count || 0} />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{video.description}</p>

          <VideoCardTags videoTags={video.tags} />

          <VideoCardStatistics viewsCount={video.videoStatistics.viewCount} notesCount={notesCount?.count || 0} />
        </div>
      </CardContent>
    </Card>
  );
}
