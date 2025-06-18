import type { Video } from "@tubenote/db";

import { Video as VideoIcon, Youtube } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IProps {
  videos: Video[];
  selectedVideoId: string;
  setSelectedVideoId: (id: string) => void;
}

export function NoteCreationDialogVideoSelection({ videos, selectedVideoId, setSelectedVideoId }: IProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="existing-video">Select Video</Label>
      {videos.length > 0
        ? (
            <Select value={selectedVideoId} onValueChange={setSelectedVideoId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a video from your library" />
              </SelectTrigger>
              <SelectContent>
                {videos.map(video => (
                  <SelectItem key={video.id} value={video.youtubeId}>
                    <div className="flex items-center space-x-2 max-w-[300px]">
                      <Youtube className="h-4 w-4 text-red-500" />
                      <span className="truncate">{video.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        : (
            <div className="text-center py-4 text-muted-foreground">
              <VideoIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No videos in your library yet</p>
              <p className="text-xs">Create a note with a new video first</p>
            </div>
          )}
    </div>
  );
}
