"use client";

import React from "react";
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

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
};

function Modal({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-start">
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={onConfirm}
						className="w-full sm:w-auto"
					>
						Delete
					</Button>
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
