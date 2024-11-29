"use client";

import { useEffect, useState } from "react";

import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";

interface ResizablePanelsProps {
	leftPanelSize?: number;
	rightPanelSize?: number;
	leftSideContent: React.ReactNode;
	rightSideContent: React.ReactNode;
}

function ResizablePanels({
	leftPanelSize = 50,
	rightPanelSize = 50,
	leftSideContent,
	rightSideContent,
}: ResizablePanelsProps) {
	const [direction, setDirection] = useState<"horizontal" | "vertical">(
		"horizontal",
	);
	// const { isSidebarOpen } = useLayout();

	useEffect(() => {
		function changeDirection() {
			if (window.innerWidth < 768) {
				setDirection("vertical");
			} else {
				setDirection("horizontal");
			}
		}

		changeDirection();

		window.addEventListener("resize", changeDirection);
		return () => window.removeEventListener("resize", changeDirection);
	}, []);

	return (
		<ResizablePanelGroup direction={direction} className="flex w-full">
			<ResizablePanel defaultSize={leftPanelSize} className="px-2 relative">
				{leftSideContent}
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={rightPanelSize} className="px-2">
				{rightSideContent}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export default ResizablePanels;
