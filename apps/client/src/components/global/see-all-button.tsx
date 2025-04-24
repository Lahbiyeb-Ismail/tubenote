import { Eye } from "lucide-react";
import Link from "next/link";

import { useLayout } from "@/context";

import { Button } from "@/components/ui";

type SeeAllButtonProps = {
  href: string;
};

export function SeeAllButton({ href }: SeeAllButtonProps) {
  const { isGridLayout } = useLayout();

  return (
    <Link href={href}>
      <Button
        variant="outline"
        size={!isGridLayout ? "icon" : "sm"}
        className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed ${
          !isGridLayout ? "w-10 h-10 p-0" : ""
        }`}
      >
        <Eye className={`h-4 w-4 ${!isGridLayout ? "m-0" : "mr-2"}`} />
        {isGridLayout && "See All Notes"}
      </Button>
    </Link>
  );
}
