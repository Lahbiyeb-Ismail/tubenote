import { AlertCircle, Youtube } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialogStore } from "@/stores";
import { validateYouTubeUrl } from "@/utils";

export function AddVideoDialog() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const { closeDialog, isOpen, type } = useDialogStore();

  const isAddVideoDialogOpen = isOpen && type === "add-video";

  const handleUrlChange = (value: string) => {
    setYoutubeUrl(value);
    if (value && !validateYouTubeUrl(value)) {
      setUrlError("Please enter a valid YouTube URL");
    }
    else {
      setUrlError("");
    }
  };

  const handleSubmit = () => {
    if (!youtubeUrl) {
      setUrlError("Please enter a YouTube URL");
      return;
    }
    if (!validateYouTubeUrl(youtubeUrl)) {
      setUrlError("Please enter a valid YouTube URL");
      return;
    }

    // Reset form
    setYoutubeUrl("");
    setUrlError("");
    closeDialog();
  };

  const handleCancel = () => {
    setYoutubeUrl("");
    setUrlError("");
    closeDialog();
  };

  const isSubmitDisabled = () => {
    return !youtubeUrl || !!urlError;
  };

  return (
    <Dialog open={isAddVideoDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Youtube className="h-5 w-5 mr-2 text-red-500" />
            Add New Video
          </DialogTitle>
          <DialogDescription>
            Add a YouTube video to your library. You can use this video later for note-taking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
              Paste any YouTube video URL to add it to your library
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            <Youtube className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
