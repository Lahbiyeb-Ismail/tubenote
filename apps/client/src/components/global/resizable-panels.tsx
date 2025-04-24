import { useDirection } from "@/hooks";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui";

interface ResizablePanelsProps {
  leftPanelSize?: number;
  rightPanelSize?: number;
  leftSideContent: React.ReactNode;
  rightSideContent: React.ReactNode;
}

export function ResizablePanels({
  leftPanelSize = 50,
  rightPanelSize = 50,
  leftSideContent,
  rightSideContent,
}: ResizablePanelsProps) {
  const direction = useDirection();

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
