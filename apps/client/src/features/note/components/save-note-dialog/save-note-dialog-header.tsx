import { Save } from "lucide-react";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SaveNoteDialogHeader() {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <Save className="h-5 w-5" />
        <span>Save Note</span>
      </DialogTitle>
      <DialogDescription>
        Add details to organize and save your note with video timestamps.
      </DialogDescription>
    </DialogHeader>
  );
}
