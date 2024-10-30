"use client";

import React, { type PropsWithChildren } from "react";
import { X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useModal from "@/context/useModal";

type ModalProps = PropsWithChildren<{
	onConfirm?: () => void;
	title: string;
	message: string;
	action: "delete" | "save" | "update";
}>;

function Modal({ children, onConfirm, title, message, action }: ModalProps) {
	const { isModalOpen, setIsModalOpen } = useModal();

	const onClose = () => setIsModalOpen(false);

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				{children ? <DialogDescription>{children}</DialogDescription> : null}
				<DialogFooter className="sm:justify-start">
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					{action === "delete" ? (
						<Button
							type="button"
							variant="destructive"
							onClick={onConfirm}
							className="w-full sm:w-auto"
						>
							{action}
						</Button>
					) : null}
				</DialogFooter>
				<button
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
					type="button"
					onClick={onClose}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</button>
			</DialogContent>
		</Dialog>
	);
}

export default Modal;
