import type { Video } from "@tubenote/db";

import {
  Play,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { formatVideoDuration } from "@/features/video/helpers";

interface IProps {
  video: Video;
}

export function VideoCardThumbnail({ video }: IProps) {
  return (
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
            <Play className="h-5 w-5" />
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
  );
}
