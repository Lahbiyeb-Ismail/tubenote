import { Youtube } from "lucide-react";

import { YoutubeUrlForm } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/stores";

export function AddVideoDialog() {
  const { closeDialog, isOpen, type } = useDialogStore();

  const isAddVideoDialogOpen = isOpen && type === "add-video";

  const onSubmit = (videoUrl: string) => {
    console.log("Video URL submitted:", videoUrl);
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

        <YoutubeUrlForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
