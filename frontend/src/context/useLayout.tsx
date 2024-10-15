"use client";

import React, {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";

type LayoutContextType = {
	isGridLayout: boolean;
	toggleLayout: () => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
	const [isGridLayout, setIsGridLayout] = useState(true);

	const toggleLayout = () => setIsGridLayout((prev) => !prev);

	return (
		<LayoutContext.Provider
			value={{
				isGridLayout,
				toggleLayout,
			}}
		>
			{children}
		</LayoutContext.Provider>
	);
}

export function useLayout() {
	const context = useContext(LayoutContext);
	if (context === undefined) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}
	return context;
}
