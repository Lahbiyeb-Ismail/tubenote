import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import useDirection from "@/hooks/global/useDirection";

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

export default ResizablePanels;
