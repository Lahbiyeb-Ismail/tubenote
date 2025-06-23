import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IProps {
  youtubeUrl: string;
  handleUrlChange: (url: string) => void;
  urlError: string;
}

export function NoteCreationDialogUrlInput({ youtubeUrl, handleUrlChange, urlError }: IProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="youtube-url">YouTube Video URL</Label>
      <Input
        id="youtube-url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={youtubeUrl}
        onChange={e => handleUrlChange(e.target.value)}
        className={urlError ? "border-destructive" : ""}
      />
      {urlError && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{urlError}</span>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Enter a YouTube video URL to create synchronized notes
      </p>
    </div>
  );
}
