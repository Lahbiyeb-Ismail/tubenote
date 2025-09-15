"use client";

import { ArrowLeftRight, Save } from "lucide-react";

import { NavigateBackButton, PrimaryButton, SecondaryButton } from "@/shared/components";
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

          <div className="flex items-center gap-2">
            <SecondaryButton label="Switch Sides" onClick={toggleEditorPosition} icon={ArrowLeftRight} />

            <PrimaryButton label="Save Note" onClick={() => openDialog("save-note")} icon={Save} />
          </div>
        </div>
      </div>
    </header>
  );
}
