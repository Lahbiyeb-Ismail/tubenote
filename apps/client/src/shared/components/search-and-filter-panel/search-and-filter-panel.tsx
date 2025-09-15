"use client";

import {
  ArrowUpDown,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/shared/hooks";

import { LayoutModeSwitcher } from "../layout-mode-switcher";
import { SecondaryButton } from "../secondary-btn";

const sortOptions = [
  { label: "Recently Created", value: "createdAt" },
  { label: "Recently Updated", value: "updatedAt" },
  // { label: "Title A-Z", value: "title-asc" },
  // { label: "Title Z-A", value: "title-desc" },
];

interface IProps {
  inputSearchPlaceholder: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function SearchAndFilterPanel({
  inputSearchPlaceholder,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: IProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedLocalSearchQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    if (debouncedLocalSearchQuery !== searchQuery) {
      setSearchQuery(debouncedLocalSearchQuery);
    }
  }, [debouncedLocalSearchQuery, setSearchQuery, searchQuery]);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900 rounded-lg shadow mb-6 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={inputSearchPlaceholder}
            value={localSearchQuery}
            onChange={e => setLocalSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <SecondaryButton label="Filters" icon={Filter} onClick={() => setShowFilters(!showFilters)} className={`gap-2 ${showFilters ? "bg-slate-100 dark:bg-slate-800" : ""}`} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? "bg-slate-100 dark:bg-slate-800" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <LayoutModeSwitcher
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
      </div>

      {showFilters && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Select dates
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <Input placeholder="Filter by tags..." />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
