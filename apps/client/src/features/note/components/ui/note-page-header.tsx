import { Edit2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { NavigateBackButton } from "@/components";
import { Button } from "@/components/ui";

interface NotePageHeaderProps {
  noteId: string;
  isVideoVisible: boolean;
  onToggleVideo: () => void;
}

export function NotePageHeader({
  noteId,
  isVideoVisible,
  onToggleVideo,
}: NotePageHeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavigateBackButton href="/notes" btnText="Back to Notes" />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onToggleVideo}
              className="flex items-center space-x-1"
            >
              {isVideoVisible
                ? (
                    <Fragment>
                      <EyeOff className="h-4 w-4" />
                      <span>Hide Player</span>
                    </Fragment>
                  )
                : (
                    <Fragment>
                      <Eye className="h-4 w-4" />
                      <span>Show Player</span>
                    </Fragment>
                  )}

            </Button>

            <Link href={`/notes/update/${noteId}`}>
              <Button className="flex items-center space-x-1">
                <Edit2 className="h-4 w-4" />
                <span>Edit Note</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
