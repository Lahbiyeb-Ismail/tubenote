import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/stores";

import { SaveNoteDialogForm } from "./save-note-dialog-form";
import { SaveNoteDialogHeader } from "./save-note-dialog-header";

interface IProps {
  onSaveNote: (title: string, category: string, tags: string[]) => void;
  isSaving: boolean;
  noteTitle?: string;
  noteTags?: string[];
  noteCategory?: string;
}

export function SaveNoteDialog({ onSaveNote, isSaving, noteTitle, noteTags, noteCategory }: IProps) {
  const { type, isOpen, closeDialog } = useDialogStore();

  const open = isOpen && type === "save-note";

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <SaveNoteDialogHeader />

        <SaveNoteDialogForm
          noteTitle={noteTitle}
          noteCategory={noteCategory}
          noteTags={noteTags}
          onSaveNote={onSaveNote}
          isSaving={isSaving}
        />
      </DialogContent>
    </Dialog>
  );
}
