import type { Video } from "@tubenote/db";

import {
  Bookmark,
  BookOpen,
  Download,
  Eye,
  MoreVertical,
  Play,
  Share,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetNotesCountByVideoIdQuery } from "@/features/note/queries";

import { formatVideoDuration, formatVideoViewsCount } from "../../helpers";

interface IProps {
  video: Video;
}

export function VideoCard({ video }: IProps) {
  const { data } = useGetNotesCountByVideoIdQuery(video.youtubeId);

  return (
    <Card
      key={video.id}
      className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400"
    >
      <div className="relative">
        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
          <Image
            src={video.thumbnails.standard.url}
            alt={video.title}
            width={video.thumbnails.standard.width}
            height={video.thumbnails.standard.height}
            className="w-full h-full object-cover"
          />

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Button
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-black"
            >
              {/* {playingVideo === video.id
                ? (
                    <Pause className="h-5 w-5" />
                  )
                : (
                )} */}
              <Play className="h-5 w-5 ml-0.5" />
            </Button>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatVideoDuration(video.videoDuration)}
          </div>

          {/* Progress Bar */}
          {/* {video.watchProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div className="h-full bg-red-600" style={{ width: `${video.watchProgress}%` }} />
            </div>
          )}
 */}
          {/* Status Indicators */}
          {/* <div className="absolute top-2 left-2 flex gap-1">
            {video.isWatched && (
              <Badge className="bg-green-600 hover:bg-green-600 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Watched
              </Badge>
            )}
            {video.isSaved && (
              <Badge className="bg-purple-600 hover:bg-purple-600 text-white">
                <BookmarkCheck className="h-3 w-3" />
              </Badge>
            )}
          </div> */}

          {/* Selection Checkbox */}
          {/* <div className="absolute top-2 right-2">
            <Checkbox
              checked={selectedVideos.includes(video.id)}
              onCheckedChange={() => handleSelectVideo(video.id)}
              className="bg-white/90"
            />
          </div> */}
        </div>

        {/* Video Player (when playing) */}
        {/* {playingVideo === video.id && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <Play className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Video Player</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3 text-white">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 mx-3">
                    <Progress value={video.watchProgress} className="h-1" />
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={video.channelInfo.thumbnails.default.url} />
              <AvatarFallback>{video.channelInfo.title[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {video.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{video.channelInfo.title}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Play className="mr-2 h-4 w-4" />
                  Watch
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Notes (
                  12
                  {/* {video.notesCount} */}
                  )
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  {false ? "Remove from saved" : "Save video"}
                  {/* {video.isSaved ? "Remove from saved" : "Save video"} */}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{video.description}</p>

          <div className="flex items-center gap-2 flex-wrap">
            {video.tags.slice(0, 4).map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer truncate"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Eye className="h-3 w-3" />
              {formatVideoViewsCount(video.videoStatistics.viewCount)}
            </div>
            <div className="flex items-center gap-3">
              {/* <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                4.5
              </div> */}
              {12 > 0 && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {data?.count}
                  {" "}
                  notes
                </div>
              )}
            </div>
          </div>

          {/* <span>{new Date(video.createdAt).toLocaleDateString()}</span> */}
        </div>
      </CardContent>
    </Card>
  );
}
