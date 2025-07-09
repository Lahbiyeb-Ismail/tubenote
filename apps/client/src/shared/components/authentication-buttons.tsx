import Link from "next/link";
import { Fragment } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface IProps {
  className?: string;
  onClick?: () => void;
}

export function AuthenticationButtons({ className, onClick }: IProps) {
  return (
    <Fragment>
      <Button variant="ghost" className={cn("text-gray-600 hover:text-gray-900", className)} asChild>
        <Link href="/login" onClick={onClick}>
          Sign In
        </Link>
      </Button>
      <Button className={cn("bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300", className)} asChild>
        <Link href="/register" onClick={onClick}>
          Get Started
        </Link>
      </Button>
    </Fragment>
  );
}
