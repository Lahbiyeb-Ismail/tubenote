"use client";

import { SaveIcon } from "lucide-react";
import { Button } from "../ui";

interface SaveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SaveButton({ className, onClick, ...props }: SaveButtonProps) {
  return (
    <Button
      size="icon"
      className={` bg-slate-900 hover:bg-slate-100 hover:text-slate-900 border-2 border-slate-100 hover:border-slate-900 hover:shadow-lg ${className}`}
      onClick={onClick}
      {...props}
    >
      <SaveIcon />
    </Button>
  );
}
