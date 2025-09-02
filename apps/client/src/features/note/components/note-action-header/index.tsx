"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui";
import { NavigateBackButton } from "@/shared/components";
import { useDialogStore } from "@/stores";

export function NoteActionHeader() {
  const { openDialog } = useDialogStore();
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 bg-white backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavigateBackButton href="/notes" btnText="Back to Notes" />

          <div className="flex items-center space-x-2">
            <Button onClick={() => openDialog("save-note")} className="flex items-center space-x-1 text-white">
              <Save className="h-4 w-4" />
              <span>Save Note</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
