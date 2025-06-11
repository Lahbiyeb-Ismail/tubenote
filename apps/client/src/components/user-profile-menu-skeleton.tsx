import { ChevronDown } from "lucide-react";

import { Button, Skeleton } from "./ui";

export function UserProfileMenuSkeleton() {
  return (
    <Button variant="ghost" className="gap-2">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-4 w-20 hidden md:inline-block" />
      <ChevronDown className="h-3 w-3 text-gray-400" />
    </Button>
  );
}
