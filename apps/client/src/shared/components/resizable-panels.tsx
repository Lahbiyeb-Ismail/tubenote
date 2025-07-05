import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui";
import { useDirection } from "@/shared/hooks";

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
    <ResizablePanelGroup direction={direction} className="rounded-lg border">
      <ResizablePanel defaultSize={leftPanelSize} minSize={30} maxSize={70} className="px-2 relative">
        {leftSideContent}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={rightPanelSize} minSize={30} maxSize={70} className="px-2">
        {rightSideContent}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
