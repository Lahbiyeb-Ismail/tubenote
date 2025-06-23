import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";

interface IProps {
  handleCancel: () => void;
  handleSubmit: () => void;
  isSubmitDisabled: () => boolean;
}

export function NoteCreationDialogFooter({
  handleCancel,
  handleSubmit,
  isSubmitDisabled,
}: IProps) {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitDisabled()}
        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
      >
        Create Note
      </Button>
    </DialogFooter>
  );
}
