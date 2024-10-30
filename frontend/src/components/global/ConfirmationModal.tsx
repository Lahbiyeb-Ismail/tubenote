import type { PropsWithChildren } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmationModalProps = PropsWithChildren<{
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	title: string;
	message: string;
	action: "delete" | "save" | "update";
	confirmText?: string;
	cancelText?: string;
}>;

function ConfirmationModal({
	children,
	onConfirm,
	title,
	message,
	action,
	isOpen,
	onClose,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: ConfirmationModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				{children ? <DialogDescription>{children}</DialogDescription> : null}
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						{cancelText}
					</Button>
					{action === "delete" && (
						<Button variant="destructive" onClick={onConfirm}>
							{confirmText}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ConfirmationModal;
