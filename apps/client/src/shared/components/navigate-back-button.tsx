import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";

interface IProps {
  href?: string;
  btnText?: string;
}

export function NavigateBackButton({ href = "/", btnText = "Back to Home" }: IProps) {
  return (
    <div className="animate-fade-in">
      <Link href={href}>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{btnText}</span>
        </Button>
      </Link>
    </div>
  );
}
