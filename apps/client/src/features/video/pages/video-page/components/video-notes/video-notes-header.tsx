import type { Note } from "@tubenote/db";

import {
  Search,
  SortAsc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface IProps {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function VideoNotesHeader({ notes, searchQuery, setSearchQuery }: IProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Notes (
        {notes.length}
        )
      </h2>
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-7 h-8 w-32 text-xs"
          />
        </div>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <SortAsc className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>By Timestamp</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Newest First</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Oldest First</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Alphabetical</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
