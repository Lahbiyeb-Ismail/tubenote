import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui";

interface IProps {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

export function PrimaryButton({ label, onClick, disabled, icon: Icon }: IProps) {
  return (
    <Button className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white" onClick={onClick} disabled={disabled}>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </Button>
  );
}
