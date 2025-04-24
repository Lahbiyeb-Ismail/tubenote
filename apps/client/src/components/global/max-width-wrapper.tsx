import { type PropsWithChildren, type ReactNode } from "react";

import { cn } from "@/lib";

type MaxWidthWrapperProps = {
  children: PropsWithChildren<ReactNode>;
  className?: string;
};

export function MaxWidthWrapper({ children, className }: MaxWidthWrapperProps) {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-6 md:px-20 lg:px-32",
        className
      )}
    >
      {children}
    </div>
  );
}
