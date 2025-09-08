import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui";

interface IProps {
  variant: "default" | "ghost";
  onClick: () => void;
  btnClassName: string;
  btnIcon: LucideIcon;
}

export function LayoutButton({ variant, onClick, btnClassName, btnIcon: Icon }: IProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={btnClassName}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
