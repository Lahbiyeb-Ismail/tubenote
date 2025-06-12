import type { Video } from "@tubenote/db";

import { Video as VideoIcon, Youtube } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface IProps {
  option: "new" | "existing";
  setOption: (option: "new" | "existing") => void;
  videos: Video[];
}

export function NoteCreationDialogOptions({ option, setOption, videos }: IProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card
        className={`cursor-pointer transition-all ${
          option === "new"
            ? "ring-2 ring-primary bg-primary/5"
            : "hover:bg-muted/50"
        }`}
        onClick={() => setOption("new")}
      >
        <CardContent className="p-4 text-center">
          <Youtube className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <h3 className="font-medium">New Video</h3>
          <p className="text-sm text-muted-foreground">
            Add YouTube URL
          </p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer transition-all ${
          option === "existing"
            ? "ring-2 ring-primary bg-primary/5"
            : "hover:bg-muted/50"
        } ${videos.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => videos.length > 0 && setOption("existing")}
      >
        <CardContent className="p-4 text-center">
          <VideoIcon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <h3 className="font-medium">Existing Video</h3>
          <p className="text-sm text-muted-foreground">
            Select from library
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
