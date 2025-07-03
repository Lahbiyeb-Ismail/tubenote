import {
  MessageSquare,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface IProps {
  searchQuery?: string;
}

export function NoNotesFound({ searchQuery }: IProps) {
  return (
    <div className="text-center py-8">
      <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-3" />
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {searchQuery ? "No matching notes" : "No notes yet"}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {searchQuery ? "Try adjusting your search" : "Start taking notes while watching"}
      </p>
      <Button size="sm" className="gap-2">
        <Plus className="h-3 w-3" />
        Add Note
      </Button>
    </div>
  );
}
