import { Plus } from "lucide-react";
import Link from "next/link";

import { NavigateBackButton } from "@/components";
import { Button } from "@/components/ui";

interface IProps {
  ytVideoId: string;
}

export function VideoPageHeader({
  ytVideoId,
}: IProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavigateBackButton href="/videos" btnText="Back to Videos" />

          <div className="flex items-center space-x-2">
            <Link href={`/notes/create/${ytVideoId}`}>
              <Button className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>Add Note</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
