import React, { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

type MaxWidthWrapperProps = {
  children: PropsWithChildren<ReactNode>;
  className?: string;
};

function MaxWidthWrapper({ children, className }: MaxWidthWrapperProps) {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-32",
        className
      )}
    >
      {children}
    </div>
  );
}

export default MaxWidthWrapper;
