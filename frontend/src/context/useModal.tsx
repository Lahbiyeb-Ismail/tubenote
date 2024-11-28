"use client";

import React, {
	createContext,
	useState,
	useContext,
	type ReactNode,
} from "react";

type ModalContent = {
	noteId: string;
	title: string;
	description: string;
	confirmText: string;
	cancelText: string;
	noteTitle?: string;
	noteContent?: string;
	action: "delete" | "create" | "update";
	onConfirm?: () => void;
};

type OpenModalContent = ModalContent;

interface ModalContextType {
	isOpen: boolean;
	modalContent: ModalContent | null;
	openModal: (content: OpenModalContent) => void;
	closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [modalContent, setModalContent] = useState<ModalContent | null>(null);

	const openModal = (content: OpenModalContent) => {
		setModalContent(content);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		setModalContent(null);
	};

	return (
		<ModalContext.Provider
			value={{ isOpen, modalContent, openModal, closeModal }}
		>
			{children}
		</ModalContext.Provider>
	);
}

export function useModal() {
	const context = useContext(ModalContext);

	if (context === undefined) {
		throw new Error("useModal must be used within a ModalProvider");
	}

	return context;
}
