import { Grid3X3, List } from "lucide-react";

import { LayoutButton } from "./layout-button";

interface IProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function LayoutModeSwitcher({ viewMode, setViewMode }: IProps) {
  return (
    <div className="flex items-center border rounded-lg">
      <LayoutButton
        variant={viewMode === "grid" ? "default" : "ghost"}
        onClick={() => setViewMode("grid")}
        btnClassName={`rounded-r-none ${viewMode === "grid" ? "text-white" : ""}`}
        btnIcon={Grid3X3}
      />
      <LayoutButton
        variant={viewMode === "list" ? "default" : "ghost"}
        onClick={() => setViewMode("list")}
        btnClassName={`rounded-l-none ${viewMode === "list" ? "text-white" : ""}`}
        btnIcon={List}
      />
    </div>
  );
}
