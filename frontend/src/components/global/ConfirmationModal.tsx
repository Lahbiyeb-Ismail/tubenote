"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/useModal";
import SaveNoteForm from "../editor/SaveNoteForm";

function ConfirmationModal() {
	const { isOpen, modalContent, closeModal } = useModal();

	if (!modalContent) return null;

	const {
		title,
		description,
		confirmText,
		cancelText,
		onConfirm,
		action,
		noteContent,
		noteTitle,
	} = modalContent;

	const handleConfirm = () => {
		onConfirm?.();
		closeModal();
	};

	return (
		<Dialog open={isOpen} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{action === "delete" ? (
					<DialogFooter>
						<Button variant="outline" onClick={closeModal}>
							{cancelText}
						</Button>
						<Button variant="destructive" onClick={handleConfirm}>
							{confirmText}
						</Button>
					</DialogFooter>
				) : (
					<DialogDescription>
						<SaveNoteForm
							action={action}
							noteContent={noteContent || ""}
							noteTitle={noteTitle}
							cancelText={cancelText}
							closeModal={closeModal}
						/>
					</DialogDescription>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default ConfirmationModal;
