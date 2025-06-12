import { Video as VideoIcon } from "lucide-react";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function NoteCreationDialogHeader() {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center">
        <VideoIcon className="h-5 w-5 mr-2" />
        Create New Note
      </DialogTitle>
      <DialogDescription>
        Choose how you'd like to create your note - with a new YouTube video or an existing one.
      </DialogDescription>
    </DialogHeader>
  );
}
