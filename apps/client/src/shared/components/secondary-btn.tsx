import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib";

interface IProps {
  label: string;
  onClick: () => void;
  className?: string;
  icon?: LucideIcon;
}

export function SecondaryButton({ label, onClick, className, icon: Icon }: IProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn("flex items-center gap-1", className)}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>
        {label}
      </span>
    </Button>
  );
}
