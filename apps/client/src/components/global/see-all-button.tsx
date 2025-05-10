import { Eye } from "lucide-react";
import Link from "next/link";

import { useUIStore } from "@/stores";

import { Button } from "@/components/ui";

type SeeAllButtonProps = {
  href: string;
};

export function SeeAllButton({ href }: SeeAllButtonProps) {
  const { layout } = useUIStore();

  return (
    <Link href={href}>
      <Button
        variant="outline"
        size={!layout.isGridLayout ? "icon" : "sm"}
        className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed ${
          !layout.isGridLayout ? "w-10 h-10 p-0" : ""
        }`}
      >
        <Eye className={`h-4 w-4 ${!layout.isGridLayout ? "m-0" : "mr-2"}`} />
        {layout.isGridLayout && "See All Notes"}
      </Button>
    </Link>
  );
}
