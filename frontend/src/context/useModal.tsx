"use client";

import { createContext, useContext, useState } from "react";

type ModalContextType = {
	isModalOpen: boolean;
	setIsModalOpen: (isOpen: boolean) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
			{children}
		</ModalContext.Provider>
	);
}

const useModal = () => {
	const context = useContext(ModalContext);

	if (context === undefined) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
};

export default useModal;
