import {
  DialogFooter,
} from "@/components/ui/dialog";
import { PrimaryButton, SecondaryButton } from "@/shared/components";

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
      <SecondaryButton label="Cancel" onClick={handleCancel} />

      <PrimaryButton label="Create Note" onClick={handleSubmit} disabled={isSubmitDisabled()} />
    </DialogFooter>
  );
}
