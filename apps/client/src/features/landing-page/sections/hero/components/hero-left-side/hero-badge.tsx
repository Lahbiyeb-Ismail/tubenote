import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui";

export function HeroBadge() {
  return (
    <Badge className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-full">
      <Sparkles className="mr-1 h-3.5 w-3.5" />
      Smart Video Note-Taking
    </Badge>
  );
}
