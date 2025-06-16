"use client";

import { ArrowLeftRight, Save } from "lucide-react";

import { NavigateBackButton } from "@/components";
import { Button } from "@/components/ui";
import { useDialogStore } from "@/stores";

import { useEditorPositionStore } from "../../store";

export function NoteActionHeader() {
  const { openDialog } = useDialogStore();
  const { toggleEditorPosition } = useEditorPositionStore();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavigateBackButton href="/notes" btnText="Back to Notes" />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={toggleEditorPosition}
              className="flex items-center space-x-1"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Switch Sides</span>
            </Button>
            <Button onClick={() => openDialog("save-note")} className="flex items-center space-x-1">
              <Save className="h-4 w-4" />
              <span>Save Note</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
